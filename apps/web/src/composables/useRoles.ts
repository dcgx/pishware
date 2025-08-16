import { useRolesStore } from "@/stores/useRolesStore";
import { computed } from "vue";


export const useRoles = () => {
    const rolesStore = useRolesStore();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    const fetchRoles = async () => {
        rolesStore.loading = true;
        try {
        const response = await fetch(`${apiUrl}/roles`);
        const data = await response.json();
        rolesStore.setRoles(data);
        } catch (err) {
        rolesStore.error = 'Failed to fetch roles';
        } finally {
        rolesStore.loading = false;
        }
    };

    const createRole = async (role) => {
        rolesStore.creating = true;
        rolesStore.error = '';
        try {
            const response = await fetch(`${apiUrl}/roles/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(role),
            });
            if (!response.ok) {
                throw new Error('Failed to create role');
            }
            const data = await response.json();
            rolesStore.addRole(data);
            return { success: true };
        } catch (err) {
            rolesStore.error = 'Error creating role';
            return { success: false, error: err.message };
        } finally {
            rolesStore.creating = false;
        }
    };
    
    return {
        roles: computed(() => rolesStore.roles),
        loading: computed(() => rolesStore.loading),
        creating: computed(() => rolesStore.creating),
        error: rolesStore.error,
        fetchRoles,
        createRole,
    };
}