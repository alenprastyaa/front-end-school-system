<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-5">
      <!-- Header -->
      <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Rapor Mata Pelajaran</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Rekap nilai akhir siswa per semester.</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="loadBootstrap"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span class="hidden sm:inline">Refresh</span>
          </button>
          <button @click="downloadExcel" :disabled="reportStudents.length === 0"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Excel
          </button>
        </div>
      </header>

      <!-- Filters -->
      <section class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10 md:p-5">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Mata Pelajaran</label>
            <select v-model="filters.subjectId" @change="resetAndLoadReport"
              class="block h-11 w-full rounded-xl border-0 bg-slate-50 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
              <option value="">Pilih mata pelajaran</option>
              <option v-for="item in subjects" :key="item.id" :value="String(item.id)">
                {{ item.name }} - {{ item.class_name }}
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Semester</label>
            <select v-model="filters.semesterId" @change="resetAndLoadReport"
              class="block h-11 w-full rounded-xl border-0 bg-slate-50 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
              <option value="">Semester aktif</option>
              <option v-for="item in semesterOptions" :key="item.semester_id" :value="String(item.semester_id)">
                {{ item.academic_year_name }} - {{ item.semester_name }} ({{ item.semester_code }})
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Cari Siswa</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input v-model="filters.keyword" placeholder="Ketik nama siswa..."
                class="block h-11 w-full rounded-xl border-0 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>
          </div>
        </div>
      </section>

      <!-- Summary -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex items-center gap-2 text-slate-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Periode Dipakai</p>
          </div>
          <h2 class="mt-2 text-base font-bold text-slate-900 dark:text-white">{{ selectedPeriodLabel }}</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ selectedPeriodDescription }}</p>
        </div>
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex items-center gap-2 text-slate-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Jumlah Penilaian</p>
          </div>
          <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ assignments.length }}</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Tugas, quiz, dan ujian pada semester ini.</p>
        </div>
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex items-center gap-2 text-slate-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p class="text-xs font-semibold uppercase tracking-wide">Jumlah Siswa</p>
          </div>
          <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ totalRows }}</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Rekap per siswa untuk mapel aktif.</p>
        </div>
      </section>

      <!-- Report -->
      <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <!-- Desktop matrix -->
        <div class="hidden overflow-x-auto lg:block">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th class="sticky left-0 z-20 min-w-[180px] bg-slate-50 px-5 py-3.5 font-semibold dark:bg-slate-800">Siswa</th>
                <th v-for="item in assignments" :key="item.id" class="min-w-[140px] px-4 py-3.5 text-center font-semibold">
                  <p class="line-clamp-2 normal-case text-[11px] font-semibold text-slate-600 dark:text-slate-300">{{ item.title }}</p>
                  <p class="mt-1 text-[10px] font-medium text-slate-400">{{ assignmentShortLabel(item) }}</p>
                </th>
                <th class="min-w-[90px] px-4 py-3.5 text-center font-semibold">Rata Tugas</th>
                <th class="min-w-[90px] px-4 py-3.5 text-center font-semibold">Rata Quiz</th>
                <th class="min-w-[90px] px-4 py-3.5 text-center font-semibold">Rata Ujian</th>
                <th class="min-w-[100px] px-4 py-3.5 text-center font-semibold">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="row in reportStudents" :key="row.student_id" class="group">
                <td class="sticky left-0 z-10 bg-white px-5 py-3.5 font-medium text-slate-900 transition group-hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:group-hover:bg-slate-800/60">
                  {{ row.student_name }}
                </td>
                <td v-for="item in assignments" :key="`${row.student_id}-${item.id}`" class="px-4 py-3.5 text-center transition group-hover:bg-slate-50/60 dark:group-hover:bg-slate-800/30">
                  <span :class="scoreBadgeClass(row.scores[item.id])"
                    class="inline-flex min-w-[52px] items-center justify-center rounded-lg px-2.5 py-1 text-xs font-bold">
                    {{ formatScore(row.scores[item.id]) }}
                  </span>
                </td>
                <td class="px-4 py-3.5 text-center font-semibold text-slate-600 transition group-hover:bg-slate-50/60 dark:text-slate-300 dark:group-hover:bg-slate-800/30">{{ formatScore(row.avg_task_score) }}</td>
                <td class="px-4 py-3.5 text-center font-semibold text-slate-600 transition group-hover:bg-slate-50/60 dark:text-slate-300 dark:group-hover:bg-slate-800/30">{{ formatScore(row.avg_quiz_score) }}</td>
                <td class="px-4 py-3.5 text-center font-semibold text-slate-600 transition group-hover:bg-slate-50/60 dark:text-slate-300 dark:group-hover:bg-slate-800/30">{{ formatScore(row.avg_exam_score) }}</td>
                <td class="px-4 py-3.5 text-center transition group-hover:bg-slate-50/60 dark:group-hover:bg-slate-800/30">
                  <span :class="scoreBadgeClass(row.final_score)"
                    class="inline-flex min-w-[58px] items-center justify-center rounded-lg px-3 py-1 text-sm font-bold">
                    {{ formatScore(row.final_score) }}
                  </span>
                </td>
              </tr>
              <tr v-if="reportStudents.length === 0">
                <td :colspan="Math.max(assignments.length + 5, 6)" class="px-6 py-16 text-center">
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                    {{ filters.subjectId ? "Belum ada data rapor" : "Mulai dari sini" }}
                  </h3>
                  <p class="mt-1 text-sm text-slate-500">
                    {{ filters.subjectId ? "Sesuaikan filter atau pastikan ada penilaian pada semester ini." : "Pilih mata pelajaran untuk menampilkan rapor." }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="divide-y divide-slate-100 lg:hidden dark:divide-slate-800">
          <article v-for="row in reportStudents" :key="`m-${row.student_id}`" class="p-4">
            <div class="flex items-center justify-between gap-3">
              <p class="font-semibold text-slate-900 dark:text-white">{{ row.student_name }}</p>
              <div class="text-right">
                <span :class="scoreBadgeClass(row.final_score)" class="inline-flex min-w-[56px] items-center justify-center rounded-lg px-3 py-1 text-sm font-bold">
                  {{ formatScore(row.final_score) }}
                </span>
                <p class="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Nilai Akhir</p>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-3 gap-2">
              <div class="rounded-lg bg-slate-50 px-2 py-2 text-center dark:bg-slate-800/40">
                <p class="text-[10px] font-medium text-slate-400">Tugas</p>
                <p class="mt-0.5 text-sm font-bold text-slate-700 dark:text-slate-200">{{ formatScore(row.avg_task_score) }}</p>
              </div>
              <div class="rounded-lg bg-slate-50 px-2 py-2 text-center dark:bg-slate-800/40">
                <p class="text-[10px] font-medium text-slate-400">Quiz</p>
                <p class="mt-0.5 text-sm font-bold text-slate-700 dark:text-slate-200">{{ formatScore(row.avg_quiz_score) }}</p>
              </div>
              <div class="rounded-lg bg-slate-50 px-2 py-2 text-center dark:bg-slate-800/40">
                <p class="text-[10px] font-medium text-slate-400">Ujian</p>
                <p class="mt-0.5 text-sm font-bold text-slate-700 dark:text-slate-200">{{ formatScore(row.avg_exam_score) }}</p>
              </div>
            </div>

            <div v-if="assignments.length" class="mt-3 space-y-1.5">
              <div v-for="item in assignments" :key="`m-${row.student_id}-${item.id}`"
                class="flex items-center justify-between gap-3 text-sm">
                <div class="min-w-0">
                  <p class="truncate text-slate-700 dark:text-slate-200">{{ item.title }}</p>
                  <p class="text-[10px] font-medium text-slate-400">{{ assignmentShortLabel(item) }}</p>
                </div>
                <span :class="scoreBadgeClass(row.scores[item.id])"
                  class="inline-flex min-w-[48px] shrink-0 items-center justify-center rounded-lg px-2 py-1 text-xs font-bold">
                  {{ formatScore(row.scores[item.id]) }}
                </span>
              </div>
            </div>
          </article>

          <div v-if="reportStudents.length === 0" class="px-6 py-14 text-center">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
              {{ filters.subjectId ? "Belum ada data rapor" : "Mulai dari sini" }}
            </h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ filters.subjectId ? "Sesuaikan filter atau pastikan ada penilaian." : "Pilih mata pelajaran untuk menampilkan rapor." }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-3">
            <span>{{ paginationStartRow }}-{{ paginationEndRow }} dari {{ totalRows }} data</span>
            <select v-model="pageSize" @change="handlePageSizeChange"
              class="rounded-lg border-0 bg-white py-1 pl-2 pr-7 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
              <option :value="10">10 / hal</option>
              <option :value="20">20 / hal</option>
              <option :value="50">50 / hal</option>
              <option :value="100">100 / hal</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <button @click="goToPreviousPage" :disabled="currentPage <= 1"
              class="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">
              Sebelumnya
            </button>
            <span class="min-w-[88px] text-center font-medium text-slate-600 dark:text-slate-300">
              Hal {{ currentPage }} / {{ totalPages }}
            </span>
            <button @click="goToNextPage" :disabled="currentPage >= totalPages"
              class="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">
              Berikutnya
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { downloadExcelWorksheet } from "@/utils/excelExport";
import { formatDate, formatDateKey } from "@/utils/date";
import { useMasterDataStore } from "@/store/masterData";
import { useTeacherStore } from "@/store/teacher";
import { useTeacherReportStore } from "@/store/teacherReport";
import { storeToRefs } from "pinia";

