<template>
  <admin-layout>
    <div class="grid">
      <PageHeader>
        <template #title> Campañas </template>
        <template #actions>
          <Button size="sm" variant="primary" @click="() => setOpenCreateDialog(true)">
            Nueva campaña
          </Button>
        </template>
      </PageHeader>
      <div v-if="fetching" class="flex items-center justify-center h-64">
        <Spinner />
      </div>
      <CampaignsTable
        v-else
        :campaigns="campaigns"
        @edit="openEdit"
        @delete="openDelete"
      />
    </div>

    <CampaignCreateDialog
      :show="openCreateDialog"
      :templates="emailTemplates"
      :landing-pages="landingPages"
      @close="() => setOpenCreateDialog(false)"
    />
    <CampaignEditDialog
      v-if="selectedCampaign"
      :show="openEditDialog"
      :campaign="selectedCampaign"
      :templates="emailTemplates"
      :landing-pages="landingPages"
      @close="() => setOpenEditDialog(false)"
    />
    <CampaignDeleteDialog
      :show="openDeleteDialog"
      :campaign-id="selectedCampaignId"
      @close="() => setOpenDeleteDialog(false)"
    />
  </admin-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/page/PageHeader.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import CampaignsTable from '@/components/campaigns/CampaignsTable.vue'
import CampaignCreateDialog from '@/components/campaigns/CampaignCreateDialog.vue'
import CampaignEditDialog from '@/components/campaigns/CampaignEditDialog.vue'
import CampaignDeleteDialog from '@/components/campaigns/CampaignDeleteDialog.vue'
import { useCampaigns } from '@/composables/useCampaigns'
import { useTemplates } from '@/composables/useTemplates'
import { useLandingPages } from '@/composables/useLandingPages'

const { campaigns, fetchCampaigns, fetching } = useCampaigns()
const { emailTemplates, fetchTemplates } = useTemplates()
const { landingPages, fetchLandingPages } = useLandingPages()

const openCreateDialog = ref(false)
const openEditDialog = ref(false)
const openDeleteDialog = ref(false)

const selectedCampaign = ref(null)
const selectedCampaignId = ref(null)

const setOpenCreateDialog = (value) => {
  openCreateDialog.value = value
}
const setOpenEditDialog = (value) => {
  openEditDialog.value = value
  if (!value) selectedCampaign.value = null
}
const setOpenDeleteDialog = (value) => {
  openDeleteDialog.value = value
  if (!value) selectedCampaignId.value = null
}

const openEdit = (campaign) => {
  selectedCampaign.value = { ...campaign }
  setOpenEditDialog(true)
}

const openDelete = (id) => {
  selectedCampaignId.value = id
  setOpenDeleteDialog(true)
}

onMounted(async () => {
  await Promise.all([fetchCampaigns(), fetchTemplates(), fetchLandingPages()])
})
</script>
