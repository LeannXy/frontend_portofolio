import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Data 4 Pilar Disiplin Desainer Tingkat Lanjut
const CAPABILITY_PILLARS = [
  {
    id: 0,
    num: "01",
    tag: "SPATIAL & GPU COMPUTING",
    title: "Spatial Shaders & WebGL Real-time",
    shortDesc: "Menciptakan kedalaman volumetrik, material transmisi fisik, dan deformasi mesh GPU 60 FPS tanpa jeda frame.",
    color: "#10b981",
    colorBg: "rgba(16, 185, 129, 0.08)",
    colorBorder: "rgba(16, 185, 129, 0.35)",
    specs: ["GLSL Shaders", "Raymarching", "Instanced Mesh", "Volumetric Fog"],
    blueprint: {
      philosophy: "Grafis web modern bukan sekadar gambar statis, melainkan simulasi matematis cahaya dan geometri yang bereaksi secara real-time.",
      architecture: "Custom Vertex/Fragment Pipeline • Three.js r186 • Offscreen Canvas Rendering • Zero GC Allocation",
      codeSample: `// GPU Volumetric Wave Function
vec3 pos = position;
float wave = sin(uTime * 2.0 + pos.x * 1.5) * cos(pos.z * 1.2);
pos.y += wave * 0.45;
gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);`
    }
  },
  {
    id: 1,
    num: "02",
    tag: "MICRO-PHYSICS & GESTURES",
    title: "Kinetic Interaction Architecture",
    shortDesc: "Merancang gerak yang memiliki massa, kelembaman, dan tensi elastis. Setiap sentuhan terasa hidup dan presisi.",
    color: "#38bdf8",
    colorBg: "rgba(56, 189, 248, 0.08)",
    colorBorder: "rgba(56, 189, 248, 0.35)",
    specs: ["Spring Dynamics", "Hermite Curves", "Magnetic Anchors", "Lenis Engine"],
    blueprint: {
      philosophy: "Interaksi harus memiliki 'bobot fisik'. Tahanan elastis dan peluruhan eksponensial menciptakan kepuasan taktil bagi pengguna.",
      architecture: "Damped Harmonic Oscillator • Spring Vector Matrix • Pointer Velocity Interpolation",
      codeSample: `// Elastic Damping Math
const force = -stiffness * (current - target);
const dampingForce = -damping * velocity;
const acceleration = (force + dampingForce) / mass;
velocity += acceleration * delta;`
    }
  },
  {
    id: 2,
    num: "03",
    tag: "ENTERPRISE SOFTWARE ENGINE",
    title: "High-Throughput Systems & Architecture",
    shortDesc: "Menjembatani estetika avant-garde dengan ketangguhan rekayasa perangkat lunak enterprise berstandar PPLG.",
    color: "#f59e0b",
    colorBg: "rgba(245, 158, 11, 0.08)",
    colorBorder: "rgba(245, 158, 11, 0.35)",
    specs: ["Modular Architecture", "Zero Memory Leaks", "State Machine", "Clean Core"],
    blueprint: {
      philosophy: "Visual yang memukau tidak berarti apa-apa tanpa arsitektur kode yang bersih, bebas kebocoran memori, dan mudah di-maintain.",
      architecture: "Separation of Concerns • Event-Driven State Bus • Async Asset Preload Pipeline",
      codeSample: `// Micro-Telemetry Dispatcher
class KernelTelemetry {
  dispatch(signal, payload) {
    performance.mark(signal);
    this.bus.emit(signal, { ...payload, t: performance.now() });
  }
}`
    }
  },
  {
    id: 3,
    num: "04",
    tag: "SIMULATION & GAME TECH",
    title: "Procedural Topologies & ECS Engine",
    shortDesc: "Penerapan pola Entity-Component-System industri gim ke WebGL spasial untuk simulasi ribuan partikel simultan.",
    color: "#a855f7",
    colorBg: "rgba(168, 85, 247, 0.08)",
    colorBorder: "rgba(168, 85, 247, 0.35)",
    specs: ["ECS Pattern", "Spatial Hashing", "Simplex Noise", "Web Audio Sync"],
    blueprint: {
      philosophy: "Mekanika gim menghadirkan daya tarik intrinsik. Menggunakan teknik komputasi gim untuk membangun dunia digital yang tak berujung.",
      architecture: "Bitmask Component Storage • Octree Collision Partitioning • Web Audio AnalyserNode",
      codeSample: `// ECS Generative Topology Update
for (let e = 0; e < entityCount; e++) {
  const noiseVal = simplex3(pos[e*3]*0.1, pos[e*3+1]*0.1, uTime*0.05);
  vel[e*3+1] += noiseVal * 0.02;
}`
    }
  }
];

