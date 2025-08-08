<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Nombre</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">#</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="(landingPage, index) in landingPages" :key="index">
        <fwb-table-cell>{{ landingPage.name }}</fwb-table-cell>
        <fwb-table-cell>
          <fwb-a href="#"> Edit </fwb-a>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>

<script setup>
import { defineProps } from 'vue'
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
  landingPages: {
    type: Array,
    required: true,
  },
})
</script>
