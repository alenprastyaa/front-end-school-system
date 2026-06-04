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

            <button type="button" @click="submitCheckOut" :disabled="isCheckingOut || hasCheckedOutToday"
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
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Riwayat Kehadiran</h2>
          <button type="button" @click="loadAttendance"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        <p v-if="recentAttendances.length === 0" class="py-8 text-center text-sm text-slate-400">
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
            </div>
            <span class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold" :class="{
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300': item.status?.toLowerCase() === 'hadir',
              'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300': item.status?.toLowerCase() === 'terlambat',
              'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300': !['hadir', 'terlambat'].includes(item.status?.toLowerCase())
            }">{{ item.status || "Hadir" }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatChatTime, formatDate, formatDateKey, formatLongDate } from "@/utils/date";
import { useProfileStore } from "@/store/profile";
import { createSortState, sortItems } from "@/utils/tableSort";

// --- Live Clock Logic ---
const currentTime = ref("");
const currentDate = ref("");
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
  currentTime.value = formatChatTime(now);
  currentDate.value = formatLongDate(now);
};

// --- Attendance State ---
const selectedFile = ref(null);
const selectedPreviewUrl = ref("");
const attendances = ref([]);
const isCheckingIn = ref(false);
const isCheckingOut = ref(false);
const isVerifyingFace = ref(false);
const isCameraLoading = ref(false);
const cameraActive = ref(false);
const isMobileClient = ref(false);
const geoCoords = ref({
  latitude: null,
  longitude: null,
  accuracy: null,
});
const cameraVideoRef = ref(null);
const captureCanvasRef = ref(null);
const faceVerification = ref({
  status: "idle",
  distance: null,
  message: "Aktifkan kamera untuk mulai verifikasi wajah.",
});
const tableSort = createSortState("attendance_date", "desc");
const profileStore = useProfileStore();

// Computed properti untuk mendeteksi status kehadiran hari ini
const formatLocalDate = (value) => {
  return formatDateKey(value);
};

const todayStr = formatLocalDate(new Date());

const todayRecord = computed(() => {
  return attendances.value.find(item => {
    const recordDate = formatLocalDate(item.attendance_date);
    return recordDate === todayStr;
  });
});

const hasCheckedInToday = computed(() => !!todayRecord.value);
const hasCheckedOutToday = computed(() => hasCheckedInToday.value && !!todayRecord.value.clock_out);
const storedReferenceDescriptor = computed(() => profileStore.profile?.face_reference_descriptor || "");
const hasProfileReference = computed(() => Boolean(String(storedReferenceDescriptor.value || "").trim()));
const canSubmitCheckIn = computed(() => hasProfileReference.value && faceVerification.value.status === "matched" && Boolean(selectedFile.value));

const sortedAttendances = computed(() => sortItems(attendances.value, tableSort));
const recentAttendances = computed(() => sortedAttendances.value.slice(0, 5));
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
  faceVerification.value = {
    status,
    distance: null,
    message,
  };
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
  if (isCheckingIn.value || !selectedFile.value || !canSubmitCheckIn.value) return;

  isCheckingIn.value = true;

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
    const response = await api.post("/attendance", formData);
    pushToast({
      title: "Check-in Berhasil",
      message: response?.message || "Check-in berhasil. Selamat beraktivitas!",
      type: "success",
    });
    stopCamera();
    await loadAttendance();
  } catch (error) {
    stopCamera();
    liveConsecutiveMatches = 0;
    pushToast({
      title: "Check-in Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isCheckingIn.value = false;
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

const loadAttendance = async () => {
  try {
    const response = await api.get("/attendance");
    attendances.value = response?.data?.data || [];
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Absensi",
      message: error.message,
      type: "error",
    });
  }
};

const submitCheckOut = async () => {
  isCheckingOut.value = true;

  try {
    const response = await api.post("/attendance/checkout", {});
    pushToast({
      title: "Check-out Berhasil",
      message: response?.message || "Check-out berhasil dicatat. Sampai jumpa besok!",
      type: "success",
    });
    await loadAttendance();
  } catch (error) {
    pushToast({
      title: "Check-out Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isCheckingOut.value = false;
  }
};

onMounted(() => {
  updateClock();
  timer = setInterval(updateClock, 1000);
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
  resetSelectedPreview();
});
</script>

<style scoped>
</style>
