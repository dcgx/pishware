<template>
  <admin-layout>
    <div class="max-w-5xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">New Template</h2>
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Name -->
        <div>
          <label class="block font-medium mb-1">Name:</label>
          <input
            v-model="templateName"
            type="text"
            placeholder="Template name"
            class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <!-- Import Email -->
        <button
          type="button"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          @click="showImportModal = true"
        >
          📩 Import Email
        </button>

        <!-- Subject -->
        <div>
          <label class="block font-medium mb-1">Subject:</label>
          <input
            v-model="subject"
            type="text"
            placeholder="Email Subject"
            class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <!-- Tabs -->
        <div>
          <div class="flex border-b">
            <button
              type="button"
              @click="activeTab = 'text'"
              class="px-4 py-2"
              :class="activeTab === 'text' ? 'border-b-2 border-indigo-500 font-semibold' : ''"
            >
              Text
            </button>
            <button
              type="button"
              @click="activeTab = 'html'"
              class="px-4 py-2"
              :class="activeTab === 'html' ? 'border-b-2 border-indigo-500 font-semibold' : ''"
            >
              HTML
            </button>
          </div>

          <!-- Text Mode -->
          <div v-if="activeTab === 'text'" class="mt-2">
            <textarea
              v-model="plainText"
              rows="6"
              class="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Plain text..."
            ></textarea>
          </div>

          <!-- HTML Mode -->
          <div v-if="activeTab === 'html'" class="mt-2">
            <ckeditor :editor="editor" v-model="htmlContent" :config="editorConfig" />
          </div>
        </div>

        <!-- Extras -->
        <div class="flex items-center space-x-4">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="addTracking" class="mr-2" />
            Add Tracking Image
          </label>

          <button type="button" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            ➕ Add Files
          </button>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Save Template
        </button>
      </form>

      <!-- Modal -->
      <ImportEmailModal
        v-if="showImportModal"
        @close="showImportModal = false"
        @import="handleImport"
      />
    </div>
  </admin-layout>
</template>

<script setup>
import { ref } from 'vue'
import { Ckeditor, useCKEditorCloud } from '@ckeditor/ckeditor5-vue';
import CustomEditor from '@/ckeditor/CustomEditor'
import ImportEmailModal from '@/components/email/ImportEmailModal.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const templateName = ref('')
const subject = ref('')
const plainText = ref('')
const htmlContent = ref('')
const addTracking = ref(false)
const activeTab = ref('text')
const showImportModal = ref(false)

const editor = CustomEditor
const editorConfig = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'sourceEditing',
  ],
}

const handleImport = (rawEmail) => {
  htmlContent.value = rawEmail
  activeTab.value = 'html'
  showImportModal.value = false
}

const submitForm = () => {
  console.log({
    name: templateName.value,
    subject: subject.value,
    html: htmlContent.value,
    plainText: plainText.value,
    addTracking: addTracking.value,
  })
}
</script>
