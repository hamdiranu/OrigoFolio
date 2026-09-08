import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";

import { useInViewport } from "@/hooks/useInViewport";

import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const { ref, isVisible } = useInViewport<HTMLDivElement>({
    defaultVisible: true,
  });

  return (
    <div ref={ref} className="w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={isVisible ? "always" : "never"}
        camera={{ position: [0, 0, 15], fov: 35 }}
        gl={{ toneMappingExposure: 1.35 }}
      >
        {/* subtle navy ambient so the room reads dark without going flat black */}
        <ambientLight intensity={2.3} color="#2a2d54" />
        {/* Configure OrbitControls to disable panning and control zoom based on device type */}
        <OrbitControls
          enablePan={false} // Prevents panning of the scene
          enableZoom={!isTablet} // Disables zoom on tablets
          maxDistance={20} // Maximum distance for zooming out
          minDistance={5} // Minimum distance for zooming in
          minPolarAngle={Math.PI / 5} // Minimum angle for vertical rotation
          maxPolarAngle={Math.PI / 2} // Maximum angle for vertical rotation
        />

        <Suspense fallback={null}>
          <HeroLights />
          <Particles count={100} />
          <group
            scale={isMobile ? 0.7 : 1}
            position={[0, -3.5, 0]}
            rotation={[0, -Math.PI / 4, 0]}
          >
            <Room />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroExperience;
