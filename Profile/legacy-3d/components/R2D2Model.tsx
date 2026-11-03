import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

export interface R2D2Motion {
  /** 0–1 progresso do scroll dentro da secção */
  scroll: number;
}

interface Props {
  motionRef: React.MutableRefObject<R2D2Motion>;
}

useGLTF.preload('/r2d2.glb');

export default function R2D2Model({ motionRef }: Props) {
  const { scene } = useGLTF('/r2d2.glb');
  const groupRef = useRef<THREE.Group>(null);
  const keyRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);

  const normalizedScale = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 2.4 / maxDim : 1;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const scroll = motionRef.current.scroll;

    // Mantém influência do scroll, mas com giro contínuo (idle) para o R2D2 nunca ficar "parado"
    const yaw = t * 0.55 + scroll * Math.PI * 0.9 + Math.sin(t * 0.35) * 0.08;
    const pitch = (scroll - 0.5) * 0.35 + Math.sin(t * 0.28) * 0.05;
    const roll = Math.sin(t * 0.22) * 0.04;

    groupRef.current.rotation.set(pitch, yaw, roll);
    groupRef.current.scale.setScalar(normalizedScale * (0.92 + scroll * 0.12));

    const pulse = 0.85 + Math.sin(t * 1.8) * 0.08;
    if (keyRef.current) keyRef.current.intensity = 4.2 * pulse;
    if (fillRef.current) fillRef.current.intensity = 2.8 * pulse;
    if (rimRef.current) rimRef.current.intensity = 3.2 * pulse;
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, Math.PI * 0.08, 0]}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>

      <pointLight ref={keyRef} color="#c8e8ff" intensity={4.2} distance={14} decay={1.6} position={[3.5, 2.5, 4]} />
      <pointLight ref={fillRef} color="#4488ff" intensity={2.8} distance={12} decay={1.6} position={[-3, 1, 3]} />
      <pointLight ref={rimRef} color="#ffffff" intensity={3.2} distance={16} decay={1.6} position={[0, 1.5, -5]} />
      <ambientLight intensity={0.18} color="#aacfff" />
    </group>
  );
}
