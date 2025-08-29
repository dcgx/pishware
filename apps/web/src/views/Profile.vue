<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <admin-layout>
    <form class="space-y-4" @submit.prevent="save">
      <div>
        <label class="block mb-1">First Name</label>
        <input v-model="firstName" class="border p-2 rounded w-full" />
      </div>
      <div>
        <label class="block mb-1">Last Name</label>
        <input v-model="lastName" class="border p-2 rounded w-full" />
      </div>
      <div>
        <label class="block mb-1">Username</label>
        <input v-model="username" class="border p-2 rounded w-full" />
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
const firstName = ref(authStore.user.first_name)
const lastName = ref(authStore.user.last_name)
const username = ref(authStore.user.username)

onMounted(async () => {
  if (!authStore.user.id) {
    await authStore.fetchUser()
    firstName.value = authStore.user.first_name
    lastName.value = authStore.user.last_name
    username.value = authStore.user.username
  }
})

const save = async () => {
  await authStore.updateUser({
    first_name: firstName.value,
    last_name: lastName.value,
    username: username.value,
  })
}
</script>
