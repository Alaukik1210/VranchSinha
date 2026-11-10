"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, MotionConfig } from "motion/react";
import { CONTACT } from "@/lib/work";
import { markHint } from "@/lib/useHint";
import Hint from "./Hint";
import PeelSticker from "./PeelSticker";

const EASE = [0.22, 1, 0.36, 1];

const TITLE = [
  { t: "Hey, I’m Vranch.", mute: false },
  { t: "Always on brand.", mute: false },
  { t: "Rarely on script.", mute: true },
];

// Off the clock icons, drawn like SF Symbols: one 24-unit grid, one 1.5
// stroke, round caps and joins, solid panels and note heads. They take the
// text colour. The ball's rim panels are clipped by the ball itself.
const BALL = (
  <>
    <clipPath id="about-ball-clip">
      <circle cx="12" cy="12" r="8.6" />
    </clipPath>
    <g clipPath="url(#about-ball-clip)" fill="currentColor" stroke="none">
      <path d="M12.00 9.00L14.85 11.07L13.76 14.43L10.24 14.43L9.15 11.07z" />
      <path d="M15.76 6.82L14.67 3.47L17.53 1.40L20.38 3.47L19.29 6.82zM18.09 13.98L20.94 11.90L23.79 13.98L22.70 17.33L19.18 17.33zM12.00 18.40L14.85 20.47L13.76 23.83L10.24 23.83L9.15 20.47zM5.91 13.98L4.82 17.33L1.30 17.33L0.21 13.98L3.06 11.90zM8.24 6.82L4.71 6.82L3.62 3.47L6.47 1.40L9.33 3.47z" />
    </g>
    <path
      d="M12.00 9.00L12.00 6.50M12.00 6.50L15.76 6.82M12.00 6.50L8.24 6.82M14.85 11.07L17.23 10.30M17.23 10.30L18.09 13.98M17.23 10.30L15.76 6.82M13.76 14.43L15.23 16.45M15.23 16.45L12.00 18.40M15.23 16.45L18.09 13.98M10.24 14.43L8.77 16.45M8.77 16.45L5.91 13.98M8.77 16.45L12.00 18.40M9.15 11.07L6.77 10.30M6.77 10.30L8.24 6.82M6.77 10.30L5.91 13.98"
      strokeWidth="1.2"
    />
    <circle cx="12" cy="12" r="8.6" />
  </>
);

const NOTE = (
  <>
    <path d="M8.7 6.6l11-2.5v2.9l-11 2.5z" fill="currentColor" stroke="none" />
    <path d="M9.45 7.4v10M18.95 5v10" strokeLinecap="butt" />
    <ellipse
      cx="7"
      cy="17.4"
      rx="2.75"
      ry="2.15"
      transform="rotate(-18 7 17.4)"
      fill="currentColor"
      stroke="none"
    />
    <ellipse
      cx="16.5"
      cy="15"
      rx="2.75"
      ry="2.15"
      transform="rotate(-18 16.5 15)"
      fill="currentColor"
      stroke="none"
    />
  </>
);

function Glyph({ glyph, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph}
    </svg>
  );
}

// Off the clock. Music opens the Apple Music profile.
const ALSO = [
  {
    what: "Football",
    note: "First love. Design knows.",
    glyph: BALL,
  },
  {
    what: "Music",
    note: "Something’s always playing",
    glyph: NOTE,
    href: CONTACT.appleMusic,
  },
];

// One of each colour: the smiley sits on the face, the rest are slapped on and
// around the polaroid, clear of the text. As % of the polaroid's box: l/t/w on
// desktop, m* on the stacked phone layout. Each can be peeled off and stuck
// anywhere in the section.
const STICKERS = [
  { kind: "star", l: -16, t: -9, w: 32, ml: -8, mt: -8, mw: 28, rotate: 8 },
  { kind: "globe", l: 72, t: -14, w: 44, ml: 66, mt: -10, mw: 38, rotate: 15 },
  { kind: "rays", l: -22, t: 46, w: 38, ml: -10, mt: 48, mw: 30, rotate: 6 },
  { kind: "pinwheel", l: 78, t: 50, w: 44, ml: 70, mt: 52, mw: 36, rotate: -6 },
  { kind: "blob", l: -10, t: 84, w: 34, ml: -6, mt: 88, mw: 28, rotate: 12 },
  { kind: "cross", l: 72, t: 92, w: 30, ml: 70, mt: 92, mw: 26, rotate: 22 },
  { kind: "smiley", l: 34, t: 16, w: 50, ml: 34, mt: 16, mw: 50, rotate: -10 },
];

