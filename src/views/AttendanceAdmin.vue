<template>
  <div class="min-h-screen bg-slate-50 px-4 py-5 font-sans text-slate-900 dark:bg-[#0b141a] dark:text-slate-100">
    <div class="mx-auto w-full space-y-5">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Admin · Attendance</p>
          <h1 class="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Kelola Attendance</h1>
          <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Review permintaan perubahan enrol wajah siswa.
          </p>
        </div>
        <button type="button" @click="loadRequests" :disabled="isLoading"
          class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-[#111b21] dark:text-slate-200 dark:hover:bg-white/5">
          <Icon icon="mdi:refresh" class="text-base" :class="{ 'animate-spin': isLoading }" />
          Refresh
        </button>
      </header>

      <section class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div v-for="stat in heroStats" :key="stat.label"
          class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-[#111b21]">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
            :class="stat.iconClass">
            <Icon :icon="stat.icon" />
          </span>
          <div class="min-w-0">
            <p class="text-xl font-black leading-none tabular-nums text-slate-900 dark:text-white">{{ stat.value }}</p>
            <p class="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
          </div>
        </div>
      </section>

      <!-- Approval panel -->
      <section
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111b21]">
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 dark:border-white/5">
          <div>
            <h2 class="text-sm font-black">Approval Enrol Wajah</h2>
            <p class="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Siswa hanya bisa mengganti data wajah setelah disetujui admin.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <label class="relative">
              <Icon icon="mdi:magnify"
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
              <input v-model.trim="searchQuery" type="search" placeholder="Cari siswa / kelas..."
                class="h-9 w-44 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white sm:w-52 dark:border-white/10 dark:bg-[#0b141a] dark:text-slate-200 dark:focus:bg-[#0b141a]" />
            </label>

            <div class="flex rounded-xl bg-slate-100 p-1 dark:bg-[#0b141a]">
              <button v-for="tab in filterTabs" :key="tab.value" type="button" @click="setFilter(tab.value)"
                class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition" :class="statusFilter === tab.value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'">
                {{ tab.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Message -->
        <transition enter-active-class="transition duration-200" enter-from-class="-translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100">
          <div v-if="message"
            class="mx-4 mt-4 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-xs font-semibold sm:mx-5" :class="messageType === 'error'
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200'">
            <Icon :icon="messageType === 'error' ? 'mdi:alert-circle-outline' : 'mdi:check-circle-outline'"
              class="mt-0.5 shrink-0 text-sm" />
            <span class="leading-5">{{ message }}</span>
          </div>
        </transition>

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="space-y-3 p-4 sm:p-5">
          <div v-for="n in 3" :key="n"
            class="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 dark:border-white/5">
            <div class="skeleton-shimmer h-14 w-14 rounded-xl"></div>
            <div class="flex-1 space-y-2">
              <div class="skeleton-shimmer h-3 w-1/3 rounded"></div>
              <div class="skeleton-shimmer h-3 w-1/2 rounded"></div>
            </div>
            <div class="skeleton-shimmer h-8 w-24 rounded-xl"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredRequests.length === 0" class="flex flex-col items-center px-6 py-12 text-center">
          <span
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400 dark:bg-white/5">
            <Icon icon="mdi:face-recognition" />
          </span>
          <p class="mt-3 text-sm font-bold">{{ searchQuery ? "Tidak ada hasil pencarian" : "Tidak ada permintaan" }}</p>
          <p class="mt-1 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
            {{ searchQuery
              ? `Tidak ada permintaan yang cocok dengan "${searchQuery}".`
              : "Belum ada permintaan enrol wajah pada filter ini." }}
          </p>
        </div>

        <!-- Request list -->
        <div v-else class="divide-y divide-slate-100 dark:divide-white/5">
          <article v-for="item in filteredRequests" :key="item.id"
            class="flex flex-wrap items-center gap-4 px-4 py-4 transition hover:bg-slate-50/70 sm:px-5 dark:hover:bg-white/[0.03]">
            <button type="button" class="group relative shrink-0 cursor-zoom-in"
              @click="previewImage = normalizePublicUrl(item.requested_image) || defaultAvatar">
              <img :src="normalizePublicUrl(item.requested_image) || defaultAvatar" :alt="item.student_name"
                class="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 transition group-hover:brightness-90 dark:ring-white/10" />
              <span
                class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md bg-slate-900/80 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                <Icon icon="mdi:magnify-plus-outline" />
              </span>
            </button>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="truncate text-sm font-bold">{{ item.student_name || item.username || "Siswa" }}</h3>
                <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                  :class="statusMeta(item.status).chip">
                  <span class="h-1.5 w-1.5 rounded-full" :class="statusMeta(item.status).dot"></span>
                  {{ statusMeta(item.status).label }}
                </span>
              </div>
              <p
                class="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <Icon icon="mdi:google-classroom" class="text-xs" />
                {{ item.class_name || "Tanpa kelas" }}
                <span class="text-slate-300 dark:text-slate-600">·</span>
                <Icon icon="mdi:clock-outline" class="text-xs" />
                {{ formatDateTime(item.created_at) }}
              </p>
              <p v-if="item.admin_note"
                class="mt-1.5 inline-flex items-start gap-1.5 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-medium leading-4 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                <Icon icon="mdi:note-text-outline" class="mt-0.5 shrink-0 text-xs" />
                {{ item.admin_note }}
              </p>
              <p v-if="item.reviewed_by_name" class="mt-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Direview oleh {{ item.reviewed_by_name }}{{ item.reviewed_at ? ` · ${formatDateTime(item.reviewed_at)}`
                  : "" }}
              </p>
            </div>

            <div v-if="item.status === 'PENDING'" class="flex w-full gap-2 sm:w-auto">
              <button type="button" @click="reviewRequest(item, 'APPROVE')" :disabled="reviewingId === item.id"
                class="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50 sm:flex-none">
                <Icon :icon="reviewingId === item.id ? 'mdi:loading' : 'mdi:check'" class="text-sm"
                  :class="{ 'animate-spin': reviewingId === item.id }" />
                Approve
              </button>
              <button type="button" @click="openReject(item)" :disabled="reviewingId === item.id"
                class="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 sm:flex-none dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20">
                <Icon icon="mdi:close" class="text-sm" />
                Reject
              </button>
            </div>
          </article>
        </div>
      </section>

      <section
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111b21]">
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 dark:border-white/5">
          <div>
            <h2 class="text-sm font-black">History Perubahan Enrol Wajah</h2>
            <p class="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Riwayat request perubahan wajah yang sudah di-approve atau reject.
            </p>
          </div>

          <form class="flex flex-wrap items-center gap-2" @submit.prevent="applyHistorySearch">
            <label class="relative">
              <Icon icon="mdi:magnify"
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
              <input v-model.trim="historySearchInput" type="search" placeholder="Cari siswa / kelas..."
                class="h-9 w-44 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white sm:w-56 dark:border-white/10 dark:bg-[#0b141a] dark:text-slate-200 dark:focus:bg-[#0b141a]" />
            </label>
            <select v-model.number="historyLimit" @change="changeHistoryLimit"
              class="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#0b141a] dark:text-slate-200">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <button type="submit"
              class="inline-flex h-9 items-center justify-center rounded-xl bg-slate-900 px-3.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
              Cari
            </button>
          </form>
        </div>

        <div v-if="historySearch" class="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2 sm:px-5 dark:border-white/5">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Filter: "{{ historySearch }}"</p>
          <button type="button" class="text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-300"
            @click="clearHistorySearch">
            Hapus filter
          </button>
        </div>

        <div v-if="isLoadingHistory" class="p-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          Memuat history perubahan wajah...
        </div>
        <div v-else-if="historyRows.length === 0" class="p-8 text-center">
          <Icon icon="mdi:history" class="mx-auto text-3xl text-slate-300 dark:text-slate-600" />
          <p class="mt-2 text-sm font-bold">Belum ada history</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">History akan muncul setelah request di-approve atau reject.</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 text-left text-xs dark:divide-white/5">
            <thead class="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:bg-[#0b141a] dark:text-slate-400">
              <tr>
                <th class="px-4 py-3 sm:px-5">Siswa</th>
                <th class="px-4 py-3">Kelas</th>
                <th class="px-4 py-3">Foto Request</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Diajukan</th>
                <th class="px-4 py-3">Direview</th>
                <th class="px-4 py-3">Admin</th>
                <th class="px-4 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              <tr v-for="item in historyRows" :key="item.id" class="hover:bg-slate-50/70 dark:hover:bg-white/[0.03]">
                <td class="px-4 py-3 sm:px-5">
                  <p class="font-bold text-slate-900 dark:text-white">{{ item.student_name || item.username || "Siswa" }}</p>
                  <p class="mt-0.5 text-[11px] font-medium text-slate-400">{{ item.username || "-" }}</p>
                </td>
                <td class="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">{{ item.class_name || "-" }}</td>
                <td class="px-4 py-3">
                  <button type="button" class="group relative cursor-zoom-in"
                    @click="previewImage = normalizePublicUrl(item.requested_image) || defaultAvatar">
                    <img :src="normalizePublicUrl(item.requested_image) || defaultAvatar" :alt="item.student_name"
                      class="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-200 transition group-hover:brightness-90 dark:ring-white/10" />
                  </button>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                    :class="statusMeta(item.status).chip">
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusMeta(item.status).dot"></span>
                    {{ statusMeta(item.status).label }}
                  </span>
                </td>
                <td class="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">{{ formatDateTime(item.created_at) }}</td>
                <td class="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">{{ formatDateTime(item.reviewed_at) }}</td>
                <td class="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">{{ item.reviewed_by_name || "-" }}</td>
                <td class="max-w-xs px-4 py-3 text-slate-500 dark:text-slate-400">
                  <span class="line-clamp-2">{{ item.admin_note || "-" }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs font-semibold text-slate-500 sm:px-5 dark:border-white/5 dark:text-slate-400">
          <p>{{ historyRangeLabel }}</p>
          <div class="flex items-center gap-2">
            <button type="button" class="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-white/10"
              :disabled="historyPage <= 1 || isLoadingHistory" @click="goHistoryPage(historyPage - 1)">
              Prev
            </button>
            <span>Halaman {{ historyPage }} / {{ historyTotalPages }}</span>
            <button type="button" class="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-white/10"
              :disabled="historyPage >= historyTotalPages || isLoadingHistory" @click="goHistoryPage(historyPage + 1)">
              Next
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Reject modal -->
    <teleport to="body">
      <div v-if="rejectTarget"
        class="fixed inset-0 z-[240] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
        @click.self="closeReject">
        <div
          class="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl dark:bg-[#111b21] dark:ring-1 dark:ring-white/10">
          <div class="flex items-start gap-3">
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-lg text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
              <Icon icon="mdi:face-recognition" />
            </span>
            <div class="min-w-0">
              <h2 class="text-base font-black">Tolak Perubahan Wajah</h2>
              <p class="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                {{ rejectTarget.student_name || rejectTarget.username }}
              </p>
            </div>
          </div>
          <textarea v-model="rejectNote" rows="3"
            class="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs leading-5 text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white dark:border-white/10 dark:bg-[#0b141a] dark:text-white"
            placeholder="Tulis alasan penolakan untuk siswa (opsional)..."></textarea>
          <div class="mt-4 flex gap-2">
            <button type="button" @click="closeReject"
              class="h-9 flex-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
              Batal
            </button>
            <button type="button" @click="reviewRequest(rejectTarget, 'REJECT')"
              :disabled="reviewingId === rejectTarget.id"
              class="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-600 text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-50">
              <Icon v-if="reviewingId === rejectTarget.id" icon="mdi:loading" class="animate-spin text-sm" />
              Tolak Permintaan
            </button>
          </div>
        </div>
      </div>

      <!-- Photo lightbox -->
      <div v-if="previewImage"
        class="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/85 p-6 backdrop-blur-sm"
        @click.self="previewImage = null">
        <button type="button"
          class="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white transition hover:bg-white/20"
          @click="previewImage = null">
          <Icon icon="mdi:close" />
        </button>
        <img :src="previewImage" alt="Foto enrol wajah"
          class="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl" />
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { useSidebar } from "@/store/sidebar";
import { normalizePublicUrl } from "@/utils/url";
import defaultAvatar from "@/assets/img/user.jpg";

const sidebarStore = useSidebar();
const requests = ref([]);
const historyRows = ref([]);
const isLoading = ref(false);
const isLoadingHistory = ref(false);
const reviewingId = ref(null);
const statusFilter = ref("PENDING");
const searchQuery = ref("");
const historySearchInput = ref("");
const historySearch = ref("");
const historyPage = ref(1);
const historyLimit = ref(10);
const historyTotal = ref(0);
const historyTotalPages = ref(1);
const message = ref("");
const messageType = ref("success");
const rejectTarget = ref(null);
const rejectNote = ref("");
const previewImage = ref(null);

const filterTabs = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ALL", label: "Semua" },
];

