'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts'
import { useAppStore } from '@/lib/store'
import { SleepService } from '@/lib/services'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { GOALS } from '@/lib/constants'
import { Moon, Clock, Star, Flame, TrendingUp } from 'lucide-react'

export function Sueno() {
  const sleepRecords = useAppStore((s) => s.sleepRecords)

  const weeklyAvg = SleepService.getWeeklyAverage(sleepRecords)
  const daysOver7 = SleepService.getDaysOver7h(sleepRecords)
  const avgQuality = SleepService.getAverageQuality(sleepRecords)
  const streak = SleepService.getCurrentStreak(sleepRecords)
  const chartData = SleepService.getSleepChartData(sleepRecords)

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Sueño</h1>
        <p className="text-sm text-slate-500 mt-0.5">Análisis de tu descanso</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Promedio semanal"
          value={weeklyAvg !== null ? `${weeklyAvg} h` : '— h'}
          sub={`Meta: ${GOALS.sleep} h`}
          icon={<Clock size={16} />}
          colorClass={
            weeklyAvg !== null && weeklyAvg >= GOALS.sleep
              ? 'text-violet-600'
              : 'text-slate-800'
          }
        />
        <MetricCard
          label="Días con 7+ horas"
          value={daysOver7.toString()}
          sub="esta semana"
          icon={<Moon size={16} />}
          colorClass={daysOver7 >= 5 ? 'text-violet-600' : 'text-slate-800'}
        />
        <MetricCard
          label="Calidad promedio"
          value={avgQuality !== null ? `${avgQuality}` : '—'}
          sub="/ 10"
          icon={<Star size={16} />}
          colorClass={
            avgQuality !== null && avgQuality >= 7
              ? 'text-violet-600'
              : 'text-slate-800'
          }
        />
        <MetricCard
          label="Racha actual"
          value={streak.toString()}
          sub="días con meta"
          icon={<Flame size={16} />}
          colorClass={streak >= 3 ? 'text-violet-600' : 'text-slate-800'}
        />
      </div>

      {/* Sleep bar chart */}
      <Card title="Historial de sueño (últimos 14 días)">
        {chartData.length < 2 ? (
          <EmptyState
            icon={<TrendingUp size={20} />}
            title="Sin suficientes datos"
            description="Registra al menos 2 noches de sueño para ver la gráfica"
          />
        ) : (
          <>
            <div className="h-48 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="fecha"
                    tick={{ fontSize: 9, fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 12]}
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}h`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${value} h`, 'Horas dormidas']}
                  />
                  <ReferenceLine
                    y={GOALS.sleep}
                    stroke="#8B5CF6"
                    strokeDasharray="4 2"
                    strokeWidth={1.5}
                    label={{
                      value: 'Meta',
                      position: 'right',
                      fontSize: 9,
                      fill: '#8B5CF6',
                    }}
                  />
                  <Bar dataKey="horas" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />
                7+ h
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
                6–7 h
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-400 inline-block" />
                {'<'} 6 h
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
