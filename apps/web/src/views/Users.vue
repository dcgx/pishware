<template>
  <admin-layout>
    <div>
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold mb-4">Usuarios y Grupos</h2>
        <Button size="sm" variant="primary" @click="setOpenCreateUserDialog(true)">
          Agregar usuario
        </Button>
      </div>
      <div
        class="overflow-hidden my-10 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left">Nombre</th>
                <th class="px-5 py-3 text-left">Correo</th>
                <th class="px-5 py-3 text-left">Rol</th>
                <th class="px-5 py-3 text-left">Grupo</th>
                <th class="px-5 py-3 text-left">Estado</th>
                <th class="px-5 py-3 text-left">Último acceso</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(user, index) in users"
                :key="index"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4 flex items-center gap-3">
                  <img :src="user.avatar" class="w-10 h-10 rounded-full" />
                  <span class="font-medium text-gray-800 dark:text-white">{{ user.nombre }}</span>
                </td>
                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">{{ user.correo }}</td>
                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">{{ user.rol }}</td>
                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">{{ user.grupo }}</td>
                <td class="px-5 py-4">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-sm font-medium',
                      {
                        'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                          user.estado === 'Activo',
                        'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400':
                          user.estado === 'Pendiente',
                        'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                          user.estado === 'Inactivo',
                      },
                    ]"
                  >
                    {{ user.estado }}
                  </span>
                </td>
                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">{{ user.ultimo_acceso }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <TransitionRoot appear :show="isOpenCreateUserDialog" as="template">
      <Dialog as="div" @close="setOpenCreateUserDialog(false)" class="relative z-10">
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
                  Payment successful
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Your payment has been successfully submitted. We’ve sent you an email with all
                    of the details of your order.
                  </p>
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </admin-layout>
</template>

<script setup>
import { ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import Button from '@/components/ui/Button.vue'
import AdminLayout from '../components/layout/AdminLayout.vue'

const isOpenCreateUserDialog = ref(false)

const setOpenCreateUserDialog = (value) => {
  console.log({ value })
  isOpenCreateUserDialog.value = value
}
const users = ref([
  {
    nombre: 'Diego Castillo',
    correo: 'diego.castillo@pishware.com',
    avatar: '/images/user/diego.jpg',
    rol: 'Administrador',
    grupo: 'Equipo de Seguridad',
    estado: 'Activo',
    ultimo_acceso: '2025-07-16 14:22',
  },
  {
    nombre: 'Andrea López',
    correo: 'andrea.lopez@pishware.com',
    avatar: '/images/user/andrea.jpg',
    rol: 'Gerente',
    grupo: 'Recursos Humanos',
    estado: 'Pendiente',
    ultimo_acceso: '2025-07-14 08:12',
  },
  {
    nombre: 'Carlos Pérez',
    correo: 'carlos.perez@pishware.com',
    avatar: '/images/user/carlos.jpg',
    rol: 'Empleado',
    grupo: 'Soporte TI',
    estado: 'Activo',
    ultimo_acceso: '2025-07-17 09:45',
  },
  {
    nombre: 'María González',
    correo: 'maria.gonzalez@pishware.com',
    avatar: '/images/user/maria.jpg',
    rol: 'Empleado',
    grupo: 'Marketing',
    estado: 'Inactivo',
    ultimo_acceso: '2025-06-30 11:00',
  },
])
</script>
