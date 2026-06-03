/* eslint-disable react/no-unknown-property */
"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

const cardGLB = "/assets/card.glb";

export default function Profile({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 35,
  transparent = true
}) {
  return (
    <div className=" h-[160vh] z-0 flex justify-center items-center">
      <Canvas
        camera={{ position, fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          // Default to "pan-y": vertical swipes still scroll the page past the hero,
          // while horizontal-ish drags engage the card. An active drag locks to
          // "none" (set in onPointerDown) for full 2D movement.
          gl.domElement.style.touchAction = "pan-y";
        }}
      >
        <ambientLight intensity={Math.PI} />

        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band />
        </Physics>

        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const visual = useRef(); // ← visual group ref (for rotation)

  // The WebGL canvas element — we toggle its touch-action so the page can scroll
  // normally on mobile, but locks to the card while a drag is actively happening.
  const gl = useThree((s) => s.gl);

  // States
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSmall, setIsSmall] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024
  );

  // Horizontal anchor for the lanyard rig. The card hangs ~2 units right of the
  // anchor, so the anchor is offset left to centre it. Narrow (mobile) viewports
  // map world units to more screen width, so they need a smaller offset than
  // desktop or the card drifts left of centre. Set once at mount.
  const [anchorX] = useState(
    () => (typeof window !== "undefined" && window.innerWidth < 768 ? -0.1 : -1)
  );

  // 3D helpers
  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();

  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  // Load model + texture
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture("/assets/lanyard1.png");

  // Curve for the rope
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ])
  );

  // Joints
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  // Cursor style
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
    } else {
      document.body.style.cursor = "auto";
    }
  }, [hovered, dragged]);

  // Resize
  useEffect(() => {
    const handleResize = () => setIsSmall(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Frame updates
  useFrame((state, delta) => {
    // Clamp the timestep. On high-refresh displays, after a tab refocus, or when
    // a frame is dropped (common on some Windows laptops) `delta` can spike; the
    // rope lerp below multiplies it by maxSpeed (50), so an unclamped spike pushes
    // the lerp factor past 1, overshoots, and explodes the physics into NaN —
    // which is what corrupts the lanyard geometry. Capping at ~1/30s keeps the
    // simulation stable regardless of the device's refresh rate.
    const dt = Math.min(delta, 1 / 30);

    // dragging logic
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    // rotate the visual group (not the physics body)
    if (visual.current) {
      const targetRot = flipped ? Math.PI : 0; // 180° when flipped
      visual.current.rotation.y = THREE.MathUtils.lerp(
        visual.current.rotation.y,
        targetRot,
        0.12 // smoothing factor
      );
    }

    // Rope follow simulation + update physics angular velocity as before
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const d = ref.current.lerped.distanceTo(ref.current.translation());
        const clamped = Math.max(0.1, Math.min(1, d));
        ref.current.lerped.lerp(
          ref.current.translation(),
          dt * (minSpeed + clamped * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      // Only feed finite points to the rope geometry. A transient NaN from the
      // physics solver (e.g. a degenerate canvas size on the first frames before
      // the ResizeObserver settles) would otherwise poison the MeshLine geometry,
      // spamming computeBoundingSphere NaN warnings and dropping the lanyard.
      if (curve.points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z))) {
        band.current.geometry.setPoints(curve.getPoints(32));
      }

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  useEffect(() => {
    if (!texture) return;
    const clonedTexture = texture.clone();
    clonedTexture.wrapS = THREE.RepeatWrapping;
    clonedTexture.wrapT = THREE.RepeatWrapping;
    clonedTexture.needsUpdate = true;
  }, [texture]);

  return (
    <>
      <group position={[anchorX, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          {/* VISUAL GROUP: attach the ref here and animate rotation on this ref */}
          <group
            ref={visual}
            scale={4}
            position={[0, -3.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (!isDragging) {
                setFlipped((p) => !p);
              }
            }}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              // Restore vertical page scrolling once the drag ends.
              if (gl) gl.domElement.style.touchAction = "pan-y";
              drag(false);
              setTimeout(() => setIsDragging(false), 100);
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              // Lock touch scrolling on the canvas so a touch-drag moves the card
              // instead of scrolling the page.
              if (gl) gl.domElement.style.touchAction = "none";
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              setIsDragging(false);
            }}
            onPointerMove={(e) => {
              if (dragged) {
                setIsDragging(true);
              }
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
                map-anisotropy={16}
              />
            </mesh>

            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      {/* LANYARD */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}