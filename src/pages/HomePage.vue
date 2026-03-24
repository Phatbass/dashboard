<script setup lang="ts">
import DroppableComponent from '@/components/DroppableComponent.vue'
import DashboardLoaderComponent from '@/components/DashboardLoaderComponent.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <div v-if="!userStore.isAuthenticated" class="notification is-warning is-light" role="alert">
    <strong>Authorization required.</strong> Please log in to access the dashboard.
  </div>
  <div v-else>
    <Suspense>
      <template #default>
        <DroppableComponent />
      </template>
      <template #fallback>
        <DashboardLoaderComponent />
      </template>
    </Suspense>
  </div>
</template>
