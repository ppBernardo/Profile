import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import R2D2Model, { type R2D2Motion } from './R2D2Model';
import CanvasViewportSync from './CanvasViewportSync';

gsap.registerPlugin(Flip, ScrollTrigger);

/* ─── Types ─── */

type Category = 'TODOS' | 'WEB' | 'DESIGN' | 'OUTROS';
type Layout = 'GRID' | 'LIST';

interface Project {
  id: string;
  number: string;
  title: string;
  category: Category;
  done: boolean;
  description: string;
  stack: string[];
  link?: string;
  /** Card com destaque visual (ex.: projeto importante com repo privado) */
  featured?: boolean;
  /** Sem link público — exibe aviso em vez de “abrir canal” */
  repositoryPrivate?: boolean;
}

/* ─── Data ─── */

const FILTERS: Category[] = ['TODOS', 'WEB', 'DESIGN', 'OUTROS'];

const projects: Project[] = [
  {
    id: 'motomax',
    number: '001',
    title: 'MotoMax',
    category: 'WEB',
    done: true,
    description:
      'Plataforma full stack para catálogo de motocicletas com filtros avançados, autenticação e painel administrativo.',
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    link: 'https://moto-max-eight.vercel.app/',
  },
  {
    id: 'chamados',
    number: '002',
    title: 'Sistema de Chamados',
    category: 'OUTROS',
    done: true,
    featured: true,
    repositoryPrivate: true,
    description:
      'Solução corporativa em produção: abertura e acompanhamento de chamados, fluxo de status, papéis de usuário e autenticação segura. O código permanece em repositório privado no GitHub.',
    stack: ['Node.js', 'Express', 'REST API', 'React'],
  },
  {
    id: 'finance-flow',
    number: '003',
    title: 'Finance Flow',
    category: 'WEB',
    done: true,
    description:
      'Sistema de controle financeiro com visão de fluxo de caixa e acompanhamento de metas operacionais.',
    stack: ['React', 'Tailwind', 'Charts', 'TypeScript'],
    link: 'https://personal-financial-management-platf.vercel.app/',
  },
  {
    id: 'izcode',
    number: '004',
    title: 'Iz Code',
    category: 'DESIGN',
    done: true,
    description:
      'Landing institucional com narrativa visual de alto impacto, foco em conversão e estrutura modular.',
    stack: ['React', 'UI System', 'Motion', 'Responsive'],
    link: 'https://izcode.com.br/',
  },
];

/* ─── Helpers ─── */

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/* ─── Card ─── */

