import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutPage({ onBackToHome, isMobile, onHover, onLeave }) {
  // Foto Profil: Menggunakan default /profile.jpg atau foto kustom yang diunggah pengguna (disimpan di localStorage)
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('billean_custom_portrait') || '/profile.jpg';
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const fileInputRef = useRef(null);

  // Handler jika pengguna ingin mengganti foto dengan foto pribadinya langsung dari komputer
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setProfileImage(base64Data);
        try {
          localStorage.setItem('billean_custom_portrait', base64Data);
        } catch (err) {
          console.warn('Ukuran foto terlalu besar untuk localStorage, foto tetap tampil di sesi ini.', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPhoto = () => {
    localStorage.removeItem('billean_custom_portrait');
    setProfileImage('/profile.jpg');
  };

  // Kurasi Teknologi yang Dipelajari & Digunakan (Sesuai Permintaan)
  const techCategories = [
    { id: 'all', label: 'SEMUA' },
    { id: 'backend', label: 'BACKEND & API' },
    { id: 'database', label: 'DATABASE & DATA' },
    { id: 'frontend', label: 'FRONTEND & PORTO STACK' },
    { id: 'design', label: 'DESAIN & KREATIF' }
  ];

  const technologies = [
    {
      name: 'Laravel 13',
      category: 'backend',
      tag: 'Primary Framework',
      role: 'Backend Architecture',
      desc: 'Arsitektur MVC modern, Eloquent ORM, migrasi skema database, otentikasi aman, dan pengembangan REST API terstruktur.'
    },
    {
      name: 'PHP',
      category: 'backend',
      tag: 'Core Language',
      role: 'Server-Side Programming',
      desc: 'Pemrograman berorientasi objek (OOP), manajemen sesi, modularitas kode, dan eksekusi logika backend yang handal.'
    },
    {
      name: 'Golang',
      category: 'backend',
      tag: 'High Concurrency',
      role: 'Systems & Microservices',
      desc: 'Bahasa terkompilasi dengan performa tinggi, goroutine concurrency, typing kuat, serta efisiensi beban kerja server.'
    },
    {
      name: 'Postman',
      category: 'backend',
      tag: 'API Tooling',
      role: 'Contract & Endpoint Testing',
      desc: 'Perancangan spesifikasi endpoint REST, pengujian otomasi response JSON, debugging status code, dan dokumentasi API.'
    },
    {
      name: 'PostgreSQL',
      category: 'database',
      tag: 'Primary RDBMS',
      role: 'Enterprise Relational DB',
      desc: 'Sistem manajemen database relasional tangguh, query kompleks, integritas data ACID, dan indexing skala besar.'
    },
    {
      name: 'MySQL',
      category: 'database',
      tag: 'Relational DB',
      role: 'Data Modeling & Queries',
      desc: 'Perancangan skema relasional, normalisasi tabel, foreign key integrity, dan optimalisasi query berkecepatan tinggi.'
    },
    {
      name: 'phpMyAdmin',
      category: 'database',
      tag: 'DB Administration',
      role: 'Visual SQL Manager',
      desc: 'Manajemen database grafis, inspeksi struktur tabel, eksekusi query manual, manipulasi baris, dan ekspor/impor skema.'
    },
    {
      name: 'React.js',
      category: 'frontend',
      tag: 'Modern UI',
      role: 'Frontend Library',
      desc: 'Komponen modular, state management reaktif, custom hooks, dan arsitektur antarmuka Single Page Application (SPA).'
    },
    {
      name: 'JavaScript',
      category: 'frontend',
      tag: 'Core Web',
      role: 'Modern ESNext',
      desc: 'Manipulasi DOM dinamis, asynchronous programming (Async/Await), event handling presisi, dan logika interaktif modern.'
    },
    {
      name: 'Three.js / WebGL',
      category: 'frontend',
      tag: 'Porto Engine',
      role: '3D Spatial Graphics',
      desc: 'Grafis 3D interaktif pada browser, sistem koordinat spasial, material PBR, dan rendering procedural (fondasi portofolio ini).'
    },
    {
      name: 'GSAP & ScrollTrigger',
      category: 'frontend',
      tag: 'Porto Engine',
      role: 'Timeline Motion Engine',
      desc: 'Orkestrasi animasi timeline 60 FPS, scrubbing scroll dinamis, pin section, dan interaksi fisik responsif.'
    },
    {
      name: 'Framer Motion',
      category: 'frontend',
      tag: 'Porto Engine',
      role: 'Declarative Transitions',
      desc: 'Animasi transisi halaman mulus, fisika pegas (spring dynamics), gesture hover mikro, dan tata letak dinamis.'
    },
    {
      name: 'Lenis',
      category: 'frontend',
      tag: 'Porto Engine',
      role: 'Smooth Scroll Core',
      desc: 'Inertial smooth scrolling berakurasi tinggi yang tersinkronisasi mulus dengan ScrollTrigger dan navigasi browser.'
    },
    {
      name: 'Figma',
      category: 'design',
      tag: 'UI/UX Design',
      role: 'Interface Architecture',
      desc: 'Wireframing, perancangan sistem desain, auto-layout responsif, tipografi harmonis, dan prototyping antarmuka.'
    },
    {
      name: 'Canva',
      category: 'design',
      tag: 'Visual Assets',
      role: 'Creative Layout',
      desc: 'Penyusunan tata letak visual cepat, aset grafis pendukung, branding presentasi, dan materi visual modern.'
    },
    {
      name: 'Canva Affinity',
      category: 'design',
      tag: 'Vector Studio',
      role: 'Affinity Designer & Graphics',
      desc: 'Ilustrasi vektor presisi matematis, manipulasi grafis resolusi ultra tinggi, dan tipografi editorial berkelas.'
    }
  ];

  const filteredTech = activeCategory === 'all'
    ? technologies
    : technologies.filter((t) => t.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        height: '100vh',
        minHeight: '100vh',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        backgroundColor: '#050505',
        color: '#ffffff',
        padding: isMobile ? '5.5rem 1.25rem 4rem 1.25rem' : '7.5rem 4rem 6rem 4rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Subtle Noise / Ambient Grid Lines */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.6
        }}
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* NAVIGASI MINIMALIS: KEMBALI KE BERANDA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isMobile ? '2.5rem' : '3.8rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <button
            onClick={onBackToHome}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '9px 20px',
              borderRadius: '24px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              letterSpacing: '1.5px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.25s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            <span>←</span>
            <span>BERANDA</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.55)',
              letterSpacing: '1px'
            }}
          >
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ffffff', boxShadow: '0 0 10px #ffffff' }} />
            <span>JEPARA, ID • TERSEDIA UNTUK KOLABORASI</span>
          </div>
        </div>

        {/* HERO SECTION ABOUT: FOTO EDITORIAL & BIOGRAFI RINGKAS MINIMALIS */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '380px 1fr',
            gap: isMobile ? '2.5rem' : '4.5rem',
            alignItems: 'start',
            marginBottom: isMobile ? '4rem' : '6rem'
          }}
        >
          {/* FRAME FOTO PERSONAL (EDITORIAL MONOCHROME PORTRAIT) */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3 / 4',
                backgroundColor: '#0d0d0d',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 255, 255, 0.03)'
              }}
            >
              {/* Foto Aktual */}
              <img
                src={profileImage}
                alt="Billean Uji Prakasa"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'grayscale(100%) contrast(108%) brightness(96%)',
                  transition: 'transform 0.5s ease, filter 0.5s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.filter = 'grayscale(100%) contrast(114%) brightness(102%)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'grayscale(100%) contrast(108%) brightness(96%)';
                }}
                onError={(e) => {
                  // Fallback jika profile.jpg belum termuat
                  e.currentTarget.src = '/profile.jpg';
                }}
              />

              {/* Overlay Label Estetik Minimalis */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  padding: '4px 10px',
                  backgroundColor: 'rgba(5, 5, 5, 0.75)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '1.5px',
                  color: 'rgba(255, 255, 255, 0.85)'
                }}
              >
                PROFIL / 2026
              </div>

              {/* Tombol Praktis Penggantian Foto Pribadi */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '14px',
                  right: '14px',
                  display: 'flex',
                  gap: '8px'
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: 'rgba(5, 5, 5, 0.82)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(5, 5, 5, 0.82)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  title="Klik untuk memilih foto Anda langsung dari komputer"
                >
                  <span>📷</span>
                  <span>GANTI FOTO SAYA</span>
                </button>

                {profileImage !== '/profile.jpg' && (
                  <button
                    onClick={handleResetPhoto}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'rgba(5, 5, 5, 0.82)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      cursor: 'pointer'
                    }}
                    title="Kembalikan ke foto bawaan"
                  >
                    ↺
                  </button>
                )}
              </div>
            </div>

            {/* Identitas Ringkas di Bawah Foto */}
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  letterSpacing: '-0.02em'
                }}
              >
                Billean Uji Prakasa
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '4px',
                  letterSpacing: '0.5px'
                }}
              >
                Software Engineer & Creative Developer
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'rgba(255, 255, 255, 0.4)',
                  marginTop: '4px'
                }}
              >
                PPLG • SMK / Developer Indonesia
              </div>
            </div>
          </div>

          {/* BIO RINGKAS & NILAI FILOSOFI (MINIMALIS & TIDAK BERTELE-TELE) */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '2px',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                marginBottom: '1rem'
              }}
            >
              // TENTANG & PRINSIP
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? 'clamp(2rem, 8vw, 2.8rem)' : 'clamp(2.5rem, 4vw, 3.8rem)',
                fontWeight: '800',
                lineHeight: '1.1',
                letterSpacing: '-0.03em',
                color: '#ffffff',
                margin: '0 0 1.5rem 0'
              }}
            >
              Arsitektur kode tangguh dengan visual interaktif yang bernyawa.
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? '0.98rem' : '1.1rem',
                lineHeight: '1.7',
                color: 'rgba(255, 255, 255, 0.75)',
                margin: '0 0 1.25rem 0',
                maxWidth: '680px'
              }}
            >
              Halo, saya <strong style={{ color: '#ffffff' }}>Billean Uji Prakasa</strong>. Saya berfokus pada rekayasa perangkat lunak modern—menghubungkan ketangguhan sistem backend dan basis data relasional dengan pengalaman antarmuka web modern yang dinamis dan berkelas.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? '0.98rem' : '1.1rem',
                lineHeight: '1.7',
                color: 'rgba(255, 255, 255, 0.65)',
                margin: '0 0 2.2rem 0',
                maxWidth: '680px'
              }}
            >
              Bagi saya, perangkat lunak yang hebat tidak hanya memiliki logika yang solid dan aman, tetapi juga memberikan rasa interaksi yang memikat dan memuaskan bagi setiap pengguna yang menyentuhnya.
            </p>

            {/* 3 KARTU METRIK MINIMALIS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '2.5rem'
              }}
            >
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.45)', letterSpacing: '1px' }}>
                  01 / BACKEND
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>
                  Logika & Relasi
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '4px' }}>
                  Laravel 13, PHP, Golang & SQL
                </div>
              </div>

              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.45)', letterSpacing: '1px' }}>
                  02 / INTERAKSI
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>
                  Visual Spasial
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '4px' }}>
                  React, Three.js, GSAP & Motion
                </div>
              </div>

              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.45)', letterSpacing: '1px' }}>
                  03 / DESAIN
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>
                  Sistem & Vektor
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '4px' }}>
                  Figma & Canva Affinity
                </div>
              </div>
            </div>

            {/* AKSI TOMBOL CEPAT */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a
                href="mailto:billeanujiprakasa@gmail.com"
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '11px 24px',
                  borderRadius: '30px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>KIRIM EMAIL ↗</span>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '11px 22px',
                  borderRadius: '30px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>GITHUB REPO ↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 2: TEKNOLOGI YANG DIGUNAKAN & DIPELAJARI */}
        <section style={{ marginBottom: '5rem' }}>
          {/* Header Section Teknologi */}
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'flex-end',
              gap: '1.5rem',
              marginBottom: '2.5rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}
              >
                // STACK & TOOLKIT
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? '1.8rem' : '2.4rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0
                }}
              >
                Teknologi & Perangkat Kerja.
              </h2>
            </div>

            {/* Filter Tabs Minimalis Monokrom */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              {techCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '20px',
                    backgroundColor: activeCategory === cat.id ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                    color: activeCategory === cat.id ? '#000000' : 'rgba(255, 255, 255, 0.65)',
                    border: '1px solid',
                    borderColor: activeCategory === cat.id ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Kartu Teknologi */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#0a0a0c'
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredTech.map((tech, idx) => {
                const isHovered = hoveredCard === tech.name;
                const isOtherHovered = hoveredCard !== null && hoveredCard !== tech.name;
                return (
                  <motion.div
                    key={tech.name}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    onMouseEnter={() => {
                      onHover();
                      setHoveredCard(tech.name);
                    }}
                    onMouseLeave={() => {
                      onLeave();
                      setHoveredCard(null);
                    }}
                    style={{
                      position: 'relative',
                      backgroundColor: '#0a0a0d',
                      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '190px',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      opacity: isOtherHovered ? 0.32 : 1,
                      filter: isOtherHovered ? 'brightness(0.65)' : 'none',
                      transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'default'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#ffffff',
                        transform: isHovered ? 'scaleY(1) translateZ(0)' : 'scaleY(0) translateZ(0)',
                        transformOrigin: isHovered ? 'bottom' : 'top',
                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'transform',
                        zIndex: 1,
                        pointerEvents: 'none'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: isHovered ? '#000000' : 'transparent',
                        zIndex: 3,
                        transition: 'all 0.4s ease'
                      }}
                    />
                    {/* Header Kartu */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.85rem'
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            letterSpacing: '1px',
                            color: isHovered ? '#000000' : 'rgba(255, 255, 255, 0.4)',
                            transition: 'color 0.4s ease'
                          }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.64rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.06)',
                            border: `1px solid ${isHovered ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.12)'}`,
                            color: isHovered ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            transition: 'all 0.4s ease'
                          }}
                        >
                          {tech.tag}
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          color: isHovered ? '#000000' : '#ffffff',
                          letterSpacing: '-0.02em',
                          marginBottom: '0.4rem',
                          transition: 'color 0.4s ease'
                        }}
                      >
                        {tech.name}
                      </div>

                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: isHovered ? '#18181b' : 'rgba(255, 255, 255, 0.5)',
                          letterSpacing: '0.5px',
                          marginBottom: '0.75rem',
                          transition: 'color 0.4s ease'
                        }}
                      >
                        {tech.role}
                      </div>
                    </div>

                    {/* Deskripsi Singkat */}
                    <p
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        lineHeight: '1.55',
                        color: isHovered ? '#18181b' : 'rgba(255, 255, 255, 0.65)',
                        margin: 0,
                        transition: 'color 0.4s ease'
                      }}
                    >
                      {tech.desc}
                    </p>

                    {/* Aksen Garis Halus di Bawah saat Hover */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '14px',
                        right: '14px',
                        height: '2px',
                        backgroundColor: '#000000',
                        opacity: isHovered ? 0.25 : 0,
                        transition: 'opacity 0.25s ease'
                      }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        {/* BOTTOM STATEMENT & FOOTER */}
        <div
          style={{
            padding: isMobile ? '2.5rem 1.5rem' : '3.5rem 3rem',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: '1.5rem'
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? '1.3rem' : '1.75rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '0.4rem'
              }}
            >
              Mari ciptakan sesuatu yang bermakna.
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                color: 'rgba(255, 255, 255, 0.55)'
              }}
            >
              Terbuka untuk diskusi proyek, eksplorasi teknologi, dan peluang rekayasa perangkat lunak.
            </div>
          </div>

          <button
            onClick={onBackToHome}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              padding: '11px 26px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '26px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: '700',
              letterSpacing: '1.5px',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            JELAJAHI KARYA ↗
          </button>
        </div>
      </div>
    </motion.div>
  );
}