const pendingCount = computed(() => requests.value.filter((item) => item.status === "PENDING").length);
const approvedCount = computed(() => requests.value.filter((item) => item.status === "APPROVED").length);
const rejectedCount = computed(() => requests.value.filter((item) => item.status === "REJECTED").length);

const heroStats = computed(() => [
  { label: "Pending Approval", value: pendingCount.value, icon: "mdi:clock-alert-outline", iconClass: "bg-amber-500/15 text-amber-300" },
  { label: "Approved", value: approvedCount.value, icon: "mdi:check-decagram-outline", iconClass: "bg-emerald-500/15 text-emerald-300" },
  { label: "Rejected", value: rejectedCount.value, icon: "mdi:close-octagon-outline", iconClass: "bg-rose-500/15 text-rose-300" },
]);

const filteredRequests = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) return requests.value;
  return requests.value.filter((item) =>
    [item.student_name, item.username, item.class_name].some((field) => (field || "").toLowerCase().includes(query))
  );
});

const historyRangeLabel = computed(() => {
  if (historyTotal.value === 0) {
    return "Tidak ada data";
  }
  const start = (historyPage.value - 1) * historyLimit.value + 1;
  const end = Math.min(historyPage.value * historyLimit.value, historyTotal.value);
  return `Menampilkan ${start}-${end} dari ${historyTotal.value} data`;
});

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const statusMeta = (status) =>
({
  PENDING: { label: "Pending", chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200", dot: "bg-amber-500" },
  APPROVED: { label: "Approved", chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200", dot: "bg-emerald-500" },
  REJECTED: { label: "Rejected", chip: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200", dot: "bg-rose-500" },
}[status] || { label: status || "-", chip: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300", dot: "bg-slate-400" });

const setFilter = (value) => {
  if (statusFilter.value === value) return;
  statusFilter.value = value;
  loadRequests();
};

const loadRequests = async () => {
  isLoading.value = true;
  message.value = "";
  try {
    const response = await api.get(`/attendance/face-enrollment-requests?status=${encodeURIComponent(statusFilter.value)}`);
    requests.value = Array.isArray(response?.data) ? response.data : [];
    await sidebarStore.refreshAttendanceFacePendingCount({ force: true });
  } catch (error) {
    requests.value = [];
    messageType.value = "error";
    message.value = error.message || "Gagal memuat permintaan enrol wajah.";
  } finally {
    isLoading.value = false;
  }
};

const loadHistory = async ({ page = historyPage.value } = {}) => {
  isLoadingHistory.value = true;
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(historyLimit.value),
    });
    if (historySearch.value) {
      params.set("search", historySearch.value);
    }
    const response = await api.get(`/attendance/face-enrollment-requests/history?${params.toString()}`);
    const payload = response?.data || {};
    historyRows.value = Array.isArray(payload.data) ? payload.data : [];
    historyPage.value = Number(payload.page || page) || 1;
    historyLimit.value = Number(payload.limit || historyLimit.value) || 10;
    historyTotal.value = Number(payload.total || 0);
    historyTotalPages.value = Math.max(Number(payload.total_pages || 1), 1);
  } catch (error) {
    historyRows.value = [];
    historyTotal.value = 0;
    historyTotalPages.value = 1;
    messageType.value = "error";
    message.value = error.message || "Gagal memuat history enrol wajah.";
  } finally {
    isLoadingHistory.value = false;
  }
};

const applyHistorySearch = async () => {
  historySearch.value = historySearchInput.value.trim();
  historyPage.value = 1;
  await loadHistory({ page: 1 });
};

const clearHistorySearch = async () => {
  historySearchInput.value = "";
  historySearch.value = "";
  historyPage.value = 1;
  await loadHistory({ page: 1 });
};

const changeHistoryLimit = async () => {
  historyPage.value = 1;
  await loadHistory({ page: 1 });
};

const goHistoryPage = async (page) => {
  const nextPage = Math.min(Math.max(Number(page) || 1, 1), historyTotalPages.value);
  if (nextPage === historyPage.value || isLoadingHistory.value) return;
  await loadHistory({ page: nextPage });
};

const openReject = (item) => {
  rejectTarget.value = item;
  rejectNote.value = "";
};

const closeReject = () => {
  rejectTarget.value = null;
  rejectNote.value = "";
};

const reviewRequest = async (item, action) => {
  if (!item?.id || reviewingId.value) return;
  reviewingId.value = item.id;
  message.value = "";
  try {
    const response = await api.post(`/attendance/face-enrollment-requests/${item.id}/review`, {
      action,
      admin_note: action === "REJECT" ? rejectNote.value : "",
    });
    messageType.value = "success";
    message.value = response?.message || "Request berhasil diproses.";
    closeReject();
    await loadRequests();
    await loadHistory({ page: historyPage.value });
  } catch (error) {
    messageType.value = "error";
    message.value = error.message || "Gagal memproses request.";
  } finally {
    reviewingId.value = null;
  }
};

onMounted(() => {
  loadRequests();
  loadHistory();
});
</script>
