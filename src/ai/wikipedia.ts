/**
 * Wikipedia as a source-verification service (and a no-AI fallback reader).
 * Both endpoints are public and CORS-enabled. Results are cached in memory for the session.
 */
export interface WikiSummary {
  title: string;
  extract: string;
  url: string;
  description?: string;
}

const summaries = new Map<string, Promise<WikiSummary | null>>();

export function wikiSummary(title: string): Promise<WikiSummary | null> {
  const key = title.trim().replace(/ /g, '_');
  if (!summaries.has(key)) {
    summaries.set(key, (async () => {
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(key)}?redirect=true`);
        if (!res.ok) return null;
        const j = await res.json();
        if (j.type === 'disambiguation' || !j.extract) return null;
        return {
          title: j.titles?.canonical ?? key,
          extract: j.extract as string,
          url: j.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${key}`,
          description: j.description,
        };
      } catch {
        return null;
      }
    })());
  }
  return summaries.get(key)!;
}

/** Best-matching article title for a free-text query. */
export async function wikiSearch(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json&origin=*`,
    );
    if (!res.ok) return null;
    const j = await res.json();
    return j?.[1]?.[0] ?? null;
  } catch {
    return null;
  }
}

/** Check that each title resolves to a real article. Returns the set of verified titles. */
export async function verifyTitles(titles: string[], limit = 6): Promise<Map<string, WikiSummary>> {
  const out = new Map<string, WikiSummary>();
  const queue = [...new Set(titles.filter(Boolean))];
  await Promise.all(Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const t = queue.shift()!;
      const s = await wikiSummary(t);
      if (s) out.set(t, s);
    }
  }));
  return out;
}
