<template>
  <admin-layout>
    <iframe v-if="pdf" :src="pdf" class="w-full h-screen" />
    <p v-else>No se pudo cargar el reporte</p>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pdf = route.query.pdf as string | undefined
</script>
