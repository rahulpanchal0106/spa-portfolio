export const SAND_W = 120;
export const SAND_H = 120;

export const EMPTY = 0;
export const SAND = 1;
export const WATER = 2;
export const FIRE = 3;
export const WALL = 4;

export type CellKind = typeof EMPTY | typeof SAND | typeof WATER | typeof FIRE | typeof WALL;

export type SandElement = "sand" | "water" | "fire" | "wall" | "erase";

export type SandStroke = {
  id: string;
  element: SandElement;
  brushSize: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type SandEvent =
  | { type: "stroke"; stroke: SandStroke }
  | { type: "strokes"; strokes: SandStroke[] }
  | { type: "clear" }
  | { type: "ready" }
  | { type: "ping" };

export const ELEMENT_CELL: Record<SandElement, CellKind> = {
  sand: SAND,
  water: WATER,
  fire: FIRE,
  wall: WALL,
  erase: EMPTY,
};

export const PALETTE: Record<CellKind, [number, number, number]> = {
  [EMPTY]: [10, 10, 10],
  [SAND]: [234, 179, 8],
  [WATER]: [56, 189, 248],
  [FIRE]: [249, 115, 22],
  [WALL]: [100, 116, 139],
};

export function clampCell(v: number, max: number) {
  return Math.max(0, Math.min(max - 1, v | 0));
}

export function isSandElement(value: unknown): value is SandElement {
  return value === "sand" || value === "water" || value === "fire" || value === "wall" || value === "erase";
}

export function parseSandEventFromUnknown(data: unknown): SandEvent | null {
  if (!data || typeof data !== "object") return null;
  const rec = data as Record<string, unknown>;
  if (rec.type === "clear") return { type: "clear" };
  if (rec.type === "ready") return { type: "ready" };
  if (rec.type === "ping") return { type: "ping" };
  if (rec.type === "strokes" && Array.isArray(rec.strokes)) {
    const strokes = rec.strokes
      .map(parseSandStroke)
      .filter((stroke): stroke is SandStroke => Boolean(stroke));
    return strokes.length ? { type: "strokes", strokes } : null;
  }
  if (rec.type === "stroke") {
    const stroke = parseSandStroke(rec.stroke);
    return stroke ? { type: "stroke", stroke } : null;
  }
  const stroke = parseSandStroke(rec);
  return stroke ? { type: "stroke", stroke } : null;
}

export function parseSandEvent(raw: string): SandEvent | null {
  try {
    return parseSandEventFromUnknown(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function strokesFromEvent(event: SandEvent): SandStroke[] {
  if (event.type === "stroke") return [event.stroke];
  if (event.type === "strokes") return event.strokes;
  return [];
}

export function parseSandStroke(raw: unknown): SandStroke | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  if (!isSandElement(rec.element)) return null;
  const brushSize = Number(rec.brushSize);
  const startX = Number(rec.startX);
  const startY = Number(rec.startY);
  const endX = Number(rec.endX);
  const endY = Number(rec.endY);
  if (![brushSize, startX, startY, endX, endY].every(Number.isFinite)) return null;
  return {
    id: typeof rec.id === "string" ? rec.id : `${startX},${startY},${endX},${endY},${rec.element}`,
    element: rec.element,
    brushSize: Math.max(1, Math.min(8, brushSize | 0)),
    startX: clampCell(startX, SAND_W),
    startY: clampCell(startY, SAND_H),
    endX: clampCell(endX, SAND_W),
    endY: clampCell(endY, SAND_H),
  };
}

function idx(x: number, y: number) {
  return y * SAND_W + x;
}

function inBounds(x: number, y: number) {
  return x >= 0 && y >= 0 && x < SAND_W && y < SAND_H;
}

function swap(grid: Uint8Array, a: number, b: number) {
  const t = grid[a];
  grid[a] = grid[b];
  grid[b] = t;
}

function emptyOrWater(cell: number) {
  return cell === EMPTY || cell === WATER;
}

export function stampDisc(grid: Uint8Array, cx: number, cy: number, radius: number, element: SandElement) {
  const r2 = radius * radius;
  const paint = ELEMENT_CELL[element];
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy > r2) continue;
      const x = cx + dx;
      const y = cy + dy;
      if (!inBounds(x, y)) continue;
      const i = idx(x, y);
      if (element === "erase") {
        grid[i] = EMPTY;
        continue;
      }
      if (element !== "wall" && grid[i] === WALL) continue;
      grid[i] = paint;
    }
  }
}

export function walkLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  visit: (x: number, y: number) => void,
) {
  let x = x0;
  let y = y0;
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    visit(x, y);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}

