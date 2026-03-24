import type { DashboardColumnInterface } from '@/interfaces/dashboardColumnInterface.ts'
import { apiService } from './apiService'

export const boardService = {
  async loadBoard(): Promise<DashboardColumnInterface[]> {
    const data = await apiService.get('/board')

    if (!data) {
      throw new Error('Failed to load board')
    }

    if (!Array.isArray(data)) {
      throw new Error('Invalid data')
    }

    return data as DashboardColumnInterface[]
  },
  async saveBoard(board: DashboardColumnInterface[]): Promise<boolean> {
    return await apiService.put('/board', board)
  },
}
