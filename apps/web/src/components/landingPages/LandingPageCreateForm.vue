<template>
  <form @submit.prevent="handleSubmit">
    <!-- Nombre -->
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

    <!-- Importar sitio desde URL (mini formulario) -->
    <div class="my-4 grid gap-2 md:grid-cols-[1fr_auto]">
      <input
        v-model="importUrl"
        type="url"
        placeholder="https://ejemplo.com/pagina"
        class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
      />
      <Button type="button" @click="importFromUrl" :disabled="isImporting || !importUrl">
        {{ isImporting ? 'Importando…' : 'Importar sitio' }}
      </Button>
      <p v-if="importError" class="text-sm text-red-600 dark:text-red-400 md:col-span-2">
        {{ importError }}
      </p>
    </div>

    <!-- Editor -->
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
        <Editor
          v-if="tab === 'html'"
          api-key="fx8ezyvqnb64cvko8dke5zjs8zlr2874nk8cr0e1ctwowlyw"
          v-model="landingPagesStore.createForm.htmlContent"
          :init="{
            height: 400,
            menubar: false,
            plugins: 'link image code table lists',
            toolbar:
              'undo redo | formatselect | bold italic backcolor | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | removeformat | code',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }"
        />
      </div>
    </div>

    <!-- Opciones -->
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

    <!-- Redirect -->
    <div class="mt-6">
      <label class="block text-sm font-medium text-gray-700">Redireccionar a:</label>
      <input
        v-model="landingPagesStore.createForm.redirectUrl"
        required
        class="w-full mt-1 rounded-md border p-2"
        placeholder="Ej: https://forms.office.com/r/1234567890"
      />
    </div>

    <!-- Actions -->
    <div class="mt-6 flex justify-end gap-3">
      <Button variant="outline" type="button" @click="handleCancel">Cancelar</Button>
      <Button type="submit">Guardar página</Button>
    </div>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useLandingPagesStore } from '@/stores/useLandingPagesStore'
import Button from '@/components/ui/Button.vue'
import Editor from '@tinymce/tinymce-vue'

const emit = defineEmits(['submit', 'cancel'])
const landingPagesStore = useLandingPagesStore()

const tab = ref('html')
const activeTabClass = 'px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-semibold'
const inactiveTabClass = 'px-4 py-2 text-gray-500 hover:text-blue-600'

const importUrl = ref('')
const isImporting = ref(false)
const importError = ref('')

const importFromUrl = async () => {
  importError.value = ''
  if (!importUrl.value) return
  try {
    isImporting.value = true
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const res = await fetch(`${apiUrl}/landing-pages/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: importUrl.value }),
    })
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const data = await res.json()
    landingPagesStore.createForm.htmlContent = data.html
    tab.value = 'html'
  } catch (e) {
    importError.value = 'No se pudo importar el sitio. Verifica la URL o inténtalo de nuevo.'
    console.error(e)
  } finally {
    isImporting.value = false
  }
}

const handleSubmit = () => emit('submit', landingPagesStore.createForm)
const handleCancel = () => emit('cancel')
</script>
