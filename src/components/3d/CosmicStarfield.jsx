import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Custom Vertex Shader: Rotasi galaksi, titik putih kecil, dan efek sedikit menyebar saat di-hover kursor
const starVertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aLayer;

  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uPixelRatio;
  uniform float uScrollProgress;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vec3 pos = position;

    // 1. Galaksi berputar lembut di area bawah kartu (aLayer > 0.5)
    if (aLayer > 0.5) {
      float distCenter = length(pos.xz);
      // Rotasi diferensial lembut di area bawah kartu
      float rotSpeed = (0.12 + (12.0 / (distCenter + 4.0)) * 0.05) * aSpeed;
      float angle = uTime * rotSpeed;
      
      float cosA = cos(angle);
      float sinA = sin(angle);
      float rx = pos.x * cosA - pos.z * sinA;
      float rz = pos.x * sinA + pos.z * cosA;
      pos.x = rx;
      pos.z = rz;
      
      // Gelombang naik-turun mikro (subtle breathing)
      pos.y += sin(uTime * 0.6 + aPhase * 6.28) * 0.18;
    } else {
      // Bintang ambient latar belakang bergerak sangat perlahan
      pos.x += sin(uTime * 0.08 + aPhase * 6.28) * 0.15;
      pos.y += cos(uTime * 0.07 + aPhase * 6.28) * 0.15;
    }

    // 2. Interaksi Kursor: Sedikit menyebar lembut di area sekitar kursor saat di-hover
    vec2 screenPos = pos.xy;
    float mouseDist = distance(screenPos, uMouse.xy);
    float influenceRadius = 5.2; // Area pengaruh lokal

    if (mouseDist < influenceRadius) {
      float norm = mouseDist / influenceRadius;
      // Kurva penyebaran lembut
      float force = smoothstep(1.0, 0.0, norm);
      
      // Arah penyebaran menjauh dari kursor
      vec2 scatterDir = mouseDist > 0.001 ? normalize(screenPos - uMouse.xy) : vec2(0.0, 1.0);
      
      // Variasi jitter per bintang agar menyebar secara alami di area tersebut
      float randomAngle = aPhase * 6.28318;
      vec2 jitter = vec2(cos(randomAngle), sin(randomAngle));
      
      // Efek sedikit menyebar di area itu
      pos.xy += (scatterDir * 1.5 + jitter * 0.8) * force;
      pos.z += sin(force * 3.14159) * 1.2;
    }

    // 3. Respon Scroll: Galaksi melebar dan turun secara anggun saat scroll ke section 2
    if (uScrollProgress > 0.04) {
      float scrollFactor = smoothstep(0.04, 0.25, uScrollProgress);
      pos.y -= scrollFactor * 5.0;
      pos.x *= (1.0 + scrollFactor * 0.3);
      pos.z *= (1.0 + scrollFactor * 0.3);
    }

    // 4. Transformasi Proyeksi Kamera
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 5. Efek Twinkle Halus
    float twinkle = sin(uTime * 1.8 + aPhase * 6.28) * 0.5 + 0.5;

    // Titik-titik putih kecil: skala ukuran titik dijaga agar tetap kecil dan halus
    float distFactor = 220.0 / -mvPosition.z;
    gl_PointSize = aSize * (0.8 + 0.3 * twinkle) * distFactor * uPixelRatio;
    // Dibatasi agar tetap berupa titik-titik kecil yang tenang
    gl_PointSize = clamp(gl_PointSize, 1.0, 10.0);

    // Opasitas tenang agar tidak begitu cerah dan tidak mengganggu gambar
    float baseAlpha = aLayer > 0.5 ? 0.38 : 0.22;
    vAlpha = baseAlpha * (0.75 + 0.25 * twinkle);
  }
`;

// Custom Fragment Shader: Titik putih kecil bundar halus dengan transparansi tenang
const starFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    if (dist > 0.5) discard;

    // Titik bulat halus dengan anti-aliasing lembut
    float dotAlpha = smoothstep(0.5, 0.14, dist);

    gl_FragColor = vec4(vColor, dotAlpha * vAlpha);
  }
`;

