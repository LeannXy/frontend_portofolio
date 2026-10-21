import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AbstractIntro({ projects, isLoaded }) {
  const [positions, setPositions] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    if (isLoaded) {
      // 1. Generate posisi abstrak secara acak
      const newPositions = projects.map(() => {
        const targetX = (Math.random() - 0.5) * window.innerWidth * 0.8;
        const targetY = (Math.random() - 0.5) * window.innerHeight * 0.8;
        const startX = (Math.random() > 0.5 ? 1 : -1) * (window.innerWidth + 200);
        const startY = (Math.random() > 0.5 ? 1 : -1) * (window.innerHeight + 200);
        const rotation = (Math.random() - 0.5) * 60;
        return { startX, startY, targetX, targetY, rotation };
      });
      setPositions(newPositions);
    }
  }, [isLoaded, projects]);

  useEffect(() => {
    // 2. GSAP ScrollTrigger: Mengatur animasi menghilang dan muncul kembali
    if (isLoaded && positions.length > 0) {
      let ctx = gsap.context(() => {
        gsap.to(".abstract-card", {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "300px top", // Jarak scroll 300px dari atas untuk menghilang sempurna
            scrub: 1, // Angka 1 memberikan efek pelembutan (smoothing) pada scroll
          },
          scale: 0,     // Mengecil hingga hilang
          opacity: 0,
          z: -500,      // Terkesan terbang ke belakang
          stagger: 0.02,
          ease: "none"
        });
      }, containerRef);

      return () => ctx.revert(); // Membersihkan memori GPU saat komponen dilepas
    }
  }, [isLoaded, positions]);

  if (!isLoaded || positions.length === 0) return null;

return (
    <div ref={containerRef} style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: 0, // PERUBAHAN DI SINI: zIndex diturunkan ke 0 agar berada di belakang
      pointerEvents: 'none', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      {projects.map((proj, i) => (
        <motion.img
          key={`intro-${proj.id}`}
          className="abstract-card"
          // ... (properti motion lainnya biarkan sama persis seperti sebelumnya)
          src={proj.image}
          alt=""
          initial={{ x: positions[i].startX, y: positions[i].startY, rotate: positions[i].rotation, scale: 0.5, opacity: 0 }}
          animate={{ x: positions[i].targetX, y: positions[i].targetY, rotate: positions[i].rotation * 0.5, scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1], delay: i * 0.05 }}
          style={{
            position: 'absolute',
            width: '150px',
            height: '220px',
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        />
      ))}
    </div>
  );
}