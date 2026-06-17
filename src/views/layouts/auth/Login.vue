<template>
  <div class="login-page font-lexend">
    <!-- ===== Opening / intro animation ===== -->
    <transition name="intro">
      <div v-if="introActive" class="intro-overlay">
        <div class="intro-content">
          <div class="intro-stage">
            <div class="cube">
              <div class="cube-face cube-front"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2 8l10 5 10-5-10-5Z" fill="currentColor" /><path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" /></svg></div>
              <div class="cube-face cube-back"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2 8l10 5 10-5-10-5Z" fill="currentColor" /><path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" /></svg></div>
              <div class="cube-face cube-right"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2 8l10 5 10-5-10-5Z" fill="currentColor" /><path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" /></svg></div>
              <div class="cube-face cube-left"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2 8l10 5 10-5-10-5Z" fill="currentColor" /><path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" /></svg></div>
              <div class="cube-face cube-top"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2 8l10 5 10-5-10-5Z" fill="currentColor" /><path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" /></svg></div>
              <div class="cube-face cube-bottom"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2 8l10 5 10-5-10-5Z" fill="currentColor" /><path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none" /></svg></div>
            </div>
            <div class="cube-shadow"></div>
          </div>
          <p class="intro-title">School System</p>
          <p class="intro-subtitle">Menyiapkan ruang belajar Anda…</p>
          <div class="intro-bar"><span></span></div>
        </div>
      </div>
    </transition>

    <!-- ===== Success splash → dashboard ===== -->
    <transition name="success">
      <div v-if="showSuccessSplash" class="success-overlay">
        <div class="success-decor" aria-hidden="true">
          <span class="success-glow"></span>
          <span v-for="n in 14" :key="n" class="confetti" :style="confettiStyle(n)"></span>
        </div>
        <div class="success-content">
          <svg class="success-check" viewBox="0 0 96 96">
            <circle class="sc-ring-bg" cx="48" cy="48" r="42" />
            <circle class="sc-ring" cx="48" cy="48" r="42" />
            <path class="sc-tick" d="M30 49 l12 12 l24 -26" />
          </svg>
          <h2 class="success-title">{{ successName }}</h2>
          <p class="success-subtitle">Menyiapkan dashboard Anda…</p>
          <div class="success-bar"><span></span></div>
        </div>
      </div>
    </transition>

    <!-- ===== Animated background ===== -->
    <div class="bg-decor" aria-hidden="true">
      <span class="blob blob-1"></span>
      <span class="blob blob-2"></span>
      <span class="blob blob-3"></span>
      <span class="grid-mask"></span>

      <!-- floating 3D shapes -->
      <div class="scene-3d">
        <div class="shape mini-cube mini-cube-1">
          <span class="mc-face mc-front"></span><span class="mc-face mc-back"></span>
          <span class="mc-face mc-right"></span><span class="mc-face mc-left"></span>
          <span class="mc-face mc-top"></span><span class="mc-face mc-bottom"></span>
        </div>
        <div class="shape mini-cube mini-cube-2">
          <span class="mc-face mc-front"></span><span class="mc-face mc-back"></span>
          <span class="mc-face mc-right"></span><span class="mc-face mc-left"></span>
          <span class="mc-face mc-top"></span><span class="mc-face mc-bottom"></span>
        </div>
        <div class="shape ring-3d ring-3d-1"></div>
        <div class="shape ring-3d ring-3d-2"></div>
        <div class="shape pyramid"></div>
      </div>
    </div>

    <div class="login-layout">
      <!-- ===== Branding panel ===== -->
      <section class="brand-panel" @mousemove="handleBrandMove" @mouseleave="resetBrand">
        <div class="brand-inner">
          <div class="brand-top">
            <div class="brand-badge reveal" style="--d: 0.05s">
              <svg viewBox="0 0 24 24" fill="none" class="h-6 w-6">
                <path d="M12 3 2 8l10 5 10-5-10-5Z" fill="currentColor" />
                <path d="M5 11.5V16c0 1.5 3.1 3 7 3s7-1.5 7-3v-4.5" stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" fill="none" />
              </svg>
              <span>School System</span>
            </div>

            <h2 class="brand-title reveal" style="--d: 0.15s">
              Satu portal untuk seluruh
              <span class="brand-highlight">perjalanan belajar.</span>
            </h2>
            <p class="brand-desc reveal" style="--d: 0.25s">
              Akses materi, kehadiran, nilai, dan komunikasi sekolah dalam satu tempat yang
              cepat, aman, dan menyenangkan setiap hari.
            </p>
          </div>

          <!-- ===== Hero: 3D character + floating feature chips ===== -->
          <div class="brand-hero">
            <div class="hero-3d">
            <div class="hero-chip chip-a" style="--d: 0.45s; --fd: 0s">
              <span class="chip-ico">
                <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4">
                  <path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.2V5.5Z" stroke="currentColor" stroke-width="1.6"
                    stroke-linejoin="round" />
                  <path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.2V5.5Z" stroke="currentColor" stroke-width="1.6"
                    stroke-linejoin="round" />
                </svg>
              </span>
              <span class="chip-text"><b>Materi terorganisir</b><small>Modul &amp; tugas rapi</small></span>
            </div>

            <div class="hero-chip chip-b" style="--d: 0.55s; --fd: 0.6s">
              <span class="chip-ico chip-ico-emerald">
                <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4">
                  <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" stroke-width="1.6" />
                  <path d="M3.5 9h17M8 3.5v3m8-3v3M8.5 14l2.2 2.2L15.5 12" stroke="currentColor" stroke-width="1.6"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span class="chip-text"><b>Kehadiran real-time</b><small>Pantau tiap hari</small></span>
            </div>

            <div class="hero-chip chip-c" style="--d: 0.65s; --fd: 1.1s">
              <span class="chip-ico chip-ico-amber">
                <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4">
                  <path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Z" stroke="currentColor"
                    stroke-width="1.6" stroke-linejoin="round" />
                  <path d="m9.2 12 2 2 3.6-3.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </span>
              <span class="chip-text"><b>Login aman</b><small>Siswa &amp; orang tua</small></span>
            </div>

            <!-- ===== 3D school-kid character ===== -->
            <div class="hero-stage" :class="characterMoodClass" aria-hidden="true">
              <img src="/image.png" alt="" class="login-character-image" :style="characterImageStyle" />
            </div>
            </div>
          </div>

          <div class="brand-glow" aria-hidden="true"></div>
        </div>
      </section>

      <!-- ===== Form panel ===== -->
      <section class="form-panel">
        <div class="card-3d-wrap">
        <form @submit.prevent="handleSubmit" class="login-card">
          <div class="card-head reveal card-layer" style="--d: 0.1s; --z: 40px">
            <span class="card-eyebrow">School System</span>
            <h1 class="card-title">Selamat Datang Kembali 👋</h1>
            <p class="card-subtitle">Masuk untuk mengakses halaman LMS Anda.</p>
          </div>

          <div class="field reveal" style="--d: 0.2s">
            <label class="field-label">Username / No HP</label>
            <div class="field-control" :class="{ 'is-filled': loginIdentifier }">
              <svg class="field-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.6" />
                <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" />
              </svg>
              <input v-model="loginIdentifier" type="text" required placeholder="username" class="field-input" />
              <span class="field-mode" :class="loginMode">
                {{ loginMode === 'otp' ? 'OTP WhatsApp' : 'Password' }}
              </span>
            </div>
            <p class="field-hint">
              Username login memakai password. Jika diisi nomor HP, sistem akan kirim OTP WhatsApp.
            </p>
          </div>

          <transition name="slide-fade">
            <div v-if="loginMode === 'password'" class="field reveal" style="--d: 0.3s">
              <label class="field-label">Password</label>
              <div class="field-control" :class="{ 'is-filled': form.password }">
                <svg class="field-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" stroke-width="1.6" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                </svg>
                <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                  placeholder="Masukkan password" class="field-input has-toggle" />
                <button type="button" class="field-toggle" @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'">
                  <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor"
                      stroke-width="1.6" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                    <path
                      d="m3 3 18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.2A10.3 10.3 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.4 4M6.1 6.1A17 17 0 0 0 2 12s3.6 7 10 7c1 0 2-.1 2.9-.4"
                      stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </transition>

          <transition name="slide-fade">
            <div v-if="loginMode === 'otp' && otpSent" class="field reveal">
              <label class="field-label">Kode OTP</label>
              <input v-model="otpForm.otp" type="text" inputmode="numeric" maxlength="6" required placeholder="••••••"
                class="otp-input" />
              <p class="field-hint">Kode berlaku 10 menit. Cek WhatsApp pada nomor yang dimasukkan.</p>
            </div>
          </transition>

          <transition name="slide-fade">
            <div v-if="loginMode === 'password' && lockRemainingSeconds > 0" class="lock-alert">
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5 shrink-0">
                <path d="M12 9v4m0 4h.01M10.3 3.9 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>Akun ini dikunci sementara. Coba lagi dalam {{ formattedLockRemaining }}.</span>
            </div>
          </transition>

          <button type="submit" :disabled="submitDisabled" class="submit-btn reveal card-layer" style="--d: 0.4s; --z: 55px">
            <span class="submit-spinner" v-if="isLoading || isParentLoading"></span>
            <span>{{ submitLabel }}</span>
            <svg v-if="!(isLoading || isParentLoading)" viewBox="0 0 24 24" fill="none" class="submit-arrow">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

          <button v-if="loginMode === 'otp' && otpSent" type="button" :disabled="isLoading || isParentLoading"
            @click="resetOtpFlow" class="ghost-btn">
            Ganti Nomor
          </button>

          <p class="card-foot reveal" style="--d: 0.5s">
            Halaman profil sistem:
            <router-link to="/" class="card-link">Buka landing page</router-link>
          </p>
        </form>
        </div>
      </section>
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
const showPassword = ref(false);
const introActive = ref(true);
const mood = ref("idle"); // "idle" | "happy" | "sad" — drives the 3D character
const showSuccessSplash = ref(false);
const successName = ref("Login Berhasil");
let introTimer = null;
let lockCountdownTimer = null;
let moodResetTimer = null;
let redirectTimer = null;

