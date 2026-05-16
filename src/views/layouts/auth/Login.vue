<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="flex items-center justify-center px-6 ">
      <form @submit.prevent="handleLogin"
        class="w-full max-w-md bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-8 space-y-6  mt-40">
        <div>
          <p class="text-sm uppercase tracking-wide text-gray-400">School System</p>
          <h1 class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">Login System </h1>
          <p class="mt-4">Login Untuk mengakses halaman LMS</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input v-model="form.username" type="text" required
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input v-model="form.password" type="password" required
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        </div>

        <div v-if="lockRemainingSeconds > 0"
          class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          Akun ini dikunci sementara. Coba lagi dalam {{ formattedLockRemaining }}.
        </div>

        <button type="submit" :disabled="isLoading || lockRemainingSeconds > 0"
          class="w-full px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60">
          {{ isLoading ? "Masuk..." : lockRemainingSeconds > 0 ? "Terkunci sementara" : "Masuk" }}
        </button>

        <!-- <p class="text-sm text-gray-500 dark:text-gray-400">
          Butuh bootstrap user awal?
          <router-link to="/auth/register" class="text-sky-600 underline">Buka form register</router-link>
        </p> -->
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Form registrasi siswa publik:
          <router-link to="/student-registration" class="text-sky-600 underline">Buka registrasi siswa</router-link>
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Halaman profil sistem:
          <router-link to="/" class="text-sky-600 underline">Buka landing page</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { api, cancelPendingApiRequests } from "@/api";
import { pushToast } from "@/composables/useToast";
import { clearSession, persistSession } from "@/utils/auth";
import { useProfileStore } from "@/store/profile";

const SHOW_PWA_INSTALL_AFTER_LOGIN_KEY = "show-pwa-install-after-login";
const LOGIN_LOCK_UNTIL_KEY = "login-lock-until";
const router = useRouter();
const profileStore = useProfileStore();
const isLoading = ref(false);
const lockRemainingSeconds = ref(0);
let lockCountdownTimer = null;
const form = reactive({
  username: "",
  password: "",
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

const stopLockCountdown = () => {
  if (lockCountdownTimer) {
    window.clearInterval(lockCountdownTimer);
    lockCountdownTimer = null;
  }
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
    clearSession();
    profileStore.resetProfileState();
    const response = await api.post("/auth/login", { ...form });
    persistSession(response);
    pushToast({
      title: "Login Berhasil",
      message: "Selamat datang, Anda berhasil masuk ke School System.",
      type: "success",
    });
    stopLockCountdown();
    lockRemainingSeconds.value = 0;
    persistLockUntil(null);
    sessionStorage.setItem(SHOW_PWA_INSTALL_AFTER_LOGIN_KEY, "1");
    router.push("/dashboard");
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
</script>
