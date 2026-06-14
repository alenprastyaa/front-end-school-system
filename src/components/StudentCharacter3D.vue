<template>
  <div ref="container" class="student-3d"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import * as THREE from "three";

const props = defineProps({
  pointerX: { type: Number, default: 0 },
  pointerY: { type: Number, default: 0 },
  // "idle" | "happy" | "sad"
  mood: { type: String, default: "idle" },
});

const container = ref(null);

let renderer = null;
let scene = null;
let camera = null;
let root = null;
let ring = null;
let waveArm = null;
let armRest = null;
let headPivot = null;
let mouth = null;
let browL = null;
let browR = null;
let tear = null;
let clock = null;
let raf = null;
let resizeObserver = null;
const disposables = [];

const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };
const headCur = { x: 0, y: 0 };
const em = { droop: 0, wave: 2.2, rest: -0.2 };

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

watch(
  () => [props.pointerX, props.pointerY],
  ([x, y]) => {
    target.x = x;
    target.y = y;
  }
);

const mat = (color, opts = {}) => {
  const m = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.72,
    metalness: opts.metalness ?? 0.05,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 1,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
  });
  disposables.push(m);
  return m;
};

const geo = (g) => {
  disposables.push(g);
  return g;
};

const makeRadialShadowTexture = () => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(6,18,46,0.45)");
  grad.addColorStop(0.55, "rgba(6,18,46,0.18)");
  grad.addColorStop(1, "rgba(6,18,46,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  disposables.push(tex);
  return tex;
};

const makeArm = (side, sleeveMat, skinMat) => {
  const grp = new THREE.Group();
  // shoulder pivot sits just inside the torso edge
  grp.position.set(0.58 * side, 0.42, 0);
  const upper = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.16, 0.5, 6, 14)), sleeveMat);
  upper.position.y = -0.36;
  grp.add(upper);
  // cuff so sleeve meets the hand cleanly
  const cuff = new THREE.Mesh(geo(new THREE.SphereGeometry(0.165, 14, 14)), sleeveMat);
  cuff.position.y = -0.62;
  grp.add(cuff);
  const hand = new THREE.Mesh(geo(new THREE.SphereGeometry(0.16, 18, 18)), skinMat);
  hand.position.y = -0.78;
  grp.add(hand);
  return grp;
};

const makeLeg = (side, shortsMat, skinMat, shoeMat) => {
  const grp = new THREE.Group();
  grp.position.set(0.28 * side, -0.58, 0);
  const thigh = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.22, 0.42, 6, 14)), shortsMat);
  thigh.position.y = -0.28;
  grp.add(thigh);
  const shin = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.17, 0.4, 6, 14)), skinMat);
  shin.position.y = -0.78;
  grp.add(shin);
  const foot = new THREE.Mesh(geo(new THREE.BoxGeometry(0.32, 0.2, 0.52)), shoeMat);
  foot.position.set(0, -1.05, 0.14);
  grp.add(foot);
  return grp;
};

