<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Nombre</fwb-table-head-cell>
      <fwb-table-head-cell>Host</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">#</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="profile in profiles" :key="profile.id">
        <fwb-table-cell>{{ profile.name }}</fwb-table-cell>
        <fwb-table-cell>{{ profile.host }}</fwb-table-cell>
        <fwb-table-cell class="space-x-2">
          <button
            class="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            @click="$emit('edit', profile)"
          >
            Editar
          </button>
          <button
            class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            @click="$emit('delete', profile.id)"
          >
            Eliminar
          </button>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue';

defineEmits(['edit', 'delete']);

defineProps({
  profiles: {
    type: Array,
    default: () => [],
  },
});
</script>
