import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Menu } from 'lucide-react';
import AboutMe from './components/AboutMe';
import heroImage from '../imgs/1736527234906.jpeg';
import MatrixBackground from './components/MatrixBackground';
import ScrollFollowImage from './components/ScrollFollowImage';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import {
  viewportDefault,
  staggerContainer,
  fadeUpItem,
  scaleInItem,
  sectionReveal,
} from './utils/animations';

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const navLinks = [
  { id: 'about', label: 'Sobre' },
  { id: 'skills', label: 'Competências' },
  { id: 'experience', label: 'Experiência' },
  { id: 'projects', label: 'Projetos' },
];

const App = () => {
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutSlotRef = useRef<HTMLDivElement>(null);
  const [imageLanded, setImageLanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const compute = () => setIsDesktop(window.innerWidth >= 1024);
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <div className="min-h-screen text-gray-100 font-sans relative">
      <MatrixBackground />
      <div className="relative z-10 min-h-screen">
      {/* Header – minimal, estilo Lando */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 bg-lando-bg/90 backdrop-blur-md border-b border-lando-border"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 text-lando-lime font-display text-xl tracking-wide hover:opacity-90 transition-opacity"
          >
            BP
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-sm font-medium text-gray-400 hover:text-lando-lime transition-colors uppercase tracking-wider"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ppBernardo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-lando-lime transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/bernardo-pereira-b80a0924a/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-lando-lime transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-lando-lime transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <button className="md:hidden p-2 text-gray-400 hover:text-lando-lime" aria-label="Menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero – animação em sequência ao carregar (estilo Lando) */}
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center px-4 sm:px-6 pt-20 pb-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-lando-surface/50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto w-full relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                variants={fadeUpItem}
                className="text-lando-lime text-sm uppercase tracking-[0.2em] font-medium"
              >
                Desenvolvedor Full Stack
              </motion.p>
              <motion.h1
                variants={fadeUpItem}
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide"
              >
                Bernardo Pereira
              </motion.h1>
              <motion.p
                variants={fadeUpItem}
                className="text-xl sm:text-2xl text-gray-400 max-w-xl leading-relaxed"
              >
                Transformando ideias em <span className="text-lando-lime font-semibold">produtos digitais</span> —
                frontends performáticos e backends robustos, entregando valor em cada projeto.
              </motion.p>
              <motion.div variants={fadeUpItem} className="flex flex-wrap gap-4 pt-2">
                <motion.button
                  onClick={() => scrollToSection('projects')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-lando-lime text-lando-bg font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Ver projetos
                </motion.button>
              </motion.div>
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 max-w-md"
              >
                {[
                  { label: 'Experiência', value: '4+' },
                  { label: 'Stack', value: 'React • .NET' },
                  { label: 'Foco', value: 'Produtos' },
                ].map((card) => (
                  <motion.div
                    key={card.label}
                    variants={scaleInItem}
                    className="border border-lando-border rounded-lg p-3 bg-lando-surface/40"
                  >
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{card.label}</p>
                    <p className="text-lg font-semibold text-lando-lime">{card.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Mobile: foto estática no hero (desktop usa ScrollFollowImage) */}
            <div className="lg:hidden w-full max-w-[320px] mx-auto aspect-[4/5]">
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-lando-border bg-lando-surface/40 shadow-xl">
                <img
                  src={heroImage}
                  alt="Bernardo Pereira"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-lando-bg to-transparent">
                  <span className="text-sm font-medium text-lando-lime">Full Stack Developer</span>
                  <span className="ml-2 text-xs text-gray-500">Disponível</span>
                </div>
              </div>
            </div>

            {/* Espaço onde a foto aparece no hero; a foto real está em ScrollFollowImage e segue o scroll */}
            <div className="hidden lg:block w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] mx-auto lg:mx-0 lg:ml-auto aspect-[4/5]" aria-hidden />
          </div>
        </div>
      </section>

      {/* Foto única que se move do hero para a seção Sobre ao scrollar (estilo Lando – capacete) */}
      {isDesktop && (
        <ScrollFollowImage
          src={heroImage}
          alt="Bernardo Pereira"
          aboutSectionRef={aboutSectionRef}
          aboutSlotRef={aboutSlotRef}
          onLanded={setImageLanded}
        />
      )}

      {/* Sobre – slot da foto à esquerda (placeholder) + conteúdo à direita */}
      <motion.section
        ref={aboutSectionRef}
        id="about"
        className="py-20 sm:py-28 border-t border-lando-border"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={sectionReveal}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Slot: foto “aterrissa” aqui ao scrollar; após land, mostra cópia estática */}
            <div
              ref={aboutSlotRef}
              className="hidden lg:block relative rounded-lg border border-lando-border aspect-[4/5] max-h-[480px] w-full overflow-hidden bg-lando-surface/40"
              aria-hidden
            >
              {imageLanded && (
                <>
                  <img
                    src={heroImage}
                    alt="Bernardo Pereira"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-lando-bg to-transparent">
                    <span className="text-sm font-medium text-lando-lime">Full Stack Developer</span>
                    <span className="ml-2 text-xs text-gray-500">Disponível</span>
                  </div>
                </>
              )}
            </div>
            <AboutMe />
          </div>
        </div>
      </motion.section>

      {/* Competências */}
      <motion.section
        id="skills"
        className="py-20 sm:py-28 border-t border-lando-border"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={sectionReveal}
      >
        <Skills />
      </motion.section>

      {/* Experiência */}
      <motion.section
        id="experience"
        className="py-20 sm:py-28 border-t border-lando-border"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={sectionReveal}
      >
        <Experience />
      </motion.section>

      {/* Projetos */}
      <motion.section
        id="projects"
        className="py-20 sm:py-28 border-t border-lando-border"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={sectionReveal}
      >
        <Projects />
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="border-t border-lando-border py-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display text-2xl sm:text-3xl text-lando-lime tracking-wide">
            Sempre entregando resultado.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="https://github.com/ppBernardo" target="_blank" rel="noopener noreferrer" className="hover:text-lando-lime transition-colors">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/bernardo-pereira-b80a0924a/" target="_blank" rel="noopener noreferrer" className="hover:text-lando-lime transition-colors">
              LinkedIn
            </a>
            <a href="https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw==" target="_blank" rel="noopener noreferrer" className="hover:text-lando-lime transition-colors">
              Instagram
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 pt-6 border-t border-lando-border text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Bernardo Pereira. Todos os direitos reservados.
        </div>
      </motion.footer>
      </div>
    </div>
  );
};

export default App;
