import { VOICE_CONFIG } from '@/lib/constants'
import { VoiceServiceError } from '@/utils/errorHandlers'
import type { STTConfig, SpeechRecognitionEvent } from '@/types/voice'

// Extend Window interface for webkit support
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

class STTService {
  private recognition: any = null
  private isSupported: boolean = false
  private isListening: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.isSupported = true
        this.setupRecognition()
      }
    }
  }

  /**
   * Setup speech recognition with default config
   */
  private setupRecognition(): void {
    if (!this.recognition) return

    this.recognition.continuous = VOICE_CONFIG.stt.continuous
    this.recognition.interimResults = VOICE_CONFIG.stt.interimResults
    this.recognition.maxAlternatives = VOICE_CONFIG.stt.maxAlternatives
    this.recognition.lang = VOICE_CONFIG.stt.language
  }

  /**
   * Check if STT is supported
   */
  checkSupport(): boolean {
    return this.isSupported
  }

  /**
   * Start listening for speech
   */
  async startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    config?: Partial<STTConfig>
  ): Promise<void> {
    if (!this.recognition) {
      throw new VoiceServiceError(
        'Speech recognition not supported',
        'NOT_SUPPORTED'
      )
    }

    if (this.isListening) {
      console.warn('Already listening')
      return
    }

    // Apply configuration
    if (config?.continuous !== undefined) {
      this.recognition.continuous = config.continuous
    }
    if (config?.interimResults !== undefined) {
      this.recognition.interimResults = config.interimResults
    }
    if (config?.language) {
      this.recognition.lang = config.language
    }

    // Setup event handlers
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex]
      const transcript = result[0].transcript
      const isFinal = result.isFinal

      onResult(transcript, isFinal)
    }

    this.recognition.onerror = (event: any) => {
      const errorMessage = this.getErrorMessage(event.error)
      console.error('Speech recognition error:', errorMessage)

      if (onError) {
        onError(errorMessage)
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
    }

    this.recognition.onstart = () => {
      this.isListening = true
    }

    try {
      this.recognition.start()
    } catch (error) {
      throw new VoiceServiceError(
        'Failed to start speech recognition',
        'START_FAILED',
        error instanceof Error ? error : undefined
      )
    }
  }

  /**
   * Stop listening for speech
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  /**
   * Abort speech recognition
   */
  abort(): void {
    if (this.recognition) {
      this.recognition.abort()
      this.isListening = false
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening
  }

  /**
   * Get error message from error code
   */
  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'no-speech': 'No speech was detected. Please try again.',
      'audio-capture': 'No microphone was found. Ensure it is connected.',
      'not-allowed':
        'Microphone permission was denied. Please allow access.',
      aborted: 'Speech recognition was aborted.',
      'network': 'Network error occurred.',
      'service-not-allowed': 'Speech recognition service is not allowed.',
      'bad-grammar': 'Grammar error occurred.',
      'language-not-supported': 'Language is not supported.',
    }

    return errorMessages[error] || `Speech recognition error: ${error}`
  }

  /**
   * Request microphone permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      return false
    }
  }
}

// Export singleton instance
export const sttService = new STTService()