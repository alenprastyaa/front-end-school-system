<template>
  <div
    class="min-h-screen bg-slate-50/50 pb-12 pt-4 font-sans text-slate-900 md:px-8 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto max-w-[1440px] space-y-6">

      <section class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Manajemen Siswa</h1>
          </div>
          <button @click="openCreateModal"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Siswa
          </button>
        </div>
      </section>

      <div>
        <main
          class="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div
            class="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">Direktori Siswa</h2>
              <p class="mt-1 text-sm text-slate-500">Total {{ students.length }} data siswa termuat.</p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                  </svg>
                </div>
                <select v-model="filters.class_id" @change="loadStudents"
                  class="block w-full rounded-lg border-0 py-2 pl-9 pr-8 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                  <option value="">Semua Kelas</option>
                  <option v-for="item in classOptions" :key="item.id" :value="item.id">
                    {{ item.class_name }}
                  </option>
                </select>
              </div>
              <button @click="loadStudents"
                class="inline-flex h-9 items-center justify-center rounded-lg bg-white px-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800">
                Refresh
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead
                class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                    <button @click="handleSort('username')"
                      class="group flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                      Username <span class="text-slate-300 transition group-hover:text-slate-500">{{
                        sortIndicator('username') }}</span>
                    </button>
                  </th>
                  <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                    <button @click="handleSort('class_name')"
                      class="group flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                      Kelas <span class="text-slate-300 transition group-hover:text-slate-500">{{
                        sortIndicator('class_name') }}</span>
                    </button>
                  </th>
                  <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                    Kontak Ortu
                  </th>
                  <th class="border-b border-slate-200 px-6 py-4 text-right font-semibold dark:border-slate-800">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in sortedStudents" :key="item.id"
                  class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  :class="editingId === item.id ? 'bg-sky-50/50 dark:bg-sky-900/10' : ''">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {{ item.username.charAt(0).toUpperCase() }}
                      </div>
                      <span class="font-medium text-slate-900 dark:text-white">{{ item.username }}</span>
                    </div>
                  </td>

                  <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <span
                      class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {{ item.class_name || "Belum ada kelas" }}
                    </span>
                  </td>

                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ item.parent_email || "-" }}
                    </div>
                    <div class="text-xs text-slate-500">{{ item.phone_number || "Tanpa No. HP" }}</div>
                  </td>

                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="startEdit(item)"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700">
                        <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                        Edit
                      </button>
                      <button @click="openDeleteModal(item)"
                        class="inline-flex items-center justify-center rounded-lg bg-white p-1.5 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        title="Hapus Siswa">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="students.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center">
                    <div class="mx-auto flex flex-col items-center">
                      <div
                        class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <span class="text-sm font-semibold text-slate-900 dark:text-white">Tidak Ada Data Siswa</span>
                      <span class="mt-1 text-sm text-slate-500">Gunakan tombol tambah siswa untuk mendaftarkan siswa
                        baru.</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <div v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
        <div
          class="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div
            class="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div class="flex items-center gap-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <svg v-if="editingId" class="h-4 w-4 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                <svg v-else class="h-4 w-4 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.69-1.925 3.375 3.375 0 00-6.742 0A12.022 12.022 0 014 19.234z" />
                </svg>
              </div>
              <div>
                <h2 class="font-semibold text-slate-900 dark:text-white">
                  {{ editingId ? "Edit Data Siswa" : "Tambah Siswa Baru" }}
                </h2>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  {{ editingId ? "Perbarui data siswa dari dialog ini." : "Daftarkan siswa baru melalui dialog ini." }}
                </p>
              </div>
            </div>
            <button @click="closeModal"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="editingId ? updateStudent() : createStudent()" class="space-y-4 p-6">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Username <span
                  class="text-rose-500">*</span></label>
              <input v-model="form.username" type="text" required placeholder="e.g. budi_santoso"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </div>

            <div v-if="!editingId">
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password <span
                  class="text-rose-500">*</span></label>
              <input v-model="form.password" type="password" required placeholder="••••••••"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Penempatan Kelas <span
                  class="text-rose-500">*</span></label>
              <select v-model="form.class_id" required
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option disabled value="">-- Pilih Rombongan Belajar --</option>
                <option v-for="item in classOptions" :key="item.id" :value="item.id">
                  {{ item.class_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Orang Tua</label>
              <input v-model="form.parent_email" type="email" placeholder="ortu@contoh.com"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nomor Telepon</label>
              <input v-model="form.phone_number" type="text" placeholder="08123456789"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeModal"
                class="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60 dark:bg-sky-600 dark:hover:bg-sky-500">
                <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <svg v-else-if="!editingId" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {{ isSubmitting ? "Menyimpan Data..." : editingId ? "Simpan Perubahan" : "Buat Akun Siswa" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Konfirmasi Hapus Siswa -->
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
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Hapus Siswa?</h2>
            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Siswa
              <span class="font-semibold text-slate-700 dark:text-slate-200">{{ studentToDelete?.username || "-" }}</span>
              beserta seluruh data absensi dan pembayarannya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
          <button type="button" @click="closeDeleteModal"
            class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            Batal
          </button>
          <button type="button" @click="confirmDeleteStudent" :disabled="isDeletingStudent"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60">
            <svg v-if="isDeletingStudent" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {{ isDeletingStudent ? "Menghapus..." : "Ya, Hapus" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <SuccessModal ref="successModal" />
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";
import SuccessModal from "@/components/SuccessModal.vue";

const successModal = ref(null);

const baseForm = () => ({
  username: "",
  password: "",
  class_id: "",
  parent_email: "",
  phone_number: "",
});

const isDeleteModalOpen = ref(false);
const isDeletingStudent = ref(false);
const studentToDelete = ref(null);

const form = reactive(baseForm());
const filters = reactive({ class_id: "", page: 1, limit: 10 });
const students = ref([]);
const classOptions = ref([]);
const editingId = ref(null);
const showModal = ref(false);
const isSubmitting = ref(false);
const tableSort = createSortState("username");

const sortedStudents = computed(() =>
  sortItems(students.value, tableSort, {
    class_name: (item) => item.class_name || "",
    parent_email: (item) => item.parent_email || "",
    phone_number: (item) => item.phone_number || "",
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

const resetForm = () => {
  Object.assign(form, baseForm());
  editingId.value = null;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const openCreateModal = () => {
  resetForm();
  showModal.value = true;
};

const loadClasses = async () => {
  const response = await api.get("/class");
  classOptions.value = response?.data || [];
};

const loadStudents = async () => {
  try {
    const params = new URLSearchParams({
      page: String(filters.page),
      limit: String(filters.limit),
    });

    if (filters.class_id) {
      params.set("class_id", filters.class_id);
    }

    const response = await api.get(`/student?${params.toString()}`);
    students.value = response?.data?.data || [];
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Data Siswa",
      message: error.message,
      type: "error",
    });
  }
};

const createStudent = async () => {
  isSubmitting.value = true;

  try {
    const response = await api.post("/auth/register/student", {
      username: form.username,
      password: form.password,
      role: "SISWA",
      class_id: Number(form.class_id),
      parent_email: form.parent_email || null,
    });
    await loadStudents();
    closeModal();
    successModal.value.show(response?.message || "Siswa berhasil didaftarkan.");
  } catch (error) {
    pushToast({
      title: "Gagal Menambahkan Siswa",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const startEdit = (item) => {
  const matchedClass = classOptions.value.find(
    (classItem) => classItem.class_name === item.class_name,
  );
  editingId.value = item.id;
  form.username = item.username;
  form.password = "";
  form.class_id = matchedClass?.id || "";
  form.parent_email = item.parent_email || "";
  form.phone_number = item.phone_number || "";
  showModal.value = true;
};

const openDeleteModal = (item) => {
  studentToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  if (isDeletingStudent.value) return;
  isDeleteModalOpen.value = false;
  studentToDelete.value = null;
};

const confirmDeleteStudent = async () => {
  if (!studentToDelete.value?.id) return;
  isDeletingStudent.value = true;
  try {
    await api.delete(`/student/${studentToDelete.value.id}`);
    isDeleteModalOpen.value = false;
    studentToDelete.value = null;
    await loadStudents();
    successModal.value.show("Siswa berhasil dihapus");
  } catch (error) {
    isDeleteModalOpen.value = false;
    pushToast({
      title: "Gagal Menghapus Siswa",
      message: error.message,
      type: "error",
    });
  } finally {
    isDeletingStudent.value = false;
  }
};

const updateStudent = async () => {
  isSubmitting.value = true;

  try {
    const response = await api.put(`/student/${editingId.value}`, {
      username: form.username,
      role: "SISWA",
      class_id: Number(form.class_id),
      parent_email: form.parent_email || null,
      phone_number: form.phone_number || null,
    });
    await loadStudents();
    closeModal();
    successModal.value.show(response?.message || "Data siswa berhasil diperbarui.");
  } catch (error) {
    pushToast({
      title: "Gagal Memperbarui Siswa",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    await loadClasses();
    await loadStudents();
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Halaman Siswa",
      message: error.message,
      type: "error",
    });
  }
});
</script>
