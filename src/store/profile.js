import { defineStore } from "pinia";
import { api } from "@/api";
import { getStoredUser, updateStoredUser } from "@/utils/auth";
import { normalizePublicUrl } from "@/utils/url";

const PROFILE_TTL = 5 * 60 * 1000;

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profile: {
      full_name: "",
      username: "User",
      role: "Guest",
      school_name: "",
      school_id: "",
      parent_email: "",
      phone_number: "",
      profile_image: "",
    },
    loadedAt: 0,
    loading: false,
    inFlight: null,
  }),

  actions: {
    hydrateFromStorage() {
      this.profile = {
        ...this.profile,
        ...(getStoredUser() || {}),
      };
    },

    applyProfile(profile = {}) {
      const nextProfile = {
        ...this.profile,
        ...profile,
        profile_image: normalizePublicUrl(profile.profile_image) || null,
      };

      this.profile = nextProfile;
      updateStoredUser({
        username: nextProfile.username,
        role: nextProfile.role,
        school_id: nextProfile.school_id,
        school_name: nextProfile.school_name,
        profile_image: nextProfile.profile_image,
      });
      this.loadedAt = Date.now();
      return nextProfile;
    },

    async loadProfile({ force = false } = {}) {
      if (!force && this.loadedAt && Date.now() - this.loadedAt < PROFILE_TTL) {
        return this.profile;
      }

      if (this.inFlight) {
        return this.inFlight;
      }

      this.loading = true;
      this.inFlight = (async () => {
        try {
          const response = await api.get("/auth/profile");
          const profile = response?.data || {};
          return this.applyProfile(profile);
        } catch (error) {
          this.hydrateFromStorage();
          throw error;
        } finally {
          this.loading = false;
          this.inFlight = null;
        }
      })();

      return this.inFlight;
    },

    async saveProfile(formData) {
      const response = await api.put("/auth/profile", formData);
      const profile = response?.data || {};
      this.applyProfile(profile);
      return response;
    },
  },
});
