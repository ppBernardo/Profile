import { motion } from 'framer-motion';
import { MapPin, Briefcase, Zap } from 'lucide-react';
import { viewportDefault, staggerContainer, fadeUpItem, fadeLeftItem } from '../utils/animations';

const experiences = [
  {
    year: '2025',
    period: 'Abr 2025 - Atual',
    company: 'ALTEROSA MK',
    role: 'Full Stack Developer',
    location: 'Contagem, MG',
    duration: '9 meses',
    type: 'Tempo integral',
    mode: 'Presencial',
    description: [
      'Responsável pelo desenvolvimento completo de aplicações web, atuando tanto no back-end, com foco na criação de aplicações escaláveis em .NET, quanto no front-end, utilizando Angular 19+ para interfaces modernas e performáticas.',
      'Desenvolvimento de APIs RESTful em .NET com boas práticas de arquitetura, segurança e integração com sistemas internos e externos.',
      'Criação de workers em .NET para processamento assíncrono e automação de rotinas críticas.',
    ],
    achievements: [
      'Desenvolvimento e manutenção de APIs e sistemas internos em .NET',
      'Implementação de interfaces ricas com Angular 19+',
      'Integração fluida entre front-end e back-end',
    ],
    technologies: ['Angular 19+', '.NET', 'APIs RESTful', 'Workers .NET', 'Standalone Components', 'Signals', 'C#'],
  },
  {
    year: '2024',
    period: 'Mai 2024 - Abr 2025',
    company: 'Mais Distribuidora LTDA',
    role: 'Analista de desenvolvimento de Sistemas',
    location: 'Belo Horizonte, MG',
    duration: '1 ano',
    type: 'Tempo integral',
    mode: 'Presencial',
    description: [
      'Atuação em soluções corporativas com foco em eficiência, integrando banco de dados Oracle, redes Mikrotik e sistemas em .NET.',
      'Desenvolvimento de interfaces modernas em React e APIs robustas em ASP.NET para integração entre sistemas.',
    ],
    achievements: [
      'Otimização de processos internos com automação e integração de sistemas',
      'Administração de Banco de Dados Oracle e redes Mikrotik',
    ],
    technologies: ['C#', '.NET Framework', 'Oracle', 'Mikrotik', 'React', 'ASP.NET'],
  },
  {
    year: '2022',
    period: 'Nov 2022 - Jan 2023',
    company: 'Mais Dados Digital',
    role: 'Desenvolvedor Full Stack Trainee',
    location: 'Belo Horizonte, MG',
    duration: '3 meses',
    type: 'Trainee',
    mode: 'Híbrida',
    description: [
      'Participação em projetos de software do início ao fim, do desenvolvimento ao teste e implantação.',
      'Contato direto com metodologias de desenvolvimento, resolução de problemas e otimização de desempenho.',
    ],
    achievements: [
      'Suporte no desenvolvimento e teste de funcionalidades essenciais',
      'Aprimoramento de habilidades de trabalho em equipe e boas práticas de código',
    ],
    technologies: ['SQL', 'Bitbucket', 'Desenvolvimento Full Stack'],
  },
];

const Experience = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Título estilo Lando – "F1 Seasons" / "pre-f1 career" */}
      <motion.p
        variants={fadeUpItem}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        className="text-lando-lime text-sm uppercase tracking-[0.2em] font-medium mb-2"
      >
        Experiência Profissional
      </motion.p>
      <motion.h2
        variants={fadeUpItem}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide"
      >
        carreira
      </motion.h2>
      <motion.p
        variants={fadeUpItem}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        className="font-display text-3xl sm:text-4xl text-white/60 tracking-wide mt-1 mb-12"
      >
        & timeline
      </motion.p>

      {/* Tabela estilo "F1 Seasons" – Year | Finish | Podiums */}
      <motion.div
        className="rounded-lg border border-lando-border overflow-hidden bg-lando-surface/10 mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        variants={fadeUpItem}
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-0 border-b border-lando-border">
          <div className="sm:col-span-2 py-3 px-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Year
          </div>
          <div className="sm:col-span-4 py-3 px-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Empresa
          </div>
          <div className="sm:col-span-4 py-3 px-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cargo
          </div>
          <div className="sm:col-span-2 py-3 px-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider text-right sm:text-left">
            Duração
          </div>
        </div>
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.company}
            className="grid grid-cols-1 sm:grid-cols-12 gap-0 border-b border-lando-border last:border-b-0 hover:bg-lando-surface/20 transition-colors"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportDefault}
            transition={{ delay: i * 0.06 }}
          >
            <div className="sm:col-span-2 py-4 px-4 sm:px-6">
              <span className="font-display text-2xl text-lando-lime">{exp.year}</span>
            </div>
            <div className="sm:col-span-4 py-4 px-4 sm:px-6 font-medium text-white">
              {exp.company}
            </div>
            <div className="sm:col-span-4 py-4 px-4 sm:px-6 text-lando-lime/90 text-sm sm:text-base">
              {exp.role}
            </div>
            <div className="sm:col-span-2 py-4 px-4 sm:px-6 text-gray-500 text-sm text-right sm:text-left">
              {exp.duration}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Linha do tempo detalhada – estilo "pre-f1 career" com blocos por ano */}
      <motion.p
        variants={fadeUpItem}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefault}
        className="text-gray-500 text-xs uppercase tracking-wider mb-6"
      >
        Detalhes por período
      </motion.p>

      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-[11px] sm:left-4 top-0 bottom-0 w-px bg-lando-border" />

        <motion.div
          className="space-y-0"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefault}
        >
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              variants={fadeLeftItem}
              className="relative pl-10 sm:pl-12 pb-12 last:pb-0"
            >
              {/* Nó da linha do tempo */}
              <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-lando-lime border-2 border-lando-bg z-10" />

              <div className="border border-lando-border rounded-lg p-5 sm:p-6 bg-lando-surface/20 hover:border-lando-lime/20 transition-colors">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                  <span className="font-display text-xl text-lando-lime">{exp.year}</span>
                  <span className="text-gray-500 text-sm">{exp.period}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-0.5">{exp.company}</h3>
                <p className="text-lando-lime text-sm font-medium mb-2">{exp.role}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {'type' in exp && (
                    <span className="px-2 py-0.5 rounded text-xs bg-lando-lime/10 text-lando-lime border border-lando-lime/30">
                      {exp.type}
                    </span>
                  )}
                  {'mode' in exp && (
                    <span className="px-2 py-0.5 rounded text-xs border border-lando-border text-gray-500">
                      {exp.mode}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-500 text-xs mb-4">
                  <MapPin size={12} className="mr-1.5 flex-shrink-0" />
                  {exp.location}
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
                    <Briefcase size={14} className="text-lando-lime" />
                    Responsabilidades
                  </h4>
                  <ul className="space-y-2">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-gray-400 text-sm leading-relaxed flex gap-2">
                        <span className="text-lando-lime mt-1.5 flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {'achievements' in exp && exp.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
                      <Zap size={14} className="text-lando-lime" />
                      Principais Contribuições
                    </h4>
                    <ul className="space-y-1.5">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-gray-400 text-sm flex gap-2">
                          <span className="text-lando-lime mt-1.5 flex-shrink-0">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Tecnologias</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-xs border border-lando-border text-gray-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Experience;
