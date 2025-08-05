
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useEmailTemplatesStore = defineStore('emailTemplates', () => {
    const emailTemplates = ref([]);

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


    return {
        emailTemplates,
        loading,
        error,
        creating,
    };
})