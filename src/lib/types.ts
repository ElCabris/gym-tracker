export type MuscleGroup =
  | 'Pecho'
  | 'Espalda'
  | 'Piernas'
  | 'Hombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Core'
  | 'Cardio'

export type DayStatus =
  | 'Excelente'
  | 'Bueno'
  | 'Normal'
  | 'Cansado'
  | 'Lesionado'
  | ''

export type Page =
  | 'dashboard'
  | 'registro'
  | 'entreno'
  | 'nutricion'
  | 'sueno'
  | 'historial'

export interface DailyRecord {
  id: string
  fecha: string // YYYY-MM-DD
  peso: number | null
  agua: number
  energia: number | null
  notas: string
  estado: DayStatus
}

export interface Exercise {
  id: string
  fecha: string // YYYY-MM-DD
  nombre: string
  grupo: MuscleGroup
  series: number
  reps: number
  peso: number
  descanso: number
  notas: string
}

export interface Meal {
  id: string
  fecha: string // YYYY-MM-DD
  hora: string
  nombre: string
  cal: number
  prot: number
  carbs: number
  grasas: number
}

export interface SleepRecord {
  id: string
  fecha: string // YYYY-MM-DD
  inicio: string
  fin: string
  horas: number
  calidad: number
  notas: string
}

export interface NutritionTotals {
  cal: number
  prot: number
  carbs: number
  grasas: number
}

export interface PersonalRecord {
  nombre: string
  grupo: MuscleGroup
  peso: number
  fecha: string
}

export interface ComplianceDot {
  fecha: string
  dayLabel: string
  dayNum: number
  status: 'done' | 'partial' | 'miss' | 'today'
}

export interface GoalProgress {
  label: string
  current: number
  goal: number
  unit: string
  color: string
  percentage: number
}
