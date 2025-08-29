<!-- eslint-disable vue/multi-word-component-names -->
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
      <RolesTable
        :roles="roles"
        :loading="loading"
        @edit="openEditDialog"
        @delete="handleDeleteRole"
      />
    </div>

    <TransitionRoot appear :show="isOpenCreateRoleDialog" as="template">
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

                <CreateRoleForm
                  @submit="handleCreateRole"
                  @cancel="() => setOpenCreateRoleDialog(false)"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="isOpenEditRoleDialog" as="template">
      <Dialog as="div" @close="setOpenEditRoleDialog(false)" class="relative z-10">
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
                  Editar rol
                </DialogTitle>

                <EditRoleForm
                  v-if="selectedRole"
                  :role="selectedRole"
                  @submit="handleUpdateRole"
                  @cancel="() => setOpenEditRoleDialog(false)"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </admin-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// layout
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/page/PageHeader.vue'

import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import Button from '@/components/ui/Button.vue'
import RolesTable from '@/components/roles/RolesTable.vue'
import CreateRoleForm from '@/components/roles/CreateRoleForm.vue'
import EditRoleForm from '@/components/roles/EditRoleForm.vue'
import { useRoles } from '@/composables/useRoles'

const { fetchRoles, createRole, updateRole, deleteRole, roles, loading } = useRoles()

const isOpenCreateRoleDialog = ref(false)
const setOpenCreateRoleDialog = (value) => {
  isOpenCreateRoleDialog.value = value
}

const isOpenEditRoleDialog = ref(false)
const selectedRole = ref(null)
const setOpenEditRoleDialog = (value) => {
  isOpenEditRoleDialog.value = value
}

const openEditDialog = (role) => {
  selectedRole.value = role
  setOpenEditRoleDialog(true)
}

const handleCreateRole = async (roleData) => {
  if (roleData.name && roleData.description) {
    await createRole(roleData)
    await fetchRoles()
    setOpenCreateRoleDialog(false)
  }
}

const handleUpdateRole = async (roleData) => {
  if (roleData.id && roleData.name && roleData.description) {
    await updateRole(roleData.id, { name: roleData.name, description: roleData.description })
    await fetchRoles()
    setOpenEditRoleDialog(false)
  }
}

const handleDeleteRole = async (role) => {
  if (role && role.id && confirm('¿Eliminar rol?')) {
    await deleteRole(role.id)
    await fetchRoles()
  }
}

onMounted(async () => {
  await fetchRoles()
})
</script>