export default function AboutSection() {
  const sectionRef = useRef(null);

  const rise = (i = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="about"
        aria-labelledby="about-title"
        className="about relative overflow-x-clip"
      >
        <div className="gutter grid gap-y-[calc(var(--u)*64)] py-[calc(var(--u)*112)] md:min-h-[100svh] md:grid-cols-12 md:items-center md:gap-x-8 md:py-[min(calc(var(--u)*80),8.5svh)]">
          <div className="md:col-span-7">
            <motion.p className="about-label" {...rise()}>
              (About)
            </motion.p>

            {/* Lines rise out of their own masks. The heading triggers them: a
              masked line never counts as "in view" by itself. */}
            <motion.h2
              id="about-title"
              className="about-title mt-[calc(var(--u)*20)]"
              initial="hide"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
            >
              {TITLE.map((l, i) => (
                <span key={l.t} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className={`block ${l.mute ? "text-[var(--eye-mute)]" : ""}`}
                    variants={{
                      hide: { y: "110%" },
                      show: {
                        y: "0%",
                        transition: {
                          duration: 1,
                          ease: EASE,
                          delay: i * 0.09,
                        },
                      },
                    }}
                  >
                    {l.t}
                  </motion.span>
                </span>
              ))}
            </motion.h2>

            <div className="about-body mt-[calc(var(--u)*28)] grid max-w-[56ch] gap-[0.9em]">
              <motion.p {...rise(1)}>
                People, words, art, anything I can mould into a different
                perspective ends up in the work. I design products and brands,
                and AI helps me build them, so what you see in the design is
                what goes live.
              </motion.p>
              <motion.p className="text-[var(--eye-mute)]" {...rise(2)}>
                Give me a brief and I’ll respect it. Mostly.
              </motion.p>
            </div>

            <motion.div
              className="mt-[calc(var(--u)*32)] max-w-[56ch]"
              {...rise(3)}
            >
              <p className="about-label text-[var(--eye-mute)]">
                Off the clock
              </p>
              <ul className="about-does mt-[calc(var(--u)*14)] grid grid-cols-2 gap-x-6">
                {ALSO.map(({ what, note, glyph, href }) => {
                  const body = (
                    <>
                      <Glyph className="about-also-icon" glyph={glyph} />
                      <span>
                        <span className="block">{what}</span>
                        {href ? (
                          // The note takes turns with where the link goes.
                          <span className="about-swap">
                            <span className="text-[var(--eye-mute)]">{note}</span>
                            <span className="about-swap-tag" aria-hidden="true">
                              <span className="hint-fine">Click</span>
                              <span className="hint-touch">Tap</span> to connect on Apple Music ↗
                            </span>
                          </span>
                        ) : (
                          <span className="block text-[var(--eye-mute)]">{note}</span>
                        )}
                      </span>
                    </>
                  );
                  return (
                    <li key={what}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="about-also"
                          data-pill="music.apple.com/profile/vranchsinha"
                          aria-label={`${what}: ${note}, on Apple Music`}
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="about-also">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>

          <div className="md:col-span-5 md:col-start-8 lg:col-span-5 lg:col-start-8">
            {/* Centred in the screen; capped by height too, so it always fits. */}
            <div className="relative mx-auto w-[82%] max-w-[min(calc(var(--u)*460),calc((100svh-calc(var(--u)*240))*0.82))] md:w-[92%] about-frame">
              <motion.div
                className="relative"
                initial="hide"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div
                  className="polaroid"
                  variants={{
                    hide: { opacity: 0, y: 70, rotate: -10 },
                    show: {
                      opacity: 1,
                      y: 0,
                      rotate: -3,
                      transition: { duration: 1.1, ease: EASE },
                    },
                  }}
                  style={{ rotate: -3 }}
                >
                  <div className="polaroid-photo">
                    <Image
                      src="/about/portrait.jpg"
                      alt="Vranch Sinha"
                      fill
                      sizes="(max-width: 768px) 80vw, 420px"
                      className="object-cover object-[62%_38%]"
                    />
                  </div>
                  <p className="polaroid-name">Vranch Sinha</p>
                </motion.div>

                {STICKERS.map((s, i) => (
                  <motion.div
                    key={`${s.kind}-${i}`}
                    data-sticker={s.kind}
                    className="sticker-slot"
                    style={{
                      "--l": `${s.l}%`,
                      "--t": `${s.t}%`,
                      "--w": `${s.w}%`,
                      "--ml": `${s.ml}%`,
                      "--mt": `${s.mt}%`,
                      "--mw": `${s.mw}%`,
                      zIndex: 20 + i,
                    }}
                    variants={{
                      hide: { scale: 1.5, opacity: 0 },
                      show: {
                        scale: 1,
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 420,
                          damping: 22,
                          delay: 0.75 + i * 0.08,
                        },
                      },
                    }}
                  >
                    <span className="contents" onPointerDown={() => markHint("peel")}>
                    <PeelSticker
                      kind={s.kind}
                      rotate={s.rotate}
                      className="h-full w-full"
                    />
                  </span>
                  </motion.div>
                ))}

                <Hint id="peel" target={"[data-sticker='rays']"} narrowTarget=".polaroid" side="left" narrow="top" at={1180}>
                  peel a sticker
                </Hint>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
