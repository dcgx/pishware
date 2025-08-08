
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLandingPagesStore = defineStore('landingPages', () => {
    const landingPages = ref();

    const createForm = ref({
        name: '',
    });
    const editForm = ref({
        name: '',
    });

    const loading = ref(false);
    const error = ref('');
    const creating = ref(false);


    return {
        landingPages,
        loading,
        error,
        creating,
        createForm,
        editForm,
    };
})