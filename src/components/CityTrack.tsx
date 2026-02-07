import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CityTrackProps {
  trackRadius: number
  trackWidth: number
}

export function CityTrack({ trackRadius, trackWidth }: CityTrackProps) {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[200, 64]} />
        <meshStandardMaterial color="#0a0a12" />
      </mesh>

      {/* Track surface */}
      <TrackSurface radius={trackRadius} width={trackWidth} />

      {/* Track boundaries with neon */}
      <TrackBoundary radius={trackRadius + trackWidth / 2} color="#ff0066" />
      <TrackBoundary radius={trackRadius - trackWidth / 2} color="#00ffff" />

      {/* Start/Finish line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, trackRadius]}>
        <planeGeometry args={[trackWidth, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* City buildings around the track */}
      <CityBuildings trackRadius={trackRadius} trackWidth={trackWidth} />

      {/* Street lights around track */}
      <StreetLights trackRadius={trackRadius} trackWidth={trackWidth} />

      {/* Center city */}
      <CenterCity radius={trackRadius - trackWidth / 2 - 5} />
    </group>
  )
}

function TrackSurface({ radius, width }: { radius: number; width: number }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.absarc(0, 0, radius + width / 2, 0, Math.PI * 2, false)
    const hole = new THREE.Path()
    hole.absarc(0, 0, radius - width / 2, 0, Math.PI * 2, true)
    shape.holes.push(hole)

    const geo = new THREE.ShapeGeometry(shape, 64)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [radius, width])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#1a1a24" roughness={0.8} metalness={0.2} />
    </mesh>
  )
}

function TrackBoundary({ radius, color }: { radius: number; color: string }) {
  const segments = 64

  return (
    <group>
      {/* Barrier wall */}
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i / segments) * Math.PI * 2
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius

        return (
          <group key={i} position={[x, 0.5, z]} rotation={[0, -angle, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 1, (Math.PI * 2 * radius) / segments + 0.1]} />
              <meshStandardMaterial color="#111118" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Neon strip */}
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.35, 0.1, (Math.PI * 2 * radius) / segments + 0.1]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function CityBuildings({ trackRadius, trackWidth }: { trackRadius: number; trackWidth: number }) {
  const buildings = useMemo(() => {
    const result = []
    const outerRadius = trackRadius + trackWidth / 2 + 15

    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2 + Math.random() * 0.1
      const distance = outerRadius + Math.random() * 40
      const height = 15 + Math.random() * 50
      const width = 5 + Math.random() * 10
      const depth = 5 + Math.random() * 10

      result.push({
        position: [Math.sin(angle) * distance, height / 2, Math.cos(angle) * distance] as [number, number, number],
        size: [width, height, depth] as [number, number, number],
        rotation: angle + Math.random() * 0.5,
        windows: Math.floor(height / 3),
        windowColor: ['#00ffff', '#ff0066', '#ffaa00', '#00ff88'][Math.floor(Math.random() * 4)]
      })
    }
    return result
  }, [trackRadius, trackWidth])

  return (
    <group>
      {buildings.map((building, i) => (
        <Building key={i} {...building} />
      ))}
    </group>
  )
}

function Building({
  position,
  size,
  rotation,
  windows,
  windowColor
}: {
  position: [number, number, number]
  size: [number, number, number]
  rotation: number
  windows: number
  windowColor: string
}) {
  const windowsRef = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    windowsRef.current.forEach((mesh, i) => {
      if (mesh) {
        const material = mesh.material as THREE.MeshStandardMaterial
        const flicker = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) > 0.7
        material.emissiveIntensity = flicker ? 0.2 : 1
      }
    })
  })

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Building body */}
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#0a0a14" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Windows */}
      {Array.from({ length: windows }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[
              (col - 1) * (size[0] / 4),
              -size[1] / 2 + row * 3 + 2,
              size[2] / 2 + 0.1
            ]}
            ref={(el) => { if (el) windowsRef.current[row * 3 + col] = el }}
          >
            <planeGeometry args={[1.5, 2]} />
            <meshStandardMaterial
              color={windowColor}
              emissive={windowColor}
              emissiveIntensity={1}
            />
          </mesh>
        ))
      )}

      {/* Rooftop antenna/glow */}
      <pointLight
        position={[0, size[1] / 2 + 1, 0]}
        color={windowColor}
        intensity={2}
        distance={15}
      />
    </group>
  )
}

function StreetLights({ trackRadius, trackWidth }: { trackRadius: number; trackWidth: number }) {
  const lights = useMemo(() => {
    const result = []
    const innerRadius = trackRadius - trackWidth / 2 - 2
    const outerRadius = trackRadius + trackWidth / 2 + 2

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2
      const isOuter = i % 2 === 0
      const radius = isOuter ? outerRadius : innerRadius

      result.push({
        position: [Math.sin(angle) * radius, 0, Math.cos(angle) * radius] as [number, number, number],
        color: isOuter ? '#ff0066' : '#00ffff'
      })
    }
    return result
  }, [trackRadius, trackWidth])

  return (
    <group>
      {lights.map((light, i) => (
        <group key={i} position={light.position}>
          {/* Pole */}
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 6, 8]} />
            <meshStandardMaterial color="#222233" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Light fixture */}
          <mesh position={[0, 6.2, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial
              color={light.color}
              emissive={light.color}
              emissiveIntensity={2}
            />
          </mesh>
          <pointLight
            position={[0, 6, 0]}
            color={light.color}
            intensity={5}
            distance={20}
            castShadow
          />
        </group>
      ))}
    </group>
  )
}

function CenterCity({ radius }: { radius: number }) {
  const buildings = useMemo(() => {
    const result = []
    const count = 20

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const distance = radius * 0.3 + Math.random() * radius * 0.5
      const height = 20 + Math.random() * 80
      const width = 4 + Math.random() * 8

      result.push({
        position: [Math.sin(angle) * distance, height / 2, Math.cos(angle) * distance] as [number, number, number],
        height,
        width,
        color: ['#ff0066', '#00ffff', '#ff6600', '#00ff88'][Math.floor(Math.random() * 4)]
      })
    }

    // Central tower
    result.push({
      position: [0, 50, 0] as [number, number, number],
      height: 100,
      width: 8,
      color: '#ffaa00'
    })

    return result
  }, [radius])

  return (
    <group>
      {buildings.map((building, i) => (
        <group key={i} position={building.position}>
          <mesh castShadow>
            <boxGeometry args={[building.width, building.height, building.width]} />
            <meshStandardMaterial color="#0a0a14" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Top glow */}
          <mesh position={[0, building.height / 2, 0]}>
            <boxGeometry args={[building.width + 0.5, 1, building.width + 0.5]} />
            <meshStandardMaterial
              color={building.color}
              emissive={building.color}
              emissiveIntensity={2}
            />
          </mesh>
          {/* Vertical neon strips */}
          {[0, 1, 2, 3].map(side => (
            <mesh
              key={side}
              position={[
                side < 2 ? (building.width / 2 + 0.1) * (side === 0 ? 1 : -1) : 0,
                0,
                side >= 2 ? (building.width / 2 + 0.1) * (side === 2 ? 1 : -1) : 0
              ]}
              rotation={[0, side >= 2 ? Math.PI / 2 : 0, 0]}
            >
              <boxGeometry args={[0.2, building.height, 0.2]} />
              <meshStandardMaterial
                color={building.color}
                emissive={building.color}
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
