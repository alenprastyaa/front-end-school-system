<template>
  <div
    class="min-h-screen bg-slate-50/50 px-3 pb-10 pt-3 font-sans text-slate-900 sm:px-4 sm:pt-4 md:px-8 md:pb-12 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto max-w-[1440px] space-y-5 sm:space-y-6">

      <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
            {{ heroTitle }}
          </h1>
          <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {{ heroDescription }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden flex-col items-end sm:flex">
            <span class="text-xs font-medium text-slate-500">Terakhir diperbarui</span>
            <span class="text-sm font-semibold text-slate-900 dark:text-white">{{
              formatDateTime(dashboardData.generatedAt) }}</span>
          </div>
          <div class="h-8 w-px bg-slate-200 hidden sm:block dark:bg-slate-800"></div>
          <button @click="loadDashboard" :disabled="isLoading"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800">
            <svg :class="{ 'animate-spin': isLoading }" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {{ isLoading ? 'Memuat...' : 'Refresh' }}
          </button>
        </div>
      </header>

      <div v-if="studentAssignmentAlert"
        class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
        <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" fill="none" viewBox="0 0 24 24"
          stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-400">Peringatan: {{
            studentAssignmentAlert.count }} Tugas Pending</h3>
          <p class="mt-1 text-sm text-amber-700 dark:text-amber-300">Anda memiliki tugas yang belum dikerjakan. Harap
            selesaikan sebelum tenggat waktu berakhir.</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span v-for="item in studentAssignmentAlert.items" :key="item.id"
              class="inline-flex rounded-md bg-white px-2.5 py-1 text-xs font-medium text-amber-800 shadow-sm ring-1 ring-inset ring-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-500/30">
              {{ item.title }}{{ item.subject_name ? ` • ${item.subject_name}` : "" }}
            </span>
          </div>
        </div>
      </div>

      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in summaryCards" :key="item.label" class="relative overflow-hidden rounded-2xl p-5"
          :class="item.cardClass">
          <div class="flex items-start justify-between gap-4">
            <div>
              <dt class="text-sm font-medium" :class="item.labelClass">{{ item.label }}</dt>
              <dd class="mt-2 text-3xl font-bold tracking-tight" :class="item.valueClass">{{ item.value }}</dd>
              <dd class="mt-3 text-xs" :class="item.captionClass">{{ item.caption }}</dd>
            </div>
            <div class="flex h-16 w-16 shrink-0 items-center justify-center">
              <Icon :icon="item.icon" class="h-10 w-10 opacity-75" :class="item.iconClass" />
            </div>
          </div>
        </div>
      </section>

      <section v-if="role === 'ADMIN'"
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Kirim Laporan Email Wali Kelas</h2>
            <p class="mt-1 text-sm text-slate-500">Kirim rekap kehadiran harian ke email wali kelas dengan lampiran PDF.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal Laporan</label>
              <input v-model="attendanceEmailReportDate" type="date"
                class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" />
            </div>
            <button @click="sendAttendanceEmailReport" :disabled="isSendingAttendanceEmailReport"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
              <svg v-if="isSendingAttendanceEmailReport" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {{ isSendingAttendanceEmailReport ? "Mengirim..." : "Kirim Email Sekarang" }}
            </button>
          </div>
        </div>

        <div v-if="attendanceEmailReportSummary" class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Total Kelas</p>
            <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{
              attendanceEmailReportSummary.total_classes || 0 }}</p>
          </div>
          <div class="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <p class="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-300">Berhasil</p>
            <p class="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-200">{{
              attendanceEmailReportSummary.success_count || 0 }}</p>
          </div>
          <div class="rounded-xl bg-rose-50 p-4 dark:bg-rose-500/10">
            <p class="text-xs font-medium uppercase tracking-wide text-rose-600 dark:text-rose-300">Gagal</p>
            <p class="mt-2 text-2xl font-bold text-rose-700 dark:text-rose-200">{{
              attendanceEmailReportSummary.failed_count || 0 }}</p>
          </div>
        </div>

        <div v-if="attendanceEmailReportSummary?.results?.length" class="mt-5 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th class="px-4 py-3 font-medium">Kelas</th>
                <th class="px-4 py-3 font-medium">Wali Kelas</th>
                <th class="px-4 py-3 font-medium">Email</th>
                <th class="px-4 py-3 font-medium">Status</th>
                <th class="px-4 py-3 font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in attendanceEmailReportSummary.results" :key="`${item.class_id}-${item.target}`">
                <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">{{ item.class_name || "-" }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.wali_guru_name || "-" }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.target || "-" }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
                    :class="item.success ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'">
                    {{ item.success ? "Berhasil" : "Gagal" }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.error || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">

        <div class="flex flex-col gap-5 sm:gap-6 lg:col-span-2">

          <section
            class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-semibold text-slate-900 dark:text-white">{{ visualPanel.title }}</h2>
                <p class="mt-1 text-sm text-slate-500">{{ visualPanel.description }}</p>
              </div>
            </div>
            <div class="mt-5 w-full sm:mt-6">
              <apexchart :type="visualPanel.chartType" height="320" :options="visualChartOptions"
                :series="visualChartSeries" />
            </div>
          </section>

          <section
            class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-800">
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">{{ primaryPanel.title }}</h2>
              <p class="mt-1 text-sm text-slate-500">{{ primaryPanel.description }}</p>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                  <tr>
                    <th v-for="column in primaryPanel.columns" :key="column.key"
                      class="border-b border-slate-200 px-4 py-3 font-medium sm:px-6 dark:border-slate-800">
                      <button @click="handlePrimarySort(column.key)"
                        class="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                        {{ column.label }}
                        <span class="text-slate-400">{{ primarySortIndicator(column.key) }}</span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="(row, index) in sortedPrimaryRows" :key="index"
                    class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td v-for="(column, colIdx) in primaryPanel.columns" :key="column.key" class="px-4 py-4 sm:px-6"
                      :class="{ 'font-medium text-slate-900 dark:text-white': colIdx === 0, 'text-slate-600 dark:text-slate-300': colIdx !== 0 }">
                      {{ column.format ? column.format(row[column.key], row) : row[column.key] ?? "-" }}
                    </td>
                  </tr>
                  <tr v-if="primaryPanel.rows.length === 0">
                    <td :colspan="primaryPanel.columns.length" class="px-4 py-10 text-center text-slate-500 sm:px-6">
                      {{ primaryPanel.emptyMessage }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="flex flex-col gap-5 sm:gap-6 lg:col-span-1">

          <section
            class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Ringkasan Distribusi</h2>
            <div class="mt-5 flex items-center justify-center sm:mt-6">
              <apexchart type="donut" height="280" :options="compositionChartOptions"
                :series="compositionChartSeries" />
            </div>
          </section>

          <section class="grid grid-cols-2 gap-4">
            <div v-for="card in spotlight.cards" :key="card.label" class="rounded-2xl p-4 text-white"
              :class="card.cardClass">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-xs font-medium text-white/80">{{ card.label }}</p>
                  <p class="mt-2 text-xl font-bold text-white">{{ card.value }}</p>
                  <p class="mt-1 truncate text-xs text-white/75" :title="card.caption">{{ card.caption }}</p>
                </div>
                <Icon :icon="card.icon" class="h-9 w-9 shrink-0 text-white opacity-75" />
              </div>
            </div>
          </section>

          <section
            class="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">{{ secondaryPanel.title }}</h2>
            <div class="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
              <div v-for="(item, index) in secondaryPanel.items" :key="index" class="flex gap-4">
                <div class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-500/10">
                </div>
                <div class="flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm font-medium text-slate-900 dark:text-white">{{ item.title }}</p>
                    <span class="text-xs text-slate-500 whitespace-nowrap">{{ item.meta }}</span>
                  </div>
                  <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ item.subtitle }}</p>
                </div>
              </div>
              <div v-if="secondaryPanel.items.length === 0" class="py-6 text-center text-sm text-slate-500">
                {{ secondaryPanel.emptyMessage }}
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDate, formatDateTime, formatTime } from "@/utils/date";
import { getStoredRole, getStoredUser } from "@/utils/auth";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";

