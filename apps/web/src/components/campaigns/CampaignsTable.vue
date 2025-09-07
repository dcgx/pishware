<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Nombre</fwb-table-head-cell>
      <fwb-table-head-cell>Estado</fwb-table-head-cell>
      <fwb-table-head-cell>
        <span class="sr-only">Acciones</span>
      </fwb-table-head-cell>
    </fwb-table-head>

    <fwb-table-body>
      <fwb-table-row v-for="campaign in campaigns" :key="campaign.id">
        <fwb-table-cell class="align-middle">
          {{ campaign.name }}
        </fwb-table-cell>

        <fwb-table-cell class="align-middle">
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1"
            :class="statusMeta(campaign.status).classes"
          >
            <span
              class="h-1.5 w-1.5 rounded-full"
              :class="statusMeta(campaign.status).dot"
            />
            {{ statusMeta(campaign.status).label }}
          </span>
        </fwb-table-cell>

        <fwb-table-cell class="align-middle">
          <Button size="sm" variant="outline" class="mr-2" @click="$emit('edit', campaign)">
            Editar
          </Button>
          <Button size="sm" variant="danger" @click="$emit('delete', campaign.id)">
            Eliminar
          </Button>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>

<script setup>
import { defineProps } from 'vue'
import Button from '@/components/ui/Button.vue'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'

defineProps({
  campaigns: { type: Array, default: () => [] },
})

defineEmits(['edit', 'delete'])

/**
 * Mapa de estados → etiqueta + clases de estilo.
 * Puedes ajustar colores o añadir nuevos estados sin tocar el template.
 */
const STATUS_STYLES = {
  // estados principales actuales
  draft: {
    label: 'Borrador',
    classes:
      'bg-slate-50 text-slate-700 ring-slate-200/70 dark:bg-slate-900/40 dark:text-slate-200 dark:ring-slate-800',
    dot: 'bg-slate-500',
  },
  scheduled: {
    label: 'Programada',
    classes:
      'bg-amber-50 text-amber-700 ring-amber-200/70 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800',
    dot: 'bg-amber-500',
  },
  sent: {
    label: 'Enviada',
    classes:
      'bg-blue-50 text-blue-700 ring-blue-200/70 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-800',
    dot: 'bg-blue-500',
  },
  completed: {
    label: 'Finalizada',
    classes:
      'bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800',
    dot: 'bg-emerald-500',
  },

  // estados extendidos (por si los usas después)
  running: {
    label: 'En curso',
    classes:
      'bg-indigo-50 text-indigo-700 ring-indigo-200/70 dark:bg-indigo-900/30 dark:text-indigo-200 dark:ring-indigo-800',
    dot: 'bg-indigo-500',
  },
  paused: {
    label: 'Pausada',
    classes:
      'bg-yellow-50 text-yellow-800 ring-yellow-200/70 dark:bg-yellow-900/30 dark:text-yellow-200 dark:ring-yellow-800',
    dot: 'bg-yellow-500',
  },
  failed: {
    label: 'Fallida',
    classes:
      'bg-rose-50 text-rose-700 ring-rose-200/70 dark:bg-rose-900/30 dark:text-rose-200 dark:ring-rose-800',
    dot: 'bg-rose-500',
  },
  cancelled: {
    label: 'Cancelada',
    classes:
      'bg-gray-50 text-gray-700 ring-gray-200/70 dark:bg-gray-900/40 dark:text-gray-200 dark:ring-gray-800',
    dot: 'bg-gray-400',
  },
  archived: {
    label: 'Archivada',
    classes:
      'bg-zinc-50 text-zinc-700 ring-zinc-200/70 dark:bg-zinc-900/40 dark:text-zinc-200 dark:ring-zinc-800',
    dot: 'bg-zinc-500',
  },
}

/**
 * Devuelve metadatos seguros aun si llega un estado desconocido.
 */
const statusMeta = (status) => {
  if (!status) {
    return {
      label: 'Desconocido',
      classes:
        'bg-neutral-50 text-neutral-700 ring-neutral-200/70 dark:bg-neutral-900/40 dark:text-neutral-200 dark:ring-neutral-800',
      dot: 'bg-neutral-500',
    }
  }
  return STATUS_STYLES[status] ?? {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    classes:
      'bg-neutral-50 text-neutral-700 ring-neutral-200/70 dark:bg-neutral-900/40 dark:text-neutral-200 dark:ring-neutral-800',
    dot: 'bg-neutral-500',
  }
}
</script>
