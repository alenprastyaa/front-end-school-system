<template>
  <div
    class="min-h-screen bg-slate-50/50 px-3 pb-10 pt-3 font-sans text-slate-900 sm:px-4 sm:pt-4 md:px-8 md:pb-12 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto space-y-5 sm:space-y-6">

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
              liveDashboardClock }}</span>
          </div>
          <div class="h-8 w-px bg-slate-200 hidden sm:block dark:bg-slate-800"></div>
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

      <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in summaryCards" :key="item.label" class="relative overflow-hidden rounded-2xl p-4"
          :class="item.cardClass">
          <div class="flex items-start justify-between gap-4">
            <div>
              <dt class="text-xs font-semibold uppercase tracking-[0.14em]" :class="item.labelClass">{{ item.label }}
              </dt>
              <dd class="mt-2 text-2xl font-bold tracking-tight sm:text-[2rem]" :class="item.valueClass">{{ item.value
              }}</dd>
              <dd class="mt-2 text-[11px]" :class="item.captionClass">{{ item.caption }}</dd>
            </div>
            <div class="flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14">
              <Icon :icon="item.icon" class="h-8 w-8 opacity-75 sm:h-9 sm:w-9" :class="item.iconClass" />
            </div>
          </div>
        </div>
      </section>

      <section v-if="role === 'GURU'" class="space-y-4">
        <div v-if="teacherTeachingAlert"
          class="rounded-2xl border border-emerald-200 bg-white px-4 py-4 shadow-sm sm:px-5 dark:border-emerald-500/20 dark:bg-slate-900">
          <div class="flex items-start gap-3">
            <div
              class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Icon icon="mdi:teach" class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {{ teacherTeachingAlert.title }}
              </p>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {{ teacherTeachingAlert.message }}
              </p>
            </div>
          </div>
        </div>

        <section
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Jadwal Mengajar</h2>
            <p class="mt-1 text-sm text-slate-500">Ringkasan jadwal mingguan guru yang ditampilkan sederhana per hari.
            </p>
          </div>

          <div v-if="teacherScheduleDays.length" class="p-4 sm:p-5">
            <div class="space-y-3">
              <div v-for="day in teacherScheduleDays" :key="day.day_order"
                class="rounded-xl border border-slate-200 dark:border-slate-800">
                <div
                  class="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex rounded-lg bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white">
                      {{ day.day_name }}
                    </span>
                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ day.groupedEntries.length }} blok
                      jadwal</span>
                  </div>
                  <span v-if="day.day_order === teacherScheduleTodayOrder"
                    class="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Hari Ini
                  </span>
                </div>

                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                  <div v-for="entry in day.groupedEntries" :key="entry.group_key"
                    class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900 dark:text-white">
                        {{ entry.subject_name }} <span class="font-normal text-slate-500 dark:text-slate-400">di {{
                          entry.class_name }}</span>
                      </p>
                      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {{ entry.total_sessions }} jam • {{ formatScheduleRange(entry.start_time, entry.end_time) }}
                      </p>
                    </div>
                    <div class="flex items-center gap-2">
                      <span v-if="entry.subject_code"
                        class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {{ entry.subject_code }}
                      </span>
                      <span v-if="entry.is_active"
                        class="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="teacherTeachingAssignments.length"
                class="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <p class="text-sm font-semibold text-slate-900 dark:text-white">Mapel Diampu</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span v-for="item in teacherTeachingAssignments"
                    :key="`${item.class_name}-${item.subject_name}-${item.id}`"
                    class="inline-flex rounded-full bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
                    {{ item.subject_name }} • {{ item.class_name }}{{ item.weekly_hours ? ` • ${item.weekly_hours} jam`
                      : "" }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="teacherTeachingAssignments.length" class="p-4 sm:p-6">
            <div
              class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
              Slot hari dan jam belum tergenerate, tetapi guru sudah terdistribusi mengajar pada kelas berikut.
            </div>

            <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <article v-for="item in teacherTeachingAssignments"
                :key="`${item.class_name}-${item.subject_name}-${item.id}`"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Kelas Diampu
                    </p>
                    <h3 class="mt-1 text-base font-bold text-slate-900 dark:text-white">{{ item.class_name }}</h3>
                  </div>
                  <span
                    class="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                    {{ item.weekly_hours ? `${item.weekly_hours} jam` : "Mapel aktif" }}
                  </span>
                </div>
                <p class="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.subject_name }}</p>
                <p v-if="item.subject_code" class="mt-1 text-xs text-slate-500 dark:text-slate-400">Kode: {{
                  item.subject_code }}</p>
                <p v-if="item.notes" class="mt-3 text-sm text-slate-600 dark:text-slate-300">{{ item.notes }}</p>
              </article>
            </div>
          </div>

          <div v-else class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Guru belum memiliki data distribusi kelas atau jadwal mengajar.
          </div>
        </section>
      </section>

      <section v-if="role === 'ADMIN'"
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Kirim Rekap WhatsApp Wali Kelas</h2>
            <p class="mt-1 text-sm text-slate-500">Admin memilih kelas terlebih dahulu, lalu kirim WhatsApp hanya ke
              wali kelas tersebut.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal Rekap</label>
              <input v-model="attendanceWhatsappReportDate" type="date"
                class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" />
            </div>
          </div>
        </div>

        <div class="mt-5 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th class="px-4 py-3 font-medium">Kelas</th>
                <th class="px-4 py-3 font-medium">Wali Kelas</th>
                <th class="px-4 py-3 font-medium">WhatsApp</th>
                <th class="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in (dashboardData?.classes || [])" :key="`${item.id}-${item.class_name}`">
                <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">{{ item.class_name || "-" }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.wali_guru_name || "-" }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.wali_guru_phone_number || "-" }}</td>
                <td class="px-4 py-3 text-right">
                  <button @click="sendAttendanceWhatsappReport(item)" :disabled="sendingWhatsappClassId === item.id"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                    <svg v-if="sendingWhatsappClassId === item.id" class="h-4 w-4 animate-spin" fill="none"
                      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    {{ sendingWhatsappClassId === item.id ? "Mengirim..." : "Kirim WhatsApp" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="attendanceWhatsappReportSummary"
          class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Hasil Pengiriman Terakhir</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                {{ attendanceWhatsappReportSummary.class_name || "-" }} • {{
                  attendanceWhatsappReportSummary.wali_guru_name || "-" }}
              </h3>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                WhatsApp tujuan: {{ attendanceWhatsappReportSummary.target || "-" }} • Tanggal rekap: {{
                  attendanceWhatsappReportSummary.attendance_date || "-" }}
              </p>
            </div>
            <span class="inline-flex rounded-full px-3 py-1 text-xs font-bold"
              :class="attendanceWhatsappReportSummary.success ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'">
              {{ attendanceWhatsappReportSummary.success ? "Berhasil" : "Gagal" }}
            </span>
          </div>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 dark:bg-slate-900">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Sudah Hadir</p>
              <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{
                attendanceWhatsappReportSummary.present_count || 0 }}</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {{ attendanceWhatsappReportSummary.present_names?.length ?
                  attendanceWhatsappReportSummary.present_names.join(", ") : "Belum ada siswa hadir." }}
              </p>
            </div>
            <div class="rounded-xl bg-white p-4 dark:bg-slate-900">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Belum Hadir</p>
              <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{
                attendanceWhatsappReportSummary.absent_count || 0 }}</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {{ attendanceWhatsappReportSummary.absent_names?.length ?
                  attendanceWhatsappReportSummary.absent_names.join(", ") : "Semua siswa sudah hadir." }}
              </p>
            </div>
          </div>
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
              <ApexChart :type="visualPanel.chartType" height="320" :options="visualChartOptions"
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
              <ApexChart type="donut" height="280" :options="compositionChartOptions"
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
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDate, formatDateTime, formatTime } from "@/utils/date";
import { getStoredRole, getStoredUser } from "@/utils/auth";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";

