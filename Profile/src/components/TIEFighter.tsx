import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Trail, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const TIE_URL = '/3d_t.i.e_fighter_-_star_wars_model.glb';

/** Pose livre (patrulha ao fundo / escondido). */
export interface TieMotion {
  x: number;
  y: number;
  z: number;
  scale: number;
  yaw: number;
  pitch: number;
  roll: number;
  /** 0..1 — intensidade dos motores iônicos. */
  glow: number;
}

/** Voo roteirizado pela spline: `t` de 0 a 1; `stretch` alonga a nave ao sair do hiperespaço. */
export interface TieFlight {
  active: boolean;
  t: number;
  stretch: number;
}

/** Escondido, bem fora de cena. */
export const TIE_HIDDEN: TieMotion = { x: 60, y: 0, z: -40, scale: 0.4, yaw: 0, pitch: 0, roll: 0, glow: 0 };
/** Início da patrulha ao fundo (depois da intro). */
export const TIE_PATROL_FROM: TieMotion = { x: -13, y: 2.4, z: -22, scale: 0.62, yaw: Math.PI * 0.5, pitch: 0, roll: 0.04, glow: 0.6 };
export const TIE_PATROL_TO_X = 13;

/** Trajetória do voo rasante: sai do hiperespaço no alto à direita, passa perto da câmera e some à esquerda. */
export const FLIGHT_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(7.6, 3.0, -16),
    new THREE.Vector3(4.6, 2.2, -9),
    new THREE.Vector3(1.6, 1.15, -2.4),
    new THREE.Vector3(-1.0, 0.5, 2.3),
    new THREE.Vector3(-5.0, -0.55, 4.6),
    new THREE.Vector3(-11.5, -2.6, 5.8),
  ],
  false,
  'centripetal'
);

interface Props {
  motion: MutableRefObject<TieMotion>;
  flight: MutableRefObject<TieFlight>;
}

const _target = new THREE.Vector3();
const _tangent = new THREE.Vector3();

export default function TieFighter({ motion, flight }: Props) {
  const { scene } = useGLTF(TIE_URL);
  const rig = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const engine = useRef<THREE.PointLight>(null);
  const engineGlow = useRef<THREE.Mesh>(null);
  const trailGroup = useRef<THREE.Group>(null);
  const lastJump = useRef(-10);
  const prevPos = useRef(new THREE.Vector3(60, 0, -40));

  // Dimensão em espaço local (clone solto: não herda a escala do grupo).
  const base = useMemo(() => {
    const probe = scene.clone(true);
    probe.position.set(0, 0, 0);
    probe.rotation.set(0, 0, 0);
    probe.scale.set(1, 1, 1);
    probe.updateMatrixWorld(true);
    const size = new THREE.Box3().setFromObject(probe).getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return 3.2 / maxDim;
  }, [scene]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material;
      if (!mat || Array.isArray(mat)) return;
      if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) return;
      mat.metalness = THREE.MathUtils.clamp(mat.metalness * 1.1, 0.45, 1);
      mat.roughness = THREE.MathUtils.clamp(mat.roughness * 0.85, 0.2, 0.7);
      mat.envMapIntensity = 1.3;
      mat.needsUpdate = true;
    });
  }, [scene]);

  useFrame((state) => {
    const r = rig.current;
    const b = body.current;
    if (!r || !b) return;
    const t = state.clock.elapsedTime;
    const f = flight.current;
    let glow: number;
    let scale: number;

    if (f.active) {
      const u = THREE.MathUtils.clamp(f.t, 0, 1);
      FLIGHT_PATH.getPointAt(u, r.position);
      FLIGHT_PATH.getTangentAt(u, _tangent);
      _target.copy(r.position).add(_tangent);
      r.lookAt(_target); // +z do modelo aponta para onde a nave vai
      const bank = Math.sin(u * Math.PI) * 0.62 + Math.sin(t * 0.9) * 0.02;
      r.rotateZ(bank);
      scale = THREE.MathUtils.lerp(0.55, 1.15, u);
      b.scale.set(base * scale, base * scale, base * scale * f.stretch);
      glow = 1;
    } else {
      const m = motion.current;
      r.position.set(m.x + Math.sin(t * 1.3) * 0.012, m.y + Math.sin(t * 0.9) * 0.014, m.z);
      r.rotation.set(m.pitch + Math.sin(t * 0.5) * 0.006, m.yaw, m.roll + Math.sin(t * 0.4) * 0.008);
      scale = m.scale;
      b.scale.setScalar(base * scale);
      glow = m.glow;
    }

    // O rastro só existe durante o voo roteirizado; na patrulha (longe) ele viraria um risco fixo na cena.
    if (r.position.distanceToSquared(prevPos.current) > 16) lastJump.current = t;
    prevPos.current.copy(r.position);
    if (trailGroup.current) trailGroup.current.visible = f.active;

    const flicker = 0.85 + Math.sin(t * 21) * 0.08 + Math.sin(t * 7.3) * 0.07;
    if (engine.current) {
      engine.current.intensity = glow * 9 * flicker;
      engine.current.position.z = -0.95 * scale;
    }
    if (engineGlow.current) {
      engineGlow.current.position.z = -0.98 * scale;
      engineGlow.current.scale.setScalar(scale * (0.9 + flicker * 0.25));
      const mat = engineGlow.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + glow * 0.55 * flicker;
    }
  });

  return (
    <group ref={rig} position={[60, 0, -40]}>
      <group ref={body}>
        <group rotation={[0, 0, Math.PI]}>
          <Center>
            <primitive object={scene} />
          </Center>
        </group>
      </group>

      {/* Luz principal acoplada (unidades de mundo) */}
      <pointLight color="#ffffff" intensity={7} distance={22} decay={1.5} position={[3.5, 3, 4.5]} />

      {/* Motores iônicos + rastro */}
      <pointLight ref={engine} color="#ff5a3c" intensity={6} distance={7} decay={2} position={[0, 0, -1]} />
      <group ref={trailGroup} visible={false}>
        <Trail width={0.9} length={6} decay={1.2} color={new THREE.Color('#ff3b2a')} attenuation={(w) => w * w}>
          <mesh ref={engineGlow} position={[0, 0, -1]}>
            <sphereGeometry args={[0.22, 14, 14]} />
            <meshBasicMaterial color="#ff7a5c" transparent opacity={0.8} depthWrite={false} />
          </mesh>
        </Trail>
      </group>
    </group>
  );
}

/** Tremor de câmera controlado por `amp` (0..1). Barato: só move a câmera. */
export function CameraShake({ amp, basePosition }: { amp: MutableRefObject<{ v: number }>; basePosition: [number, number, number] }) {
  useFrame(({ camera, clock }) => {
    const a = amp.current.v;
    const t = clock.elapsedTime;
    camera.position.set(
      basePosition[0] + Math.sin(t * 47) * 0.14 * a + Math.sin(t * 23) * 0.06 * a,
      basePosition[1] + Math.cos(t * 41) * 0.11 * a,
      basePosition[2]
    );
  });
  return null;
}