function MissionCard({ project }: { project: Project }) {
  const isFeatured = Boolean(project.featured);
  const isPrivate = Boolean(project.repositoryPrivate);

  return (
    <article
      data-flip-id={project.id}
      className={`mission-card group relative overflow-hidden rounded-xl border bg-gradient-to-br from-[#080c14]/95 via-[#060a10] to-[#04060c] transition-all duration-300 ${
        isFeatured
          ? 'border-vader-red/45 shadow-[0_0_40px_rgba(255,0,0,0.12)] hover:border-vader-red/60 hover:shadow-[0_0_48px_rgba(255,0,0,0.18)]'
          : 'border-cyan-500/12 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.07)]'
      }`}
    >
      {isFeatured && (
        <div className="absolute right-3 top-3 z-[15] rounded border border-vader-red/40 bg-black/70 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.22em] text-vader-red">
          destaque
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(34,211,238,0.018) 4px, rgba(34,211,238,0.018) 5px)',
          animation: 'holo-flicker 6s ease-in-out infinite',
        }}
      />

      <div
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${
          isFeatured
            ? 'from-vader-red via-vader-red/40 to-transparent'
            : 'from-cyan-400/60 via-cyan-500/20 to-transparent'
        }`}
        aria-hidden
      />

      <div
        className={`absolute top-0 left-0 w-3.5 h-3.5 border-t border-l rounded-tl ${
          isFeatured ? 'border-vader-red/45' : 'border-cyan-500/20'
        }`}
      />
      <div
        className={`absolute top-0 right-0 w-3.5 h-3.5 border-t border-r rounded-tr ${
          isFeatured ? 'border-vader-red/45' : 'border-cyan-500/20'
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l rounded-bl ${
          isFeatured ? 'border-vader-red/45' : 'border-cyan-500/20'
        }`}
      />
      <div
        className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r rounded-br ${
          isFeatured ? 'border-vader-red/45' : 'border-cyan-500/20'
        }`}
      />

      <div
        className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          isFeatured ? 'via-vader-red/45' : 'via-cyan-500/25'
        }`}
      />

      <div className="relative z-10 p-4 sm:p-6 md:p-7 font-mono">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span
              className={`text-[10px] uppercase tracking-[0.28em] ${
                isFeatured ? 'text-vader-red/70' : 'text-cyan-500/50'
              }`}
            >
              missão
            </span>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-gray-600">
              {project.category}
            </p>
            {isPrivate && (
              <p className="mt-2 max-w-[14rem] text-[9px] uppercase leading-relaxed tracking-[0.18em] text-vader-red/55">
                repositório privado — sem link público
              </p>
            )}
          </div>
          <span
            className={`font-display text-4xl font-bold leading-none transition-colors duration-300 ${
              isFeatured
                ? 'text-vader-red/35 group-hover:text-vader-red/55'
                : 'text-cyan-400/20 group-hover:text-cyan-400/40'
            }`}
          >
            {project.number}
          </span>
        </div>

        <h3
          className={`font-display text-lg tracking-wide sm:text-xl mb-3 ${
            isFeatured ? 'text-white text-glow-red' : 'text-gray-100'
          }`}
        >
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded border border-cyan-500/15 bg-cyan-500/[0.04] px-2 py-0.5 text-[10px] text-cyan-200/60 transition-colors duration-200 group-hover:border-cyan-500/25 group-hover:text-cyan-200/80"
            >
              {item}
            </span>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-gray-500 mb-5">
          {project.description}
        </p>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.04] pt-4">
          <span
            className={`text-[10px] uppercase tracking-[0.18em] ${
              project.done ? 'text-emerald-400/80' : 'text-amber-400/80'
            }`}
          >
            ● {project.done ? 'concluída' : 'em curso'}
          </span>

          {isPrivate ? (
            <span
              className="inline-flex cursor-default items-center gap-1.5 rounded border border-vader-red/35 bg-vader-red/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-vader-red/90"
              title="Código em repositório privado"
            >
              github privado
            </span>
          ) : (
            <a
              href={project.link || '#'}
              target={project.link ? '_blank' : undefined}
              rel={project.link ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-500/[0.04] px-3 py-1.5 text-[10px] text-cyan-200/80 transition-all duration-200 hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-white"
            >
              abrir canal
              <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </div>

      <div
        className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-500 group-hover:via-cyan-500/25 ${
          isFeatured ? 'via-vader-red/25 group-hover:via-vader-red/45' : 'via-cyan-500/15'
        }`}
      />
    </article>
  );
}

