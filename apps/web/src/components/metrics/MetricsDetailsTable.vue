<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Nombre</fwb-table-head-cell>
      <fwb-table-head-cell>Apellido</fwb-table-head-cell>
      <fwb-table-head-cell>Email</fwb-table-head-cell>
      <fwb-table-head-cell>Cargo</fwb-table-head-cell>
      <fwb-table-head-cell>Evento</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">Edit</span>
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="(metric, index) in metrics" :key="index">
        <fwb-table-cell>{{ metric.firstName }}</fwb-table-cell>
        <fwb-table-cell>{{ metric.lastName }}</fwb-table-cell>
        <fwb-table-cell>
          {{ metric.email }}
        </fwb-table-cell>
        <fwb-table-cell>
          {{ metric.position }}
        </fwb-table-cell>
        <fwb-table-cell>
          <div
            v-if="metric.event_type === 'email_opened'"
            class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300 inline-flex items-center"
          >
            Email abierto
          </div>
          <div
            v-else-if="metric.event_type === 'email_sent'"
            class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded dark:bg-green-900 dark:text-green-300 inline-flex items-center"
          >
            Email enviado
          </div>
          <div
            v-else-if="metric.event_type === 'link_clicked'"
            class="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded dark:bg-red-900 dark:text-red-300 inline-flex items-center"
          >
            Click en enlace
          </div>
          <div
            v-else-if="metric.event_type === 'data_sent'"
            class="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded dark:bg-purple-900 dark:text-purple-300 inline-flex items-center"
          >
            Datos enviados
          </div>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>

<script setup>
import { ref } from 'vue'
import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'

const metrics = ref([
  {
    firstName: 'Juan',
    lastName: 'Soto',
    email: 'juan.soto@ntt.com',
    position: 'Desarrollador',
    event: 'Email abierto',
    event_type: 'email_opened',
  },
  {
    firstName: 'Maria',
    lastName: 'Gomez',
    email: 'maria.gomez@ntt.com',
    position: 'Gerente de Proyectos',
    event: 'Email enviado',
    event_type: 'email_sent',
  },
  {
    firstName: 'Carlos',
    lastName: 'Lopez',
    email: 'carlos.lopez@ntt.com',
    position: 'Analista de Datos',
    event: 'Click en enlace',
    event_type: 'link_clicked',
  },
  {
    firstName: 'Laura',
    lastName: 'Perez',
    email: 'laura.lopez@ntt.com',
    position: 'Especialista en Marketing',
    event: 'Click en enlace',
    event_type: 'link_clicked',
  },
  {
    firstName: 'Ana',
    lastName: 'Martinez',
    email: 'ana.martinez@ntt.com',
    position: 'Diseñadora',
    event: 'Datos enviados',
    event_type: 'data_sent',
  },
])
</script>