const buildCharacter = () => {
  const g = new THREE.Group();

  const skin = mat(0xffd2a8);
  const hair = mat(0x3b2a20, { roughness: 0.88 });
  const shirt = mat(0xeef3fb, { roughness: 0.65 });
  const tie = mat(0x2563eb, { roughness: 0.5 });
  const shorts = mat(0x1e3a8a);
  const shoe = mat(0x0f172a, { roughness: 0.5 });
  const bag = mat(0x0891b2, { roughness: 0.55 });
  const dark = mat(0x241a14, { roughness: 0.4 });
  const white = mat(0xffffff, { roughness: 0.3 });
  const blush = mat(0xfb7185, { roughness: 0.6, transparent: true, opacity: 0.5 });

  // ----- backpack (behind torso) -----
  const backpack = new THREE.Mesh(geo(new THREE.BoxGeometry(1.15, 1.25, 0.55)), bag);
  backpack.position.set(0, 0.05, -0.55);
  g.add(backpack);
  const bagPocket = new THREE.Mesh(geo(new THREE.BoxGeometry(0.8, 0.5, 0.2)), mat(0x0e7490));
  bagPocket.position.set(0, -0.2, -0.86);
  g.add(bagPocket);

  // ----- torso -----
  const torso = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.6, 0.62, 8, 18)), shirt);
  g.add(torso);
  // tie
  const tieKnot = new THREE.Mesh(geo(new THREE.BoxGeometry(0.16, 0.16, 0.06)), tie);
  tieKnot.position.set(0, 0.42, 0.56);
  g.add(tieKnot);
  const tieBody = new THREE.Mesh(geo(new THREE.BoxGeometry(0.2, 0.5, 0.05)), tie);
  tieBody.position.set(0, 0.1, 0.56);
  g.add(tieBody);
  // straps
  [-0.26, 0.26].forEach((x) => {
    const strap = new THREE.Mesh(geo(new THREE.BoxGeometry(0.1, 1.05, 0.08)), bag);
    strap.position.set(x, 0.1, 0.55);
    g.add(strap);
  });

  // ----- arms -----
  armRest = makeArm(-1, shirt, skin);
  armRest.rotation.z = -0.2; // slight outward splay (resting at the side)
  g.add(armRest);

  waveArm = makeArm(1, shirt, skin);
  waveArm.rotation.z = 2.2; // raised up-and-out to wave
  g.add(waveArm);

  // ----- legs -----
  g.add(makeLeg(-1, shorts, skin, shoe));
  g.add(makeLeg(1, shorts, skin, shoe));

  // ----- neck (short) + collar -----
  const neck = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.23, 0.27, 0.18, 18)), skin);
  neck.position.y = 0.86;
  g.add(neck);
  const collar = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.32, 0.4, 0.18, 18)), shirt);
  collar.position.y = 0.78;
  g.add(collar);

  // ----- head (pivots toward cursor) -----
  headPivot = new THREE.Group();
  headPivot.position.y = 1.32;
  g.add(headPivot);

  const head = new THREE.Mesh(geo(new THREE.SphereGeometry(0.64, 36, 32)), skin);
  head.scale.set(1, 0.99, 0.96);
  headPivot.add(head);

  // ----- hair (crown, back & sides; face stays exposed) -----
  const hairMass = new THREE.Mesh(geo(new THREE.SphereGeometry(0.7, 36, 32)), hair);
  hairMass.scale.set(1.0, 1.02, 1.0);
  hairMass.position.set(0, 0.08, -0.12);
  headPivot.add(hairMass);

  // bangs / fringe across the upper forehead (above the eyebrows)
  const bangs = new THREE.Mesh(
    geo(new THREE.SphereGeometry(0.66, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.34)),
    hair
  );
  bangs.scale.set(1.04, 0.85, 1.06);
  bangs.position.set(0, 0.26, 0.05);
  headPivot.add(bangs);

  // side tufts covering the temples
  [-1, 1].forEach((s) => {
    const tuft = new THREE.Mesh(geo(new THREE.SphereGeometry(0.24, 18, 18)), hair);
    tuft.scale.set(0.55, 1.0, 0.95);
    tuft.position.set(0.55 * s, 0.18, 0.04);
    headPivot.add(tuft);
  });

  // small top tuft for a playful look
  const topTuft = new THREE.Mesh(geo(new THREE.ConeGeometry(0.09, 0.26, 12)), hair);
  topTuft.position.set(0.08, 0.78, -0.04);
  topTuft.rotation.z = -0.35;
  headPivot.add(topTuft);

  // ears
  [-1, 1].forEach((s) => {
    const ear = new THREE.Mesh(geo(new THREE.SphereGeometry(0.13, 16, 16)), skin);
    ear.position.set(0.62 * s, -0.02, 0);
    headPivot.add(ear);
  });

  // eyes
  [-0.23, 0.23].forEach((x) => {
    const ewhite = new THREE.Mesh(geo(new THREE.SphereGeometry(0.12, 18, 18)), white);
    ewhite.scale.set(0.9, 1.15, 0.5);
    ewhite.position.set(x, 0.04, 0.55);
    headPivot.add(ewhite);
    const pupil = new THREE.Mesh(geo(new THREE.SphereGeometry(0.06, 16, 16)), dark);
    pupil.position.set(x, 0.03, 0.64);
    headPivot.add(pupil);
    const spark = new THREE.Mesh(geo(new THREE.SphereGeometry(0.02, 10, 10)), white);
    spark.position.set(x - 0.03, 0.08, 0.69);
    headPivot.add(spark);
  });

  // tear (shown only when sad)
  const tearMat = mat(0x7dd3fc, { transparent: true, opacity: 0.9, emissive: 0x38bdf8, emissiveIntensity: 0.4, roughness: 0.2 });
  tear = new THREE.Mesh(geo(new THREE.SphereGeometry(0.055, 12, 12)), tearMat);
  tear.scale.set(1, 1.3, 1);
  tear.position.set(-0.23, -0.08, 0.6);
  tear.visible = false;
  headPivot.add(tear);

  // blush
  [-0.34, 0.34].forEach((x) => {
    const b = new THREE.Mesh(geo(new THREE.CircleGeometry(0.09, 18)), blush);
    b.position.set(x, -0.12, 0.56);
    headPivot.add(b);
  });

  // eyebrows (kept as refs so they can express emotion)
  const makeBrow = (x) => {
    const brow = new THREE.Mesh(geo(new THREE.BoxGeometry(0.18, 0.035, 0.05)), dark);
    brow.position.set(x, 0.26, 0.55);
    brow.rotation.z = x < 0 ? 0.12 : -0.12;
    headPivot.add(brow);
    return brow;
  };
  browL = makeBrow(-0.23);
  browR = makeBrow(0.23);

  // mouth (smile ↔ frown via rotation)
  mouth = new THREE.Mesh(geo(new THREE.TorusGeometry(0.17, 0.028, 10, 20, Math.PI)), dark);
  mouth.position.set(0, -0.18, 0.5);
  mouth.rotation.z = Math.PI;
  headPivot.add(mouth);

  return g;
};

