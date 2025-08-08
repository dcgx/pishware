
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useEmailTemplatesStore = defineStore('emailTemplates', () => {
    const emailTemplates = ref([
        {
            id: 1,
            name: 'Notificación canva',
            subject: 'Notificaciones recientes de Canvas',
            content: '',
            contentType: 'text',
            createdBy: {
                id: 1,
                name: 'Juan Perez',
                email: 'tt@tt.tt'
            }
        },
        {
            id: 2,
            name: 'Notificación de prueba',
            subject: 'Notificación de prueba',
            content: '',
            contentType: 'text',
            createdBy: {
                id: 1,
                name: 'Juan Perez',
                email: ''
            }
        },
        {
            id: 3,
            name: 'Notificación de prueba HTML',
            subject: 'Notificación de prueba HTML',
            content: '',
            contentType: 'html',
            createdBy: {
                id: 1,
                name: 'Juan Perez',
                email: ''
            }
        }
    ]);

    const createForm = ref({
        subject: '',
        body: '',
        type: '',
    });
    const editForm = ref({
        id: '',
        subject: '',
        body: '',
        type: '',
    });

    const showImportEmailDialog = ref(false);

    const loading = ref(false);
    const error = ref('');
    const creating = ref(false);


    const fetchTemplates = async () => {
        loading.value = true;
        error.value = '';
        try {
            console.log('Fetching email templates...');
        } catch (err) {
            console.error('Error fetching email templates:', err);
            error.value = 'Failed to fetch email templates';
        } finally {
            loading.value = false;
        }
    };

    return {
        emailTemplates,
        loading,
        error,
        creating,
        createForm,
        editForm,
        showImportEmailDialog,
        fetchTemplates,
    };
})