'use client'

import { useState } from 'react'
import { Calendar, Dumbbell, Apple, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DayForm } from './DayForm'
import { ExerciseForm } from './ExerciseForm'
import { MealForm } from './MealForm'
import { SleepForm } from './SleepForm'

type Tab = 'dia' | 'ejercicio' | 'comida' | 'sueno'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dia', label: 'Día', icon: <Calendar size={15} /> },
  { id: 'ejercicio', label: 'Ejercicio', icon: <Dumbbell size={15} /> },
  { id: 'comida', label: 'Comida', icon: <Apple size={15} /> },
  { id: 'sueno', label: 'Sueño', icon: <Moon size={15} /> },
]

export function Registro() {
  const [activeTab, setActiveTab] = useState<Tab>('dia')

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Registrar</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Añade datos de hoy
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'dia' && <DayForm />}
        {activeTab === 'ejercicio' && <ExerciseForm />}
        {activeTab === 'comida' && <MealForm />}
        {activeTab === 'sueno' && <SleepForm />}
      </div>
    </div>
  )
}
