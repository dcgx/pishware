<template>
  <form @submit.prevent="handleSubmit">
    <div>Form</div>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import Button from '@/components/ui/Button.vue'

const emit = defineEmits(['submit'])

const handleSubmit = () => {
  emit('submit', payload)
}
</script>
