export type VoiceService = 'browser' | 'elevenlabs' | 'google'

export type RecordingState = 'idle' | 'recording' | 'processing' | 'error'

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'loading' | 'error'

export interface VoiceConfig {
  service: VoiceService
  language?: string
  pitch?: number
  rate?: number
  volume?: number
}

export interface TTSConfig extends VoiceConfig {
  voiceId?: string
  voiceName?: string
}

export interface STTConfig extends VoiceConfig {
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
}

export interface AudioRecording {
  id: string
  blob: Blob
  duration: number
  timestamp: number
  transcript?: string
}

export interface VoiceState {
  recordingState: RecordingState
  playbackState: PlaybackState
  currentRecording: AudioRecording | null
  recordings: AudioRecording[]
  error: string | null
  isSupported: boolean
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

export interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

export interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

export interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}