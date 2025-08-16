import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSendingProfilesStore = defineStore('sendingProfiles', () => {
  const profiles = ref();

  const createForm = ref({
    name: '',
    interfaceType: '',
    smtpFrom: '',
    host: '',
    username: '',
    password: '',
    ignoreCertErrors: false,
    emailHeaders: [],
  });

  const editForm = ref({
    id: null,
    name: '',
    interfaceType: '',
    smtpFrom: '',
    host: '',
    username: '',
    password: '',
    ignoreCertErrors: false,
    emailHeaders: [],
  });

  const fetching = ref(false);
  const error = ref('');
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);

  return {
    profiles,
    createForm,
    editForm,
    fetching,
    error,
    creating,
    updating,
    deleting,
  };
});
