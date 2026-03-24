<script setup lang="ts" generic="T extends Record<string, unknown>">
import { DnDOperations, useDroppable } from '@vue-dnd-kit/core'
import { computed } from 'vue'

defineOptions({ name: 'DashboardBoard' })

const { columns, groups = ['dashboard-columns'] } = defineProps<{
  columns: T[]
  groups?: string[]
}>()

const emit = defineEmits<{
  save: []
}>()

const { elementRef } = useDroppable({
  groups,
  data: computed(() => ({
    source: columns,
  })),
  events: {
    onDrop: (store) => {
      console.log('onDrop', store)

      if (store.hovered.element.value) {
        DnDOperations.applyTransfer(store)
        emit('save')
      }
    },
  },
})
</script>

<template>
  <div class="columns" ref="elementRef">
    <slot :columns="columns" />
  </div>
</template>
