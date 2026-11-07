"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { markHint } from "@/lib/useHint";
import { useRise } from "@/lib/useRise";
import { EXPERIENCE } from "@/lib/work";
import Hint from "./Hint";

const Arrow = () => (
  <svg className="sign-arrow" viewBox="0 0 60 28" aria-hidden="true">
    <path d="M2 14h54M44 3l12 11-12 11" />
  </svg>
);

// One sign, bolted to the post at its own angle. A tap is a push: whichever side of
// the post you press swings away from you, and the sign spins half a turn that way.
function Sign({ org, role, logo, note, glass, turn, flip }) {
  const [angle, setAngle] = useState(0);
  const turned = Math.abs(angle / 180) % 2 === 1;

  const push = (e) => {
    const { left, width } = e.currentTarget.closest(".sign-row").getBoundingClientRect();
    const keyboard = e.detail === 0; // Enter or Space has no position
    setAngle(angle + (keyboard || e.clientX >= left + width / 2 ? 180 : -180));
    markHint("sign");
  };
  return (
    <div className={`sign-row ${flip ? "is-left" : ""}`}>
      <div className="sign-mount" style={{ transform: `rotateY(${turn}deg) translateZ(14px)` }}>
        <button
          type="button"
          className={`sign ${turned ? "is-turned" : ""}`}
          style={{ "--g1": glass[0], "--g2": glass[1], "--g3": glass[2], transform: `rotateY(${angle}deg)` }}
          aria-pressed={turned}
          aria-label={`${role}, ${org}. ${turned ? note : "Turn for details"}`}
          onClick={push}
        >
          <span className="sign-face">
            <span className="sign-logo">
              <Image src={logo} alt="" width={96} height={96} />
            </span>
            <span className="sign-text">
              <span className="sign-role">{role}</span>
              <span className="sign-org">{org}</span>
            </span>
            <Arrow />
          </span>
          <span className="sign-face sign-back">
            <span className="sign-text">{note}</span>
            <Arrow />
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Leadership() {
  const root = useRef(null);
  useRise(root);
  return (
    <section ref={root} id="roles" aria-labelledby="roles-title" className="shelf gutter">
      <div className="shelf-head story-rise">
        <h2 id="roles-title" className="work-title">
          Direction
        </h2>
        <p className="about-label">(Leadership roles)</p>
      </div>
      <div className="signpost story-rise">
        <Hint id="sign" target=".sign-face:not(.sign-back) .sign-arrow" edge=".sign" side="right" narrow="top" at={1000}>
          push a sign
        </Hint>
        <div className="sign-stage">
          {/* The post stands behind the panels, clear of their planes: where a
              panel cuts through another layer the browser splits it, leaving seams. */}
          <div className="sign-rear" aria-hidden="true">
            <span className="sign-pole" />
            {EXPERIENCE.map((e) => (
              <span key={e.org} className="sign-slot">
                <span className="sign-collar is-top" />
                <span className="sign-collar is-bottom" />
              </span>
            ))}
          </div>
          {EXPERIENCE.map((e, i) => (
            <Sign key={e.org} {...e} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
