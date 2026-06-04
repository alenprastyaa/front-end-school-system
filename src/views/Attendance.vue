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
            <canvas v-show="cameraActive" ref="overlayCanvasRef"
              class="pointer-events-none absolute inset-0 z-10 h-full w-full"></canvas>

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
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// --- Live Clock Logic ---
const currentTime = ref("");
const currentDate = ref("");
let timer;
let faceApiLoadPromise = null;
let cameraStream = null;

const FACE_API_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
const FACE_API_MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
const FACE_MATCH_THRESHOLD = 0.5;
const LIVE_SCAN_INTERVAL_MS = 260;
const LIVE_MATCH_REQUIRED = 3;

const MEDIAPIPE_TASKS_VISION_VERSION = "0.10.35";
const MEDIAPIPE_WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_TASKS_VISION_VERSION}/wasm`;
const MEDIAPIPE_FACE_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const updateClock = () => {
  const now = new Date();
  currentTime.value = formatChatTime(now);
  currentDate.value = formatLongDate(now);
};

class FaceMeshPainter {
  constructor({
    scanT,
    scanning,
    progress,
    fullBright,
    meshData,
    mirrorHorizontal,
    accentColor,
    sourceAspect,
    coverFit = false,
    dotsOnly = true,
  }) {
    this.scanT = scanT;
    this.scanning = scanning;
    this.progress = progress;
    this.fullBright = fullBright;
    this.meshData = meshData;
    this.mirrorHorizontal = mirrorHorizontal;
    this.accentColor = accentColor;
    this.sourceAspect = sourceAspect;
    this.coverFit = coverFit;
    this.dotsOnly = dotsOnly;
  }

  static rippleCount = 5;
  static bandFrac = 0.085;
  static baseSpeed = 0.6;
  static spread = 0.18;
  static faceRegions = [
    { name: "Dahi", duration: 1.4, color: "#38bdf8",
      mpIndices: [10, 108, 69, 104, 54, 284, 338, 337, 336, 299, 333, 151, 9, 8, 107, 66, 105, 63, 70],
      fa68Indices: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26] },
    { name: "Mata Kiri", duration: 1.2, color: "#a78bfa",
      mpIndices: [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7],
      fa68Indices: [36, 37, 38, 39, 40, 41, 17, 18, 19, 20, 21] },
    { name: "Mata Kanan", duration: 1.2, color: "#a78bfa",
      mpIndices: [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382],
      fa68Indices: [42, 43, 44, 45, 46, 47, 22, 23, 24, 25, 26] },
    { name: "Hidung", duration: 1.2, color: "#34d399",
      mpIndices: [1, 2, 98, 327, 168, 6, 197, 195, 5, 4, 129, 358, 19, 94],
      fa68Indices: [27, 28, 29, 30, 31, 32, 33, 34, 35] },
    { name: "Bibir", duration: 1.4, color: "#f59e0b",
      mpIndices: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324],
      fa68Indices: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67] },
    { name: "Rahang", duration: 1.0, color: "#38bdf8",
      mpIndices: [132, 58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361, 323],
      fa68Indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
  ];

  _hash(n) {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  _parseColor(color) {
    if (typeof color !== "string") {
      return { r: 56, g: 189, b: 248, a: 1 };
    }

    const value = color.trim();
    if (value.startsWith("#")) {
      const normalized = value.slice(1);
      const full = normalized.length === 3
        ? normalized.split("").map((char) => char + char).join("")
        : normalized;
      if (full.length === 6 || full.length === 8) {
        const r = Number.parseInt(full.slice(0, 2), 16);
        const g = Number.parseInt(full.slice(2, 4), 16);
        const b = Number.parseInt(full.slice(4, 6), 16);
        const a = full.length === 8 ? Number.parseInt(full.slice(6, 8), 16) / 255 : 1;
        if ([r, g, b].every(Number.isFinite)) {
          return { r, g, b, a: Number.isFinite(a) ? a : 1 };
        }
      }
    }

    const match = value.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+)\s*)?\)/);
    if (match) {
      return {
        r: Number.parseFloat(match[1]) || 0,
        g: Number.parseFloat(match[2]) || 0,
        b: Number.parseFloat(match[3]) || 0,
        a: match[4] == null ? 1 : Number.parseFloat(match[4]) || 0,
      };
    }

    return { r: 56, g: 189, b: 248, a: 1 };
  }

  _rgba(color, alpha = 1) {
    const parsed = this._parseColor(color);
    return `rgba(${Math.round(parsed.r)}, ${Math.round(parsed.g)}, ${Math.round(parsed.b)}, ${this._clamp((parsed.a ?? 1) * alpha, 0, 1)})`;
  }

  _mixColor(from, to, t) {
    const a = this._parseColor(from);
    const b = this._parseColor(to);
    const ratio = this._clamp(t, 0, 1);
    const r = a.r + (b.r - a.r) * ratio;
    const g = a.g + (b.g - a.g) * ratio;
    const bb = a.b + (b.b - a.b) * ratio;
    const alpha = a.a + (b.a - a.a) * ratio;
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bb)}, ${this._clamp(alpha, 0, 1)})`;
  }

  _map(point, size) {
    const px = point.x ?? point._x ?? point[0] ?? 0;
    const py = point.y ?? point._y ?? point[1] ?? 0;
    const x = this.mirrorHorizontal ? 1 - px : px;
    if (!this.coverFit || !this.sourceAspect || this.sourceAspect <= 0) {
      return { x: x * size.width, y: py * size.height };
    }

    const viewAspect = size.width / size.height;
    let contentW;
    let contentH;
    let offsetX;
    let offsetY;
    if (viewAspect > this.sourceAspect) {
      contentW = size.width;
      contentH = size.width / this.sourceAspect;
      offsetX = 0;
      offsetY = (size.height - contentH) / 2;
    } else {
      contentH = size.height;
      contentW = size.height * this.sourceAspect;
      offsetX = (size.width - contentW) / 2;
      offsetY = 0;
    }

    return {
      x: offsetX + x * contentW,
      y: offsetY + py * contentH,
    };
  }

  paint(ctx, size) {
    const points =
      this.meshData?.faceLandmarks?.[0] ||
      this.meshData?.landmarks?.positions ||
      this.meshData?.landmarks?._positions ||
      this.meshData?.points ||
      [];
    if (points.length < 20) return;

    const mapped = points.map((point) => this._map(point, size));

    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const point of mapped) {
      if (point.x < minX) minX = point.x;
      if (point.x > maxX) maxX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.y > maxY) maxY = point.y;
    }

    const center = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    };
    let maxR = 1;
    for (const point of mapped) {
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      if (radius > maxR) maxR = radius;
    }

    const progressFloor = this._clamp(this.progress, 0, 1) * 0.22;
    const band = maxR * FaceMeshPainter.bandFrac;
    const twoBandSq = 2 * band * band;
    const accent = this.accentColor || "#38bdf8";
    const dimColor = this._rgba("#ffffff", this.fullBright ? 0.15 : 0.07);
    const glowColor = this._rgba(accent, 0.4);
    const peakColor = this._rgba("#ffffff", 0.6);

    const amt = new Array(points.length).fill(progressFloor);
    const ringR = [];
    const ringC = [];
    const ringA = [];
    let activeRegion = null;
    let regionProgress = 0;
    const regionHighlight = new Array(points.length).fill(0);

    if (this.scanning) {
      for (let k = 0; k < FaceMeshPainter.rippleCount; k += 1) {
        const speed = FaceMeshPainter.baseSpeed + FaceMeshPainter.spread * this._hash(k * 7 + 3);
        const tk = this.scanT * speed + this._hash(k * 11 + 5);
        const cycle = Math.floor(tk);
        const local = tk - cycle;
        const seed = k * 131 + cycle * 977;
        const ci = Math.min(points.length - 1, Math.max(0, Math.floor(this._hash(seed) * points.length)));
        const c = mapped[ci];
        const maxRad = maxR * (0.65 + 0.55 * this._hash(seed + 41));
        const radius = local * maxRad;
        const fade = 1 - local;

        for (let i = 0; i < points.length; i += 1) {
          const dx = mapped[i].x - c.x;
          const dy = mapped[i].y - c.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const dd = d - radius;
          amt[i] += Math.exp(-(dd * dd) / twoBandSq) * fade;
        }

        ringR.push(radius);
        ringC.push(c);
        ringA.push(fade);
      }

      const faceHeight = Math.max(1, maxY - minY);
      const sweepCenter = (this.scanT * 0.22) % 1;
      const sweepWidthSq = 2 * 0.0064;
      for (let i = 0; i < points.length; i += 1) {
        const yNorm = this._clamp((mapped[i].y - minY) / faceHeight, 0, 1);
        const delta = yNorm - sweepCenter;
        const sweepPower = Math.exp(-(delta * delta) / sweepWidthSq);
        const tailDelta = yNorm - (sweepCenter - 0.12);
        const tailPower = Math.exp(-(tailDelta * tailDelta) / (2 * 0.018));
        amt[i] += sweepPower * 0.35 + tailPower * 0.1;
      }

      // Determine which face region is currently being scanned
      const totalRegionDuration = FaceMeshPainter.faceRegions.reduce((s, r) => s + r.duration, 0);
      const cycleT = this.scanT % totalRegionDuration;
      let regionElapsed = 0;
      for (const region of FaceMeshPainter.faceRegions) {
        if (cycleT < regionElapsed + region.duration) {
          regionProgress = (cycleT - regionElapsed) / region.duration;
          activeRegion = region;
          break;
        }
        regionElapsed += region.duration;
      }

      if (activeRegion) {
        const isMediaPipeData = points.length > 200;
        const regionIndices = isMediaPipeData ? activeRegion.mpIndices : activeRegion.fa68Indices;
        for (const idx of regionIndices) {
          if (idx < points.length) {
            const pulse = 0.5 + 0.5 * Math.sin(regionProgress * Math.PI * 3);
            amt[idx] = Math.min(1.5, amt[idx] + 0.3 + 0.15 * pulse);
            regionHighlight[idx] = 0.35 + 0.2 * pulse;
          }
        }
      }
    }

    const screen = {
      x: -12,
      y: -12,
      w: size.width + 24,
      h: size.height + 24,
    };
    const inScreen = (point) =>
      point.x >= screen.x &&
      point.y >= screen.y &&
      point.x <= screen.x + screen.w &&
      point.y <= screen.y + screen.h;

    const faceLandmarkerClass = mediapipeVision?.FaceLandmarker;
    const meshConnections = faceLandmarkerClass?.FACE_LANDMARKS_TESSELATION || [];
    const faceOval = faceLandmarkerClass?.FACE_LANDMARKS_FACE_OVAL || [];
    const lips = faceLandmarkerClass?.FACE_LANDMARKS_LIPS || [];
    const leftEye = faceLandmarkerClass?.FACE_LANDMARKS_LEFT_EYE || [];
    const rightEye = faceLandmarkerClass?.FACE_LANDMARKS_RIGHT_EYE || [];
    const hasMediaPipeMesh = meshConnections.length > 0;

    if (!this.dotsOnly) {
      const baseAlpha = this.fullBright ? 0.15 : 0.06;
      const drawConnections = (list, alphaBoost, strokeWidth) => {
        for (const conn of list) {
          if (!conn) continue;
          const aIndex = conn[0] ?? conn.start ?? conn.from;
          const bIndex = conn[1] ?? conn.end ?? conn.to;
          if (!Number.isInteger(aIndex) || !Number.isInteger(bIndex)) continue;
          if (aIndex >= points.length || bIndex >= points.length) continue;
          const a = mapped[aIndex];
          const b = mapped[bIndex];
          if (!inScreen(a) && !inScreen(b)) continue;
          const w = this._clamp((amt[aIndex] + amt[bIndex]) / 2, 0, 1.2);
          const alpha = this._clamp(baseAlpha + alphaBoost * w, 0, 1);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = this._rgba(accent, alpha);
          ctx.lineWidth = strokeWidth;
          ctx.stroke();
        }
      };

      drawConnections(meshConnections.filter((_, i) => i % 3 === 0), 0.22, 0.35);
      drawConnections(faceOval, 0.18, 0.5);
      drawConnections(lips, 0.15, 0.4);
      drawConnections(leftEye, 0.13, 0.38);
      drawConnections(rightEye, 0.13, 0.38);

      if (!hasMediaPipeMesh && points.length >= 68) {
        const drawLoop = (indices, alphaBoost, strokeWidth) => {
          for (let i = 0; i < indices.length - 1; i += 1) {
            const aIndex = indices[i];
            const bIndex = indices[i + 1];
            if (aIndex >= points.length || bIndex >= points.length) continue;
            const a = mapped[aIndex];
            const b = mapped[bIndex];
            const w = this._clamp((amt[aIndex] + amt[bIndex]) / 2, 0, 1.2);
            const alpha = this._clamp(0.05 + alphaBoost * w, 0, 1);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = this._rgba(accent, alpha);
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
          }
        };

        const closeLoop = (indices, alphaBoost, strokeWidth) => {
          drawLoop(indices, alphaBoost, strokeWidth);
          const first = indices[0];
          const last = indices[indices.length - 1];
          if (first < points.length && last < points.length) {
            const a = mapped[first];
            const b = mapped[last];
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = this._rgba(accent, 0.18);
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
            ctx.restore();
          }
        };

        closeLoop([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 0.42, 1.0);
        drawLoop([17, 18, 19, 20, 21], 0.34, 0.75);
        drawLoop([22, 23, 24, 25, 26], 0.34, 0.75);
        drawLoop([27, 28, 29, 30], 0.28, 0.7);
        drawLoop([31, 32, 33, 34, 35], 0.3, 0.65);
        closeLoop([36, 37, 38, 39, 40, 41], 0.36, 0.85);
        closeLoop([42, 43, 44, 45, 46, 47], 0.36, 0.85);
        closeLoop([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], 0.4, 0.95);
        closeLoop([60, 61, 62, 63, 64, 65, 66, 67], 0.32, 0.8);

        const centerX = center.x;
        const centerY = center.y;
        const centerSpokes = [30, 33, 36, 45, 48, 54, 57, 8];
        for (const idx of centerSpokes) {
          if (idx >= points.length) continue;
          const p = mapped[idx];
          const w = this._clamp(amt[idx], 0, 1.2);
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = this._rgba(accent, this._clamp(0.14 + 0.22 * w, 0, 1));
          ctx.lineWidth = 0.55 + 0.18 * w;
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    for (let k = 0; k < ringR.length; k += 1) {
      if (ringR[k] < band) continue;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = this._rgba(accent, this._clamp(0.06 * ringA[k], 0, 1));
      ctx.lineWidth = 0.6;
      ctx.shadowBlur = 0;
      ctx.arc(ringC[k].x, ringC[k].y, ringR[k], 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    const isMediaPipeDots = points.length > 200;
    const baseDotR = this._clamp(Math.min(size.width, size.height) / 620, 0.6, 0.9);
    for (let i = 0; i < points.length; i += 1) {
      if (isMediaPipeDots && i % 3 !== 0 && regionHighlight[i] === 0) continue;
      const point = mapped[i];
      if (!inScreen(point)) continue;
      const w = this._clamp(amt[i], 0, 1.2);
      const rh = regionHighlight[i];
      let color;
      if (rh > 0 && activeRegion) {
        const baseBlend = this._mixColor(dimColor, glowColor, this._clamp(w, 0, 1));
        color = this._mixColor(baseBlend, this._rgba(activeRegion.color, 0.6), this._clamp(rh, 0, 1));
      } else {
        color = this._mixColor(dimColor, glowColor, this._clamp(w, 0, 1));
        if (w > 0.6) {
          color = this._mixColor(color, peakColor, this._clamp((w - 0.6) / 0.6, 0, 1));
        }
      }

      const radius = baseDotR + w * 0.55;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw region scan UI: corner brackets, sweep line, label
    if (this.scanning && activeRegion) {
      const isMediaPipeData = points.length > 200;
      const regionIndices = isMediaPipeData ? activeRegion.mpIndices : activeRegion.fa68Indices;
      const regionPts = regionIndices
        .filter(idx => idx < mapped.length && inScreen(mapped[idx]))
        .map(idx => mapped[idx]);

      if (regionPts.length >= 2) {
        let rMinX = Infinity, rMaxX = -Infinity, rMinY = Infinity, rMaxY = -Infinity;
        for (const p of regionPts) {
          if (p.x < rMinX) rMinX = p.x;
          if (p.x > rMaxX) rMaxX = p.x;
          if (p.y < rMinY) rMinY = p.y;
          if (p.y > rMaxY) rMaxY = p.y;
        }

        const pad = 10;
        const rx = rMinX - pad;
        const ry = rMinY - pad;
        const rw = (rMaxX - rMinX) + pad * 2;
        const rh2 = (rMaxY - rMinY) + pad * 2;
        const regionColor = activeRegion.color;
        const blink = 0.5 + 0.5 * Math.sin(this.scanT * 1.8);
        const alpha = 0.26 + 0.16 * blink;
        const cornerLen = Math.min(rw * 0.22, rh2 * 0.22, 14);

        // Corner brackets
        ctx.strokeStyle = this._rgba(regionColor, alpha);
        ctx.lineWidth = 1.0;
        ctx.lineCap = "square";
        ctx.beginPath(); ctx.moveTo(rx, ry + cornerLen); ctx.lineTo(rx, ry); ctx.lineTo(rx + cornerLen, ry); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + rw - cornerLen, ry); ctx.lineTo(rx + rw, ry); ctx.lineTo(rx + rw, ry + cornerLen); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx, ry + rh2 - cornerLen); ctx.lineTo(rx, ry + rh2); ctx.lineTo(rx + cornerLen, ry + rh2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + rw - cornerLen, ry + rh2); ctx.lineTo(rx + rw, ry + rh2); ctx.lineTo(rx + rw, ry + rh2 - cornerLen); ctx.stroke();

        // Sweep line
        const scanY = ry + rh2 * regionProgress;
        ctx.strokeStyle = this._rgba(regionColor, alpha * 0.8);
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(rx, scanY); ctx.lineTo(rx + rw, scanY); ctx.stroke();

        // Region label
        const fontSize = Math.max(7, Math.min(8, size.width / 55));
        ctx.font = `${fontSize}px monospace`;
        ctx.textBaseline = "bottom";
        ctx.fillStyle = this._rgba(regionColor, alpha);
        const labelY = Math.max(fontSize + 2, ry - 2);
        ctx.fillText(activeRegion.name, rx, labelY);
      }
    }
  }
}

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
const overlayCanvasRef = ref(null);
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
const canSubmitCheckIn = computed(() => hasProfileReference.value && faceVerification.value.status === "matched");

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
let mediapipeVision = null;
let mediapipeFaceLandmarker = null;
let liveWarmupUntilMs = 0;
let mediapipeLastAtMs = 0;
let faceMeshOverlayRafId = null;
let latestFaceMeshResult = null;
let fallbackFaceMeshLastAtMs = 0;

const MEDIAPIPE_FRAME_INTERVAL_MS = 200;

const stopLiveRecognition = () => {
  if (liveRafId) {
    cancelAnimationFrame(liveRafId);
    liveRafId = null;
  }
  liveScanLastAt = 0;
  liveConsecutiveMatches = 0;
  liveScanInFlight = false;
  liveWarmupUntilMs = 0;
  mediapipeLastAtMs = 0;
  fallbackFaceMeshLastAtMs = 0;
};

const stopFaceMeshOverlay = () => {
  if (faceMeshOverlayRafId) {
    cancelAnimationFrame(faceMeshOverlayRafId);
    faceMeshOverlayRafId = null;
  }
  latestFaceMeshResult = null;
  fallbackFaceMeshLastAtMs = 0;
  clearOverlay();
};

const clearOverlay = () => {
  const overlay = overlayCanvasRef.value;
  if (!overlay) return;
  const ctx = overlay.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, overlay.width || 0, overlay.height || 0);
};

const stopCamera = () => {
  stopLiveRecognition();
  stopFaceMeshOverlay();
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
  clearOverlay();
  geoCoords.value = { latitude: null, longitude: null, accuracy: null };
};

const startCamera = async () => {
  if (cameraActive.value || isCameraLoading.value || !hasProfileReference.value) {
    return;
  }

  isCameraLoading.value = true;
  try {
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
    startFaceMeshOverlay();
    startLiveRecognition();
  } catch (error) {
    stopCamera();
    resetFaceVerification("error", error?.message || "Kamera/lokasi tidak bisa diakses. Izinkan kamera & lokasi lalu coba lagi.");
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

const loadMediapipeVision = async () => {
  if (mediapipeVision) return mediapipeVision;
  mediapipeVision = {
    FaceLandmarker,
    FilesetResolver,
  };
  return mediapipeVision;
};

const ensureMediapipeFaceLandmarker = async () => {
  if (mediapipeFaceLandmarker) return;

  const vision = await loadMediapipeVision();
  if (!vision?.FilesetResolver || !vision?.FaceLandmarker) {
    throw new Error("Gagal memuat MediaPipe Face Landmarker.");
  }

  const fileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_BASE_URL);
  mediapipeFaceLandmarker = await vision.FaceLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: MEDIAPIPE_FACE_LANDMARKER_MODEL_URL,
      // GPU can be flaky/slow on some mobile browsers; CPU is more consistent.
      delegate: "CPU",
    },
    runningMode: "VIDEO",
    numFaces: 1,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
  });
};

