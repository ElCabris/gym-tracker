import type { MuscleGroup, DayStatus, Page } from './types'

export const GOALS = {
  protein: 130,    // g
  water: 3000,     // ml
  calories: 2700,  // kcal
  sleep: 8,        // h
  carbs: 300,      // g
  fat: 70,         // g
  weight: 75,      // kg
} as const

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Pecho',
  'Espalda',
  'Piernas',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Core',
  'Cardio',
]

export const DAY_STATUSES: DayStatus[] = [
  'Excelente',
  'Bueno',
  'Normal',
  'Cansado',
  'Lesionado',
]

export const PAGES: Page[] = [
  'dashboard',
  'registro',
  'entreno',
  'nutricion',
  'sueno',
  'historial',
]

export const PAGE_LABELS: Record<Page, string> = {
  dashboard: 'Dashboard',
  registro: 'Registrar',
  entreno: 'Entreno',
  nutricion: 'Nutrición',
  sueno: 'Sueño',
  historial: 'Progreso',
}

export const SPLIT_ROUTINE = [
  'Pecho + Tríceps (Lun)',
  'Espalda + Bíceps (Mar)',
  'Cardio + Core (Mié)',
  'Piernas (Jue)',
  'Hombros (Vie)',
  'Funcional (Sáb)',
]

export const SPLIT_ROUTINE_TEXT =
  'Rutina activa: Pecho+Tríceps (Lun) · Espalda+Bíceps (Mar) · Cardio+Core (Mié) · Piernas (Jue) · Hombros (Vie) · Funcional (Sáb)'

export const DAY_NAMES_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export const COLORS = {
  primary: '#4F46E5',
  water: '#0EA5E9',
  protein: '#10B981',
  calories: '#F59E0B',
  sleep: '#8B5CF6',
  fat: '#FB7185',
  carbs: '#F59E0B',
  chartGreen: '#10B981',
  chartAmber: '#F59E0B',
  chartRed: '#EF4444',
} as const

export const STORAGE_KEYS = {
  dias: 'gym_tracker_dias',
  ejercicios: 'gym_tracker_ejercicios',
  comidas: 'gym_tracker_comidas',
  suenos: 'gym_tracker_suenos',
} as const
