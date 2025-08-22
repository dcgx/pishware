import { useCampaignsStore } from '@/stores/useCampaignsStore';
import { computed } from 'vue';

export const useCampaigns = () => {
  const campaignStore = useCampaignsStore();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchCampaigns = async () => {
    campaignStore.fetching = true;
    try {
      const response = await fetch(`${apiUrl}/campaign`);
      const data = await response.json();
      campaignStore.campaigns = data;
    } catch (err) {
      campaignStore.error = 'Failed to fetch campaigns';
    } finally {
      campaignStore.fetching = false;
    }
  };

  const createCampaign = async (campaign: any) => {
    campaignStore.creating = true;
    campaignStore.error = '';
    try {
      const response = await fetch(`${apiUrl}/campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaign.name,
          description: campaign.description,
          template_id: campaign.templateId,
          landing_page_id: campaign.landingPageId,
          scheduled_start_at: campaign.scheduledStartAt,
          status: campaign.status,
          send_now: campaign.sendNow,
          profile_ids: campaign.userIds,
          group_ids: campaign.groupIds,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }
      const data = await response.json();
      if (!campaignStore.campaigns) campaignStore.campaigns = [];
      campaignStore.campaigns.push(data);
      return { success: true, data };
    } catch (err: any) {
      campaignStore.error = 'Error creating campaign';
      return { success: false, error: err.message };
    } finally {
      campaignStore.creating = false;
    }
  };

  const updateCampaign = async (id: number, campaign: any) => {
    campaignStore.updating = true;
    try {
      const response = await fetch(`${apiUrl}/campaign/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaign.name,
          description: campaign.description,
          template_id: campaign.templateId,
          landing_page_id: campaign.landingPageId,
          scheduled_start_at: campaign.scheduledStartAt,
          status: campaign.status,
          send_now: campaign.sendNow,
          profile_ids: campaign.userIds,
          group_ids: campaign.groupIds,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update campaign');
      }
      const data = await response.json();
      const index = campaignStore.campaigns.findIndex((c: any) => c.id === id);
      if (index !== -1) campaignStore.campaigns[index] = data;
      return { success: true, data };
    } catch (err: any) {
      campaignStore.error = 'Error updating campaign';
      return { success: false, error: err.message };
    } finally {
      campaignStore.updating = false;
    }
  };

  const deleteCampaign = async (id: number) => {
    campaignStore.deleting = true;
    try {
      const response = await fetch(`${apiUrl}/campaign/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }
      campaignStore.campaigns = campaignStore.campaigns.filter((c: any) => c.id !== id);
      return { success: true };
    } catch (err: any) {
      campaignStore.error = 'Error deleting campaign';
      return { success: false, error: err.message };
    } finally {
      campaignStore.deleting = false;
    }
  };

  return {
    campaigns: computed(() => campaignStore.campaigns),
    fetching: computed(() => campaignStore.fetching),
    error: campaignStore.error,
    createForm: campaignStore.createForm,
    editForm: campaignStore.editForm,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
};
