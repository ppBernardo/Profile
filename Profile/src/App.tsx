import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SkinProvider } from './context/SkinContext';
import { HyperspaceProvider } from './components/Hyperspace';
import { setLenis } from './lib/scroll';
import Grain from './components/Grain';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import MasterSection from './components/MasterSection';
import AboutSection from './components/AboutSection';
import CommitsSection from './components/CommitsSection';
import ExperienceSection from './components/ExperienceSection';
import FleetSection from './components/FleetSection';
import HolocronSection from './components/HolocronSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const handleLoaded = useCallback(() => {
    setLoading(false);
    setReady(true);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1,
    });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    // Fontes e layout já estão prontos: recalcula os triggers após a tela de carregamento sair.
    if (!ready) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [ready]);

  return (
    <SkinProvider>
      <HyperspaceProvider>
        {loading && <LoadingScreen onComplete={handleLoaded} />}
        <div className="relative min-h-screen bg-sith-void text-sith-ink">
          <Grain />
          <Navigation />
          <main>
            <HeroSection ready={ready} />
            <MasterSection />
            <AboutSection />
            <CommitsSection />
            <ExperienceSection />
            <FleetSection />
            <HolocronSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      </HyperspaceProvider>
    </SkinProvider>
  );
}
