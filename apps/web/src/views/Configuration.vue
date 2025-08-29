<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <admin-layout>
    <div class="max-w-2xl mx-auto p-6 space-y-8">
      <section class="bg-white shadow rounded p-6">
        <h2 class="text-lg font-semibold mb-4">Actualizar Username</h2>
        <form @submit.prevent="saveUsername" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
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
      </section>

      <section class="bg-white shadow rounded p-6">
        <h2 class="text-lg font-semibold mb-4">Cambiar Contraseña</h2>
        <form @submit.prevent="savePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Contraseña actual</label
            >
            <input
              type="password"
              v-model="currentPassword"
              class="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Nueva contraseña</label
            >
            <input
              type="password"
              v-model="newPassword"
              class="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Confirmar contraseña</label
            >
            <input
              type="password"
              v-model="confirmPassword"
              class="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring"
            />
          </div>
          <p v-if="passwordError" class="text-sm text-red-600">{{ passwordError }}</p>
          <button
            type="submit"
            class="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Actualizar
          </button>
        </form>
      </section>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const username = ref(authStore.user.username)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')

onMounted(async () => {
  if (!authStore.user.id) {
    await authStore.fetchUser()
    username.value = authStore.user.username
  }
})

const saveUsername = async () => {
  await authStore.updateUser({ username: username.value })
}

const savePassword = async () => {
  passwordError.value = ''
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    passwordError.value = 'Completa todos los campos.'
    return
  }
  if (newPassword.value.length < 8) {
    passwordError.value = 'La nueva contraseña debe tener al menos 8 caracteres.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Las contraseñas no coinciden.'
    return
  }

  await authStore.updateUser({
    oldPassword: currentPassword.value,
    password: newPassword.value,
  })
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>
