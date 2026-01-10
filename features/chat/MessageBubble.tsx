'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { User, AlertCircle, Volume2 } from 'lucide-react'
import type { Message } from '@/types/chat'
import { Avatar } from '@/components/ui/Avatar'
import { TypingEffect } from '@/components/animations/TypingEffect'
import { formatTimestamp } from '@/utils/formatTime'
import { useCharacterStore } from '@/store/character.store'

interface MessageBubbleProps {
  message: Message
  showTimestamp?: boolean
  showAvatar?: boolean
  onSpeak?: (text: string) => void
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showTimestamp = true,
  showAvatar = true,
  onSpeak,
}) => {
  const currentCharacter = useCharacterStore((state) => state.currentCharacter)
  const isUser = message.role === 'user'
  const isStreaming = message.status === 'streaming'
  const hasError = message.status === 'error'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx('flex gap-3', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      {showAvatar && (
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-500 to-nebula-500 flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
          ) : (
            <Avatar
              src={currentCharacter?.avatar}
              alt={currentCharacter?.name}
              name={currentCharacter?.name}
              size="md"
              fallbackColor={currentCharacter?.color}
            />
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={clsx('flex-1 max-w-[70%]', isUser && 'items-end')}>
        {/* Bubble */}
        <div
          className={clsx(
            'rounded-2xl px-4 py-3 shadow-sm',
            isUser
              ? 'bg-gradient-to-br from-cosmic-500 to-cosmic-600 text-white'
              : hasError
              ? 'bg-red-50 border border-red-200 text-red-900'
              : 'bg-white border border-gray-200 text-gray-900'
          )}
        >
          {hasError ? (
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Error</p>
                <p className="text-sm">{message.error || 'Failed to send message'}</p>
              </div>
            </div>
          ) : isStreaming ? (
            <TypingEffect text={message.content} speed={20} cursor={false} />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>

        {/* Metadata */}
        <div
          className={clsx(
            'flex items-center gap-2 mt-1 px-2',
            isUser ? 'justify-end' : 'justify-start'
          )}
        >
          {showTimestamp && (
            <span className="text-xs text-gray-500">
              {formatTimestamp(message.timestamp)}
            </span>
          )}

          {!isUser && !hasError && onSpeak && (
            <button
              onClick={() => onSpeak(message.content)}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-cosmic-600 transition-colors"
              aria-label="Speak message"
            >
              <Volume2 size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}