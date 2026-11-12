"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stretchLayout } from "@/lib/stretchLayout";
import Hint from "./Hint";
import { paintGlow } from "@/lib/cardGlow";
import { openLens } from "@/lib/lens";
import { markHint } from "@/lib/useHint";
import { LOGOS, SIDE, WORK } from "@/lib/work";

gsap.registerPlugin(ScrollTrigger);

/**
 * Selected work: the stretch carousel, pinned while the page scrolls through it.
 *
 * The section is as tall as the cards need and its inner stage sticks to the
 * viewport. ScrollTrigger turns scroll progress into carousel position and
 * snaps to a card, and the page carries on after the last one. Dragging,
 * sideways swipes and the arrow keys work too; whichever moved last, page
 * scroll is kept in step so nothing jumps.
 *
 * The list of links is the real content (search, screen readers, no WebGL);
 * the canvas is drawn from the same data.
 */

const CARDS = [
  ...WORK.map((p) => ({ ...p, link: `/work/${p.slug}`, tag: p.name })),
  { ...SIDE, link: SIDE.href, external: true, pill: SIDE.hrefLabel, tag: SIDE.title, note: "Personal project" },
];

const GROUND = "#fffefc";
const CARD_PX = [1024, 1280];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// A card face: the glow, a fine grain to keep it from banding, the logo.
function paintCard(logo, card, scale) {
  const [W, H] = CARD_PX;
  const c = document.createElement("canvas");
  c.width = W * scale;
  c.height = H * scale;
  const ctx = c.getContext("2d");
  ctx.scale(scale, scale);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(paintGlow(card.tone), 0, 0, W, H);

  const grain = ctx.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 7;
    grain.data[i] += n;
    grain.data[i + 1] += n;
    grain.data[i + 2] += n;
  }
  ctx.putImageData(grain, 0, 0);

  const w = W * LOGOS[card.slug].width;
  const h = (w * logo.naturalHeight) / logo.naturalWidth;
  ctx.drawImage(logo, (W - w) / 2, (H - h) / 2, w, h);
  return c;
}

