<template>
  <div class="min-h-screen bg-[#f7f9fc] font-sans text-slate-700">
    <div class="border-b border-slate-200 bg-white px-5 py-3">
      <div class="mx-auto flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
          <Icon icon="mdi:sliders-outline" class="h-5 w-5" />
        </div>
        <div>
          <p class="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">Bendahara · Penggajian</p>
          <h1 class="mt-0.5 text-[22px] font-extrabold leading-none tracking-tight text-slate-900">Setting Tarif</h1>
        </div>
      </div>
    </div>

    <div class="mx-auto space-y-5 px-5 py-6">

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <p class="text-[10px] font-medium text-slate-500">Tarif per JP</p>
          <p class="mt-1 text-[22px] font-extrabold leading-none text-slate-900">
            {{ formatCurrency(settingsForm.hourly_rate) }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <p class="text-[10px] font-medium text-slate-500">Durasi JP</p>
          <p class="mt-1 text-[22px] font-extrabold leading-none text-slate-900">{{ settingsForm.lesson_minutes }} mnt</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <p class="text-[10px] font-medium text-slate-500">Pengali Bulanan</p>
          <p class="mt-1 text-[22px] font-extrabold leading-none text-slate-900">{{ settingsForm.teaching_hours_multiplier }}x</p>
        </div>
      </div>

      <p class="text-sm text-slate-500">
        Tarif ini digunakan sebagai nilai default saat membuat slip gaji. Tarif dapat di-override per slip jika
        dibutuhkan.
      </p>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="divide-y divide-slate-100">

          <div class="px-5 py-4 grid sm:grid-cols-[220px,1fr] gap-3 items-start">
            <div>
              <p class="text-sm font-semibold text-slate-900">Tarif per jam pelajaran</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Honor guru per JP</p>
            </div>
            <input :value="formatRupiahInput(settingsForm.hourly_rate)" type="text" inputmode="numeric"
              @input="settingsForm.hourly_rate = parseRupiahInput($event.target.value)"
              class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 max-w-xs focus:outline-none focus:ring-2 focus:ring-slate-300" />
          </div>

          <div class="px-5 py-4 grid sm:grid-cols-[220px,1fr] gap-3 items-start">
            <div>
              <p class="text-sm font-semibold text-slate-900">Durasi jam pelajaran</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Dalam menit, umumnya 45 menit</p>
            </div>
            <input v-model.number="settingsForm.lesson_minutes" type="number" min="1"
              class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 max-w-[100px] focus:outline-none focus:ring-2 focus:ring-slate-300" />
          </div>

          <div class="px-5 py-4 grid sm:grid-cols-[220px,1fr] gap-3 items-start">
            <div>
              <p class="text-sm font-semibold text-slate-900">Pengali jam mengajar</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Mingguan atau bulanan (4 minggu)</p>
            </div>
            <select v-model.number="settingsForm.teaching_hours_multiplier"
              class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 max-w-xs focus:outline-none focus:ring-2 focus:ring-slate-300">
              <option :value="1">1× — 1 minggu</option>
              <option :value="4">4× — 1 bulan (4 minggu)</option>
            </select>
          </div>

          <div class="px-5 py-4 grid sm:grid-cols-[220px,1fr] gap-3 items-start">
            <div>
              <p class="text-sm font-semibold text-slate-900">Catatan</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Catatan internal (opsional)</p>
            </div>
            <textarea v-model="settingsForm.notes" rows="3"
              class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 max-w-md w-full focus:outline-none focus:ring-2 focus:ring-slate-300"></textarea>
          </div>
        </div>

        <div
          class="px-5 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-[11px] text-slate-400">
            Contoh: 20 JP/minggu × {{ settingsForm.teaching_hours_multiplier }}× × {{
              formatCurrency(settingsForm.hourly_rate) }}/JP
            = <strong class="text-slate-600">{{ formatCurrency(settingsForm.hourly_rate * 20 *
              settingsForm.teaching_hours_multiplier) }}</strong>
          </p>
          <button @click="saveSettings" :disabled="isSavingSettings"
            class="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40 transition shrink-0">
            {{ isSavingSettings ? "Menyimpan…" : "Simpan Setting" }}
          </button>
        </div>
      </div>
    </div>
    <SuccessModal ref="successModal" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import SuccessModal from "@/components/SuccessModal.vue";
import { pushToast } from "@/composables/useToast";
import { usePayrollStore } from "@/store/payroll";

const successModal = ref(null);
const payrollStore = usePayrollStore();
const {
  settings: settingsForm,
  isSavingSettings,
} = storeToRefs(payrollStore);

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));

const parseRupiahInput = (value) => Number(String(value || "").replace(/[^\d]/g, "") || 0);

const formatRupiahInput = (value) => {
  const n = Number(value || 0);
  if (!n) return "";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
};

const saveSettings = async () => {
  try {
    await payrollStore.saveSettings();
    successModal.value?.show("Setting payroll berhasil disimpan.", "Setting Disimpan");
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan", message: error.message, type: "error" });
  }
};

onMounted(() => {
  payrollStore.loadOverview().catch((error) => {
    pushToast({ title: "Gagal Memuat Setting", message: error.message, type: "error" });
  });
});
</script>
