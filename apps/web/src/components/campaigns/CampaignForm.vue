<template>
  <form @submit.prevent="handleSubmit">
    <!-- Nombre -->
    <div>
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Nombre
      </label>
      <input
        id="name"
        type="text"
        v-model="form.name"
        required
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
               dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <!-- Descripción -->
    <div class="mt-4">
      <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Descripción
      </label>
      <textarea
        id="description"
        v-model="form.description"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
               dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <!-- Plantilla -->
    <div class="mt-4">
      <label class="block text-sm mb-1">Plantilla de correo</label>
      <select v-model="form.templateId" class="w-full border rounded p-2">
        <option :value="null" disabled>Selecciona una plantilla</option>
        <option v-for="t in templates" :key="t.id" :value="t.id">
          {{ t.name }}
        </option>
      </select>
    </div>

    <!-- Landing Page -->
    <div class="mt-4">
      <label class="block text-sm mt-3 mb-1">Página de destino</label>
      <select v-model="form.landingPageId" class="w-full border rounded p-2">
        <option :value="null" disabled>Selecciona una landing</option>
        <option v-for="lp in landingPages" :key="lp.id" :value="lp.id">
          {{ lp.name }}
        </option>
      </select>
    </div>

    <!-- Radio buttons para targeting -->
    <div class="mt-6 flex gap-6">
      <label class="flex items-center gap-2">
        <input
          type="radio"
          value="user"
          v-model="form.targetMode"
          class="text-blue-600 focus:ring-blue-500 border-gray-300"
        />
        <span>Por usuario</span>
      </label>
      <label class="flex items-center gap-2">
        <input
          type="radio"
          value="group"
          v-model="form.targetMode"
          class="text-blue-600 focus:ring-blue-500 border-gray-300"
        />
        <span>Por grupo</span>
      </label>
    </div>

    <!-- Select de usuarios -->
    <div class="mt-4" v-if="form.targetMode === 'user'">
      <label for="user" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Usuario
      </label>
      <select
        id="user"
        v-model="form.userId"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
               dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option :value="null" disabled>Selecciona un usuario</option>
        <option v-for="u in users" :key="u.id" :value="u.id">
          {{ u.first_name }} {{ u.last_name }}
        </option>
      </select>
    </div>

    <!-- Select de grupos -->
    <div class="mt-4" v-if="form.targetMode === 'group'">
      <label for="group" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Grupo
      </label>
      <select
        id="group"
        v-model="form.groupId"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
               dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option :value="null" disabled>Selecciona un grupo</option>
        <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>
    </div>

    <!-- Programar -->
    <div class="mt-6 flex items-center">
      <input
        id="schedule"
        type="checkbox"
        v-model="form.schedule"
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
               focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
      />
      <label for="schedule" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Programar campaña
      </label>
    </div>

    <div v-if="form.schedule" class="mt-4">
      <label for="scheduled" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Fecha de programación
      </label>
      <VueTailwindDatepicker
        id="scheduled"
        v-model="form.scheduledStartAt"
        as-single
        :use-range="false"
        :formatter="formatter"
        input-classes="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <!-- Estado -->
    <div class="mt-4">
      <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Estado
      </label>
      <select
        id="status"
        v-model="form.status"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
               dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="draft">Borrador</option>
        <option value="scheduled">Programada</option>
        <option value="sent">Enviada</option>
        <option value="completed">Finalizada</option>
      </select>
    </div>

    <!-- Botones -->
    <div class="mt-6 flex justify-end gap-3">
      <Button variant="outline" type="button" @click="emit('cancel')">Cancelar</Button>
      <Button type="button" @click="handleSendNow">Enviar campaña</Button>
      <Button type="button" :disabled="!form.schedule" @click="handleScheduleCampaign">
        Programar campaña
      </Button>
      <Button type="submit">Guardar</Button>
    </div>
  </form>
</template>

<script setup>
import Button from '@/components/ui/Button.vue'
import { reactive, watch, defineProps, defineEmits } from 'vue'
import VueTailwindDatepicker from 'vue-tailwind-datepicker'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  templates: { type: Array, default: () => [] },
  landingPages: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
  groups: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'send', 'schedule'])

const buildForm = (mv = {}) => {
  const userId = mv.userId ?? (Array.isArray(mv.userIds) && mv.userIds.length ? mv.userIds[0] : null)
  const groupId = mv.groupId ?? (Array.isArray(mv.groupIds) && mv.groupIds.length ? mv.groupIds[0] : null)
  return {
    id: mv.id ?? null,
    name: mv.name ?? '',
    description: mv.description ?? '',
    templateId: mv.templateId ?? null,
    landingPageId: mv.landingPageId ?? null,
    scheduledStartAt: mv.scheduledStartAt ?? '',
    status: mv.status ?? 'draft',
    userId,
    groupId,
    targetMode: userId ? 'user' : groupId ? 'group' : null,
    schedule: mv.schedule ?? false,
  }
}

const form = reactive(buildForm(props.modelValue))

// Sincroniza -> padre
watch(form, (val) => {
  emit('update:modelValue', {
    ...val,
    userIds: val.targetMode === 'user' && val.userId ? [val.userId] : [],
    groupIds: val.targetMode === 'group' && val.groupId ? [val.groupId] : [],
  })
}, { deep: true })

// Sincroniza <- padre
watch(() => props.modelValue, (mv) => {
  const next = buildForm(mv)
  Object.keys(next).forEach((k) => { form[k] = next[k] })
}, { deep: true, immediate: true })

// Payload helpers
const payloadBase = () => ({
  ...form,
  userIds: form.targetMode === 'user' && form.userId ? [form.userId] : [],
  groupIds: form.targetMode === 'group' && form.groupId ? [form.groupId] : [],
})
const handleSubmit = () => emit('submit', payloadBase())
const handleSendNow = () => emit('send', { ...payloadBase(), sendNow: true })
const handleScheduleCampaign = () => emit('schedule', { ...payloadBase(), status: 'scheduled' })

const formatter = { date: 'YYYY-MM-DD HH:mm', month: 'MMM' }
</script>
