<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Bar Chart 1"> <SimpleDonutChart /> </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import SimpleDonutChart from "@/components/charts/SimpleDonutChart/SimpleDonutChart.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { ref } from "vue";
const currentPageTitle = ref("Donut Chart");
</script>
