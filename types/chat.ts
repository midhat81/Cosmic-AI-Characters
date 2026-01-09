export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageStatus = 'sending' | 'sent' | 'error' | 'streaming'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  characterId?: string
  status?: MessageStatus
  error?: string
}

export interface ChatSession {
  id: string
  characterId: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  title?: string
}

export interface ChatState {
  sessions: Record<string, ChatSession>
  currentSessionId: string | null
  isStreaming: boolean
  error: string | null
}

export interface StreamChunk {
  content: string
  done: boolean
}

export interface ChatRequestBody {
  messages: Message[]
  characterId: string
  stream?: boolean
}

export interface ChatResponse {
  message: Message
  sessionId: string
}