<template>
  <transition name="global-loading-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[140] flex items-center justify-center bg-slate-50/92 px-5 backdrop-blur-sm dark:bg-slate-950/90"
      role="status"
      aria-live="polite"
    >
      <div class="loading-panel">
        <div class="relative mx-auto flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <div class="global-dot-spinner absolute inset-0">
            <span
              v-for="index in dotCount"
              :key="index"
              class="global-dot"
              :style="dotStyle(index - 1)"
            ></span>
          </div>
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 ring-1 ring-sky-100 dark:bg-sky-500/10 dark:ring-sky-400/20"
          >
            <span class="h-3 w-3 rounded-full bg-sky-500 shadow-[0_0_18px_rgba(14,165,233,0.45)]"></span>
          </div>
        </div>

        <div class="mt-6 text-center">
          <p class="text-base font-semibold tracking-normal text-slate-950 dark:text-white">Memuat data</p>
          <p class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Mohon tunggu sebentar</p>
        </div>

        <div class="mt-5 flex justify-center gap-1.5">
          <span class="loading-pulse"></span>
          <span class="loading-pulse animation-delay-150"></span>
          <span class="loading-pulse animation-delay-300"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const dotCount = 18;

const dotStyle = (index) => ({
  "--dot-angle": `${index * (360 / dotCount)}deg`,
  opacity: String(1 - (index / dotCount) * 0.76),
});
</script>

<style scoped>
.global-loading-fade-enter-active,
.global-loading-fade-leave-active {
  transition: opacity 0.18s ease;
}

.global-loading-fade-enter-from,
.global-loading-fade-leave-to {
  opacity: 0;
}

.loading-panel {
  width: min(18rem, calc(100vw - 2.5rem));
  border-radius: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(255, 255, 255, 0.96);
  padding: 1.75rem;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

.dark .loading-panel {
  border-color: rgba(51, 65, 85, 0.9);
  background: rgba(15, 23, 42, 0.96);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.global-dot-spinner {
  animation: global-loading-spin 0.95s linear infinite;
}

.global-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 0.62rem;
  width: 0.62rem;
  margin-left: -0.31rem;
  margin-top: -0.31rem;
  border-radius: 9999px;
  background: #0ea5e9;
  transform: rotate(var(--dot-angle)) translateY(-3.2rem);
  transform-origin: center;
}

.loading-pulse {
  height: 0.45rem;
  width: 0.45rem;
  border-radius: 9999px;
  background: #0ea5e9;
  animation: loading-pulse 0.9s ease-in-out infinite;
}

.animation-delay-150 {
  animation-delay: 0.15s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

@keyframes global-loading-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  50% {
    opacity: 1;
    transform: translateY(-0.18rem);
  }
}
</style>
