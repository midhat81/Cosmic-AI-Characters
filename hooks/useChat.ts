import { useCallback } from 'react'
import { useChatStore } from '@/store/chat.store'
import { useCharacterStore } from '@/store/character.store'
import type { Message } from '@/types/chat'

export function useChat() {
  const {
    sessions,
    currentSessionId,
    isStreaming,
    error,
    createSession,
    setCurrentSession,
    addMessage,
    updateMessage,
    setStreaming,
    setError,
    getCurrentSession,
    clearSession,
  } = useChatStore()

  const { currentCharacter } = useCharacterStore()

  const sendMessage = useCallback(
    async (content: string, stream: boolean = true) => {
      if (!currentCharacter) {
        setError('No character selected')
        return
      }

      let sessionId = currentSessionId

      if (!sessionId) {
        sessionId = createSession(currentCharacter.id)
      }

      const userMessage: Omit<Message, 'id'> = {
        role: 'user',
        content,
        timestamp: Date.now(),
        characterId: currentCharacter.id,
        status: 'sent',
      }

      addMessage(sessionId, userMessage)

      const assistantMessageId = `temp-${Date.now()}`
      const assistantMessage: Omit<Message, 'id'> = {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        characterId: currentCharacter.id,
        status: stream ? 'streaming' : 'sending',
      }

      addMessage(sessionId, { ...assistantMessage, id: assistantMessageId } as Message)

      try {
        setStreaming(true)

        const currentSession = getCurrentSession()
        if (!currentSession) {
          throw new Error('Session not found')
        }

        const messages = currentSession.messages.filter((msg) => msg.role !== 'system')

        // Call the API endpoint
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            characterId: currentCharacter.id,
            stream: false, // Temporarily set to false for testing
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `API error: ${response.statusText}`)
        }

        const data = await response.json()

        updateMessage(sessionId, assistantMessageId, {
          content: data.message.content,
          status: 'sent',
        })

        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message'

        updateMessage(sessionId!, assistantMessageId, {
          status: 'error',
          error: errorMessage,
        })

        setError(errorMessage)
        console.error('Send message error:', err)
      } finally {
        setStreaming(false)
      }
    },
    [
      currentCharacter,
      currentSessionId,
      createSession,
      addMessage,
      updateMessage,
      setStreaming,
      setError,
      getCurrentSession,
    ]
  )

  const startNewChat = useCallback(() => {
    if (currentCharacter) {
      const newSessionId = createSession(currentCharacter.id)
      setCurrentSession(newSessionId)
    }
  }, [currentCharacter, createSession, setCurrentSession])

  const clearCurrentChat = useCallback(() => {
    if (currentSessionId) {
      clearSession(currentSessionId)
    }
  }, [currentSessionId, clearSession])

  return {
    sessions,
    currentSessionId,
    currentSession: getCurrentSession(),
    isStreaming,
    error,
    sendMessage,
    startNewChat,
    clearCurrentChat,
    setCurrentSession,
  }
}