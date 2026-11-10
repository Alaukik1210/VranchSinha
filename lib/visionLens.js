import gsap from "gsap";
import { paintGlow } from "./cardGlow";

/**
 * The big eye: a lens onto the bill's other side. When it opens, that side is painted
 * once to a texture, fixed to the bill: a project card the size of the paper, with the
 * line in red and the details in white over where they sit. The eye is a shader reading
 * it through the same curve as the stretch carousel, so the page holds still in the
 * middle and pulls out towards the eye's corners. Only the eye moves.
 *
 * The real details stay underneath, live, so they can still be clicked.
 */

const SHUT = 0.012; // the eye at the size of the cursor's dot
const ZONE = 0.52; // how far out towards the corners the stretch starts
const STRETCH = 2;
const FLARE = 0.62;
const FLARE_POW = 1.8;
const ABERRATION = 0.018;
const BLUR = 1.8;
const SMEAR = 0.1;
const RIM = 0.16; // how far the page leans in at the top and bottom of the eye
const TONE = "#e5261f"; // the card's colour, as in the line

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D page;
uniform vec2 uRes;   // canvas, in device pixels
uniform vec2 uEye;   // the eye's centre
uniform vec2 uHalf;  // its half size
uniform float uShift;
out vec4 outColor;
const float ZONE = ${ZONE.toFixed(3)};

