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

    console.log('🤖 AI Service initialized:', {
      service: this.service,
      baseUrl: this.baseUrl,
      model: this.model,
    })
  }

  async generateResponse(
    messages: Message[],
    systemPrompt: string,
    config: AIServiceConfig = {}
  ): Promise<string> {
    try {
      console.log('📤 Generating AI response...', {
        messageCount: messages.length,
        model: this.model,
      })

      if (this.service === 'local') {
        return await this.generateOllamaResponse(messages, systemPrompt, config)
      } else {
        throw new AIServiceError('Cloud AI not configured', 'NOT_CONFIGURED')
      }
    } catch (error) {
      console.error('❌ AI Service Error:', error)
      throw new AIServiceError(
        'Failed to generate AI response',
        'GENERATION_FAILED',
        error instanceof Error ? error : undefined
      )
    }
  }

  async generateStreamingResponse(
    messages: Message[],
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    config: AIServiceConfig = {}
  ): Promise<void> {
    try {
      if (this.service === 'local') {
        await this.streamOllamaResponse(messages, systemPrompt, onChunk, config)
      } else {
        throw new AIServiceError('Cloud AI not configured', 'NOT_CONFIGURED')
      }
    } catch (error) {
      console.error('❌ AI Streaming Error:', error)
      throw new AIServiceError(
        'Failed to stream AI response',
        'STREAMING_FAILED',
        error instanceof Error ? error : undefined
      )
    }
  }

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

    console.log('📡 Calling Ollama:', {
      url: `${this.baseUrl}/api/generate`,
      model: requestBody.model,
      promptLength: prompt.length,
    })

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }

      const data: OllamaResponse = await response.json()
      console.log('✅ Ollama response received:', {
        responseLength: data.response.length,
        done: data.done,
      })

      return data.response
    } catch (error) {
      console.error('❌ Ollama fetch error:', error)
      throw error
    }
  }

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
        const lines = chunk.split('\n').filter((line) => line.trim())

        for (const line of lines) {
          try {
            const data: OllamaStreamChunk = JSON.parse(line)
            if (data.response) {
              onChunk(data.response)
            }
          } catch (e) {
            console.warn('⚠️ Failed to parse stream chunk:', line)
          }
        }
      }
    )
  }

  private buildPromptFromMessages(messages: Message[]): string {
    return messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => {
        const role = msg.role === 'assistant' ? 'Assistant' : 'User'
        return `${role}: ${msg.content}`
      })
      .join('\n\n')
  }

  async checkHealth(): Promise<boolean> {
    try {
      console.log('🏥 Checking Ollama health:', this.baseUrl)
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
      })
      const isHealthy = response.ok
      console.log(isHealthy ? '✅ Ollama is healthy' : '❌ Ollama is not responding')
      return isHealthy
    } catch (error) {
      console.error('❌ Ollama health check failed:', error)
      return false
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      const data: { models: Array<{ name: string }> } = await response.json()
      return data.models.map((m) => m.name)
    } catch (error) {
      console.error('Failed to list models:', error)
      return []
    }
  }
}

export const aiService = new AIService()