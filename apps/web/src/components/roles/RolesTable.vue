<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Nombre</fwb-table-head-cell>
      <fwb-table-head-cell>Descripción</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">#</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="role in roles" :key="role.id">
        <fwb-table-cell>{{ role.name }}</fwb-table-cell>
        <fwb-table-cell>{{ role.description }}</fwb-table-cell>
        <fwb-table-cell>
          <div class="flex gap-2">
            <fwb-a href="#" @click.prevent="$emit('edit', role)">Editar</fwb-a>
            <fwb-a href="#" class="text-red-600" @click.prevent="$emit('delete', role)">Eliminar</fwb-a>
          </div>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'

const props = defineProps({
  roles: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'delete'])
</script>
