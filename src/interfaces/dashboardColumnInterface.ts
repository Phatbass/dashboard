import type { DashboardTaskInterface } from '@/interfaces/dashboardTaskInterface.ts'

export interface DashboardColumnInterface extends Record<string, unknown> {
  id: number
  title: string
  sort: number
  tasks: DashboardTaskInterface[]
}