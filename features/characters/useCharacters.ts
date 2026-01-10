import { useEffect } from 'react'
import { useCharacterStore } from '@/store/character.store'
import { CHARACTERS, getCharacterById } from './character.data'

export function useCharacters() {
  const {
    characters,
    currentCharacter,
    isLoading,
    error,
    setCharacters,
    setCurrentCharacter,
    getCharacterById: getStoreCharacterById,
    setLoading,
    setError,
  } = useCharacterStore()

  // Initialize characters on mount
  useEffect(() => {
    if (characters.length === 0) {
      setCharacters(CHARACTERS)
    }
  }, [characters.length, setCharacters])

  const selectCharacter = (characterId: string) => {
    setLoading(true)
    try {
      const character = getCharacterById(characterId)
      if (character) {
        setCurrentCharacter(character)
        setError(null)
      } else {
        setError(`Character with id "${characterId}" not found`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select character')
    } finally {
      setLoading(false)
    }
  }

  const clearSelection = () => {
    setCurrentCharacter(null)
  }

  return {
    characters: characters.length > 0 ? characters : CHARACTERS,
    currentCharacter,
    isLoading,
    error,
    selectCharacter,
    clearSelection,
    getCharacterById: getStoreCharacterById,
  }
}