import { useRolesStore } from "@/stores/useRolesStore";


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
    
    return {
        roles: rolesStore.roles,
        loading: rolesStore.loading,
        error: rolesStore.error,
        fetchRoles,
    };
}