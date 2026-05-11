<template>
  <div class="px-3 py-4 md:p-6 space-y-4 md:space-y-6">

    <section class="grid gap-4 md:gap-6 xl:grid-cols-[420px,1fr]">

      <!-- Form Kirim Bukti -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">Kirim Bukti Pembayaran</h2>
          <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Isi form di bawah untuk mengirim bukti.</p>
        </div>
        <form @submit.prevent="submitReceipt" class="space-y-4 p-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal Pembayaran</label>
            <input
              v-model="form.payment_date"
              type="date"
              required
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Upload Bukti</label>
            <input
              type="file"
              accept="image/*"
              required
              @change="handleFileChange"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-300"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {{ isSubmitting ? "Menyimpan..." : "Kirim Bukti" }}
          </button>
        </form>
      </div>

      <!-- Tabel Riwayat -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Riwayat bukti pembayaran</h2>
            <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Data milik user login.</p>
          </div>
          <button
            @click="loadReceipts"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            Refresh
          </button>
        </div>

        <div class="p-5">
          <!-- Mobile Cards -->
          <div class="space-y-3 md:hidden">
            <div
              v-if="receipts.length === 0"
              class="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
            >
              Belum ada bukti pembayaran.
            </div>
            <div
              v-for="item in sortedReceipts"
              :key="`mobile-${item.id}`"
              class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Tanggal Bayar</p>
                  <p class="mt-0.5 font-semibold text-slate-900 dark:text-white">{{ formatDate(item.payment_date) }}</p>
                </div>
                <a
                  v-if="item.image_path"
                  :href="item.image_path"
                  target="_blank"
                  rel="noreferrer"
                  class="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
                >
                  Lihat
                </a>
              </div>
              <div class="mt-3">
                <p class="text-xs text-slate-500 dark:text-slate-400">Deskripsi</p>
                <p class="mt-0.5 text-slate-800 dark:text-slate-200">{{ item.description || "-" }}</p>
              </div>
              <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">Dibuat {{ formatDateTime(item.created_at) }}</p>
              <div class="mt-3 flex items-center justify-end gap-2">
                <button
                  @click="openEditModal(item)"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                  Edit
                </button>
                <button
                  @click="openDeleteModal(item)"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  Hapus
                </button>
              </div>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden overflow-x-auto md:block">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200 text-left dark:border-slate-700">
                  <th class="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <button @click="handleSort('payment_date')" class="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                      Tanggal Bayar <span class="text-slate-400">{{ sortIndicator('payment_date') }}</span>
                    </button>
                  </th>
                  <th class="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <button @click="handleSort('description')" class="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                      Deskripsi <span class="text-slate-400">{{ sortIndicator('description') }}</span>
                    </button>
                  </th>
                  <th class="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <button @click="handleSort('created_at')" class="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                      Dibuat <span class="text-slate-400">{{ sortIndicator('created_at') }}</span>
                    </button>
                  </th>
                  <th class="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Bukti</th>
                  <th class="pb-3 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  v-for="item in sortedReceipts"
                  :key="item.id"
                  class="text-slate-800 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/50"
                >
                  <td class="py-3 pr-4">{{ formatDate(item.payment_date) }}</td>
                  <td class="py-3 pr-4 max-w-[200px] truncate">{{ item.description || "-" }}</td>
                  <td class="py-3 pr-4 text-slate-500 dark:text-slate-400">{{ formatDateTime(item.created_at) }}</td>
                  <td class="py-3 pr-4">
                    <a
                      v-if="item.image_path"
                      :href="item.image_path"
                      target="_blank"
                      rel="noreferrer"
                      class="font-medium text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
                    >
                      Lihat
                    </a>
                    <span v-else class="text-slate-400">-</span>
                  </td>
                  <td class="py-3 pr-4">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="openEditModal(item)"
                        class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                        Edit
                      </button>
                      <button
                        @click="openDeleteModal(item)"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="receipts.length === 0">
                  <td colspan="5" class="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    Belum ada bukti pembayaran.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">Edit Bukti Pembayaran</h3>
          <button
            @click="closeEditModal"
            class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitUpdateReceipt" class="space-y-4 p-6">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal Pembayaran</label>
            <input
              v-model="editForm.payment_date"
              type="date"
              required
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi</label>
            <textarea
              v-model="editForm.description"
              rows="4"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Ganti Bukti <span class="font-normal text-slate-400">(Opsional)</span></label>
            <input
              type="file"
              accept="image/*"
              @change="handleEditFileChange"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-300"
            />
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <button
              type="button"
              @click="closeEditModal"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isUpdating"
              class="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {{ isUpdating ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div class="p-6">
          <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">Hapus Bukti Pembayaran?</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Data pada tanggal <span class="font-medium text-slate-800 dark:text-slate-200">{{ formatDate(receiptToDelete?.payment_date) }}</span> akan dihapus secara permanen dan tidak dapat dikembalikan.
          </p>
          <div class="mt-6 flex justify-end gap-2">
            <button
              @click="closeDeleteModal"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              @click="confirmDeleteReceipt"
              :disabled="isDeleting"
              class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {{ isDeleting ? "Menghapus..." : "Ya, Hapus" }}
            </button>
          </div>
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
