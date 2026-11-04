"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { markSceneReady } from "./Intro";

/**
 * The hero object: the shield mark as a glass sculpture.
 *
 * The outline becomes rounded glass tubing (sampled from the mark's own SVG
 * path), the star a bevelled glass piece. Behind it, on a plane that fills
 * the view, the name is painted into a texture, so the glass genuinely
 * refracts it with a chromatic fringe.
 *
 * Interaction: it leans toward the pointer on a spring, can be grabbed and
 * spun (the spin carries momentum and decays), swells a touch on hover, and
 * rolls away as the hero scrolls out. It stops rendering when off-screen.
 */

const SHIELD =
  "M83.6417 10.4969C52.2578 -0.832302 31.1819 -0.832307 2 10.4969L2.37127 19.872C29.5607 8.08439 54.6896 8.08439 82.4731 19.872L81.0809 29.34C58.7426 17.0011 27.1289 17.0011 4.43183 29.1602M66.23 32.8672L78.2963 38.251C76.2234 47.0691 66.2671 69.0124 43.0255 86.2404C34.0531 80.3925 14.3077 62.6077 7.10499 38.251L19.328 32.8672";
const STAR =
  "M57.1215 49.4255C48.0265 49.4255 43.3411 56.8669 43.3411 63.2058C43.3411 56.8669 37.829 49.4255 29.5608 49.4255C37.829 49.4255 43.3411 44.7401 43.3411 35.6451C43.3411 44.7401 48.0265 49.4255 57.1215 49.4255Z";

// Mark space → world: centre the 86x89 viewBox and make it 2 units tall.
const S = 2 / 89;
const toWorld = (x, y) => new THREE.Vector3((x - 43) * S, -(y - 44.5) * S, 0);

function buildGeometry() {
  const parts = [];
  const svgNS = "http://www.w3.org/2000/svg";
  const radius = 0.062;

  // Outline: one tube per sub-path, with rounded caps.
  for (const d of SHIELD.split(/(?=M)/)) {
    const el = document.createElementNS(svgNS, "path");
    el.setAttribute("d", d);
    const len = el.getTotalLength();
    const n = Math.max(24, Math.round(len * 1.6));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const p = el.getPointAtLength((i / n) * len);
      pts.push(toWorld(p.x, p.y));
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.2);
    parts.push(new THREE.TubeGeometry(curve, Math.round(n * 1.4), radius, 16, false));
    for (const end of [pts[0], pts[pts.length - 1]]) {
      const cap = new THREE.SphereGeometry(radius, 16, 12);
      cap.translate(end.x, end.y, end.z);
      parts.push(cap);
    }
  }

  // Star: extruded and bevelled.
  const svg = new SVGLoader().parse(`<svg xmlns="${svgNS}"><path d="${STAR}"/></svg>`);
  const shapes = svg.paths.flatMap((p) => SVGLoader.createShapes(p));
  const star = new THREE.ExtrudeGeometry(shapes, {
    depth: 6,
    bevelEnabled: true,
    bevelThickness: 2.2,
    bevelSize: 1.6,
    bevelSegments: 6,
    curveSegments: 24,
  });
  star.translate(-43, -44.5, -3);
  star.scale(S, -S, S);
  // Scaling Y by -1 flips winding; flip the index back so faces point out.
  if (star.index) {
    const idx = star.index.array;
    for (let i = 0; i < idx.length; i += 3) [idx[i], idx[i + 2]] = [idx[i + 2], idx[i]];
  } else {
    star.computeVertexNormals();
  }
  star.computeVertexNormals();
  parts.push(star.index ? star.toNonIndexed() : star);

  const clean = parts.map((g) => {
    const ng = g.index ? g.toNonIndexed() : g;
    for (const key of Object.keys(ng.attributes)) {
      if (!["position", "normal", "uv"].includes(key)) ng.deleteAttribute(key);
    }
    return ng;
  });
  const merged = mergeGeometries(clean, false);
  merged.computeBoundingSphere();
  return merged;
}

