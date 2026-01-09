import { analyticsService } from './analytics.service'
import { handleFetchError } from '@/utils/errorHandlers'

export interface ErrorLog {
  id: string
  timestamp: number
  message: string
  type: string
  stack?: string
  context?: string
}

class ErrorService {
  private errors: ErrorLog[] = []
  private maxErrors: number = 50

  /**
   * Log an error
   */
  logError(
    error: unknown,
    context?: string,
    shouldTrack: boolean = true
  ): ErrorLog {
    const errorLog: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      message: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      context,
    }

    // Add to local log
    this.errors.unshift(errorLog)
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[Error${context ? ` - ${context}` : ''}]:`,
        errorLog.message,
        error
      )
    }

    // Track with analytics
    if (shouldTrack) {
      analyticsService.trackError(errorLog.type, errorLog.message, context)
    }

    return errorLog
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: unknown): string {
    return handleFetchError(error)
  }

  /**
   * Get all logged errors
   */
  getErrors(): ErrorLog[] {
    return [...this.errors]
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = []
  }

  /**
   * Get recent errors (last N)
   */
  getRecentErrors(count: number = 10): ErrorLog[] {
    return this.errors.slice(0, count)
  }
}

// Export singleton instance
export const errorService = new ErrorService()