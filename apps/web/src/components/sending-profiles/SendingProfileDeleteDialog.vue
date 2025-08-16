<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="handleClose()" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-[400px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 dark:text-white">
              <DialogTitle as="h3" class="text-lg my-3 font-medium leading-6">Eliminar perfil de envío</DialogTitle>
              <p class="mb-4">¿Seguro que desea eliminar este perfil de envío?</p>
              <div class="flex justify-end gap-2">
                <Button variant="secondary" @click="handleClose">Cancelar</Button>
                <Button variant="danger" @click="handleDelete">Eliminar</Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import Button from '@/components/ui/Button.vue';
import { useSendingProfiles } from '@/composables/useSendingProfiles';

const { deleteSendingProfile } = useSendingProfiles();

const emit = defineEmits(['close']);
const props = defineProps({ show: { type: Boolean, required: true }, profileId: { type: Number, required: true } });

const handleClose = () => emit('close');

const handleDelete = async () => {
  await deleteSendingProfile(props.profileId);
  handleClose();
};
</script>
