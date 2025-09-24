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
          iconBg: 'bg-blue-100 dark:bg-blue-900/50',
          iconColor: 'text-blue-600 dark:text-blue-400',
          bar: 'bg-blue-500 dark:bg-blue-400',
          text: 'text-blue-600 dark:text-blue-400'
        };
      case 'green':
        return {
          iconBg: 'bg-green-100 dark:bg-green-900/50',
          iconColor: 'text-green-600 dark:text-green-400',
          bar: 'bg-green-500 dark:bg-green-400',
          text: 'text-green-600 dark:text-green-400'
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-100 dark:bg-purple-900/50',
          iconColor: 'text-purple-600 dark:text-purple-400',
          bar: 'bg-purple-500 dark:bg-purple-400',
          text: 'text-purple-600 dark:text-purple-400'
        };
      default:
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/50',
          iconColor: 'text-blue-600 dark:text-blue-400',
          bar: 'bg-blue-500 dark:bg-blue-400',
          text: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-6xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-700 mb-4 transition-colors duration-300">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Competências Técnicas</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
            Minhas Habilidades
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg transition-colors duration-300">
            Conhecimentos técnicos e ferramentas que domino para criar soluções inovadoras e eficientes
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid gap-8">
          {skills.map((category, categoryIndex) => {
            const colors = getColorClasses(category.color);
            return (
              <div 
                key={category.category} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
              >
                {/* Category Header */}
                <div className="flex items-center mb-8">
                  <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center mr-4 transition-colors duration-300`}>
                    <category.icon size={24} className={colors.iconColor} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{category.category}</h2>
                    <div className="w-16 h-1 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 transition-colors duration-300"></div>
                  </div>
                </div>

                {/* Skills List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((skill, skillIndex) => (
                    <div key={skill.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${colors.iconBg} transition-colors duration-300`}>
                            <skill.icon size={16} className={colors.iconColor} />
                          </div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium transition-colors duration-300">{skill.name}</span>
                        </div>
                        <span className={`text-sm font-semibold ${colors.text} transition-colors duration-300`}>{skill.level}%</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-300">
                        <div
                          className={`${colors.bar} h-2 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.level}%` }}
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duration-300">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-300">16</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Tecnologias</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duration-300">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2 transition-colors duration-300">4+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Anos de Experiência</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center shadow-sm transition-colors duration-300">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2 transition-colors duration-300">85%</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Nível Médio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;