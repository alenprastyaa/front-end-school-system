<template>
  <div
    class="min-h-screen bg-slate-50/50 px-3 pb-12 pt-4 font-sans text-slate-900 md:px-8 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto max-w-[1440px] space-y-6">

      <section class="rounded-lg border border-slate-200 bg-white p-4 md:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Absensi</h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Lakukan check-in dan check-out harian, lalu pantau riwayat kehadiran Anda.
            </p>
          </div>
          <div class="text-left lg:text-right">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Waktu Sekarang</p>
            <p class="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white">{{ currentTime }}</p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ currentDate }}</p>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-2xl bg-sky-600 p-5 text-white">
          <p class="text-sm font-medium text-white/80">Status Hari Ini</p>
          <p class="mt-2 text-2xl font-bold">
            {{ hasCheckedOutToday ? "Sudah Check-out" : hasCheckedInToday ? "Sudah Check-in" : "Belum Check-in" }}
          </p>
          <p class="mt-2 text-xs text-white/70">
            {{ hasCheckedOutToday ? "Aktivitas hari ini sudah lengkap." : hasCheckedInToday ? "Tinggal lakukan check-out saat selesai." : "Silakan lakukan absensi masuk." }}
          </p>
          <span class="mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            :class="hasCheckedOutToday ? 'bg-white/20 text-white' : hasCheckedInToday ? 'bg-emerald-400/20 text-emerald-100' : 'bg-amber-300/20 text-amber-50'">
            {{ hasCheckedOutToday ? "Selesai" : hasCheckedInToday ? "Aktif" : "Siap Absen" }}
          </span>
        </div>
        <div class="rounded-2xl bg-emerald-600 p-5 text-white">
          <p class="text-sm font-medium text-white/80">Check-in Hari Ini</p>
          <p class="mt-2 text-2xl font-bold">{{ todayRecord?.clock_in ? formatTime(todayRecord.clock_in) : "-" }}</p>
          <p class="mt-2 text-xs text-white/70">Tercatat otomatis setelah check-in berhasil.</p>
        </div>
        <div class="rounded-2xl bg-slate-700 p-5 text-white">
          <p class="text-sm font-medium text-white/80">Check-out Hari Ini</p>
          <p class="mt-2 text-2xl font-bold">{{ todayRecord?.clock_out ? formatTime(todayRecord.clock_out) : "-" }}</p>
          <p class="mt-2 text-xs text-white/70">Masih kosong jika sesi belum diakhiri.</p>
        </div>
        <div class="rounded-2xl bg-violet-600 p-5 text-white">
          <p class="text-sm font-medium text-white/80">Total Riwayat</p>
          <p class="mt-2 text-2xl font-bold">{{ attendances.length }}</p>
          <p class="mt-2 text-xs text-white/70">Jumlah data kehadiran yang sudah tercatat.</p>
        </div>
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[340px,1fr]">
        <section class="rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>

          <h2 class="mt-5 text-lg font-semibold text-slate-900 dark:text-white">Panduan Absensi</h2>
          <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Gunakan foto selfie langsung dari kamera perangkat saat melakukan check-in agar data kehadiran tetap valid.
          </p>

          <div class="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p class="font-medium text-slate-900 dark:text-white">1. Check-in</p>
              <p class="mt-1">Ambil foto lalu kirim absensi masuk.</p>
            </div>
            <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p class="font-medium text-slate-900 dark:text-white">2. Check-out</p>
              <p class="mt-1">Akhiri sesi belajar setelah aktivitas selesai.</p>
            </div>
          </div>

        </section>

        <section class="rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Aksi Kehadiran</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{ !hasCheckedInToday ? "Ambil foto lalu kirim check-in." : "Check-in sudah tercatat. Lanjutkan dengan check-out saat selesai." }}
              </p>
            </div>
            <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
              :class="hasCheckedOutToday ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : hasCheckedInToday ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'">
              {{ hasCheckedOutToday ? "Selesai" : hasCheckedInToday ? "Aktif" : "Menunggu Check-in" }}
            </span>
          </div>

          <div v-if="!hasCheckedInToday" class="mt-6 space-y-5">
            <label class="group block cursor-pointer">
              <div
                class="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-sky-500 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-sky-500 dark:hover:bg-sky-500/5"
                :class="selectedFile ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/5' : ''">
                <input type="file" accept="image/*" capture="user" @change="handleFileChange" class="sr-only" />

                <div v-if="!selectedFile" class="flex flex-col items-center">
                  <div
                    class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                    <svg class="h-8 w-8 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24"
                      stroke-width="1.75" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                  </div>
                  <p class="text-base font-semibold text-slate-900 dark:text-white">Ambil Foto Check-in</p>
                  <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Ketuk area ini untuk membuka kamera selfie.</p>
                </div>

                <div v-else class="flex w-full flex-col items-center">
                  <div class="mb-4 h-40 w-40 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-500/20 dark:bg-slate-900">
                    <img v-if="selectedPreviewUrl" :src="selectedPreviewUrl" alt="Preview selfie"
                      class="h-full w-full object-cover" />
                    <div v-else
                      class="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-base font-semibold text-slate-900 dark:text-white">Foto Siap Dikirim</p>
                  <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Ketuk lagi jika ingin mengganti foto.</p>
                </div>
              </div>
            </label>

            <button @click="submitCheckIn" :disabled="isCheckingIn || !selectedFile"
              class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
              <svg v-if="isCheckingIn" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {{ isCheckingIn ? "Mengirim Check-in..." : "Kirim Check-in" }}
            </button>
          </div>

          <div v-else class="mt-6">
            <div class="rounded-2xl bg-slate-50 p-6 text-center dark:bg-slate-800/60">
              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 class="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Check-in Sudah Tercatat</h3>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {{ hasCheckedOutToday ? "Anda sudah menyelesaikan absensi hari ini." : "Silakan lakukan check-out ketika sesi belajar berakhir." }}
              </p>
            </div>

            <button @click="submitCheckOut" :disabled="isCheckingOut || hasCheckedOutToday"
              class="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
              <svg v-if="isCheckingOut" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {{ hasCheckedOutToday ? "Sesi Telah Berakhir" : isCheckingOut ? "Mengirim Check-out..." : "Akhiri Sesi (Check-out)" }}
            </button>
          </div>
        </section>
      </div>

      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-4 border-b border-slate-200 p-4 md:p-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Riwayat Kehadiran</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Catatan check-in dan check-out yang sudah tersimpan.</p>
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
                      Masuk {{ formatTime(item.clock_in) }} • Pulang {{ item.clock_out ? formatTime(item.clock_out) : "-" }}
                    </p>
                  </div>
                  <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
                    :class="{
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
                <th class="border-b border-slate-200 px-6 py-4 text-right font-semibold dark:border-slate-800">Bukti</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in sortedAttendances" :key="item.id || `${item.attendance_date}-${item.clock_in}`"
                class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">{{ formatDate(item.attendance_date) }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ formatTime(item.clock_in) }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.clock_out ? formatTime(item.clock_out) : "-" }}</td>
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
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";

