'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ChatHistory } from '@/features/chat/ChatHistory'
import { useChatStore } from '@/store/chat.store'
import { useCharacterStore } from '@/store/character.store'
import { FadeIn } from '@/components/animations/FadeIn'
import { MessageSquare } from 'lucide-react'

export default function ChatsPage() {
  const router = useRouter()
  const { sessions, setCurrentSession, deleteSession } = useChatStore()
  const { characters } = useCharacterStore()

  const sessionList = Object.values(sessions).sort(
    (a, b) => b.updatedAt - a.updatedAt
  )

  const handleSelectSession = (sessionId: string) => {
    const session = sessions[sessionId]
    if (session) {
      setCurrentSession(sessionId)
      router.push(`/characters/${session.characterId}`)
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteSession(sessionId)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <FadeIn>
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare size={32} className="text-cosmic-600" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Chat History</h1>
            <p className="text-gray-600">View and manage your conversations</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <ChatHistory
          sessions={sessionList}
          currentSessionId={null}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
      </FadeIn>
    </div>
  )
}