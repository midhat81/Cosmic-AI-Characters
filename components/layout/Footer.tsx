import React from 'react'
import Link from 'next/link'
import { Heart, Github, Twitter } from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-gray-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Cosmic Characters
            </h3>
            <p className="text-sm text-gray-600">
              AI-driven interactive character conversations with voice support.
              Explore the cosmos through engaging dialogues.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/characters"
                  className="text-gray-600 hover:text-cosmic-600 transition-colors"
                >
                  Characters
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-cosmic-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-gray-600 hover:text-cosmic-600 transition-colors"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Connect
            </h3>
            <div className="flex gap-3">
              
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-cosmic-100 hover:text-cosmic-600 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-cosmic-100 hover:text-cosmic-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} Cosmic Characters. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            Made with <Heart size={16} className="text-red-500 fill-current" />{' '}
            by Muhammad Midhat
          </p>
        </div>
      </div>
    </footer>
  )
}