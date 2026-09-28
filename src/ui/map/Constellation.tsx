import { useEffect, useRef } from 'react';
import {
  forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY,
  type Simulation, type SimulationLinkDatum, type SimulationNodeDatum,
} from 'd3-force';
import type { KnowledgeGraph } from '../../graph/KnowledgeGraph';
import { DASH, FAMILY_OF, readPalette, withAlpha, type Palette } from './visual';

/**
 * THE MAP — a star chart of knowledge.
 *
 * Travelled concepts are stars, unexplored exits are faint points, and the size of each body is its
 * intellectual gravity. Layout is a persistent force simulation (positions survive re-renders, so the
 * constellation grows rather than reshuffles); drawing is plain Canvas 2D for speed.
 */
export type NodeRole = 'current' | 'visited' | 'origin' | 'exit' | 'path' | 'ghost';
export type LinkRole = 'travelled' | 'exit' | 'path' | 'ghost';

export interface MapNode {
  id: string;
  role: NodeRole;
  weight?: number; // e.g. visit count in the Atlas
  order?: number; // discovery order, for replay
  cluster?: number;
}

export interface MapLink {
  a: string;
  b: string;
  edgeId: string;
  role: LinkRole;
}

interface Props {
  graph: KnowledgeGraph;
  nodes: MapNode[];
  links: MapLink[];
  focus?: string | null;
  /** 'focus' follows the focused node; 'all' frames everything. */
  fit?: 'focus' | 'all';
  /** Horizontal offset (fraction of width) for the focus, leaving room for the page. */
  offset?: number;
  onSelect?: (id: string) => void;
  replay?: number | null;
  clusterLabels?: { cluster: number; label: string }[];
  labels?: 'auto' | 'none';
  interactive?: boolean;
  /** Rabbit-hole depth, 0–1: the origin recedes as you sink. */
  sink?: number;
  originId?: string | null;
}

interface N extends SimulationNodeDatum {
  id: string;
  r: number;
  data: MapNode;
  alpha: number; // for fade-in
}
type L = SimulationLinkDatum<N> & { data: MapLink };

export default function Constellation(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const engine = useRef<Engine | null>(null);

  useEffect(() => {
    const e = new Engine(canvasRef.current!, () => propsRef.current);
    engine.current = e;
    return () => e.destroy();
  }, []);

  useEffect(() => {
    engine.current?.update();
  }, [props.nodes, props.links, props.focus, props.fit, props.replay, props.offset, props.sink, props.graph.version]);

  return <canvas ref={canvasRef} className="sky" aria-label="Map of your journey through concepts" />;
}

class Engine {
  private ctx: CanvasRenderingContext2D;
  private sim: Simulation<N, L>;
  private nodes = new Map<string, N>();
  private links: L[] = [];
  private cam = { x: 0, y: 0, k: 1 };
  private target = { x: 0, y: 0, k: 1 };
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf = 0;
  private running = false;
  private userMoved = false;
  private lastFocus: string | null | undefined;
  private hover: string | null = null;
  private palette: Palette;
  private paletteAt = 0;
  private stars: [number, number, number][] = [];
  private ro: ResizeObserver;
  private themeWatch: MutationObserver;
  private pointers = new Map<number, { x: number; y: number }>();
  private dragStart: { x: number; y: number; moved: boolean } | null = null;
  private pinch: { d: number; k: number } | null = null;
  private t0 = performance.now();

  constructor(private canvas: HTMLCanvasElement, private props: () => Props) {
    this.ctx = canvas.getContext('2d')!;
    this.palette = readPalette();
    this.sim = forceSimulation<N, L>([])
      .force('charge', forceManyBody<N>().strength((n) => -140 - 260 * this.gravity(n.id)).distanceMax(900))
      .force('link', forceLink<N, L>([]).id((n) => n.id)
        .distance((l) => (l.data.role === 'exit' ? 62 : l.data.role === 'ghost' ? 50 : 92))
        .strength((l) => (l.data.role === 'exit' ? 0.35 : l.data.role === 'ghost' ? 0.12 : 0.75)))
      .force('collide', forceCollide<N>((n) => n.r + 12))
      .force('x', forceX<N>(0).strength(0.018))
      .force('y', forceY<N>(0).strength(0.018))
      .alphaDecay(0.028)
      .on('tick', () => this.wake());
    this.sim.stop();

    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    this.stars = Array.from({ length: 260 }, () => [rand(), rand(), rand()]);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    // Redraw with the new palette when the theme flips, even if the sky is otherwise at rest.
    this.themeWatch = new MutationObserver(() => {
      this.paletteAt = 0;
      this.wake();
    });
    this.themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.resize();
    this.bind();
    this.update();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.sim.stop();
    this.ro.disconnect();
    this.themeWatch.disconnect();
  }

