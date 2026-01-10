'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { X, MessageSquare } from 'lucide-react'
import type { Character } from '@/types/character'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface CharacterDetailProps {
  character: Character
  onClose?: () => void
  onStartChat?: () => void
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({
  character,
  onClose,
  onStartChat,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="elevated" padding="none" className="overflow-hidden">
        {/* Header with Background */}
        <div
          className="relative h-48 p-6"
          style={{ background: character.background }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}

          {/* Avatar & Name */}
          <div className="relative z-10 flex flex-col items-center text-center mt-8">
            <Avatar
              src={character.avatar}
              alt={character.name}
              name={character.name}
              size="xl"
              fallbackColor={character.color}
            />
            <h2 className="text-2xl font-bold text-white mt-4">
              {character.name}
            </h2>
            <p className="text-white/90 text-sm">{character.title}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Personality & Mood */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="primary">{character.personality}</Badge>
            <Badge variant="secondary">{character.mood}</Badge>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About
            </h3>
            <p className="text-gray-700">{character.description}</p>
          </div>

          {/* Backstory */}
          {character.backstory && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Backstory
              </h3>
              <p className="text-gray-700">{character.backstory}</p>
            </div>
          )}

          {/* Traits */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Personality Traits
            </h3>
            <ul className="space-y-2">
              {character.traits.map((trait, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-cosmic-500 mt-1">✦</span>
                  <span className="text-gray-700">{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          {onStartChat && (
            <Button
              onClick={onStartChat}
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<MessageSquare size={20} />}
            >
              Start Conversation
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}