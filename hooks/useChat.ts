import { useCallback } from 'react'
import { useChatStore } from '@/store/chat.store'
import { useCharacterStore } from '@/store/character.store'
import { aiService } from '@/services/ai.service'
import { buildContextualPrompt, formatMessagesForAPI } from '@/utils/promptBuilder'
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

      // Create new session if none exists
      if (!sessionId) {
        sessionId = createSession(currentCharacter.id)
      }

      // Add user message
      const userMessage: Omit<Message, 'id'> = {
        role: 'user',
        content,
        timestamp: Date.now(),
        characterId: currentCharacter.id,
        status: 'sent',
      }

      addMessage(sessionId, userMessage)

      // Prepare assistant message
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

        const messages = currentSession.messages.filter(
          (msg) => msg.role !== 'system'
        )

        const systemPrompt = buildContextualPrompt(
          currentCharacter,
          messages
        )

        if (stream) {
          // Streaming response
          let fullResponse = ''

          await aiService.generateStreamingResponse(
            messages,
            systemPrompt,
            (chunk) => {
              fullResponse += chunk
              updateMessage(sessionId!, assistantMessageId, {
                content: fullResponse,
                status: 'streaming',
              })
            }
          )

          // Mark as sent when complete
          updateMessage(sessionId, assistantMessageId, {
            content: fullResponse,
            status: 'sent',
          })
        } else {
          // Non-streaming response
          const response = await aiService.generateResponse(
            messages,
            systemPrompt
          )

          updateMessage(sessionId, assistantMessageId, {
            content: response,
            status: 'sent',
          })
        }

        setError(null)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send message'

        updateMessage(sessionId!, assistantMessageId, {
          status: 'error',
          error: errorMessage,
        })

        setError(errorMessage)
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