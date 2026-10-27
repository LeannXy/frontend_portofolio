import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

// Warna biru seragam di seluruh elemen (Solid, tanpa gradasi yang berbeda-beda)
const UNIFORM_BLUE = '#ffffff';

// 4 Pilar Pendekatan (My Approach) sesuai spesifikasi dan referensi desain
const APPROACH_PILLARS = [
  {
    num: "01",
    title: "Build",
    desc: "Turning ideas into functional web applications through coding and hands-on projects.",
    details: [
      "Building web applications with Laravel, PHP, and MySQL.",
      "Developing responsive interfaces using HTML, CSS, and Tailwind CSS.",
      "Creating practical projects, from online stores to school information systems."
    ],
    tag: "EXECUTION"
  },
  {
    num: "02",
    title: "Learn",
    desc: "Understanding concepts through practice and experimentation.",
    details: [
      "Exploring new frameworks, programming concepts, and development tools.",
      "Learning through school assignments, independent projects, and real-world problems.",
      "Understanding the code behind each feature instead of just making it work."
    ],
    tag: "MASTERY"
  },
  {
    num: "03",
    title: "Use AI",
    desc: "Using AI to assist development, debugging, and exploration.",
    details: [
      "Using AI tools to brainstorm ideas and explore possible solutions.",
      "Debugging errors, reviewing code, and understanding unfamiliar concepts.",
      "Turning ideas into prototypes while learning to evaluate and improve AI-generated code."
    ],
    tag: "SYNERGY"
  },
  {
    num: "04",
    title: "Improve",
    desc: "Refining projects, improving code quality, and growing through experimentation and challenges.",
    details: [
      "Refining UI/UX, responsiveness, and the overall user experience.",
      "Improving code structure, debugging skills, and application reliability",
      "Learning from mistakes and continuously developing as a future software developer."
    ],
    tag: "REFINEMENT"
  }
];

