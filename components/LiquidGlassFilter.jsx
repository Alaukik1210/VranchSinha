/**
 * LiquidGlassFilter — the SVG displacement filter that gives Apple's
 * "Liquid Glass" its defining trait: real background *refraction*, not just blur.
 *
 * Apple's material bends the content behind it at the edges (edge lensing) and
 * adds fine optical noise. Plain `backdrop-filter: blur()` can't do that — the
 * only web technique is a custom SVG filter referenced from `backdrop-filter`.
 *
 * feTurbulence generates a smooth noise field; feGaussianBlur softens it so the
 * distortion reads as gentle glass curvature rather than static; feDisplacementMap
 * pushes the backdrop pixels along that field. Chromium honours SVG filters inside
 * backdrop-filter, so it refracts there and gracefully no-ops (blur only) elsewhere.
 *
 * Rendered once, hidden, near the root so any `.liquid-glass` element can
 * reference `url(#liquid-lens)`.
 */
export default function LiquidGlassFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter
          id="liquid-lens"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves="2"
            seed="14"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2.4" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="36"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
