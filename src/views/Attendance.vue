<template>
  <div class="min-h-screen bg-slate-100 px-4 pb-12 pt-5 font-sans text-slate-900 dark:bg-[#0b141a] dark:text-slate-100">
    <div class="mx-auto w-full max-w-md space-y-4">
      <!-- Header -->
      <header class="flex items-end justify-between">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-500 dark:text-indigo-300">Absensi Wajah</p>
          <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{{ currentDate }}</p>
        </div>
        <p class="text-3xl font-black tabular-nums leading-none text-slate-900 dark:text-white">{{ currentTime }}</p>
      </header>

      <!-- Attendance card -->
      <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111b21]">
        <!-- Status -->
        <div class="flex items-center justify-between gap-3 px-4 pt-4">
          <p class="text-sm font-bold text-slate-900 dark:text-white">Status hari ini</p>
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold" :class="statusUi.chip">
            <span class="h-1.5 w-1.5 rounded-full" :class="[statusUi.dot, hasCheckedInToday && !hasCheckedOutToday ? 'animate-pulse' : '']"></span>
            {{ todayStatusLabel }}
          </span>
        </div>

        <!-- In / Out times -->
        <div class="grid grid-cols-2 gap-2.5 px-4 pt-3">
          <div class="rounded-2xl bg-slate-50 px-3.5 py-2.5 dark:bg-[#0b141a]">
            <p class="text-[11px] font-semibold text-slate-400">Check-in</p>
            <p class="mt-0.5 text-base font-black tabular-nums text-slate-900 dark:text-white">{{ clockInLabel }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 px-3.5 py-2.5 dark:bg-[#0b141a]">
            <p class="text-[11px] font-semibold text-slate-400">Check-out</p>
            <p class="mt-0.5 text-base font-black tabular-nums text-slate-900 dark:text-white">{{ clockOutLabel }}</p>
          </div>
        </div>
        <div class="px-4 pt-2">
          <p class="rounded-2xl bg-slate-50 px-3.5 py-2.5 text-xs leading-5 text-slate-500 dark:bg-[#0b141a] dark:text-slate-400">
            Batas terlambat: <span class="font-bold text-slate-700 dark:text-slate-200">{{ lateAfterLabel }}</span>
            · Jam pulang minimal: <span class="font-bold text-slate-700 dark:text-slate-200">{{ checkoutDeadlineLabel }}</span>
          </p>
        </div>

        <!-- Viewfinder + capture flow -->
        <div v-if="!hasCheckedInToday" class="px-4 pt-4">
          <div class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-950">
            <video ref="cameraVideoRef" class="absolute inset-0 z-0 h-full w-full object-cover"
              :class="cameraActive ? 'block' : 'hidden'" autoplay playsinline muted></video>

            <div v-if="!cameraActive && !selectedFile" class="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
              </div>
              <p class="mt-3 text-sm font-semibold text-slate-300">Aktifkan kamera untuk mulai</p>
            </div>

            <div class="pointer-events-none absolute inset-5 rounded-2xl border-2 border-white/25"></div>
            <span class="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white">
              {{ cameraActive ? "Kamera aktif" : "Standby" }}
            </span>
          </div>
        </div>

        <canvas ref="captureCanvasRef" class="hidden"></canvas>

        <div class="space-y-2.5 p-4">
          <!-- No face reference -->
          <template v-if="!hasProfileReference">
            <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              <p class="text-sm font-bold">Enrol wajah dulu</p>
              <p class="mt-1 text-xs leading-5">Simpan foto referensi wajah Anda sebelum bisa melakukan absensi.</p>
              <router-link :to="{ name: 'FaceEnrollment' }"
                class="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-rose-600 text-sm font-bold text-white transition hover:bg-rose-500">
                Enrol Wajah Sekarang
              </router-link>
            </div>
          </template>

          <!-- Capture + submit flow -->
          <template v-else-if="!hasCheckedInToday">
            <div class="grid gap-2.5" :class="cameraActive ? 'grid-cols-2' : 'grid-cols-1'">
              <button v-if="!cameraActive" type="button" @click="startCamera"
                :disabled="isVerifyingFace || isCheckingIn || isCameraLoading || cameraActive || !hasProfileReference || hasCheckedInToday"
                class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
                {{ isCameraLoading ? "Membuka..." : "Aktifkan Kamera" }}
              </button>

              <template v-else>
                <button type="button" @click="stopCamera" :disabled="isVerifyingFace || isCheckingIn"
                  class="col-span-2 inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
                  Tutup
                </button>
              </template>
            </div>

            <!-- Verification feedback -->
            <div v-if="cameraActive || isVerifyingFace || faceVerification.status === 'error'"
              class="flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 text-xs" :class="faceVerificationAlertClass">
              <div class="min-w-0">
                <p class="font-bold">{{ faceVerificationTitle }}</p>
                <p class="mt-0.5 leading-5">{{ faceVerificationMessage }}</p>
              </div>
              <p v-if="verificationScorePercent" class="shrink-0 text-xl font-black">{{ verificationScorePercent }}%</p>
            </div>
          </template>

          <!-- Checked in -->
          <template v-else>
            <div class="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
              <img v-if="todayRecord?.image" :src="todayRecord.image" alt="Selfie absensi" class="h-12 w-12 shrink-0 rounded-xl object-cover" />
              <div v-else class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-bold text-emerald-800 dark:text-emerald-200">Check-in tercatat</p>
                <p class="mt-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                  {{ hasCheckedOutToday ? "Sesi absensi hari ini selesai." : "Jangan lupa check-out setelah selesai." }}
                </p>
              </div>
            </div>

            <button type="button" @click="openCheckoutConfirm" :disabled="isCheckingOut || hasCheckedOutToday"
              class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
              <svg v-if="isCheckingOut" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {{ hasCheckedOutToday ? "Sesi Telah Berakhir" : isCheckingOut ? "Mengirim..." : "Check-out Sekarang" }}
            </button>
          </template>
        </div>
      </section>

      <!-- History -->
      <section class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111b21]">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-bold text-slate-900 dark:text-white">Riwayat Kehadiran</h2>
              <p class="mt-0.5 text-xs text-slate-400">{{ attendanceTotal }} data</p>
            </div>
            <button type="button" @click="loadAttendance()" :disabled="isLoadingAttendance"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-white/5 dark:hover:text-white">
              <svg class="h-4 w-4" :class="{ 'animate-spin': isLoadingAttendance }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>

          <form class="grid gap-2 sm:grid-cols-[1fr,auto]" @submit.prevent="applyAttendanceSearch">
            <input
              v-model="attendanceSearchInput"
              type="search"
              placeholder="Cari tanggal, status, jam, catatan"
              class="h-11 rounded-2xl border-0 bg-slate-50 px-3.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 dark:bg-[#0b141a] dark:text-white dark:ring-white/10"
            />
            <div class="grid grid-cols-[1fr,auto] gap-2 sm:flex">
              <select
                v-model.number="attendanceLimit"
                class="h-11 rounded-2xl border-0 bg-slate-50 px-3.5 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 dark:bg-[#0b141a] dark:text-slate-200 dark:ring-white/10"
                @change="changeAttendanceLimit"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
              </select>
              <button
                type="submit"
                class="h-11 rounded-2xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-500"
              >
                Cari
              </button>
            </div>
          </form>

          <button
            v-if="attendanceSearch"
            type="button"
            class="self-start text-xs font-bold text-indigo-600 dark:text-indigo-300"
            @click="clearAttendanceSearch"
          >
            Hapus filter "{{ attendanceSearch }}"
          </button>
        </div>

        <SkeletonLoader v-if="isLoadingAttendance" variant="list" :count="4" class="mt-3" />

        <p v-else-if="recentAttendances.length === 0" class="py-8 text-center text-sm text-slate-400">
          Belum ada riwayat kehadiran.
        </p>

        <ul v-else class="mt-3 space-y-2">
          <li v-for="item in recentAttendances" :key="item.id || `${item.attendance_date}-${item.clock_in}`"
            class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-[#0b141a]">
            <a v-if="item.image" :href="item.image" target="_blank" rel="noreferrer" class="shrink-0">
              <img :src="item.image" alt="Selfie" class="h-11 w-11 rounded-xl object-cover" />
            </a>
            <div v-else class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-400 dark:bg-white/5">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 18.75h-2.25m0 0H5.25m10.5 0a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3v9.75a3 3 0 0 0 3 3" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold text-slate-900 dark:text-white">{{ formatDate(item.attendance_date) }}</p>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {{ formatChatTime(item.clock_in) || "--" }} – {{ formatChatTime(item.clock_out) || "--" }}
              </p>
              <p v-if="item.checkout_note" class="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
                {{ item.checkout_note }}
              </p>
            </div>
            <span class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold" :class="{
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300': item.status?.toLowerCase() === 'hadir',
              'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300': item.status?.toLowerCase() === 'terlambat',
              'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300': !['hadir', 'terlambat'].includes(item.status?.toLowerCase())
            }">{{ item.status || "Hadir" }}</span>
          </li>
        </ul>

        <div v-if="attendanceTotalPages > 1" class="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
          <button
            type="button"
            :disabled="attendancePage <= 1 || isLoadingAttendance"
            class="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            @click="goAttendancePage(attendancePage - 1)"
          >
            Prev
          </button>
          <p class="text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            {{ attendanceRangeLabel }} · Halaman {{ attendancePage }} / {{ attendanceTotalPages }}
          </p>
          <button
            type="button"
            :disabled="attendancePage >= attendanceTotalPages || isLoadingAttendance"
            class="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            @click="goAttendancePage(attendancePage + 1)"
          >
            Next
          </button>
        </div>
      </section>
    </div>

    <teleport to="body">
      <div
        v-if="isCheckoutConfirmOpen"
        class="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center"
        @click.self="closeCheckoutConfirm"
      >
        <div class="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-900/10 dark:bg-[#111b21] dark:ring-white/10">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">Konfirmasi Check-out</p>
          <h2 class="mt-2 text-xl font-black text-slate-900 dark:text-white">Akhiri sesi absensi hari ini?</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Pastikan Anda benar-benar sudah selesai sebelum melakukan check-out.
          </p>

          <div class="mt-4 grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm dark:bg-[#0b141a]">
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-500 dark:text-slate-400">Check-in</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ clockInLabel }}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-500 dark:text-slate-400">Jam pulang minimal</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ checkoutDeadlineLabel }}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-500 dark:text-slate-400">Waktu sekarang</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ currentTime }}</span>
            </div>
          </div>

          <div v-if="isBeforeCheckoutMinimum" class="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs font-semibold leading-5 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            Anda check-out sebelum jam pulang minimal. Sistem tetap mencatat check-out dengan catatan kepulangan tidak sesuai.
          </div>

          <div class="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              class="h-11 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              :disabled="isCheckingOut"
              @click="closeCheckoutConfirm"
            >
              Batal
            </button>
            <button
              type="button"
              class="h-11 rounded-2xl bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              :disabled="isCheckingOut"
              @click="confirmCheckout"
            >
              {{ isCheckingOut ? "Mengirim..." : "Ya, Check-out" }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { pushToast } from "@/composables/useToast";
import { formatChatTime, formatDate, formatDateKey, formatLongDate } from "@/utils/date";
import { useProfileStore } from "@/store/profile";
import { createSortState, sortItems } from "@/utils/tableSort";
import { storeToRefs } from "pinia";
import { useStudentAttendanceStore } from "@/store/studentAttendance";

// --- Live Clock Logic ---
let timer;
let faceApiLoadPromise = null;
let faceApiModelsPromise = null;
let cameraStream = null;

const FACE_API_SCRIPT_URL = "/vendor/face-api/face-api.min.js";
const FACE_API_MODEL_URL = "/vendor/face-api/models";
const FACE_MATCH_THRESHOLD = 0.5;
const LIVE_SCAN_INTERVAL_MS = 360;
const LIVE_MATCH_REQUIRED = 2;

const updateClock = () => {
  const now = new Date();
  attendanceStore.currentTime = formatChatTime(now);
  attendanceStore.currentDate = formatLongDate(now);
};

// --- Attendance State ---
const attendanceStore = useStudentAttendanceStore();
const {
  currentTime,
  currentDate,
  selectedFile,
  selectedPreviewUrl,
  attendances,
  todayAttendance,
  isCheckingIn,
  isCheckingOut,
  isCheckoutConfirmOpen,
  isLoadingAttendance,
  isVerifyingFace,
  isCameraLoading,
  cameraActive,
  isMobileClient,
  geoCoords,
  faceVerification,
  attendancePage,
  attendanceLimit,
  attendanceSearch,
  attendanceSearchInput,
  attendanceTotal,
  attendanceTotalPages,
} = storeToRefs(attendanceStore);
const cameraVideoRef = ref(null);
const captureCanvasRef = ref(null);
const tableSort = createSortState("attendance_date", "desc");
const profileStore = useProfileStore();

// Computed properti untuk mendeteksi status kehadiran hari ini
const formatLocalDate = (value) => {
  return formatDateKey(value);
};

const todayStr = formatLocalDate(new Date());

const hasCheckedInToday = computed(() => attendanceStore.hasCheckedInToday);
const hasCheckedOutToday = computed(() => attendanceStore.hasCheckedOutToday);
const todayRecord = computed(() => attendanceStore.todayRecord || attendances.value.find(item => formatLocalDate(item.attendance_date) === todayStr));
const storedReferenceDescriptor = computed(() => profileStore.profile?.face_reference_descriptor || "");
const hasProfileReference = computed(() => Boolean(String(storedReferenceDescriptor.value || "").trim()));
const lateAfterLabel = computed(() => profileStore.profile?.attendance_late_after_time || "Tidak dibatasi");
const checkoutDeadlineLabel = computed(() => profileStore.profile?.attendance_checkout_deadline || "Tidak dibatasi");
const attendanceRangeLabel = computed(() => attendanceStore.attendanceRangeLabel);

const sortedAttendances = computed(() => sortItems(attendances.value, tableSort));
const recentAttendances = computed(() => sortedAttendances.value);
const clockMinutesFromTimeString = (value) => {
  const match = String(value || "").trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return hours * 60 + minutes;
};
const isBeforeCheckoutMinimum = computed(() => {
  const minimumMinutes = clockMinutesFromTimeString(profileStore.profile?.attendance_checkout_deadline);
  if (minimumMinutes == null) return false;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes < minimumMinutes;
});
const clockInLabel = computed(() => (todayRecord.value?.clock_in ? formatChatTime(todayRecord.value.clock_in) : "--:--"));
const clockOutLabel = computed(() => (todayRecord.value?.clock_out ? formatChatTime(todayRecord.value.clock_out) : "--:--"));
const todayStatusLabel = computed(() => {
  if (hasCheckedOutToday.value) return "Sesi selesai";
  if (hasCheckedInToday.value) return "Sedang aktif";
  return "Belum check-in";
});
const statusUi = computed(() => {
  if (hasCheckedOutToday.value) {
    return { chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", dot: "bg-emerald-500" };
  }
  if (hasCheckedInToday.value) {
    return { chip: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300", dot: "bg-indigo-500" };
  }
  return { chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", dot: "bg-amber-500" };
});
const verificationScorePercent = computed(() => {
  if (faceVerification.value.status !== "matched" || typeof faceVerification.value.distance !== "number") {
    return 0;
  }
  return Math.max(0, Math.min(99, Math.round((1 - faceVerification.value.distance) * 100)));
});
const faceVerificationTitle = computed(() => {
  if (!hasProfileReference.value) return "Enrol wajah diperlukan";
  if (faceVerification.value.status === "matched") return "Wajah cocok";
  if (faceVerification.value.status === "mismatch") return "Wajah tidak cocok";
  if (faceVerification.value.status === "error") return "Verifikasi gagal";
  if (faceVerification.value.status === "loading") return "Memeriksa wajah";
  return "Absensi wajah";
});
const faceVerificationMessage = computed(() => {
  if (!hasProfileReference.value) return "Simpan foto referensi dari menu Enrol Wajah sebelum check-in.";
  return faceVerification.value.message;
});
const faceVerificationAlertClass = computed(() => {
  if (!hasProfileReference.value) return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300";
  if (faceVerification.value.status === "matched") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
  if (faceVerification.value.status === "mismatch" || faceVerification.value.status === "error") return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300";
  if (faceVerification.value.status === "loading") return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300";
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300";
});

const resetSelectedPreview = () => {
  if (selectedPreviewUrl.value) {
    URL.revokeObjectURL(selectedPreviewUrl.value);
    selectedPreviewUrl.value = "";
  }
};

const resetFaceVerification = (status = "idle", message = "Aktifkan kamera untuk mulai verifikasi wajah.") => {
  attendanceStore.resetFaceVerification(status, message);
};

const ensureGeolocation = async () => {
  if (!navigator.geolocation) {
    throw new Error("Browser tidak mendukung GPS. Gunakan Chrome dan aktifkan lokasi.");
  }

  return await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos?.coords?.latitude;
        const lng = pos?.coords?.longitude;
        const acc = pos?.coords?.accuracy;
        if (typeof lat !== "number" || typeof lng !== "number") {
          reject(new Error("Lokasi tidak valid. Aktifkan GPS lalu coba lagi."));
          return;
        }
        geoCoords.value = {
          latitude: lat,
          longitude: lng,
          accuracy: typeof acc === "number" ? acc : null,
        };
        resolve(geoCoords.value);
      },
      (err) => {
        const msg =
          err?.code === 1
            ? "Izin lokasi ditolak. Aktifkan izin lokasi untuk absensi."
            : "Gagal mendapatkan lokasi. Aktifkan GPS lalu coba lagi.";
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  });
};

let liveRafId = null;
let liveScanLastAt = 0;
let liveConsecutiveMatches = 0;
let liveScanInFlight = false;
let liveFaceApiInstance = null;

const stopLiveRecognition = () => {
  if (liveRafId) {
    cancelAnimationFrame(liveRafId);
    liveRafId = null;
  }
  liveScanLastAt = 0;
  liveConsecutiveMatches = 0;
  liveScanInFlight = false;
};

const stopCamera = () => {
  stopLiveRecognition();
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraActive.value = false;
  if (cameraVideoRef.value) {
    cameraVideoRef.value.srcObject = null;
  }
  selectedFile.value = null;
  resetSelectedPreview();
  resetFaceVerification();
  geoCoords.value = { latitude: null, longitude: null, accuracy: null };
};

const startCamera = async () => {
  if (cameraActive.value || isCameraLoading.value || !hasProfileReference.value) {
    return;
  }

  isCameraLoading.value = true;
  try {
    loadFaceApi().catch(() => { });
    await ensureGeolocation();
    const isMobile = window.matchMedia?.("(pointer:coarse)")?.matches || window.innerWidth < 640;
    isMobileClient.value = Boolean(isMobile);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: isMobile ? 640 : 960 },
        height: { ideal: isMobile ? 640 : 960 },
      },
      audio: false,
    });
    cameraStream = stream;
    if (cameraVideoRef.value) {
      cameraVideoRef.value.srcObject = stream;
      await cameraVideoRef.value.play();
    }
    cameraActive.value = true;
    startLiveRecognition();
  } catch (error) {
    stopCamera();
    resetFaceVerification("error", error?.message || "Kamera/lokasi tidak bisa diakses. Izinkan kamera & lokasi lalu coba lagi.");
  } finally {
    isCameraLoading.value = false;
  }
};

