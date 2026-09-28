import type { Settings } from '../../model/types';
import { anthropicProvider } from './anthropic';
import { openAICompatibleProvider } from './openaiCompatible';
import type { Provider } from './types';

/** Provider registry. To add a provider, implement `Provider` and add a case here and in Settings. */
export function createProvider(s: Settings): Provider | null {
  switch (s.provider) {
    case 'anthropic':
      return s.apiKey ? anthropicProvider(s) : null;
    case 'openai-compatible':
      return openAICompatibleProvider(s);
    default:
      return null;
  }
}

export const PROVIDER_PRESETS: Record<Settings['provider'], Partial<Settings>> = {
  none: {},
  anthropic: { fastModel: 'claude-haiku-4-5', deepModel: 'claude-opus-5', baseUrl: '' },
  'openai-compatible': { fastModel: 'llama3.1', deepModel: 'llama3.1', baseUrl: 'http://localhost:11434/v1' },
};
