<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>ID</fwb-table-head-cell>
      <fwb-table-head-cell>Nombre</fwb-table-head-cell>
      <fwb-table-head-cell>Asunto</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">Acciones</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="template in templates" :key="template.id">
        <fwb-table-cell>{{ template.id }}</fwb-table-cell>
        <fwb-table-cell>{{ template.name }}</fwb-table-cell>
        <fwb-table-cell>{{ template.subject }}</fwb-table-cell>
        <fwb-table-cell class="flex gap-2">
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
          <button
            @click="emit('edit', template)"
            class="text-green-600 hover:text-green-900"
            aria-label="Editar plantilla"
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
                d="M16.862 4.487a1.5 1.5 0 0 1 2.121 2.121L7.5 18.091l-3.75.75.75-3.75 12.362-12.604z"
              />
            </svg>
          </button>
          <button
            @click="emit('delete', template.id)"
            class="text-red-600 hover:text-red-900"
            aria-label="Eliminar plantilla"
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.05.682.108 1.022.179m-1.022-.179L18.16 5.47a2.25 2.25 0 00-2.122-1.72h-4.076a2.25 2.25 0 00-2.122 1.72l-.322 1.319m9.97 0H4.75m10.486 0l-.323 9.114A2.25 2.25 0 0112.666 20.25h-1.332a2.25 2.25 0 01-2.246-2.116L8.765 6.79m-5.015-.779c.34-.071.68-.129 1.022-.179m0 0L4.75 5.47A2.25 2.25 0 016.872 3.75h4.256c1.05 0 1.974.737 2.122 1.72l.323 1.319m-8.75 0h9.25"
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

const emit = defineEmits(['view', 'edit', 'delete'])
</script>
