"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import Mark from "./Mark";

/**
 * The nav: one small Liquid Glass capsule, centred at the top.
 *
 * The glass follows Apple's material rather than frosted blur:
 *  - Refraction. The backdrop is bent through a convex bezel: clear in the
 *    middle, lensing toward the rim, gathering the backdrop toward the edge. The
 *    displacement map is generated for the capsule's exact size (signed
 *    distance to the edge → squircle surface height → refraction offset along
 *    the outward normal) and applied with an SVG filter on backdrop-filter.
 *  - Specular rim. Light from the top left: a bright edge on that side, a
 *    fainter one opposite, and a soft inner glow.
 *  - A whisper of tint and blur, and a soft contact shadow.
 *
 * Only Chromium runs SVG filters in backdrop-filter; Safari and Firefox get
 * the same capsule with blur and saturation (they ignore the url() line).
 */

const BEZEL = 0.42; // bezel width as a fraction of the capsule's height
const IOR = 1.5;

function displacementMap(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(w, h);
  const r = h / 2;
  const b = h * BEZEL;

  // Surface profile: convex squircle, height 1 at the inner edge of the bezel.
  // Refraction offset from its slope (Snell), normalised to the peak.
  const N = 128;
  const prof = new Float32Array(N + 1);
  let peak = 0;
  for (let i = 0; i <= N; i++) {
    const x = Math.min(0.999, Math.max(0.001, i / N)); // 0 at the rim → 1 inside
    const slope = Math.pow(1 - x, 3) / Math.pow(1 - Math.pow(1 - x, 4), 0.75);
    const ti = Math.atan(slope);
    const tt = Math.asin(Math.sin(ti) / IOR);
    prof[i] = Math.tan(ti - tt);
    peak = Math.max(peak, prof[i]);
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Capsule SDF: distance to the centre segment.
      const px = x + 0.5;
      const py = y + 0.5;
      const cx = Math.min(Math.max(px, r), w - r);
      const dx = px - cx;
      const dy = py - r;
      const q = Math.hypot(dx, dy) || 1e-6;
      const d = r - q; // distance in from the edge
      let ox = 0;
      let oy = 0;
      if (d > 0 && d < b) {
        const m = prof[Math.round((d / b) * N)] / peak;
        // Inward: the rim gathers what lies just inside it, so the lensing
        // never samples past the capsule (where the backdrop is empty).
        ox = (-dx / q) * m;
        oy = (-dy / q) * m;
      }
      const k = (y * w + x) * 4;
      img.data[k] = 128 + ox * 127;
      img.data[k + 1] = 128 + oy * 127;
      img.data[k + 2] = 128;
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

export default function GlassNav() {
  const id = useId().replace(/:/g, "");
  const ref = useRef(null);
  const [map, setMap] = useState(null); // { url, w, h }

  useEffect(() => {
    const el = ref.current;
    const brands = navigator.userAgentData?.brands || [];
    if (!brands.some((b) => /Chromium/.test(b.brand))) return;
    let last = "";
    const build = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h || `${w}x${h}` === last) return;
      last = `${w}x${h}`;
      setMap({ url: displacementMap(w, h), w, h });
    };
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="glass-nav-wrap pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center pt-[calc(var(--u)*16)] md:pt-[calc(var(--u)*20)]">
      {map ? (
        <svg aria-hidden="true" width="0" height="0" className="absolute">
          <filter id={`lg-${id}`} x="0" y="0" width={map.w} height={map.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="soft" />
            <feImage href={map.url} x="0" y="0" width={map.w} height={map.h} result="map" preserveAspectRatio="none" />
            <feDisplacementMap in="soft" in2="map" scale={map.h * 0.55} xChannelSelector="R" yChannelSelector="G" result="bent" />
            <feColorMatrix in="bent" type="saturate" values="1.5" />
          </filter>
        </svg>
      ) : null}
      <nav
        ref={ref}
        aria-label="Primary"
        className={`glass-pill pointer-events-auto ${map ? "is-refract" : ""}`}
        style={map ? { "--lg": `url(#lg-${id})` } : undefined}
      >
        <Link href="/" className="glass-name">
          <Mark className="glass-mark" stroke="currentColor" star="currentColor" weight={6} />
          Vranch Sinha
        </Link>
        <a href="#contact" className="glass-cta">
          Contact
        </a>
      </nav>
    </div>
  );
}
