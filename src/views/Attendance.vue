<template>
  <div
    class="min-h-screen bg-slate-50/50 px-3 pb-12 pt-4 font-sans text-slate-900 md:px-8 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto space-y-5">


      <section
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
        <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Absensi Hari Ini</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {{ !hasCheckedInToday ? "Aktifkan kamera, ambil foto, lalu kirim check-in."
                : "Check-in sudah tercatat. Lanjutkan check-out saat selesai." }}
            </p>
            <p v-if="!hasProfileReference" class="mt-2 text-xs font-medium text-rose-600 dark:text-rose-300">
              Foto referensi wajah belum tersedia. Silakan enrol wajah terlebih dahulu.
            </p>
          </div>
          <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            :class="hasCheckedOutToday ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : hasCheckedInToday ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'">
            {{ hasCheckedOutToday ? "Selesai" : hasCheckedInToday ? "Aktif" : "Menunggu Check-in" }}
          </span>
        </div>

        <div v-if="!hasCheckedInToday" class="mt-5 space-y-4">
          <div class="flex flex-wrap gap-2">
            <button type="button" @click="startCamera"
              :disabled="isVerifyingFace || isCheckingIn || isCameraLoading || cameraActive || !hasProfileReference"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
              {{ isCameraLoading ? "Membuka..." : cameraActive ? "Kamera Aktif" : "Aktifkan Kamera" }}
            </button>
            <button v-if="cameraActive" type="button" @click="stopCamera" :disabled="isVerifyingFace || isCheckingIn"
              class="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              Tutup Kamera
            </button>
            <button type="button" @click="captureCheckInPhoto"
              :disabled="isVerifyingFace || isCheckingIn || !cameraActive || isCameraLoading || !hasProfileReference"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
              Ambil Foto
            </button>
            <button v-if="selectedFile" type="button" @click="retakeCheckInPhoto"
              :disabled="isVerifyingFace || isCheckingIn"
              class="inline-flex h-10 items-center justify-center rounded-lg border border-amber-300 bg-amber-50 px-4 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              Ambil Ulang
            </button>
          </div>

          <div
            class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
            <div class="flex min-h-[260px] items-center justify-center p-4"
              :class="selectedFile ? 'bg-emerald-50 dark:bg-emerald-500/5' : ''">
              <video ref="cameraVideoRef" class="h-full w-full max-h-[360px] rounded-2xl object-cover"
                :class="cameraActive && !selectedFile ? 'block' : 'hidden'" autoplay playsinline muted></video>

              <div v-if="!cameraActive && !selectedFile" class="text-center">
                <p class="text-base font-semibold text-slate-900 dark:text-white">Aktifkan kamera untuk mulai absensi
                </p>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Setelah kamera aktif, ambil selfie lalu kirim
                  check-in.</p>
              </div>

              <div v-if="selectedFile" class="flex w-full flex-col items-center">
                <div
                  class="h-44 w-44 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-500/20 dark:bg-slate-900">
                  <img v-if="selectedPreviewUrl" :src="selectedPreviewUrl" alt="Preview selfie"
                    class="h-full w-full object-cover" />
                </div>
                <p class="mt-3 text-sm font-medium text-slate-900 dark:text-white">Foto siap diverifikasi</p>
              </div>
            </div>
          </div>

          <canvas ref="captureCanvasRef" class="hidden"></canvas>

          <div class="rounded-xl border px-4 py-3 text-sm" :class="faceVerificationAlertClass">
            <p class="font-semibold">{{ faceVerificationTitle }}</p>
            <p class="mt-1">{{ faceVerificationMessage }}</p>
          </div>

          <button @click="submitCheckIn" :disabled="isCheckingIn || !selectedFile || !canSubmitCheckIn"
            class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
            <svg v-if="isCheckingIn || isVerifyingFace" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
              stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {{ isCheckingIn ? "Mengirim Check-in..." : isVerifyingFace ? "Memverifikasi Wajah..." : "Kirim Check-in" }}
          </button>
        </div>

        <div v-else class="mt-5 space-y-4">
          <div class="rounded-2xl bg-slate-50 p-5 text-center dark:bg-slate-800/60">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Check-in Sudah Tercatat</h3>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {{ hasCheckedOutToday ? "Absensi hari ini sudah selesai."
                : "Silakan lakukan check-out ketika kegiatan selesai." }}
            </p>
          </div>

          <button @click="submitCheckOut" :disabled="isCheckingOut || hasCheckedOutToday"
            class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
            <svg v-if="isCheckingOut" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {{ hasCheckedOutToday ? "Sesi Telah Berakhir" : isCheckingOut ? "Mengirim Check-out..." : "Check-out" }}
          </button>
        </div>
      </section>

      <section
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          class="flex flex-col gap-4 border-b border-slate-200 p-4 md:p-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Riwayat Kehadiran</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Catatan check-in dan check-out yang sudah
              tersimpan.</p>
          </div>
          <button @click="loadAttendance"
            class="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800">
            Refresh
          </button>
        </div>

        <div class="overflow-x-auto">
          <div class="block md:hidden">
            <div v-if="attendances.length === 0" class="px-6 py-12 text-center text-slate-500">
              Belum ada riwayat kehadiran.
            </div>
            <div v-else class="space-y-3 p-4">
              <div v-for="item in sortedAttendances" :key="item.id || `${item.attendance_date}-${item.clock_in}-mobile`"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-white">{{ formatDate(item.attendance_date) }}</p>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Masuk {{ formatTime(item.clock_in) }} • Pulang {{ item.clock_out ? formatTime(item.clock_out) :
                        "-" }}
                    </p>
                  </div>
                  <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium" :class="{
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300': item.status?.toLowerCase() === 'hadir',
                    'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300': item.status?.toLowerCase() === 'terlambat',
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300': !['hadir', 'terlambat'].includes(item.status?.toLowerCase())
                  }">
                    {{ item.status || "Hadir" }}
                  </span>
                </div>
                <div class="mt-3 flex justify-end">
                  <a v-if="item.image" :href="item.image" target="_blank" rel="noreferrer"
                    class="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
                    Lihat Selfie
                  </a>
                </div>
              </div>
            </div>
          </div>

          <table class="hidden min-w-full text-left text-sm md:table">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Tanggal</th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Check-in</th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Check-out</th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Status</th>
                <th class="border-b border-slate-200 px-6 py-4 text-right font-semibold dark:border-slate-800">Bukti
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in sortedAttendances" :key="item.id || `${item.attendance_date}-${item.clock_in}`"
                class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">{{ formatDate(item.attendance_date) }}
                </td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ formatTime(item.clock_in) }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.clock_out ? formatTime(item.clock_out)
                  : "-" }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium" :class="{
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300': item.status?.toLowerCase() === 'hadir',
                    'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300': item.status?.toLowerCase() === 'terlambat',
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300': !['hadir', 'terlambat'].includes(item.status?.toLowerCase())
                  }">
                    {{ item.status || "Hadir" }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <a v-if="item.image" :href="item.image" target="_blank" rel="noreferrer"
                    class="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                    Lihat Selfie
                  </a>
                  <span v-else class="text-slate-400">-</span>
                </td>
              </tr>
              <tr v-if="attendances.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                  Belum ada riwayat kehadiran.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDate, formatTime } from "@/utils/date";
import { useProfileStore } from "@/store/profile";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";

// --- Live Clock Logic ---
const currentTime = ref("");
const currentDate = ref("");
let timer;
let faceApiLoadPromise = null;
let cameraStream = null;

const FACE_API_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
const FACE_API_MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
const FACE_MATCH_THRESHOLD = 0.5;

const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  currentDate.value = now.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
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
const cameraVideoRef = ref(null);
const captureCanvasRef = ref(null);
const faceVerification = ref({
  status: "idle",
  distance: null,
  message: "Aktifkan kamera lalu ambil selfie untuk mulai verifikasi wajah.",
});
const tableSort = createSortState("attendance_date", "desc");
const profileStore = useProfileStore();

// Computed properti untuk mendeteksi status kehadiran hari ini
const formatLocalDate = (value) => {
  const current = new Date(value);
  const year = current.getFullYear();
  const month = String(current.getMonth() + 1).padStart(2, "0");
  const day = String(current.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
const canSubmitCheckIn = computed(() => hasProfileReference.value && faceVerification.value.status === "matched");

const sortedAttendances = computed(() => sortItems(attendances.value, tableSort));
const faceVerificationTitle = computed(() => {
  if (!hasProfileReference.value) return "Enrol wajah diperlukan";
  if (faceVerification.value.status === "matched") return "Wajah terverifikasi";
  if (faceVerification.value.status === "mismatch") return "Wajah tidak cocok";
  if (faceVerification.value.status === "error") return "Verifikasi gagal";
  if (faceVerification.value.status === "loading") return "Memeriksa wajah";
  return "Verifikasi wajah";
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

const handleSort = (key) => toggleSort(tableSort, key);
const sortIndicator = (key) => tableSort.key !== key ? "↕" : tableSort.direction === "asc" ? "▲" : "▼";

const resetSelectedPreview = () => {
  if (selectedPreviewUrl.value) {
    URL.revokeObjectURL(selectedPreviewUrl.value);
    selectedPreviewUrl.value = "";
  }
};

const resetFaceVerification = (status = "idle", message = "Aktifkan kamera lalu ambil selfie untuk mulai verifikasi wajah.") => {
  faceVerification.value = {
    status,
    distance: null,
    message,
  };
};

const stopCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraActive.value = false;
  if (cameraVideoRef.value) {
    cameraVideoRef.value.srcObject = null;
  }
};

const startCamera = async () => {
  if (cameraActive.value || isCameraLoading.value || !hasProfileReference.value) {
    return;
  }

  isCameraLoading.value = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 960 },
        height: { ideal: 960 },
      },
      audio: false,
    });
    cameraStream = stream;
    if (cameraVideoRef.value) {
      cameraVideoRef.value.srcObject = stream;
      await cameraVideoRef.value.play();
    }
    cameraActive.value = true;
  } catch (error) {
    stopCamera();
    resetFaceVerification("error", "Kamera tidak bisa diakses. Izinkan webcam lalu coba lagi.");
  } finally {
    isCameraLoading.value = false;
  }
};

