import React from 'react';

const Skills = () => {
  const skills = [
    {
      category: 'Frontend',
      items: [
        { name: 'React', level: 85 },
        { name: 'TypeScript', level: 75 },
        { name: 'HTML5/CSS', level: 95 },
        { name: 'Tailwind CSS', level: 70 },
        { name: 'JavaScript', level: 80 },
      ],
    },
    {
      category: 'Backend',
      items: [
        { name: 'Node.js', level: 85 },
        { name: 'C#', level: 90 },
        { name: '.NET', level: 90 },
        { name: 'ASP.NET', level: 90},
        { name: 'SQL', level: 85 },
      ],
    },
    {
      category: 'Ferramentas',
      items: [
        { name: 'Git', level: 90 },
        { name: 'Windows', level: 80 },
        { name: 'WinBox (Mikrotik)', level: 70 },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-8">
        {skills.map((category) => (
          <div key={category.category} className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#2a2a2a]">
            <h2 className="text-2xl font-bold text-white mb-6">{category.category}</h2>
            <div className="space-y-6">
              {category.items.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-200 font-medium">{skill.name}</span>
                    <span className="text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-2.5">
                    <div
                      className="bg-[#60a5fa] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;