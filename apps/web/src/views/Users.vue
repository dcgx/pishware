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
                  Crear nuevo usuario
                </DialogTitle>

                <form @submit.prevent="handleCreateUser" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Nombre</label>
                    <input v-model="newUser.nombre" required class="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Correo</label>
                    <input
                      v-model="newUser.correo"
                      type="email"
                      required
                      class="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Rol</label>
                    <select v-model="newUser.rol" required class="w-full border p-2 rounded">
                      <option value="">Seleccione un rol</option>
                      <option>Administrador</option>
                      <option>Gerente</option>
                      <option>Empleado</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Grupo</label>
                    <input v-model="newUser.grupo" class="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Estado</label>
                    <select v-model="newUser.estado" required class="w-full border p-2 rounded">
                      <option>Activo</option>
                      <option>Pendiente</option>
                      <option>Inactivo</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Avatar (URL)</label>
                    <input
                      v-model="newUser.avatar"
                      class="w-full border p-2 rounded"
                      placeholder="https://..."
                    />
                  </div>
                  <div class="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      @click="setOpenCreateUserDialog(false)"
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
import { onMounted, ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import Button from '@/components/ui/Button.vue'
import AdminLayout from '../components/layout/AdminLayout.vue'

import { useUsers } from '@/composables/useUsers'

const { users, fetchUsers, loading } = useUsers()

onMounted(() => {
  fetchUsers()
})

const newUser = ref({
  nombre: '',
  correo: '',
  rol: '',
  grupo: '',
  estado: 'Activo',
  avatar: '/images/user/default.jpg',
})

const isOpenCreateUserDialog = ref(false)

const setOpenCreateUserDialog = (value) => {
  console.log({ value })
  isOpenCreateUserDialog.value = value
}

const handleCreateUser = () => {
  if (!newUser.value.nombre || !newUser.value.correo || !newUser.value.rol) {
    alert('Completa los campos obligatorios')
    return
  }
  users.value.push({
    ...newUser.value,
    ultimo_acceso: 'Sin acceso',
  })
  setOpenCreateUserDialog(false)

  newUser.value = {
    nombre: '',
    correo: '',
    rol: '',
    grupo: '',
    estado: 'Activo',
    avatar: '/images/user/default.jpg',
  }
}

</script>
