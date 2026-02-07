import { useState, useEffect } from 'react'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [visible, setVisible] = useState(false)
  const [glitchText, setGlitchText] = useState('NEON RUSH')

  useEffect(() => {
    setVisible(true)

    // Glitch effect
    const glitchInterval = setInterval(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*'
      const original = 'NEON RUSH'
      if (Math.random() > 0.8) {
        let glitched = ''
        for (let i = 0; i < original.length; i++) {
          glitched += Math.random() > 0.7
            ? chars[Math.floor(Math.random() * chars.length)]
            : original[i]
        }
        setGlitchText(glitched)
        setTimeout(() => setGlitchText('NEON RUSH'), 50)
      }
    }, 100)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center z-40 transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(10, 10, 30, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%)'
      }}
    >
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#00ffff' : '#ff0066',
              boxShadow: i % 2 === 0 ? '0 0 10px #00ffff' : '0 0 10px #ff0066',
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main title */}
      <div className="relative mb-8 md:mb-12">
        {/* Glow layer */}
        <h1
          className="absolute text-5xl md:text-8xl font-bold tracking-tighter blur-lg opacity-50"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            background: 'linear-gradient(135deg, #00ffff 0%, #ff0066 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {glitchText}
        </h1>
        {/* Main text */}
        <h1
          className="relative text-5xl md:text-8xl font-bold tracking-tighter"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            background: 'linear-gradient(135deg, #00ffff 0%, #ff0066 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 60px rgba(0, 255, 255, 0.5)'
          }}
        >
          {glitchText}
        </h1>
      </div>

      {/* Subtitle */}
      <p
        className="text-lg md:text-2xl text-gray-400 mb-8 md:mb-12 tracking-[0.3em] uppercase"
        style={{
          fontFamily: 'Rajdhani, sans-serif',
          animation: 'pulse 2s ease-in-out infinite'
        }}
      >
        City Circuit Championship
      </p>

      {/* Decorative line */}
      <div className="w-48 md:w-64 h-px mb-8 md:mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent"
          style={{ animation: 'shimmer 2s ease-in-out infinite' }}
        />
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="group relative px-8 py-4 md:px-12 md:py-5 text-lg md:text-xl font-bold tracking-widest transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        {/* Button background */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 102, 0.1) 100%)',
            border: '2px solid',
            borderImage: 'linear-gradient(135deg, #00ffff 0%, #ff0066 100%) 1',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1)'
          }}
        />
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(255, 0, 102, 0.2) 100%)',
            boxShadow: '0 0 50px rgba(0, 255, 255, 0.5)'
          }}
        />
        {/* Button text */}
        <span
          className="relative"
          style={{
            color: '#00ffff',
            textShadow: '0 0 20px #00ffff'
          }}
        >
          START RACE
        </span>
      </button>

      {/* Controls info */}
      <div
        className="mt-12 md:mt-16 text-center"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        <p className="text-sm md:text-base text-gray-500 mb-4">CONTROLS</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-gray-400 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded">W</kbd>
              <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded">↑</kbd>
            </div>
            <span>Accelerate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded">S</kbd>
              <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded">↓</kbd>
            </div>
            <span>Brake</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded">A/D</kbd>
              <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded">←/→</kbd>
            </div>
            <span>Steer</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-cyan-900/50 border border-cyan-700 rounded text-cyan-400">SHIFT</kbd>
            <span className="text-cyan-400">Boost</span>
          </div>
        </div>
      </div>

      {/* Mobile touch controls hint */}
      <p className="mt-6 text-xs text-gray-600 md:hidden" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
        Touch controls: Use on-screen buttons (coming soon) or connect a keyboard
      </p>

      {/* CSS Animations */}
      <style>{`
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 1; transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
