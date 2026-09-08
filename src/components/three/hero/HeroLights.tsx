const HeroLights = () => (
  <>
    {/* warm desk lamp — the key light of the room */}
    <spotLight
      position={[2, 5, 6]}
      angle={0.32}
      penumbra={1}
      intensity={195}
      color="#FFD7B0"
    />
    {/* soft warm falloff around the desk so the key light doesn't leave hard shadows */}
    <pointLight
      position={[1, 2, 4]}
      intensity={32}
      color="#ff9a8c"
      distance={10}
    />
    {/* cool cyan glow cast off the monitors onto the desk and chair */}
    <pointLight
      position={[2, 1.2, 3]}
      intensity={34}
      color="#cffFFF"
      distance={7}
    />
    {/* faint blue fill from the window side — kept well below the warm key light */}
    <spotLight
      position={[-3, 5, 5]}
      angle={0.7}
      penumbra={1}
      intensity={50}
      color="#3d5a80"
    />
  </>
);

export default HeroLights;
