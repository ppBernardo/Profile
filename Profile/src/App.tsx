import { Code2, Briefcase, Github, Linkedin, Instagram, Sun, Moon, Monitor, FolderGit2 } from 'lucide-react';
import AboutMe from './components/AboutMe';
import heroImage from '../imgs/1736527234906.jpeg';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import { useTheme } from './hooks/useTheme';
import { useInView } from './hooks/useInView';

const App = () => {
  const { theme, changeTheme } = useTheme();

  const aboutInView = useInView();
  const skillsInView = useInView();
  const experienceInView = useInView();
  const projectsInView = useInView();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={18} />;
      case 'dark':
        return <Moon size={18} />;
      default:
        return <Monitor size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 transition-colors duration-300">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/70 dark:border-gray-800/70">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-semibold shadow-md shadow-blue-500/30">
              BP
            </div>
            <div>
              <p className="text-sm font-semibold">Bernardo Pereira</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Desenvolvedor Full Stack</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-4 text-sm">
            <button
              onClick={() => scrollToSection('about')}
              className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Competências
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Experiência
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Projetos
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 gap-0.5">
              <button
                onClick={() => changeTheme('light')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  theme === 'light'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Tema Claro"
              >
                <Sun size={14} />
              </button>
              <button
                onClick={() => changeTheme('dark')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Tema Escuro"
              >
                <Moon size={14} />
              </button>
              <button
                onClick={() => changeTheme('system')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  theme === 'system'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Tema do Sistema"
              >
                <Monitor size={14} />
              </button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              {getThemeIcon()}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <a
                href="https://github.com/ppBernardo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Github size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/bernardo-pereira-b80a0924a/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero - estilo agência */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-16 lg:pt-20 lg:pb-24 relative">
          <div className="grid lg:grid-cols-[1fr,340px] gap-10 lg:gap-12 items-center">
            {/* Coluna esquerda: texto e CTAs */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-xs text-blue-700 dark:text-blue-300">
                Desenvolvimento • Produtos Digitais • Full Stack
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Transformo ideias em{' '}
                <span className="text-blue-600 dark:text-blue-400">produtos digitais</span> modernos, escaláveis e
                prontos para crescer.
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl">
                Atuo como desenvolvedor full stack, unindo frontends performáticos em React e Angular com backends
                robustos em .NET e Node.js, para criar soluções que realmente geram valor para o negócio.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="inline-flex items-center px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-500/30 transition-colors"
                >
                  <FolderGit2 size={16} className="mr-2" />
                  Ver projetos em destaque
                </button>
                <a
                  href="https://wa.me/5531999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Fale comigo
                </a>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md pt-2">
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Experiência</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">4+ anos</p>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Stack</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">React • .NET • Node</p>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Foco</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Produtos digitais</p>
                </div>
              </div>
            </div>

            {/* Coluna direita: card com foto */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none lg:w-[340px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
                <div className="aspect-[3/4] w-full">
                  <img
                    src={heroImage}
                    alt="Bernardo Pereira"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-medium text-white">Full Stack Developer</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
                      Disponível
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        ref={aboutInView.ref}
        className={`max-w-6xl mx-auto px-4 py-10 sm:py-14 transition-all duration-700 ${
          aboutInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <AboutMe />
      </section>

      {/* Skills */}
      <section
        id="skills"
        ref={skillsInView.ref}
        className={`max-w-6xl mx-auto px-4 py-10 sm:py-14 transition-all duration-700 ${
          skillsInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Code2 size={18} />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">Competências Técnicas</h2>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
          <Skills />
        </div>
      </section>

      {/* Experience */}
      <section
        id="experience"
        ref={experienceInView.ref}
        className={`max-w-6xl mx-auto px-4 py-10 sm:py-14 transition-all duração-700 ${
          experienceInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-600/10 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Briefcase size={18} />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">Experiência Profissional</h2>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
          <Experience />
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        ref={projectsInView.ref}
        className={`max-w-6xl mx-auto px-4 py-10 sm:py-16 transition-all duration-700 ${
          projectsInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <FolderGit2 size={18} />
          </div>
        <h2 className="text-xl sm:text-2xl font-semibold">Projetos em Destaque</h2>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
          <Projects />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>© {new Date().getFullYear()} Bernardo Pereira. Todos os direitos reservados.</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Aberto a oportunidades de trabalho e parcerias.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;

