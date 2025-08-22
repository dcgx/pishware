<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="handleClose()" class="relative z-10">
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
              class="w-[600px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 dark:text-white"
            >
              <DialogTitle as="h3" class="text-lg my-3 font-medium leading-6"
                >Editar perfil de envío</DialogTitle
              >
              <SendingProfileForm
                v-model="editForm"
                submit-text="Actualizar"
                @submit="handleUpdate"
                @cancel="handleClose"
              />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import SendingProfileForm from './SendingProfileForm.vue'
import { useSendingProfiles } from '@/composables/useSendingProfiles'

const { editForm, updateSendingProfile } = useSendingProfiles()

const emit = defineEmits(['close'])
const props = defineProps({
  show: { type: Boolean, required: true },
  profileId: { type: Number, required: true },
})

const handleClose = () => emit('close')

const handleUpdate = async () => {
  await updateSendingProfile(props.profileId, editForm.value)
  handleClose()
}
</script>
