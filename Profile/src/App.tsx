import { useState } from 'react';
import { Menu, X, Code2, User2, Briefcase, ChevronRight, Github, Linkedin, Instagram, Sun, Moon, Monitor } from 'lucide-react';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Experience from './components/Experience';
import { useTheme } from './hooks/useTheme';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const { theme, changeTheme, isDark } = useTheme();

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

  const getColorClasses = (isActive: boolean) => {
    if (isActive) {
      return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-l-4 border-blue-600 dark:border-blue-400';
    }
    return 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100';
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={18} />;
      case 'dark':
        return <Moon size={18} />;
      default:
        return <Monitor size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-6 right-6 z-50 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-xl transition-all duration-200"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition duration-300 ease-in-out z-30 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Bernardo Pereira
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Desenvolvedor Full Stack</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-yellow-400'}`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {theme === 'system' ? 'Sistema' : isDark ? 'Escuro' : 'Claro'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  getColorClasses(activeSection === item.id)
                }`}
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span className="font-medium flex-1 text-left text-sm">{item.name}</span>
                {activeSection === item.id && (
                  <ChevronRight size={14} className="text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tema</span>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                  {theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Escuro'}
                </div>
              </div>
              <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-0.5 gap-0.5">
                <button
                  onClick={() => changeTheme('light')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    theme === 'light' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-yellow-600 dark:text-yellow-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  title="Tema Claro"
                >
                  <Sun size={14} />
                </button>
                <button
                  onClick={() => changeTheme('dark')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  title="Tema Escuro"
                >
                  <Moon size={14} />
                </button>
                <button
                  onClick={() => changeTheme('system')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    theme === 'system' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-green-600 dark:text-green-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  title="Tema do Sistema"
                >
                  <Monitor size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Redes Sociais
            </div>
            <div className="flex space-x-2">
              <a 
                href="https://github.com/ppBernardo" 
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" />
              </a>
              <a 
                href="https://www.linkedin.com/in/bernardo-pereira-b80a0924a/" 
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={16} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" />
              </a>
              <a 
                href="https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw==" 
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={16} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="min-h-screen">{renderSection()}</main>
      </div>
    </div>
  );
}

export default App;