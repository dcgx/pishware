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
              class="w-[700px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 dark:text-white"
            >
              <DialogTitle
                as="h3"
                class="text-lg my-3 font-medium leading-6 text-gray-900 dark:text-gray-200"
              >
                <div class="flex items-center justify-between">
                  Editar campaña

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
              <CampaignForm
                v-model="form"
                :templates="templates"
                :landing-pages="landingPages"
                :users="users"
                :groups="groups"
                @submit="handleUpdateCampaign"
                @cancel="handleClose"
              />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { reactive, watch, defineEmits, defineProps } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import CampaignForm from './CampaignForm.vue'
import { useCampaigns } from '@/composables/useCampaigns'

const { updateCampaign } = useCampaigns()

const props = defineProps({
  show: { type: Boolean, required: true },
  campaign: { type: Object, required: true },
  templates: { type: Array, default: () => [] },
  landingPages: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
  groups: { type: Array, default: () => [] },
})

const emit = defineEmits(['close'])

const form = reactive({ ...props.campaign })

watch(
  () => props.campaign,
  (val) => {
    Object.assign(form, val)
  }
)

const handleClose = () => {
  emit('close')
}

const handleUpdateCampaign = async (payload) => {
  await updateCampaign(payload.id, payload)
  handleClose()
}
</script>
