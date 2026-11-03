import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

export default function HologramHelmet() {
  const { scene } = useGLTF('/darth_vader_helmet.glb');

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0) return 1;
    return 2.5 / maxDim;
  }, [scene]);

  const groupRef = useRef<THREE.Group>(null);
  const light1Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    groupRef.current.rotation.y = t * 0.25;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;

    if (light1Ref.current) {
      light1Ref.current.intensity = 3 + Math.sin(t * 2) * 1;
      light1Ref.current.position.x = Math.sin(t * 0.5) * 3;
      light1Ref.current.position.z = Math.cos(t * 0.5) * 3;
    }
  });

  return (
    <group ref={groupRef} scale={normalizedScale}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
      <pointLight
        ref={light1Ref}
        color="#ff0000"
        intensity={1.5}
        distance={10}
        decay={2}
      />
      <pointLight
        color="#ffffff"
        intensity={2}
        distance={8}
        decay={2}
        position={[0, 2, 3]}
      />
      <pointLight
        color="#aaaaaa"
        intensity={1}
        distance={6}
        decay={2}
        position={[0, 3, 0]}
      />
    </group>
  );
}
