<template>
  <transition name="global-loading-fade">
    <div v-if="visible" class="pointer-events-none fixed inset-0 z-[140] flex items-start justify-center px-4 pt-5">
      <div class="absolute inset-x-0 top-0 h-1 overflow-hidden bg-slate-200/80 dark:bg-slate-800/80">
        <div class="global-loading-bar h-full w-1/2 rounded-r-full bg-sky-500"></div>
      </div>

      <div
        class="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-slate-700 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100"
      >
        <span class="relative flex h-9 w-9 items-center justify-center">
          <span class="absolute h-9 w-9 animate-ping rounded-full bg-sky-400/20"></span>
          <span class="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400"></span>
        </span>
        <div>
          <p class="text-sm font-semibold">{{ message || "Memuat data..." }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Mohon tunggu sebentar</p>
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
  transition: opacity 0.16s ease;
}

.global-loading-fade-enter-from,
.global-loading-fade-leave-to {
  opacity: 0;
}

.global-loading-bar {
  animation: global-loading-slide 1.1s ease-in-out infinite;
}

@keyframes global-loading-slide {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(220%);
  }
}
</style>