const role = getStoredRole();
const user = getStoredUser();
const isLoading = ref(false);
const dashboardData = ref({});
const primaryTableSort = createSortState("");
const attendanceEmailReportDate = ref(new Date().toISOString().slice(0, 10));
const isSendingAttendanceEmailReport = ref(false);
const attendanceEmailReportSummary = ref(null);

const endpointByRole = {
  SUPER_ADMIN: "/dashboard/superadmin",
  ADMIN: "/dashboard/admin",
  GURU: "/dashboard/guru",
  SISWA: "/dashboard/siswa",
};

// Palet warna yang lebih modern, bersih, dan enterprise-look
const chartPalette = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ef4444", "#64748b"];

const numberValue = (value) => Number(value || 0);

const createSummaryCard = ({
  label,
  value,
  caption,
  icon,
  cardClass,
  labelClass = "text-white/80",
  valueClass = "text-white",
  captionClass = "text-white/70",
  iconClass = "text-white",
}) => ({
  label,
  value,
  caption,
  icon,
  cardClass,
  labelClass,
  valueClass,
  captionClass,
  iconClass,
});

const heroTitle = computed(() => {
  if (role === "SUPER_ADMIN") return "Ikhtisar Sistem Terpadu";
  if (role === "ADMIN") return `Dashboard Admin ${dashboardData.value?.school?.name || user?.school_name || ""}`.trim();
  if (role === "GURU") return `Kelas Wali: ${dashboardData.value?.homeroom?.class_name || ""}`.trim();
  if (role === "SISWA") return `Halo, ${dashboardData.value?.student?.username || user?.username || "Siswa"}`;
  return "Dashboard Overview";
});

