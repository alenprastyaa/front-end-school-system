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
          class="pointer-events-auto overflow-hidden rounded-2xl border bg-white shadow-lg ring-1 dark:bg-slate-900"
          :class="toastContainerClass(toast.type)"
        >
          <div class="flex items-start gap-3 p-4">
            <div class="mt-0.5 h-2.5 w-2.5 rounded-full" :class="toastDotClass(toast.type)" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-slate-900 dark:text-white">{{ toast.title }}</p>
              <p v-if="toast.message" class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ toast.message }}</p>
            </div>
            <button
              type="button"
              class="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
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
  if (type === "success") return "border-emerald-200 ring-emerald-100 dark:border-emerald-500/30 dark:ring-emerald-500/10";
  if (type === "error") return "border-red-200 ring-red-100 dark:border-red-500/30 dark:ring-red-500/10";
  return "border-sky-200 ring-sky-100 dark:border-sky-500/30 dark:ring-sky-500/10";
};

const toastDotClass = (type) => {
  if (type === "success") return "bg-emerald-500";
  if (type === "error") return "bg-red-500";
  return "bg-sky-500";
};
</script>
