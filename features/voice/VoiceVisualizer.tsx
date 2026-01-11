'use client'

import React, { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'

interface VoiceVisualizerProps {
  isActive?: boolean
  color?: string
  barCount?: number
  height?: number
  className?: string
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isActive = false,
  color = 'bg-cosmic-500',
  barCount = 20,
  height = 100,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [bars, setBars] = useState<number[]>(
    Array(barCount).fill(0.1)
  )

  useEffect(() => {
    if (isActive) {
      const animate = () => {
        setBars((prevBars) =>
          prevBars.map(() => Math.random() * 0.8 + 0.2)
        )
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setBars(Array(barCount).fill(0.1))
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, barCount])

  return (
    <div
      className={clsx('flex items-center justify-center gap-1', className)}
      style={{ height: `${height}px` }}
    >
      {bars.map((intensity, index) => (
        <div
          key={index}
          className={clsx(
            'w-1 rounded-full transition-all duration-100',
            color
          )}
          style={{
            height: `${intensity * height}px`,
            opacity: isActive ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}