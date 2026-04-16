import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useAssetLoader from './hooks/useAssetLoader';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import CompetenciesSection from './components/CompetenciesSection';
import ContactSection from './components/ContactSection';
import MouseTrail from './components/MouseTrail';
import ScrollProgress from './components/ScrollProgress';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const scrollProgressRef = useRef(0);
  const { progress, loaded } = useAssetLoader();
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleLoadingComplete = useCallback(() => {
    setShowContent(true);
  }, []);

  useEffect(() => {
    if (!showContent) return;

    // Fade-in do conteúdo após loading screen desaparecer
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Recalcula ScrollTrigger após conteúdo montar
    setTimeout(() => ScrollTrigger.refresh(), 100);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        resizeTimer = undefined;
      }, 120);
    };
    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [showContent]);

  return (
    <>
      {!showContent && (
        <LoadingScreen
          progress={progress}
          finished={loaded}
          onComplete={handleLoadingComplete}
        />
      )}

      {showContent && (
        <div ref={contentRef} className="bg-black min-h-screen text-gray-200 relative" style={{ opacity: 0 }}>
          <MouseTrail />
          <ScrollProgress />
          <Navigation />

          <HeroSection scrollProgress={scrollProgressRef} />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <CompetenciesSection />
          <ContactSection />

          <footer className="relative border-t border-vader-border py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-2xl sm:text-3xl text-vader-red text-glow-red tracking-wider">
                O LADO SOMBRIO DO CÓDIGO.
              </p>
              <p className="text-gray-700 text-xs font-mono mt-2 tracking-wider">
                {'>'} sempre entregando resultado
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-600 font-mono">
              <a
                href="https://github.com/ppBernardo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-vader-red transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/bernardo-pereira-b80a0924a/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-vader-red transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-vader-red transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-vader-border text-center">
            <p className="text-gray-700 text-[10px] font-mono tracking-[0.2em] uppercase">
              &copy; {new Date().getFullYear()} Bernardo Pereira &bull; Todos os
              direitos reservados
            </p>
          </div>
        </div>
      </footer>
        </div>
      )}
    </>
  );
}
