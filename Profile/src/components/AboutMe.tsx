import bernardo from '../../imgs/1736527234906.jpeg'

const AboutMe = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 py-8">
      <div className="max-w-6xl w-full mx-4">
        <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 group">
          <div className="md:flex h-full">
            <div className="md:w-[40%] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent z-10"></div>
              <img
                className="h-full w-full object-cover min-h-[500px] transform group-hover:scale-105 transition-transform duration-700"
                src={bernardo}
                alt="Bernardo Pereira Pinto"
              />
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Empregado - ALTEROSA MK</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-[60%] p-8 lg:p-12">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-semibold text-blue-400 tracking-wide">Desenvolvedor Full Stack</span>
                  </div>
                  <h1 className="mt-4 text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                    Bernardo Pereira Pinto
                  </h1>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Sou um desenvolvedor apaixonado por criar soluções <span className="text-blue-400 font-semibold">inovadoras</span> e <span className="text-purple-400 font-semibold">impactantes</span>. Com experiência em desenvolvimento
                    web full stack, busco constantemente aprender novas tecnologias e aprimorar minhas habilidades.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Minha jornada na programação começou há <span className="text-yellow-400 font-semibold">4 anos</span>, e desde então venho trabalhando em projetos desafiadores
                    que me permitiram desenvolver uma visão ampla do processo de desenvolvimento de software.
                  </p>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Formação Acadêmica</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-300 text-lg font-medium">
                      Bacharel em Sistema de Informação
                    </p>
                    <p className="text-blue-400 font-semibold">
                      Universidade PUC • 2023
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 text-sm font-medium">React</span>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full border border-green-500/30">
                    <span className="text-green-400 text-sm font-medium">Node.js</span>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full border border-purple-500/30">
                    <span className="text-purple-400 text-sm font-medium">TypeScript</span>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full border border-yellow-500/30">
                    <span className="text-yellow-400 text-sm font-medium">4+ Anos Exp.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;