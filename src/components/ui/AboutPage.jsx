import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Komponen 3D Interaktif untuk Halaman About (Cybernetic PPLG Core)
function CyberCore({ activeMode }) {
  const meshRef = useRef();
  const wireRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.3;
      wireRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
      <group>
        {/* Core Geometry */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[2.2, 0]} />
          <MeshDistortMaterial
            color={activeMode === 'software' ? '#3b82f6' : '#10b981'}
            emissive={activeMode === 'software' ? '#1d4ed8' : '#047857'}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
            distort={0.35}
            speed={2}
          />
        </mesh>

        {/* Outer Wireframe Cage (Simbol Logika PPLG & Struktur Game Mesh) */}
        <mesh ref={wireRef}>
          <octahedronGeometry args={[3.2, 0]} />
          <meshBasicMaterial
            wireframe
            color={activeMode === 'software' ? '#93c5fd' : '#6ee7b7'}
            transparent
            opacity={0.35}
          />
        </mesh>

        <pointLight
          color={activeMode === 'software' ? '#ffffff' : '#34d399'}
          intensity={3}
          distance={10}
        />
      </group>
    </Float>
  );
}

export default function AboutPage({ onBackToHome, isMobile, onHover, onLeave }) {
  // Pilihan Mode Dual PPLG: 'software' (Perangkat Lunak) vs 'game' (Gim & Interaktivitas)
  const [activeMode, setActiveMode] = useState('software');
  const [terminalOutput, setTerminalOutput] = useState([
    "Billean OS v2.6.0 [PPLG Kernel Loaded]",
    "Identity: Billean Uji Prakasa",
    "Specialization: Software Engineering × Game Mechanics",
    "Status: System Operational • Ready for exploration"
  ]);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all');

  const handleCommand = (cmd) => {
    if (cmd === 'clear') {
      setTerminalOutput([]);
      return;
    }
    let response = "";
    if (cmd === 'vision') {
      response = "VISI: Membuktikan bahwa talenta PPLG Indonesia mampu menciptakan pengalaman web interaktif kelas dunia standar Awwwards.";
    } else if (cmd === 'stack') {
      response = "STACK: React 19, Three.js, R3F, GSAP, TypeScript, GLSL Shaders, Framer Motion, Lenis.";
    } else if (cmd === 'game_mode') {
      setActiveMode('game');
      response = "MODE AKTIF: [GIM & SPATIAL ENGINE] — Fisika pegas, kurva bezier, dan feedback haptik diaktifkan.";
    } else if (cmd === 'software_mode') {
      setActiveMode('software');
      response = "MODE AKTIF: [REKAYASA PERANGKAT LUNAK] — Arsitektur bersih, skalabilitas kode, dan modularitas.";
    }
    setTerminalOutput((prev) => [...prev, `$ billean --${cmd}`, response]);
  };

  const skillsData = [
    { name: "Three.js / WebGL", category: "game", level: "Advanced", desc: "Simulasi 3D, koordinat spasial & visual imersif" },
    { name: "React 19 & Next.js", category: "software", level: "Expert", desc: "Arsitektur frontend modern, SSR & reactive state" },
    { name: "GSAP & ScrollTrigger", category: "game", level: "Advanced", desc: "Timeline orkestrasi & fisika scroll mulus" },
    { name: "Game Feel & Physics", category: "game", level: "Proficient", desc: "Spring kinematics, inertia & responsive haptics" },
    { name: "TypeScript / ESNext", category: "software", level: "Advanced", desc: "Type-safety, clean OOP & functional patterns" },
    { name: "Shader Programming (GLSL)", category: "game", level: "Intermediate", desc: "Efek visual matematis langsung pada GPU" },
    { name: "UI/UX & Spatial Systems", category: "design", level: "Expert", desc: "Desain Awwwards, tipografi proporsional & grid" },
    { name: "REST API & Backend Logic", category: "software", level: "Advanced", desc: "Struktur data, integrasi database & middleware" }
  ];

  const filteredSkills = selectedSkillCategory === 'all'
    ? skillsData
    : skillsData.filter((s) => s.category === selectedSkillCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      style={{
        position: 'relative',
        zIndex: 80,
        minHeight: '100vh',
        backgroundColor: '#050505',
        color: '#ffffff',
        padding: isMobile ? '6rem 1.5rem 5rem 1.5rem' : '8rem 4rem 6rem 4rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Background Ambience */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: activeMode === 'software'
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 0.8s ease'
        }}
      />

      {/* Navigasi Balik ke Home / Works */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '1.5rem'
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
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: 'white',
            padding: '10px 22px',
            borderRadius: '30px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '1.5px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease'
          }}
        >
          <span>←</span>
          <span>Kembali ke Beranda / Karya</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.6)'
        }}>
          <span>DOSSIER: PPLG-2026-BUP</span>
          <span style={{ color: activeMode === 'software' ? '#ffffff' : '#34d399' }}>● ONLINE</span>
        </div>
      </div>

      {/* HEADER SECTION: TITEL BESAR & DUAL MODE TOGGLE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
        gap: '3rem',
        alignItems: 'center',
        marginBottom: '5rem'
      }}>
        <div>
          {/* Badge Profil */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            marginBottom: '1.5rem'
          }}>
            <span className="pulse-dot" style={{ backgroundColor: activeMode === 'software' ? '#3b82f6' : '#10b981' }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)'
            }}>
              PPLG • PENGEMBANGAN PERANGKAT LUNAK & GIM
            </span>
          </div>

          {/* Heading Nama & Filosofi */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 'clamp(2.6rem, 11vw, 3.8rem)' : 'clamp(4rem, 6.5vw, 6.2rem)',
            fontWeight: '900',
            lineHeight: '1',
            letterSpacing: '-0.035em',
            margin: '0 0 1.5rem 0',
            color: '#ffffff'
          }}>
            Arsitek Kode & Pengalaman Digital.
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: isMobile ? '1rem' : '1.2rem',
            lineHeight: '1.7',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '650px',
            margin: '0 0 2rem 0'
          }}>
            Saya <strong style={{ color: '#ffffff' }}>Billean Uji Prakasa</strong>, seorang siswa dan kreator di jurusan <span style={{ color: activeMode === 'software' ? '#93c5fd' : '#6ee7b7' }}>PPLG</span>. Saya menjembatani ketepatan logika rekayasa perangkat lunak dengan sensasi interaktif dan kedalaman visual industri pengembangan gim.
          </p>

          {/* Interactive Dual-Mode Switcher */}
          <div style={{
            display: 'inline-flex',
            padding: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '40px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            gap: '8px'
          }}>
            <button
              onClick={() => { setActiveMode('software'); handleCommand('software_mode'); }}
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
              style={{
                padding: '10px 20px',
                borderRadius: '30px',
                border: 'none',
                backgroundColor: activeMode === 'software' ? '#3b82f6' : 'transparent',
                color: activeMode === 'software' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                fontWeight: '700',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              [ 01 ] Perangkat Lunak
            </button>
            <button
              onClick={() => { setActiveMode('game'); handleCommand('game_mode'); }}
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
              style={{
                padding: '10px 20px',
                borderRadius: '30px',
                border: 'none',
                backgroundColor: activeMode === 'game' ? '#10b981' : 'transparent',
                color: activeMode === 'game' ? '#050505' : 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                fontWeight: '700',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              [ 02 ] Gim & Mekanika Spasial
            </button>
          </div>
        </div>

        {/* 3D Canvas Interaktif (Cybernetic PPLG Core) */}
        <div style={{
          height: isMobile ? '300px' : '420px',
          width: '100%',
          position: 'relative',
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '1.5px',
            zIndex: 10
          }}>
            CORE ENGINE // INTERACTIVE 3D MESH
          </div>
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: activeMode === 'software' ? '#93c5fd' : '#6ee7b7',
            letterSpacing: '1px',
            zIndex: 10
          }}>
            [ ROTASI OTOMATIS & RESPON KURSOR ]
          </div>
          <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
            <ambientLight intensity={1.2} />
            <CyberCore activeMode={activeMode} />
          </Canvas>
        </div>
      </div>

      {/* SECTION 2: TIGA PILAR UTAMA (FILOSOFI PPLG BILLEAN) */}
      <div style={{ marginBottom: '6rem' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          marginBottom: '2rem'
        }}>
          [ 01 // MANIFESTO PPLG ]
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {/* Pilar 1 */}
          <div style={{
            padding: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.3s ease, border-color 0.3s ease'
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.5rem',
              color: '#3b82f6',
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              01
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontWeight: '800'
            }}>
              Rekayasa Perangkat Lunak
            </h3>
            <p style={{
              fontSize: '0.92rem',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Kode bukan sekadar instruksi mesin; ia adalah arsitektur abstrak yang menggerakkan pengalaman manusia. Saya merancang sistem yang modular, bersih, berperforma tinggi, dan siap diskalakan.
            </p>
          </div>

          {/* Pilar 2 */}
          <div style={{
            padding: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.5rem',
              color: '#10b981',
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              02
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontWeight: '800'
            }}>
              Mekanika Gim & Game Feel
            </h3>
            <p style={{
              fontSize: '0.92rem',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Dunia gim mengajarkan bahwa pengguna tidak hanya membaca layar—mereka harus merasakan sensasi sentuhan. Dari inersia pegas hingga deformasi mesh, setiap micro-interaksi dirancang memuaskan (*juicy*).
            </p>
          </div>

          {/* Pilar 3 */}
          <div style={{
            padding: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.5rem',
              color: '#f59e0b',
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              03
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontWeight: '800'
            }}>
              Estetika Web Awwwards
            </h3>
            <p style={{
              fontSize: '0.92rem',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Menolak template pasaran yang membosankan. Melalui perpaduan tipografi editorial radikal, pencahayaan 3D Three.js, dan transisi tanpa jeda, setiap karya ditujukan untuk memenangkan penghargaan internasional.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE PPLG RUNTIME TERMINAL & TECH STACK */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
        gap: '3rem',
        alignItems: 'start',
        marginBottom: '6rem'
      }}>
        {/* Terminal PPLG Interaktif */}
        <div style={{
          backgroundColor: '#0c0d0e',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}>
          {/* Header Bar Terminal */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>
              billean@pplg-terminal:~
            </span>
            <span style={{ fontSize: '0.68rem', color: '#10b981' }}>BASH / 60FPS</span>
          </div>

          {/* Isi Terminal */}
          <div style={{
            padding: '20px',
            minHeight: '220px',
            maxHeight: '280px',
            overflowY: 'auto',
            fontSize: '0.8rem',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.85)'
          }}>
            {terminalOutput.map((line, i) => (
              <div key={i} style={{ color: line.startsWith('$') ? '#ffffff' : line.startsWith('VISI:') || line.startsWith('STACK:') ? '#34d399' : 'rgba(255,255,255,0.75)' }}>
                {line}
              </div>
            ))}
          </div>

          {/* Quick Command Buttons */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', alignSelf: 'center', marginRight: '4px' }}>
              PILIH PERINTAH:
            </span>
            {['vision', 'stack', 'software_mode', 'game_mode', 'clear'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                --{cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Kurasi Skill & Kemampuan PPLG */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              fontWeight: '900',
              margin: 0
            }}>
              Spektrum Kemampuan
            </h3>

            {/* Filter Kategori */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'software', 'game'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSkillCategory(cat)}
                  onMouseEnter={onHover}
                  onMouseLeave={onLeave}
                  style={{
                    background: selectedSkillCategory === cat ? 'white' : 'transparent',
                    color: selectedSkillCategory === cat ? 'black' : 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '4px 10px',
                    borderRadius: '15px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredSkills.map((skill, index) => (
              <div
                key={index}
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'border-color 0.3s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px' }}>
                    {skill.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                    {skill.desc}
                  </div>
                </div>

                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  backgroundColor: skill.category === 'software' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: skill.category === 'software' ? '#93c5fd' : '#6ee7b7',
                  border: `1px solid ${skill.category === 'software' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                }}>
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div style={{
        padding: isMobile ? '40px 24px' : '60px 48px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '3px',
          color: '#10b981',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}>
          [ TERTARIK MEMBANGUN HAL LUAR BIASA BERSAMA? ]
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? '2rem' : '3.2rem',
          fontWeight: '900',
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem'
        }}>
          Mari Mengubah Ide Menjadi Realitas Digital.
        </h2>

        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '550px',
          margin: '0 auto 2.5rem auto',
          lineHeight: '1.6'
        }}>
          Terbuka untuk kolaborasi proyek kreatif, studi kasus inovatif, atau diskusi seputar arsitektur kode dan grafika interaktif.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="mailto:contact@billean.dev"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              padding: '14px 32px',
              backgroundColor: '#ffffff',
              color: '#050505',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontWeight: '700',
              fontSize: '0.82rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              borderRadius: '40px',
              transition: 'all 0.3s ease'
            }}
          >
            Kirim Surel / Diskusi ↗
          </a>
          <button
            onClick={onBackToHome}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{
              padding: '14px 28px',
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              borderRadius: '40px',
              cursor: 'pointer'
            }}
          >
            Lihat Portofolio Karya
          </button>
        </div>
      </div>
    </motion.div>
  );
}
