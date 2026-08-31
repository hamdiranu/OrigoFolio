import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Grid, Sparkles } from '@react-three/drei'
import type { Group } from 'three'

type FloatingProps = {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  speed?: number
}

function Dumbbell({ position, scale = 1, speed = 1 }: FloatingProps) {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.35 * speed
    groupRef.current.rotation.z += delta * 0.08 * speed
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.4}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 1.7, 16]} />
          <meshStandardMaterial color="#1c222c" metalness={0.7} roughness={0.3} />
        </mesh>
        {[-0.9, 0.9].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 0.16, 24]} />
              <meshStandardMaterial color="#151a22" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[Math.sign(x) * 0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.28, 0.28, 0.08, 24]} />
              <meshStandardMaterial
                color="#64ffda"
                metalness={0.6}
                roughness={0.2}
                emissive="#64ffda"
                emissiveIntensity={0.25}
              />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  )
}

function Kettlebell({ position, scale = 1, speed = 1 }: FloatingProps) {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.25 * speed
  })

  return (
    <Float speed={speed * 0.8} rotationIntensity={0.4} floatIntensity={1.2}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh position={[0, -0.15, 0]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#151a22" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.07, 16, 32]} />
          <meshStandardMaterial
            color="#64ffda"
            metalness={0.6}
            roughness={0.2}
            emissive="#64ffda"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </Float>
  )
}

function Barbell({ position, rotation = [0, 0, Math.PI / 2.4], scale = 1, speed = 1 }: FloatingProps) {
  const groupRef = useRef<Group>(null)
  const plateOffsets = [1.1, 1.35, 1.55]

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.15 * speed
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.05
  })

  return (
    <Float speed={speed * 0.6} rotationIntensity={0.25} floatIntensity={0.8}>
      <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 3.4, 16]} />
          <meshStandardMaterial color="#1c222c" metalness={0.8} roughness={0.25} />
        </mesh>
        {plateOffsets.map((offset, i) =>
          [-1, 1].map((dir) => (
            <mesh key={`${dir}-${offset}`} position={[dir * offset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.5 - i * 0.08, 0.5 - i * 0.08, 0.1, 24]} />
              <meshStandardMaterial
                color={i === 0 ? '#64ffda' : '#151a22'}
                metalness={0.6}
                roughness={0.3}
                emissive={i === 0 ? '#64ffda' : '#000000'}
                emissiveIntensity={i === 0 ? 0.2 : 0}
              />
            </mesh>
          )),
        )}
      </group>
    </Float>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.6, 7.5], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 4, 4]} intensity={1.3} color="#64ffda" />
      <pointLight position={[-4, -2, -3]} intensity={0.5} color="#7c3aed" />
      <spotLight position={[1.5, 6, 3]} angle={0.5} penumbra={0.6} intensity={0.6} color="#64ffda" />
      <Suspense fallback={null}>
        <Barbell position={[4, 0.6, -1.8]} scale={0.75} speed={0.8} />
        <Dumbbell position={[3.3, -0.7, 0.8]} scale={0.7} speed={1.2} />
        <Dumbbell position={[5.1, 1, -0.5]} scale={0.65} speed={1} />
        <Kettlebell position={[4.6, -1.2, 1]} scale={0.85} speed={1.4} />
        <Grid
          position={[0, -1.9, 0]}
          args={[20, 20]}
          cellColor="#1c222c"
          sectionColor="#64ffda"
          cellThickness={0.5}
          sectionThickness={1}
          fadeDistance={14}
          fadeStrength={1.5}
          infiniteGrid
        />
        <Sparkles count={60} scale={[8, 6, 6]} position={[4, 0, 0]} size={2} speed={0.3} color="#64ffda" opacity={0.5} />
      </Suspense>
    </Canvas>
  )
}
