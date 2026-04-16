import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  scrollProgress: React.MutableRefObject<number>;
}

export default function DarthHelmet({ scrollProgress }: Props) {
  const { scene } = useGLTF('/darth_vader_helmet.glb');
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0) return 1;
    const targetSize = Math.min(viewport.width, viewport.height) * 0.55;
    return targetSize / maxDim;
  }, [scene, viewport]);

  useEffect(() => {
    // Ajusta materiais para melhorar leitura do modelo sob luz dinâmica.
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material;
      if (!mat || Array.isArray(mat)) return;
      if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) return;

      mat.roughness = THREE.MathUtils.clamp(mat.roughness * 0.78, 0.08, 0.64);
      mat.metalness = THREE.MathUtils.clamp(mat.metalness * 1.08, 0.28, 1);
      mat.envMapIntensity = 1.65;
      mat.needsUpdate = true;
    });
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const sp = scrollProgress.current;

    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15 + sp * Math.PI * 0.6;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.03 - sp * 0.2;
    groupRef.current.position.y = THREE.MathUtils.lerp(0, 3, sp);

    const scale = normalizedScale * THREE.MathUtils.lerp(1, 0.4, sp);
    groupRef.current.scale.setScalar(scale);

    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(t * 0.6) * 4;
      lightRef.current.position.z = Math.cos(t * 0.6) * 4;
      lightRef.current.position.y = 1 + Math.sin(t * 0.4) * 0.5;
      lightRef.current.intensity = 0.72 + Math.sin(t * 1.5) * 0.22;
    }

    if (light2Ref.current) {
      light2Ref.current.position.x = Math.sin(t * 0.4 + 2) * 3;
      light2Ref.current.position.z = Math.cos(t * 0.4 + 2) * 3;
      light2Ref.current.intensity = 0.42 + Math.sin(t * 0.8) * 0.14;
    }
  });

  return (
    <group ref={groupRef} scale={normalizedScale}>
      <Center>
        <primitive object={scene} />
      </Center>

      {/* Key light — frontal-esquerda com mais presença no rosto */}
      <pointLight
        color="#ffffff"
        intensity={7.2}
        distance={24}
        decay={1.6}
        position={[3.8, 3.2, 5.6]}
      />

      {/* Fill light — lado oposto, tom frio para detalhes nas sombras */}
      <pointLight
        color="#8da7cf"
        intensity={3.25}
        distance={15}
        decay={1.5}
        position={[-4.4, 1.8, 3.6]}
      />

      {/* Front fill — abre a região dos olhos/triângulo frontal */}
      <pointLight
        color="#e8f1ff"
        intensity={2.6}
        distance={13}
        decay={1.45}
        position={[0.1, 0.95, 4.25]}
      />

      {/* Chin fill — recupera volume na parte inferior do capacete */}
      <pointLight
        color="#d7e3f8"
        intensity={1.55}
        distance={10}
        decay={1.55}
        position={[0, -1.55, 3.3]}
      />

      {/* Rim light — recorta a silhueta do capacete contra o fundo */}
      <pointLight
        color="#d7e5ff"
        intensity={4.6}
        distance={18}
        decay={1.5}
        position={[-0.2, 2.7, -6]}
      />

      {/* Top light — ilumina o topo do capacete */}
      <pointLight
        color="#ffffff"
        intensity={2.9}
        distance={13}
        decay={1.5}
        position={[0, 5.8, 0.8]}
      />

      {/* Red accent orbital — reflexo vermelho dinâmico */}
      <pointLight
        ref={lightRef}
        color="#ff0000"
        intensity={0.62}
        distance={11}
        decay={2}
      />
      <pointLight
        ref={light2Ref}
        color="#ff2a2a"
        intensity={0.36}
        distance={10.5}
        decay={2}
        position={[-3.2, 2.2, -2.2]}
      />
    </group>
  );
}

useGLTF.preload('/darth_vader_helmet.glb');
