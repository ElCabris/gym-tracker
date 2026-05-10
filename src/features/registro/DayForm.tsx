'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/Card'
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { today } from '@/lib/utils'
import { DAY_STATUSES } from '@/lib/constants'
import type { DayStatus } from '@/lib/types'

const schema = z.object({
  fecha: z.string().min(1, 'Selecciona una fecha'),
  peso: z.string().optional(),
  agua: z.string().optional(),
  energia: z.string().optional(),
  notas: z.string().optional(),
  estado: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function DayForm() {
  const { upsertDailyRecord, showToast } = useAppStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fecha: today(),
      peso: '',
      agua: '',
      energia: '',
      notas: '',
      estado: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    upsertDailyRecord({
      fecha: data.fecha || today(),
      peso: data.peso ? parseFloat(data.peso) : null,
      agua: data.agua ? parseInt(data.agua) : 0,
      energia: data.energia ? parseInt(data.energia) : null,
      notas: data.notas ?? '',
      estado: (data.estado as DayStatus) ?? '',
    })
    reset({
      fecha: today(),
      peso: '',
      agua: '',
      energia: '',
      notas: '',
      estado: '',
    })
    showToast('Día guardado correctamente')
  }

  return (
    <Card title="Registro del día">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Fecha" error={errors.fecha?.message} required>
            <Input type="date" {...register('fecha')} hasError={!!errors.fecha} />
          </FormField>
          <FormField label="Peso corporal (kg)" error={errors.peso?.message}>
            <Input
              type="number"
              placeholder="70"
              step="0.1"
              min="30"
              max="250"
              {...register('peso')}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Agua consumida (ml)" error={errors.agua?.message}>
            <Input
              type="number"
              placeholder="0"
              step="100"
              min="0"
              {...register('agua')}
            />
          </FormField>
          <FormField label="Energía (1–10)" error={errors.energia?.message}>
            <Input
              type="number"
              placeholder="7"
              min="1"
              max="10"
              {...register('energia')}
            />
          </FormField>
        </div>
        <FormField label="Notas del día" error={errors.notas?.message}>
          <Textarea
            placeholder="Ej: buena energía hoy, sentí molestia en el hombro izquierdo..."
            {...register('notas')}
          />
        </FormField>
        <FormField label="Estado general" error={errors.estado?.message}>
          <Select {...register('estado')}>
            <option value="">Selecciona...</option>
            {DAY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FormField>
        <Button type="submit" isLoading={isSubmitting} className="mt-1">
          Guardar día
        </Button>
      </form>
    </Card>
  )
}
