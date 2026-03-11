import { motion } from 'framer-motion';
import { FolderGit2, Globe, Github } from 'lucide-react';
import { viewportDefault, staggerContainer, fadeUpItem, scaleInItem } from '../utils/animations';

type Project = {
  name: string;
  description: string;
  role: string;
  technologies: string[];
  demo?: string;
  frontendRepo?: string;
  backendRepo?: string;
  highlight?: string;
};

const projects: Project[] = [
  {
    name: 'MotoMax - Catálogo de Motocicletas',
    description:
      'Plataforma completa para catálogo e gestão de motocicletas, com filtros avançados, tema claro/escuro e experiência otimizada.',
    role: 'Full Stack',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    demo: 'https://moto-max-eight.vercel.app/',
    frontendRepo: 'https://github.com/ppBernardo/MotoMax',
    backendRepo: 'https://github.com/ppBernardo/backendMotoMax',
    highlight: 'Frontend moderno com UX e animações, API Node.js com autenticação JWT.',
  },
  {
    name: 'Finance Flow - Gestão Financeira Pessoal',
    description:
      'Gestão financeira pessoal: receitas, despesas, metas e gráficos intuitivos do fluxo de caixa.',
    role: 'Frontend',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Charts'],
    demo: 'https://personal-financial-management-platf.vercel.app/',
    highlight: 'Usabilidade e clareza visual, interface moderna e responsiva.',
  },
  {
    name: 'Iz Code - Startup de Tecnologia',
    description:
      'Landing page institucional da Iz Code: proposta de valor, serviços e contato em layout moderno.',
    role: 'Frontend',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    demo: 'https://izcode.com.br/',
    highlight: 'Comunicação da marca, performance e responsividade.',
  },
  {
    name: 'Sistema de Gerenciamento de Chamados',
    description:
      'Aplicação full stack para criação, listagem e gerenciamento de chamados com autenticação.',
    role: 'Full Stack',
    technologies: ['Node.js', 'Express', 'Bcrypt', 'REST API', 'React'],
    highlight: 'API Node.js com Bcrypt e frontend React focado em produtividade.',
  },
];

const Projects = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <motion.p
        variants={fadeUpItem}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        className="text-lando-lime text-sm uppercase tracking-[0.2em] font-medium mb-2"
      >
        Projetos em Destaque
      </motion.p>
      <motion.h2
        variants={fadeUpItem}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-4"
      >
        resultados & highlights
      </motion.h2>
      <motion.p
        variants={fadeUpItem}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        className="text-gray-500 max-w-2xl mb-12"
      >
        Projetos que demonstram experiência em full stack, boas práticas e foco em UX.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
      >
        {projects.map((project) => (
          <motion.article
            key={project.name}
            variants={scaleInItem}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="border border-lando-border rounded-lg p-6 bg-lando-surface/20 hover:border-lando-lime/30 transition-colors flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-lando-limeDim border border-lando-lime/30 flex items-center justify-center">
                  <FolderGit2 size={18} className="text-lando-lime" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{project.name}</h3>
                  <p className="text-xs text-lando-lime">{project.role}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 flex-grow">{project.description}</p>
            {project.highlight && (
              <p className="text-xs text-gray-500 mb-4 border-l-2 border-lando-lime/50 pl-3">
                {project.highlight}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded text-xs border border-lando-border text-gray-500"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-lando-border">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-lando-lime text-lando-bg text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  <Globe size={14} />
                  Site
                </a>
              )}
              {project.frontendRepo && (
                <a
                  href={project.frontendRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-lando-border text-gray-400 text-xs hover:text-lando-lime hover:border-lando-lime/50 transition-colors"
                >
                  <Github size={14} />
                  Frontend
                </a>
              )}
              {project.backendRepo && (
                <a
                  href={project.backendRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-lando-border text-gray-400 text-xs hover:text-lando-lime hover:border-lando-lime/50 transition-colors"
                >
                  <Github size={14} />
                  Backend
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
};

export default Projects;
