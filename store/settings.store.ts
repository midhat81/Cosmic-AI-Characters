import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AppSettings {
  // General
  theme: 'light' | 'dark' | 'system'
  language: string
  
  // Chat
  enableStreaming: boolean
  showTimestamps: boolean
  fontSize: 'small' | 'medium' | 'large'
  sendOnEnter: boolean
  
  // Voice
  enableVoice: boolean
  autoPlayTTS: boolean
  ttsSpeed: number
  ttsVolume: number
  sttLanguage: string
  
  // Privacy
  saveConversations: boolean
  analytics: boolean
  
  // Experimental
  enableMemory: boolean
  enableAnimations: boolean
}

interface SettingsStore {
  settings: AppSettings
  
  // Actions
  updateSettings: (updates: Partial<AppSettings>) => void
  resetSettings: () => void
  getSetting: <K extends keyof AppSettings>(key: K) => AppSettings[K]
}

const defaultSettings: AppSettings = {
  // General
  theme: 'system',
  language: 'en',
  
  // Chat
  enableStreaming: true,
  showTimestamps: true,
  fontSize: 'medium',
  sendOnEnter: true,
  
  // Voice
  enableVoice: true,
  autoPlayTTS: false,
  ttsSpeed: 1.0,
  ttsVolume: 1.0,
  sttLanguage: 'en-US',
  
  // Privacy
  saveConversations: true,
  analytics: false,
  
  // Experimental
  enableMemory: true,
  enableAnimations: true,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      updateSettings: (updates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
          },
        }))
      },

      resetSettings: () => {
        set({ settings: defaultSettings })
      },

      getSetting: (key) => {
        return get().settings[key]
      },
    }),
    {
      name: 'cosmic-settings-storage',
    }
  )
)