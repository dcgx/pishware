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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 dark:text-white"
            >
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                Confirmar eliminación
              </DialogTitle>
              <p class="mt-2">¿Seguro que quieres eliminar esta campaña?</p>
              <div class="mt-6 flex justify-end gap-3">
                <Button variant="outline" type="button" @click="handleClose">Cancelar</Button>
                <Button variant="danger" type="button" @click="handleDelete">Eliminar</Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import Button from '@/components/ui/Button.vue'
import { useCampaigns } from '@/composables/useCampaigns'

const props = defineProps({
  show: { type: Boolean, required: true },
  campaignId: { type: Number, required: true },
})

const emit = defineEmits(['close'])

const { deleteCampaign } = useCampaigns()

const handleClose = () => {
  emit('close')
}

const handleDelete = async () => {
  await deleteCampaign(props.campaignId)
  handleClose()
}
</script>
