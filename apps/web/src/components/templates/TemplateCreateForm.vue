<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Nombre</label
      >
      <input
        type="text"
        id="name"
        v-model="name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Ej: Notificación de prueba"
        required
      />
    </div>

    <div class="my-5">
      <Button @click="() => setOpenImportEmailDialog(true)" size="sm" variant="outline">
        Importar email
      </Button>
    </div>

    <div>
      <label for="subject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Subject</label
      >
      <input
        type="text"
        id="subject"
        v-model="subject"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Ej: Has recibido un mensaje"
        required
      />
    </div>

    <div class="mt-4">
      <div class="flex border-b">
        <button
          type="button"
          :class="tab === 'text' ? activeTabClass : inactiveTabClass"
          @click="tab = 'text'"
        >
          Text
        </button>
        <button
          type="button"
          :class="tab === 'html' ? activeTabClass : inactiveTabClass"
          @click="tab = 'html'"
        >
          HTML
        </button>
      </div>

      <div class="mt-2">
        <QuillEditor
          v-if="tab === 'text'"
          theme="snow"
          toolbar="minimal"
          class="w-full h-64"
          v-model:content="textContent"
        />
        <textarea
          v-if="tab === 'html'"
          class="w-full mt-1 rounded-md border p-2 dark:bg-gray-700 dark:text-white"
          placeholder="Escribe tu HTML aquí"
          rows="10"
          v-model="htmlContent"
        />
      </div>

      <!-- <div class="mt-8">
        <h3 class="text-lg font-semibold mb-2">📄 Previsualización</h3>
        <div class="border rounded p-4 bg-white">
          <div v-if="tab === 'text'" class="whitespace-pre-wrap text-gray-800">
            {{ textContent }}
          </div>
          <div v-else v-html="htmlContent" class="text-gray-800" />
        </div>
      </div> -->
    </div>

    <div>
      <input
        type="file"
        multiple
        @change="handleFiles"
        class="mt-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>

    <button type="submit" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
      Guardar Plantilla
    </button>

    <ImportEmailDialog
      :show="openImportEmailDialog"
      @imported="
        ({ htmlPreview }) => {
          htmlContent = htmlPreview
          tab = 'html'
        }
      "
      @close="() => setOpenImportEmailDialog(false)"
    />
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import Button from '@/components/ui/Button.vue'
import ImportEmailDialog from './ImportEmailDialog.vue'

const openImportEmailDialog = ref(false)

const emit = defineEmits(['submit'])

const tab = ref('text')
const name = ref('')
const subject = ref('')
const textContent = ref('')
const htmlContent = ref('')
const files = ref([])

const activeTabClass = 'px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-semibold dark:text-blue-400'
const inactiveTabClass = 'px-4 py-2 text-gray-500 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600'

const setOpenImportEmailDialog = (value) => {
  openImportEmailDialog.value = value
}

const handleFiles = (event) => {
  files.value = Array.from(event.target.files)
  console.log('Selected files:', files.value)
}

const handleSubmit = () => {
  const payload = {
    name: name.value,
    subject: subject.value,
    type: tab.value,
    body_content: tab.value === 'text' ? textContent.value : htmlContent.value,
  }
  emit('submit', payload)
}
</script>
