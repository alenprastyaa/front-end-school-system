<template>
  <div class="p-6 space-y-6">
    <section class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Tahun Ajaran & Semester</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kelola periode akademik aktif sekolah sebagai fondasi jadwal, rapor, dan laporan semester.
          </p>
        </div>
        <div class="flex gap-3">
          <button @click="loadData" class="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium dark:border-gray-600 dark:text-white">
            Refresh
          </button>
          <button @click="openYearModal()" class="inline-flex h-10 items-center justify-center rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500">
            Tambah Tahun Ajaran
          </button>
        </div>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Periode Aktif</h2>
        <div v-if="activePeriod" class="mt-4 space-y-3">
          <div class="rounded-lg bg-sky-50 p-4 dark:bg-sky-500/10">
            <p class="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Tahun Ajaran Aktif</p>
            <p class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{{ activePeriod.academic_year_name }}</p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {{ formatDate(activePeriod.academic_year_start_date) }} - {{ formatDate(activePeriod.academic_year_end_date) }}
            </p>
          </div>
          <div class="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Semester Aktif</p>
            <p class="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {{ activePeriod.semester_name || "Belum dipilih" }}
            </p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              <template v-if="activePeriod.semester_id">
                {{ activePeriod.semester_code }} • {{ formatDate(activePeriod.semester_start_date) }} - {{ formatDate(activePeriod.semester_end_date) }}
              </template>
              <template v-else>
                Aktifkan salah satu semester di bawah untuk melengkapi periode akademik.
              </template>
            </p>
          </div>
        </div>
        <div v-else class="mt-4 rounded-lg border-2 border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700">
          Belum ada periode aktif.
        </div>
      </div>

      <div class="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Ringkasan</h2>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Tahun Ajaran</p>
            <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{ years.length }}</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Semester</p>
            <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{ totalSemesters }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Daftar Periode Akademik</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Setiap tahun ajaran dapat memiliki beberapa semester.</p>
        </div>
      </div>

      <div v-if="loadError" class="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
        {{ loadError }}
      </div>

      <div class="mt-6 space-y-5">
        <article v-for="year in years" :key="year.id" class="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700 dark:bg-slate-900/40">
          <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span v-if="year.is_active" class="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                  Aktif
                </span>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ year.name }}</h3>
              </div>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{ formatDate(year.start_date) }} - {{ formatDate(year.end_date) }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button @click="activateYear(year)" :disabled="year.is_active || isSubmitting"
                class="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                Jadikan Aktif
              </button>
              <button @click="openYearModal(year)"
                class="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                Edit Tahun Ajaran
              </button>
              <button @click="openSemesterModal(null, year)"
                class="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-500">
                Tambah Semester
              </button>
            </div>
          </div>

          <div class="mt-5 overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b text-left text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th class="py-3 pr-4 font-medium">Semester</th>
                  <th class="py-3 pr-4 font-medium">Kode</th>
                  <th class="py-3 pr-4 font-medium">Rentang</th>
                  <th class="py-3 pr-4 font-medium">Status</th>
                  <th class="py-3 pr-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="semester in year.semesters" :key="semester.id" class="border-b text-slate-800 dark:border-slate-700 dark:text-slate-200">
                  <td class="py-3 pr-4 font-medium">{{ semester.name }}</td>
                  <td class="py-3 pr-4">{{ semester.code }}</td>
                  <td class="py-3 pr-4">{{ formatDate(semester.start_date) }} - {{ formatDate(semester.end_date) }}</td>
                  <td class="py-3 pr-4">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
                      :class="semester.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'">
                      {{ semester.is_active ? "Aktif" : "Nonaktif" }}
                    </span>
                  </td>
                  <td class="py-3 pr-0">
                    <div class="flex justify-end gap-2">
                      <button @click="activateSemester(semester)" :disabled="semester.is_active || isSubmitting"
                        class="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                        Aktifkan
                      </button>
                      <button @click="openSemesterModal(semester, year)"
                        class="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!year.semesters?.length">
                  <td colspan="5" class="py-6 text-center text-slate-500 dark:text-slate-400">
                    Belum ada semester pada tahun ajaran ini.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <div v-if="years.length === 0" class="rounded-lg border-2 border-dashed border-slate-200 py-10 text-center text-sm text-slate-500 dark:border-slate-700">
          Belum ada data tahun ajaran.
        </div>
      </div>
    </section>

    <div v-if="showYearModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="w-full max-w-lg rounded-lg border bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between gap-4 border-b px-6 py-4 dark:border-gray-700">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingYearId ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran" }}
            </h2>
          </div>
          <button @click="closeYearModal" class="text-2xl leading-none text-gray-500 dark:text-gray-300">&times;</button>
        </div>

        <form @submit.prevent="submitYear" class="space-y-4 p-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Tahun Ajaran</label>
            <input v-model="yearForm.name" type="text" required placeholder="Contoh: 2026/2027"
              class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mulai</label>
              <input v-model="yearForm.start_date" type="date" required
                class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selesai</label>
              <input v-model="yearForm.end_date" type="date" required
                class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="closeYearModal" class="rounded-md border px-4 py-2 dark:border-gray-600 dark:text-white">Batal</button>
            <button type="submit" :disabled="isSubmitting" class="rounded-md bg-sky-600 px-4 py-2 text-white disabled:opacity-60">
              {{ isSubmitting ? "Menyimpan..." : editingYearId ? "Simpan Perubahan" : "Tambah Tahun Ajaran" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showSemesterModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="w-full max-w-lg rounded-lg border bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between gap-4 border-b px-6 py-4 dark:border-gray-700">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingSemesterId ? "Edit Semester" : "Tambah Semester" }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Tahun ajaran: {{ selectedAcademicYear?.name || "-" }}
            </p>
          </div>
          <button @click="closeSemesterModal" class="text-2xl leading-none text-gray-500 dark:text-gray-300">&times;</button>
        </div>

        <form @submit.prevent="submitSemester" class="space-y-4 p-6">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Semester</label>
              <input v-model="semesterForm.name" type="text" required placeholder="Contoh: Semester Ganjil"
                class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode</label>
              <input v-model="semesterForm.code" type="text" required placeholder="Contoh: GANJIL"
                class="mt-1 w-full rounded-md border px-3 py-2 uppercase dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mulai</label>
              <input v-model="semesterForm.start_date" type="date" required
                class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selesai</label>
              <input v-model="semesterForm.end_date" type="date" required
                class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="closeSemesterModal" class="rounded-md border px-4 py-2 dark:border-gray-600 dark:text-white">Batal</button>
            <button type="submit" :disabled="isSubmitting" class="rounded-md bg-sky-600 px-4 py-2 text-white disabled:opacity-60">
              {{ isSubmitting ? "Menyimpan..." : editingSemesterId ? "Simpan Perubahan" : "Tambah Semester" }}
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
import { pushToast } from "@/composables/useToast";
import { formatDate } from "@/utils/date";

const years = ref([]);
const activePeriod = ref(null);
const loadError = ref("");
const isSubmitting = ref(false);
const showYearModal = ref(false);
const showSemesterModal = ref(false);
const editingYearId = ref(null);
const editingSemesterId = ref(null);
const selectedAcademicYear = ref(null);

const yearForm = reactive({
  name: "",
  start_date: "",
  end_date: "",
});

const semesterForm = reactive({
  name: "",
  code: "",
  start_date: "",
  end_date: "",
});

const totalSemesters = computed(() =>
  years.value.reduce((total, item) => total + Number(item.semesters?.length || 0), 0),
);

const resetYearForm = () => {
  yearForm.name = "";
  yearForm.start_date = "";
  yearForm.end_date = "";
  editingYearId.value = null;
};

const resetSemesterForm = () => {
  semesterForm.name = "";
  semesterForm.code = "";
  semesterForm.start_date = "";
  semesterForm.end_date = "";
  editingSemesterId.value = null;
};

const closeYearModal = () => {
  showYearModal.value = false;
  resetYearForm();
};

const closeSemesterModal = () => {
  showSemesterModal.value = false;
  selectedAcademicYear.value = null;
  resetSemesterForm();
};

const openYearModal = (item = null) => {
  resetYearForm();
  if (item) {
    editingYearId.value = item.id;
    yearForm.name = item.name || "";
    yearForm.start_date = String(item.start_date || "").slice(0, 10);
    yearForm.end_date = String(item.end_date || "").slice(0, 10);
  }
  showYearModal.value = true;
};

const openSemesterModal = (semester = null, year = null) => {
  resetSemesterForm();
  selectedAcademicYear.value = year || null;
  if (semester) {
    editingSemesterId.value = semester.id;
    semesterForm.name = semester.name || "";
    semesterForm.code = semester.code || "";
    semesterForm.start_date = String(semester.start_date || "").slice(0, 10);
    semesterForm.end_date = String(semester.end_date || "").slice(0, 10);
  }
  showSemesterModal.value = true;
};

const loadData = async () => {
  loadError.value = "";
  try {
    const response = await api.get("/academic-periods");
    years.value = response?.data?.years || [];
    activePeriod.value = response?.data?.active || null;
  } catch (error) {
    loadError.value = error.message;
  }
};

const submitYear = async () => {
  isSubmitting.value = true;
  try {
    const payload = { ...yearForm };
    const response = editingYearId.value
      ? await api.put(`/academic-periods/years/${editingYearId.value}`, payload)
      : await api.post("/academic-periods/years", payload);

    pushToast({
      title: editingYearId.value ? "Tahun Ajaran Diperbarui" : "Tahun Ajaran Dibuat",
      message: response?.message || "Perubahan tahun ajaran berhasil disimpan.",
      type: "success",
    });
    closeYearModal();
    await loadData();
  } catch (error) {
    pushToast({
      title: "Gagal Menyimpan Tahun Ajaran",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const submitSemester = async () => {
  if (!selectedAcademicYear.value?.id) {
    pushToast({
      title: "Tahun Ajaran Belum Dipilih",
      message: "Pilih tahun ajaran tujuan terlebih dahulu.",
      type: "error",
    });
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      academic_year_id: selectedAcademicYear.value.id,
      ...semesterForm,
    };
    const response = editingSemesterId.value
      ? await api.put(`/academic-periods/semesters/${editingSemesterId.value}`, payload)
      : await api.post("/academic-periods/semesters", payload);

    pushToast({
      title: editingSemesterId.value ? "Semester Diperbarui" : "Semester Dibuat",
      message: response?.message || "Perubahan semester berhasil disimpan.",
      type: "success",
    });
    closeSemesterModal();
    await loadData();
  } catch (error) {
    pushToast({
      title: "Gagal Menyimpan Semester",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const activateYear = async (item) => {
  isSubmitting.value = true;
  try {
    const response = await api.post(`/academic-periods/years/${item.id}/activate`, {});
    pushToast({
      title: "Tahun Ajaran Aktif",
      message: response?.message || `${item.name} sekarang menjadi tahun ajaran aktif.`,
      type: "success",
    });
    await loadData();
  } catch (error) {
    pushToast({
      title: "Gagal Mengaktifkan Tahun Ajaran",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const activateSemester = async (item) => {
  isSubmitting.value = true;
  try {
    const response = await api.post(`/academic-periods/semesters/${item.id}/activate`, {});
    pushToast({
      title: "Semester Aktif",
      message: response?.message || `${item.name} sekarang menjadi semester aktif.`,
      type: "success",
    });
    await loadData();
  } catch (error) {
    pushToast({
      title: "Gagal Mengaktifkan Semester",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadData);
</script>
