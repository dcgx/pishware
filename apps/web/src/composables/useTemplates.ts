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
        error: templatesStore.error,
        createForm: templatesStore.createForm,
        editForm: templatesStore.editForm,
        showImportEmailDialog: templatesStore.showImportEmailDialog,
        fetchTemplates,
        getTemplate,
        createTemplate,
        uploadAttachment,
    };
}
