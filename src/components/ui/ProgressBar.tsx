'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  label: string
  current: number
  goal: number
  unit: string
  color?: string
  percentage: number
  className?: string
}

export function ProgressBar({
  label,
  current,
  goal,
  unit,
  color = '#4F46E5',
  percentage,
  className,
}: ProgressBarProps) {
  return (
    <div className={cn('mb-3 last:mb-0', className)}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="text-xs text-slate-500">
          {Math.round(current)} / {goal} {unit}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}
