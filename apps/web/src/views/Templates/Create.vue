<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12">
        <h2 class="text-2xl font-semibold mb-4">Templates</h2>
        <!-- Tarjeta del formulario -->
        <div class="p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
          <form @submit.prevent="createTemplate">
            <div class="mb-4">
              <label class="block text-gray-700 dark:text-gray-300" for="templateName">
                Nombre de plantilla
              </label>
              <input
                id="templateName"
                type="text"
                v-model="templateName"
                class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Ej. Bienvenida"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 dark:text-gray-300" for="subject">
                Asunto
              </label>
              <input
                id="subject"
                type="text"
                v-model="subject"
                class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Ej. ¡Bienvenido a nuestro servicio!"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 dark:text-gray-300" for="body">
                Cuerpo del correo (HTML)
              </label>
              <textarea
                id="body"
                v-model="body"
                rows="8"
                class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Escribe el HTML del correo aquí..."
                required
              ></textarea>
            </div>
            <div class="mb-6">
              <button
                type="submit"
                class="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none"
              >
                Guardar plantilla
              </button>
            </div>
          </form>
          <!-- Vista previa -->
          <div v-if="body" class="mt-8">
            <h3 class="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">
              Vista previa
            </h3>
            <div class="p-4 border rounded-lg dark:border-gray-700 overflow-auto max-h-96">
              <div v-html="body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout.vue'

export default {
  components: {
    AdminLayout,
  },
  name: 'Ecommerce',
  data() {
    return {
      templateName: '',
      subject: '',
      body: '',
    }
  },
  methods: {
    async createTemplate() {
      try {
        const payload = {
          name: this.templateName,
          subject: this.subject,
          html: this.body,
        }
        // Ajusta la URL al endpoint de tu API en NestJS
        await axios.post('/api/email-templates', payload)
        alert('Plantilla guardada correctamente')
        // Restablecer campos
        this.templateName = ''
        this.subject = ''
        this.body = ''
      } catch (error) {
        console.error(error)
        alert('Ocurrió un error al guardar la plantilla')
      }
    },
  },
}
</script>
