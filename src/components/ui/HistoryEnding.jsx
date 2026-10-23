import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { apiUrl } from '../../lib/portfolioApi.js';

// Data 4 Akun Media Sosial dengan Logo Vektor Resmi
const SOCIAL_FLOATING_LOGOS = [
  {
    id: "github",
    name: "GITHUB",
    handle: "@BILLEAN",
    url: "https://github.com",
    position: { top: "16%", left: "12%" }, // Di sekitar atas-kiri tulisan
    floatClass: "float-orbit-1",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    )
  },
  {
    id: "linkedin",
    name: "LINKEDIN",
    handle: "CONNECT ↗",
    url: "https://linkedin.com",
    position: { top: "18%", right: "12%" }, // Di sekitar atas-kanan tulisan
    floatClass: "float-orbit-2",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
      </svg>
    )
  },
  {
    id: "tiktok",
    name: "TIKTOK",
    handle: "@LEANN_DEV",
    url: "https://tiktok.com",
    position: { bottom: "18%", left: "14%" }, // Di sekitar bawah-kiri tulisan
    floatClass: "float-orbit-3",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.54c-.03 2.12-.76 4.29-2.23 5.8-1.57 1.64-3.87 2.44-6.11 2.37-2.35-.05-4.66-1.11-6.15-2.9-1.5-1.8-2.09-4.29-1.67-6.57.42-2.36 1.94-4.45 4.02-5.45 1.54-.75 3.32-.88 4.97-.47v4.16c-1.02-.38-2.2-.31-3.13.25-.92.54-1.52 1.53-1.57 2.6-.07 1.1.48 2.22 1.43 2.81.93.59 2.17.61 3.12.06.94-.53 1.5-1.56 1.52-2.63l.02-14.99z"/>
      </svg>
    )
  },
  {
    id: "instagram",
    name: "INSTAGRAM",
    handle: "@BILLEAN.UP",
    url: "https://instagram.com",
    position: { bottom: "18%", right: "14%" }, // Di sekitar bawah-kanan tulisan
    floatClass: "float-orbit-4",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    )
  }
];

