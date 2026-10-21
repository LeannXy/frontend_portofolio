import { useRef, useEffect } from 'react';
import { Text, PresentationControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OrigamiAbout() {
  const groupRef = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Timeline GSAP untuk mengecilkan origami menjadi kubus kecil saat di-scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#origami-track",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      // Efek melipat dan menyusut jadi kubus kecil di tengah layar
      tl.to(groupRef.current.scale, {
        x: 0.15, 
        y: 0.15, 
        z: 0.15, 
        ease: "power2.inOut"
      }, 0);

      // Memutar kubus dengan liar saat menyusut
      tl.to(groupRef.current.rotation, {
        x: Math.PI * 3,
        y: Math.PI * 3,
        z: Math.PI,
        ease: "power1.inOut"
      }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    // PresentationControls memungkinkan interaksi click & drag 3D secara presisi
    <PresentationControls
      global={false} 
      cursor={true}
      snap={true} // Kertas akan kembali memantul ke posisi awal setelah dilepas
      speed={1.5}
      polar={[-Math.PI / 3, Math.PI / 3]} // Batas rotasi vertikal
      azimuth={[-Math.PI / 2, Math.PI / 2]} // Batas rotasi horizontal
    >
      <group ref={groupRef} position={[0, 0, 0]}>
        
        {/* Bidang Kertas Utama */}
        <mesh position={[0, 0, 0]} rotation={[0.1, -0.1, 0]}>
          <boxGeometry args={[5, 6, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
          
          <Text position={[0, 2, 0.1]} fontSize={0.4} color="black" fontStyle="italic">
            FILOSOFI KAMI
          </Text>
          <Text position={[0, 0, 0.1]} fontSize={0.2} color="#333" maxWidth={4} textAlign="center" lineHeight={1.5}>
            Kami percaya antarmuka bukan sekadar halaman datar. Setiap baris kode adalah lipatan ruang. Klik dan geser layar ini untuk melihat dimensi di balik karya kami.
          </Text>
        </mesh>

        {/* Sayap Kertas Kanan (Lipatan) */}
        <mesh position={[3, 0, -1]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[3, 6, 0.05]} />
          <meshStandardMaterial color="#dddddd" roughness={0.8} />
          <Text position={[0, 0, 0.1]} fontSize={0.25} color="black" maxWidth={2} textAlign="center">
            ← Drag untuk memutar
          </Text>
        </mesh>

        {/* Sayap Kertas Kiri (Lipatan) */}
        <mesh position={[-3, 0, -1]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[3, 6, 0.05]} />
          <meshStandardMaterial color="#dddddd" roughness={0.8} />
          <Text position={[0, 0, 0.1]} fontSize={0.25} color="black" maxWidth={2} textAlign="center">
            Bentuk Ruang 3D →
          </Text>
        </mesh>

      </group>
    </PresentationControls>
  );
}