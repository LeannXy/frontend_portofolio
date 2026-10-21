import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, MeshTransmissionMaterial, Environment, Sparkles, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export default function TensionSnap({ onComplete }) {
  const textRef = useRef();
  const particlesRef = useRef();
  const bgObjectsRef = useRef();
  const { viewport, camera } = useThree();

  useEffect(() => {
    // Kembalikan posisi kamera ke tengah
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    let ctx = gsap.context(() => {
      // 1. EFEK LEDAKAN PARTIKEL (Shatter)
      gsap.fromTo(particlesRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 4, y: 4, z: 4, duration: 2, ease: "expo.out" }
      );

      // 2. KEMUNCULAN TEKS KACA
      gsap.fromTo(textRef.current.position,
        { z: -15 },
        { z: 0, duration: 2.5, ease: "elastic.out(1, 0.4)", delay: 0.2 }
      );
      
      gsap.fromTo(textRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 2, ease: "expo.out", delay: 0.2 }
      );

      // 3. TRANSISI KE SESI BERIKUTNYA (Spotlight Room)
      // Setelah 5 detik interaksi, teks akan tenggelam dan scene berganti
      gsap.delayedCall(5, () => {
        gsap.to(textRef.current.position, { z: 15, duration: 1.5, ease: "power3.in" });
        gsap.to(particlesRef.current.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "power3.in" });
        
        gsap.delayedCall(1.5, () => {
          if(onComplete) onComplete();
        });
      });
    });

    return () => ctx.revert();
  }, [camera, onComplete]);

  // ANIMASI FRAME-BY-FRAME (Floating & Mouse Interactivity)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotasi bola warna-warni di belakang teks agar refraksi kaca terlihat dinamis
    if (bgObjectsRef.current) {
      bgObjectsRef.current.rotation.x = t * 0.2;
      bgObjectsRef.current.rotation.y = t * 0.3;
    }

    if (textRef.current) {
      // Teks melayang halus
      textRef.current.position.y = Math.sin(t * 1.5) * 0.2;

      // Interaksi Kursor: Teks akan sedikit menengok (wobble) mengikuti pergerakan mouse
      // Ini memperkuat efek "distorsi lensa" yang Anda inginkan
      const targetRotationX = (state.pointer.y * Math.PI) / 8;
      const targetRotationY = (state.pointer.x * Math.PI) / 8;
      
      textRef.current.rotation.x = THREE.MathUtils.lerp(textRef.current.rotation.x, targetRotationX, 0.1);
      textRef.current.rotation.y = THREE.MathUtils.lerp(textRef.current.rotation.y, targetRotationY, 0.1);
    }
  });

  // Hitung ukuran font responsif berdasarkan lebar layar
  const fontSize = Math.max(viewport.width / 12, 1);

  return (
    <group>
      {/* Pencahayaan lingkungan (Environment) wajib untuk pantulan material kaca */}
      <Environment preset="city" />

      {/* SISTEM PARTIKEL (Mewakili pecahan galeri pegas) */}
      <group ref={particlesRef}>
        <Sparkles count={800} scale={15} size={3} speed={2} opacity={0.8} color="#ffffff" />
      </group>

      {/* TEKS LIQUID METAL / KACA */}
      <Text 
        ref={textRef} 
        fontSize={fontSize} 
        fontWeight={900} 
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf" // Font tebal untuk memperjelas refraksi
        anchorX="center" 
        anchorY="middle"
      >
        BEYOND THE{'\n'}ORDINARY
        
        {/* Rahasia efek kaca pemenang Awwwards */}
        <MeshTransmissionMaterial
          backside={true}
          thickness={2}          // Ketebalan kaca
          roughness={0}          // 0 = Kaca mulus sempurna
          transmission={1}       // 1 = Transparan penuh (mengambil gambar di belakangnya)
          ior={1.5}              // Index of Refraction (seperti kaca asli)
          chromaticAberration={0.15} // Efek pelangi di pinggiran kaca
          distortion={0.5}       // Efek gelombang air/cairan
          distortionScale={0.3}
          temporalDistortion={0.1} // Animasi cairan yang terus bergerak
          color="#ffffff"
        />
      </Text>

      {/* BOLA WARNA-WARNI ABSTRAK DI BELAKANG TEKS UNTUK DIBIASKAN */}
      <group ref={bgObjectsRef} position={[0, 0, -5]}>
        <Sphere args={[2, 64, 64]} position={[-4, 2, -2]}>
          <meshBasicMaterial color="#ff0055" />
        </Sphere>
        <Sphere args={[2.5, 64, 64]} position={[4, -2, -3]}>
          <meshBasicMaterial color="#0055ff" />
        </Sphere>
        <Sphere args={[1.5, 64, 64]} position={[0, 3, -4]}>
          <meshBasicMaterial color="#ffcc00" />
        </Sphere>
      </group>

    </group>
  );
}