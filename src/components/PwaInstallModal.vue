<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
  >
    <div
      class="w-full max-w-lg overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
              Install Aplikasi
            </p>
            <h3 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Pasang School System sebagai PWA
            </h3>
          </div>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            @click="$emit('close')"
          >
            <span class="sr-only">Tutup</span>
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="space-y-5 px-6 py-6">
        <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Install aplikasi agar akses LMS lebih stabil, lebih cepat dibuka, dan terasa seperti aplikasi native.
        </p>

        <div
          class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:ring-slate-700"
        >
          <p class="font-bold text-slate-900 dark:text-white">
            {{ isInstallable ? "Install bisa langsung dari browser ini." : instructionTitle }}
          </p>
          <div v-if="!isInstallable" class="mt-3 space-y-2 text-sm leading-6">
            <p v-for="step in instructionSteps" :key="step">{{ step }}</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 dark:border-slate-800 sm:flex-row sm:justify-end">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="$emit('close')"
        >
          Nanti Saja
        </button>
        <button
          v-if="isInstallable"
          type="button"
          class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
          @click="$emit('install')"
        >
          Install Sekarang
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  isInstallable: {
    type: Boolean,
    default: false,
  },
  instructionTitle: {
    type: String,
    default: "Install manual dari browser",
  },
  instructionSteps: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["close", "install"]);
</script>
