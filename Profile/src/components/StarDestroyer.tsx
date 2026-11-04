import { useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SIDES, type CapitalModel, type SideId } from '../data/sides';

/** Chegadas da frota, na ordem em que saem do hiperespaço. */
export type ArriveKey = 'flag' | 'two' | 'three' | 'ties';

export interface FleetMotion {
  /** 0..1 por nave — saída do hiperespaço até assentar (já com easing, vindo do GSAP). */
  arrive: Record<ArriveKey, number>;
  /** 0..1 — progresso do scroll depois de assentar (órbita sutil). */
  orbit: number;
  /** Ponteiro normalizado (-1..1). */
  pointer: { x: number; y: number };
  /** Layout estreito (mobile): naves menores, capitânia centralizada acima do painel. */
  compact: boolean;
  /** Sistema selecionado (índice nos sistemas da frota): muda o enquadramento e os efeitos da capitânia. */
  active: number;
  /** 0..1 — a ala de caças acelera (lançamento do hangar). */
  tieBoost: number;
}

export interface ShipPose {
  x: number;
  y: number;
  z: number;
  yaw: number;
  /** Comprimento em unidades de mundo. */
  len: number;
}

export interface ShipSpec {
  key: Exclude<ArriveKey, 'ties'>;
  /** Rumo de entrada (a proa do modelo aponta para +Z, de frente para a câmera). */
  entryYaw: number;
  entryDist: number;
  /** Inclinação na curva de frenagem. */
  bank: number;
  /** Quanto o ponteiro e o scroll mexem na nave (1 = capitânia). */
  react: number;
  desktop: ShipPose;
  compact: ShipPose;
  model: CapitalModel;
}

export interface Hotspot {
  /** Posição em coordenadas da nave normalizada. */
  position: [number, number, number];
  color: string;
}

/** Naves de capital do lado escolhido: a capitânia (com os marcadores) e, no Império, duas escoltas ao fundo. */
export function fleetShips(side: SideId): ShipSpec[] {
  const s = SIDES[side];
  const cap = s.capital;
  const flag: ShipSpec = {
    key: 'flag',
    entryYaw: 0.1,
    entryDist: 64,
    bank: 0.32,
    react: 1,
    desktop: { x: -1.7, y: cap.lift, z: -3, yaw: 0.46, len: cap.len.desktop },
    compact: { x: 0.1, y: -0.1 + cap.lift * 0.5, z: -7, yaw: 0.6, len: cap.len.compact },
    model: cap,
  };
  if (!s.escorts) return [flag];
  return [
    flag,
    {
      key: 'two',
      entryYaw: 0.35,
      entryDist: 44,
      bank: 0.2,
      react: 0.35,
      desktop: { x: 2.4, y: 2.6, z: -22, yaw: 0.9, len: cap.len.desktop },
      compact: { x: 4.3, y: 5.6, z: -26, yaw: 0.8, len: cap.len.compact },
      model: cap,
    },
    {
      key: 'three',
      entryYaw: -0.1,
      entryDist: 44,
      bank: 0.16,
      react: 0.2,
      desktop: { x: -6, y: 5.5, z: -40, yaw: 0.5, len: cap.len.desktop },
      compact: { x: 3.5, y: 8.9, z: -42, yaw: 0.55, len: cap.len.compact },
      model: cap,
    },
  ];
}

/** Enquadramento da capitânia por sistema selecionado (deslocamentos somados à pose final). */
const FOCUS = [
  { dx: 0.2, dy: -0.3, dz: 0.8, yaw: -0.3, pitch: 0.06, roll: 0.02 }, // 01 ponte: quase de frente, torre ao alto
  { dx: -0.25, dy: -0.1, dz: 0.3, yaw: 0.12, pitch: 0.1, roll: 0.04 }, // 02 armas: mostra o flanco de bombordo e as baterias
  { dx: 0.1, dy: -0.4, dz: 0.4, yaw: 0.06, pitch: -0.18, roll: -0.08 }, // 03 hangar: nariz para cima, mostra o ventre
  { dx: -0.1, dy: 0.05, dz: -0.6, yaw: -0.08, pitch: 0, roll: 0 }, // 04 escudos: nave inteira, dentro da bolha
];

/** Rumo dos disparos: bombordo-frente, de leve para cima — o alvo está fora de cena, à esquerda. */
const FIRE_DIR = new THREE.Vector3(-0.85, 0.1, 0.5).normalize();
const BOLT_COUNT = 10;
/** Unidades da nave por segundo. */
const BOLT_SPEED = 1.6;
const BOLT_LIFE = 1.2;

