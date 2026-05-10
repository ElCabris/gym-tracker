'use client'

import { useAppStore } from '@/lib/store'
import { HealthService } from '@/lib/services'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { today } from '@/lib/utils'

export function GoalBars() {
  const todayStr = today()
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const meals = useAppStore((s) => s.meals)
  const sleepRecords = useAppStore((s) => s.sleepRecords)

  const todayRecord = dailyRecords.find((r) => r.fecha === todayStr) ?? null
  const todayMeals = meals.filter((m) => m.fecha === todayStr)
  const todaySleep = sleepRecords.find((r) => r.fecha === todayStr) ?? null

  const goals = HealthService.getGoalProgress(todayMeals, todayRecord, todaySleep)

  return (
    <Card title="Metas diarias">
      {goals.map((goal) => (
        <ProgressBar
          key={goal.label}
          label={goal.label}
          current={goal.current}
          goal={goal.goal}
          unit={goal.unit}
          color={goal.color}
          percentage={goal.percentage}
        />
      ))}
    </Card>
  )
}
