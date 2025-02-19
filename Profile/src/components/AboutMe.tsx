import React from 'react';
import bernardo from '../../imgs/1736527234906.jpeg'

const AboutMe = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
    <div className="max-w-4xl w-full mx-4">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-xl overflow-hidden border border-[#2a2a2a]">
        <div className="md:flex h-full">
          <div className="md:w-[40%] relative">
            <img
              className="h-full w-full object-cover min-h-[500px]"
              src={bernardo}
              alt="Profile"
            />
          </div>
          <div className="md:w-[60%] p-8">
            <div className="text-sm font-semibold text-[#60a5fa] tracking-wide">Desenvolvedor Full Stack</div>
            <h2 className="mt-2 text-3xl font-bold text-white">Bernardo Pereira Pinto</h2>
            <p className="mt-4 text-[#d1d5db] leading-relaxed">
              Sou um desenvolvedor apaixonado por criar soluções inovadoras e impactantes. Com experiência em desenvolvimento
              web full stack, busco constantemente aprender novas tecnologias e aprimorar minhas habilidades.
            </p>
            <p className="mt-4 text-[#d1d5db] leading-relaxed">
              Minha jornada na programação começou há 4 anos, e desde então venho trabalhando em projetos desafiadores
              que me permitiram desenvolver uma visão ampla do processo de desenvolvimento de software.
            </p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white">Formação</h3>
              <p className="mt-2 text-[#d1d5db]">
                Bacharel em Sistema de Informação
                <br />
                Universidade PUC • 2023
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AboutMe;