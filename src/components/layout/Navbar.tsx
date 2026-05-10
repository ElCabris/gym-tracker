'use client'

import {
  LayoutDashboard,
  PlusCircle,
  Dumbbell,
  Apple,
  Moon,
  TrendingUp,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { Page } from '@/lib/types'
import { cn } from '@/lib/utils'

interface NavItem {
  page: Page
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    page: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    page: 'registro',
    label: 'Registrar',
    icon: <PlusCircle size={20} />,
  },
  {
    page: 'entreno',
    label: 'Entreno',
    icon: <Dumbbell size={20} />,
  },
  {
    page: 'nutricion',
    label: 'Nutrición',
    icon: <Apple size={20} />,
  },
  {
    page: 'sueno',
    label: 'Sueño',
    icon: <Moon size={20} />,
  },
  {
    page: 'historial',
    label: 'Progreso',
    icon: <TrendingUp size={20} />,
  },
]

export function Navbar() {
  const currentPage = useAppStore((s) => s.currentPage)
  const setCurrentPage = useAppStore((s) => s.setCurrentPage)

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex items-center gap-1 bg-white border-b border-slate-200 px-6 py-2 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2 mr-6">
          <Dumbbell size={22} className="text-indigo-600" />
          <span className="font-bold text-slate-800 text-base">GymTracker</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                currentPage === item.page
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 pb-safe">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-all duration-150',
                currentPage === item.page
                  ? 'text-indigo-600'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <span
                className={cn(
                  'w-8 h-5 flex items-center justify-center rounded-full transition-all duration-150',
                  currentPage === item.page && 'text-indigo-600'
                )}
              >
                {item.icon}
              </span>
              <span className="text-[10px] leading-none">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
