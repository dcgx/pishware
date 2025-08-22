import axios from 'axios'
import { computed } from 'vue'
import { useMetricsStore } from '@/stores/useMetricsStore'

export const useMetrics = () => {
  const store = useMetricsStore()
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const fetchMetrics = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/tracking/metrics`)
      store.setMetrics(data)
    } catch (err) {
      store.setMetrics({})
    }
  }

  return {
    riskIndex: computed(() => store.riskIndex),
    emailsSent: computed(() => store.emailsSent),
    emailsOpened: computed(() => store.emailsOpened),
    linksClicked: computed(() => store.linksClicked),
    dataSent: computed(() => store.dataSent),
    details: computed(() => store.details),
    fetchMetrics,
  }
}
