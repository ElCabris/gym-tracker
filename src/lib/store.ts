import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  DailyRecord,
  Exercise,
  Meal,
  SleepRecord,
  Page,
} from './types'
import { generateId, today } from './utils'
import { STORAGE_KEYS } from './constants'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface AppState {
  // Navigation
  currentPage: Page
  setCurrentPage: (page: Page) => void

  // Data
  dailyRecords: DailyRecord[]
  exercises: Exercise[]
  meals: Meal[]
  sleepRecords: SleepRecord[]

  // Toast notifications
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void

  // Daily Records CRUD
  upsertDailyRecord: (record: Omit<DailyRecord, 'id'> & { id?: string }) => void
  deleteDailyRecord: (id: string) => void

  // Exercises CRUD
  addExercise: (exercise: Omit<Exercise, 'id'>) => void
  deleteExercise: (id: string) => void

  // Meals CRUD
  addMeal: (meal: Omit<Meal, 'id'>) => void
  deleteMeal: (id: string) => void

  // Sleep CRUD
  upsertSleepRecord: (record: Omit<SleepRecord, 'id'> & { id?: string }) => void
  deleteSleepRecord: (id: string) => void

  // Selectors
  getTodayRecord: () => DailyRecord | null
  getTodayMeals: () => Meal[]
  getTodaySleep: () => SleepRecord | null
  getTodayExercises: () => Exercise[]
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentPage: 'dashboard',
      setCurrentPage: (page) => set({ currentPage: page }),

      // Data
      dailyRecords: [],
      exercises: [],
      meals: [],
      sleepRecords: [],

      // Toasts
      toasts: [],
      showToast: (message, type = 'success') => {
        const id = generateId()
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }],
        }))
        setTimeout(() => {
          get().removeToast(id)
        }, 3000)
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // Daily Records
      upsertDailyRecord: (record) => {
        const id = record.id ?? generateId()
        const newRecord: DailyRecord = { ...record, id }
        set((state) => {
          const filtered = state.dailyRecords.filter(
            (r) => r.fecha !== newRecord.fecha
          )
          return {
            dailyRecords: [...filtered, newRecord].sort((a, b) =>
              a.fecha.localeCompare(b.fecha)
            ),
          }
        })
      },
      deleteDailyRecord: (id) =>
        set((state) => ({
          dailyRecords: state.dailyRecords.filter((r) => r.id !== id),
        })),

      // Exercises
      addExercise: (exercise) => {
        const newExercise: Exercise = { ...exercise, id: generateId() }
        set((state) => ({
          exercises: [...state.exercises, newExercise],
        }))
      },
      deleteExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        })),

      // Meals
      addMeal: (meal) => {
        const newMeal: Meal = { ...meal, id: generateId() }
        set((state) => ({
          meals: [...state.meals, newMeal],
        }))
      },
      deleteMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id),
        })),

      // Sleep
      upsertSleepRecord: (record) => {
        const id = record.id ?? generateId()
        const newRecord: SleepRecord = { ...record, id }
        set((state) => {
          const filtered = state.sleepRecords.filter(
            (r) => r.fecha !== newRecord.fecha
          )
          return {
            sleepRecords: [...filtered, newRecord].sort((a, b) =>
              a.fecha.localeCompare(b.fecha)
            ),
          }
        })
      },
      deleteSleepRecord: (id) =>
        set((state) => ({
          sleepRecords: state.sleepRecords.filter((r) => r.id !== id),
        })),

      // Selectors
      getTodayRecord: () => {
        const todayStr = today()
        return get().dailyRecords.find((r) => r.fecha === todayStr) ?? null
      },
      getTodayMeals: () => {
        const todayStr = today()
        return get().meals.filter((m) => m.fecha === todayStr)
      },
      getTodaySleep: () => {
        const todayStr = today()
        return get().sleepRecords.find((r) => r.fecha === todayStr) ?? null
      },
      getTodayExercises: () => {
        const todayStr = today()
        return get().exercises.filter((e) => e.fecha === todayStr)
      },
    }),
    {
      name: 'gym-health-tracker-v1',
      // Persist data but not UI state or toasts
      partialize: (state) => ({
        dailyRecords: state.dailyRecords,
        exercises: state.exercises,
        meals: state.meals,
        sleepRecords: state.sleepRecords,
      }),
    }
  )
)
