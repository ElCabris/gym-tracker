'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/Card'
import { FormField, Input } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { today } from '@/lib/utils'

const schema = z.object({
  inicio: z.string().optional(),
  fin: z.string().optional(),
  horas: z.string().min(1, 'Ingresa las horas dormidas'),
  calidad: z.string().min(1, 'Ingresa la calidad del sueño'),
  notas: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function SleepForm() {
  const { sleepRecords, upsertSleepRecord, showToast } = useAppStore()
  const todayStr = today()
  const existing = sleepRecords.find((r) => r.fecha === todayStr)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      inicio: existing?.inicio ?? '',
      fin: existing?.fin ?? '',
      horas: existing?.horas?.toString() ?? '',
      calidad: existing?.calidad?.toString() ?? '',
      notas: existing?.notas ?? '',
    },
  })

  const onSubmit = (data: FormValues) => {
    upsertSleepRecord({
      fecha: todayStr,
      inicio: data.inicio ?? '',
      fin: data.fin ?? '',
      horas: parseFloat(data.horas) || 0,
      calidad: parseInt(data.calidad) || 0,
      notas: data.notas ?? '',
    })
    showToast('Sueño guardado correctamente')
  }

  return (
    <Card title="Registrar sueño">
      {existing && (
        <div className="mb-3 px-3 py-2 bg-indigo-50 rounded-lg text-xs text-indigo-700">
          Ya tienes un registro de sueño para hoy ({existing.horas}h, calidad{' '}
          {existing.calidad}/10). Puedes actualizarlo.
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Me acosté">
            <Input type="time" {...register('inicio')} />
          </FormField>
          <FormField label="Me levanté">
            <Input type="time" {...register('fin')} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Horas dormidas"
            error={errors.horas?.message}
            required
          >
            <Input
              type="number"
              placeholder="8"
              step="0.5"
              min="0"
              max="24"
              {...register('horas')}
              hasError={!!errors.horas}
            />
          </FormField>
          <FormField
            label="Calidad (1–10)"
            error={errors.calidad?.message}
            required
          >
            <Input
              type="number"
              placeholder="8"
              min="1"
              max="10"
              {...register('calidad')}
              hasError={!!errors.calidad}
            />
          </FormField>
        </div>
        <FormField label="Notas">
          <Input
            placeholder="Ej: me desperté 2 veces, soñé, etc."
            {...register('notas')}
          />
        </FormField>
        <Button type="submit" isLoading={isSubmitting} className="mt-1">
          Guardar sueño
        </Button>
      </form>
    </Card>
  )
}
