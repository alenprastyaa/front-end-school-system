<template>
  <div class="p-6 space-y-6">
    <section
      class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6"
    >
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
              User Sekolah
            </h1>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="downloadGuruTemplate"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
            >
              Download Template Guru XLSX
            </button>
            <button
              @click="openGuruImportPicker"
              :disabled="isImportingGuru"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ isImportingGuru ? "Memproses..." : "Upload Excel Guru" }}
            </button>
            <button
              @click="openCreateModal"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Tambah User Sekolah
            </button>
          </div>
        </div>
      </section>

    <section>
      <div
        class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Daftar User Sekolah
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Role yang dikelola di sini: admin dan guru.
            </p>
          </div>
          <button
            @click="loadUsers"
            class="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-white"
          >
            Refresh
          </button>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr
                class="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700"
              >
                <th class="py-3 pr-4">
                  <button
                    @click="handleSort('full_name')"
                    class="inline-flex items-center gap-1 font-medium"
                  >
                    Nama Lengkap {{ sortIndicator("full_name") }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button
                    @click="handleSort('role')"
                    class="inline-flex items-center gap-1 font-medium"
                  >
                    Role {{ sortIndicator("role") }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button
                    @click="handleSort('parent_email')"
                    class="inline-flex items-center gap-1 font-medium"
                  >
                    Email {{ sortIndicator("parent_email") }}
                  </button>
                </th>
                <th class="py-3 pr-4">
                  <button
                    @click="handleSort('phone_number')"
                    class="inline-flex items-center gap-1 font-medium"
                  >
                    No. HP {{ sortIndicator("phone_number") }}
                  </button>
                </th>
                <th class="py-3 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in paginatedUsers"
                :key="item.id"
                class="border-b dark:border-gray-700 text-gray-800 dark:text-gray-200"
              >
                <td class="py-3 pr-4">{{ item.full_name || item.username || "-" }}</td>
                <td class="py-3 pr-4">{{ item.role }}</td>
                <td class="py-3 pr-4">{{ item.parent_email || "-" }}</td>
                <td class="py-3 pr-4">{{ item.phone_number || "-" }}</td>
                <td class="py-3 pr-4">
                  <div class="flex items-center gap-2">
                    <!-- <button
                      @click="startEdit(item)"
                      class="px-3 py-1 rounded-md bg-blue-600 text-white text-sm font-medium"
                    >
                      Edit
                    </button> -->
                    <button
                      @click="startEdit(item)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
                    >
                      <svg
                        class="h-3.5 w-3.5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      @click="openDeleteModal(item)"
                      class="inline-flex items-center justify-center rounded-lg bg-white p-1.5 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-rose-50 hover:text-rose-600 dark:bg-gray-800 dark:ring-gray-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      title="Hapus User"
                    >
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td
                  colspan="5"
                  class="py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Belum ada user sekolah.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Halaman {{ currentPage }} dari {{ totalPages }} · Menampilkan {{ paginatedUsers.length }} user
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="goToPrevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 rounded-md border dark:border-gray-600 text-xs font-semibold disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <button
              @click="goToNextPage"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1.5 rounded-md border dark:border-gray-600 text-xs font-semibold disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div
        class="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-xl"
      >
        <div
          class="flex items-center justify-between gap-4 px-6 py-4 border-b dark:border-gray-700"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingUserId ? "Edit User Sekolah" : "Tambah User Sekolah" }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Form create dan edit dipusatkan dalam modal agar tabel tetap
              bersih.
            </p>
          </div>
          <button
            @click="closeModal"
            class="text-2xl leading-none text-gray-500 dark:text-gray-300"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submitUser" class="p-6 space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Username</label
            >
            <input
              v-model="form.username"
              type="text"
              required
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ editingUserId ? "Password Baru" : "Password" }}
            </label>
            <input
              v-model="form.password"
              type="password"
              :required="!editingUserId"
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
            <p
              v-if="editingUserId"
              class="mt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              Kosongkan jika password tidak ingin diganti.
            </p>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Role</label
            >
            <select
              v-model="form.role"
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="GURU">GURU</option>
            </select>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Email</label
            >
            <input
              v-model="form.parent_email"
              type="email"
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Nomor HP</label
            >
            <input
              v-model="form.phone_number"
              type="text"
              class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60"
            >
              {{
                isSubmitting
                  ? "Menyimpan..."
                  : editingUserId
                  ? "Update User Sekolah"
                  : "Buat User Sekolah"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus User Sekolah -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      >
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-gray-800 dark:ring-white/10"
          @click.stop
        >
          <div class="flex items-start gap-4 px-6 py-5">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                Hapus User Sekolah?
              </h2>
              <p
                class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400"
              >
                User
                <span class="font-semibold text-gray-700 dark:text-gray-200">{{
                  userToDelete?.full_name || userToDelete?.username || "-"
                }}</span>
                ({{ userToDelete?.role }}) akan dihapus permanen dari sistem.
                Tindakan ini tidak bisa dibatalkan.
              </p>
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              type="button"
              @click="closeDeleteModal"
              class="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Batal
            </button>
            <button
              type="button"
              @click="confirmDeleteUser"
              :disabled="isDeletingUser"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                v-if="isDeletingUser"
                class="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              {{ isDeletingUser ? "Menghapus..." : "Ya, Hapus" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <SuccessModal ref="successModal" />
    <input
      ref="guruImportInput"
      type="file"
      accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      class="hidden"
      @change="handleGuruImportFileChange"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";
import SuccessModal from "@/components/SuccessModal.vue";

const successModal = ref(null);
const guruImportInput = ref(null);

const baseForm = () => ({
  username: "",
  password: "",
  role: "ADMIN",
  parent_email: "",
  phone_number: "",
});

const isDeleteModalOpen = ref(false);
const isDeletingUser = ref(false);
const userToDelete = ref(null);

const form = reactive(baseForm());
const users = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const totalUsers = ref(0);
const editingUserId = ref(null);
const showModal = ref(false);
const isSubmitting = ref(false);
const isImportingGuru = ref(false);
const tableSort = createSortState("full_name");

const sortedUsers = computed(() =>
  sortItems(users.value, tableSort, {
    full_name: (item) => item.full_name || item.username || "",
    parent_email: (item) => item.parent_email || "",
    phone_number: (item) => item.phone_number || "",
  }),
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalUsers.value / pageSize)),
);

