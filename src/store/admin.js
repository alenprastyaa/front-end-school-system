import { defineStore } from "pinia";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { useMasterDataStore } from "@/store/masterData";

const baseUserForm = () => ({
  full_name: "",
  username: "",
  password: "",
  role: "GURU",
  parent_email: "",
  phone_number: "",
});

const baseClassForm = () => ({
  className: "",
  waliGuruId: "",
});

const baseYearForm = () => ({
  name: "",
  start_date: "",
  end_date: "",
});

const baseSemesterForm = () => ({
  name: "",
  code: "",
  start_date: "",
  end_date: "",
});

const compareText = (a, b, direction = "asc") => {
  const left = String(a ?? "").toLowerCase();
  const right = String(b ?? "").toLowerCase();
  if (left === right) return 0;
  const order = left > right ? 1 : -1;
  return direction === "desc" ? -order : order;
};

export const useAdminStore = defineStore("admin", {
  state: () => ({
    schoolUsers: [],
    schoolUsersTotal: 0,
    schoolUsersPage: 1,
    schoolUsersPageSize: 10,
    schoolUsersLoading: false,
    schoolUsersSubmitting: false,
    schoolUsersImportingGuru: false,
    schoolUsersDeleting: false,
    schoolUsersResettingPassword: false,
    schoolUsersShowModal: false,
    schoolUsersEditingId: null,
    schoolUsersForm: baseUserForm(),
    schoolUsersDeleteModalOpen: false,
    schoolUsersToDelete: null,
    schoolUsersDetailModalOpen: false,
    schoolUsersDetail: null,
    schoolUsersResetConfirmOpen: false,
    schoolUsersResetTargetId: null,
    schoolUsersResetTargetLabel: "",
    schoolUsersSortKey: "full_name",
    schoolUsersSortDirection: "asc",

    classes: [],
    classesTotal: 0,
    classesPage: 1,
    classesPageSize: 10,
    classesTeachers: [],
    classesLoading: false,
    classesSubmitting: false,
    classesDeleting: false,
    classesShowModal: false,
    classesEditingId: null,
    classesForm: baseClassForm(),
    classesDeleteModalOpen: false,
    classesToDelete: null,
    classesSortKey: "class_name",
    classesSortDirection: "asc",

    academicYears: [],
    academicActivePeriod: null,
    academicLoading: false,
    academicSubmitting: false,
    academicYearModalOpen: false,
    academicSemesterModalOpen: false,
    academicYearConfirmOpen: false,
    academicSemesterConfirmOpen: false,
    academicPendingYear: null,
    academicPendingSemester: null,
    academicEditingYearId: null,
    academicEditingSemesterId: null,
    academicSelectedYear: null,
    academicYearForm: baseYearForm(),
    academicSemesterForm: baseSemesterForm(),
  }),

  getters: {
    schoolUsersTotalPages: (state) =>
      Math.max(1, Math.ceil(Number(state.schoolUsersTotal || 0) / Number(state.schoolUsersPageSize || 10))),
    schoolUsersSorted: (state) => {
      const items = Array.isArray(state.schoolUsers) ? [...state.schoolUsers] : [];
      const key = state.schoolUsersSortKey;
      const direction = state.schoolUsersSortDirection;
      return items.sort((left, right) => {
        switch (key) {
          case "full_name":
            return compareText(left.full_name || left.username, right.full_name || right.username, direction);
          case "username":
            return compareText(left.username, right.username, direction);
          case "role":
            return compareText(left.role, right.role, direction);
          case "parent_email":
            return compareText(left.parent_email, right.parent_email, direction);
          case "phone_number":
            return compareText(left.phone_number, right.phone_number, direction);
          default:
            return 0;
        }
      });
    },
    schoolUsersPaginated: (state) => state.schoolUsersSorted,

    classesTotalPages: (state) =>
      Math.max(1, Math.ceil(Number(state.classesTotal || 0) / Number(state.classesPageSize || 10))),
    classesSorted: (state) => {
      const items = Array.isArray(state.classes) ? [...state.classes] : [];
      const key = state.classesSortKey;
      const direction = state.classesSortDirection;
      return items.sort((left, right) => {
        switch (key) {
          case "class_name":
            return compareText(left.class_name, right.class_name, direction);
          case "wali_guru_name":
            return compareText(left.wali_guru_name, right.wali_guru_name, direction);
          default:
            return 0;
        }
      });
    },
    classesPaginated: (state) => state.classesSorted,

    academicTotalSemesters: (state) =>
      state.academicYears.reduce((total, item) => total + Number(item.semesters?.length || 0), 0),
  },

  actions: {
    // School Users
    resetSchoolUsersForm() {
      this.schoolUsersForm = baseUserForm();
      this.schoolUsersEditingId = null;
    },

    closeSchoolUsersModal() {
      this.schoolUsersShowModal = false;
      this.resetSchoolUsersForm();
    },

    openSchoolUsersCreateModal() {
      this.resetSchoolUsersForm();
      this.schoolUsersShowModal = true;
    },

    startEditSchoolUser(item) {
      this.schoolUsersEditingId = item.id;
      this.schoolUsersForm = {
        full_name: item.full_name || "",
        username: item.username || "",
        password: "",
        role: item.role || "GURU",
        parent_email: item.parent_email || "",
        phone_number: item.phone_number || "",
      };
      this.schoolUsersShowModal = true;
    },

    openSchoolUserDetail(item) {
      this.schoolUsersDetail = item || null;
      this.schoolUsersDetailModalOpen = true;
    },

    closeSchoolUserDetail() {
      this.schoolUsersDetailModalOpen = false;
      this.schoolUsersDetail = null;
    },

    editSchoolUserFromDetail() {
      if (!this.schoolUsersDetail) return;
      const item = this.schoolUsersDetail;
      this.closeSchoolUserDetail();
      this.startEditSchoolUser(item);
    },

    openSchoolUserDeleteModal(item) {
      this.schoolUsersToDelete = item || null;
      this.schoolUsersDeleteModalOpen = true;
    },

    closeSchoolUserDeleteModal() {
      if (this.schoolUsersDeleting) return;
      this.schoolUsersDeleteModalOpen = false;
      this.schoolUsersToDelete = null;
    },

    openSchoolUserResetConfirm() {
      if (!this.schoolUsersDetail?.id || this.schoolUsersResettingPassword) return;
      this.schoolUsersResetTargetId = this.schoolUsersDetail.id;
      this.schoolUsersResetTargetLabel = this.schoolUsersDetail.full_name || this.schoolUsersDetail.username || "user ini";
      this.schoolUsersResetConfirmOpen = true;
    },

    closeSchoolUserResetConfirm() {
      if (this.schoolUsersResettingPassword) return;
      this.schoolUsersResetConfirmOpen = false;
      this.schoolUsersResetTargetId = null;
      this.schoolUsersResetTargetLabel = "";
    },

    async loadSchoolUsers() {
      this.schoolUsersLoading = true;
      try {
        const response = await api.get("/auth/user-school", {
          params: {
            paginate: 1,
            page: this.schoolUsersPage,
            limit: this.schoolUsersPageSize,
          },
        });
        this.schoolUsers = response?.data?.data || [];
        this.schoolUsersTotal = Number(response?.data?.total || 0);
      } catch (error) {
        pushToast({
          title: "Gagal Memuat User Sekolah",
          message: error.message,
          type: "error",
        });
      } finally {
        this.schoolUsersLoading = false;
      }
    },

    async goToSchoolUsersPage(page) {
      const nextPage = Math.min(Math.max(Number(page || 1), 1), this.schoolUsersTotalPages || 1);
      if (nextPage === this.schoolUsersPage) return;
      this.schoolUsersPage = nextPage;
      await this.loadSchoolUsers();
    },

    toggleSchoolUsersSort(key) {
      if (this.schoolUsersSortKey === key) {
        this.schoolUsersSortDirection = this.schoolUsersSortDirection === "asc" ? "desc" : "asc";
      } else {
        this.schoolUsersSortKey = key;
        this.schoolUsersSortDirection = "asc";
      }
      this.schoolUsersPage = 1;
    },

    async importGuru(file) {
      if (!file) return;
      this.schoolUsersImportingGuru = true;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post("/auth/register/user-school/import", formData);
        const imported = Number(response?.data?.imported || 0);
        const failed = Number(response?.data?.failed || 0);

        await this.loadSchoolUsers();
        pushToast({
          title: "Import Guru Selesai",
          message: `${imported} guru berhasil diimport${failed > 0 ? `, ${failed} baris gagal` : ""}.`,
          type: "success",
        });
        if (failed > 0) {
          pushToast({
            title: "Sebagian Baris Gagal",
            message: "Periksa data yang kosong. Username dan password dibuat otomatis dari nama lengkap.",
            type: "warning",
          });
        }
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Import Guru",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.schoolUsersImportingGuru = false;
      }
    },

    async resetSchoolUserPassword() {
      if (!this.schoolUsersResetTargetId || this.schoolUsersResettingPassword) return;
      this.schoolUsersResettingPassword = true;
      try {
        const response = await api.post(`/auth/user-school/${this.schoolUsersResetTargetId}/reset-password`);
        this.schoolUsersDetail = {
          ...this.schoolUsersDetail,
          initial_password: response?.data?.password || response?.data?.initial_password || "",
        };
        this.schoolUsersResetConfirmOpen = false;
        this.schoolUsersResetTargetId = null;
        this.schoolUsersResetTargetLabel = "";
        await this.loadSchoolUsers();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Reset Password",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.schoolUsersResettingPassword = false;
      }
    },

    async saveSchoolUser() {
      this.schoolUsersSubmitting = true;
      try {
        const payload = {
          full_name: this.schoolUsersForm.full_name,
          username: this.schoolUsersForm.username,
          role: this.schoolUsersForm.role,
          parent_email: this.schoolUsersForm.parent_email || null,
          phone_number: this.schoolUsersForm.phone_number || null,
        };

        if (this.schoolUsersForm.role !== "GURU" && this.schoolUsersForm.password) {
          payload.password = this.schoolUsersForm.password;
        }
        if (this.schoolUsersForm.role === "GURU") {
          delete payload.username;
          delete payload.password;
        }

        const response = this.schoolUsersEditingId
          ? await api.put(`/auth/user-school/${this.schoolUsersEditingId}`, payload)
          : await api.post("/auth/register/user-school", payload);

        await this.loadSchoolUsers();
        this.closeSchoolUsersModal();
        return response;
      } catch (error) {
        pushToast({
          title: this.schoolUsersEditingId ? "Gagal Mengupdate User Sekolah" : "Gagal Membuat User Sekolah",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.schoolUsersSubmitting = false;
      }
    },

    async deleteSchoolUser() {
      if (!this.schoolUsersToDelete?.id) return;
      this.schoolUsersDeleting = true;
      try {
        const response = await api.delete(`/auth/user-school/${this.schoolUsersToDelete.id}`);
        this.schoolUsersDeleteModalOpen = false;
        this.schoolUsersToDelete = null;
        await this.loadSchoolUsers();
        return response;
      } catch (error) {
        this.schoolUsersDeleteModalOpen = false;
        pushToast({
          title: "Gagal Menghapus User Sekolah",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.schoolUsersDeleting = false;
      }
    },

    // Classes
    resetClassForm() {
      this.classesForm = baseClassForm();
      this.classesEditingId = null;
    },

    openClassCreateModal() {
      this.resetClassForm();
      this.classesShowModal = true;
    },

    closeClassModal() {
      this.classesShowModal = false;
      this.resetClassForm();
    },

    startEditClass(item) {
      this.classesEditingId = item.id;
      this.classesForm = {
        className: item.class_name || "",
        waliGuruId: item.wali_guru_id || "",
      };
      this.classesShowModal = true;
    },

    openClassDeleteModal(item) {
      this.classesToDelete = item || null;
      this.classesDeleteModalOpen = true;
    },

    closeClassDeleteModal() {
      if (this.classesDeleting) return;
      this.classesDeleteModalOpen = false;
      this.classesToDelete = null;
    },

    async loadClasses() {
      this.classesLoading = true;
      try {
        const response = await api.get("/class", {
          params: {
            paginate: 1,
            page: this.classesPage,
            limit: this.classesPageSize,
          },
        });
        this.classes = response?.data?.data || [];
        this.classesTotal = Number(response?.data?.total || 0);
      } catch (error) {
        pushToast({
          title: "Gagal Memuat Data Kelas",
          message: error.message,
          type: "error",
        });
      } finally {
        this.classesLoading = false;
      }
    },

    async loadClassTeachers() {
      const masterDataStore = useMasterDataStore();
      this.classesTeachers = await masterDataStore.getTeacherUsers();
      return this.classesTeachers;
    },

    toggleClassSort(key) {
      if (this.classesSortKey === key) {
        this.classesSortDirection = this.classesSortDirection === "asc" ? "desc" : "asc";
      } else {
        this.classesSortKey = key;
        this.classesSortDirection = "asc";
      }
    },

    async goToClassPage(page) {
      const nextPage = Math.min(Math.max(Number(page || 1), 1), this.classesTotalPages || 1);
      if (nextPage === this.classesPage) return;
      this.classesPage = nextPage;
      await this.loadClasses();
    },

    async saveClass() {
      this.classesSubmitting = true;
      try {
        const payload = {
          class_name: this.classesForm.className,
          wali_guru_id: this.classesForm.waliGuruId ? Number(this.classesForm.waliGuruId) : null,
        };

        const response = this.classesEditingId
          ? await api.put(`/class/${this.classesEditingId}`, payload)
          : await api.post("/class", payload);

        await this.loadClasses();
        this.closeClassModal();
        return response;
      } catch (error) {
        pushToast({
          title: this.classesEditingId ? "Gagal Memperbarui Kelas" : "Gagal Membuat Kelas",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.classesSubmitting = false;
      }
    },

    async deleteClass() {
      if (!this.classesToDelete?.id) return;
      this.classesDeleting = true;
      try {
        const response = await api.delete(`/class/${this.classesToDelete.id}`);
        this.classesDeleteModalOpen = false;
        this.classesToDelete = null;
        await this.loadClasses();
        return response;
      } catch (error) {
        this.classesDeleteModalOpen = false;
        pushToast({
          title: "Gagal Menghapus Kelas",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.classesDeleting = false;
      }
    },

    // Academic Periods
    resetAcademicYearForm() {
      this.academicYearForm = baseYearForm();
      this.academicEditingYearId = null;
    },

    resetAcademicSemesterForm() {
      this.academicSemesterForm = baseSemesterForm();
      this.academicEditingSemesterId = null;
    },

    closeAcademicYearModal() {
      this.academicYearModalOpen = false;
      this.resetAcademicYearForm();
    },

    closeAcademicSemesterModal() {
      this.academicSemesterModalOpen = false;
      this.academicSelectedYear = null;
      this.resetAcademicSemesterForm();
    },

    openAcademicYearModal(item = null) {
      this.resetAcademicYearForm();
      if (item) {
        this.academicEditingYearId = item.id;
        this.academicYearForm = {
          name: item.name || "",
          start_date: String(item.start_date || "").slice(0, 10),
          end_date: String(item.end_date || "").slice(0, 10),
        };
      }
      this.academicYearModalOpen = true;
    },

    openAcademicSemesterModal(semester = null, year = null) {
      this.resetAcademicSemesterForm();
      this.academicSelectedYear = year || null;
      if (semester) {
        this.academicEditingSemesterId = semester.id;
        this.academicSemesterForm = {
          name: semester.name || "",
          code: semester.code || "",
          start_date: String(semester.start_date || "").slice(0, 10),
          end_date: String(semester.end_date || "").slice(0, 10),
        };
      }
      this.academicSemesterModalOpen = true;
    },

    openAcademicYearConfirm(item) {
      this.academicPendingYear = item || null;
      this.academicYearConfirmOpen = true;
    },

    closeAcademicYearConfirm() {
      if (this.academicSubmitting) return;
      this.academicYearConfirmOpen = false;
      this.academicPendingYear = null;
    },

    openAcademicSemesterConfirm(item) {
      this.academicPendingSemester = item || null;
      this.academicSemesterConfirmOpen = true;
    },

    closeAcademicSemesterConfirm() {
      if (this.academicSubmitting) return;
      this.academicSemesterConfirmOpen = false;
      this.academicPendingSemester = null;
    },

    async loadAcademicPeriods() {
      this.academicLoading = true;
      try {
        const response = await api.get("/academic-periods");
        const payload = response?.data || {};
        this.academicYears = Array.isArray(payload?.years) ? payload.years : [];
        this.academicActivePeriod = payload?.active || null;
      } catch (error) {
        pushToast({
          title: "Gagal Memuat Periode Akademik",
          message: error.message,
          type: "error",
        });
      } finally {
        this.academicLoading = false;
      }
    },

    async saveAcademicYear() {
      this.academicSubmitting = true;
      try {
        const payload = { ...this.academicYearForm };
        const response = this.academicEditingYearId
          ? await api.put(`/academic-periods/years/${this.academicEditingYearId}`, payload)
          : await api.post("/academic-periods/years", payload);
        pushToast({
          title: this.academicEditingYearId ? "Tahun Ajaran Diperbarui" : "Tahun Ajaran Dibuat",
          message: response?.message || "Perubahan tahun ajaran berhasil disimpan.",
          type: "success",
        });
        this.closeAcademicYearModal();
        await this.loadAcademicPeriods();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Menyimpan Tahun Ajaran",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.academicSubmitting = false;
      }
    },

    async saveAcademicSemester() {
      if (!this.academicSelectedYear?.id) {
        pushToast({
          title: "Tahun Ajaran Belum Dipilih",
          message: "Pilih tahun ajaran tujuan terlebih dahulu.",
          type: "error",
        });
        return null;
      }

      this.academicSubmitting = true;
      try {
        const payload = {
          academic_year_id: this.academicSelectedYear.id,
          ...this.academicSemesterForm,
        };
        const response = this.academicEditingSemesterId
          ? await api.put(`/academic-periods/semesters/${this.academicEditingSemesterId}`, payload)
          : await api.post("/academic-periods/semesters", payload);
        pushToast({
          title: this.academicEditingSemesterId ? "Semester Diperbarui" : "Semester Dibuat",
          message: response?.message || "Perubahan semester berhasil disimpan.",
          type: "success",
        });
        this.closeAcademicSemesterModal();
        await this.loadAcademicPeriods();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Menyimpan Semester",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.academicSubmitting = false;
      }
    },

    async activateAcademicYear(item) {
      this.academicSubmitting = true;
      try {
        const response = await api.post(`/academic-periods/years/${item.id}/activate`, {});
        pushToast({
          title: "Tahun Ajaran Aktif",
          message: response?.message || `${item.name} sekarang menjadi tahun ajaran aktif.`,
          type: "success",
        });
        await this.loadAcademicPeriods();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Mengaktifkan Tahun Ajaran",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.academicSubmitting = false;
      }
    },

    async activateAcademicSemester(item) {
      this.academicSubmitting = true;
      try {
        const response = await api.post(`/academic-periods/semesters/${item.id}/activate`, {});
        pushToast({
          title: "Semester Aktif",
          message: response?.message || `${item.name} sekarang menjadi semester aktif.`,
          type: "success",
        });
        await this.loadAcademicPeriods();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Mengaktifkan Semester",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.academicSubmitting = false;
      }
    },

    async confirmAcademicYearActivation() {
      if (!this.academicPendingYear) return null;
      const item = this.academicPendingYear;
      const response = await this.activateAcademicYear(item);
      this.academicYearConfirmOpen = false;
      this.academicPendingYear = null;
      return response;
    },

    async confirmAcademicSemesterActivation() {
      if (!this.academicPendingSemester) return null;
      const item = this.academicPendingSemester;
      const response = await this.activateAcademicSemester(item);
      this.academicSemesterConfirmOpen = false;
      this.academicPendingSemester = null;
      return response;
    },
  },
});
