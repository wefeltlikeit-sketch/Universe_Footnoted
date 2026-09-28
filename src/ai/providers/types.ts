/**
 * Provider interface. The orchestrator asks for structured JSON at one of two tiers:
 *   fast — routine extraction, validation and refereeing (cheap, quick)
 *   deep — explanations and bridge-building between distant ideas (stronger reasoning)
 * Adding a provider means implementing `complete` and registering it in ./index.ts.
 */
export type Tier = 'fast' | 'deep';

export interface CompletionRequest {
  tier: Tier;
  system: string;
  prompt: string;
  /** JSON Schema for the response object. */
  schema: Record<string, unknown>;
  maxTokens?: number;
}

export interface CompletionResult<T> {
  data: T;
  model: string;
}

export interface Provider {
  id: string;
  label: string;
  model(tier: Tier): string;
  complete<T>(req: CompletionRequest): Promise<CompletionResult<T>>;
}

export class ProviderError extends Error {
  constructor(message: string, readonly retryable = false) {
    super(message);
  }
}

/** Parse the first JSON object in a model's text output, tolerating code fences. */
export function parseJson<T>(text: string): T {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1)) as T;
    throw new ProviderError('The model did not return valid JSON.');
  }
}
