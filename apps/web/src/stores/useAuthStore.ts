import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: string
  first_name: string
  last_name: string
  username: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: (): { user: User } => ({
    user: { id: '', first_name: '', last_name: '', username: '', email: '' },
  }),
  actions: {
    async fetchUser() {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const { data } = await axios.get(`${apiUrl}/users/me`)
      this.user = data
    },
    async updateUser(payload: Partial<User> & { password?: string }) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      await axios.patch(`${apiUrl}/users/${this.user.id}`, payload)
      this.user = { ...this.user, ...payload }
    },
  },
})
