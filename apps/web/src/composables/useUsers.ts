import { useUsersStore } from '@/stores/useUsersStore'
import { ref } from 'vue'
import axios from 'axios'

export const useUsers = () => {
  const store = useUsersStore()
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const fetchUsers = async () => {
    store.loading = true
    store.error = ''
    try {
      const { data } = await axios.get(`${apiUrl}/users`)
      store.setUsers(data)
    } catch (err) {
      console.error(err)
      store.error = 'Error al obtener usuarios'
    } finally {
      store.loading = false
    }
  }

  return {
    users: store.users,
    loading: store.loading,
    error: store.error,
    fetchUsers,
  }
}
