import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Palet warna responsif berdasarkan kartu kapabilitas yang sedang di-hover
const THEME_COLORS = {
  default: { primary: '#10b981', secondary: '#38bdf8', wire: '#ffffff', glow: '#10b981' },
  0: { primary: '#10b981', secondary: '#34d399', wire: '#6ee7b7', glow: '#10b981' }, // WebGL Shaders
  1: { primary: '#38bdf8', secondary: '#818cf8', wire: '#93c5fd', glow: '#38bdf8' }, // Kinetic Interaction
  2: { primary: '#f59e0b', secondary: '#fbbf24', wire: '#fde68a', glow: '#f59e0b' }, // High-Performance Systems
  3: { primary: '#a855f7', secondary: '#c084fc', wire: '#e9d5ff', glow: '#a855f7' }  // Game Tech & ECS
};

export default function QuantumCore({ activeCard, isLoaded }) {
  const masterRef = useRef();
  const innerCoreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const nodesGroupRef = useRef();

  const lightRef = useRef();
  const scaleRef = useRef(0);
  const { viewport } = useThree();

  // Target warna saat ini
  const currentTheme = THEME_COLORS[activeCard] || THEME_COLORS.default;
  const colorTargetPrimary = useRef(new THREE.Color(currentTheme.primary));
  const colorTargetSecondary = useRef(new THREE.Color(currentTheme.secondary));
  const colorTargetWire = useRef(new THREE.Color(currentTheme.wire));

  useEffect(() => {
    colorTargetPrimary.current.set(currentTheme.primary);
    colorTargetSecondary.current.set(currentTheme.secondary);
    colorTargetWire.current.set(currentTheme.wire);
  }, [activeCard, currentTheme]);

  // ScrollTrigger: Muncul saat memasuki Section 3 (#section-capabilities)
  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#section-capabilities",
        start: "top 80%",
        end: "bottom top",
        onUpdate: (self) => {
          // Skala masuk mulus saat mendekati Section 3
          const p = self.progress;
          if (p > 0 && p < 1) {
            scaleRef.current = Math.sin(Math.min(1, p * 1.5) * Math.PI * 0.5);
          } else {
            scaleRef.current = 0;
          }
        },
        onLeaveBack: () => {
          scaleRef.current = 0;
        }
      });
    });

    return () => ctx.revert();
  }, []);

  useFrame((state, delta) => {
    if (!masterRef.current) return;

    const t = state.clock.getElapsedTime();

    // 1. Interpolasi skala kemunculan
    masterRef.current.scale.lerp(
      new THREE.Vector3(scaleRef.current, scaleRef.current, scaleRef.current),
      delta * 4.5
    );

    // 2. Parallax Kursor Mouse (Responsif terhadap posisi mouse)
    const targetRotX = (state.pointer.y * Math.PI) / 8;
    const targetRotY = (state.pointer.x * Math.PI) / 6;
    masterRef.current.rotation.x = THREE.MathUtils.lerp(masterRef.current.rotation.x, targetRotX, delta * 3);
    masterRef.current.rotation.y = THREE.MathUtils.lerp(masterRef.current.rotation.y, targetRotY, delta * 3);

    // 3. Posisi 3D: Diletakkan sedikit di belakang dan tengah
    const isMobile = viewport.width < 7;
    masterRef.current.position.y = Math.sin(t * 1.2) * 0.35 - (isMobile ? 1.0 : 0.5);
    masterRef.current.position.z = isMobile ? -4 : -2;

    // 4. Rotasi Gimbal Multi-Axis
    const speedBoost = activeCard !== null ? 2.2 : 1.0;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.45 * speedBoost;
      ring1Ref.current.rotation.y += delta * 0.25 * speedBoost;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.55 * speedBoost;
      ring2Ref.current.rotation.z += delta * 0.35 * speedBoost;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.40 * speedBoost;
      ring3Ref.current.rotation.x -= delta * 0.30 * speedBoost;
    }

    // 5. Rotasi Inti Dalam & Breathing
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y += delta * 0.8 * speedBoost;
      innerCoreRef.current.rotation.x += delta * 0.5 * speedBoost;
      const pulse = 1.0 + Math.sin(t * 3.0) * 0.08;
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
    }

    // 6. Rotasi Node Data Satelit
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y += delta * 0.65;
    }

    // 7. Interpolasi warna material secara mulus
    if (innerCoreRef.current && innerCoreRef.current.material) {
      innerCoreRef.current.material.color.lerp(colorTargetPrimary.current, delta * 4);
    }
    if (lightRef.current) {
      lightRef.current.color.lerp(colorTargetPrimary.current, delta * 4);
    }
  });

  return (
    <group ref={masterRef} position={[0, 0, -2]} scale={[0, 0, 0]}>
      {/* Cahaya Titik Pusat */}
      <pointLight ref={lightRef} intensity={3.5} distance={12} color="#10b981" />

      {/* 1. INTI KRISTAL GEOMETRIS (Inner Polyhedron Core) */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial
          color="#10b981"
          roughness={0.2}
          metalness={0.9}
          wireframe={false}
          emissive="#10b981"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Wireframe Pelindung Inti */}
      <mesh scale={[1.35, 1.35, 1.35]}>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
      </mesh>

      {/* 2. CINCIN GIMBAL 1 (Cincin Horizontal Utama) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.15}
          metalness={0.95}
          emissive="#38bdf8"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 3. CINCIN GIMBAL 2 (Cincin Vertikal Luar) */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.2, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#10b981"
          roughness={0.15}
          metalness={0.95}
          emissive="#10b981"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 4. CINCIN GIMBAL 3 (Cincin Diagonal Sensor) */}
      <mesh ref={ring3Ref} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[3.8, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.15}
          metalness={0.95}
          emissive="#f59e0b"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 5. DATA SATELLITE NODES (Partikel Titik Orbit) */}
      <group ref={nodesGroupRef}>
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const angle = (idx / 6) * Math.PI * 2;
          const radius = 2.8;
          return (
            <mesh
              key={idx}
              position={[Math.cos(angle) * radius, (idx % 2 === 0 ? 0.6 : -0.6), Math.sin(angle) * radius]}
              scale={[0.12, 0.12, 0.12]}
            >
              <octahedronGeometry args={[1, 0]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