const teacherStore = useTeacherStore();
const masterDataStore = useMasterDataStore();
const { subjects } = storeToRefs(teacherStore);
const reportStore = useTeacherReportStore();
const { periods, report, currentPage, pageSize, totalRows } = storeToRefs(reportStore);
let keywordSearchTimer = null;

const filters = reportStore.filters;

const assignments = computed(() => report.value?.assignments || []);
const reportStudents = computed(() => report.value?.students || []);
const totalPages = computed(() => Math.max(1, Number(report.value?.total_pages || Math.ceil(totalRows.value / Number(pageSize.value || 20)) || 1)));
const paginationStartRow = computed(() => {
  if (totalRows.value === 0) return 0;
  return (currentPage.value - 1) * Number(pageSize.value || 20) + 1;
});
const paginationEndRow = computed(() => {
  if (totalRows.value === 0) return 0;
  return Math.min(currentPage.value * Number(pageSize.value || 20), totalRows.value);
});
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
  subjects.value = await teacherStore.loadTeacherSubjects();
  if (!filters.subjectId && subjects.value.length > 0) {
    filters.subjectId = String(subjects.value[0].id);
  }
};

const loadPeriods = async () => {
  const response = await masterDataStore.getAcademicPeriods();
  periods.value = response?.years || [];
};

