import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Preloader from './components/ui/Preloader';
import HeroHelix from './components/3d/HeroHelix';
import CosmicStarfield from './components/3d/CosmicStarfield';
import MyApproach from './components/ui/MyApproach';
import EditorialIntro from './components/ui/EditorialIntro';
import HistoryJourney from './components/ui/HistoryJourney';
import AboutPage from './components/ui/AboutPage';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Kurasi data proyek dengan estetika standar Awwwards
const CURATED_PROJECTS = [
  {
    id: 0,
    title: "Tomorrowland x Tennis",
    category: "SPATIAL WEB & AUDIO",
    year: "2026",
    image: "https://picsum.photos/seed/tennis9/600/800",
    description: "Pengalaman 3D interaktif berskala global yang menggabungkan visual generative audio dengan eksplorasi ruang WebGL real-time.",
    link: "https://awwwards.com",
    textSide: "left"
  },
  {
    id: 1,
    title: "Manchester United VR",
    category: "CREATIVE ENGINEERING",
    year: "2025",
    image: "https://picsum.photos/seed/manutd4/600/800",
    description: "Platform digital stadion interaktif berbasis WebGL dengan simulasi pencahayaan fisik dan animasi kinetik dinamis.",
    link: "https://awwwards.com",
    textSide: "right"
  },
  {
    id: 2,
    title: "Skechers Football",
    category: "3D COMMERCE & CAMPAIGN",
    year: "2025",
    image: "https://picsum.photos/seed/skech8/600/800",
    description: "Eksplorasi visual 3D produk sepatu sepakbola dengan shader material kustom dan interaksi sentuh presisi tinggi.",
    link: "https://awwwards.com",
    textSide: "left"
  },
  {
    id: 3,
    title: "Tolu Arokodare",
    category: "EDITORIAL IDENTITY",
    year: "2025",
    image: "https://picsum.photos/seed/tolu2/600/800",
    description: "Portofolio editorial atletik dengan tipografi eksperimental, transisi viewport mulus, dan palet monokrom ultra-modern.",
    link: "https://awwwards.com",
    textSide: "right"
  },
  {
    id: 4,
    title: "Legia Warsaw Arena",
    category: "ATMOSPHERIC WEB",
    year: "2024",
    image: "https://picsum.photos/seed/legia6/600/800",
    description: "Pengalaman suporter digital dengan atmosfer flare pyro dinamis, efek partikel Three.js, dan arsitektur kode mutakhir.",
    link: "https://awwwards.com",
    textSide: "left"
  },
  {
    id: 5,
    title: "Aethelgard Spatial",
    category: "WEBGL ARCHITECTURE",
    year: "2024",
    image: "https://picsum.photos/seed/aethel11/600/800",
    description: "Instalasi arsitektur digital dengan sistem pencahayaan volumetrik dan topologi geometri responsif terhadap kursor.",
    link: "https://awwwards.com",
    textSide: "right"
  },
  {
    id: 6,
    title: "Chronos AI System",
    category: "DESIGN SYSTEM & TOOLS",
    year: "2024",
    image: "https://picsum.photos/seed/chronos5/600/800",
    description: "Antarmuka kecerdasan buatan masa depan dengan feedback visual haptik dan micro-interaksi fluid berkecepatan 60 FPS.",
    link: "https://awwwards.com",
    textSide: "left"
  },
  {
    id: 7,
    title: "Monolith Sound Lab",
    category: "INTERACTIVE AUDIO",
    year: "2024",
    image: "https://picsum.photos/seed/sound3/600/800",
    description: "Sintesis suara browser real-time yang merespons gerak kursor dan gelombang frekuensi kinetik dinamis.",
    link: "https://awwwards.com",
    textSide: "right"
  },
  {
    id: 8,
    title: "Verve Kinetic Type",
    category: "EXPERIMENTAL TYPOGRAPHY",
    year: "2024",
    image: "https://picsum.photos/seed/type17/600/800",
    description: "Eksplorasi tipografi variabel dengan deformasi mesh dinamis pada interaksi scroll dan pointer fisik.",
    link: "https://awwwards.com",
    textSide: "left"
  },
  {
    id: 9,
    title: "Lumina Studio Lab",
    category: "BRAND EXPERIENCE",
    year: "2024",
    image: "https://picsum.photos/seed/lumina14/600/800",
    description: "Identitas digital agensi kreatif dengan kurasi galeri interaktif 3D dan transisi halaman tanpa henti.",
    link: "https://awwwards.com",
    textSide: "right"
  },
  {
    id: 10,
    title: "Solstice Horizon",
    category: "NARRATIVE 3D SCENE",
    year: "2023",
    image: "https://picsum.photos/seed/solstice22/600/800",
    description: "Perjalanan naratif interaktif dengan pergantian siklus siang-malam berbasis shader kustom WebGL.",
    link: "https://awwwards.com",
    textSide: "left"
  },
  {
    id: 11,
    title: "Apex Hyperdrive",
    category: "PRODUCT REVEAL",
    year: "2023",
    image: "https://picsum.photos/seed/apex29/600/800",
    description: "Visualisasi 3D konsep supercar dengan x-ray blueprint mode dan ledakan partikel suku cadang real-time.",
    link: "https://awwwards.com",
    textSide: "right"
  }
];

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'about'
  const [projects] = useState(CURATED_PROJECTS);

  const [hoveredProject, setHoveredProject] = useState(null);
  const [clickedProject, setClickedProject] = useState(null);
  const activeProject = clickedProject || hoveredProject;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isUiHovered, setIsUiHovered] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [socials, setSocials] = useState({
    github: "GITHUB",
    tiktok: "TIKTOK",
    instagram: "INSTAGRAM",
    linkedin: "LINKEDIN"
  });

  // Navigasi halaman dan scroll ke atas secara instan
  const navigateTo = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    const updateMouse = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    if (!isTouchDevice) {
      window.addEventListener("mousemove", updateMouse);
    }

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", updateMouse);
    };
  }, [isTouchDevice]);

  // Inisialisasi Lenis Smooth Scroll dan GSAP ScrollTrigger (Hanya aktif di Home)
  useEffect(() => {
    if (currentView !== 'home') return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const reqId = requestAnimationFrame(raf);

    let mm = gsap.matchMedia();
    const heroScrollConfig = {
      trigger: "#main-scroll-track",
      start: "top top",
      end: "450px top",
      scrub: 1.2
    };

    mm.add("(min-width: 768px)", () => {
      // Efek parallax dan dissolve cinematic saat scroll dari hero ke pegas
      gsap.to('.hero-content-wrapper', {
        y: -140,
        scale: 0.94,
        opacity: 0,
        filter: 'blur(10px)',
        scrollTrigger: heroScrollConfig
      });
      gsap.to('.hero-bg-text-container', {
        scale: 1.12,
        y: -60,
        opacity: 0,
        filter: 'blur(16px)',
        scrollTrigger: heroScrollConfig
      });

      // Animasi media sosial di sudut bawah
      gsap.to('.soc-li', { y: -25, x: 130, scrollTrigger: heroScrollConfig });
      gsap.to('.soc-ig', { y: -25, x: -140, scrollTrigger: heroScrollConfig });

      // Animasi saat masuk dari Session 2 ke 3 (My Approach): social links menghilang halus
      gsap.to('.soc-gh, .soc-li, .soc-tk, .soc-ig', {
        y: 35,
        opacity: 0,
        filter: 'blur(8px)',
        pointerEvents: 'none',
        scrollTrigger: {
          trigger: '#section-approach',
          start: 'top 85%',
          end: 'top 45%',
          scrub: true
        }
      });
    });

    mm.add("(max-width: 767px)", () => {
      gsap.to('.hero-content-wrapper', {
        y: -60,
        opacity: 0,
        filter: 'blur(8px)',
        scrollTrigger: heroScrollConfig
      });
      gsap.to('.hero-bg-text-container', {
        opacity: 0,
        scrollTrigger: heroScrollConfig
      });
      gsap.to('.soc-li, .soc-ig, .soc-gh, .soc-tk', {
        opacity: 0,
        scrollTrigger: heroScrollConfig
      });
    });

    return () => {
      cancelAnimationFrame(reqId);
      lenis.destroy();
      mm.revert();
    };
  }, [currentView]);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 20,
      width: 20,
      backgroundColor: "transparent",
      border: "1.5px solid rgba(255, 255, 255, 0.8)",
      mixBlendMode: "difference",
      transition: { type: "tween", ease: "backOut", duration: 0.1 }
    },
    hover: {
      x: mousePosition.x - 38,
      y: mousePosition.y - 38,
      height: 76,
      width: 76,
      backgroundColor: "white",
      border: "none",
      mixBlendMode: "difference",
      transition: { type: "spring", stiffness: 350, damping: 22 }
    }
  };

  const onHover = () => !isTouchDevice && setIsUiHovered(true);
  const onLeave = () => !isTouchDevice && setIsUiHovered(false);

  // Render huruf individual untuk efek pegas dan terangkat per karakter saat hover
  const renderInteractiveChars = (text) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="hero-char"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        style={{
          whiteSpace: char === " " ? "pre" : "normal"
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div style={{ width: '100vw', backgroundColor: '#050505', color: 'white', position: 'relative', cursor: isTouchDevice ? 'auto' : 'none', overflowX: 'hidden' }}>
      {/* Noise filter dan Vignette overlay ala Awwwards */}
      <div className="noise-overlay" />
      <div className="vignette-overlay" />

      {/* Crosshair arsitektural di keempat sudut layar */}
      <div className="corner-crosshair" style={{ top: 16, left: 16 }} />
      <div className="corner-crosshair" style={{ top: 16, right: 16 }} />
      <div className="corner-crosshair" style={{ bottom: 16, left: 16 }} />
      <div className="corner-crosshair" style={{ bottom: 16, right: 16 }} />

      {/* Preloader */}
      {!loadingComplete && <Preloader onComplete={() => setLoadingComplete(true)} />}

      {/* Custom Magnetic Cursor */}
      {!isTouchDevice && (
        <motion.div
          variants={cursorVariants}
          animate={isUiHovered || activeProject ? "hover" : "default"}
          style={{ position: 'fixed', top: 0, left: 0, borderRadius: '50%', pointerEvents: 'none', zIndex: 9999 }}
        />
      )}

      {/* Header / Navigasi Bersih & Rapi Standar Awwwards */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: isMobile ? '1.2rem 1.5rem' : '2rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        zIndex: 100,
        mixBlendMode: 'difference'
      }}>
        {/* Logo Bersih */}
        <div
          onClick={() => navigateTo('home')}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            pointerEvents: 'auto',
            cursor: 'pointer'
          }}
        >
          LEANN.
        </div>

        {/* Menu Nav Links: Rapi & Minimalis */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '1.4rem' : '3.2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: isMobile ? '0.75rem' : '0.86rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          pointerEvents: 'auto'
        }}>
          <span
            className="nav-link"
            onClick={() => navigateTo('home')}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              color: currentView === 'home' ? '#ffffff' : 'rgba(255,255,255,0.6)',
              borderBottom: currentView === 'home' ? '2px solid #ffffff' : 'none',
              paddingBottom: '2px'
            }}
          >
            Works
          </span>
          <span
            className="nav-link"
            onClick={() => {
              if (currentView !== 'home') {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('section-approach')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              } else {
                document.getElementById('section-approach')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
              paddingBottom: '2px'
            }}
          >
            Approach
          </span>
          <span
            className="nav-link"
            onClick={() => {
              if (currentView !== 'home') {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('section-editorial')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              } else {
                document.getElementById('section-editorial')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
              paddingBottom: '2px'
            }}
          >
            Statement
          </span>
          <span
            className="nav-link"
            onClick={() => {
              if (currentView !== 'home') {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('section-history')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              } else {
                document.getElementById('section-history')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
              paddingBottom: '2px'
            }}
          >
            History
          </span>
          <span
            className="nav-link"
            onClick={() => navigateTo('about')}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              color: currentView === 'about' ? '#ffffff' : 'rgba(255,255,255,0.6)',
              borderBottom: currentView === 'about' ? '2px solid #ffffff' : 'none',
              paddingBottom: '2px'
            }}
          >
            About
          </span>
          <a
            href="mailto:contact@billean.dev"
            className="nav-link"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.6)'
            }}
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Social Links di Sudut Bawah */}
      <div style={{
        position: 'fixed',
        bottom: isMobile ? '1.2rem' : '2rem',
        left: isMobile ? '1.5rem' : '4rem',
        right: isMobile ? '1.5rem' : '4rem',
        height: '45px',
        zIndex: 100,
        pointerEvents: 'none',
        mixBlendMode: 'difference',
        fontFamily: 'var(--font-mono)',
        fontSize: isMobile ? '0.7rem' : '0.82rem',
        fontWeight: '600',
        letterSpacing: '2px'
      }}>
        <span
          className="soc-gh"
          onMouseEnter={() => { onHover(); setSocials((p) => ({ ...p, github: "@BILLEAN" })); }}
          onMouseLeave={() => { onLeave(); setSocials((p) => ({ ...p, github: "GITHUB" })); }}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', cursor: 'pointer' }}
        >
          {socials.github}
        </span>
        <span
          className="soc-li"
          onMouseEnter={() => { onHover(); setSocials((p) => ({ ...p, linkedin: "CONNECT ↗" })); }}
          onMouseLeave={() => { onLeave(); setSocials((p) => ({ ...p, linkedin: "LINKEDIN" })); }}
          style={{ position: 'absolute', top: '22px', left: 0, pointerEvents: 'auto', cursor: 'pointer' }}
        >
          {socials.linkedin}
        </span>
        <span
          className="soc-tk"
          onMouseEnter={() => { onHover(); setSocials((p) => ({ ...p, tiktok: "@LEANN_DEV" })); }}
          onMouseLeave={() => { onLeave(); setSocials((p) => ({ ...p, tiktok: "TIKTOK" })); }}
          style={{ position: 'absolute', top: 0, right: 0, pointerEvents: 'auto', cursor: 'pointer' }}
        >
          {socials.tiktok}
        </span>
        <span
          className="soc-ig"
          onMouseEnter={() => { onHover(); setSocials((p) => ({ ...p, instagram: "@BILLEAN.UP" })); }}
          onMouseLeave={() => { onLeave(); setSocials((p) => ({ ...p, instagram: "INSTAGRAM" })); }}
          style={{ position: 'absolute', top: '22px', right: 0, pointerEvents: 'auto', cursor: 'pointer' }}
        >
          {socials.instagram}
        </span>
      </div>

      {/* KONDISIONAL VIEW: HALAMAN KHUSUS ABOUT vs HALAMAN HOME (HERO & 3D PEGAS) */}
      <AnimatePresence mode="wait">
        {currentView === 'about' ? (
          <AboutPage
            key="about-view"
            onBackToHome={() => navigateTo('home')}
            isMobile={isMobile}
            onHover={onHover}
            onLeave={onLeave}
          />
        ) : (
          <div key="home-view">
            {/* 3D Canvas: Bintang Kosmik di Latar Belakang, Orbit Melingkar di Hero & Pegas 3D di Section 2 */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
              <Canvas onPointerMissed={() => setClickedProject(null)}>
                <ambientLight intensity={1.8} />
                <CosmicStarfield isLoaded={loadingComplete} />
                {projects.length > 0 && (
                  <HeroHelix
                    projects={projects}
                    isLoaded={loadingComplete}
                    activeProject={activeProject}
                    setHoveredProject={setHoveredProject}
                    clickedProject={clickedProject}
                    setClickedProject={setClickedProject}
                  />
                )}
              </Canvas>
            </div>

            {/* Background Kinetic Typography (Atmosfer Tipografi Editorial yang Lembut) */}
            <div
              className="hero-bg-text-container"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100vw',
                pointerEvents: 'none',
                zIndex: 0,
                textAlign: 'center',
                opacity: loadingComplete ? 0.35 : 0,
                transition: 'opacity 2s ease'
              }}
            >
              <div
                className="bg-kinetic-text"
                style={{
                  fontSize: isMobile ? '13.5vw' : '8.6vw'
                }}
              >
                <div>WORK</div>
                <div>THAT SPEAKS</div>
                <div>LOUDER THAN</div>
                <div>WORDS</div>
              </div>
            </div>



            {/* Main Scroll Track: Section 1 (Hero) -> Section 2 (Pegas Helix 3D) */}
            <div id="main-scroll-track" style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
              {/* SECTION 1: HERO SECTION — BERSIH, RAPI, FOKUS PADA NAMA TANPA BERTABRAKAN DENGAN KARTU */}
              <section
                style={{
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 50,
                  opacity: loadingComplete ? 1 : 0,
                  transition: 'opacity 1.5s ease',
                  paddingTop: isMobile ? '16vh' : '13vh',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  boxSizing: 'border-box'
                }}
              >


                {/* Central Name & Interactive Per-Letter Physics */}
                <div
                  className="hero-content-wrapper"
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  {/* Baris 1: Billean */}
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isMobile ? 'clamp(3rem, 13vw, 4.4rem)' : 'clamp(4.8rem, 8vw, 8.4rem)',
                      fontWeight: '800',
                      lineHeight: '0.92',
                      letterSpacing: '-0.035em',
                      color: '#ffffff',
                      textShadow: '0 4px 30px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 255, 255, 0.15)',
                      textTransform: 'none'
                    }}
                  >
                    {renderInteractiveChars("BILLEAN")}
                  </div>

                  {/* Baris 2: Uji Prakasa */}
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isMobile ? 'clamp(2.4rem, 10.5vw, 3.6rem)' : 'clamp(4.0rem, 6.8vw, 7.2rem)',
                      fontWeight: '800',
                      lineHeight: '0.95',
                      letterSpacing: '-0.035em',
                      color: 'rgba(255, 255, 255, 0.94)',
                      textShadow: '0 4px 30px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 255, 255, 0.12)',
                      textTransform: 'none',
                      marginTop: isMobile ? '4px' : '8px'
                    }}
                  >
                    {renderInteractiveChars("UJI PRAKASA")}
                  </div>
                </div>

                {/* Bottom Hero Cue: Indikator Scroll Minimalis & Rapi */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: isMobile ? '3.5rem' : '3.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: isMobile ? '0.62rem' : '0.72rem',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.55)',
                    pointerEvents: 'none'
                  }}
                >
                  <span>SCROLL TO EXPLORE</span>
                  <div className="scroll-indicator-line" />
                </div>
              </section>

              {/* SECTION 2: TRACK SPESIFIK UNTUK EKSPLORASI PEGAS HELIX 3D */}
              <section style={{ height: `${projects.length * 60}vh`, position: 'relative' }}>
                <div
                  style={{
                    position: 'sticky',
                    top: '45%',
                    left: isMobile ? '1.5rem' : '4rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '4px',
                    color: 'rgba(255, 255, 255, 0.25)',
                    textTransform: 'uppercase',
                    pointerEvents: 'none',
                    mixBlendMode: 'difference'
                  }}
                >
                  [ SECTION 02 — THE 3D SPRING ARCHIVE ]
                </div>

                {/* Transition Indicator Menuju Section 3 */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8vh',
                    left: 0,
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: isMobile ? '0.62rem' : '0.74rem',
                    letterSpacing: '3px',
                    color: 'rgba(255, 255, 255, 0.35)',
                    textTransform: 'uppercase',
                    pointerEvents: 'none'
                  }}
                >
                  <span>[ 03 / MY APPROACH ↓ ]</span>
                </div>
              </section>
            </div>

            {/* SECTION 3: 03 / MY APPROACH — EDITORIAL 4-CARD PAPER SHEET */}
            <MyApproach
              isMobile={isMobile}
              onHover={onHover}
              onLeave={onLeave}
            />

            {/* SECTION 4: EDITORIAL SCROLL REVEAL (BLACK & WHITE STATEMENT) */}
            <EditorialIntro
              isMobile={isMobile}
              onHover={onHover}
              onLeave={onLeave}
            />

            {/* SECTION 5: TIMELINE & CAREER TRAJECTORY (AUTO-FOLLOWING CAMERA PATH) */}
            <HistoryJourney
              isMobile={isMobile}
              onHover={onHover}
              onLeave={onLeave}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Active Project Modal / Case Study Drawer */}
      <AnimatePresence>
        {activeProject && currentView === 'home' && (
          <motion.div
            initial={{
              opacity: 0,
              x: isMobile ? '-50%' : (activeProject.textSide === 'left' ? -40 : 40),
              y: isMobile ? 40 : '-50%'
            }}
            animate={{
              opacity: 1,
              x: isMobile ? '-50%' : 0,
              y: isMobile ? 0 : '-50%'
            }}
            exit={{
              opacity: 0,
              x: isMobile ? '-50%' : (activeProject.textSide === 'left' ? -40 : 40),
              y: isMobile ? 40 : '-50%'
            }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: 'fixed',
              top: isMobile ? 'auto' : '44%',
              bottom: isMobile ? '8%' : 'auto',
              transform: isMobile ? 'none' : 'translateY(-50%)',
              left: isMobile ? '50%' : (activeProject.textSide === 'left' ? '6%' : 'auto'),
              right: isMobile ? 'auto' : (activeProject.textSide === 'right' ? '6%' : 'auto'),
              width: isMobile ? '92vw' : '400px',
              maxWidth: 'calc(100vw - 24px)',
              padding: '28px',
              boxSizing: 'border-box',
              maxHeight: '70svh',
              overflowY: 'auto',
              zIndex: 150,
              pointerEvents: 'auto',
              color: 'white',
              backgroundColor: 'rgba(10, 10, 10, 0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              textAlign: 'left'
            }}
          >
            {/* Meta Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '2px',
                color: '#ffffff',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {activeProject.category}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '1px',
                color: 'rgba(255,255,255,0.5)'
              }}>
                {activeProject.year}
              </span>
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? '1.8rem' : '2.4rem',
              fontWeight: '900',
              margin: '0',
              textTransform: 'none',
              lineHeight: '1.08',
              letterSpacing: '-0.02em',
              color: '#ffffff'
            }}>
              {activeProject.title}
            </h3>

            {/* Hairline Divider */}
            <div style={{ height: '1px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

            {/* Description */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.92rem',
              margin: 0,
              opacity: 0.85,
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              {activeProject.description}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {activeProject.link && (
                <a
                  href={activeProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ffffff',
                    color: '#050505',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                    fontSize: '0.78rem',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    borderRadius: '30px',
                    pointerEvents: 'auto',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Explore Case</span>
                  <span>↗</span>
                </a>
              )}
              {clickedProject && (
                <button
                  onClick={() => setClickedProject(null)}
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '30px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Close
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}