import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Data kalimat editorial sesuai referensi gambar
// Italic serif pada 'move,' dan 'respond' persis seperti gambar
const TEXT_DATA = {
  leann: [
    { text: "I'm" },
    { text: "Leann." },
    { text: "I" },
    { text: "design" },
    { text: "and" },
    { text: "build" },
    { text: "websites" },
    { text: "and" },
    { text: "apps" },
    { text: "that" },
    { text: "move,", italic: true },
    { text: "respond", italic: true },
    { text: "and" },
    { text: "feel" },
    { text: "good" },
    { text: "to" },
    { text: "use." },
    { text: "Designed" },
    { text: "in" },
    { text: "Figma," },
    { text: "built" },
    { text: "in" },
    { text: "code," },
    { text: "made" },
    { text: "in" },
    { text: "Jepara." },
  ],
  billean: [
    { text: "I'm" },
    { text: "Billean" },
    { text: "Uji" },
    { text: "Prakasa." },
    { text: "I" },
    { text: "design" },
    { text: "and" },
    { text: "build" },
    { text: "websites" },
    { text: "and" },
    { text: "apps" },
    { text: "that" },
    { text: "move,", italic: true },
    { text: "respond", italic: true },
    // { text: "and" },
    // { text: "feel" },
    // { text: "good" },
    // { text: "to" },
    // { text: "use." },
    { text: "Designed" },
    { text: "in" },
    { text: "Figma," },
    { text: "built" },
    { text: "in" },
    { text: "code," },
    { text: "made" },
    { text: "in" },
    { text: "Jepara." },
  ]
};

