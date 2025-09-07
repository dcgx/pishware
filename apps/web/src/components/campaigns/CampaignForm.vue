<template>
  <form @submit.prevent="handleSubmit">
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
    <div class="mt-4">
      <label class="block text-sm mb-1">Plantilla de correo</label>
      <select v-model="form.templateId" class="w-full border rounded p-2">
        <option :value="null" disabled>Selecciona una plantilla</option>
        <option v-for="t in templates" :key="t.id" :value="t.id" :selected="t.id === form.templateId">
          {{ t.name }}
        </option>
      </select>
    </div>

    <div class="mt-4">
      <label class="block text-sm mt-3 mb-1">Página de destino</label>
      <select v-model="form.landingPageId" class="w-full border rounded p-2">
        <option :value="null" disabled>Selecciona una landing</option>
        <option v-for="lp in landingPages" :key="lp.id" :value="lp.id">
          {{ lp.name }}
        </option>
      </select>
    </div>

    <div class="mt-4">
      <label for="users" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Usuarios
      </label>
      <select
        id="users"
        multiple
        v-model="form.userIds"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
               dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option v-for="u in users" :key="u.id" :value="u.id">
          {{ u.first_name }} {{ u.last_name }}
        </option>
      </select>
    </div>

    <div class="mt-4">
      <label for="groups" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Grupos
      </label>
      <select
        id="groups"
        multiple
        v-model="form.groupIds"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
               dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>
    </div>

    <div class="mt-4 flex items-center">
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

// Inicializa el form local a partir de modelValue
const buildForm = (mv = {}) => ({
  id: mv.id ?? null,
  name: mv.name ?? '',
  description: mv.description ?? '',
  templateId: mv.templateId ?? null,
  landingPageId: mv.landingPageId ?? null,
  scheduledStartAt: mv.scheduledStartAt ?? '',
  status: mv.status ?? 'draft',
  userIds: mv.userIds ?? [],
  groupIds: mv.groupIds ?? [],
  schedule: mv.schedule ?? false,
})

const form = reactive(buildForm(props.modelValue))

// Sincroniza -> padre (v-model)
watch(form, (val) => emit('update:modelValue', { ...val }), { deep: true })

// Sincroniza <- padre (cuando cambias de campaña)
watch(
  () => props.modelValue,
  (mv) => {
    const next = buildForm(mv)
    Object.keys(next).forEach((k) => { form[k] = next[k] })
  },
  { deep: true, immediate: true }
)

const handleSubmit = () => emit('submit', { ...form })
const handleSendNow = () => emit('send', { ...form, sendNow: true })
const handleScheduleCampaign = () => emit('schedule', { ...form, status: 'scheduled' })

// Formateador de fecha
const formatter = { date: 'YYYY-MM-DD HH:mm', month: 'MMM' }
</script>