const ApexChart = defineAsyncComponent(() => import("vue3-apexcharts"));

const role = getStoredRole();
const user = getStoredUser();
const isLoading = ref(false);
const dashboardData = ref({});
const selectedTeacherDayOrder = ref(0);
const primaryTableSort = createSortState("");
const attendanceWhatsappReportDate = ref(new Date().toISOString().slice(0, 10));
const sendingWhatsappClassId = ref(null);
const attendanceWhatsappReportSummary = ref(null);
const currentTime = ref(new Date());
let dashboardClockTimer = null;

const endpointByRole = {
  SUPER_ADMIN: "/dashboard/superadmin",
  ADMIN: "/dashboard/admin",
  GURU: "/dashboard/guru",
  SISWA: "/dashboard/siswa",
};

// Palet warna yang lebih modern, bersih, dan enterprise-look
const chartPalette = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ef4444", "#64748b"];
const scheduleTonePalette = [
  "border-sky-200 bg-white dark:border-sky-500/20 dark:bg-slate-900",
  "border-emerald-200 bg-white dark:border-emerald-500/20 dark:bg-slate-900",
  "border-amber-200 bg-white dark:border-amber-500/20 dark:bg-slate-900",
  "border-violet-200 bg-white dark:border-violet-500/20 dark:bg-slate-900",
  "border-rose-200 bg-white dark:border-rose-500/20 dark:bg-slate-900",
  "border-cyan-200 bg-white dark:border-cyan-500/20 dark:bg-slate-900",
];
const scheduleAccentPalette = [
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-cyan-500",
];