export default function MyApproach({ isMobile, onHover, onLeave }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedPillar, setSelectedPillar] = useState(null);

  return (
    <section
      id="section-approach"
      style={{
        position: 'relative',
        zIndex: 40, // Berada di atas Canvas fixed (zIndex 1) dan background text sehingga menutup bintang
        backgroundColor: '#070708', // Solid opaque sheet ala kertas fisik tebal
        color: '#ffffff',
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
        // Efek batas kertas & shadow atas-bawah tebal agar tidak terlihat menabrak navbar
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: `
          0 -60px 140px 40px rgba(0, 0, 0, 1),
          0 60px 140px 40px rgba(0, 0, 0, 1),
          inset 0 80px 120px -20px rgba(0, 0, 0, 0.95),
          inset 0 -80px 120px -20px rgba(0, 0, 0, 0.95)
        `,
        paddingTop: isMobile ? '6.5rem' : '10.5rem',
        paddingBottom: isMobile ? '6.5rem' : '9.5rem',
        paddingLeft: isMobile ? '1.5rem' : '4rem',
        paddingRight: isMobile ? '1.5rem' : '4rem',
        overflow: 'hidden'
      }}
    >
      {/* SHADOW VIGNETTE ATAS: Memastikan transisi halus di bawah navbar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, rgba(7, 7, 8, 1) 0%, rgba(7, 7, 8, 0.85) 35%, rgba(7, 7, 8, 0.3) 70%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 15
        }}
      />

      {/* SHADOW VIGNETTE BAWAH: Mencegah cutoff mendadak di bagian bawah */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to top, rgba(7, 7, 8, 1) 0%, rgba(7, 7, 8, 0.85) 35%, rgba(7, 7, 8, 0.3) 70%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 15
        }}
      />

      {/* Tekstur Lembaran Kertas Halus / Matte Architectural Grid Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          opacity: 0.7
        }}
      />

      {/* Decorative Top Seam Accent dengan Biru Seragam */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: isMobile ? '1.5rem' : '4rem',
          width: '60px',
          height: '2px',
          backgroundColor: UNIFORM_BLUE,
          boxShadow: `0 0 16px ${UNIFORM_BLUE}`,
          zIndex: 16
        }}
      />

      {/* SECTION HEADER AREA: Sesuai Referensi Desain */}
      <div
        style={{
          position: 'relative',
          zIndex: 16,
          maxWidth: '1440px',
          margin: '0 auto',
          marginBottom: isMobile ? '3rem' : '4.5rem'
        }}
      >
        {/* Baris Atas: Label 03 / MY APPROACH & Link Kanan */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1.2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Label Kiri: 03 / MY APPROACH dengan titik biru seragam */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: isMobile ? '0.72rem' : '0.84rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.75)',
              fontWeight: '600'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: UNIFORM_BLUE,
                boxShadow: `0 0 10px ${UNIFORM_BLUE}`
              }}
            />
            <span>03 / MY APPROACH</span>
          </div>

          {/* Link Kanan: ALL SERVICES / EXPLORE PHILOSOPHY */}
          <a
            href="#section-approach"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: isMobile ? '0.7rem' : '0.82rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.55)',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = UNIFORM_BLUE)}
            onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)')}
          >
            <span>LEARNING PHILOSOPHY</span>
            <span style={{ fontSize: '1rem', color: UNIFORM_BLUE }}>↗</span>
          </a>
        </div>

        {/* Headline Utama & Penjelasan Filosofi */}
        <div style={{ maxWidth: '920px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? 'clamp(2.2rem, 8.5vw, 3.4rem)' : 'clamp(3.2rem, 5.2vw, 4.8rem)',
              fontWeight: '800',
              lineHeight: '1.05',
              letterSpacing: '-0.035em',
              margin: '0 0 1.4rem 0',
              color: '#ffffff'
            }}
          >
            Learning by building.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '1.02rem' : 'clamp(1.15rem, 1.45vw, 1.35rem)',
              lineHeight: '1.65',
              color: 'rgba(255, 255, 255, 0.65)',
              margin: 0,
              maxWidth: '820px'
            }}
          >
            I explore technologies, build real projects, and use AI as a tool to learn, experiment, and solve problems.
          </motion.p>
        </div>
      </div>

      {/* 4 CARDS GRID: PERSIS SEPERTI GAMBAR REFERENSI DENGAN SIBLING DIMMING */}
      <div
        style={{
          position: 'relative',
          zIndex: 16,
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          // Desktop: 4 kolom rapi berjejer | Tablet: 2 kolom | Mobile: 1 kolom
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#0a0a0c'
        }}
      >
        {APPROACH_PILLARS.map((pillar, idx) => {
          const isHovered = hoveredIdx === idx;
          const isOtherHovered = hoveredIdx !== null && hoveredIdx !== idx;

          return (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => {
                setHoveredIdx(idx);
                onHover?.();
              }}
              onMouseLeave={() => {
                setHoveredIdx(null);
                onLeave?.();
              }}
              onClick={() => setSelectedPillar(pillar)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                padding: isMobile ? '1.8rem 1.4rem' : '2.2rem 2rem',
                minHeight: isMobile ? 'auto' : '260px',
                backgroundColor: '#0a0a0d',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                overflow: 'hidden', // Memastikan animasi background biru ter-clip rapi di dalam kotak
                boxSizing: 'border-box',
                // SIBLING DIMMING: Kotak lain menggelap halus saat salah satu kotak di-hover
                opacity: isOtherHovered ? 0.32 : 1,
                filter: isOtherHovered ? 'brightness(0.65)' : 'none',
                transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* EFEK HOVER: Putih naik dari bawah. EXIT: Putih keluar ke atas (hitam muncul dari bawah) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#ffffff',
                  transform: isHovered ? 'scaleY(1) translateZ(0)' : 'scaleY(0) translateZ(0)',
                  transformOrigin: isHovered ? 'bottom' : 'top',
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />

              {/* Highlight Garis Atas saat Hover */}
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

              {/* BARIS ATAS KARTU: Nomor & Panah ↗ (Biru di default, Hitam Pekat saat Hover di atas Putih) */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: '1.25rem'
                }}
              >
                {/* Nomor Pilar: Biru seragam unhovered, berubah ke hitam pekat saat background putih naik */}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: isHovered ? '#000000' : UNIFORM_BLUE,
                    letterSpacing: '1px',
                    transition: 'color 0.4s ease'
                  }}
                >
                  {pillar.num}
                </span>

                {/* Panah ↗: Biru unhovered, hitam pekat saat hover */}
                <motion.span
                  animate={{
                    x: isHovered ? 4 : 0,
                    y: isHovered ? -4 : 0,
                    scale: isHovered ? 1.15 : 1
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.3rem',
                    fontWeight: '500',
                    color: isHovered ? '#000000' : UNIFORM_BLUE,
                    lineHeight: '1',
                    display: 'inline-block',
                    transition: 'color 0.4s ease'
                  }}
                >
                  ↗
                </motion.span>
              </div>

              {/* AREA KONTEN: Judul Tebal & Deskripsi Bersih */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Judul Kartu: Putih unhovered, Hitam pekat saat hover */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: isMobile ? '2.1rem' : 'clamp(1.9rem, 2.3vw, 2.6rem)',
                    fontWeight: '800',
                    letterSpacing: '-0.025em',
                    lineHeight: '1.1',
                    margin: '0 0 0.85rem 0',
                    color: isHovered ? '#000000' : '#ffffff',
                    transition: 'color 0.4s ease'
                  }}
                >
                  {pillar.title}
                </h3>

                {/* Deskripsi Kartu: Abu-abu Putih di Mode Biasa, Hitam Charcoal Kontras saat Background Putih Naik */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: isMobile ? '0.94rem' : 'clamp(0.9rem, 1.02vw, 1rem)',
                    lineHeight: '1.6',
                    color: isHovered ? '#18181b' : 'rgba(255, 255, 255, 0.62)',
                    margin: 0,
                    transition: 'color 0.4s ease'
                  }}
                >
                  {pillar.desc}
                </p>

                {/* Micro-Pill Tag */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '1.2rem',
                    opacity: isHovered ? 1 : 0.45,
                    transform: isHovered ? 'translateY(0)' : 'translateY(3px)',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.66rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: isHovered ? '#000000' : 'rgba(255, 255, 255, 0.45)',
                      fontWeight: '600',
                      transition: 'color 0.4s ease'
                    }}
                  >
                    • {pillar.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FOOTER MINI SECTION 3: KETERANGAN KONTINUITAS */}
      <div
        style={{
          position: 'relative',
          zIndex: 16,
          maxWidth: '1440px',
          margin: '3.5rem auto 0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontFamily: 'var(--font-mono)',
          fontSize: isMobile ? '0.68rem' : '0.78rem',
          letterSpacing: '2px',
          color: 'rgba(255, 255, 255, 0.45)',
          textTransform: 'uppercase'
        }}
      >
        <span>[ ARCHITECTURE & DIGITAL CRAFT ]</span>
        <span style={{ color: UNIFORM_BLUE }}>• KINETIC CODE • SPATIAL WEB • AI INTEGRATION •</span>
        <span>© 2026 BILLEAN UJI PRAKASA</span>
      </div>

      {/* MODAL DETAIL KETIKA KARTU DIKLIK */}
      {createPortal(
        <AnimatePresence>
          {selectedPillar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPillar(null)}
              style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                minHeight: '100dvh',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 'max(20px, env(safe-area-inset-top)) 20px max(20px, env(safe-area-inset-bottom))',
                boxSizing: 'border-box',
                overflowY: 'auto'
              }}
            >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '560px',
                maxHeight: 'calc(100dvh - 40px)',
                overflowY: 'auto',
                backgroundColor: '#0d0d12',
                border: `1px solid ${UNIFORM_BLUE}`,
                boxShadow: `0 30px 80px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 255, 255, 0.1)`,
                borderRadius: '16px',
                padding: isMobile ? '2rem' : '2.8rem',
                boxSizing: 'border-box',
                color: '#ffffff'
              }}
            >
              {/* Header Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    color: UNIFORM_BLUE,
                    fontWeight: '700'
                  }}
                >
                  {selectedPillar.num} // {selectedPillar.tag}
                </span>
                <button
                  onClick={() => setSelectedPillar(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Title Modal */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  margin: '0 0 1rem 0',
                  letterSpacing: '-0.025em'
                }}
              >
                {selectedPillar.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '2rem'
                }}
              >
                {selectedPillar.desc}
              </p>

              {/* Detail Items */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '2px',
                    color: UNIFORM_BLUE,
                    textTransform: 'uppercase',
                    marginBottom: '1rem'
                  }}
                >
                  Key Methodologies & Practices:
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedPillar.details.map((detail, dIdx) => (
                    <li
                      key={dIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.94rem',
                        lineHeight: '1.5',
                        color: 'rgba(255, 255, 255, 0.85)'
                      }}
                    >
                      <span style={{ color: UNIFORM_BLUE, marginTop: '2px' }}>•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
