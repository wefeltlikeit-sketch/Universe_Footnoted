# Architecture

Four layers, kept apart on purpose:

```
 ui/         presentation: React views, canvas constellation          (knows about everything below)
 narrative/  journeys, marginalia, export                             (session-specific story)
 ai/         orchestration: prompts, providers, verification          (proposes knowledge)
 graph/      KnowledgeGraph + pure algorithms                         (stable knowledge, no I/O)
 store/      IndexedDB persistence + repository                       (saves both kinds)
 model/      shared types
```

`graph/` has no imports from storage, AI or UI, and is unit-tested in isolation. The AI layer never
writes paths or pages straight to the screen. It proposes concepts and edges, a second model referees
them, and the result goes into the graph. Everything the user sees is then derived from the graph.

## Graph model

| Type | What it is | Lives in |
|---|---|---|
| **Concept** | `id`, `title`, `kicker`, `body` (with footnote markup), `domain`, intrinsic `gravity` 1–5, `aliases`, `wiki` reference, `stub?`, `origin` | stable |
| **Edge** | undirected `a~b`; `type` (16 kinds: biological, historical, causal, linguistic, mathematical, analogical, controversial…), `strength` (direct / strong / subtle), `status` (factual / interpretive / analogical / speculative), `confidence` 0–1, `why`, `sources[]`, `origin` | stable |
| **Source** | title, publisher, URL, `verifiedAt?` | stable |
| **Journey** | a *tree* of steps `{conceptId, parent, edgeId, via, at}` plus a `cursor` | narrative |
| **Session** | when you were here and which journeys you touched | narrative |
| **Atlas** | derived, never stored: visit counts, travelled edges, emergent clusters | derived |

**Footnote markup.** Bodies use `[visible words](target-id)`. The seed tests enforce the Prime
Directive mechanically: every footnote target exists, every footnote has an explained edge, no edge is
defined twice, every concept has at least three exits, and the whole seed graph is connected.

**Stubs.** A concept can be known before it is written, for example when a generated page links to
something new. Arriving at a stub writes it (with AI) or looks it up (without).

**Gravity.** `0.65 × intrinsic + 0.35 × min(1, degree / 16)`. Curated hubs (energy, information,
time, symmetry, language, money, power…) start heavy, and gravity grows as exploration reveals links.
The map draws gravity as body size and, above a threshold, a faint gold orbit.

**Leap.** `leap(a, b)` measures how far a step travels across fields: 0 for the same domain, 0.45 for
the same family, 1 for different worlds. Domains are internal and never shown as categories. The Atlas
clusters by label propagation over what you actually visited.

## Algorithms

- **Pathfinding** (`graph/paths.ts`). Dijkstra with a cost function per mode. *Shortest* counts
  steps. *Historical / scientific / cultural* discount the edge types of that character. *Strangest
  defensible* rewards leaps between fields and penalises high-gravity hubs, which make every path look
  alike. All modes refuse speculative edges and edges below 0.55 confidence. When modes land on the same
  route it is shown once, labelled with each mode.
- **Serendipity** (`graph/serendipity.ts`). Candidates sit 2–6 hops away (the dial sets the band),
  outside the current neighbourhood and your atlas, and preferably in another field. They are scored,
  and one is drawn from the top few by weight. The path to it must have no speculative edge and a
  weakest link of at least 0.6.
- **Atlas and uncharted territory** (`graph/atlas.ts`). Label propagation weighted by travelled edges.
  Frontier concepts are unvisited neighbours of the atlas, scored by how strongly they border it and by
  their gravity, and spread across regions.
- **Game** (`graph/game.ts`). Validity is the mean confidence of accepted steps. Elegance is the
  atlas's shortest route length divided by yours. Originality is the share of your stepping stones off
  that route, plus how far each step leaps. All three are shown with words and a disclaimer.

## AI orchestration

Separate intellectual functions, each with one prompt and one JSON schema (`ai/prompts.ts`):

