

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRolesStore = defineStore('roles', () => {
  const roles = ref([]);
  const loading = ref(false);
  const error = ref('');
  const creating = ref(false);

  const setRoles = (data: any) => { roles.value = data; };

  const addRole = (role: any) => { roles.value.push(role); };

  const updateRole = (updatedRole: any) => {
    const index = roles.value.findIndex((r: any) => r.id === updatedRole.id);
    if (index !== -1) {
      roles.value[index] = updatedRole;
    }
  };

  const removeRole = (id: number) => {
    roles.value = roles.value.filter((r: any) => r.id !== id);
  };

  return {
    roles,
    loading,
    error,
    creating,
    setRoles,
    addRole,
    updateRole,
    removeRole,
  };
});