export default function CosmicStarfield({ isLoaded }) {
  const pointsRef = useRef();
  const groupRef = useRef();
  const materialRef = useRef();
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  const { viewport, gl } = useThree();

  // Inisialisasi titik-titik putih kecil dan lapisan bintang
  const { positions, sizes, colors, speeds, phases, layers } = useMemo(() => {
    // Total bintang: 2800 (2000 berkumpul di area bawah kartu berputar, 800 ambient latar belakang)
    const clusterCount = 2000;
    const ambientCount = 800;
    const totalCount = clusterCount + ambientCount;

    const positions = new Float32Array(totalCount * 3);
    const sizes = new Float32Array(totalCount);
    const colors = new Float32Array(totalCount * 3);
    const speeds = new Float32Array(totalCount);
    const phases = new Float32Array(totalCount);
    const layers = new Float32Array(totalCount);

    // Palet warna putih yang tidak begitu cerah (soft whites & subdued silver-whites)
    // agar tidak mengganggu gambar kartu portofolio
    const whitePalette = [
      new THREE.Color('#ffffff'), // Putih bersih
      new THREE.Color('#e2e8f0'), // Putih netral lembut (88% brightness)
      new THREE.Color('#cbd5e1'), // Putih perak tenang (82% brightness)
      new THREE.Color('#94a3b8')  // Putih redup ambient (65% brightness)
    ];

    let i = 0;

    // 1. KELOMPOK TITIK PUTIH KECIL DI AREA BAWAH KARTU BERPUTAR
    // Area bawah kartu berada di Y = -5.0 s/d -8.5
    for (let c = 0; c < clusterCount; c++, i++) {
      const r = 2.0 + Math.pow(Math.random(), 0.75) * 16.0;
      const theta = Math.random() * Math.PI * 2;
      
      const x = Math.cos(theta) * r + (Math.random() - 0.5) * 1.5;
      const z = Math.sin(theta) * (r * 0.78) + (Math.random() - 0.5) * 2.0;
      
      // Berkumpul di bawah orbit kartu berputar
      const y = -5.4 + (Math.random() - 0.5) * 2.6 - (r * 0.07);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Titik-titik kecil (ukuran kecil & halus)
      sizes[i] = 0.85 + Math.pow(Math.random(), 1.5) * 1.3;

      // Warna putih yang tenang
      const randColor = Math.random();
      let chosenColor;
      if (randColor < 0.40) chosenColor = whitePalette[0]; // Putih bersih
      else if (randColor < 0.75) chosenColor = whitePalette[1]; // Putih netral
      else chosenColor = whitePalette[2]; // Putih perak tenang

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      speeds[i] = 0.7 + Math.random() * 0.4;
      phases[i] = Math.random();
      layers[i] = 1.0; // Cluster aktif di bawah kartu
    }

    // 2. BINTANG AMBIENT LATAR BELAKANG TERJAUH
    for (let a = 0; a < ambientCount; a++, i++) {
      positions[i * 3] = (Math.random() - 0.5) * 75;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 2] = -12 - Math.random() * 26; // Jauh di belakang

      // Titik mikro ambient
      sizes[i] = 0.6 + Math.random() * 0.8;

      const chosenColor = Math.random() > 0.4 ? whitePalette[1] : whitePalette[3];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      speeds[i] = 0.2 + Math.random() * 0.25;
      phases[i] = Math.random();
      layers[i] = 0.0; // Ambient layer
    }

    return { positions, sizes, colors, speeds, phases, layers };
  }, []);

  // Uniforms shader
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
    uScrollProgress: { value: 0 }
  }), []);

  // Sambungkan ScrollTrigger untuk mengontrol posisi bintang saat scroll
  useEffect(() => {
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
  }, []);

  // Update frame: rotasi galaksi, interaksi kursor mouse, dan animasi
  useFrame((state, delta) => {
    if (!materialRef.current) return;

    const time = state.clock.getElapsedTime();
    const v = viewport;

    // 1. Konversi pointer kursor ke koordinat ruang 3D pada z = 0
    const targetX = (state.pointer.x * v.width) * 0.5;
    const targetY = (state.pointer.y * v.height) * 0.5;

    // Interpolasi pergerakan kursor yang mulus
    mousePos.current.x = THREE.MathUtils.lerp(mousePos.current.x, targetX, delta * 7.0);
    mousePos.current.y = THREE.MathUtils.lerp(mousePos.current.y, targetY, delta * 7.0);

    // 2. Parallax lembut pada seluruh kelompok bintang
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.pointer.y * 0.04, delta * 2.0);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, state.pointer.x * 0.05, delta * 2.0);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.pointer.x * 0.6, delta * 2.5);
    }

    // 3. Update uniforms ke shader GPU
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMouse.value.set(mousePos.current.x, mousePos.current.y, 0);
    materialRef.current.uniforms.uScrollProgress.value = scrollProgressRef.current;
    materialRef.current.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <points ref={pointsRef} renderOrder={-50}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-aSpeed"
            args={[speeds, 1]}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            args={[phases, 1]}
          />
          <bufferAttribute
            attach="attributes-aLayer"
            args={[layers, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
