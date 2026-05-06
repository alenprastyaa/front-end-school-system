<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-6">
      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Super Admin</p>
            <h1 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Kelola Sekolah</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Super admin berada di atas admin sekolah. Fokus modul ini adalah membuat, memperbarui, melihat ringkasan, dan menghapus unit sekolah.
            </p>
          </div>
          <button
            @click="loadSchools"
            :disabled="isLoading"
            class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {{ isLoading ? "Memuat..." : "Refresh Data" }}
          </button>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in summaryCards"
          :key="card.label"
          class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ card.label }}</p>
          <p class="mt-3 text-3xl font-black text-slate-900 dark:text-white">{{ card.value }}</p>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ card.caption }}</p>
        </article>
      </section>

      <section
        v-if="message"
        class="rounded-2xl px-5 py-4 text-sm font-medium ring-1 ring-inset"
        :class="isError ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20'"
      >
        {{ message }}
      </section>

      <section class="grid gap-6 xl:grid-cols-[380px,1fr]">
        <form
          @submit.prevent="submitSchool"
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ editingId ? "Edit Sekolah" : "Buat Sekolah" }}</p>
          <h2 class="mt-2 text-xl font-bold text-slate-900 dark:text-white">{{ editingId ? "Perbarui Data Sekolah" : "Tambah Sekolah Baru" }}</h2>

          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Sekolah</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Contoh: SMK Negeri 1 Jakarta"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              />
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
            >
              {{ isSubmitting ? "Menyimpan..." : editingId ? "Perbarui Sekolah" : "Tambah Sekolah" }}
            </button>
            <button
              v-if="editingId"
              type="button"
              @click="resetForm"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Batal Edit
            </button>
          </div>
        </form>

        <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Daftar Sekolah</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Ringkasan sekolah beserta admin, kelas, siswa, dan status modul dasarnya.</p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-medium sm:px-6">Sekolah</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Admin</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Kelas</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Guru</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Siswa</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Kurikulum</th>
                  <th class="px-4 py-3 font-medium sm:px-6">LMS</th>
                  <th class="px-4 py-3 font-medium sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in schools" :key="item.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                  <td class="px-4 py-4 sm:px-6">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.name }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Tahun aktif: {{ item.active_academic_years || 0 }}
                    </div>
                  </td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_admins || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_classes || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_teachers || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_students || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_curriculum_subjects || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_learning_subjects || 0 }}</td>
                  <td class="px-4 py-4 sm:px-6">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="editSchool(item)"
                        class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteSchool(item)"
                        :disabled="deletingId === item.id"
                        class="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-300"
                      >
                        {{ deletingId === item.id ? "Menghapus..." : "Hapus" }}
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="schools.length === 0">
                  <td colspan="8" class="px-4 py-10 text-center text-slate-500 sm:px-6">Belum ada sekolah terdaftar.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";

const schools = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const deletingId = ref(null);
const editingId = ref(null);
const message = ref("");
const isError = ref(false);

const form = reactive({
  name: "",
});

const summaryCards = computed(() => {
  const totalSchools = schools.value.length;
  const totalAdmins = schools.value.reduce((sum, item) => sum + Number(item.total_admins || 0), 0);
  const totalStudents = schools.value.reduce((sum, item) => sum + Number(item.total_students || 0), 0);
  const totalCurriculum = schools.value.reduce((sum, item) => sum + Number(item.total_curriculum_subjects || 0), 0);

  return [
    { label: "Total Sekolah", value: totalSchools, caption: "Unit sekolah terdaftar." },
    { label: "Total Admin", value: totalAdmins, caption: "Admin sekolah aktif." },
    { label: "Total Siswa", value: totalStudents, caption: "Siswa seluruh sekolah." },
    { label: "Mapel Kurikulum", value: totalCurriculum, caption: "Master kurikulum seluruh sekolah." },
  ];
});

const resetForm = () => {
  editingId.value = null;
  form.name = "";
};

const loadSchools = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/school");
    schools.value = Array.isArray(response?.data?.items) ? response.data.items : [];
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Gagal memuat data sekolah.";
  } finally {
    isLoading.value = false;
  }
};

const submitSchool = async () => {
  isSubmitting.value = true;
  isError.value = false;
  message.value = "";

  try {
    const payload = { name: form.name };
    const response = editingId.value
      ? await api.put(`/school/${editingId.value}`, payload)
      : await api.post("/school", payload);

    message.value = response?.message || "Sekolah berhasil disimpan.";
    resetForm();
    await loadSchools();
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Gagal menyimpan sekolah.";
  } finally {
    isSubmitting.value = false;
  }
};

const editSchool = (item) => {
  editingId.value = item.id;
  form.name = item.name || "";
  message.value = "";
  isError.value = false;
};

const deleteSchool = async (item) => {
  if (!window.confirm(`Hapus sekolah "${item.name}"? Semua data sekolah ini juga akan dihapus.`)) return;

  deletingId.value = item.id;
  isError.value = false;
  message.value = "";
  try {
    const response = await api.delete(`/school/${item.id}`);
    message.value = response?.message || "Sekolah berhasil dihapus.";
    if (editingId.value === item.id) {
      resetForm();
    }
    await loadSchools();
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Gagal menghapus sekolah.";
  } finally {
    deletingId.value = null;
  }
};

onMounted(loadSchools);
</script>
