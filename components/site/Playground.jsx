"use client";

import { useEffect, useRef } from "react";

/**
 * A physics playground of word tags. When the footer is reached the tags drop
 * in one after another from the top edge and settle into a pile. With a
 * mouse they can be grabbed and thrown (release works anywhere on the page);
 * on touch screens a tap flicks a tag up.
 *
 * The space is closed on all four sides, so nothing can be thrown out of
 * view. It rebuilds on resize, pauses while off-screen, loads matter-js only
 * when first needed, and never blocks page scrolling (matter's wheel and
 * touch listeners are detached).
 */
export default function Playground({ items, className = "" }) {
  const root = useRef(null);
  const nodes = useRef([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let Matter;
    let world = null; // current simulation, rebuilt on resize
    let raf;
    let visible = false;
    let started = false;

    function build() {
      const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Query } = Matter;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
      const T = 200;
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + T / 2, W + T * 2, T, { isStatic: true }), // floor
        Bodies.rectangle(W / 2, -T / 2, W + T * 2, T, { isStatic: true }), // ceiling
        Bodies.rectangle(-T / 2, H / 2, T, H + T * 2, { isStatic: true }),
        Bodies.rectangle(W + T / 2, H / 2, T, H + T * 2, { isStatic: true }),
      ]);

      // Measured once per build; reading layout every frame forces reflow.
      const sizes = nodes.current.map((n) => [n.offsetWidth, n.offsetHeight]);
      const bodies = sizes.map(([w, h], i) =>
        Bodies.rectangle(W * (0.1 + 0.8 * ((i * 0.618) % 1)), h / 2 + 4, w, h, {
          chamfer: { radius: h / 2 },
          restitution: 0.25,
          friction: 0.4,
          frictionAir: 0.012,
          angle: reduce ? 0 : ((i % 5) - 2) * 0.12,
        })
      );
      nodes.current.forEach((n) => (n.style.opacity = "0"));

      // Drop them in one by one, so the pile builds in front of you.
      const timers = [];
      bodies.forEach((b, i) => {
        const add = () => {
          Composite.add(engine.world, b);
          nodes.current[i].style.opacity = "1";
        };
        if (reduce) add();
        else timers.push(setTimeout(add, 120 + i * 110));
      });

      let detach = () => {};
      if (fine) {
        const mouse = Mouse.create(el);
        el.removeEventListener("wheel", mouse.mousewheel);
        el.removeEventListener("touchmove", mouse.mousemove);
        el.removeEventListener("touchstart", mouse.mousedown);
        el.removeEventListener("touchend", mouse.mouseup);
        const drag = MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
        });
        Composite.add(engine.world, drag);
        const over = () => {
          const hit = Query.point(bodies, mouse.position).length > 0;
          el.style.cursor = drag.body ? "grabbing" : hit ? "grab" : "";
        };
        // Let go even if the pointer left the playground mid-throw.
        const release = (e) => mouse.mouseup(e);
        el.addEventListener("mousemove", over);
        window.addEventListener("mouseup", release);
        detach = () => {
          el.removeEventListener("mousemove", over);
          el.removeEventListener("mousemove", mouse.mousemove);
          el.removeEventListener("mousedown", mouse.mousedown);
          el.removeEventListener("mouseup", mouse.mouseup);
          window.removeEventListener("mouseup", release);
          el.style.cursor = "";
        };
      } else {
        const tap = (e) => {
          const r = el.getBoundingClientRect();
          const [hit] = Query.point(bodies, { x: e.clientX - r.left, y: e.clientY - r.top });
          if (!hit) return;
          Body.setVelocity(hit, { x: (Math.random() - 0.5) * 10, y: -14 });
          Body.setAngularVelocity(hit, (Math.random() - 0.5) * 0.3);
        };
        el.addEventListener("pointerdown", tap);
        detach = () => el.removeEventListener("pointerdown", tap);
      }

      return {
        engine,
        bodies,
        sizes,
        destroy() {
          timers.forEach(clearTimeout);
          detach();
          Composite.clear(engine.world, false);
          Engine.clear(engine);
        },
      };
    }

    let last = performance.now();
    function tick(now) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(1000 / 30, now - last);
      last = now;
      if (!visible || !world) return;
      Matter.Engine.update(world.engine, dt);
      const { bodies, sizes } = world;
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const [w, h] = sizes[i];
        nodes.current[i].style.transform = `translate3d(${b.position.x - w / 2}px, ${b.position.y - h / 2}px, 0) rotate(${b.angle}rad)`;
      }
    }

    async function start() {
      Matter = (await import("matter-js")).default;
      world = build();
      raf = requestAnimationFrame(tick);
    }

    // Rebuild on resize (debounced): the space and the tag sizes change.
    let resizeTimer;
    let lastW = window.innerWidth;
    const onResize = () => {
      if (!world || window.innerWidth === lastW) return; // ignore mobile URL-bar height jitter
      lastW = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        world.destroy();
        world = build();
      }, 250);
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !started) {
          started = true;
          start();
        }
      },
      { threshold: 0.5 }
    );
    // The footer layer is fixed, so it always "intersects"; watch the
    // scrolling wrapper that reveals it instead.
    io.observe(el.closest("[data-reveal-wrap]") || el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      world?.destroy();
    };
  }, []);

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`}>
      {items.map((it, i) => (
        <div
          key={it.key}
          ref={(n) => {
            nodes.current[i] = n;
          }}
          className="absolute left-0 top-0 select-none pointer-events-none will-change-transform opacity-0 transition-opacity duration-300"
          style={{ transform: "translate3d(-9999px, 0, 0)" }}
        >
          {it.node}
        </div>
      ))}
    </div>
  );
}
