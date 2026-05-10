'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/Card'
import { FormField, Input, Select } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Trash2, Dumbbell } from 'lucide-react'
import { today } from '@/lib/utils'
import { MUSCLE_GROUPS } from '@/lib/constants'
import type { MuscleGroup } from '@/lib/types'

const schema = z.object({
  nombre: z.string().min(1, 'Escribe el nombre del ejercicio'),
  grupo: z.enum([
    'Pecho',
    'Espalda',
    'Piernas',
    'Hombros',
    'Bíceps',
    'Tríceps',
    'Core',
    'Cardio',
  ] as const),
  series: z.string().min(1, 'Requerido'),
  reps: z.string().min(1, 'Requerido'),
  peso: z.string().optional(),
  descanso: z.string().optional(),
  notas: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function ExerciseForm() {
  const { exercises, addExercise, deleteExercise, showToast } = useAppStore()
  const todayStr = today()
  const todayExercises = exercises.filter((e) => e.fecha === todayStr)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      grupo: 'Pecho',
      series: '4',
      reps: '10',
      peso: '',
      descanso: '90',
      notas: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    addExercise({
      fecha: todayStr,
      nombre: data.nombre,
      grupo: data.grupo as MuscleGroup,
      series: parseInt(data.series) || 0,
      reps: parseInt(data.reps) || 0,
      peso: parseFloat(data.peso ?? '0') || 0,
      descanso: parseInt(data.descanso ?? '90') || 90,
      notas: data.notas ?? '',
    })
    reset({
      nombre: '',
      grupo: 'Pecho',
      series: '4',
      reps: '10',
      peso: '',
      descanso: '90',
      notas: '',
    })
    showToast('Ejercicio agregado')
  }

  const handleDelete = (id: string) => {
    deleteExercise(id)
    showToast('Ejercicio eliminado', 'info')
  }

  return (
    <div className="flex flex-col gap-4">
      <Card title="Registrar ejercicio">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ejercicio" error={errors.nombre?.message} required>
              <Input
                placeholder="Ej: Press de banca"
                {...register('nombre')}
                hasError={!!errors.nombre}
              />
            </FormField>
            <FormField label="Grupo muscular">
              <Select {...register('grupo')}>
                {MUSCLE_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Series" error={errors.series?.message} required>
              <Input
                type="number"
                placeholder="4"
                min="1"
                {...register('series')}
                hasError={!!errors.series}
              />
            </FormField>
            <FormField label="Repeticiones" error={errors.reps?.message} required>
              <Input
                type="number"
                placeholder="10"
                min="1"
                {...register('reps')}
                hasError={!!errors.reps}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Peso utilizado (kg)">
              <Input
                type="number"
                placeholder="20"
                step="0.5"
                min="0"
                {...register('peso')}
              />
            </FormField>
            <FormField label="Descanso (seg)">
              <Input
                type="number"
                placeholder="90"
                min="0"
                {...register('descanso')}
              />
            </FormField>
          </div>
          <FormField label="Notas del ejercicio">
            <Input
              placeholder="Ej: aumenté 2.5kg respecto a la semana pasada"
              {...register('notas')}
            />
          </FormField>
          <Button type="submit" isLoading={isSubmitting} className="mt-1">
            Agregar ejercicio
          </Button>
        </form>
      </Card>

      <Card title="Ejercicios de hoy">
        {todayExercises.length === 0 ? (
          <EmptyState
            icon={<Dumbbell size={20} />}
            title="Ninguno aún"
            description="Agrega tu primer ejercicio del día"
          />
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {todayExercises.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
              >
                <div>
                  <span className="text-sm font-medium text-slate-800">
                    {ex.nombre}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">
                    ({ex.grupo})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue">
                    {ex.series}×{ex.reps} @ {ex.peso}kg
                  </Badge>
                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
