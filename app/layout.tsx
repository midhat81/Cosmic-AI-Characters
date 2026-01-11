import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Sidebar } from '@/components/layout/Sidebar'
import { ToastContainer } from '@/components/ui/Toast'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Cosmic Characters - AI Interactive Chat',
  description:
    'AI-driven interactive character conversations with voice support. Explore the cosmos through engaging dialogues.',
  keywords: [
    'AI chat',
    'interactive characters',
    'voice chat',
    'AI assistant',
    'cosmic characters',
  ],
  authors: [{ name: 'Muhammad Midhat' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ErrorBoundary>
          <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
            </div>
          </div>

          {/* Toast Notifications */}
          <ToastContainer />
        </ErrorBoundary>
      </body>
    </html>
  )
}