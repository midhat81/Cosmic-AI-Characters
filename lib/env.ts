function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue
    if (!value) {
      console.warn(`Environment variable ${key} is not set`)
    }
    return value || ''
  }
  
  export const env = {
    // AI Configuration
    aiService: getEnvVar('AI_SERVICE', 'local'),
    ollamaBaseUrl: getEnvVar('OLLAMA_BASE_URL', 'http://localhost:11434'),
    ollamaModel: getEnvVar('OLLAMA_MODEL', 'llama3.1:latest'),
    lmStudioBaseUrl: getEnvVar('LM_STUDIO_BASE_URL', 'http://localhost:1234'),
  
    // Cloud AI (Optional)
    openaiApiKey: getEnvVar('OPENAI_API_KEY', ''),
    anthropicApiKey: getEnvVar('ANTHROPIC_API_KEY', ''),
    cloudAiModel: getEnvVar('CLOUD_AI_MODEL', 'gpt-4'),
  
    // Voice Services
    ttsService: getEnvVar('TTS_SERVICE', 'browser'),
    sttService: getEnvVar('STT_SERVICE', 'browser'),
    elevenLabsApiKey: getEnvVar('ELEVENLABS_API_KEY', ''),
    googleCloudApiKey: getEnvVar('GOOGLE_CLOUD_API_KEY', ''),
  
    // Public Variables
    appUrl: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    appName: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Cosmic Characters'),
  
    // Node Environment
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  } as const
  
  // Validation function
  export function validateEnv(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
  
    // Check AI service configuration
    if (env.aiService === 'local') {
      if (!env.ollamaBaseUrl) {
        errors.push('OLLAMA_BASE_URL is required when using local AI service')
      }
      if (!env.ollamaModel) {
        errors.push('OLLAMA_MODEL is required when using local AI service')
      }
    }
  
    if (env.aiService === 'cloud') {
      if (!env.openaiApiKey && !env.anthropicApiKey) {
        errors.push(
          'Either OPENAI_API_KEY or ANTHROPIC_API_KEY is required for cloud AI service'
        )
      }
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    }
  }