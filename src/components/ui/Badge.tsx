'use client'

import { cn } from '@/lib/utils'

type BadgeVariant = 'blue' | 'green' | 'amber' | 'red' | 'violet' | 'slate'

const variantClasses: Record<BadgeVariant, string> = {
  blue: 'bg-indigo-50 text-indigo-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-rose-50 text-rose-700',
  violet: 'bg-violet-50 text-violet-700',
  slate: 'bg-slate-100 text-slate-600',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'slate', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export function statusVariant(estado: string): BadgeVariant {
  switch (estado) {
    case 'Excelente':
      return 'green'
    case 'Bueno':
      return 'blue'
    case 'Normal':
      return 'slate'
    case 'Cansado':
      return 'amber'
    case 'Lesionado':
      return 'red'
    default:
      return 'slate'
  }
}
