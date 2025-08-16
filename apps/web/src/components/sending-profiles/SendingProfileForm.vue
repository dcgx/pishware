<template>
  <form @submit.prevent="emit('submit')" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <input v-model="form.name" placeholder="Nombre" class="input" />
      <input v-model="form.interfaceType" placeholder="Interface" class="input" />
      <input v-model="form.smtpFrom" placeholder="SMTP From" class="input col-span-2" />
      <input v-model="form.host" placeholder="Host" class="input col-span-2" />
      <input v-model="form.username" placeholder="Username" class="input" />
      <input type="password" v-model="form.password" placeholder="Password" class="input" />
      <label class="flex items-center space-x-2 col-span-2">
        <input type="checkbox" v-model="form.ignoreCertErrors" />
        <span>Ignore Certificate Errors</span>
      </label>
    </div>
    <div>
      <div v-for="(header, index) in form.emailHeaders" :key="index" class="flex space-x-2 mb-2">
        <input v-model="header.key" placeholder="Header" class="input flex-1" />
        <input v-model="header.value" placeholder="Value" class="input flex-1" />
        <button type="button" @click="removeHeader(index)">x</button>
      </div>
      <button type="button" @click="addHeader">Add Header</button>
    </div>
    <div class="flex justify-end gap-2">
      <Button variant="secondary" type="button" @click="emit('cancel')">Cancelar</Button>
      <Button variant="primary" type="submit">{{ submitText }}</Button>
    </div>
  </form>
</template>

<script setup>
import Button from '@/components/ui/Button.vue';
const props = defineProps({
  form: { type: Object, required: true },
  submitText: { type: String, default: 'Guardar' },
});
const emit = defineEmits(['submit', 'cancel']);

const addHeader = () => {
  props.form.emailHeaders.push({ key: '', value: '' });
};
const removeHeader = (index: number) => {
  props.form.emailHeaders.splice(index, 1);
};
</script>

<style scoped>
.input {
  @apply border rounded px-2 py-1 w-full;
}
</style>
