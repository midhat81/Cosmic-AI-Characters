import type { Character } from '@/types/character'

export const CHARACTER_CONFIG = {
  // Default greeting patterns
  greetingPatterns: {
    morning: ['Good morning', 'Morning greetings', 'Rise and shine'],
    afternoon: ['Good afternoon', 'Afternoon greetings', 'Hello there'],
    evening: ['Good evening', 'Evening greetings', 'Greetings this evening'],
    night: ['Good night', 'Night greetings', 'Hello in the darkness'],
  },

  // Response length preferences
  responseLength: {
    short: { min: 20, max: 100 },
    medium: { min: 100, max: 300 },
    long: { min: 300, max: 600 },
  },

  // Personality traits mapping
  personalityTraits: {
    adventurous: {
      keywords: ['explore', 'discover', 'adventure', 'journey', 'quest'],
      tone: 'excited and energetic',
      emoji: '🚀🗺️⛰️🌍✨',
    },
    wise: {
      keywords: ['understand', 'wisdom', 'knowledge', 'insight', 'learn'],
      tone: 'calm and thoughtful',
      emoji: '🌙📚🔮💫🕊️',
    },
    playful: {
      keywords: ['fun', 'play', 'create', 'imagine', 'enjoy'],
      tone: 'cheerful and spontaneous',
      emoji: '✨🎨🎉🌈🎪',
    },
    mysterious: {
      keywords: ['mystery', 'secret', 'hidden', 'enigma', 'reveal'],
      tone: 'cryptic and intriguing',
      emoji: '🌌🔍🗝️👁️💠',
    },
    calm: {
      keywords: ['peace', 'balance', 'harmony', 'center', 'tranquil'],
      tone: 'serene and composed',
      emoji: '☮️🧘‍♂️🌸🕉️💆‍♀️',
    },
  },

  // Mood-based response modifiers
  moodModifiers: {
    happy: { enthusiasm: 1.2, positivity: 1.3 },
    curious: { questioning: 1.4, exploration: 1.3 },
    excited: { energy: 1.5, exclamations: 1.4 },
    thoughtful: { depth: 1.3, reflection: 1.4 },
    energetic: { pace: 1.4, action: 1.3 },
  },

  // Conversation starters by personality
  conversationStarters: {
    adventurous: [
      "What's the most exciting thing you've done recently?",
      'If you could explore anywhere, where would you go?',
      'Ready to step outside your comfort zone?',
      'What adventure are you dreaming about?',
    ],
    wise: [
      'What questions are on your mind today?',
      'What wisdom are you seeking?',
      'Tell me, what troubles your heart?',
      'What would you like to understand better?',
    ],
    playful: [
      'Want to play a game?',
      'What makes you smile?',
      'Ready to create something amazing?',
      "What's bringing you joy today?",
    ],
    mysterious: [
      'What mysteries intrigue you?',
      'What secrets do you seek to uncover?',
      'What lies beneath the surface?',
      'What hidden truths call to you?',
    ],
    calm: [
      'How are you feeling in this moment?',
      'What brings you peace?',
      'Shall we find balance together?',
      'What weighs on your mind?',
    ],
  },
}

// Helper function to get conversation starter
export function getConversationStarter(character: Character): string {
  const starters =
    CHARACTER_CONFIG.conversationStarters[character.personality]
  return starters[Math.floor(Math.random() * starters.length)]
}

// Helper function to get personality keywords
export function getPersonalityKeywords(character: Character): string[] {
  return CHARACTER_CONFIG.personalityTraits[character.personality].keywords
}

// Helper function to get mood emoji
export function getPersonalityEmoji(character: Character): string {
  const emojis = CHARACTER_CONFIG.personalityTraits[character.personality].emoji
  return emojis
}