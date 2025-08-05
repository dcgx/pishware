<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label class="block text-sm font-medium text-gray-700">Nombre</label>
      <input
        v-model="name"
        required
        class="w-full mt-1 rounded-md border p-2"
        placeholder="Ej: Microsoft Teams"
      />
    </div>

    <div class="my-5">
      <Button @click="() => setOpenImportEmailDialog(true)" size="sm" variant="outline">
        Importar email
      </Button>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mt-4">Subject</label>
      <input
        v-model="subject"
        required
        class="w-full mt-1 rounded-md border p-2"
        placeholder="Ej: Invitación a Microsoft Teams"
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
          v-model:content="textContent"
        />
        <textarea
          v-if="tab === 'html'"
          class="w-full mt-1 rounded-md border p-2"
          placeholder="Escribe tu HTML aquí"
          v-model="htmlContent"
        />
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-2">📄 Previsualización</h3>
        <div class="border rounded p-4 bg-white">
          <div v-if="tab === 'text'" class="whitespace-pre-wrap text-gray-800">
            {{ textContent }}
          </div>
          <div v-else v-html="htmlContent" class="text-gray-800" />
        </div>
      </div>
    </div>

    <button type="submit" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
      Guardar Plantilla
    </button>

    <ImportEmailDialog
      :show="openImportEmailDialog"
      @close="() => setOpenImportEmailDialog(false)"
    />
  </form>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import ImportEmailDialog from './ImportEmailDialog.vue'

const openImportEmailDialog = ref(false)

const tab = ref('text')
const name = ref('')
const subject = ref('')
const textContent = ref('')
const htmlContent = ref('')

const activeTabClass = 'px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-semibold'
const inactiveTabClass = 'px-4 py-2 text-gray-500 hover:text-blue-600'

const setOpenImportEmailDialog = (value) => {
  openImportEmailDialog.value = value
}

const handleSubmit = () => {
  const payload = {
    name: name.value,
    subject: subject.value,
    contentType: tab.value,
    content: tab.value === 'text' ? textContent.value : htmlContent.value,
  }

  console.log('Form submitted:', payload)
  // Aquí podrías emitir un evento o hacer una petición a una API
}
</script>
