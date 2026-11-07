import gsap from "gsap";
import { stretchLayout } from "./stretchLayout";
import { LOGOS, WORK } from "./work";

/**
 * The circle a project opens and closes through. A soft-edged lens holds the
 * project's colour with its logo at the exact size it has on the card, so the
 * move reads as the card itself opening. It lives on <body> to outlast the page
 * it starts on; Template skips its own sheet while data-lens is set.
 */

const DURATION = 0.95;
const FADE = 0.45; // lens to page, and page to lens

function makeLens(card) {
  const root = document.documentElement;
  const stage = document.querySelector(".work-stage");
  const { halfW } = stretchLayout(stage?.clientWidth ?? window.innerWidth, stage?.clientHeight ?? window.innerHeight);
  const el = document.createElement("div");
  el.className = "lens";
  el.style.setProperty("--tone", card.tone);
  const logo = new Image();
  logo.src = LOGOS[card.slug].src;
  logo.alt = "";
  logo.style.width = `${halfW * 2 * LOGOS[card.slug].width}px`;
  el.append(logo);
  document.body.append(el);
  root.dataset.lens = "";
  window.lenis?.stop();

  const reach = Math.hypot(window.innerWidth, window.innerHeight) / 2;
  const soft = reach * 0.18;
  el.style.setProperty("--soft", `${soft}px`);
  return {
    el,
    full: reach + soft,
    radius: (r) => el.style.setProperty("--r", `${r}px`),
    done() {
      el.remove();
      delete root.dataset.lens;
      window.lenis?.start();
    },
  };
}

// Resolves when `ready` is true, or gives up after a few seconds rather than
// leaving the visitor behind the lens.
function until(ready, then) {
  const giveUp = performance.now() + 4000;
  const wait = () => (ready() || performance.now() > giveUp ? then() : requestAnimationFrame(wait));
  wait();
}

/** Card to case study: the circle grows out of the logo. */
export function openLens(card, go) {
  const lens = makeLens(card);
  const state = { r: 0 };
  gsap.to(state, {
    r: lens.full,
    duration: DURATION,
    ease: "power2.inOut",
    onUpdate: () => lens.radius(state.r),
    onComplete: () => {
      go();
      until(
        () => window.location.pathname === card.link,
        () => gsap.to(lens.el, { autoAlpha: 0, duration: FADE, delay: 0.1, onComplete: lens.done }),
      );
    },
  });
}

/** Case study back to home: the reverse, closing onto that project's card. */
export function closeLens(card, go) {
  const lens = makeLens(card);
  lens.radius(lens.full);
  window.lensReturn = WORK.findIndex((w) => w.slug === card.slug); // SelectedWork lands on this card
  gsap.from(lens.el, {
    autoAlpha: 0,
    duration: FADE,
    onComplete: () => {
      go();
      until(
        () => window.lensReturn === undefined,
        () => {
          const state = { r: lens.full };
          gsap.to(state, {
            r: 0,
            duration: DURATION,
            delay: 0.1,
            ease: "power2.inOut",
            onUpdate: () => lens.radius(state.r),
            onComplete: lens.done,
          });
        },
      );
    },
  });
}
