'use client'

import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useVoice } from '@/hooks/useVoice'
import { clsx } from 'clsx'

interface VoicePlayerProps {
  text: string
  autoPlay?: boolean
  showControls?: boolean
  variant?: 'default' | 'compact'
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  text,
  autoPlay = false,
  showControls = true,
  variant = 'default',
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const { speak, stopSpeaking, playbackState } = useVoice()

  useEffect(() => {
    if (autoPlay && text) {
      handlePlay()
    }
  }, [autoPlay, text])

  useEffect(() => {
    setIsPlaying(playbackState === 'playing')
  }, [playbackState])

  const handlePlay = async () => {
    try {
      await speak(text)
      setIsPlaying(false)
    } catch (error) {
      console.error('Failed to play audio:', error)
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    stopSpeaking()
    setIsPlaying(false)
  }

  const handleToggle = () => {
    if (isPlaying) {
      handleStop()
    } else {
      handlePlay()
    }
  }

  if (!showControls) {
    return null
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-cosmic-600 transition-colors"
        aria-label={isPlaying ? 'Stop playback' : 'Play audio'}
      >
        {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Play/Pause Button */}
      <Button
        onClick={handleToggle}
        variant={isPlaying ? 'danger' : 'primary'}
        size="sm"
        leftIcon={isPlaying ? <Pause size={18} /> : <Play size={18} />}
      >
        {isPlaying ? 'Stop' : 'Play'}
      </Button>

      {/* Visual Indicator */}
      <div className="flex-1 flex items-center gap-1">
        {isPlaying ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'w-1 rounded-full bg-cosmic-500 animate-pulse',
                  i % 2 === 0 ? 'h-3' : 'h-5'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </>
        ) : (
          <span className="text-sm text-gray-600">Click play to listen</span>
        )}
      </div>
    </div>
  )
}