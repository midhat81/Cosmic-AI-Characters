'use client'

import React, { useRef, useEffect } from 'react'
import { Loader } from '@/components/ui/Loader'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import type { Message } from '@/types/chat'
import { useVoice } from '@/hooks/useVoice'
import { useSettingsStore } from '@/store/settings.store'

interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  onSendMessage: (message: string) => void
  characterName?: string
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading = false,
  onSendMessage,
  characterName = 'Character',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { speak } = useVoice()
  const autoPlayTTS = useSettingsStore((state) => state.settings.autoPlayTTS)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-play TTS for assistant messages
  useEffect(() => {
    if (autoPlayTTS && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant' && lastMessage.status === 'sent') {
        speak(lastMessage.content)
      }
    }
  }, [messages, autoPlayTTS, speak])

  const handleSpeak = (text: string) => {
    speak(text)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cosmic-100 to-nebula-100 flex items-center justify-center mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start a conversation with {characterName}
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              Type a message or use voice input to begin chatting!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onSpeak={handleSpeak}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <Loader variant="dots" size="sm" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={onSendMessage} isDisabled={isLoading} />
    </div>
  )
}