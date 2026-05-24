<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="flex items-center justify-center px-6 ">
      <form @submit.prevent="handleSubmit"
        class="w-full max-w-md bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-8 space-y-6  mt-40">
        <div>
          <p class="text-sm uppercase tracking-wide text-gray-400">School System</p>
          <h1 class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">Login System</h1>
          <p class="mt-4">Login Untuk mengakses halaman LMS</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username / No HP</label>
          <input v-model="loginIdentifier" type="text" required
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Username login memakai password. Jika diisi nomor HP, sistem akan kirim OTP WhatsApp.
          </p>
        </div>

        <div v-if="loginMode === 'password'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input v-model="form.password" type="password" required
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        </div>

        <div v-else-if="otpSent">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode OTP</label>
          <input v-model="otpForm.otp" type="text" inputmode="numeric" maxlength="6" required
            class="mt-1 w-full px-3 py-2 rounded-md border text-center text-lg tracking-[0.35em] dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Kode berlaku 10 menit. Cek WhatsApp pada nomor yang
            dimasukkan.</p>
        </div>

        <div v-if="loginMode === 'password' && lockRemainingSeconds > 0"
          class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          Akun ini dikunci sementara. Coba lagi dalam {{ formattedLockRemaining }}.
        </div>

        <button type="submit" :disabled="submitDisabled"
          class="w-full px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60">
          {{ submitLabel }}
        </button>

        <button v-if="loginMode === 'otp' && otpSent" type="button" :disabled="isLoading || isParentLoading"
          @click="resetOtpFlow"
          class="w-full rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200">
          Ganti Nomor
        </button>

        <!-- <p class="text-sm text-gray-500 dark:text-gray-400">
          Butuh bootstrap user awal?
          <router-link to="/auth/register" class="text-sky-600 underline">Buka form register</router-link>
        </p> -->

        <p class="text-sm text-gray-500 dark:text-gray-400">
          Halaman profil sistem:
          <router-link to="/" class="text-sky-600 underline">Buka landing page</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { api, cancelPendingApiRequests } from "@/api";
import { pushToast } from "@/composables/useToast";
import { clearSession, persistSession } from "@/utils/auth";
import { useProfileStore } from "@/store/profile";
import { useRealtimeStore } from "@/store/realtime";

const SHOW_PWA_INSTALL_AFTER_LOGIN_KEY = "show-pwa-install-after-login";
const LOGIN_LOCK_UNTIL_KEY = "login-lock-until";
const profileStore = useProfileStore();
const realtimeStore = useRealtimeStore();
const isLoading = ref(false);
const isParentLoading = ref(false);
const loginIdentifier = ref("");
const otpSent = ref(false);
const lockRemainingSeconds = ref(0);
let lockCountdownTimer = null;
const form = reactive({
  password: "",
});
const otpForm = reactive({
  otp: "",
});

const isPhoneNumberLike = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return false;
  const compact = raw.replace(/[^\d+]/g, "");
  if (/^[0-9+\s().-]+$/.test(raw) && /^(0|62|\+62)/.test(compact)) {
    return true;
  }
  return /^08\d{7,14}$/.test(raw.replace(/\s+/g, ""));
};

const loginMode = computed(() => (isPhoneNumberLike(loginIdentifier.value) ? "otp" : "password"));
const submitLabel = computed(() => {
  if (loginMode.value === "password") {
    if (isLoading.value) return "Masuk...";
    if (lockRemainingSeconds.value > 0) return "Terkunci sementara";
    return "Masuk";
  }
  if (isParentLoading.value) return otpSent.value ? "Memproses..." : "Mengirim...";
  return otpSent.value ? "Verifikasi OTP" : "Kirim OTP WhatsApp";
});
const submitDisabled = computed(() => {
  if (loginMode.value === "password") {
    return isLoading.value || lockRemainingSeconds.value > 0;
  }
  return isParentLoading.value;
});

const formattedLockRemaining = computed(() => {
  const seconds = Math.max(0, lockRemainingSeconds.value);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes <= 0) {
    return `${remainingSeconds} detik`;
  }

  if (remainingSeconds <= 0) {
    return `${minutes} menit`;
  }

  return `${minutes} menit ${remainingSeconds} detik`;
});

const formatRetryAt = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};

const stopLockCountdown = () => {
  if (lockCountdownTimer) {
    window.clearInterval(lockCountdownTimer);
    lockCountdownTimer = null;
  }
};

const resetOtpFlow = () => {
  otpSent.value = false;
  otpForm.otp = "";
};

const finishLogin = (response, message = "Selamat datang, Anda berhasil masuk ke School System.") => {
  persistSession(response);
  pushToast({
    title: "Login Berhasil",
    message,
    type: "success",
  });
  stopLockCountdown();
  lockRemainingSeconds.value = 0;
  persistLockUntil(null);
  sessionStorage.setItem(SHOW_PWA_INSTALL_AFTER_LOGIN_KEY, "1");
  window.location.assign("/dashboard");
};

