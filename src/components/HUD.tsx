import { useMemo } from 'react'

interface HUDProps {
  speed: number
  lap: number
  time: number
  bestLap: number | null
}

export function HUD({ speed, lap, time, bestLap }: HUDProps) {
  const formattedTime = useMemo(() => {
    const seconds = Math.floor(time / 1000)
    const ms = Math.floor((time % 1000) / 10)
    return `${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`
  }, [time])

  const formattedBestLap = useMemo(() => {
    if (!bestLap) return '--:--'
    const seconds = Math.floor(bestLap / 1000)
    const ms = Math.floor((bestLap % 1000) / 10)
    return `${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`
  }, [bestLap])

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Speed display - bottom left */}
      <div
        className="absolute bottom-8 left-4 md:left-8"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        <div className="relative">
          {/* Glow effect */}
          <div
            className="absolute inset-0 blur-xl opacity-50"
            style={{ background: 'linear-gradient(135deg, #00ffff, #ff0066)' }}
          />
          <div
            className="relative px-4 py-3 md:px-6 md:py-4"
            style={{
              background: 'rgba(10, 10, 20, 0.8)',
              border: '2px solid rgba(0, 255, 255, 0.5)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)'
            }}
          >
            <div className="text-xs md:text-sm text-cyan-400 tracking-widest mb-1">SPEED</div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-4xl md:text-6xl font-bold tracking-tight"
                style={{
                  color: speed > 150 ? '#ff0066' : '#00ffff',
                  textShadow: speed > 150
                    ? '0 0 20px #ff0066, 0 0 40px #ff0066'
                    : '0 0 20px #00ffff, 0 0 40px #00ffff'
                }}
              >
                {speed}
              </span>
              <span className="text-lg md:text-xl text-gray-400">KM/H</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lap counter - top right */}
      <div
        className="absolute top-4 right-4 md:top-8 md:right-8"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        <div
          className="px-4 py-3 md:px-6 md:py-4"
          style={{
            background: 'rgba(10, 10, 20, 0.8)',
            border: '2px solid rgba(255, 0, 102, 0.5)',
            boxShadow: '0 0 20px rgba(255, 0, 102, 0.3), inset 0 0 20px rgba(255, 0, 102, 0.1)'
          }}
        >
          <div className="text-xs md:text-sm text-pink-400 tracking-widest mb-1">LAP</div>
          <div className="flex items-baseline gap-1">
            <span
              className="text-3xl md:text-5xl font-bold"
              style={{
                color: '#ff0066',
                textShadow: '0 0 20px #ff0066'
              }}
            >
              {lap}
            </span>
            <span className="text-lg md:text-xl text-gray-500">/3</span>
          </div>
        </div>
      </div>

      {/* Time display - top center */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 md:top-8"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        <div
          className="px-6 py-3 md:px-8 md:py-4"
          style={{
            background: 'rgba(10, 10, 20, 0.8)',
            border: '2px solid rgba(255, 170, 0, 0.5)',
            boxShadow: '0 0 20px rgba(255, 170, 0, 0.3), inset 0 0 20px rgba(255, 170, 0, 0.1)'
          }}
        >
          <div className="text-center">
            <div className="text-xs md:text-sm text-amber-400 tracking-widest mb-1">TIME</div>
            <div
              className="text-2xl md:text-4xl font-bold tracking-wider"
              style={{
                color: '#ffaa00',
                textShadow: '0 0 20px #ffaa00'
              }}
            >
              {formattedTime}
            </div>
          </div>
        </div>
      </div>

      {/* Best lap - bottom right */}
      <div
        className="absolute bottom-8 right-4 md:right-8"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        <div
          className="px-3 py-2 md:px-4 md:py-3"
          style={{
            background: 'rgba(10, 10, 20, 0.6)',
            border: '1px solid rgba(0, 255, 136, 0.3)'
          }}
        >
          <div className="text-xs text-emerald-400 tracking-widest mb-1">BEST LAP</div>
          <div
            className="text-lg md:text-2xl font-semibold"
            style={{ color: '#00ff88' }}
          >
            {formattedBestLap}
          </div>
        </div>
      </div>

      {/* Controls hint - bottom center */}
      <div
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-gray-500">
          <div className="flex items-center gap-1 md:gap-2">
            <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-gray-400">W</kbd>
            <span className="hidden md:inline">or</span>
            <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-gray-400">↑</kbd>
            <span>Accelerate</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-gray-400">A/D</kbd>
            <span>Steer</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-cyan-400">SHIFT</kbd>
            <span className="text-cyan-400">Boost</span>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-20 md:w-32 h-20 md:h-32 border-l-2 border-t-2 border-cyan-500/30" />
      <div className="absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 border-r-2 border-t-2 border-pink-500/30" />
      <div className="absolute bottom-0 left-0 w-20 md:w-32 h-20 md:h-32 border-l-2 border-b-2 border-pink-500/30" />
      <div className="absolute bottom-0 right-0 w-20 md:w-32 h-20 md:h-32 border-r-2 border-b-2 border-cyan-500/30" />
    </div>
  )
}
