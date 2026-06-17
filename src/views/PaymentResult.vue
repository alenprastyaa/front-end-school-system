<template>
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff_0,_#f8fafc_35%,_#e2e8f0_100%)] px-4 py-10 text-slate-900">
    <div class="mx-auto flex min-h-[80vh]  items-center justify-center">
      <div
        class="relative w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.15)]">
        <div class="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500"></div>
        <div class="border-b border-slate-200 px-6 py-6 md:px-8">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-4">
              <div
                class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img v-if="schoolLogo" :src="schoolLogo" :alt="schoolName" class="h-full w-full object-cover" />
                <div v-else
                  class="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-black text-white">
                  {{ schoolInitials }}
                </div>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.32em] text-slate-500">{{ paymentProviderLabel }}</p>
                <h1 class="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  {{ isSuccess ? "Pembayaran Berhasil" : "Pembayaran Gagal" }}
                </h1>
              </div>
            </div>
            <div
              class="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
              {{ schoolName }}
            </div>
          </div>
          <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            {{
              isSuccess
                ? successMessage
                : "Pembayaran tidak dapat dilanjutkan. Silakan coba lagi atau gunakan metode pembayaran lain."
            }}
          </p>
        </div>

        <div class="grid gap-6 px-6 py-6 md:px-8 lg:grid-cols-[1fr,320px]">
          <div class="space-y-4">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Reference</p>
              <p class="mt-3 break-all text-lg font-semibold text-slate-900">{{ referenceId || "-" }}</p>
            </div>

            <div class="rounded-2xl border p-5"
              :class="isSuccess ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'">
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Status</p>
              <p class="mt-3 text-2xl font-black" :class="isSuccess ? 'text-emerald-700' : 'text-rose-700'">
                {{ statusLabel }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                {{ isSuccess ? successStatusText : `Pembayaran belum berhasil
                diproses.` }}
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Keterangan</p>
              <p class="mt-3 text-sm leading-7 text-slate-700 md:text-base">
                {{ statusDescription }}
              </p>
            </div>
          </div>

          <div
            class="flex flex-col justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 md:p-6">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Aksi</p>
              <div class="mt-4 space-y-3">
                <button @click="primaryAction"
                  class="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500">
                  {{ primaryActionLabel }}
                </button>
                <button @click="secondaryAction"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
                  {{ secondaryActionLabel }}
                </button>
              </div>
            </div>

            <div class="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
              <p class="font-semibold text-slate-900">Info</p>
              <p class="mt-2 leading-6">
                {{ infoMessage }}
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
import { getStoredUser, isAuthenticated } from "@/utils/auth";
import { normalizePublicUrl } from "@/utils/url";

const props = defineProps({
  status: {
    type: String,
    default: "success",
  },
});

const route = useRoute();
const router = useRouter();
const syncState = ref("idle");
const storedUser = getStoredUser() || {};
const schoolName = computed(() => storedUser.school_name || "School System");
const schoolLogo = computed(() => normalizePublicUrl(storedUser.school_logo) || "");
const schoolInitials = computed(() => {
  const source = String(schoolName.value || "SS").trim();
  const parts = source.split(/\s+/).filter(Boolean).slice(0, 2);
  const initials = parts.map((part) => part[0]).join("");
  return (initials || "SS").toUpperCase();
});

const isSuccess = computed(() => {
  const raw = String(props.status || route.query.payment_status || route.query.status || "").toLowerCase();
  return ["success", "paid", "settlement", "completed", "sukses"].includes(raw);
});

const isLandingCheckout = computed(() => String(route.query.source || "").toLowerCase() === "landing");
const paymentProviderLabel = computed(() => (isLandingCheckout.value ? "iPaymu Payment" : "Xendit Payment"));
const referenceId = computed(() => String(route.query.reference_id || route.query.order_id || route.query.reference || "").trim());

const statusLabel = computed(() => (isSuccess.value ? "Berhasil" : "Gagal"));
const successMessage = computed(() =>
  isLandingCheckout.value
    ? "Pembayaran Anda sedang diproses. Invoice sudah dikirim ke email, dan akun admin akan dikirim setelah pembayaran berhasil dikonfirmasi."
    : "Pembayaran Anda sudah diproses. Silakan kembali ke billing untuk melihat status invoice."
);
const successStatusText = computed(() =>
  isLandingCheckout.value
    ? "Pembayaran diterima oleh iPaymu dan sedang menunggu konfirmasi akhir."
    : "Pembayaran diterima dan sedang diproses ke invoice."
);

const statusDescription = computed(() => {
  if (isSuccess.value) {
    return isLandingCheckout.value
      ? "Jika pembayaran sudah berhasil, sistem akan membuat akun admin sekolah dan mengirim username serta password ke Email Aktif yang Anda isi sebagai penerima pesan."
      : "Pembayaran berhasil diterima oleh Xendit. Sistem akan memperbarui status invoice setelah webhook atau sinkronisasi berjalan.";
  }
  return "Pembayaran gagal, dibatalkan, atau kedaluwarsa. Anda dapat mencoba lagi dari halaman billing.";
});

const primaryActionLabel = computed(() => (isLandingCheckout.value ? "Kembali ke Landing" : "Kembali ke Billing"));
const secondaryActionLabel = computed(() => (isLandingCheckout.value ? "Login Sistem" : "Dashboard"));
const infoMessage = computed(() =>
  isLandingCheckout.value
    ? "Cek Email Aktif yang Anda isi untuk invoice dan kredensial admin setelah pembayaran terkonfirmasi."
    : "Jika status invoice belum berubah di halaman billing, tunggu beberapa detik lalu refresh."
);

const primaryAction = () => {
  router.push({ path: isLandingCheckout.value ? "/" : "/billing" });
};

const secondaryAction = () => {
  router.push(isLandingCheckout.value ? { path: "/auth/login" } : { name: "Dashboard" });
};

const syncInvoiceStatus = async () => {
  if (isLandingCheckout.value || !isAuthenticated() || !referenceId.value || !isSuccess.value) return;
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
