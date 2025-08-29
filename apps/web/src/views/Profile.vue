<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <admin-layout>
    <div class="max-w-2xl mx-auto p-6">
      <form
        class="space-y-4 rounded bg-white p-6 shadow"
        @submit.prevent="save"
      >
        <h2 class="mb-4 text-lg font-semibold">Editar Perfil</h2>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >First Name</label
          >
          <input
            v-model="firstName"
            class="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >Last Name</label
          >
          <input
            v-model="lastName"
            class="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >Username</label
          >
          <input
            v-model="username"
            class="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring"
          />
        </div>
        <button
          type="submit"
          class="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Guardar
        </button>
      </form>
    </div>
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
