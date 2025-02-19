import React, { useState } from 'react';
import { Menu, X, Code2, User2, Briefcase, ChevronRight, Github, Linkedin, Instagram } from 'lucide-react';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Experience from './components/Experience';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const navigation = [
    { name: 'Sobre Mim', id: 'about', icon: User2 },
    { name: 'Competências', id: 'skills', icon: Code2 },
    { name: 'Experiência', id: 'experience', icon: Briefcase },
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

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-[#1a1a1a] shadow-lg md:hidden text-gray-200 hover:text-white"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-[#1a1a1a] shadow-xl`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white">Meu Portfólio</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#2a2a2a] text-[#60a5fa]'
                    : 'text-gray-300 hover:bg-[#1f1f1f]'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
                {activeSection === item.id && <ChevronRight className="ml-auto" size={20} />}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-[#2a2a2a]">
            <div className="flex space-x-4 justify-center">
              <a href="https://github.com/ppBernardo" className="text-gray-400 hover:text-white transition-colors" target='blank'>
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/bernardo-pereira-b80a0924a/" className="text-gray-400 hover:text-white transition-colors" target='blank'>
                <Linkedin size={24} />
              </a>
              <a href="https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw==" className="text-gray-400 hover:text-white transition-colors" target='blank'>
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="min-h-screen p-6">{renderSection()}</main>
      </div>
    </div>
  );
}

export default App;