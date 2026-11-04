"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Mark from "./Mark";

/**
 * Preloader + two tiny signals:
 *  - sceneReady: the hero's WebGL scene has drawn its first real frames
 *    (shaders compiled, name texture painted), set by GlassShield.
 *  - introDone: the loader has lifted; the hero starts its reveal.
 *
 * The loader plays on every fresh page load (not on in-app navigation back
 * to the home page) and never lifts before the scene is ready, so the
 * shader-compile hitch happens behind it instead of on screen.
 */

function signal() {
  let value = false;
  const listeners = new Set();
  return {
    get: () => value,
    set() {
      if (value) return;
      value = true;
      listeners.forEach((l) => l());
    },
    subscribe(l) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

const intro = signal();
const scene = signal();
let played = false; // per page load

export const markSceneReady = () => scene.set();

export function useIntroDone() {
  return useSyncExternalStore(intro.subscribe, intro.get, () => false);
}

const MIN_MS = 1800;
const MAX_MS = 5000;

export default function Intro() {
  const [phase, setPhase] = useState(played ? "gone" : "play"); // play → lift → gone

  useEffect(() => {
    if (played) {
      intro.set();
      return;
    }
    played = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    window.lenis?.stop();
    window.scrollTo(0, 0);

    let lift;
    let gone;
    const finish = () => {
      if (lift) return;
      const wait = Math.max(0, (reduce ? 400 : MIN_MS) - (performance.now() - start));
      lift = setTimeout(() => {
        setPhase("lift");
        intro.set();
        gone = setTimeout(() => {
          setPhase("gone");
          window.lenis?.start();
        }, reduce ? 200 : 1000);
      }, wait);
    };

    const unsub = scene.subscribe(finish);
    if (scene.get()) finish();
    const cap = setTimeout(finish, MAX_MS);

    return () => {
      unsub();
      clearTimeout(cap);
      clearTimeout(lift);
      clearTimeout(gone);
      window.lenis?.start();
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className={`intro fixed inset-0 z-[200] flex items-center justify-center bg-[var(--ink)] ${
        phase === "lift" ? "intro-lift" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <Mark draw className="w-14 h-14" />
        <div className="overflow-hidden py-[0.15em]">
          <p className="intro-name font-funnel text-[length:calc(var(--u)*15)] tracking-[0.01em] text-[var(--paper)]">Vranch Sinha</p>
        </div>
      </div>
    </div>
  );
}
