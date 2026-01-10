import React from 'react'
import { clsx } from 'clsx'

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  color?: string
  fullScreen?: boolean
  text?: string
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'text-cosmic-600',
  fullScreen = false,
  text,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const dotSizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4',
  }

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <svg
            className={clsx('animate-spin', sizeStyles[size], color)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )

      case 'dots':
        return (
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={clsx(
                  'rounded-full animate-pulse',
                  dotSizeStyles[size],
                  color.replace('text-', 'bg-')
                )}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <div
            className={clsx(
              'rounded-full animate-pulse',
              sizeStyles[size],
              color.replace('text-', 'bg-')
            )}
          />
        )

      default:
        return null
    }
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderLoader()}
      {text && <p className={clsx('text-sm font-medium', color)}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}