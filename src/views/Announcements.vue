<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Pengumuman</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola dan publikasikan informasi sekolah</p>
        </div>
        <button type="button" @click="openCreateModal"
          class="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
          </svg>
          Buat Pengumuman
        </button>
      </header>

      <section class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div v-for="card in summaryCards" :key="card.label"
          class="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ card.label }}</p>
          <p class="mt-1 text-2xl font-bold tabular-nums">{{ card.value }}</p>
        </div>
      </section>

      <section v-if="selectedAnnouncement"
        class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="truncate text-lg font-bold">{{ selectedAnnouncement.title }}</h2>
              <span class="inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase"
                :class="statusToneClass(selectedAnnouncement.status)">
                {{ selectedAnnouncement.status_label }}
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {{ selectedAnnouncement.target_label }} &middot;
              {{ announcementExpiryLabel(selectedAnnouncement) }} &middot;
              Diperbarui {{ formatDateTime(selectedAnnouncement.updated_at) }}
            </p>
          </div>
          <button type="button" @click="selectedAnnouncement = null"
            class="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div class="px-6 py-4">
          <p class="whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-300">
            {{ selectedAnnouncement.content }}
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button v-if="selectedAnnouncement.status === 'DRAFT'" type="button"
              @click="publishAnnouncement(selectedAnnouncement)"
              :disabled="isBusyAnnouncementId === selectedAnnouncement.id"
              class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
              {{ isBusyAnnouncementId === selectedAnnouncement.id ? "Memposting..." : "Post" }}
            </button>
            <button v-else type="button" @click="toggleAnnouncement(selectedAnnouncement)"
              :disabled="isBusyAnnouncementId === selectedAnnouncement.id"
              class="rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
              :class="selectedAnnouncement.status === 'ACTIVE'
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-sky-600 hover:bg-sky-500'">
              {{ isBusyAnnouncementId === selectedAnnouncement.id
                ? "Memproses..."
                : selectedAnnouncement.status === 'ACTIVE' ? "Nonaktifkan" : "Aktifkan" }}
            </button>
            <button type="button" @click="editAnnouncement(selectedAnnouncement)"
              class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Edit
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 class="text-base font-bold">Daftar Pengumuman</h2>
          <div class="flex flex-wrap gap-1.5">
            <button v-for="filter in statusFilters" :key="filter.value" type="button"
              @click="activeFilter = filter.value"
              class="rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
              :class="activeFilter === filter.value
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'">
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              <tr>
                <th class="px-6 py-3 font-semibold">Judul</th>
                <th class="px-6 py-3 font-semibold">Target</th>
                <th class="px-6 py-3 font-semibold">Status</th>
                <th class="px-6 py-3 font-semibold">Diperbarui</th>
                <th class="px-6 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <template v-if="isLoading && !filteredAnnouncements.length">
                <tr v-for="n in 6" :key="`ann-sk-${n}`">
                  <td v-for="c in 4" :key="`ann-sk-${n}-${c}`" class="px-6 py-4">
                    <div class="skeleton-shimmer h-4 rounded" :class="c === 1 ? 'w-48' : 'w-20'"></div>
                  </td>
                </tr>
              </template>
              <tr v-for="item in filteredAnnouncements" :key="item.id" @click="selectForReview(item)"
                class="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                :class="selectedAnnouncement?.id === item.id ? 'bg-sky-50/60 dark:bg-sky-500/5' : ''">
                <td class="max-w-xs px-6 py-4">
                  <div class="truncate font-semibold">{{ item.title }}</div>
                  <div class="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{{ item.content }}</div>
                </td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.target_label }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase"
                    :class="statusToneClass(item.status)">
                    {{ item.status_label }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                  {{ formatDateTime(item.updated_at) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-end gap-1" @click.stop>
                    <button v-if="item.status === 'DRAFT'" type="button" @click="publishAnnouncement(item)"
                      :disabled="isBusyAnnouncementId === item.id" title="Post"
                      class="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                      Post
                    </button>
                    <button v-else type="button" @click="toggleAnnouncement(item)"
                      :disabled="isBusyAnnouncementId === item.id"
                      class="rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50"
                      :class="item.status === 'ACTIVE'
                        ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10'
                        : 'text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-500/10'">
                      {{ item.status === 'ACTIVE' ? "Nonaktifkan" : "Aktifkan" }}
                    </button>
                    <button type="button" @click="editAnnouncement(item)"
                      class="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                      Edit
                    </button>
                    <button type="button" @click="deleteAnnouncement(item)" :disabled="isBusyAnnouncementId === item.id"
                      class="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-500/10">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!isLoading && filteredAnnouncements.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                  {{ isLoading ? "Memuat..." : "Belum ada pengumuman" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <teleport to="body">
        <transition name="fade-scale">
          <div v-if="isFormModalOpen"
            class="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            @click.self="onFormBackdropClick">
            <div
              class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
              <form @submit.prevent="submitAnnouncement" class="flex max-h-[90vh] flex-col">
                <div
                  class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                  <h2 class="text-lg font-bold">{{ editingId ? "Edit Pengumuman" : "Pengumuman Baru" }}</h2>
                  <button type="button" @click="closeFormModal"
                    class="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>

                <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Judul</label>
                    <input v-model="form.title" type="text" required placeholder="Judul pengumuman"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Target</label>
                    <div class="flex flex-wrap gap-2">
                      <button v-for="option in targetOptions" :key="option.value" type="button"
                        @click="toggleTargetAudience(option.value)"
                        class="rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
                        :class="isTargetChecked(option.value)
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'">
                        {{ option.label }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Isi</label>
                    <textarea v-model="form.content" rows="8" required placeholder="Tulis isi pengumuman"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm leading-6 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Berakhir Pada
                      <span class="font-normal text-slate-400">(opsional)</span>
                    </label>
                    <input v-model="form.deactivated_at" type="datetime-local"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                </div>

                <div class="flex justify-end gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                  <button type="button" @click="closeFormModal"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    Batal
                  </button>
                  <button type="submit" :disabled="isSubmitting"
                    class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50">
                    {{ isSubmitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Draft" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </transition>
      </teleport>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDateTime } from "@/utils/date";

const targetOptions = [
  { value: "ALL", label: "Semua Warga Sekolah" },
  { value: "ADMIN", label: "Admin" },
  { value: "GURU", label: "Guru" },
  { value: "SISWA", label: "Siswa" },
  { value: "SARPRAS", label: "Sarpras" },
  { value: "KOPERASI", label: "Koperasi" },
];
const targetRoleValues = targetOptions.filter((item) => item.value !== "ALL").map((item) => item.value);
const route = useRoute();

const statusFilters = [
  { value: "ALL", label: "Semua" },
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "INACTIVE", label: "Nonaktif" },
];

const emptyForm = () => ({
  title: "",
  content: "",
  target_audiences: ["ALL"],
  deactivated_at: "",
});

const announcements = ref([]);
const selectedAnnouncement = ref(null);
const isLoading = ref(false);
const isSubmitting = ref(false);
const isBusyAnnouncementId = ref(null);
const isFormModalOpen = ref(false);
const editingId = ref(null);
const activeFilter = ref("ALL");
const summary = reactive({
  total: 0,
  draft: 0,
  active: 0,
  inactive: 0,
});
const form = reactive(emptyForm());

const syncRouteSelection = () => {
  const targetId = Number(route.query?.announcement || route.query?.announcement_id || 0);
  if (!targetId) {
    return;
  }

  const match = announcements.value.find((item) => Number(item.id) === targetId);
  if (match) {
    selectedAnnouncement.value = match;
  }
};

const summaryCards = computed(() => [
  { label: "Total", value: summary.total },
  { label: "Draft", value: summary.draft },
  { label: "Aktif", value: summary.active },
  { label: "Nonaktif", value: summary.inactive },
]);

const filteredAnnouncements = computed(() => {
  if (activeFilter.value === "ALL") {
    return announcements.value;
  }
  return announcements.value.filter((item) => String(item.status || "").toUpperCase() === activeFilter.value);
});

const splitTargetAudience = (value) => String(value || "")
  .split(",")
  .map((item) => item.trim().toUpperCase())
  .filter(Boolean);

const normalizeTargetAudiences = (value) => {
  const rawValues = Array.isArray(value) ? value.flatMap((item) => splitTargetAudience(item)) : splitTargetAudience(value);
  const normalized = [];

  rawValues.forEach((item) => {
    if (item === "ALL") {
      normalized.splice(0, normalized.length, "ALL");
      return;
    }
    if (normalized.includes("ALL") || !targetRoleValues.includes(item) || normalized.includes(item)) {
      return;
    }
    normalized.push(item);
  });

  return normalized.length ? normalized : ["ALL"];
};

const targetAudienceString = (value) => {
  const normalized = normalizeTargetAudiences(value);
  return normalized.includes("ALL") ? "ALL" : normalized.join(",");
};

const isTargetChecked = (value) => normalizeTargetAudiences(form.target_audiences).includes(value);

const toggleTargetAudience = (value) => {
  const target = String(value || "").trim().toUpperCase();
  if (target === "ALL") {
    form.target_audiences = ["ALL"];
    return;
  }
  if (!targetRoleValues.includes(target)) {
    return;
  }

  let next = normalizeTargetAudiences(form.target_audiences).filter((item) => item !== "ALL");
  if (next.includes(target)) {
    next = next.filter((item) => item !== target);
  } else {
    next.push(target);
  }
  form.target_audiences = next.length ? next : ["ALL"];
};

const formatDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const announcementExpiryLabel = (item) => {
  const value = item?.deactivated_at || "";
  if (!value) return "Tanpa batas akhir";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanpa batas akhir";
  return `Berakhir ${formatDateTime(value)}`;
};

const statusToneClass = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    case "DRAFT":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
    case "INACTIVE":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
};

const resetForm = () => {
  Object.assign(form, emptyForm());
  editingId.value = null;
};

const closeFormModal = () => {
  isFormModalOpen.value = false;
};

const openCreateModal = () => {
  resetForm();
  isFormModalOpen.value = true;
};

const openEditModal = (item) => {
  editingId.value = item.id;
  form.title = item.title || "";
  form.content = item.content || "";
  form.target_audiences = normalizeTargetAudiences(item.target_audiences || item.target_audience || "ALL");
  form.deactivated_at = formatDateTimeLocal(item.deactivated_at || "");
  selectedAnnouncement.value = item;
  isFormModalOpen.value = true;
};

const loadAnnouncements = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/announcements/");
    announcements.value = Array.isArray(response?.data?.items) ? response.data.items : [];
    const responseSummary = response?.data?.summary || {};
    summary.total = Number(responseSummary.total || 0);
    summary.draft = Number(responseSummary.draft || 0);
    summary.active = Number(responseSummary.active || 0);
    summary.inactive = Number(responseSummary.inactive || 0);

    if (selectedAnnouncement.value) {
      const latest = announcements.value.find((item) => item.id === selectedAnnouncement.value.id);
      selectedAnnouncement.value = latest || selectedAnnouncement.value;
    }

    syncRouteSelection();
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Pengumuman",
      message: error.message || "Data pengumuman tidak dapat dimuat.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const selectForReview = (item) => {
  selectedAnnouncement.value = selectedAnnouncement.value?.id === item.id ? null : item;
};

const editAnnouncement = (item) => {
  openEditModal(item);
};

const submitAnnouncement = async () => {
  if (!form.title.trim() || !form.content.trim()) {
    pushToast({
      title: "Validasi Gagal",
      message: "Judul dan isi pengumuman wajib diisi.",
      type: "error",
    });
    return;
  }

  const wasEditing = Boolean(editingId.value);
  isSubmitting.value = true;
  try {
    const targetAudiences = normalizeTargetAudiences(form.target_audiences);
    const payload = {
      title: form.title,
      content: form.content,
      target_audience: targetAudienceString(targetAudiences),
      target_audiences: targetAudiences,
      deactivated_at: form.deactivated_at || null,
    };

    const response = editingId.value
      ? await api.put(`/announcements/${editingId.value}`, payload)
      : await api.post("/announcements/", payload);

    const item = response?.data?.item || null;
    if (item) {
      selectedAnnouncement.value = item;
    }

    pushToast({
      title: wasEditing ? "Draft Diperbarui" : "Draft Disimpan",
      message: response?.message || "Draft pengumuman berhasil disimpan.",
      type: "success",
    });
    editingId.value = null;
    closeFormModal();
    await loadAnnouncements();
  } catch (error) {
    pushToast({
      title: wasEditing ? "Gagal Memperbarui" : "Gagal Menyimpan Draft",
      message: error.message || "Pengumuman tidak dapat disimpan.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const publishAnnouncement = async (item) => {
  if (!item?.id) return;
  isBusyAnnouncementId.value = item.id;
  try {
    const response = await api.post(`/announcements/${item.id}/publish`);
    const updated = response?.data?.item || null;
    if (updated) {
      selectedAnnouncement.value = updated;
    }
    pushToast({
      title: "Pengumuman Diposting",
      message: response?.message || "Pengumuman berhasil diposting ke dashboard.",
      type: "success",
    });
    await loadAnnouncements();
  } catch (error) {
    pushToast({
      title: "Gagal Memposting",
      message: error.message || "Pengumuman tidak berhasil diposting.",
      type: "error",
    });
  } finally {
    isBusyAnnouncementId.value = null;
  }
};

const toggleAnnouncement = async (item) => {
  if (!item?.id) return;
  isBusyAnnouncementId.value = item.id;
  try {
    const response = await api.post(`/announcements/${item.id}/toggle`);
    const updated = response?.data?.item || null;
    if (updated) {
      selectedAnnouncement.value = updated;
    }
    pushToast({
      title: "Status Diperbarui",
      message: response?.message || "Status pengumuman berhasil diperbarui.",
      type: "success",
    });
    await loadAnnouncements();
  } catch (error) {
    pushToast({
      title: "Gagal Mengubah Status",
      message: error.message || "Status pengumuman tidak dapat diubah.",
      type: "error",
    });
  } finally {
    isBusyAnnouncementId.value = null;
  }
};

const deleteAnnouncement = async (item) => {
  if (!item?.id) return;
  if (!window.confirm(`Hapus pengumuman "${item.title}"?`)) return;

  isBusyAnnouncementId.value = item.id;
  try {
    const response = await api.delete(`/announcements/${item.id}`);
    if (selectedAnnouncement.value?.id === item.id) {
      selectedAnnouncement.value = null;
    }
    if (editingId.value === item.id) {
      resetForm();
    }
    pushToast({
      title: "Pengumuman Dihapus",
      message: response?.message || "Pengumuman berhasil dihapus.",
      type: "success",
    });
    await loadAnnouncements();
  } catch (error) {
    pushToast({
      title: "Gagal Menghapus",
      message: error.message || "Pengumuman tidak berhasil dihapus.",
      type: "error",
    });
  } finally {
    isBusyAnnouncementId.value = null;
  }
};

const onFormBackdropClick = () => {
  if (!isSubmitting.value) {
    closeFormModal();
  }
};

onMounted(loadAnnouncements);

watch(
  () => route.query?.announcement || route.query?.announcement_id,
  () => {
    syncRouteSelection();
  },
);
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.985);
}
</style>
