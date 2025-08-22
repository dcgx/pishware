import { useUsersStore } from '@/stores/useUsersStore'
import axios from 'axios'
import { computed } from 'vue'

export const useUsers = () => {
  const store = useUsersStore()
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const fetchUsers = async () => {
    store.loading = true
    store.error = ''
    try {
      const { data } = await axios.get(`${apiUrl}/users`)
      console.log(data, 'data ')
      store.setUsers(data)
      console.log(store.users, 'store user')
    } catch {
      store.error = 'Error al obtener usuarios'
    } finally {
      store.loading = false
    }
  }

  const createUser = async (payload) => {
    store.creating = true
    store.error = ''
    try {
      const { data } = await axios.post(`${apiUrl}/users`, {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        username: payload.username || payload.email.split('@')[0],
      })
      store.addUser({
        id: data.profile.id,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        groups: [],
      })
      return { success: true }
    } catch (err) {
      store.error = 'Error creando usuario'
      return { success: false, error: err }
    } finally {
      store.creating = false
    }
  }

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/users/${id}`)
      store.users = store.users.filter((user) => user.id !== id)
      store.usersWithoutGroup = store.usersWithoutGroup.filter((user) => user.id !== id)
      return { success: true }
    } catch (err) {
      store.error = 'Error eliminando usuario'
      return { success: false, error: err }
    }
  }

  return {
    users: computed(() => store.users),
    usersWithoutGroups: computed(() => store.usersWithoutGroup),
    loading: computed(() => store.loading),
    creating: computed(() => store.creating),
    error: store.error,
    fetchUsers,
    createUser,
    deleteUser,
  }
}
