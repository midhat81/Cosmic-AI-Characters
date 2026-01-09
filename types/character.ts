export type CharacterId = 'mars' | 'luna' | 'nebula' | 'stellar' | 'cosmos'

export type CharacterPersonality = 
  | 'adventurous'
  | 'wise'
  | 'playful'
  | 'mysterious'
  | 'calm'

export type CharacterMood = 
  | 'happy'
  | 'curious'
  | 'excited'
  | 'thoughtful'
  | 'energetic'

export interface Character {
  id: CharacterId
  name: string
  title: string
  description: string
  personality: CharacterPersonality
  mood: CharacterMood
  avatar: string
  color: string
  background: string
  systemPrompt: string
  greeting: string
  traits: string[]
  voiceId?: string
  backstory?: string
}

export interface CharacterState {
  currentCharacter: Character | null
  characters: Character[]
  isLoading: boolean
  error: string | null
}