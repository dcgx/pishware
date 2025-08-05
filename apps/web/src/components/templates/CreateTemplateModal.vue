<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="update(false)" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-[700px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg my-2 font-medium leading-6 text-gray-900">
                Crear plantilla
              </DialogTitle>

              <CreateTemplateForm @submit="handleCreateTemplate" @cancel="() => {}" />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import CreateTemplateForm from '@/components/templates/CreateTemplateForm.vue'

const emit = defineEmits(['create', 'cancel'])
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const update = (value) => {
  props.show = value
  emit('update:show', value)
}
</script>
