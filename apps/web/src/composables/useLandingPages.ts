import { useLandingPagesStore } from "@/stores/useLandingPagesStore";
import LandingPages from "@/views/LandingPages.vue";
import { computed } from "vue";

export const useLandingPages = () => {
    const landingPagesStore = useLandingPagesStore();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const fetchLandingPages = async () => {
        landingPagesStore.loading = true;
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
            landingPagesStore.loading = false;
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

    return {
        ...landingPagesStore,
        landingPages: computed(() => landingPagesStore.landingPages),
        fetchLandingPages,
        createLandingPage,
    };
}