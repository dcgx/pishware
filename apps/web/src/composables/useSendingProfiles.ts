import { useSendingProfilesStore } from '@/stores/useSendingProfilesStore';
import { computed } from 'vue';

export const useSendingProfiles = () => {
  const store = useSendingProfilesStore();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchSendingProfiles = async () => {
    store.fetching = true;
    try {
      const response = await fetch(`${apiUrl}/sending-profiles`);
      const data = await response.json();
      store.profiles = data;
    } catch (err) {
      store.error = 'Failed to fetch sending profiles';
    } finally {
      store.fetching = false;
    }
  };

  const createSendingProfile = async (profile: any) => {
    store.creating = true;
    store.error = '';
    try {
      const response = await fetch(`${apiUrl}/sending-profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error('Failed to create sending profile');
      const data = await response.json();
      if (!store.profiles) store.profiles = [];
      store.profiles.push(data);
      return { success: true, data };
    } catch (err: any) {
      store.error = 'Error creating sending profile';
      return { success: false, error: err.message };
    } finally {
      store.creating = false;
    }
  };

  const updateSendingProfile = async (id: number, profile: any) => {
    store.updating = true;
    try {
      const response = await fetch(`${apiUrl}/sending-profiles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error('Failed to update sending profile');
      const data = await response.json();
      const index = store.profiles.findIndex((p: any) => p.id === id);
      if (index !== -1) store.profiles[index] = data;
      return { success: true, data };
    } catch (err: any) {
      store.error = 'Error updating sending profile';
      return { success: false, error: err.message };
    } finally {
      store.updating = false;
    }
  };

  const deleteSendingProfile = async (id: number) => {
    store.deleting = true;
    try {
      const response = await fetch(`${apiUrl}/sending-profiles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete sending profile');
      store.profiles = store.profiles.filter((p: any) => p.id !== id);
      return { success: true };
    } catch (err: any) {
      store.error = 'Error deleting sending profile';
      return { success: false, error: err.message };
    } finally {
      store.deleting = false;
    }
  };

  return {
    sendingProfiles: computed(() => store.profiles),
    fetching: computed(() => store.fetching),
    error: store.error,
    createForm: store.createForm,
    editForm: store.editForm,
    fetchSendingProfiles,
    createSendingProfile,
    updateSendingProfile,
    deleteSendingProfile,
  };
};
