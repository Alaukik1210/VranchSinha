/**
 * The shield mark as inline SVG, so it can be drawn (stroke) and tinted.
 * `draw` animates the outline from nothing, then the star fades in.
 */
const SHIELD =
  "M83.6417 10.4969C52.2578 -0.832302 31.1819 -0.832307 2 10.4969L2.37127 19.872C29.5607 8.08439 54.6896 8.08439 82.4731 19.872L81.0809 29.34C58.7426 17.0011 27.1289 17.0011 4.43183 29.1602M66.23 32.8672L78.2963 38.251C76.2234 47.0691 66.2671 69.0124 43.0255 86.2404C34.0531 80.3925 14.3077 62.6077 7.10499 38.251L19.328 32.8672";
const STAR =
  "M57.1215 49.4255C48.0265 49.4255 43.3411 56.8669 43.3411 63.2058C43.3411 56.8669 37.829 49.4255 29.5608 49.4255C37.829 49.4255 43.3411 44.7401 43.3411 35.6451C43.3411 44.7401 48.0265 49.4255 57.1215 49.4255Z";

export default function Mark({ className = "", draw = false, stroke = "#DCC0F7", star = "#F0F0F0", weight = 4 }) {
  return (
    <svg viewBox="0 0 86 89" fill="none" className={className} aria-hidden="true">
      <path
        d={SHIELD}
        stroke={stroke}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        className={draw ? "mark-draw" : undefined}
      />
      <path d={STAR} fill={star} className={draw ? "mark-star" : undefined} />
    </svg>
  );
}
