import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import type { Mesh } from 'three'

function DistortedCore() {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.08
    meshRef.current.rotation.y += delta * 0.12
  })

  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[1.8, 0, 0]}>
        <icosahedronGeometry args={[1.6, 4]} />
        <MeshDistortMaterial
          color="#64ffda"
          attach="material"
          distort={0.45}
          speed={1.8}
          roughness={0.15}
          metalness={0.6}
          wireframe
        />
      </mesh>
    </Float>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#64ffda" />
      <pointLight position={[-4, -3, -2]} intensity={0.5} color="#7c3aed" />
      <Suspense fallback={null}>
        <DistortedCore />
        <Stars radius={40} depth={30} count={1800} factor={2.5} saturation={0} fade speed={0.6} />
      </Suspense>
    </Canvas>
  )
}
