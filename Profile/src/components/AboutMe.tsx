import bernardo from '../../imgs/1736527234906.jpeg'

const AboutMe = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-4 transition-colors duration-300">
      <div className="max-w-4xl w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="md:flex h-full">
            <div className="md:w-[40%] relative">
              <img
                className="h-full w-full object-cover min-h-[350px]"
                src={bernardo}
                alt="Bernardo Pereira Pinto"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Empregado - ALTEROSA MK</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-[60%] p-6 lg:p-8">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-700 transition-colors duration-300">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Desenvolvedor Full Stack</span>
                  </div>
                  <h1 className="mt-3 text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    Bernardo Pereira Pinto
                  </h1>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base transition-colors duration-300">
                    Sou um desenvolvedor apaixonado por criar soluções <span className="text-blue-600 dark:text-blue-400 font-semibold">inovadoras</span> e <span className="text-gray-900 dark:text-gray-100 font-semibold">impactantes</span>. Com experiência em desenvolvimento
                    web full stack, busco constantemente aprender novas tecnologias e aprimorar minhas habilidades.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base transition-colors duration-300">
                    Minha jornada na programação começou há <span className="text-gray-900 dark:text-gray-100 font-semibold">4 anos</span>, e desde então venho trabalhando em projetos desafiadores
                    que me permitiram desenvolver uma visão ampla do processo de desenvolvimento de software.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-3 transition-colors duration-300">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Formação Acadêmica</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-base transition-colors duration-300">
                      Bacharel em Sistema de Informação
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm transition-colors duration-300">
                      Universidade PUC • 2023
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700 transition-colors duration-300">
                    <span className="text-blue-700 dark:text-blue-300 text-xs font-medium">React</span>
                  </div>
                  <div className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700 transition-colors duration-300">
                    <span className="text-green-700 dark:text-green-300 text-xs font-medium">Node.js</span>
                  </div>
                  <div className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700 transition-colors duration-300">
                    <span className="text-purple-700 dark:text-purple-300 text-xs font-medium">TypeScript</span>
                  </div>
                  <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors duration-300">
                    <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">4+ Anos Exp.</span>
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