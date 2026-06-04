<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto mt-8 max-w-[1400px] space-y-6">
      <section class="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">Ringkasan Nilai</h2>
          <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400">Rata-rata: {{ summary.average_score ?? "-" }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total</p>
            <p class="mt-1 text-lg font-bold">{{ summary.total_assignments }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Terkumpul</p>
            <p class="mt-1 text-lg font-bold">{{ summary.submitted_count }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Belum</p>
            <p class="mt-1 text-lg font-bold">{{ summary.pending_count }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Dinilai</p>
            <p class="mt-1 text-lg font-bold">{{ summary.graded_count }}</p>
          </div>
        </div>
      </section>

      <!-- Grafik Tren Nilai -->
      <section v-if="chartSeries[0].data.length > 0" class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <h2 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">Tren Nilai Siswa</h2>
        <div class="h-[300px] w-full">
          <VueApexCharts type="line" height="300" :options="chartOptions" :series="chartSeries" />
        </div>
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

        <div class="hidden md:block overflow-x-auto">
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
                  <span v-else-if="isSubmittedRow(row)" class="text-sky-600 font-semibold">Sudah Kumpul</span>
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
        <div class="space-y-2 md:hidden">
          <article v-for="row in filteredRows" :key="`m-${row.assignment_id}-${row.subject_id}`"
            class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-xs font-semibold text-slate-500">{{ row.subject_name }}</p>
                <h3 class="text-sm font-bold">{{ row.title }}</h3>
              </div>
              <div class="text-right text-xs font-semibold">
                <p>{{ row.score ?? "-" }}</p>
              </div>
            </div>
            <div class="mt-2 text-xs text-slate-500">
              <p>Tenggat: {{ formatDateTime(row.due_date) }}</p>
              <p>Feedback: {{ row.feedback || "-" }}</p>
            </div>
          </article>
          <div v-if="filteredRows.length === 0" class="py-8 text-center text-sm text-slate-500">
            Tidak ada data nilai.
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { formatDateTime } from "@/utils/date";
import { storeToRefs } from "pinia";
import { useStudentGradesStore } from "@/store/studentGrades";

const studentGradesStore = useStudentGradesStore();
const {
  rows,
  summary,
  keyword,
  subjectFilter,
  statusFilter,
  subjectOptions,
  filteredRows,
} = storeToRefs(studentGradesStore);

const chartData = computed(() => {
  const gradedItems = filteredRows.value
    .filter(item => item.score !== null && item.score !== undefined)
    .map(item => ({
      ...item,
      timestamp: new Date(item.due_date).getTime() || 0
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const categories = gradedItems.map(item => {
    return item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title;
  });

  const dataPoints = gradedItems.map(item => Number(item.score));

  return { categories, dataPoints };
});

const chartSeries = computed(() => [
  {
    name: 'Nilai',
    data: chartData.value.dataPoints
  }
]);

const chartOptions = computed(() => {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 / slate-500
  const gridColor = isDark ? '#334155' : '#e2e8f0'; // slate-700 / slate-200
  
  return {
    chart: {
      type: 'line',
      height: 300,
      fontFamily: 'inherit',
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent'
    },
    colors: ['#0284c7'], // sky-600
    dataLabels: {
      enabled: true,
      background: {
        foreColor: '#fff',
        borderRadius: 4,
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: chartData.value.categories,
      tooltip: { enabled: false },
      labels: {
        style: { colors: textColor }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: { colors: textColor }
      }
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light'
    }
  };
});

const isSubmittedRow = (row) =>
  Boolean(row?.is_submitted || row?.submitted_at || row?.submission_id);

onMounted(() => studentGradesStore.loadGrades());
</script>
