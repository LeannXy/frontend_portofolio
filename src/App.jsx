import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Preloader from './components/ui/Preloader';
import MyApproach from './components/ui/MyApproach';
import EditorialIntro from './components/ui/EditorialIntro';
import HistoryJourney from './components/ui/HistoryJourney';
import AboutPage from './components/ui/AboutPage';
import ProjectDetailPage from './components/ui/ProjectDetailPage';
import { INITIAL_PROJECTS } from '../shared/initialProjects.js';
import { apiAssetUrl, apiUrl, normalizeProjects } from './lib/portfolioApi.js';
import { DEFAULT_SITE_CONTENT, normalizeSiteContent } from './lib/siteContent.js';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const HomeScene = lazy(() => import('./components/3d/HomeScene'));
const AdminDashboard = lazy(() => import('./components/ui/AdminDashboard'));

function getInitialView() {
  const path = window.location.pathname;
  if (path === '/admin') return 'admin';
  if (/^\/portfolio\/[^/]+$/.test(path)) return 'project-detail';
  return 'home';
}

function getProjectIdFromPath() {
  const match = window.location.pathname.match(/^\/portfolio\/([^/]+)$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentView, setCurrentView] = useState(getInitialView);
  const [pageIntro, setPageIntro] = useState(null);
  const pageIntroTimerRef = useRef(null);
  const pageIntroSequenceRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();
  const lenisRef = useRef(null);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [detailProjectId, setDetailProjectId] = useState(getProjectIdFromPath);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);
  const [projectApiError, setProjectApiError] = useState('');
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);

  const showPageIntro = useCallback((view) => {
    const labels = {
      home: 'WORKS',
      about: 'ABOUT',
      admin: 'ADMIN',
      'project-detail': 'PROJECT'
    };
    if (pageIntroTimerRef.current) clearTimeout(pageIntroTimerRef.current);
    pageIntroSequenceRef.current += 1;
    setPageIntro({ id: pageIntroSequenceRef.current, label: labels[view] || 'PORTFOLIO' });
    pageIntroTimerRef.current = setTimeout(() => {
      setPageIntro(null);
      pageIntroTimerRef.current = null;
    }, shouldReduceMotion ? 80 : 360);
  }, [shouldReduceMotion]);

  const [hoveredProject, setHoveredProject] = useState(null);
  const [clickedProject, setClickedProject] = useState(null);
  const activeProject = clickedProject || hoveredProject;
  const projectHoverTimeoutRef = useRef(null);

  const handleProjectPointerOver = useCallback((project) => {
    if (projectHoverTimeoutRef.current) {
      clearTimeout(projectHoverTimeoutRef.current);
      projectHoverTimeoutRef.current = null;
    }
    setHoveredProject(project);
  }, []);

  const handleProjectPointerOut = useCallback(() => {
    if (projectHoverTimeoutRef.current) clearTimeout(projectHoverTimeoutRef.current);
    projectHoverTimeoutRef.current = setTimeout(() => {
      setHoveredProject(null);
      projectHoverTimeoutRef.current = null;
    }, 400);
  }, []);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isUiHovered, setIsUiHovered] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMainTrackVisible, setIsMainTrackVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('works');
  const [scrollProgress, setScrollProgress] = useState(0);

  const [socials, setSocials] = useState({
    github: "GITHUB",
    tiktok: "TIKTOK",
    instagram: "INSTAGRAM",
    linkedin: "LINKEDIN"
  });
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SITE_CONTENT.socials);

  const scrollToPosition = (target, sectionName) => {
    if (sectionName) setActiveSection(sectionName);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.25, force: true });
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  const navigateToSection = (sectionId, sectionName) => {
    const moveToSection = (attempt = 0) => {
      let target;
      if (sectionId === 'section-history' || sectionId === 'section-contact') {
        const historySection = document.getElementById('section-history');
        const pinSpacer = historySection?.parentElement;
        if (pinSpacer?.classList.contains('pin-spacer')) {
          const start = pinSpacer.getBoundingClientRect().top + window.scrollY;
          const scrollDuration = pinSpacer.offsetHeight - window.innerHeight;
          const progress = sectionId === 'section-contact' ? 0.97 : 0;
          target = start + scrollDuration * progress;
        }
      } else {
        const section = document.getElementById(sectionId);
        if (section) target = section.getBoundingClientRect().top + window.scrollY - 72;
      }

      if (target === undefined) {
        if (attempt < 60) requestAnimationFrame(() => moveToSection(attempt + 1));
        return;
      }
      scrollToPosition(target, sectionName);
    };

    if (currentView !== 'home') {
      if (window.location.pathname !== '/') window.history.pushState({}, '', '/');
      showPageIntro('home');
      setCurrentView('home');
      requestAnimationFrame(() => requestAnimationFrame(() => moveToSection()));
      return;
    }
    moveToSection();
  };

  const navigateTo = (view) => {
    if (view === 'home') {
      if (currentView !== 'home') {
        if (window.location.pathname !== '/') window.history.pushState({}, '', '/');
        showPageIntro('home');
        setDetailProjectId(null);
        setSelectedProjectDetail(null);
        setClickedProject(null);
        setCurrentView('home');
        requestAnimationFrame(() => requestAnimationFrame(() => scrollToPosition(0, 'works')));
      } else {
        scrollToPosition(0, 'works');
      }
      return;
    }
    if (currentView !== view) showPageIntro(view);
    const nextPath = view === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToProject = (project) => {
    const projectId = String(project.id ?? project.ID);
    showPageIntro('project-detail');
    window.history.pushState({}, '', `/portfolio/${encodeURIComponent(projectId)}`);
    setDetailProjectId(projectId);
    setSelectedProjectDetail(project);
    setClickedProject(null);
    setCurrentView('project-detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const refreshProjects = async () => {
    try {
      const response = await fetch(apiUrl('/api/projects'));
      if (!response.ok) throw new Error('Tidak dapat memuat daftar proyek dari backend.');
      setProjects(normalizeProjects(await response.json()));
      setProjectsLoaded(true);
      setProjectApiError('');
    } catch (error) {
      setProjectsLoaded(true);
      setProjectApiError(error.message);
      throw error;
    }
  };

  const refreshSiteContent = async () => {
    const response = await fetch(apiUrl('/api/content'));
    if (!response.ok) throw new Error('Tidak dapat memuat konten situs dari backend.');
    const saved = await response.json();
    const content = normalizeSiteContent(saved);
    setSiteContent(content);
    setSocialLinks(content.socials);
    setSocials(Object.fromEntries(Object.entries(content.socials).map(([key, social]) => [key, social.label])));
  };

  const navigateToContact = () => {
    navigateToSection('section-contact', 'contact');
  };

  const handleContactActive = useCallback((isActive) => {
    setActiveSection(isActive ? 'contact' : 'history');
  }, []);

  useEffect(() => {
    return () => {
      if (projectHoverTimeoutRef.current) clearTimeout(projectHoverTimeoutRef.current);
      if (pageIntroTimerRef.current) clearTimeout(pageIntroTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextView = getInitialView();
      showPageIntro(nextView);
      setDetailProjectId(getProjectIdFromPath());
      setSelectedProjectDetail(null);
      setCurrentView(nextView);
      if (nextView === 'home') setActiveSection('works');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showPageIntro]);

  useEffect(() => {
    refreshProjects().catch((error) => {
      console.error('Portfolio API could not be loaded:', error);
    });
    refreshSiteContent().catch((error) => {
      console.error('Portfolio content API could not be loaded:', error);
    });
  }, []);

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

    const mainTrack = document.getElementById('main-scroll-track');
    if (!mainTrack) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsMainTrackVisible(entry.isIntersecting);
    });
    observer.observe(mainTrack);

    return () => observer.disconnect();
  }, [currentView]);

  useEffect(() => {
    if (currentView !== 'home') return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#section-approach',
        start: 'top center',
        onEnter: () => setActiveSection('approach'),
        onEnterBack: () => setActiveSection('approach'),
        onLeaveBack: () => setActiveSection('works')
      });
      ScrollTrigger.create({
        trigger: '#section-editorial',
        start: 'top center',
        onEnter: () => setActiveSection('statement'),
        onEnterBack: () => setActiveSection('statement'),
        onLeaveBack: () => setActiveSection('approach')
      });
      ScrollTrigger.create({
        trigger: '#section-history',
        start: 'top center',
        onEnter: () => setActiveSection('history'),
        onEnterBack: () => setActiveSection('history'),
        onLeaveBack: () => setActiveSection('statement')
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [currentView]);

  useEffect(() => {
    if (!['about', 'admin'].includes(currentView)) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [currentView]);

  useEffect(() => {
    const aboutScroller = currentView === 'about'
      ? document.querySelector('.about-page-shell')
      : null;
    const scrollContainer = aboutScroller ?? document.scrollingElement;
    const lenis = currentView === 'home' ? lenisRef.current : null;
    let frameId = 0;

    const updateScrollProgress = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        if (!scrollContainer) return;

        const maxScroll = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
        const scrollTop = scrollContainer.scrollTop;
        const nextProgress = maxScroll > 0
          ? Math.round(Math.min(1, Math.max(0, scrollTop / maxScroll)) * 1000) / 10
          : 0;

        setScrollProgress((current) => current === nextProgress ? current : nextProgress);
      });
    };

    const resizeObserver = new ResizeObserver(updateScrollProgress);
    resizeObserver.observe(document.body);
    if (aboutScroller) resizeObserver.observe(aboutScroller);
    const mainTrack = document.getElementById('main-scroll-track');
    if (mainTrack) resizeObserver.observe(mainTrack);

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    aboutScroller?.addEventListener('scroll', updateScrollProgress, { passive: true });
    lenis?.on('scroll', updateScrollProgress);
    ScrollTrigger.addEventListener('refresh', updateScrollProgress);
    updateScrollProgress();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
      aboutScroller?.removeEventListener('scroll', updateScrollProgress);
      lenis?.off('scroll', updateScrollProgress);
      ScrollTrigger.removeEventListener('refresh', updateScrollProgress);
    };
  }, [currentView]);

  // Inisialisasi Lenis Smooth Scroll dan GSAP ScrollTrigger (Hanya aktif di Home)
  useEffect(() => {
    if (currentView !== 'home') return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    let reqId;
    function raf(time) {
      lenis.raf(time);
      reqId = requestAnimationFrame(raf);
    }
    reqId = requestAnimationFrame(raf);

    let mm = gsap.matchMedia();
    const heroScrollConfig = {
      trigger: "#section-project-gallery",
      start: "top top",
      end: () => {
        const gallery = document.getElementById('section-project-gallery');
        const transitionDistance = gallery
          ? (gallery.offsetHeight - window.innerHeight) * 0.14
          : window.innerHeight;
        return `+=${Math.max(1, transitionDistance)}`;
      },
      scrub: 0.7
    };

    mm.add("(min-width: 768px)", () => {
      // Efek parallax dan dissolve cinematic saat scroll dari hero ke pegas
      gsap.to('.hero-content-wrapper', {
        y: -140,
        scale: 0.94,
        opacity: 0,
        scrollTrigger: heroScrollConfig
      });
      gsap.to('.hero-bg-text-container', {
        scale: 1.12,
        y: -60,
        opacity: 0,
        scrollTrigger: heroScrollConfig
      });

      // Animasi media sosial di sudut bawah
      gsap.to('.soc-li', { y: -25, x: 130, scrollTrigger: heroScrollConfig });
      gsap.to('.soc-ig', { y: -25, x: -140, scrollTrigger: heroScrollConfig });

      // Animasi saat masuk dari Session 2 ke 3 (My Approach): social links menghilang halus
      gsap.to('.soc-gh, .soc-li, .soc-tk, .soc-ig', {
        y: 35,
        opacity: 0,
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
      if (lenisRef.current === lenis) lenisRef.current = null;
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
  const renderInteractiveChars = (text, lineIndex = 0) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="hero-char"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        style={{
          whiteSpace: char === " " ? "pre" : "normal",
          '--hero-enter-delay': `${lineIndex * 180 + index * 45}ms`,
          '--hero-enter-x': (index + lineIndex) % 2 === 0 ? '-120vw' : '120vw',
          '--hero-enter-y': index % 3 === 0 ? '-120vh' : '120vh',
          '--hero-enter-rotate': (index + lineIndex) % 2 === 0 ? '-35deg' : '35deg'
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div className={loadingComplete ? 'app-shell app-loaded' : 'app-shell'} style={{ width: '100vw', backgroundColor: '#050505', color: 'white', position: 'relative', cursor: isTouchDevice ? 'auto' : 'none', overflowX: 'hidden' }}>
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
      <nav className="site-nav" style={{
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
          className="site-nav-logo"
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
        <div className="site-nav-links" style={{
          display: 'flex',
          gap: isMobile ? '1rem' : '2rem',
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
              color: currentView === 'home' && activeSection === 'works' ? '#ffffff' : 'rgba(255,255,255,0.6)',
              borderBottom: currentView === 'home' && activeSection === 'works' ? '2px solid #ffffff' : 'none',
              paddingBottom: '2px'
            }}
          >
            Works
          </span>
          <span
            className="nav-link"
            onClick={() => navigateToSection('section-approach', 'approach')}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              color: currentView === 'home' && activeSection === 'approach' ? '#ffffff' : 'rgba(255,255,255,0.6)',
              borderBottom: currentView === 'home' && activeSection === 'approach' ? '2px solid #ffffff' : 'none',
              paddingBottom: '2px'
            }}
          >
            Approach
          </span>
          <span
            className="nav-link"
            onClick={() => navigateToSection('section-editorial', 'statement')}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              color: currentView === 'home' && activeSection === 'statement' ? '#ffffff' : 'rgba(255,255,255,0.6)',
              borderBottom: currentView === 'home' && activeSection === 'statement' ? '2px solid #ffffff' : 'none',
              paddingBottom: '2px'
            }}
          >
            Statement
          </span>
          <span
            className="nav-link"
            onClick={() => navigateToSection('section-history', 'history')}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              color: currentView === 'home' && activeSection === 'history' ? '#ffffff' : 'rgba(255,255,255,0.6)',
              borderBottom: currentView === 'home' && activeSection === 'history' ? '2px solid #ffffff' : 'none',
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
            href="#section-contact"
            className="nav-link"
            onClick={(event) => {
              event.preventDefault();
              navigateToContact();
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              cursor: 'pointer',
              textDecoration: 'none',
              color: currentView === 'home' && activeSection === 'contact' ? '#ffffff' : 'rgba(255,255,255,0.6)',
              borderBottom: currentView === 'home' && activeSection === 'contact' ? '2px solid #ffffff' : 'none',
              paddingBottom: '2px'
            }}
          >
            Contact
          </a>
        </div>
      </nav>

      {loadingComplete && currentView !== 'admin' && (
        <button
          className="scroll-progress-indicator"
          type="button"
          aria-label={`Halaman sudah digulir ${scrollProgress.toFixed(1)} persen. Kembali ke atas`}
          onClick={() => {
            if (currentView === 'about') {
              document.querySelector('.about-page-shell')?.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }
            scrollToPosition(0, 'works');
          }}
        >
          <span className="scroll-progress-label" aria-hidden="true">SCROLL</span>
          <span
            className="scroll-progress-track"
            role="progressbar"
            aria-label="Progres gulir halaman"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={scrollProgress}
          >
            <span
              className="scroll-progress-fill"
              style={{ transform: `scaleY(${scrollProgress / 100})` }}
            />
            <span
              className="scroll-progress-marker"
              style={{ top: `${scrollProgress}%` }}
            />
          </span>
          <span className="scroll-progress-value" aria-hidden="true">
            {scrollProgress.toFixed(1)}<small>%</small>
          </span>
          <span className="scroll-progress-top" aria-hidden="true">↑</span>
        </button>
      )}

      {projectApiError && currentView === 'home' && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: isMobile ? '4.8rem' : '6rem',
            right: isMobile ? '1rem' : '2rem',
            zIndex: 200,
            maxWidth: 'min(420px, calc(100vw - 2rem))',
            padding: '10px 14px',
            color: '#ffd0a1',
            background: 'rgba(55, 30, 10, 0.92)',
            border: '1px solid rgba(255, 190, 120, 0.35)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem'
          }}
        >
          Backend tidak tersambung. Proyek yang ditampilkan adalah data awal dan perubahan admin tidak dapat disimpan.
        </div>
      )}

      {/* Social Links di Sudut Bawah */}
      <div className="home-social-links" style={{
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
        <a
          href={socialLinks.github.url || undefined}
          target={socialLinks.github.url ? '_blank' : undefined}
          rel={socialLinks.github.url ? 'noreferrer' : undefined}
          className="soc-gh"
          onMouseEnter={() => { onHover(); setSocials((p) => ({ ...p, github: socialLinks.github.hoverLabel })); }}
          onMouseLeave={() => { onLeave(); setSocials((p) => ({ ...p, github: socialLinks.github.label })); }}
          onClick={(event) => { if (!socialLinks.github.url) event.preventDefault(); }}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
        >
          {socials.github}
        </a>
        <a
        href={socialLinks.linkedin.url || undefined}
        target={socialLinks.linkedin.url ? '_blank' : undefined}
        rel={socialLinks.linkedin.url ? 'noreferrer' : undefined}
        className="soc-li"
        onMouseEnter={() => { onHover(); setSocials((p) => ({ ...p, linkedin: socialLinks.linkedin.hoverLabel })); }}
        onMouseLeave={() => { onLeave(); setSocials((p) => ({ ...p, linkedin: socialLinks.linkedin.label })); }}
        onClick={(event) => { if (!socialLinks.linkedin.url) event.preventDefault(); }}
        style={{ position: 'absolute', top: '22px', left: 0, pointerEvents: 'auto', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
        >
        {socials.linkedin}
        </a>
        <a
        href={socialLinks.tiktok.url || undefined}
        target={socialLinks.tiktok.url ? '_blank' : undefined}
        rel={socialLinks.tiktok.url ? 'noreferrer' : undefined}
        className="soc-tk"
        onMouseEnter={() => { onHover(); setSocials((p) => ({ ...p, tiktok: socialLinks.tiktok.hoverLabel })); }}
        onMouseLeave={() => { onLeave(); setSocials((p) => ({ ...p, tiktok: socialLinks.tiktok.label })); }}
        onClick={(event) => { if (!socialLinks.tiktok.url) event.preventDefault(); }}
        style={{ position: 'absolute', top: 0, right: 0, pointerEvents: 'auto', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
        >
        {socials.tiktok}
        </a>
        <a
        href={socialLinks.instagram.url || undefined}
        target={socialLinks.instagram.url ? '_blank' : undefined}
        rel={socialLinks.instagram.url ? 'noreferrer' : undefined}
        className="soc-ig"
        onMouseEnter={() => { onHover(); setSocials((p) => ({ ...p, instagram: socialLinks.instagram.hoverLabel })); }}
        onMouseLeave={() => { onLeave(); setSocials((p) => ({ ...p, instagram: socialLinks.instagram.label })); }}
        onClick={(event) => { if (!socialLinks.instagram.url) event.preventDefault(); }}
        style={{ position: 'absolute', top: '22px', right: 0, pointerEvents: 'auto', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
        >
        {socials.instagram}
        </a>
      </div>

      {/* Keep the home scene mounted so its WebGL textures survive About navigation. */}
      <div
        key="home-view"
        aria-hidden={currentView !== 'home'}
        style={{
          visibility: currentView === 'home' ? 'visible' : 'hidden',
          pointerEvents: currentView === 'home' ? 'auto' : 'none'
        }}
      >
            {/* 3D Canvas: Bintang Kosmik di Latar Belakang, Orbit Melingkar di Hero & Pegas 3D di Section 2 */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
              {currentView !== 'admin' && (
                <Suspense fallback={null}>
                  <HomeScene
                    projects={projects}
                    loadingComplete={loadingComplete}
                    activeProject={activeProject}
                    clickedProject={clickedProject}
                    setHoveredProject={handleProjectPointerOver}
                    clearHoveredProject={handleProjectPointerOut}
                    setClickedProject={setClickedProject}
                    isMainTrackVisible={isMainTrackVisible && currentView === 'home'}
                  />
                </Suspense>
              )}
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
              {/* SECTION 1: HERO SECTION — PROJECT CARDS ORBIT BEHIND THE CENTERED NAME */}
              <section
                className="home-hero-section"
                style={{
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 50,
                  opacity: loadingComplete ? 1 : 0,
                  transition: 'opacity 1.5s ease',
                  paddingTop: 0,
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  boxSizing: 'border-box'
                }}
              >


                {/* Central Name & Interactive Per-Letter Physics */}
                <div
                  className="hero-content-wrapper home-hero-content"
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
                  <div className="hero-name-line"
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
                    {renderInteractiveChars("BILLEAN", 0)}
                  </div>

                  {/* Baris 2: Uji Prakasa */}
                  <div className="hero-name-line"
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
                    {renderInteractiveChars("UJI PRAKASA", 1)}
                  </div>
                </div>

                {/* Bottom Hero Cue: Indikator Scroll Minimalis & Rapi */}
                <div className="hero-scroll-cue"
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
              <section
                id="section-project-gallery"
                style={{
                  height: `${100 + Math.max(1, projects.length) * 120}vh`,
                  position: 'relative'
                }}
              >
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
              onContactActive={handleContactActive}
              timelineData={siteContent.history}
              contactEmail={siteContent.contact.email}
            />
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'about' && (
          <AboutPage
            key="about-view"
            onBackToHome={() => navigateTo('home')}
            isMobile={isMobile}
            onHover={onHover}
            onLeave={onLeave}
            technologies={siteContent.technologies}
            profileImage={siteContent.profileImage}
            contact={siteContent.contact}
          />
        )}
      </AnimatePresence>
      {currentView === 'admin' && (
        <Suspense fallback={null}>
          <AdminDashboard
            onClose={() => navigateTo('home')}
            onProjectsChanged={refreshProjects}
            onSiteContentChanged={refreshSiteContent}
          />
        </Suspense>
      )}

      {/* Active Project Modal / Case Study Drawer */}
      <AnimatePresence>
        {clickedProject && currentView === 'home' && (
          <motion.div
            key={clickedProject.id ?? clickedProject.ID}
            className="project-preview-frame"
            data-text-side={clickedProject.textSide === 'right' ? 'right' : 'left'}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.86 }}
            transition={{ type: 'spring', stiffness: 190, damping: 24, mass: 0.8 }}
          >
            <img
              src={apiAssetUrl(clickedProject.image)}
              alt={`Pratinjau proyek ${clickedProject.title}`}
              fetchPriority="high"
              decoding="async"
              draggable="false"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeProject && currentView === 'home' && (
          <motion.div
            key={activeProject.id ?? activeProject.ID}
            className="project-detail-panel"
            onMouseEnter={() => handleProjectPointerOver(activeProject)}
            onMouseLeave={() => {
              if (!clickedProject) handleProjectPointerOut();
            }}
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
              width: isMobile ? '92vw' : 'min(300px, 24vw)',
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
              borderRadius: 0,
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
            <p className="project-detail-description" style={{
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
            <div className="project-detail-actions" style={{ marginTop: '8px' }}>
              <button
                className="project-detail-action project-detail-action-primary"
                type="button"
                onClick={() => navigateToProject(activeProject)}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
              >
                Lihat detail
                <span aria-hidden="true">↗</span>
              </button>
              {clickedProject && (
                <button
                  className="project-detail-action"
                  type="button"
                  onClick={() => setClickedProject(null)}
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                >
                  Close
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentView === 'project-detail' && (
          <ProjectDetailPage
            key={detailProjectId}
            project={
              projects.find((project) => String(project.id ?? project.ID) === detailProjectId)
              ?? (String(selectedProjectDetail?.id ?? selectedProjectDetail?.ID) === detailProjectId
                ? selectedProjectDetail
                : null)
            }
            isLoading={!projectsLoaded && !selectedProjectDetail}
            loadError={projectApiError}
            onRetry={() => refreshProjects().catch((error) => console.error('Portfolio API could not be loaded:', error))}
            onBackToPortfolio={() => navigateTo('home')}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {pageIntro && (
          <motion.div
            key={pageIntro.id}
            aria-hidden="true"
            initial={{ clipPath: 'inset(0 0 0 0)' }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: shouldReduceMotion ? 0.08 : 0.46, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10001,
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
              pointerEvents: 'none',
              background: 'linear-gradient(145deg, #111 0%, #050505 58%, #0b0b0b 100%)',
              color: '#fff'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, letterSpacing: '0.34em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.18em' }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: shouldReduceMotion ? 0.08 : 0.24, ease: 'easeOut' }}
              style={{
                display: 'grid',
                justifyItems: 'center',
                gap: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.8rem, 2.4vw, 1.05rem)',
                fontWeight: 600
              }}
            >
              <span>{pageIntro.label}</span>
              <span style={{ width: '44px', height: '1px', background: 'rgba(255,255,255,0.7)' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}