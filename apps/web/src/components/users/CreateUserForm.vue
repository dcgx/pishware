<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
      <input
        v-model="firstName"
        required
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido</label>
      <input
        v-model="lastName"
        required
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo</label>
      <input
        type="email"
        v-model="email"
        required
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Nombre de usuario</label
      >
      <input
        v-model="username"
        required
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
    <div class="flex gap-3 pt-2">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 rounded bg-gray-100 text-gray-700"
      >
        Cancelar
      </button>
      <button type="submit" class="px-4 py-2 rounded bg-brand-500 text-white">Crear usuario</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const username = ref('')

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  username.value = ''
}

const handleSubmit = () => {
  emit('submit', {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    username: username.value,
  })
  resetForm()
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}
</script>