// As in the carousel: towards the corners x climbs fast then flattens, so the strip just
// past the zone is spread right out to the tip, and y is squeezed to the centre line,
// which flares it open. Up at the rim the page only leans in a little.
vec2 source(vec2 p, float tx, float rim, float k, float flare) {
  float x = ZONE + (1.0 - ZONE) * (1.0 - exp(-k * tx)) / k;
  x = tx > 0.0 ? sign(p.x) * x : p.x;
  float y = p.y / (1.0 + flare * pow(tx, ${FLARE_POW.toFixed(1)}));
  return vec2(x, y * (1.0 - ${RIM.toFixed(2)} * rim * rim));
}
vec2 toPage(vec2 q) { return (uEye + q * uHalf + vec2(0.0, uShift)) / uRes; }

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 p = (px - uEye) / uHalf;
  float edge = 1.0 - p.x * p.x; // the almond: |y| = 1 - x^2
  float slope = 2.0 * p.x * uHalf.y / uHalf.x;
  float sdf = (abs(p.y) - edge) * uHalf.y / sqrt(1.0 + slope * slope);
  float alpha = clamp(0.5 - sdf, 0.0, 1.0);
  if (alpha <= 0.0 || abs(p.x) >= 1.0) discard;

  float tx = clamp((abs(p.x) - ZONE) / (1.0 - ZONE), 0.0, 1.0);
  float rim = clamp((abs(p.y) / max(edge, 1e-3) - 0.72) / 0.28, 0.0, 1.0);
  float t = max(tx, rim * 0.45);
  float lod = ${BLUR.toFixed(1)} * t * t;
  float smear = ${SMEAR.toFixed(2)} * (1.0 - ZONE) * tx * tx * sign(p.x);
  vec3 col = vec3(0.0);
  for (int c = 0; c < 3; c++) {
    float a = ${ABERRATION.toFixed(3)} * (float(c) - 1.0);
    vec2 q = source(p, tx, rim, ${STRETCH.toFixed(1)} * (1.0 + a), ${FLARE.toFixed(2)} * (1.0 + 2.0 * a));
    float sum = 0.0;
    for (int i = 0; i < 3; i++) {
      sum += textureLod(page, toPage(q - vec2(float(i) / 2.0 * smear, 0.0)), lod)[c];
    }
    col[c] = sum / 3.0;
  }
  col += (fract(sin(dot(px, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.024; // the cards' fine grain
  col += (1.0 - smoothstep(0.0, 2.5, -sdf)) * 0.07; // a hairline of light on the edge, as on the cards
  outColor = vec4(col * alpha, alpha);
}`;

const lens = { x: 0, y: 0, k: SHUT };
let canvas = null;
let gl = null;
let ctx2d = null; // no WebGL 2: the same page through the same shape, unbent
let uniforms = null;
let looking = false;
let tween = null;
let onChange = null;
let dpr = 1;
let pageKey = "";
let pageTop = 0;
let lineCentre = [0, 0];
let eyeWidth = 0; // exactly the bill's width
const page = typeof document === "undefined" ? null : document.createElement("canvas");

// The bill's other side: the dark around the bill turned pale, and on the paper, the card.
function paintPage() {
  const bill = document.querySelector(".bill");
  const paper = document.querySelector(".bill-paper").getBoundingClientRect();
  const rule = document.querySelector(".bill-look").getBoundingClientRect();
  const w = window.innerWidth;
  const h = window.innerHeight;
  eyeWidth = paper.width;
  const font = eyeWidth * 0.048; // keeps the line inside the part of the lens that doesn't bend
  const lineHeight = font * 1.18;
  const lines = ["Ready to shift", "your perspective?", "Let’s connect"];
  const lineBottom = rule.bottom - font * 1.1;
  const cx = paper.left + paper.width / 2;
  lineCentre = [cx, lineBottom - (lineHeight * lines.length) / 2];

  const key = [w, h, Math.round(paper.left), Math.round(paper.bottom)].join();
  pageTop = bill.getBoundingClientRect().top;
  if (key === pageKey) return false;
  pageKey = key;

  dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  page.width = Math.round(w * dpr);
  page.height = Math.round(h * dpr);
  const c = page.getContext("2d");
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = "#f4f4f3";
  c.fillRect(0, 0, w, h);

  // The card, cut to the paper, torn foot and all.
  const bottom = paper.bottom;
  const em = parseFloat(getComputedStyle(bill).fontSize);
  const teeth = Math.round(paper.width / (0.6 * em)); // the same teeth as the stylesheet's
  const tooth = paper.width / teeth;
  c.save();
  c.beginPath();
  c.moveTo(paper.left, -10);
  c.lineTo(paper.right, -10);
  c.lineTo(paper.right, bottom);
  for (let i = 0; i < teeth; i++) {
    const x = paper.right - i * tooth;
    c.lineTo(x - tooth / 2, bottom + 0.3 * em);
    c.lineTo(x - tooth, bottom);
  }
  c.closePath();
  c.clip();
  c.imageSmoothingQuality = "high";
  c.drawImage(paintGlow(TONE), paper.left, 0, paper.width, bottom + 0.3 * em);
  c.restore();

  // The line: the signs' gradient in red, deeper in the middle and brighter at the ends.
  c.font = `600 ${font}px ${getComputedStyle(document.querySelector(".bill-name")).fontFamily}`;
  if ("letterSpacing" in c) c.letterSpacing = `${-0.025 * font}px`;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  const reach = c.measureText(lines[1]).width / 2;
  const heart = c.createRadialGradient(lineCentre[0], lineCentre[1], reach * 0.1, lineCentre[0], lineCentre[1], reach * 1.04);
  heart.addColorStop(0, "#d92a26");
  heart.addColorStop(0.45, "#e8322a");
  heart.addColorStop(0.74, "#ff4f38");
  heart.addColorStop(1, "#ff9470");
  const sheen = c.createLinearGradient(cx - reach, lineBottom - lineHeight * 3, cx, lineBottom);
  sheen.addColorStop(0, "rgba(255, 254, 252, 0.3)");
  sheen.addColorStop(0.42, "rgba(255, 254, 252, 0)");
  for (const fill of [heart, sheen]) {
    c.fillStyle = fill;
    lines.forEach((line, i) => c.fillText(line, cx, lineBottom - lineHeight * (lines.length - 1 - i) - font * 0.26));
  }
  if ("letterSpacing" in c) c.letterSpacing = "0px";

  // The details, in white, exactly where they sit on the bill.
  c.textAlign = "left";
  for (const el of document.querySelectorAll(".bill-end .bill-name, .bill-end a, .bill-foot")) {
    const r = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    c.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    if ("letterSpacing" in c) c.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
    const m = c.measureText(el.textContent);
    const base = r.top + (r.height + m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2;
    c.fillStyle = el.classList.contains("bill-foot") ? "rgba(255, 254, 252, 0.66)" : "#fffefc";
    c.fillText(el.textContent, r.left, base);
    if (el.tagName === "A") c.fillRect(r.left, base + parseFloat(style.fontSize) * 0.2, r.width, Math.max(1, parseFloat(style.fontSize) * 0.06));
  }
  const code = document.querySelector(".bill-code");
  if (code) {
    const r = code.getBoundingClientRect();
    const box = code.viewBox.baseVal;
    c.save();
    c.translate(r.left, r.top);
    c.scale(r.width / box.width, r.height / box.height);
    c.fillStyle = "#fffefc";
    c.fill(new Path2D(code.querySelector("path").getAttribute("d")));
    c.restore();
  }
  return true;
}

function setUp() {
  gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) {
    ctx2d = canvas.getContext("2d");
    return;
  }
  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(at);
  gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  uniforms = Object.fromEntries(["uRes", "uEye", "uHalf", "uShift"].map((n) => [n, gl.getUniformLocation(program, n)]));
}

function upload() {
  if (!gl) return;
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, page);
  gl.generateMipmap(gl.TEXTURE_2D);
}

function draw() {
  if (!canvas) return;
  const { x, y, k } = lens;
  const open = k > SHUT + 0.001;
  canvas.style.visibility = open ? "visible" : "hidden";
  if (!open) return;
  const W = eyeWidth / 2;
  const half = [W * k * dpr, W * 0.53 * k * dpr];
  const shift = pageTop - document.querySelector(".bill").getBoundingClientRect().top;
  if (gl) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
    gl.uniform2f(uniforms.uEye, x * dpr, y * dpr);
    gl.uniform2f(uniforms.uHalf, half[0], half[1]);
    gl.uniform1f(uniforms.uShift, shift * dpr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  } else if (ctx2d) {
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    ctx2d.save();
    ctx2d.beginPath();
    for (let i = 0; i <= 96; i++) {
      const t = (i / 96) * Math.PI * 2;
      const s = Math.sin(t);
      ctx2d.lineTo(x * dpr + half[0] * Math.cos(t), y * dpr + half[1] * s * Math.abs(s));
    }
    ctx2d.clip();
    ctx2d.drawImage(page, 0, -shift * dpr);
    ctx2d.restore();
  }
}

// The eye only opens on the finished bill: film over and the page resting on it.
export function lensReady() {
  const bill = document.querySelector(".bill");
  return Boolean(bill) && !bill.classList.contains("is-film") && Math.abs(bill.getBoundingClientRect().top) < 2;
}

export function bindLens(eye) {
  canvas = eye;
  // The GPU can go away (a sleeping laptop, a busy phone): come back with a fresh set-up.
  canvas.addEventListener("webglcontextlost", (e) => e.preventDefault());
  canvas.addEventListener("webglcontextrestored", () => {
    setUp();
    pageKey = "";
    if (looking && paintPage()) upload();
    draw();
  });
  // The page under it has just moved, so the next look starts from fresh measurements.
  // A phone's toolbar sliding in or out changes only the height, and moves nothing.
  let width = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    openLens(false);
  });
}

export const onLensChange = (fn) => {
  onChange = fn;
};

export const lensAt = () => ({ x: lens.x, y: lens.y });

export function moveLens(x, y) {
  lens.x = x;
  lens.y = y;
  if (looking || tween?.isActive()) draw();
}

// The page scrolled under an open eye.
export const redrawLens = () => (looking || tween?.isActive()) && draw();

function ready() {
  if (!gl && !ctx2d) setUp();
  const fresh = paintPage();
  const w = Math.round(window.innerWidth * dpr);
  const h = Math.round(window.innerHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  if (fresh) upload();
}

// Does the painting ahead of the first look, while nothing else is going on, so opening
// the eye is only ever a draw.
export function warmLens() {
  const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 200));
  idle(() => canvas && !looking && lensReady() && ready());
}

// `held` is touch and keyboard: no pointer to follow, so the eye sits on the line.
export function openLens(on, held = false) {
  if (on === looking) return;
  looking = on;
  if (on) {
    ready();
    if (held) [lens.x, lens.y] = lineCentre;
  }
  onChange?.(on);
  tween?.kill();
  tween = gsap.to(lens, { k: on ? 1 : SHUT, duration: 0.8, ease: "power3.inOut", onUpdate: draw, onComplete: draw });
}
