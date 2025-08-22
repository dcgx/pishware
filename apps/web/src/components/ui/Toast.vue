<template>
  <div v-if="props.modelValue" class="fixed top-4 right-4 z-50">
    <Alert :variant="props.variant" :title="props.title" :message="props.message" />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import Alert from './Alert.vue'

interface ToastProps {
  modelValue: boolean
  variant: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

const props = withDefaults(defineProps<ToastProps>(), {
  duration: 3000,
})

const emit = defineEmits(['update:modelValue'])

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      setTimeout(() => emit('update:modelValue', false), props.duration)
    }
  },
)
</script>