  private gravity(id: string) {
    return this.props().graph.gravity(id);
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.wake();
  }

  /** Sync simulation with props, preserving positions of nodes we already know. */
  update() {
    const p = this.props();
    const next = new Map<string, N>();
    const g = p.graph;
    for (const d of p.nodes) {
      const prev = this.nodes.get(d.id);
      const grav = g.gravity(d.id);
      const r = (d.role === 'exit' || d.role === 'ghost' ? 1.6 : 2.6) + 9 * grav ** 1.25 + (d.weight ? Math.sqrt(d.weight) * 1.6 : 0);
      if (prev) {
        prev.data = d;
        prev.r = r;
        next.set(d.id, prev);
      } else {
        next.set(d.id, { id: d.id, r, data: d, alpha: 0 });
      }
    }
    // Place newcomers beside an already-placed neighbour, so the map grows outward.
    for (const n of next.values()) {
      if (n.x !== undefined) continue;
      const link = p.links.find((l) => (l.a === n.id && next.get(l.b)?.x !== undefined) || (l.b === n.id && next.get(l.a)?.x !== undefined));
      const anchor = link ? next.get(link.a === n.id ? link.b : link.a) : undefined;
      const ang = hashAngle(n.id);
      const dist = anchor ? 70 : 20 + next.size * 3;
      n.x = (anchor?.x ?? 0) + Math.cos(ang) * dist;
      n.y = (anchor?.y ?? 0) + Math.sin(ang) * dist;
    }
    this.nodes = next;
    this.links = p.links
      .filter((l) => next.has(l.a) && next.has(l.b))
      .map((l) => ({ source: l.a, target: l.b, data: l }));
    this.sim.nodes([...next.values()]);
    (this.sim.force('link') as ReturnType<typeof forceLink<N, L>>).links(this.links);
    this.sim.alpha(Math.max(this.sim.alpha(), 0.45)).restart();

    if (p.focus !== this.lastFocus) {
      this.userMoved = false;
      this.lastFocus = p.focus;
    }
    if (p.fit === 'all') this.userMoved = false;
    this.wake();
  }

  private wake = () => {
    if (this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.frame);
  };

  private frame = () => {
    const now = performance.now();
    if (now - this.paletteAt > 400) {
      this.palette = readPalette();
      this.paletteAt = now;
    }
    this.aim();
    const ease = 0.085;
    this.cam.x += (this.target.x - this.cam.x) * ease;
    this.cam.y += (this.target.y - this.cam.y) * ease;
    this.cam.k += (this.target.k - this.cam.k) * ease;
    let fading = false;
    for (const n of this.nodes.values()) {
      if (n.alpha < 1) {
        n.alpha = Math.min(1, n.alpha + 0.04);
        fading = true;
      }
    }
    this.draw(now);
    const settled = Math.abs(this.target.x - this.cam.x) < 0.3 && Math.abs(this.target.y - this.cam.y) < 0.3
      && Math.abs(this.target.k - this.cam.k) < 0.002;
    const animatingReplay = this.props().replay != null;
    if (!settled || fading || this.sim.alpha() > this.sim.alphaMin() || animatingReplay) {
      this.raf = requestAnimationFrame(this.frame);
    } else {
      this.running = false;
    }
  };

  /** Decide where the camera wants to be. */
  private aim() {
    if (this.userMoved) return;
    const p = this.props();
    const vis = this.visibleNodes();
    if (p.replay != null) {
      const order = Math.max(0, Math.floor(p.replay - 0.001));
      const n = vis.find((x) => x.data.order === order) ?? vis[vis.length - 1];
      if (n) this.target = { x: n.x!, y: n.y!, k: Math.max(0.55, Math.min(1.3, this.fitScale(vis) * 1.6)) };
      return;
    }
    const focus = p.focus ? this.nodes.get(p.focus) : undefined;
    if (p.fit !== 'all' && focus) {
      const k = this.w < 760 ? 0.9 : 1.1;
      const shift = (p.offset ?? 0) * this.w / k;
      this.target = { x: focus.x! - shift, y: focus.y!, k };
    } else if (vis.length) {
      const [cx, cy] = centroid(vis);
      const k = this.fitScale(vis);
      const shift = (p.offset ?? 0) * this.w / k;
      this.target = { x: cx - shift, y: cy, k };
    }
  }

