<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Nombre</label
      >
      <input
        type="text"
        id="name"
        v-model="landingPagesStore.createForm.name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Ej: Notificación de prueba"
        required
      />
    </div>

    <div class="my-4">
      <Button> Importar sitio </Button>
    </div>

    <div class="mt-4">
      <div class="flex border-b">
        <button
          type="button"
          :class="tab === 'html' ? activeTabClass : inactiveTabClass"
          @click="tab = 'html'"
        >
          HTML
        </button>
      </div>

      <div class="mt-2">
        <textarea
          v-if="tab === 'html'"
          class="w-full mt-1 rounded-md border p-2 dark:bg-gray-700 dark:text-white"
          placeholder="Escribe tu HTML aquí"
          rows="10"
          v-model="landingPagesStore.createForm.htmlContent"
        />
      </div>
    </div>

    <div
      class="mt-4 flex items-center cursor-pointer"
      @click.stop="
        landingPagesStore.createForm.captureSubmittedData =
          !landingPagesStore.createForm.captureSubmittedData
      "
    >
      <input
        v-model="landingPagesStore.createForm.captureSubmittedData"
        type="checkbox"
        class="w-5 h-5 mr-2"
      />
      <label for="captureSubmittedData">Capturar datos enviados</label>
    </div>

    <div
      class="mt-4 cursor-pointer"
      @click.stop="
        landingPagesStore.createForm.capturePassword = !landingPagesStore.createForm.capturePassword
      "
    >
      <input
        v-model="landingPagesStore.createForm.capturePassword"
        type="checkbox"
        class="w-5 h-5 mr-2"
      />
      <label for="capturePassword">Capturar contraseña</label>
    </div>

    <div class="mt-6">
      <label class="block text-sm font-medium text-gray-700">Redireccionar a:</label>
      <input
        v-model="landingPagesStore.createForm.redirectUrl"
        required
        class="w-full mt-1 rounded-md border p-2"
        placeholder="Ej: https://forms.office.com/r/1234567890"
      />
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <Button variant="outline" type="button" @click="handleCancel"> Cancelar </Button>
      <Button type="submit"> Guardar página </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import Button from '@/components/ui/Button.vue'
import { useLandingPagesStore } from '@/stores/useLandingPagesStore'

const emit = defineEmits(['submit', 'cancel'])

const landingPagesStore = useLandingPagesStore()

const tab = ref('html')
const activeTabClass = 'px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-semibold'
const inactiveTabClass = 'px-4 py-2 text-gray-500 hover:text-blue-600'

const handleSubmit = () => {
  emit('submit', landingPagesStore.createForm)
}

const handleCancel = () => {
  emit('cancel')
}
</script>
