<template>
  <admin-layout>
    <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
    <iframe
      v-if="pdfUrl"
      :src="pdfUrl"
      class="w-full h-[80vh]"
    />
    <p v-else class="text-center text-gray-500">Generando reporte...</p>
  </admin-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onBeforeUnmount } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const route = useRoute()
const title = route.meta.title as string
const pdfUrl = ref<string | null>(null)

if (route.query.pdf) {
  pdfUrl.value = route.query.pdf as string
}

onBeforeUnmount(() => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
})
</script>
