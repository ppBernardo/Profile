import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  motionRef?: React.MutableRefObject<TIEFighterMotion>;
}

const MODEL_YAW_OFFSET = 0;

export interface TIEFighterMotion {
  x: number;
  y: number;
  z: number;
  scale: number;
  yaw: number;
  roll: number;
  pitch: number;
}

export default function TIEFighter({ motionRef }: Props) {
  const { scene } = useGLTF('/3d_t.i.e_fighter_-_star_wars_model.glb');
  const groupRef = useRef<THREE.Group>(null);

  const keyRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const topRef = useRef<THREE.PointLight>(null);

  const normalizedScale = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 3.2 / maxDim : 1;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const motion = motionRef?.current;
    if (!motion) return;

    const xJitter = Math.sin(t * 1.3) * 0.01;
    const yJitter = Math.sin(t * 0.9) * 0.012;
    const zJitter = Math.sin(t * 0.7) * 0.007;

    groupRef.current.position.set(
      motion.x + xJitter,
      motion.y + yJitter,
      motion.z + zJitter
    );

    groupRef.current.rotation.y = motion.yaw + MODEL_YAW_OFFSET + Math.sin(t * 0.3) * 0.01;
    groupRef.current.rotation.z = motion.roll + Math.sin(t * 0.4) * 0.006;
    groupRef.current.rotation.x = motion.pitch + Math.sin(t * 0.5) * 0.006;
    groupRef.current.scale.setScalar(normalizedScale * motion.scale);

    // Escala luzes com o tamanho da nave para manter visibilidade
    const s = motion.scale;
    const boost = 1 + (s - 0.38) * 0.8;

    if (keyRef.current) {
      keyRef.current.intensity = 5 * boost;
      keyRef.current.distance = 18 * s;
    }
    if (fillRef.current) {
      fillRef.current.intensity = 3 * boost;
      fillRef.current.distance = 16 * s;
    }
    if (rimRef.current) {
      rimRef.current.intensity = 4 * boost;
      rimRef.current.distance = 20 * s;
    }
    if (topRef.current) {
      topRef.current.intensity = 2.5 * boost;
      topRef.current.distance = 14 * s;
    }
  });

  return (
    <group ref={groupRef} scale={normalizedScale}>
      <group rotation={[0, 0, Math.PI]}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>

      {/* Key light — frontal-esquerda, branca forte */}
      <pointLight
        ref={keyRef}
        color="#ffffff"
        intensity={5}
        distance={18}
        decay={1.5}
        position={[4, 3, 5]}
      />

      {/* Fill light — lado oposto, tom frio */}
      <pointLight
        ref={fillRef}
        color="#b0c4ff"
        intensity={3}
        distance={16}
        decay={1.5}
        position={[-4, 1, 4]}
      />

      {/* Rim/back light — recorta silhueta */}
      <pointLight
        ref={rimRef}
        color="#ddeeff"
        intensity={4}
        distance={20}
        decay={1.5}
        position={[0, 2, -6]}
      />

      {/* Top light — ilumina asas por cima */}
      <pointLight
        ref={topRef}
        color="#ffffff"
        intensity={2.5}
        distance={14}
        decay={1.5}
        position={[0, 5, 0]}
      />

      {/* Acento vermelho sutil — temática Imperial */}
      <pointLight color="#ff2200" intensity={0.6} distance={8} decay={2} position={[-2, -1, 2]} />
    </group>
  );
}

useGLTF.preload('/3d_t.i.e_fighter_-_star_wars_model.glb');
