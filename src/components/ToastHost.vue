<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      <TransitionGroup
        enter-active-class="transform transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transform transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto overflow-hidden rounded-2xl border shadow-lg ring-1"
          :class="toastContainerClass(toast.type)"
        >
          <div
            v-if="toast.duration > 0"
            class="toast-progress"
            :class="toastProgressClass(toast.type)"
            :style="{ animationDuration: `${toast.duration}ms` }"
          />
          <div class="flex items-start gap-3 p-4">
            <div class="mt-0.5 h-2.5 w-2.5 rounded-full" :class="toastDotClass(toast.type)" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold" :class="toastTitleClass(toast.type)">{{ toast.title }}</p>
              <p v-if="toast.message" class="mt-1 text-sm" :class="toastMessageClass(toast.type)">{{ toast.message }}</p>
            </div>
            <button
              type="button"
              class="rounded-lg p-1 transition"
              :class="toastCloseClass(toast.type)"
              @click="dismissToast(toast.id)"
            >
              <span class="sr-only">Tutup</span>
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from "@/composables/useToast";

const { toasts, dismissToast } = useToast();

const toastContainerClass = (type) => {
  if (type === "success") return "border-emerald-700 bg-emerald-600 ring-emerald-700/40";
  if (type === "error") return "border-red-700 bg-red-600 ring-red-700/40";
  return "border-sky-200 bg-white ring-sky-100 dark:border-sky-500/30 dark:bg-slate-900 dark:ring-sky-500/10";
};

const toastDotClass = (type) => {
  if (type === "success") return "bg-white/90";
  if (type === "error") return "bg-white/90";
  return "bg-sky-500";
};

const toastTitleClass = (type) => {
  if (type === "success" || type === "error") return "text-white";
  return "text-slate-900 dark:text-white";
};

const toastMessageClass = (type) => {
  if (type === "success" || type === "error") return "text-white/90";
  return "text-slate-600 dark:text-slate-300";
};

const toastCloseClass = (type) => {
  if (type === "success" || type === "error") {
    return "text-white/80 hover:bg-white/10 hover:text-white";
  }
  return "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200";
};

const toastProgressClass = (type) => {
  if (type === "success") return "bg-white/80";
  if (type === "error") return "bg-white/80";
  return "bg-sky-500";
};
</script>

<style scoped>
.toast-progress {
  height: 3px;
  width: 100%;
  transform-origin: left center;
  animation-name: toast-progress-shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes toast-progress-shrink {
  from {
    transform: scaleX(1);
    opacity: 0.95;
  }
  to {
    transform: scaleX(0);
    opacity: 0.75;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast-progress {
    animation: none;
  }
}
</style>