export default function SelectedWork() {
  const router = useRouter();
  const sectionRef = useRef(null);
  const hostRef = useRef(null);
  const carouselRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [pastEnd, setPastEnd] = useState(false); // still pushing sideways on the last card

  useEffect(() => {
    const section = sectionRef.current;
    const host = hostRef.current;
    const cards = CARDS.length - 1;
    let alive = true;
    let carousel = null;
    let trigger = null;
    let moved = null;
    const first = stretchLayout(host.clientWidth, host.clientHeight);
    let step = first.step;
    // Where the centre card sits, for what's measured against it.
    const markCard = ({ halfW, halfH }) => {
      section.style.setProperty("--card-w", `${halfW * 2}px`);
      section.style.setProperty("--card-h", `${halfH * 2}px`);
    };
    markCard(first);

    // Reserve the full height now: anything below would shift when the carousel
    // loads, and a link straight to a later section has already jumped.
    section.style.setProperty("--work-travel", `${step * cards}px`);
    // A link to a later section keeps its place while the page finishes settling:
    // late layout shifts it, and ScrollTrigger's refresh restores an older scroll.
    const anchor = window.lensReturn === undefined && window.location.hash && document.querySelector(window.location.hash);
    const hold = () => {
      window.lenis?.resize();
      window.scrollTo({ top: anchor.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
    };
    const settling = new ResizeObserver(hold);
    const letGo = () => {
      settling.disconnect();
      ScrollTrigger.removeEventListener("refresh", hold);
    };
    if (anchor) {
      settling.observe(document.body);
      ScrollTrigger.addEventListener("refresh", hold);
      setTimeout(letGo, 8000);
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
        window.addEventListener(type, letGo, { once: true, passive: true });
      }
    }

    const sectionTop = () => section.getBoundingClientRect().top + window.scrollY;

    const scrollPage = (y, immediate) => {
      if (window.lenis) {
        window.lenis.resize(); // arriving from a shorter page, its limit is still the old one
        window.lenis.scrollTo(y, { immediate, force: true, duration: 0.6 });
      } else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
    };

    const touch = window.matchMedia("(hover: none)").matches;
    let pagedUntil = 0;
    let unhookTouch = null;
    // Touch: one swipe, one card. The page follows the finger, then settles on the
    // next card in the direction of the swipe, or leaves the section past either end.
    // A flick can't coast past projects, and no swipe is ever swallowed.
    if (touch) {
      let t = null;
      // The page is moved directly here, so the triggers are told each time.
      const to = (y) => {
        window.scrollTo({ top: y, behavior: "instant" });
        ScrollTrigger.update();
      };
      const ride = { y: 0 };
      const glide = (y) => {
        gsap.killTweensOf(ride);
        ride.y = window.scrollY;
        gsap.to(ride, { y, duration: 0.55, ease: "power2.out", onUpdate: () => to(ride.y) });
      };
      const onStart = (e) => {
        gsap.killTweensOf(ride);
        const p = e.touches[0];
        t = e.touches.length === 1 ? { x: p.clientX, y: p.clientY, from: window.scrollY, axis: null, dy: 0 } : null;
      };
      const onMove = (e) => {
        if (!t) return;
        const p = e.touches[0];
        const dx = p.clientX - t.x;
        const dy = p.clientY - t.y;
        if (!t.axis) {
          if (Math.hypot(dx, dy) < 8) return;
          t.axis = Math.abs(dy) > Math.abs(dx) ? "y" : "x";
        }
        if (t.axis !== "y") return;
        e.preventDefault();
        pagedUntil = performance.now() + 1200;
        t.dy = dy;
        to(t.from - dy);
      };
      const onEnd = () => {
        if (!t || t.axis !== "y") {
          t = null;
          return;
        }
        const top = sectionTop();
        const card = Math.round((t.from - top) / step);
        const next = card + (Math.abs(t.dy) < 24 ? 0 : t.dy < 0 ? 1 : -1);
        const leave = window.innerHeight * 0.6;
        pagedUntil = performance.now() + 1200;
        glide(next < 0 ? top - leave : next > cards ? top + cards * step + leave : top + next * step);
        t = null;
      };
      host.addEventListener("touchstart", onStart, { passive: true });
      host.addEventListener("touchmove", onMove, { passive: false });
      host.addEventListener("touchend", onEnd);
      host.addEventListener("touchcancel", onEnd);
      unhookTouch = () => {
        host.removeEventListener("touchstart", onStart);
        host.removeEventListener("touchmove", onMove);
        host.removeEventListener("touchend", onEnd);
        host.removeEventListener("touchcancel", onEnd);
      };
    }

    const onKey = (e) => {
      const { top, bottom } = section.getBoundingClientRect();
      if (!carousel || top > 2 || bottom < window.innerHeight || e.metaKey || e.ctrlKey || e.altKey) return; // pinned, its first and last card included
      if (e.key === "ArrowRight") carousel.go(1);
      else if (e.key === "ArrowLeft") carousel.go(-1);
    };

    const boot = async () => {
      const [{ createStretchCarousel, isLightDevice, isTouchScreen }, logos] = await Promise.all([
        import("@/lib/stretchCarousel"),
        Promise.all(CARDS.map((c) => loadImage(LOGOS[c.slug].src))),
      ]);
      if (!alive) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // A phone's card is a few hundred pixels across, so the full face is plenty.
      const scale = isLightDevice() ? 0.75 : isTouchScreen() || window.devicePixelRatio < 1.5 ? 1 : 1.25;
      const faces = logos.map((logo, i) => paintCard(logo, CARDS[i], scale));
      carousel = createStretchCarousel(host, faces, {
        bg: GROUND,
        reduceMotion,
        onIndex: (i) => {
          setIndex(i);
          if (i !== CARDS.length - 1) setPastEnd(false); // back off the end: wait for another push
        },
        pills: CARDS.map((c) => c.pill),
        onLayout: ({ step: s }) => {
          markCard(stretchLayout(host.clientWidth, host.clientHeight));
          if (s === step) return;
          step = s;
          section.style.setProperty("--work-travel", `${step * cards}px`);
          ScrollTrigger.refresh();
        },
        // Page scroll follows, so the next scroll carries on from this card.
        onPastEnd: () => setPastEnd(true),
        onRelease: (card) => {
          markHint("work");
          scrollPage(sectionTop() + card * step, Boolean(trigger?.isActive));
        },
        onOpen: (i) => {
          const card = CARDS[i];
          const go = () => router.push(card.link);
          if (card.external) window.open(card.link, "_blank", "noopener,noreferrer");
          else if (reduceMotion) go();
          else if (!document.querySelector(".lens")) openLens(card, go);
        },
        onLost: () => setFailed(true),
      });
      carouselRef.current = carousel;
      CARDS.forEach((c) => c.external || router.prefetch(c.link));

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          carousel.scrollTo(self.progress * cards);
          if (self.progress > 0.12) markHint("work");
        },
        // On a touch screen swipes on the cards are paged by hand (below); the snap only
        // straightens momentum that comes to rest inside the section, towards its heading.
        snap: {
          // While a swipe's own glide runs, the snap stands aside.
          snapTo: (v, self) => {
            if (performance.now() < pagedUntil) return v;
            const at = v * cards;
            // Already on a card (a return from a project, say): stay on it. Only a stop in
            // between follows the direction it came from.
            if (!touch || Math.abs(at - Math.round(at)) < 0.15) return Math.round(at) / cards;
            return (self.direction > 0 ? Math.ceil(at) : Math.floor(at)) / cards;
          },
          delay: touch ? 0.35 : 0.13,
          duration: { min: 0.25, max: 0.6 },
          ease: "power2.out",
        },
      });

      carousel.scrollTo(trigger.progress * cards); // arriving part-way down the section

      // Scrolled well on past the projects: the way down has been found.
      moved = ScrollTrigger.create({ trigger: section, start: "bottom 60%", onEnter: () => markHint("down") });



      // Back from a case study: be on that project's card before the lens closes.
      const back = window.lensReturn;
      if (back !== undefined) {
        scrollPage(sectionTop() + back * step, true);
        carousel.jumpTo(back);
        delete window.lensReturn;
      }
    };

    // Nothing loads until the section is close, so the hero has the page to itself.
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        boot().catch(() => alive && setFailed(true));
      },
      { rootMargin: "120% 0px" },
    );
    near.observe(section);
    window.addEventListener("keydown", onKey);

    return () => {
      alive = false;
      letGo();
      near.disconnect();
      trigger?.kill();
      moved?.kill();
      window.removeEventListener("keydown", onKey);
      unhookTouch?.();
      carousel?.dispose();
      carouselRef.current = null;
    };
  }, [router]);

  // The plain fallback is far shorter, so everything below has moved.
  useEffect(() => {
    if (failed) ScrollTrigger.refresh();
  }, [failed]);

  return (
    <section ref={sectionRef} id="work" aria-labelledby="work-title" className={`work ${failed ? "is-plain" : ""}`}>
      <div className="work-stage">
        <div ref={hostRef} className="work-host" aria-hidden="true" />

        <div className="work-chrome gutter">
          <h2 id="work-title" className="work-title">
            Look through my lens
          </h2>
          <p className="about-label flex gap-[calc(var(--u)*28)]">
            <span>(Selected work)</span>
            <span className="tabular-nums" aria-hidden="true">
              ({String(index + 1).padStart(2, "0")}/{String(CARDS.length).padStart(2, "0")})
            </span>
          </p>
        </div>

        <span className="work-slot" aria-hidden="true" />
        <Hint id="work" target=".work-slot" side="top" fallback="bottom" avoid=".work-chrome, .work-tag, .glass-pill">
          scroll, or drag the cards
        </Hint>

        <Hint id="down" className={`hint-down ${pastEnd && index === CARDS.length - 1 ? "is-on" : ""}`}>
          scroll down to explore more
        </Hint>

        <p key={index} className="work-tag about-label">
          {CARDS[index].note ? <small>{CARDS[index].note}</small> : null}({CARDS[index].tag})
        </p>

        <ol className="work-list gutter">
          {CARDS.map((c, i) => (
            <li key={c.slug}>
              <a
                href={c.link}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onFocus={() => carouselRef.current?.show(i)}
              >
                <span className="block">{c.name}</span>
                <span className="block text-[var(--eye-mute)]">{c.kind}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
