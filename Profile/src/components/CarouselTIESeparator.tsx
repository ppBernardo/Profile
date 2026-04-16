import type { MutableRefObject } from 'react';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

const R2_MODEL = '/r2d2.glb';

useGLTF.preload(R2_MODEL);

function R2ProfileModel({ separatorHeight }: { separatorHeight: number }) {
  const { scene } = useGLTF(R2_MODEL);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.frustumCulled = false;
      }
    });
    return c;
  }, [scene]);

  const scale = useMemo(() => {
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const h = Math.max(size.y, 0.001);
    const base = 1.55 / h;
    const refH = 220;
    return base * Math.min(1.15, Math.max(0.55, separatorHeight / refH));
  }, [clone, separatorHeight]);

  return (
    <group scale={scale} rotation={[0, Math.PI / -2, 0]}>
      <Center>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <directionalLight color="#ffffff" intensity={0.85} position={[5, 3, 6]} />
      <directionalLight color="#b0c4ff" intensity={0.35} position={[-4, 1, 3]} />
      <pointLight color="#ddeeff" intensity={0.5} position={[0, 1, -5]} decay={2} distance={12} />
      <pointLight color="#ff2200" intensity={0.25} position={[-2, -1, 2]} decay={2} distance={8} />
    </>
  );
}

export interface CarouselTIESeparatorProps {
  width: number;
  height: number;
  glRegistryRef: MutableRefObject<THREE.WebGLRenderer[]>;
  className?: string;
}

/**
 * Separador 3D do carrossel (R2-D2) — canvas com alpha, pointer-events: none.
 * Registra o WebGLRenderer em glRegistryRef para ResizeObserver na seção.
 */
export default function CarouselTIESeparator({
  width,
  height,
  glRegistryRef,
  className = '',
}: CarouselTIESeparatorProps) {
  const glInstance = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    return () => {
      const gl = glInstance.current;
      if (!gl) return;
      glRegistryRef.current = glRegistryRef.current.filter((g) => g !== gl);
    };
  }, [glRegistryRef]);

  return (
    <div
      className={`carousel-separator shrink-0 overflow-visible ${className}`.trim()}
      style={{ width, height }}
      aria-hidden
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 42, position: [0, 0, 4.45], near: 0.08, far: 120 }}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          display: 'block',
        }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          glInstance.current = gl;
          gl.setClearColor(0x000000, 0);
          glRegistryRef.current.push(gl);
        }}
      >
        <Lights />
        <Suspense fallback={null}>
          <R2ProfileModel separatorHeight={height} />
        </Suspense>
      </Canvas>
    </div>
  );
}