const paginatedUsers = computed(() => sortedUsers.value);

const handleSort = (key) => {
  toggleSort(tableSort, key);
  currentPage.value = 1;
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
  showModal.value = true;
};

const downloadGuruTemplate = () => {
  const token = localStorage.getItem("token");
  fetch(`${api.baseUrl}/auth/user-school/template`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Gagal mengunduh template guru");
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "template-guru.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      pushToast({
        title: "Gagal Download Template",
        message: error.message,
        type: "error",
      });
    });
};

const openGuruImportPicker = () => {
  guruImportInput.value?.click();
};

const handleGuruImportFileChange = async (event) => {
  const file = event?.target?.files?.[0];
  if (!file) return;

  isImportingGuru.value = true;
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/auth/register/user-school/import", formData);
    const imported = Number(response?.data?.imported || 0);
    const failed = Number(response?.data?.failed || 0);

    await loadUsers();
    pushToast({
      title: "Import Guru Selesai",
      message: `${imported} guru berhasil diimport${failed > 0 ? `, ${failed} baris gagal` : ""}.`,
      type: "success",
    });
    if (failed > 0) {
      pushToast({
        title: "Sebagian Baris Gagal",
        message: "Periksa data yang kosong atau username yang sudah ada.",
        type: "error",
      });
    }
  } catch (error) {
    pushToast({
      title: "Gagal Import Guru",
      message: error.message,
      type: "error",
    });
  } finally {
    isImportingGuru.value = false;
    if (guruImportInput.value) {
      guruImportInput.value.value = "";
    }
  }
};

const loadUsers = async () => {
  try {
    const response = await api.get("/auth/user-school", {
      params: {
        paginate: 1,
        page: currentPage.value,
        limit: pageSize,
      },
    });
    users.value = (response?.data?.data || []).filter((item) =>
      ["ADMIN", "GURU"].includes(item.role),
    );
    totalUsers.value = Number(response?.data?.total || 0);
  } catch (error) {
    pushToast({
      title: "Gagal Memuat User Sekolah",
      message: error.message,
      type: "error",
    });
  }
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    loadUsers();
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    loadUsers();
  }
};

const startEdit = (item) => {
  editingUserId.value = item.id;
  form.username = item.username;
  form.password = "";
  form.role = item.role;
  form.parent_email = item.parent_email || "";
  form.phone_number = item.phone_number || "";
  showModal.value = true;
};

const openDeleteModal = (item) => {
  userToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  if (isDeletingUser.value) return;
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};

const confirmDeleteUser = async () => {
  if (!userToDelete.value?.id) return;
  isDeletingUser.value = true;
  try {
    await api.delete(`/auth/user-school/${userToDelete.value.id}`);
    isDeleteModalOpen.value = false;
    userToDelete.value = null;
    await loadUsers();
    successModal.value.show("User berhasil dihapus");
  } catch (error) {
    isDeleteModalOpen.value = false;
    pushToast({
      title: "Gagal Menghapus User Sekolah",
      message: error.message,
      type: "error",
    });
  } finally {
    isDeletingUser.value = false;
  }
};

const submitUser = async () => {
  isSubmitting.value = true;

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

    await loadUsers();
    closeModal();
    successModal.value.show(
      response?.message ||
        (editingUserId.value
          ? "User sekolah berhasil diupdate"
          : "User sekolah berhasil dibuat"),
    );
  } catch (error) {
    pushToast({
      title: editingUserId.value ? "Gagal Mengupdate User Sekolah" : "Gagal Membuat User Sekolah",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadUsers);
</script>
