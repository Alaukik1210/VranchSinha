const BLACK = [11, 11, 11]; // the dark heart of every card

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const ease = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// The glow: the project's colour pooling at the card's edges, deepest along the
// top, falling through a dark shade of itself into black. Worked out small and
// scaled up, since it has no detail to lose.
export function paintGlow(tone) {
  const W = 128;
  const H = 160;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(W, H);
  const accent = rgb(tone);
  const bright = mix(accent, BLACK, 0.15);
  const deep = mix(accent, BLACK, 0.82);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = (x + 0.5) / W;
      const v = (y + 0.5) / H;
      const glow =
        1 -
        (1 - Math.exp(-u / 0.069)) *
          (1 - Math.exp(-(1 - u) / 0.069)) *
          (1 - Math.exp(-v / 0.127)) *
          (1 - Math.exp(-(1 - v) / 0.069));
      const col = mix(mix(BLACK, deep, ease(0.06, 0.42, glow)), bright, ease(0.36, 0.95, glow));
      const k = (y * W + x) * 4;
      img.data[k] = col[0];
      img.data[k + 1] = col[1];
      img.data[k + 2] = col[2];
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
