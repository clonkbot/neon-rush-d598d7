import { useEffect, useRef, MutableRefObject } from 'react'

export interface Controls {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  boost: boolean
}

export function useGameControls(externalRef?: MutableRefObject<Controls>) {
  const internalRef = useRef<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false
  })

  const controls = externalRef || internalRef

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controls.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          controls.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          controls.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          controls.current.right = true
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          controls.current.boost = true
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controls.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          controls.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          controls.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          controls.current.right = false
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          controls.current.boost = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [controls])

  return controls
}