const heroDescription = computed(() => {
  if (role === "SUPER_ADMIN") return "Pemantauan komprehensif metrik sekolah dan aktivitas pengguna sistem.";
  if (role === "ADMIN") return "Metrik operasional sekolah, status absensi, dan data kelas secara real-time.";
  if (role === "GURU") return "Ringkasan data absensi siswa dan administrasi untuk kelas perwalian Anda.";
  if (role === "SISWA") return "Pantau riwayat absensi, status administrasi, dan tugas akademik Anda.";
  return "Ringkasan sistem berdasarkan akses pengguna.";
});

const summaryCards = computed(() => {
  const overview = dashboardData.value?.overview || {};

  return role === "SUPER_ADMIN"
    ? [
      createSummaryCard({ label: "Total Sekolah", value: numberValue(overview.schools), caption: "Unit aktif terdaftar", icon: "ph:buildings", cardClass: "bg-sky-600" }),
      createSummaryCard({ label: "Total Pengguna", value: numberValue(overview.users), caption: "Seluruh entitas user", icon: "ph:users-three", cardClass: "bg-indigo-600" }),
      createSummaryCard({ label: "Total Guru", value: numberValue(overview.teachers), caption: "Pengajar terdaftar", icon: "ph:chalkboard-teacher", cardClass: "bg-emerald-600" }),
      createSummaryCard({ label: "Total Siswa", value: numberValue(overview.students), caption: "Siswa terdaftar", icon: "ph:student", cardClass: "bg-amber-500" }),
    ]
    : role === "ADMIN"
      ? [
        createSummaryCard({ label: "Total Kelas", value: numberValue(overview.classes), caption: "Rombongan belajar", icon: "mdi:google-classroom", cardClass: "bg-cyan-600" }),
        createSummaryCard({ label: "Total Guru", value: numberValue(overview.teachers), caption: "Pengajar aktif", icon: "ph:chalkboard-teacher", cardClass: "bg-sky-600" }),
        createSummaryCard({ label: "Total Siswa", value: numberValue(overview.students), caption: "Siswa terdaftar", icon: "ph:student", cardClass: "bg-emerald-600" }),
        createSummaryCard({ label: "Check-in Hari Ini", value: numberValue(overview.attendance_today), caption: "Tercatat hadir", icon: "mdi:calendar-check-outline", cardClass: "bg-rose-600" }),
      ]
      : role === "GURU"
        ? [
          createSummaryCard({ label: "Siswa Kelas Wali", value: numberValue(overview.students), caption: "Total siswa dibimbing", icon: "mdi:account-school-outline", cardClass: "bg-indigo-600" }),
          createSummaryCard({ label: "Hadir Hari Ini", value: numberValue(overview.attendance_today), caption: "Siswa sudah absen", icon: "mdi:calendar-check-outline", cardClass: "bg-emerald-600" }),
          createSummaryCard({ label: "Belum Hadir", value: numberValue(overview.absent_today), caption: "Perlu konfirmasi", icon: "ph:warning-circle", cardClass: "bg-amber-500" }),
          createSummaryCard({ label: "Receipt Terkumpul", value: numberValue(overview.receipts_this_month), caption: "Bulan berjalan", icon: "ph:receipt", cardClass: "bg-sky-600" }),
        ]
        : [
          createSummaryCard({ label: "Total Kehadiran", value: numberValue(overview.attendance_total), caption: "Riwayat absen", icon: "mdi:calendar-check-outline", cardClass: "bg-blue-600" }),
          createSummaryCard({ label: "Total Receipt", value: numberValue(overview.receipts_total), caption: "Bukti pembayaran", icon: "ph:receipt", cardClass: "bg-fuchsia-600" }),
          createSummaryCard({ label: "Tugas Pending", value: numberValue(overview.pending_assignments), caption: "Belum diselesaikan", icon: "ph:notepad", cardClass: "bg-orange-500" }),
          createSummaryCard({
            label: "Status Absen Hari Ini",
            value: dashboardData.value?.todayAttendance?.status || "Belum absen",
            caption: dashboardData.value?.todayAttendance?.clock_in ? `Masuk ${formatTime(dashboardData.value.todayAttendance.clock_in)}` : "-",
            icon: dashboardData.value?.todayAttendance?.status ? "ph:clock-afternoon" : "ph:clock-countdown",
            cardClass: dashboardData.value?.todayAttendance?.status ? "bg-emerald-600" : "bg-slate-700",
          }),
        ];
});

