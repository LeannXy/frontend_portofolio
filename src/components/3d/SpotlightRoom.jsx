import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Komponen Objek Layanan yang akan disorot
function ServiceObject({ position, geometry, title }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.5;
    
    // Objek berputar sangat cepat saat disorot/di-hover
    if (hovered) {
      meshRef.current.rotation.y += delta * 5;
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={geometry} />
        {/* Material gelap yang hanya terlihat jika terkena cahaya */}
        <meshStandardMaterial 
          color={hovered ? "#ffffff" : "#444444"} 
          roughness={0.1} 
          metalness={0.8}
        />
      </mesh>
      {/* Judul layanan tersembunyi di dalam kegelapan */}
      <Text position={[0, -2, 0]} fontSize={0.5} color="white" fillOpacity={hovered ? 1 : 0.2}>
        {title}
      </Text>
    </group>
  );
}

export default function SpotlightRoom() {
  const lightRef = useRef();

  // Memaksa lampu mengikuti posisi kursor (mouse)
  useFrame((state) => {
    // state.pointer berisi koordinat x dan y dari mouse (-1 sampai 1)
    // Kita ubah menjadi koordinat ruang 3D
    const x = (state.pointer.x * state.viewport.width) / 2;
    const y = (state.pointer.y * state.viewport.height) / 2;
    
    // Lampu bergerak mulus (lerp) mengikuti mouse
    lightRef.current.position.lerp(new THREE.Vector3(x, y, 2), 0.1);
  });

  return (
    <group>
      {/* Lampu Sorot (Kursor) */}
      <pointLight ref={lightRef} intensity={5} distance={10} color="#ffffff" />
      
      {/* Objek-objek Layanan */}
      <ServiceObject position={[-4, 0, -2]} geometry={new THREE.IcosahedronGeometry(1, 0)} title="WEB DESIGN" />
      <ServiceObject position={[0, 0, -2]} geometry={new THREE.TorusGeometry(1, 0.4, 16, 32)} title="3D INTERACTION" />
      <ServiceObject position={[4, 0, -2]} geometry={new THREE.OctahedronGeometry(1, 0)} title="BRANDING" />
    </group>
  );
}