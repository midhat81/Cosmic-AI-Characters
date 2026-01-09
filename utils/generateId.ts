import { nanoid } from 'nanoid'

export function generateId(prefix?: string): string {
  const id = nanoid(12)
  return prefix ? `${prefix}_${id}` : id
}

export function generateSessionId(): string {
  return generateId('session')
}

export function generateMessageId(): string {
  return generateId('msg')
}

export function generateMemoryId(): string {
  return generateId('mem')
}

export function generateRecordingId(): string {
  return generateId('rec')
}