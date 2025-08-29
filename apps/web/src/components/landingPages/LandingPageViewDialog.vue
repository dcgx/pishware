<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-10">
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
              class="w-[700px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 dark:text-white"
            >
              <DialogTitle
                as="h3"
                class="text-lg my-2 font-medium leading-6 text-gray-900 dark:text-white"
              >
                <div class="flex items-center justify-between">
                  <h2>Ver página de destino</h2>

                  <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </DialogTitle>

              <div v-if="landingPage">
                <p class="mb-1"><strong>Nombre:</strong> {{ landingPage.name }}</p>
                <p class="mb-1"><strong>Slug:</strong> {{ landingPage.slug }}</p>
                <p class="mb-1"><strong>Clave pública:</strong> {{ landingPage.public_key }}</p>
                <p class="mb-1"><strong>URL de redirección:</strong> {{ landingPage.redirect_url }}</p>
                <p class="mb-1"><strong>URL importada:</strong> {{ landingPage.imported_url }}</p>
                <p class="mb-1"><strong>Captura datos enviados:</strong> {{ landingPage.capture_submitted_data ? 'Sí' : 'No' }}</p>
                <p class="mb-4"><strong>Captura contraseña:</strong> {{ landingPage.capture_password ? 'Sí' : 'No' }}</p>

                <div>
                  <h4 class="font-medium mb-2">Contenido HTML</h4>
                  <div class="border p-2 max-h-96 overflow-auto" v-html="landingPage.html_content"></div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  landingPage: { type: Object, default: null }
})
const emit = defineEmits(['close'])

const handleClose = () => emit('close')
</script>