// --- Live Clock Logic ---
const currentTime = ref("");
const currentDate = ref("");
let timer;

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
const tableSort = createSortState("attendance_date", "desc");

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

const sortedAttendances = computed(() => sortItems(attendances.value, tableSort));

const handleSort = (key) => toggleSort(tableSort, key);
const sortIndicator = (key) => tableSort.key !== key ? "↕" : tableSort.direction === "asc" ? "▲" : "▼";

const resetSelectedPreview = () => {
  if (selectedPreviewUrl.value) {
    URL.revokeObjectURL(selectedPreviewUrl.value);
    selectedPreviewUrl.value = "";
  }
};

const handleFileChange = (event) => {
  resetSelectedPreview();
  selectedFile.value = event.target.files?.[0] || null;
  if (selectedFile.value) {
    selectedPreviewUrl.value = URL.createObjectURL(selectedFile.value);
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
  if (!selectedFile.value) return;

  isCheckingIn.value = true;

  try {
    const formData = new FormData();
    formData.append("image", selectedFile.value);
    const response = await api.post("/attendance", formData);
    pushToast({
      title: "Check-in Berhasil",
      message: response?.message || "Check-in berhasil. Selamat beraktivitas!",
      type: "success",
    });
    selectedFile.value = null;
    resetSelectedPreview();

    // Reset file input UI hidden element
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";

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
  loadAttendance();
});

onUnmounted(() => {
  clearInterval(timer);
  resetSelectedPreview();
});
</script>
