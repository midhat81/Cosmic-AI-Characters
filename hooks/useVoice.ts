import { useState, useCallback, useRef } from 'react'
import { ttsService } from '@/services/tts.service'
import { sttService } from '@/services/stt.service'
import type { RecordingState, PlaybackState } from '@/types/voice'

export function useVoice() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const interimTranscriptRef = useRef('')

  // Text-to-Speech
  const speak = useCallback(async (text: string) => {
    try {
      setPlaybackState('loading')
      setError(null)

      await ttsService.speak(text)

      setPlaybackState('playing')

      // Reset state after speaking
      setTimeout(() => {
        setPlaybackState('idle')
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TTS failed')
      setPlaybackState('error')
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    ttsService.stop()
    setPlaybackState('idle')
  }, [])

  // Speech-to-Text
  const startListening = useCallback(
    async (onFinalTranscript?: (text: string) => void) => {
      try {
        setRecordingState('recording')
        setTranscript('')
        setError(null)
        interimTranscriptRef.current = ''

        await sttService.startListening(
          (text, isFinal) => {
            if (isFinal) {
              setTranscript(text)
              onFinalTranscript?.(text)
              interimTranscriptRef.current = ''
            } else {
              interimTranscriptRef.current = text
              setTranscript(text)
            }
          },
          (error) => {
            setError(error)
            setRecordingState('error')
          }
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'STT failed')
        setRecordingState('error')
      }
    },
    []
  )

  const stopListening = useCallback(() => {
    sttService.stopListening()
    setRecordingState('idle')
  }, [])

  const isSupported = useCallback(() => {
    return {
      tts: ttsService.checkSupport(),
      stt: sttService.checkSupport(),
    }
  }, [])

  return {
    // State
    recordingState,
    playbackState,
    transcript,
    error,

    // TTS methods
    speak,
    stopSpeaking,

    // STT methods
    startListening,
    stopListening,

    // Utilities
    isSupported,
  }
}