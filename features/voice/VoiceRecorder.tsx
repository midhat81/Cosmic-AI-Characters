'use client'

import React, { useState, useEffect } from 'react'
import { Mic, MicOff, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { VoiceWave } from '@/components/animations/VoiceWave'
import { useVoice } from '@/hooks/useVoice'
import { formatDuration } from '@/utils/formatTime'
import { clsx } from 'clsx'

interface VoiceRecorderProps {
  onTranscript?: (text: string) => void
  onCancel?: () => void
  autoSend?: boolean
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscript,
  onCancel,
  autoSend = false,
}) => {
  const [recordingDuration, setRecordingDuration] = useState(0)
  const { recordingState, transcript, startListening, stopListening, error } =
    useVoice()

  const isRecording = recordingState === 'recording'
  const hasTranscript = transcript.trim().length > 0

  // Timer for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingDuration(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  // Auto-send on stop if enabled
  useEffect(() => {
    if (!isRecording && hasTranscript && autoSend) {
      handleSend()
    }
  }, [isRecording, hasTranscript, autoSend])

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopListening()
    } else {
      await startListening()
    }
  }

  const handleSend = () => {
    if (hasTranscript) {
      onTranscript?.(transcript)
      stopListening()
    }
  }

  const handleCancel = () => {
    stopListening()
    onCancel?.()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Voice Input</h3>
        <button
          onClick={handleCancel}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Recording Visualization */}
      <div className="flex flex-col items-center mb-6">
        <div
          className={clsx(
            'w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300',
            isRecording
              ? 'bg-red-100 ring-4 ring-red-200 ring-offset-2'
              : 'bg-cosmic-100'
          )}
        >
          <VoiceWave isActive={isRecording} barCount={7} />
        </div>

        {/* Recording Duration */}
        {isRecording && (
          <div className="text-2xl font-mono font-semibold text-gray-900">
            {formatDuration(recordingDuration)}
          </div>
        )}

        {/* Status Text */}
        <p className="text-sm text-gray-600 mt-2">
          {isRecording ? 'Listening...' : 'Click to start recording'}
        </p>
      </div>

      {/* Transcript Display */}
      {hasTranscript && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-1">Transcript:</p>
          <p className="text-gray-900">{transcript}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isRecording ? (
          <Button
            onClick={handleToggleRecording}
            variant="danger"
            size="lg"
            fullWidth
            leftIcon={<MicOff size={20} />}
          >
            Stop Recording
          </Button>
        ) : hasTranscript ? (
          <>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              variant="primary"
              size="lg"
              className="flex-1"
              leftIcon={<Send size={20} />}
            >
              Send
            </Button>
          </>
        ) : (
          <Button
            onClick={handleToggleRecording}
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Mic size={20} />}
          >
            Start Recording
          </Button>
        )}
      </div>
    </div>
  )
}