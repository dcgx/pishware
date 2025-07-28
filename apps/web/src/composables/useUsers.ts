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
      console.log(data,'data ')
      store.setUsers(data)
      console.log(store.users, 'store user')
    } catch (err) {
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
        name: payload.nombre,
        email: payload.correo,
        username: payload.correo.split('@')[0] // Ejemplo simple de username
      })
      store.addUser({
        nombre: payload.nombre,
        correo: payload.correo,
        rol: payload.rol,
        grupo: payload.grupo,
        estado: payload.estado,
        avatar: payload.avatar,
        ultimo_acceso: 'Sin acceso',
        id: data.profile.id,
      })
      return { success: true, password: data.password }
    } catch (err) {
      store.error = 'Error creando usuario'
      return { success: false, error: err }
    } finally {
      store.creating = false
    }
  }

  return {
    users: computed(() => store.users),
    usersWithoutGroups: computed(() => store.usersWithoutGroup),
    loading: computed(() => store.loading),
    creating: computed(() => store.creating),
    error: store.error,
    fetchUsers,
    createUser
  }
}
