import type { Settings } from '../../model/types';
import { parseJson, ProviderError, type CompletionRequest, type CompletionResult, type Provider, type Tier } from './types';

/**
 * Any server speaking the OpenAI-style /chat/completions protocol: local runtimes such as Ollama,
 * LM Studio or llama.cpp, or hosted gateways. JSON mode plus the schema in the prompt keeps it
 * compatible with servers that do not implement strict schema enforcement.
 */
export function openAICompatibleProvider(s: Settings): Provider {
  const base = (s.baseUrl || 'http://localhost:11434/v1').replace(/\/+$/, '');
  const model = (tier: Tier) => (tier === 'deep' ? s.deepModel : s.fastModel);

  return {
    id: 'openai-compatible',
    label: 'OpenAI-compatible endpoint',
    model,
    async complete<T>(req: CompletionRequest): Promise<CompletionResult<T>> {
      const m = model(req.tier);
      let res: Response;
      try {
        res = await fetch(`${base}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(s.apiKey ? { Authorization: `Bearer ${s.apiKey}` } : {}),
          },
          body: JSON.stringify({
            model: m,
            max_tokens: req.maxTokens ?? 8000,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: `${req.system}\n\nRespond with a single JSON object matching this JSON Schema:\n${JSON.stringify(req.schema)}` },
              { role: 'user', content: req.prompt },
            ],
          }),
        });
      } catch {
        throw new ProviderError(`Could not reach ${base}.`, true);
      }
      if (!res.ok) throw new ProviderError(`${base} returned ${res.status}.`, res.status >= 500 || res.status === 429);
      const json = await res.json();
      const text: string = json.choices?.[0]?.message?.content ?? '';
      return { data: parseJson<T>(text), model: json.model ?? m };
    },
  };
}
