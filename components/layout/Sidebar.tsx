import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { X, Home, Users, MessageSquare, Settings, Sparkles } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useChatStore } from '@/store/chat.store'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen } = useUIStore()
  const sessions = useChatStore((state) => state.sessions)

  const sessionCount = Object.keys(sessions).length

  const navItems: NavItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: <Home size={20} />,
    },
    {
      label: 'Characters',
      href: '/characters',
      icon: <Users size={20} />,
    },
    {
      label: 'Chats',
      href: '/chats',
      icon: <MessageSquare size={20} />,
      badge: sessionCount > 0 ? sessionCount : undefined,
    },
    {
      label: 'About',
      href: '/about',
      icon: <Sparkles size={20} />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings size={20} />,
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 lg:static',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-cosmic-50 text-cosmic-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cosmic-100 text-cosmic-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="px-4 py-3 rounded-lg bg-gradient-to-br from-cosmic-50 to-nebula-50 border border-cosmic-100">
              <p className="text-xs font-medium text-gray-700 mb-1">
                🚀 Powered by Local AI
              </p>
              <p className="text-xs text-gray-500">
                All conversations run on your device
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}