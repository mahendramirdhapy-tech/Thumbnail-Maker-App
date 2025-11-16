// components/editor/canvas-editor.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useCanvasStore } from '@/store/canvas-store'

export function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { canvas, initCanvas } = useCanvasStore()

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      initCanvas(1280, 720)
    }
  }, [canvas, initCanvas])

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <canvas
        ref={canvasRef}
        id="canvas"
        className="border border-gray-300 rounded"
      />
    </div>
  )
}
