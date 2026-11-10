"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markHint } from "@/lib/useHint";
import { lensAt, moveLens, onLensChange, openLens, warmLens } from "@/lib/visionLens";
import { CONTACT, EXPERIENCE, SIDE, WORK } from "@/lib/work";
import Hint from "./Hint";
import Mark from "./Mark";
import { IMAGES } from "./References";

gsap.registerPlugin(ScrollTrigger);

/**
 * The sign-off, and the site's footer: the visitor checks out. The last screen
 * comes up black and scrolling pulls a receipt out of a printer: the whole site,
 * printed section by section from real stills, moving one to one with the scroll.
 * Stop part-way and a note says to carry on. Once it's all out it cuts and the camera
 * pushes in by itself on the foot of the bill, where "Have a nice day!" would be. That line opens the cursor into
 * the big eye, a lens onto the bill's other side: a project card with the line in red
 * and the details in white. It opens anywhere on the bill, and the details stay live under it.
 *
 * The stylesheet's resting state is the end of the film, so a link straight here,
 * reduced motion and no JavaScript all simply land on it. The scroll distance the film
 * needed is given back when it ends; "Print again?" feeds the bill back in and borrows
 * it again.
 */

const WORK_ITEMS = [...WORK, SIDE];

const PRINT = [
  { still: "hero", title: "Intro", qty: 1, lines: [["Change the outcome,", ""], ["shift the perspective", ""]] },
  { still: "work", title: "Look through my lens", qty: WORK_ITEMS.length, lines: WORK_ITEMS.map((w) => [w.name, "1"]) },
  { still: "about", title: "About", qty: 1, lines: [["Always on brand.", ""], ["Rarely on script.", ""]] },
  { still: "direction", title: "Direction", qty: EXPERIENCE.length, lines: EXPERIENCE.map((e) => [`${e.role}, ${e.org}`, "1"]) },
  { still: "candy", title: "Eye candy", qty: IMAGES.length, lines: [["References", String(IMAGES.length)]] },
];
const ITEMS = PRINT.reduce((sum, p) => sum + p.qty, 0);

const LINKS = [
  { label: "LinkedIn", href: CONTACT.linkedin, pill: "linkedin.com/in/vranchsinha" },
  { label: "Resume", href: CONTACT.resume, pill: "Open the resume" },
];

// Bars drawn from the email address, so the code at least says something.
const BARS = (() => {
  const bars = [];
  let x = 0;
  for (const ch of CONTACT.email) {
    const c = ch.charCodeAt(0);
    for (const w of [1 + (c % 3), 1 + ((c >> 2) % 4)]) {
      bars.push(`M${x} 0h${w}v20h-${w}z`);
      x += w + 1 + ((c >> 1) % 3);
    }
  }
  return { d: bars.join(""), width: x };
})();

const pad = (n) => String(n).padStart(2, "0");

