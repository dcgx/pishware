<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Nombre</fwb-table-head-cell>
      <fwb-table-head-cell>Estado</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">#</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="campaign in campaigns" :key="campaign.id">
        <fwb-table-cell>{{ campaign.name }}</fwb-table-cell>
        <fwb-table-cell>{{ campaign.status }}</fwb-table-cell>
        <fwb-table-cell>
          <Button size="xs" variant="outline" class="mr-2" @click="$emit('edit', campaign)">Editar</Button>
          <Button size="xs" variant="danger" @click="$emit('delete', campaign.id)">Eliminar</Button>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>

<script setup>
import { defineProps } from 'vue'
import Button from '@/components/ui/Button.vue'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'

defineProps({
  campaigns: { type: Array, default: () => [] },
})

defineEmits(['edit', 'delete'])
</script>
