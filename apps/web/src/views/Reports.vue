<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <router-link
        v-for="report in reports"
        :key="report.route"
        :to="report.route"
        class="col-span-12 sm:col-span-6 xl:col-span-4"
      >
        <ComponentCard
          :title="report.title"
          :desc="report.desc"
          className="h-full cursor-pointer hover:shadow-md transition-shadow"
        />
      </router-link>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import ComponentCard from '@/components/common/ComponentCard.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

interface Report {
  title: string
  desc: string
  route: string
}

const reports: Report[] = [
  {
    title: 'Resumen general',
    desc: 'Visión general de las campañas',
    route: '/reports/overview',
  },
  {
    title: 'Correos enviados vs abiertos',
    desc: 'Tasa de apertura por campaña',
    route: '/reports/emails-opened',
  },
  {
    title: 'Clics en enlaces',
    desc: 'Interacciones con los enlaces enviados',
    route: '/reports/link-clicks',
  },
  {
    title: 'Captura de credenciales',
    desc: 'Usuarios que ingresaron datos en páginas falsas',
    route: '/reports/credential-submission',
  },
  {
    title: 'Índice de riesgo por departamento',
    desc: 'Comparación entre áreas de la organización',
    route: '/reports/risk-department',
  },
  {
    title: 'Geolocalización de clics',
    desc: 'Ubicación de las interacciones registradas',
    route: '/reports/geolocation',
  },
]
</script>
