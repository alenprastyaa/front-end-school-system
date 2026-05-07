<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
      <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">Sesi Login Berubah</p>
        <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Anda telah logout otomatis</h2>
        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Akun ini baru saja digunakan login dari perangkat lain, sehingga sesi di perangkat ini dihentikan untuk menjaga aturan 1 device aktif.
        </p>
      </div>

      <div class="space-y-4 px-6 py-5">
        <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/70 dark:ring-slate-700">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Perangkat Yang Login</p>
          <p class="mt-2 text-base font-bold text-slate-900 dark:text-white">{{ notice?.active_device || "Perangkat tidak dikenal" }}</p>
          <p v-if="formattedLoginAt" class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Waktu login: {{ formattedLoginAt }}
          </p>
          <p v-if="notice?.active_ip" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            IP: {{ notice.active_ip }}
          </p>
        </div>

        <div class="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20">
          {{ notice?.message || "Sesi Anda digantikan oleh login dari perangkat lain." }}
        </div>
      </div>

      <div class="flex justify-end border-t border-slate-100 px-6 py-4 dark:border-slate-800">
        <button
          type="button"
          class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
          @click="$emit('close')"
        >
          Mengerti
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  notice: {
    type: Object,
    default: () => null,
  },
});

defineEmits(["close"]);

const formattedLoginAt = computed(() => {
  const raw = props.notice?.active_login_at;
  if (!raw) {
    return "";
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return String(raw);
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
});
</script>
