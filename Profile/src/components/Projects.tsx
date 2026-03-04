import { FolderGit2, Globe, Github, Code2 } from 'lucide-react';

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
      'Plataforma completa para catálogo e gestão de motocicletas, com filtros avançados, páginas detalhadas, tema claro/escuro e experiência otimizada para conversão.',
    role: 'Full Stack',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    demo: 'https://moto-max-eight.vercel.app/',
    frontendRepo: 'https://github.com/ppBernardo/MotoMax',
    backendRepo: 'https://github.com/ppBernardo/backendMotoMax',
    highlight:
      'Frontend moderno com foco em UX, animações e responsividade, integrado a uma API Node.js segura e escalável com autenticação JWT e recursos de catálogo, favoritos e financiamento.',
  },
  {
    name: 'Finance Flow - Gestão Financeira Pessoal',
    description:
      'Plataforma de gestão financeira pessoal para acompanhamento de receitas, despesas e metas, com visualização clara do fluxo de caixa e gráficos intuitivos.',
    role: 'Frontend',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Charts'],
    demo: 'https://personal-financial-management-platf.vercel.app/',
    highlight:
      'Foco em usabilidade e clareza visual para ajudar usuários a entender e organizar melhor sua vida financeira, com interface moderna e responsiva.',
  },
  {
    name: 'Iz Code - Startup de Tecnologia',
    description:
      'Landing page institucional da Iz Code, apresentando a proposta de valor da startup de tecnologia, serviços oferecidos e canais de contato em um layout moderno e responsivo.',
    role: 'Frontend',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    demo: 'https://izcode.com.br/',
    highlight:
      'Foco em comunicação clara da marca, performance e responsividade para fortalecer a presença digital da startup.',
  },
  {
    name: 'Sistema de Gerenciamento de Chamados',
    description:
      'Aplicação full stack para criação, listagem e gerenciamento de chamados, com autenticação e fluxo completo de atendimento.',
    role: 'Full Stack',
    technologies: ['Node.js', 'Express', 'Bcrypt', 'REST API', 'React', 'Create React App'],
    highlight:
      'API robusta em Node.js com segurança de senhas via Bcrypt integrada a um frontend em React focado em simplicidade e produtividade no dia a dia do suporte.',
  },
];

const Projects = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-700 mb-3 transition-colors duration-300">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Projetos em Destaque</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-300">
          Alguns Projetos que Construí
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base transition-colors duration-300">
          Uma seleção de projetos que demonstram minha experiência prática em desenvolvimento full stack, boas práticas
          de código e foco na experiência do usuário.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between transition-colors duração-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center transition-colors duration-300">
                    <FolderGit2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {project.name}
                    </h2>
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 transition-colors duration-300">
                      {project.role}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed transition-colors duration-300">
                {project.description}
              </p>

              {project.highlight && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                  <div className="flex items-center space-x-2">
                    <Code2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-100">Destaque</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{project.highlight}</p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">Tecnologias</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors duração-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {(project.demo || project.frontendRepo || project.backendRepo) && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 transition-colors duração-200"
                      >
                        <Globe size={14} className="mr-1.5" />
                        Site
                      </a>
                    )}
                    {project.frontendRepo && (
                      <a
                        href={project.frontendRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duração-200"
                      >
                        <Github size={14} className="mr-1.5" />
                        Frontend
                      </a>
                    )}
                    {project.backendRepo && (
                      <a
                        href={project.backendRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duração-200"
                      >
                        <Github size={14} className="mr-1.5" />
                        Backend
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duração-300">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 transition-colors duração-300">
            {projects.length}
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors duração-300">
            Projetos Selecionados
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duração-300">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1 transition-colors duração-300">
            Full Stack
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors duração-300">
            Atuação Principal
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duração-300">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1 transition-colors duração-300">
            Código Limpo
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors duração-300">
            Foco em Boas Práticas
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

