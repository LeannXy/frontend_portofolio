import { Canvas } from '@react-three/fiber';
import CosmicStarfield from './CosmicStarfield';
import HeroHelix from './HeroHelix';

export default function HomeScene({
  projects,
  loadingComplete,
  activeProject,
  clickedProject,
  setHoveredProject,
  clearHoveredProject,
  setClickedProject,
  isMainTrackVisible
}) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      frameloop={isMainTrackVisible ? 'always' : 'never'}
      gl={{ powerPreference: 'high-performance' }}
      onPointerMissed={() => setClickedProject(null)}
    >
      <ambientLight intensity={1.8} />
      <CosmicStarfield isLoaded={loadingComplete} />
      {projects.length > 0 && (
        <HeroHelix
          projects={projects}
          isLoaded={loadingComplete}
          activeProject={activeProject}
          setHoveredProject={setHoveredProject}
          clearHoveredProject={clearHoveredProject}
          clickedProject={clickedProject}
          setClickedProject={setClickedProject}
        />
      )}
    </Canvas>
  );
}
