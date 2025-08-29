
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLandingPagesStore = defineStore('landingPages', () => {
    const landingPages = ref();

    const createForm = ref({
        name: '',
        htmlContent: '',
        redirectUrl: '',
        importedUrl: '',
        captureSubmittedData: false,
        capturePassword: false,
    });
    const editForm = ref({
        id: '',
        name: '',
        htmlContent: '',
        redirectUrl: '',
        captureSubmittedData: false,
        capturePassword: false,
    });
    
    const fetching = ref(false);
    const loading = ref(false);
    const error = ref('');
    const creating = ref(false);


    return {
        landingPages,
        loading,
        fetching,
        error,
        creating,
        createForm,
        editForm,
    };
})