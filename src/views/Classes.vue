<template>
  <div
    class="min-h-screen bg-slate-50/50 pb-12 pt-4 font-sans text-slate-900 md:px-8 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto max-w-[1440px] space-y-6">

      <section class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Kelas</h1>
          </div>
          <button @click="openCreateModal"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Kelas
          </button>
        </div>
      </section>

      <main
        class="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          class="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Daftar Kelas</h2>
            <p class="mt-1 text-sm text-slate-500">Data live dari backend.</p>
          </div>
          <button @click="loadClasses"
            class="inline-flex h-9 items-center justify-center rounded-lg bg-slate-50 px-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead
              class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                  <button @click="handleSort('class_name')"
                    class="group flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                    Nama Kelas <span class="text-slate-300 transition group-hover:text-slate-500">{{ sortIndicator('class_name') }}</span>
                  </button>
                </th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                  <button @click="handleSort('wali_guru_name')"
                    class="group flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                    Wali Kelas <span class="text-slate-300 transition group-hover:text-slate-500">{{ sortIndicator('wali_guru_name') }}</span>
                  </button>
                </th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Email Wali</th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">No. HP Wali</th>
                <th class="border-b border-slate-200 px-6 py-4 text-right font-semibold dark:border-slate-800">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in sortedClasses" :key="item.id"
                class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">{{ item.class_name }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.wali_guru_name || "-" }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.wali_guru_email || "-" }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.wali_guru_phone_number || "-" }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="startEdit(item)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700">
                      <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                      Edit
                    </button>
                    <button @click="openDeleteModal(item)"
                      class="inline-flex items-center justify-center rounded-lg bg-white p-1.5 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      title="Hapus Kelas">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="classes.length === 0">
                <td colspan="5" class="px-6 py-16 text-center">
                  <div class="mx-auto flex max-w-sm flex-col items-center">
                    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-900 dark:text-white">Belum Ada Kelas</span>
                    <span class="mt-1 text-sm text-slate-500">Silakan buat kelas baru menggunakan tombol Tambah Kelas.</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- Modal Form Tambah/Edit Kelas -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div
            class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">
              {{ editingClassId ? "Edit Kelas" : "Tambah Kelas Baru" }}
            </h2>
            <button @click="closeModal"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitClass" class="space-y-5 p-6">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Kelas <span
                  class="text-rose-500">*</span></label>
              <input v-model="className" type="text" required placeholder="Contoh: X IPA 1"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Wali Kelas</label>
              <select v-model="waliGuruId"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option value="">Belum ditentukan</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.username }}
                </option>
              </select>
            </div>

            <div
              class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
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
                {{ isSubmitting ? "Menyimpan..." : editingClassId ? "Simpan Perubahan" : "Tambah Kelas" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal Konfirmasi Hapus Kelas -->
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
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Hapus Kelas?</h2>
              <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Kelas
                <span class="font-semibold text-slate-700 dark:text-slate-200">{{ classToDelete?.class_name || "-" }}</span>
                akan dihapus. Siswa di kelas ini akan kehilangan data kelasnya. Tindakan ini tidak bisa dibatalkan.
              </p>
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <button type="button" @click="closeDeleteModal"
              class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Batal
            </button>
            <button type="button" @click="confirmDeleteClass" :disabled="isDeletingClass"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60">
              <svg v-if="isDeletingClass" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {{ isDeletingClass ? "Menghapus..." : "Ya, Hapus" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <SuccessModal ref="successModal" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";
import SuccessModal from "@/components/SuccessModal.vue";

const successModal = ref(null);
const className = ref("");
const waliGuruId = ref("");
const classes = ref([]);
const teachers = ref([]);
const editingClassId = ref(null);
const showModal = ref(false);
const isSubmitting = ref(false);
const tableSort = createSortState("class_name");

// Delete state
const isDeleteModalOpen = ref(false);
const isDeletingClass = ref(false);
const classToDelete = ref(null);

const sortedClasses = computed(() =>
  sortItems(classes.value, tableSort, {
    wali_guru_name: (item) => item.wali_guru_name || "",
    wali_guru_email: (item) => item.wali_guru_email || "",
    wali_guru_phone_number: (item) => item.wali_guru_phone_number || "",
  }),
);

const handleSort = (key) => { toggleSort(tableSort, key); };

const sortIndicator = (key) => {
  if (tableSort.key !== key) return "↕";
  return tableSort.direction === "asc" ? "▲" : "▼";
};

const loadClasses = async () => {
  try {
    const response = await api.get("/class");
    classes.value = response?.data || [];
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Data Kelas",
      message: error.message,
      type: "error",
    });
  }
};

const loadTeachers = async () => {
  const response = await api.get("/auth/user-school?role=GURU");
  teachers.value = response?.data || [];
};

const resetForm = () => {
  className.value = "";
  waliGuruId.value = "";
  editingClassId.value = null;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const openCreateModal = () => {
  resetForm();
  showModal.value = true;
};

const startEdit = (item) => {
  editingClassId.value = item.id;
  className.value = item.class_name;
  waliGuruId.value = item.wali_guru_id || "";
  showModal.value = true;
};

const openDeleteModal = (item) => {
  classToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  if (isDeletingClass.value) return;
  isDeleteModalOpen.value = false;
  classToDelete.value = null;
};

const confirmDeleteClass = async () => {
  if (!classToDelete.value?.id) return;
  isDeletingClass.value = true;
  try {
    const res = await api.delete(`/class/${classToDelete.value.id}`);
    successModal.value.show(res?.message || "Kelas berhasil dihapus");
    isDeleteModalOpen.value = false;
    classToDelete.value = null;
    await loadClasses();
  } catch (error) {
    isDeleteModalOpen.value = false;
    pushToast({
      title: "Gagal Menghapus Kelas",
      message: error.message,
      type: "error",
    });
  } finally {
    isDeletingClass.value = false;
  }
};

const submitClass = async () => {
  isSubmitting.value = true;

  try {
    const payload = {
      class_name: className.value,
      wali_guru_id: waliGuruId.value ? Number(waliGuruId.value) : null,
    };

    const response = editingClassId.value
      ? await api.put(`/class/${editingClassId.value}`, payload)
      : await api.post("/class", payload);

    successModal.value.show(response?.message || (editingClassId.value ? "Kelas berhasil diupdate" : "Kelas berhasil dibuat"));
    await loadClasses();
    closeModal();
  } catch (error) {
    pushToast({
      title: editingClassId.value ? "Gagal Memperbarui Kelas" : "Gagal Membuat Kelas",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    await Promise.all([loadClasses(), loadTeachers()]);
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Halaman Kelas",
      message: error.message,
      type: "error",
    });
  }
});
</script>
