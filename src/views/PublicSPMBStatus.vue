<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-2xl space-y-6">
      <section class="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">Status SPMB</p>
        <h1 class="mt-2 text-2xl font-bold">{{ applicant?.full_name || "Pendaftaran" }}</h1>
        <p class="mt-1 text-sm text-slate-500">{{ applicant?.registration_number || "-" }}</p>
      </section>

      <section v-if="errorMessage" class="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
        {{ errorMessage }}
      </section>

      <section v-else class="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div v-if="isLoading" class="py-10 text-center text-slate-500">Memuat status...</div>
        <div v-else class="space-y-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
            <span class="mt-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
              {{ statusLabel(applicant?.status) }}
            </span>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <Info label="Pilihan 1" :value="majorText(applicant, 'first')" />
            <Info label="Pilihan 2" :value="majorText(applicant, 'second') || '-'" />
            <Info label="Pilihan 3" :value="majorText(applicant, 'third') || '-'" />
            <Info label="Jurusan Diterima" :value="applicant?.accepted_major_code || '-'" />
          </div>
          <div v-if="applicant?.revision_note" class="rounded-lg bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
            {{ applicant.revision_note }}
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { defineComponent, h, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/api";

const route = useRoute();
const applicant = ref(null);
const isLoading = ref(false);
const errorMessage = ref("");

const labels = {
  SUBMITTED: "Terkirim",
  VERIFIED: "Terverifikasi",
  NEED_REVISION: "Perlu Revisi",
  TEST_SCHEDULED: "Jadwal Tes",
  INTERVIEW: "Wawancara",
  ACCEPTED: "Diterima",
  ACCEPTED_OTHER_MAJOR: "Diterima Jurusan Lain",
  REJECTED: "Ditolak",
  RE_REGISTERED: "Daftar Ulang",
  CONVERTED_TO_STUDENT: "Menjadi Siswa",
};

const Info = defineComponent({
  props: { label: String, value: [String, Number] },
  setup(props) {
    return () => h("div", { class: "rounded-lg bg-slate-50 p-4 dark:bg-slate-800" }, [
      h("p", { class: "text-xs font-semibold uppercase tracking-wide text-slate-500" }, props.label),
      h("p", { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-white" }, props.value || "-"),
    ]);
  },
});

const statusLabel = (status) => labels[status] || status || "-";
const majorText = (item, prefix) => {
  const code = item?.[`${prefix}_major_code`];
  const name = item?.[`${prefix}_major_name`];
  return [code, name].filter(Boolean).join(" - ");
};

const loadStatus = async () => {
  isLoading.value = true;
  try {
    const response = await api.get(`/public/spmb/status/${route.params.token}`);
    applicant.value = response?.data || null;
  } catch (error) {
    errorMessage.value = error.message || "Link status tidak valid.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadStatus);
</script>
