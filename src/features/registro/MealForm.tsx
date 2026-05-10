'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppStore } from '@/lib/store'
import { NutritionService } from '@/lib/services'
import { Card } from '@/components/ui/Card'
import { FormField, Input } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Trash2, Apple } from 'lucide-react'
import { today } from '@/lib/utils'

const schema = z.object({
  nombre: z.string().min(1, 'Escribe el nombre del alimento'),
  hora: z.string().optional(),
  cal: z.string().optional(),
  prot: z.string().optional(),
  carbs: z.string().optional(),
  grasas: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function MealForm() {
  const { meals, addMeal, deleteMeal, showToast } = useAppStore()
  const todayStr = today()
  const todayMeals = meals.filter((m) => m.fecha === todayStr)
  const totals = NutritionService.getTotals(todayMeals)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      hora: '',
      cal: '',
      prot: '',
      carbs: '',
      grasas: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    addMeal({
      fecha: todayStr,
      hora: data.hora ?? '',
      nombre: data.nombre,
      cal: parseInt(data.cal ?? '0') || 0,
      prot: parseFloat(data.prot ?? '0') || 0,
      carbs: parseFloat(data.carbs ?? '0') || 0,
      grasas: parseFloat(data.grasas ?? '0') || 0,
    })
    reset({
      nombre: '',
      hora: '',
      cal: '',
      prot: '',
      carbs: '',
      grasas: '',
    })
    showToast('Comida agregada')
  }

  const handleDelete = (id: string) => {
    deleteMeal(id)
    showToast('Comida eliminada', 'info')
  }

  return (
    <div className="flex flex-col gap-4">
      <Card title="Registrar comida">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Comida / alimento"
              error={errors.nombre?.message}
              required
            >
              <Input
                placeholder="Ej: Pechuga de pollo"
                {...register('nombre')}
                hasError={!!errors.nombre}
              />
            </FormField>
            <FormField label="Hora">
              <Input type="time" {...register('hora')} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Calorías (kcal)">
              <Input type="number" placeholder="200" min="0" {...register('cal')} />
            </FormField>
            <FormField label="Proteína (g)">
              <Input
                type="number"
                placeholder="30"
                min="0"
                step="0.1"
                {...register('prot')}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Carbohidratos (g)">
              <Input
                type="number"
                placeholder="20"
                min="0"
                step="0.1"
                {...register('carbs')}
              />
            </FormField>
            <FormField label="Grasas (g)">
              <Input
                type="number"
                placeholder="5"
                min="0"
                step="0.1"
                {...register('grasas')}
              />
            </FormField>
          </div>
          <Button type="submit" isLoading={isSubmitting} className="mt-1">
            Agregar comida
          </Button>
        </form>
      </Card>

      <Card title="Comidas de hoy">
        {todayMeals.length === 0 ? (
          <EmptyState
            icon={<Apple size={20} />}
            title="Ninguna aún"
            description="Agrega tu primera comida del día"
          />
        ) : (
          <>
            <div className="flex flex-col divide-y divide-slate-100">
              {todayMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between py-2.5 first:pt-0"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {meal.hora && (
                        <span className="text-slate-400 mr-1 text-xs">
                          {meal.hora} —{' '}
                        </span>
                      )}
                      {meal.nombre}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {meal.cal} kcal · P:{Math.round(meal.prot)}g C:
                      {Math.round(meal.carbs)}g G:{Math.round(meal.grasas)}g
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors ml-2 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            {todayMeals.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap gap-3 text-xs font-semibold">
                  <span className="text-slate-700">
                    Total: {Math.round(totals.cal)} kcal
                  </span>
                  <span className="text-emerald-600">
                    {Math.round(totals.prot)}g proteína
                  </span>
                  <span className="text-amber-600">
                    {Math.round(totals.carbs)}g carbos
                  </span>
                  <span className="text-rose-500">
                    {Math.round(totals.grasas)}g grasas
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
