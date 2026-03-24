import { describe, it, expect } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'

import { routers, routeNameToComponent } from '@/constants/routers'
import App from '../App.vue'

function createTestRouter() {
  const routes = routers
    .filter((r) => r.name in routeNameToComponent)
    .map((r) => ({
      path: r.to,
      name: r.name,
      component: routeNameToComponent[r.name]!,
    }))
  return createRouter({
    history: createMemoryHistory(),
    routes,
  })
}

describe('App', () => {
  it('mounts renders properly', async () => {
    const pinia = createPinia()
    const router = createTestRouter()
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Log in')
    expect(wrapper.text()).toContain('Authorization required')
  })
})
