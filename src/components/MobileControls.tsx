import { useEffect, useRef } from 'react'

interface MobileControlsProps {
  controlsRef: React.MutableRefObject<{
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    boost: boolean
  }>
}

export function MobileControls({ controlsRef }: MobileControlsProps) {
  const handleTouchStart = (control: keyof typeof controlsRef.current) => () => {
    controlsRef.current[control] = true
  }

  const handleTouchEnd = (control: keyof typeof controlsRef.current) => () => {
    controlsRef.current[control] = false
  }

  return (
    <div className="md:hidden absolute bottom-16 left-0 right-0 z-30 pointer-events-none">
      <div className="flex justify-between px-4">
        {/* Left side - Steering */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            className="w-16 h-16 rounded-lg flex items-center justify-center active:scale-95 transition-transform touch-none select-none"
            style={{
              background: 'rgba(0, 255, 255, 0.15)',
              border: '2px solid rgba(0, 255, 255, 0.5)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)'
            }}
            onTouchStart={handleTouchStart('left')}
            onTouchEnd={handleTouchEnd('left')}
            onTouchCancel={handleTouchEnd('left')}
          >
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="w-16 h-16 rounded-lg flex items-center justify-center active:scale-95 transition-transform touch-none select-none"
            style={{
              background: 'rgba(0, 255, 255, 0.15)',
              border: '2px solid rgba(0, 255, 255, 0.5)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)'
            }}
            onTouchStart={handleTouchStart('right')}
            onTouchEnd={handleTouchEnd('right')}
            onTouchCancel={handleTouchEnd('right')}
          >
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Right side - Accelerate/Brake/Boost */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex gap-2">
            <button
              className="w-16 h-16 rounded-lg flex items-center justify-center active:scale-95 transition-transform touch-none select-none"
              style={{
                background: 'rgba(255, 0, 102, 0.15)',
                border: '2px solid rgba(255, 0, 102, 0.5)',
                boxShadow: '0 0 15px rgba(255, 0, 102, 0.3)'
              }}
              onTouchStart={handleTouchStart('boost')}
              onTouchEnd={handleTouchEnd('boost')}
              onTouchCancel={handleTouchEnd('boost')}
            >
              <span className="text-pink-400 text-xs font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                NITRO
              </span>
            </button>
            <button
              className="w-20 h-16 rounded-lg flex items-center justify-center active:scale-95 transition-transform touch-none select-none"
              style={{
                background: 'rgba(0, 255, 136, 0.2)',
                border: '2px solid rgba(0, 255, 136, 0.6)',
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.4)'
              }}
              onTouchStart={handleTouchStart('forward')}
              onTouchEnd={handleTouchEnd('forward')}
              onTouchCancel={handleTouchEnd('forward')}
            >
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          <button
            className="w-full h-12 rounded-lg flex items-center justify-center active:scale-95 transition-transform touch-none select-none"
            style={{
              background: 'rgba(255, 100, 0, 0.15)',
              border: '2px solid rgba(255, 100, 0, 0.5)',
              boxShadow: '0 0 15px rgba(255, 100, 0, 0.3)'
            }}
            onTouchStart={handleTouchStart('backward')}
            onTouchEnd={handleTouchEnd('backward')}
            onTouchCancel={handleTouchEnd('backward')}
          >
            <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
