<template>
  <admin-layout>
    <div class="mt-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold mb-4">Roles</h2>
        <div class="flex gap-2">
          <Button size="sm" variant="primary" @click="setOpenCreateRoleDialog(true)">
            Crear rol
          </Button>
        </div>
      </div>
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Descripción
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="role in roles" :key="role.id">
              <td class="px-6 py-4 text-sm text-gray-900">{{ role.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ role.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ role.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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

import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import Button from '@/components/ui/Button.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRoles } from '@/composables/useRoles'

const { fetchRoles, loading } = useRoles()

const newRole = ref({
  name: '',
  description: '',
})
const isOpenCreateUserDialog = ref(false)
const setOpenCreateRoleDialog = (value) => {
  isOpenCreateUserDialog.value = value
}
const roles = ref([
  { id: 1, name: 'Administrador', description: 'Acceso total al sistema' },
  { id: 2, name: 'Gerente', description: 'Acceso a gestión de usuarios y reportes' },
  { id: 3, name: 'Empleado', description: 'Acceso limitado a sus funciones' },
])

onMounted(async () => {
  await fetchRoles()
})
</script>
