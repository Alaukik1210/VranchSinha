"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import { closeLens, rememberCard } from "@/lib/lens";
import { useRise } from "@/lib/useRise";
import { CONTACT, SIDE } from "@/lib/work";
import Mockup from "./Mockup";

// Pairs sit side by side, so a third image goes full width on its own row.
function Media({ p, ids, onOpen }) {
  const { screens } = p;
  const rows = [];
  for (let i = 0; i < ids.length; i += 2) rows.push(ids.slice(i, i + 2));
  return rows.map((row) => (
    <div key={row[0]} className={`story-media story-rise ${row.length === 2 ? "is-pair" : ""}`} style={{ "--pair": p.pairRatio }}>
      {row.map((i) => {
        const s = screens[i];
        return (
          <button key={s.src} type="button" className="story-panel" aria-label={`Enlarge: ${s.title}`} onClick={() => onOpen(i)}>
            {p.frame ? (
              <Mockup src={s.src} w={s.w} h={s.h} title={s.title} tone={p.tone} wide={row.length === 1} kind={p.device || (i % 2 ? "display" : "laptop")} />
            ) : (
              <Image src={s.src} alt={s.title} width={s.w} height={s.h} sizes="(max-width: 760px) 100vw, 720px" />
            )}
          </button>
        );
      })}
    </div>
  ));
}

export default function CaseStudyPage({ p, others }) {
  const { story, screens } = p;
  const root = useRef(null);
  const router = useRouter();
  const [open, setOpen] = useState(null);

  const goBack = (e) => {
    if (e.metaKey || e.ctrlKey || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    if (!document.querySelector(".lens")) closeLens(p, () => router.push("/", { scroll: false }));
  };

  useRise(root);
  useEffect(() => rememberCard(p.slug), [p.slug]); // the browser's back button lands on this card

  return (
    <>
      <div className="story-fade" aria-hidden="true" />
      <Link href="/#work" className="story-back" aria-label="Back to all work" onClick={goBack}>
        <ArrowLeft size={17} />
      </Link>

      <article ref={root} className="story">
        <p className="story-tag story-rise">
          {p.roles[0]} | {p.name}
        </p>
        <h1 className="story-rise mt-[calc(var(--u)*14)]">{story.title}</h1>
        <div className="story-rise mt-[calc(var(--u)*14)]">
          {story.lead.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
        <Media p={p} ids={story.media} onOpen={setOpen} />

        {story.sections.map((s) => (
          <section key={s.h} className="story-block">
            <div className="story-rise">
              <h2>{s.h}</h2>
              <div className="mt-[calc(var(--u)*10)]">
                {s.p.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </div>
            {s.media ? <Media p={p} ids={s.media} onOpen={setOpen} /> : null}
            {s.metrics ? (
              <dl className="story-stats story-rise">
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="sr-only">{m.label}</dt>
                    <dd>
                      <b>{m.value}</b>
                      {m.label}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </section>
        ))}

        {story.reflections ? (
          <section className="story-block">
            <h2 className="story-rise">Reflections</h2>
            {story.reflections.map((r) => (
              <div key={r.h} className="story-rise mt-[calc(var(--u)*20)]">
                <h3>{r.h}</h3>
                <p>{r.p}</p>
              </div>
            ))}
          </section>
        ) : null}

        {p.href ? (
          <p className="story-block story-rise">
            <a href={p.href} target="_blank" rel="noopener noreferrer" data-pill={p.hrefLabel} className="text-[var(--eye-ink)] underline underline-offset-4">
              Visit the website
            </a>
          </p>
        ) : null}

        <section className="story-block">
          <h2 className="story-rise">Other projects</h2>
          <ul className="story-others story-rise mt-[calc(var(--u)*10)]">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/work/${o.slug}`}>
                  <span>{o.story.title}</span>
                  <span className="story-tag">{o.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <a href={SIDE.href} data-pill={SIDE.hrefLabel} target="_blank" rel="noopener noreferrer">
                <span>{SIDE.title}</span>
                <span className="story-tag">{SIDE.name}</span>
              </a>
            </li>
          </ul>
        </section>

        <footer className="story-foot story-tag">
          <span>© {new Date().getFullYear()} Vranch Sinha</span>
          <span className="flex gap-5">
            <a href={`mailto:${CONTACT.email}`} data-pill={CONTACT.email}>
              Email
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" data-pill="linkedin.com/in/vranchsinha">
              LinkedIn
            </a>
          </span>
        </footer>
      </article>

      <Lightbox items={screens} index={open} onClose={() => setOpen(null)} accent={p.tone} />
    </>
  );
}
