import { useRef, useEffect, MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Car } from './Car'
import { CityTrack } from './CityTrack'
import { useGameControls, Controls } from '../hooks/useGameControls'

interface GameProps {
  isPlaying: boolean
  onSpeedChange: (speed: number) => void
  onTimeUpdate: (time: number) => void
  onLapComplete: (lapTime: number) => void
  controlsRef: MutableRefObject<Controls>
}

export function Game({ isPlaying, onSpeedChange, onTimeUpdate, onLapComplete, controlsRef }: GameProps) {
  const carRef = useRef<THREE.Group>(null!)
  const { camera } = useThree()
  const controls = useGameControls(controlsRef)

  // Car physics state
  const carState = useRef({
    position: new THREE.Vector3(0, 0.5, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: 0,
    speed: 0,
    steering: 0
  })

  // Lap tracking
  const lapState = useRef({
    startTime: 0,
    lastCheckpoint: 0,
    crossedStart: false
  })

  // Track boundaries (circular track)
  const trackRadius = 50
  const trackWidth = 15

  useEffect(() => {
    if (isPlaying) {
      lapState.current.startTime = Date.now()
      lapState.current.lastCheckpoint = 0
      lapState.current.crossedStart = false
      carState.current.position.set(0, 0.5, trackRadius - 5)
      carState.current.rotation = Math.PI
      carState.current.speed = 0
      carState.current.velocity.set(0, 0, 0)
    }
  }, [isPlaying])

  useFrame((state, delta) => {
    if (!isPlaying || !carRef.current) return

    const car = carState.current
    const { forward, backward, left, right, boost } = controls.current

    // Update time
    onTimeUpdate(Date.now() - lapState.current.startTime)

    // Acceleration
    const maxSpeed = boost ? 120 : 80
    const acceleration = 40
    const braking = 60
    const friction = 0.98

    if (forward) {
      car.speed = Math.min(car.speed + acceleration * delta, maxSpeed)
    } else if (backward) {
      car.speed = Math.max(car.speed - braking * delta, -30)
    } else {
      car.speed *= friction
    }

    // Steering (more responsive at lower speeds)
    const steeringSpeed = 2.5 * Math.min(1, Math.abs(car.speed) / 30)
    if (left) {
      car.steering = Math.min(car.steering + steeringSpeed * delta, 1)
    } else if (right) {
      car.steering = Math.max(car.steering - steeringSpeed * delta, -1)
    } else {
      car.steering *= 0.9
    }

    // Apply rotation based on steering and speed
    if (Math.abs(car.speed) > 0.5) {
      car.rotation += car.steering * delta * 2 * Math.sign(car.speed)
    }

    // Update velocity
    const direction = new THREE.Vector3(
      Math.sin(car.rotation),
      0,
      Math.cos(car.rotation)
    )
    car.velocity.copy(direction).multiplyScalar(car.speed * delta)

    // Update position
    car.position.add(car.velocity)

    // Keep car on track (constrain to circular track area)
    const distFromCenter = Math.sqrt(car.position.x ** 2 + car.position.z ** 2)
    if (distFromCenter > trackRadius + trackWidth / 2) {
      const angle = Math.atan2(car.position.x, car.position.z)
      car.position.x = Math.sin(angle) * (trackRadius + trackWidth / 2 - 1)
      car.position.z = Math.cos(angle) * (trackRadius + trackWidth / 2 - 1)
      car.speed *= 0.5 // Penalty for hitting outer wall
    }
    if (distFromCenter < trackRadius - trackWidth / 2) {
      const angle = Math.atan2(car.position.x, car.position.z)
      car.position.x = Math.sin(angle) * (trackRadius - trackWidth / 2 + 1)
      car.position.z = Math.cos(angle) * (trackRadius - trackWidth / 2 + 1)
      car.speed *= 0.5 // Penalty for hitting inner wall
    }

    // Update car mesh
    carRef.current.position.copy(car.position)
    carRef.current.rotation.y = car.rotation

    // Update speed display
    onSpeedChange(Math.abs(Math.round(car.speed * 2))) // Scale for display

    // Lap detection (crossing the start line)
    const angle = Math.atan2(car.position.x, car.position.z)
    const normalizedAngle = ((angle + Math.PI * 2) % (Math.PI * 2))

    if (normalizedAngle > Math.PI && lapState.current.lastCheckpoint < Math.PI) {
      lapState.current.crossedStart = true
    }

    if (lapState.current.crossedStart && normalizedAngle < 0.1 && lapState.current.lastCheckpoint > Math.PI) {
      const lapTime = Date.now() - lapState.current.startTime
      onLapComplete(lapTime)
      lapState.current.startTime = Date.now()
      lapState.current.crossedStart = false
    }

    lapState.current.lastCheckpoint = normalizedAngle

    // Camera follow
    const cameraOffset = new THREE.Vector3(0, 5, 10)
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation)
    const targetCameraPos = car.position.clone().add(cameraOffset)
    camera.position.lerp(targetCameraPos, 0.05)
    camera.lookAt(car.position.x, car.position.y + 1, car.position.z)
  })

  return (
    <>
      {/* Atmosphere */}
      <fog attach="fog" args={['#0a0a1a', 30, 150]} />
      <color attach="background" args={['#0a0a1a']} />

      {/* Lighting */}
      <ambientLight intensity={0.15} color="#4444ff" />
      <directionalLight
        position={[50, 100, 50]}
        intensity={0.3}
        color="#ff6644"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Environment */}
      <Stars radius={200} depth={100} count={3000} factor={4} fade speed={0.5} />

      {/* City Track */}
      <CityTrack trackRadius={trackRadius} trackWidth={trackWidth} />

      {/* Player Car */}
      <group ref={carRef}>
        <Car />
      </group>
    </>
  )
}
