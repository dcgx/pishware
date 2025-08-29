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
      <TemplatesTable
        :templates="emailTemplates"
        @view="handleViewTemplate"
        @edit="openEditTemplate"
        @delete="openDeleteTemplate"
      />
    </div>

    <TemplateCreateDialog
      :show="openCreateTemplateDialog"
      @create="handleCreateTemplate"
      @close="() => setOpenCreateTemplateDialog(false)"
    />

    <TemplateViewDialog
      :show="openViewTemplateDialog"
      :template="selectedTemplate"
      @close="() => setOpenViewTemplateDialog(false)"
    />
    <TemplateEditDialog
      v-if="selectedTemplate"
      :show="openEditTemplateDialog"
      :template="selectedTemplate"
      @close="() => setOpenEditTemplateDialog(false)"
    />
    <TemplateDeleteDialog
      :show="openDeleteTemplateDialog"
      :template-id="selectedTemplateId"
      @close="() => setOpenDeleteTemplateDialog(false)"
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
import TemplateViewDialog from '@/components/templates/TemplateViewDialog.vue'
import TemplateEditDialog from '@/components/templates/TemplateEditDialog.vue'
import TemplateDeleteDialog from '@/components/templates/TemplateDeleteDialog.vue'
// composables
import { useTemplates } from '@/composables/useTemplates'

const { fetchTemplates, emailTemplates, getTemplate } = useTemplates()

const openCreateTemplateDialog = ref(false)
const openViewTemplateDialog = ref(false)
const openEditTemplateDialog = ref(false)
const openDeleteTemplateDialog = ref(false)
const selectedTemplate = ref(null)
const selectedTemplateId = ref(null)

const setOpenCreateTemplateDialog = (value) => {
  openCreateTemplateDialog.value = value
}

const setOpenViewTemplateDialog = (value) => {
  openViewTemplateDialog.value = value
}

const setOpenEditTemplateDialog = (value) => {
  openEditTemplateDialog.value = value
  if (!value) selectedTemplate.value = null
}

const setOpenDeleteTemplateDialog = (value) => {
  openDeleteTemplateDialog.value = value
  if (!value) selectedTemplateId.value = null
}

const handleViewTemplate = async (id) => {
  selectedTemplate.value = await getTemplate(id)
  setOpenViewTemplateDialog(true)
}

const handleCreateTemplate = () => {}

const openEditTemplate = (template) => {
  selectedTemplate.value = { ...template }
  setOpenEditTemplateDialog(true)
}

const openDeleteTemplate = (id) => {
  selectedTemplateId.value = id
  setOpenDeleteTemplateDialog(true)
}

onMounted(async () => {
  await fetchTemplates()
})
</script>
