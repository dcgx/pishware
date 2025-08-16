<template>
  <admin-layout>
    <div class="grid">
      <PageHeader>
        <template #title> Perfiles de envío </template>
        <template #actions>
          <Button size="sm" variant="primary" @click="() => setOpenCreate(true)">Nuevo perfil</Button>
        </template>
      </PageHeader>
      <div v-if="fetching" class="flex items-center justify-center h-64">
        <Spinner />
      </div>
      <SendingProfilesTable v-else :profiles="sendingProfiles" @edit="openEdit" @delete="openDelete" />
    </div>

    <SendingProfileCreateDialog :show="openCreate" @close="() => setOpenCreate(false)" />
    <SendingProfileEditDialog v-if="selectedProfile" :show="openEditDialog" :profile-id="selectedProfile.id" @close="() => setOpenEdit(false)" />
    <SendingProfileDeleteDialog :show="openDeleteDialog" :profile-id="selectedProfileId" @close="() => setOpenDelete(false)" />
  </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import PageHeader from '@/components/page/PageHeader.vue';
import Button from '@/components/ui/Button.vue';
import Spinner from '@/components/ui/Spinner.vue';
import SendingProfilesTable from '@/components/sending-profiles/SendingProfilesTable.vue';
import SendingProfileCreateDialog from '@/components/sending-profiles/SendingProfileCreateDialog.vue';
import SendingProfileEditDialog from '@/components/sending-profiles/SendingProfileEditDialog.vue';
import SendingProfileDeleteDialog from '@/components/sending-profiles/SendingProfileDeleteDialog.vue';
import { useSendingProfiles } from '@/composables/useSendingProfiles';

const { sendingProfiles, fetchSendingProfiles, fetching, editForm } = useSendingProfiles();

const openCreate = ref(false);
const openEditDialog = ref(false);
const openDeleteDialog = ref(false);

const selectedProfile = ref(null);
const selectedProfileId = ref(null);

const setOpenCreate = (val: boolean) => {
  openCreate.value = val;
};
const setOpenEdit = (val: boolean) => {
  openEditDialog.value = val;
  if (!val) selectedProfile.value = null;
};
const setOpenDelete = (val: boolean) => {
  openDeleteDialog.value = val;
  if (!val) selectedProfileId.value = null;
};

const openEdit = (profile: any) => {
  selectedProfile.value = { ...profile };
  Object.assign(editForm.value, selectedProfile.value);
  setOpenEdit(true);
};

const openDelete = (id: number) => {
  selectedProfileId.value = id;
  setOpenDelete(true);
};

onMounted(async () => {
  await fetchSendingProfiles();
});
</script>