export default function HistoryEnding({
  expansionProgress, // 0.0 -> 1.0 (lingkaran membesar saat jalur mentok)
  isFullyActive,     // true saat lingkaran telah memenuhi layar
  isMobile,
  onHover,
  onLeave,
  contactEmail
}) {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const connectRef = useRef(null);
  const headingRef = useRef(null);
  const tooltipX = useMotionValue(18);
  const tooltipY = useMotionValue(18);

  // Posisi kursor mouse untuk efek hidup 3D pada teks & tooltip
  const [isHoveringConnect, setIsHoveringConnect] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [sentMessage, setSentMessage] = useState('');

  // Hitung radius lingkaran membesar: dari 0% hingga 160% (memenuhi layar penuh)
  const portalRadius = Math.min(160, Math.pow(expansionProgress, 2.2) * 160);
  const isVisible = expansionProgress > 0.02;

  // Track mouse coordinates
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const deltaX = (x - rect.width / 2) / (rect.width / 2);
    const deltaY = (y - rect.height / 2) / (rect.height / 2);

    if (glowRef.current) {
      glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
    if (connectRef.current) {
      connectRef.current.style.transform = `perspective(1000px) rotateX(${-deltaY * 18}deg) rotateY(${deltaX * 22}deg) translateZ(10px)`;
    }
    if (headingRef.current) {
      headingRef.current.style.textShadow = `
        ${-deltaX * 28}px ${-deltaY * 28}px 60px rgba(255, 255, 255, 0.45),
        0 0 100px rgba(255, 255, 255, 0.25)
      `;
    }
    tooltipX.set(x + 18);
    tooltipY.set(y + 18);
  };

  // Close form with ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsFormOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok && !result.sent) throw new Error(result.error || 'Pesan gagal dikirim. Silakan coba lagi.');
      setIsSent(true);
      setSentMessage(result.message || result.error || 'Pesan berhasil dikirim.');
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      id="section-contact"
      className="contact-portal"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 60,
        overflow: 'hidden',
        pointerEvents: isFullyActive ? 'auto' : 'none',
        // CIRCLUAR PORTAL EXPANSION: Membesar dari tengah layar seiring scroll hingga memenuhi layar
        clipPath: `circle(${portalRadius}% at 50% 50%)`,
        WebkitClipPath: `circle(${portalRadius}% at 50% 50%)`,
        backgroundColor: '#050505',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        cursor: 'default'
      }}
    >
      {/* Cincin Cahaya Putih Saat Lingkaran Membesar */}
      {expansionProgress < 0.98 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${portalRadius * 2}vw`,
            height: `${portalRadius * 2}vw`,
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 0 60px rgba(255, 255, 255, 0.95), inset 0 0 50px rgba(255, 255, 255, 0.5)',
            pointerEvents: 'none',
            zIndex: 65
          }}
        />
      )}

      {/* Grid Arsitektural Halus di Latar Belakang */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Pendaran Cahaya Dinamis Mengikuti Kursor */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 65%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 2,
          transition: 'width 0.2s, height 0.2s'
        }}
      />

      {/* ========================================================================= */}
      {/* 4 LOGO MEDIA SOSIAL MELAYANG-LAYANG DI SEKITAR TULISAN                    */}
      {/* ========================================================================= */}
      {SOCIAL_FLOATING_LOGOS.map((soc) => {
        // Efek magnetik ringan: logo tertarik ke kursor saat kursor mendekat
        return (
          <a
            key={soc.id}
            href={soc.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            aria-label={soc.name}
            className={`floating-social-badge ${soc.floatClass}`}
            style={{
              position: 'absolute',
              ...soc.position,
              zIndex: 30,
              width: isMobile ? '58px' : '76px',
              height: isMobile ? '58px' : '76px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              textDecoration: 'none',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s, box-shadow 0.3s'
            }}
          >
            {soc.icon}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.52rem',
                letterSpacing: '1px',
                marginTop: '4px',
                opacity: 0.8,
                fontWeight: '700'
              }}
            >
              {soc.name}
            </span>
          </a>
        );
      })}

      {/* ========================================================================= */}
      {/* TULISAN BESAR: "LET'S CONNECT" YANG SEAKAN-AKAN HIDUP SAAT KURSOR DIGERAKKAN */}
      {/* ========================================================================= */}
      <div
        onMouseEnter={() => {
          setIsHoveringConnect(true);
          onHover();
        }}
        onMouseLeave={() => {
          setIsHoveringConnect(false);
          onLeave();
        }}
        onClick={() => {
          setIsSent(false);
          setFormError('');
          setSentMessage('');
          setIsFormOpen(true);
        }}
        ref={connectRef}
        style={{
          position: 'relative',
          zIndex: 20,
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(10px)',
          transition: 'transform 0.15s ease-out'
        }}
      >
        <h1
          ref={headingRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 'clamp(3.8rem, 15vw, 6rem)' : 'clamp(6rem, 13vw, 12.5rem)',
            fontWeight: '900',
            lineHeight: '0.88',
            letterSpacing: '-0.045em',
            margin: 0,
            color: '#ffffff',
            textAlign: 'center',
            textTransform: 'uppercase',
            textShadow: '0 0 60px rgba(255, 255, 255, 0.45), 0 0 100px rgba(255, 255, 255, 0.25)',
            transition: 'text-shadow 0.15s ease-out'
          }}
        >
          <div>LET'S</div>
          <div>CONNECT</div>
        </h1>

        {/* Micro-cue sublabel */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.72rem' : '0.85rem',
            letterSpacing: '4px',
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            marginTop: isMobile ? '1.5rem' : '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff', boxShadow: '0 0 8px #ffffff' }} />
          CLICK TO TRANSMIT MESSAGE
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUSTOM CURSOR TOOLTIP: TULISAN "LETSGO" MENGAPUNG TEPAT DI KURSOR          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isHoveringConnect && !isFormOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              x: tooltipX,
              y: tooltipY,
              pointerEvents: 'none',
              zIndex: 9999,
              backgroundColor: '#ffffff',
              color: '#050505',
              padding: '8px 18px',
              borderRadius: '30px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: '900',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.9), 0 10px 30px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>LETSGO</span>
            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>↗</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL EMAIL FORM (MUNCUL KETIKA LET'S CONNECT DIKLIK)                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="contact-form-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFormOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              zIndex: 10000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              boxSizing: 'border-box'
            }}
          >
            <motion.div
              className="contact-form-card"
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '560px',
                backgroundColor: '#0c0c10',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: isMobile ? '2rem 1.6rem' : '2.8rem 2.8rem',
                boxSizing: 'border-box',
                color: '#ffffff',
                position: 'relative'
              }}
            >
              {/* Header Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.8rem' }}>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      letterSpacing: '2px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}
                  >
                    [ DIRECT CONTACT FORM ]
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isMobile ? '1.8rem' : '2.3rem',
                      fontWeight: '800',
                      letterSpacing: '-0.025em',
                      margin: 0
                    }}
                  >
                    Send a Message
                  </h3>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsFormOpen(false)}
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'all 0.25s'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  name="website"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px' }}
                />
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '1.5px',
                      color: 'rgba(255, 255, 255, 0.65)',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}
                  >
                    YOUR NAME OR STUDIO
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe / Studio Acme"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '1.5px',
                      color: 'rgba(255, 255, 255, 0.65)',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '1.5px',
                      color: 'rgba(255, 255, 255, 0.65)',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}
                  >
                    YOUR MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan tentang proyek, ide kolaborasi, atau kebutuhan sistem web Anda..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.94rem',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
                  />
                </div>

                {/* Submit Action */}
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting || isSent}
                    onMouseEnter={onHover}
                    onMouseLeave={onLeave}
                    style={{
                      padding: '15px 28px',
                      backgroundColor: isSent ? '#ffffff' : '#ffffff',
                      color: '#050505',
                      border: 'none',
                      borderRadius: '40px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span>
                      {isSent
                        ? "✓ MESSAGE SENT"
                        : isSubmitting
                        ? "TRANSMITTING..."
                        : "TRANSMIT MESSAGE ↗"}
                    </span>
                  </button>

                  {formError && <p role="alert" style={{ margin: 0, color: '#ffaaa8', fontSize: '0.85rem' }}>{formError}</p>}
                  {isSent && (
                    <p role="status" style={{ margin: 0, color: '#aaffc5', fontSize: '0.85rem', textAlign: 'center' }}>
                      {sentMessage}
                    </p>
                  )}

                  <a
                    href={contactEmail ? `mailto:${contactEmail}` : undefined}
                    aria-disabled={!contactEmail}
                    style={{
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'rgba(255, 255, 255, 0.45)',
                      textDecoration: 'none',
                      marginTop: '4px'
                    }}
                  >
                    {contactEmail ? <>Atau kirim langsung via surel: <strong style={{ color: '#ffffff' }}>{contactEmail}</strong></> : 'Email kontak belum diatur.'}
                  </a>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS Animasi Floating Orbit untuk Logo Media Sosial */}
      <style>{`
        @keyframes floatOrbit1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-14px, -18px) rotate(-6deg);
          }
        }
        @keyframes floatOrbit2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(18px, -14px) rotate(8deg);
          }
        }
        @keyframes floatOrbit3 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-16px, 16px) rotate(6deg);
          }
        }
        @keyframes floatOrbit4 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(14px, 18px) rotate(-8deg);
          }
        }
        .float-orbit-1 {
          animation: floatOrbit1 6.5s ease-in-out infinite;
        }
        .float-orbit-2 {
          animation: floatOrbit2 7.2s ease-in-out infinite;
        }
        .float-orbit-3 {
          animation: floatOrbit3 6.8s ease-in-out infinite;
        }
        .float-orbit-4 {
          animation: floatOrbit4 7.6s ease-in-out infinite;
        }
        .floating-social-badge:hover {
          animation-play-state: paused;
          transform: scale(1.18) !important;
          border-color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.16) !important;
          box-shadow: 0 0 35px rgba(255, 255, 255, 0.8), 0 15px 40px rgba(0, 0, 0, 0.8) !important;
        }
      `}</style>
    </div>
  );
}
