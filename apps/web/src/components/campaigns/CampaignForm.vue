<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
      <input
        id="name"
        type="text"
        v-model="form.name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
    </div>

    <div class="mt-4">
      <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
      <textarea
        id="description"
        v-model="form.description"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mt-4">
      <label for="template" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Plantilla</label>
      <select
        id="template"
        v-model="form.templateId"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option :value="null" disabled>Seleccione una plantilla</option>
        <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
    </div>

    <div class="mt-4">
      <label for="landing" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Landing Page</label>
      <select
        id="landing"
        v-model="form.landingPageId"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option :value="null" disabled>Seleccione una landing page</option>
        <option v-for="l in landingPages" :key="l.id" :value="l.id">{{ l.name }}</option>
      </select>
    </div>

    <div class="mt-4">
      <label for="scheduled" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Programar envío</label>
      <input
        id="scheduled"
        type="datetime-local"
        v-model="form.scheduledStartAt"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mt-4">
      <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
      <select
        id="status"
        v-model="form.status"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="draft">Borrador</option>
        <option value="scheduled">Programada</option>
        <option value="sent">Enviada</option>
        <option value="completed">Finalizada</option>
      </select>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <Button variant="outline" type="button" @click="emit('cancel')">Cancelar</Button>
      <Button type="submit">Guardar</Button>
    </div>
  </form>
</template>

<script setup>
import Button from '@/components/ui/Button.vue'
import { reactive, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  templates: { type: Array, default: () => [] },
  landingPages: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const form = reactive({
  id: props.modelValue.id || null,
  name: props.modelValue.name || '',
  description: props.modelValue.description || '',
  templateId: props.modelValue.templateId || null,
  landingPageId: props.modelValue.landingPageId || null,
  scheduledStartAt: props.modelValue.scheduledStartAt || '',
  status: props.modelValue.status || 'draft',
})

watch(form, (val) => emit('update:modelValue', val), { deep: true })

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
