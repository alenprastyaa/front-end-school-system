import { defineStore } from "pinia";
import { api } from "@/api";
import { getStoredUser, normalizeRole, updateStoredUser } from "@/utils/auth";
import { normalizePublicUrl } from "@/utils/url";

const PROFILE_TTL = 5 * 60 * 1000;
const PROFILE_RETRY_DELAY_MS = 250;

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

export const useProfileStore = defineStore("profile", {
  state: () => ({
      profile: {
        full_name: "",
        username: "User",
        role: "Guest",
        school_name: "",
        school_id: "",
        school_logo: "",
        attendance_latitude: null,
        attendance_longitude: null,
        attendance_radius_meters: null,
        attendance_late_after_time: "",
        attendance_checkout_deadline: "",
        inventory_module_enabled: true,
        attendance_module_enabled: true,
        official_exam_module_enabled: true,
        koperasi_module_enabled: true,
        private_chat_module_enabled: true,
        teaching_module_ai_enabled: true,
        personal_teacher_mode_enabled: false,
      parent_email: "",
      phone_number: "",
      profile_image: "",
      face_reference_image: "",
      face_reference_descriptor: "",
    },
    loadedAt: 0,
    loading: false,
    inFlight: null,
  }),

  actions: {
    resetProfileState() {
      this.$reset();
    },

    hydrateFromStorage() {
      this.profile = {
        ...this.profile,
        ...{
          ...(getStoredUser() || {}),
          role: normalizeRole(getStoredUser()?.role || this.profile.role),
        },
      };
    },

    applyProfile(profile = {}) {
      const hasProfileKey = (key) => Object.prototype.hasOwnProperty.call(profile, key);
      const nextProfile = {
        ...this.profile,
        ...profile,
        role: normalizeRole(profile.role || this.profile.role),
        school_logo: hasProfileKey("school_logo") ? normalizePublicUrl(profile.school_logo) || null : this.profile.school_logo,
        attendance_latitude: hasProfileKey("attendance_latitude") ? profile.attendance_latitude ?? null : this.profile.attendance_latitude,
        attendance_longitude: hasProfileKey("attendance_longitude") ? profile.attendance_longitude ?? null : this.profile.attendance_longitude,
        attendance_radius_meters: hasProfileKey("attendance_radius_meters") ? profile.attendance_radius_meters ?? null : this.profile.attendance_radius_meters,
        attendance_late_after_time: hasProfileKey("attendance_late_after_time") ? profile.attendance_late_after_time || "" : this.profile.attendance_late_after_time,
        attendance_checkout_deadline: hasProfileKey("attendance_checkout_deadline") ? profile.attendance_checkout_deadline || "" : this.profile.attendance_checkout_deadline,
        inventory_module_enabled: hasProfileKey("inventory_module_enabled") ? profile.inventory_module_enabled !== false : this.profile.inventory_module_enabled !== false,
        attendance_module_enabled: hasProfileKey("attendance_module_enabled") ? profile.attendance_module_enabled !== false : this.profile.attendance_module_enabled !== false,
        official_exam_module_enabled: hasProfileKey("official_exam_module_enabled") ? profile.official_exam_module_enabled !== false : this.profile.official_exam_module_enabled !== false,
        koperasi_module_enabled: hasProfileKey("koperasi_module_enabled") ? profile.koperasi_module_enabled !== false : this.profile.koperasi_module_enabled !== false,
        private_chat_module_enabled: hasProfileKey("private_chat_module_enabled") ? profile.private_chat_module_enabled !== false : this.profile.private_chat_module_enabled !== false,
        teaching_module_ai_enabled: hasProfileKey("teaching_module_ai_enabled") ? profile.teaching_module_ai_enabled !== false : this.profile.teaching_module_ai_enabled !== false,
        personal_teacher_mode_enabled: hasProfileKey("personal_teacher_mode_enabled") ? profile.personal_teacher_mode_enabled === true : this.profile.personal_teacher_mode_enabled === true,
        profile_image: hasProfileKey("profile_image") ? normalizePublicUrl(profile.profile_image) || null : this.profile.profile_image,
        face_reference_image: hasProfileKey("face_reference_image") ? normalizePublicUrl(profile.face_reference_image) || null : this.profile.face_reference_image,
        face_reference_descriptor: hasProfileKey("face_reference_descriptor") ? profile.face_reference_descriptor || null : this.profile.face_reference_descriptor,
      };

      this.profile = nextProfile;
      updateStoredUser({
        username: nextProfile.username,
        role: nextProfile.role,
        school_id: nextProfile.school_id,
        school_name: nextProfile.school_name,
        school_logo: nextProfile.school_logo,
        attendance_latitude: nextProfile.attendance_latitude,
        attendance_longitude: nextProfile.attendance_longitude,
        attendance_radius_meters: nextProfile.attendance_radius_meters,
        attendance_late_after_time: nextProfile.attendance_late_after_time,
        attendance_checkout_deadline: nextProfile.attendance_checkout_deadline,
        inventory_module_enabled: nextProfile.inventory_module_enabled,
        attendance_module_enabled: nextProfile.attendance_module_enabled,
        official_exam_module_enabled: nextProfile.official_exam_module_enabled,
        koperasi_module_enabled: nextProfile.koperasi_module_enabled,
        private_chat_module_enabled: nextProfile.private_chat_module_enabled,
        teaching_module_ai_enabled: nextProfile.teaching_module_ai_enabled,
        personal_teacher_mode_enabled: nextProfile.personal_teacher_mode_enabled,
        profile_image: nextProfile.profile_image,
        face_reference_image: nextProfile.face_reference_image,
        face_reference_descriptor: nextProfile.face_reference_descriptor,
      });
      this.loadedAt = Date.now();
      return nextProfile;
    },

    async loadProfile({ force = false } = {}) {
      const storedUser = getStoredUser();
      const activeUsername = storedUser?.username || "";
      const cachedUsername = this.profile?.username || "";
      const isSameSessionUser = activeUsername && cachedUsername && activeUsername === cachedUsername;

      if (!force && isSameSessionUser && this.loadedAt && Date.now() - this.loadedAt < PROFILE_TTL) {
        return this.profile;
      }

      if (this.inFlight) {
        return this.inFlight;
      }

      this.loading = true;
      this.inFlight = (async () => {
        try {
          let response;
          try {
            response = await api.get("/auth/profile", {
              suppressAuthRedirect: true,
            });
          } catch (error) {
            const shouldRetry = Number(error?.status || 0) === 401 && Boolean(localStorage.getItem("token"));
            if (!shouldRetry) {
              throw error;
            }

            await wait(PROFILE_RETRY_DELAY_MS);
            response = await api.get("/auth/profile");
          }
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
