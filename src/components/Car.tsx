import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Car() {
  const wheelsRef = useRef<THREE.Group[]>([])
  const exhaustRef = useRef<THREE.PointLight>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    // Spin wheels
    wheelsRef.current.forEach(wheel => {
      if (wheel) wheel.rotation.x += 0.3
    })

    // Pulse exhaust glow
    if (exhaustRef.current) {
      exhaustRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 20) * 0.5
    }

    // Pulse underglow
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 5) * 0.1
    }
  })

  return (
    <group>
      {/* Car body */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.5, 4]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Cockpit */}
      <mesh castShadow position={[0, 0.8, 0.2]}>
        <boxGeometry args={[1.4, 0.4, 1.8]} />
        <meshStandardMaterial
          color="#0f0f23"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.85, -0.6]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.3, 0.02, 0.8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Front spoiler */}
      <mesh position={[0, 0.2, -2]}>
        <boxGeometry args={[2.2, 0.1, 0.4]} />
        <meshStandardMaterial
          color="#ff0066"
          emissive="#ff0066"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Rear wing */}
      <mesh position={[0, 1.2, 1.8]}>
        <boxGeometry args={[2, 0.05, 0.5]} />
        <meshStandardMaterial
          color="#ff0066"
          emissive="#ff0066"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Wing supports */}
      {[-0.7, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0.9, 1.8]}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Headlights */}
      {[-0.6, 0.6].map((x, i) => (
        <group key={i} position={[x, 0.4, -2]}>
          <mesh>
            <boxGeometry args={[0.3, 0.2, 0.1]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={2}
            />
          </mesh>
          <pointLight color="#00ffff" intensity={5} distance={20} />
        </group>
      ))}

      {/* Taillights */}
      {[-0.6, 0.6].map((x, i) => (
        <group key={i} position={[x, 0.4, 2]}>
          <mesh>
            <boxGeometry args={[0.4, 0.15, 0.1]} />
            <meshStandardMaterial
              color="#ff0033"
              emissive="#ff0033"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}

      {/* Exhaust glow */}
      <pointLight ref={exhaustRef} position={[0, 0.3, 2.2]} color="#ff4400" intensity={2} distance={5} />

      {/* Wheels */}
      {[
        [-0.9, 0.25, -1.3],
        [0.9, 0.25, -1.3],
        [-0.9, 0.25, 1.3],
        [0.9, 0.25, 1.3]
      ].map((pos, i) => (
        <group
          key={i}
          position={pos as [number, number, number]}
          ref={(el) => { if (el) wheelsRef.current[i] = el }}
        >
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
            <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Wheel rim glow */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.22, 6]} />
            <meshStandardMaterial
              color="#ff0066"
              emissive="#ff0066"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Underglow */}
      <mesh ref={glowRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 5]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight position={[0, 0.1, 0]} color="#00ffff" intensity={3} distance={4} />

      {/* Side neon strips */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x * 0.95, 0.3, 0]}>
          <boxGeometry args={[0.05, 0.1, 3.5]} />
          <meshStandardMaterial
            color="#ff0066"
            emissive="#ff0066"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  )
}
