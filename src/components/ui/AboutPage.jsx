import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DEFAULT_TECHNOLOGIES } from '../../lib/siteContent.js';
import { apiAssetUrl } from '../../lib/portfolioApi.js';

export default function AboutPage({ onBackToHome, isMobile, onHover, onLeave, technologies = DEFAULT_TECHNOLOGIES, profileImage = '/profile.webp', contact }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  // Kurasi Teknologi yang Dipelajari & Digunakan (Sesuai Permintaan)
  const techCategories = [
    { id: 'all', label: 'SEMUA' },
    { id: 'backend', label: 'BACKEND & API' },
    { id: 'database', label: 'DATABASE & DATA' },
    { id: 'frontend', label: 'FRONTEND & PORTO STACK' },
    { id: 'design', label: 'DESAIN & KREATIF' }
  ];

  const filteredTech = activeCategory === 'all'
    ? technologies
    : technologies.filter((t) => t.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="about-page-shell"
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

      <div className="about-status-row about-page-content" style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* NAVIGASI MINIMALIS: KEMBALI KE BERANDA */}
        <div
          className="about-topbar"
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
          className="about-hero-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '380px 1fr',
            gap: isMobile ? '2.5rem' : '4.5rem',
            alignItems: 'start',
            marginBottom: isMobile ? '4rem' : '6rem'
          }}
        >
          {/* FRAME FOTO PERSONAL (EDITORIAL MONOCHROME PORTRAIT) */}
          <motion.div
            className="about-portrait-column"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: shouldReduceMotion ? 0 : 0.1 }}
            whileHover={shouldReduceMotion ? undefined : { y: -5 }}
            style={{ position: 'relative' }}
          >
            <div
              className="about-portrait-frame"
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
                className="about-portrait-image"
                src={apiAssetUrl(profileImage)}
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
                  if (e.currentTarget.src !== new URL('/profile.webp', window.location.origin).href) {
                    e.currentTarget.src = '/profile.webp';
                  }
                }}
              />

              {/* Overlay Label Estetik Minimalis */}
              <div
                className="about-portrait-label"
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

            </div>

            {/* Identitas Ringkas di Bawah Foto */}
            <div className="about-portrait-caption" style={{ marginTop: '1.25rem' }}>
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
          </motion.div>

          {/* BIO RINGKAS & NILAI FILOSOFI (MINIMALIS & TIDAK BERTELE-TELE) */}
          <motion.div
            className="about-bio"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: shouldReduceMotion ? 0 : 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div
              className="about-eyebrow"
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
              className="about-title"
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
              Membangun sistem yang kuat.
              <span className="about-title-accent"> Merancang pengalaman yang terasa.</span>
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

            <div className="about-focus-list" aria-label="Fokus keahlian">
              <motion.div
                className="about-focus-item"
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <span>01</span>
                <strong>Backend & data</strong>
              </motion.div>
              <motion.div
                className="about-focus-item"
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <span>02</span>
                <strong>Antarmuka web</strong>
              </motion.div>
              <motion.div
                className="about-focus-item"
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <span>03</span>
                <strong>Interaksi kreatif</strong>
              </motion.div>
            </div>

            {/* AKSI TOMBOL CEPAT */}
            <div className="about-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a
                href={contact?.email ? `mailto:${contact.email}` : undefined}
                aria-disabled={!contact?.email}
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
                href={contact?.githubRepo || undefined}
                aria-disabled={!contact?.githubRepo}
                onClick={(event) => { if (!contact?.githubRepo) event.preventDefault(); }}
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
          </motion.div>
        </section>

        {/* SECTION 2: TEKNOLOGI YANG DIGUNAKAN & DIPELAJARI */}
        <motion.section
          className="about-tech-section"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          style={{ marginBottom: '5rem' }}
        >
          {/* Header Section Teknologi */}
          <div
            className="about-tech-heading"
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
                  aria-pressed={activeCategory === cat.id}
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
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: shouldReduceMotion ? 0 : idx * 0.02 }}
                    whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
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
        </motion.section>

        {/* BOTTOM STATEMENT & FOOTER */}
        <div
          className="about-footer"
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
