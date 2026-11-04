import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LangProvider } from './i18n/LangContext';
import { SideProvider, useSide } from './context/SideContext';
import { SkinProvider } from './context/SkinContext';
import { HyperspaceProvider } from './components/Hyperspace';
import { setLenis } from './lib/scroll';
import Grain from './components/Grain';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CommitsSection from './components/CommitsSection';
import ExperienceSection from './components/ExperienceSection';
import FleetSection from './components/FleetSection';
import HolocronSection from './components/HolocronSection';
import TatooineEntry from './components/TatooineEntry';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function Shell() {
  const { side } = useSide();
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const handleLoaded = useCallback(() => {
    setLoading(false);
    setReady(true);
  }, []);

  useEffect(() => {
    // Roda do mouse suavizada; no toque o scroll é nativo (o Lenis "segurando" o dedo deixa o celular pesado).
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
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
        {/* As seções só montam depois da escolha do lado: os modelos 3D e as falas dependem dela. */}
        {side && (
          <div className="relative min-h-screen bg-sith-void text-sith-ink">
            <Grain />
            <Navigation />
            <main>
              <HeroSection ready={ready} />
              <AboutSection />
              <CommitsSection />
              <ExperienceSection />
              <FleetSection />
              <HolocronSection />
              <TatooineEntry />
              <ContactSection />
            </main>
            <Footer />
          </div>
        )}
      </HyperspaceProvider>
    </SkinProvider>
  );
}

export default function App() {
  return (
    <LangProvider>
      <SideProvider>
        <Shell />
      </SideProvider>
    </LangProvider>
  );
}