/** Paints the name into a canvas texture sized to the plane behind the glass. */
function useNameTexture(aspect, narrow) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const probe = document.createElement("span");
    probe.className = "font-funnel";
    document.body.appendChild(probe);
    const family = getComputedStyle(probe).fontFamily;
    probe.remove();

    const draw = () => {
      if (cancelled) return;
      const H = 1600;
      const W = Math.round(H * aspect);
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#0b0b0c";
      ctx.fillRect(0, 0, W, H);
      // A faint lilac bloom behind the mark gives the glass colour to bend.
      const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.62);
      glow.addColorStop(0, "rgba(214,184,250,0.55)");
      glow.addColorStop(0.35, "rgba(150,120,255,0.18)");
      glow.addColorStop(1, "rgba(11,11,12,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ecebe7";
      ctx.textBaseline = "alphabetic";
      if ("letterSpacing" in ctx) ctx.letterSpacing = "-0.05em";

      const lines = narrow ? ["Vranch", "Sinha"] : ["Vranch Sinha"];
      // Fit the widest line to ~92% of the width.
      let size = 400;
      ctx.font = `400 ${size}px ${family}`;
      const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
      size = Math.min(size * ((W * 0.92) / widest), H * (narrow ? 0.3 : 0.42));
      ctx.font = `400 ${size}px ${family}`;
      const lh = size * 0.86;
      const block = lh * lines.length;
      let y = H / 2 - block / 2 + size * 0.74;
      for (const l of lines) {
        const w = ctx.measureText(l).width;
        ctx.fillText(l, (W - w) / 2, y);
        y += lh;
      }
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      setTexture((old) => {
        old?.dispose();
        return tex;
      });
    };

    document.fonts.load(`400 100px ${family}`).then(draw, draw);
    return () => {
      cancelled = true;
    };
  }, [aspect, narrow]);

  return texture;
}

function Backdrop({ narrow }) {
  const { camera, viewport } = useThree();
  const z = -1.6;
  const vp = viewport.getCurrentViewport(camera, [0, 0, z]);
  const tex = useNameTexture(vp.width / vp.height, narrow);

  // Tell the loader once the name is painted and a few real frames (shader
  // compilation included) have been drawn.
  const frames = useRef(0);
  useFrame(() => {
    if (!tex || frames.current > 3) return;
    frames.current += 1;
    if (frames.current === 3) markSceneReady();
  });
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[vp.width, vp.height]} />
      <meshBasicMaterial map={tex} color={tex ? "#ffffff" : "#0b0b0c"} toneMapped={false} />
    </mesh>
  );
}

