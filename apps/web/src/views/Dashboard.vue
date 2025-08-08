<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <h2>Dashboard</h2>
    </div>
    <fwb-alert type="success">
      Success! You can now use Flowbite Vue in your Vue application 🎉
    </fwb-alert>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import { FwbAlert } from 'flowbite-vue'

export default {
  components: {
    AdminLayout,
    FwbAlert,
  },
  name: 'Ecommerce',
}
</script>
