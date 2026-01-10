'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Sparkles } from 'lucide-react'
import type { Character } from '@/types/character'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

interface CharacterCardProps {
  character: Character
  isSelected?: boolean
  onClick?: () => void
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected = false,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        variant="elevated"
        padding="none"
        className={clsx(
          'cursor-pointer overflow-hidden transition-all duration-300',
          isSelected && 'ring-4 ring-cosmic-500 ring-offset-2'
        )}
        onClick={onClick}
      >
        {/* Background Gradient */}
        <div
          className="h-32 relative"
          style={{ background: character.background }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          
          {/* Floating Icon */}
          <motion.div
            className="absolute top-3 right-3"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="text-white/80" size={20} />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Avatar */}
          <div className="-mt-16 mb-4">
            <div className="inline-block p-1 bg-white rounded-full shadow-lg">
              <Avatar
                src={character.avatar}
                alt={character.name}
                name={character.name}
                size="xl"
                fallbackColor={character.color}
              />
            </div>
          </div>

          {/* Name & Title */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {character.name}
            </h3>
            <p className="text-sm text-gray-600">{character.title}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {character.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary" size="sm">
              {character.personality}
            </Badge>
            <Badge variant="secondary" size="sm">
              {character.mood}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}