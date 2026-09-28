# The Universe Has Footnotes

*Everything you know leads somewhere else.*

An engine for intellectual wandering. Start with something ordinary (cheese, a clock, a passport) and
follow its footnotes. Each one is a curated, explained, sourced connection into the rest of human
knowledge. Twenty minutes later you are reading about Bell's theorem. Zoom out, and the map shows the
strange path your curiosity took.

It is not a search engine, a chatbot, or an encyclopedia. Every transition must be defensible:
the app always shows why A is connected to B, how sure it is, and who says so.

## What it does

| | |
|---|---|
| **Wander** | Each concept is a page of a book. Footnote markers sit in the text and sidenotes in the margin explain each connection. Clicking one moves you there while the map behind the page follows. |
| **The map** | Every journey draws a constellation. Stars are concepts you visited, faint points are unexplored exits, and each body's size is its *intellectual gravity*. Line colour shows the kind of relationship; line style shows its epistemic status. Zoom out to see the whole evening. |
| **How did I get here?** | Reconstructs the route from your starting point. Each arrow expands into its reason. |
| **Take me somewhere unexpected** | Controlled serendipity. It picks a concept several defensible steps away, in a different field and outside your neighbourhood, never at random. |
| **Familiar ↔ Strange** | A dial that shifts emphasis between close exits and distant but defensible ones. It affects the page, Surprise Me, and what the AI proposes. |
| **Rabbit hole mode** | The sky darkens and your origin recedes as you go deeper. *Depth 17. You began with Camembert.* |
| **Find a path** | Enter two things (Époisses and Paul Dirac, say). You get the shortest, historical, scientific, cultural and *strangest defensible* routes, with the reasoning behind every step. |
| **Six degrees** | A game: connect two unrelated concepts. The graph referees what it knows, and an AI referees the rest. Scores for validity, elegance and originality come with an honest disclaimer. |
| **Journeys** | Saved automatically. Name, reopen, continue, replay as an animation, or export as JSON (with full provenance), Markdown or an SVG constellation. You can also import them. |
| **Atlas** | All your journeys combined. Concepts you return to grow brighter, and regions emerge from the graph without predefined categories. **Uncharted territory** shows the borders you have not crossed. |
| **Marginalia** | Rare, quiet acknowledgements for unlikely arrivals. |

## Running it

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm test           # seed integrity, graph algorithms, AI pipeline (with a fake provider)
npm run build      # static site in dist/ — deploy anywhere (Netlify, GitHub Pages, a folder)
```

The app is fully static. There is no server: knowledge and journeys live in the browser's IndexedDB.
If IndexedDB is unavailable (some private windows) it falls back to memory and says nothing.

## AI configuration

Out of the box the app runs on its **curated seed atlas**: 111 concepts and 417 hand-written, sourced
connections, so everything works offline. When you type something the seed doesn't know, it is looked up
on Wikipedia. Links found that way are marked *unrefereed* and kept out of pathfinding.

To let the universe grow, open **Settings** (⚙) and choose a provider:

- **Claude (Anthropic).** Paste an API key. It is stored only in this browser and sent only to
  `api.anthropic.com`. Defaults: `claude-opus-5` writes pages and builds bridges; `claude-haiku-4-5`
  referees every connection. Both are editable.
- **OpenAI-compatible / local.** Any `/chat/completions` endpoint: Ollama (`http://localhost:11434/v1`),
  LM Studio, llama.cpp or a hosted gateway.

The Anthropic SDK is loaded only when the first AI call is made. Browser-side keys suit a personal tool;
for a public deployment, put a small proxy in front of the provider instead of shipping keys to visitors.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): layers, graph model, AI orchestration, caching,
  provenance, and how to add an exploration mode.

## Project layout

```
src/
  model/        types: Concept, Edge, Source, Journey, Session, Settings
  seed/         the curated atlas (life.ts, matter.ts, mind.ts) + sources + integrity tests
  graph/        KnowledgeGraph, pathfinding, serendipity, atlas & uncharted territory, game scoring
  narrative/    journeys (trees, not lists), marginalia, export/import
  ai/           orchestrator (pipelines), prompts, providers, Wikipedia verification
  store/        IndexedDB wrapper + repository (stable knowledge vs. narrative)
  ui/           React views, the canvas constellation, styles
```
