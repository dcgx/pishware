import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const usersWithoutGroup = ref([])
  const loading = ref(false)
  const error = ref('')
  const creating = ref(false)

  const setUsers = (data) => {
    users.value = data
    usersWithoutGroup.value = data.filter((user: any) => {
      console.log(user.groups, 'user groups')
      return user.groups.length === 0
    })
    console.log(usersWithoutGroup.value, 'users without group')
  }

  const addUser = (user) => { users.value.push(user) }

  return {
    users,
    usersWithoutGroup,
    loading,
    error,
    creating,
    setUsers,
    addUser,
  }
})
