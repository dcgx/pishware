import { computed } from "vue";
import { useGroupsStore } from "@/stores/useGroupsStore";


export const useGroups = () => {
    const groupsStore = useGroupsStore();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const fetchGroups = async () => {
        groupsStore.loading = true;
        try {
            const response = await fetch(`${apiUrl}/groups`);
            const data = await response.json();
            groupsStore.setGroups(data);
        } catch (err) {
            groupsStore.error = 'Failed to fetch groups';
        } finally {
            groupsStore.loading = false;
        }
    };

    const createGroup = async (group) => {
        groupsStore.creating = true;
        groupsStore.error = '';
        try {
            const response = await fetch(`${apiUrl}/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(group),
            });
            if (!response.ok) {
                throw new Error('Failed to create group');
            }
            const data = await response.json();
            groupsStore.addGroup(data);
            return { success: true };
        } catch (err) {
            groupsStore.error = 'Error creating group';
            return { success: false, error: err.message };
        } finally {
            groupsStore.creating = false;
        }
    };

    return {
        groups: computed(() => groupsStore.groups),
        loading: computed(() => groupsStore.loading),
        creating: computed(() => groupsStore.creating),
        error: groupsStore.error,
        fetchGroups,
        createGroup,
    };
}