<template>
  <div class="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-6">
      <section v-if="message" class="rounded-2xl px-5 py-4 text-sm font-medium ring-1 ring-inset"
        :class="messageType === 'error'
          ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20'
          : 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20'">
        {{ message }}
      </section>

      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pengumuman Sekolah</p>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Tulis draft, review, lalu post ke dashboard warga sekolah. Form pengumuman dibuka lewat modal agar halaman
              tetap bersih.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button type="button" @click="openCreateModal"
              class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
              Buat Pengumuman
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Review Draft</p>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Pastikan isi, target, dan nada pengumuman sudah sesuai sebelum Anda aktifkan.
          </p>
        </div>

        <div class="p-6">
          <div class="rounded-3xl border bg-gradient-to-br p-5" :class="reviewCardClass">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {{ selectedAnnouncement?.target_label || targetLabel(form.target_audience) }}
                </p>
                <h3 class="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  {{ selectedAnnouncement?.title || previewAnnouncement.title || "Judul belum diisi" }}
                </h3>
              </div>
              <span class="inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                :class="statusToneClass(selectedAnnouncement?.status || 'DRAFT')">
                {{ selectedAnnouncement?.status_label || "Draft" }}
              </span>
            </div>

            <p class="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-300">
              {{ selectedAnnouncement?.content || previewAnnouncement.content || "Isi pengumuman belum tersedia." }}
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                class="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-slate-700">
                {{ selectedAnnouncement?.target_label || targetLabel(form.target_audience) }}
              </span>
              <span
                class="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-slate-700">
                {{ selectedAnnouncement?.updated_at ? `Diperbarui ${formatDateTime(selectedAnnouncement.updated_at)}`
                  : "Belum disimpan" }}
              </span>
            </div>
          </div>

          <div v-if="selectedAnnouncement" class="mt-5 flex flex-wrap gap-3">
            <button v-if="selectedAnnouncement.status === 'DRAFT'" type="button"
              @click="publishAnnouncement(selectedAnnouncement)"
              :disabled="isBusyAnnouncementId === selectedAnnouncement.id"
              class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
              {{ isBusyAnnouncementId === selectedAnnouncement.id ? "Memposting..." : "Post Pengumuman" }}
            </button>
            <button v-if="selectedAnnouncement.status === 'ACTIVE'" type="button"
              @click="toggleAnnouncement(selectedAnnouncement)"
              :disabled="isBusyAnnouncementId === selectedAnnouncement.id"
              class="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50">
              {{ isBusyAnnouncementId === selectedAnnouncement.id ? "Memproses..." : "Matikan" }}
            </button>
            <button v-if="selectedAnnouncement.status === 'INACTIVE'" type="button"
              @click="toggleAnnouncement(selectedAnnouncement)"
              :disabled="isBusyAnnouncementId === selectedAnnouncement.id"
              class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50">
              {{ isBusyAnnouncementId === selectedAnnouncement.id ? "Memproses..." : "Aktifkan" }}
            </button>
          </div>

          <div v-else
            class="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700">
            Simpan draft terlebih dahulu untuk memunculkan kartu review yang bisa diposting.
          </div>
        </div>
      </section>

      <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div
          class="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-end lg:justify-between dark:border-slate-800">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Daftar Pengumuman</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola status draft, aktif, nonaktif, dan hapus
              dari satu tempat.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button v-for="filter in statusFilters" :key="filter.value" type="button"
              @click="activeFilter = filter.value"
              class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition"
              :class="activeFilter === filter.value
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'">
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th class="px-4 py-3 font-medium sm:px-6">Judul</th>
                <th class="px-4 py-3 font-medium sm:px-6">Target</th>
                <th class="px-4 py-3 font-medium sm:px-6">Status</th>
                <th class="px-4 py-3 font-medium sm:px-6">Updated</th>
                <th class="px-4 py-3 font-medium sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in filteredAnnouncements" :key="item.id"
                class="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                <td class="px-4 py-4 sm:px-6">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ item.title }}</div>
                  <div class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {{ item.content }}
                  </div>
                </td>
                <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.target_label }}</td>
                <td class="px-4 py-4 sm:px-6">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                    :class="statusToneClass(item.status)">
                    {{ item.status_label }}
                  </span>
                </td>
                <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ formatDateTime(item.updated_at) }}
                </td>
                <td class="px-4 py-4 sm:px-6">
                  <div class="flex flex-wrap justify-end gap-2">
                    <button type="button" @click="selectForReview(item)"
                      class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                      Review
                    </button>
                    <button v-if="item.status === 'DRAFT'" type="button" @click="publishAnnouncement(item)"
                      :disabled="isBusyAnnouncementId === item.id"
                      class="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-50 dark:border-emerald-500/30 dark:text-emerald-300">
                      Post
                    </button>
                    <button v-if="item.status === 'ACTIVE'" type="button" @click="toggleAnnouncement(item)"
                      :disabled="isBusyAnnouncementId === item.id"
                      class="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-700 disabled:opacity-50 dark:border-amber-500/30 dark:text-amber-300">
                      Matikan
                    </button>
                    <button v-if="item.status === 'INACTIVE'" type="button" @click="toggleAnnouncement(item)"
                      :disabled="isBusyAnnouncementId === item.id"
                      class="rounded-lg border border-sky-200 px-3 py-1.5 text-xs font-semibold text-sky-700 disabled:opacity-50 dark:border-sky-500/30 dark:text-sky-300">
                      Aktifkan
                    </button>
                    <button type="button" @click="editAnnouncement(item)"
                      class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                      Edit
                    </button>
                    <button type="button" @click="deleteAnnouncement(item)" :disabled="isBusyAnnouncementId === item.id"
                      class="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-300">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAnnouncements.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-slate-500 sm:px-6">Belum ada pengumuman yang cocok
                  dengan filter ini.</td>
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
              class="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
              <form @submit.prevent="submitAnnouncement" class="flex max-h-[90vh] flex-col">
                <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {{ editingId ? "Edit Draft" : "Buat Draft" }}</p>
                      <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{{ editingId ?
                        "Perbarui Pengumuman" : "Tulis Pengumuman Baru" }}</h2>
                      <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Draft akan disimpan dulu untuk direview sebelum diposting ke dashboard warga sekolah.
                      </p>
                    </div>
                    <button type="button"
                      class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      @click="closeFormModal">
                      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                  <div class="space-y-4">
                    <div>
                      <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Judul
                        Pengumuman</label>
                      <input v-model="form.title" type="text" required placeholder="Contoh: Jadwal UTS Semester Ganjil"
                        class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                    </div>

                    <div>
                      <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Ditujukan
                        Untuk</label>
                      <select v-model="form.target_audience"
                        class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                        <option v-for="option in targetOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Pilih satu target utama agar highlight
                        di dashboard lebih tepat.</p>
                    </div>

                    <div>
                      <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Isi
                        Pengumuman</label>
                      <textarea v-model="form.content" rows="10" required
                        placeholder="Tulis informasi pengumuman secara jelas, singkat, dan operasional."
                        class="block w-full rounded-2xl border-0 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                    </div>
                  </div>
                </div>

                <div
                  class="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                  <div class="text-xs text-slate-500 dark:text-slate-400">
                    {{ editingId ? `Perubahan akan menyimpan draft baru lalu Anda bisa post dari review.` : `Setelah
                    disimpan, draft dapat direview sebelum diposting.`}}
                  </div>
                  <div class="flex flex-wrap gap-3">
                    <button v-if="editingId || form.title || form.content" type="button" @click="resetForm"
                      class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                      Reset Form
                    </button>
                    <button type="button" @click="closeFormModal"
                      class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                      Batal
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                      class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50">
                      {{ isSubmitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Draft" }}
                    </button>
                  </div>
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
import { computed, onMounted, reactive, ref } from "vue";
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

const statusFilters = [
  { value: "ALL", label: "Semua" },
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "INACTIVE", label: "Nonaktif" },
];

const emptyForm = () => ({
  title: "",
  content: "",
  target_audience: "ALL",
});

const announcements = ref([]);
const selectedAnnouncement = ref(null);
const isLoading = ref(false);
const isSubmitting = ref(false);
const isBusyAnnouncementId = ref(null);
const isFormModalOpen = ref(false);
const editingId = ref(null);
const activeFilter = ref("ALL");
const message = ref("");
const messageType = ref("success");
const summary = reactive({
  total: 0,
  draft: 0,
  active: 0,
  inactive: 0,
});
const form = reactive(emptyForm());

const summaryCards = computed(() => [
  { label: "Total", value: summary.total, caption: "Semua pengumuman sekolah" },
  { label: "Draft", value: summary.draft, caption: "Menunggu review dan post" },
  { label: "Aktif", value: summary.active, caption: "Tampil di dashboard role" },
  { label: "Nonaktif", value: summary.inactive, caption: "Disimpan tapi tidak tampil" },
]);

const filteredAnnouncements = computed(() => {
  if (activeFilter.value === "ALL") {
    return announcements.value;
  }
  return announcements.value.filter((item) => String(item.status || "").toUpperCase() === activeFilter.value);
});

const previewAnnouncement = computed(() => ({
  title: form.title.trim() || "Judul belum diisi",
  content: form.content.trim() || "Isi pengumuman belum diisi.",
  target_audience: form.target_audience || "ALL",
  target_label: targetLabel(form.target_audience),
  status: "DRAFT",
  status_label: "Draft",
}));

const reviewSelection = computed(() => {
  if (!selectedAnnouncement.value) {
    return previewAnnouncement.value;
  }
  return selectedAnnouncement.value;
});

const reviewCardClass = computed(() => {
  const target = String(reviewSelection.value.target_audience || "ALL").toUpperCase();
  if (target === "ALL") return "border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 dark:border-sky-500/20 dark:from-slate-900 dark:to-slate-950";
  if (target === "GURU") return "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-500/20 dark:from-slate-900 dark:to-slate-950";
  if (target === "SISWA") return "border-indigo-200 bg-gradient-to-br from-indigo-50 to-sky-50 dark:border-indigo-500/20 dark:from-slate-900 dark:to-slate-950";
  if (target === "ADMIN") return "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-500/20 dark:from-slate-900 dark:to-slate-950";
  return "border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:border-slate-700 dark:from-slate-900 dark:to-slate-950";
});

const targetLabel = (value) => {
  const found = targetOptions.find((item) => item.value === String(value || "").toUpperCase());
  return found?.label || "Semua Warga Sekolah";
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
  selectedAnnouncement.value = null;
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
  form.target_audience = item.target_audience || "ALL";
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
  selectedAnnouncement.value = item;
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
    const payload = {
      title: form.title,
      content: form.content,
      target_audience: form.target_audience,
    };

    const response = editingId.value
      ? await api.put(`/announcements/${editingId.value}`, payload)
      : await api.post("/announcements/", payload);

    const item = response?.data?.item || null;
    if (item) {
      selectedAnnouncement.value = item;
      if (!editingId.value) {
        editingId.value = item.id;
      }
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
