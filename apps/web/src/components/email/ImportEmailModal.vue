<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
      <h2 class="text-xl font-semibold mb-4">Import Email</h2>
      <textarea v-model="rawContent" rows="8" class="w-full border rounded mb-4 p-2"
                placeholder="Paste raw email source here..."></textarea>
      <label class="inline-flex items-center mb-4">
        <input type="checkbox" v-model="convertLinks" class="mr-2" />
        Change Links to Point to Landing Page
      </label>
      <div class="flex justify-end space-x-2">
        <button @click="$emit('close')" class="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</button>
        <button @click="emitImport" class="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">Import</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawContent: '',
      convertLinks: true,
    }
  },
  methods: {
    emitImport() {
      let content = this.rawContent
      if (this.convertLinks) {
        // Aquí podrías hacer transformaciones adicionales
        content = content.replace(/href="[^"]+"/g, 'href="https://landing.page"')
      }
      this.$emit('import', content)
    },
  },
}
</script>
