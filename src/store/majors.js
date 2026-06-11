import { defineStore } from "pinia";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { useMasterDataStore } from "@/store/masterData";

const baseForm = () => ({
  name: "",
  code: "",
  quota: null,
  is_active: true,
});

export const useMajorStore = defineStore("majors", {
  state: () => ({
    majors: [],
    loading: false,
    showModal: false,
    editingId: null,
    isSaving: false,
    form: baseForm(),
  }),

  actions: {
    resetForm() {
      this.form = baseForm();
      this.editingId = null;
    },

    openModal(item = null) {
      if (item) {
        this.editingId = item.id || null;
        this.form = {
          name: item.name || "",
          code: item.code || "",
          quota: item.quota ?? null,
          is_active: item.is_active !== false,
        };
      } else {
        this.resetForm();
      }
      this.showModal = true;
    },

    closeModal() {
      if (this.isSaving) return;
      this.showModal = false;
      this.resetForm();
    },

    async loadMajors() {
      this.loading = true;
      try {
        const response = await api.get("/majors", { params: { include_inactive: 1 } });
        this.majors = Array.isArray(response?.data) ? response.data : [];
      } catch (error) {
        pushToast({
          title: "Gagal Memuat Jurusan",
          message: error.message,
          type: "error",
        });
      } finally {
        this.loading = false;
      }
    },

    async saveMajor() {
      this.isSaving = true;
      try {
        const payload = {
          name: this.form.name,
          code: this.form.code,
          quota: this.form.quota === "" ? null : this.form.quota,
          is_active: this.form.is_active,
        };
        const response = this.editingId
          ? await api.put(`/majors/${this.editingId}`, payload)
          : await api.post("/majors", payload);

        this.closeModal();
        await this.loadMajors();
        useMasterDataStore().invalidate(["majors"]);
        return response;
      } catch (error) {
        pushToast({
          title: this.editingId ? "Gagal Mengubah Jurusan" : "Gagal Menyimpan Jurusan",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isSaving = false;
      }
    },

    async deleteMajor(item) {
      if (!item?.id) return null;
      try {
        const response = await api.delete(`/majors/${item.id}`);
        await this.loadMajors();
        useMasterDataStore().invalidate(["majors"]);
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Menghapus Jurusan",
          message: error.message,
          type: "error",
        });
        throw error;
      }
    },
  },
});
