import { useUserStore } from '@/stores/userStore'

export const apiService = {
  _getToken(): string | null {
    return useUserStore().getToken
  },
  async get(url: string): Promise<unknown> {
    const token = this._getToken()

    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to save data:' + response.status)
    }

    return await response.json()
  },
  async put(url: string, data: unknown): Promise<boolean> {
    const token = this._getToken()

    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to save data:' + response.status)
    }

    return true
  },
  async post<T = unknown>(
    url: string,
    data: unknown,
    options?: { withAuth?: boolean },
  ): Promise<T> {
    const withAuth = options?.withAuth ?? true
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (withAuth) {
      const token = this._getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to save data:' + response.status)
    }

    return (await response.json()) as T
  },
}