const loadFaceApi = async () => {
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

  const faceapi = await faceApiLoadPromise;
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(FACE_API_MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(FACE_API_MODEL_URL),
  ]);
  return faceapi;
};

const loadImageForFaceApi = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Gagal memuat gambar untuk verifikasi wajah."));
    image.src = src;
  });

const detectFaceDescriptor = async (faceapi, source) => {
  const result = await faceapi
    .detectSingleFace(source, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!result?.descriptor) {
    throw new Error("Wajah tidak terdeteksi dengan jelas. Gunakan foto yang terang dan menghadap kamera.");
  }

  return result.descriptor;
};

const verifySelectedFace = async () => {
  if (!selectedFile.value || !selectedPreviewUrl.value) {
    resetFaceVerification();
    return;
  }

  if (!hasProfileReference.value) {
    resetFaceVerification("error", "Foto referensi wajah belum tersedia.");
    return;
  }

  isVerifyingFace.value = true;
  faceVerification.value = {
    status: "loading",
    distance: null,
    message: "Sistem sedang mencocokkan wajah dengan foto referensi Anda.",
  };

  try {
    const faceapi = await loadFaceApi();
    const selfieImage = await loadImageForFaceApi(selectedPreviewUrl.value);
    const referenceDescriptor = Float32Array.from(JSON.parse(storedReferenceDescriptor.value));
    const selfieDescriptor = await detectFaceDescriptor(faceapi, selfieImage);

    const distance = faceapi.euclideanDistance(referenceDescriptor, selfieDescriptor);
    const matched = distance <= FACE_MATCH_THRESHOLD;

    faceVerification.value = {
      status: matched ? "matched" : "mismatch",
      distance,
      message: matched
        ? `Wajah cocok dengan foto referensi. Skor kecocokan ${(1 - distance).toFixed(2)}.`
        : `Wajah tidak cocok dengan foto referensi. Skor jarak ${distance.toFixed(2)} melewati batas aman.`,
    };
  } catch (error) {
    faceVerification.value = {
      status: "error",
      distance: null,
      message: error.message || "Verifikasi wajah gagal diproses.",
    };
  } finally {
    isVerifyingFace.value = false;
  }
};

