import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DAY_NAMES_ES } from './constants'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatDate(fecha: string): string {
  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

export function formatDateShort(fecha: string): string {
  return fecha.slice(5) // MM-DD
}

export function getDayName(fecha: string): string {
  const d = new Date(fecha + 'T12:00:00')
  return DAY_NAMES_ES[d.getDay()]
}

export function getDateRange(days: number): string[] {
  const result: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    result.push(d.toISOString().split('T')[0])
  }
  return result
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Date.now().toString() + Math.random().toString(36).slice(2)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function pct(value: number, goal: number): number {
  if (goal === 0) return 0
  return clamp(Math.round((value / goal) * 100), 0, 100)
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export function isBenchPress(nombre: string): boolean {
  const lower = nombre.toLowerCase()
  return lower.includes('press') || lower.includes('banca')
}
