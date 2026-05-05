<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto mt-8 max-w-[1400px] space-y-6">
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Tugas</p>
          <p class="mt-2 text-3xl font-bold">{{ summary.total_assignments }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Terkumpul</p>
          <p class="mt-2 text-3xl font-bold">{{ summary.submitted_count }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Belum Kumpul</p>
          <p class="mt-2 text-3xl font-bold">{{ summary.pending_count }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Sudah Dinilai</p>
          <p class="mt-2 text-3xl font-bold">{{ summary.graded_count }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Rata-rata</p>
          <p class="mt-2 text-3xl font-bold">{{ summary.average_score ?? "-" }}</p>
        </article>
      </section>

      <section class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="mb-4 grid gap-3 md:grid-cols-3">
          <input v-model="keyword" type="text" placeholder="Cari mapel / judul tugas..."
            class="rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:ring-slate-700" />
          <select v-model="subjectFilter"
            class="rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:ring-slate-700">
            <option value="">Semua Mapel</option>
            <option v-for="item in subjectOptions" :key="item" :value="item">{{ item }}</option>
          </select>
          <select v-model="statusFilter"
            class="rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:ring-slate-700">
            <option value="">Semua Status</option>
            <option value="graded">Sudah Dinilai</option>
            <option value="submitted">Sudah Kumpul</option>
            <option value="pending">Belum Kumpul</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-[980px] w-full text-sm">
            <thead class="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
              <tr>
                <th class="px-4 py-3">Mapel</th>
                <th class="px-4 py-3">Tugas</th>
                <th class="px-4 py-3">Tenggat</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Nilai</th>
                <th class="px-4 py-3">Feedback</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="row in filteredRows" :key="`${row.assignment_id}-${row.subject_id}`">
                <td class="px-4 py-3">
                  <div class="font-semibold">{{ row.subject_name }}</div>
                  <div class="text-xs text-slate-500">{{ row.class_name }}</div>
                </td>
                <td class="px-4 py-3">{{ row.title }}</td>
                <td class="px-4 py-3">{{ formatDateTime(row.due_date) }}</td>
                <td class="px-4 py-3">
                  <span v-if="row.score !== null && row.score !== undefined" class="text-emerald-600 font-semibold">Sudah Dinilai</span>
                  <span v-else-if="row.submission_id" class="text-sky-600 font-semibold">Sudah Kumpul</span>
                  <span v-else class="text-rose-600 font-semibold">Belum Kumpul</span>
                </td>
                <td class="px-4 py-3 font-semibold">{{ row.score ?? "-" }}</td>
                <td class="px-4 py-3">{{ row.feedback || "-" }}</td>
              </tr>
              <tr v-if="filteredRows.length === 0">
                <td colspan="6" class="px-4 py-10 text-center text-slate-500">Tidak ada data nilai.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "@/api";
import { formatDateTime } from "@/utils/date";
import { pushToast } from "@/composables/useToast";

const rows = ref([]);
const summary = ref({
  total_assignments: 0,
  submitted_count: 0,
  pending_count: 0,
  graded_count: 0,
  average_score: null,
});

const keyword = ref("");
const subjectFilter = ref("");
const statusFilter = ref("");

const subjectOptions = computed(() => {
  const set = new Set(rows.value.map((item) => item.subject_name).filter(Boolean));
  return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
});

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  return rows.value.filter((item) => {
    const matchKeyword = !q
      || String(item.subject_name || "").toLowerCase().includes(q)
      || String(item.title || "").toLowerCase().includes(q);
    const matchSubject = !subjectFilter.value || item.subject_name === subjectFilter.value;

    let matchStatus = true;
    if (statusFilter.value === "graded") {
      matchStatus = item.score !== null && item.score !== undefined;
    } else if (statusFilter.value === "submitted") {
      matchStatus = Boolean(item.submission_id) && (item.score === null || item.score === undefined);
    } else if (statusFilter.value === "pending") {
      matchStatus = !item.submission_id;
    }

    return matchKeyword && matchSubject && matchStatus;
  });
});

const loadGrades = async () => {
  try {
    const response = await api.get("/learning/grades/student");
    rows.value = Array.isArray(response?.data?.data) ? response.data.data : [];
    summary.value = response?.data?.summary || summary.value;
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Nilai",
      message: error.message || "Terjadi kesalahan.",
      type: "error",
    });
  }
};

onMounted(loadGrades);
</script>
