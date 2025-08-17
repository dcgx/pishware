<template>
  <template>
    <TransitionRoot appear :show="show" as="template">
      <Dialog as="div" class="relative z-10" @close="handleClose">
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
                <form>
                  <div>
                    <label class="block text-sm font-medium text-gray-700" for="emailContent"
                      >Contenido email:</label
                    >
                    <textarea
                      id="emailContent"
                      v-model="rawEmail"
                      class="w-full mt-1 rounded-md border p-2"
                      rows="10"
                      placeholder="Escribe el contenido del email aquí"
                      required
                    />
                  </div>

                  <Button
                    @click.prevent="handleParseEmail"
                    class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >Importar
                  </Button>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import extractHtmlFromRawEmail from '@/utils/extractHtmlFromRawEmail'

const rawEmail = ref('')
const htmlPreview = ref('')

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

function handleParseEmail() {
  htmlPreview.value = extractHtmlFromRawEmail(rawEmail.value)
  emit('close')
  emit('imported', { htmlPreview: htmlPreview.value })
}

function handleClose() {
  emit('close')
}
</script>