const loadFaceApiScript = async () => {
  if (window.faceapi) {
    return window.faceapi;
  }

  if (!faceApiLoadPromise) {
    faceApiLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = FACE_API_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve(window.faceapi);
      script.onerror = () => reject(new Error("Gagal memuat library face recognition."));
      document.head.appendChild(script);
    });
  }

  return await faceApiLoadPromise;
};

const loadFaceApi = async () => {
  if (!faceApiModelsPromise) {
    faceApiModelsPromise = (async () => {
      const faceapi = await loadFaceApiScript();
      if (!faceapi?.nets) {
        throw new Error("Gagal memuat library face recognition.");
      }

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(FACE_API_MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(FACE_API_MODEL_URL),
      ]);
      return faceapi;
    })().catch((error) => {
      faceApiModelsPromise = null;
      throw error;
    });
  }

  return await faceApiModelsPromise;
};

const captureEvidenceFromVideo = async () => {
  const video = cameraVideoRef.value;
  const canvas = captureCanvasRef.value;

  if (!video || !canvas || !cameraActive.value) {
    return null;
  }

  resetSelectedPreview();
  selectedFile.value = null;

  canvas.width = video.videoWidth || 720;
  canvas.height = video.videoHeight || 720;
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.92);
  });

  if (!blob) {
    return null;
  }

  selectedFile.value = new File([blob], `attendance-${Date.now()}.jpg`, {
    type: "image/jpeg",
  });
  selectedPreviewUrl.value = URL.createObjectURL(selectedFile.value);
  return selectedFile.value;
};

