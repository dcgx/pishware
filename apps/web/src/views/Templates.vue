<template>
  <admin-layout>
    <div class="grid">
      <PageHeader>
        <template #title> Plantillas </template>
        <template #actions>
          <Button size="sm" variant="primary" @click="() => setOpenCreateTemplateDialog(true)">
            Nueva plantilla
          </Button>
        </template>
      </PageHeader>
      <TemplatesTable :templates="emailTemplates" />
    </div>

    <TemplateCreateDialog
      :show="openCreateTemplateDialog"
      @create="handleCreateTemplate"
      @close="() => setOpenCreateTemplateDialog(false)"
    />
  </admin-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/page/PageHeader.vue'
// system-ui
import Button from '@/components/ui/Button.vue'
// components
import TemplatesTable from '@/components/templates/TemplatesTable.vue'
import TemplateCreateDialog from '@/components/templates/TemplateCreateDialog.vue'
// composables
import { useTemplates } from '@/composables/useTemplates'

const { fetchTemplates, emailTemplates } = useTemplates()

const openCreateTemplateDialog = ref(false)

const setOpenCreateTemplateDialog = (value) => {
  openCreateTemplateDialog.value = value
}

onMounted(async () => {
  await fetchTemplates()
})
</script>
