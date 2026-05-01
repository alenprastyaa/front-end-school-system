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
              </tr>
              <tr v-if="receipts.length === 0">
                <td colspan="4" class="py-6 text-center text-gray-500 dark:text-gray-400">
                  Belum ada bukti pembayaran.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
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
