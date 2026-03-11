import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 1800;
const LIME = new THREE.Color('#d2ff00');
const DARK = new THREE.Color('#030403');
const BG = '#030403';

function MatrixRain() {
  const pointsRef = useRef<THREE.Points>(null);
  const initialY = useRef<Float32Array | null>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds[i] = 0.02 + Math.random() * 0.04;
    }

    return { positions, speeds };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] -= speeds[i] * 60 * delta;
      if (pos[i * 3 + 1] < -10) pos[i * 3 + 1] = 10;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={LIME}
        transparent
        opacity={0.28}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function MatrixGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const mats = Array.isArray(gridRef.current.material)
      ? gridRef.current.material
      : [gridRef.current.material];
    mats.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.04;
    });
  }, []);

  useFrame((state) => {
    if (!gridRef.current) return;
    const mats = Array.isArray(gridRef.current.material)
      ? gridRef.current.material
      : [gridRef.current.material];
    const opacity = 0.03 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    mats.forEach((m) => { m.opacity = opacity; });
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[30, 30, LIME, new THREE.Color('#051005')]}
      position={[0, 0, -5]}
    />
  );
}

export default function MatrixBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ background: BG }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[DARK, 4, 14]} />
        <MatrixGrid />
        <MatrixRain />
      </Canvas>
      {/* Overlay escuro para melhorar leitura do conteúdo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(3,4,3,0.7) 0%, rgba(3,4,3,0.85) 100%)' }}
      />
    </div>
  );
}