const setupResize = () => {
  const el = container.value;
  const resize = () => {
    if (!el || !renderer || !camera) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(el);
};

const animate = () => {
  raf = requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // smooth body rotation toward cursor
  const desiredY = target.x * 0.55;
  const desiredX = -target.y * 0.22;
  current.y += (desiredY - current.y) * 0.08;
  current.x += (desiredX - current.x) * 0.08;
  root.rotation.y = current.y;
  root.rotation.x = current.x;

  const happy = props.mood === "happy";
  const sad = props.mood === "sad";

  // head looks a little extra toward cursor (+ droop/lift by mood)
  const droopTarget = sad ? 0.4 : happy ? -0.12 : 0;
  em.droop += (droopTarget - em.droop) * 0.1;
  headCur.y += (target.x * 0.3 - headCur.y) * 0.1;
  headCur.x += (-target.y * 0.22 - headCur.x) * 0.1;
  headPivot.rotation.y = headCur.y;
  headPivot.rotation.x = headCur.x + em.droop;

  // ---- facial expression ----
  // mouth: smile (PI) when happy/idle, frown (0) when sad
  const mouthZ = sad ? 0 : Math.PI;
  mouth.rotation.z += (mouthZ - mouth.rotation.z) * 0.18;
  const mouthScale = happy ? 1.4 : sad ? 0.95 : 1;
  const msc = mouth.scale.x + (mouthScale - mouth.scale.x) * 0.18;
  mouth.scale.set(msc, msc, msc);

  // eyebrows: raise when happy, sad-tilt (inner up) when sad
  const browY = happy ? 0.33 : sad ? 0.21 : 0.26;
  browL.position.y += (browY - browL.position.y) * 0.18;
  browR.position.y += (browY - browR.position.y) * 0.18;
  const browLZ = sad ? -0.42 : 0.12;
  const browRZ = sad ? 0.42 : -0.12;
  browL.rotation.z += (browLZ - browL.rotation.z) * 0.18;
  browR.rotation.z += (browRZ - browR.rotation.z) * 0.18;

  // tear when sad
  tear.visible = sad;
  if (sad) {
    const fall = (t * 0.7) % 1;
    tear.position.y = -0.08 - fall * 0.55;
    tear.material.opacity = 0.9 * (1 - fall);
  }

  // ---- arms (lerp base, then add oscillation) ----
  const waveBase = happy ? 2.55 : sad ? 0.4 : 2.2;
  const restBase = happy ? -2.55 : -0.2;
  em.wave += (waveBase - em.wave) * 0.12;
  em.rest += (restBase - em.rest) * 0.12;

  let waveOsc = 0;
  let restOsc = 0;
  if (!reducedMotion) {
    if (happy) {
      waveOsc = Math.sin(t * 11) * 0.18;
      restOsc = -Math.sin(t * 11) * 0.18;
    } else if (!sad) {
      waveOsc = Math.sin(t * 6) * 0.24;
    }
  }
  waveArm.rotation.z = em.wave + waveOsc;
  armRest.rotation.z = em.rest + restOsc;

  // ---- body bob ----
  if (!reducedMotion) {
    if (happy) root.position.y = Math.abs(Math.sin(t * 4)) * 0.2;
    else if (sad) root.position.y = -0.07 + Math.sin(t * 1.2) * 0.025;
    else root.position.y = Math.sin(t * 1.6) * 0.09;
    if (ring) ring.rotation.z = t * 0.5;
  } else {
    root.position.y = sad ? -0.07 : 0;
  }

  renderer.render(scene, camera);
};

onMounted(() => {
  const el = container.value;
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.5, 8.4);
  camera.lookAt(0, 0.32, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);

  // lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7dd3fc, 0.9);
  rim.position.set(-4, 2.5, -3);
  scene.add(rim);
  const fill = new THREE.PointLight(0x60a5fa, 0.6, 30);
  fill.position.set(0, -2, 4);
  scene.add(fill);

  // character
  root = buildCharacter();
  scene.add(root);

  // floating glow ring
  ring = new THREE.Mesh(
    geo(new THREE.TorusGeometry(1.15, 0.035, 14, 56)),
    mat(0x22d3ee, { emissive: 0x0891b2, emissiveIntensity: 0.8, roughness: 0.35 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.85;
  scene.add(ring);

  // contact shadow
  const shadow = new THREE.Mesh(
    geo(new THREE.PlaneGeometry(2.8, 2.8)),
    new THREE.MeshBasicMaterial({ map: makeRadialShadowTexture(), transparent: true, depthWrite: false })
  );
  disposables.push(shadow.material);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.9;
  scene.add(shadow);

  setupResize();
  clock = new THREE.Clock();
  animate();
});

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf);
  if (resizeObserver) resizeObserver.disconnect();
  disposables.forEach((d) => d.dispose && d.dispose());
  if (renderer) {
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }
  scene = null;
  renderer = null;
  camera = null;
});
</script>

<style scoped>
.student-3d {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.student-3d :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