  private fitScale(ns: N[]): number {
    if (!ns.length) return 1;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of ns) {
      minX = Math.min(minX, n.x!); maxX = Math.max(maxX, n.x!);
      minY = Math.min(minY, n.y!); maxY = Math.max(maxY, n.y!);
    }
    const off = Math.abs(this.props().offset ?? 0) * 2;
    const availW = this.w * (1 - off) - 120;
    const availH = this.h - 160;
    return Math.max(0.15, Math.min(1.4, availW / Math.max(1, maxX - minX), availH / Math.max(1, maxY - minY)));
  }

  private visibleNodes(): N[] {
    const r = this.props().replay;
    const all = [...this.nodes.values()];
    return r == null ? all : all.filter((n) => n.data.order !== undefined && n.data.order < r);
  }

  private toScreen(x: number, y: number): [number, number] {
    return [(x - this.cam.x) * this.cam.k + this.w / 2, (y - this.cam.y) * this.cam.k + this.h / 2];
  }

  private draw(now: number) {
    const { ctx, cam, palette: P } = this;
    const p = this.props();
    const g = p.graph;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    // Background: fixed stars with slight parallax, then a star-chart graticule around the origin.
    const t = (now - this.t0) / 1000;
    for (const [sx, sy, sz] of this.stars) {
      const x = ((sx * this.w * 1.4 - cam.x * 0.06 * (0.5 + sz)) % (this.w * 1.4) + this.w * 1.4) % (this.w * 1.4) - this.w * 0.2;
      const y = ((sy * this.h * 1.4 - cam.y * 0.06 * (0.5 + sz)) % (this.h * 1.4) + this.h * 1.4) % (this.h * 1.4) - this.h * 0.2;
      const tw = 0.5 + 0.5 * Math.sin(t * (0.3 + sz) + sx * 40);
      ctx.fillStyle = withAlpha(P.star, 0.05 + 0.13 * sz * tw);
      ctx.fillRect(x, y, sz > 0.85 ? 1.6 : 1, sz > 0.85 ? 1.6 : 1);
    }

    const originNode = p.originId ? this.nodes.get(p.originId) : undefined;
    const [ox, oy] = originNode ? this.toScreen(originNode.x!, originNode.y!) : this.toScreen(0, 0);
    ctx.lineWidth = 1;
    ctx.strokeStyle = withAlpha(P.text, 0.045);
    for (let rr = 160; rr < 3200; rr += 160) {
      ctx.beginPath();
      ctx.arc(ox, oy, rr * cam.k, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = withAlpha(P.text, 0.03);
    for (let a = 0; a < 12; a++) {
      const ang = (a / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(ox + Math.cos(ang) * 60 * cam.k, oy + Math.sin(ang) * 60 * cam.k);
      ctx.lineTo(ox + Math.cos(ang) * 3200 * cam.k, oy + Math.sin(ang) * 3200 * cam.k);
      ctx.stroke();
    }

    const visible = new Set(this.visibleNodes().map((n) => n.id));
    const sink = p.sink ?? 0;

    // Links
    for (const l of this.links) {
      const a = l.source as N, b = l.target as N;
      if (!visible.has(a.id) || !visible.has(b.id)) continue;
      const e = g.edges.get(l.data.edgeId);
      const fam = e ? FAMILY_OF[e.type] : 'analogy';
      const base = { travelled: 0.7, path: 0.95, exit: 0.2, ghost: 0.09 }[l.data.role];
      const hovered = this.hover && (a.id === this.hover || b.id === this.hover);
      const [x1, y1] = this.toScreen(a.x!, a.y!);
      const [x2, y2] = this.toScreen(b.x!, b.y!);
      ctx.strokeStyle = withAlpha(P[fam], Math.min(1, (hovered ? base + 0.35 : base) * Math.min(a.alpha, b.alpha)));
      ctx.lineWidth = l.data.role === 'path' ? 2 : l.data.role === 'travelled' ? 1.3 : 1;
      ctx.setLineDash(e ? DASH[e.status] : [2, 4]);
      ctx.beginPath();
      // A gentle curve reads more like a chart than a wiring diagram.
      const mx = (x1 + x2) / 2 + (y2 - y1) * 0.08, my = (y1 + y2) / 2 - (x2 - x1) * 0.08;
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(mx, my, x2, y2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Nodes
    const drawn: N[] = [];
    for (const n of this.nodes.values()) {
      if (!visible.has(n.id)) continue;
      const [x, y] = this.toScreen(n.x!, n.y!);
      if (x < -60 || y < -60 || x > this.w + 60 || y > this.h + 60) continue;
      const r = Math.max(1.2, n.r * Math.sqrt(cam.k));
      const role = n.data.role;
      const grav = g.gravity(n.id);
      let a = n.alpha;
      if (role === 'origin' && sink > 0) a *= 1 - sink * 0.7;

      if (grav > 0.55 && role !== 'ghost') {
        ctx.strokeStyle = withAlpha(P.gold, 0.18 * a);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, r * 2.1 + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (role === 'exit' || role === 'ghost') {
        ctx.strokeStyle = withAlpha(P.star, (role === 'ghost' ? 0.25 : 0.55) * a);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        if (this.hover === n.id) {
          ctx.fillStyle = withAlpha(P.star, 0.3);
          ctx.fill();
        }
      } else {
        const color = role === 'current' ? P.rubric : role === 'origin' ? P.gold : P.star;
        if (role === 'current') {
          ctx.shadowColor = P.rubric;
          ctx.shadowBlur = 18;
        }
        ctx.fillStyle = withAlpha(color, (role === 'path' ? 0.95 : 0.9) * a);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (role === 'current') {
          ctx.strokeStyle = withAlpha(P.rubric, 0.5);
          ctx.beginPath();
          ctx.arc(x, y, r + 5 + Math.sin(t * 2) * 1.2, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (role === 'origin') {
          ctx.strokeStyle = withAlpha(P.gold, 0.6 * a);
          ctx.beginPath();
          ctx.arc(x, y, r + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      drawn.push(n);
    }

    // Labels, greedily placed by priority so they never pile up.
    if (p.labels === 'none') return;
    const prio = (n: N) => {
      const role = n.data.role;
      if (n.id === this.hover) return 100;
      if (role === 'current') return 90;
      if (p.replay != null && n.data.order === Math.floor(p.replay - 0.001)) return 95;
      if (role === 'origin') return 80;
      if (role === 'path') return 70;
      if (role === 'visited') return 50 + (n.data.weight ?? 0) + g.gravity(n.id) * 10;
      if (role === 'exit') return cam.k > 0.85 ? 20 + g.gravity(n.id) * 10 : -1;
      return -1;
    };
    const boxes: [number, number, number, number][] = [];
    const sorted = drawn.filter((n) => prio(n) >= 0).sort((a, b) => prio(b) - prio(a));
    for (const n of sorted) {
      const c = g.get(n.id);
      if (!c) continue;
      const [x, y] = this.toScreen(n.x!, n.y!);
      const r = Math.max(1.2, n.r * Math.sqrt(cam.k));
      const role = n.data.role;
      const size = role === 'current' ? 17 : role === 'exit' ? 12.5 : 14;
      ctx.font = `${role === 'exit' ? 'italic ' : ''}${role === 'current' ? 500 : 400} ${size}px Newsreader, Georgia, serif`;
      const text = c.title;
      const tw = ctx.measureText(text).width;
      const lx = x + r + 7, ly = y + size * 0.35;
      const box: [number, number, number, number] = [lx - 2, ly - size, lx + tw + 2, ly + 4];
      if (role !== 'current' && n.id !== this.hover && boxes.some((b) => overlap(b, box))) continue;
      boxes.push(box);
      let alpha = role === 'exit' ? 0.55 : role === 'origin' ? 0.9 : 0.85;
      if (role === 'origin' && sink > 0) alpha *= 1 - sink * 0.6;
      ctx.fillStyle = withAlpha(role === 'current' ? P.text : role === 'exit' ? P.muted : P.text, alpha * n.alpha);
      ctx.fillText(text, lx, ly);
    }

    if (p.clusterLabels) {
      ctx.font = '500 10px "IBM Plex Mono", monospace';
      for (const cl of p.clusterLabels) {
        const members = drawn.filter((n) => n.data.cluster === cl.cluster);
        if (members.length < 3) continue;
        const [cx, cy] = centroid(members);
        const [sx, sy] = this.toScreen(cx, cy);
        const label = cl.label.toUpperCase().split('').join(' ');
        ctx.fillStyle = withAlpha(P.gold, 0.55);
        ctx.fillText(label, sx - ctx.measureText(label).width / 2, sy - 40 * cam.k - 30);
      }
    }
  }

  /* ───────── interaction ───────── */

  private bind() {
    const c = this.canvas;
    const pos = (e: PointerEvent | WheelEvent) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    c.addEventListener('pointerdown', (e) => {
      if (this.props().interactive === false) return;
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, pos(e));
      if (this.pointers.size === 1) this.dragStart = { ...pos(e), moved: false };
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: this.cam.k };
      }
    });
    c.addEventListener('pointermove', (e) => {
      const p = pos(e);
      if (!this.pointers.has(e.pointerId)) {
        const hit = this.hit(p.x, p.y);
        if (hit !== this.hover) {
          this.hover = hit;
          c.style.cursor = hit ? 'pointer' : 'grab';
          this.wake();
        }
        return;
      }
      const prev = this.pointers.get(e.pointerId)!;
      this.pointers.set(e.pointerId, p);
      if (this.pinch && this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        const k = clampK(this.pinch.k * Math.hypot(a.x - b.x, a.y - b.y) / this.pinch.d);
        this.cam.k = this.target.k = k;
        this.userMoved = true;
      } else if (this.dragStart) {
        const dx = p.x - prev.x, dy = p.y - prev.y;
        if (Math.hypot(p.x - this.dragStart.x, p.y - this.dragStart.y) > 4) this.dragStart.moved = true;
        this.cam.x -= dx / this.cam.k;
        this.cam.y -= dy / this.cam.k;
        this.target.x = this.cam.x;
        this.target.y = this.cam.y;
        this.userMoved = true;
        c.style.cursor = 'grabbing';
      }
      this.wake();
    });
    const end = (e: PointerEvent) => {
      const p = pos(e);
      const wasClick = this.dragStart && !this.dragStart.moved && this.pointers.size === 1;
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
      if (!this.pointers.size) {
        this.dragStart = null;
        c.style.cursor = 'grab';
      }
      if (wasClick) {
        const hit = this.hit(p.x, p.y);
        if (hit) this.props().onSelect?.(hit);
      }
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('pointerleave', () => {
      if (this.hover) {
        this.hover = null;
        this.wake();
      }
    });
    c.addEventListener('wheel', (e) => {
      if (this.props().interactive === false) return;
      e.preventDefault();
      const p = pos(e);
      const k = clampK(this.cam.k * Math.exp(-e.deltaY * 0.0015));
      const wx = (p.x - this.w / 2) / this.cam.k + this.cam.x;
      const wy = (p.y - this.h / 2) / this.cam.k + this.cam.y;
      this.cam.k = k;
      this.cam.x = wx - (p.x - this.w / 2) / k;
      this.cam.y = wy - (p.y - this.h / 2) / k;
      this.target = { ...this.cam };
      this.userMoved = true;
      this.wake();
    }, { passive: false });
  }

  private hit(px: number, py: number): string | null {
    let best: string | null = null;
    let bestD = Infinity;
    const visible = new Set(this.visibleNodes().map((n) => n.id));
    for (const n of this.nodes.values()) {
      if (!visible.has(n.id)) continue;
      const [x, y] = this.toScreen(n.x!, n.y!);
      const r = Math.max(1.2, n.r * Math.sqrt(this.cam.k)) + 8;
      const d = Math.hypot(px - x, py - y);
      if (d < r && d < bestD) {
        best = n.id;
        bestD = d;
      }
    }
    return best;
  }
}

function centroid(ns: N[]): [number, number] {
  let x = 0, y = 0;
  for (const n of ns) {
    x += n.x!;
    y += n.y!;
  }
  return [x / ns.length, y / ns.length];
}

function overlap(a: number[], b: number[]) {
  return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
}

function hashAngle(s: string) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return ((h >>> 0) % 628) / 100;
}

const clampK = (k: number) => Math.max(0.12, Math.min(3, k));
