'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Info } from 'lucide-react'
import { ChatWindow } from '@/features/chat/ChatWindow'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { useCharacters } from '@/features/characters/useCharacters'
import { useChat } from '@/hooks/useChat'
import { useCharacterStore } from '@/store/character.store'
import { useUIStore } from '@/store/ui.store'

export default function CharacterChatPage() {
  const params = useParams()
  const router = useRouter()
  const characterId = params.id as string

  const { characters, selectCharacter } = useCharacters()
  const currentCharacter = useCharacterStore((state) => state.currentCharacter)
  const { currentSession, sendMessage, isStreaming } = useChat()
  const addToast = useUIStore((state) => state.addToast)
  const openModal = useUIStore((state) => state.openModal)

  useEffect(() => {
    if (!currentCharacter || currentCharacter.id !== characterId) {
      selectCharacter(characterId)
    }
  }, [characterId, currentCharacter, selectCharacter])

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message, true)
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to send message. Please try again.',
      })
    }
  }

  const handleShowInfo = () => {
    openModal('character-info', currentCharacter)
  }

  if (!currentCharacter) {
    return <Loader fullScreen text="Loading character..." />
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/characters')}
            leftIcon={<ArrowLeft size={18} />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentCharacter.name}
            </h1>
            <p className="text-sm text-gray-600">{currentCharacter.title}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShowInfo}
          leftIcon={<Info size={18} />}
        >
          Info
        </Button>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full overflow-hidden">
        <ChatWindow
          messages={currentSession?.messages || []}
          isLoading={isStreaming}
          onSendMessage={handleSendMessage}
          characterName={currentCharacter.name}
        />
      </div>
    </div>
  )
}