

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRolesStore = defineStore('roles', () => {
  const roles = ref([]);
  const loading = ref(false);
  const error = ref('');
  const creating = ref(false);

  const setRoles = (data: any) => { roles.value = data; };
  
  const addRole = (role: any) => { roles.value.push(role); };

  return {
    roles,
    loading,
    error,
    creating,
    setRoles,
    addRole,
  };
});