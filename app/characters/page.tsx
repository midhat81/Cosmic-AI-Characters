'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CharacterList } from '@/features/characters/CharacterList'
import { CharacterDetail } from '@/features/characters/CharacterDetail'
import { Modal } from '@/components/ui/Modal'
import { useCharacters } from '@/features/characters/useCharacters'
import { useCharacterStore } from '@/store/character.store'
import { useChatStore } from '@/store/chat.store'
import { useUIStore } from '@/store/ui.store'
import type { Character } from '@/types/character'
import { FadeIn } from '@/components/animations/FadeIn'

export default function CharactersPage() {
  const router = useRouter()
  const { characters } = useCharacters()
  const setCurrentCharacter = useCharacterStore(
    (state) => state.setCurrentCharacter
  )
  const createSession = useChatStore((state) => state.createSession)
  const addToast = useUIStore((state) => state.addToast)

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character)
  }

  const handleStartChat = () => {
    if (selectedCharacter) {
      setCurrentCharacter(selectedCharacter)
      createSession(selectedCharacter.id)
      setSelectedCharacter(null)

      addToast({
        type: 'success',
        message: `Started conversation with ${selectedCharacter.name}!`,
      })

      router.push(`/characters/${selectedCharacter.id}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Character
          </h1>
          <p className="text-lg text-gray-600">
            Select a cosmic companion to begin your conversational journey
          </p>
        </div>
      </FadeIn>

      <CharacterList
        characters={characters}
        onSelectCharacter={handleSelectCharacter}
      />

      {/* Character Detail Modal */}
      <Modal
        isOpen={selectedCharacter !== null}
        onClose={() => setSelectedCharacter(null)}
        size="lg"
      >
        {selectedCharacter && (
          <CharacterDetail
            character={selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
            onStartChat={handleStartChat}
          />
        )}
      </Modal>
    </div>
  )
}