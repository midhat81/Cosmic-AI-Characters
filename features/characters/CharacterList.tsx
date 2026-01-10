'use client'

import React from 'react'
import { CharacterCard } from './CharacterCard'
import { FadeIn } from '@/components/animations/FadeIn'
import type { Character } from '@/types/character'

interface CharacterListProps {
  characters: Character[]
  selectedCharacterId?: string
  onSelectCharacter?: (character: Character) => void
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  selectedCharacterId,
  onSelectCharacter,
}) => {
  if (characters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No characters available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character, index) => (
        <FadeIn key={character.id} delay={index * 0.1}>
          <CharacterCard
            character={character}
            isSelected={selectedCharacterId === character.id}
            onClick={() => onSelectCharacter?.(character)}
          />
        </FadeIn>
      ))}
    </div>
  )
}