const captureCheckInPhoto = async () => {
  const video = cameraVideoRef.value;
  const canvas = captureCanvasRef.value;

  if (!video || !canvas || !cameraActive.value) {
    return;
  }

  resetSelectedPreview();
  selectedFile.value = null;
  resetFaceVerification("idle", "Selfie sedang disiapkan untuk verifikasi wajah.");

  canvas.width = video.videoWidth || 720;
  canvas.height = video.videoHeight || 720;
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.92);
  });

  if (!blob) {
    resetFaceVerification("error", "Foto dari kamera tidak berhasil diproses.");
    return;
  }

  selectedFile.value = new File([blob], `attendance-${Date.now()}.jpg`, {
    type: "image/jpeg",
  });
  selectedPreviewUrl.value = URL.createObjectURL(selectedFile.value);
  await verifySelectedFace();
};

const retakeCheckInPhoto = async () => {
  selectedFile.value = null;
  resetSelectedPreview();
  resetFaceVerification();
  if (!cameraActive.value) {
    await startCamera();
  }
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

const submitCheckIn = async () => {
  if (!selectedFile.value || !canSubmitCheckIn.value) return;

  isCheckingIn.value = true;

  try {
    const formData = new FormData();
    formData.append("image", selectedFile.value);
    formData.append("face_verification_status", faceVerification.value.status || "");
    formData.append("face_verification_distance", String(faceVerification.value.distance ?? ""));
    const response = await api.post("/attendance", formData);
    pushToast({
      title: "Check-in Berhasil",
      message: response?.message || "Check-in berhasil. Selamat beraktivitas!",
      type: "success",
    });
    selectedFile.value = null;
    resetSelectedPreview();
    resetFaceVerification();
    await loadAttendance();
  } catch (error) {
    pushToast({
      title: "Check-in Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isCheckingIn.value = false;
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
  profileStore.loadProfile().catch(() => { });
  loadAttendance();
});

onUnmounted(() => {
  clearInterval(timer);
  stopCamera();
  resetSelectedPreview();
});
</script>
