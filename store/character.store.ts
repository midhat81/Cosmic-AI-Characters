import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, CharacterState } from '@/types/character'

interface CharacterStore extends CharacterState {
  // Actions
  setCurrentCharacter: (character: Character | null) => void
  setCharacters: (characters: Character[]) => void
  getCharacterById: (id: string) => Character | undefined
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: CharacterState = {
  currentCharacter: null,
  characters: [],
  isLoading: false,
  error: null,
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentCharacter: (character) => {
        set({ currentCharacter: character, error: null })
      },

      setCharacters: (characters) => {
        set({ characters, error: null })
      },

      getCharacterById: (id) => {
        const { characters } = get()
        return characters.find((char) => char.id === id)
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error, isLoading: false })
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'cosmic-character-storage',
      partialize: (state) => ({
        currentCharacter: state.currentCharacter,
      }),
    }
  )
)