function Shield({ pointer, scroll, ready, lowPower }) {
  const group = useRef(null);
  const geometry = useMemo(() => buildGeometry(), []);
  const st = useRef({ spin: 0, vel: 0.35, rx: 0, ry: 0, s: 0.001, hover: 0, dragging: false, lastX: 0 });
  const { gl, viewport } = useThree();
  // About 70% of the view height on desktop. On a portrait phone the view is
  // narrow, so size by width and let it take most of it.
  const portrait = viewport.height > viewport.width;
  const baseScale = portrait ? viewport.width / 3 : Math.min(0.9, viewport.width / 5.2);

  useEffect(() => {
    const el = gl.domElement;
    const up = () => {
      st.current.dragging = false;
      document.body.style.cursor = "";
    };
    const move = (e) => {
      const s = st.current;
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.vel = dx * 0.35; // hand the flick straight to the spin
      s.spin += dx * 0.012;
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", () => (st.current.hover = 0));
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointermove", move);
    };
  }, [gl]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const s = st.current;
    const d = Math.min(dt, 1 / 30);
    const k = (rate) => 1 - Math.exp(-d * rate);

    // Spin with momentum, settling back to a slow idle turn.
    if (!s.dragging) {
      s.vel += (0.35 - s.vel) * k(1.6);
      s.spin += s.vel * d;
    }

    // Lean toward the pointer.
    const p = pointer.current;
    s.rx += (-p.y * 0.35 - s.rx) * k(4);
    s.ry += (p.x * 0.45 - s.ry) * k(4);

    // Arrive after the intro, swell on hover.
    const target = ready ? 1 + s.hover * 0.06 : 0.001;
    s.s += (target - s.s) * k(ready ? 3.2 : 20);

    const sc = scroll.current;
    const t = state.clock.elapsedTime;
    g.rotation.set(s.rx + sc * 1.1, s.spin + s.ry, Math.sin(t * 0.6) * 0.05);
    g.position.set(0, Math.sin(t * 0.9) * 0.06 + sc * 1.2, 0);
    g.scale.setScalar(baseScale * s.s * (1 - sc * 0.25));
  });

  return (
    <group ref={group}>
      <mesh
        geometry={geometry}
        onPointerOver={() => {
          st.current.hover = 1;
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          st.current.hover = 0;
          if (!st.current.dragging) document.body.style.cursor = "";
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          st.current.dragging = true;
          st.current.lastX = e.clientX;
          document.body.style.cursor = "grabbing";
        }}
      >
        {/* Tuned for a steady frame rate: one pass (no backside), a modest
            buffer, few samples, and no animated noise. */}
        <MeshTransmissionMaterial
          samples={lowPower ? 3 : 6}
          resolution={lowPower ? 256 : 512}
          transmission={1}
          thickness={0.35}
          roughness={0}
          ior={1.32}
          chromaticAberration={0.45}
          anisotropicBlur={0}
          distortion={0}
          temporalDistortion={0}
          clearcoat={1}
          clearcoatRoughness={0}
          specularIntensity={1}
          iridescence={0.6}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 600]}
          color="#ffffff"
          envMapIntensity={2.6}
        />
      </mesh>
    </group>
  );
}

/** Stops rendering while the hero is off-screen. */
function Pause({ target }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setFrameloop(e.isIntersecting ? "always" : "never"));
    io.observe(el);
    return () => io.disconnect();
  }, [setFrameloop, target]);
  return null;
}

export default function GlassShield({ ready, scroll, narrow, fallback }) {
  const wrap = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const id = requestAnimationFrame(() => setLowPower(coarse || window.innerWidth < 900));
    const move = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        fallback={fallback}
        dpr={[1, lowPower ? 1.25 : 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 35 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0b0b0c");
          // Neutral keeps glass highlights bright and colours true (ACES
          // crushed them toward grey).
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <Pause target={wrap} />
        <Backdrop narrow={narrow} />
        <Shield pointer={pointer} scroll={scroll} ready={ready} lowPower={lowPower} />
        {/* Studio lighting for glass: long, bright strips give the crisp
            edge highlights that read as glass; a soft lilac ring adds the
            brand tint to the reflections. */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={7} position={[0, 4, -2]} rotation-x={Math.PI / 2} scale={[12, 0.6, 1]} />
          <Lightformer form="rect" intensity={5} position={[-5, 0.5, 1]} rotation-y={Math.PI / 2} scale={[10, 0.5, 1]} />
          <Lightformer form="rect" intensity={5} position={[5, -0.5, 1]} rotation-y={-Math.PI / 2} scale={[10, 0.5, 1]} />
          <Lightformer form="rect" intensity={3} position={[0, -4, 1]} rotation-x={-Math.PI / 2} scale={[12, 0.4, 1]} />
          {/* A big soft panel behind the camera: every curved edge picks up a
              bright rim (fresnel), which is what the eye reads as glass. */}
          <Lightformer form="rect" intensity={2.8} position={[0, 0, 9]} scale={[24, 16, 1]} />
          <Lightformer form="circle" intensity={4} position={[2, 2, 6]} scale={2.5} />
          <Lightformer form="ring" color="#c9a0f5" intensity={2.5} position={[0, 0, -6]} scale={8} />
        </Environment>
      </Canvas>
    </div>
  );
}
