<script setup lang="ts" generic="T extends Record<string, unknown>, S extends any[]">
import { DnDOperations, useDraggable, useDroppable } from '@vue-dnd-kit/core'
import DragHandle from './DragHandle.vue'
import { computed } from 'vue'

const {
  groups = ['dashboard-columns'],
  columns,
  columnIndex,
  bodyGroups = ['dashboard-column-body'],
  bodySource,
  column,
} = defineProps<{
  groups?: string[]
  columns: T[]
  columnIndex: number
  bodyGroups?: string[]
  bodySource: S
  column: T
}>()

const emit = defineEmits<{
  save: []
}>()

const { elementRef, handleDragStart, isDragging, isOvered } = useDraggable({
  groups,
  data: computed(() => ({
    source: columns,
    index: columnIndex,
  })),
  events: {
    onStart: (e) => {
      console.log('column.onStart', e)
    },
    onEnd: (e) => {
      console.log('column.onStart', e)
    },
    onHover: (e) => {
      console.log('column.onHover', e)
    },
    onLeave: (e) => {
      console.log('column.onLeave', e)
    },
  },
})

const { elementRef: droppableRef, isOvered: isBodyOvered } = useDroppable({
  groups: bodyGroups,
  data: computed(() => ({
    source: bodySource,
  })),
  events: {
    onDrop: async (store) => {
      console.log('column.onDrop', store)
      DnDOperations.applyTransfer(store)
      emit('save')
      return true
    },
    onHover: (e) => {
      console.log('column.onHover', e)
    },
    onLeave: (e) => {
      console.log('column.onLeave', e)
    },
  },
})
</script>

<template>
  <div
    class="column"
    :class="{
      'dashboard-column-dragging': isDragging,
      'dashboard-column-overed': isOvered,
    }"
    ref="elementRef"
  >
    <header class="dashboard-column-header">
      <DragHandle @pointerdown="handleDragStart" />
      <slot name="header">
        <h3 class="dashboard-column-title">{{ column.title }}</h3>
      </slot>
    </header>
    <div>
      <ul
        ref="droppableRef"
        class="dashboard-column-body"
        :class="{ 'dashboard-column-body-overed': isBodyOvered }"
      >
        <slot :body-source="bodySource" />
      </ul>
    </div>
    <footer class="dashboard-column-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
