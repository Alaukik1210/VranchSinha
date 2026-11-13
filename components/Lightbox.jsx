"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Full-screen viewer for any set of images.
 *
 *   const [open, setOpen] = useState(null);   // index or null
 *   <Lightbox items={[{ src, title, tag }]} index={open} onClose={() => setOpen(null)} />
 *
 * Arrow keys / swipe to move, Esc or backdrop click to close. Pauses Lenis
 * while open so the page underneath doesn't scroll.
 */
export default function Lightbox({ items, index, onClose, accent = "#ffffff" }) {
  const open = index !== null && index !== undefined;
  const [current, setCurrent] = useState(index ?? 0);
  const [dir, setDir] = useState(0);
  // Portal target only exists on the client.
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  // Jump to whatever was clicked each time the viewer is (re)opened.
  const [openedAt, setOpenedAt] = useState(index);
  if (index !== openedAt) {
    setOpenedAt(index);
    if (open) setCurrent(index);
  }

  const go = useCallback(
    (step) => {
      setDir(step);
      setCurrent((c) => (c + step + items.length) % items.length);
    },
    [items.length]
  );

  // The phone's back button (or swipe) closes the viewer rather than leaving the page:
  // opening it adds a history entry, and closing it any other way takes that entry back.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ viewer: true }, "");
    let popped = false;
    const onPop = () => {
      popped = true;
      closeRef.current();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (!popped && window.history.state?.viewer) window.history.back();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    window.lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.lenis?.start();
      document.documentElement.style.overflow = prev;
    };
  }, [open, go, onClose]);

  if (!mounted) return null;

  const item = items[current];
  const many = items.length > 1;

  return createPortal(
    <AnimatePresence>
      {open && item ? (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? "Image viewer"}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100000] flex flex-col bg-black/90 backdrop-blur-xl text-white font-outfit"
          onClick={onClose}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6 text-xs sm:text-sm tracking-[0.2em] uppercase">
            <span className="text-gray-400 tabular-nums">
              {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <span aria-hidden="true" className="text-lg leading-none">×</span>
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-20 py-4">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img
                key={item.src}
                src={item.src}
                alt={item.title ?? ""}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir * -60, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag={many ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                draggable={false}
                // SVGs carry a small intrinsic size (the tag thumbnails are
                // 150px), so give them an explicit box to scale into.
                className={`max-w-full max-h-full object-contain rounded-xl select-none shadow-2xl ${
                  item.src.endsWith(".svg") ? "w-[min(86vw,66vh)] h-auto" : ""
                }`}
              />
            </AnimatePresence>

            {many ? (
              <>
                <NavButton side="left" onClick={() => go(-1)} />
                <NavButton side="right" onClick={() => go(1)} />
              </>
            ) : null}
          </div>

          {/* Caption */}
          <div className="px-5 sm:px-8 pb-6 sm:pb-8 flex items-baseline justify-between gap-4">
            <span className="font-funnel text-lg sm:text-2xl font-light">{item.title}</span>
            {item.tag ? (
              <span className="text-[11px] sm:text-xs tracking-[0.2em] uppercase" style={{ color: accent }}>
                {item.tag}
              </span>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

const noop = () => () => {};

function NavButton({ side, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 ${
        side === "left" ? "left-5" : "right-5"
      } w-12 h-12 rounded-full border border-white/15 items-center justify-center hover:bg-white/10 transition-colors`}
    >
      <span aria-hidden="true">{side === "left" ? "←" : "→"}</span>
    </button>
  );
}
