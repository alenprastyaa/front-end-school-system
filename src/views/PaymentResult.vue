<template>
  <div class="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
    <div class="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
      <div class="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
        <div class="border-b border-white/10 px-6 py-5">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Xendit Payment</p>
          <h1 class="mt-2 text-3xl font-black tracking-tight text-white">
            {{ isSuccess ? "Pembayaran Berhasil" : "Pembayaran Gagal" }}
          </h1>
          <p class="mt-2 text-sm leading-6 text-slate-300">
            {{ isSuccess ? "Pembayaran Anda sudah diproses. Silakan kembali ke billing untuk melihat status invoice." : "Pembayaran tidak dapat dilanjutkan. Silakan coba lagi atau gunakan metode pembayaran lain." }}
          </p>
        </div>

        <div class="grid gap-6 px-6 py-6 md:grid-cols-[1fr,280px]">
          <div class="space-y-4">
            <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Reference</p>
              <p class="mt-2 break-all text-sm font-medium text-white">{{ referenceId || "-" }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</p>
              <p class="mt-2 text-sm font-medium" :class="isSuccess ? 'text-emerald-300' : 'text-rose-300'">
                {{ statusLabel }}
              </p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Keterangan</p>
              <p class="mt-2 text-sm leading-6 text-slate-300">
                {{ statusDescription }}
              </p>
            </div>
          </div>

          <div class="flex flex-col justify-between gap-4 rounded-3xl bg-slate-100 p-5 text-slate-900">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Aksi</p>
              <div class="mt-4 space-y-3">
                <button
                  @click="goToBilling"
                  class="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Kembali ke Billing
                </button>
                <button
                  @click="goToDashboard"
                  class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white"
                >
                  Dashboard
                </button>
              </div>
            </div>

            <div class="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
              <p class="font-semibold text-slate-900">Info</p>
              <p class="mt-2 leading-6">
                Jika status invoice belum berubah di halaman billing, tunggu beberapa detik lalu refresh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";

const props = defineProps({
  status: {
    type: String,
    default: "success",
  },
});

const route = useRoute();
const router = useRouter();

const isSuccess = computed(() => {
  const raw = String(props.status || route.query.payment_status || route.query.status || "").toLowerCase();
  return ["success", "paid", "settlement", "completed", "sukses"].includes(raw);
});

const referenceId = computed(() => String(route.query.reference_id || route.query.order_id || route.query.reference || "").trim());
const syncState = ref("idle");

const statusLabel = computed(() => {
  if (isSuccess.value) return "Berhasil";
  return "Gagal";
});

const statusDescription = computed(() => {
  if (isSuccess.value) {
    return "Pembayaran berhasil diterima oleh Xendit. Sistem akan memperbarui status invoice setelah webhook diproses.";
  }
  return "Pembayaran gagal, dibatalkan, atau kedaluwarsa. Anda dapat mencoba lagi dari halaman billing.";
});

const goToBilling = () => {
  router.push({ path: "/billing" });
};

const goToDashboard = () => {
  router.push({ name: "Dashboard" });
};

const syncInvoiceStatus = async () => {
  if (!referenceId.value || !isSuccess.value) return;
  syncState.value = "loading";
  try {
    await api.post(`/billing/current/invoices/reference/${encodeURIComponent(referenceId.value)}/sync-xendit`);
    syncState.value = "done";
    pushToast({ title: "Billing Disinkronkan", message: "Status invoice sudah diperbarui.", type: "success" });
  } catch (error) {
    syncState.value = "error";
    pushToast({ title: "Sync Billing", message: error.message, type: "error" });
  }
};

onMounted(syncInvoiceStatus);
</script>
