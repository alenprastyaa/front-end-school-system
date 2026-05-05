<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto mt-8 max-w-[1400px] space-y-6">
      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Setting Admin</h1>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Reset data dilakukan per modul dan hanya berlaku untuk sekolah admin yang sedang login. Setiap aksi wajib
          dikonfirmasi dengan mengetik <span class="font-bold text-slate-900 dark:text-white">RESET</span>.
        </p>
      </section>

      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Link Pendaftaran Siswa</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Generate link khusus sekolah ini. Siswa tidak
              perlu pilih sekolah manual.</p>
          </div>
          <button @click="generateRegistrationLink" :disabled="isGeneratingLink"
            class="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50">
            {{ isGeneratingLink ? "Membuat..." : "Generate Link" }}
          </button>
        </div>
        <div class="mt-4 flex flex-col gap-3 md:flex-row">
          <input :value="registrationLink" type="text" readonly
            class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
          <button @click="copyRegistrationLink" :disabled="!registrationLink"
            class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white">
            Copy Link
          </button>
        </div>
      </section>

      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Load Test Server</h2>
            <p class="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
              Jalankan burst request serentak ke endpoint admin summary untuk menguji kemampuan server dan database menerima hit bersamaan.
            </p>
          </div>
          <div class="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-end">
            <label class="block md:min-w-[220px]">
              <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Jumlah Hit Serentak</span>
              <input v-model.number="loadTestForm.hitCount" type="number" min="1" max="2000"
                class="mt-2 block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </label>
            <button @click="runLoadTest" :disabled="isRunningLoadTest"
              class="rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-500 disabled:opacity-50">
              {{ isRunningLoadTest ? "Menjalankan..." : "Jalankan Load Test" }}
            </button>
          </div>
        </div>

        <div v-if="loadTestResult" class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Hit</p>
            <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">{{ loadTestResult.hit_count }}</p>
          </article>
          <article class="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Sukses</p>
            <p class="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">{{ loadTestResult.success_count }}</p>
          </article>
          <article class="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:ring-rose-500/20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">Gagal</p>
            <p class="mt-2 text-2xl font-black text-rose-700 dark:text-rose-300">{{ loadTestResult.failure_count }}</p>
          </article>
          <article class="rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:ring-sky-500/20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">Total Waktu</p>
            <p class="mt-2 text-2xl font-black text-sky-700 dark:text-sky-300">{{ loadTestResult.total_elapsed_ms }} ms</p>
          </article>
          <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Rata-rata</p>
            <p class="mt-2 text-xl font-black text-slate-900 dark:text-white">{{ loadTestResult.average_duration_ms }} ms</p>
          </article>
          <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">P95</p>
            <p class="mt-2 text-xl font-black text-slate-900 dark:text-white">{{ loadTestResult.p95_duration_ms }} ms</p>
          </article>
          <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Maksimum</p>
            <p class="mt-2 text-xl font-black text-slate-900 dark:text-white">{{ loadTestResult.max_duration_ms }} ms</p>
          </article>
          <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Target</p>
            <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ loadTestResult.target }}</p>
          </article>
        </div>

        <div v-if="loadTestResult?.error_samples?.length" class="mt-4 rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:ring-rose-500/20">
          <p class="text-sm font-bold text-rose-700 dark:text-rose-300">Contoh Error</p>
          <ul class="mt-2 space-y-1 text-sm text-rose-600 dark:text-rose-200">
            <li v-for="(item, index) in loadTestResult.error_samples" :key="`load-test-error-${index}`">{{ item }}</li>
          </ul>
        </div>
      </section>

      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Load Test Login</h2>
            <p class="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
              Uji login serentak ke endpoint autentikasi. Gunakan akun uji yang memang disiapkan untuk pengujian beban.
            </p>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <label class="block">
              <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Username</span>
              <input v-model="loginLoadTestForm.username" type="text"
                class="mt-2 block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </label>
            <label class="block">
              <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Password</span>
              <input v-model="loginLoadTestForm.password" type="password"
                class="mt-2 block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </label>
            <label class="block">
              <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Jumlah Hit</span>
              <input v-model.number="loginLoadTestForm.hitCount" type="number" min="1" max="2000"
                class="mt-2 block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </label>
          </div>
          <div class="flex justify-end">
            <button @click="runLoginLoadTest" :disabled="isRunningLoginLoadTest"
              class="rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-500 disabled:opacity-50">
              {{ isRunningLoginLoadTest ? "Menjalankan..." : "Jalankan Load Test Login" }}
            </button>
          </div>
        </div>

        <div v-if="loginLoadTestResult" class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Hit</p>
            <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">{{ loginLoadTestResult.hit_count }}</p>
          </article>
          <article class="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Login Sukses</p>
            <p class="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">{{ loginLoadTestResult.success_count }}</p>
          </article>
          <article class="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:ring-rose-500/20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">Login Gagal</p>
            <p class="mt-2 text-2xl font-black text-rose-700 dark:text-rose-300">{{ loginLoadTestResult.failure_count }}</p>
          </article>
          <article class="rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:ring-sky-500/20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">Total Waktu</p>
            <p class="mt-2 text-2xl font-black text-sky-700 dark:text-sky-300">{{ loginLoadTestResult.total_elapsed_ms }} ms</p>
          </article>
          <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Rata-rata</p>
            <p class="mt-2 text-xl font-black text-slate-900 dark:text-white">{{ loginLoadTestResult.average_duration_ms }} ms</p>
          </article>
          <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">P95</p>
            <p class="mt-2 text-xl font-black text-slate-900 dark:text-white">{{ loginLoadTestResult.p95_duration_ms }} ms</p>
          </article>
          <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Maksimum</p>
            <p class="mt-2 text-xl font-black text-slate-900 dark:text-white">{{ loginLoadTestResult.max_duration_ms }} ms</p>
          </article>
          <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Target</p>
            <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ loginLoadTestResult.target }}</p>
          </article>
        </div>

        <div v-if="loginLoadTestResult?.error_samples?.length" class="mt-4 rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:ring-rose-500/20">
          <p class="text-sm font-bold text-rose-700 dark:text-rose-300">Contoh Error Login</p>
          <ul class="mt-2 space-y-1 text-sm text-rose-600 dark:text-rose-200">
            <li v-for="(item, index) in loginLoadTestResult.error_samples" :key="`login-load-test-error-${index}`">{{ item }}</li>
          </ul>
        </div>
      </section>

      <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="message" class="flex items-center gap-3 rounded-2xl p-4 text-sm font-medium ring-1 ring-inset"
          :class="isError ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'">
          <svg v-if="isError" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ message }}
        </div>
      </Transition>

      <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Reset Per Modul</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Pilih modul yang ingin dibersihkan tanpa harus
                menghapus semuanya sekaligus.</p>
            </div>
            <button @click="loadSummary"
              class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              Refresh Data
            </button>
          </div>
        </div>

        <div class="p-6">
          <div v-if="isLoading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div v-for="item in 6" :key="item" class="h-48 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800">
            </div>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="item in settingsItems" :key="item.key"
              class="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/30">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Modul</p>
                  <h3 class="mt-2 text-lg font-black tracking-tight text-slate-900 dark:text-white">{{ item.label }}
                  </h3>
                </div>
                <div
                  class="rounded-2xl bg-white px-3 py-2 text-right ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Jumlah</p>
                  <p class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{{ item.count }}</p>
                </div>
              </div>

              <p class="mt-4 min-h-[72px] text-sm leading-6 text-slate-500 dark:text-slate-400">
                {{ item.description }}
              </p>

              <div class="mt-5 space-y-3">
                <label class="block">
                  <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Ketik RESET</span>
                  <input v-model="confirmInputs[item.key]" type="text" placeholder="RESET"
                    class="mt-2 block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-rose-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700" />
                </label>
                <button @click="resetScope(item)" :disabled="isResetting[item.key]"
                  class="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-500 disabled:opacity-50">
                  {{ isResetting[item.key] ? "Mereset..." : `Reset ${item.label}` }}
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";

