import React from 'react'
import Link from 'next/link'
import { Menu, Settings, MessageSquare } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useCharacterStore } from '@/store/character.store'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'

export const Header: React.FC = () => {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const currentCharacter = useCharacterStore((state) => state.currentCharacter)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cosmic-500 to-nebula-500 flex items-center justify-center">
                <MessageSquare className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cosmic-600 to-nebula-600 bg-clip-text text-transparent">
                Cosmic Characters
              </span>
            </Link>
          </div>

          {/* Center: Current Character */}
          {currentCharacter && (
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
              <Avatar
                src={currentCharacter.avatar}
                alt={currentCharacter.name}
                name={currentCharacter.name}
                size="sm"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {currentCharacter.name}
                </span>
                <span className="text-xs text-gray-500">
                  {currentCharacter.title}
                </span>
              </div>
            </div>
          )}

          {/* Right: Settings */}
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="sm" leftIcon={<Settings size={18} />}>
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}