```
explore   TOPIC ─▶ cache? ─▶ EXPLAIN + CURATE (deep) ─▶ VALIDATE (fast) ─▶ SOURCES (Wikipedia) ─▶ GRAPH
bridge    A + B ─▶ CANDIDATE CHAINS (deep) ─▶ VALIDATE every step (fast) ─▶ SOURCES ─▶ GRAPH ─▶ local pathfinding
referee   A → B (+ player's reason) ─▶ JUDGE (fast) ─▶ GRAPH if it holds
```

- **Explain + curate** writes a 110–170-word page and 4–7 exits in one call. It favours exits that
  reveal hidden history, cross disciplines or expose causal chains, avoids low-value links, and reuses
  known concept titles so the graph stays connected. The strangeness dial is passed through.
- **Validate** is a strict referee on a cheaper model. It can reject an exit (the words stay, the
  footnote goes), downgrade an overstated status, and recalibrate confidence.
- **Sources.** Every cited Wikipedia title is checked against the live REST API. Verified sources are
  timestamped; unverified connections lose 0.15 confidence.
- **Bridge** is the architectural improvement over asking a model for a path. The model only proposes
  candidate edges. The deterministic graph search then finds, ranks and explains paths, so every path
  shown is made of individually refereed, inspectable edges.

Providers implement one method, `complete({tier, system, prompt, schema})` (see `ai/providers/`).
Claude uses the official SDK with structured outputs and moderate effort on the deep tier. For
Opus 5 / Fable models it opts into server-side refusal fallbacks, retrying plainly if the endpoint
rejects that option. The OpenAI-compatible provider uses JSON mode with the schema in the prompt.

## Caching and cost

1. **Stable knowledge is never regenerated.** A written concept is permanent; `explore` returns it
   with zero calls. The seed ships in the bundle, and only knowledge beyond it is persisted.
2. **Response cache.** Every model response is stored in IndexedDB under
   `SHA-256(provider | model | system | prompt)`. Identical questions are free forever.
3. **Tiered models.** The deep model is used once per new page or bridge search. Validation and game
   refereeing, the high-volume calls, go to the fast model.
4. **Local-first reasoning.** Pathfinding, serendipity, clustering, frontier detection and scoring are
   all local graph algorithms with no model calls.
5. **Narrative stays separate.** Journeys reference concepts by id, so ten journeys through Newton
   store one Newton.

*Settings → Forget generated knowledge* clears generated concepts, edges and the response cache. The
seed and your journeys are kept.

## Provenance model

Every edge carries:

- **status**, the epistemic kind: *factual* (documented), *interpretive* (a scholarly reading that
  needs judgement or is disputed), *analogical* (a structural parallel, not a causal link) or
  *speculative* (open or unproven, and excluded from paths)
- **confidence** from 0 to 1, calibrated by the referee and lowered for unverified sources
- **sources**: specific references where they exist (Nature papers, primary texts, scholarly books),
  plus the reference article for each endpoint
- **origin**: *curated* (seed), *AI* (which model proposed it, which model refereed it, when),
  *Wikipedia mention* (unrefereed, 0.5 confidence, never used for paths), *imported* or *user*

The **why?** link on any sidenote opens the provenance card. On the map, colour shows the relationship
family (mechanism, history, culture & place, idea & analogy) and line style shows status (solid,
long-dash, dotted, sparse-dotted). Four hues and four strokes stay readable where sixteen types would
not.

## Adding an exploration mode

1. Add the id to `View` in `src/ui/state.ts`.
2. Put any graph logic in `src/graph/` as pure functions with a test next to it.
3. If it needs a model, add a prompt and schema in `ai/prompts.ts` and a method on `Orchestrator`
   that validates what it proposes before writing to the graph.
4. Write the view in `src/ui/views/`. Draw on `<Constellation>` with node and link roles; helpers in
   `ui/map/data.ts` build common layouts.
5. Register it in `src/ui/modes.ts` and the view switch in `src/ui/App.tsx`.

## Adding knowledge to the seed

Edit `src/seed/life.ts`, `matter.ts` or `mind.ts`:

```ts
C('id', 'Title', 'domain', gravity, 'kicker', `Body with [footnotes](target-id).`, { wiki: 'Article_Title' });
E('id', 'target-id', 'type', 'strength', 'status', confidence, 'Why they are connected.', ['sourceId']);
```

Then run `npm test`. The integrity suite reports any missing edge, dangling target or duplicate.
