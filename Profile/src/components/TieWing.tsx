import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { smooth, type FleetMotion, type ShipSpec } from './StarDestroyer';
import type { FighterModel } from '../data/sides';

/** Formação em V (unidades = tamanho de um caça; +Z é a frente da ala). */
const FORMATION: [number, number, number][] = [
  [0, 0, 0],
  [-1.8, -0.3, -1.6],
  [1.8, -0.3, -1.6],
];

/** Rumo de entrada da ala, vinda do fundo. */
const ENTRY_DIR = new THREE.Vector3(0.18, -0.06, 1).normalize();
const ENTRY_DIST = 58;

const LASER_COUNT = 12;
/** Unidades de mundo por segundo. */
const LASER_SPEED = 24;
const LASER_LIFE = 0.8;

interface Laser {
  active: boolean;
  age: number;
  pos: THREE.Vector3;
  dir: THREE.Vector3;
}

const _p = new THREE.Vector3();
const _tan = new THREE.Vector3();
const _head = new THREE.Vector3();
const _look = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _muzzle = new THREE.Vector3();
const _spread = new THREE.Vector3();

interface Props {
  motion: MutableRefObject<FleetMotion>;
  /** Caça do lado escolhido (TIE Fighter ou X-wing). */
  model: FighterModel;
  /** Capitânia em volta da qual a ala patrulha. */
  flagship: ShipSpec;
}

/**
 * Ala de escolta: três caças saem do hiperespaço em formação e patrulham numa elipse lenta
 * sob a proa da capitânia (como se saíssem do hangar). Com o hangar selecionado, a ala acelera;
 * em modo de batalha (armas ativas) ela abre a formação, rola e dispara os canhões.
 */
