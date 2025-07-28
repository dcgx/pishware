

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGroupsStore = defineStore('groups', () => {
    const groups = ref([]);
    const loading = ref(false);
    const error = ref('');
    const creating = ref(false);

    const setGroups = (data: any) => { groups.value = data; };

    const addGroup = (group: any) => { groups.value.push(group); };

    return {
        groups,
        loading,
        error,
        creating,
        setGroups,
        addGroup,
    };
});