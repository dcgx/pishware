import { useLandingPagesStore } from "@/stores/useLandingPagesStore";
import { computed } from "vue";

export const useLandingPages = () => {
    const landingPagesStore = useLandingPagesStore();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const fetchLandingPages = async () => {
        landingPagesStore.fetching = true;
        try {
            const response = await fetch(`${apiUrl}/landing-pages`);
            if (!response.ok) {
                throw new Error("Failed to fetch landing pages");
            }
            const data = await response.json();
            landingPagesStore.landingPages = data;
        } catch (err) {
            landingPagesStore.error = 'Failed to fetch landing pages';
        } finally {
            landingPagesStore.fetching = false;
        }
    };

    const fetchLandingPage = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/landing-pages/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch landing page');
            }
            return await response.json();
        } catch (err) {
            landingPagesStore.error = 'Failed to fetch landing page';
            throw err;
        }
    };

    const createLandingPage = async (landingPage) => {
        landingPagesStore.loading = true;
        try {
            const response = await fetch(`${apiUrl}/landing-pages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(landingPage),
            });

            if (!response.ok) {
                throw new Error("Failed to create landing page");
            }

            const newLandingPage = await response.json();
            landingPagesStore.landingPages.push(newLandingPage);
            landingPagesStore.createForm = {
                name: '',
                htmlContent: '',
                redirectUrl: '',
                importedUrl: '',
                captureSubmittedData: false,
                capturePassword: false,
            };
        } catch (err) {
            landingPagesStore.error = 'Failed to create landing page';
        } finally {
            landingPagesStore.loading = false;
        }
    };

    const getLandingPage = async (id: string) => {
        const response = await fetch(`${apiUrl}/landing-pages/${id}`);
        if (!response.ok) throw new Error('Failed to fetch landing page');
        return await response.json();
    };

    const updateLandingPage = async (id: string, landingPage) => {
        landingPagesStore.loading = true;
        try {
            const response = await fetch(`${apiUrl}/landing-pages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(landingPage),
            });
            if (!response.ok) throw new Error('Failed to update landing page');
            const updated = await response.json();
            const index = landingPagesStore.landingPages.findIndex(l => l.id === id);
            if (index !== -1) landingPagesStore.landingPages[index] = updated;
        } catch (err) {
            landingPagesStore.error = 'Failed to update landing page';
        } finally {
            landingPagesStore.loading = false;
        }
    };

    const deleteLandingPage = async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/landing-pages/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete landing page');
            landingPagesStore.landingPages = landingPagesStore.landingPages.filter(l => l.id !== id);
        } catch (err) {
            landingPagesStore.error = 'Failed to delete landing page';
        }
    };

    return {
        ...landingPagesStore,
        fetching: computed(() => landingPagesStore.fetching),
        landingPages: computed(() => landingPagesStore.landingPages),
        fetchLandingPages,
        fetchLandingPage,
        createLandingPage,
        getLandingPage,
        updateLandingPage,
        deleteLandingPage,
    };
}