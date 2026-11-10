"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { markHint } from "@/lib/useHint";
import Hint from "./Hint";

/**
 * References, as an isometric wall: three kinds of face (left, right, top) tiled
 * into cubes. Every so often a face swaps its picture, and the pictures slide
 * along that face's own plane, so a wall moves like a wall and a floor like a floor.
 * There are always spare pictures, so no two faces ever match, and a cube never shows
 * more than one white picture: on the white ground, two would make it disappear.
 */

// The first nine start on the wall; the rest wait their turn.
export const IMAGES = [
  "bccn",
  "lando",
  "cat-stamp",
  "spiral",
  "gahan-rest",
  "red-cat",
  "windows",
  "stickers",
  "ear",
  "shinee",
  "mohan",
  "runner",
  "tattoo-flash",
  "inspora",
  "spiral-cat",
  "flame-eye",
  "aditya",
  "sleepy-eyes",
  "logos",
  "joshua",
  "starburst",
];

// Pictures with a white ground, measured from their edges.
const WHITE = new Set(["aditya", "flame-eye", "gahan-rest", "inspora", "lando", "logos", "mohan", "sleepy-eyes", "starburst", "tattoo-flash"]);
const isWhite = (n) => WHITE.has(IMAGES[n]);

const A = 28.87; // cube edge, in % of the wall's width: three cubes fill it exactly
const H = A * 0.866;
const FACES = {
  t: { m: "0.866,-0.5,0.866,0.5", at: (x, y) => [x - H, y - A / 2] },
  l: { m: "0.866,0.5,0,1", at: (x, y) => [x - H, y - A / 2] },
  r: { m: "0.866,-0.5,0,1", at: (x, y) => [x, y] },
};

const CUBES = [
  [50, A],
  [50 - H, A * 2.5],
  [50 + H, A * 2.5],
];

const TILES = CUBES.flatMap(([x, y]) =>
  Object.values(FACES).map((f) => {
    const [left, top] = f.at(x, y);
    return { left, top, m: f.m };
  }),
);

const url = (i) => `/references/${IMAGES[i]}.jpg`;
const between = (a, b) => a + Math.random() * (b - a);

export default function References() {
  const wall = useRef(null);

  useEffect(() => {
    const node = wall.current;
    const tiles = [...node.querySelectorAll(".iso-tile")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const showing = tiles.map((_, i) => i);
    const leaving = tiles.map(() => -1); // the picture sliding out, still on screen
    const front = tiles.map(() => 0); // which of a tile's two layers is on show
    const busy = new Set();
    let timer = 0;
    let on = false;

    // The hidden layer takes the new picture and slides in as the shown one slides
    // out, then they trade places. What's on screen never changes its source.
    const swap = async () => {
      const free = tiles.map((_, i) => i).filter((i) => !busy.has(i));
      if (!free.length) return;
      const i = free[Math.floor(Math.random() * free.length)];
      const cube = Math.floor(i / 3) * 3; // a cube's three faces sit together in the list
      const whiteBeside = [0, 1, 2].some((f) => cube + f !== i && [showing[cube + f], leaving[cube + f]].some((n) => n >= 0 && isWhite(n)));
      const unused = IMAGES.map((_, n) => n).filter((n) => !showing.includes(n) && !(whiteBeside && isWhite(n)));
      const next = unused[Math.floor(Math.random() * unused.length)];
      const layers = tiles[i].querySelectorAll("img");
      const shown = layers[front[i]];
      const incoming = layers[1 - front[i]];
      const dir = Math.random() < 0.5 ? -1 : 1;
      busy.add(i);
      leaving[i] = showing[i];
      showing[i] = next;
      incoming.src = url(next);
      await incoming.decode().catch(() => {});
      gsap.set(incoming, { xPercent: dir * 100, autoAlpha: 1 });
      gsap.to(shown, { xPercent: -dir * 100, duration: 0.9, ease: "power3.inOut" });
      gsap.to(incoming, {
        xPercent: 0,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(shown, { autoAlpha: 0 });
          front[i] = 1 - front[i];
          leaving[i] = -1;
          busy.delete(i);
        },
      });
    };

    // One to four faces on each beat, slightly out of step, at an uneven pace.
    const beat = () => {
      if (!on) return;
      const count = 1 + Math.floor(Math.random() * 4);
      for (let n = 0; n < count; n++) gsap.delayedCall(between(0, 0.35), swap);
      timer = setTimeout(beat, between(1200, 2400));
    };

    // Only while the wall is on screen. Everything is fetched first, so a slide
    // never waits on the network.
    let loaded = null;
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(timer);
      on = e.isIntersecting;
      if (!on) return;
      loaded ??= Promise.all(
        IMAGES.map((_, n) => {
          const img = new Image();
          img.src = url(n);
          return img.decode().catch(() => {});
        }),
      );
      loaded.then(beat);
    });
    io.observe(node);
    return () => {
      on = false;
      io.disconnect();
      clearTimeout(timer);
      gsap.killTweensOf(swap);
      gsap.killTweensOf(node.querySelectorAll("img"));
    };
  }, []);

  return (
    <section id="references" aria-labelledby="references-title" className="shelf gutter relative">
      <div className="shelf-head">
        <h2 id="references-title" className="work-title">
          Eye candy
        </h2>
        <p className="about-label">(References)</p>
      </div>
      <Hint id="refs" target=".iso" side="left" narrow="top" at={1000}>
        just for looking,
        <br />
        nothing to <span className="hint-fine">click</span>
        <span className="hint-touch">tap</span>
      </Hint>
      <div ref={wall} className="iso" aria-hidden="true" onPointerDown={() => markHint("refs")}>
        {TILES.map((t, i) => (
          <span
            key={`${t.left}-${t.top}-${t.m}`}
            className="iso-tile"
            data-hot=""
            style={{ left: `${t.left}cqw`, top: `${t.top}cqw`, transform: `matrix(${t.m},0,0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- swapped by hand as tiles slide */}
            <img src={url(i)} alt="" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url(i)} alt="" decoding="async" style={{ visibility: "hidden" }} />
          </span>
        ))}
      </div>
    </section>
  );
}
