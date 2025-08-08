<template>
  <admin-layout>
    <div class="grid">
      <div>
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold mb-4">Landing pages</h2>
          <div class="flex gap-2">
            <Button size="sm" variant="primary" @click="() => setOpenCreateLandingPageDialog(true)">
              Crear página de destino
            </Button>
          </div>
        </div>
      </div>
ƒ      <LandingPagesTable />
    </div>

    <CreateLandingPageDialog
      :show="openCreateLandingPageDialog"
      @create="handleCreateTemplate"
      @close="() => setOpenCreateLandingPageDialog(false)"
    />
  </admin-layout>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CreateLandingPageDialog from '@/components/landingPages/CreateLandingPageDialog.vue'
import LandingPagesTable from '@/components/landingPages/LandingPagesTable.vue'

const openCreateLandingPageDialog = ref(false)

const setOpenCreateLandingPageDialog = (value) => {
  openCreateLandingPageDialog.value = value
}
</script>
