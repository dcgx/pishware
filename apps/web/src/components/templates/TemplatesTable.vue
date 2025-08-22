<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>ID</fwb-table-head-cell>
      <fwb-table-head-cell>Nombre</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">Ver</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="template in templates" :key="template.id">
        <fwb-table-cell>{{ template.id }}</fwb-table-cell>
        <fwb-table-cell>{{ template.name }}</fwb-table-cell>
        <fwb-table-cell>
          <button
            @click="emit('view', template.id)"
            class="text-blue-600 hover:text-blue-900"
            aria-label="Ver plantilla"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'

const props = defineProps({
  templates: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['view'])
</script>
