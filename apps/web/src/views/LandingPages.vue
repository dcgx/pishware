<template>
  <admin-layout>
    <div class="grid">
      <PageHeader>
        <template #title> Páginas de destino </template>
        <template #actions>
          <Button size="sm" variant="primary" @click="() => setOpenCreateLandingPageDialog(true)">
            Crear página de destino
          </Button>
        </template>
      </PageHeader>
      <div v-if="fetching" class="flex items-center justify-center h-64">
        <Spinner />
      </div>
      <LandingPagesTable v-else :landingPages="landingPages" />
    </div>

    <LandingPageCreateDialog
      :show="openCreateLandingPageDialog"
      @create="handleCreateTemplate"
      @close="() => setOpenCreateLandingPageDialog(false)"
    />
  </admin-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// layouts
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/page/PageHeader.vue'
// ui components
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
// components
import LandingPageCreateDialog from '@/components/landingPages/LandingPageCreateDialog.vue'
import LandingPagesTable from '@/components/landingPages/LandingPagesTable.vue'
// composables
import { useLandingPages } from '@/composables/useLandingPages'

const { landingPages, fetchLandingPages, fetching } = useLandingPages()

const openCreateLandingPageDialog = ref(false)

const setOpenCreateLandingPageDialog = (value) => {
  openCreateLandingPageDialog.value = value
}

onMounted(async () => {
  await fetchLandingPages()
})
</script>
