<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Nombre del grupo</label>
      <input
        v-model="groupName"
        required
        class="w-full mt-1 rounded-md border p-2"
        placeholder="Ej: Equipo Marketing"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Seleccionar usuarios</label>
      <!-- <select v-model="selectedUsers" multiple class="w-full rounded-md border p-2 h-32">
        <option v-for="user in availableUsers" :key="user.id" :value="user">
          {{ user.name }} ({{ user.email }})
        </option>
      </select> -->
      <Listbox v-model="selectedUsers" multiple>
        <div class="relative mt-1">
          <ListboxButton
            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
            <!-- <span class="block truncate">{{ selectedPerson.name }}</span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span> -->
            ??
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="user in availableUsers"
                :key="user.name"
                :value="user"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-10 pr-4',
                  ]"
                >
                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                    user.email
                  }}</span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Usuarios agregados</label>
      <ul class="space-y-2">
        <li
          v-for="(user, index) in addedUsers"
          :key="index"
          class="flex items-center justify-between bg-gray-100 p-2 rounded"
        >
          <span>{{ user.name }} - {{ user.email }}</span>
          <button type="button" @click="removeUser(index)" class="text-red-600 text-sm">
            Quitar
          </button>
        </li>
      </ul>
    </div>

    <div class="flex gap-3">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 rounded bg-gray-200 text-gray-700"
      >
        Cancelar
      </button>
      <button type="submit" class="px-4 py-2 rounded bg-brand-500 text-white">Crear grupo</button>
    </div>
  </form>
</template>

<script setup>
import { useUsers } from '@/composables/useUsers'
import { computed, ref } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

const emit = defineEmits(['submit', 'cancel'])

const { users } = useUsers()

const groupName = ref('')
const selectedUsers = ref([])
const addedUsers = ref([])

const availableUsers = computed(() => {
  return users.value.filter((user) => !addedUsers.value.includes(user))
})

const handleSubmit = () => {
  if (!groupName.value || addedUsers.value.length === 0) {
    alert('Agrega nombre y al menos un usuario')
    return
  }
  console.log('Grupo creado:', groupName.value, addedUsers.value)
  emit('submit', { groupName: groupName.value, users: addedUsers.value })
  resetForm()
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const removeUser = (index) => {
  addedUsers.value.splice(index, 1)
}

const resetForm = () => {
  groupName.value = ''
  selectedUsers.value = []
  addedUsers.value = []
}
</script>
