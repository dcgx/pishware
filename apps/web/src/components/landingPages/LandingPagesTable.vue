<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Nombre</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">Ver</span>
      </fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">#</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="(landingPage, index) in landingPages" :key="index">
        <fwb-table-cell>{{ landingPage.name }}</fwb-table-cell>
        <fwb-table-cell>
          <button @click="handleView(landingPage.id)" class="text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .638C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </fwb-table-cell>
        <fwb-table-cell>
          <fwb-a href="#"> Edit </fwb-a>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
  <LandingPageViewDialog
    :show="showView"
    :landing-page="selectedLandingPage"
    @close="showView = false"
  />
</template>

<script setup>
import { ref, defineProps } from 'vue'
import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'
import LandingPageViewDialog from './LandingPageViewDialog.vue'
import { useLandingPages } from '@/composables/useLandingPages'

const props = defineProps({
  landingPages: {
    type: Array,
    required: true,
  },
})

const { fetchLandingPage } = useLandingPages()
const showView = ref(false)
const selectedLandingPage = ref(null)

const handleView = async (id) => {
  try {
    selectedLandingPage.value = await fetchLandingPage(id)
    showView.value = true
  } catch (err) {
    console.error('Error fetching landing page', err)
  }
}
</script>
