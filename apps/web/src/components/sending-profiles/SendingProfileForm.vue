<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Nombre</label
      >
      <input
        id="name"
        v-model="form.name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
    </div>

    <div class="mt-4">
      <label
        for="interfaceType"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Tipo de interfaz</label
      >
      <input
        id="interfaceType"
        v-model="form.interfaceType"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mt-4">
      <label for="smtpFrom" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >SMTP From</label
      >
      <input
        id="smtpFrom"
        v-model="form.smtpFrom"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mt-4">
      <label for="host" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Host</label
      >
      <input
        id="host"
        v-model="form.host"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mt-4">
      <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Usuario</label
      >
      <input
        id="username"
        v-model="form.username"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mt-4">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Contraseña</label
      >
      <input
        id="password"
        type="password"
        v-model="form.password"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mt-4 flex items-center">
      <input
        id="ignoreCertErrors"
        type="checkbox"
        v-model="form.ignoreCertErrors"
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label for="ignoreCertErrors" class="ml-2 text-sm font-medium text-gray-900 dark:text-white"
        >Ignorar errores de certificado</label
      >
    </div>

    <div class="mt-4">
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Email Headers</label
      >
      <div
        v-for="(header, index) in form.emailHeaders"
        :key="index"
        class="flex items-center gap-2 mb-2"
      >
        <input
          v-model="header.key"
          placeholder="Header"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <input
          v-model="header.value"
          placeholder="Value"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <Button variant="outline" size="sm" type="button" @click="removeHeader(index)"
          >Eliminar</Button
        >
      </div>
      <Button variant="outline" size="sm" type="button" @click="addHeader">Agregar header</Button>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <Button variant="outline" type="button" @click="emit('cancel')">Cancelar</Button>
      <Button type="submit">{{ submitText }}</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import { reactive, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  submitText: { type: String, default: 'Guardar' },
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const form = reactive({
  id: props.modelValue.id || null,
  name: props.modelValue.name || '',
  interfaceType: props.modelValue.interfaceType || '',
  smtpFrom: props.modelValue.smtpFrom || '',
  host: props.modelValue.host || '',
  username: props.modelValue.username || '',
  password: props.modelValue.password || '',
  ignoreCertErrors: props.modelValue.ignoreCertErrors || false,
  emailHeaders: props.modelValue.emailHeaders ? [...props.modelValue.emailHeaders] : [],
})

watch(form, (val) => emit('update:modelValue', val), { deep: true })

const addHeader = () => {
  form.emailHeaders.push({ key: '', value: '' })
}

const removeHeader = (index: number) => {
  form.emailHeaders.splice(index, 1)
}

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
