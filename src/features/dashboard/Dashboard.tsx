'use client'

import { useAppStore } from '@/lib/store'
import { NutritionService } from '@/lib/services'
import { MetricCard } from '@/components/ui/MetricCard'
import { WeeklyCompliance } from './WeeklyCompliance'
import { GoalBars } from './GoalBars'
import { LastWorkout } from './LastWorkout'
import { today } from '@/lib/utils'
import { GOALS } from '@/lib/constants'
import { Scale, Beef, Droplets, BedDouble } from 'lucide-react'

export function Dashboard() {
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const meals = useAppStore((s) => s.meals)
  const sleepRecords = useAppStore((s) => s.sleepRecords)

  const todayStr = today()
  const todayRecord = dailyRecords.find((r) => r.fecha === todayStr) ?? null
  const todayMeals = meals.filter((m) => m.fecha === todayStr)
  const todaySleep = sleepRecords.find((r) => r.fecha === todayStr) ?? null

  const totals = NutritionService.getTotals(todayMeals)
  const water = todayRecord?.agua ?? 0
  const peso = todayRecord?.peso

  // Find last recorded weight if no today record
  const lastWeightRecord = [...dailyRecords]
    .reverse()
    .find((r) => r.peso !== null)
  const displayPeso = peso ?? lastWeightRecord?.peso ?? null

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Peso actual"
          value={displayPeso !== null ? `${displayPeso} kg` : '— kg'}
          sub={`Objetivo: ${GOALS.weight} kg`}
          icon={<Scale size={16} />}
          colorClass={
            displayPeso !== null && displayPeso >= GOALS.weight
              ? 'text-emerald-600'
              : 'text-slate-800'
          }
        />
        <MetricCard
          label="Proteína hoy"
          value={`${Math.round(totals.prot)} g`}
          sub={`Meta: ${GOALS.protein} g`}
          icon={<Beef size={16} />}
          colorClass={
            totals.prot >= GOALS.protein
              ? 'text-emerald-600'
              : 'text-slate-800'
          }
        />
        <MetricCard
          label="Agua hoy"
          value={`${water} ml`}
          sub={`Meta: ${GOALS.water} ml`}
          icon={<Droplets size={16} />}
          colorClass={
            water >= GOALS.water ? 'text-sky-600' : 'text-slate-800'
          }
        />
        <MetricCard
          label="Sueño anoche"
          value={todaySleep ? `${todaySleep.horas} h` : '— h'}
          sub={`Meta: ${GOALS.sleep} h`}
          icon={<BedDouble size={16} />}
          colorClass={
            todaySleep && todaySleep.horas >= GOALS.sleep
              ? 'text-violet-600'
              : 'text-slate-800'
          }
        />
      </div>

      <WeeklyCompliance />
      <GoalBars />
      <LastWorkout />
    </div>
  )
}
