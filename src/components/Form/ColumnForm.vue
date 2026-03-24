<script setup lang="ts">
import type { DashboardColumnInterface } from '@/interfaces/dashboardColumnInterface.ts'
import { ref } from 'vue'

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

const newColumnTitle = ref('')
const addColumnError = ref<string | null>(null)
const showAddColumnModal = ref(false)
const isSavingAddColumn = ref(false)

function getNextColumnId(): number {
  return props.columns.reduce((max, col) => Math.max(max, col.id), 0) + 1
}

function openAddColumnModal(): void {
  newColumnTitle.value = ''
  addColumnError.value = null
  showAddColumnModal.value = true
}

function closeAddColumnModal(): void {
  showAddColumnModal.value = false
  newColumnTitle.value = ''
  addColumnError.value = null
  isSavingAddColumn.value = false
}

async function saveNewColumn(): Promise<void> {
  const title = newColumnTitle.value.trim()
  if (!title) {
    addColumnError.value = 'Title is required.'
    return
  }

  const newColumn: DashboardColumnInterface = {
    id: getNextColumnId(),
    title,
    sort: props.columns.length,
    tasks: [],
  }

  props.addColumn(newColumn)
  isSavingAddColumn.value = true
  addColumnError.value = null

  const saved = await props.saveBoard()
  isSavingAddColumn.value = false
  if (!saved) {
    props.removeColumnById(newColumn.id)
    addColumnError.value = 'Failed to save changes.'
    return
  }

  closeAddColumnModal()
}
</script>

<template>
  <button class="button is-link is-light" type="button" @click="openAddColumnModal">
    Add column
  </button>
  <div class="modal" :class="{ 'is-active': showAddColumnModal }">
    <div class="modal-background" @click="closeAddColumnModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add column</p>
        <button class="delete" aria-label="close" @click="closeAddColumnModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label" for="new-column-title-input">Title</label>
          <div class="control">
            <input
              id="new-column-title-input"
              v-model="newColumnTitle"
              class="input"
              type="text"
              placeholder="Column title"
              :disabled="isSavingAddColumn"
              @keyup.enter="saveNewColumn"
            />
          </div>
        </div>
        <p v-if="addColumnError" class="help is-danger">{{ addColumnError }}</p>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button
            class="button is-success"
            :class="{ 'is-loading': isSavingAddColumn }"
            :disabled="isSavingAddColumn"
            @click="saveNewColumn"
          >
            Save
          </button>
          <button class="button" :disabled="isSavingAddColumn" @click="closeAddColumnModal">
            Cancel
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>
