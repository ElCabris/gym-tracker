/**
 * Repository Pattern - base class for localStorage persistence
 */

export interface Repository<T extends { id: string; fecha: string }> {
  getAll(): T[]
  getByDate(fecha: string): T[]
  save(item: T): void
  update(item: T): void
  remove(id: string): void
  clear(): void
}

export class LocalStorageRepository<T extends { id: string; fecha: string }>
  implements Repository<T>
{
  protected readonly key: string

  constructor(key: string) {
    this.key = key
  }

  protected read(): T[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(this.key)
      if (!raw) return []
      return JSON.parse(raw) as T[]
    } catch {
      return []
    }
  }

  protected write(items: T[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.key, JSON.stringify(items))
    } catch {
      // Storage quota exceeded or not available
    }
  }

  getAll(): T[] {
    return this.read()
  }

  getByDate(fecha: string): T[] {
    return this.read().filter((item) => item.fecha === fecha)
  }

  save(item: T): void {
    const items = this.read()
    items.push(item)
    this.write(items)
  }

  update(item: T): void {
    const items = this.read()
    const idx = items.findIndex((i) => i.id === item.id)
    if (idx !== -1) {
      items[idx] = item
    } else {
      items.push(item)
    }
    this.write(items)
  }

  upsertByDate(item: T): void {
    const items = this.read().filter((i) => i.fecha !== item.fecha)
    items.push(item)
    items.sort((a, b) => a.fecha.localeCompare(b.fecha))
    this.write(items)
  }

  remove(id: string): void {
    const items = this.read().filter((i) => i.id !== id)
    this.write(items)
  }

  clear(): void {
    this.write([])
  }
}

// Concrete repositories
import type {
  DailyRecord,
  Exercise,
  Meal,
  SleepRecord,
} from './types'
import { STORAGE_KEYS } from './constants'

export class DailyRecordRepository extends LocalStorageRepository<DailyRecord> {
  constructor() {
    super(STORAGE_KEYS.dias)
  }

  getWithWeight(): DailyRecord[] {
    return this.getAll().filter((d) => d.peso !== null)
  }

  getWithNotes(): DailyRecord[] {
    return this.getAll().filter((d) => d.notas || d.estado)
  }
}

export class ExerciseRepository extends LocalStorageRepository<Exercise> {
  constructor() {
    super(STORAGE_KEYS.ejercicios)
  }

  getPersonalRecords(): Record<string, Exercise> {
    const records: Record<string, Exercise> = {}
    for (const ex of this.getAll()) {
      const current = records[ex.nombre]
      if (!current || ex.peso > current.peso) {
        records[ex.nombre] = ex
      }
    }
    return records
  }

  getBenchPressHistory(): Exercise[] {
    return this.getAll().filter(
      (e) =>
        e.nombre.toLowerCase().includes('press') ||
        e.nombre.toLowerCase().includes('banca')
    )
  }

  getGroupedByName(): Record<string, Exercise[]> {
    const map: Record<string, Exercise[]> = {}
    for (const ex of this.getAll()) {
      if (!map[ex.nombre]) map[ex.nombre] = []
      map[ex.nombre].push(ex)
    }
    return map
  }
}

export class MealRepository extends LocalStorageRepository<Meal> {
  constructor() {
    super(STORAGE_KEYS.comidas)
  }
}

export class SleepRepository extends LocalStorageRepository<SleepRecord> {
  constructor() {
    super(STORAGE_KEYS.suenos)
  }

  getLast(n: number): SleepRecord[] {
    return this.getAll().slice(-n)
  }
}
