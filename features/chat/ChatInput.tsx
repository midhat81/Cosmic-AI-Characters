'use client'

import React, { useState, useRef, KeyboardEvent } from 'react'
import { Send, Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { VoiceWave } from '@/components/animations/VoiceWave'
import { useVoice } from '@/hooks/useVoice'
import { useSettingsStore } from '@/store/settings.store'
import { clsx } from 'clsx'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isDisabled?: boolean
  placeholder?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isDisabled = false,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sendOnEnter = useSettingsStore((state) => state.settings.sendOnEnter)

  const { recordingState, transcript, startListening, stopListening, isSupported } =
    useVoice()

  const isRecording = recordingState === 'recording'
  const voiceSupported = isSupported().stt

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !isDisabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && sendOnEnter) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceToggle = async () => {
    if (isRecording) {
      stopListening()
      if (transcript) {
        setMessage(transcript)
      }
    } else {
      setMessage('')
      await startListening((text, isFinal) => {
        if (isFinal) {
          setMessage(text)
        }
      })
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-2">
        {/* Voice Recording Indicator */}
        {isRecording && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <VoiceWave isActive={true} />
            <span className="text-sm text-gray-600">Listening...</span>
          </div>
        )}

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={isRecording ? transcript : message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? 'Speak now...' : placeholder}
            disabled={isDisabled || isRecording}
            rows={1}
            className={clsx(
              'w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none',
              'focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              'transition-all duration-200'
            )}
            style={{ maxHeight: '200px' }}
          />
        </div>

        {/* Voice Button */}
        {voiceSupported && (
          <Button
            onClick={handleVoiceToggle}
            variant={isRecording ? 'danger' : 'outline'}
            size="lg"
            disabled={isDisabled}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={isDisabled || !message.trim() || isRecording}
          size="lg"
          leftIcon={
            isDisabled ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />
          }
        >
          Send
        </Button>
      </div>

      {/* Helper Text */}
      <div className="mt-2 px-1">
        <p className="text-xs text-gray-500">
          {sendOnEnter ? (
            <>Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-gray-100 rounded">Shift+Enter</kbd> for new line</>
          ) : (
            <>Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Shift+Enter</kbd> for new line</>
          )}
        </p>
      </div>
    </div>
  )
}