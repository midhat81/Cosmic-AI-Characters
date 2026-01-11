'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/animations/FadeIn'
import { useSettingsStore } from '@/store/settings.store'
import { useUIStore } from '@/store/ui.store'
import { Settings, Trash2 } from 'lucide-react'
import { useChatStore } from '@/store/chat.store'
import { memoryService } from '@/features/memory/memory.service'

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore()
  const addToast = useUIStore((state) => state.addToast)
  const { sessions, reset: resetChat } = useChatStore()

  const sessionCount = Object.keys(sessions).length

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] })
    addToast({
      type: 'success',
      message: 'Settings updated',
    })
  }

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all chat history and memories? This cannot be undone.')) {
      resetChat()
      memoryService.clearAllMemories()
      addToast({
        type: 'success',
        message: 'All data cleared successfully',
      })
    }
  }

  const handleResetSettings = () => {
    if (confirm('Reset all settings to defaults?')) {
      resetSettings()
      addToast({
        type: 'success',
        message: 'Settings reset to defaults',
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <FadeIn>
        <div className="flex items-center gap-3 mb-8">
          <Settings size={32} className="text-cosmic-600" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Customize your experience</p>
          </div>
        </div>
      </FadeIn>

      {/* Chat Settings */}
      <FadeIn delay={0.1}>
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat Settings</h2>
          
          <div className="space-y-4">
            <SettingToggle
              label="Enable Streaming Responses"
              description="See AI responses as they're being generated"
              checked={settings.enableStreaming}
              onChange={() => handleToggle('enableStreaming')}
            />
            
            <SettingToggle
              label="Show Message Timestamps"
              description="Display time for each message"
              checked={settings.showTimestamps}
              onChange={() => handleToggle('showTimestamps')}
            />
            
            <SettingToggle
              label="Send on Enter"
              description="Press Enter to send (Shift+Enter for new line)"
              checked={settings.sendOnEnter}
              onChange={() => handleToggle('sendOnEnter')}
            />
          </div>
        </Card>
      </FadeIn>

      {/* Voice Settings */}
      <FadeIn delay={0.2}>
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Voice Settings</h2>
          
          <div className="space-y-4">
            <SettingToggle
              label="Enable Voice Features"
              description="Use speech-to-text and text-to-speech"
              checked={settings.enableVoice}
              onChange={() => handleToggle('enableVoice')}
            />
            
            <SettingToggle
              label="Auto-play TTS"
              description="Automatically speak character responses"
              checked={settings.autoPlayTTS}
              onChange={() => handleToggle('autoPlayTTS')}
              disabled={!settings.enableVoice}
            />
          </div>
        </Card>
      </FadeIn>

      {/* Privacy & Data */}
      <FadeIn delay={0.3}>
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Data</h2>
          
          <div className="space-y-4">
            <SettingToggle
              label="Save Conversations"
              description="Store chat history locally"
              checked={settings.saveConversations}
              onChange={() => handleToggle('saveConversations')}
            />
            
            <SettingToggle
              label="Enable Memory"
              description="Characters remember previous conversations"
              checked={settings.enableMemory}
              onChange={() => handleToggle('enableMemory')}
            />

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">Stored Data</p>
                  <p className="text-sm text-gray-600">
                    {sessionCount} conversation{sessionCount !== 1 ? 's' : ''} stored locally
                  </p>
                </div>
              </div>
              
              <Button
                variant="danger"
                size="sm"
                onClick={handleClearAllData}
                leftIcon={<Trash2 size={16} />}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* Advanced */}
      <FadeIn delay={0.4}>
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced</h2>
          
          <div className="space-y-4">
            <SettingToggle
              label="Enable Animations"
              description="Show UI animations and transitions"
              checked={settings.enableAnimations}
              onChange={() => handleToggle('enableAnimations')}
            />

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSettings}
              >
                Reset All Settings
              </Button>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}

// Helper Component
function SettingToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:ring-offset-2
          ${checked ? 'bg-cosmic-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  )
}