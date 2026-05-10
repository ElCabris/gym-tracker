'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  titleRight?: React.ReactNode
}

export function Card({ children, className, title, titleRight }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-slate-100 p-4',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-600">{title}</h3>
          {titleRight}
        </div>
      )}
      {children}
    </div>
  )
}
