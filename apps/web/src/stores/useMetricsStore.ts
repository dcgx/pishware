import { defineStore } from 'pinia'
import { ref } from 'vue'

interface MetricDetail {
  firstName: string
  lastName: string
  email: string
  position: string
  event_type: string
}

interface CampaignOverview {
  campaign: string
  emailsSent: number
  emailsOpened: number
  openRate: number
}

interface DepartmentRisk {
  department: string
  riskIndex: number
}

interface GeoLocation {
  location: string
  count: number
}

interface MetricsData {
  riskIndex?: number
  emailsSent?: number
  emailsOpened?: number
  linksClicked?: number
  dataSent?: number
  details?: MetricDetail[]
  campaignOverview?: CampaignOverview[]
  departmentRisk?: DepartmentRisk[]
  geoLocation?: GeoLocation[]
}

export const useMetricsStore = defineStore('metrics', () => {
  const riskIndex = ref(0)
  const emailsSent = ref(0)
  const emailsOpened = ref(0)
  const linksClicked = ref(0)
  const dataSent = ref(0)
  const details = ref<MetricDetail[]>([])
  const campaignOverview = ref<CampaignOverview[]>([])
  const departmentRisk = ref<DepartmentRisk[]>([])
  const geoLocation = ref<GeoLocation[]>([])

  const setMetrics = (data: MetricsData) => {
    riskIndex.value = data.riskIndex ?? 0
    emailsSent.value = data.emailsSent ?? 0
    emailsOpened.value = data.emailsOpened ?? 0
    linksClicked.value = data.linksClicked ?? 0
    dataSent.value = data.dataSent ?? 0
    details.value = data.details ?? []
    campaignOverview.value = data.campaignOverview ?? []
    departmentRisk.value = data.departmentRisk ?? []
    geoLocation.value = data.geoLocation ?? []
  }

  return {
    riskIndex,
    emailsSent,
    emailsOpened,
    linksClicked,
    dataSent,
    details,
    campaignOverview,
    departmentRisk,
    geoLocation,
    setMetrics,
  }
})
