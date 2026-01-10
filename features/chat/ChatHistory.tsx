'use client'

import React from 'react'
import { formatRelativeTime } from '@/utils/formatTime'
import { MessageSquare, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { ChatSession } from '@/types/chat'
import { clsx } from 'clsx'

interface ChatHistoryProps {
  sessions: ChatSession[]
  currentSessionId?: string | null
  onSelectSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto text-gray-400 mb-3" size={48} />
        <p className="text-gray-500">No chat history yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isActive = session.id === currentSessionId
        const lastMessage = session.messages[session.messages.length - 1]
        const preview = lastMessage?.content.slice(0, 80) || 'No messages'

        return (
          <Card
            key={session.id}
            padding="sm"
            className={clsx(
              'cursor-pointer transition-all',
              isActive && 'ring-2 ring-cosmic-500'
            )}
            onClick={() => onSelectSession(session.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare size={16} className="text-cosmic-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">
                    {session.title || 'Chat Session'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mb-1">{preview}</p>
                <p className="text-xs text-gray-400">
                  {formatRelativeTime(session.updatedAt)} • {session.messages.length}{' '}
                  messages
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSession(session.id)
                }}
                aria-label="Delete session"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}