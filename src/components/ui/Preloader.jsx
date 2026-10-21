import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulasi loading aset (bisa diganti dengan preloading Three.js nanti)
    let timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Timeline Animasi Keluar GSAP
      const tl = gsap.timeline({
        onComplete: onComplete // Beritahu App bahwa loading selesai
      });

      // 1. Teks menyatu ke tengah (jika sebelumnya berpisah)
      tl.to([leftTextRef.current, rightTextRef.current], {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
      })
      // 2. Teks memudar (Nanti kita ganti efek hancur partikel Three.js)
      .to([leftTextRef.current, rightTextRef.current], {
        opacity: 0,
        scale: 1.5,
        duration: 0.8,
        ease: 'power2.in',
        delay: 0.5
      })
      // 3. Background hitam memudar ke atas
      .to(containerRef.current, {
        yPercent: -100, // Geser layar ke atas
        duration: 1.2,
        ease: 'expo.inOut'
      });
    }
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050505',
        zIndex: 9999, // Harus paling atas
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', fontSize: '4vw', fontWeight: 'bold', overflow: 'hidden' }}>
        <span ref={leftTextRef} style={{ transform: 'translateX(-100px)', opacity: 0 }}>PORT</span>
        <span ref={rightTextRef} style={{ transform: 'translateX(100px)', opacity: 0 }}>FOLIO</span>
      </div>
      
      {/* Indikator Loading */}
      <div style={{ position: 'absolute', bottom: '10%', fontSize: '1rem', color: '#666' }}>
        {progress}%
      </div>
    </div>
  );
}