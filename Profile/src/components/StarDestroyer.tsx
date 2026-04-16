import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Public interface ───────────────────────────────────────────────── */

export interface StarDestroyerMotion {
  /** 0–1: section scroll progress, used for subtle parallax */
  scroll: number;
  /**
   * Entrada da nave: 0 = pequena e mais à esquerda; 1 = pose final.
   * Animado por GSAP (ease forte no fim).
   */
  intro: number;
}

interface Props {
  motionRef: React.MutableRefObject<StarDestroyerMotion>;
}

useGLTF.preload('/star_destroyer.glb');

/* ─── Camera setup (one-time, sets lookAt direction) ──────────────────── */

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    // Olha mais à esquerda — encaixa nave maior e mais deslocada.
    // Ponto de interesse na massa da nave (esquerda); câmera perto = nave enorme na tela.
    camera.lookAt(-4.6, -0.02, 0);
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  }, [camera]);
  return null;
}

/* ─── Star Destroyer ─────────────────────────────────────────────────── */

export default function StarDestroyer({ motionRef }: Props) {
  const { scene } = useGLTF('/star_destroyer.glb');
  const groupRef = useRef<THREE.Group>(null);

  const keyRef    = useRef<THREE.DirectionalLight>(null);
  const fillRef   = useRef<THREE.PointLight>(null);
  const rimRef    = useRef<THREE.PointLight>(null);
  const engineRef = useRef<THREE.PointLight>(null);
  const bridgeRef = useRef<THREE.PointLight>(null);

  // Normalize so the largest dimension equals 3.8 units
  const normalizedScale = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 3.8 / maxDim : 1;
  }, [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const { scroll, intro } = motionRef.current;
    const i = Math.max(0, Math.min(1, intro));

    /* ── Idle float — very subtle (só após intro quase completo) ─────── */
    const floatBlend = THREE.MathUtils.smoothstep(i, 0.82, 1);
    const floatY = Math.sin(t * 0.33) * 0.036 * floatBlend;
    const floatZ = Math.sin(t * 0.18) * 0.008 * floatBlend;

    /* ── Scroll parallax — barely perceptible ────────────────────────── */
    const parallaxY = scroll * -0.09 * floatBlend;

    /* ── Entrada: pequena e longe à esquerda → pose final (GSAP interpola i) ─ */
    const startX = -12.8;
    const endX = -5.55;
    const startScaleMult = 2.35;
    const endScaleMult = 9.25;
    const posX = THREE.MathUtils.lerp(startX, endX, i);
    const scaleMult = THREE.MathUtils.lerp(startScaleMult, endScaleMult, i);

    groupRef.current.position.set(posX, floatY + parallaxY, 0);

    /* ── Micro rotation — quase imperceptível (blend com intro) ─────── */
    groupRef.current.rotation.set(
      -0.08 + Math.sin(t * 0.13) * 0.005 * floatBlend,
      Math.sin(t * 0.21) * 0.012 * floatBlend,
      0.018 + Math.sin(t * 0.09) * 0.004 * floatBlend + floatZ,
    );

    groupRef.current.scale.setScalar(normalizedScale * scaleMult);

    /* ── Lighting pulse ──────────────────────────────────────────────── */
    const pulse    = 0.92 + Math.sin(t * 1.3) * 0.08;
    const engPulse = 0.84 + Math.sin(t * 2.5) * 0.16;  // engine flicker
    const brgPulse = 0.88 + Math.sin(t * 1.9) * 0.12;  // bridge glow

    if (keyRef.current)    keyRef.current.intensity    = 3.0 * pulse;
    if (fillRef.current)   fillRef.current.intensity   = 1.6;
    if (rimRef.current)    rimRef.current.intensity    = 2.3 * pulse;
    if (engineRef.current) engineRef.current.intensity = 1.8 * engPulse;
    if (bridgeRef.current) bridgeRef.current.intensity = 1.1 * brgPulse;
  });

  return (
    <>
      <CameraSetup />

      <group ref={groupRef}>
        {/* +PI/2 on Y: rotates model so nose points toward -X (screen-left) */}
        <group rotation={[0, Math.PI * 0.5, 0]}>
          <Center>
            <primitive object={scene} />
          </Center>
        </group>

        {/* Key light: top-front, cool white */}
        <directionalLight
          ref={keyRef}
          color="#dce8ff"
          intensity={3.0}
          position={[3, 5, 5]}
          castShadow={false}
        />
        {/* Fill: deep blue-navy */}
        <pointLight
          ref={fillRef}
          color="#1a3355"
          intensity={1.6}
          distance={22}
          decay={1.5}
          position={[-3, 1, 3]}
        />
        {/* Rim: white backlight for silhouette separation */}
        <pointLight
          ref={rimRef}
          color="#ffffff"
          intensity={2.3}
          distance={25}
          decay={1.4}
          position={[0, 3, -9]}
        />
        {/* Engine glow (rear-left of ship) */}
        <pointLight
          ref={engineRef}
          color="#99bbff"
          intensity={1.8}
          distance={9}
          decay={2}
          position={[-2.2, -0.1, -0.3]}
        />
        {/* Bridge / cockpit glow (cyan) */}
        <pointLight
          ref={bridgeRef}
          color="#00ccff"
          intensity={1.1}
          distance={5}
          decay={2}
          position={[0.8, 0.9, 0.4]}
        />
        {/* Imperial red underlight */}
        <pointLight
          color="#ff1111"
          intensity={0.55}
          distance={11}
          decay={2}
          position={[0, -2.5, 0]}
        />
        <ambientLight intensity={0.08} color="#5566778" />
      </group>
    </>
  );
}
