
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useEmailTemplatesStore = defineStore('emailTemplates', () => {
    const emailTemplates = ref();

    const loading = ref(false);
    const error = ref('');
    const creating = ref(false);
    const updating = ref(false);
    const deleting = ref(false);

    return {
        emailTemplates,
        loading,
        error,
        creating,
        updating,
        deleting,
    };
})