const loadReport = async () => {
  report.value = null;

  if (!filters.subjectId) {
    totalRows.value = 0;
    return;
  }

  try {
    const response = await api.get(`/learning/subjects/${filters.subjectId}/final-report`, {
      params: {
        semester_id: filters.semesterId || undefined,
        keyword: filters.keyword || undefined,
        page: currentPage.value,
        limit: Number(pageSize.value || 20),
      },
    });
    report.value = response?.data || null;
    totalRows.value = Number(response?.data?.total || 0);
  } catch (error) {
    totalRows.value = 0;
    pushToast({
      title: "Gagal Memuat Laporan Nilai",
      message: error.message,
      type: "error",
    });
  }
};

const loadBootstrap = async () => {
  await loadSubjects();
  await loadPeriods();
  await loadReport();
};

const resetAndLoadReport = async () => {
  currentPage.value = 1;
  await loadReport();
};

const goToPreviousPage = async () => {
  if (currentPage.value <= 1) return;
  currentPage.value -= 1;
  await loadReport();
};

const goToNextPage = async () => {
  if (currentPage.value >= totalPages.value) return;
  currentPage.value += 1;
  await loadReport();
};

const handlePageSizeChange = async () => {
  currentPage.value = 1;
  await loadReport();
};

const buildExportFilename = () => {
  const subject = subjects.value.find((item) => String(item.id) === filters.subjectId);
  const period = report.value?.selected_period;
  const date = formatDateKey(new Date());
  const subjectPart = `${subject?.name || "rapor"}-${subject?.class_name || "kelas"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const periodPart = `${period?.semester_code || "semester-aktif"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return `rapor-mapel-${subjectPart}-${periodPart}-${date}.xls`;
};

const downloadExcel = async () => {
  const subject = subjects.value.find((item) => String(item.id) === filters.subjectId);
  const selected = report.value?.selected_period;
  const dynamicColumns = assignments.value.map((item) => ({
    key: `assignment_${item.id}`,
    label: item.title,
    value: (row) => formatScore(row.scores[item.id]),
  }));

  await downloadExcelWorksheet({
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
      { label: "Total Siswa", value: String(totalRows.value) },
    ],
    columns: [
      { key: "student_name", label: "Siswa" },
      ...dynamicColumns,
      { key: "avg_task_score", label: "Rata Tugas", value: (row) => formatScore(row.avg_task_score) },
      { key: "avg_quiz_score", label: "Rata Quiz", value: (row) => formatScore(row.avg_quiz_score) },
      { key: "avg_exam_score", label: "Rata Ujian", value: (row) => formatScore(row.avg_exam_score) },
      { key: "final_score", label: "Nilai Akhir", value: (row) => formatScore(row.final_score) },
    ],
    rows: reportStudents.value,
  });
};

watch(
  () => filters.keyword,
  () => {
    if (keywordSearchTimer) {
      clearTimeout(keywordSearchTimer);
    }
    keywordSearchTimer = setTimeout(() => {
      resetAndLoadReport();
    }, 350);
  },
);

onMounted(loadBootstrap);
</script>
