import { defineStore } from "pinia";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { useMasterDataStore } from "@/store/masterData";

const baseForm = () => ({
  className: "",
  classLevelId: "",
  waliGuruId: "",
  majorId: "",
});

const normalizeCompactText = (value) => String(value || "").trim().replace(/\s+/g, " ");

const quickRowKey = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const baseQuickGenerateRow = (classLevels = []) => ({
  key: quickRowKey(),
  class_level_id: classLevels[0]?.id || "",
  major_id: "",
  base_name: "",
  count: 1,
});

const compareText = (a, b, direction = "asc") => {
  const left = String(a ?? "").toLowerCase();
  const right = String(b ?? "").toLowerCase();
  if (left === right) return 0;
  const order = left > right ? 1 : -1;
  return direction === "desc" ? -order : order;
};

export const useClassStore = defineStore("classes", {
  state: () => ({
    form: baseForm(),
    classes: [],
    classesTotal: 0,
    classesPage: 1,
    classesPageSize: 10,
    classesTeachers: [],
    majors: [],
    classLevels: [],
    loading: false,
    showModal: false,
    editingId: null,
    isSubmitting: false,
    deleteModalOpen: false,
    isDeleting: false,
    toDelete: null,
    sortKey: "class_name",
    sortDirection: "asc",
    newLevelName: "",
    isSavingLevel: false,
    deletingLevelId: null,
    showQuickGenerateModal: false,
    isGeneratingClasses: false,
    quickGenerateRows: [],
  }),

  getters: {
    totalPages: (state) =>
      Math.max(1, Math.ceil(Number(state.classesTotal || 0) / Number(state.classesPageSize || 10))),

    paginatedClasses: (state) => {
      const items = Array.isArray(state.classes) ? [...state.classes] : [];
      return items.sort((left, right) => {
        switch (state.sortKey) {
          case "class_name":
            return compareText(left.class_name, right.class_name, state.sortDirection);
          case "wali_guru_name":
            return compareText(left.wali_guru_name, right.wali_guru_name, state.sortDirection);
          default:
            return 0;
        }
      });
    },

    selectedClassLevel: (state) =>
      state.classLevels.find((item) => String(item.id) === String(state.form.classLevelId)) || null,

    classNamePreview() {
      const rombelName = normalizeCompactText(this.form.className);
      const levelName = normalizeCompactText(this.selectedClassLevel?.name || "");
      if (!levelName) return rombelName;
      if (!rombelName) return levelName;
      if (
        rombelName.toLowerCase() === levelName.toLowerCase() ||
        rombelName.toLowerCase().startsWith(`${levelName.toLowerCase()} `)
      ) {
        return rombelName;
      }
      return `${levelName} ${rombelName}`;
    },
  },

  actions: {
    resetForm() {
      this.form = baseForm();
      this.editingId = null;
    },

    openCreateModal() {
      this.resetForm();
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    startEdit(item) {
      this.editingId = item.id;
      this.form = {
        className: item.class_rombel_name || item.class_name || "",
        classLevelId: item.class_level_id || "",
        waliGuruId: item.wali_guru_id || "",
        majorId: item.major_id || "",
      };
      this.showModal = true;
    },

    openDeleteModal(item) {
      this.toDelete = item || null;
      this.deleteModalOpen = true;
    },

    closeDeleteModal() {
      if (this.isDeleting) return;
      this.deleteModalOpen = false;
      this.toDelete = null;
    },

    toggleSort(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortDirection = "asc";
      }
    },

    async goToPage(page) {
      const nextPage = Math.min(Math.max(Number(page || 1), 1), this.totalPages || 1);
      if (nextPage === this.classesPage) return;
      this.classesPage = nextPage;
      await this.loadClasses();
    },

    async loadClasses() {
      this.loading = true;
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
        this.loading = false;
      }
    },

    async loadTeachers(force = false) {
      this.classesTeachers = await useMasterDataStore().getTeacherUsers({ force });
      return this.classesTeachers;
    },

    async loadMajors() {
      try {
        const response = await api.get("/majors");
        this.majors = Array.isArray(response?.data) ? response.data : [];
      } catch (error) {
        pushToast({
          title: "Gagal Memuat Jurusan",
          message: error.message,
          type: "error",
        });
      }
    },

    async loadClassLevels() {
      try {
        const response = await api.get("/class/levels");
        this.classLevels = Array.isArray(response?.data) ? response.data : [];
      } catch (error) {
        pushToast({
          title: "Gagal Memuat Tingkat Kelas",
          message: error.message,
          type: "error",
        });
      }
    },

    async loadDependencies() {
      await Promise.all([this.loadTeachers(), this.loadMajors(), this.loadClassLevels()]);
    },

    async initialize() {
      await Promise.all([this.loadClasses(), this.loadDependencies()]);
    },

    async saveClass() {
      this.isSubmitting = true;
      try {
        const payload = {
          class_name: this.form.className,
          class_level_id: this.form.classLevelId ? Number(this.form.classLevelId) : null,
          wali_guru_id: this.form.waliGuruId ? Number(this.form.waliGuruId) : null,
          major_id: this.form.majorId ? Number(this.form.majorId) : null,
        };
        const response = this.editingId
          ? await api.put(`/class/${this.editingId}`, payload)
          : await api.post("/class", payload);
        await this.loadClasses();
        await this.loadTeachers(true);
        useMasterDataStore().invalidate(["classes"]);
        this.closeModal();
        return response;
      } catch (error) {
        pushToast({
          title: this.editingId ? "Gagal Memperbarui Kelas" : "Gagal Membuat Kelas",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    async deleteClass() {
      if (!this.toDelete?.id) return null;
      this.isDeleting = true;
      try {
        const response = await api.delete(`/class/${this.toDelete.id}`);
        this.deleteModalOpen = false;
        this.toDelete = null;
        await this.loadClasses();
        useMasterDataStore().invalidate(["classes"]);
        return response;
      } catch (error) {
        this.deleteModalOpen = false;
        pushToast({
          title: "Gagal Menghapus Kelas",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isDeleting = false;
      }
    },

    setNewLevelName(value) {
      this.newLevelName = value;
    },

    async createClassLevel() {
      const name = this.newLevelName.trim();
      if (!name || this.isSavingLevel) return null;
      this.isSavingLevel = true;
      try {
        const response = await api.post("/class/levels", { name });
        this.newLevelName = "";
        await this.loadClassLevels();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Membuat Tingkat Kelas",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isSavingLevel = false;
      }
    },

    async deleteClassLevel(level) {
      if (!level?.id || this.deletingLevelId) return null;
      this.deletingLevelId = level.id;
      try {
        const response = await api.delete(`/class/levels/${level.id}`);
        await this.loadClassLevels();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Menghapus Tingkat Kelas",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.deletingLevelId = null;
      }
    },

    newQuickGenerateRow() {
      return baseQuickGenerateRow(this.classLevels);
    },

    addQuickGenerateRow() {
      this.quickGenerateRows.push(this.newQuickGenerateRow());
    },

    removeQuickGenerateRow(index) {
      if (this.quickGenerateRows.length <= 1) return;
      this.quickGenerateRows.splice(index, 1);
    },

    openQuickGenerateModal() {
      if (this.quickGenerateRows.length === 0) {
        this.quickGenerateRows = [this.newQuickGenerateRow()];
      }
      this.showQuickGenerateModal = true;
    },

    closeQuickGenerateModal() {
      if (this.isGeneratingClasses) return;
      this.showQuickGenerateModal = false;
    },

    selectedLevelNameById(id) {
      return normalizeCompactText(this.classLevels.find((item) => String(item.id) === String(id))?.name || "");
    },

    selectedMajorById(id) {
      return this.majors.find((item) => String(item.id) === String(id)) || null;
    },

    syncQuickGenerateMajor(row) {
      const major = this.selectedMajorById(row.major_id);
      if (!major) return;
      row.base_name = normalizeCompactText(major.code || major.name || row.base_name);
    },

    quickGeneratePreview(row) {
      const levelName = this.selectedLevelNameById(row.class_level_id);
      const baseName = normalizeCompactText(row.base_name);
      const count = Math.max(0, Number(row.count || 0));
      if (!levelName || !baseName || count <= 0) return "";
      const limit = Math.min(count, 3);
      const names = Array.from({ length: limit }, (_, index) => `${levelName} ${baseName} ${index + 1}`);
      if (count > limit) names.push("...");
      return names.join(", ");
    },

    async submitQuickGenerate() {
      const items = this.quickGenerateRows
        .map((row) => ({
          class_level_id: Number(row.class_level_id || 0),
          base_name: normalizeCompactText(row.base_name),
          count: Number(row.count || 0),
          major_id: row.major_id ? Number(row.major_id) : null,
        }))
        .filter((row) => row.class_level_id && row.base_name && row.count > 0);

      if (items.length === 0) {
        pushToast({
          title: "Pola Belum Lengkap",
          message: "Pilih tingkat, isi nama rombel, dan jumlah kelas.",
          type: "warning",
        });
        return null;
      }

      this.isGeneratingClasses = true;
      try {
        const response = await api.post("/class/bulk-generate", { items });
        await this.loadClasses();
        useMasterDataStore().invalidate(["classes"]);
        this.showQuickGenerateModal = false;
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Generate Kelas",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isGeneratingClasses = false;
      }
    },
  },
});
