export interface ConversationMemory {
    characterId: string
    sessionId: string
    summary: string
    keyTopics: string[]
    userPreferences: Record<string, any>
    lastInteraction: number
    messageCount: number
  }
  
  export interface MemoryEntry {
    id: string
    characterId: string
    content: string
    importance: number
    timestamp: number
    category: 'fact' | 'preference' | 'emotion' | 'event'
  }
  
  export interface MemoryState {
    memories: Record<string, ConversationMemory>
    entries: MemoryEntry[]
    isLoading: boolean
    error: string | null
  }
  
  export interface MemoryContext {
    recentMessages: string[]
    userPreferences: Record<string, any>
    conversationSummary: string
    relevantMemories: MemoryEntry[]
  }