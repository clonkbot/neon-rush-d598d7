import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback, useRef } from 'react'
import { Game } from './components/Game'
import { HUD } from './components/HUD'
import { StartScreen } from './components/StartScreen'
import { MobileControls } from './components/MobileControls'
import { Controls } from './hooks/useGameControls'

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start')
  const [speed, setSpeed] = useState(0)
  const [lap, setLap] = useState(1)
  const [time, setTime] = useState(0)
  const [bestLap, setBestLap] = useState<number | null>(null)

  // Shared controls ref for mobile touch and keyboard
  const controlsRef = useRef<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false
  })

  const startGame = useCallback(() => {
    setGameState('playing')
    setLap(1)
    setTime(0)
  }, [])

  const handleLapComplete = useCallback((lapTime: number) => {
    if (!bestLap || lapTime < bestLap) {
      setBestLap(lapTime)
    }
    setLap(prev => prev + 1)
    if (lap >= 3) {
      setGameState('finished')
    }
  }, [bestLap, lap])

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Scanline overlay effect */}
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
          opacity: 0.3
        }}
      />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0f' }}
      >
        <Suspense fallback={null}>
          <Game
            isPlaying={gameState === 'playing'}
            onSpeedChange={setSpeed}
            onTimeUpdate={setTime}
            onLapComplete={handleLapComplete}
            controlsRef={controlsRef}
          />
        </Suspense>
      </Canvas>

      {/* Start Screen */}
      {gameState === 'start' && <StartScreen onStart={startGame} />}

      {/* HUD Overlay */}
      {gameState === 'playing' && (
        <>
          <HUD speed={speed} lap={lap} time={time} bestLap={bestLap} />
          <MobileControls controlsRef={controlsRef} />
        </>
      )}

      {/* Finish Screen */}
      {gameState === 'finished' && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/80 backdrop-blur-sm">
          <div className="text-center px-4">
            <h1
              className="text-5xl md:text-8xl font-bold mb-4 tracking-tighter"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: '#00ffaa',
                textShadow: '0 0 20px #00ffaa, 0 0 40px #00ffaa'
              }}
            >
              FINISH!
            </h1>
            <p className="text-lg md:text-2xl text-cyan-400 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Best Lap: {bestLap ? (bestLap / 1000).toFixed(2) : '--'}s
            </p>
            <p className="text-base md:text-lg text-gray-400 mb-8" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Total Time: {(time / 1000).toFixed(2)}s
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #ff0066 0%, #ff6600 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 0 30px rgba(255, 0, 102, 0.5)'
              }}
            >
              RACE AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="absolute bottom-2 left-0 right-0 text-center z-30 pointer-events-none"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        <p className="text-xs text-gray-600 tracking-wide">
          Requested by <span className="text-gray-500">@0xPaulius</span> · Built by <span className="text-gray-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}
