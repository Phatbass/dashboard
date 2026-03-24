import type { Component } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routers, routeNameToComponent } from '@/constants/routers'

const routesToBeDefined = routers
  .filter((r) => r.name in routeNameToComponent)
  .map((r) => ({
    path: r.to,
    name: r.name,
    component: routeNameToComponent[r.name]!,
  }))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routesToBeDefined
  ],
})

export default router