// Interactive Micro-Widget 01: Waveform Shaders
function WaveformCanvas({ color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const render = () => {
      t += 0.035;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Gambar 3 gelombang harmonik
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.lineWidth = j === 0 ? 2 : 1;
        ctx.strokeStyle = j === 0 ? color : 'rgba(255,255,255,0.25)';

        for (let x = 0; x < w; x += 3) {
          const y = h / 2 + Math.sin(x * 0.04 + t + j * 0.8) * (18 - j * 4) * Math.cos(t * 0.5 + x * 0.01);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      width={260}
      height={85}
      style={{ width: '100%', height: '85px', display: 'block', borderRadius: '8px', background: 'rgba(0,0,0,0.35)' }}
    />
  );
}

// Interactive Micro-Widget 02: Magnetic Spring Slider
function SpringInteractiveWidget({ color }) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(-60, Math.min(60, e.clientX - (rect.left + rect.width / 2)));
    setOffset(x);
  };

  const handleRelease = () => {
    setIsDragging(false);
    // Pegas memantul kembali ke 0
    let current = offset;
    let v = -current * 0.35;
    const interval = setInterval(() => {
      v += -current * 0.25;
      v *= 0.72;
      current += v;
      setOffset(current);
      if (Math.abs(current) < 0.2 && Math.abs(v) < 0.2) {
        setOffset(0);
        clearInterval(interval);
      }
    }, 16);
  };

  return (
    <div
      onPointerDown={() => setIsDragging(true)}
      onPointerMove={handlePointerMove}
      onPointerUp={handleRelease}
      onPointerLeave={handleRelease}
      style={{
        width: '100%',
        height: '85px',
        background: 'rgba(0,0,0,0.35)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'grab',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Garis Tensi Pegas */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '20%',
        right: '20%',
        height: '2px',
        backgroundColor: 'rgba(255,255,255,0.15)'
      }} />

      {/* Titik Pegas Magnetik yang Dapat Ditarik */}
      <motion.div
        animate={{ x: offset }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#050505',
          border: `2px solid ${color}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: `0 0 16px ${color}66`,
          position: 'relative',
          zIndex: 2
        }}
      >
        <span style={{ fontSize: '10px', color: '#fff', fontFamily: 'var(--font-mono)' }}>↔</span>
      </motion.div>
      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
        DRAG & RELEASE TO TEST ELASTIC SPRING
      </span>
    </div>
  );
}

// Interactive Micro-Widget 03: Live Interactive Terminal Console
function TerminalWidget({ color }) {
  const [output, setOutput] = useState("System ready. Click command below.");

  const runCommand = (cmd) => {
    if (cmd === 'fps') setOutput("GPU Thread: 60.0 FPS [Frame Time: 16.6ms]");
    else if (cmd === 'stack') setOutput("Stack: React 19 • Three.js • GLSL • GSAP • Lenis");
    else if (cmd === 'mem') setOutput("WebGL Memory: 0 Leaks • Heap: 36.2 MB Stable");
  };

  return (
    <div style={{
      width: '100%',
      height: '85px',
      background: 'rgba(5, 5, 8, 0.65)',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '8px 12px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-mono)',
      fontSize: '11px'
    }}>
      <div style={{ color: color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {`> ${output}`}
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {['fps', 'stack', 'mem'].map((cmd) => (
          <button
            key={cmd}
            onClick={(e) => { e.stopPropagation(); runCommand(cmd); }}
            style={{
              padding: '2px 8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer'
            }}
          >
            ${cmd}
          </button>
        ))}
      </div>
    </div>
  );
}

// Interactive Micro-Widget 04: Generative Particle Grid
function ParticleGridWidget({ color }) {
  const [activeCell, setActiveCell] = useState(null);

  return (
    <div
      style={{
        width: '100%',
        height: '85px',
        background: 'rgba(0,0,0,0.35)',
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '4px',
        padding: '8px',
        boxSizing: 'border-box',
        alignItems: 'center'
      }}
    >
      {Array.from({ length: 36 }).map((_, i) => (
        <div
          key={i}
          onMouseEnter={() => setActiveCell(i)}
          onMouseLeave={() => setActiveCell(null)}
          style={{
            height: '8px',
            borderRadius: '2px',
            backgroundColor: activeCell === i ? color : (activeCell !== null && Math.abs(activeCell - i) < 3 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'),
            transition: 'background-color 0.2s ease, transform 0.2s ease',
            transform: activeCell === i ? 'scale(1.4)' : 'scale(1)'
          }}
        />
      ))}
    </div>
  );
}

export default function CapabilitiesLab({ onHoverCard, onHover, onLeave, isMobile, contactEmail = '' }) {
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);

  // Efek kemiringan 3D gyroskopik pada kartu saat mouse digerakkan
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    card.style.setProperty('--cursor-x', `${x}px`);
    card.style.setProperty('--cursor-y', `${y}px`);
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section
      id="section-capabilities"
      style={{
        position: 'relative',
        minHeight: '120vh',
        padding: isMobile ? '80px 20px 120px' : '120px 60px 160px',
        boxSizing: 'border-box',
        zIndex: 20,
        pointerEvents: 'auto',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* 1. TRANSITION PORTAL & KINETIC HEADER */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'left' }}>
        {/* Status Pill Header */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: isMobile ? '0.65rem' : '0.76rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '5px 14px',
          borderRadius: '100px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          background: 'rgba(10, 10, 15, 0.55)',
          backdropFilter: 'blur(12px)',
          marginBottom: '20px'
        }}>
          <span className="pulse-dot" style={{ backgroundColor: '#10b981' }} />
          <span>[ SECTION 03 // ARCHITECTURE & CAPABILITIES ]</span>
        </div>

        {/* Monumental Editorial Headline */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? 'clamp(2.2rem, 9vw, 3.4rem)' : 'clamp(3.2rem, 5.2vw, 5.4rem)',
              fontWeight: '900',
              lineHeight: '0.96',
              letterSpacing: '-0.035em',
              margin: 0,
              textTransform: 'none'
            }}>
              ENGINEERING<br />
              <span style={{
                background: 'linear-gradient(90deg, #ffffff 0%, #10b981 50%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                SENSORY DEPTH.
              </span>
            </h2>
          </div>

          {/* Telemetry Indicator Spec */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '0.7rem' : '0.8rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: '1.7',
            maxWidth: '380px'
          }}>
            <div>• RUNTIME: WEBGL 2.0 / THREE.JS R186</div>
            <div>• ARCHITECTURE: MODULAR KINETIC SHADERS</div>
            <div>• PHILOSOPHY: LOGICAL RIGOR × PURE INTELLECT</div>
          </div>
        </div>

        {/* 2. INFINITE MARQUEE TICKER (TICKER DUA ARAH) */}
        <div style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          padding: '14px 0',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '50px',
          fontFamily: 'var(--font-mono)',
          fontSize: isMobile ? '0.72rem' : '0.82rem',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          display: 'flex',
          gap: '20px'
        }}>
          <div className="marquee-track" style={{ display: 'inline-flex', gap: '30px' }}>
            <span>/// 01 SPATIAL COMPUTING</span>
            <span>• 02 GPU SHADER MATH</span>
            <span>• 03 KINETIC MICRO-PHYSICS</span>
            <span>• 04 PPLG ENTERPRISE ARCHITECTURE</span>
            <span>• 05 GAME ECS ENGINES</span>
            <span>• 06 REALTIME AUDIO VISUALS ///</span>
          </div>
          <div className="marquee-track" style={{ display: 'inline-flex', gap: '30px' }}>
            <span>/// 01 SPATIAL COMPUTING</span>
            <span>• 02 GPU SHADER MATH</span>
            <span>• 03 KINETIC MICRO-PHYSICS</span>
            <span>• 04 PPLG ENTERPRISE ARCHITECTURE</span>
            <span>• 05 GAME ECS ENGINES</span>
            <span>• 06 REALTIME AUDIO VISUALS ///</span>
          </div>
        </div>

        {/* 3. BENTO GRID 4 PILAR DESAINER TINGKAT LANJUT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '24px'
        }}>
          {CAPABILITY_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="capability-card"
              onMouseEnter={() => {
                onHover();
                if (onHoverCard) onHoverCard(pillar.id);
              }}
              onMouseLeave={(e) => {
                onLeave();
                handleCardMouseLeave(e);
                if (onHoverCard) onHoverCard(null);
              }}
              onMouseMove={handleCardMouseMove}
              style={{
                position: 'relative',
                background: 'rgba(12, 12, 16, 0.65)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: isMobile ? '24px' : '32px',
                boxSizing: 'border-box',
                transition: 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
            >
              {/* Efek Spotlight Kursor Hologram */}
              <div
                className="card-spotlight"
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: `radial-gradient(circle at var(--cursor-x, 50%) var(--cursor-y, 50%), ${pillar.color}22 0%, transparent 60%)`,
                  opacity: 0.8
                }}
              />

              {/* Header Kartu: Nomor & Tag */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    color: pillar.color,
                    letterSpacing: '1px'
                  }}>
                    {pillar.num}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    letterSpacing: '2px',
                    padding: '3px 10px',
                    borderRadius: '100px',
                    border: `1px solid ${pillar.colorBorder}`,
                    color: pillar.color,
                    backgroundColor: pillar.colorBg,
                    textTransform: 'uppercase'
                  }}>
                    {pillar.tag}
                  </span>
                </div>

                {/* Judul Pilar */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? '1.4rem' : '1.75rem',
                  fontWeight: '800',
                  lineHeight: '1.15',
                  margin: '0 0 10px 0',
                  color: '#ffffff',
                  letterSpacing: '-0.02em'
                }}>
                  {pillar.title}
                </h3>

                {/* Deskripsi Singkat */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: isMobile ? '0.86rem' : '0.92rem',
                  color: 'rgba(255, 255, 255, 0.72)',
                  lineHeight: '1.58',
                  margin: 0
                }}>
                  {pillar.shortDesc}
                </p>
              </div>

              {/* Micro-Interactive Element Sesuai Pilar */}
              <div style={{ marginTop: '6px' }}>
                {pillar.id === 0 && <WaveformCanvas color={pillar.color} />}
                {pillar.id === 1 && <SpringInteractiveWidget color={pillar.color} />}
                {pillar.id === 2 && <TerminalWidget color={pillar.color} />}
                {pillar.id === 3 && <ParticleGridWidget color={pillar.color} />}
              </div>

              {/* Footer Kartu: Specs Pills & Tombol Inspect Blueprint */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {pillar.specs.slice(0, isMobile ? 2 : 3).map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.66rem',
                        color: 'rgba(255,255,255,0.5)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlueprint(pillar);
                  }}
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: pillar.color,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 0'
                  }}
                >
                  <span>Blueprint</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MODAL BLUEPRINT DOSSIER ARSITEKTUR */}
      <AnimatePresence>
        {selectedBlueprint && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              zIndex: 999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              boxSizing: 'border-box'
            }}
            onClick={() => setSelectedBlueprint(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '680px',
                backgroundColor: '#0a0a0f',
                border: `1px solid ${selectedBlueprint.colorBorder}`,
                borderRadius: '20px',
                padding: isMobile ? '24px' : '36px',
                boxSizing: 'border-box',
                boxShadow: `0 20px 60px rgba(0,0,0,0.9), 0 0 50px ${selectedBlueprint.color}22`,
                color: 'white',
                position: 'relative'
              }}
            >
              {/* Header Blueprint */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: '800', color: selectedBlueprint.color }}>
                    {selectedBlueprint.num}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.6)' }}>
                    ARCHITECTURAL BLUEPRINT
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBlueprint(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Judul Blueprint */}
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? '1.6rem' : '2.1rem',
                fontWeight: '900',
                margin: '0 0 16px 0',
                color: '#ffffff'
              }}>
                {selectedBlueprint.title}
              </h3>

              {/* Filosofi Desain & Rekayasa */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: selectedBlueprint.color, letterSpacing: '1.5px', marginBottom: '6px' }}>
                  // CORE PHILOSOPHY
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.94rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                  {selectedBlueprint.blueprint.philosophy}
                </p>
              </div>

              {/* Arsitektur Stack */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: selectedBlueprint.color, letterSpacing: '1.5px', marginBottom: '6px' }}>
                  // ARCHITECTURE PIPELINE
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: '#ffffff', background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {selectedBlueprint.blueprint.architecture}
                </div>
              </div>

              {/* Cuplikan Kode / Implementasi Logika */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: selectedBlueprint.color, letterSpacing: '1.5px', marginBottom: '6px' }}>
                  // CODE SIGNATURE
                </div>
                <pre style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  lineHeight: '1.5',
                  color: 'rgba(255,255,255,0.9)',
                  background: '#040406',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  overflowX: 'auto',
                  margin: 0
                }}>
                  <code>{selectedBlueprint.blueprint.codeSample}</code>
                </pre>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <a
                  href={contactEmail ? `mailto:${contactEmail}` : undefined}
                  aria-disabled={!contactEmail}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: selectedBlueprint.color,
                    color: '#050505',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                    fontSize: '0.76rem',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Initiate Collaboration</span>
                  <span>↗</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