interface Bolt {
  active: boolean;
  age: number;
  pos: THREE.Vector3;
  dir: THREE.Vector3;
}

const _spread = new THREE.Vector3();
const _look = new THREE.Vector3();

/** Clarão de boca: gradiente radial numa textura de canvas. */
function makeFlashTexture() {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,220,190,0.9)');
    g.addColorStop(1, 'rgba(255,160,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(c);
}

interface Props {
  spec: ShipSpec;
  motion: MutableRefObject<FleetMotion>;
  /** Marcadores HTML (drei <Html>) posicionados em coordenadas da nave normalizada. */
  children?: ReactNode;
  /** Pontos quentes iluminados quando o sistema correspondente está ativo (só a capitânia). */
  hotspots?: Hotspot[];
}

export const smooth = (a: number, b: number, t: number) => {
  const u = THREE.MathUtils.clamp((t - a) / (b - a), 0, 1);
  return u * u * (3 - 2 * u);
};

/**
 * Nave de capital (Star Destroyer ou Millennium Falcon): sai do hiperespaço vindo de frente,
 * esticada pelo salto, freia e vira para a pose final. O grupo é normalizado para a maior dimensão = 1,
 * com a proa em +Z. A capitânia ainda reage ao sistema selecionado: reenquadra, acende o ponto quente,
 * dispara as armas e, nos escudos, ergue a bolha.
 */
