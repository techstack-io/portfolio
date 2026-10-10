"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export type TypographicWallLayout = "scatter" | "diagonal" | "list" | "center";
export type TypographicWallDirection = "down" | "up" | "left" | "right" | "diagonal";

export interface TypographicWallWord {
  label: string;
  href?: string;
}

export interface TypographicWallHandle {
  shuffle: () => void;
  replay: () => void;
  focus: (index: number | null) => void;
}

export interface TypographicWallProps {
  words?: string | Array<string | TypographicWallWord>;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  charset?: string;
  colors?: [string, string];
  density?: number;
  wallOpacity?: number;
  shimmer?: number;
  scrambleRate?: number;
  layout?: TypographicWallLayout;
  direction?: TypographicWallDirection;
  scanDuration?: number;
  holdDuration?: number;
  restDuration?: number;
  stagger?: number;
  bandWidth?: number;
  loop?: boolean;
  shuffle?: boolean;
  edgeFade?: number;
  interactive?: boolean;
  clickToShuffle?: boolean;
  onWordClick?: (word: string, index: number) => void;
  paused?: boolean;
  quality?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

interface Settings {
  words: TypographicWallWord[];
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  charset: string;
  colors: [string, string];
  density: number;
  wallOpacity: number;
  shimmer: number;
  scrambleRate: number;
  layout: TypographicWallLayout;
  direction: TypographicWallDirection;
  scanDuration: number;
  holdDuration: number;
  restDuration: number;
  stagger: number;
  bandWidth: number;
  loop: boolean;
  shuffle: boolean;
  edgeFade: number;
  interactive: boolean;
  clickToShuffle: boolean;
  onWordClick?: (word: string, index: number) => void;
  paused: boolean;
  quality: number;
  reduced: boolean;
}

interface Controller {
  sync: () => void;
  destroy: () => void;
  shuffle: () => void;
  replay: () => void;
  focus: (index: number | null) => void;
}

interface Placed {
  label: string;
  href?: string;
  row: number;
  col: number;
  length: number;
}

type Phase = "reveal" | "hold" | "dissolve" | "rest";
type Lab = [number, number, number];

const CHARSETS: Record<string, string> = {
  letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  binary: "01",
  hex: "0123456789ABCDEF",
  symbols: "+-*/=<>[]{}()|:;.,~^#%&@",
};

const FAR = 1000;

const subscribeToMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

const readMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const random = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const normalizeWords = (words: TypographicWallProps["words"]): TypographicWallWord[] => {
  if (!words) return [];
  const list = typeof words === "string" ? words.split(/[|\n]/) : words;
  return list
    .map((word) => (typeof word === "string" ? { label: word.trim() } : { label: word.label.trim(), href: word.href }))
    .filter((word) => word.label.length > 0);
};

let colorContext: CanvasRenderingContext2D | null = null;

const parseColor = (value: string, fallback: Lab): Lab => {
  if (!colorContext) colorContext = document.createElement("canvas").getContext("2d");
  if (!colorContext) return fallback;
  colorContext.fillStyle = "#010203";
  colorContext.fillStyle = value;
  const read = String(colorContext.fillStyle);
  if (read === "#010203" && value.trim().toLowerCase() !== "#010203") return fallback;
  if (read.startsWith("#")) {
    const hex = read.slice(1);
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }
  const parts = read.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return fallback;
  return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
};

const toLinear = (value: number) =>
  value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

const toOklab = ([r, g, b]: Lab): Lab => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const wallVertex = `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const wallFragment = `
precision highp float;
uniform sampler2D uAtlas;
uniform sampler2D uCells;
uniform vec2 uCanvas;
uniform vec2 uOrigin;
uniform vec2 uCell;
uniform vec2 uGrid;
uniform float uAtlasCols;
uniform float uCharsetSize;
uniform float uTime;
uniform float uReveal;
uniform float uDissolve;
uniform float uWallIn;
uniform float uBand;
uniform float uStagger;
uniform float uShimmer;
uniform float uScramble;
uniform float uDensity;
uniform float uWallAlpha;
uniform float uEdge;
uniform vec3 uRankAxis;
uniform vec4 uFocusRect;
uniform float uFocus;
uniform float uFocusWord;
uniform float uUnderline;
uniform float uLine;
uniform vec3 uWordLab;
uniform vec3 uWallLab;
uniform vec3 uBandLab;
uniform float uStill;
out vec4 fragColor;

vec3 labToLinear(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return max(vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  ), 0.0);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

float hash(float n) {
  return fract(sin(n * 12.9898 + 78.233) * 43758.5453);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uCanvas.y - gl_FragCoord.y) - uOrigin;
  vec2 g = p / uCell;
  if (g.x < 0.0 || g.y < 0.0 || g.x >= uGrid.x || g.y >= uGrid.y) discard;
  ivec2 cell = ivec2(floor(g));
  vec2 local = g - vec2(cell);
  vec4 data = texelFetch(uCells, cell, 0);
  float seed = data.r;
  float wordGlyph = data.g;
  float wordId = data.b;
  float len = floor(data.a / 1024.0);
  float idx = data.a - len * 1024.0;
  float isWord = step(0.0, wordGlyph);
  float letter = len > 1.0 ? idx / (len - 1.0) : 0.0;
  vec2 n = (vec2(cell) + 0.5) / uGrid;
  float rank = dot(n, uRankAxis.xy) + uRankAxis.z + (seed - 0.5) * 0.04;
  float dr = uReveal - rank;
  float dd = uDissolve - rank;
  float band = max(exp(-pow(dr / uBand, 2.0)), exp(-pow(dd / uBand, 2.0))) * (1.0 - uStill);
  float wallIn = smoothstep(-uBand * 0.5, uBand * 0.5, uWallIn - rank);
  float wobble = 0.16 * sin(uTime * 0.21 + seed * 51.0) * (1.0 - uStill);
  float present = 1.0 - smoothstep(uDensity - 0.05, uDensity + 0.05, hash(seed * 7.31) + wobble);
  float lockR = uBand * 0.3 + letter * uStagger + seed * 0.012;
  float locked = smoothstep(lockR, lockR + 0.02, dr);
  float lockD = uBand * 0.15 + letter * uStagger * 0.5 + seed * 0.012;
  float released = smoothstep(lockD, lockD + 0.015, dd);
  float shown = isWord * locked * (1.0 - released);
  float decoding = isWord * smoothstep(-uBand * 0.6, 0.0, dr) * (1.0 - locked) * (1.0 - released);
  float fading = isWord * released * exp(-max(dd - lockD, 0.0) / (uBand * 0.7));
  float busy = max(band, max(decoding, fading));
  float slow = floor(uTime * uShimmer + seed * 23.0);
  float fast = floor(uTime * uScramble + seed * 23.0);
  float tick = busy > 0.35 ? fast + 7919.0 : slow;
  float scramble = 1.0 + floor(hash(seed * 91.7 + tick * 1.618) * uCharsetSize);
  float glyph = shown > 0.5 ? wordGlyph : scramble;
  vec2 fc = (uFocusRect.xy + uFocusRect.zw + 1.0) * 0.5;
  vec2 fh = (uFocusRect.zw - uFocusRect.xy + 1.0) * 0.5 + vec2(1.4, 0.8);
  vec2 q = abs(g - fc) - fh + 0.9;
  float sdf = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.9;
  float clear = uFocus * (1.0 - smoothstep(-0.2, 1.4, sdf));
  float isFocus = isWord * (1.0 - step(0.25, abs(wordId - uFocusWord)));
  vec2 edge = min(p, uGrid * uCell - p) / max(uEdge, 1.0);
  float vignette = smoothstep(0.0, 1.0, min(edge.x, edge.y));
  float wallA = present * uWallAlpha * wallIn * vignette * (1.0 - clear * 0.94);
  float bandA = band * 0.42 * vignette * (1.0 - clear);
  float wordA = max(shown, max(decoding, fading) * 0.62) * mix(1.0 - 0.42 * uFocus, 1.0, isFocus);
  float level = max(wallA, max(bandA, wordA));
  float total = wallA + bandA + wordA * 3.0 + 1e-4;
  vec3 lab = (uWallLab * wallA + uBandLab * bandA + uWordLab * wordA * 3.0) / total;
  lab = mix(lab, uWordLab, shown * (1.0 - wallA));
  float atlasRow = floor(glyph / uAtlasCols);
  float atlasCol = glyph - atlasRow * uAtlasCols;
  ivec2 texel = ivec2(vec2(atlasCol, atlasRow) * uCell + floor(local * uCell));
  float coverage = texelFetch(uAtlas, texel, 0).a;
  float along = (idx + local.x) / max(len, 1.0);
  float line = 1.0 - smoothstep(uLine * 0.5, uLine * 0.5 + 1.0, abs(local.y - 0.88) * uCell.y);
  float underline = isFocus * line * step(along, uUnderline) * uFocus * shown;
  float a = clamp(max(coverage * level, underline), 0.0, 1.0);
  if (a < 0.002) discard;
  vec3 color = labToLinear(mix(lab, uWordLab, step(coverage * level, underline)));
  fragColor = vec4(encode(color) * a, a);
}
`;

const createWall = (root: HTMLDivElement, settingsRef: { current: Settings }): Controller | null => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.pointerEvents = "none";
  root.prepend(canvas);
  const layer = document.createElement("div");
  layer.style.position = "absolute";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  canvas.after(layer);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: true, antialias: false });
  } catch {
    canvas.remove();
    layer.remove();
    return null;
  }
  if (!renderer.capabilities.isWebGL2) {
    renderer.dispose();
    canvas.remove();
    layer.remove();
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene = new THREE.Scene();
  const atlasCanvas = document.createElement("canvas");
  const atlasTexture = new THREE.CanvasTexture(atlasCanvas);
  atlasTexture.flipY = false;
  atlasTexture.minFilter = THREE.NearestFilter;
  atlasTexture.magFilter = THREE.NearestFilter;
  atlasTexture.generateMipmaps = false;
  atlasTexture.colorSpace = THREE.NoColorSpace;
  let cellData = new Float32Array(4);
  let cellTexture = new THREE.DataTexture(cellData, 1, 1, THREE.RGBAFormat, THREE.FloatType);

  const uniforms = {
    uAtlas: { value: atlasTexture },
    uCells: { value: cellTexture as THREE.Texture },
    uCanvas: { value: new THREE.Vector2(1, 1) },
    uOrigin: { value: new THREE.Vector2() },
    uCell: { value: new THREE.Vector2(1, 1) },
    uGrid: { value: new THREE.Vector2(1, 1) },
    uAtlasCols: { value: 16 },
    uCharsetSize: { value: 1 },
    uTime: { value: 0 },
    uReveal: { value: FAR },
    uDissolve: { value: -FAR },
    uWallIn: { value: FAR },
    uBand: { value: 0.08 },
    uStagger: { value: 0.05 },
    uShimmer: { value: 0.6 },
    uScramble: { value: 12 },
    uDensity: { value: 0.8 },
    uWallAlpha: { value: 0.14 },
    uEdge: { value: 60 },
    uRankAxis: { value: new THREE.Vector3(0, 1, 0) },
    uFocusRect: { value: new THREE.Vector4(-10, -10, -10, -10) },
    uFocus: { value: 0 },
    uFocusWord: { value: -1 },
    uUnderline: { value: 0 },
    uLine: { value: 2 },
    uWordLab: { value: new THREE.Vector3() },
    uWallLab: { value: new THREE.Vector3() },
    uBandLab: { value: new THREE.Vector3() },
    uStill: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: wallVertex,
    fragmentShader: wallFragment,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    premultipliedAlpha: true,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);

  const grid = { cols: 1, rows: 1, cellW: 8, cellH: 20, originX: 0, originY: 0, ratio: 1 };
  let placed: Placed[] = [];
  let overlays: HTMLElement[] = [];
  const cycle = { phase: "reveal" as Phase, time: 0, speed: 1, intro: true, layoutSeed: 1 };
  const focus = { index: -1, amount: 0, line: 0, rect: [-10, -10, -10, -10] };
  let layoutKey = "";
  let wordsKey = "";
  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let clock = 0;
  let raf = 0;
  let last = 0;
  let visible = true;
  let destroyed = false;
  let sized = false;
  let frames = 0;
  const requested = new Set<string>();

  const fontFor = (size: number) => {
    const settings = settingsRef.current;
    const family = settings.fontFamily || 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';
    return `${clamp(Math.round(settings.fontWeight), 100, 900)} ${size}px ${family}`;
  };

  const charsetFor = () => {
    const value = settingsRef.current.charset;
    const chars = Array.from(CHARSETS[value] ?? value).filter((char) => char.trim().length > 0);
    return chars.length ? chars : Array.from(CHARSETS.letters);
  };

  const span = () => {
    const settings = settingsRef.current;
    const band = clamp(settings.bandWidth, 0.02, 0.4);
    return { band, from: -band * 2.2, to: 1 + band * 2.4 + clamp(settings.stagger, 0, 1) * 0.12 + 0.05 };
  };

  const frontAt = (progress: number) => {
    const { from, to } = span();
    const eased = (1 - Math.cos(Math.PI * clamp(progress, 0, 1))) / 2;
    return from + (to - from) * eased;
  };

  const rankAxis = (): [number, number, number] => {
    switch (settingsRef.current.direction) {
      case "up":
        return [0, -1, 1];
      case "left":
        return [-1, 0, 1];
      case "right":
        return [1, 0, 0];
      case "diagonal":
        return [0.5, 0.5, 0];
      default:
        return [0, 1, 0];
    }
  };

  const placeWords = () => {
    const settings = settingsRef.current;
    const { cols, rows } = grid;
    const rng = random(cycle.layoutSeed * 7919 + 13);
    const marginX = Math.max(2, Math.round(cols * 0.14));
    const marginY = Math.max(1, Math.round(rows * 0.12));
    const usable = Math.max(1, rows - marginY * 2);
    const room = Math.max(1, cols - marginX * 2);
    const list = settings.words.slice(0, 48);
    const count = list.length;
    const result: Placed[] = [];
    const free = (row: number, col: number, length: number) =>
      result.every((other) => other.row !== row || col + length + 2 <= other.col || col >= other.col + other.length + 2);
    list.forEach((word, index) => {
      const label = word.label.length > room ? word.label.slice(0, room) : word.label;
      const length = Math.max(1, Array.from(label).length);
      const gap = clamp(Math.floor(usable / Math.max(count, 1)), 1, 3);
      const top = marginY + Math.max(0, Math.floor((usable - gap * (count - 1)) / 2));
      let row: number;
      let col: number;
      if (settings.layout === "list") {
        row = top + index * gap;
        col = marginX + Math.round(room * 0.1);
      } else if (settings.layout === "center") {
        row = top + index * gap;
        col = Math.floor((cols - length) / 2);
      } else if (settings.layout === "diagonal") {
        row = marginY + Math.floor(((index + 0.5) * usable) / Math.max(count, 1));
        col = marginX + Math.round((room - length) * (count > 1 ? index / (count - 1) : 0.5));
      } else {
        const slot = usable / Math.max(count, 1);
        row = marginY + Math.floor(index * slot + rng() * Math.max(0, slot - 1));
        col = marginX + Math.floor(rng() * Math.max(1, room - length));
      }
      row = clamp(row, 0, rows - 1);
      col = clamp(col, 0, Math.max(0, cols - length));
      for (let attempt = 0; attempt < 60 && !free(row, col, length); attempt++) {
        row = clamp(marginY + Math.floor(rng() * usable), 0, rows - 1);
        col = clamp(marginX + Math.floor(rng() * Math.max(1, room - length)), 0, Math.max(0, cols - length));
      }
      if (free(row, col, length) && row < rows) result.push({ label, href: word.href, row, col, length });
    });
    placed = result;
  };

  const writeCells = (glyphIndex: Map<string, number>) => {
    const { cols, rows } = grid;
    const total = cols * rows;
    if (cellData.length !== total * 4) {
      cellData = new Float32Array(total * 4);
      cellTexture.dispose();
      cellTexture = new THREE.DataTexture(cellData, cols, rows, THREE.RGBAFormat, THREE.FloatType);
      cellTexture.minFilter = THREE.NearestFilter;
      cellTexture.magFilter = THREE.NearestFilter;
      cellTexture.flipY = false;
      uniforms.uCells.value = cellTexture;
    }
    const rng = random(cols * 92821 + rows * 68917 + 7);
    for (let k = 0; k < total; k++) {
      cellData[k * 4] = rng();
      cellData[k * 4 + 1] = -1;
      cellData[k * 4 + 2] = -1;
      cellData[k * 4 + 3] = 0;
    }
    placed.forEach((word, id) => {
      Array.from(word.label).forEach((char, index) => {
        const k = (word.row * cols + word.col + index) * 4;
        cellData[k + 1] = char.trim() ? glyphIndex.get(char) ?? 0 : 0;
        cellData[k + 2] = id;
        cellData[k + 3] = index + word.length * 1024;
      });
    });
    cellTexture.needsUpdate = true;
  };

  const buildOverlays = () => {
    const settings = settingsRef.current;
    overlays.forEach((element) => element.remove());
    overlays = placed.map((word, index) => {
      const element = document.createElement(word.href ? "a" : settings.onWordClick ? "button" : "span");
      element.textContent = word.label;
      if (word.href) (element as HTMLAnchorElement).href = word.href;
      if (element instanceof HTMLButtonElement) element.type = "button";
      const style = element.style;
      style.position = "absolute";
      style.left = `${(grid.originX + word.col * grid.cellW) / grid.ratio}px`;
      style.top = `${(grid.originY + word.row * grid.cellH) / grid.ratio}px`;
      style.width = `${(word.length * grid.cellW) / grid.ratio}px`;
      style.height = `${grid.cellH / grid.ratio}px`;
      style.margin = "0";
      style.padding = "0";
      style.border = "0";
      style.background = "transparent";
      style.color = "transparent";
      style.font = fontFor(settings.fontSize);
      style.lineHeight = `${grid.cellH / grid.ratio}px`;
      style.whiteSpace = "pre";
      style.overflow = "hidden";
      style.textDecoration = "none";
      style.outline = "none";
      style.cursor = word.href || settings.onWordClick ? "pointer" : "default";
      style.pointerEvents = settings.interactive ? "auto" : "none";
      element.addEventListener("pointerenter", () => setFocus(index));
      element.addEventListener("pointerleave", () => setFocus(-1));
      element.addEventListener("focus", () => setFocus(index));
      element.addEventListener("blur", () => setFocus(-1));
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        settingsRef.current.onWordClick?.(word.label, index);
      });
      layer.appendChild(element);
      return element;
    });
  };

  const layout = () => {
    const settings = settingsRef.current;
    const context = atlasCanvas.getContext("2d");
    if (!context) return;
    const face = fontFor(16);
    if (document.fonts?.load && !requested.has(face)) {
      requested.add(face);
      document.fonts
        .load(face)
        .then((faces) => {
          if (destroyed || !faces.length) return;
          layoutKey = "";
          if (sized) render();
        })
        .catch(() => {});
    }
    const ratio = pixelRatio;
    const size = clamp(settings.fontSize, 6, 64);
    context.font = fontFor(size * ratio);
    const advance = Math.max(context.measureText("M").width, context.measureText("0").width, context.measureText("W").width * 0.9);
    const cellW = Math.max(2, Math.round(advance + clamp(settings.letterSpacing, -0.2, 2) * size * ratio));
    const cellH = Math.max(2, Math.round(size * clamp(settings.lineHeight, 0.8, 4) * ratio));
    const deviceW = Math.round(width * ratio);
    const deviceH = Math.round(height * ratio);
    grid.ratio = ratio;
    grid.cellW = cellW;
    grid.cellH = cellH;
    grid.cols = Math.max(1, Math.floor(deviceW / cellW));
    grid.rows = Math.max(1, Math.floor(deviceH / cellH));
    grid.originX = Math.floor((deviceW - grid.cols * cellW) / 2);
    grid.originY = Math.floor((deviceH - grid.rows * cellH) / 2);
    const charset = charsetFor();
    const glyphs = [" ", ...charset];
    const glyphIndex = new Map<string, number>();
    glyphs.forEach((char, index) => glyphIndex.set(char, index));
    settings.words.forEach((word) => {
      Array.from(word.label).forEach((char) => {
        if (char.trim() && !glyphIndex.has(char)) {
          glyphIndex.set(char, glyphs.length);
          glyphs.push(char);
        }
      });
    });
    const atlasCols = 16;
    const atlasRows = Math.ceil(glyphs.length / atlasCols);
    atlasCanvas.width = atlasCols * cellW;
    atlasCanvas.height = atlasRows * cellH;
    context.clearRect(0, 0, atlasCanvas.width, atlasCanvas.height);
    context.font = fontFor(size * ratio);
    context.textAlign = "center";
    context.textBaseline = "alphabetic";
    context.fillStyle = "#fff";
    const ascent = context.measureText("H").actualBoundingBoxAscent || size * ratio * 0.7;
    glyphs.forEach((char, index) => {
      const x = (index % atlasCols) * cellW + cellW / 2;
      const y = Math.floor(index / atlasCols) * cellH + Math.round(cellH / 2 + ascent / 2);
      context.fillText(char, x, y);
    });
    atlasTexture.dispose();
    atlasTexture.needsUpdate = true;
    uniforms.uAtlasCols.value = atlasCols;
    uniforms.uCharsetSize.value = charset.length;
    placeWords();
    writeCells(glyphIndex);
    buildOverlays();
    const key = settings.words.map((word) => `${word.label}>${word.href ?? ""}`).join("|");
    if (key !== wordsKey) {
      const first = wordsKey === "";
      wordsKey = key;
      cycle.phase = "reveal";
      cycle.time = 0;
      cycle.speed = 1;
      if (first) cycle.intro = true;
    }
    setFocus(-1);
  };

  const ensure = () => {
    const settings = settingsRef.current;
    const key = [
      settings.words.map((word) => `${word.label}>${word.href ?? ""}`).join("|"),
      settings.fontFamily,
      settings.fontWeight,
      settings.fontSize,
      settings.lineHeight,
      settings.letterSpacing,
      settings.charset,
      settings.layout,
      settings.interactive,
      Boolean(settings.onWordClick),
      cycle.layoutSeed,
      Math.round(width),
      Math.round(height),
      pixelRatio.toFixed(2),
      settings.fontFamily ? "" : getComputedStyle(root).fontFamily,
    ].join("|");
    if (key !== layoutKey) {
      layoutKey = key;
      layout();
    }
  };

  const wordShown = (index: number) => {
    const word = placed[index];
    if (!word) return false;
    const axis = rankAxis();
    const nx = (word.col + word.length / 2) / grid.cols;
    const ny = (word.row + 0.5) / grid.rows;
    const rank = nx * axis[0] + ny * axis[1] + axis[2];
    const { band } = span();
    const stagger = clamp(settingsRef.current.stagger, 0, 1) * 0.12;
    if (cycle.phase === "hold") return true;
    if (cycle.phase === "reveal") return frontAt(cycle.time / scanTime()) - rank > band * 0.3 + stagger + 0.03;
    if (cycle.phase === "dissolve") return frontAt(cycle.time / scanTime()) - rank < band * 0.15;
    return false;
  };

  function setFocus(index: number) {
    const settings = settingsRef.current;
    if (index >= 0 && (!settings.interactive || settings.paused || !wordShown(index))) return;
    focus.index = index;
    if (index >= 0) {
      const word = placed[index];
      focus.rect = [word.col, word.row, word.col + word.length - 1, word.row];
    }
    wake();
  }

  const scanTime = () => clamp(settingsRef.current.scanDuration, 0.3, 20);

  const advance = (dt: number) => {
    const settings = settingsRef.current;
    const scan = scanTime();
    cycle.time += dt * cycle.speed;
    if (cycle.phase === "reveal" && cycle.time >= scan) {
      cycle.phase = "hold";
      cycle.time = 0;
      cycle.speed = 1;
      cycle.intro = false;
    } else if (cycle.phase === "hold") {
      const holding = !settings.loop || focus.index >= 0;
      if (holding) cycle.time = Math.min(cycle.time, clamp(settings.holdDuration, 0, 120));
      else if (cycle.time >= clamp(settings.holdDuration, 0, 120)) {
        cycle.phase = "dissolve";
        cycle.time = 0;
      }
    } else if (cycle.phase === "dissolve" && cycle.time >= scan) {
      cycle.phase = "rest";
      cycle.time = 0;
      cycle.speed = 1;
      if (focus.index >= 0) focus.index = -1;
    } else if (cycle.phase === "rest" && cycle.time >= clamp(settings.restDuration, 0, 60)) {
      if (settings.shuffle) {
        cycle.layoutSeed++;
        ensure();
      }
      cycle.phase = "reveal";
      cycle.time = 0;
    }
    const target = focus.index >= 0 ? 1 : 0;
    focus.amount += (target - focus.amount) * (1 - Math.exp(-dt / 0.12));
    focus.line += (target - focus.line) * (1 - Math.exp(-dt / (target ? 0.2 : 0.1)));
  };

  const apply = () => {
    const settings = settingsRef.current;
    const u = uniforms;
    const word = toOklab(parseColor(settings.colors[0], [0.96, 0.95, 1]));
    const wall = toOklab(parseColor(settings.colors[1], [0.69, 0.62, 0.94]));
    const mid: Lab = [wall[0] + (word[0] - wall[0]) * 0.55, wall[1] + (word[1] - wall[1]) * 0.35, wall[2] + (word[2] - wall[2]) * 0.35];
    u.uWordLab.value.set(word[0], word[1], word[2]);
    u.uWallLab.value.set(wall[0], wall[1], wall[2]);
    u.uBandLab.value.set(mid[0], mid[1], mid[2]);
    u.uCanvas.value.set(Math.round(width * pixelRatio), Math.round(height * pixelRatio));
    u.uOrigin.value.set(grid.originX, grid.originY);
    u.uCell.value.set(grid.cellW, grid.cellH);
    u.uGrid.value.set(grid.cols, grid.rows);
    u.uTime.value = clock;
    const { band } = span();
    u.uBand.value = band;
    u.uStagger.value = clamp(settings.stagger, 0, 1) * 0.12;
    u.uShimmer.value = clamp(settings.shimmer, 0, 10);
    u.uScramble.value = clamp(settings.scrambleRate, 1, 40);
    u.uDensity.value = clamp(settings.density, 0, 1);
    u.uWallAlpha.value = clamp(settings.wallOpacity, 0, 1);
    u.uEdge.value = clamp(settings.edgeFade, 0, 0.5) * Math.min(width, height) * pixelRatio;
    const axis = rankAxis();
    u.uRankAxis.value.set(axis[0], axis[1], axis[2]);
    const still = !animating();
    u.uStill.value = still ? 1 : 0;
    if (still) {
      u.uReveal.value = FAR;
      u.uDissolve.value = -FAR;
      u.uWallIn.value = FAR;
    } else {
      const front = frontAt(cycle.time / scanTime());
      u.uReveal.value = cycle.phase === "reveal" ? front : FAR;
      u.uDissolve.value = cycle.phase === "dissolve" ? front : cycle.phase === "rest" ? FAR : -FAR;
      u.uWallIn.value = cycle.intro && cycle.phase === "reveal" ? front : FAR;
    }
    u.uFocusRect.value.set(focus.rect[0], focus.rect[1], focus.rect[2], focus.rect[3]);
    u.uFocus.value = focus.amount;
    u.uFocusWord.value = focus.index >= 0 ? focus.index : u.uFocusWord.value;
    u.uUnderline.value = focus.line;
    u.uLine.value = Math.max(1, Math.round(1.25 * pixelRatio));
  };

  const render = () => {
    if (!sized) return;
    ensure();
    apply();
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(scene, camera);
  };

  const animating = () => {
    const settings = settingsRef.current;
    return !settings.reduced && !settings.paused;
  };

  const tick = (now: number) => {
    raf = 0;
    if (destroyed) return;
    const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
    last = now;
    frames++;
    if (frames % 30 === 0 && (Math.abs(root.clientWidth - width) > 1 || Math.abs(root.clientHeight - height) > 1)) resize();
    if (sized) ensure();
    if (animating()) {
      clock += dt;
      advance(dt);
    }
    render();
    if (visible && !document.hidden && animating()) raf = requestAnimationFrame(tick);
  };

  function wake() {
    if (destroyed || raf || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function resize() {
    const rect = root.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      sized = false;
      return;
    }
    sized = true;
    width = rect.width;
    height = rect.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2) * clamp(settingsRef.current.quality, 0.25, 1);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    render();
    wake();
  }

  const next = () => {
    if (!animating()) return;
    if (cycle.phase === "reveal" || cycle.phase === "dissolve") cycle.speed = 3;
    else if (cycle.phase === "hold") {
      cycle.phase = "dissolve";
      cycle.time = 0;
      cycle.speed = 1.6;
    } else cycle.time = clamp(settingsRef.current.restDuration, 0, 60);
    focus.index = -1;
    wake();
  };

  const onClick = () => {
    const settings = settingsRef.current;
    if (!settings.interactive || !settings.clickToShuffle) return;
    next();
  };

  root.addEventListener("click", onClick);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  const intersection = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) wake();
    },
    { rootMargin: "80px" },
  );
  intersection.observe(root);
  const onVisibility = () => {
    if (!document.hidden) wake();
  };
  document.addEventListener("visibilitychange", onVisibility);
  if (document.fonts?.ready)
    document.fonts.ready
      .then(() => {
        if (destroyed) return;
        layoutKey = "";
        if (sized) render();
      })
      .catch(() => {});
  const onLost = (event: Event) => event.preventDefault();
  canvas.addEventListener("webglcontextlost", onLost);
  resize();

  return {
    sync: () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2) * clamp(settingsRef.current.quality, 0.25, 1);
      if (!sized || Math.abs(ratio - pixelRatio) > 1e-3) resize();
      else render();
      wake();
    },
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      root.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      resizeObserver.disconnect();
      intersection.disconnect();
      overlays.forEach((element) => element.remove());
      atlasTexture.dispose();
      cellTexture.dispose();
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      layer.remove();
    },
    shuffle: next,
    replay: () => {
      if (!animating()) return;
      cycle.phase = "dissolve";
      cycle.time = 0;
      cycle.speed = 1.6;
      focus.index = -1;
      wake();
    },
    focus: (index) => setFocus(index ?? -1),
  };
};

const TypographicWall = forwardRef<TypographicWallHandle, TypographicWallProps>(function TypographicWall(
  {
    words = "Work|Studio|Journal|Archive|Careers|Press|Contact|Newsletter",
    fontFamily = "",
    fontWeight = 500,
    fontSize = 14,
    lineHeight = 1.8,
    letterSpacing = 0.12,
    charset = "letters",
    colors = ["#F4F1FF", "#B19EEF"],
    density = 0.7,
    wallOpacity = 0.1,
    shimmer = 0.35,
    scrambleRate = 12,
    layout = "scatter",
    direction = "down",
    scanDuration = 2.6,
    holdDuration = 5,
    restDuration = 0.8,
    stagger = 0.5,
    bandWidth = 0.09,
    loop = true,
    shuffle = true,
    edgeFade = 0.1,
    interactive = true,
    clickToShuffle = true,
    onWordClick,
    paused = false,
    quality = 1,
    className,
    style,
    children,
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const reduced = useSyncExternalStore(subscribeToMotion, readMotion, () => false);
  const settingsRef = useRef<Settings | null>(null);

  useEffect(() => {
    settingsRef.current = {
      words: normalizeWords(words),
      fontFamily,
      fontWeight,
      fontSize,
      lineHeight,
      letterSpacing,
      charset,
      colors,
      density,
      wallOpacity,
      shimmer,
      scrambleRate,
      layout,
      direction,
      scanDuration,
      holdDuration,
      restDuration,
      stagger,
      bandWidth,
      loop,
      shuffle,
      edgeFade,
      interactive,
      clickToShuffle,
      onWordClick,
      paused,
      quality,
      reduced,
    };
    if (!controllerRef.current && rootRef.current) {
      controllerRef.current = createWall(rootRef.current, settingsRef as { current: Settings });
    } else controllerRef.current?.sync();
  });

  useEffect(
    () => () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      shuffle: () => controllerRef.current?.shuffle(),
      replay: () => controllerRef.current?.replay(),
      focus: (index: number | null) => controllerRef.current?.focus(index),
    }),
    [],
  );

  const label = normalizeWords(words)
    .map((word) => word.label)
    .join(", ");

  return (
    <div
      ref={rootRef}
      aria-label={label}
      className={cn("relative isolate h-full min-h-[240px] w-full overflow-hidden", className)}
      style={{ touchAction: "pan-y", ...style }}
    >
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
});

TypographicWall.displayName = "TypographicWall";

export { TypographicWall };
export default TypographicWall;
