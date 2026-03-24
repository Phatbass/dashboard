<script setup lang="ts">
import { ref } from 'vue'
import type { DashboardTaskInterface } from '@/interfaces/dashboardTaskInterface.ts'
import type { DashboardColumnInterface } from '@/interfaces/dashboardColumnInterface.ts'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const props = withDefaults(
  defineProps<{
    columns?: DashboardColumnInterface[]
    saveBoard?: () => Promise<boolean>
    addColumn?: (column: DashboardColumnInterface) => void
    removeColumnById?: (columnId: number) => void
  }>(),
  {
    columns: () => [],
    saveBoard: async () => false,
    addColumn: () => undefined,
    removeColumnById: () => undefined,
  },
)

const newTaskTitle = ref('')
const addTaskError = ref<string | null>(null)
const showAddTaskModal = ref(false)
const isSavingAddTask = ref(false)

function getNextTaskId(): number {
  return (
    props.columns.flatMap((col) => col.tasks).reduce((max, task) => Math.max(max, task.id), 0) + 1
  )
}

function openAddTaskModal(): void {
  newTaskTitle.value = ''
  addTaskError.value = null
  showAddTaskModal.value = true
}

function closeAddTaskModal(): void {
  showAddTaskModal.value = false
  newTaskTitle.value = ''
  addTaskError.value = null
  isSavingAddTask.value = false
}

async function saveNewTask(): Promise<void> {
  const title = newTaskTitle.value.trim()
  if (!title) {
    addTaskError.value = 'Title is required.'
    return
  }
  console.log(props.columns)
  if (props.columns.length === 0) {
    addTaskError.value = 'Create a column first.'
    return
  }

  const firstColumn = props.columns[0]!
  const newTask: DashboardTaskInterface = {
    id: getNextTaskId(),
    title,
    sort: firstColumn.tasks.length,
    owner: userStore.getUsername ?? '',
  }

  firstColumn.tasks.push(newTask)
  isSavingAddTask.value = true
  addTaskError.value = null

  const saved = await props.saveBoard()
  isSavingAddTask.value = false
  if (!saved) {
    firstColumn.tasks = firstColumn.tasks.filter((t) => t.id !== newTask.id)
    addTaskError.value = 'Failed to save changes.'
    return
  }

  closeAddTaskModal()
}
</script>

<template>
  <button class="button is-primary is-light" type="button" @click="openAddTaskModal">
    Add task
  </button>
  <div class="modal" :class="{ 'is-active': showAddTaskModal }">
    <div class="modal-background" @click="closeAddTaskModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add task</p>
        <button class="delete" aria-label="close" @click="closeAddTaskModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label" for="new-task-title-input">Title</label>
          <div class="control">
            <input
              id="new-task-title-input"
              v-model="newTaskTitle"
              class="input"
              type="text"
              placeholder="Task title"
              :disabled="isSavingAddTask"
              @keyup.enter="saveNewTask"
            />
          </div>
        </div>
        <p v-if="addTaskError" class="help is-danger">{{ addTaskError }}</p>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button
            class="button is-success"
            :class="{ 'is-loading': isSavingAddTask }"
            :disabled="isSavingAddTask"
            @click="saveNewTask"
          >
            Save
          </button>
          <button class="button" :disabled="isSavingAddTask" @click="closeAddTaskModal">
            Cancel
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>
