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
            const response = await new Promise(resolve => setTimeout(() => resolve(landingPage), 1000));
            landingPagesStore.landingPages.push(response);
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