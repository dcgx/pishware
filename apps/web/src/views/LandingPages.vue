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
            <tr>
              <td class="px-6 py-4 text-sm text-gray-900">1</td>
              <td class="px-6 py-4 text-sm text-gray-900">Google.com</td>
              <td class="px-6 py-4 text-sm text-gray-500">Descripción de la plantilla de prueba</td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <Button size="sm" variant="outline"> Editar </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

const openCreateLandingPageDialog = ref(false)

const setOpenCreateLandingPageDialog = (value) => {
  openCreateLandingPageDialog.value = value
}
</script>
