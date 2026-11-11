import {
  ColorManagement,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  LinearSRGBColorSpace,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { CARD_H, CARD_W, FOV, stretchLayout } from "./stretchLayout";

/**
 * Selected work carousel.
 *
 * Two passes. The cards live in a small 3D scene: they recede and turn half a
 * revolution on their way to the side, so a side card shows its mirrored back.
 * That scene renders to a mipmapped target, and a full-screen shader then pulls
 * everything outside a central zone out to the screen edge: the image is
 * stretched, flared vertically and blurred (by reading higher mip levels), with
 * the colour channels split and a glowing rim where it meets the ground.
 * Speed feeds the shader, so the warp reaches further in while the cards move.
 *
 * All colour stays in display space end to end, so ColorManagement is off.
 */

const RADIUS = 0.034 * CARD_W;
const SHEEN = 0.14;

const ZONE = 0.4; // warp starts this far from a side card's inner edge to the screen edge
const STRETCH = 2;
const FLARE = 0.62;
const FLARE_POW = 1.8;
const ABERRATION = 0.03;
const BLUR = 4.6;
const SMEAR = 0.14;
const SATURATE = 0.45;
const RIM = 0.9;
const RIM_WIDTH = 0.2;
const RIM_HUE = (52 * Math.PI) / 180;
const SPEED_ZONE = 0.14; // how far speed pulls the warp toward the centre

const SNAP = 9; // follow rate at rest
const SNAP_DRAG = 34; // follow rate under the finger
const SPEED_GAIN = 0.12;

const SLOW_FRAME = 0.022; // seconds; held for SLOW_FRAMES in motion, resolution drops a notch
const SLOW_FRAMES = 40;

const CARD_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const CARD_FRAG = /* glsl */ `
uniform sampler2D map;
uniform vec2 uSize;
uniform float uRadius;
uniform float uSheen;
uniform float uAngle;
uniform float uFade;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * uSize;
  vec2 q = abs(p) - (0.5 * uSize - uRadius);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float aa = max(fwidth(d), 1e-5);
  vec3 c = texture2D(map, vUv).rgb;
  c += (1.0 - smoothstep(0.0, 0.005, -d)) * 0.07; // a hairline of light on the edge
  float s = sin(uAngle);
  float band = exp(-pow((vUv.x - 0.5 + (vUv.y - 0.5) * 0.4 + s * 0.8) * 2.6, 2.0));
  c += uSheen * abs(s) * band; // light sweeping across as the card turns
  gl_FragColor = vec4(c, (1.0 - smoothstep(-aa, aa, d)) * uFade);
}`;

const WARP_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const WARP_FRAG = /* glsl */ `
uniform sampler2D tScene;
uniform vec3 uBg;
uniform float uCenterY;
uniform float uZone;
uniform float uK;
uniform float uFlare;
uniform float uFlarePow;
uniform float uAber;
uniform float uBlur;
uniform float uSmear;
uniform float uSat;
uniform float uRim;
uniform float uRimW;
uniform float uRimHue;
varying vec2 vUv;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float noise(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

// Where a warped pixel reads from: x climbs fast then flattens, so the source
// strip just past the zone is spread across the whole way to the screen edge;
// y is squeezed toward the centre line, which flares the image open.
vec2 source(vec2 uv, float t, float kScale, float flareScale) {
  float k = max(uK * kScale, 1e-3);
  float x = uZone + (1.0 - uZone) * (1.0 - exp(-k * t)) / k;
  float m = 1.0 + uFlare * flareScale * pow(t, uFlarePow);
  return vec2(x, uCenterY + (uv.y - uCenterY) / m);
}

vec2 toScreen(vec2 z, float s) { return vec2(0.5 + 0.5 * s * z.x, z.y); }

// A wider, softer read of the same area, used to find the rim.
vec3 halo(vec2 uv, float s, float t, float flareScale, float lod) {
  vec2 z = source(uv, t, 1.0, flareScale);
  float dx = uSmear * (1.0 - uZone) * t * t;
  vec3 a = textureLod(tScene, toScreen(z, s), lod).rgb;
  vec3 b = textureLod(tScene, toScreen(z - vec2(dx, 0.0), s), lod).rgb;
  return 0.5 * (a + b);
}

// Each channel reads its own slightly different warp, smeared along x.
vec3 splitRead(vec2 uv, float s, float t) {
  float lod = uBlur * t * t;
  float dx = uSmear * (1.0 - uZone) * t * t;
  vec3 col = vec3(0.0);
  for (int c = 0; c < 3; c++) {
    float ch = float(c) - 1.0;
    vec2 z = source(uv, t, 1.0 + ch * uAber, 1.0 + ch * uAber * 2.0);
    float sum = 0.0;
    for (int i = 0; i < 4; i++) {
      sum += textureLod(tScene, toScreen(z - vec2(float(i) / 3.0 * dx, 0.0), s), lod)[c];
    }
    col[c] = sum * 0.25;
  }
  return col;
}

float inked(vec3 c) { return clamp(distance(c, uBg) * 2.4, 0.0, 1.0); }

vec3 rotateHue(vec3 c, float a) {
  const vec3 axis = vec3(0.57735);
  float ca = cos(a);
  return c * ca + cross(axis, c) * sin(a) + axis * dot(axis, c) * (1.0 - ca);
}

vec3 neon(vec3 c) {
  c = max(mix(vec3(luma(c)), c, 1.7), 0.0);
  return clamp(c / max(max(c.r, max(c.g, c.b)), 0.2) * 0.96, 0.0, 1.0);
}

void main() {
  float sx = vUv.x * 2.0 - 1.0;
  float t = clamp((abs(sx) - uZone) / max(1.0 - uZone, 1e-3), 0.0, 1.0);
  vec3 col;
  if (t <= 0.0) {
    col = textureLod(tScene, vUv, 0.0).rgb;
  } else {
    float s = sx < 0.0 ? -1.0 : 1.0;
    col = splitRead(vUv, s, t);
    col = clamp(mix(vec3(luma(col)), col, 1.0 + uSat * t), 0.0, 1.0);
    // The rim: wider reads reach ink where this pixel has none, so whatever
    // they add past the edge of the image is tinted and laid over the ground.
    float lod = uBlur * t * t;
    vec3 o1 = halo(vUv, s, t, 1.0 + uRimW, lod + 0.7);
    vec3 o2 = halo(vUv, s, t, 1.0 + 2.2 * uRimW, lod + 1.3);
    float c0 = inked(col);
    float c1 = inked(o1);
    float c2 = inked(o2);
    float w = uRim * sqrt(t);
    col = mix(col, neon(rotateHue(o1, -uRimHue)), clamp(clamp(c1 - c0, 0.0, 1.0) * w, 0.0, 1.0));
    vec3 outer = mix(neon(rotateHue(o2, -uRimHue * 1.35)), vec3(1.0), 0.4);
    col = mix(col, outer, clamp(clamp(c2 - max(c0, c1), 0.0, 1.0) * w, 0.0, 1.0));
  }
  col += (noise(gl_FragCoord.xy) - 0.5) / 255.0; // dither the long gradients
  gl_FragColor = vec4(col, 1.0);
}`;

/** Phones and low-end machines: the same effect at a lighter resolution. */
export const isLightDevice = () =>
  window.matchMedia("(pointer: coarse)").matches ||
  (navigator.deviceMemory ?? 8) <= 4 ||
  (navigator.hardwareConcurrency ?? 8) <= 4;

const hexToRgb = (hex) => {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
};

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * @param host element the canvas fills
 * @param images one canvas per card, already drawn
 * @param opts.pills per card, the text for the cursor pill over it (optional)
 * @param opts.onIndex (index) the card in focus changed
 * @param opts.onRelease (index) a drag or key press committed to a card
 * @param opts.onOpen (index) the focused card was clicked
 * @param opts.onLayout ({ step }) pixels of travel per card changed
 * @param opts.onLost the WebGL context went away
 */
export function createStretchCarousel(host, images, opts) {
  const { bg, reduceMotion, pills, onIndex, onRelease, onOpen, onLayout, onLost } = opts;
  const count = images.length;

  ColorManagement.enabled = false;
  const renderer = new WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  const light = isLightDevice();
  let dpr = Math.min(window.devicePixelRatio || 1, light ? 1.5 : 2);
  const [br, bgG, bb] = hexToRgb(bg);
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setPixelRatio(dpr);
  renderer.setClearColor((Math.round(br * 255) << 16) | (Math.round(bgG * 255) << 8) | Math.round(bb * 255), 1);
  const canvas = renderer.domElement;
  canvas.className = "work-canvas";
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.05, 100);
  const target = new WebGLRenderTarget(2, 2, {
    samples: light ? 2 : 4,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
    magFilter: LinearFilter,
  });

  const plane = new PlaneGeometry(CARD_W, CARD_H);
  const size = new Vector2(CARD_W, CARD_H);
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const cards = images.map((image) => {
    const map = new Texture(image);
    map.anisotropy = anisotropy;
    map.minFilter = LinearMipmapLinearFilter;
    map.needsUpdate = true;
    const material = new ShaderMaterial({
      uniforms: {
        map: { value: map },
        uSize: { value: size },
        uRadius: { value: RADIUS },
        uSheen: { value: SHEEN },
        uAngle: { value: 0 },
        uFade: { value: 1 },
      },
      vertexShader: CARD_VERT,
      fragmentShader: CARD_FRAG,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    });
    const mesh = new Mesh(plane, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
    renderer.initTexture(map); // upload now, not the first time the card scrolls into view
    return { mesh, material, map };
  });

  const warp = {
    tScene: { value: target.texture },
    uBg: { value: new Vector3(br, bgG, bb) },
    uCenterY: { value: 0.5 },
    uZone: { value: 0.5 },
    uK: { value: STRETCH },
    uFlare: { value: FLARE },
    uFlarePow: { value: FLARE_POW },
    uAber: { value: ABERRATION },
    uBlur: { value: BLUR },
    uSmear: { value: SMEAR },
    uSat: { value: SATURATE },
    uRim: { value: RIM },
    uRimW: { value: RIM_WIDTH },
    uRimHue: { value: RIM_HUE },
  };
  const screenGeometry = new PlaneGeometry(2, 2);
  const screenMaterial = new ShaderMaterial({
    uniforms: warp,
    vertexShader: WARP_VERT,
    fragmentShader: WARP_FRAG,
    depthTest: false,
    depthWrite: false,
  });
  const screen = new Mesh(screenGeometry, screenMaterial);
  screen.frustumCulled = false;
  const screenScene = new Scene();
  screenScene.add(screen);
  const screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const layout = { spacing: 1.2, depth: 1.5, zone: 0.5, step: 400, stride: 400, box: null };
  let w = 1;
  let h = 1;

  const resize = () => {
    w = Math.max(1, host.clientWidth);
    h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    target.setSize(Math.round(w * dpr), Math.round(h * dpr));

    const { D, depth, sideInner, spacing, step, stride, halfW, halfH } = stretchLayout(w, h);
    layout.depth = depth;
    layout.spacing = spacing;
    layout.zone = Math.min(0.97, sideInner + ZONE * (1 - sideInner));
    layout.step = step;
    layout.stride = stride;
    layout.box = { left: w / 2 - halfW, right: w / 2 + halfW, top: h / 2 - halfH, bottom: h / 2 + halfH };
    layout.side = { inner: (w / 2) * sideInner, halfH: halfH * (D / (D + depth)) };

    camera.aspect = w / h;
    camera.position.set(0, 0, D);
    camera.updateProjectionMatrix();
    onLayout?.({ step: layout.step });
  };

  // ---- Placement ----
  let pos = 0; // the position on screen, in cards
  let goal = 0; // where it's heading
  let speed = 0; // smoothed, feeds the warp
  let dragging = false;

  const place = (at) => {
    for (let i = 0; i < count; i++) {
      let o = (((i - at) % count) + count) % count;
      if (o >= count / 2) o -= count;
      const a = Math.abs(o);
      const s = Math.sign(o);
      const fade = 1 - smoothstep(1.15, 1.75, a);
      const card = cards[i];
      card.mesh.visible = fade > 0.001;
      card.mesh.position.set(
        s * (a <= 1 ? a * layout.spacing : layout.spacing * (1 + (a - 1) * 1.6)),
        0,
        -layout.depth * (a <= 1 ? a * a : 1 + 2 * (a - 1)),
      );
      const turn = Math.PI * s * Math.min(1, a);
      card.mesh.rotation.set(0, turn, 0);
      card.material.uniforms.uAngle.value = turn;
      card.material.uniforms.uFade.value = fade;
    }
  };

  const draw = () => {
    place(pos);
    warp.uZone.value = Math.max(0.05, layout.zone - SPEED_ZONE * speed);
    warp.uK.value = STRETCH * (1 + speed);
    warp.uFlare.value = FLARE * (1 + 0.35 * speed);
    warp.uSmear.value = SMEAR * (1 + speed);
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(screenScene, screenCamera);
  };

  // ---- Loop: only runs while something is moving and the section is seen. ----
  let raf = 0;
  let last = 0;
  let onScreen = true;
  let dead = false;
  let focused = -1;
  const wrap = (v) => ((Math.round(v) % count) + count) % count;

  // Still struggling in motion: trade sharpness for frames, down to 1x.
  let slow = 0;
  const watchFrames = (dt) => {
    slow = dt > SLOW_FRAME ? slow + 1 : Math.max(0, slow - 2);
    if (slow < SLOW_FRAMES || dpr <= 1) return;
    slow = 0;
    dpr = Math.max(1, dpr * 0.75);
    renderer.setPixelRatio(dpr);
    resize();
  };

  const tick = (now) => {
    raf = 0;
    if (dead || !onScreen || document.hidden) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    const was = pos;
    const rate = reduceMotion ? 60 : dragging ? SNAP_DRAG : SNAP;
    pos += (goal - pos) * (1 - Math.exp(-dt * rate));
    if (!dragging && Math.abs(goal - pos) < 1e-4) pos = goal;
    const v = reduceMotion ? 0 : Math.abs(pos - was) / dt;
    speed += (Math.min(v * SPEED_GAIN, 1.5) - speed) * (1 - Math.exp(-dt * 12));
    const moving = dragging || pos !== goal || speed > 0.002;
    if (!moving) speed = 0;
    draw();
    if (moving) {
      watchFrames(dt);
      raf = requestAnimationFrame(tick);
    }
  };

  const wake = () => {
    if (raf || dead || !onScreen || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const setGoal = (v) => {
    goal = v;
    const i = wrap(v);
    if (i !== focused) {
      focused = i;
      onIndex?.(i);
    }
    wake();
  };

  // Commit to a card, then fold the position back into 0…count-1 (the loop
  // makes that invisible) so it lines up with the page's scroll again.
  const commit = (v) => {
    setGoal(v);
    const lap = Math.floor(goal / count) * count;
    pos -= lap;
    goal -= lap;
    onRelease?.(goal);
  };

  // ---- Input ----
  // A drag follows the cards on screen; on a phone, where they sit close together, it
  // takes most of the screen's width to move one.
  const px = () => (w < 640 ? Math.max(layout.stride, w * 0.6) : layout.stride);
  let fromTouch = false;
  let upright = false; // the gesture went up or down: the page's, not the cards'
  const finalCard = count - 1;
  let downX = 0;
  let downY = 0;
  let lastX = 0;
  let lastT = 0;
  let downGoal = 0;
  let flick = 0;
  let moved = 0;

  const onDown = (e) => {
    if (e.button) return;
    dragging = true;
    moved = 0;
    downX = lastX = e.clientX;
    downY = e.clientY;
    fromTouch = e.pointerType === "touch";
    upright = false;
    lastT = e.timeStamp;
    downGoal = goal;
    flick = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.dataset.dragging = "";
    wake();
  };

  const overCard = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const b = layout.box;
    return b && x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
  };

  // Which side card the pointer is on: -1, 1, or 0 for neither.
  const overSide = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left - w / 2;
    if (Math.abs(e.clientY - r.top - h / 2) > layout.side.halfH || Math.abs(x) < layout.side.inner) return 0;
    return Math.sign(x);
  };

  const onMove = (e) => {
    if (!dragging) {
      const onCard = overCard(e);
      canvas.toggleAttribute("data-hot", onCard || overSide(e) !== 0);
      const pill = onCard && pills?.[wrap(goal)];
      if (pill) canvas.dataset.pill = pill;
      else delete canvas.dataset.pill;
      return;
    }
    const dx = e.clientX - downX;
    const dy = e.clientY - downY;
    moved = Math.max(moved, Math.hypot(dx, dy)); // a swipe either way is not a tap
    // Up and down belongs to the page; only a sideways drag moves the cards.
    if (Math.abs(dy) > Math.abs(dx) && moved > 8 && Math.abs(goal - downGoal) < 0.05) upright = true;
    setGoal(upright ? downGoal : downGoal - dx / px());
    const dt = e.timeStamp - lastT;
    if (dt > 0) flick = flick * 0.6 + ((e.clientX - lastX) / dt) * 0.4;
    lastX = e.clientX;
    lastT = e.timeStamp;
  };

  const onUp = (e) => {
    if (!dragging) return;
    dragging = false;
    delete canvas.dataset.dragging;
    if (upright) {
      setGoal(downGoal);
      return; // the page scrolled; nothing for the cards to settle
    }
    if (e.timeStamp - lastT > 90) flick = 0; // held still before letting go
    if (e.type === "pointerup" && moved < 6) {
      const at = Math.round(goal);
      if (overCard(e)) onOpen?.(wrap(at));
      else commit(at + overSide(e));
    } else {
      const throwBy = Math.abs(flick) < 0.25 ? 0 : Math.max(-2, Math.min(2, ((-flick * 1000) / px()) * 0.16));
      const to = Math.round(goal + throwBy);
      // A finger moves one card at a time, however hard the flick, and stops at the
      // first and last rather than wrapping round.
      const one = Math.max(Math.round(downGoal) - 1, Math.min(Math.round(downGoal) + 1, to));
      commit(fromTouch ? Math.max(0, Math.min(finalCard, one)) : to);
    }
  };

  // Sideways trackpad swipes move the cards; vertical ones scroll the page.
  let wheelTimer = 0;
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    setGoal(goal + e.deltaX / px());
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => commit(Math.round(goal)), 130);
  };

  // The GPU can be reclaimed, often from a background tab. Three rebuilds what it
  // needs once the context returns; only a context that never does ends the effect.
  let lostTimer = 0;
  const onContextLost = (e) => {
    e.preventDefault();
    dead = true;
    raf = 0;
    if (!document.hidden) lostTimer = setTimeout(() => onLost?.(), 3000);
  };
  const onContextRestored = () => {
    clearTimeout(lostTimer);
    dead = false;
    draw();
    wake();
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("lostpointercapture", onUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  const ro = new ResizeObserver(() => {
    resize();
    draw();
  });
  ro.observe(host);

  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen) wake();
  });
  io.observe(host);

  const onVisibility = () => wake();
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  setGoal(0);
  draw();

  return {
    get dragging() {
      return dragging;
    },
    /** Page scroll drives this, in cards. */
    scrollTo(v) {
      if (dragging) return;
      setGoal(v);
    },
    /** Move on by whole cards. */
    go(by) {
      commit(Math.round(goal) + by);
    },
    /** Bring a card to the centre the short way round. */
    show(index) {
      const at = Math.round(goal);
      let by = (((index - wrap(at)) % count) + count) % count;
      if (by > count / 2) by -= count;
      commit(at + by);
    },
    /** Be on a card straight away, unseen. */
    jumpTo(index) {
      pos = index;
      setGoal(index);
      draw();
    },
    dispose() {
      dead = true;
      cancelAnimationFrame(raf);
      clearTimeout(wheelTimer);
      clearTimeout(lostTimer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      for (const c of cards) {
        c.map.dispose();
        c.material.dispose();
      }
      plane.dispose();
      screenGeometry.dispose();
      screenMaterial.dispose();
      target.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
