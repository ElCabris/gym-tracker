'use client'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts'
import { useAppStore } from '@/lib/store'
import { NutritionService } from '@/lib/services'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { GOALS, COLORS } from '@/lib/constants'
import { Beef, Flame, Wheat, Droplets, Apple } from 'lucide-react'
import { today } from '@/lib/utils'

export function Nutricion() {
  const meals = useAppStore((s) => s.meals)
  const todayStr = today()
  const todayMeals = meals.filter((m) => m.fecha === todayStr)
  const totals = NutritionService.getTotals(todayMeals)
  const chartData = NutritionService.getMacroChartData(totals)

  const hasData = todayMeals.length > 0

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Nutrición</h1>
        <p className="text-sm text-slate-500 mt-0.5">Seguimiento de macros hoy</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Proteína hoy"
          value={`${Math.round(totals.prot)} g`}
          sub={`/ ${GOALS.protein} g`}
          icon={<Beef size={16} />}
          colorClass={totals.prot >= GOALS.protein ? 'text-emerald-600' : 'text-slate-800'}
        />
        <MetricCard
          label="Calorías hoy"
          value={Math.round(totals.cal).toString()}
          sub={`/ ${GOALS.calories} kcal`}
          icon={<Flame size={16} />}
          colorClass={totals.cal >= GOALS.calories ? 'text-amber-600' : 'text-slate-800'}
        />
        <MetricCard
          label="Carbos hoy"
          value={`${Math.round(totals.carbs)} g`}
          sub={`/ ${GOALS.carbs} g`}
          icon={<Wheat size={16} />}
          colorClass={totals.carbs >= GOALS.carbs ? 'text-amber-600' : 'text-slate-800'}
        />
        <MetricCard
          label="Grasas hoy"
          value={`${Math.round(totals.grasas)} g`}
          sub={`/ ${GOALS.fat} g`}
          icon={<Droplets size={16} />}
          colorClass={totals.grasas >= GOALS.fat ? 'text-rose-500' : 'text-slate-800'}
        />
      </div>

      {/* Macro donut chart */}
      <Card title="Distribución de macros hoy">
        {!hasData ? (
          <EmptyState
            icon={<Apple size={20} />}
            title="Sin datos nutricionales"
            description="Registra comidas en la pestaña Registrar"
          />
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => [
                    `${Math.round(value as number)}g`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Food list */}
      <Card title="Alimentos registrados hoy">
        {todayMeals.length === 0 ? (
          <EmptyState
            icon={<Apple size={20} />}
            title="Ninguno aún"
            description="Registra comidas en la pestaña Registrar → Comida"
          />
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="text-sm font-medium text-slate-800">
                    {meal.hora && (
                      <span className="text-xs text-slate-400 mr-1">
                        {meal.hora} ·{' '}
                      </span>
                    )}
                    {meal.nombre}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    P:{Math.round(meal.prot)}g · C:{Math.round(meal.carbs)}g · G:
                    {Math.round(meal.grasas)}g
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-600 ml-2">
                  {meal.cal} kcal
                </span>
              </div>
            ))}
            {todayMeals.length > 0 && (
              <div className="pt-3 flex flex-wrap gap-3 text-xs font-semibold">
                <span className="text-slate-700">
                  Total: {Math.round(totals.cal)} kcal
                </span>
                <span className="text-emerald-600">
                  {Math.round(totals.prot)}g prot
                </span>
                <span className="text-amber-600">
                  {Math.round(totals.carbs)}g carbos
                </span>
                <span className="text-rose-500">
                  {Math.round(totals.grasas)}g grasas
                </span>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
