<script setup lang="ts">
import { ref } from 'vue'
import type { DashboardColumnInterface } from '@/interfaces/dashboardColumnInterface.ts'
import type { DashboardTaskInterface } from '@/interfaces/dashboardTaskInterface.ts'

const props = defineProps<{
  columns: DashboardColumnInterface[]
  saveBoard: () => Promise<boolean>
  deleteColumn: (columnId: number) => Promise<boolean>
  deleteTask: (columnId: number, taskId: number) => Promise<boolean>
}>()

const MODE_TASK = 'task',
  MODE_COLUMN = 'column'

const showEditModal = ref(false)
const editingColumnId = ref<number | null>(null)
const editingTaskId = ref<number | null>(null)
const editingTitle = ref('')
const editError = ref<string | null>(null)
const isSavingProgress = ref(false)
const isDeleteProgress = ref(false)
const editMode = ref<'column' | 'task'>(MODE_COLUMN)

function closeEditModal(): void {
  showEditModal.value = false
  editingColumnId.value = null
  editingTaskId.value = null
  editingTitle.value = ''
  editError.value = null
  isSavingProgress.value = false
  isDeleteProgress.value = false
}

function openEditModal(column: DashboardColumnInterface): void {
  editMode.value = MODE_COLUMN
  editingColumnId.value = column.id
  editingTaskId.value = null
  editingTitle.value = column.title
  openModal()
}

function openTaskEditModal(column: DashboardColumnInterface, task: DashboardTaskInterface): void {
  editMode.value = MODE_TASK
  editingColumnId.value = column.id
  editingTaskId.value = task.id
  editingTitle.value = task.title

  openModal()
}

function openModal(): void {
  editError.value = null
  showEditModal.value = true
}

async function handleSaveEdit(): Promise<void> {
  const columnId = editingColumnId.value
  const title = editingTitle.value.trim()

  editError.value = null

  if (columnId === null) {
    editError.value = 'Column is not selected.'
    return
  }

  if (!title) {
    editError.value = 'Title is required.'
    return
  }

  const column = props.columns.find((column) => column.id === columnId)
  if (!column) {
    editError.value = 'Column not found.'
    return
  }

  if (editMode.value === MODE_TASK) {
    const taskId = editingTaskId.value

    if (taskId === null) {
      editError.value = 'Task is not selected.'
      return
    }

    const task = column.tasks.find((task) => task.id === taskId)

    if (!task) {
      editError.value = 'Task not found'
      return
    }

    task.title = title
  } else {
    column.title = title
  }

  isSavingProgress.value = true

  const saved = await props.saveBoard()

  isSavingProgress.value = false

  if (!saved) {
    editError.value = 'Failed to save changes.'

    return
  }

  closeEditModal()
}

async function handleDeleteColumn(): Promise<void> {
  isDeleteProgress.value = true
  editError.value = null

  if (editMode.value === MODE_TASK) {
    const columnId = editingColumnId.value
    const taskId = editingTaskId.value

    if (columnId === null || taskId === null) {
      editError.value = 'Task is not selected.'
      isDeleteProgress.value = false
      return
    }

    const column = props.columns.find((c) => c.id === columnId)
    if (!column) {
      editError.value = 'Column not found.'
      isDeleteProgress.value = false
      return
    }

    const taskIndex = column.tasks.findIndex((t) => t.id === taskId)
    if (taskIndex === -1) {
      editError.value = 'Task not found.'
      isDeleteProgress.value = false
      return
    }

    const saved = await props.deleteTask(columnId, taskId)
    isDeleteProgress.value = false

    if (!saved) {
      editError.value = 'Failed to delete task.'
      return
    }

    closeEditModal()
    return
  }

  const columnId = editingColumnId.value
  if (columnId === null) {
    editError.value = 'Column is not selected.'
    isDeleteProgress.value = false
    return
  }

  const columnIndex = props.columns.findIndex((c) => c.id === columnId)
  if (columnIndex === -1) {
    editError.value = 'Column not found.'
    isDeleteProgress.value = false
    return
  }

  const saved = await props.deleteColumn(columnId)
  isDeleteProgress.value = false

  if (!saved) {
    editError.value = 'Failed to delete column.'
    return
  }

  closeEditModal()
}

defineExpose({
  openEditModal,
  openTaskEditModal,
})
</script>

<template>
  <div class="modal" :class="{ 'is-active': showEditModal }">
    <div class="modal-background" @click="closeEditModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ editMode === MODE_TASK ? 'Edit task' : 'Edit column' }}
        </p>
        <button class="delete" aria-label="close" @click="closeEditModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label" for="edit-title-input">Title</label>
          <div class="control">
            <input
              id="edit-title-input"
              v-model="editingTitle"
              class="input"
              type="text"
              :placeholder="editMode === MODE_TASK ? 'Task title' : 'Column title'"
              :disabled="isSavingProgress || isDeleteProgress"
              @keyup.enter="handleSaveEdit"
            />
          </div>
        </div>
        <p v-if="editError" class="help is-danger">{{ editError }}</p>
      </section>
      <footer class="modal-card-foot">
        <div class="columns" style="width: 100%">
          <div class="column is-half">
            <div class="buttons">
              <button
                class="button is-danger"
                :class="{ 'is-loading': isDeleteProgress }"
                :disabled="isDeleteProgress"
                @click="handleDeleteColumn"
              >
                Delete
              </button>
            </div>
          </div>
          <div class="column is-half">
            <div class="buttons is-right">
              <button
                class="button is-success"
                :class="{ 'is-loading': isSavingProgress }"
                :disabled="isSavingProgress"
                @click="handleSaveEdit"
              >
                Save
              </button>
              <button class="button" :disabled="isSavingProgress" @click="closeEditModal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
