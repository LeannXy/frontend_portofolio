import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import HistoryEnding from './HistoryEnding';

gsap.registerPlugin(ScrollTrigger);

// Data 4 Milestone sesuai gambar referensi pengguna
const TIMELINE_DATA = [
  {
    id: 0,
    year: "2023 - 2024",
    title: "Full Stack Developer",
    company: "Meedia",
    text: "Joined Meedia as a Full Stack Developer, building scalable apps with React, Node.js, and MongoDB.",
    details: [
      "Mengembangkan arsitektur aplikasi web reaktif berskala besar",
      "Optimalisasi pipeline integrasi API RESTful & MongoDB query",
      "Penerapan sistem komponen desain monokrom berkecepatan 60 FPS"
    ],
    techStack: ["React", "Node.js", "MongoDB", "Express", "TailwindCSS"],
    ratio: 0.08, // Posisi pada kurva (0.0 - 1.0)
    stemHeight: 64,
  },
  {
    id: 1,
    year: "2024 - 2025",
    title: "DevOps & Cloud Engineer",
    company: "Core Infrastructure",
    text: "Led projects with AWS and Docker, improved CI/CD pipelines, and mentored junior developers.",
    details: [
      "Orkestrasi kontainerisasi multi-layanan menggunakan Docker & AWS ECS",
      "Peningkatan kecepatan deployment pipeline CI/CD hingga 3.2x lebih cepat",
      "Mentorship teknis bagi 6+ junior developer dalam standar clean code"
    ],
    techStack: ["AWS", "Docker", "CI/CD", "TypeScript", "Terraform"],
    ratio: 0.38,
    stemHeight: 64,
  },
  {
    id: 2,
    year: "2025 - 2026",
    title: "Senior Developer",
    company: "Platform Engineering",
    text: "Promoted to Senior Developer, focusing on microservices, database design, and open-source work.",
    details: [
      "Transisi arsitektur monolit ke ekosistem microservices modular",
      "Perancangan skema database terdistribusi dengan konkurensi tinggi",
      "Kontribusi aktif pada ekosistem open-source dan UI framework modern"
    ],
    techStack: ["Microservices", "PostgreSQL", "Go", "Redis", "Kafka"],
    ratio: 0.70,
    stemHeight: 64,
  },
  {
    id: 3,
    year: "2026 - 2027",
    title: "Team Lead & Creative Architect",
    company: "Innovation Lab",
    text: "Became Team Lead, managing agile projects, scaling systems, and driving developer tools.",
    details: [
      "Memimpin visi teknis dan arsitektur produk interaktif berbasis WebGL 3D",
      "Manajemen sprint agile lintas disiplin desain interaksi dan rekayasa kode",
      "Pengembangan developer tooling internal yang memangkas waktu iterasi UI"
    ],
    techStack: ["Team Leadership", "Three.js", "System Architecture", "GSAP", "Next.js"],
    ratio: 0.92,
    stemHeight: 64,
  }
];

// SVG Path melengkung persis referensi:
// Mulai dari kiri atas -> meluncur mendatar ke tengah -> melengkung keluar layar kanan (hairpin curve) -> berbelok kembali ke kiri bawah
const SVG_PATH_D = `
  M 150 420
  C 400 420 500 425 650 430
  C 1150 445 1550 470 1900 495
  C 2550 540 3250 700 3500 1020
  C 3620 1190 3450 1360 3050 1420
  C 2850 1445 2650 1450 2450 1460
  C 1950 1510 1500 1620 1150 1710
  C 750 1785 450 1835 150 1870
`.trim();

const WORLD_WIDTH = 3800;
const WORLD_HEIGHT = 2100;

