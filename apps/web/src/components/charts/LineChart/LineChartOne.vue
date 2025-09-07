<template>
  <div class="max-w-full overflow-x-auto custom-scrollbar">
    <div id="chartThree" class="-ml-4 min-w-[1000px] xl:min-w-full pl-2">
      <VueApexCharts
        type="line"
        height="360"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <!-- debug opcional -->
    <!-- <pre class="text-xs mt-4">{{ chartOptions }}</pre>
    <pre class="text-xs mt-2">{{ series }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useMetrics } from '@/composables/useMetrics'

type DailyBucket = {
  dateKey: string
  email_sent: number
  email_opened: number
  link_clicked: number
  data_sent: number
  pOpen: number
  pClick: number
  pData: number
  riskIndex: number
}

const { fetchMetrics, details } = useMetrics()

// ------- Helpers -------
const normalizeEventType = (t: string) => {
  switch (t) {
    case 'email_sent':
    case 'email_opened':
    case 'link_clicked':
    case 'data_sent':
      return t
    case 'landing_viewed':
      return 'link_clicked'
    case 'landing_submitted':
      return 'data_sent'
    default:
      return undefined
  }
}

const toDateKey = (d: string | Date) => {
  const dt = new Date(d)
  // YYYY-MM-DD
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

const calcRisk = (sent: number, opened: number, clicked: number, data: number) => {
  if (!sent) return { pOpen: 0, pClick: 0, pData: 0, riskIndex: 0 }
  const pOpen = Math.min((opened / sent) * 100, 100)
  const pClick = Math.min((clicked / sent) * 100, 100)
  const pData  = Math.min((data   / sent) * 100, 100)
  const risk   = (pOpen * 0.10) + (pClick * 0.30) + (pData * 0.60)
  return {
    pOpen: Math.round(pOpen),
    pClick: Math.round(pClick),
    pData: Math.round(pData),
    riskIndex: Math.round(Math.min(risk, 100))
  }
}

const buildDailySeries = (rows: any[]): { categories: string[]; pOpen: number[]; pClick: number[]; pData: number[]; risk: number[] } => {
  // 1) agrupar por día
  const map: Record<string, DailyBucket> = {}

  for (const r of rows) {
    const dateKey = toDateKey(r.submittedAt ?? new Date())
    const normalized = normalizeEventType(r.event_type)
    if (!normalized) continue

    if (!map[dateKey]) {
      map[dateKey] = {
        dateKey,
        email_sent: 0,
        email_opened: 0,
        link_clicked: 0,
        data_sent: 0,
        pOpen: 0,
        pClick: 0,
        pData: 0,
        riskIndex: 0,
      }
    }
    map[dateKey][normalized]++
  }

  // 2) ordenar por fecha asc
  const buckets = Object.values(map).sort((a, b) => a.dateKey.localeCompare(b.dateKey))

  // 3) calcular % y riesgo por día
  for (const b of buckets) {
    const { pOpen, pClick, pData, riskIndex } = calcRisk(
      b.email_sent, b.email_opened, b.link_clicked, b.data_sent
    )
    b.pOpen = pOpen
    b.pClick = pClick
    b.pData = pData
    b.riskIndex = riskIndex
  }

  return {
    categories: buckets.map(b => b.dateKey),
    pOpen: buckets.map(b => b.pOpen),
    pClick: buckets.map(b => b.pClick),
    pData: buckets.map(b => b.pData),
    risk: buckets.map(b => b.riskIndex),
  }
}

// asegura que haya al menos 2 puntos por serie (Apex con 1 punto a veces no pinta)
const ensureTwoPoints = (cats: string[], arr: number[]) => {
  if (arr.length >= 2 && cats.length >= 2) return { cats, arr }

  // Caso sin datos: creamos 2 puntos dummy en días consecutivos
  if (arr.length === 0 || cats.length === 0) {
    const today = new Date()
    const y = new Date(today); y.setDate(today.getDate() - 1)
    const kToday = toDateKey(today)
    const kY = toDateKey(y)
    return { cats: [kY, kToday], arr: [0, 0] }
  }

  // Caso con 1 punto: añadimos uno previo con valor 0
  const first = cats[0]
  const base = first ? new Date(first) : new Date()
  const prev = new Date(base)
  prev.setDate(base.getDate() - 1)
  const prevKey = toDateKey(prev)
  return { cats: [prevKey, ...cats], arr: [0, ...arr] }
}

// ------- Chart state -------
const series = ref<any[]>([])
const chartOptions = ref<any>({
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'line', // mixto line+area por serie
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 400 },
  },
  colors: ['#60A5FA', '#F59E0B', '#EF4444', '#111827'], // open, click, data, risk
  stroke: { curve: 'smooth', width: [2, 2, 2, 3] },
  fill: {
    type: ['gradient', 'gradient', 'gradient', 'solid'],
    gradient: {
      shadeIntensity: 0.3,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  markers: { size: 3 }, // ayuda a ver puntos cuando hay pocos datos
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    markers: { radius: 12 },
  },
  dataLabels: { enabled: false },
  grid: {
    strokeDashArray: 4,
    padding: { left: 12, right: 12 },
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val: number) => `${Math.round(val)}%`,
      title: {
        formatter: (_: string, { seriesIndex }: any) =>
          ['Aperturas', 'Clics', 'Datos enviados', 'Índice de riesgo'][seriesIndex] + ': '
      },
    },
    x: { format: 'yyyy-MM-dd' },
  },
  xaxis: {
    type: 'category',          // NO numeric
    categories: [],
    tickAmount: 8,
    labels: {
      rotate: -30,
      formatter: (val: string) => val, // ya viene YYYY-MM-DD
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: [
    {
      title: { text: '% Etapas', style: { fontSize: '12px' } },
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: { formatter: (v: number) => `${v}%` },
    },
    {
      opposite: true,
      title: { text: 'Índice de riesgo', style: { fontSize: '12px' } },
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: { formatter: (v: number) => `${v}` },
    },
  ],
  responsive: [
    {
      breakpoint: 768,
      options: {
        xaxis: { labels: { rotate: 0 } },
        legend: { position: 'bottom', horizontalAlign: 'center' },
      },
    },
  ],
})

