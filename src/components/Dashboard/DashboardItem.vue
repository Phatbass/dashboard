<script setup lang="ts" generic="T extends Record<string, unknown>">
import { useDraggable } from '@vue-dnd-kit/core'
import { computed } from 'vue'
import DragHandle from '@/components/Dashboard/DragHandle.vue'

defineOptions({ name: 'DashboardBoardItem' })

const {
  items,
  itemIndex,
  groups = ['dashboard-column-body'],
} = defineProps<{
  item: T
  items: T[]
  itemIndex: number
  groups?: string[]
}>()

const { elementRef, handleDragStart, isDragging } = useDraggable({
  groups,
  data: computed(() => ({
    source: items,
    index: itemIndex,
  })),
})
</script>

<template>
  <li class="dashboard-item" :class="{ 'dashboard-item-dragging': isDragging }" ref="elementRef">
    <DragHandle @pointerdown="handleDragStart" />
    <slot name="button" :item="item" />
    <div class="dashboard-item__content">
      <slot name="content" :item="item" />
    </div>
  </li>
</template>
