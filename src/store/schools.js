import { defineStore } from "pinia";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { normalizePublicUrl } from "@/utils/url";

const baseSchoolForm = () => ({
  name: "",
  inventory_module_enabled: true,
  attendance_module_enabled: true,
  attendance_teacher_module_enabled: true,
  attendance_latitude: "",
  attendance_longitude: "",
  attendance_radius_meters: "",
  attendance_late_after_time: "",
  attendance_checkout_deadline: "",
  official_exam_module_enabled: true,
  koperasi_module_enabled: true,
  private_chat_module_enabled: true,
  teaching_module_ai_enabled: true,
  personal_teacher_mode_enabled: false,
});

const baseAdminForm = () => ({
  school_id: "",
  full_name: "",
  username: "",
  password: "",
  parent_email: "",
  phone_number: "",
});

const baseAdminFilters = () => ({
  school_id: "",
  search: "",
});

export const useSchoolStore = defineStore("schools", {
  state: () => ({
    schools: [],
    adminUsers: [],
    isLoadingSchools: false,
    isLoadingAdmins: false,
    isSubmittingSchool: false,
    isSubmittingAdmin: false,
    deletingId: null,
    deletingAdminId: null,
    editingId: null,
    adminEditingId: null,
    message: "",
    isError: false,
    form: baseSchoolForm(),
    schoolLogoFile: null,
    schoolLogoPreview: "",
    removeSchoolLogo: false,
    showLocationPicker: false,
    adminForm: baseAdminForm(),
    adminFilters: baseAdminFilters(),
  }),

  getters: {
    summaryCards: (state) => {
      const totalSchools = state.schools.length;
      const totalAdmins = state.schools.reduce((sum, item) => sum + Number(item.total_admins || 0), 0);
      const totalStudents = state.schools.reduce((sum, item) => sum + Number(item.total_students || 0), 0);
      const totalCurriculum = state.schools.reduce((sum, item) => sum + Number(item.total_curriculum_subjects || 0), 0);

      return [
        { label: "Total Sekolah", value: totalSchools, caption: "Unit sekolah terdaftar." },
        { label: "Total Admin", value: totalAdmins, caption: "Admin sekolah aktif." },
        { label: "Total Siswa", value: totalStudents, caption: "Siswa seluruh sekolah." },
        { label: "Mapel Kurikulum", value: totalCurriculum, caption: "Master kurikulum seluruh sekolah." },
      ];
    },
  },

  actions: {
    resetSchoolForm() {
      this.editingId = null;
      this.form = baseSchoolForm();
      this.schoolLogoFile = null;
      this.schoolLogoPreview = "";
      this.removeSchoolLogo = false;
    },

    resetAdminForm() {
      this.adminEditingId = null;
      this.adminForm = baseAdminForm();
    },

    setSchoolLogoFile(file) {
      this.schoolLogoFile = file || null;
      this.removeSchoolLogo = false;
      if (!file) {
        this.schoolLogoPreview = this.editingId
          ? normalizePublicUrl(this.schools.find((item) => item.id === this.editingId)?.logo_url) || ""
          : "";
        return;
      }
      this.schoolLogoPreview = URL.createObjectURL(file);
    },

    setRemoveSchoolLogo(value) {
      this.removeSchoolLogo = Boolean(value);
      if (this.removeSchoolLogo && !this.schoolLogoFile) {
        this.schoolLogoPreview = "";
        return;
      }
      if (!this.schoolLogoFile) {
        this.schoolLogoPreview = this.editingId
          ? normalizePublicUrl(this.schools.find((item) => item.id === this.editingId)?.logo_url) || ""
          : "";
      }
    },

    async resetAdminFilters() {
      this.adminFilters = baseAdminFilters();
      await this.loadAdminUsers();
    },

    async loadSchools() {
      this.isLoadingSchools = true;
      try {
        const response = await api.get("/school");
        this.schools = Array.isArray(response?.data?.items)
          ? response.data.items.map((item) => ({
              ...item,
              inventory_module_enabled: item.inventory_module_enabled !== false,
              attendance_module_enabled: item.attendance_module_enabled !== false,
              attendance_teacher_module_enabled: item.attendance_teacher_module_enabled !== false,
              attendance_late_after_time: item.attendance_late_after_time || "",
              attendance_checkout_deadline: item.attendance_checkout_deadline || "",
              official_exam_module_enabled: item.official_exam_module_enabled !== false,
              koperasi_module_enabled: item.koperasi_module_enabled !== false,
              private_chat_module_enabled: item.private_chat_module_enabled !== false,
              teaching_module_ai_enabled: item.teaching_module_ai_enabled !== false,
              personal_teacher_mode_enabled: item.personal_teacher_mode_enabled === true,
            }))
          : [];
      } catch (error) {
        this.isError = true;
        this.message = error.message || "Gagal memuat data sekolah.";
      } finally {
        this.isLoadingSchools = false;
      }
    },

    async loadAdminUsers() {
      this.isLoadingAdmins = true;
      try {
        const response = await api.get("/auth/super-admin/admin-users", {
          params: {
            school_id: this.adminFilters.school_id || undefined,
            search: this.adminFilters.search || undefined,
          },
        });
        this.adminUsers = Array.isArray(response?.data?.items) ? response.data.items : [];
      } catch (error) {
        pushToast({
          title: "Gagal Memuat Admin Sekolah",
          message: error.message || "Data admin sekolah tidak berhasil dimuat.",
          type: "error",
        });
      } finally {
        this.isLoadingAdmins = false;
      }
    },

    async initialize() {
      await Promise.all([this.loadSchools(), this.loadAdminUsers()]);
    },

    async submitSchool() {
      this.isSubmittingSchool = true;
      this.isError = false;
      this.message = "";

      try {
        const payload = new FormData();
        payload.append("name", this.form.name);
        payload.append("inventory_module_enabled", String(Boolean(this.form.inventory_module_enabled)));
        payload.append("attendance_module_enabled", String(Boolean(this.form.attendance_module_enabled)));
        payload.append("attendance_teacher_module_enabled", String(Boolean(this.form.attendance_teacher_module_enabled)));
        if (String(this.form.attendance_latitude || "").trim() !== "") {
          payload.append("attendance_latitude", String(this.form.attendance_latitude).trim());
        } else if (this.editingId) {
          payload.append("clear_attendance_latitude", "true");
        }
        if (String(this.form.attendance_longitude || "").trim() !== "") {
          payload.append("attendance_longitude", String(this.form.attendance_longitude).trim());
        } else if (this.editingId) {
          payload.append("clear_attendance_longitude", "true");
        }
        if (String(this.form.attendance_radius_meters || "").trim() !== "") {
          payload.append("attendance_radius_meters", String(this.form.attendance_radius_meters).trim());
        } else if (this.editingId) {
          payload.append("clear_attendance_radius_meters", "true");
        }
        if (String(this.form.attendance_late_after_time || "").trim() !== "") {
          payload.append("attendance_late_after_time", String(this.form.attendance_late_after_time).trim());
        } else if (this.editingId) {
          payload.append("clear_attendance_late_after_time", "true");
        }
        if (String(this.form.attendance_checkout_deadline || "").trim() !== "") {
          payload.append("attendance_checkout_deadline", String(this.form.attendance_checkout_deadline).trim());
        } else if (this.editingId) {
          payload.append("clear_attendance_checkout_deadline", "true");
        }
        payload.append("koperasi_module_enabled", String(Boolean(this.form.koperasi_module_enabled)));
        payload.append("private_chat_module_enabled", String(Boolean(this.form.private_chat_module_enabled)));
        payload.append("official_exam_module_enabled", String(Boolean(this.form.official_exam_module_enabled)));
        payload.append("teaching_module_ai_enabled", String(Boolean(this.form.teaching_module_ai_enabled)));
        payload.append("personal_teacher_mode_enabled", String(Boolean(this.form.personal_teacher_mode_enabled)));
        if (this.schoolLogoFile) {
          payload.append("logo", this.schoolLogoFile);
        }
        if (this.editingId && this.removeSchoolLogo && !this.schoolLogoFile) {
          payload.append("remove_logo", "true");
        }

        const response = this.editingId
          ? await api.put(`/school/${this.editingId}`, payload)
          : await api.post("/school", payload);

        this.message = response?.message || "Sekolah berhasil disimpan.";
        this.resetSchoolForm();
        await this.loadSchools();
        return response;
      } catch (error) {
        this.isError = true;
        this.message = error.message || "Gagal menyimpan sekolah.";
        throw error;
      } finally {
        this.isSubmittingSchool = false;
      }
    },

    editSchool(item) {
      this.editingId = item.id;
      this.form = {
        name: item.name || "",
        inventory_module_enabled: item.inventory_module_enabled !== false,
        attendance_module_enabled: item.attendance_module_enabled !== false,
        attendance_teacher_module_enabled: item.attendance_teacher_module_enabled !== false,
        attendance_latitude: item.attendance_latitude == null ? "" : String(item.attendance_latitude),
        attendance_longitude: item.attendance_longitude == null ? "" : String(item.attendance_longitude),
        attendance_radius_meters: item.attendance_radius_meters == null ? "" : String(item.attendance_radius_meters),
        attendance_late_after_time: item.attendance_late_after_time || "",
        attendance_checkout_deadline: item.attendance_checkout_deadline || "",
        official_exam_module_enabled: item.official_exam_module_enabled !== false,
        koperasi_module_enabled: item.koperasi_module_enabled !== false,
        private_chat_module_enabled: item.private_chat_module_enabled !== false,
        teaching_module_ai_enabled: item.teaching_module_ai_enabled !== false,
        personal_teacher_mode_enabled: item.personal_teacher_mode_enabled === true,
      };
      this.schoolLogoFile = null;
      this.schoolLogoPreview = normalizePublicUrl(item.logo_url) || "";
      this.removeSchoolLogo = false;
      this.message = "";
      this.isError = false;
    },

    async deleteSchool(item) {
      if (!item?.id) return null;
      this.deletingId = item.id;
      this.isError = false;
      this.message = "";
      try {
        const response = await api.delete(`/school/${item.id}`);
        this.message = response?.message || "Sekolah berhasil dihapus.";
        if (this.editingId === item.id) {
          this.resetSchoolForm();
        }
        await Promise.all([this.loadSchools(), this.loadAdminUsers()]);
        return response;
      } catch (error) {
        this.isError = true;
        this.message = error.message || "Gagal menghapus sekolah.";
        throw error;
      } finally {
        this.deletingId = null;
      }
    },

    async submitAdminUser() {
      this.isSubmittingAdmin = true;
      try {
        const payload = {
          school_id: Number(this.adminForm.school_id),
          full_name: this.adminForm.full_name || null,
          username: this.adminForm.username,
          parent_email: this.adminForm.parent_email || null,
          phone_number: this.adminForm.phone_number || null,
        };

        if (this.adminForm.password) {
          payload.password = this.adminForm.password;
        }

        const response = this.adminEditingId
          ? await api.put(`/auth/super-admin/admin-users/${this.adminEditingId}`, payload)
          : await api.post("/auth/super-admin/admin-users", { ...payload, password: this.adminForm.password });

        this.resetAdminForm();
        await Promise.all([this.loadSchools(), this.loadAdminUsers()]);
        return response;
      } catch (error) {
        pushToast({
          title: this.adminEditingId ? "Gagal Mengubah Admin Sekolah" : "Gagal Membuat Admin Sekolah",
          message: error.message || "Perubahan admin sekolah gagal disimpan.",
          type: "error",
        });
        throw error;
      } finally {
        this.isSubmittingAdmin = false;
      }
    },

    editAdminUser(item) {
      this.adminEditingId = item.id;
      this.adminForm = {
        school_id: item.school_id ? String(item.school_id) : "",
        full_name: item.full_name || "",
        username: item.username || "",
        password: "",
        parent_email: item.parent_email || "",
        phone_number: item.phone_number || "",
      };
    },

    async deleteAdminUser(item) {
      if (!item?.id) return null;
      this.deletingAdminId = item.id;
      try {
        const response = await api.delete(`/auth/super-admin/admin-users/${item.id}`);
        if (this.adminEditingId === item.id) {
          this.resetAdminForm();
        }
        await Promise.all([this.loadSchools(), this.loadAdminUsers()]);
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Menghapus Admin Sekolah",
          message: error.message || "Admin sekolah gagal dihapus.",
          type: "error",
        });
        throw error;
      } finally {
        this.deletingAdminId = null;
      }
    },
  },
});
