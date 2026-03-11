import { motion } from 'framer-motion';
import { viewportDefault, staggerContainer, fadeUpItem } from '../utils/animations';

const AboutMe = () => {
  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportDefault}
    >
      <motion.p variants={fadeUpItem} className="text-lando-lime text-sm uppercase tracking-[0.2em] font-medium">
        Sobre mim
      </motion.p>
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-4xl sm:text-5xl text-white tracking-wide"
      >
        Bernardo Pereira Pinto
      </motion.h2>
      <motion.p variants={fadeUpItem} className="text-gray-400 leading-relaxed">
        Sou um desenvolvedor apaixonado por criar soluções{' '}
        <span className="text-lando-lime font-medium">inovadoras</span> e impactantes. Com experiência
        em desenvolvimento web full stack, busco constantemente aprender novas tecnologias e
        aprimorar minhas habilidades.
      </motion.p>
      <motion.p variants={fadeUpItem} className="text-gray-400 leading-relaxed">
        Minha jornada na programação começou há{' '}
        <span className="text-white font-semibold">4 anos</span>, trabalhando em projetos
        desafiadores que me permitiram desenvolver uma visão ampla do processo de desenvolvimento
        de software.
      </motion.p>

      <motion.div
        variants={fadeUpItem}
        className="p-4 rounded-lg border border-lando-border bg-lando-surface/40"
      >
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Formação</p>
        <p className="text-white font-semibold">Bacharel em Sistema de Informação</p>
        <p className="text-lando-lime text-sm">Universidade PUC • 2023</p>
      </motion.div>

      <motion.div variants={staggerContainer} className="flex flex-wrap gap-2">
        {['React', 'Node.js', 'TypeScript', '.NET', '4+ Anos'].map((tag) => (
          <motion.span
            key={tag}
            variants={fadeUpItem}
            className="px-3 py-1.5 rounded border border-lando-border text-gray-400 text-sm hover:border-lando-lime hover:text-lando-lime transition-colors"
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AboutMe;