const persistLockUntil = (lockedUntilIso) => {
  if (lockedUntilIso) {
    sessionStorage.setItem(LOGIN_LOCK_UNTIL_KEY, lockedUntilIso);
    return;
  }
  sessionStorage.removeItem(LOGIN_LOCK_UNTIL_KEY);
};

const getSecondsUntil = (lockedUntilIso) => {
  const lockedUntil = new Date(lockedUntilIso);
  if (Number.isNaN(lockedUntil.getTime())) {
    return 0;
  }

  return Math.max(0, Math.ceil((lockedUntil.getTime() - Date.now()) / 1000));
};

const startLockCountdown = (seconds = 60, lockedUntilIso = null) => {
  stopLockCountdown();
  const nextSeconds = lockedUntilIso ? getSecondsUntil(lockedUntilIso) : Math.max(0, Number(seconds) || 0);
  lockRemainingSeconds.value = nextSeconds;
  if (lockRemainingSeconds.value <= 0) {
    persistLockUntil(null);
    return;
  }

  if (lockedUntilIso) {
    persistLockUntil(lockedUntilIso);
  } else {
    persistLockUntil(new Date(Date.now() + lockRemainingSeconds.value * 1000).toISOString());
  }

  lockCountdownTimer = window.setInterval(() => {
    if (lockRemainingSeconds.value <= 1) {
      lockRemainingSeconds.value = 0;
      stopLockCountdown();
      persistLockUntil(null);
      return;
    }
    lockRemainingSeconds.value -= 1;
  }, 1000);
};

const restoreLockCountdown = () => {
  const lockedUntilIso = sessionStorage.getItem(LOGIN_LOCK_UNTIL_KEY);
  if (!lockedUntilIso) {
    lockRemainingSeconds.value = 0;
    return;
  }

  const seconds = getSecondsUntil(lockedUntilIso);
  if (seconds <= 0) {
    persistLockUntil(null);
    lockRemainingSeconds.value = 0;
    return;
  }

  startLockCountdown(seconds, lockedUntilIso);
};

onMounted(() => {
  restoreLockCountdown();
});

onBeforeUnmount(() => {
  stopLockCountdown();
});

const handleLogin = async () => {
  if (lockRemainingSeconds.value > 0) {
    pushToast({
      title: "Akun Terkunci",
      message: `Coba lagi dalam ${formattedLockRemaining.value}.`,
      type: "warning",
    });
    return;
  }

  isLoading.value = true;

  try {
    cancelPendingApiRequests();
    realtimeStore.disconnect();
    clearSession();
    profileStore.resetProfileState();
    const response = await api.post("/auth/login", {
      username: loginIdentifier.value.trim(),
      password: form.password,
    });
    finishLogin(response);
  } catch (error) {
    const status = Number(error?.status || 0);
    const message = String(error?.message || "");
    const lockedUntilIso = error?.payload?.data?.locked_until || error?.payload?.locked_until || null;
    if (status === 403 && /terkunci/i.test(message)) {
      startLockCountdown(60, lockedUntilIso);
      pushToast({
        title: "Akun Terkunci",
        message: `${message} Silakan coba lagi setelah ${formattedLockRemaining.value}.`,
        type: "warning",
      });
      return;
    }

    pushToast({
      title: "Login Gagal",
      message: message.includes("Sisa percobaan") ? message : error.message,
      type: status === 401 && message.includes("Sisa percobaan") ? "warning" : "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const handleOtpSubmit = async () => {
  isParentLoading.value = true;

  try {
    cancelPendingApiRequests();
    const phoneNumber = loginIdentifier.value.trim();
    if (!otpSent.value) {
      const response = await api.post("/auth/parent/request-otp", { phone_number: phoneNumber });
      otpSent.value = true;
      pushToast({
        title: "OTP Dikirim",
        message: response?.message || "Kode OTP telah dikirim ke WhatsApp orang tua.",
        type: "success",
      });
      return;
    }

    realtimeStore.disconnect();
    clearSession();
    profileStore.resetProfileState();
    const response = await api.post("/auth/parent/verify-otp", {
      phone_number: phoneNumber,
      otp: otpForm.otp,
    });
    finishLogin(response, "Login orang tua berhasil.");
  } catch (error) {
    const status = Number(error?.status || 0);
    const nextSendAt = error?.payload?.data?.next_send_at
      || error?.payload?.next_send_at
      || error?.data?.next_send_at
      || error?.payload?.nextSendAt
      || error?.data?.nextSendAt
      || "";
    const retryAtLabel = formatRetryAt(nextSendAt);
    const retryMessage = status === 429 && retryAtLabel
      ? `Coba lagi setelah ${retryAtLabel}.`
      : error.message || "Proses login orang tua gagal.";
    pushToast({
      title: otpSent.value ? "Verifikasi OTP Gagal" : "Gagal Mengirim OTP",
      message: retryMessage,
      type: "error",
    });
  } finally {
    isParentLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (loginMode.value === "otp") {
    await handleOtpSubmit();
    return;
  }
  await handleLogin();
};

watch(loginIdentifier, () => {
  otpSent.value = false;
  otpForm.otp = "";
  form.password = "";
});
</script>
