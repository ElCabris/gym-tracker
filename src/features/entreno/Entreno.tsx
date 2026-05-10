'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { useAppStore } from '@/lib/store'
import { TrainingService } from '@/lib/services'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { SPLIT_ROUTINE_TEXT, COLORS } from '@/lib/constants'
import { Dumbbell, Info, TrendingUp } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'

export function Entreno() {
  const exercises = useAppStore((s) => s.exercises)

  const exerciseMaxMap = TrainingService.getExerciseMaxByName(exercises)
  const exerciseNames = Object.keys(exerciseMaxMap).slice(0, 8)

  const benchHistory = TrainingService.getBenchPressHistory(exercises)
  const benchChartData = benchHistory.map((e) => ({
    fecha: formatDateShort(e.fecha),
    peso: e.peso,
    fullDate: e.fecha,
  }))

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Entrenamiento</h1>
        <p className="text-sm text-slate-500 mt-0.5">Tu progreso de fuerza</p>
      </div>

      {/* Routine tip */}
      <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <Info size={16} className="text-indigo-500 mt-0.5 shrink-0" />
        <p className="text-xs text-indigo-700 leading-relaxed">
          {SPLIT_ROUTINE_TEXT}
        </p>
      </div>

      {/* Progress bars per exercise */}
      <Card title="Progreso por ejercicio">
        {exerciseNames.length === 0 ? (
          <EmptyState
            icon={<Dumbbell size={20} />}
            title="Sin ejercicios registrados"
            description="Registra ejercicios para ver tu progreso aquí"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {exerciseNames.map((name) => {
              const data = exerciseMaxMap[name]
              // Use max weight as reference (100kg = 100%)
              const pct = Math.min(100, Math.round((data.max / 100) * 100))
              return (
                <div key={name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        {name}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {data.sessions} sesión{data.sessions !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <Badge variant="blue">Máx: {data.max} kg</Badge>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: COLORS.primary,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Bench press evolution chart */}
      <Card title="Evolución de peso en press de banca">
        {benchChartData.length < 2 ? (
          <EmptyState
            icon={<TrendingUp size={20} />}
            title="Sin suficientes datos"
            description="Registra al menos 2 sesiones de press de banca para ver la evolución"
          />
        ) : (
          <div className="h-48 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={benchChartData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="fecha"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}kg`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value} kg`, 'Peso']}
                />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke={COLORS.primary}
                  strokeWidth={2.5}
                  dot={{ fill: COLORS.primary, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  )
}
