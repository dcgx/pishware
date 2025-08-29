<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <admin-layout>
    <form class="space-y-4 max-w-md" @submit.prevent="save">
      <div>
        <label class="block mb-1">Username</label>
        <input v-model="username" class="border p-2 rounded w-full" />
      </div>
      <div>
        <label class="block mb-1">Password</label>
        <input type="password" v-model="password" class="border p-2 rounded w-full" />
      </div>
      <button type="submit" class="px-4 py-2 text-white bg-blue-600 rounded">Save</button>
    </form>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const username = ref(authStore.user.username)
const password = ref('')

onMounted(async () => {
  if (!authStore.user.id) {
    await authStore.fetchUser()
    username.value = authStore.user.username
  }
})

const save = async () => {
  await authStore.updateUser({
    username: username.value,
    ...(password.value ? { password: password.value } : {}),
  })
  password.value = ''
}
</script>
