import React, { useEffect } from 'react'
import { clsx } from 'clsx'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useUIStore, type Toast as ToastType } from '@/store/ui.store'

const ToastItem: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const removeToast = useUIStore((state) => state.removeToast)

  const typeConfig = {
    success: {
      icon: CheckCircle,
      className: 'bg-green-50 text-green-800 border-green-200',
      iconColor: 'text-green-500',
    },
    error: {
      icon: AlertCircle,
      className: 'bg-red-50 text-red-800 border-red-200',
      iconColor: 'text-red-500',
    },
    warning: {
      icon: AlertTriangle,
      className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      iconColor: 'text-yellow-500',
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 text-blue-800 border-blue-200',
      iconColor: 'text-blue-500',
    },
  }

  const config = typeConfig[toast.type]
  const Icon = config.icon

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-up max-w-md',
        config.className
      )}
    >
      <Icon className={clsx('flex-shrink-0 w-5 h-5', config.iconColor)} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore((state) => state.toasts)

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}