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

onMounted(loadSummary);
</script>