export default function EditorialIntro({ isMobile, onHover, onLeave }) {
  const [profileKey, setProfileKey] = useState('leann'); // Default 'leann' persis gambar referensi, dapat ditoggle ke 'billean'
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const timelineRef = useRef(null);

  const currentWords = TEXT_DATA[profileKey];

  const updateTimeline = () => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const words = wordsRef.current.filter(Boolean);
    if (words.length === 0) return;

    const progress = timeline.progress();
    gsap.set(words, {
      color: 'rgba(255, 255, 255, 0.16)',
      opacity: 0.35
    });
    timeline.clear();

    const revealDuration = 11.5;
    const wordDuration = revealDuration / words.length;
    words.forEach((wordEl, index) => {
      timeline.to(
        wordEl,
        {
          color: '#ffffff',
          opacity: 1,
          duration: wordDuration,
          ease: 'power1.inOut'
        },
        index * wordDuration
      );
    });
    timeline.to({}, { duration: 1.2 }, revealDuration);
    timeline.progress(progress);
  };

  useLayoutEffect(() => {
    updateTimeline();
  }, [profileKey]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // PIN THE SECTION: Section tetap diam/terkunci di layar saat di-scroll
      // Yang bergerak maju adalah teksnya yang satu per satu berubah menjadi putih terang
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: isMobile ? '+=160%' : '+=220%', // Jarak scroll selama section terkunci diam di layar
          pin: true, // TRUE PINNING: Section tidak bergeser sama sekali selama animasi berjalan
          pinSpacing: true, // Membuat spacer di DOM sehingga section berikutnya tidak bertubrukan
          scrub: 0.8, // Halus dan sinkron 1:1 dengan scroll
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.round(self.progress * 100);
            setScrollProgress((current) => current === next ? current : next);
          }
        }
      });
      timelineRef.current = tl;
      updateTimeline();
    }, section);

    // Refresh ScrollTrigger agar kalkulasi posisi presisi
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      timelineRef.current = null;
    };
  }, [isMobile]);

  return (
    <section
      id="section-editorial"
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 45,
        backgroundColor: '#050505',
        width: '100%',
        height: 'auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: isMobile ? '1.5rem' : '2rem',
        padding: isMobile ? '5.5rem 1.5rem 2rem' : '6.5rem 8vw 3rem',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Architectural Grid Texture */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
          opacity: 0.4
        }}
      />

      {/* Shadow Vignette Atas (Mencegah tabrakan visual dari section sebelumnya) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, #050505 0%, rgba(5, 5, 5, 0.85) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 4
        }}
      />

      {/* Shadow Vignette Bawah */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to top, #050505 0%, rgba(5, 5, 5, 0.85) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 4
        }}
      />

      {/* TOP META BAR: in normal flow so it cannot overlap the statement text */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '24px',
          flexShrink: 0
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
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
            [ 04 / STATEMENT & PHILOSOPHY ]
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              color: 'rgba(255, 255, 255, 0.45)',
              marginTop: '4px'
            }}
          >
            Personal statement • Design and development philosophy
          </div>
        </div>

        {/* Quick Toggle: Leann (Gambar Referensi) vs Billean (Portofolio Anda) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px 6px',
            borderRadius: '0',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <button
            onClick={() => setProfileKey('leann')}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            title="Tampilkan teks persis gambar referensi (Leann - Jepara)"
            style={{
              background: profileKey === 'leann' ? '#ffffff' : 'transparent',
              color: profileKey === 'leann' ? '#000000' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              borderRadius: '16px',
              padding: '4px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: '700',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            LEANN
          </button>
          <button
            onClick={() => setProfileKey('billean')}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            title="Tampilkan identitas portofolio Billean (Indonesia)"
            style={{
              background: profileKey === 'billean' ? '#ffffff' : 'transparent',
              color: profileKey === 'billean' ? '#000000' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              borderRadius: '16px',
              padding: '4px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: '700',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            BILLEAN
          </button>
        </div>
      </div>

      {/* KONTEN TEKS UTAMA: Tipografi Persis Referensi Gambar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 'clamp(1.6rem, 7.2vw, 2.5rem)' : 'clamp(2.8rem, 4.8vw, 4.9rem)',
          fontWeight: '700',
          lineHeight: isMobile ? '1.16' : '1.18',
          letterSpacing: '-0.03em',
          userSelect: 'none',
          flex: '0 1 auto'
        }}
      >
        {currentWords.map((item, idx) => (
          <span
            key={`${profileKey}-${idx}`}
            ref={(el) => (wordsRef.current[idx] = el)}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              marginBottom: '0.08em',
              color: 'rgba(255, 255, 255, 0.16)', // Awalnya gelap pekat
              opacity: 0.35,
              fontStyle: item.italic ? 'italic' : 'normal',
              fontFamily: item.italic
                ? "'Instrument Serif', 'Playfair Display', Georgia, serif"
                : 'var(--font-display)',
              fontWeight: item.italic ? '400' : '700',
              willChange: 'color, opacity',
              transition: 'filter 0.3s ease'
            }}
          >
            {item.text}
          </span>
        ))}
      </div>

      {/* BOTTOM STATUS BAR: Indikator Interaktif Progres Scroll */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: 0,
          width: '100%',
          maxWidth: '1280px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.2rem',
          flexShrink: 0
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.62rem' : '0.74rem',
            letterSpacing: '2px',
            color: 'rgba(255, 255, 255, 0.4)',
            textTransform: 'uppercase'
          }}
        >
          <span>SCROLL TO ILLUMINATE</span>
          <div
            style={{
              width: isMobile ? '60px' : '100px',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
                width: `${scrollProgress}%`,
                backgroundColor: '#ffffff',
                transition: 'width 0.1s linear'
              }}
            />
          </div>
          <span style={{ color: '#ffffff', fontWeight: '600' }}>{scrollProgress}%</span>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.62rem' : '0.74rem',
            letterSpacing: '2px',
            color: 'rgba(255, 255, 255, 0.35)',
            textTransform: 'uppercase'
          }}
        >
          [ PINNED SCROLL STATEMENT ]
        </div>
      </div>
    </section>
  );
}
