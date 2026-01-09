import { VOICE_CONFIG } from '@/lib/constants'
import { VoiceServiceError } from '@/utils/errorHandlers'
import type { TTSConfig } from '@/types/voice'

class TTSService {
  private synth: SpeechSynthesis | null = null
  private isSupported: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis
      this.isSupported = 'speechSynthesis' in window
    }
  }

  /**
   * Check if TTS is supported
   */
  checkSupport(): boolean {
    return this.isSupported
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return []
    return this.synth.getVoices()
  }

  /**
   * Speak text using browser TTS
   */
  async speak(text: string, config?: Partial<TTSConfig>): Promise<void> {
    if (!this.synth) {
      throw new VoiceServiceError(
        'Speech synthesis not supported',
        'NOT_SUPPORTED'
      )
    }

    return new Promise((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        this.synth!.cancel()

        const utterance = new SpeechSynthesisUtterance(text)

        // Apply configuration
        utterance.rate = config?.rate || VOICE_CONFIG.tts.rate
        utterance.pitch = config?.pitch || VOICE_CONFIG.tts.pitch
        utterance.volume = config?.volume || VOICE_CONFIG.tts.volume
        utterance.lang = config?.language || 'en-US'

        // Set voice if specified
        if (config?.voiceName) {
          const voices = this.getVoices()
          const voice = voices.find((v) => v.name === config.voiceName)
          if (voice) {
            utterance.voice = voice
          }
        }

        utterance.onend = () => resolve()
        utterance.onerror = (event) => {
          reject(
            new VoiceServiceError(
              `Speech synthesis error: ${event.error}`,
              'SYNTHESIS_ERROR'
            )
          )
        }

        this.synth!.speak(utterance)
      } catch (error) {
        reject(
          new VoiceServiceError(
            'Failed to synthesize speech',
            'SYNTHESIS_FAILED',
            error instanceof Error ? error : undefined
          )
        )
      }
    })
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel()
    }
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synth) {
      this.synth.pause()
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synth) {
      this.synth.resume()
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth?.speaking || false
  }

  /**
   * Check if speech is paused
   */
  isPaused(): boolean {
    return this.synth?.paused || false
  }
}

// Export singleton instance
export const ttsService = new TTSService()