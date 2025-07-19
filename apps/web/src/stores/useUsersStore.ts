import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref('')
  const creating = ref(false)

  const setUsers = (data) => { users.value = data }
  
  const addUser = (user) => { users.value.push(user) }

  return {
    users,
    loading,
    error,
    creating,
    setUsers,
    addUser,
  }
})