const studentAssignmentAlert = computed(() => {
  if (role !== "SISWA") return null;
  const items = dashboardData.value?.pendingAssignments || [];
  if (items.length === 0) return null;
  return {
    count: Number(dashboardData.value?.overview?.pending_assignments || items.length),
    items: items.slice(0, 4),
  };
});

const primarySortAccessors = computed(() => ({
  checked_in_today: (item) => (item.checked_in_today ? 1 : 0),
}));

const primaryPanel = computed(() => {
  if (role === "SUPER_ADMIN") {
    return {
      title: "Distribusi Sekolah",
      description: "Data sekolah berdasarkan volume pengguna.",
      columns: [
        { key: "name", label: "Sekolah" },
        { key: "total_users", label: "Users" },
        { key: "total_teachers", label: "Guru" },
        { key: "total_students", label: "Siswa" },
      ],
      rows: dashboardData.value?.schools || [],
      emptyMessage: "Data sekolah kosong.",
    };
  }

  if (role === "ADMIN") {
    return {
      title: "Data Rombongan Belajar",
      description: "Daftar kelas beserta kapasitas siswa.",
      columns: [
        { key: "class_name", label: "Nama Kelas" },
        { key: "wali_guru_name", label: "Wali Kelas" },
        { key: "student_count", label: "Siswa" },
      ],
      rows: dashboardData.value?.classes || [],
      emptyMessage: "Data kelas kosong.",
    };
  }

  if (role === "GURU") {
    return {
      title: "Monitoring Kehadiran Kelas Wali",
      description: "Status check-in harian siswa.",
      columns: [
        { key: "username", label: "Nama Siswa" },
        { key: "phone_number", label: "Kontak" },
        {
          key: "checked_in_today",
          label: "Status",
          format: (value) => (value ? "Hadir" : "Belum Hadir"),
        },
      ],
      rows: dashboardData.value?.students || [],
      emptyMessage: "Data siswa kosong.",
    };
  }

  return {
    title: "Riwayat Absensi Personal",
    description: "Catatan waktu masuk dan pulang harian.",
    columns: [
      { key: "attendance_date", label: "Tanggal", format: (value) => formatDate(value) },
      { key: "clock_in", label: "Jam Masuk", format: (value) => formatTime(value) },
      { key: "clock_out", label: "Jam Pulang", format: (value) => formatTime(value) },
      { key: "status", label: "Keterangan" },
    ],
    rows: dashboardData.value?.recentAttendance || [],
    emptyMessage: "Belum ada riwayat absensi.",
  };
});

