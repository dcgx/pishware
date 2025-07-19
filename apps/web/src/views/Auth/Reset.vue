<template>
  <FullScreenLayout>
    <div class="p-6 mt-20 max-w-md mx-auto bg-white rounded-lg shadow h-full">
      <h2 class="mb-4 text-xl font-bold text-center">Recuperar contraseña</h2>
      <form @submit.prevent="handleReset">
        <div class="mb-4">
          <label>Email</label>
          <input v-model="email" type="email" required class="w-full border p-2 rounded" />
        </div>
        <button class="w-full bg-brand-500 text-white p-2 rounded">
          Enviar link de recuperación
        </button>
      </form>
      <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const email = ref('')
const success = ref(false)
const error = ref('')

const handleReset = async () => {
  success.value = false
  error.value = ''

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: 'http://localhost:3000/recover', 
  })

  if (resetError) {
    error.value = resetError.message
  } else {
    alert('Link de verificación enviado')
  }
}
</script>