/* ─── Section ─── */

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const r2d2Ref = useRef<R2D2Motion>({ scroll: 0 });
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const [introPlayed, setIntroPlayed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Category>('TODOS');
  const [layout, setLayout] = useState<Layout>('GRID');

  const filtered = useMemo(
    () =>
      activeFilter === 'TODOS'
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [activeFilter]
  );

  const captureFlip = () => {
    const root = gridRef.current;
    if (!root) return;
    const cards = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('.mission-card')
    );
    if (!cards.length) return;
    flipState.current = Flip.getState(cards, {
      props: 'borderRadius,boxShadow,opacity,transform',
      nested: true,
    });
  };

  /* R2D2 scroll rotation — non-blocking, no pin */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          r2d2Ref.current.scroll = self.progress;
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  /* One-shot intro via IntersectionObserver */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || introPlayed) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        obs.disconnect();
        setIntroPlayed(true);

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (prefersReducedMotion()) tl.timeScale(30);

        tl.fromTo(
          shellRef.current,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75 },
          0
        );
        if (canvasRef.current) {
          tl.fromTo(
            canvasRef.current,
            { opacity: 0, scale: 0.92, rotateY: -10 },
            {
              opacity: 1,
              scale: 1,
              rotateY: 0,
              duration: 0.85,
              transformOrigin: '50% 50%',
            },
            0.1
          );
        }
        if (headingRef.current) {
          tl.fromTo(
            headingRef.current.children,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
            0.15
          );
        }
        [filterRef, layoutRef].forEach((ref, i) => {
          if (ref.current)
            tl.fromTo(
              ref.current,
              { opacity: 0, x: -18 },
              { opacity: 1, x: 0, duration: 0.42 },
              0.25 + i * 0.06
            );
        });
        if (gridRef.current) {
          tl.fromTo(
            gridRef.current.querySelectorAll('.mission-card'),
            { opacity: 0, y: 32, rotateX: 8, transformOrigin: '50% 85%' },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.55,
              stagger: { each: 0.08 },
            },
            0.3
          );
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, [introPlayed]);

  /* GSAP Flip on filter/layout change */
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || !introPlayed || prefersReducedMotion()) return;

    Flip.from(state, {
      duration: 0.65,
      ease: 'power3.inOut',
      absolute: false,
      scale: true,
      simple: true,
      nested: true,
      prune: true,
      targets: '.mission-card',
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.45,
            ease: 'power2.out',
          }
        ),
      onLeave: (els) =>
        gsap.to(els, {
          opacity: 0,
          scale: 0.92,
          filter: 'blur(4px)',
          duration: 0.35,
          ease: 'power2.in',
        }),
      onComplete: () => {
        gsap.set('.mission-card', { clearProps: 'transform,opacity,filter' });
      },
    });
  }, [activeFilter, layout, introPlayed, filtered.length]);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [layout, activeFilter, filtered.length]);

  const handleFilter = (f: Category) => {
    if (f === activeFilter) return;
    captureFlip();
    setActiveFilter(f);
  };

  const handleLayout = (l: Layout) => {
    if (l === layout) return;
    captureFlip();
    setLayout(l);
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative touch-pan-y overflow-hidden bg-[#030508] py-16 sm:py-24 md:py-32"
    >
      {/* ── Backgrounds ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(rgba(56,189,248,0.02) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 80% 12%, rgba(56,189,248,0.12), transparent), radial-gradient(ellipse 50% 35% at 15% 85%, rgba(255,0,0,0.06), transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute left-5 top-20 hidden h-24 w-24 border-l border-t border-cyan-500/20 sm:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-20 right-5 hidden h-24 w-24 border-b border-r border-red-500/15 sm:block"
        aria-hidden
      />

      <div
        ref={shellRef}
        className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6"
        style={{ opacity: 0 }}
      >
        {/* ═══ Hero: R2D2 + heading ═══ */}
        <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:items-start lg:gap-14 mb-14 lg:mb-16">
          {/* R2D2 */}
          <div
            ref={canvasRef}
            className="pointer-events-none relative w-full max-w-[220px] shrink-0 sm:max-w-[300px] lg:max-w-[340px]"
            style={{ opacity: 0, transformStyle: 'preserve-3d' }}
          >
            <div
              className="pointer-events-none absolute -inset-3 rounded-2xl bg-gradient-to-b from-cyan-500/10 via-transparent to-red-500/[0.03] blur-xl"
              aria-hidden
            />

            <div className="pointer-events-none relative aspect-square overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-b from-[#0a1018] to-[#030508] shadow-[0_0_35px_rgba(34,211,238,0.06)]">
              {/* HUD label */}
              <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-400/50">
                  astromech · R2
                </span>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-500/20 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-500/20 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-500/20 rounded-br-2xl" />

              <Suspense
                fallback={
                  <div className="flex h-full min-h-[280px] items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500/30">
                    carregando modelo…
                  </div>
                }
              >
                <Canvas
                  className="h-full min-h-[280px] w-full pointer-events-none"
                  camera={{ position: [0, 0.35, 4.5], fov: 40 }}
                  gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: 'high-performance',
                  }}
                >
                  <CanvasViewportSync maxDpr={1.5} />
                  <color attach="background" args={['#030508']} />
                  <fog attach="fog" args={['#030508', 4.5, 14]} />
                  <R2D2Model motionRef={r2d2Ref} />
                </Canvas>
              </Suspense>

              {/* Scanline overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-[5]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(34,211,238,0.025) 3px, rgba(34,211,238,0.025) 4px)',
                  animation: 'holo-flicker 5s ease-in-out infinite',
                }}
              />
            </div>

            <p className="mt-2.5 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-gray-600 lg:text-left">
              rotação ligada ao scroll
            </p>
          </div>

          {/* Heading */}
          <div
            ref={headingRef}
            className="text-center lg:text-left lg:pt-4 flex-1"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-cyan-400/70">
              {'>'} UPLINK_ASTROMECH // REGISTRO_DE_MISSÕES
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[0.08em] text-gray-100 sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-cyan-200 to-cyan-500/60 bg-clip-text text-transparent">
                Projetos
              </span>{' '}
              <span className="text-gray-600">&</span>{' '}
              <span className="text-glow-red text-vader-red">entregas</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
              Filtre por categoria ou troque o layout — o GSAP Flip mantém a
              continuidade espacial dos cartões, como um holograma que se
              reorganiza sem cortes.
            </p>
            <div
              className="mt-5 h-px max-w-xs mx-auto lg:mx-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(34,211,238,0.4), rgba(34,211,238,0.08) 60%, transparent)',
              }}
            />
          </div>
        </div>

        {/* ═══ Filters + layout toggle ═══ */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div
            ref={filterRef}
            className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]"
            style={{ opacity: 0 }}
          >
            <span className="mr-1 text-gray-600 text-[10px]">
              &gt; filtro:
            </span>
            {FILTERS.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleFilter(f)}
                  className={`relative overflow-hidden rounded-full border px-3 py-1.5 transition-all duration-200 ${
                    active
                      ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.15)]'
                      : 'border-white/[0.06] text-gray-600 hover:border-cyan-500/25 hover:text-gray-400'
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  )}
                  {f}
                </button>
              );
            })}
          </div>

          <div
            ref={layoutRef}
            className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-600"
            style={{ opacity: 0 }}
          >
            <span>Layout:</span>
            <div className="inline-flex rounded-lg border border-white/[0.06] bg-[#080c14]/80 p-1 backdrop-blur-sm">
              {(['GRID', 'LIST'] as const).map((m) => {
                const active = layout === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleLayout(m)}
                    className={`rounded-md px-3 py-1.5 transition-all duration-200 ${
                      active
                        ? 'bg-cyan-500/15 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.12)]'
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    {m === 'GRID' ? 'Grid' : 'Lista'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ Project grid — freely scrollable, GSAP Flip on filter/layout ═══ */}
        <div
          ref={gridRef}
          className={`[perspective:1600px] transform-gpu ${
            layout === 'GRID'
              ? 'grid grid-cols-1 gap-5 md:grid-cols-2'
              : 'mx-auto flex max-w-2xl flex-col gap-5'
          }`}
        >
          {filtered.map((project) => (
            <MissionCard key={project.id} project={project} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-mono text-sm text-gray-600">
              Nenhuma missão encontrada para este filtro.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
