<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <button
        v-for="report in reports"
        :key="report.route"
        type="button"
        class="col-span-12 sm:col-span-6 xl:col-span-4"
        @click="generateReport(report)"
      >
        <ComponentCard
          :title="report.title"
          :desc="report.desc"
          className="h-full cursor-pointer hover:shadow-md transition-shadow"
        />
      </button>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import ComponentCard from '@/components/common/ComponentCard.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

interface Report {
  title: string
  desc: string
  route: string
  endpoint: string
}

const router = useRouter()
const generating = ref(false)

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const reports: Report[] = [
  {
    title: 'Resumen general',
    desc: 'Visión general de las campañas',
    route: '/reports/overview',
    endpoint: '/reports/overview/pdf',
  },
  {
    title: 'Correos enviados vs abiertos',
    desc: 'Tasa de apertura por campaña',
    route: '/reports/emails-opened',
    endpoint: '/reports/emails-opened/pdf',
  },
  {
    title: 'Clics en enlaces',
    desc: 'Interacciones con los enlaces enviados',
    route: '/reports/link-clicks',
    endpoint: '/reports/link-clicks/pdf',
  },
  {
    title: 'Captura de credenciales',
    desc: 'Usuarios que ingresaron datos en páginas falsas',
    route: '/reports/credential-submission',
    endpoint: '/reports/credential-submission/pdf',
  },
  {
    title: 'Índice de riesgo por departamento',
    desc: 'Comparación entre áreas de la organización',
    route: '/reports/risk-department',
    endpoint: '/reports/risk-department/pdf',
  },
  {
    title: 'Geolocalización de clics',
    desc: 'Ubicación de las interacciones registradas',
    route: '/reports/geolocation',
    endpoint: '/reports/geolocation/pdf',
  },
]

const generateReport = async (report: Report) => {
  if (generating.value) return
  generating.value = true
  try {
    const res = await fetch(`${apiUrl}${report.endpoint}`)
    if (!res.ok) throw new Error('No se pudo generar el reporte')
    const blob = await res.blob()
    const pdfUrl = URL.createObjectURL(blob)
    router.push({ path: report.route, query: { pdf: pdfUrl } })
  } catch (err) {
    console.error(err)
  } finally {
    generating.value = false
  }
}
</script>
