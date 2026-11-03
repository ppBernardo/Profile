import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function SaberLoading() {
  const bladeRef = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const scaleRef = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    scaleRef.current = Math.min(scaleRef.current + 0.04, 1);

    if (bladeRef.current) {
      bladeRef.current.scale.y = scaleRef.current;
      bladeRef.current.position.y = (scaleRef.current - 1) * 0.6;
    }
    if (glowRef.current) {
      glowRef.current.scale.y = scaleRef.current;
      glowRef.current.position.y = (scaleRef.current - 1) * 0.6;
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.15 + Math.sin(t * 8) * 0.05) * scaleRef.current;
    }
    if (lightRef.current) {
      lightRef.current.intensity = (2 + Math.sin(t * 6) * 0.8) * scaleRef.current;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Cabo (hilt) */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.25, 12]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.04, 12]} />
        <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Lâmina — revela de baixo para cima */}
      <mesh ref={bladeRef} position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.1, 10]} />
        <meshBasicMaterial color="#ff4400" />
      </mesh>

      {/* Glow da lâmina */}
      <mesh ref={glowRef} position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.15, 10]} />
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color="#ff2200"
        intensity={2}
        distance={3}
        decay={2}
        position={[0, 0.2, 0.2]}
      />
    </group>
  );
}
