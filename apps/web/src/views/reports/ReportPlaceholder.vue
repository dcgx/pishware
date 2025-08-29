<template>
  <admin-layout>
    <h2 class="text-xl font-semibold">{{ title }}</h2>
  </admin-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const route = useRoute()
const title = route.meta.title as string
</script>
