import { useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const DESTROYER_URL = '/star_destroyer.glb';

export interface FleetMotion {
  /** 0..1 — progresso do scroll na seção. */
  p: number;
  /** Ponteiro normalizado (-1..1). */
  pointer: { x: number; y: number };
}

interface Props {
  motion: MutableRefObject<FleetMotion>;
  onReady?: () => void;
  /** Marcadores HTML (drei <Html>) posicionados em coordenadas da nave normalizada. */
  children?: ReactNode;
}

const smooth = (a: number, b: number, t: number) => {
  const u = THREE.MathUtils.clamp((t - a) / (b - a), 0, 1);
  return u * u * (3 - 2 * u);
};

/**
 * Star Destroyer: passa por cima da câmera (abertura de Star Wars) e assenta em vista 3/4.
 * A proa do modelo aponta para -Z; o grupo é normalizado para comprimento 1.
 */
export default function StarDestroyer({ motion, onReady, children }: Props) {
  const { scene } = useGLTF(DESTROYER_URL);
  const rig = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.PointLight>(null);
  const bridgeRef = useRef<THREE.PointLight>(null);

  const base = useMemo(() => {
    const probe = scene.clone(true);
    probe.position.set(0, 0, 0);
    probe.rotation.set(0, 0, 0);
    probe.scale.set(1, 1, 1);
    probe.updateMatrixWorld(true);
    const size = new THREE.Box3().setFromObject(probe).getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return 1 / maxDim;
  }, [scene]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material;
      if (!mat || Array.isArray(mat)) return;
      if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) return;
      mat.metalness = THREE.MathUtils.clamp(mat.metalness * 1.05, 0.3, 0.9);
      mat.roughness = THREE.MathUtils.clamp(mat.roughness, 0.35, 0.8);
      mat.envMapIntensity = 1.2;
      mat.needsUpdate = true;
    });
    onReady?.();
  }, [scene, onReady]);

  useFrame((state, delta) => {
    const g = rig.current;
    if (!g) return;
    const { p, pointer } = motion.current;
    const t = state.clock.elapsedTime;

    // Fase A (0→0.5): rasante por cima da câmera, afastando-se.
    // Fase B (0.5→0.85): vira para a vista 3/4 e aproxima.
    const a = smooth(0, 0.5, p);
    const b = smooth(0.5, 0.85, p);

    // Entra pelo alto do quadro, enorme, e recua até virar um ponto; depois volta em 3/4.
    const x = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0.6, 0.2, a), -0.6, b) + pointer.x * 0.25 * b;
    const y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(2.3, 1.1, a), 0.05, b) + pointer.y * -0.15 * b + Math.sin(t * 0.35) * 0.03 * b;
    const z = THREE.MathUtils.lerp(THREE.MathUtils.lerp(8.5, -16, a), -3.2, b);
    const len = THREE.MathUtils.lerp(THREE.MathUtils.lerp(34, 12, a), 15, b);
    const yaw = THREE.MathUtils.lerp(0, -0.95, b) + pointer.x * 0.06 * b + Math.sin(t * 0.21) * 0.01 * b;
    const pitch = THREE.MathUtils.lerp(-0.05, 0.12, b) + Math.sin(t * 0.17) * 0.006 * b;
    const roll = THREE.MathUtils.lerp(0.03, -0.08, b);

    const k = 6;
    g.position.x = THREE.MathUtils.damp(g.position.x, x, k, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, y, k, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, z, k, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pitch, k, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw, k, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, roll, k, delta);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x || len, len, k, delta));

    const eng = 0.84 + Math.sin(t * 2.5) * 0.16;
    if (engineRef.current) engineRef.current.intensity = 2.4 * eng;
    if (bridgeRef.current) bridgeRef.current.intensity = 0.9 + Math.sin(t * 1.9) * 0.3;
  });

  return (
    <group ref={rig} position={[0.6, 2.3, 8.5]} scale={34}>
      {/* Modelo normalizado (comprimento 1), girado para a proa apontar para -Z */}
      <group scale={base} rotation={[0, Math.PI, 0]}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>

      {/* Marcadores presos ao casco */}
      {children}

      {/* Motores (popa, +Z) e ponte */}
      <pointLight ref={engineRef} color="#9fc4ff" intensity={2.4} distance={1.6} decay={2} position={[0, -0.02, 0.56]} />
      <pointLight ref={bridgeRef} color="#8ad6ff" intensity={0.9} distance={0.5} decay={2} position={[0, 0.2, 0.34]} />
      <pointLight color="#ff1a1a" intensity={0.9} distance={1.8} decay={2} position={[0, -0.35, 0]} />
    </group>
  );
}
