import type { Component } from 'vue'
import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'

export const routers = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
];

export const routeNameToComponent: Record<string, Component> = {
  'Home': HomePage,
  'About': AboutPage,
}