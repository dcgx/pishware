<template>
  <admin-layout>
    <div>
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold mb-4 dark:text-gray-50">Usuarios y grupos</h2>
        <div class="flex gap-2">
          <Button size="sm" variant="primary" @click="setOpenCreateUserDialog(true)">
            Agregar usuario
          </Button>

          <Button size="sm" variant="outline" @click="setOpenCreateGroupDialog(true)">
            Crear grupo
          </Button>
        </div>
      </div>
      <div class="w-full my-5">
        <div class="w-full rounded-2xl bg-white p-2 dark:bg-white/[0.03]">
          <Disclosure v-slot="{ open }" v-if="usersWithoutGroups && usersWithoutGroups.length > 0">
            <DisclosureButton
              class="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
            >
              <span
              class="text-gray-900 dark:text-gray-100 uppercase font-semibold text-md"
              >Sin grupo ({{ usersWithoutGroups ? usersWithoutGroups.length : 0 }})</span>
              <ChevronDownIcon
                :class="open ? 'rotate-180 transform' : ''"
                class="h-5 w-5"
              />
            </DisclosureButton>
            <DisclosurePanel class="px-4 pb-2 pt-4 text-sm text-gray-500">
              <div
                class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]"
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
                        v-for="(user, index) in usersWithoutGroups"
                        :key="index"
                        class="border-t border-gray-100 dark:border-gray-800"
                      >
                        <td class="px-5 py-4 flex items-center gap-3">
                          <img :src="user.avatar" class="w-10 h-10 rounded-full" />
                          <span class="font-medium text-gray-800 dark:text-white">{{
                            user.first_name
                          }}</span>
                        </td>
                        <td class="px-5 py-4 text-gray-600 dark:text-gray-400">{{ user.email }}</td>
                        <td class="px-5 py-4 text-gray-600 dark:text-gray-400">{{ user.role }}</td>
                        <td class="px-5 py-4 text-gray-600 dark:text-gray-400">{{ user.group }}</td>
                        <td class="px-5 py-4">
                          <span
                            :class="[
                              'rounded-full px-2 py-0.5 text-sm font-medium',
                              {
                                'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                                  user.status === 'ACTIVE',
                                'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400':
                                  user.status === 'PENDING',
                                'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                                  user.status === 'INACTIVE',
                              },
                            ]"
                          >
                            {{ user.status }}
                          </span>
                        </td>
                        <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {{ user.ultimo_acceso }}
                        </td>
                        <td>
                          <Button
                            size="xs"
                            variant="danger"
                            @click="
                              selectedUserForDeletion = user.id;
                              setOpenDeleteUserDialog(true)
                            "
                            class="mt-2"
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </DisclosurePanel>
          </Disclosure>
          <Disclosure
            as="div"
            class="mt-2"
            v-slot="{ open }"
            v-for="group in groups"
            :key="group.id"
          >
            <DisclosureButton
              class="flex w-full justify-between rounded-lg px-4 py-4 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
            >
              <span
                class="text-gray-900 dark:text-gray-100 uppercase font-semibold text-md"
              >{{ group.name }}</span>
              <ChevronUpIcon
                :class="open ? 'rotate-180 transform' : ''"
                class="h-5 w-5 text-purple-500"
              />
            </DisclosureButton>
            <DisclosurePanel class="px-4 pb-2 pt-4 text-sm text-gray-500">
              <div
                class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
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
                        v-for="(profile, index) in group.group_profile"
                        :key="index"
                        class="border-t border-gray-100 dark:border-gray-800"
                      >
                        <td class="px-5 py-4 flex items-center gap-3">
                          <img :src="profile.avatar" class="w-10 h-10 rounded-full" />
                          <span class="font-medium text-gray-800 dark:text-white">{{
                            profile.profiles.first_name
                          }}</span>
                        </td>
                        <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {{ profile.profiles.email }}
                        </td>
                        <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {{ profile.profiles.role }}
                        </td>
                        <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {{ profile.profiles.group }}
                        </td>
                        <td class="px-5 py-4">
                          <span
                            :class="[
                              'rounded-full px-2 py-0.5 text-sm font-medium',
                              {
                                'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                                  profile.status === 'ACTIVE',
                                'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400':
                                  profile.status === 'PENDING',
                                'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                                  profile.status === 'INACTIVE',
                              },
                            ]"
                          >
                            {{ profile.status }}
                          </span>
                        </td>
                        <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {{ profile.ultimo_acceso }}
                        </td>
                        <td>
                          <Button
                            size="xs"
                            variant="danger"
                            @click="
                              selectedUserForDeletion = profile.profiles.id;
                              setOpenDeleteUserDialog(true)
                            "
                            class="mt-2"
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </DisclosurePanel>
          </Disclosure>
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
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-900"
              >
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  Crear nuevo usuario
                </DialogTitle>

                <form @submit.prevent="handleCreateUser" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nombre</label>
                    <input v-model="newUser.nombre" required class="w-full border p-2 rounded dark:bg-gray-800 dark:text-gray-100" />
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
                    <select v-model="newUser.roleId" required class="w-full border p-2 rounded">
                      <option value="">Seleccione un rol</option>
                      <option v-for="role in roles" :key="role.id" :value="role.name">
                        {{ role.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Grupo</label>
                    <select v-model="newUser.grupo" required class="w-full border p-2 rounded">
                      <option value="">Seleccione un grupo</option>
                      <option v-for="group in groups" :key="group.id" :value="group.name">
                        {{ group.name }}
                      </option>
                    </select>
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

    <TransitionRoot appear :show="isOpenCreateGroupDialog" as="template">
      <Dialog as="div" @close="setOpenCreateGroupDialog(false)" class="relative z-10">
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
                  Crear nuevo grupo
                </DialogTitle>

                <CreateGroupForm @submit="handleCreateGroup" @cancel="() => {}" />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="isOpenDeleteUserDialog" as="template">

      <Dialog as="div" @close="setOpenDeleteUserDialog(false)" class="relative z-10">
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
                  Eliminar usuario
                </DialogTitle>
                <p class="mt-2 text-sm text-gray-500">¿Estás seguro de que quieres eliminar este usuario?</p>
                <div class="mt-4 flex justify-end gap-3">
                  <Button size="sm" variant="outline" @click="setOpenDeleteUserDialog(false)">
                    Cancelar
                  </Button>
                  <Button size="sm" variant="danger" @click="deleteUser(selectedUserForDeletion)">
                    Eliminar
                  </Button>
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
import { onMounted, ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'
import Button from '@/components/ui/Button.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CreateGroupForm from '@/components/groups/CreateGroupForm.vue'

import { useUsers } from '@/composables/useUsers'
import { useGroups } from '@/composables/useGroups'
import { useRoles } from '@/composables/useRoles'

const { users, usersWithoutGroups, fetchUsers, createUser, loading, deleteUser } = useUsers()
const { groups, fetchGroups, createGroup } = useGroups()
const { fetchRoles, roles } = useRoles()

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchGroups(), fetchRoles()])
})

const newUser = ref({
  name: '',
  email: '',
  rol: '',
  grupo: '',
})

const selectedUserForDeletion = ref(null)

const isOpenCreateUserDialog = ref(false)
const isOpenCreateGroupDialog = ref(false)
const isOpenDeleteUserDialog = ref(false)

const setOpenCreateUserDialog = (value) => {
  isOpenCreateUserDialog.value = value
}

const setOpenCreateGroupDialog = (value) => {
  isOpenCreateGroupDialog.value = value
}

const setOpenDeleteUserDialog = (value) => {
  isOpenDeleteUserDialog.value = value
}

const handleCreateUser = async () => {
  if (!newUser.value.nombre || !newUser.value.correo) return alert('Completa los campos')

  const { success, password } = await createUser(newUser.value)

  if (success) {
    alert(`Usuario creado correctamente, password temporal: ${password}`)
    setOpenCreateUserDialog(false)
  } else {
    alert('Error al crear usuario')
  }

  // Reset form
  newUser.value = { nombre: '', correo: '', rol: '', grupo: '', estado: 'Activo', avatar: '' }
}

const handleCreateGroup = async (groupData) => {
  console.log('Creating group with data:', groupData)
  await createGroup(groupData)
}
</script>
