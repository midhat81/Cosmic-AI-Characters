export const APP_CONFIG = {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Cosmic Characters',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: '1.0.0',
    description: 'AI-driven interactive character conversations',
  } as const
  
  export const AI_CONFIG = {
    service: (process.env.AI_SERVICE || 'local') as 'local' | 'cloud',
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama3.1:latest',
    },
    lmStudio: {
      baseUrl: process.env.LM_STUDIO_BASE_URL || 'http://localhost:1234',
    },
    cloud: {
      model: process.env.CLOUD_AI_MODEL || 'gpt-4',
    },
    maxTokens: 2048,
    temperature: 0.8,
    topP: 0.9,
  } as const
  
  export const CHAT_CONFIG = {
    maxMessageLength: parseInt(
      process.env.NEXT_PUBLIC_MAX_MESSAGE_LENGTH || '2000',
      10
    ),
    rateLimitPerMinute: parseInt(
      process.env.NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE || '60',
      10
    ),
    enableStreaming:
      process.env.NEXT_PUBLIC_ENABLE_STREAMING === 'true' || true,
    streamChunkSize: parseInt(
      process.env.NEXT_PUBLIC_STREAM_CHUNK_SIZE || '10',
      10
    ),
    defaultGreeting: 'Hello! How can I assist you today?',
  } as const
  
  export const VOICE_CONFIG = {
    tts: {
      service: (process.env.TTS_SERVICE || 'browser') as
        | 'browser'
        | 'elevenlabs'
        | 'google',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
    },
    stt: {
      service: (process.env.STT_SERVICE || 'browser') as 'browser' | 'google',
      language: 'en-US',
      continuous: false,
      interimResults: true,
      maxAlternatives: 1,
    },
  } as const
  
  export const STORAGE_KEYS = {
    chatSessions: 'cosmic_chat_sessions',
    currentSession: 'cosmic_current_session',
    userPreferences: 'cosmic_user_preferences',
    characterMemories: 'cosmic_character_memories',
    settings: 'cosmic_settings',
  } as const
  
  export const API_ROUTES = {
    chat: '/api/chat',
    characters: '/api/characters',
    voiceTTS: '/api/voice/tts',
    voiceSTT: '/api/voice/stt',
  } as const
  
  export const ANIMATION_DURATIONS = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    verySlow: 0.8,
  } as const
  
  export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  } as const