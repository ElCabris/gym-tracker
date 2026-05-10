'use client'

import { useAppStore } from '@/lib/store'
import { Navbar } from './Navbar'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { Registro } from '@/features/registro/Registro'
import { Entreno } from '@/features/entreno/Entreno'
import { Nutricion } from '@/features/nutricion/Nutricion'
import { Sueno } from '@/features/sueno/Sueno'
import { Historial } from '@/features/historial/Historial'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

function ToastContainer() {
  const { toasts, removeToast } = useAppStore()

  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 animate-fade-in">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium max-w-xs',
            'animate-slide-up',
            toast.type === 'success' &&
              'bg-emerald-50 border-emerald-200 text-emerald-800',
            toast.type === 'error' &&
              'bg-rose-50 border-rose-200 text-rose-800',
            toast.type === 'info' &&
              'bg-indigo-50 border-indigo-200 text-indigo-800'
          )}
        >
          {toast.type === 'success' && (
            <CheckCircle size={16} className="shrink-0 text-emerald-500" />
          )}
          {toast.type === 'error' && (
            <XCircle size={16} className="shrink-0 text-rose-500" />
          )}
          {toast.type === 'info' && (
            <Info size={16} className="shrink-0 text-indigo-500" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

function PageRenderer() {
  const currentPage = useAppStore((s) => s.currentPage)

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />
    case 'registro':
      return <Registro />
    case 'entreno':
      return <Entreno />
    case 'nutricion':
      return <Nutricion />
    case 'sueno':
      return <Sueno />
    case 'historial':
      return <Historial />
    default:
      return <Dashboard />
  }
}

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-4 pb-24 md:pb-8 md:pt-6">
        <PageRenderer />
      </main>
      <ToastContainer />
    </div>
  )
}