export default function FighterWing({ motion, model, flagship }: Props) {
  const { scene } = useGLTF(model.url);
  const wing = useRef<THREE.Group>(null);
  const ties = useRef<(THREE.Group | null)[]>([]);
  const bodies = useRef<(THREE.Group | null)[]>([]);
  const engines = useRef<(THREE.PointLight | null)[]>([]);
  const laserRefs = useRef<(THREE.Mesh | null)[]>([]);
  const theta = useRef(0);
  const battle = useRef(0);
  const guns = useRef({
    lasers: Array.from({ length: LASER_COUNT }, (): Laser => ({ active: false, age: 0, pos: new THREE.Vector3(), dir: new THREE.Vector3() })),
    next: FORMATION.map(() => 0),
  });

  const clones = useMemo(() => FORMATION.map(() => scene.clone(true)), [scene]);
  const laserGeo = useMemo(() => new THREE.BoxGeometry(0.035, 0.035, 0.9), []);

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

  useFrame((state, delta) => {
    const g = wing.current;
    if (!g) return;
    const { arrive, compact, tieBoost, active } = motion.current;
    const a = arrive.ties;
    g.visible = a > 0.001;
    const t = state.clock.elapsedTime;
    const { damp } = THREE.MathUtils;
    const wb = (battle.current = damp(battle.current, active === 1 ? 1 : 0, 3, delta));

    if (g.visible) {
      const flag = compact ? flagship.compact : flagship.desktop;

      // Elipse de patrulha sob a proa da capitânia, abaixo do casco e fora do cabeçalho e do painel.
      const cx = flag.x + (compact ? 0 : 1.7);
      const cy = flag.y - (compact ? 0.65 : 2.6);
      const cz = flag.z + (compact ? 1 : 2.5);
      const rx = compact ? 2.2 : 3.5;
      const ry = compact ? 0.15 : 0.3;
      const rz = compact ? 1.4 : 2.5;
      theta.current += (0.22 + tieBoost * 0.8 + wb * 0.9) * Math.min(delta, 0.05);
      const th = theta.current;
      _p.set(cx + rx * Math.cos(th), cy + ry * Math.sin(2 * th), cz + rz * Math.sin(th));
      _tan.set(-rx * Math.sin(th), 2 * ry * Math.cos(2 * th), rz * Math.cos(th)).normalize();

      // Chegada: vem reta pelo rumo de entrada e converge para a elipse.
      const turn = smooth(0.4, 1, a);
      const dist = (1 - a) * ENTRY_DIST;
      g.position.copy(_p).addScaledVector(ENTRY_DIR, -dist);
      _head.copy(ENTRY_DIR).lerp(_tan, turn).normalize();
      _look.copy(g.position).add(_head);
      g.lookAt(_look);
      g.rotateZ(-0.3 * turn - wb * 0.4 * Math.sin(t * 1.7));
      g.scale.setScalar(compact ? model.wingScale.compact : model.wingScale.desktop);

      const stretch = 1 + 5 * Math.pow(1 - a, 2) + tieBoost * 0.6;
      const flicker = 0.85 + Math.sin(t * 21) * 0.08 + Math.sin(t * 7.3) * 0.07;
      const spread = compact ? 0.5 : 0.9;
      ties.current.forEach((tg, i) => {
        if (!tg) return;
        // Em batalha a formação abre e cada caça serpenteia.
        tg.position.set(
          FORMATION[i][0] + Math.sin(t * 2.3 + i * 2.1) * spread * wb,
          FORMATION[i][1] + Math.sin(t * 1.1 + i * 2.1) * 0.08 + Math.sin(t * 3.1 + i) * 0.45 * wb,
          FORMATION[i][2] + Math.cos(t * 1.7 + i) * 0.5 * wb
        );
        const b = bodies.current[i];
        if (b) b.scale.set(1, 1, stretch);
        const l = engines.current[i];
        if (l) l.intensity = (1.4 + tieBoost * 3.5 + wb * 1.5) * flicker;

        // Canhões: rajadas duplas no rumo da ala.
        const gn = guns.current;
        if (wb > 0.5 && a > 0.98 && t >= gn.next[i]) {
          tg.updateWorldMatrix(true, false);
          g.getWorldDirection(_dir);
          let spawned = 0;
          for (const ls of gn.lasers) {
            if (ls.active) continue;
            ls.active = true;
            ls.age = 0;
            _muzzle.set(...model.cannons[spawned]);
            tg.localToWorld(_muzzle);
            ls.pos.copy(_muzzle);
            _spread.set((Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06, 0);
            ls.dir.copy(_dir).add(_spread).normalize();
            spawned += 1;
            if (spawned === model.cannons.length) break;
          }
          gn.next[i] = t + 0.25 + Math.random() * 0.55;
        }
      });
    }

    // Lasers viajam em espaço de mundo, soltos da ala.
    guns.current.lasers.forEach((ls, i) => {
      const m = laserRefs.current[i];
      if (!m) return;
      if (!ls.active) {
        m.visible = false;
        return;
      }
      ls.age += delta;
      if (ls.age > LASER_LIFE) {
        ls.active = false;
        m.visible = false;
        return;
      }
      ls.pos.addScaledVector(ls.dir, LASER_SPEED * delta);
      m.position.copy(ls.pos);
      _look.copy(ls.pos).add(ls.dir);
      m.lookAt(_look);
      const fade = ls.age > LASER_LIFE - 0.2 ? (LASER_LIFE - ls.age) / 0.2 : 1;
      m.scale.set(fade, fade, 1);
      m.visible = true;
    });
  });

  return (
    <>
      <group ref={wing} visible={false}>
        {clones.map((obj, i) => (
          <group
            key={i}
            position={FORMATION[i]}
            ref={(el) => {
              ties.current[i] = el;
            }}
          >
            <group
              ref={(el) => {
                bodies.current[i] = el;
              }}
            >
              <group scale={base} rotation={model.fix}>
                <Center>
                  <primitive object={obj} />
                </Center>
              </group>
            </group>
            <pointLight
              ref={(el) => {
                engines.current[i] = el;
              }}
              color={model.engine}
              intensity={1.4}
              distance={1.1}
              decay={2}
              position={[0, 0, -0.45]}
            />
          </group>
        ))}
      </group>

      {/* Lasers dos caças (espaço de mundo) */}
      <group>
        {Array.from({ length: LASER_COUNT }).map((_, i) => (
          <mesh
            key={i}
            geometry={laserGeo}
            ref={(el) => {
              laserRefs.current[i] = el;
            }}
            visible={false}
          >
            <meshBasicMaterial color={model.laser} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </>
  );
}