const sortedPrimaryRows = computed(() => {
  const rows = primaryPanel.value?.rows || [];
  const activeSort =
    primaryTableSort.key || primaryPanel.value?.columns?.[0]?.key
      ? { ...primaryTableSort, key: primaryTableSort.key || primaryPanel.value?.columns?.[0]?.key }
      : primaryTableSort;
  return sortItems(rows, activeSort, primarySortAccessors.value);
});

const handlePrimarySort = (key) => toggleSort(primaryTableSort, key);
const primarySortIndicator = (key) => {
  const activeKey = primaryTableSort.key || primaryPanel.value?.columns?.[0]?.key;
  if (activeKey !== key) return "↕";
  return primaryTableSort.direction === "asc" ? "▲" : "▼";
};

const secondaryPanel = computed(() => {
  if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "GURU") {
    return {
      title: "Log Kehadiran Terbaru",
      description: "Rekam jejak check-in terakhir.",
      items: (dashboardData.value?.recentAttendance || []).map((item) => ({
        title: item.username || "-",
        subtitle: `${item.school_name || item.class_name || "Data"} • ${item.status || "-"}`,
        meta: formatTime(item.clock_in),
      })),
      emptyMessage: "Log kosong.",
    };
  }

  return {
    title: "Upload Administrasi",
    description: "Riwayat berkas pembayaran terakhir.",
    items: (dashboardData.value?.recentReceipts || []).map((item) => ({
      title: item.periode || "-",
      subtitle: item.description || "Tanpa keterangan",
      meta: formatDateTime(item.created_at),
    })),
    emptyMessage: "Belum ada file diunggah.",
  };
});

const spotlight = computed(() => {
  if (role === "SUPER_ADMIN") return {
    cards: [
      { label: "Top School", value: dashboardData.value?.schools?.[0]?.name || "-", caption: "Siswa Terbanyak", icon: "ph:buildings", cardClass: "bg-sky-700" },
      { label: "Top Activity", value: dashboardData.value?.recentReceipts?.[0]?.username || "-", caption: "Receipt Terakhir", icon: "ph:activity", cardClass: "bg-indigo-700" },
    ]
  };
  if (role === "ADMIN") return {
    cards: [
      { label: "Unit Aktif", value: dashboardData.value?.school?.name || "-", caption: "Nama Sekolah", icon: "ph:buildings", cardClass: "bg-cyan-700" },
      { label: "Volume Receipt", value: numberValue(dashboardData.value?.overview?.receipts_this_month), caption: "Bulan Berjalan", icon: "ph:receipt", cardClass: "bg-fuchsia-700" },
    ]
  };
  if (role === "GURU") return {
    cards: [
      { label: "Panel Wali Kelas", value: dashboardData.value?.homeroom?.class_name || "-", caption: "Sebagai Wali", icon: "ph:chalkboard-teacher", cardClass: "bg-sky-700" },
      { label: "Absen Blank", value: numberValue(dashboardData.value?.overview?.absent_today), caption: "Siswa belum konfirmasi", icon: "ph:warning-circle", cardClass: "bg-amber-600" },
    ]
  };
  return {
    cards: [
      { label: "Rombel", value: dashboardData.value?.student?.class_name || "-", caption: dashboardData.value?.student?.school_name || "-", icon: "ph:student", cardClass: "bg-indigo-700" },
      { label: "Waktu Pulang", value: dashboardData.value?.todayAttendance?.clock_out ? formatTime(dashboardData.value.todayAttendance.clock_out) : "-", caption: "Hari Ini", icon: "ph:clock-afternoon", cardClass: "bg-emerald-700" },
    ]
  };
});

