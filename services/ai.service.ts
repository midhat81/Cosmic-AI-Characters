import { AI_CONFIG } from '@/lib/constants'
import { env } from '@/lib/env'
import { fetcher, streamFetcher, FetchError } from '@/lib/fetcher'
import { AIServiceError } from '@/utils/errorHandlers'
import type { Message } from '@/types/chat'

export interface AIServiceConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  stream?: boolean
}

export interface OllamaRequest {
  model: string
  prompt: string
  system?: string
  stream?: boolean
  options?: {
    temperature?: number
    top_p?: number
    num_predict?: number
  }
}

export interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  eval_count?: number
  eval_duration?: number
}

export interface OllamaStreamChunk {
  model: string
  created_at: string
  response: string
  done: boolean
}

class AIService {
  private baseUrl: string
  private model: string
  private service: 'local' | 'cloud'

  constructor() {
    this.service = AI_CONFIG.service
    this.baseUrl = AI_CONFIG.ollama.baseUrl
    this.model = AI_CONFIG.ollama.model
  }

  /**
   * Generate a response from the AI model
   */
  async generateResponse(
    messages: Message[],
    systemPrompt: string,
    config: AIServiceConfig = {}
  ): Promise<string> {
    try {
      if (this.service === 'local') {
        return await this.generateOllamaResponse(
          messages,
          systemPrompt,
          config
        )
      } else {
        return await this.generateCloudResponse(messages, systemPrompt, config)
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw new AIServiceError(
        'Failed to generate AI response',
        'GENERATION_FAILED',
        error instanceof Error ? error : undefined
      )
    }
  }

  /**
   * Generate a streaming response from the AI model
   */
  async generateStreamingResponse(
    messages: Message[],
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    config: AIServiceConfig = {}
  ): Promise<void> {
    try {
      if (this.service === 'local') {
        await this.streamOllamaResponse(
          messages,
          systemPrompt,
          onChunk,
          config
        )
      } else {
        await this.streamCloudResponse(messages, systemPrompt, onChunk, config)
      }
    } catch (error) {
      console.error('AI Streaming Error:', error)
      throw new AIServiceError(
        'Failed to stream AI response',
        'STREAMING_FAILED',
        error instanceof Error ? error : undefined
      )
    }
  }

  /**
   * Generate response using Ollama
   */
  private async generateOllamaResponse(
    messages: Message[],
    systemPrompt: string,
    config: AIServiceConfig
  ): Promise<string> {
    const prompt = this.buildPromptFromMessages(messages)

    const requestBody: OllamaRequest = {
      model: config.model || this.model,
      prompt,
      system: systemPrompt,
      stream: false,
      options: {
        temperature: config.temperature || AI_CONFIG.temperature,
        top_p: config.topP || AI_CONFIG.topP,
        num_predict: config.maxTokens || AI_CONFIG.maxTokens,
      },
    }

    const response = await fetcher<OllamaResponse>(
      `${this.baseUrl}/api/generate`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        timeout: 60000,
        retry: 2,
        retryDelay: 2000,
      }
    )

    return response.response
  }

  /**
   * Stream response using Ollama
   */
  private async streamOllamaResponse(
    messages: Message[],
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    config: AIServiceConfig
  ): Promise<void> {
    const prompt = this.buildPromptFromMessages(messages)

    const requestBody: OllamaRequest = {
      model: config.model || this.model,
      prompt,
      system: systemPrompt,
      stream: true,
      options: {
        temperature: config.temperature || AI_CONFIG.temperature,
        top_p: config.topP || AI_CONFIG.topP,
        num_predict: config.maxTokens || AI_CONFIG.maxTokens,
      },
    }

    await streamFetcher(
      `${this.baseUrl}/api/generate`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        timeout: 120000,
      },
      (chunk) => {
        // Parse each line as JSON
        const lines = chunk.split('\n').filter((line) => line.trim())

        for (const line of lines) {
          try {
            const data: OllamaStreamChunk = JSON.parse(line)
            if (data.response) {
              onChunk(data.response)
            }
          } catch (e) {
            // Skip invalid JSON lines
            console.warn('Failed to parse stream chunk:', line)
          }
        }
      }
    )
  }

  /**
   * Generate response using cloud AI (OpenAI/Anthropic)
   */
  private async generateCloudResponse(
    messages: Message[],
    systemPrompt: string,
    config: AIServiceConfig
  ): Promise<string> {
    // Placeholder for cloud AI implementation
    // You can implement OpenAI or Anthropic here if needed
    throw new AIServiceError(
      'Cloud AI service not implemented yet',
      'NOT_IMPLEMENTED'
    )
  }

  /**
   * Stream response using cloud AI
   */
  private async streamCloudResponse(
    messages: Message[],
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    config: AIServiceConfig
  ): Promise<void> {
    // Placeholder for cloud AI streaming
    throw new AIServiceError(
      'Cloud AI streaming not implemented yet',
      'NOT_IMPLEMENTED'
    )
  }

  /**
   * Build a single prompt string from message history
   */
  private buildPromptFromMessages(messages: Message[]): string {
    return messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => {
        const role = msg.role === 'assistant' ? 'Assistant' : 'User'
        return `${role}: ${msg.content}`
      })
      .join('\n\n')
  }

  /**
   * Check if Ollama service is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetcher(`${this.baseUrl}/api/tags`, {
        timeout: 5000,
      })
      return !!response
    } catch (error) {
      console.error('Ollama health check failed:', error)
      return false
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetcher<{ models: Array<{ name: string }> }>(
        `${this.baseUrl}/api/tags`
      )
      return response.models.map((m) => m.name)
    } catch (error) {
      console.error('Failed to list models:', error)
      return []
    }
  }
}

// Export singleton instance
export const aiService = new AIService()