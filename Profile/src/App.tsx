import { motion } from 'framer-motion';
import { Code2, Briefcase, Github, Linkedin, Instagram, Sun, Moon, Monitor, FolderGit2 } from 'lucide-react';
import AboutMe from './components/AboutMe';
import heroImage from '../imgs/1736527234906.jpeg';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import { useTheme } from './hooks/useTheme';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const sectionItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const App = () => {
  const { theme, changeTheme } = useTheme();

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
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/70 dark:border-gray-800/70"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-semibold shadow-md shadow-blue-500/30"
            >
              BP
            </motion.div>
            <div>
              <p className="text-sm font-semibold">Bernardo Pereira</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Desenvolvedor Full Stack</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-4 text-sm">
            {['about', 'skills', 'experience', 'projects'].map((id, i) => (
              <motion.button
                key={id}
                onClick={() => scrollToSection(id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {id === 'about' && 'Sobre'}
                {id === 'skills' && 'Competências'}
                {id === 'experience' && 'Experiência'}
                {id === 'projects' && 'Projetos'}
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 gap-0.5">
              <motion.button
                onClick={() => changeTheme('light')}
                whileTap={{ scale: 0.92 }}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  theme === 'light'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Tema Claro"
              >
                <Sun size={14} />
              </motion.button>
              <motion.button
                onClick={() => changeTheme('dark')}
                whileTap={{ scale: 0.92 }}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Tema Escuro"
              >
                <Moon size={14} />
              </motion.button>
              <motion.button
                onClick={() => changeTheme('system')}
                whileTap={{ scale: 0.92 }}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  theme === 'system'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Tema do Sistema"
              >
                <Monitor size={14} />
              </motion.button>
            </div>

            <div className="flex md:hidden items-center gap-2">{getThemeIcon()}</div>

            <div className="hidden md:flex items-center gap-2">
              <motion.a
                href="https://github.com/ppBernardo"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Github size={16} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/bernardo-pereira-b80a0924a/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Linkedin size={16} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw=="
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Instagram size={16} />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero - motion stagger estilo Lando Norris */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-16 lg:pt-20 lg:pb-24 relative">
          <div className="grid lg:grid-cols-[1fr,340px] gap-10 lg:gap-12 items-center">
            <motion.div
              className="space-y-6 order-2 lg:order-1"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={item}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-xs text-blue-700 dark:text-blue-300"
              >
                Desenvolvimento • Produtos Digitais • Full Stack
              </motion.div>
              <motion.h1
                variants={item}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              >
                Transformo ideias em{' '}
                <span className="text-blue-600 dark:text-blue-400">produtos digitais</span> modernos, escaláveis e
                prontos para crescer.
              </motion.h1>
              <motion.p
                variants={item}
                className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl"
              >
                Atuo como desenvolvedor full stack, unindo frontends performáticos em React e Angular com backends
                robustos em .NET e Node.js, para criar soluções que realmente geram valor para o negócio.
              </motion.p>
              <motion.div variants={item} className="flex flex-wrap gap-3">
                <motion.button
                  onClick={() => scrollToSection('projects')}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 40px -10px rgba(37, 99, 235, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-500/30 transition-colors"
                >
                  <FolderGit2 size={16} className="mr-2" />
                  Ver projetos em destaque
                </motion.button>
                <motion.a
                  href="https://wa.me/5531999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Fale comigo
                </motion.a>
              </motion.div>
              <motion.div variants={item} className="grid grid-cols-3 gap-4 max-w-md pt-2">
                {[
                  { label: 'Experiência', value: '4+ anos' },
                  { label: 'Stack', value: 'React • .NET • Node' },
                  { label: 'Foco', value: 'Produtos digitais' },
                ].map((card) => (
                  <motion.div
                    key={card.label}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{card.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center lg:justify-end order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none lg:w-[340px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
              >
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About */}
      <motion.section
        id="about"
        className="max-w-6xl mx-auto px-4 py-10 sm:py-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <motion.div variants={sectionItem}>
          <AboutMe />
        </motion.div>
      </motion.section>

      {/* Skills */}
      <motion.section
        id="skills"
        className="max-w-6xl mx-auto px-4 py-10 sm:py-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <motion.div className="flex items-center gap-2 mb-4" variants={sectionItem}>
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Code2 size={18} />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">Competências Técnicas</h2>
        </motion.div>
        <motion.div
          variants={sectionItem}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
        >
          <Skills />
        </motion.div>
      </motion.section>

      {/* Experience */}
      <motion.section
        id="experience"
        className="max-w-6xl mx-auto px-4 py-10 sm:py-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <motion.div className="flex items-center gap-2 mb-4" variants={sectionItem}>
          <div className="w-8 h-8 rounded-lg bg-purple-600/10 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Briefcase size={18} />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">Experiência Profissional</h2>
        </motion.div>
        <motion.div
          variants={sectionItem}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
        >
          <Experience />
        </motion.div>
      </motion.section>

      {/* Projects */}
      <motion.section
        id="projects"
        className="max-w-6xl mx-auto px-4 py-10 sm:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <motion.div className="flex items-center gap-2 mb-4" variants={sectionItem}>
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <FolderGit2 size={18} />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">Projetos em Destaque</h2>
        </motion.div>
        <motion.div
          variants={sectionItem}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
        >
          <Projects />
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-gray-200 dark:border-gray-800 mt-8"
      >
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>© {new Date().getFullYear()} Bernardo Pereira. Todos os direitos reservados.</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Aberto a oportunidades de trabalho e parcerias.
          </span>
        </div>
      </motion.footer>
    </div>
  );
};

export default App;
