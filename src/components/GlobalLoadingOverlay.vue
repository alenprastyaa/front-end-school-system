<template>
  <transition name="global-loading-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[140] flex items-center justify-center bg-white/90 px-5 backdrop-blur-[2px] dark:bg-slate-950/88"
      role="status"
      aria-live="polite"
    >
      <div
        class="w-full max-w-md rounded-[2rem] border border-emerald-100 bg-white p-7 text-slate-950 shadow-2xl shadow-emerald-950/10 dark:border-emerald-500/20 dark:bg-slate-900 dark:text-white"
      >
        <div class="flex justify-center">
          <div class="relative h-28 w-28">
            <div class="absolute inset-0 rounded-full border-[10px] border-slate-200 dark:border-slate-700"></div>
            <div class="global-loading-ring absolute inset-0 rounded-full border-[10px] border-transparent border-t-emerald-500 border-r-emerald-500"></div>
          </div>
        </div>

        <div class="mt-8">
          <p class="text-4xl font-black tracking-normal text-slate-950 dark:text-white">Loading...</p>
          <p class="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{{ message || "Memuat data..." }}</p>
        </div>

        <div class="mt-8 h-5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div class="global-loading-progress h-full rounded-full bg-emerald-500"></div>
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
  message: {
    type: String,
    default: "Memuat data...",
  },
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

.global-loading-ring {
  animation: global-loading-spin 0.85s linear infinite;
}

.global-loading-progress {
  animation: global-loading-progress 1.4s ease-in-out infinite;
}

@keyframes global-loading-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes global-loading-progress {
  0% {
    width: 18%;
  }

  45% {
    width: 72%;
  }

  100% {
    width: 96%;
  }
}
</style>
