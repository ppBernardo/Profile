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
        'Responsável pelo desenvolvimento completo de aplicações web, atuando tanto no back-end, com foco na criação de aplicações escaláveis em .NET, quanto no front-end, utilizando Angular 19+ para construção de interfaces modernas, responsivas e performáticas.',
        'No back-end, desenvolve APIs RESTful utilizando .NET, aplicando boas práticas de arquitetura, segurança e integração com sistemas internos e externos. Também trabalha na criação de workers em .NET para processamento de tarefas assíncronas e automatização de rotinas.',
        'No front-end, utiliza os recursos mais recentes do Angular, como standalone components e signals, garantindo alta performance, modularidade e uma excelente experiência do usuário.'
      ],
      achievements: [
        'Desenvolvimento e manutenção de APIs e sistemas internos em .NET',
        'Criação de workers para tarefas automatizadas e processamento assíncrono',
        'Implementação de interfaces ricas e eficientes com Angular 19+',
        'Integração fluida entre front-end e back-end',
        'Colaboração com áreas de negócio para entrega de soluções alinhadas aos objetivos da empresa'
      ],
      technologies: ['Angular 19+', '.NET', 'APIs RESTful', 'Workers .NET', 'Standalone Components', 'Signals', 'Java', 'Clean Architecture', 'C#', 'Websockets']
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
        'Atuei como Analista de Desenvolvedor de Sistemas, com foco em soluções eficientes e inovadoras. Tenho sólida experiência em Banco de Dados Oracle, administração de redes utilizando Mikrotik, além de desenvolvimento em C# e .NET Framework.',
        'No meu dia a dia, estou sempre buscando novas formas de otimizar processos e aprimorar minhas habilidades técnicas, contribuindo diretamente para a evolução dos projetos em que atuo e para o crescimento da empresa.',
        'Desenvolvi sites utilizando React, garantindo interfaces modernas, responsivas e de alta performance, bem como APIs robustas em ASP.NET, que facilitam a integração entre sistemas e melhoram a eficiência operacional.'
      ],
      achievements: [
        'Desenvolvimento de soluções em C# e .NET Framework',
        'Administração de Banco de Dados Oracle',
        'Administração de redes utilizando Mikrotik',
        'Desenvolvimento de interfaces modernas com React',
        'Criação de APIs robustas em ASP.NET',
        'Otimização de processos e melhoria de eficiência operacional'
      ],
      technologies: ['C#', '.NET Framework', 'Oracle', 'Mikrotik', 'React', 'ASP.NET', 'Desenvolvimento de Software', 'Administração de Redes', 'Banco de Dados', 'Otimização de Processos', 'Gestão de Sistemas', 'Análise de Sistemas', 'Desenvolvimento Web']
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
        'Como Trainee de Desenvolvimento de Software, estive ativamente envolvido na criação e aprimoramento de soluções de software inovadoras. Colaborei com equipes multifuncionais para desenvolver, testar e implementar funcionalidades essenciais em diversos projetos de software.',
        'Adquiri conhecimento prático em diversas linguagens de programação e metodologias de desenvolvimento, contribuindo desde a resolução de desafios técnicos até a depuração de código e otimização de desempenho.',
        'Minha trajetória como Trainee de Desenvolvimento de Software me proporcionou um sólido entendimento do ciclo de vida do desenvolvimento de software, fortalecendo minhas habilidades de resolução de problemas e aprimorando minha capacidade de colaborar eficazmente em um ambiente dinâmico de programação.'
      ],
      achievements: [
        'Desenvolvimento e teste de funcionalidades essenciais',
        'Resolução de desafios técnicos complexos',
        'Depuração de código e otimização de desempenho',
        'Colaboração em equipes multifuncionais',
        'Aprendizado de metodologias de desenvolvimento',
        'Entendimento do ciclo de vida do desenvolvimento de software'
      ],
      technologies: ['SQL', 'Bitbucket', 'Desenvolvimento Full Stack', 'Metodologias de Desenvolvimento', 'Resolução de Problemas', 'Trabalho em Equipe', 'Controle de Versão', 'Banco de Dados', 'Desenvolvimento de Software', 'Programação']
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          gradient: 'from-blue-500/20 to-blue-600/20',
          border: 'border-blue-500/30',
          shadow: 'shadow-blue-500/10',
          text: 'text-blue-400',
          iconBg: 'bg-blue-500/20 border-blue-500/30',
          badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
        };
      case 'green':
        return {
          gradient: 'from-green-500/20 to-green-600/20',
          border: 'border-green-500/30',
          shadow: 'shadow-green-500/10',
          text: 'text-green-400',
          iconBg: 'bg-green-500/20 border-green-500/30',
          badge: 'bg-green-500/10 border-green-500/20 text-green-400'
        };
      case 'purple':
        return {
          gradient: 'from-purple-500/20 to-purple-600/20',
          border: 'border-purple-500/30',
          shadow: 'shadow-purple-500/10',
          text: 'text-purple-400',
          iconBg: 'bg-purple-500/20 border-purple-500/30',
          badge: 'bg-purple-500/10 border-purple-500/20 text-purple-400'
        };
      default:
        return {
          gradient: 'from-blue-500/20 to-blue-600/20',
          border: 'border-blue-500/30',
          shadow: 'shadow-blue-500/10',
          text: 'text-blue-400',
          iconBg: 'bg-blue-500/20 border-blue-500/30',
          badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
        };
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 py-4">
      <div className="max-w-4xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full border border-purple-500/30 mb-3">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs font-semibold text-purple-400 tracking-wide">Experiência Profissional</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent mb-3">
            Minha Jornada
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Trajetória profissional em desenvolvimento de software, construindo soluções inovadoras e impactantes
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 opacity-30"></div>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const colors = getColorClasses(exp.color);
              return (
                <div 
                  key={index} 
                  className="relative"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 w-4 h-4 ${colors.iconBg} rounded-full border-2 border-white shadow-lg z-10`}></div>
                  
                  {/* Experience Card */}
                  <div className="ml-16 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 group">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 mb-3 lg:mb-0">
                        <div className={`w-12 h-12 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center border ${colors.border} shadow-lg ${colors.shadow}`}>
                          <exp.icon size={24} className={colors.text} />
                        </div>
                        <div>
                          <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">{exp.company}</h3>
                          <p className={`text-base font-semibold ${colors.text} mb-2`}>{exp.role}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge} border`}>
                              {exp.type}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-600/20 border border-gray-600/30 text-gray-300">
                              {exp.mode}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                              {exp.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center text-gray-400 mb-1">
                          <Calendar size={16} className="mr-2" />
                          <span className="font-medium">{exp.period}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <MapPin size={16} className="mr-2" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="text-base font-semibold text-white mb-3 flex items-center">
                        <Briefcase size={16} className="mr-2 text-purple-400" />
                        Responsabilidades
                      </h4>
                      <div className="space-y-2">
                        {exp.description.map((item, i) => (
                          <p key={i} className="text-gray-300 leading-relaxed text-sm">{item}</p>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="text-base font-semibold text-white mb-3 flex items-center">
                        <Zap size={16} className="mr-2 text-yellow-400" />
                        Principais Contribuições
                      </h4>
                      <ul className="space-y-1.5">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.iconBg} border ${colors.border} mt-1.5 flex-shrink-0`}></div>
                            <span className="text-gray-300 text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-base font-semibold text-white mb-3 flex items-center">
                        <Code2 size={16} className="mr-2 text-blue-400" />
                        Tecnologias
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-1 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-md border border-gray-600/30 text-gray-300 text-xs font-medium hover:border-blue-500/50 transition-all duration-300"
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

        {/* Bottom Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">3</div>
            <div className="text-gray-300 text-sm font-medium">Empresas</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">4+</div>
            <div className="text-gray-300 text-sm font-medium">Anos de Experiência</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">Full Stack</div>
            <div className="text-gray-300 text-sm font-medium">Especialização</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">15+</div>
            <div className="text-gray-300 text-sm font-medium">Tecnologias</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
