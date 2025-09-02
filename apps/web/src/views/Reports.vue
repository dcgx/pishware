<template>
  <admin-layout>
    <div class="grid gap-4">
      <PageHeader>
        <template #title>Reportes</template>
      </PageHeader>

      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">Resumen general</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-5 sm:space-y-6 flex flex-col items-center">
          <h4 class="text-1xl font-medium text-gray-900 dark:text-gray-200">Correos enviados</h4>
          <RadialBarChart :value="emailsSent" />
        </div>
        <div class="space-y-5 sm:space-y-6 flex flex-col items-center">
          <h4 class="text-1xl font-medium text-gray-900 dark:text-gray-200">Correos abiertos</h4>
          <RadialBarChart :value="emailsOpened" />
        </div>
        <div class="space-y-5 sm:space-y-6 flex flex-col items-center">
          <h4 class="text-1xl font-medium text-gray-900 dark:text-gray-200">Link clickeados</h4>
          <RadialBarChart :value="linksClicked" />
        </div>
        <div class="space-y-5 sm:space-y-6 flex flex-col items-center">
          <h4 class="text-1xl font-medium text-gray-900 dark:text-gray-200">Datos enviados</h4>
          <RadialBarChart :value="dataSent" />
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">Visión general de las campañas</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
            <thead class="border-b font-medium dark:border-gray-700">
              <tr>
                <th class="px-4 py-2">Campaña</th>
                <th class="px-4 py-2">Enviados</th>
                <th class="px-4 py-2">Abiertos</th>
                <th class="px-4 py-2">Tasa de apertura</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in campaignOverview" :key="c.campaign" class="border-b dark:border-gray-700">
                <td class="px-4 py-2">{{ c.campaign }}</td>
                <td class="px-4 py-2">{{ c.emailsSent }}</td>
                <td class="px-4 py-2">{{ c.emailsOpened }}</td>
                <td class="px-4 py-2">{{ c.openRate }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">Índice de riesgo por departamento</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
            <thead class="border-b font-medium dark:border-gray-700">
              <tr>
                <th class="px-4 py-2">Departamento</th>
                <th class="px-4 py-2">Índice de riesgo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in departmentRisk" :key="d.department" class="border-b dark:border-gray-700">
                <td class="px-4 py-2">{{ d.department }}</td>
                <td class="px-4 py-2">{{ d.riskIndex }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">Geolocalización de clics</h3>
        <ul class="list-disc list-inside">
          <li v-for="g in geoLocation" :key="g.location">{{ g.location }}: {{ g.count }}</li>
        </ul>
      </div>

      <div class="mt-6">
        <label for="eventType" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Filtrar por evento</label>
        <div class="relative z-20 bg-transparent w-full sm:max-w-xs">
          <select
            id="eventType"
            v-model="selectedEvent"
            class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            :class="{ 'text-gray-800 dark:text-white/90': selectedEvent }"
          >
            <option value="">Todos</option>
            <option value="email_sent">Email enviado</option>
            <option value="email_opened">Email abierto</option>
            <option value="link_clicked">Click en enlace</option>
            <option value="data_sent">Datos enviados</option>
          </select>
          <span class="absolute z-30 text-gray-700 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
            <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div class="mt-6">
        <MetricsDetailsTable :metrics="filteredMetrics" />
      </div>

      <div class="mt-6">
        <a :href="`${apiUrl}/tracking/report/pdf`" target="_blank" class="text-blue-600 dark:text-blue-400 underline">Descargar PDF</a>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/page/PageHeader.vue'
import RadialBarChart from '@/components/charts/RadialBarChart/RadialBarChart.vue'
import MetricsDetailsTable from '@/components/metrics/MetricsDetailsTable.vue'
import { useMetrics } from '@/composables/useMetrics'

const { emailsSent, emailsOpened, linksClicked, dataSent, details, campaignOverview, departmentRisk, geoLocation, fetchMetrics } = useMetrics()
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const selectedEvent = ref('')
const filteredMetrics = computed(() => {
  if (!selectedEvent.value) return details.value
  return details.value.filter((metric) => metric.event_type === selectedEvent.value)
})

onMounted(() => {
  fetchMetrics()
})
</script>