export function applyStroke(grid: Uint8Array, stroke: SandStroke) {
  const radius = stroke.brushSize;
  walkLine(stroke.startX, stroke.startY, stroke.endX, stroke.endY, (x, y) => {
    stampDisc(grid, x, y, radius, stroke.element);
  });
}

export function clearGrid(grid: Uint8Array) {
  grid.fill(EMPTY);
}

function trySand(grid: Uint8Array, x: number, y: number) {
  if (y >= SAND_H - 1) return;
  const i = idx(x, y);
  const down = idx(x, y + 1);
  if (emptyOrWater(grid[down])) {
    swap(grid, i, down);
    return;
  }
  const leftFirst = Math.random() < 0.5;
  const a = leftFirst ? -1 : 1;
  const b = -a;
  if (inBounds(x + a, y + 1) && emptyOrWater(grid[idx(x + a, y + 1)])) {
    swap(grid, i, idx(x + a, y + 1));
    return;
  }
  if (inBounds(x + b, y + 1) && emptyOrWater(grid[idx(x + b, y + 1)])) {
    swap(grid, i, idx(x + b, y + 1));
  }
}

function tryWater(grid: Uint8Array, x: number, y: number) {
  const i = idx(x, y);
  const leftFirst = Math.random() < 0.5;
  const dirs = leftFirst ? [-1, 1] : [1, -1];
  if (y < SAND_H - 1) {
    const down = idx(x, y + 1);
    if (grid[down] === EMPTY) {
      swap(grid, i, down);
      return;
    }
    for (const d of dirs) {
      if (inBounds(x + d, y + 1) && grid[idx(x + d, y + 1)] === EMPTY) {
        swap(grid, i, idx(x + d, y + 1));
        return;
      }
    }
  }
  for (const dir of dirs) {
    for (let step = 1; step <= 3; step++) {
      const d = dir * step;
      if (!inBounds(x + d, y)) break;
      const ni = idx(x + d, y);
      if (grid[ni] === WALL || grid[ni] === SAND || grid[ni] === FIRE) break;
      if (grid[ni] === EMPTY) {
        swap(grid, i, ni);
        return;
      }
    }
  }
}

function tryFire(grid: Uint8Array, x: number, y: number) {
  const i = idx(x, y);
  if (Math.random() < 0.085) {
    grid[i] = EMPTY;
    return;
  }
  const upY = y - 1;
  if (upY >= 0 && grid[idx(x, upY)] === EMPTY) {
    swap(grid, i, idx(x, upY));
    return;
  }
  const drift = Math.random() < 0.5 ? -1 : 1;
  if (upY >= 0 && inBounds(x + drift, upY) && grid[idx(x + drift, upY)] === EMPTY) {
    swap(grid, i, idx(x + drift, upY));
    return;
  }
  if (inBounds(x + drift, y) && grid[idx(x + drift, y)] === EMPTY) {
    swap(grid, i, idx(x + drift, y));
  }
}

export function stepSand(grid: Uint8Array) {
  for (let y = SAND_H - 1; y >= 0; y--) {
    const ltr = y % 2 === 0;
    if (ltr) {
      for (let x = 0; x < SAND_W; x++) visit(grid, x, y);
    } else {
      for (let x = SAND_W - 1; x >= 0; x--) visit(grid, x, y);
    }
  }
}

function visit(grid: Uint8Array, x: number, y: number) {
  const cell = grid[idx(x, y)];
  if (cell === SAND) trySand(grid, x, y);
  else if (cell === WATER) tryWater(grid, x, y);
  else if (cell === FIRE) tryFire(grid, x, y);
}

export function paintGrid(grid: Uint8Array, pixels: Uint8ClampedArray, frame: number) {
  for (let i = 0; i < grid.length; i++) {
    const cell = grid[i] as CellKind;
    let [r, g, b] = PALETTE[cell];
    if (cell === FIRE) {
      const flicker = ((i * 13 + frame * 17) & 7) - 3;
      r = Math.max(180, Math.min(255, r + flicker * 12));
      g = Math.max(40, Math.min(180, g + flicker * 6));
    } else if (cell === SAND) {
      const grain = ((i * 7) & 3) - 1;
      r = Math.max(180, Math.min(255, r + grain * 8));
      g = Math.max(140, Math.min(220, g + grain * 6));
    } else if (cell === WATER) {
      const wave = ((i + frame) & 5) - 2;
      b = Math.max(200, Math.min(255, b + wave * 6));
    }
    const o = i * 4;
    pixels[o] = r;
    pixels[o + 1] = g;
    pixels[o + 2] = b;
    pixels[o + 3] = cell === EMPTY ? 0 : 255;
  }
}
