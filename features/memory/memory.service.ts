import type { ConversationMemory, MemoryEntry, MemoryContext } from '@/types/memory'
import type { Message } from '@/types/chat'
import { generateMemoryId } from '@/utils/generateId'
import { STORAGE_KEYS } from '@/lib/constants'

class MemoryService {
  private storageKey = STORAGE_KEYS.characterMemories

  /**
   * Get conversation memory for a character
   */
  getConversationMemory(characterId: string, sessionId: string): ConversationMemory | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return null

      const memories: Record<string, ConversationMemory> = JSON.parse(stored)
      const key = `${characterId}_${sessionId}`
      return memories[key] || null
    } catch (error) {
      console.error('Failed to get conversation memory:', error)
      return null
    }
  }

  /**
   * Save conversation memory
   */
  saveConversationMemory(memory: ConversationMemory): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.storageKey)
      const memories: Record<string, ConversationMemory> = stored
        ? JSON.parse(stored)
        : {}

      const key = `${memory.characterId}_${memory.sessionId}`
      memories[key] = memory

      localStorage.setItem(this.storageKey, JSON.stringify(memories))
    } catch (error) {
      console.error('Failed to save conversation memory:', error)
    }
  }

  /**
   * Update conversation memory with new messages
   */
  updateMemory(
    characterId: string,
    sessionId: string,
    messages: Message[]
  ): ConversationMemory {
    const existing = this.getConversationMemory(characterId, sessionId)

    const userMessages = messages.filter((m) => m.role === 'user')
    const lastMessage = messages[messages.length - 1]

    const memory: ConversationMemory = {
      characterId,
      sessionId,
      summary: existing?.summary || this.generateSummary(messages),
      keyTopics: existing?.keyTopics || this.extractKeyTopics(messages),
      userPreferences: existing?.userPreferences || {},
      lastInteraction: lastMessage?.timestamp || Date.now(),
      messageCount: messages.length,
    }

    this.saveConversationMemory(memory)
    return memory
  }

  /**
   * Generate a summary from messages
   */
  private generateSummary(messages: Message[]): string {
    if (messages.length === 0) return 'No conversation yet.'

    const recentMessages = messages.slice(-5)
    const topics = this.extractKeyTopics(recentMessages)

    if (topics.length === 0) {
      return 'General conversation.'
    }

    return `Discussion about ${topics.slice(0, 3).join(', ')}`
  }

  /**
   * Extract key topics from messages
   */
  private extractKeyTopics(messages: Message[]): string[] {
    const allText = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content.toLowerCase())
      .join(' ')

    // Simple keyword extraction (in production, use NLP)
    const words = allText.split(/\s+/)
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'is',
      'are',
      'was',
      'were',
      'i',
      'you',
      'he',
      'she',
      'it',
      'we',
      'they',
      'what',
      'how',
      'when',
      'where',
      'why',
    ])

    const wordFreq: Record<string, number> = {}

    words.forEach((word) => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })

    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  }

  /**
   * Create memory entry
   */
  createMemoryEntry(
    characterId: string,
    content: string,
    category: MemoryEntry['category'],
    importance: number = 0.5
  ): MemoryEntry {
    return {
      id: generateMemoryId(),
      characterId,
      content,
      importance,
      timestamp: Date.now(),
      category,
    }
  }

  /**
   * Build memory context for AI prompt
   */
  buildMemoryContext(
    characterId: string,
    sessionId: string,
    messages: Message[]
  ): MemoryContext {
    const memory = this.getConversationMemory(characterId, sessionId)

    return {
      recentMessages: messages.slice(-5).map((m) => m.content),
      userPreferences: memory?.userPreferences || {},
      conversationSummary: memory?.summary || '',
      relevantMemories: [], // Could be expanded with vector search
    }
  }

  /**
   * Clear all memories for a character
   */
  clearCharacterMemories(characterId: string): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return

      const memories: Record<string, ConversationMemory> = JSON.parse(stored)
      const filteredMemories = Object.fromEntries(
        Object.entries(memories).filter(
          ([key]) => !key.startsWith(characterId)
        )
      )

      localStorage.setItem(this.storageKey, JSON.stringify(filteredMemories))
    } catch (error) {
      console.error('Failed to clear character memories:', error)
    }
  }

  /**
   * Clear all memories
   */
  clearAllMemories(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.storageKey)
  }
}

export const memoryService = new MemoryService()