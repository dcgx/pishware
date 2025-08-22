import { defineStore } from 'pinia'
import { ref } from 'vue'

interface MetricDetail {
  firstName: string
  lastName: string
  email: string
  position: string
  event_type: string
}

interface MetricsData {
  riskIndex?: number
  emailsSent?: number
  emailsOpened?: number
  linksClicked?: number
  dataSent?: number
  details?: MetricDetail[]
}

export const useMetricsStore = defineStore('metrics', () => {
  const riskIndex = ref(0)
  const emailsSent = ref(0)
  const emailsOpened = ref(0)
  const linksClicked = ref(0)
  const dataSent = ref(0)
  const details = ref<MetricDetail[]>([])

  const setMetrics = (data: MetricsData) => {
    riskIndex.value = data.riskIndex ?? 0
    emailsSent.value = data.emailsSent ?? 0
    emailsOpened.value = data.emailsOpened ?? 0
    linksClicked.value = data.linksClicked ?? 0
    dataSent.value = data.dataSent ?? 0
    details.value = data.details ?? []
  }

  return {
    riskIndex,
    emailsSent,
    emailsOpened,
    linksClicked,
    dataSent,
    details,
    setMetrics,
  }
})
