<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label
        for="roleName"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Nombre
      </label>
      <input
        id="roleName"
        v-model="name"
        required
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div>
      <label
        for="roleDescription"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Descripción
      </label>
      <textarea
        id="roleDescription"
        v-model="description"
        rows="3"
        required
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      ></textarea>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 rounded bg-gray-100 text-gray-700"
      >
        Cancelar
      </button>
      <button type="submit" class="px-4 py-2 rounded bg-brand-500 text-white">
        Crear rol
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const name = ref('')
const description = ref('')

const resetForm = () => {
  name.value = ''
  description.value = ''
}

const handleSubmit = () => {
  emit('submit', { name: name.value, description: description.value })
  resetForm()
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}
</script>
