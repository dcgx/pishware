import { useEmailTemplatesStore } from "@/stores/useEmailTemplatesStore";
import { computed } from "vue";

export const useTemplates = () => {
    const templatesStore = useEmailTemplatesStore();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const fetchTemplates = async () => {
        templatesStore.loading = true;
        try {
            const response = await fetch(`${apiUrl}/templates`);
            const data = await response.json();
            templatesStore.emailTemplates = data;
        } catch (err) {
            templatesStore.error = 'Failed to fetch templates';
        } finally {
            templatesStore.loading = false;
        }
    };

    const getTemplate = async (id: number) => {
        templatesStore.loading = true;
        try {
            const response = await fetch(`${apiUrl}/templates/${id}`);
            const data = await response.json();
            return data;
        } catch (err) {
            templatesStore.error = 'Failed to fetch template';
            return null;
        } finally {
            templatesStore.loading = false;
        }
    };

    const createTemplate = async (template: any) => {
        templatesStore.creating = true;
        templatesStore.error = '';
        try {
            const response = await fetch(`${apiUrl}/templates/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(template),
            });
            if (!response.ok) {
                throw new Error('Failed to create template');
            }
            const data = await response.json();
            templatesStore.emailTemplates.push(data);
            return { success: true, data };
        } catch (err) {
            templatesStore.error = 'Error creating template';
            return { success: false, error: err.message };
        } finally {
            templatesStore.creating = false;
        }
    };

    const updateTemplate = async (id: number, template: any) => {
        templatesStore.updating = true;
        try {
            const response = await fetch(`${apiUrl}/templates/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(template),
            });
            if (!response.ok) {
                throw new Error('Failed to update template');
            }
            const data = await response.json();
            const index = templatesStore.emailTemplates.findIndex((t: any) => t.id === id);
            if (index !== -1) templatesStore.emailTemplates[index] = data;
            return { success: true, data };
        } catch (err: any) {
            templatesStore.error = 'Error updating template';
            return { success: false, error: err.message };
        } finally {
            templatesStore.updating = false;
        }
    };

    const deleteTemplate = async (id: number) => {
        templatesStore.deleting = true;
        try {
            const response = await fetch(`${apiUrl}/templates/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete template');
            }
            templatesStore.emailTemplates = templatesStore.emailTemplates.filter((t: any) => t.id !== id);
            return { success: true };
        } catch (err: any) {
            templatesStore.error = 'Error deleting template';
            return { success: false, error: err.message };
        } finally {
            templatesStore.deleting = false;
        }
    };

    const uploadAttachment = async (templateId: number, file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`${apiUrl}/templates/${templateId}/attachment/upload`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to upload attachment');
            }
            const data = await response.json();
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return {
        emailTemplates: computed(() => templatesStore.emailTemplates),
        loading: templatesStore.loading,
        creating: templatesStore.creating,
        updating: templatesStore.updating,
        deleting: templatesStore.deleting,
        error: templatesStore.error,
        fetchTemplates,
        getTemplate,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        uploadAttachment,
    };
}
