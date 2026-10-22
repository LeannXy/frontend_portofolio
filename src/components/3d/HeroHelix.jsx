import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper linear interpolation
const lerp = (start, end, factor) => start + (end - start) * factor;
const HELIX_RADIUS = 4.5;
const HELIX_CARD_SPACING = 8.2;

function HelixCard({
  proj,
  index,
  totalLength,
  activeProject,
  setHoveredProject,
  clickedProject,
  setClickedProject,
  galleryProgressRef,
  galleryExitProgressRef,
  idleAngleRef,
  masterGroupRef
}) {
  const groupRef = useRef();
  const frontImageRef = useRef();
  const expansionProgressRef = useRef(0);
  const previousSelectionRef = useRef(false);
  const { camera, viewport } = useThree();
  const baseScale = [8, 4.5];

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const galleryProgress = galleryProgressRef.current;
    
    // Stagger the cards slightly so the orbit resolves into the helix progressively.
    const transitionStagger = Math.min(0.04, index * 0.004);
    const transitionProgress = Math.min(
      1,
      Math.max(0, (galleryProgress - transitionStagger) / (0.14 - transitionStagger))
    );
    const blend = transitionProgress ** 3
      * (transitionProgress * (transitionProgress * 6 - 15) + 10);

    // Orbit the project cards behind the centered name before they form the spring.
    const arcAngle = (index / Math.max(1, totalLength)) * Math.PI * 2 + idleAngleRef.current;
    const orbitRadiusX = 11.8;
    const orbitRadiusY = 5.1;
    const ox = Math.cos(arcAngle) * orbitRadiusX;
    const oy = Math.sin(arcAngle) * orbitRadiusY;
    const oz = -2.8 + Math.cos(arcAngle * 2) * 0.45;
    const orbitCircumference = Math.PI * 2 * Math.sqrt((orbitRadiusX ** 2 + orbitRadiusY ** 2) / 2);
    const orbitCardScale = Math.min(
      0.52,
      (orbitCircumference / Math.max(1, totalLength)) * 0.76 / baseScale[0]
    );
    const oRotY = Math.atan2(-ox, 16 - oz);
    const oRotX = Math.sin(arcAngle) * 0.025;
    const oRotZ = Math.sin(arcAngle) * -0.035;

    // 2. Posisi Pegas / Helix (Section 2)
    const helixAngle = index * 0.72;
    const hx = Math.cos(helixAngle) * HELIX_RADIUS;
    const hz = Math.sin(helixAngle) * HELIX_RADIUS;
    const hy = (index - (totalLength - 1) / 2) * HELIX_CARD_SPACING;
    const hRotY = Math.atan2(-hx, 16 - hz);
    const hRotX = 0;
    const hRotZ = 0;

    // 3. Interpolasi mulus (Orbit -> Pegas)
    groupRef.current.position.x = lerp(ox, hx, blend);
    groupRef.current.position.y = lerp(oy, hy, blend);
    groupRef.current.position.z = lerp(oz, hz, blend);

    groupRef.current.rotation.x = lerp(oRotX, hRotX, blend);
    groupRef.current.rotation.y = lerp(oRotY, hRotY, blend);
    groupRef.current.rotation.z = lerp(oRotZ, hRotZ, blend);
    groupRef.current.scale.setScalar(lerp(orbitCardScale, 1, blend));

    // 4. Efek fokus interaktif saat kartu di-hover / di-klik
    const isFocused = activeProject && activeProject.id === proj.id;
    const hasActive = activeProject !== null;
    const isSelected = clickedProject?.id === proj.id;
    if (previousSelectionRef.current !== isSelected) {
      groupRef.current.traverse((child) => {
        if (!child.isMesh) return;
        child.renderOrder = isSelected ? 1000 : 0;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material) material.depthTest = !isSelected;
        });
      });
      previousSelectionRef.current = isSelected;
    }

    const isExpanded = clickedProject?.id === proj.id && galleryProgress >= 0.12;
    const expansionProgress = THREE.MathUtils.damp(
      expansionProgressRef.current,
      isExpanded ? 1 : 0,
      5,
      delta
    );
    expansionProgressRef.current = expansionProgress;

    if (expansionProgress > 0) {
      const isMobile = window.innerWidth < 768;
      const textSide = proj.textSide === 'left' ? 'left' : 'right';
      const targetZ = 8.5;
      const cameraDistance = Math.max(0.1, camera.position.z - targetZ);
      const visibleWidthAtCard = viewport.width * cameraDistance / camera.position.z;
      const visibleHeightAtCard = viewport.height * cameraDistance / camera.position.z;
      const panelWidth = Math.min(300, window.innerWidth * 0.24);
      const imageWidth = isMobile
        ? window.innerWidth * 0.82
        : Math.min(
          window.innerWidth * 0.74,
          window.innerWidth * 0.94 - panelWidth - Math.max(24, window.innerWidth * 0.025)
        );
      const targetScale = Math.min(
        isMobile ? 1.15 : 1.9,
        imageWidth * (visibleWidthAtCard / window.innerWidth) / baseScale[0],
        visibleHeightAtCard * (isMobile ? 0.55 : 0.84) / baseScale[1]
      );
      const sideOffset = isMobile
        ? 0
        : (window.innerWidth * 0.03
          + panelWidth
          + Math.max(24, window.innerWidth * 0.025)
          + imageWidth / 2
          - window.innerWidth / 2) * (visibleWidthAtCard / window.innerWidth);
      const targetX = isMobile ? 0 : (textSide === 'left' ? sideOffset : -sideOffset);
      let targetY = -(masterGroupRef.current?.position.y ?? 0);
      if (isMobile) {
        const navbarBottom = document.querySelector('.site-nav')?.getBoundingClientRect().bottom ?? 88;
        const panelTop = document.querySelector('.project-detail-panel')?.getBoundingClientRect().top
          ?? window.innerHeight * 0.65;
        const safeTop = navbarBottom + 16;
        const safeBottom = panelTop - 16;
        const imageHeight = baseScale[1] * targetScale * window.innerHeight / visibleHeightAtCard;
        const availableHeight = Math.max(imageHeight, safeBottom - safeTop);
        const imageCenterY = safeTop + availableHeight / 2;
        targetY += (window.innerHeight / 2 - imageCenterY)
          * visibleHeightAtCard / window.innerHeight;
      }
      const basePosition = groupRef.current.position.clone();

      groupRef.current.position.set(
        lerp(basePosition.x, targetX, expansionProgress),
        lerp(basePosition.y, targetY, expansionProgress),
        lerp(basePosition.z, targetZ, expansionProgress)
      );
      groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, 0, expansionProgress);
      groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, 0, expansionProgress);
      groupRef.current.rotation.z = lerp(groupRef.current.rotation.z, 0, expansionProgress);
      groupRef.current.scale.setScalar(lerp(groupRef.current.scale.x, targetScale, expansionProgress));
    }

    // Keep the last project visible until the gallery scroll is almost complete.
    const exitProgress = galleryExitProgressRef.current;
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

  });

  return (
    <group ref={groupRef}>
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
          position={[-3.5, 2.12, 0.04]}
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
          position={[0, -1.82, 0.04]}
          fontSize={0.26}
          color="#ffffff"
          fillOpacity={0.98}
          anchorX="center"
          anchorY="top"
          maxWidth={7}
          textAlign="center"
          fontWeight={700}
        >
          {proj.title}
        </Text>

        {/* Kategori Proyek Depan */}
        <Text
          position={[0, -2.16, 0.04]}
          fontSize={0.16}
          color="#ffffff"
          fillOpacity={0.6}
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

  const galleryProgressRef = useRef(0);
  const galleryExitProgressRef = useRef(0);
  const idleAngleRef = useRef(0);

  useEffect(() => {
    if (!isLoaded || !masterGroupRef.current) return;

    // Posisi kamera awal di level mata depan (perspektif mendalam seperti awwwards)
    camera.position.set(0, 0, 16);
    camera.lookAt(0, 0, 0);

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#section-project-gallery",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          galleryProgressRef.current = self.progress;
        },
        onRefresh: (self) => {
          galleryProgressRef.current = self.progress;
        },
      });
      ScrollTrigger.create({
        trigger: "#section-approach",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          if (masterGroupRef.current) masterGroupRef.current.visible = false;
        },
        onEnterBack: () => {
          if (masterGroupRef.current) masterGroupRef.current.visible = false;
        },
        onLeaveBack: () => {
          if (masterGroupRef.current) masterGroupRef.current.visible = true;
        },
        onUpdate: (self) => {
          galleryExitProgressRef.current = self.progress;
        },
        onRefresh: (self) => {
          galleryExitProgressRef.current = self.progress;
          if (masterGroupRef.current) {
            masterGroupRef.current.visible = window.scrollY < self.start;
          }
        },
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [isLoaded, camera, projects.length]);

  useFrame((state, delta) => {
    const galleryProgress = galleryProgressRef.current;

    // Idle rotation aktif sebelum galeri selesai terbentuk.
    const heroIdleFactor = Math.max(0, 1 - galleryProgress / 0.14);
    idleAngleRef.current += delta * 0.22 * heroIdleFactor;

    // Keep each helix card facing the camera while scrolling through the archive.
    if (masterGroupRef.current) {
      const transition = Math.min(1, Math.max(0, galleryProgress / 0.12));
      const scanProgress = Math.min(1, Math.max(0, (galleryProgress - 0.12) / 0.88));
      const gallerySpan = Math.max(0, projects.length - 1) * HELIX_CARD_SPACING;

      masterGroupRef.current.rotation.y = 0;
      masterGroupRef.current.position.y = (0.5 - scanProgress) * gallerySpan * transition;
      masterGroupRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group ref={masterGroupRef}>
      {projects.map((proj, index) => (
        <HelixCard
          key={proj.id ?? proj.ID ?? `${proj.title}-${index}`}
          proj={proj}
          index={index}
          totalLength={projects.length}
          activeProject={activeProject}
          setHoveredProject={setHoveredProject}
          clickedProject={clickedProject}
          setClickedProject={setClickedProject}
          galleryProgressRef={galleryProgressRef}
          galleryExitProgressRef={galleryExitProgressRef}
          idleAngleRef={idleAngleRef}
          masterGroupRef={masterGroupRef}
        />
      ))}
    </group>
  );
}