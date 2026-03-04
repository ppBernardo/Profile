import { Briefcase, MapPin, Calendar, Building2, Code2, Database, Zap } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      company: 'ALTEROSA MK',
      role: 'Full Stack Developer',
      period: 'Abr 2025 - Atual',
      location: 'Contagem, MG',
      type: 'Tempo integral',
      mode: 'Presencial',
      duration: '6 meses',
      icon: Building2,
      color: 'blue',
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
      company: 'Mais Distribuidora LTDA',
      role: 'Analista de desenvolvimento de Sistemas',
      period: 'Mai 2024 - Abr 2025',
      location: 'Belo Horizonte, MG',
      type: 'Tempo integral',
      mode: 'Presencial',
      duration: '1 ano',
      icon: Database,
      color: 'green',
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
      company: 'Mais Dados Digital',
      role: 'Desenvolvedor Full Stack Trainee',
      period: 'Nov 2022 - Jan 2023',
      location: 'Belo Horizonte, MG',
      type: 'Trainee',
      mode: 'Híbrida',
      duration: '3 meses',
      icon: Code2,
      color: 'purple',
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

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/50',
          iconColor: 'text-blue-600 dark:text-blue-400',
          text: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300',
        };
      case 'green':
        return {
          iconBg: 'bg-green-100 dark:bg-green-900/50',
          iconColor: 'text-green-600 dark:text-green-400',
          text: 'text-green-600 dark:text-green-400',
          badge:
            'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300',
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-100 dark:bg-purple-900/50',
          iconColor: 'text-purple-600 dark:text-purple-400',
          text: 'text-purple-600 dark:text-purple-400',
          badge:
            'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300',
        };
      default:
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/50',
          iconColor: 'text-blue-600 dark:text-blue-400',
          text: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300',
        };
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-full border border-purple-200 dark:border-purple-700 mb-3 transition-colors duration-300">
          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Experiência Profissional</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-300">
          Minha Jornada
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base transition-colors duration-300">
          Trajetória profissional em desenvolvimento de software, construindo soluções inovadoras e impactantes
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 transition-colors duration-300" />

        <div className="space-y-6">
          {experiences.map((exp, index) => {
            const colors = getColorClasses(exp.color);
            return (
              <div key={index} className="relative">
                <div
                  className={`absolute left-6 w-3 h-3 ${colors.iconBg} rounded-full border-2 border-white dark:border-gray-800 shadow-lg z-10 transition-colors duration-300`}
                />

                <div className="ml-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 mb-3 lg:mb-0">
                      <div
                        className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center transition-colors duration-300`}
                      >
                        <exp.icon size={20} className={colors.iconColor} />
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">
                          {exp.company}
                        </h3>
                        <p
                          className={`text-base font-semibold ${colors.text} mb-2 transition-colors duration-300`}
                        >
                          {exp.role}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${colors.badge} border transition-colors duration-300`}
                          >
                            {exp.type}
                          </span>
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            {exp.mode}
                          </span>
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 transition-colors duration-300">
                            {exp.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">
                        <Calendar size={16} className="mr-1.5" />
                        <span className="font-medium text-sm">{exp.period}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        <MapPin size={16} className="mr-1.5" />
                        <span className="text-sm">{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center transition-colors duration-300">
                      <Briefcase size={16} className="mr-2 text-purple-600 dark:text-purple-400" />
                      Responsabilidades
                    </h4>
                    <div className="space-y-2">
                      {exp.description.map((item, i) => (
                        <p
                          key={i}
                          className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm transition-colors duração-300"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center transition-colors duração-300">
                      <Zap size={16} className="mr-2 text-yellow-600 dark:text-yellow-400" />
                      Principais Contribuições
                    </h4>
                    <ul className="space-y-1.5">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${colors.iconBg} mt-2 flex-shrink-0 transition-colors duration-300`}
                          />
                          <span className="text-gray-600 dark:text-gray-300 text-sm transition-colors duração-300">
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center transition-colors duração-300">
                      <Code2 size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                      Tecnologias
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duration-300">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1 transition-colors duration-300">3</div>
          <div className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors duração-300">
            Empresas
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duração-300">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1 transition-colors duração-300">
            4+
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors duração-300">
            Anos de Experiência
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duração-300">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1 transition-colors duração-300">
            Full Stack
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors duração-300">
            Especialização
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duração-300">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1 transition-colors duração-300">
            15+
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium text-sm transition-colors duração-300">
            Tecnologias
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;

