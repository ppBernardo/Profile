import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

export interface DeathStarMotion {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotY: number;
}

interface Props {
  motionRef?: React.MutableRefObject<DeathStarMotion>;
  /** Rotação segue motion.rotY com amortecimento. Ideal para rotY ligado ao scroll. */
  smoothedScrollRotation?: boolean;
  /** Quanto maior, mais rápido o alvo é alcançado (aprox. 4–14). */
  rotationLerp?: number;
  /** Giro contínuo em Y somado após o lerp (rad por segundo de relógio, igual ao termo `t * 0.06` do modo padrão). 0 = desligado. */
  continuousSpin?: number;
}

export default function DeathStar({
  motionRef,
  smoothedScrollRotation = false,
  rotationLerp = 8,
  continuousSpin = 0,
}: Props) {
  const { scene } = useGLTF('/death_star_-_star_wars.glb');
  const groupRef = useRef<THREE.Group>(null);
  const keyRef = useRef<THREE.PointLight>(null);
  const smoothRotYRef = useRef<number | null>(null);

  const normalizedScale = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 3 / maxDim : 1;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const motion = motionRef?.current;
    if (!motion) return;

    groupRef.current.position.set(
      motion.x + Math.sin(t * 0.15) * 0.008,
      motion.y + Math.sin(t * 0.2) * 0.01,
      motion.z
    );

    if (smoothedScrollRotation) {
      if (smoothRotYRef.current === null) smoothRotYRef.current = motion.rotY;
      const k = 1 - Math.exp(-rotationLerp * delta);
      smoothRotYRef.current += (motion.rotY - smoothRotYRef.current) * k;
      const spin = continuousSpin > 0 ? t * continuousSpin : 0;
      groupRef.current.rotation.y = smoothRotYRef.current + spin;
    } else {
      groupRef.current.rotation.y = motion.rotY + t * 0.06;
    }
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.01;
    groupRef.current.scale.setScalar(normalizedScale * motion.scale);

    if (keyRef.current) {
      keyRef.current.intensity = 4.8 + Math.sin(t * 0.35) * 0.18;
    }
  });

  return (
    <group ref={groupRef} scale={normalizedScale}>
      <Center>
        <primitive object={scene} />
      </Center>

      {/* Key — frontal quente, modela volume sem estourar highlights */}
      <pointLight
        ref={keyRef}
        color="#eef1f6"
        intensity={4.8}
        distance={32}
        decay={2}
        position={[6.5, 3.8, 8]}
      />

      {/* Fill — lado oposto, azul-acinzentado (contraste cinematográfico) */}
      <pointLight
        color="#7d92b0"
        intensity={2.6}
        distance={28}
        decay={2}
        position={[-6.5, 1.2, 5]}
      />

      {/* Rim — contorno frio contra fundo escuro */}
      <pointLight
        color="#c5daf8"
        intensity={5.2}
        distance={36}
        decay={2}
        position={[-3.5, 2.2, -9.5]}
      />

      {/* Top — leitura do “polo” superior */}
      <pointLight
        color="#f4f6fa"
        intensity={1.9}
        distance={22}
        decay={2}
        position={[0.5, 8, 1]}
      />

      {/* Bounce inferior — profundidade na base da esfera */}
      <pointLight
        color="#4a5a78"
        intensity={1.25}
        distance={18}
        decay={2}
        position={[0, -5.5, 4]}
      />

      {/* Dish do superlaser — glow local suave */}
      <pointLight
        color="#52d97a"
        intensity={0.55}
        distance={14}
        decay={2}
        position={[2.2, 0.2, 3.8]}
      />

      <hemisphereLight
        color="#a3b8d4"
        groundColor="#08090c"
        intensity={0.38}
      />
    </group>
  );
}

useGLTF.preload('/death_star_-_star_wars.glb');
