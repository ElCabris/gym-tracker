'use client'

import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { useAppStore } from '@/lib/store'
import { TrainingService } from '@/lib/services'
import { Card } from '@/components/ui/Card'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { GOALS, COLORS } from '@/lib/constants'
import { Scale, Dumbbell, BookOpen, Trophy } from 'lucide-react'
import { cn, formatDate, formatDateShort } from '@/lib/utils'

type Tab = 'peso' | 'fuerza' | 'diario'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'peso', label: 'Peso corporal', icon: <Scale size={15} /> },
  { id: 'fuerza', label: 'Fuerza', icon: <Dumbbell size={15} /> },
  { id: 'diario', label: 'Diario personal', icon: <BookOpen size={15} /> },
]

function WeightChart() {
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const weightRecords = dailyRecords.filter((r) => r.peso !== null)

  const chartData = weightRecords.map((r) => ({
    fecha: formatDateShort(r.fecha),
    peso: r.peso,
    fullDate: r.fecha,
  }))

  return (
    <Card title="Evolución del peso corporal">
      {chartData.length < 2 ? (
        <EmptyState
          icon={<Scale size={20} />}
          title="Sin suficientes datos"
          description="Registra tu peso en al menos 2 días para ver la evolución"
        />
      ) : (
        <div className="h-52 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}kg`}
                domain={['auto', 'auto']}
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
              <ReferenceLine
                y={GOALS.weight}
                stroke="#8B5CF6"
                strokeDasharray="4 2"
                strokeWidth={1.5}
                label={{
                  value: `Meta ${GOALS.weight}kg`,
                  position: 'right',
                  fontSize: 9,
                  fill: '#8B5CF6',
                }}
              />
              <Line
                type="monotone"
                dataKey="peso"
                stroke={COLORS.sleep}
                strokeWidth={2.5}
                dot={{ fill: COLORS.sleep, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                fill="url(#weightGrad)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

function PersonalRecords() {
  const exercises = useAppStore((s) => s.exercises)
  const records = TrainingService.getPersonalRecords(exercises)

  return (
    <Card title="Récords personales">
      {records.length === 0 ? (
        <EmptyState
          icon={<Trophy size={20} />}
          title="Sin récords aún"
          description="Registra ejercicios para ver tus récords personales"
        />
      ) : (
        <div className="flex flex-col divide-y divide-slate-100">
          {records.map((rec) => (
            <div
              key={rec.nombre}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <div>
                <span className="text-sm font-medium text-slate-800">
                  {rec.nombre}
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  ({rec.grupo})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="green">RP: {rec.peso} kg</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function PersonalDiary() {
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const diaryEntries = [...dailyRecords]
    .filter((r) => r.notas || r.estado)
    .reverse()

  return (
    <Card title="Entradas del diario personal">
      {diaryEntries.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={20} />}
          title="Sin entradas aún"
          description="Agrega notas en Registrar → Día para crear tu diario"
        />
      ) : (
        <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-1">
          {diaryEntries.map((entry) => (
            <div
              key={entry.id}
              className="pb-4 border-b border-slate-100 last:border-0 last:pb-0"
            >
              <p className="text-xs font-medium text-slate-400 mb-1">
                {formatDate(entry.fecha)}
              </p>
              {entry.notas && (
                <p className="text-sm text-slate-700 leading-relaxed">
                  {entry.notas}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {entry.estado && (
                  <Badge variant={statusVariant(entry.estado)}>
                    {entry.estado}
                  </Badge>
                )}
                {entry.energia && (
                  <Badge variant="blue">Energía {entry.energia}/10</Badge>
                )}
                {entry.peso && (
                  <Badge variant="green">{entry.peso} kg</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export function Historial() {
  const [activeTab, setActiveTab] = useState<Tab>('peso')

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Progreso</h1>
        <p className="text-sm text-slate-500 mt-0.5">Tu historial completo</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'peso' && <WeightChart />}
        {activeTab === 'fuerza' && <PersonalRecords />}
        {activeTab === 'diario' && <PersonalDiary />}
      </div>
    </div>
  )
}
