import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCampaignsStore = defineStore('campaigns', () => {
  const campaigns = ref();

  const createForm = ref({
    name: '',
    description: '',
    templateId: null,
    landingPageId: null,
    scheduledStartAt: '',
    status: 'draft',
    userIds: [],
    groupIds: [],
  });

  const editForm = ref({
    id: null,
    name: '',
    description: '',
    templateId: null,
    landingPageId: null,
    scheduledStartAt: '',
    status: 'draft',
    userIds: [],
    groupIds: [],
  });

  const fetching = ref(false);
  const loading = ref(false);
  const error = ref('');
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);

  return {
    campaigns,
    createForm,
    editForm,
    fetching,
    loading,
    error,
    creating,
    updating,
    deleting,
  };
});
