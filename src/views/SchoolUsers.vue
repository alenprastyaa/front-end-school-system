<template>
  <div class="p-6 space-y-6">
    <section class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">User Sekolah</h1>
        </div>
        <button @click="openCreateModal"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
          Tambah User Sekolah
        </button>
      </div>
    </section>

    <section>
      <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Daftar User Sekolah</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Role yang dikelola di sini: admin dan guru.</p>
          </div>
          <button @click="loadUsers" class="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-white">
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
                  <button @click="handleSort('username')" class="inline-flex items-center gap-1 font-medium">
                    Username {{ sortIndicator('username') }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button @click="handleSort('role')" class="inline-flex items-center gap-1 font-medium">
                    Role {{ sortIndicator('role') }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button @click="handleSort('parent_email')" class="inline-flex items-center gap-1 font-medium">
                    Email {{ sortIndicator('parent_email') }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button @click="handleSort('phone_number')" class="inline-flex items-center gap-1 font-medium">
                    No. HP {{ sortIndicator('phone_number') }}
                  </button>
                </th>
                <th class="py-3 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sortedUsers" :key="item.id"
                class="border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
                <td class="py-3 pr-4">{{ item.username }}</td>
                <td class="py-3 pr-4">{{ item.role }}</td>
                <td class="py-3 pr-4">{{ item.parent_email || "-" }}</td>
                <td class="py-3 pr-4">{{ item.phone_number || "-" }}</td>
                <td class="py-3 pr-4">
                  <button @click="startEdit(item)" class="px-3 py-1 rounded-md bg-blue-600 text-white">
                    Edit
                  </button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="5" class="py-6 text-center text-gray-500 dark:text-gray-400">
                  Belum ada user sekolah.
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
              {{ editingUserId ? "Edit User Sekolah" : "Tambah User Sekolah" }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Form create dan edit dipusatkan dalam modal agar tabel tetap bersih.
            </p>
          </div>
          <button @click="closeModal" class="text-2xl leading-none text-gray-500 dark:text-gray-300">
            &times;
          </button>
        </div>

        <form @submit.prevent="submitUser" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input v-model="form.username" type="text" required
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ editingUserId ? "Password Baru" : "Password" }}
            </label>
            <input v-model="form.password" type="password" :required="!editingUserId"
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
            <p v-if="editingUserId" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Kosongkan jika password tidak ingin diganti.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select v-model="form.role"
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white">
              <option value="ADMIN">ADMIN</option>
              <option value="GURU">GURU</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input v-model="form.parent_email" type="email"
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor HP</label>
            <input v-model="form.phone_number" type="text"
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
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
              {{ isSubmitting ? "Menyimpan..." : editingUserId ? "Update User Sekolah" : "Buat User Sekolah" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";

const baseForm = () => ({
  username: "",
  password: "",
  role: "ADMIN",
  parent_email: "",
  phone_number: "",
});

const form = reactive(baseForm());
const users = ref([]);
const editingUserId = ref(null);
const showModal = ref(false);
const isSubmitting = ref(false);
const message = ref("");
const isError = ref(false);
const loadError = ref("");
const tableSort = createSortState("username");

const messageClass = computed(() =>
  isError.value ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600",
);

const sortedUsers = computed(() =>
  sortItems(users.value, tableSort, {
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
  editingUserId.value = null;
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

const loadUsers = async () => {
  loadError.value = "";

  try {
    const response = await api.get("/auth/user-school");
    users.value = (response?.data || []).filter((item) => ["ADMIN", "GURU"].includes(item.role));
  } catch (error) {
    loadError.value = error.message;
  }
};

const startEdit = (item) => {
  editingUserId.value = item.id;
  form.username = item.username;
  form.password = "";
  form.role = item.role;
  form.parent_email = item.parent_email || "";
  form.phone_number = item.phone_number || "";
  message.value = "";
  isError.value = false;
  showModal.value = true;
};

const submitUser = async () => {
  isSubmitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const payload = {
      username: form.username,
      role: form.role,
      parent_email: form.parent_email || null,
      phone_number: form.phone_number || null,
    };

    if (form.password) {
      payload.password = form.password;
    }

    const response = editingUserId.value
      ? await api.put(`/auth/user-school/${editingUserId.value}`, payload)
      : await api.post("/auth/register/user-school", payload);

    message.value = response?.message || (editingUserId.value ? "User sekolah berhasil diupdate" : "User sekolah berhasil dibuat");
    await loadUsers();
    closeModal();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadUsers);
</script>