export default function HistoryJourney({ isMobile, onHover, onLeave }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const worldRef = useRef(null);

  const [pathLength, setPathLength] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expansionProgress, setExpansionProgress] = useState(0); // 0.0 s/d 1.0 saat jalur mentok
  const [activeMilestoneId, setActiveMilestoneId] = useState(0);
  const [selectedMilestone, setSelectedMilestone] = useState(null); // Modal detail bila diklik
  const [travelerPos, setTravelerPos] = useState({ x: 150, y: 420 });

  // Hitung posisi absolut (x, y) setiap milestone di atas kurva
  const milestonePositions = useMemo(() => {
    if (!pathRef.current || pathLength === 0) return [];

    return TIMELINE_DATA.map((item) => {
      const distance = item.ratio * pathLength;
      const pt = pathRef.current.getPointAtLength(distance);
      return {
        ...item,
        x: pt.x,
        y: pt.y,
      };
    });
  }, [pathLength]);

  // Inisialisasi SVG Path Length
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
    }
  }, []);

  // GSAP ScrollTrigger: Kamera bergerak mengikuti titik di garis
  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const world = worldRef.current;
    if (!container || !path || !world || pathLength === 0) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: isMobile ? '+=360%' : '+=520%', // Jalur scroll ekstra panjang untuk akomodasi pembesaran lingkaran dramatis
        pin: true,
        pinSpacing: true,
        scrub: 1.1, // Gerakan kamera halus dengan inersia
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          // 1. Fase Penelusuran Garis (0.0 s/d 0.78): Titik berjalan di sepanjang kurva hingga mentok
          const pathRatio = Math.min(1, p / 0.78);
          const currentDist = pathRatio * pathLength;
          const pt = path.getPointAtLength(currentDist);
          setTravelerPos({ x: pt.x, y: pt.y });

          // 2. Kamera otomatis mengikuti titik (Layar selalu memusatkan titik yang sedang berjalan)
          const winW = window.innerWidth;
          const winH = window.innerHeight;
          const targetCamX = -(pt.x - winW / 2);
          const targetCamY = -(pt.y - winH / 2);

          gsap.set(world, {
            x: targetCamX,
            y: targetCamY,
            force3D: true,
          });

          // 3. Fase Pembesaran Lingkaran (0.78 s/d 0.94): Saat jalur sudah mentok di ujung, lingkaran membesar memenuhi layar
          const exp = p <= 0.78 ? 0 : Math.min(1, (p - 0.78) / 0.16);
          setExpansionProgress(exp);

          // 4. Deteksi milestone aktif berdasarkan kedekatan rasio garis
          let closest = TIMELINE_DATA[0];
          let minDiff = 999;
          TIMELINE_DATA.forEach((item) => {
            const diff = Math.abs(pathRatio - item.ratio);
            if (diff < minDiff) {
              minDiff = diff;
              closest = item;
            }
          });
          setActiveMilestoneId(closest.id);
        }
      });
    }, container);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [pathLength, isMobile]);

  // Fungsi navigasi langsung ke milestone tertentu saat tombol di HUD diklik
  const jumpToMilestone = (ratio) => {
    if (!containerRef.current) return;
    const scrollTriggerInstance = ScrollTrigger.getById(containerRef.current.id) || ScrollTrigger.getAll().find(st => st.trigger === containerRef.current);
    if (scrollTriggerInstance) {
      // 1.0 rasio garis = 0.78 scroll progress
      const mappedScrollProgress = ratio * 0.78;
      const targetScroll = scrollTriggerInstance.start + (scrollTriggerInstance.end - scrollTriggerInstance.start) * mappedScrollProgress;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="section-history"
      ref={containerRef}
      style={{
        position: 'relative',
        zIndex: 50,
        backgroundColor: '#050505',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* ========================================================================= */}
      {/* FIXED HUD LAYER: Interface Tetap di Layar (Tidak ikut bergeser)           */}
      {/* ========================================================================= */}

      {/* Noise Texture & Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 40,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 60%, rgba(5,5,5,0.85) 100%)
          `
        }}
      />

      {/* TOP HEADER HUD */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? '1.5rem' : '2.5rem',
          left: isMobile ? '1.5rem' : '4rem',
          right: isMobile ? '1.5rem' : '4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
          pointerEvents: expansionProgress > 0.25 ? 'none' : 'auto',
          opacity: Math.max(0, 1 - expansionProgress * 2.8),
          transition: 'opacity 0.2s ease'
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: isMobile ? '0.68rem' : '0.8rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff', boxShadow: '0 0 10px #ffffff' }} />
            [ 05 / TRAJECTORY & HISTORY ]
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              color: 'rgba(255, 255, 255, 0.45)',
              marginTop: '4px'
            }}
          >
            Follow the line • Scroll controls path camera
          </div>
        </div>

        {/* Quick Chapter Selector Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            pointerEvents: 'auto',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '5px 8px',
            borderRadius: '30px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          {TIMELINE_DATA.map((item) => {
            const isCurrent = activeMilestoneId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => jumpToMilestone(item.ratio)}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                title={`Lompat ke ${item.year}: ${item.title}`}
                style={{
                  background: isCurrent ? '#ffffff' : 'transparent',
                  color: isCurrent ? '#000000' : 'rgba(255, 255, 255, 0.65)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: isMobile ? '4px 8px' : '5px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: isMobile ? '0.62rem' : '0.72rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {item.year.split(' - ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM STATUS HUD */}
      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? '1.5rem' : '2.5rem',
          left: isMobile ? '1.5rem' : '4rem',
          right: isMobile ? '1.5rem' : '4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 50,
          pointerEvents: 'none',
          opacity: Math.max(0, 1 - expansionProgress * 2.8),
          transition: 'opacity 0.2s ease'
        }}
      >
        {/* Active Chapter Indicator */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            background: 'rgba(10, 10, 12, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '14px',
            padding: '10px 18px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '2px',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase'
            }}
          >
            ACTIVE TIMELINE PHASE
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? '0.95rem' : '1.15rem',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.01em'
            }}
          >
            {TIMELINE_DATA[activeMilestoneId].year} — {TIMELINE_DATA[activeMilestoneId].title}
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.65rem' : '0.74rem',
            letterSpacing: '2px',
            color: 'rgba(255, 255, 255, 0.45)',
            textTransform: 'uppercase'
          }}
        >
          <span>TRAJECTORY</span>
          <div
            style={{
              width: isMobile ? '70px' : '120px',
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '2px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${Math.round(scrollProgress * 100)}%`,
                backgroundColor: '#ffffff',
                boxShadow: '0 0 8px #ffffff'
              }}
            />
          </div>
          <span style={{ color: '#ffffff', fontWeight: '700' }}>
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VAST WORLD CONTAINER: Kanvas Luas yang Dipan / Diikuti Kamera             */}
      {/* ========================================================================= */}
      <div
        ref={worldRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${WORLD_WIDTH}px`,
          height: `${WORLD_HEIGHT}px`,
          transformOrigin: '0 0',
          willChange: 'transform',
          pointerEvents: 'auto'
        }}
      >
        {/* Grid Latar Belakang Koordinat */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px',
            opacity: 0.7,
            pointerEvents: 'none'
          }}
        />

        {/* SVG KURVA LINTASAN PANJANG (Menembus Layar & Berputar di Sisi Kanan) */}
        <svg
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          <defs>
            {/* Glow Filter untuk Garis Putih Neon */}
            <filter id="white-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="orb-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Base Inactive Path (Garis redup petunjuk arah lintasan masa depan) */}
          <path
            d={SVG_PATH_D}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* 2. Active Illuminated Path (Garis putih menyala yang terlukis seiring scroll) */}
          <path
            ref={pathRef}
            d={SVG_PATH_D}
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#white-line-glow)"
            style={{
              strokeDasharray: pathLength || 1000,
              strokeDashoffset: pathLength ? pathLength * (1 - scrollProgress) : 0,
              transition: 'stroke-dashoffset 0.05s linear'
            }}
          />
        </svg>

        {/* 3. MILESTONE NODES, STEM LINES & CARDS */}
        {milestonePositions.map((item) => {
          const isPassedOrActive = scrollProgress >= item.ratio - 0.04;
          const isFocal = activeMilestoneId === item.id;

          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: item.x,
                top: item.y,
                pointerEvents: 'auto'
              }}
            >
              {/* TITIK PADA GARIS (Circle Node) */}
              <div
                style={{
                  position: 'absolute',
                  top: '-9px',
                  left: '-9px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: isPassedOrActive
                    ? '0 0 20px #ffffff, 0 0 40px rgba(255, 255, 255, 0.8)'
                    : '0 0 8px rgba(255, 255, 255, 0.3)',
                  border: '3px solid #050505',
                  zIndex: 20,
                  transform: isFocal ? 'scale(1.35)' : 'scale(1)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />

              {/* RIPPLE BURST JIKA AKTIF */}
              {isFocal && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-24px',
                    left: '-24px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255, 255, 255, 0.65)',
                    animation: 'historyPulse 1.8s infinite ease-out',
                    pointerEvents: 'none',
                    zIndex: 19
                  }}
                />
              )}

              {/* GARIS TIANG VERTIKAL (STEM LINE) MENGHUBUNGKAN TITIK KE TEKS DI ATAS */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '9px',
                  left: '-0.75px',
                  width: '1.5px',
                  height: `${item.stemHeight}px`,
                  backgroundColor: isPassedOrActive ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
                  boxShadow: isPassedOrActive ? '0 0 8px rgba(255, 255, 255, 0.6)' : 'none',
                  transformOrigin: 'bottom center',
                  transform: isPassedOrActive ? 'scaleY(1)' : 'scaleY(0.5)',
                  opacity: isPassedOrActive ? 1 : 0.4,
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 15
                }}
              />

              {/* KONTEN MILESTONE (Teks Tahun & Deskripsi Sesuai Gambar Referensi) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: `${item.stemHeight + 16}px`,
                  left: '-16px',
                  width: '380px',
                  maxWidth: '85vw',
                  transformOrigin: 'bottom left',
                  opacity: isPassedOrActive ? 1 : 0.25,
                  transform: isPassedOrActive
                    ? (isFocal ? 'translateY(0) scale(1.03)' : 'translateY(0) scale(1)')
                    : 'translateY(12px) scale(0.96)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: isFocal ? 30 : 22
                }}
              >
                {/* Tahun Tebal (Misal: 2023 - 2024) */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.65rem',
                    fontWeight: '800',
                    letterSpacing: '-0.025em',
                    lineHeight: '1.1',
                    margin: '0 0 0.5rem 0',
                    color: isPassedOrActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                    textShadow: isFocal ? '0 0 25px rgba(255, 255, 255, 0.4)' : 'none',
                    transition: 'all 0.4s ease'
                  }}
                >
                  {item.year}
                </h3>

                {/* Deskripsi Teks Sesuai Gambar */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.94rem',
                    lineHeight: '1.6',
                    color: isPassedOrActive ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.3)',
                    margin: '0 0 1rem 0',
                    transition: 'color 0.4s ease'
                  }}
                >
                  {item.text}
                </p>

                {/* FITUR: "KETIKA SAMPAI PADA TITIK TENTU AKAN MUNCUL SESUATU" */}
                {/* Micro-Card Interaktif & Tech Badges Terbuka Saat Titik Berjalan Mencapai Milestone */}
                <AnimatePresence>
                  {isPassedOrActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        padding: '14px 18px',
                        backgroundColor: isFocal ? 'rgba(20, 20, 25, 0.85)' : 'rgba(15, 15, 18, 0.65)',
                        border: isFocal ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '14px',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        boxShadow: isFocal
                          ? '0 15px 35px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 255, 255, 0.12)'
                          : '0 10px 25px rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      {/* Sub-label & Status Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            letterSpacing: '1.5px',
                            color: '#ffffff',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                          }}
                        >
                          ROLE // {item.title}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            letterSpacing: '1px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            backgroundColor: isFocal ? '#ffffff' : 'rgba(255,255,255,0.1)',
                            color: isFocal ? '#000000' : 'rgba(255,255,255,0.7)',
                            fontWeight: '700'
                          }}
                        >
                          {isFocal ? '• ACTIVE POINT' : 'PASSED'}
                        </span>
                      </div>

                      {/* Tech Stack Pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {item.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.64rem',
                              padding: '2px 7px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              color: 'rgba(255, 255, 255, 0.9)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Tombol Interaktif "Jelajahi Arsip Periode Ini" */}
                      <button
                        onClick={() => setSelectedMilestone(item)}
                        onMouseEnter={onHover}
                        onMouseLeave={onLeave}
                        style={{
                          marginTop: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: isFocal ? '#ffffff' : 'transparent',
                          color: isFocal ? '#050505' : '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          borderRadius: '8px',
                          padding: '7px 12px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          letterSpacing: '1px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <span>LIHAT PENCAPAIAN PERIODE INI</span>
                        <span>↗</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {/* 4. TITIK SCROLL UTAMA (THE GLOWING TRAVELER ORB) */}
        {/* Titik ini bergerak mengikuti garis seiring scroll dan diikuti kamera */}
        <div
          style={{
            position: 'absolute',
            left: travelerPos.x,
            top: travelerPos.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 35
          }}
        >
          {/* Main Traveler Solid White Core (Membesar dramatis saat jalur mentok) */}
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              boxShadow: `0 0 ${25 + expansionProgress * 120}px #ffffff, 0 0 ${60 + expansionProgress * 250}px rgba(255, 255, 255, 0.9), 0 0 ${100 + expansionProgress * 400}px rgba(255, 255, 255, 0.6)`,
              border: '4px solid #000000',
              position: 'relative',
              transform: `scale(${1 + Math.pow(expansionProgress, 2.5) * 60})`,
              transition: 'transform 0.05s linear, box-shadow 0.1s linear'
            }}
          />

          {/* Radial Halo Orbit */}
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              left: '-16px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '1px dashed rgba(255, 255, 255, 0.5)',
              opacity: Math.max(0, 1 - expansionProgress * 2),
              animation: 'spinOrbit 6s linear infinite'
            }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPANDING CIRCLE PORTAL & ENDING FINALE SECTION                           */}
      {/* ========================================================================= */}
      <HistoryEnding
        expansionProgress={expansionProgress}
        isFullyActive={scrollProgress >= 0.94}
        onReplay={() => {
          if (!containerRef.current) return;
          const st = ScrollTrigger.getAll().find(s => s.trigger === containerRef.current);
          if (st) {
            window.scrollTo({ top: st.start, behavior: 'smooth' });
          }
        }}
        isMobile={isMobile}
        onHover={onHover}
        onLeave={onLeave}
      />

      {/* ========================================================================= */}
      {/* MODAL PENCAPAIAN DETAIL SAAT KARTU MILSTONE DIKLIK                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMilestone(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              boxSizing: 'border-box'
            }}
          >
            <motion.div
              initial={{ scale: 0.93, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 25 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '580px',
                backgroundColor: '#0c0c10',
                border: '1px solid #ffffff',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: isMobile ? '2rem' : '2.8rem',
                boxSizing: 'border-box',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: '#ffffff',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                  }}
                >
                  {selectedMilestone.year} // {selectedMilestone.company}
                </span>
                <button
                  onClick={() => setSelectedMilestone(null)}
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  ✕
                </button>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? '1.8rem' : '2.4rem',
                  fontWeight: '800',
                  margin: '0 0 1rem 0',
                  letterSpacing: '-0.025em'
                }}
              >
                {selectedMilestone.title}
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.02rem',
                  lineHeight: '1.65',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '1.8rem'
                }}
              >
                {selectedMilestone.text}
              </p>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1.5rem', marginBottom: '1.8rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '2px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    marginBottom: '1rem'
                  }}
                >
                  KEY IMPACT & CONTRIBUTIONS
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedMilestone.details.map((detail, dIdx) => (
                    <li
                      key={dIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.92rem',
                        lineHeight: '1.5',
                        color: 'rgba(255, 255, 255, 0.88)'
                      }}
                    >
                      <span style={{ color: '#ffffff', fontWeight: 'bold' }}>•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedMilestone.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontWeight: '600'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS Keyframes untuk Efek Denyut Lintas Garis */}
      <style>{`
        @keyframes historyPulse {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes spinOrbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