const defaultScheduleDays = [
  { day_order: 1, day_name: "Senin" },
  { day_order: 2, day_name: "Selasa" },
  { day_order: 3, day_name: "Rabu" },
  { day_order: 4, day_name: "Kamis" },
  { day_order: 5, day_name: "Jumat" },
  { day_order: 6, day_name: "Sabtu" },
  { day_order: 7, day_name: "Minggu" },
];

const numberValue = (value) => Number(value || 0);
const formatScheduleClock = (value) => String(value || "").trim().slice(0, 5) || "-";
const formatScheduleRange = (start, end) => `${formatScheduleClock(start)} - ${formatScheduleClock(end)}`;
const scheduleEntryTone = (sessionOrder) => scheduleTonePalette[(Number(sessionOrder || 0) - 1 + scheduleTonePalette.length) % scheduleTonePalette.length];
const scheduleAccentTone = (sessionOrder) => scheduleAccentPalette[(Number(sessionOrder || 0) - 1 + scheduleAccentPalette.length) % scheduleAccentPalette.length];
const entryCardClass = (entry) =>
  entry?.is_active
    ? "border-emerald-300 bg-white shadow-sm dark:border-emerald-500/30 dark:bg-slate-900"
    : scheduleEntryTone(entry?.first_session_order || entry?.last_session_order || 0);
const entryAccentClass = (entry) =>
  entry?.is_active ? "bg-emerald-500" : scheduleAccentTone(entry?.first_session_order || entry?.last_session_order || 0);
const dayBadgeClass = (dayOrder) => {
  if (dayOrder === teacherScheduleTodayOrder.value) {
    return "bg-rose-600 text-white";
  }
  const tones = [
    "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  ];
  return tones[(Number(dayOrder || 0) - 1 + tones.length) % tones.length];
};

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
  if (role === "SUPER_ADMIN") return "Dashboard Super Admin Sekolah";
  if (role === "ADMIN") return `Dashboard Admin ${dashboardData.value?.school?.name || user?.school_name || ""}`.trim();
  if (role === "GURU") return `Wali Kelas ${dashboardData.value?.homeroom?.class_name || ""}`.trim();
  if (role === "SISWA") return `Halo, ${dashboardData.value?.student?.full_name || user?.full_name || user?.username || "Siswa"}`;
  return "Dashboard Overview";
});