const ensureOverlaySize = (_video) => {
  const overlay = overlayCanvasRef.value;
  if (!overlay) return false;
  const ctx = overlay.getContext("2d");
  if (!ctx) return false;

  // IMPORTANT:
  // - Mobile browsers often render <video> with object-cover, so the displayed
  //   pixels differ from video.videoWidth/video.videoHeight.
  // - MediaPipe landmarks are normalized; DrawingUtils maps to canvas size.
  // Therefore: size canvas to the displayed box (CSS pixels), not intrinsic video size.
  const width = Math.round(overlay.clientWidth || 0);
  const height = Math.round(overlay.clientHeight || 0);
  if (!width || !height) return false;

  if (overlay.width !== width) overlay.width = width;
  if (overlay.height !== height) overlay.height = height;
  return true;
};

const convertFaceApiDetectionToMeshData = (detection, video) => {
  const rawPoints =
    detection?.landmarks?.positions ||
    detection?.landmarks?._positions ||
    detection?.landmarks ||
    [];
  const width = video?.videoWidth || 0;
  const height = video?.videoHeight || 0;
  if (!Array.isArray(rawPoints) || !rawPoints.length || !width || !height) {
    return null;
  }

  const points = rawPoints.map((point) => {
    const x = point?.x ?? point?._x ?? point?.[0] ?? 0;
    const y = point?.y ?? point?._y ?? point?.[1] ?? 0;
    return { x: x / width, y: y / height };
  });

  return {
    points,
    landmarks: { positions: points },
  };
};

