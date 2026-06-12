<template>
  <div class="px-3 py-4 md:p-6 space-y-4 md:space-y-6">
    <section class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">Riwayat bukti pembayaran</h2>
          <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Data milik user login.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button @click="openCreateModal"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 sm:w-auto">
            + Tambah Bukti
          </button>
        </div>
      </div>

      <div class="p-5">
        <!-- Mobile Cards -->
        <div class="space-y-3 md:hidden">
          <SkeletonLoader v-if="pageLoading" variant="list" :count="4" />
          <div v-if="!pageLoading && receipts.length === 0"
            class="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Belum ada bukti pembayaran.
          </div>
          <!-- tes -->
          <div v-for="item in sortedReceipts" :key="`mobile-${item.id}`"
            class="relative rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/50">
            <div class="flex items-start justify-between gap-3 pr-9">
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400">Tanggal Bayar</p>
                <p class="mt-0.5 font-semibold text-slate-900 dark:text-white">{{ formatDate(item.payment_date) }}</p>
              </div>
            </div>
            <div class="mt-3">
              <p class="text-xs text-slate-500 dark:text-slate-400">Deskripsi</p>
              <p class="mt-0.5 text-slate-800 dark:text-slate-200">{{ item.description || "-" }}</p>
            </div>
            <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">Dibuat {{ formatDateTime(item.created_at) }}</p>
            <div class="absolute right-3 top-3">
              <button type="button" @click="toggleActionMenu(item)"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                aria-label="Aksi bukti pembayaran">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"
                  aria-hidden="true">
                  <circle cx="12" cy="5" r="1.8" />
                  <circle cx="12" cy="12" r="1.8" />
                  <circle cx="12" cy="19" r="1.8" />
                </svg>
              </button>
              <div v-if="activeActionId === item.id"
                class="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <button v-if="item.image_path" type="button" @click="handlePreviewAction(item)"
                  class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                  Lihat
                </button>
                <button type="button" @click="handleEditAction(item)"
                  class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                  Edit
                </button>
                <button type="button" @click="handleDeleteAction(item)"
                  class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-700 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden overflow-x-auto md:block">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-left dark:border-slate-700">
                <th class="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <button @click="handleSort('payment_date')"
                    class="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                    Tanggal Bayar <span class="text-slate-400">{{ sortIndicator('payment_date') }}</span>
                  </button>
                </th>
                <th class="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <button @click="handleSort('description')"
                    class="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                    Deskripsi <span class="text-slate-400">{{ sortIndicator('description') }}</span>
                  </button>
                </th>
                <th class="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <button @click="handleSort('created_at')"
                    class="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                    Dibuat <span class="text-slate-400">{{ sortIndicator('created_at') }}</span>
                  </button>
                </th>
                <th class="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Bukti</th>
                <th
                  class="pb-3 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <template v-if="pageLoading">
                <tr v-for="n in 5" :key="`tabungan-sk-${n}`">
                  <td v-for="c in 5" :key="`tabungan-sk-${n}-${c}`" class="py-3.5 pr-4">
                    <div class="skeleton-shimmer h-4 rounded" :class="c === 1 ? 'w-24' : 'w-20'"></div>
                  </td>
                </tr>
              </template>
              <tr v-for="item in sortedReceipts" v-show="!pageLoading" :key="item.id"
                class="text-slate-800 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/50">
                <td class="py-3 pr-4">{{ formatDate(item.payment_date) }}</td>
                <td class="py-3 pr-4 max-w-[200px] truncate">{{ item.description || "-" }}</td>
                <td class="py-3 pr-4 text-slate-500 dark:text-slate-400">{{ formatDateTime(item.created_at) }}</td>
                <td class="py-3 pr-4">
                  <span v-if="item.image_path" class="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500"
                    title="Ada bukti pembayaran" aria-label="Ada bukti pembayaran" />
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="py-3 pr-4">
                  <div class="relative flex items-center justify-end">
                    <button type="button" @click="toggleActionMenu(item)"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                      aria-label="Aksi bukti pembayaran">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"
                        aria-hidden="true">
                        <circle cx="12" cy="5" r="1.8" />
                        <circle cx="12" cy="12" r="1.8" />
                        <circle cx="12" cy="19" r="1.8" />
                      </svg>
                    </button>
                    <div v-if="activeActionId === item.id"
                      class="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                      <button v-if="item.image_path" type="button" @click="handlePreviewAction(item)"
                        class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                        Lihat
                      </button>
                      <button type="button" @click="handleEditAction(item)"
                        class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                        Edit
                      </button>
                      <button type="button" @click="handleDeleteAction(item)"
                        class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-700 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10">
                        Hapus
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="!pageLoading && receipts.length === 0">
                <td colspan="5" class="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  Belum ada bukti pembayaran.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Create Modal -->
    <div v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">Kirim Bukti Pembayaran</h3>
          <button @click="closeCreateModal"
            class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitReceipt" class="space-y-4 p-6">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal
              Pembayaran</label>
            <input v-model="form.payment_date" type="date" required
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Upload Bukti</label>
            <input type="file" accept="image/*" required @change="handleFileChange"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-300" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi</label>
            <textarea v-model="form.description" rows="4"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <button type="button" @click="closeCreateModal"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Batal
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {{ isSubmitting ? "Menyimpan..." : "Kirim Bukti" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreviewModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div class="w-full max-w-3xl rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <h3 class="text-base font-semibold text-slate-900 dark:text-white">Preview Bukti Pembayaran</h3>
            <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {{ formatDate(previewReceipt?.payment_date) || "-" }}
            </p>
          </div>
          <button @click="closePreviewModal"
            class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div
            class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <img v-if="previewReceipt?.image_path && !isPreviewHeicLike" :src="previewReceipt.image_path"
              alt="Preview bukti pembayaran" class="max-h-[75vh] w-full object-contain" />
            <div v-else class="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
              Gambar tidak tersedia.
              <p v-if="isPreviewHeicLike" class="mt-2 text-xs leading-6 text-amber-600 dark:text-amber-300">
                Format HEIC/HEIF tidak bisa dipreview langsung di Chrome. Silakan unduh file asli atau unggah ulang
                sebagai JPG/PNG agar tampil di semua browser.
              </p>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap items-center justify-end gap-2">
            <a v-if="previewReceipt?.image_path" :href="previewReceipt.image_path" :download="previewDownloadName"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Unduh Asli
            </a>
            <button @click="closePreviewModal"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">Edit Bukti Pembayaran</h3>
          <button @click="closeEditModal"
            class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitUpdateReceipt" class="space-y-4 p-6">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal
              Pembayaran</label>
            <input v-model="editForm.payment_date" type="date" required
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi</label>
            <textarea v-model="editForm.description" rows="4"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Ganti Bukti <span
                class="font-normal text-slate-400">(Opsional)</span></label>
            <input type="file" accept="image/*" @change="handleEditFileChange"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-300" />
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <button type="button" @click="closeEditModal"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Batal
            </button>
            <button type="submit" :disabled="isUpdating"
              class="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {{ isUpdating ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div class="p-6">
          <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">Hapus Bukti Pembayaran?</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Data pada tanggal <span class="font-medium text-slate-800 dark:text-slate-200">{{
              formatDate(receiptToDelete?.payment_date) }}</span> akan dihapus secara permanen dan tidak dapat
            dikembalikan.
          </p>
          <div class="mt-6 flex justify-end gap-2">
            <button @click="closeDeleteModal"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Batal
            </button>
            <button @click="confirmDeleteReceipt" :disabled="isDeleting"
              class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
              {{ isDeleting ? "Menghapus..." : "Ya, Hapus" }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { formatDate, formatDateTime } from "@/utils/date";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";
import { storeToRefs } from "pinia";
import { useStudentReceiptsStore } from "@/store/studentReceipts";

const receiptsStore = useStudentReceiptsStore();
const {
  form,
  selectedFile,
  receipts,
  isSubmitting,
  isUpdating,
  isDeleting,
  showCreateModal,
  showPreviewModal,
  showEditModal,
  showDeleteModal,
  selectedReceipt,
  previewReceipt,
  receiptToDelete,
  editForm,
  editFile,
  activeActionId,
} = storeToRefs(receiptsStore);
const tableSort = createSortState("created_at", "desc");

const sortedReceipts = computed(() =>
  sortItems(receipts.value, tableSort, {
    description: (item) => item.description || "",
  }),
);

const isPreviewHeicLike = computed(() => {
  const value = String(previewReceipt.value?.image_path || "").toLowerCase();
  return /\.(heic|heif)(?:[?#].*)?$/i.test(value);
});

const previewDownloadName = computed(() => {
  const paymentDate = previewReceipt.value?.payment_date ? String(previewReceipt.value.payment_date).slice(0, 10) : "receipt";
  return `bukti-pembayaran-${paymentDate}.jpg`;
});

const handleSort = (key) => {
  toggleSort(tableSort, key);
};

const sortIndicator = (key) => {
  if (tableSort.key !== key) {
    return "↕";
  }

  return tableSort.direction === "asc" ? "▲" : "▼";
};

const pageLoading = ref(true);
const loadReceipts = async () => {
  try {
    await receiptsStore.loadReceipts();
  } finally {
    pageLoading.value = false;
  }
};

const handleFileChange = async (event) => {
  const file = event.target.files?.[0] || null;
  await receiptsStore.setSelectedFile(file);
};

const openCreateModal = () => receiptsStore.openCreateModal();
const closeCreateModal = () => receiptsStore.closeCreateModal();
const openPreviewModal = (item) => receiptsStore.openPreviewModal(item);
const closePreviewModal = () => receiptsStore.closePreviewModal();
const toggleActionMenu = (item) => receiptsStore.toggleActionMenu(item);
const closeActionMenu = () => receiptsStore.closeActionMenu();
const handlePreviewAction = (item) => {
  closeActionMenu();
  openPreviewModal(item);
};
const handleEditAction = (item) => {
  closeActionMenu();
  receiptsStore.openEditModal(item);
};
const handleDeleteAction = (item) => {
  closeActionMenu();
  receiptsStore.openDeleteModal(item);
};
const openEditModal = (item) => receiptsStore.openEditModal(item);
const closeEditModal = () => receiptsStore.closeEditModal();
const handleEditFileChange = async (event) => {
  const file = event.target.files?.[0] || null;
  await receiptsStore.setEditFile(file);
};
const submitUpdateReceipt = async () => {
  await receiptsStore.submitUpdateReceipt();
};
const openDeleteModal = (item) => receiptsStore.openDeleteModal(item);
const closeDeleteModal = () => receiptsStore.closeDeleteModal();
const confirmDeleteReceipt = async () => {
  await receiptsStore.confirmDeleteReceipt();
};
const submitReceipt = async () => {
  await receiptsStore.submitReceipt();
};

onMounted(loadReceipts);
</script>