const visualPanel = computed(() => {
  if (role === "SUPER_ADMIN") return {
    title: "Metrik Kepadatan Sekolah",
    description: "Populasi siswa per unit sekolah.",
    chartType: "bar",
    labels: (dashboardData.value?.schools || []).slice(0, 6).map((item) => item.name),
    series: [{ name: "Siswa", data: (dashboardData.value?.schools || []).slice(0, 6).map((item) => numberValue(item.total_students)) }],
  };

  if (role === "ADMIN") return {
    title: "Kapasitas Rombongan Belajar",
    description: "Jumlah siswa di tiap kelas aktif.",
    chartType: "bar",
    labels: (dashboardData.value?.classes || []).slice(0, 8).map((item) => item.class_name),
    series: [{ name: "Siswa", data: (dashboardData.value?.classes || []).slice(0, 8).map((item) => numberValue(item.student_count)) }],
  };

  const overview = dashboardData.value?.overview || {};
  if (role === "GURU") return {
    title: "Rasio Absensi Kelas",
    description: "Perbandingan kehadiran hari ini.",
    chartType: "bar",
    labels: ["Hadir", "Belum Hadir", "Receipt"],
    series: [{ name: "Jumlah", data: [numberValue(overview.attendance_today), numberValue(overview.absent_today), numberValue(overview.receipts_this_month)] }],
  };

  return {
    title: "Kalkulasi Aktivitas Personal",
    description: "Riwayat data akademis dan admin.",
    chartType: "bar",
    labels: ["Absensi", "Receipt", "Tugas"],
    series: [{ name: "Total", data: [numberValue(overview.attendance_total), numberValue(overview.receipts_total), numberValue(overview.pending_assignments)] }],
  };
});

const visualChartSeries = computed(() => visualPanel.value.series);

// KONFIGURASI APEXCHARTS YANG CLEAN & ENTERPRISE-READY
const visualChartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      fontFamily: 'inherit',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 400 },
    },
    colors: [chartPalette[0]],
    plotOptions: {
      bar: {
        borderRadius: 4,     // Sudut melengkung halus
        columnWidth: "35%",  // Bar lebih ramping, terlihat modern
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { fontSize: '12px', colors: ["#64748b"], fontWeight: 600 }
    },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: visualPanel.value.labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#64748b', fontSize: '12px', fontWeight: 500 },
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '12px' },
        formatter: (value) => Math.round(value)
      }
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4, // Grid line putus-putus
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 10 }
    },
    tooltip: {
      theme: "light",
      style: { fontSize: '13px', fontFamily: 'inherit' }
    }
  };
});

const compositionChartSeries = computed(() =>
  summaryCards.value.map((item) => {
    const numeric = Number(item.value);
    return Number.isFinite(numeric) ? numeric : 0;
  }),
);

const compositionChartOptions = computed(() => ({
  chart: {
    fontFamily: "inherit",
    toolbar: { show: false },
  },
  labels: summaryCards.value.map((item) => item.label),
  colors: chartPalette,
  stroke: { width: 2, colors: ['#ffffff'] }, // Outline putih bersih
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "75%",
        labels: {
          show: true,
          name: { fontSize: '13px', color: '#64748b', fontWeight: 500 },
          value: { fontSize: '24px', color: '#0f172a', fontWeight: 700 },
          total: {
            show: true,
            label: "Total",
            color: '#64748b',
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    }
  },
  legend: {
    position: "bottom",
    fontSize: "13px",
    markers: { radius: 12 },
    itemMargin: { horizontal: 10, vertical: 5 },
    labels: { colors: "#475569" }
  },
  tooltip: { theme: "light" },
}));

const loadDashboard = async () => {
  const endpoint = endpointByRole[role];

  if (!endpoint) {
    dashboardData.value = {};
    pushToast({
      title: "Dashboard Gagal Dimuat",
      message: "Role tidak dikenali",
      type: "error",
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await api.get(endpoint);
    dashboardData.value = response?.data || {};
  } catch (error) {
    dashboardData.value = {};
    pushToast({
      title: "Dashboard Gagal Dimuat",
      message: error.message,
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const sendAttendanceEmailReport = async () => {
  isSendingAttendanceEmailReport.value = true;
  attendanceEmailReportSummary.value = null;

  try {
    const payload = {};
    if (attendanceEmailReportDate.value) {
      payload.date = attendanceEmailReportDate.value;
    }

    const response = await api.post("/attendance/report/homeroom-email", payload);
    attendanceEmailReportSummary.value = response?.data || null;
    pushToast({
      title: "Laporan Email Diproses",
      message: response?.message || "Laporan email berhasil diproses.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Mengirim Laporan Email",
      message: error.message || "Gagal mengirim laporan email.",
      type: "error",
    });
  } finally {
    isSendingAttendanceEmailReport.value = false;
  }
};

onMounted(loadDashboard);
</script>
