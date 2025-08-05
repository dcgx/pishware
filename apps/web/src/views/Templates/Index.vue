<template>
  <admin-layout>
    <div class="grid">
      <div>
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold mb-4">Plantillas</h2>
          <div class="flex gap-2">
            <Button size="sm" variant="primary" @click="() => setOpenCreateTemplateDialog(true)">
              Nueva plantilla
            </Button>
          </div>
        </div>
      </div>
    </div>

    <CreateTemplateDialog
      :show="openCreateTemplateDialog"
      @create="handleCreateTemplate"
      @close="() => setOpenCreateTemplateDialog(false)"
    />
  </admin-layout>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CreateTemplateDialog from '@/components/templates/CreateTemplateDialog.vue'

const openCreateTemplateDialog = ref(false)

const setOpenCreateTemplateDialog = (value) => {
  openCreateTemplateDialog.value = value
}
</script>
