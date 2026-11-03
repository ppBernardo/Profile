import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const HELMET_URL = '/darth_vader_helmet.glb';

interface Props {
  /** 0 → escuridão total, 1 → capacete de frente, iluminado. */
  progress: MutableRefObject<number>;
  /** Ponteiro normalizado (-1..1) para o capacete "olhar" o cursor. */
  pointer: MutableRefObject<{ x: number; y: number }>;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function VaderHelmet({ progress, pointer }: Props) {
  const { scene } = useGLTF(HELMET_URL);
  const group = useRef<THREE.Group>(null);
  const keyRef = useRef<THREE.PointLight>(null);
  const rimLeft = useRef<THREE.PointLight>(null);
  const rimRight = useRef<THREE.PointLight>(null);
  const underRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  // Dimensão do modelo em espaço local (um clone solto não herda a escala do grupo pai,
  // então o valor não muda depois que o capacete já está na cena).
  const maxDim = useMemo(() => {
    const probe = scene.clone(true);
    probe.position.set(0, 0, 0);
    probe.rotation.set(0, 0, 0);
    probe.scale.set(1, 1, 1);
    probe.updateMatrixWorld(true);
    const size = new THREE.Box3().setFromObject(probe).getSize(new THREE.Vector3());
    return Math.max(size.x, size.y, size.z) || 1;
  }, [scene]);

  const baseScale = useMemo(() => {
    const target = Math.min(viewport.width, viewport.height) * 0.6;
    return target / maxDim;
  }, [maxDim, viewport.width, viewport.height]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material;
      if (!mat || Array.isArray(mat)) return;
      if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) return;
      mat.roughness = THREE.MathUtils.clamp(mat.roughness * 0.7, 0.1, 0.6);
      mat.metalness = THREE.MathUtils.clamp(mat.metalness * 1.1, 0.35, 1);
      mat.envMapIntensity = 1.4;
      mat.needsUpdate = true;
    });
  }, [scene]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const t = state.clock.elapsedTime;
    const emerge = easeOut(p);
    const look = easeInOut(Math.min(1, p * 1.4));
    const { x: px, y: py } = pointer.current;

    const targetY = THREE.MathUtils.lerp(-1.6, 0, emerge) + Math.sin(t * 0.5) * 0.03;
    const targetZ = THREE.MathUtils.lerp(-3.2, 0, emerge);
    const targetRotY = THREE.MathUtils.lerp(Math.PI * 0.75, 0, look) + px * 0.32 + Math.sin(t * 0.35) * 0.04;
    const targetRotX = THREE.MathUtils.lerp(0.55, 0.02, look) - py * 0.18 + Math.sin(t * 0.27) * 0.015;

    const k = 5;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, k, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, k, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, k, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, k, delta);
    g.scale.setScalar(baseScale * THREE.MathUtils.lerp(0.82, 1, emerge));

    const breath = 0.5 + 0.5 * Math.sin(t * 1.5); // respiração do Vader
    if (keyRef.current) keyRef.current.intensity = THREE.MathUtils.lerp(0, 14, Math.pow(p, 1.6));
    if (rimLeft.current) rimLeft.current.intensity = THREE.MathUtils.lerp(0.6, 20, p) * (0.85 + breath * 0.3);
    if (rimRight.current) rimRight.current.intensity = THREE.MathUtils.lerp(0.4, 15, p) * (0.9 + (1 - breath) * 0.25);
    if (underRef.current) underRef.current.intensity = THREE.MathUtils.lerp(0.3, 5.5, p) * (0.7 + breath * 0.5);
  });

  return (
    <group ref={group} position={[0, -1.6, -3.2]} rotation={[0.55, Math.PI * 0.75, 0]}>
      <Center>
        <primitive object={scene} />
      </Center>

      {/* Luz principal fria e contida: o capacete deve continuar escuro */}
      <pointLight ref={keyRef} color="#d6dcff" intensity={0} distance={22} decay={1.6} position={[2.6, 3.4, 5.2]} />
      {/* Recortes vermelhos — o lado sombrio */}
      <pointLight ref={rimLeft} color="#ff2a2a" intensity={0.5} distance={18} decay={1.5} position={[-4.2, 2.2, -1.8]} />
      <pointLight ref={rimRight} color="#ff4a3c" intensity={0.3} distance={18} decay={1.5} position={[4.4, 1.2, -2.4]} />
      {/* Brasa por baixo */}
      <pointLight ref={underRef} color="#ff3b2a" intensity={0.2} distance={12} decay={1.8} position={[0, -3.2, 2.2]} />
      {/* Topo sutil para ler o volume */}
      <pointLight color="#8ea2ff" intensity={3.6} distance={12} decay={1.6} position={[0, 5.5, 0.5]} />
      {/* Preenchimento frontal frio e fraco: deixa os detalhes da máscara legíveis */}
      <pointLight color="#9fb3ff" intensity={3} distance={14} decay={1.7} position={[-1.2, 0.6, 5.5]} />
      <hemisphereLight color="#4a3a5c" groundColor="#2a0a0c" intensity={0.45} />
    </group>
  );
}