const settingsItems = ref([]);
const isLoading = ref(false);
const message = ref("");
const isError = ref(false);
const confirmInputs = reactive({});
const isResetting = reactive({});
const registrationLink = ref("");
const isGeneratingLink = ref(false);
const isRunningLoadTest = ref(false);
const loadTestResult = ref(null);
const isRunningLoginLoadTest = ref(false);
const loginLoadTestResult = ref(null);
const loadTestForm = reactive({
  hitCount: 1000,
});
const loginLoadTestForm = reactive({
  username: "",
  password: "",
  hitCount: 1000,
});

const loadSummary = async () => {
  isLoading.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.get("/admin-settings/summary");
    settingsItems.value = response?.data?.items || [];
    settingsItems.value.forEach((item) => {
      if (!(item.key in confirmInputs)) {
        confirmInputs[item.key] = "";
      }
      if (!(item.key in isResetting)) {
        isResetting[item.key] = false;
      }
    });
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Gagal Memuat Setting Admin",
      message: error.message,
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const resetScope = async (item) => {
  const confirmText = String(confirmInputs[item.key] || "").trim().toUpperCase();
  if (confirmText !== "RESET") {
    isError.value = true;
    message.value = `Ketik RESET terlebih dahulu untuk modul ${item.label}.`;
    pushToast({
      title: "Konfirmasi Belum Valid",
      message: `Ketik RESET untuk melanjutkan reset ${item.label}.`,
      type: "error",
    });
    return;
  }

  isResetting[item.key] = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post("/admin-settings/reset", {
      scope: item.key,
      confirm_text: confirmInputs[item.key],
    });
    message.value = response?.message || `Reset ${item.label} berhasil.`;
    confirmInputs[item.key] = "";
    pushToast({
      title: "Reset Berhasil",
      message: `${item.label} berhasil dibersihkan.`,
      type: "success",
    });
    await loadSummary();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Reset Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isResetting[item.key] = false;
  }
};

