<template>
  <div class="min-h-screen bg-[#f7f9fc] font-sans text-slate-700">
    <div class="border-b border-slate-200 bg-white px-5 py-3">
      <div class="mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
            <Icon icon="mdi:view-list-outline" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">Bendahara · Penggajian</p>
            <h1 class="mt-0.5 text-[22px] font-extrabold leading-none tracking-tight text-slate-900">Komponen Gaji</h1>
          </div>
        </div>
        <button @click="startNewComponent"
          class="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-3.5 text-[13px] font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800">
          <Icon icon="mdi:plus" class="h-3.5 w-3.5" />
          Tambah Komponen
        </button>
      </div>
    </div>

    <div class="mx-auto space-y-5 px-5 py-6">

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <p class="text-[10px] font-medium text-slate-500">Total Komponen</p>
          <p class="mt-1 text-[22px] font-extrabold leading-none text-slate-900">{{ components.length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <p class="text-[10px] font-medium text-slate-500">Berlaku untuk Semua</p>
          <p class="mt-1 text-[22px] font-extrabold leading-none text-slate-900">
            {{ components.filter((item) => item.applies_to_all).length }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <p class="text-[10px] font-medium text-slate-500">Komponen Aktif</p>
          <p class="mt-1 text-[22px] font-extrabold leading-none text-slate-900">
            {{ components.filter((item) => item.is_active !== false).length }}
          </p>
        </div>
      </div>

      <!-- Form Tambah / Edit -->
      <form v-if="componentFormOpen" @submit.prevent="saveComponent"
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {{ componentForm.id ? "Edit Komponen" : "Tambah Komponen Baru" }}
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="sm:col-span-2 block">
            <span class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Nama Komponen</span>
            <input v-model="componentForm.name" type="text" placeholder="cth. Tunjangan Transport"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300" />
          </label>

          <label class="block">
            <span class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Jenis</span>
            <select v-model="componentForm.component_type"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300">
              <option value="ALLOWANCE">Tambahan / Tunjangan</option>
              <option value="DEDUCTION">Potongan</option>
            </select>
          </label>

          <label class="block">
            <span class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Cara Hitung</span>
            <select v-model="componentForm.calculation_type"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300">
              <option value="FIXED">Tetap</option>
              <option value="DAILY">Harian (nominal × hari)</option>
            </select>
          </label>

          <label class="block">
            <span class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {{ componentForm.calculation_type === "DAILY" ? "Nominal per Hari" : "Nominal" }}
            </span>
            <input :value="formatRupiahInput(componentForm.default_amount)" type="text" inputmode="numeric"
              @input="componentForm.default_amount = parseRupiahInput($event.target.value)"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300" />
          </label>

          <label class="block">
            <span class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {{ componentForm.calculation_type === "DAILY" ? "Jumlah Hari Default" : "Kuantitas" }}
            </span>
            <input v-model.number="componentForm.default_quantity" type="number" min="0" step="0.25"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300" />
          </label>
        </div>

        <!-- Preview total -->
        <div
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
          <span class="text-slate-500">Total komponen</span>
          <span class="font-semibold text-slate-800">
            {{ componentForm.component_type === "DEDUCTION" ? "−" : "+" }}{{
              formatCurrency(componentTotal(componentForm)) }}
          </span>
        </div>

        <div class="flex flex-wrap gap-4">
          <label class="inline-flex items-center gap-2 cursor-pointer">
            <input v-model="componentForm.applies_to_all" type="checkbox"
              class="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
            <span class="text-xs font-medium text-slate-600">Berlaku untuk semua guru</span>
          </label>
          <label class="inline-flex items-center gap-2 cursor-pointer">
            <input v-model="componentForm.is_active" type="checkbox" class="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
            <span class="text-xs font-medium text-slate-600">Aktif</span>
          </label>
        </div>

        <div class="flex gap-2 pt-1 border-t border-slate-100">
          <button type="submit" :disabled="isSavingComponent"
            class="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 transition">
            {{ isSavingComponent ? "Menyimpan…" : "Simpan" }}
          </button>
          <button type="button" @click="componentFormOpen = false"
            class="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            Batal
          </button>
        </div>
      </form>

      <!-- Daftar Komponen -->
      <SkeletonLoader v-if="isLoading && !components.length" variant="list" :count="5" />
      <div v-show="!(isLoading && !components.length)" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
        <div v-for="item in components" :key="item.id"
          class="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-sm font-semibold text-slate-900">{{ item.name }}</p>
              <span class="text-[10px] font-semibold rounded px-1.5 py-0.5" :class="item.component_type === 'DEDUCTION'
                ? 'bg-red-50 text-red-500'
                : 'bg-slate-100 text-slate-500'">
                {{ item.component_type === "DEDUCTION" ? "Potongan" : "Tambahan" }}
              </span>
              <span v-if="item.applies_to_all"
                class="text-[10px] font-semibold rounded px-1.5 py-0.5 bg-slate-100 text-slate-400">
                Semua guru
              </span>
              <span v-if="!item.is_active"
                class="text-[10px] font-semibold rounded px-1.5 py-0.5 bg-slate-100 text-slate-400 line-through">
                Nonaktif
              </span>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">
              {{ item.component_type === "DEDUCTION" ? "−" : "+" }}{{ formatCurrency(componentTotal(item)) }}
              <span v-if="item.calculation_type === 'DAILY'">({{ formatCurrency(item.default_amount) }} × {{
                numberLabel(item.default_quantity) }} hari)</span>
            </p>
          </div>
          <div class="flex gap-1 shrink-0">
            <button @click="editComponent(item)"
              class="rounded px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              Edit
            </button>
            <button @click="deleteComponent(item)"
              class="rounded px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              Hapus
            </button>
          </div>
        </div>

        <div v-if="components.length === 0" class="px-6 py-12 text-center">
          <p class="text-sm text-slate-400">Belum ada komponen. Klik <strong>+ Tambah</strong> untuk memulai.</p>
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
  components,
  componentFormOpen,
  componentForm,
  isLoading,
  isSavingComponent,
} = storeToRefs(payrollStore);

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));

const parseRupiahInput = (value) => Number(String(value || "").replace(/[^\d]/g, "") || 0);

const formatRupiahInput = (value) => {
  const n = Number(value || 0);
  if (!n) return "";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
};

const numberLabel = (value) => {
  const n = Number(value || 0);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

const componentTotal = (item) =>
  Math.round(Math.abs(Number(item.default_amount || 0)) * Math.max(Number(item.default_quantity || 1), 0));

const startNewComponent = () => {
  payrollStore.startNewComponent();
};

const editComponent = (item) => {
  payrollStore.editComponent(item);
};

const saveComponent = async () => {
  try {
    await payrollStore.saveComponent();
    successModal.value?.show("Komponen payroll berhasil disimpan.", "Komponen Disimpan");
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan", message: error.message, type: "error" });
  }
};

const deleteComponent = async (item) => {
  if (!window.confirm(`Hapus komponen "${item.name}"?`)) return;
  try {
    await payrollStore.deleteComponent(item);
    successModal.value?.show("Komponen payroll berhasil dihapus.", "Komponen Dihapus");
  } catch (error) {
    pushToast({ title: "Gagal Menghapus", message: error.message, type: "error" });
  }
};

onMounted(() => {
  payrollStore.loadOverview().catch((error) => {
    pushToast({ title: "Gagal Memuat", message: error.message, type: "error" });
  });
});
</script>
