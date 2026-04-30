<template>
  <div class="p-6 space-y-6">
    <section class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Kelas</h1>
        </div>
        <button @click="openCreateModal"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
          Tambah Kelas
        </button>
      </div>
    </section>

    <section>
      <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Daftar kelas</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Data live dari backend.</p>
          </div>
          <button @click="loadClasses" class="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-white">
            Refresh
          </button>
        </div>

        <div v-if="loadError" class="mt-4 p-3 rounded-md bg-red-50 text-red-600 text-sm">
          {{ loadError }}
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <th class="py-3 pr-4">
                  <button @click="handleSort('id')" class="inline-flex items-center gap-1 font-medium">
                    ID {{ sortIndicator('id') }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button @click="handleSort('class_name')" class="inline-flex items-center gap-1 font-medium">
                    Nama Kelas {{ sortIndicator('class_name') }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button @click="handleSort('wali_guru_name')" class="inline-flex items-center gap-1 font-medium">
                    Wali Kelas {{ sortIndicator('wali_guru_name') }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button @click="handleSort('wali_guru_email')" class="inline-flex items-center gap-1 font-medium">
                    Email Wali {{ sortIndicator('wali_guru_email') }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button @click="handleSort('wali_guru_phone_number')"
                    class="inline-flex items-center gap-1 font-medium">
                    No. HP Wali {{ sortIndicator('wali_guru_phone_number') }}
                  </button>
                </th>
                <th class="py-3 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sortedClasses" :key="item.id"
                class="border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                <td class="py-3 pr-4">{{ item.id }}</td>
                <td class="py-3 pr-4">{{ item.class_name }}</td>
                <td class="py-3 pr-4">{{ item.wali_guru_name || "-" }}</td>
                <td class="py-3 pr-4">{{ item.wali_guru_email || "-" }}</td>
                <td class="py-3 pr-4">{{ item.wali_guru_phone_number || "-" }}</td>
                <td class="py-3 pr-4">
                  <button @click="startEdit(item)" class="px-3 py-1 rounded-md bg-blue-600 text-white">
                    Edit
                  </button>
                </td>
              </tr>
              <tr v-if="classes.length === 0">
                <td colspan="6" class="py-6 text-center text-gray-500 dark:text-gray-400">
                  Belum ada data kelas.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-xl">
        <div class="flex items-center justify-between gap-4 px-6 py-4 border-b dark:border-gray-700">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingClassId ? "Edit Kelas" : "Tambah Kelas" }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Atur nama kelas dan wali kelas dari satu dialog.
            </p>
          </div>
          <button @click="closeModal" class="text-2xl leading-none text-gray-500 dark:text-gray-300">
            &times;
          </button>
        </div>

        <form @submit.prevent="submitClass" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Kelas</label>
            <input v-model="className" type="text" required
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Wali Kelas</label>
            <select v-model="waliGuruId"
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white">
              <option value="">Belum ditentukan</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.username }}
              </option>
            </select>
          </div>

          <div v-if="message" :class="messageClass" class="p-3 rounded-md text-sm">
            {{ message }}
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="closeModal"
              class="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-white">
              Batal
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60">
              {{ isSubmitting ? "Menyimpan..." : editingClassId ? "Update Kelas" : "Tambah Kelas" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "@/api";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";

const className = ref("");
const waliGuruId = ref("");
const classes = ref([]);
const teachers = ref([]);
const editingClassId = ref(null);
const showModal = ref(false);
const isSubmitting = ref(false);
const message = ref("");
const isError = ref(false);
const loadError = ref("");
const tableSort = createSortState("class_name");

const messageClass = computed(() =>
  isError.value ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600",
);

const sortedClasses = computed(() =>
  sortItems(classes.value, tableSort, {
    wali_guru_name: (item) => item.wali_guru_name || "",
    wali_guru_email: (item) => item.wali_guru_email || "",
    wali_guru_phone_number: (item) => item.wali_guru_phone_number || "",
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

const loadClasses = async () => {
  loadError.value = "";

  try {
    const response = await api.get("/class");
    classes.value = response?.data || [];
  } catch (error) {
    loadError.value = error.message;
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
  message.value = "";
  isError.value = false;
  showModal.value = true;
};

const startEdit = (item) => {
  editingClassId.value = item.id;
  className.value = item.class_name;
  waliGuruId.value = item.wali_guru_id || "";
  message.value = "";
  isError.value = false;
  showModal.value = true;
};

const submitClass = async () => {
  isSubmitting.value = true;
  isError.value = false;
  message.value = "";

  try {
    const payload = {
      class_name: className.value,
      wali_guru_id: waliGuruId.value ? Number(waliGuruId.value) : null,
    };

    const response = editingClassId.value
      ? await api.put(`/class/${editingClassId.value}`, payload)
      : await api.post("/class", payload);

    message.value = response?.message || (editingClassId.value ? "Kelas berhasil diupdate" : "Kelas berhasil dibuat");
    await loadClasses();
    closeModal();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    await Promise.all([loadClasses(), loadTeachers()]);
  } catch (error) {
    loadError.value = error.message;
  }
});
</script>
