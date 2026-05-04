<template>
  <div class="p-6 space-y-6">


    <section class="grid xl:grid-cols-[420px,1fr] gap-6">
      <form @submit.prevent="submitReceipt"
        class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Pembayaran</label>
          <input v-model="form.payment_date" type="date" required
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Bukti</label>
          <input type="file" accept="image/*" required @change="handleFileChange"
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
          <textarea v-model="form.description" rows="4"
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        </div>

        <button type="submit" :disabled="isSubmitting"
          class="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60">
          {{ isSubmitting ? "Menyimpan..." : "Kirim Bukti" }}
        </button>
      </form>

      <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Riwayat bukti pembayaran</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Data milik user login.</p>
          </div>
          <button @click="loadReceipts" class="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-white">
            Refresh
          </button>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <th class="py-3 pr-4">
                  <button @click="handleSort('payment_date')" class="inline-flex items-center gap-1 font-medium">
                    Tanggal Bayar {{ sortIndicator('payment_date') }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button @click="handleSort('description')" class="inline-flex items-center gap-1 font-medium">
                    Deskripsi {{ sortIndicator('description') }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button @click="handleSort('created_at')" class="inline-flex items-center gap-1 font-medium">
                    Dibuat {{ sortIndicator('created_at') }}
                  </button>
                </th>
                <th class="py-3 pr-4">Bukti</th>
                <th class="py-3 pr-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sortedReceipts" :key="item.id"
                class="border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                <td class="py-3 pr-4">{{ formatDate(item.payment_date) }}</td>
                <td class="py-3 pr-4">{{ item.description || "-" }}</td>
                <td class="py-3 pr-4">{{ formatDateTime(item.created_at) }}</td>
                <td class="py-3 pr-4">
                  <a v-if="item.image_path" :href="item.image_path" target="_blank" rel="noreferrer"
                    class="text-sky-600 underline">
                    Lihat
                  </a>
                  <span v-else>-</span>
                </td>
                <td class="py-3 pr-4">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEditModal(item)"
                      class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                      Edit
                    </button>
                    <button @click="openDeleteModal(item)"
                      class="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="receipts.length === 0">
                <td colspan="5" class="py-6 text-center text-gray-500 dark:text-gray-400">
                  Belum ada bukti pembayaran.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Bukti Pembayaran</h3>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
        </div>
        <form @submit.prevent="submitUpdateReceipt" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Pembayaran</label>
            <input v-model="editForm.payment_date" type="date" required
              class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
            <textarea v-model="editForm.description" rows="4"
              class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ganti Bukti (Opsional)</label>
            <input type="file" accept="image/*" @change="handleEditFileChange"
              class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeEditModal"
              class="rounded-md border px-4 py-2 text-sm dark:border-gray-600 dark:text-white">
              Batal
            </button>
            <button type="submit" :disabled="isUpdating"
              class="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-60">
              {{ isUpdating ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Hapus Bukti Pembayaran?</h3>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Data pada tanggal {{ formatDate(receiptToDelete?.payment_date) }} akan dihapus permanen.
        </p>
        <div class="mt-5 flex justify-end gap-2">
          <button @click="closeDeleteModal" class="rounded-md border px-4 py-2 text-sm dark:border-gray-600 dark:text-white">
            Batal
          </button>
          <button @click="confirmDeleteReceipt" :disabled="isDeleting"
            class="rounded-md bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-60">
            {{ isDeleting ? "Menghapus..." : "Ya, Hapus" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDate, formatDateTime } from "@/utils/date";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";

const baseForm = () => ({
  payment_date: "",
  description: "",
});

const form = reactive(baseForm());
const selectedFile = ref(null);
const receipts = ref([]);
const isSubmitting = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedReceipt = ref(null);
const receiptToDelete = ref(null);
const editForm = reactive(baseForm());
const editFile = ref(null);
const tableSort = createSortState("created_at", "desc");

const sortedReceipts = computed(() =>
  sortItems(receipts.value, tableSort, {
    description: (item) => item.description || "",
  }),
);

const handleSort = (key) => {
  toggleSort(tableSort, key);
};

const sortIndicator = (key) => {
  if (tableSort.key !== key) {
    return "↕";
  }

  return tableSort.direction === "asc" ? "▲" : "▼";
};

const loadReceipts = async () => {
  try {
    const response = await api.get("/receipt");
    receipts.value = response?.data || [];
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Bukti Pembayaran",
      message: error.message,
      type: "error",
    });
  }
};

const handleFileChange = (event) => {
  selectedFile.value = event.target.files?.[0] || null;
};

const openEditModal = (item) => {
  selectedReceipt.value = item;
  editForm.payment_date = item.payment_date ? String(item.payment_date).slice(0, 10) : "";
  editForm.description = item.description || "";
  editFile.value = null;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedReceipt.value = null;
  Object.assign(editForm, baseForm());
  editFile.value = null;
};

const handleEditFileChange = (event) => {
  editFile.value = event.target.files?.[0] || null;
};

const submitUpdateReceipt = async () => {
  if (!selectedReceipt.value) {
    return;
  }

  isUpdating.value = true;
  try {
    const formData = new FormData();
    formData.append("payment_date", editForm.payment_date);
    formData.append("description", editForm.description || "");
    if (editFile.value) {
      formData.append("image", editFile.value);
    }

    const response = await api.put(`/receipt/${selectedReceipt.value.id}`, formData);
    pushToast({
      title: "Bukti Pembayaran Diupdate",
      message: response?.message || "Bukti pembayaran berhasil diperbarui",
      type: "success",
    });
    closeEditModal();
    await loadReceipts();
  } catch (error) {
    pushToast({
      title: "Gagal Update Bukti Pembayaran",
      message: error.message,
      type: "error",
    });
  } finally {
    isUpdating.value = false;
  }
};

const openDeleteModal = (item) => {
  receiptToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  receiptToDelete.value = null;
};

const confirmDeleteReceipt = async () => {
  if (!receiptToDelete.value) {
    return;
  }

  isDeleting.value = true;
  try {
    const response = await api.delete(`/receipt/${receiptToDelete.value.id}`);
    pushToast({
      title: "Bukti Pembayaran Dihapus",
      message: response?.message || "Bukti pembayaran berhasil dihapus",
      type: "success",
    });
    closeDeleteModal();
    await loadReceipts();
  } catch (error) {
    pushToast({
      title: "Gagal Hapus Bukti Pembayaran",
      message: error.message,
      type: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};

const submitReceipt = async () => {
  if (!selectedFile.value) {
    pushToast({
      title: "Upload Bukti Diperlukan",
      message: "Bukti pembayaran wajib diunggah",
      type: "error",
    });
    return;
  }

  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append("image", selectedFile.value);
    formData.append("payment_date", form.payment_date);
    formData.append("description", form.description || "");

    const response = await api.post("/receipt", formData);
    pushToast({
      title: "Bukti Pembayaran Terkirim",
      message: response?.message || "Bukti pembayaran berhasil dikirim",
      type: "success",
    });
    Object.assign(form, baseForm());
    selectedFile.value = null;
    await loadReceipts();
  } catch (error) {
    pushToast({
      title: "Gagal Mengirim Bukti Pembayaran",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadReceipts);
</script>
