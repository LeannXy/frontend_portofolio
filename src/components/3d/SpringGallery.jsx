import { useRef, useEffect } from 'react';
import { Image, Text } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Daftarkan plugin ScrollTrigger GSAP
gsap.registerPlugin(ScrollTrigger);

export default function SpringGallery({ projects }) {
  const groupRef = useRef();

  // Pengaturan dimensi spiral (helix)
  const radius = 6;
  const heightStep = 2.5;
  const totalRotations = 2;

  useEffect(() => {
    // Pastikan referensi 3D dan data proyek sudah tersedia
    if (!groupRef.current || projects.length === 0) return;

    // Gunakan gsap.context untuk mengamankan memori di ekosistem React
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#gallery-track", // Menempel pada elemen HTML
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Animasi mengikuti kecepatan scroll dengan mulus
        }
      });

      // 1. Memutar formasi
      tl.to(groupRef.current.rotation, {
        y: Math.PI * 2 * totalRotations, 
        ease: "power2.inOut" // Lambat di awal, cepat di tengah, melambat di akhir
      }, 0);

      // 2. Mengangkat formasi ke atas
      tl.to(groupRef.current.position, {
        y: projects.length * heightStep, 
        ease: "power2.inOut"
      }, 0);
    });

    // Membersihkan animasi spesifik ini saat komponen ditutup/dihapus
    return () => ctx.revert(); 
  }, [projects]);

  return (
    // Posisi awal pegas diturunkan ke bawah layar
    <group ref={groupRef} position={[0, -5, -8]}>
      {projects.map((proj, idx) => {
        // Matematika Ruang 3D untuk menyusun gambar melingkar ke atas
        const angle = (idx / projects.length) * Math.PI * 2 * totalRotations;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = -idx * heightStep; 

        return (
          <group 
            key={idx} 
            position={[x, y, z]} 
            // Setiap gambar diputar agar selalu menghadap poros tengah
            rotation={[0, -angle + Math.PI / 2, 0]} 
          >
            {/* Gambar */}
            <Image 
              url={proj.image_url || "https://picsum.photos/600/400"} 
              scale={[4, 2.5]} 
              transparent 
              opacity={0.9} 
            />
            {/* Teks Judul */}
            <Text 
              position={[0, -1.8, 0.1]} 
              fontSize={0.4} 
              color="white" 
              anchorX="center" 
              anchorY="middle"
            >
              {proj.title}
            </Text>
          </group>
        );
      })}
    </group>
  );
}