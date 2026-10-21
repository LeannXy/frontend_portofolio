import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper linear interpolation
const lerp = (start, end, factor) => start + (end - start) * factor;

function HelixCard({
  proj,
  index,
  totalLength,
  activeProject,
  setHoveredProject,
  clickedProject,
  setClickedProject,
  scrollProgressRef,
  idleAngleRef
}) {
  const groupRef = useRef();
  const frontImageRef = useRef();
  const backImageRef = useRef();
  const baseScale = [3.8, 5.2];

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const scrollP = scrollProgressRef.current;
    
    // Transisi dari orbit (hero) ke pegas (section 2):
    // 0 -> 0.16 : Dari orbit melingkar menyatu membentuk pegas
    // 0.16 -> 1.0 : Pegas berputar dan naik menyusuri galeri
    const t = Math.min(1, Math.max(0, scrollP / 0.16));
    const blend = t * t * (3 - 2 * t); // Smooth hermite curve

    // 1. Posisi Orbit (Hero Section) — Diposisikan di area bawah-tengah agar tidak bertabrakan dengan teks nama
    const angleOrbit = (index / totalLength) * Math.PI * 2 + idleAngleRef.current;
    const orbitRadiusX = 14.2;
    const orbitRadiusZ = 10.2;
    const ox = Math.cos(angleOrbit) * orbitRadiusX;
    const oz = Math.sin(angleOrbit) * orbitRadiusZ;
    
    // Ketinggian Y hero orbit:
    // Kartu depan (oz > 0) sedikit melengkung ke bawah (y ~ -3.6 s/d -4.0) memberi ruang lega bagi nama di atas
    // Kartu belakang (oz < 0) sedikit lebih tinggi dan jauh di latar belakang
    const frontDip = oz > 0 ? (oz / orbitRadiusZ) * 0.9 : (oz / orbitRadiusZ) * 0.4;
    const oy = -3.2 - frontDip + Math.sin(index * 1.2 + idleAngleRef.current * 0.3) * 0.35;
    
    const oRotY = -angleOrbit + Math.PI / 2;
    const oRotX = 0.08 + (oz > 0 ? (oz / orbitRadiusZ) * 0.06 : 0); // Sedikit kemiringan amfiteater ke arah kamera
    const oRotZ = Math.cos(angleOrbit) * -0.04;

    // 2. Posisi Pegas / Helix (Section 2)
    const helixAngle = index * 0.72;
    const helixRadius = 7.8;
    const hx = Math.cos(helixAngle) * helixRadius;
    const hz = Math.sin(helixAngle) * helixRadius;
    const hy = index * 1.8 - (totalLength * 1.8) / 2;
    const hRotY = -helixAngle + Math.PI / 2;
    const hRotX = 0;
    const hRotZ = 0;

    // 3. Interpolasi mulus (Orbit -> Pegas)
    groupRef.current.position.x = lerp(ox, hx, blend);
    groupRef.current.position.y = lerp(oy, hy, blend);
    groupRef.current.position.z = lerp(oz, hz, blend);

    groupRef.current.rotation.x = lerp(oRotX, hRotX, blend);
    groupRef.current.rotation.y = lerp(oRotY, hRotY, blend);
    groupRef.current.rotation.z = lerp(oRotZ, hRotZ, blend);

    // 4. Efek fokus interaktif saat kartu di-hover / di-klik (skala & transparansi kedua sisi)
    const isFocused = activeProject && activeProject.id === proj.id;
    const hasActive = activeProject !== null;

    // Transisi keluar halus saat mendekati Section 3 (scrollP > 0.85)
    const exitProgress = Math.min(1, Math.max(0, (scrollP - 0.85) / 0.15));
    const exitFade = 1 - exitProgress;

    const targetOpacity = (isFocused ? 1 : (hasActive ? 0.25 : 0.95)) * exitFade;
    const targetScaleFactor = (isFocused ? 1.15 : 1.0) * (1 - exitProgress * 0.5);

    const targetScaleX = baseScale[0] * targetScaleFactor;
    const targetScaleY = baseScale[1] * targetScaleFactor;

    if (frontImageRef.current && frontImageRef.current.material) {
      frontImageRef.current.material.opacity = THREE.MathUtils.lerp(
        frontImageRef.current.material.opacity,
        targetOpacity,
        delta * 6
      );
      frontImageRef.current.scale.x = THREE.MathUtils.lerp(frontImageRef.current.scale.x, targetScaleX, delta * 6);
      frontImageRef.current.scale.y = THREE.MathUtils.lerp(frontImageRef.current.scale.y, targetScaleY, delta * 6);
    }

    if (backImageRef.current && backImageRef.current.material) {
      const targetBackOpacity = (isFocused ? 0.85 : (hasActive ? 0.2 : 0.65)) * exitFade;
      backImageRef.current.material.opacity = THREE.MathUtils.lerp(
        backImageRef.current.material.opacity,
        targetBackOpacity,
        delta * 6
      );
      backImageRef.current.scale.x = THREE.MathUtils.lerp(backImageRef.current.scale.x, targetScaleX, delta * 6);
      backImageRef.current.scale.y = THREE.MathUtils.lerp(backImageRef.current.scale.y, targetScaleY, delta * 6);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. SEPARATOR CORE / BACKING GELAP DI TENGAH (Z = 0)
          Mencegah teks depan tembus terbalik ke belakang dan teks belakang tembus ke depan */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[3.88, 5.28]} />
        <meshBasicMaterial color="#080808" />
      </mesh>

      {/* 2. SISI DEPAN (FRONT FACE - Z > 0) */}
      <group position={[0, 0, 0.015]}>
        {/* Gambar Proyek Depan (Cerah & Tajam) */}
        <Image
          ref={frontImageRef}
          url={proj.image}
          scale={baseScale}
          transparent
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
            setHoveredProject(proj);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
            setHoveredProject(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (clickedProject && clickedProject.id === proj.id) {
              setClickedProject(null);
            } else {
              setClickedProject(proj);
            }
          }}
        />

        {/* Index Badge Depan */}
        <Text
          position={[-1.6, 2.25, 0.04]}
          fontSize={0.18}
          color="#ffffff"
          fillOpacity={0.85}
          anchorX="left"
          anchorY="top"
          fontWeight={700}
        >
          {`0${index + 1}`.slice(-2)}
        </Text>

        {/* Judul Proyek di Kartu Depan */}
        <Text
          position={[0, -1.85, 0.04]}
          fontSize={0.21}
          color="#ffffff"
          fillOpacity={0.98}
          anchorX="center"
          anchorY="top"
          maxWidth={3.4}
          textAlign="center"
          fontWeight={700}
        >
          {proj.title}
        </Text>

        {/* Kategori Proyek Depan */}
        <Text
          position={[0, -2.18, 0.04]}
          fontSize={0.13}
          color="#ffffff"
          fillOpacity={0.6}
          anchorX="center"
          anchorY="top"
          letterSpacing={0.12}
        >
          {proj.category || "SPATIAL & INTERACTION"}
        </Text>
      </group>

      {/* 3. SISI BELAKANG (BACK FACE - Z < 0)
          Diputar 180 derajat (rotation Y = Math.PI) sehingga saat kartu memutar ke belakang,
          gambar dan teks menghadap kamera dengan orientasi yang benar (tidak terbalik),
          serta gambarnya terlihat dengan nuansa sedikit gelap (dimmed) */}
      <group position={[0, 0, -0.015]} rotation={[0, Math.PI, 0]}>
        {/* Gambar Proyek Belakang (Sedikit Gelap / Dimmed) */}
        <Image
          ref={backImageRef}
          url={proj.image}
          scale={baseScale}
          transparent
          opacity={0.65}
          color="#5a5a5a" // Warna dikalikan abu-abu gelap agar gambarnya sedikit gelap
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
            setHoveredProject(proj);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
            setHoveredProject(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (clickedProject && clickedProject.id === proj.id) {
              setClickedProject(null);
            } else {
              setClickedProject(proj);
            }
          }}
        />

        {/* Lapisan Tint Gelap Semi-Transparan untuk kedalaman visual */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[baseScale[0], baseScale[1]]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.32} />
        </mesh>

        {/* Index Badge Belakang */}
        <Text
          position={[1.6, 2.25, 0.02]}
          fontSize={0.18}
          color="#ffffff"
          fillOpacity={0.45}
          anchorX="right"
          anchorY="top"
          fontWeight={700}
        >
          {`0${index + 1}`.slice(-2)}
        </Text>

        {/* Judul Proyek di Kartu Belakang (Subdued / Redup) */}
        <Text
          position={[0, -1.85, 0.02]}
          fontSize={0.21}
          color="#ffffff"
          fillOpacity={0.65}
          anchorX="center"
          anchorY="top"
          maxWidth={3.4}
          textAlign="center"
          fontWeight={700}
        >
          {proj.title}
        </Text>

        {/* Kategori Proyek Belakang */}
        <Text
          position={[0, -2.18, 0.02]}
          fontSize={0.13}
          color="#ffffff"
          fillOpacity={0.38}
          anchorX="center"
          anchorY="top"
          letterSpacing={0.12}
        >
          {proj.category || "SPATIAL & INTERACTION"}
        </Text>
      </group>
    </group>
  );
}

