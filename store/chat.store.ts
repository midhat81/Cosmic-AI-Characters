import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatState, ChatSession, Message } from '@/types/chat'
import { generateSessionId, generateMessageId } from '@/utils/generateId'

interface ChatStore extends ChatState {
  // Actions
  createSession: (characterId: string) => string
  setCurrentSession: (sessionId: string | null) => void
  addMessage: (sessionId: string, message: Omit<Message, 'id'>) => void
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void
  deleteMessage: (sessionId: string, messageId: string) => void
  clearSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  setStreaming: (isStreaming: boolean) => void
  setError: (error: string | null) => void
  getCurrentSession: () => ChatSession | null
  getSessionMessages: (sessionId: string) => Message[]
  reset: () => void
}

const initialState: ChatState = {
  sessions: {},
  currentSessionId: null,
  isStreaming: false,
  error: null,
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      createSession: (characterId) => {
        const sessionId = generateSessionId()
        const now = Date.now()

        const newSession: ChatSession = {
          id: sessionId,
          characterId,
          messages: [],
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: newSession,
          },
          currentSessionId: sessionId,
          error: null,
        }))

        return sessionId
      },

      setCurrentSession: (sessionId) => {
        set({ currentSessionId: sessionId })
      },

      addMessage: (sessionId, message) => {
        const messageId = generateMessageId()
        const timestamp = Date.now()

        const newMessage: Message = {
          ...message,
          id: messageId,
          timestamp,
        }

        set((state) => {
          const session = state.sessions[sessionId]
          if (!session) return state

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: [...session.messages, newMessage],
                updatedAt: timestamp,
              },
            },
          }
        })
      },

      updateMessage: (sessionId, messageId, updates) => {
        set((state) => {
          const session = state.sessions[sessionId]
          if (!session) return state

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: session.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
                updatedAt: Date.now(),
              },
            },
          }
        })
      },

      deleteMessage: (sessionId, messageId) => {
        set((state) => {
          const session = state.sessions[sessionId]
          if (!session) return state

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: session.messages.filter((msg) => msg.id !== messageId),
                updatedAt: Date.now(),
              },
            },
          }
        })
      },

      clearSession: (sessionId) => {
        set((state) => {
          const session = state.sessions[sessionId]
          if (!session) return state

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: [],
                updatedAt: Date.now(),
              },
            },
          }
        })
      },

      deleteSession: (sessionId) => {
        set((state) => {
          const { [sessionId]: deleted, ...remainingSessions } = state.sessions

          return {
            sessions: remainingSessions,
            currentSessionId:
              state.currentSessionId === sessionId
                ? null
                : state.currentSessionId,
          }
        })
      },

      setStreaming: (isStreaming) => {
        set({ isStreaming })
      },

      setError: (error) => {
        set({ error, isStreaming: false })
      },

      getCurrentSession: () => {
        const { sessions, currentSessionId } = get()
        if (!currentSessionId) return null
        return sessions[currentSessionId] || null
      },

      getSessionMessages: (sessionId) => {
        const { sessions } = get()
        return sessions[sessionId]?.messages || []
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'cosmic-chat-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
)