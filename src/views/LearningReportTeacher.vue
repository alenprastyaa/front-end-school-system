<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto mt-8 max-w-[1400px] space-y-6">
      <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Mata Pelajaran</label>
              <select v-model="filters.subjectId" @change="loadReport"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                <option value="">Pilih mapel</option>
                <option v-for="item in subjects" :key="item.id" :value="String(item.id)">
                  {{ item.name }} - {{ item.class_name }}
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Semester</label>
              <select v-model="filters.semesterId" @change="loadReport"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                <option value="">Semester Aktif</option>
                <option v-for="item in semesterOptions" :key="item.semester_id" :value="String(item.semester_id)">
                  {{ item.academic_year_name }} - {{ item.semester_name }} ({{ item.semester_code }})
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Cari Siswa</label>
              <input v-model="filters.keyword" placeholder="Ketik nama siswa..."
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="loadBootstrap"
              class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Refresh
            </button>
            <button @click="downloadExcel" :disabled="filteredRows.length === 0"
              class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
              Export Excel
            </button>
          </div>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-3">
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Periode Dipakai</p>
          <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {{ selectedPeriodLabel }}
          </h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{ selectedPeriodDescription }}
          </p>
        </div>
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Jumlah Penilaian</p>
          <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ assignments.length }}</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Tugas, quiz, ujian, dan penilaian manual pada semester ini.</p>
        </div>
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Jumlah Siswa</p>
          <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ filteredRows.length }}</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Rekap per siswa untuk mapel aktif.</p>
        </div>
      </section>

      <div v-if="loadError"
        class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
        {{ loadError }}
      </div>

      <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="overflow-x-auto">
          <table class="min-w-[1200px] w-full text-left text-sm">
            <thead class="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th class="px-6 py-4 font-semibold">Siswa</th>
                <th v-for="item in assignments" :key="item.id" class="px-6 py-4 font-semibold">
                  <div class="min-w-[150px]">
                    <p class="font-semibold text-slate-700 dark:text-slate-200">{{ item.title }}</p>
                    <p class="mt-1 normal-case text-[10px] text-slate-400">
                      {{ assignmentShortLabel(item) }}
                    </p>
                  </div>
                </th>
                <th class="px-6 py-4 font-semibold">Rata Tugas</th>
                <th class="px-6 py-4 font-semibold">Rata Quiz</th>
                <th class="px-6 py-4 font-semibold">Rata Ujian</th>
                <th class="px-6 py-4 font-semibold">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="row in filteredRows" :key="row.student_id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="px-6 py-4">
                  <div class="font-medium text-slate-900 dark:text-white">{{ row.student_name }}</div>
                </td>
                <td v-for="item in assignments" :key="`${row.student_id}-${item.id}`" class="px-6 py-4 text-center">
                  <span :class="scoreBadgeClass(row.scores[item.id])"
                    class="inline-flex min-w-[58px] items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold">
                    {{ formatScore(row.scores[item.id]) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center font-semibold">{{ formatScore(row.avg_task_score) }}</td>
                <td class="px-6 py-4 text-center font-semibold">{{ formatScore(row.avg_quiz_score) }}</td>
                <td class="px-6 py-4 text-center font-semibold">{{ formatScore(row.avg_exam_score) }}</td>
                <td class="px-6 py-4 text-center">
                  <span :class="scoreBadgeClass(row.final_score)"
                    class="inline-flex min-w-[64px] items-center justify-center rounded-full px-3 py-1 text-xs font-bold">
                    {{ formatScore(row.final_score) }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredRows.length === 0">
                <td :colspan="Math.max(assignments.length + 5, 6)" class="px-6 py-14 text-center text-slate-500">
                  Belum ada data rapor mapel untuk filter ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import { downloadExcelWorksheet } from "@/utils/excelExport";
import { formatDate } from "@/utils/date";

const subjects = ref([]);
const periods = ref([]);
const report = ref(null);
const loadError = ref("");

const filters = reactive({
  subjectId: "",
  semesterId: "",
  keyword: "",
});

const assignments = computed(() => report.value?.assignments || []);
const reportStudents = computed(() => report.value?.students || []);
const semesterOptions = computed(() =>
  periods.value.flatMap((year) =>
    (year.semesters || []).map((semester) => ({
      academic_year_id: year.id,
      academic_year_name: year.name,
      semester_id: semester.id,
      semester_name: semester.name,
      semester_code: semester.code,
      is_active: semester.is_active,
    })),
  ),
);

const filteredRows = computed(() => {
  if (!filters.keyword) {
    return reportStudents.value;
  }

  const keyword = filters.keyword.toLowerCase();
  return reportStudents.value.filter((item) => item.student_name?.toLowerCase().includes(keyword));
});

const selectedPeriodLabel = computed(() => {
  const selected = report.value?.selected_period;
  if (!selected) {
    return "Semester aktif sekolah";
  }
  return `${selected.academic_year_name} - ${selected.semester_name}`;
});

const selectedPeriodDescription = computed(() => {
  const selected = report.value?.selected_period;
  if (!selected) {
    return "Laporan memakai semester aktif yang sedang berjalan.";
  }
  return `${selected.semester_code} • ${selected.is_active ? "Sedang aktif" : "Dipilih manual"}`;
});

const assignmentShortLabel = (item) => {
  if (item.is_exam) {
    return "Ujian";
  }
  if (item.assignment_type === "MCQ" || item.assignment_type === "ESSAY") {
    return "Quiz";
  }
  if (item.assignment_type === "MANUAL") {
    return "Ujian Luar LMS";
  }
  return "Tugas";
};

const formatScore = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return Number(value).toFixed(2).replace(/\.00$/, "");
};

const scoreBadgeClass = (value) => {
  if (value === null || value === undefined || value === "") {
    return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300";
  }
  const score = Number(value);
  if (score >= 85) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }
  if (score >= 75) {
    return "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
  }
  if (score >= 60) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
  return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
};

const loadSubjects = async () => {
  const response = await api.get("/learning/subjects/teacher");
  subjects.value = response?.data || [];
  if (!filters.subjectId && subjects.value.length > 0) {
    filters.subjectId = String(subjects.value[0].id);
  }
};

const loadPeriods = async () => {
  const response = await api.get("/academic-periods");
  periods.value = response?.data?.years || [];
};

const loadReport = async () => {
  loadError.value = "";
  report.value = null;

  if (!filters.subjectId) {
    return;
  }

  try {
    const response = await api.get(`/learning/subjects/${filters.subjectId}/final-report`, {
      params: {
        semester_id: filters.semesterId || undefined,
      },
    });
    report.value = response?.data || null;
  } catch (error) {
    loadError.value = error.message;
  }
};

const loadBootstrap = async () => {
  await loadSubjects();
  await loadPeriods();
  await loadReport();
};

const buildExportFilename = () => {
  const subject = subjects.value.find((item) => String(item.id) === filters.subjectId);
  const period = report.value?.selected_period;
  const date = new Date().toISOString().slice(0, 10);
  const subjectPart = `${subject?.name || "rapor"}-${subject?.class_name || "kelas"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const periodPart = `${period?.semester_code || "semester-aktif"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return `rapor-mapel-${subjectPart}-${periodPart}-${date}.xls`;
};

const downloadExcel = () => {
  const subject = subjects.value.find((item) => String(item.id) === filters.subjectId);
  const selected = report.value?.selected_period;
  const dynamicColumns = assignments.value.map((item) => ({
    key: `assignment_${item.id}`,
    label: item.title,
    value: (row) => formatScore(row.scores[item.id]),
  }));

  downloadExcelWorksheet({
    filename: buildExportFilename(),
    sheetName: "Rapor Mapel",
    title: "Rekap Nilai Akhir / Rapor Mapel",
    subtitle: `${subject?.name || "-"}${subject?.class_name ? ` - ${subject.class_name}` : ""} | ${selectedPeriodLabel.value}`,
    summary: [
      { label: "Mapel", value: subject?.name || "-" },
      { label: "Kelas", value: subject?.class_name || "-" },
      { label: "Tahun Ajaran", value: selected?.academic_year_name || report.value?.active_period?.academic_year_name || "-" },
      { label: "Semester", value: selected?.semester_name || report.value?.active_period?.semester_name || "Semester aktif" },
      { label: "Rentang Tahun Ajaran", value: report.value?.active_period?.academic_year_start_date ? `${formatDate(report.value.active_period.academic_year_start_date)} - ${formatDate(report.value.active_period.academic_year_end_date)}` : "-" },
      { label: "Total Penilaian", value: String(assignments.value.length) },
      { label: "Total Siswa", value: String(filteredRows.value.length) },
    ],
    columns: [
      { key: "student_name", label: "Siswa" },
      ...dynamicColumns,
      { key: "avg_task_score", label: "Rata Tugas", value: (row) => formatScore(row.avg_task_score) },
      { key: "avg_quiz_score", label: "Rata Quiz", value: (row) => formatScore(row.avg_quiz_score) },
      { key: "avg_exam_score", label: "Rata Ujian", value: (row) => formatScore(row.avg_exam_score) },
      { key: "final_score", label: "Nilai Akhir", value: (row) => formatScore(row.final_score) },
    ],
    rows: filteredRows.value,
  });
};

onMounted(loadBootstrap);
</script>