const confettiStyle = (n) => {
  const colors = ["#38bdf8", "#22d3ee", "#60a5fa", "#fbbf24", "#34d399", "#ffffff"];
  const left = (n * 67) % 100;
  const delay = ((n * 137) % 700) / 1000;
  const duration = 1.6 + (((n * 53) % 90) / 100);
  const size = 6 + ((n * 31) % 7);
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size + 4}px`,
    background: colors[n % colors.length],
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
};

const flashSad = () => {
  if (showSuccessSplash.value) return;
  mood.value = "sad";
  if (moodResetTimer) window.clearTimeout(moodResetTimer);
  moodResetTimer = window.setTimeout(() => {
    if (mood.value === "sad") mood.value = "idle";
  }, 2600);
};
const form = reactive({
  password: "",
});
const otpForm = reactive({
  otp: "",
});

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(pointer: coarse)").matches;
const characterImageStyle = computed(() => ({
  transform: `translate3d(${bp.x * 12}px, ${bp.y * 10}px, 0) rotateY(${bp.x * 7}deg) rotateX(${-bp.y * 5}deg)`,
  transition: bp.active ? "transform 0.12s ease-out" : "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
}));
const characterMoodClass = computed(() => ({
  "is-happy": mood.value === "happy",
  "is-sad": mood.value === "sad",
}));

// ===== Playable brand scene: the 3D character follows the cursor (bp is passed as props) =====
const bp = reactive({ x: 0, y: 0, active: false });
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const handleBrandMove = (event) => {
  if (prefersReducedMotion || isCoarsePointer) return;
  const rect = event.currentTarget.getBoundingClientRect();
  bp.x = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
  bp.y = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
  bp.active = true;
};

const resetBrand = () => {
  bp.x = 0;
  bp.y = 0;
  bp.active = false;
};

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
  stopLockCountdown();
  lockRemainingSeconds.value = 0;
  persistLockUntil(null);
  sessionStorage.setItem(SHOW_PWA_INSTALL_AFTER_LOGIN_KEY, "1");

  // 1) character smiles & celebrates
  if (moodResetTimer) window.clearTimeout(moodResetTimer);
  mood.value = "happy";

  const displayName =
    response?.data?.user?.name ||
    response?.data?.name ||
    response?.user?.name ||
    "";
  successName.value = displayName ? `Halo, ${String(displayName).split(" ")[0]}!` : "Login Berhasil";

  pushToast({ title: "Login Berhasil", message, type: "success" });

  // 2) let the smile show briefly, then reveal the elegant splash
  redirectTimer = window.setTimeout(() => {
    showSuccessSplash.value = true;
    // 3) hand off to the dashboard after the splash animation
    redirectTimer = window.setTimeout(() => {
      window.location.assign("/dashboard");
    }, 1900);
  }, 650);
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
  introTimer = window.setTimeout(() => {
    introActive.value = false;
  }, 1900);
});

onBeforeUnmount(() => {
  stopLockCountdown();
  if (introTimer) {
    window.clearTimeout(introTimer);
    introTimer = null;
  }
  if (moodResetTimer) {
    window.clearTimeout(moodResetTimer);
    moodResetTimer = null;
  }
  if (redirectTimer) {
    window.clearTimeout(redirectTimer);
    redirectTimer = null;
  }
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
    flashSad();
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
    flashSad();
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

<style scoped>
/* ===================== Layout ===================== */
.login-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(1200px 600px at 110% -10%, #dbeafe 0%, transparent 55%),
    radial-gradient(900px 500px at -10% 110%, #cffafe 0%, transparent 55%),
    #f6f7fb;
}

:global(.dark) .login-page {
  background:
    radial-gradient(1200px 600px at 110% -10%, rgba(37, 99, 235, 0.18) 0%, transparent 55%),
    radial-gradient(900px 500px at -10% 110%, rgba(8, 145, 178, 0.16) 0%, transparent 55%),
    #0b1020;
}

.login-layout {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  min-height: 100dvh;
}

@media (min-width: 1024px) {
  .login-layout {
    grid-template-columns: 1.05fr 1fr;
  }
}

/* ===================== Animated background ===================== */
.bg-decor {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(60px);
  opacity: 0.55;
  will-change: transform;
}

.blob-1 {
  width: 460px;
  height: 460px;
  top: -120px;
  left: -100px;
  background: radial-gradient(circle at 30% 30%, #60a5fa, #2563eb);
  animation: float-a 16s ease-in-out infinite;
}

.blob-2 {
  width: 380px;
  height: 380px;
  bottom: -120px;
  right: -80px;
  background: radial-gradient(circle at 30% 30%, #67e8f9, #0891b2);
  animation: float-b 19s ease-in-out infinite;
}

.blob-3 {
  width: 300px;
  height: 300px;
  top: 45%;
  left: 50%;
  background: radial-gradient(circle at 30% 30%, #7dd3fc, #0891b2);
  opacity: 0.35;
  animation: float-c 22s ease-in-out infinite;
}

.grid-mask {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(37, 99, 235, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(37, 99, 235, 0.06) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, #000 40%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, #000 40%, transparent 75%);
}

@keyframes float-a {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(40px, 30px) scale(1.08);
  }
}

@keyframes float-b {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-30px, -40px) scale(1.12);
  }
}

@keyframes float-c {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-42%, -58%) scale(1.1);
  }
}

/* ===================== Floating 3D shapes ===================== */
.scene-3d {
  position: absolute;
  inset: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.shape {
  position: absolute;
  opacity: 0.5;
  will-change: transform;
}

/* small wireframe-ish glass cubes */
.mini-cube {
  width: 64px;
  height: 64px;
  transform-style: preserve-3d;
}

.mini-cube-1 {
  top: 16%;
  left: 12%;
  animation: spin3d-a 18s linear infinite;
}

.mini-cube-2 {
  bottom: 14%;
  right: 16%;
  width: 90px;
  height: 90px;
  opacity: 0.38;
  animation: spin3d-b 24s linear infinite;
}

.mc-face {
  position: absolute;
  inset: 0;
  border: 1.5px solid rgba(37, 99, 235, 0.35);
  background: rgba(37, 99, 235, 0.06);
  border-radius: 8px;
}

.mini-cube-1 .mc-front { transform: translateZ(32px); }
.mini-cube-1 .mc-back { transform: rotateY(180deg) translateZ(32px); }
.mini-cube-1 .mc-right { transform: rotateY(90deg) translateZ(32px); }
.mini-cube-1 .mc-left { transform: rotateY(-90deg) translateZ(32px); }
.mini-cube-1 .mc-top { transform: rotateX(90deg) translateZ(32px); }
.mini-cube-1 .mc-bottom { transform: rotateX(-90deg) translateZ(32px); }

.mini-cube-2 .mc-front { transform: translateZ(45px); }
.mini-cube-2 .mc-back { transform: rotateY(180deg) translateZ(45px); }
.mini-cube-2 .mc-right { transform: rotateY(90deg) translateZ(45px); }
.mini-cube-2 .mc-left { transform: rotateY(-90deg) translateZ(45px); }
.mini-cube-2 .mc-top { transform: rotateX(90deg) translateZ(45px); }
.mini-cube-2 .mc-bottom { transform: rotateX(-90deg) translateZ(45px); }

:global(.dark) .mc-face {
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(56, 189, 248, 0.05);
}

@keyframes spin3d-a {
  from { transform: rotateX(0) rotateY(0); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}

@keyframes spin3d-b {
  from { transform: rotateX(20deg) rotateY(0) rotateZ(0); }
  to { transform: rotateX(20deg) rotateY(-360deg) rotateZ(180deg); }
}

/* tilted glowing rings */
.ring-3d {
  border-radius: 9999px;
  border: 2px solid rgba(8, 145, 178, 0.3);
  box-shadow: 0 0 22px rgba(8, 145, 178, 0.18);
}

.ring-3d-1 {
  width: 150px;
  height: 150px;
  top: 22%;
  right: 10%;
  animation: ring-spin-a 16s linear infinite;
}

.ring-3d-2 {
  width: 110px;
  height: 110px;
  bottom: 20%;
  left: 8%;
  border-color: rgba(37, 99, 235, 0.28);
  animation: ring-spin-b 20s linear infinite;
}

@keyframes ring-spin-a {
  from { transform: rotateX(70deg) rotateZ(0); }
  to { transform: rotateX(70deg) rotateZ(360deg); }
}

@keyframes ring-spin-b {
  from { transform: rotateX(60deg) rotateY(20deg) rotateZ(0); }
  to { transform: rotateX(60deg) rotateY(20deg) rotateZ(-360deg); }
}

/* floating pyramid (CSS triangle that drifts in 3D) */
.pyramid {
  top: 60%;
  left: 46%;
  width: 0;
  height: 0;
  border-left: 26px solid transparent;
  border-right: 26px solid transparent;
  border-bottom: 44px solid rgba(96, 165, 250, 0.28);
  filter: drop-shadow(0 6px 10px rgba(37, 99, 235, 0.2));
  animation: pyramid-float 14s ease-in-out infinite;
}

@keyframes pyramid-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0); }
  33% { transform: translate3d(20px, -26px, 0) rotate(120deg); }
  66% { transform: translate3d(-16px, 16px, 0) rotate(240deg); }
}

@media (max-width: 640px) {
  .scene-3d { display: none; }
}

/* ===================== Branding panel ===================== */
.brand-panel {
  position: relative;
  display: none;
  padding: 4rem;
  color: #fff;
  overflow: hidden;
  background:
    linear-gradient(135deg, #2563eb 0%, #0891b2 50%, #1d4ed8 100%);
}

@media (min-width: 1024px) {
  .brand-panel {
    display: flex;
    align-items: stretch;
  }
}

.brand-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18), transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.12), transparent 35%);
  animation: shimmer 8s ease-in-out infinite alternate;
}

@keyframes shimmer {
  from {
    opacity: 0.6;
    transform: scale(1);
  }

  to {
    opacity: 1;
    transform: scale(1.05);
  }
}

.brand-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-block: 2.5rem;
}

.brand-top {
  max-width: 460px;
}

.brand-glow {
  position: absolute;
  width: 320px;
  height: 320px;
  right: -120px;
  bottom: -120px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.35), transparent 60%);
  filter: blur(20px);
  animation: pulse-glow 6s ease-in-out infinite;
}

@keyframes pulse-glow {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.25);
    opacity: 0.85;
  }
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.brand-title {
  margin-top: 1.5rem;
  font-size: clamp(2rem, 3vw, 2.9rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.brand-highlight {
  display: inline-block;
  background: linear-gradient(90deg, #ffffff, #bae6fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.brand-desc {
  margin-top: 1.25rem;
  font-size: 1.02rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);
}

.brand-features {
  margin-top: 2rem;
  display: grid;
  gap: 0.9rem;
}

.brand-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.98rem;
  color: rgba(255, 255, 255, 0.92);
}

.feature-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 9999px;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
  animation: dot-pulse 2.4s ease-in-out infinite;
}

.brand-features li:nth-child(2) .feature-dot {
  animation-delay: 0.4s;
}

.brand-features li:nth-child(3) .feature-dot {
  animation-delay: 0.8s;
}

@keyframes dot-pulse {

  0%,
  100% {
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
  }

  50% {
    box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.05);
  }
}

/* ===================== Hero (character + floating chips) ===================== */
.brand-hero {
  position: relative;
  flex: 1 1 auto;
  min-height: 30rem;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* wide stage; chips float at the corners over the transparent canvas */
.hero-3d {
  position: relative;
  width: 100%;
  max-width: 34rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* the real WebGL character lives here (big, centred) */
.hero-stage {
  position: relative;
  width: 30rem;
  max-width: 100%;
  height: 30rem;
  margin: 0 auto;
  display: grid;
  place-items: center;
  perspective: 900px;
}

/* soft glow halo behind the character */
.hero-stage::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 52%;
  width: 78%;
  height: 70%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(125, 211, 252, 0.45), rgba(8, 145, 178, 0.12) 45%, transparent 70%);
  filter: blur(10px);
  z-index: 0;
  animation: halo-pulse 6s ease-in-out infinite;
}

.login-character-image {
  position: relative;
  z-index: 1;
  width: min(92%, 28rem);
  height: min(92%, 28rem);
  object-fit: contain;
  object-position: center bottom;
  filter: drop-shadow(0 34px 36px rgba(2, 12, 40, 0.26));
  transform-style: preserve-3d;
  animation: character-image-float 4.8s ease-in-out infinite;
  will-change: transform;
}

.hero-stage::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 9%;
  width: 54%;
  height: 9%;
  transform: translateX(-50%);
  border-radius: 999px;
  background: radial-gradient(ellipse, rgba(15, 23, 42, 0.22), transparent 70%);
  filter: blur(8px);
  animation: character-image-shadow 4.8s ease-in-out infinite;
}

.hero-stage.is-happy .login-character-image {
  animation: character-image-celebrate 0.85s ease-in-out, character-image-float 4.8s ease-in-out 0.85s infinite;
}

.hero-stage.is-sad .login-character-image {
  animation: character-image-shake 0.45s ease-in-out, character-image-float 4.8s ease-in-out 0.45s infinite;
}

@keyframes halo-pulse {
  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
}

@keyframes character-image-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -12px; }
}

@keyframes character-image-shadow {
  0%, 100% { opacity: 0.55; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.32; transform: translateX(-50%) scale(0.78); }
}

@keyframes character-image-celebrate {
  0%, 100% { translate: 0 0; scale: 1; }
  35% { translate: 0 -18px; scale: 1.04; }
  65% { translate: 0 3px; scale: 0.99; }
}

@keyframes character-image-shake {
  0%, 100% { translate: 0 0; }
  25% { translate: -7px 0; }
  50% { translate: 7px 0; }
  75% { translate: -4px 0; }
}

/* ---------- floating glass feature chips (each at its own depth) ---------- */
.hero-chip {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 10.5rem;
  padding: 0.45rem 0.7rem 0.45rem 0.45rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.32);
  box-shadow: 0 16px 34px -16px rgba(2, 12, 40, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  opacity: 0;
  animation: chip-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards, chip-float 5s ease-in-out infinite;
  animation-delay: var(--d, 0s), var(--fd, 0s);
}

.chip-ico {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  flex-shrink: 0;
  border-radius: 0.6rem;
  color: #fff;
  background: linear-gradient(135deg, #38bdf8, #2563eb);
}

.chip-ico-emerald { background: linear-gradient(135deg, #34d399, #0d9488); }
.chip-ico-amber { background: linear-gradient(135deg, #fbbf24, #f59e0b); }

.chip-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.chip-text b {
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
}

.chip-text small {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.75);
}

.chip-a { top: 3%; left: -11%; transform: translateZ(60px); }
.chip-b { top: 44%; right: -13%; transform: translateZ(85px); }
.chip-c { bottom: 5%; left: -7%; transform: translateZ(45px); }

@keyframes chip-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* float uses the independent `translate` property so it stacks with translateZ depth */
@keyframes chip-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
}

/* keep composition from clipping on short / narrow viewports */
@media (max-height: 880px) {
  .brand-hero { min-height: 24rem; }
  .hero-stage { width: 24rem; height: 24rem; }
}

@media (max-height: 720px) {
  .brand-hero { display: none; }
}

.char-float {
  transform-box: fill-box;
  transform-origin: center;
  animation: char-bob 4s ease-in-out infinite;
}

@keyframes char-bob {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
}

.char-shadow {
  transform-box: fill-box;
  transform-origin: center;
  animation: char-shadow 4s ease-in-out infinite;
}

@keyframes char-shadow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(0.78); opacity: 0.3; }
}

.char-ring {
  transform-box: fill-box;
  transform-origin: center;
  animation: char-ring 4s ease-in-out infinite;
}

@keyframes char-ring {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.04); }
}

.char-arm-wave {
  transform-box: fill-box;
  transform-origin: 12% 86%;
  animation: char-wave 1.8s ease-in-out infinite;
}

@keyframes char-wave {
  0%, 100% { transform: rotate(6deg); }
  50% { transform: rotate(-20deg); }
}

.char-tassel {
  transform-box: fill-box;
  transform-origin: top left;
  animation: char-tassel 3s ease-in-out infinite;
}

@keyframes char-tassel {
  0%, 100% { transform: rotate(7deg); }
  50% { transform: rotate(-7deg); }
}

/* ===================== Form panel ===================== */
.form-panel {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
}

.card-3d-wrap {
  position: relative;
  z-index: 4;
  width: 100%;
  max-width: 26rem;
  animation: card-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.login-card {
  position: relative;
  z-index: 5;
  width: 100%;
  padding: 2.25rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 20px 50px -20px rgba(37, 99, 235, 0.35),
    0 10px 30px -15px rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

@media (max-width: 767px), (pointer: coarse) {
  .login-page {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .login-layout {
    min-height: 100dvh;
    align-items: center;
  }

  .form-panel {
    min-height: 100dvh;
    padding: max(1rem, env(safe-area-inset-top)) 1rem max(1rem, env(safe-area-inset-bottom));
    perspective: none;
    pointer-events: auto;
  }

  .card-3d-wrap,
  .login-card,
  .card-layer {
    transform: none !important;
    transform-style: flat;
  }

  .card-3d-wrap {
    max-width: 100%;
    animation: none;
  }

  .login-card {
    padding: clamp(1.25rem, 5vw, 1.75rem);
    border-radius: 1.25rem;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    will-change: auto;
  }

  .field-control,
  .field-input,
  .field-toggle,
  .otp-input,
  .submit-btn,
  .ghost-btn,
  .card-link {
    pointer-events: auto;
    touch-action: manipulation;
  }
}

.card-layer {
  transform: none;
  transform-style: flat;
}

:global(.dark) .login-card {
  background: rgba(17, 24, 39, 0.78);
  border-color: rgba(148, 163, 184, 0.16);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(26px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-head {
  margin-bottom: 1.6rem;
}

.card-eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #0891b2;
}

.card-title {
  margin-top: 0.5rem;
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
}

:global(.dark) .card-title {
  color: #f8fafc;
}

.card-subtitle {
  margin-top: 0.4rem;
  font-size: 0.92rem;
  color: #64748b;
}

:global(.dark) .card-subtitle {
  color: #94a3b8;
}

/* ---------- Fields ---------- */
.field {
  margin-bottom: 1.15rem;
}

.field-label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #334155;
}

:global(.dark) .field-label {
  color: #cbd5e1;
}

.field-control {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 0.85rem;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

:global(.dark) .field-control {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(148, 163, 184, 0.22);
}

.field-control:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
}

.field-icon {
  position: absolute;
  left: 0.9rem;
  width: 1.15rem;
  height: 1.15rem;
  color: #94a3b8;
  transition: color 0.2s ease;
  pointer-events: none;
}

.field-control:focus-within .field-icon {
  color: #2563eb;
}

.field-input {
  width: 100%;
  padding: 0.8rem 0.9rem 0.8rem 2.7rem;
  border: 0;
  background: transparent;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
}

.field-input.has-toggle {
  padding-right: 2.8rem;
}

:global(.dark) .field-input {
  color: #f1f5f9;
}

.field-input::placeholder {
  color: #94a3b8;
}

.field-mode {
  position: absolute;
  right: 0.7rem;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.18rem 0.5rem;
  border-radius: 9999px;
  transition: all 0.25s ease;
}

.field-mode.password {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.1);
}

.field-mode.otp {
  color: #059669;
  background: rgba(16, 185, 129, 0.12);
}

.field-toggle {
  position: absolute;
  right: 0.6rem;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  color: #94a3b8;
  transition: color 0.2s ease, background 0.2s ease;
}

.field-toggle:hover {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.08);
}

.field-hint {
  margin-top: 0.45rem;
  font-size: 0.74rem;
  line-height: 1.5;
  color: #94a3b8;
}

/* ---------- OTP ---------- */
.otp-input {
  width: 100%;
  padding: 0.85rem;
  text-align: center;
  font-size: 1.35rem;
  letter-spacing: 0.5em;
  font-weight: 600;
  border-radius: 0.85rem;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

:global(.dark) .otp-input {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(148, 163, 184, 0.22);
  color: #f1f5f9;
}

.otp-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
}

/* ---------- Lock alert ---------- */
.lock-alert {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.15rem;
  padding: 0.8rem 1rem;
  border-radius: 0.85rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #b45309;
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

:global(.dark) .lock-alert {
  color: #fcd34d;
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.2);
}

/* ---------- Buttons ---------- */
.submit-btn {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.85rem 1rem;
  margin-top: 0.4rem;
  border-radius: 0.85rem;
  font-size: 0.98rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(120deg, #2563eb, #0891b2);
  background-size: 180% 180%;
  box-shadow: 0 12px 24px -10px rgba(37, 99, 235, 0.65);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  animation: gradient-shift 6s ease infinite;
}

@keyframes gradient-shift {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.submit-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 18px 32px -12px rgba(37, 99, 235, 0.75);
}

.submit-btn:hover:not(:disabled)::after {
  left: 130%;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  animation-play-state: paused;
}

.submit-arrow {
  width: 1.15rem;
  height: 1.15rem;
  transition: transform 0.2s ease;
}

.submit-btn:hover:not(:disabled) .submit-arrow {
  transform: translateX(4px);
}

.submit-spinner {
  width: 1.1rem;
  height: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 9999px;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.ghost-btn {
  width: 100%;
  margin-top: 0.7rem;
  padding: 0.75rem 1rem;
  border-radius: 0.85rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #475569;
  background: transparent;
  border: 1.5px solid #e2e8f0;
  transition: all 0.2s ease;
}

.ghost-btn:hover:not(:disabled) {
  border-color: #bae6fd;
  background: rgba(37, 99, 235, 0.05);
  color: #2563eb;
}

.ghost-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

:global(.dark) .ghost-btn {
  color: #cbd5e1;
  border-color: rgba(148, 163, 184, 0.22);
}

.card-foot {
  margin-top: 1.4rem;
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
}

.card-link {
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  position: relative;
}

.card-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 1.5px;
  background: #2563eb;
  transition: width 0.25s ease;
}

.card-link:hover::after {
  width: 100%;
}

/* ===================== Entrance reveal ===================== */
.reveal {
  opacity: 0;
  transform: translateY(14px) translateZ(var(--z, 0));
  animation: reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--d, 0s);
}

@keyframes reveal-up {
  to {
    opacity: 1;
    transform: translateY(0) translateZ(var(--z, 0));
  }
}

/* ===================== Field transitions ===================== */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===================== Intro overlay ===================== */
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563eb 0%, #0891b2 55%, #1d4ed8 100%);
  color: #fff;
}

.intro-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* ---------- 3D rotating cube ---------- */
.intro-stage {
  position: relative;
  width: 120px;
  height: 120px;
  display: grid;
  place-items: center;
  perspective: 600px;
  animation: stage-pop 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes stage-pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.cube {
  position: relative;
  width: 84px;
  height: 84px;
  transform-style: preserve-3d;
  animation: spin-cube 6s linear infinite, cube-bob 3s ease-in-out infinite;
}

.cube-face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: inset 0 0 24px rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
}

.cube-face svg {
  width: 44px;
  height: 44px;
  color: #fff;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
}

.cube-front { transform: rotateY(0deg) translateZ(42px); }
.cube-back { transform: rotateY(180deg) translateZ(42px); }
.cube-right { transform: rotateY(90deg) translateZ(42px); }
.cube-left { transform: rotateY(-90deg) translateZ(42px); }
.cube-top { transform: rotateX(90deg) translateZ(42px); }
.cube-bottom { transform: rotateX(-90deg) translateZ(42px); }

@keyframes spin-cube {
  from { transform: rotateX(-20deg) rotateY(0deg); }
  to { transform: rotateX(-20deg) rotateY(360deg); }
}

@keyframes cube-bob {
  0%, 100% { margin-top: 0; }
  50% { margin-top: -10px; }
}

.cube-shadow {
  position: absolute;
  bottom: 6px;
  width: 70px;
  height: 14px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.28);
  filter: blur(7px);
  animation: cube-shadow 3s ease-in-out infinite;
}

@keyframes cube-shadow {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(0.78); opacity: 0.25; }
}

.intro-title {
  margin-top: 1.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  opacity: 0;
  animation: reveal-up 0.6s ease 0.3s forwards;
}

.intro-subtitle {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  opacity: 0;
  animation: reveal-up 0.6s ease 0.45s forwards;
}

.intro-bar {
  margin-top: 1.5rem;
  width: 11rem;
  height: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.intro-bar span {
  display: block;
  height: 100%;
  width: 40%;
  border-radius: 9999px;
  background: #fff;
  animation: load-bar 1.6s ease-in-out forwards;
}

@keyframes load-bar {
  0% {
    transform: translateX(-110%);
    width: 40%;
  }

  60% {
    transform: translateX(120%);
    width: 55%;
  }

  100% {
    transform: translateX(260%);
    width: 60%;
  }
}

.intro-enter-active,
.intro-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.intro-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

/* ===================== Success splash → dashboard ===================== */
.success-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1d4ed8 0%, #0891b2 55%, #2563eb 100%);
  color: #fff;
}

.success-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.success-glow {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 60vmin;
  height: 60vmin;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.35), transparent 60%);
  filter: blur(20px);
  animation: success-glow-pulse 2.4s ease-in-out infinite;
}

@keyframes success-glow-pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.15); }
}

.confetti {
  position: absolute;
  top: -6vh;
  border-radius: 2px;
  opacity: 0;
  animation-name: confetti-fall;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
}

@keyframes confetti-fall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
}

.success-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.success-check {
  width: 7rem;
  height: 7rem;
}

.sc-ring-bg {
  fill: rgba(255, 255, 255, 0.12);
  stroke: rgba(255, 255, 255, 0.25);
  stroke-width: 4;
}

.sc-ring {
  fill: none;
  stroke: #ffffff;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 264;
  stroke-dashoffset: 264;
  transform: rotate(-90deg);
  transform-origin: center;
  animation: sc-ring-draw 0.7s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.sc-tick {
  fill: none;
  stroke: #ffffff;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: sc-tick-draw 0.4s cubic-bezier(0.65, 0, 0.35, 1) 0.55s forwards;
}

@keyframes sc-ring-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes sc-tick-draw {
  to { stroke-dashoffset: 0; }
}

.success-title {
  margin-top: 1.4rem;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  opacity: 0;
  animation: reveal-up 0.5s ease 0.7s forwards;
}

.success-subtitle {
  margin-top: 0.4rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.82);
  opacity: 0;
  animation: reveal-up 0.5s ease 0.85s forwards;
}

.success-bar {
  margin-top: 1.6rem;
  width: 13rem;
  height: 5px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.success-bar span {
  display: block;
  height: 100%;
  width: 100%;
  border-radius: 9999px;
  background: #ffffff;
  transform-origin: left;
  transform: scaleX(0);
  animation: success-bar-fill 1.6s ease-in-out 0.5s forwards;
}

@keyframes success-bar-fill {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}

.success-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.success-enter-from {
  opacity: 0;
  transform: scale(1.06);
}

/* ===================== Reduced motion ===================== */
@media (prefers-reduced-motion: reduce) {

  .blob,
  .brand-panel::before,
  .brand-glow,
  .feature-dot,
  .submit-btn,
  .cube,
  .cube-shadow,
  .mini-cube,
  .ring-3d,
  .pyramid,
  .char-float,
  .char-shadow,
  .char-ring,
  .char-arm-wave,
  .char-tassel,
  .hero-chip,
  .hero-stage::before,
  .login-character-image {
    animation: none !important;
  }

  .hero-chip {
    opacity: 1 !important;
  }

  .scene-3d {
    display: none;
  }

  .reveal,
  .card-3d-wrap,
  .intro-stage,
  .intro-title,
  .intro-subtitle {
    animation-duration: 0.001s !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .login-card {
    transform: none !important;
  }
}
</style>
