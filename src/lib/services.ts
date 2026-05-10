/**
 * Service Layer - Business logic separated from UI
 */

import type {
  DailyRecord,
  Exercise,
  Meal,
  SleepRecord,
  NutritionTotals,
  PersonalRecord,
  ComplianceDot,
  GoalProgress,
} from './types'
import { GOALS, DAY_NAMES_ES, COLORS } from './constants'
import { today, getDateRange, round1, pct } from './utils'

// ─── Health Service ───────────────────────────────────────────────────────────

export class HealthService {
  static getWeeklyCompliance(
    dailyRecords: DailyRecord[],
    meals: Meal[]
  ): ComplianceDot[] {
    const todayStr = today()
    const dates = getDateRange(7)

    return dates.map((fecha) => {
      const d = new Date(fecha + 'T12:00:00')
      const dayLabel = DAY_NAMES_ES[d.getDay()]
      const dayNum = d.getDate()
      const isToday = fecha === todayStr

      if (isToday) {
        return { fecha, dayLabel, dayNum, status: 'today' }
      }

      const hasDailyRecord = dailyRecords.some((r) => r.fecha === fecha)
      const dayMeals = meals.filter((m) => m.fecha === fecha)
      const hasMeals = dayMeals.length > 0

      let status: ComplianceDot['status'] = 'miss'
      if (hasDailyRecord || hasMeals) {
        status = dayMeals.length >= 3 ? 'done' : 'partial'
      }

      return { fecha, dayLabel, dayNum, status }
    })
  }

  static getGoalProgress(
    meals: Meal[],
    dailyRecord: DailyRecord | null,
    sleepRecord: SleepRecord | null
  ): GoalProgress[] {
    const totals = NutritionService.getTotals(meals)
    const water = dailyRecord?.agua ?? 0
    const sleepH = sleepRecord?.horas ?? 0

    return [
      {
        label: 'Proteína',
        current: totals.prot,
        goal: GOALS.protein,
        unit: 'g',
        color: COLORS.protein,
        percentage: pct(totals.prot, GOALS.protein),
      },
      {
        label: 'Agua',
        current: water,
        goal: GOALS.water,
        unit: 'ml',
        color: COLORS.water,
        percentage: pct(water, GOALS.water),
      },
      {
        label: 'Calorías',
        current: totals.cal,
        goal: GOALS.calories,
        unit: 'kcal',
        color: COLORS.calories,
        percentage: pct(totals.cal, GOALS.calories),
      },
      {
        label: 'Sueño',
        current: sleepH,
        goal: GOALS.sleep,
        unit: 'h',
        color: COLORS.sleep,
        percentage: pct(sleepH, GOALS.sleep),
      },
    ]
  }
}

// ─── Nutrition Service ────────────────────────────────────────────────────────

export class NutritionService {
  static getTotals(meals: Meal[]): NutritionTotals {
    return meals.reduce(
      (acc, m) => ({
        cal: acc.cal + m.cal,
        prot: acc.prot + m.prot,
        carbs: acc.carbs + m.carbs,
        grasas: acc.grasas + m.grasas,
      }),
      { cal: 0, prot: 0, carbs: 0, grasas: 0 }
    )
  }

  static getMacroChartData(totals: NutritionTotals) {
    return [
      {
        name: `Proteína ${Math.round(totals.prot)}g`,
        value: totals.prot || 1,
        color: COLORS.protein,
      },
      {
        name: `Carbos ${Math.round(totals.carbs)}g`,
        value: totals.carbs || 1,
        color: COLORS.carbs,
      },
      {
        name: `Grasas ${Math.round(totals.grasas)}g`,
        value: totals.grasas || 1,
        color: COLORS.fat,
      },
    ]
  }
}

// ─── Training Service ─────────────────────────────────────────────────────────

export class TrainingService {
  static getPersonalRecords(exercises: Exercise[]): PersonalRecord[] {
    const map: Record<string, PersonalRecord> = {}
    for (const ex of exercises) {
      const current = map[ex.nombre]
      if (!current || ex.peso > current.peso) {
        map[ex.nombre] = {
          nombre: ex.nombre,
          grupo: ex.grupo,
          peso: ex.peso,
          fecha: ex.fecha,
        }
      }
    }
    return Object.values(map)
  }

  static getExerciseMaxByName(
    exercises: Exercise[]
  ): Record<string, { max: number; sessions: number }> {
    const map: Record<string, { max: number; sessions: number }> = {}
    for (const ex of exercises) {
      if (!map[ex.nombre]) {
        map[ex.nombre] = { max: 0, sessions: 0 }
      }
      if (ex.peso > map[ex.nombre].max) map[ex.nombre].max = ex.peso
      map[ex.nombre].sessions++
    }
    return map
  }

  static getBenchPressHistory(exercises: Exercise[]): Exercise[] {
    return exercises.filter(
      (e) =>
        e.nombre.toLowerCase().includes('press') ||
        e.nombre.toLowerCase().includes('banca')
    )
  }

  static getLastWorkout(
    exercises: Exercise[],
    todayStr: string
  ): { fecha: string; items: Exercise[] } | null {
    if (!exercises.length) return null

    const todayExercises = exercises.filter((e) => e.fecha === todayStr)
    if (todayExercises.length) {
      return { fecha: todayStr, items: todayExercises }
    }

    // Find most recent past date
    const sorted = [...exercises].sort((a, b) =>
      b.fecha.localeCompare(a.fecha)
    )
    const lastDate = sorted.find((e) => e.fecha < todayStr)?.fecha
    if (!lastDate) return null

    return {
      fecha: lastDate,
      items: exercises.filter((e) => e.fecha === lastDate),
    }
  }
}

// ─── Sleep Service ────────────────────────────────────────────────────────────

export class SleepService {
  static getWeeklyAverage(records: SleepRecord[]): number | null {
    const last7 = records.slice(-7)
    if (!last7.length) return null
    return round1(last7.reduce((a, s) => a + s.horas, 0) / last7.length)
  }

  static getDaysOver7h(records: SleepRecord[]): number {
    return records.slice(-7).filter((s) => s.horas >= 7).length
  }

  static getAverageQuality(records: SleepRecord[]): number | null {
    const last14 = records.slice(-14)
    if (!last14.length) return null
    return round1(
      last14.reduce((a, s) => a + s.calidad, 0) / last14.length
    )
  }

  static getCurrentStreak(records: SleepRecord[]): number {
    let streak = 0
    for (let i = records.length - 1; i >= 0; i--) {
      if (records[i].horas >= 7) streak++
      else break
    }
    return streak
  }

  static getSleepBarColor(horas: number): string {
    if (horas >= 7) return COLORS.chartGreen
    if (horas >= 6) return COLORS.chartAmber
    return COLORS.chartRed
  }

  static getSleepChartData(records: SleepRecord[]) {
    return records.slice(-14).map((s) => ({
      fecha: s.fecha.slice(5),
      horas: s.horas,
      color: SleepService.getSleepBarColor(s.horas),
    }))
  }
}
