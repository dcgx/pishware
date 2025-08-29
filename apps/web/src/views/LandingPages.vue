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
      <LandingPagesTable
        v-else
        :landingPages="landingPages"
        @view="handleViewLandingPage"
        @edit="handleEditLandingPage"
        @delete="handleDeleteLandingPage"
      />
    </div>

    <LandingPageCreateDialog
      :show="openCreateLandingPageDialog"
      @create="handleCreateTemplate"
      @close="() => setOpenCreateLandingPageDialog(false)"
    />

    <LandingPageEditDialog
      v-if="selectedLandingPage"
      :show="openEditLandingPageDialog"
      :landing-page="selectedLandingPage"
      @close="() => setOpenEditLandingPageDialog(false)"
    />

    <LandingPageViewDialog
      :show="openViewLandingPageDialog"
      :landing-page="selectedLandingPage"
      @close="() => setOpenViewLandingPageDialog(false)"
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
import LandingPageEditDialog from '@/components/landingPages/LandingPageEditDialog.vue'
import LandingPageViewDialog from '@/components/landingPages/LandingPageViewDialog.vue'
// composables
import { useLandingPages } from '@/composables/useLandingPages'
import { useLandingPagesStore } from '@/stores/useLandingPagesStore'

const { landingPages, fetchLandingPages, fetching, getLandingPage, deleteLandingPage } = useLandingPages()
const landingPagesStore = useLandingPagesStore()

const openCreateLandingPageDialog = ref(false)
const openEditLandingPageDialog = ref(false)
const openViewLandingPageDialog = ref(false)
const selectedLandingPage = ref(null)

const setOpenCreateLandingPageDialog = (value) => {
  openCreateLandingPageDialog.value = value
}

const setOpenEditLandingPageDialog = (value) => {
  openEditLandingPageDialog.value = value
}

const setOpenViewLandingPageDialog = (value) => {
  openViewLandingPageDialog.value = value
}

const handleViewLandingPage = async (id) => {
  selectedLandingPage.value = await getLandingPage(id)
  setOpenViewLandingPageDialog(true)
}

const handleEditLandingPage = (landingPage) => {
  landingPagesStore.editForm = {
    id: landingPage.id,
    name: landingPage.name,
    htmlContent: landingPage.html_content,
    redirectUrl: landingPage.redirect_url,
    captureSubmittedData: landingPage.capture_submitted_data,
    capturePassword: landingPage.capture_password,
  }
  selectedLandingPage.value = landingPage
  setOpenEditLandingPageDialog(true)
}

const handleDeleteLandingPage = async (id) => {
  if (confirm('¿Eliminar esta página de destino?')) {
    await deleteLandingPage(id)
  }
}

const handleCreateTemplate = () => {}

onMounted(async () => {
  await fetchLandingPages()
})
</script>
