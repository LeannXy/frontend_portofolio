import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BlackHoleContact({ onSwallowed }) {
  const holeRef = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact-track",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            // Jika scroll mencapai 85% dari bawah, picu ledakan warna terang
            if (self.progress > 0.85) {
              onSwallowed(true);
            } else {
              onSwallowed(false);
            }
          }
        }
      });

      // Lubang hitam berputar sangat cepat dan membesar hingga menelan kamera
      tl.to(holeRef.current.rotation, { y: Math.PI * 15, z: Math.PI * 10, ease: "power2.in" }, 0);
      tl.to(holeRef.current.scale, { x: 30, y: 30, z: 30, ease: "expo.in" }, 0);
    });

    return () => ctx.revert();
  }, [onSwallowed]);

  return (
    // Memulai dengan skala sangat kecil menyerupai sisa kubus origami
    <mesh ref={holeRef} position={[0, 0, -2]} scale={[0.1, 0.1, 0.1]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}