const submitCheckIn = async () => {
  if (!selectedFile.value || !hasProfileReference.value || faceVerification.value.status !== "matched") return;
  try {
    const formData = new FormData();
    formData.append("image", selectedFile.value);
    formData.append("face_verification_status", faceVerification.value.status || "");
    formData.append("face_verification_distance", String(faceVerification.value.distance ?? ""));
    if (typeof geoCoords.value.latitude === "number" && typeof geoCoords.value.longitude === "number") {
      formData.append("latitude", String(geoCoords.value.latitude));
      formData.append("longitude", String(geoCoords.value.longitude));
    }
    if (typeof geoCoords.value.accuracy === "number") {
      formData.append("accuracy_meters", String(geoCoords.value.accuracy));
    }
    await attendanceStore.submitCheckIn(formData);
    stopCamera();
  } catch (error) {
    stopCamera();
    liveConsecutiveMatches = 0;
  }
};

const startLiveRecognition = async () => {
  if (!cameraActive.value || !cameraVideoRef.value || !hasProfileReference.value) {
    return;
  }

  stopLiveRecognition();
  resetFaceVerification("loading", "Memuat model verifikasi wajah...");

  let referenceDescriptor;
  try {
    liveFaceApiInstance = liveFaceApiInstance || (await loadFaceApi());
    referenceDescriptor = Float32Array.from(JSON.parse(storedReferenceDescriptor.value));
  } catch (error) {
    resetFaceVerification("error", error?.message || "Data referensi wajah tidak valid. Silakan enrol ulang wajah.");
    return;
  }

  resetFaceVerification("loading", "Arahkan wajah ke kamera. Sistem akan mencocokkan secara otomatis.");

  const loop = async (timestamp) => {
    if (!cameraActive.value || hasCheckedInToday.value || !cameraVideoRef.value) {
      return;
    }

    const nowMs = typeof timestamp === "number" ? timestamp : performance.now();
    liveRafId = requestAnimationFrame(loop);
    if (isCheckingIn.value) return;
    if (liveScanInFlight) return;
    if (nowMs - liveScanLastAt < LIVE_SCAN_INTERVAL_MS) return;

    liveScanLastAt = nowMs;
    liveScanInFlight = true;
    isVerifyingFace.value = true;

    try {
      const faceapi = liveFaceApiInstance;
      const video = cameraVideoRef.value;
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection?.descriptor) {
        liveConsecutiveMatches = 0;
        faceVerification.value = {
          status: "idle",
          distance: null,
          message: "Wajah belum terdeteksi. Pastikan wajah terlihat jelas dan cahaya cukup.",
        };
        return;
      }

      const distance = faceapi.euclideanDistance(referenceDescriptor, detection.descriptor);
      const matched = distance <= FACE_MATCH_THRESHOLD;
      liveConsecutiveMatches = matched ? liveConsecutiveMatches + 1 : 0;

      faceVerification.value = {
        status: matched ? "matched" : "mismatch",
        distance,
        message: matched
          ? `Wajah cocok. Menstabilkan deteksi (${liveConsecutiveMatches}/${LIVE_MATCH_REQUIRED})...`
          : "Wajah tidak cocok dengan foto referensi. Hadap kamera lurus dan coba lagi.",
      };

      if (matched && liveConsecutiveMatches >= LIVE_MATCH_REQUIRED) {
        const evidence = await captureEvidenceFromVideo();
        if (!evidence) {
          resetFaceVerification("error", "Gagal mengambil gambar dari kamera.");
          liveConsecutiveMatches = 0;
          return;
        }

        faceVerification.value = {
          status: "matched",
          distance,
          message: "Wajah sesuai foto referensi. Mengirim check-in...",
        };
        await submitCheckIn();
      }
    } catch (error) {
      liveConsecutiveMatches = 0;
      faceVerification.value = {
        status: "idle",
        distance: null,
        message: error.message || "Wajah belum terdeteksi. Pastikan wajah terlihat jelas.",
      };
    } finally {
      liveScanInFlight = false;
      isVerifyingFace.value = false;
    }
  };

  liveRafId = requestAnimationFrame(loop);
};

