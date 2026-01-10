import { useCallback } from 'react'
import { memoryService } from './memory.service'
import type { Message } from '@/types/chat'
import type { ConversationMemory, MemoryContext } from '@/types/memory'

export function useMemory() {
  const getMemory = useCallback(
    (characterId: string, sessionId: string): ConversationMemory | null => {
      return memoryService.getConversationMemory(characterId, sessionId)
    },
    []
  )

  const updateMemory = useCallback(
    (
      characterId: string,
      sessionId: string,
      messages: Message[]
    ): ConversationMemory => {
      return memoryService.updateMemory(characterId, sessionId, messages)
    },
    []
  )

  const buildContext = useCallback(
    (
      characterId: string,
      sessionId: string,
      messages: Message[]
    ): MemoryContext => {
      return memoryService.buildMemoryContext(characterId, sessionId, messages)
    },
    []
  )

  const clearCharacterMemories = useCallback((characterId: string) => {
    memoryService.clearCharacterMemories(characterId)
  }, [])

  const clearAllMemories = useCallback(() => {
    memoryService.clearAllMemories()
  }, [])

  return {
    getMemory,
    updateMemory,
    buildContext,
    clearCharacterMemories,
    clearAllMemories,
  }
}