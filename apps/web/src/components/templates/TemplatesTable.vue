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
        <fwb-table-cell>
          <div class="flex gap-2">
            <Button size="sm" variant="outline" @click="$emit('view', template.id)">
              Ver
            </Button>
            <Button size="sm" variant="outline" @click="$emit('edit', template)">
              Editar
            </Button>
            <Button size="sm" variant="danger" @click="$emit('delete', template.id)">
              Eliminar
            </Button>
          </div>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Button from '@/components/ui/Button.vue'
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
