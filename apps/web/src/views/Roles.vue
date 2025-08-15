<template>
  <admin-layout>
    <div class="grid">
      <PageHeader>
        <template #title>Roles</template>
        <template #actions>
          <Button size="sm" variant="primary" @click="setOpenCreateRoleDialog(true)">
            Crear rol
          </Button>
        </template>
      </PageHeader>
      <RolesTable :roles="roles" :loading="loading" />
    </div>

    <TransitionRoot appear :show="isOpenCreateUserDialog" as="template">
      <Dialog as="div" @close="setOpenCreateRoleDialog(false)" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Crear nuevo rol
                </DialogTitle>

                <form @submit.prevent="handleCreateRole" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Nombre</label>
                    <input v-model="newRole.name" required class="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      v-model="newRole.description"
                      rows="3"
                      required
                      class="w-full border p-2 rounded"
                    ></textarea>
                  </div>
                  <div class="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      @click="setOpenCreateRoleDialog(false)"
                      class="px-4 py-2 rounded bg-gray-100 text-gray-700"
                    >
                      Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 rounded bg-brand-500 text-white">
                      Crear
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// layout
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/page/PageHeader.vue'

import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import Button from '@/components/ui/Button.vue'
import RolesTable from '@/components/roles/RolesTable.vue'
import { useRoles } from '@/composables/useRoles'

const { fetchRoles, createRole, roles, loading } = useRoles()

const newRole = ref({
  name: '',
  description: '',
})
const isOpenCreateUserDialog = ref(false)
const setOpenCreateRoleDialog = (value) => {
  isOpenCreateUserDialog.value = value
}

const handleCreateRole = async () => {
  if (newRole.value.name && newRole.value.description) {
    await createRole(newRole.value)
    await fetchRoles()
    newRole.value = { name: '', description: '' }
    setOpenCreateRoleDialog(false)
  }
}

onMounted(async () => {
  await fetchRoles()
})
</script>
