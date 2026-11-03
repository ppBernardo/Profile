import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  targetHeight?: number;
  scrollProgress?: React.MutableRefObject<number>;
}

// Textura de glow — gradiente radial criado em canvas
const glowTexture = (() => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  g.addColorStop(0,    'rgba(255, 230, 220, 1)');
  g.addColorStop(0.08, 'rgba(255,  80,  20, 0.9)');
  g.addColorStop(0.25, 'rgba(255,   0,   0, 0.5)');
  g.addColorStop(0.55, 'rgba(200,   0,   0, 0.12)');
  g.addColorStop(1,    'rgba(100,   0,   0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
})();

export default function Lightsaber3D({ targetHeight = 1.8, scrollProgress }: Props) {
  const { scene } = useGLTF('/lightsaber_red.glb');
  const groupRef   = useRef<THREE.Group>(null);
  const lightRef   = useRef<THREE.PointLight>(null);
  const light2Ref  = useRef<THREE.PointLight>(null);
  const spritesRef = useRef<(THREE.Sprite | null)[]>([]);

  const { normalizedScale, modelRotation } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box  = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? targetHeight / maxDim : 1;

    // Alinha automaticamente o eixo mais longo da malha ao eixo Y (vertical).
    // Isso evita sabre "deitado" quando o GLB vem com orientação diferente.
    let rotation = new THREE.Euler(0, 0, 0);
    if (size.x >= size.y && size.x >= size.z) {
      rotation = new THREE.Euler(0, 0, Math.PI / 2);
    } else if (size.z >= size.y && size.z >= size.x) {
      rotation = new THREE.Euler(-Math.PI / 2, 0, 0);
    }

    return { normalizedScale: scale, modelRotation: rotation };
  }, [scene, targetHeight]);

  
  const bladeSprites = useMemo(() => {
    const half  = targetHeight / 2;
    const start = half * 0.05;
    const end   = half * 0.95;
    return Array.from({ length: 12 }, (_, i) => start + (i / 11) * (end - start));
  }, [targetHeight]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t  = state.clock.elapsedTime;
    const sp = scrollProgress?.current ?? 0;

    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.2 + sp * Math.PI * 2;
    groupRef.current.rotation.x = Math.sin(sp * Math.PI) * 0.4;
    groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.05 + Math.sin(sp * Math.PI) * 0.15;
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.04 + Math.sin(sp * Math.PI) * 0.3;

    const pulse     = 0.75 + Math.sin(t * 5) * 0.13 + Math.sin(t * 11) * 0.05;
    const glowBoost = 1 + Math.sin(sp * Math.PI) * 2.5;
    const halfH     = targetHeight / 2;

    if (lightRef.current)  lightRef.current.intensity  = (2 + Math.sin(t * 3) * 0.7) * glowBoost;
    if (light2Ref.current) light2Ref.current.intensity = (1.2 + Math.sin(t * 4) * 0.4) * glowBoost;

    spritesRef.current.forEach((sprite, i) => {
      if (!sprite) return;
      const mat    = sprite.material as THREE.SpriteMaterial;
      const nrm    = i / 11;
      // Falloff: bordas (0 e 1) mais escuras, centro (0.5) mais brilhante
      const falloff = Math.sin(nrm * Math.PI);
      const s = targetHeight * (0.2 + falloff * 0.2) * pulse;
      sprite.scale.set(s, s, 1);
      mat.opacity = pulse * (0.3 + falloff * 0.4) * glowBoost * 0.65;
    });

    // Liga luz na ponta e no meio da lâmina
    if (lightRef.current)  lightRef.current.position.set(0, halfH * 0.8, 0.15);
    if (light2Ref.current) light2Ref.current.position.set(0, halfH * 0.35, 0.15);
  });

  return (
    <group ref={groupRef} scale={normalizedScale}>
      <group rotation={[modelRotation.x, modelRotation.y, modelRotation.z]}>
        <group rotation={[0, Math.PI, 0]}>
          <Center>
            <primitive object={scene} />
          </Center>
        </group>
      </group>

      {/* Glow sprites ao longo da lâmina (metade superior) */}
      {bladeSprites.map((y, i) => (
        <sprite
          key={i}
          ref={(el) => { spritesRef.current[i] = el; }}
          position={[0, y, 0]}
        >
          <spriteMaterial
            map={glowTexture}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            opacity={0}
          />
        </sprite>
      ))}

      {/* Luzes da lâmina */}
      <pointLight ref={lightRef}  color="#ff2200" intensity={2}   distance={5} decay={2} />
      <pointLight ref={light2Ref} color="#ff0000" intensity={1.2} distance={4} decay={2} />
    </group>
  );
}

useGLTF.preload('/lightsaber_red.glb');
