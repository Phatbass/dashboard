import { computed, reactive } from 'vue'
import type { DashboardColumnInterface } from '@/interfaces/dashboardColumnInterface.ts'
import { boardService } from '@/service/boardService.ts'

type BoardState = {
  columns: DashboardColumnInterface[]
  error: string | null
}

const state = reactive<BoardState>({
  columns: [],
  error: null,
})

const columnsState = computed<DashboardColumnInterface[]>({
  get: () => state.columns,
  set: (value) => {
    state.columns = value
  },
})

export const useBoardStore = () => ({
  columns: columnsState,
  getError: computed(() => state.error),
  async loadBoard(): Promise<boolean> {
    try {
      columnsState.value = await boardService.loadBoard()
      state.error = null
      return true
    } catch (error) {
      columnsState.value = []
      state.error = error instanceof Error ? error.message : 'Failed to load board'
      return false
    }
  },
  async saveToStorage(): Promise<boolean> {
    try {
      await boardService.saveBoard(columnsState.value)
      return true
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Failed to save board'
      return false
    }
  },
})