export default function CapitalShip({ spec, motion, children, hotspots = [] }: Props) {
  const { model } = spec;
  const { scene } = useGLTF(model.url);
  const rig = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const bridgeRef = useRef<THREE.PointLight>(null);
  const engineRef = useRef<THREE.PointLight>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const shieldWireRef = useRef<THREE.Mesh>(null);
  const hotRefs = useRef<(THREE.PointLight | null)[]>([]);
  const boltRefs = useRef<(THREE.Group | null)[]>([]);
  const flashRefs = useRef<(THREE.Sprite | null)[]>([]);
  const sm = useRef({ px: 0, py: 0, orbit: 0, dx: 0, dy: 0, dz: 0, yaw: 0, pitch: 0, roll: 0, shield: 0 });
  const weapons = useRef({
    bolts: Array.from({ length: BOLT_COUNT }, (): Bolt => ({ active: false, age: 0, pos: new THREE.Vector3(), dir: new THREE.Vector3() })),
    next: 0,
    turret: 0,
    flash: model.turrets.map(() => 0),
    recoil: 0,
  });
  const isFlag = spec.key === 'flag';
  const flashTex = useMemo(() => makeFlashTexture(), []);
  const boltGeo = useMemo(() => new THREE.BoxGeometry(0.005, 0.005, 0.11), []);

  // Cada nave usa um clone (geometria e materiais compartilhados).
  const object = useMemo(() => scene.clone(true), [scene]);

  const base = useMemo(() => {
    const probe = scene.clone(true);
    probe.position.set(0, 0, 0);
    probe.rotation.set(0, 0, 0);
    probe.scale.set(1, 1, 1);
    probe.updateMatrixWorld(true);
    const size = new THREE.Box3().setFromObject(probe).getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return 1 / maxDim;
  }, [scene]);

  const fwd = useMemo(() => new THREE.Vector3(Math.sin(spec.entryYaw), 0, Math.cos(spec.entryYaw)), [spec.entryYaw]);

  useEffect(() => {
    if (!isFlag) return;
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material;
      if (!mat || Array.isArray(mat)) return;
      if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) return;
      mat.metalness = THREE.MathUtils.clamp(mat.metalness * 1.05, 0.3, 0.9);
      mat.roughness = THREE.MathUtils.clamp(mat.roughness, 0.35, 0.8);
      mat.envMapIntensity = 1.2;
      mat.needsUpdate = true;
    });
  }, [scene, isFlag]);

  useFrame((state, delta) => {
    const g = rig.current;
    if (!g) return;
    const { arrive, orbit, pointer, compact, active } = motion.current;
    const a = arrive[spec.key];
    // Só o modelo some antes da chegada: o grupo e as luzes ficam na cena para o renderer
    // compilar os shaders uma vez só (a contagem de luzes faz parte do programa).
    const shown = a > 0.001;
    if (modelRef.current) modelRef.current.visible = shown;

    const t = state.clock.elapsedTime;
    const s = sm.current;
    const { damp, lerp } = THREE.MathUtils;
    s.px = damp(s.px, pointer.x, 4, delta);
    s.py = damp(s.py, pointer.y, 4, delta);
    s.orbit = damp(s.orbit, orbit, 5, delta);

    // Enquadramento do sistema ativo (só a capitânia, depois de assentar).
    const f = FOCUS[active] ?? FOCUS[0];
    const fk = isFlag ? (compact ? 0.55 : 1) * smooth(0.85, 1, a) : 0;
    s.dx = damp(s.dx, f.dx * fk, 2.5, delta);
    s.dy = damp(s.dy, f.dy * fk, 2.5, delta);
    s.dz = damp(s.dz, f.dz * fk, 2.5, delta);
    s.yaw = damp(s.yaw, f.yaw * fk, 2.5, delta);
    s.pitch = damp(s.pitch, f.pitch * fk, 2.5, delta);
    s.roll = damp(s.roll, f.roll * fk, 2.5, delta);

    const pose = compact ? spec.compact : spec.desktop;
    const r = spec.react;
    const phase = spec.entryYaw * 9;

    // Pose final, com parallax do ponteiro e a órbita do scroll.
    const sx = pose.x + s.dx + s.px * 0.2 * r - s.orbit * 0.1 * r;
    const sy = pose.y + s.dy + s.py * -0.12 * r - s.orbit * 0.12 * r + Math.sin(t * 0.4 + phase) * 0.04 * a;
    const sz = pose.z + s.dz;
    const yawEnd = pose.yaw + s.yaw + s.orbit * 0.14 * r + s.px * 0.05 * r + Math.sin(t * 0.2 + phase) * 0.012;

    // Chegada: surge esticada pelo salto, freia e inclina na curva até a pose final.
    const turn = smooth(0.3, 1, a);
    const yaw = lerp(spec.entryYaw, yawEnd, turn);
    const roll = -0.06 * turn - spec.bank * Math.sin(Math.PI * turn) + s.roll;
    const pitch = lerp(-0.02, 0.07, turn) + s.pitch + Math.sin(t * 0.17 + phase) * 0.006 * a;
    const dist = (1 - a) * spec.entryDist;
    const stretch = 1 + 7 * Math.pow(1 - a, 2.2);

    g.position.set(sx - fwd.x * dist, sy, sz - fwd.z * dist);
    g.rotation.set(pitch, yaw, roll);
    g.scale.set(pose.len, pose.len, pose.len * stretch);

    // Modo de batalha (armas ativas): toda a frota dispara. A capitânia em rajadas duplas, as escoltas mais espaçadas.
    const w = weapons.current;
    const turrets = model.turrets;
    if (active === 1 && a > 0.98 && t >= w.next) {
      const ti = w.turret % turrets.length;
      w.turret += 1;
      const tp = turrets[ti];
      const perVolley = isFlag ? 2 : 1;
      let spawned = 0;
      for (const b of w.bolts) {
        if (b.active) continue;
        b.active = true;
        b.age = -spawned * 0.07;
        b.pos.set(tp[0] + (spawned ? 0.006 : -0.006), tp[1], tp[2] + (spawned ? -0.008 : 0.008));
        _spread.set((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.08);
        b.dir.copy(FIRE_DIR).add(_spread).normalize();
        spawned += 1;
        if (spawned === perVolley) break;
      }
      w.flash[ti] = 1;
      w.recoil = isFlag ? 1 : 0;
      w.next = t + (isFlag ? 0.18 + Math.random() * 0.45 : 0.5 + Math.random() * 0.9);
    }
    w.bolts.forEach((b, i) => {
      const m = boltRefs.current[i];
      if (!m) return;
      if (!b.active) {
        m.visible = false;
        return;
      }
      b.age += delta;
      if (b.age < 0) {
        m.visible = false;
        return;
      }
      if (b.age > BOLT_LIFE) {
        b.active = false;
        m.visible = false;
        return;
      }
      b.pos.addScaledVector(b.dir, BOLT_SPEED * delta);
      m.position.copy(b.pos);
      _look.copy(b.pos).add(b.dir);
      g.localToWorld(_look);
      m.lookAt(_look);
      const fade = b.age < 0.08 ? b.age / 0.08 : b.age > BOLT_LIFE - 0.3 ? (BOLT_LIFE - b.age) / 0.3 : 1;
      m.scale.set(fade, fade, 1);
      m.visible = true;
    });
    flashRefs.current.forEach((sp, i) => {
      if (!sp) return;
      w.flash[i] = damp(w.flash[i], 0, 14, delta);
      const fl = w.flash[i];
      sp.visible = fl > 0.01;
      sp.scale.setScalar(0.03 + fl * 0.07);
      (sp.material as THREE.SpriteMaterial).opacity = fl;
    });
    w.recoil = damp(w.recoil, 0, 8, delta);
    if (w.recoil > 0.01) {
      g.position.x += (Math.random() - 0.5) * 0.05 * w.recoil;
      g.position.y += (Math.random() - 0.5) * 0.04 * w.recoil;
    }

    if (!isFlag) return;

    // Luzes: ponte/cabine, motores e pontos quentes por sistema (apagadas até a nave chegar).
    if (bridgeRef.current) bridgeRef.current.intensity = shown ? 0.9 + Math.sin(t * 1.9) * 0.3 : 0;
    if (engineRef.current) engineRef.current.intensity = shown ? (0.84 + Math.sin(t * 2.5) * 0.16) * 2.4 : 0;
    hotRefs.current.forEach((l, i) => {
      if (!l) return;
      const target = active === i ? 2.6 + Math.sin(t * 5 + i) * 0.6 : 0;
      l.intensity = damp(l.intensity, target, 5, delta);
    });

    // Escudos defletores: bolha azul que ondula e cintila.
    s.shield = damp(s.shield, active === 3 ? 1 : 0, 3, delta);
    const ripple = 0.8 + Math.sin(t * 5.2) * 0.12 + Math.sin(t * 13.7) * 0.08;
    if (shieldRef.current) {
      const mat = shieldRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = s.shield * 0.13 * ripple;
      shieldRef.current.visible = mat.opacity > 0.004;
      shieldRef.current.scale.setScalar(0.92 + s.shield * 0.08);
    }
    if (shieldWireRef.current) {
      const mat = shieldWireRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = s.shield * 0.07 * ripple;
      shieldWireRef.current.visible = mat.opacity > 0.003;
      shieldWireRef.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group ref={rig}>
      {/* Modelo normalizado (maior dimensão 1), proa em +Z — escondido até sair do hiperespaço */}
      <group ref={modelRef} scale={base} visible={false}>
        <Center>
          <primitive object={object} />
        </Center>
      </group>

      {/* Marcadores presos ao casco */}
      {children}

      {/* Disparos: núcleo claro + halo na cor do lado, orientados pelo rumo do disparo */}
      {Array.from({ length: BOLT_COUNT }).map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            boltRefs.current[i] = el;
          }}
          visible={false}
        >
          <mesh geometry={boltGeo}>
            <meshBasicMaterial color="#fff3df" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh geometry={boltGeo} scale={[3.2, 3.2, 1.04]}>
            <meshBasicMaterial color={model.bolt} transparent opacity={0.38} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {/* Clarões de boca nas torres */}
      {model.turrets.map((tp, i) => (
        <sprite
          key={i}
          ref={(el) => {
            flashRefs.current[i] = el;
          }}
          position={tp}
          scale={0.03}
          visible={false}
        >
          <spriteMaterial map={flashTex} color={model.bolt} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      ))}

      {isFlag && (
        <>
          {/* Ponte/cabine, motores e brilho na cor do lado sob o casco */}
          <pointLight ref={bridgeRef} color="#8ad6ff" intensity={0.9} distance={0.6} decay={2} position={model.lights.bridge} />
          <pointLight ref={engineRef} color="#9fc4ff" intensity={2.4} distance={1.6} decay={2} position={model.lights.engine} />
          <pointLight color={model.bolt} intensity={0.9} distance={1.8} decay={2} position={model.lights.under} />

          {/* Pontos quentes dos sistemas */}
          {hotspots.map((h, i) => (
            <pointLight
              key={i}
              ref={(el) => {
                hotRefs.current[i] = el;
              }}
              color={h.color}
              intensity={0}
              distance={5}
              decay={2}
              position={[h.position[0], h.position[1] + 0.05, h.position[2]]}
            />
          ))}

          {/* Bolha dos escudos defletores */}
          <group position={[0, 0.02, 0]} scale={model.shield}>
            <mesh ref={shieldRef} visible={false}>
              <sphereGeometry args={[0.5, 48, 32]} />
              <meshBasicMaterial color="#4aa8ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={shieldWireRef} visible={false}>
              <sphereGeometry args={[0.505, 28, 14]} />
              <meshBasicMaterial color="#9fd2ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} wireframe />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}
