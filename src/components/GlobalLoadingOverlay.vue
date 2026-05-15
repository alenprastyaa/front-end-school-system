<template>
  <transition name="global-loading-fade">
    <div
      v-if="visible"
      class="pointer-events-none fixed inset-x-0 top-0 z-[140] flex justify-center px-4 pt-3"
      role="status"
      aria-live="polite"
    >
      <div class="loading-strip">
        <div class="flex items-center gap-3">
          <span class="loading-dot"></span>
          <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Memproses perubahan...</p>
        </div>
        <div class="mt-2 h-1 overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-700/80">
          <div class="loading-bar h-full rounded-full bg-sky-500"></div>
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
</script>

<style scoped>
.global-loading-fade-enter-active,
.global-loading-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.global-loading-fade-enter-from,
.global-loading-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.loading-strip {
  width: min(22rem, calc(100vw - 2rem));
  border-radius: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.92);
  background: rgba(255, 255, 255, 0.94);
  padding: 0.75rem 0.9rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
}

.dark .loading-strip {
  border-color: rgba(51, 65, 85, 0.9);
  background: rgba(15, 23, 42, 0.96);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.24);
}

.loading-dot {
  height: 0.5rem;
  width: 0.5rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background: #0ea5e9;
  animation: loading-dot-pulse 1.1s ease-in-out infinite;
}

.loading-bar {
  width: 38%;
  animation: loading-slide 1.2s ease-in-out infinite;
}

@keyframes loading-slide {
  0%,
  100% {
    transform: translateX(-15%);
  }

  50% {
    transform: translateX(150%);
  }
}

@keyframes loading-dot-pulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
