'use client'

import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  colorClass?: string
  className?: string
}

export function MetricCard({
  label,
  value,
  sub,
  icon,
  colorClass = 'text-slate-800',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-1',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {icon && (
          <span className="text-slate-400">{icon}</span>
        )}
      </div>
      <span className={cn('text-2xl font-bold tracking-tight', colorClass)}>
        {value}
      </span>
      {sub && (
        <span className="text-xs text-slate-400">{sub}</span>
      )}
    </div>
  )
}
