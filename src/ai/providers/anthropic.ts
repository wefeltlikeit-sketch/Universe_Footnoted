import type Anthropic from '@anthropic-ai/sdk';
import type { Settings } from '../../model/types';
import { parseJson, ProviderError, type CompletionRequest, type CompletionResult, type Provider, type Tier } from './types';

/**
 * Claude via the official SDK, called directly from the browser with the user's own key.
 * The key never leaves the user's machine except to api.anthropic.com.
 *
 * Structured outputs (`output_config.format`) guarantee schema-shaped JSON. The deep tier uses a
 * moderate effort level; the fast tier (Haiku by default) takes no effort setting.
 * The SDK is loaded on first use, so visitors without a key never download it.
 */
let sdk: Promise<typeof import('@anthropic-ai/sdk')> | null = null;

export function anthropicProvider(s: Settings): Provider {
  let client: Anthropic | null = null;
  const model = (tier: Tier) => (tier === 'deep' ? s.deepModel : s.fastModel);

  return {
    id: 'anthropic',
    label: 'Claude',
    model,
    async complete<T>(req: CompletionRequest): Promise<CompletionResult<T>> {
      const { default: SDK } = await (sdk ??= import('@anthropic-ai/sdk'));
      client ??= new SDK({ apiKey: s.apiKey, dangerouslyAllowBrowser: true, maxRetries: 2 });
      const c = client;
      const m = model(req.tier);
      const supportsEffort = !m.startsWith('claude-haiku');
      const body = {
        model: m,
        max_tokens: req.maxTokens ?? 16000,
        system: req.system,
        messages: [{ role: 'user' as const, content: req.prompt }],
        output_config: {
          format: { type: 'json_schema', schema: req.schema },
          ...(supportsEffort ? { effort: req.tier === 'deep' ? 'medium' : 'low' } : {}),
        },
      };
      // Opus 5 / Fable: opt into server-side refusal fallbacks, retrying plainly if the option is rejected.
      const fallbackCapable = /^claude-(opus-5|fable)/.test(m);
      const send = (withFallback: boolean) =>
        withFallback
          ? c.beta.messages.create({
              ...body, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
            } as unknown as Anthropic.Beta.MessageCreateParamsNonStreaming) as unknown as Promise<Anthropic.Message>
          : c.messages.create(body as unknown as Anthropic.MessageCreateParamsNonStreaming);
      try {
        // Casts: output_config / fallbacks may be newer than the installed SDK's type definitions.
        let res: Anthropic.Message;
        try {
          res = await send(fallbackCapable);
        } catch (e) {
          if (!(fallbackCapable && e instanceof SDK.BadRequestError)) throw e;
          res = await send(false);
        }
        if (res.stop_reason === 'refusal') throw new ProviderError('The model declined this request.');
        if (res.stop_reason === 'max_tokens') throw new ProviderError('The response was cut off (max_tokens).', true);
        const text = res.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('');
        return { data: parseJson<T>(text), model: res.model };
      } catch (e) {
        if (e instanceof ProviderError) throw e;
        if (e instanceof SDK.AuthenticationError) throw new ProviderError('Anthropic rejected the API key.');
        if (e instanceof SDK.RateLimitError) throw new ProviderError('Rate limited by Anthropic. Try again shortly.', true);
        if (e instanceof SDK.APIConnectionError) throw new ProviderError('Could not reach api.anthropic.com.', true);
        if (e instanceof SDK.APIError) throw new ProviderError(`Anthropic API error: ${e.message}`, (e.status ?? 0) >= 500);
        throw e;
      }
    },
  };
}