const heroDescription = computed(() => {
  if (role === "SUPER_ADMIN") return "Pantau kesiapan setiap sekolah, admin sekolah, struktur kelas, dan aktivitas operasional dari satu panel pusat.";
  if (role === "ADMIN") return "Metrik operasional sekolah, status absensi, dan data kelas secara real-time.";
  if (role === "GURU") return "Pantau wali kelas, jadwal mengajar mingguan, dan status sesi mengajar hari ini dari satu dashboard.";
  if (role === "SISWA") return "Pantau riwayat absensi, status administrasi, dan tugas akademik Anda.";
  return "Ringkasan sistem berdasarkan akses pengguna.";
});

const liveDashboardClock = computed(() => formatDateTime(currentTime.value));

const summaryCards = computed(() => {
  const overview = dashboardData.value?.overview || {};

  return role === "SUPER_ADMIN"
    ? [
      createSummaryCard({ label: "Total Sekolah", value: numberValue(overview.schools), caption: "Unit sekolah terdaftar", icon: "ph:buildings", cardClass: "bg-sky-600" }),
      createSummaryCard({ label: "Admin Sekolah", value: numberValue(overview.admins), caption: `${numberValue(overview.schools_with_admin)} sekolah sudah punya admin`, icon: "ph:user-gear", cardClass: "bg-indigo-600" }),
      createSummaryCard({ label: "Sekolah Tanpa Admin", value: numberValue(overview.schools_without_admin), caption: "Perlu onboarding admin sekolah", icon: "ph:warning-circle", cardClass: "bg-rose-600" }),
      createSummaryCard({ label: "Total Siswa", value: numberValue(overview.students), caption: `${numberValue(overview.schools_with_classes)} sekolah sudah punya kelas`, icon: "ph:student", cardClass: "bg-emerald-600" }),
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
          createSummaryCard({ label: "Siswa Wali Kelas", value: numberValue(overview.students), caption: "Total siswa dibimbing", icon: "mdi:account-school-outline", cardClass: "bg-indigo-600" }),
          createSummaryCard({ label: "Jam Mengajar Hari Ini", value: numberValue(overview.teaching_today), caption: "Sesi mengajar terjadwal", icon: "mdi:calendar-clock", cardClass: "bg-sky-600" }),
          createSummaryCard({ label: "Hadir Hari Ini", value: numberValue(overview.attendance_today), caption: "Siswa sudah absen", icon: "mdi:calendar-check-outline", cardClass: "bg-emerald-600" }),
          createSummaryCard({ label: "Sedang Mengajar", value: numberValue(overview.active_teaching_now) ? "Ya" : "Tidak", caption: numberValue(overview.weekly_teaching_sessions) ? `${numberValue(overview.weekly_teaching_sessions)} sesi per minggu` : "Belum ada jadwal mingguan", icon: "ph:chalkboard-teacher", cardClass: "bg-amber-500" }),
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

const teacherSchedulePayload = computed(() => (role === "GURU" ? dashboardData.value?.teachingSchedule || {} : {}));
const teacherScheduleEntries = computed(() =>
  Array.isArray(teacherSchedulePayload.value?.entries) ? teacherSchedulePayload.value.entries : [],
);
const activeTeachingEntryId = computed(() => Number(teacherSchedulePayload.value?.active_now?.id || 0));
const teacherTeachingAssignments = computed(() =>
  Array.isArray(teacherSchedulePayload.value?.teaching_assignments) ? teacherSchedulePayload.value.teaching_assignments : [],
);
const teacherScheduleTodayOrder = computed(() => Number(teacherSchedulePayload.value?.today_day_order || 0));
const teacherScheduleDays = computed(() => {
  if (role !== "GURU") return [];

  const dayMap = new Map(
    defaultScheduleDays.map((item) => [item.day_order, { ...item, entries: [] }]),
  );

  for (const entry of teacherScheduleEntries.value) {
    const dayOrder = Number(entry?.day_order || 0);
    if (!dayMap.has(dayOrder)) {
      dayMap.set(dayOrder, {
        day_order: dayOrder,
        day_name: entry?.day_name || `Hari ${dayOrder}`,
        entries: [],
      });
    }
    dayMap.get(dayOrder).entries.push(entry);
  }

  return Array.from(dayMap.values())
    .sort((a, b) => a.day_order - b.day_order)
    .map((day) => ({
      ...day,
      entries: [...day.entries].sort((a, b) => Number(a.session_order || 0) - Number(b.session_order || 0)),
      groupedEntries: groupScheduleEntries(day.entries),
    }))
    .filter((day) => day.entries.length > 0);
});
const selectedTeacherScheduleDay = computed(() => {
  if (role !== "GURU") return null;
  const days = teacherScheduleDays.value;
  if (!days.length) return null;
  return (
    days.find((day) => day.day_order === selectedTeacherDayOrder.value) ||
    days.find((day) => day.day_order === teacherScheduleTodayOrder.value) ||
    days[0]
  );
});

const teacherTeachingAlert = computed(() => {
  if (role !== "GURU") return null;

  const active = teacherSchedulePayload.value?.active_now;
  if (active && Object.keys(active).length) {
    return {
      title: "Guru sedang ada jam mengajar",
      message: `${active.subject_name || "-"} • ${active.class_name || "-"} • ${formatScheduleRange(active.start_time, active.end_time)}`,
    };
  }

  return null;
});

const isActiveScheduleEntry = (entry) => Number(entry?.id || 0) === activeTeachingEntryId.value;

const groupScheduleEntries = (entries) => {
  const sorted = [...entries].sort((a, b) => Number(a.session_order || 0) - Number(b.session_order || 0));
  const groups = [];

  for (const entry of sorted) {
    const last = groups[groups.length - 1];
    const currentSession = Number(entry?.session_order || 0);

    if (
      last &&
      last.class_name === entry?.class_name &&
      last.subject_name === entry?.subject_name &&
      last.subject_code === entry?.subject_code &&
      currentSession === last.last_session_order + 1
    ) {
      last.end_time = entry?.end_time;
      last.last_session_order = currentSession;
      last.total_sessions += 1;
      last.ids.push(Number(entry?.id || 0));
      last.is_active = last.is_active || isActiveScheduleEntry(entry);
      continue;
    }

    groups.push({
      group_key: `${entry?.day_order || 0}-${entry?.class_name || ""}-${entry?.subject_name || ""}-${currentSession}`,
      class_name: entry?.class_name || "-",
      subject_name: entry?.subject_name || "-",
      subject_code: entry?.subject_code || "",
      start_time: entry?.start_time || "",
      end_time: entry?.end_time || "",
      total_sessions: 1,
      first_session_order: currentSession,
      last_session_order: currentSession,
      ids: [Number(entry?.id || 0)],
      is_active: isActiveScheduleEntry(entry),
    });
  }

  return groups;
};

const primarySortAccessors = computed(() => ({
  full_name: (item) => item.full_name || item.username || "",
  checked_in_today: (item) => (item.checked_in_today ? 1 : 0),
}));

const primaryPanel = computed(() => {
  if (role === "SUPER_ADMIN") {
    return {
      title: "Portofolio Sekolah",
      description: "Pantau kesiapan sekolah dari admin, kelas, siswa, kurikulum, dan aktivitas bulan berjalan.",
      columns: [
        { key: "name", label: "Sekolah" },
        { key: "total_admins", label: "Admin" },
        { key: "total_classes", label: "Kelas" },
        { key: "curriculum_subjects", label: "Mapel Kurikulum" },
        { key: "total_teachers", label: "Guru" },
        { key: "total_students", label: "Siswa" },
        { key: "receipts_this_month", label: "Receipt Bulan Ini" },
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
      title: "Monitoring Kehadiran Wali Kelas",
      description: "Status check-in harian siswa.",
      columns: [
        { key: "full_name", label: "Nama Siswa" },
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
    if (role === "SUPER_ADMIN") {
      return {
        title: "Sekolah Perlu Perhatian",
        description: "Sekolah yang belum lengkap secara operasional dan perlu ditindaklanjuti.",
        items: (dashboardData.value?.schoolAlerts || []).map((item) => ({
          title: item.name || "-",
          subtitle: `${item.issue || "-"} • Admin ${numberValue(item.total_admins)} • Kelas ${numberValue(item.total_classes)} • Siswa ${numberValue(item.total_students)}`,
          meta: `Mapel ${numberValue(item.curriculum_subjects)}`,
        })),
        emptyMessage: "Semua sekolah sudah memiliki struktur dasar yang baik.",
      };
    }

    return {
      title: "Log Kehadiran Terbaru",
      description: "Rekam jejak check-in terakhir.",
      items: (dashboardData.value?.recentAttendance || []).map((item) => ({
        title: item.full_name || item.username || "-",
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
      { label: "Sekolah Terbesar", value: dashboardData.value?.schools?.[0]?.name || "-", caption: `${numberValue(dashboardData.value?.schools?.[0]?.total_students)} siswa`, icon: "ph:buildings", cardClass: "bg-sky-700" },
      { label: "Kurikulum Aktif", value: numberValue(dashboardData.value?.overview?.schools_with_curriculum), caption: "Sekolah sudah isi mapel kurikulum", icon: "ph:books", cardClass: "bg-indigo-700" },
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
    title: "Siswa per Sekolah",
    description: "Bandingkan populasi siswa antar sekolah untuk melihat skala operasional.",
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
  role === "SUPER_ADMIN"
    ? [
      numberValue(dashboardData.value?.overview?.schools_with_admin),
      numberValue(dashboardData.value?.overview?.schools_without_admin),
      numberValue(dashboardData.value?.overview?.schools_with_classes),
      numberValue(dashboardData.value?.overview?.schools_with_curriculum),
    ]
    : summaryCards.value.map((item) => {
      const numeric = Number(item.value);
      return Number.isFinite(numeric) ? numeric : 0;
    }),
);

const compositionChartOptions = computed(() => ({
  chart: {
    fontFamily: "inherit",
    toolbar: { show: false },
  },
  labels: role === "SUPER_ADMIN"
    ? ["Sudah Punya Admin", "Belum Punya Admin", "Sudah Punya Kelas", "Sudah Isi Kurikulum"]
    : summaryCards.value.map((item) => item.label),
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
    if (error?.isAborted) {
      return;
    }
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

const sendAttendanceWhatsappReport = async (classItem) => {
  if (!classItem?.id) {
    return;
  }

  sendingWhatsappClassId.value = classItem.id;

  try {
    const payload = {
      class_id: classItem.id,
    };
    if (attendanceWhatsappReportDate.value) {
      payload.date = attendanceWhatsappReportDate.value;
    }

    const response = await api.post("/attendance/report/homeroom-whatsapp", payload);
    attendanceWhatsappReportSummary.value = response?.data || null;
    pushToast({
      title: "WhatsApp Berhasil Dikirim",
      message: response?.message || `WhatsApp berhasil dikirim ke wali kelas ${classItem.class_name}.`,
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Mengirim Laporan WhatsApp",
      message: error.message || "Gagal mengirim laporan WhatsApp.",
      type: "error",
    });
  } finally {
    sendingWhatsappClassId.value = null;
  }
};

onMounted(loadDashboard);
onMounted(() => {
  dashboardClockTimer = window.setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  if (dashboardClockTimer) {
    window.clearInterval(dashboardClockTimer);
    dashboardClockTimer = null;
  }
});
</script>
