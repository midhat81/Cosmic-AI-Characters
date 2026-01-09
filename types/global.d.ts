export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // AI Configuration
      AI_SERVICE: 'local' | 'cloud'
      OLLAMA_BASE_URL: string
      OLLAMA_MODEL: string
      LM_STUDIO_BASE_URL?: string
      
      // Cloud AI (Optional)
      OPENAI_API_KEY?: string
      ANTHROPIC_API_KEY?: string
      CLOUD_AI_MODEL?: string
      
      // Voice Services
      TTS_SERVICE: 'browser' | 'elevenlabs' | 'google'
      STT_SERVICE: 'browser' | 'google'
      ELEVENLABS_API_KEY?: string
      GOOGLE_CLOUD_API_KEY?: string
      
      // App Settings
      NEXT_PUBLIC_APP_URL: string
      NEXT_PUBLIC_APP_NAME: string
      NEXT_PUBLIC_MAX_MESSAGE_LENGTH: string
      NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE: string
      NEXT_PUBLIC_ENABLE_STREAMING: string
      NEXT_PUBLIC_STREAM_CHUNK_SIZE: string
    }
  }
}