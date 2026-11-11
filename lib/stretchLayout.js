export const CARD_W = 0.8;
export const CARD_H = 1;
export const FOV = 32;
const DEPTH = 0.515; // how far back a side card sits, as a fraction of camera distance

/**
 * The carousel's geometry for a stage size: the side cards' outer edges land on
 * the screen edges. Kept apart from the engine so the page can reserve its scroll
 * height straight away, before three.js has loaded.
 */
export function stretchLayout(w, h) {
  const aspect = w / h;
  const phone = aspect < 0.85;
  const heightFrac = phone ? 0.42 : 0.56;
  const widthFrac = phone ? 0.48 : 0.9;
  const tan = Math.tan((FOV * Math.PI) / 360);
  const D = Math.max(CARD_H / (2 * tan * heightFrac), CARD_W / (2 * tan * aspect * widthFrac));
  const depth = D * DEPTH;
  const centreHalf = CARD_W / 2 / (D * tan * aspect);
  const sideHalf = CARD_W / 2 / ((D + depth) * tan * aspect);
  const gap = phone ? 20 / (w / 2) : Math.max(0, 1 - centreHalf - 2 * sideHalf);
  const sideInner = centreHalf + gap;
  const sideX = sideInner + sideHalf;
  return {
    D,
    depth,
    sideInner,
    spacing: sideX * (D + depth) * tan * aspect,
    // How far a card travels on screen, which is what a drag follows.
    stride: Math.max(120, w * 0.5 * sideX),
    // Page scroll per card. On a phone a flick covers a lot of ground, so each card
    // takes most of a screen.
    step: phone ? Math.round(h * 0.75) : Math.max(120, w * 0.5 * sideX),
    halfW: centreHalf * (w / 2),
    halfH: (CARD_H / (2 * D * tan)) * (h / 2),
  };
}
