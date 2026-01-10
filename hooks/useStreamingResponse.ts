import { useState, useCallback, useRef } from 'react'
import { aiService } from '@/services/ai.service'
import type { Message } from '@/types/chat'

interface UseStreamingResponseOptions {
  onChunk?: (chunk: string) => void
  onComplete?: (fullResponse: string) => void
  onError?: (error: Error) => void
}

export function useStreamingResponse() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedContent, setStreamedContent] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const startStreaming = useCallback(
    async (
      messages: Message[],
      systemPrompt: string,
      options?: UseStreamingResponseOptions
    ) => {
      setIsStreaming(true)
      setStreamedContent('')
      setError(null)

      abortControllerRef.current = new AbortController()

      let fullResponse = ''

      try {
        await aiService.generateStreamingResponse(
          messages,
          systemPrompt,
          (chunk) => {
            fullResponse += chunk
            setStreamedContent(fullResponse)
            options?.onChunk?.(chunk)
          }
        )

        options?.onComplete?.(fullResponse)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Streaming failed')
        setError(error)
        options?.onError?.(error)
      } finally {
        setIsStreaming(false)
        abortControllerRef.current = null
      }

      return fullResponse
    },
    []
  )

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const reset = useCallback(() => {
    setStreamedContent('')
    setError(null)
    setIsStreaming(false)
  }, [])

  return {
    isStreaming,
    streamedContent,
    error,
    startStreaming,
    stopStreaming,
    reset,
  }
}