const generateRegistrationLink = async () => {
  isGeneratingLink.value = true;
  try {
    const response = await api.get("/admin-settings/public-registration-link");
    const path = response?.data?.path || "";
    registrationLink.value = `${window.location.origin}${path}`;
    pushToast({
      title: "Link Berhasil Dibuat",
      message: "Link pendaftaran siswa siap dibagikan.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Generate Link",
      message: error.message,
      type: "error",
    });
  } finally {
    isGeneratingLink.value = false;
  }
};

const copyRegistrationLink = async () => {
  if (!registrationLink.value) return;
  try {
    await navigator.clipboard.writeText(registrationLink.value);
    pushToast({
      title: "Link Tersalin",
      message: "Link pendaftaran siswa sudah disalin.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Menyalin Link",
      message: "Silakan salin manual dari kolom link.",
      type: "error",
    });
  }
};

const runLoadTest = async () => {
  isRunningLoadTest.value = true;
  try {
    const response = await api.post("/admin-settings/load-test", {
      hit_count: Number(loadTestForm.hitCount) || 0,
    });
    loadTestResult.value = response?.data || null;
    pushToast({
      title: "Load Test Selesai",
      message: `${response?.data?.success_count || 0} request sukses, ${response?.data?.failure_count || 0} gagal.`,
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Load Test Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isRunningLoadTest.value = false;
  }
};

const runLoginLoadTest = async () => {
  isRunningLoginLoadTest.value = true;
  try {
    const response = await api.post("/admin-settings/load-test-login", {
      username: loginLoadTestForm.username,
      password: loginLoadTestForm.password,
      hit_count: Number(loginLoadTestForm.hitCount) || 0,
    });
    loginLoadTestResult.value = response?.data || null;
    pushToast({
      title: "Load Test Login Selesai",
      message: `${response?.data?.success_count || 0} login sukses, ${response?.data?.failure_count || 0} gagal.`,
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Load Test Login Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isRunningLoginLoadTest.value = false;
  }
};

onMounted(loadSummary);
</script>
