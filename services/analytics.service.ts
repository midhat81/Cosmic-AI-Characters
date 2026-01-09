type EventName =
  | 'page_view'
  | 'character_selected'
  | 'message_sent'
  | 'voice_recording_started'
  | 'voice_recording_stopped'
  | 'tts_played'
  | 'error_occurred'
  | 'session_started'
  | 'session_ended'

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

class AnalyticsService {
  private isEnabled: boolean = false
  private isDevelopment: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.isDevelopment = process.env.NODE_ENV === 'development'
      this.isEnabled = !this.isDevelopment // Disable in development by default
    }
  }

  /**
   * Track an event
   */
  track(eventName: EventName, properties?: EventProperties): void {
    if (!this.isEnabled) {
      if (this.isDevelopment) {
        console.log('[Analytics]', eventName, properties)
      }
      return
    }

    // Implement your analytics service here
    // Examples: Google Analytics, Mixpanel, Amplitude, etc.

    // Google Analytics 4 example:
    // if (typeof window !== 'undefined' && (window as any).gtag) {
    //   (window as any).gtag('event', eventName, properties)
    // }

    // Mixpanel example:
    // if (typeof window !== 'undefined' && (window as any).mixpanel) {
    //   (window as any).mixpanel.track(eventName, properties)
    // }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string): void {
    this.track('page_view', {
      page_path: path,
      page_title: title,
    })
  }

  /**
   * Track character interaction
   */
  trackCharacterSelected(characterId: string, characterName: string): void {
    this.track('character_selected', {
      character_id: characterId,
      character_name: characterName,
    })
  }

  /**
   * Track message sent
   */
  trackMessageSent(
    characterId: string,
    messageLength: number,
    isVoice: boolean = false
  ): void {
    this.track('message_sent', {
      character_id: characterId,
      message_length: messageLength,
      is_voice: isVoice,
    })
  }

  /**
   * Track voice interaction
   */
  trackVoiceRecording(action: 'started' | 'stopped', duration?: number): void {
    const eventName =
      action === 'started'
        ? 'voice_recording_started'
        : 'voice_recording_stopped'

    this.track(eventName, {
      duration,
    })
  }

  /**
   * Track TTS playback
   */
  trackTTSPlayed(characterId: string, textLength: number): void {
    this.track('tts_played', {
      character_id: characterId,
      text_length: textLength,
    })
  }

  /**
   * Track errors
   */
  trackError(errorType: string, errorMessage: string, context?: string): void {
    this.track('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      context,
    })
  }

  /**
   * Track session events
   */
  trackSession(action: 'started' | 'ended', sessionDuration?: number): void {
    const eventName = action === 'started' ? 'session_started' : 'session_ended'

    this.track(eventName, {
      session_duration: sessionDuration,
    })
  }

  /**
   * Enable analytics
   */
  enable(): void {
    this.isEnabled = true
  }

  /**
   * Disable analytics
   */
  disable(): void {
    this.isEnabled = false
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService()