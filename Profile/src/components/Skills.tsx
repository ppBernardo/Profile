import { Monitor, Server, Wrench, Code2, Database, Globe, Layers } from 'lucide-react';

const Skills = () => {
  const skills = [
    {
      category: 'Frontend',
      icon: Monitor,
      color: 'blue',
      items: [
        { name: 'React', level: 85, icon: Code2 },
        { name: 'Angular', level: 90, icon: Code2 },
        { name: 'TypeScript', level: 75, icon: Code2 },
        { name: 'HTML5/CSS', level: 95, icon: Globe },
        { name: 'Tailwind CSS', level: 70, icon: Globe },
        { name: 'JavaScript', level: 80, icon: Code2 },
      ],
    },
    {
      category: 'Backend',
      icon: Server,
      color: 'green',
      items: [
        { name: 'Node.js', level: 85, icon: Server },
        { name: 'C#', level: 95, icon: Code2 },
        { name: '.NET', level: 95, icon: Code2 },
        { name: 'ASP.NET', level: 90, icon: Server },
        { name: 'Java', level: 60, icon: Code2 },
        { name: 'Clean Architecture', level: 95, icon: Layers },
        { name: 'SQL', level: 85, icon: Database },
      ],
    },
    {
      category: 'Ferramentas',
      icon: Wrench,
      color: 'purple',
      items: [
        { name: 'Git', level: 90, icon: Code2 },
        { name: 'Windows', level: 80, icon: Monitor },
        { name: 'WinBox (Mikrotik)', level: 70, icon: Wrench },
      ],
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
          bar: 'from-blue-500 to-blue-600',
          iconBg: 'bg-blue-500/20 border-blue-500/30'
        };
      case 'green':
        return {
          gradient: 'from-green-500/20 to-green-600/20',
          border: 'border-green-500/30',
          shadow: 'shadow-green-500/10',
          text: 'text-green-400',
          bar: 'from-green-500 to-green-600',
          iconBg: 'bg-green-500/20 border-green-500/30'
        };
      case 'purple':
        return {
          gradient: 'from-purple-500/20 to-purple-600/20',
          border: 'border-purple-500/30',
          shadow: 'shadow-purple-500/10',
          text: 'text-purple-400',
          bar: 'from-purple-500 to-purple-600',
          iconBg: 'bg-purple-500/20 border-purple-500/30'
        };
      default:
        return {
          gradient: 'from-blue-500/20 to-blue-600/20',
          border: 'border-blue-500/30',
          shadow: 'shadow-blue-500/10',
          text: 'text-blue-400',
          bar: 'from-blue-500 to-blue-600',
          iconBg: 'bg-blue-500/20 border-blue-500/30'
        };
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-800 py-4">
      <div className="max-w-4xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full border border-green-500/30 mb-3">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs font-semibold text-green-400 tracking-wide">Competências Técnicas</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-green-100 to-green-300 bg-clip-text text-transparent mb-3">
            Minhas Habilidades
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Conhecimentos técnicos e ferramentas que domino para criar soluções inovadoras e eficientes
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid gap-6 lg:gap-8">
          {skills.map((category, categoryIndex) => {
            const colors = getColorClasses(category.color);
            return (
              <div 
                key={category.category} 
                className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 group"
                style={{ animationDelay: `${categoryIndex * 200}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center mr-3 border ${colors.border} shadow-lg ${colors.shadow}`}>
                    <category.icon size={24} className={colors.text} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{category.category}</h2>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full"></div>
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-4">
                  {category.items.map((skill, skillIndex) => (
                    <div 
                      key={skill.name}
                      className="group/skill"
                      style={{ animationDelay: `${(categoryIndex * 200) + (skillIndex * 100)}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1.5 rounded-md ${colors.iconBg} border ${colors.border}`}>
                            <skill.icon size={14} className={colors.text} />
                          </div>
                          <span className="text-gray-200 font-semibold">{skill.name}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-xs font-bold ${colors.text}`}>{skill.level}%</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${skill.level >= 90 ? 'bg-green-400' : skill.level >= 70 ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`}></div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="relative">
                        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${colors.bar} h-2 rounded-full transition-all duration-1000 ease-out group-hover/skill:shadow-lg group-hover/skill:shadow-blue-500/25`}
                            style={{ 
                              width: `${skill.level}%`,
                              animationDelay: `${(categoryIndex * 200) + (skillIndex * 100) + 500}ms`
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                        
                        {/* Skill Level Indicator */}
                        <div 
                          className={`absolute top-1/2 transform -translate-y-1/2 w-0.5 h-0.5 bg-white rounded-full shadow-lg transition-all duration-300`}
                          style={{ left: `calc(${skill.level}% - 1px)` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">16</div>
            <div className="text-gray-300 text-sm font-medium">Tecnologias</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">4+</div>
            <div className="text-gray-300 text-sm font-medium">Anos de Experiência</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">85%</div>
            <div className="text-gray-300 text-sm font-medium">Nível Médio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;