const refreshFallbackFaceMeshFromFaceApi = async (faceapi, video, nowMs) => {
  if (nowMs - fallbackFaceMeshLastAtMs < 1200) {
    return false;
  }
  fallbackFaceMeshLastAtMs = nowMs;

  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
    .withFaceLandmarks();

  const meshData = convertFaceApiDetectionToMeshData(detection, video);
  if (meshData) {
    latestFaceMeshResult = meshData;
    return true;
  }
  return false;
};

const startFaceMeshOverlay = () => {
  if (faceMeshOverlayRafId) return;

  const loop = (timestampMs) => {
    faceMeshOverlayRafId = requestAnimationFrame(loop);

    const video = cameraVideoRef.value;
    const overlay = overlayCanvasRef.value;
    if (!video || !overlay || !cameraActive.value) {
      clearOverlay();
      return;
    }

    if (!ensureOverlaySize(video)) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    if (mediapipeFaceLandmarker) {
      const nowMs = typeof timestampMs === "number" ? timestampMs : performance.now();
      if (nowMs - mediapipeLastAtMs >= MEDIAPIPE_FRAME_INTERVAL_MS) {
        mediapipeLastAtMs = nowMs;
        try {
          latestFaceMeshResult = mediapipeFaceLandmarker.detectForVideo(video, nowMs);
        } catch (error) {
          // Keep fallback animation if MediaPipe fails on a frame.
          console.warn(error);
        }
      }
    }

    ctx.clearRect(0, 0, overlay.width, overlay.height);
    if (!latestFaceMeshResult) {
      // Keep a visible scan state even before the first face mesh result arrives.
      const t = (timestampMs || performance.now()) / 1000;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
      const w = overlay.width;
      const h = overlay.height;
      const cx = w / 2;
      const cy = h / 2;
      const ringR = Math.min(w, h) * (0.18 + 0.02 * pulse);
      ctx.save();
      ctx.strokeStyle = `rgba(56,189,248,${0.24 + 0.16 * pulse})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(56,189,248,0.36)";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, ringR * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(56,189,248,0.8)";
      ctx.beginPath();
      ctx.arc(cx, cy, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    const painter = new FaceMeshPainter({
      scanT: (timestampMs || performance.now()) / 1800,
      scanning: cameraActive.value && !hasCheckedInToday.value,
      progress: faceVerification.value.status === "matched"
        ? liveConsecutiveMatches / LIVE_MATCH_REQUIRED
        : 0.22,
      fullBright:
        faceVerification.value.status === "loading" ||
        faceVerification.value.status === "matched" ||
        isVerifyingFace.value,
      meshData: latestFaceMeshResult,
      mirrorHorizontal: false,
      accentColor: "#38bdf8",
      sourceAspect: video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : null,
      coverFit: true,
      dotsOnly: false,
    });
    painter.paint(ctx, { width: overlay.width, height: overlay.height });
  };

  faceMeshOverlayRafId = requestAnimationFrame(loop);
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
  liveFaceApiInstance = liveFaceApiInstance || (await loadFaceApi());
  try {
    await ensureMediapipeFaceLandmarker();
  } catch (error) {
    // Non-fatal: face match can still work without landmark overlay.
    console.warn(error);
  }

  let referenceDescriptor;
  try {
    referenceDescriptor = Float32Array.from(JSON.parse(storedReferenceDescriptor.value));
  } catch {
    resetFaceVerification("error", "Data referensi wajah tidak valid. Silakan enrol ulang wajah.");
    return;
  }

  resetFaceVerification("loading", "Arahkan wajah ke kamera. Sistem akan mencocokkan secara otomatis.");
  liveWarmupUntilMs = performance.now() + 5000;

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
      await refreshFallbackFaceMeshFromFaceApi(faceapi, video, nowMs);

      // Warmup window: show scanning for 5 seconds before matching.
      if (liveWarmupUntilMs && nowMs < liveWarmupUntilMs) {
        liveConsecutiveMatches = 0;
        const remaining = Math.max(0, Math.ceil((liveWarmupUntilMs - nowMs) / 1000));
        faceVerification.value = {
          status: "loading",
          distance: null,
          message: `Menyiapkan deteksi... ${remaining}s`,
        };
        return;
      }

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection?.descriptor) {
        // Keep overlay (if any) but reset status.
        liveConsecutiveMatches = 0;
        faceVerification.value = {
          status: "idle",
          distance: null,
          message: "Wajah belum terdeteksi. Pastikan wajah terlihat jelas dan cahaya cukup.",
        };
        return;
      }

      const faceMeshFallback = convertFaceApiDetectionToMeshData(detection, video);
      if (faceMeshFallback) {
        latestFaceMeshResult = faceMeshFallback;
      }

      const distance = faceapi.euclideanDistance(referenceDescriptor, detection.descriptor);
      const matched = distance <= FACE_MATCH_THRESHOLD;

      if (matched) {
        liveConsecutiveMatches += 1;
      } else {
        liveConsecutiveMatches = 0;
      }

      faceVerification.value = {
        status: matched ? "matched" : "mismatch",
        distance,
        message: matched
          ? `Wajah cocok. Menstabilkan deteksi (${liveConsecutiveMatches}/${LIVE_MATCH_REQUIRED})...`
          : "Wajah tidak cocok. Coba dekatkan wajah dan hadap kamera lurus.",
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
          message: "Wajah terverifikasi. Mengirim check-in...",
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
  profileStore.loadProfile().catch(() => { });
  loadAttendance();
});

onUnmounted(() => {
  clearInterval(timer);
  stopCamera();
  resetSelectedPreview();
  stopFaceMeshOverlay();
});
</script>

<style scoped>
</style>
