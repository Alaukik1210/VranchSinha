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

function smallViewportHeight() {
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;top:0;height:100svh;visibility:hidden";
  document.body.append(probe);
  const h = probe.offsetHeight;
  probe.remove();
  return h;
}

function makeLens(card) {
  const root = document.documentElement;
  const stage = document.querySelector(".work-stage");
  const box = stage?.getBoundingClientRect(); // before anything below moves the page
  const stageH = stage?.clientHeight ?? smallViewportHeight(); // the stage is 100svh
  const { halfW } = stretchLayout(stage?.clientWidth ?? window.innerWidth, stageH);
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

  // Centred on the card itself. The stage is 100svh, so on a phone with its toolbar
  // tucked away the card sits above the middle of the window. Coming back there is
  // no stage yet, and the page will land with the stage pinned to the top.
  const w = window.innerWidth;
  const h = window.innerHeight;
  let cx = w / 2;
  let cy;
  if (box) {
    cx = box.left + box.width / 2;
    cy = box.top + box.height / 2;
  } else cy = stageH / 2;
  el.style.setProperty("--cx", `${cx}px`);
  el.style.setProperty("--cy", `${cy}px`);

  const reach = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)); // to the farthest corner
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
