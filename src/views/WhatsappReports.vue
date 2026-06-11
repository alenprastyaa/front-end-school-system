<template>
  <div class="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-5">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Admin · Laporan WhatsApp</p>
          <h1 class="mt-2 text-2xl font-bold tracking-tight text-slate-950">Kelola Laporan WhatsApp Orang Tua</h1>
          <p class="mt-1 text-sm text-slate-500">Atur jadwal otomatis, lihat template PDF, kirim tes, atau broadcast laporan bulanan.</p>
        </div>
        <button @click="loadPage" :disabled="isLoading"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
          <Icon icon="mdi:refresh" class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
          Refresh
        </button>
      </header>

      <section class="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-base font-semibold text-slate-950">Jadwal Otomatis</h2>
              <p class="mt-1 text-sm text-slate-500">Sistem mengecek jadwal setiap menit memakai zona waktu WIB.</p>
            </div>
            <label class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
              <input v-model="settings.enabled" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-emerald-600" />
              Aktif
            </label>
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Pola Kirim</label>
              <select v-model="settings.schedule_type"
                class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500">
                <option value="MONTHLY_DATE">Setiap tanggal tertentu</option>
                <option value="WEEKLY_DAY">Setiap hari tertentu</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Jam Kirim</label>
              <input v-model="settings.send_time" type="time"
                class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500" />
            </div>
            <div v-if="settings.schedule_type === 'MONTHLY_DATE'">
              <label class="mb-1 block text-sm font-medium text-slate-700">Tanggal</label>
              <input v-model.number="settings.day_of_month" type="number" min="1" max="31"
                class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500" />
            </div>
            <div v-else>
              <label class="mb-1 block text-sm font-medium text-slate-700">Hari</label>
              <select v-model.number="settings.day_of_week"
                class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500">
                <option v-for="day in weekDays" :key="day.value" :value="day.value">{{ day.label }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Kelas</label>
              <select v-model="settings.class_id"
                class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500">
                <option value="">Semua kelas</option>
                <option v-for="item in classOptions" :key="item.id" :value="String(item.id)">
                  {{ item.class_name || item.name || `Kelas ${item.id}` }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span>{{ scheduleDescription }}</span>
              <span v-if="settings.last_sent_at" class="font-medium text-slate-700">Terakhir kirim: {{ settings.last_sent_at }}</span>
            </div>
          </div>

          <div class="mt-5 flex justify-end">
            <button @click="saveSettings" :disabled="isSavingSettings"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
              {{ isSavingSettings ? "Menyimpan..." : "Simpan Jadwal" }}
            </button>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-base font-semibold text-slate-950">Test & Template PDF</h2>
          <p class="mt-1 text-sm text-slate-500">Kalau belum ada siswa sesuai filter, sistem memakai data dummy untuk preview dan kirim tes.</p>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Bulan Laporan</label>
              <input v-model="reportMonth" type="month"
                class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Nomor WhatsApp Tes</label>
              <input v-model="testPhone" type="tel" placeholder="Contoh: 081234567890"
                class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <button @click="openTemplatePDF" :disabled="isOpeningTemplate"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
              <Icon icon="mdi:file-pdf-box" class="h-5 w-5 text-rose-600" />
              {{ isOpeningTemplate ? "Membuka..." : "Lihat Template PDF" }}
            </button>
            <button @click="sendTest" :disabled="isSendingTest"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50">
              <Icon icon="mdi:whatsapp" class="h-5 w-5" />
              {{ isSendingTest ? "Mengirim..." : "Kirim Tes" }}
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-950">Broadcast Manual</h2>
            <p class="mt-1 text-sm text-slate-500">{{ manualTargetDescription }}</p>
          </div>
          <button @click="sendBroadcast" :disabled="isSendingBroadcast"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
            <Icon icon="mdi:send" class="h-5 w-5" />
            {{ isSendingBroadcast ? "Mengirim..." : broadcastButtonText }}
          </button>
        </div>

        <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-sm font-semibold text-slate-950">Target Penerima</p>
          <div class="mt-3 grid gap-2 sm:grid-cols-3">
            <button v-for="mode in targetModes" :key="mode.value" type="button" @click="setTargetMode(mode.value)"
              class="flex min-h-16 items-center gap-3 rounded-lg border px-3 py-3 text-left transition"
              :class="targetMode === mode.value ? 'border-emerald-500 bg-white text-emerald-700 ring-1 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'">
              <Icon :icon="mode.icon" class="h-5 w-5 shrink-0" />
              <span>
                <span class="block text-sm font-bold">{{ mode.label }}</span>
                <span class="block text-xs text-slate-500">{{ mode.caption }}</span>
              </span>
            </button>
          </div>

          <div v-if="targetMode !== 'ALL'" class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Pilih Kelas</label>
              <select v-model="targetClassId" @change="handleTargetClassChange"
                class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500">
                <option value="">Pilih kelas</option>
                <option v-for="item in classOptions" :key="item.id" :value="String(item.id)">
                  {{ item.class_name || item.name || `Kelas ${item.id}` }}
                </option>
              </select>
            </div>
            <div v-if="targetMode === 'STUDENT'">
              <label class="mb-1 block text-sm font-medium text-slate-700">Pilih Siswa</label>
              <select v-model="targetStudentId"
                class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500">
                <option value="">Pilih siswa</option>
                <option v-for="item in studentOptions" :key="item.id" :value="String(item.id)">
                  {{ item.full_name || item.username }}{{ item.class_name ? ` - ${item.class_name}` : "" }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="message" class="mt-4 rounded-lg px-4 py-3 text-sm font-medium"
          :class="isError ? 'border border-rose-200 bg-rose-50 text-rose-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'">
          {{ message }}
        </div>

        <div v-if="summary" class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-lg bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Siswa</p>
            <p class="mt-2 text-2xl font-bold text-slate-950">{{ summary.total_students || 0 }}</p>
          </div>
          <div class="rounded-lg bg-emerald-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Berhasil</p>
            <p class="mt-2 text-2xl font-bold text-emerald-700">{{ summary.success_count || 0 }}</p>
          </div>
          <div class="rounded-lg bg-rose-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-rose-600">Gagal</p>
            <p class="mt-2 text-2xl font-bold text-rose-700">{{ summary.failed_count || 0 }}</p>
          </div>
        </div>

        <div v-if="summary?.results?.length" class="mt-5 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="px-4 py-3 font-medium">Siswa</th>
                <th class="px-4 py-3 font-medium">Kelas</th>
                <th class="px-4 py-3 font-medium">WhatsApp</th>
                <th class="px-4 py-3 font-medium">Status</th>
                <th class="px-4 py-3 font-medium">PDF</th>
                <th class="px-4 py-3 font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in summary.results" :key="`${item.student_id}-${item.target || 'wa'}`">
                <td class="px-4 py-3 font-medium text-slate-950">{{ item.student_name || "-" }}</td>
                <td class="px-4 py-3 text-slate-600">{{ item.class_name || "-" }}</td>
                <td class="px-4 py-3 text-slate-600">{{ item.target || "-" }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
                    :class="item.success ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                    {{ item.success ? "Berhasil" : "Gagal" }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <a v-if="item.pdf_url" :href="item.pdf_url" target="_blank" rel="noopener"
                    class="font-semibold text-sky-600 hover:text-sky-500">Buka PDF</a>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="px-4 py-3 text-slate-600">{{ item.error || (item.is_dummy ? "Data dummy" : "-") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <teleport to="body">
      <div v-if="scheduleModal.open" class="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="flex items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              :class="scheduleModal.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
              <Icon :icon="scheduleModal.type === 'success' ? 'mdi:check' : 'mdi:alert-circle'" class="h-6 w-6" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-lg font-bold text-slate-950">{{ scheduleModal.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ scheduleModal.message }}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button type="button" @click="scheduleModal.open = false"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";

const weekDays = [
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
  { value: 7, label: "Minggu" },
];

const targetModes = [
  { value: "ALL", label: "Semua siswa", caption: "Kirim ke seluruh orang tua", icon: "mdi:account-group" },
  { value: "CLASS", label: "Per kelas", caption: "Kirim ke satu kelas", icon: "mdi:google-classroom" },
  { value: "STUDENT", label: "Siswa tertentu", caption: "Kirim ke satu orang tua", icon: "mdi:account-school" },
];

const classOptions = ref([]);
const studentOptions = ref([]);
const reportMonth = ref(new Date().toISOString().slice(0, 7));
const targetMode = ref("ALL");
const targetClassId = ref("");
const targetStudentId = ref("");
const testPhone = ref("");
const message = ref("");
const isError = ref(false);
const summary = ref(null);
const isLoading = ref(false);
const isSavingSettings = ref(false);
const isOpeningTemplate = ref(false);
const isSendingTest = ref(false);
const isSendingBroadcast = ref(false);
const scheduleModal = reactive({
  open: false,
  type: "success",
  title: "",
  message: "",
});

const settings = reactive({
  enabled: false,
  schedule_type: "MONTHLY_DATE",
  send_time: "08:00",
  day_of_week: 1,
  day_of_month: 1,
  class_id: "",
  last_sent_at: "",
});

const selectedClassName = computed(() => {
  if (!settings.class_id) return "semua kelas";
  const found = classOptions.value.find((item) => String(item.id) === String(settings.class_id));
  return found?.class_name || found?.name || `Kelas ${settings.class_id}`;
});

const selectedTargetClassName = computed(() => {
  if (!targetClassId.value) return "semua kelas";
  const found = classOptions.value.find((item) => String(item.id) === String(targetClassId.value));
  return found?.class_name || found?.name || `Kelas ${targetClassId.value}`;
});

const selectedTargetStudentName = computed(() => {
  if (!targetStudentId.value) return "";
  const found = studentOptions.value.find((item) => String(item.id) === String(targetStudentId.value));
  return found ? (found.full_name || found.username || `Siswa ${targetStudentId.value}`) : `Siswa ${targetStudentId.value}`;
});

const manualTargetDescription = computed(() => {
  if (targetMode.value === "STUDENT" && targetStudentId.value) {
    return `Kirim laporan bulan terpilih hanya ke orang tua ${selectedTargetStudentName.value}.`;
  }
  if (targetMode.value === "STUDENT") {
    return "Pilih satu siswa untuk mengirim laporan hanya ke orang tua siswa tersebut.";
  }
  if (targetMode.value === "CLASS" && targetClassId.value) {
    return `Kirim laporan bulan terpilih ke semua orang tua siswa ${selectedTargetClassName.value}.`;
  }
  if (targetMode.value === "CLASS") {
    return "Pilih satu kelas untuk mengirim laporan ke orang tua siswa dalam kelas tersebut.";
  }
  return "Kirim laporan bulan terpilih ke semua orang tua siswa.";
});

const broadcastButtonText = computed(() => {
  if (targetMode.value === "STUDENT") return "Kirim ke Siswa Ini";
  if (targetMode.value === "CLASS") return "Kirim ke Kelas Ini";
  return "Kirim Broadcast";
});

const scheduleDescription = computed(() => {
  const time = settings.send_time || "08:00";
  if (!settings.enabled) return "Jadwal otomatis nonaktif.";
  if (settings.schedule_type === "WEEKLY_DAY") {
    const day = weekDays.find((item) => item.value === Number(settings.day_of_week))?.label || "Senin";
    return `Akan terkirim setiap ${day} pukul ${time} untuk ${selectedClassName.value}.`;
  }
  return `Akan terkirim setiap tanggal ${settings.day_of_month || 1} pukul ${time} untuk ${selectedClassName.value}.`;
});

const reportPayload = () => {
  const payload = {};
  if (reportMonth.value) payload.month = reportMonth.value;
  if (targetMode.value === "CLASS" && targetClassId.value) {
    payload.class_id = Number(targetClassId.value);
  }
  if (targetMode.value === "STUDENT" && targetStudentId.value) {
    if (targetClassId.value) payload.class_id = Number(targetClassId.value);
    payload.student_id = Number(targetStudentId.value);
  }
  return payload;
};

const setMessage = (text, error = false) => {
  message.value = text || "";
  isError.value = error;
};

const showScheduleModal = (type, title, modalMessage) => {
  scheduleModal.type = type;
  scheduleModal.title = title;
  scheduleModal.message = modalMessage;
  scheduleModal.open = true;
};

const loadClasses = async () => {
  const response = await api.get("/class");
  classOptions.value = Array.isArray(response?.data) ? response.data : [];
};

const loadStudents = async () => {
  const params = new URLSearchParams({ page: "1", limit: "1000" });
  if (targetClassId.value) {
    params.set("class_id", targetClassId.value);
  }
  const response = await api.get(`/student?${params.toString()}`);
  studentOptions.value = Array.isArray(response?.data?.data) ? response.data.data : [];
  if (targetStudentId.value && !studentOptions.value.some((item) => String(item.id) === String(targetStudentId.value))) {
    targetStudentId.value = "";
  }
};

const handleTargetClassChange = () => {
  targetStudentId.value = "";
  loadStudents().catch((error) => {
    setMessage(error.message || "Gagal memuat siswa target.", true);
  });
};

const setTargetMode = (mode) => {
  targetMode.value = mode;
  if (mode === "ALL") {
    targetClassId.value = "";
    targetStudentId.value = "";
    loadStudents().catch(() => undefined);
  } else if (mode === "CLASS") {
    targetStudentId.value = "";
  }
  setMessage("");
};

const validateManualTarget = () => {
  if (targetMode.value === "CLASS" && !targetClassId.value) {
    setMessage("Pilih kelas target terlebih dahulu.", true);
    return false;
  }
  if (targetMode.value === "STUDENT" && !targetStudentId.value) {
    setMessage("Pilih siswa target terlebih dahulu.", true);
    return false;
  }
  return true;
};

const loadSettings = async () => {
  const response = await api.get("/attendance/report/parent-whatsapp/settings");
  const data = response?.data || {};
  settings.enabled = Boolean(data.enabled);
  settings.schedule_type = data.schedule_type || "MONTHLY_DATE";
  settings.send_time = data.send_time || "08:00";
  settings.day_of_week = Number(data.day_of_week || 1);
  settings.day_of_month = Number(data.day_of_month || 1);
  settings.class_id = data.class_id ? String(data.class_id) : "";
  settings.last_sent_at = data.last_sent_at || "";
};

const loadPage = async () => {
  isLoading.value = true;
  setMessage("");
  try {
    await Promise.all([loadClasses(), loadSettings(), loadStudents()]);
  } catch (error) {
    setMessage(error.message || "Gagal memuat halaman laporan WhatsApp.", true);
  } finally {
    isLoading.value = false;
  }
};

const saveSettings = async () => {
  isSavingSettings.value = true;
  setMessage("");
  try {
    const response = await api.put("/attendance/report/parent-whatsapp/settings", {
      enabled: settings.enabled,
      schedule_type: settings.schedule_type,
      send_time: settings.send_time,
      day_of_week: Number(settings.day_of_week || 1),
      day_of_month: Number(settings.day_of_month || 1),
      class_id: settings.class_id ? Number(settings.class_id) : null,
    });
    await loadSettings();
    const successMessage = response?.message || "Setting jadwal berhasil disimpan.";
    setMessage(successMessage);
    showScheduleModal("success", "Jadwal Tersimpan", successMessage);
  } catch (error) {
    const errorMessage = error.message || "Gagal menyimpan setting jadwal.";
    setMessage(errorMessage, true);
    showScheduleModal("error", "Gagal Menyimpan Jadwal", errorMessage);
  } finally {
    isSavingSettings.value = false;
  }
};

const openTemplatePDF = async () => {
  if (!validateManualTarget()) return;
  isOpeningTemplate.value = true;
  setMessage("");
  const previewWindow = window.open("", "_blank", "noopener");
  try {
    const params = new URLSearchParams();
    Object.entries(reportPayload()).forEach(([key, value]) => params.set(key, String(value)));
    const token = localStorage.getItem("token");
    const response = await fetch(`${api.baseUrl}/attendance/report/parent-whatsapp/template?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      let errorMessage = `Gagal membuka template PDF (${response.status}).`;
      try {
        const payload = await response.json();
        errorMessage = payload?.message || errorMessage;
      } catch (error) {
        // keep fallback
      }
      throw new Error(errorMessage);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    if (previewWindow) previewWindow.location.href = url;
    else window.open(url, "_blank", "noopener");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    if (previewWindow) previewWindow.close();
    setMessage(error.message || "Gagal membuka template PDF.", true);
  } finally {
    isOpeningTemplate.value = false;
  }
};

const sendTest = async () => {
  if (!validateManualTarget()) return;
  isSendingTest.value = true;
  summary.value = null;
  setMessage("");
  try {
    const response = await api.post("/attendance/report/parent-whatsapp/test", {
      ...reportPayload(),
      phone_number: testPhone.value,
    });
    summary.value = response?.data
      ? {
        total_students: 1,
        success_count: 1,
        failed_count: 0,
        results: [{
          student_id: response.data.student_id,
          student_name: response.data.student_name,
          class_name: response.data.class_name,
          target: response.data.target,
          success: true,
          pdf_url: response.data.pdf_url,
          is_dummy: response.data.is_dummy,
        }],
      }
      : null;
    setMessage(response?.message || "Tes laporan WhatsApp berhasil dikirim.");
  } catch (error) {
    setMessage(error.message || "Gagal mengirim tes laporan WhatsApp.", true);
  } finally {
    isSendingTest.value = false;
  }
};

const sendBroadcast = async () => {
  if (!validateManualTarget()) return;
  isSendingBroadcast.value = true;
  summary.value = null;
  setMessage("");
  try {
    const response = await api.post("/attendance/report/parent-whatsapp", reportPayload());
    summary.value = response?.data || null;
    setMessage(response?.message || "Broadcast laporan WhatsApp selesai diproses.");
  } catch (error) {
    setMessage(error.message || "Gagal mengirim broadcast laporan WhatsApp.", true);
  } finally {
    isSendingBroadcast.value = false;
  }
};

onMounted(loadPage);
</script>
