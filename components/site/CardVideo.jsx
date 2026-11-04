"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Motion preview for a project card. The cover image underneath is always
 * there; the loop fades in over it once it is actually playing.
 *
 * - Loads only as the card approaches the viewport, pauses when it leaves.
 * - Stays a still image for reduced-motion and data-saver users.
 * - If the files are missing or fail, the image simply remains.
 */
export default function CardVideo({ base }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false); // allowed to load at all
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData;
    if (reduce || saveData) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          if (v.currentSrc) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // The source is set once in range; load it, then start the loop.
  useEffect(() => {
    const v = ref.current;
    if (!on || !v) return;
    v.load();
    v.play().catch(() => {});
  }, [on]);

  if (failed) return null;

  // Picked once in range (not with <source media>, whose non-matching
  // candidate fires an error that React surfaces on the video): 2560px for
  // laptops and Retina screens, a lighter 720p for phones.
  const src = on ? `${base}${matchMedia("(min-width: 768px)").matches ? "" : "-720"}.mp4` : undefined;

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
      muted
      loop
      playsInline
      preload="none"
      src={src}
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      onError={() => setFailed(true)}
    />
  );
}
