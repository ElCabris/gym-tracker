'use client'

import { useAppStore } from '@/lib/store'
import { HealthService } from '@/lib/services'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { ComplianceDot } from '@/lib/types'

const dotStyles: Record<ComplianceDot['status'], string> = {
  done: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  partial: 'bg-amber-100 text-amber-700 border border-amber-200',
  miss: 'bg-slate-100 text-slate-400 border border-slate-200',
  today: 'bg-indigo-600 text-white border border-indigo-600 shadow-md',
}

export function WeeklyCompliance() {
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const meals = useAppStore((s) => s.meals)

  const dots = HealthService.getWeeklyCompliance(dailyRecords, meals)

  return (
    <Card title="Semana actual — cumplimiento">
      <div className="grid grid-cols-7 gap-1 mb-3">
        {dots.map((dot) => (
          <div key={dot.fecha} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium text-slate-500">
              {dot.dayLabel}
            </span>
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                dotStyles[dot.status]
              )}
            >
              {dot.dayNum}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-100 border border-emerald-200 inline-block" />
          Completo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-200 inline-block" />
          Parcial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-200 inline-block" />
          Sin datos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
          Hoy
        </span>
      </div>
    </Card>
  )
}