const loadTodayAttendance = async () => {
  await attendanceStore.loadTodayAttendance();
};

const loadAttendance = async ({ page = attendancePage.value } = {}) => {
  await attendanceStore.loadAttendance({ page });
};

const applyAttendanceSearch = async () => {
  await attendanceStore.applyAttendanceSearch();
};

const clearAttendanceSearch = async () => {
  await attendanceStore.clearAttendanceSearch();
};

const changeAttendanceLimit = async () => {
  await attendanceStore.changeAttendanceLimit();
};

const goAttendancePage = async (page) => {
  await attendanceStore.goAttendancePage(page);
};

const openCheckoutConfirm = () => {
  attendanceStore.openCheckoutConfirm();
};

const closeCheckoutConfirm = () => {
  attendanceStore.closeCheckoutConfirm();
};

const confirmCheckout = async () => {
  await attendanceStore.submitCheckOut();
};

onMounted(() => {
  updateClock();
  timer = setInterval(updateClock, 1000);
  loadTodayAttendance();
  loadAttendance();
  profileStore.loadProfile().then(() => {
    if (hasProfileReference.value) {
      loadFaceApi().catch(() => { });
    }
  }).catch(() => { });
});

onUnmounted(() => {
  clearInterval(timer);
  stopCamera();
  isCheckoutConfirmOpen.value = false;
  resetSelectedPreview();
});
</script>

<style scoped>
</style>