export default function SignOff() {
  const billRef = useRef(null);
  const cameraRef = useRef(null);
  const paperRef = useRef(null);
  const printerRef = useRef(null);
  const nudgeRef = useRef(null);
  const againRef = useRef(null);
  const bladeRef = useRef(null);
  const closerRef = useRef(null);
  const stampRef = useRef(null);

  useEffect(() => {
    const bill = billRef.current;
    const camera = cameraRef.current;
    const paper = paperRef.current;
    const printer = printerRef.current;
    const nudge = nudgeRef.current;
    const blade = bladeRef.current;
    const tag = [...bill.querySelectorAll(".bill-tag")];
    const [date, time, spent] = stampRef.current.querySelectorAll("[data-stamp]");

    onLensChange((on) => {
      bill.classList.toggle("is-looking", on);
      if (!on) bill.classList.remove("is-open", "is-lens");
      if (on) markHint("closer");
    });

    // The bill is made out at the moment it prints.
    const stamp = () => {
      const now = new Date();
      const seconds = Math.round(performance.now() / 1000);
      date.textContent = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      time.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      spent.textContent = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
    };
    stamp();

    // The nav is set for the light ground; here it sits on black.
    const dark = ScrollTrigger.create({
      trigger: bill,
      start: "top 56px",
      end: "bottom top",
      onToggle: (self) => document.documentElement.toggleAttribute("data-on-bill", self.isActive),
    });
    const cleanDark = () => {
      dark.kill();
      document.documentElement.removeAttribute("data-on-bill");
    };

    // Keyboard: a tap anywhere else shuts the eye. On a touch screen the eye is a thing
    // to play with: drag it around the bill, and close it with the button. A tap that
    // doesn't move still reaches the link under it.
    let hold = null;
    const onDown = (e) => {
      if (bill.classList.contains("is-lens")) {
        if (e.target.closest(".bill-exit")) return;
        const at = lensAt();
        hold = { id: e.pointerId, x: e.clientX, y: e.clientY, lx: at.x, ly: at.y, moved: false };
        return;
      }
      if (bill.classList.contains("is-open") && !closerRef.current.contains(e.target)) {
        bill.classList.remove("is-open");
        openLens(false);
      }
    };
    const onMove = (e) => {
      if (!hold || e.pointerId !== hold.id) return;
      const dx = e.clientX - hold.x;
      const dy = e.clientY - hold.y;
      if (!hold.moved && Math.hypot(dx, dy) < 6) return;
      hold.moved = true;
      bill.dataset.dragged = "";
      const x = Math.min(window.innerWidth, Math.max(0, hold.lx + dx));
      const y = Math.min(window.innerHeight, Math.max(0, hold.ly + dy));
      moveLens(x, y);
    };
    const onUp = (e) => {
      if (!hold || e.pointerId !== hold.id) return;
      hold = null;
      setTimeout(() => delete bill.dataset.dragged); // after the click it would have made
    };
    const onClickCapture = (e) => {
      if (bill.dataset.dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    bill.addEventListener("click", onClickCapture, true);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.addEventListener("pointerdown", onDown);
    const cleanUp = () => {
      cleanDark();
      document.removeEventListener("pointerdown", onDown);
      bill.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      openLens(false);
      onLensChange(null);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bill.classList.add("is-still");
      return () => {
        cleanUp();
        bill.classList.remove("is-still");
      };
    }

    const START = 0.66; // how far out the camera starts
    const arrow = [...bill.querySelectorAll(".bill-tag path")].filter((p) => p.getBoundingClientRect().width);
    let pull = null;
    let tail = null;
    let back = null;
    let end = 0; // where the paper stops, fully out
    let idle = 0;
    let width = window.innerWidth;
    const inFilm = () => bill.classList.contains("is-film");

    const quiet = () => {
      clearTimeout(idle);
      nudge.classList.remove("is-on");
    };
    const waitForStop = () => {
      quiet();
      idle = setTimeout(() => pull?.scrollTrigger?.isActive && nudge.classList.add("is-on"), 1100);
    };

    // The film is over: hand back the scroll it borrowed. The stage is stuck to the top
    // of the screen, so taking the distance away moves nothing on screen.
    const finish = () => {
      const top = bill.getBoundingClientRect().top + window.scrollY;
      const past = window.scrollY > top;
      bill.classList.remove("is-film");
      gsap.set([camera, paper, printer, blade, tag, ...arrow], { clearProps: "all" });
      window.lenis?.resize();
      if (past) {
        if (window.lenis) window.lenis.scrollTo(top, { immediate: true, force: true });
        else window.scrollTo({ top, behavior: "instant" });
      }
      ScrollTrigger.refresh();
      warmLens();
    };

    // Taken over just before the paper runs out, so the last of it feeds out by itself
    // and runs straight into the push-in, with no stop between the scroll and the film.
    const cut = () => {
      if (tail) return;
      const em = parseFloat(getComputedStyle(bill).fontSize);
      pull.scrollTrigger.kill(false, true);
      pull.pause();
      quiet();
      arrow.forEach((p) => {
        const length = p.getTotalLength();
        gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
      });
      tail = gsap
        .timeline({ onComplete: finish })
        // The last of the paper feeds out and settles, its end still in the slot.
        .to(paper, { y: end, duration: 0.55, ease: "power1.out" }, 0)
        // The blade crosses the slot. The printer takes the jolt, and the paper drops free
        // of it with its torn edge showing, the first time that edge is seen.
        .fromTo(blade, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.24, ease: "power2.inOut" }, 0.44)
        .to(blade, { opacity: 0, duration: 0.18, ease: "power1.out" }, 0.68)
        .to(printer, { y: 2, duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" }, 0.66)
        .to(paper, { y: end - 1.3 * em, duration: 0.38, ease: "back.out(1.7)" }, 0.66)
        // The push-in, down to the foot of the bill, already easing in underneath.
        .to(camera, { scale: 1, rotationX: 0, rotationZ: 0, duration: 2.1, ease: "power3.inOut" }, 0.42)
        .to(paper, { y: 0, duration: 1.5, ease: "power3.inOut" }, 1.04)
        .to(printer, { yPercent: 130, duration: 1.1, ease: "power3.in" }, 0.95)
        // Then the little note.
        .fromTo(tag, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 2.6)
        .to(arrow, { strokeDashoffset: 0, duration: 0.45, ease: "power2.inOut", stagger: 0.3 }, 2.72);
    };

    const measure = () => {
      const em = parseFloat(getComputedStyle(bill).fontSize);
      const showing = printer.offsetHeight + parseFloat(getComputedStyle(printer).bottom); // how much of it stands in frame
      const lift = showing - 0.5 * em - parseFloat(getComputedStyle(paper).bottom); // its end, just inside the slot
      const travel = Math.round(paper.offsetHeight * START); // so the paper moves with the scroll, one to one
      bill.style.setProperty("--pull", `${travel}px`);
      return { lift, travel, hidden: paper.offsetHeight - lift + 4 * em };
    };

    const build = () => {
      pull?.scrollTrigger?.kill();
      pull?.kill();
      const { lift, travel, hidden } = measure();
      const rise = window.innerHeight * 0.6;
      end = -lift;

      gsap.set(camera, { transformOrigin: "50% 100%", transformPerspective: 1500, scale: START, rotationX: 15, rotationZ: -1.6, willChange: "transform" });
      gsap.set(paper, { y: hidden, willChange: "transform" });
      gsap.set(printer, { visibility: "visible", yPercent: 100 });

      pull = gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: bill,
            start: "top 60%",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
              if (self.progress >= 0.93) cut();
              else if (self.progress > 0.02) waitForStop();
              else quiet();
            },
            onEnter: stamp,
            onLeaveBack: quiet,
          },
        })
        .to(printer, { yPercent: 0, duration: rise, ease: "power3.out" }, 0)
        .to(paper, { y: -lift, duration: travel }, rise)
        .to(camera, { scale: START * 1.05, rotationX: 10, rotationZ: -0.5, duration: travel }, rise);
      ScrollTrigger.refresh();
      if (pull.scrollTrigger) pull.progress(pull.scrollTrigger.progress); // already part-way in: no catching up
    };

    // Everything the film did, undone: the camera backs out and the bill feeds back in.
    // It ends exactly where the pull begins, so the next scroll carries straight on.
    const reprint = () => {
      if (inFilm()) return;
      openLens(false);
      tail = null;
      const { lift, hidden } = measure();
      bill.classList.add("is-film");
      stamp();
      gsap.set(camera, { transformOrigin: "50% 100%", transformPerspective: 1500, willChange: "transform" });
      gsap.set(paper, { willChange: "transform" });
      gsap.set(printer, { visibility: "visible", yPercent: 130 });
      back = gsap
        .timeline({ onComplete: build })
        .to(tag, { autoAlpha: 0, duration: 0.2 }, 0)
        .to(camera, { scale: START, rotationX: 15, rotationZ: -1.6, duration: 1.5, ease: "power3.inOut" }, 0)
        .to(paper, { y: -lift, duration: 1.5, ease: "power3.inOut" }, 0)
        .to(printer, { yPercent: 0, duration: 1, ease: "expo.out" }, 0.5)
        .to(paper, { y: hidden, duration: 1.2, ease: "power2.inOut" }, 1.45);
    };

    if (window.location.hash !== "#contact") {
      bill.classList.add("is-film");
      gsap.set(tag, { autoAlpha: 0 });
      build();
      document.fonts?.ready.then(() => inFilm() && !tail && !back?.isActive() && build());
    } else {
      setTimeout(warmLens, 1500); // arrived straight on the finished bill
    }

    // Anyone who came for the contact details can hurry the ending along.
    const hurry = () => tail?.isActive() && tail.timeScale(3);
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      if (back?.isActive()) back.progress(1);
      else if (tail?.isActive()) tail.progress(1);
      else if (inFilm()) build();
    };
    const again = againRef.current;
    again.addEventListener("click", reprint);
    bill.addEventListener("pointerdown", hurry);
    window.addEventListener("resize", onResize);

    return () => {
      cleanUp();
      quiet();
      pull?.scrollTrigger?.kill();
      pull?.kill();
      tail?.kill();
      back?.kill();
      again.removeEventListener("click", reprint);
      bill.removeEventListener("pointerdown", hurry);
      window.removeEventListener("resize", onResize);
      bill.classList.remove("is-film");
      bill.style.removeProperty("--pull");
      gsap.set([camera, paper, printer, blade, tag, ...arrow], { clearProps: "all" });
    };
  }, []);

  // Pointer: the cursor does the opening. Keyboard gets the eye held on the line. On
  // touch, a tap on the line opens it to play with, until "Close preview".
  const open = (on, play = false) => {
    billRef.current.classList.toggle("is-open", on);
    billRef.current.classList.toggle("is-lens", on && play);
    openLens(on, true);
  };
  const touch = () => !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <footer ref={billRef} aria-labelledby="bill-title" className="bill">
      <h2 id="bill-title" className="sr-only">
        Ready to shift your perspective? Let’s connect.
      </h2>
      <div className="bill-stage">
      <div ref={cameraRef} className="bill-camera">
        <div
          ref={paperRef}
          className="bill-paper"
          data-vision
          onClick={(e) => {
            if (!touch() && !e.target.closest("a")) window.location.href = `mailto:${CONTACT.email}`;
          }}
        >
          <div className="bill-look">
            <header className="bill-head">
              <Mark className="bill-mark" stroke="currentColor" star="currentColor" weight={6} />
              <p className="bill-name">Vranch Sinha</p>
              <p>Product &amp; brand designer</p>
            </header>
            <div className="bill-rule" />
            <div ref={stampRef}>
              <p className="bill-row">
                <span>Date</span>
                <span data-stamp />
              </p>
              <p className="bill-row">
                <span>Time</span>
                <span data-stamp />
              </p>
              <p className="bill-row">
                <span>Time spent here</span>
                <span data-stamp />
              </p>
            </div>
            <div className="bill-rule" />
            <p className="bill-row">
              <span>Item</span>
              <span>Qty</span>
            </p>
            {PRINT.map((p) => (
              <section key={p.still} className="bill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="bill-still" src={`/receipt/${p.still}.png`} alt="" width={880} height={p.still === "candy" ? 508 : 550} />
                <h3 className="bill-row">
                  <span>{p.title}</span>
                  <span>{p.qty}</span>
                </h3>
                {p.lines.map(([label, qty]) => (
                  <p key={label} className="bill-row bill-sub">
                    <span>{label}</span>
                    <span>{qty}</span>
                  </p>
                ))}
              </section>
            ))}
            <div className="bill-rule" />
            <p className="bill-row">
              <span>Items</span>
              <span>{ITEMS}</span>
            </p>
            <p className="bill-row">
              <span>Paid in</span>
              <span>Attention</span>
            </p>
            <p className="bill-row">
              <span>Change</span>
              <span>A new perspective</span>
            </p>
            <div className="bill-rule" />
            <div className="bill-closing">
              <a
                ref={closerRef}
                href={`mailto:${CONTACT.email}`}
                aria-label={`Curious? Take a closer look. Ready to shift your perspective? Let’s connect: email ${CONTACT.email}`}
                className="bill-closer"
                onFocus={(e) => e.target.matches(":focus-visible") && open(true)}
                onBlur={() => open(false)}
                onClick={(e) => {
                  if (!touch() || billRef.current.classList.contains("is-open")) return;
                  e.preventDefault();
                  open(true, true);
                }}
              >
                Curious? Take a closer <span className="bill-look-word">look</span>.
              </a>
              <span className="bill-tag is-on-paper">
                <Hint id="closer" className="hint-closer">
                  tap
                </Hint>
              </span>
            </div>
            <div className="bill-rule" />
          </div>
          <div className="bill-end">
              <p className="bill-name">Vranch Sinha</p>
              <div className="bill-contact">
              <a href={`mailto:${CONTACT.email}`} data-pill={CONTACT.email}>
                {CONTACT.email}
              </a>
              <p className="bill-links">
                {LINKS.map((l) => (
                  <a key={l.label} href={l.href} data-pill={l.pill} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                ))}
              </p>
              </div>
              <svg className="bill-code" viewBox={`0 0 ${BARS.width} 20`} preserveAspectRatio="none" aria-hidden="true">
                <path d={BARS.d} fill="currentColor" />
              </svg>
              <p className="bill-foot">© {new Date().getFullYear()} Vranch Sinha</p>
          </div>
        </div>
        <div ref={printerRef} className="bill-printer" aria-hidden="true">
          <span ref={bladeRef} className="bill-blade" />
          <span className="bill-led" />
        </div>
      </div>
      <div className="bill-shade" aria-hidden="true" />
      <span className="bill-tag is-beside">
        <Hint id="closer" className="hint-beside">
          hover the bill
        </Hint>
      </span>
      <button type="button" className="bill-exit about-label" onClick={() => open(false)}>
        Close preview
      </button>
      <button ref={againRef} type="button" className="bill-again about-label">
        Print again?
      </button>
      <span ref={nudgeRef} className="bill-nudge">
        <Hint id="checkout" className="hint-nudge" flip>
          keep scrolling
          <br />
          to checkout!
        </Hint>
      </span>
      </div>
      <span id="contact" className="bill-anchor" aria-hidden="true" />
    </footer>
  );
}
