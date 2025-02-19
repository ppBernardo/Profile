import React from 'react';

const Experience = () => {
  const experiences = [
    {
      company: 'Mais Dados',
      role: 'Analista de desenvolvimento de Sistemas',
      period: 'Mai 2024 - Presente',
      description: [
        `Atualmente, atuo como Analista de Desenvolvedor de Sistemas, com foco em soluções eficientes e inovadoras. Tenho sólida experiência em Banco de Dados Oracle, administração de redes utilizando Mikrotik, além de desenvolvimento em C# e .NET Framework. No meu dia a dia, estou sempre buscando novas formas de otimizar processos e aprimorar minhas habilidades técnicas, contribuindo diretamente para a evolução dos projetos em que atuo e para o crescimento da empresa.\nAlém disso, desenvolvi sites utilizando React, garantindo interfaces modernas, responsivas e de alta performance, bem como APIs robustas em ASP.NET, que facilitam a integração entre sistemas e melhoram a eficiência operacional. Essas soluções têm sido fundamentais para impulsionar a produtividade e a inovação dentro da empresa.`,
      ],
    },
    {
      company: 'Mais Dados',
      role: 'Desenvolvedor Full Stack Trainee',
      period: 'Nov 2022 - Jan 2023',
      description: [
        'Como Trainee de Desenvolvimento de Software, tenho estado ativamente envolvido na criação e aprimoramento de soluções de software inovadoras. Durante o meu estágio, tenho colaborado com equipes multifuncionais para desenvolver, testar e implementar funcionalidades essenciais em diversos projetos de software. Através dessa experiência, tenho adquirido conhecimento prático em diversas linguagens de programação e metodologias de desenvolvimento. Minha contribuição abrange desde a resolução de desafios técnicos até a depuração de código e a otimização de desempenho, sempre aproveitando a oportunidade de aprender com profissionais experientes na área. Minha trajetória como Trainee de Desenvolvimento de Software tem me proporcionado um sólido entendimento do ciclo de vida do desenvolvimento de software. Além disso, tenho fortalecido minhas habilidades de resolução de problemas e aprimorado minha capacidade de colaborar eficazmente em um ambiente dinâmico de programação.',
      ],
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#2a2a2a]">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                  <p className="text-[#60a5fa] font-semibold">{exp.role}</p>
                </div>
                <span className="text-gray-400 mt-2 md:mt-0">{exp.period}</span>
              </div>
              <div className="text-[#d1d5db] space-y-2">
                {exp.description.map((item, i) => (
                  <p key={i} className="whitespace-pre-line">{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;