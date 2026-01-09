export class FetchError extends Error {
    constructor(
      public status: number,
      public statusText: string,
      public data?: any
    ) {
      super(`HTTP Error ${status}: ${statusText}`)
      this.name = 'FetchError'
    }
  }
  
  export interface FetchOptions extends RequestInit {
    timeout?: number
    retry?: number
    retryDelay?: number
  }
  
  export async function fetcher<T = any>(
    url: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const {
      timeout = 30000,
      retry = 0,
      retryDelay = 1000,
      ...fetchOptions
    } = options
  
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
  
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })
  
      clearTimeout(timeoutId)
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new FetchError(response.status, response.statusText, errorData)
      }
  
      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
  
      // Retry logic
      if (retry > 0 && error instanceof FetchError && error.status >= 500) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        return fetcher<T>(url, { ...options, retry: retry - 1 })
      }
  
      throw error
    }
  }
  
  export async function streamFetcher(
    url: string,
    options: FetchOptions = {},
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const { timeout = 60000, ...fetchOptions } = options
  
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
  
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          ...fetchOptions.headers,
        },
      })
  
      clearTimeout(timeoutId)
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new FetchError(response.status, response.statusText, errorData)
      }
  
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
  
      if (!reader) {
        throw new Error('Response body is not readable')
      }
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
  
        const chunk = decoder.decode(value, { stream: true })
        onChunk(chunk)
      }
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }