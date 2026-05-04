<template>
  <div
    class="min-h-screen bg-slate-50/50 pb-12 pt-4 font-sans text-slate-900 md:px-8 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto max-w-[1440px] space-y-6">

      <section class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Manajemen Mata Pelajaran</h1>
          </div>
        </div>
      </section>

      <main
        class="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div
          class="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Struktur Mapel Aktif</h2>
            <p class="mt-1 text-sm text-slate-500">Kelola dan pantau kurikulum sekolah.</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input v-model="searchQuery" type="text" placeholder="Cari mapel, kelas, atau guru..."
                class="block w-full rounded-lg border-0 py-2 pl-9 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:w-64" />
            </div>
            <button @click="loadData"
              class="inline-flex h-9 items-center justify-center rounded-lg bg-slate-50 px-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
              title="Refresh Data">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
            <button @click="openModal"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Tambah Mapel
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead
              class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Mata Pelajaran</th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Detail Kelas</th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Guru Pengampu</th>
                <th class="border-b border-slate-200 px-6 py-4 text-right font-semibold dark:border-slate-800">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in paginatedFilteredSubjects" :key="item.id"
                class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                      <img v-if="item.chat_icon_url" :src="item.chat_icon_url" alt="Ikon grup mapel" class="h-full w-full object-cover" />
                      <svg v-else class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v11.494m-5.747-8.62l11.494 5.747M6.253 14.873l11.494-5.747" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-slate-900 dark:text-white">{{ item.name }}</div>
                      <div class="mt-1 max-w-[200px] truncate text-xs text-slate-500 dark:text-slate-400"
                        :title="item.description">
                        {{ item.description || "Tidak ada deskripsi" }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-700/10 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20">
                    {{ item.class_name || "-" }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {{ item.teacher_name ? item.teacher_name.charAt(0).toUpperCase() : "?" }}
                    </div>
                    <span class="font-medium text-slate-700 dark:text-slate-300">
                      {{ item.teacher_name || "Belum Ditugaskan" }}</span>
                  </div>
                </td>

                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="startEdit(item)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
                      title="Edit Mapel">
                      <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                      Edit
                    </button>
                    <button @click="openDeleteModal(item)"
                      class="inline-flex items-center justify-center rounded-lg bg-white p-1.5 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      title="Hapus Mapel">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredSubjects.length === 0">
                <td colspan="4" class="px-6 py-16 text-center">
                  <div class="mx-auto flex max-w-sm flex-col items-center">
                    <div
                      class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-900 dark:text-white">Tidak Ada Data Ditemukan</span>
                    <span class="mt-1 text-sm text-slate-500">
                      {{ subjects.length === 0 ? "Silakan buat mata pelajaran baru menggunakan tombol Tambah Mapel." :
                        "Coba sesuaikan kata kunci pencarian Anda." }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Halaman {{ currentPage }} dari {{ totalPages }} · Menampilkan {{ paginatedFilteredSubjects.length }} mapel
          </p>
          <div class="flex items-center gap-2">
            <button @click="goToPrevPage" :disabled="currentPage === 1"
              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              Sebelumnya
            </button>
            <button @click="goToNextPage" :disabled="currentPage >= totalPages"
              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              Berikutnya
            </button>
          </div>
        </div>
      </main>
    </div>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div
            class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">
              {{ editingId ? "Perbarui Mapel" : "Buat Mapel Baru" }}
            </h2>
            <button @click="closeModal"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitSubject">
            <div class="space-y-5 p-6">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Mapel <span
                    class="text-rose-500">*</span></label>
                <input v-model="form.name" required placeholder="Contoh: Matematika Lanjut"
                  class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kelas Target <span
                    class="text-rose-500">*</span></label>
                <select v-model="form.class_id" required
                  class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                  <option value="" disabled>-- Pilih Kelas --</option>
                  <option v-for="item in classes" :key="item.id" :value="item.id">
                    {{ item.class_name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Guru Pengampu <span
                    class="text-rose-500">*</span></label>
                <select v-model="form.teacher_id" required
                  class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                  <option value="" disabled>-- Pilih Guru --</option>
                  <option v-for="item in teachers" :key="item.id" :value="item.id">
                    {{ item.username }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi /
                  Catatan</label>
                <textarea v-model="form.description" rows="3" placeholder="Catatan opsional untuk kurikulum..."
                  class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Ikon Grup Chat</label>
                <div class="flex items-center gap-4">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                    <img v-if="chatIconPreview" :src="chatIconPreview" alt="Preview ikon grup" class="h-full w-full object-cover" />
                    <svg v-else class="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v11.494m-5.747-8.62l11.494 5.747M6.253 14.873l11.494-5.747" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <input type="file" accept="image/*" @change="handleChatIconChange"
                      class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200" />
                    <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Upload ikon khusus untuk grup chat mapel ini.</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
              <button type="button" @click="closeModal"
                class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60">
                <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                {{ isSubmitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambahkan Mapel" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div class="flex items-start gap-4 px-6 py-5">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Hapus Mata Pelajaran?</h2>
              <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Mapel
                <span class="font-semibold text-slate-700 dark:text-slate-200">
                  {{ subjectToDelete?.name || "-" }}
                </span>
                akan dihapus beserta data terkaitnya. Tindakan ini tidak bisa dibatalkan.
              </p>
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <button type="button" @click="closeDeleteModal"
              class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Batal
            </button>
            <button type="button" @click="confirmDeleteSubject" :disabled="isDeletingSubject"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60">
              <svg v-if="isDeletingSubject" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {{ isDeletingSubject ? "Menghapus..." : "Ya, Hapus" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <SuccessModal ref="successModal" />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import SuccessModal from "@/components/SuccessModal.vue";
import { useMasterDataStore } from "@/store/masterData";

const successModal = ref(null);
const masterDataStore = useMasterDataStore();

const baseForm = () => ({
  name: "",
  class_id: "",
  teacher_id: "",
  description: "",
  chat_icon_url: "",
});

const form = reactive(baseForm());
const editingId = ref(null);
const subjects = ref([]);
const classes = ref([]);
const teachers = ref([]);
const isSubmitting = ref(false);
const chatIconFile = ref(null);
const chatIconPreview = ref("");
const isDeleteModalOpen = ref(false);
const isDeletingSubject = ref(false);
const subjectToDelete = ref(null);
const currentPage = ref(1);
const pageSize = 10;
const totalSubjects = ref(0);

// State Modal & Global Alert
const isModalOpen = ref(false);

// Fitur Pencarian Client-Side
const searchQuery = ref("");

const filteredSubjects = computed(() => {
  return subjects.value;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalSubjects.value / pageSize)),
);

const paginatedFilteredSubjects = computed(() => filteredSubjects.value);

// Buka/Tutup Modal
const openModal = () => {
  resetForm();
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const openDeleteModal = (item) => {
  subjectToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  if (isDeletingSubject.value) return;
  isDeleteModalOpen.value = false;
  subjectToDelete.value = null;
};

const resetForm = () => {
  editingId.value = null;
  Object.assign(form, baseForm());
  chatIconFile.value = null;
  chatIconPreview.value = "";
};

// Fungsi Load & CRUD
const loadData = async () => {
  try {
    const [subjectResponse, classItems, teacherItems] = await Promise.all([
      api.get("/learning/subjects/admin", {
        params: {
          paginate: 1,
          page: currentPage.value,
          limit: pageSize,
          q: searchQuery.value || undefined,
        },
      }),
      masterDataStore.getClasses(),
      masterDataStore.getTeacherUsers(),
    ]);

    subjects.value = subjectResponse?.data?.data || [];
    totalSubjects.value = Number(subjectResponse?.data?.total || 0);
    classes.value = classItems || [];
    teachers.value = teacherItems || [];
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Mata Pelajaran",
      message: error.message,
      type: "error",
    });
  }
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    loadData();
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    loadData();
  }
};

watch(searchQuery, () => {
  currentPage.value = 1;
  loadData();
});

const startEdit = (item) => {
  editingId.value = item.id;
  form.name = item.name || "";
  form.class_id = item.class_id || "";
  form.teacher_id = item.teacher_id || "";
  form.description = item.description || "";
  form.chat_icon_url = item.chat_icon_url || "";
  chatIconFile.value = null;
  chatIconPreview.value = item.chat_icon_url || "";
  isModalOpen.value = true;
};

const handleChatIconChange = (event) => {
  const file = event.target.files?.[0] || null;
  chatIconFile.value = file;
  chatIconPreview.value = file ? URL.createObjectURL(file) : form.chat_icon_url || "";
};

const confirmDeleteSubject = async () => {
  if (!subjectToDelete.value?.id) return;

  isDeletingSubject.value = true;
  try {
    await api.delete(`/learning/subjects/${subjectToDelete.value.id}`);
    successModal.value.show("Mata pelajaran berhasil dihapus");
    isDeleteModalOpen.value = false;
    subjectToDelete.value = null;
    masterDataStore.invalidate(["adminSubjects", "teacherSubjects", "studentSubjects"]);
    await loadData();
  } catch (error) {
    pushToast({
      title: "Gagal Menghapus Mata Pelajaran",
      message: error.message,
      type: "error",
    });
  } finally {
    isDeletingSubject.value = false;
  }
};

const submitSubject = async () => {
  isSubmitting.value = true;

  try {
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("class_id", Number(form.class_id));
    payload.append("teacher_id", Number(form.teacher_id));
    payload.append("description", form.description || "");
    if (chatIconFile.value) {
      payload.append("chat_icon", chatIconFile.value);
    }

    const response = editingId.value
      ? await api.put(`/learning/subjects/${editingId.value}`, payload)
      : await api.post("/learning/subjects", payload);

    closeModal();
    masterDataStore.invalidate(["adminSubjects", "teacherSubjects", "studentSubjects"]);
    await loadData();
    successModal.value.show(response?.message || "Mata pelajaran berhasil disimpan");
  } catch (error) {
    pushToast({
      title: editingId.value ? "Gagal Memperbarui Mata Pelajaran" : "Gagal Membuat Mata Pelajaran",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
    // Jika terjadi error, biarkan modal tetap terbuka agar pengguna bisa memperbaiki input
  }
};

onMounted(loadData);
</script>
