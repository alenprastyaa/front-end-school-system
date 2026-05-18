<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto space-y-6">
      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Super Admin</p>
            <h1 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Setting Modul</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Atur modul yang tampil di sekolah. Modul dasar tetap aktif, sementara Sarpras, Absensi, Koperasi, Chat
            Pribadi, dan Ujian Resmi bisa diaktifkan atau dimatikan per sekolah.
            </p>
          </div>
          <button @click="loadSchools" :disabled="isLoading"
            class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            {{ isLoading ? "Memuat..." : "Refresh Data" }}
          </button>
        </div>
      </section>

      <section v-if="message" class="rounded-2xl px-5 py-4 text-sm font-medium ring-1 ring-inset"
        :class="isError ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20'">
        {{ message }}
      </section>

      <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Daftar Sekolah</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Toggle modul aktif / nonaktif per sekolah.</p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th class="px-4 py-3 font-medium sm:px-6">Sekolah</th>
                <th class="px-4 py-3 font-medium sm:px-6">Sarpras</th>
                <th class="px-4 py-3 font-medium sm:px-6">Absensi</th>
                <th class="px-4 py-3 font-medium sm:px-6">Koperasi</th>
                <th class="px-4 py-3 font-medium sm:px-6">Chat Pribadi</th>
                <th class="px-4 py-3 font-medium sm:px-6">Ujian Resmi</th>
                <th class="px-4 py-3 font-medium text-right sm:px-6">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in schools" :key="item.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                <td class="px-4 py-4 sm:px-6">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ item.name }}</div>
                </td>
                <td class="px-4 py-4 sm:px-6">
                  <label class="inline-flex items-center gap-2 text-sm font-semibold">
                    <input v-model="item.inventory_module_enabled" type="checkbox"
                      class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                    {{ item.inventory_module_enabled !== false ? "Aktif" : "Nonaktif" }}
                  </label>
                </td>
                <td class="px-4 py-4 sm:px-6">
                  <label class="inline-flex items-center gap-2 text-sm font-semibold">
                    <input v-model="item.attendance_module_enabled" type="checkbox"
                      class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                    {{ item.attendance_module_enabled !== false ? "Aktif" : "Nonaktif" }}
                  </label>
                </td>
                <td class="px-4 py-4 sm:px-6">
                  <label class="inline-flex items-center gap-2 text-sm font-semibold">
                    <input v-model="item.koperasi_module_enabled" type="checkbox"
                      class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                    {{ item.koperasi_module_enabled !== false ? "Aktif" : "Nonaktif" }}
                  </label>
                </td>
                <td class="px-4 py-4 sm:px-6">
                  <label class="inline-flex items-center gap-2 text-sm font-semibold">
                    <input v-model="item.private_chat_module_enabled" type="checkbox"
                      class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                    {{ item.private_chat_module_enabled !== false ? "Aktif" : "Nonaktif" }}
                  </label>
                </td>
                <td class="px-4 py-4 sm:px-6">
                  <label class="inline-flex items-center gap-2 text-sm font-semibold">
                    <input v-model="item.official_exam_module_enabled" type="checkbox"
                      class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                    {{ item.official_exam_module_enabled !== false ? "Aktif" : "Nonaktif" }}
                  </label>
                </td>
                <td class="px-4 py-4 sm:px-6 text-right">
                  <button
                    class="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
                    :disabled="savingId === item.id" @click="saveModuleSettings(item)">
                    {{ savingId === item.id ? "Menyimpan..." : "Simpan" }}
                  </button>
                </td>
              </tr>
              <tr v-if="schools.length === 0">
                <td colspan="7" class="px-4 py-10 text-center text-slate-500 sm:px-6">Belum ada sekolah terdaftar.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";

const schools = ref([]);
const isLoading = ref(false);
const savingId = ref(null);
const message = ref("");
const isError = ref(false);

const toBooleanFlag = (value) => {
  if (value === true || value === 1) {
    return true;
  }
  if (value === false || value === 0 || value == null) {
    return false;
  }
  const normalized = String(value).trim().toLowerCase();
  return ["true", "t", "1", "yes", "y", "on"].includes(normalized);
};

const loadSchools = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/school");
    schools.value = Array.isArray(response?.data?.items)
          ? response.data.items.map((item) => ({
          ...item,
          inventory_module_enabled: toBooleanFlag(item.inventory_module_enabled),
          attendance_module_enabled: toBooleanFlag(item.attendance_module_enabled),
          koperasi_module_enabled: toBooleanFlag(item.koperasi_module_enabled),
          private_chat_module_enabled: toBooleanFlag(item.private_chat_module_enabled),
          official_exam_module_enabled: toBooleanFlag(item.official_exam_module_enabled),
        }))
      : [];
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Gagal memuat data modul.";
  } finally {
    isLoading.value = false;
  }
};

const saveModuleSettings = async (item) => {
  savingId.value = item.id;
  isError.value = false;
  message.value = "";
  try {
    const formData = new FormData();
    formData.append("inventory_module_enabled", String(Boolean(item.inventory_module_enabled)));
    formData.append("attendance_module_enabled", String(Boolean(item.attendance_module_enabled)));
    formData.append("koperasi_module_enabled", String(Boolean(item.koperasi_module_enabled)));
    formData.append("private_chat_module_enabled", String(Boolean(item.private_chat_module_enabled)));
    formData.append("official_exam_module_enabled", String(Boolean(item.official_exam_module_enabled)));
    const response = await api.put(`/school/${item.id}/modules`, formData);
    message.value = response?.message || "Setting modul berhasil disimpan.";
    pushToast({
      title: "Setting Modul Disimpan",
      message: response?.message || "Modul sekolah berhasil diperbarui.",
      type: "success",
    });
    await loadSchools();
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Gagal menyimpan setting modul.";
    pushToast({
      title: "Gagal Menyimpan Modul",
      message: error.message || "Modul sekolah gagal diperbarui.",
      type: "error",
    });
  } finally {
    savingId.value = null;
  }
};

onMounted(loadSchools);
</script>