// ------- Load & build -------
onMounted(async () => {
  const res = await fetchMetrics()
  const rows = (res?.details ?? details.value ?? []) as any[]

  // Construye series por día
  let daily = buildDailySeries(rows)

  // Si no hay datos, inyecta 2 puntos dummy para que renderice
  if (daily.categories.length === 0) {
    const today = new Date()
    const y = new Date(today); y.setDate(today.getDate() - 1)
    const kToday = toDateKey(today)
    const kY = toDateKey(y)
    daily = {
      categories: [kY, kToday],
      pOpen: [0, 0],
      pClick: [0, 0],
      pData: [0, 0],
      risk: [0, 0],
    }
  }

  // Asegura mínimo 2 puntos por serie y sincroniza categorías
  let { categories, pOpen, pClick, pData, risk } = daily
  ;({ cats: categories, arr: pOpen }  = ensureTwoPoints(categories, pOpen))
  ;({ cats: categories, arr: pClick } = ensureTwoPoints(categories, pClick))
  ;({ cats: categories, arr: pData }  = ensureTwoPoints(categories, pData))
  ;({ cats: categories, arr: risk }   = ensureTwoPoints(categories, risk))

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: { ...chartOptions.value.xaxis, type: 'category', categories },
  }

  series.value = [
    { name: '% Aperturas', type: 'area', data: pOpen, yAxisIndex: 0 },
    { name: '% Clics',     type: 'area', data: pClick, yAxisIndex: 0 },
    { name: '% Datos',     type: 'area', data: pData,  yAxisIndex: 0 },
    { name: 'Índice de riesgo', type: 'line', data: risk, yAxisIndex: 1 },
  ]
})
</script>

<style scoped>
/* opcional: estilos para el contenedor/scroll */
</style>