export default function HeroHelix({
  projects,
  isLoaded,
  activeProject,
  setHoveredProject,
  clickedProject,
  setClickedProject
}) {
  const masterGroupRef = useRef();
  const { camera } = useThree();

  const scrollProgressRef = useRef(0);
  const idleAngleRef = useRef(0);

  useEffect(() => {
    if (!isLoaded || !masterGroupRef.current) return;

    // Posisi kamera awal di level mata depan (perspektif mendalam seperti awwwards)
    camera.position.set(0, 0, 22);
    camera.lookAt(0, 0, 0);

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#main-scroll-track",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        }
      });
    });

    return () => ctx.revert();
  }, [isLoaded, camera]);

  useFrame((state, delta) => {
    const scrollP = scrollProgressRef.current;

    // Idle rotation aktif di hero section (scrollP < 0.16)
    const heroIdleFactor = Math.max(0, 1 - scrollP / 0.16);
    idleAngleRef.current += delta * 0.16 * heroIdleFactor;

    // Saat scroll memasuki galeri (scrollP > 0.16), seluruh pegas diputar dan digeser ke atas
    if (masterGroupRef.current) {
      if (scrollP > 0.16) {
        const galleryProgress = Math.min(1, Math.max(0, (scrollP - 0.16) / 0.84));
        // Memutar pegas seiring scroll galeri hingga ujung pegas terlihat
        masterGroupRef.current.rotation.y = galleryProgress * Math.PI * 5.2;
        const targetY = galleryProgress * (projects.length * 1.8);

        masterGroupRef.current.position.y = targetY;
        masterGroupRef.current.scale.set(1, 1, 1);
      } else {
        masterGroupRef.current.rotation.y = 0;
        masterGroupRef.current.position.y = 0;
        masterGroupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group ref={masterGroupRef}>
      {projects.map((proj, index) => (
        <HelixCard
          key={proj.id}
          proj={proj}
          index={index}
          totalLength={projects.length}
          activeProject={activeProject}
          setHoveredProject={setHoveredProject}
          clickedProject={clickedProject}
          setClickedProject={setClickedProject}
          scrollProgressRef={scrollProgressRef}
          idleAngleRef={idleAngleRef}
        />
      ))}
    </group>
  );
}