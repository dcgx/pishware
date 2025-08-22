<template>
  <admin-layout>
    <div class="grid gap-4">
      <div class="space-y-5 sm:space-y-6">
        <ComponentCard>
          <div class="space-y-5 sm:space-y-6">
            <h2 class="text-1xl font-light uppercase dark:text-white text-gray-900 my-0">
              Indice de riesgo
            </h2>
            <span class="text-3xl font-semibold text-gray-900 dark:text-amber-200">{{ riskIndex }}/100</span>
          </div>
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mt-6 border-t pt-6 dark:border-gray-700 border-gray-200">
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
      <h2 class="text-1xl font-medium uppercase dark:text-white text-gray-900 my-5">Detalles</h2>
      <MetricsDetailsTable :metrics="details" />
    </div>
  </admin-layout>
</template>

<script setup>
import AdminLayout from '../components/layout/AdminLayout.vue'
import ComponentCard from '../components/common/ComponentCard.vue'
import LineChartOne from '../components/charts/LineChart/LineChartOne.vue'
import RadialBarChart from '@/components/charts/RadialBarChart/RadialBarChart.vue'

// components
import MetricsDetailsTable from '@/components/metrics/MetricsDetailsTable.vue'
import { onMounted } from 'vue'
import { useMetrics } from '@/composables/useMetrics'

const {
  riskIndex,
  emailsSent,
  emailsOpened,
  linksClicked,
  dataSent,
  details,
  fetchMetrics,
} = useMetrics()

onMounted(() => {
  fetchMetrics()
})
</script>
