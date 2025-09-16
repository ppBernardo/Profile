import { useState } from 'react';
import { Menu, X, Code2, User2, Briefcase, ChevronRight, Github, Linkedin, Instagram } from 'lucide-react';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Experience from './components/Experience';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const navigation = [
    { name: 'Sobre Mim', id: 'about', icon: User2, color: 'blue' },
    { name: 'Competências', id: 'skills', icon: Code2, color: 'green' },
    { name: 'Experiência', id: 'experience', icon: Briefcase, color: 'purple' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutMe />;
      case 'skills':
        return <Skills />;
      case 'experience':
        return <Experience />;
      default:
        return <AboutMe />;
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    if (!isActive) return 'text-gray-300 hover:bg-gray-800/50 hover:text-white';
    
    switch (color) {
      case 'blue':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10';
      case 'green':
        return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10';
      case 'purple':
        return 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10';
      default:
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm shadow-xl border border-gray-700/50 md:hidden text-gray-200 hover:text-white hover:border-blue-500/50 transition-all duration-300"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition duration-300 ease-in-out z-30 w-72 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-sm shadow-2xl border-r border-gray-700/50`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700/30">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Portfólio
              </h1>
              <p className="text-xs text-gray-400 font-medium">Bernardo Pereira</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
              Navegação
            </div>
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  getColorClasses(item.color, activeSection === item.id)
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeSection === item.id 
                    ? 'bg-white/10' 
                    : 'bg-gray-700/50 group-hover:bg-gray-600/50'
                } transition-all duration-300`}>
                  <item.icon size={18} />
                </div>
                <span className="font-medium flex-1 text-left">{item.name}</span>
                {activeSection === item.id && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <ChevronRight size={16} />
                  </div>
                )}
                
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
          </nav>

          {/* Social Links */}
          <div className="p-6 border-t border-gray-700/30">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Redes Sociais
            </div>
            <div className="flex space-x-3 justify-center">
              <a 
                href="https://github.com/ppBernardo" 
                className="group p-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/30 hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
              </a>
              <a 
                href="https://www.linkedin.com/in/bernardo-pereira-b80a0924a/" 
                className="group p-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/30 hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
              </a>
              <a 
                href="https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw==" 
                className="group p-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/30 hover:border-pink-500/50 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-pink-600/20 transition-all duration-300" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} className="text-gray-400 group-hover:text-pink-400 transition-colors duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-72">
        <main className="min-h-screen">{renderSection()}</main>
      </div>
    </div>
  );
}

export default App;