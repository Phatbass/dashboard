<script setup lang="ts">
import { ref } from 'vue'
import { Dashboard, DashboardColumn, DashboardItem } from '@/components/Dashboard'
import { useUserStore } from '@/stores/userStore.ts'
import { useBoardStore } from '@/stores/boardStore'
import type { DashboardColumnInterface } from '@/interfaces/dashboardColumnInterface.ts'
import type { DashboardTaskInterface } from '@/interfaces/dashboardTaskInterface.ts'
import TaskForm from '@/components/Form/TaskForm.vue'
import ColumnForm from '@/components/Form/ColumnForm.vue'
import EditForm from '@/components/Form/EditForm.vue'

const userStore = useUserStore()
const boardStore = useBoardStore()
const editFormRef = ref<{
  openEditModal: (column: DashboardColumnInterface) => void
  openTaskEditModal: (column: DashboardColumnInterface, task: DashboardTaskInterface) => void
} | null>(null)

const dashboardColumns = ref<DashboardColumnInterface[]>([])
const borderError = ref<string | null>(null)

await boardStore.loadBoard()
dashboardColumns.value = boardStore.columns.value
borderError.value = boardStore.getError.value

function openEditModal(column: DashboardColumnInterface): void {
  editFormRef.value?.openEditModal(column)
}

function openTaskEditModal(column: DashboardColumnInterface, task: DashboardTaskInterface): void {
  editFormRef.value?.openTaskEditModal(column, task)
}

async function saveBoard(): Promise<boolean> {
  return boardStore.saveToStorage()
}

async function saveHandler() {
  const saved = await saveBoard()
  if (!saved) {
    alert('Failed to save changes.')
  }
}

function addColumn(column: DashboardColumnInterface): void {
  dashboardColumns.value.push(column)
}

function removeColumnById(columnId: number): void {
  const index = dashboardColumns.value.findIndex((c) => c.id === columnId)
  if (index !== -1) {
    dashboardColumns.value.splice(index, 1)
  }
}

async function deleteColumn(columnId: number): Promise<boolean> {
  const columnIndex = dashboardColumns.value.findIndex((c) => c.id === columnId)
  if (columnIndex === -1) return false

  const [removedColumn] = dashboardColumns.value.splice(columnIndex, 1)
  if (!removedColumn) return false

  const saved = await saveBoard()
  if (!saved) {
    dashboardColumns.value.splice(columnIndex, 0, removedColumn)
    return false
  }

  return true
}

async function deleteTask(columnId: number, taskId: number): Promise<boolean> {
  const column = dashboardColumns.value.find((c) => c.id === columnId)
  if (!column) return false

  const taskIndex = column.tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) return false

  const [removedTask] = column.tasks.splice(taskIndex, 1)
  if (!removedTask) return false

  const saved = await saveBoard()
  if (!saved) {
    column.tasks.splice(taskIndex, 0, removedTask)
    return false
  }

  return true
}
</script>

<template>
  <div class="buttons" v-if="dashboardColumns.length > 0 && userStore.isAdmin">
    <ColumnForm
      :columns="dashboardColumns"
      :save-board="saveBoard"
      :add-column="addColumn"
      :remove-column-by-id="removeColumnById"
    />
    <TaskForm
      :columns="dashboardColumns"
      :save-board="saveBoard"
      :add-column="dashboardColumns.push"
    />
  </div>

  <div v-if="borderError" class="notification is-danger">
    <p>{{ borderError }}</p>
  </div>

  <Dashboard :columns="dashboardColumns" @save="saveHandler" v-slot="{ columns: slotColumns }">
    <DashboardColumn
      v-for="(column, index) in slotColumns"
      :key="column.id"
      :column="column"
      :columns="slotColumns"
      :column-index="index"
      :body-source="column.tasks"
      @save="saveHandler"
    >
      <template #header>
        <h3 class="dashboard-column-title">{{ column.title }}</h3>
        <button
          v-if="userStore.isAdmin"
          class="button is-small is-ghost ml-auto"
          type="button"
          aria-label="Edit column title"
          @click.stop="openEditModal(column)"
        >
          <span class="icon is-small">✎</span>
        </button>
      </template>

      <DashboardItem
        v-for="(task, taskIndex) in column.tasks"
        :key="task.id"
        :item="task"
        :items="column.tasks"
        :item-index="taskIndex"
      >
        <template #content>
          <div>
            <p class="mb-1">{{ task.title }}</p>
            <p class="is-size-7 has-text-grey">Owner: {{ task.owner }}</p>
          </div>
        </template>
        <template #button>
          <button
            v-if="userStore.isAdmin"
            class="button is-small is-ghost"
            type="button"
            aria-label="Edit task title"
            @click.stop="openTaskEditModal(column, task)"
          >
            <span class="icon is-small">✎</span>
          </button>
        </template>
      </DashboardItem>
    </DashboardColumn>
  </Dashboard>

  <EditForm
    v-if="userStore.isAdmin"
    ref="editFormRef"
    :columns="dashboardColumns"
    :save-board="saveBoard"
    :delete-column="deleteColumn"
    :delete-task="deleteTask"
  />
</template>
