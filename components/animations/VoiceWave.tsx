'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface VoiceWaveProps {
  isActive?: boolean
  barCount?: number
  className?: string
  color?: string
}

export const VoiceWave: React.FC<VoiceWaveProps> = ({
  isActive = false,
  barCount = 5,
  className,
  color = 'bg-cosmic-500',
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => i)

  return (
    <div className={clsx('flex items-center justify-center gap-1', className)}>
      {bars.map((i) => (
        <motion.div
          key={i}
          className={clsx('w-1 rounded-full', color)}
          animate={
            isActive
              ? {
                  height: [8, 20, 8],
                  opacity: [0.5, 1, 0.5],
                }
              : {
                  height: 8,
                  opacity: 0.3,
                }
          }
          transition={
            isActive
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }
              : {
                  duration: 0.3,
                }
          }
        />
      ))}
    </div>
  )
}