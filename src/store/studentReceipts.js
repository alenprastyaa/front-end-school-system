import { defineStore } from "pinia";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { convertHeicToJpegIfPossible, isHeicLikeFile } from "@/utils/fileImage";

const baseForm = () => ({
  payment_date: "",
  description: "",
});

export const useStudentReceiptsStore = defineStore("studentReceipts", {
  state: () => ({
    form: baseForm(),
    selectedFile: null,
    receipts: [],
    isSubmitting: false,
    isUpdating: false,
    isDeleting: false,
    showCreateModal: false,
    showPreviewModal: false,
    showEditModal: false,
    showDeleteModal: false,
    selectedReceipt: null,
    previewReceipt: null,
    receiptToDelete: null,
    editForm: baseForm(),
    editFile: null,
    activeActionId: null,
  }),

  getters: {
    sortedReceipts: (state) => state.receipts,
  },

  actions: {
    resetCreateForm() {
      this.form = baseForm();
      this.selectedFile = null;
    },

    resetEditForm() {
      this.editForm = baseForm();
      this.editFile = null;
    },

    openCreateModal() {
      this.showCreateModal = true;
    },

    closeCreateModal() {
      this.showCreateModal = false;
      this.resetCreateForm();
    },

    openPreviewModal(item) {
      this.previewReceipt = item || null;
      this.showPreviewModal = true;
    },

    closePreviewModal() {
      this.showPreviewModal = false;
      this.previewReceipt = null;
    },

    toggleActionMenu(item) {
      this.selectedReceipt = item || null;
      this.activeActionId = this.activeActionId === item?.id ? null : item?.id || null;
    },

    closeActionMenu() {
      this.activeActionId = null;
    },

    openEditModal(item) {
      this.selectedReceipt = item || null;
      this.editForm.payment_date = item?.payment_date ? String(item.payment_date).slice(0, 10) : "";
      this.editForm.description = item?.description || "";
      this.editFile = null;
      this.showEditModal = true;
    },

    closeEditModal() {
      this.showEditModal = false;
      this.selectedReceipt = null;
      this.resetEditForm();
    },

    openDeleteModal(item) {
      this.receiptToDelete = item || null;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.receiptToDelete = null;
    },

    async loadReceipts() {
      try {
        const response = await api.get("/receipt");
        this.receipts = response?.data || [];
      } catch (error) {
        pushToast({
          title: "Gagal Memuat Bukti Pembayaran",
          message: error.message,
          type: "error",
        });
      }
    },

    async setSelectedFile(file) {
      if (!file) {
        this.selectedFile = null;
        return;
      }
      try {
        this.selectedFile = await convertHeicToJpegIfPossible(file);
        if (isHeicLikeFile(file)) {
          pushToast({
            title: "HEIC Dikonversi",
            message: "File HEIC diubah ke JPG agar bisa dipreview di Chrome.",
            type: "success",
          });
        }
      } catch (error) {
        this.selectedFile = file;
        pushToast({
          title: "HEIC Tidak Bisa Dikonversi",
          message: "Gunakan JPG/PNG agar preview tampil di Chrome.",
          type: "error",
        });
      }
    },

    async setEditFile(file) {
      if (!file) {
        this.editFile = null;
        return;
      }
      try {
        this.editFile = await convertHeicToJpegIfPossible(file);
        if (isHeicLikeFile(file)) {
          pushToast({
            title: "HEIC Dikonversi",
            message: "File HEIC diubah ke JPG agar bisa dipreview di Chrome.",
            type: "success",
          });
        }
      } catch (error) {
        this.editFile = file;
        pushToast({
          title: "HEIC Tidak Bisa Dikonversi",
          message: "Gunakan JPG/PNG agar preview tampil di Chrome.",
          type: "error",
        });
      }
    },

    async submitReceipt() {
      if (!this.selectedFile) {
        pushToast({
          title: "Upload Bukti Diperlukan",
          message: "Bukti pembayaran wajib diunggah",
          type: "error",
        });
        return null;
      }

      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append("image", this.selectedFile);
        formData.append("payment_date", this.form.payment_date);
        formData.append("description", this.form.description || "");
        const response = await api.post("/receipt", formData);
        pushToast({
          title: "Bukti Pembayaran Terkirim",
          message: response?.message || "Bukti pembayaran berhasil dikirim",
          type: "success",
        });
        this.closeCreateModal();
        await this.loadReceipts();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Mengirim Bukti Pembayaran",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    async submitUpdateReceipt() {
      if (!this.selectedReceipt) return null;
      this.isUpdating = true;
      try {
        const formData = new FormData();
        formData.append("payment_date", this.editForm.payment_date);
        formData.append("description", this.editForm.description || "");
        if (this.editFile) {
          formData.append("image", this.editFile);
        }
        const response = await api.put(`/receipt/${this.selectedReceipt.id}`, formData);
        pushToast({
          title: "Bukti Pembayaran Diupdate",
          message: response?.message || "Bukti pembayaran berhasil diperbarui",
          type: "success",
        });
        this.closeEditModal();
        await this.loadReceipts();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Update Bukti Pembayaran",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isUpdating = false;
      }
    },

    async confirmDeleteReceipt() {
      if (!this.receiptToDelete) return null;
      this.isDeleting = true;
      try {
        const response = await api.delete(`/receipt/${this.receiptToDelete.id}`);
        pushToast({
          title: "Bukti Pembayaran Dihapus",
          message: response?.message || "Bukti pembayaran berhasil dihapus",
          type: "success",
        });
        this.closeDeleteModal();
        await this.loadReceipts();
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Hapus Bukti Pembayaran",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isDeleting = false;
      }
    },
  },
});
