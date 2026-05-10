'use client'

import { useAppStore } from '@/lib/store'
import { TrainingService } from '@/lib/services'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Dumbbell } from 'lucide-react'
import { today, formatDate } from '@/lib/utils'

export function LastWorkout() {
  const exercises = useAppStore((s) => s.exercises)
  const todayStr = today()

  const lastWorkout = TrainingService.getLastWorkout(exercises, todayStr)

  return (
    <Card title="Último entreno registrado">
      {!lastWorkout ? (
        <EmptyState
          icon={<Dumbbell size={20} />}
          title="Sin entrenos registrados"
          description="Registra tu primer entreno en la pestaña Ejercicio"
        />
      ) : (
        <div>
          <p className="text-xs text-slate-500 mb-2">
            {lastWorkout.fecha === todayStr
              ? 'Hoy'
              : formatDate(lastWorkout.fecha)}{' '}
            — {lastWorkout.items.length} ejercicio
            {lastWorkout.items.length !== 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {lastWorkout.items.map((ex) => (
              <Badge key={ex.id} variant="blue">
                {ex.nombre} {ex.series}×{ex.reps} @{ex.peso}kg
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
