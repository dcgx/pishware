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
      <select
        v-model="selectedUsers"
        multiple
        class="w-full rounded-md border p-2 h-32"
      >
        <option
          v-for="user in availableUsers"
          :key="user.id"
          :value="user"
        >
          {{ user.name }} ({{ user.email }})
        </option>
      </select>
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
          <button
            type="button"
            @click="removeUser(index)"
            class="text-red-600 text-sm"
          >
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
      <button
        type="submit"
        class="px-4 py-2 rounded bg-brand-500 text-white"
      >
        Crear grupo
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const groupName = ref('')
const selectedUsers = ref([])
const addedUsers = ref([])

const availableUsers = ref([
  { id: 1, name: 'Carlos Pérez', email: 'carlos@demo.com' },
  { id: 2, name: 'Andrea López', email: 'andrea@demo.com' },
  { id: 3, name: 'Luis García', email: 'luis@demo.com' },
])

const handleSubmit = () => {
  if (!groupName.value || addedUsers.value.length === 0) {
    alert('Agrega nombre y al menos un usuario')
    return
  }
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
