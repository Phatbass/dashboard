import {defineStore} from 'pinia'
import type {UserInterfaces} from '@/interfaces/userInterfaces'
import type {UserStateInterfaces} from "@/interfaces/userStateInterfaces.ts";
import { apiService } from '@/service/apiService';

const STORAGE_KEY = 'currentUser'

export const useUserStore = defineStore('user', {
  state: (): UserStateInterfaces => ({
    currentUser: null as UserInterfaces | null,
    token: null,
  }),
  getters: {
    isAuthenticated(state): boolean {
      return state.currentUser !== null && state.token !== null
    },
    getUsername(state): string {
      let username = state.currentUser?.username ?? ''

      if (state.currentUser?.rules === 1) {
        username += ' - Admin'
      } else {
        username += ' - Reader'
      }

      return username
    },
    isAdmin(state): boolean {
      return state.currentUser?.rules === 1
    },
    getToken(state): string | null {
      return state.token
    }
  },
  actions: {
    loadFromStorage(): boolean {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        if (stored !== null) {
          const data = JSON.parse(stored) as {
            currentUser?: UserInterfaces | null
            token?: string | null
          }
          this.currentUser = data.currentUser ?? null
          this.token = data.token ?? null
          return this.currentUser !== null && this.token !== null
        }
      } catch (error) {
        console.error('Failed to load user from sessionStorage:', error)
      }
      return false
    },
    saveToStorage(): void {
      try {
        if (this.currentUser && this.token) {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            currentUser: this.currentUser,
            token: this.token
          }))
        } else {
          sessionStorage.removeItem(STORAGE_KEY)
        }
      } catch (error) {
        console.error('Failed to save user to sessionStorage:', error)
      }
    },
    async login(username: string, password: string): Promise<boolean> {
      try {
        const data = await apiService.post<{ user: UserInterfaces; token: string | null }>(
          '/login',
          { username, password },
          { withAuth: false },
        )
        this.currentUser = data.user
        this.token = data.token
        this.saveToStorage()

        return true
      } catch (error) {
        console.error('Login via /api/login failed:', error)
        return false
      }
    },
    logout(): void {
      this.currentUser = null
      this.token = null
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }
})
