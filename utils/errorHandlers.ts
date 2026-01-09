import { FetchError } from '@/lib/fetcher'

export class AIServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'AIServiceError'
  }
}

export class VoiceServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'VoiceServiceError'
  }
}

export function handleFetchError(error: unknown): string {
  if (error instanceof FetchError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please try again.'
      case 401:
        return 'Authentication failed. Please check your API keys.'
      case 403:
        return 'Access denied. You may have exceeded your quota.'
      case 404:
        return 'Service not found. Please check your configuration.'
      case 429:
        return 'Rate limit exceeded. Please wait a moment and try again.'
      case 500:
      case 502:
      case 503:
        return 'Service temporarily unavailable. Please try again later.'
      default:
        return `Request failed: ${error.statusText}`
    }
  }

  if (error instanceof AIServiceError) {
    return error.message
  }

  if (error instanceof VoiceServiceError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}

export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error)
  }

  // In production, you might want to send this to an error tracking service
  // Example: Sentry.captureException(error)
}