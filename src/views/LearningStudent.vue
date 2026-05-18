<template>
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_36%),linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(241,245,249,0.9)_100%)] px-4 py-4 font-sans text-slate-900 md:px-8 md:py-8 dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_36%),linear-gradient(180deg,_rgba(2,6,23,1)_0%,_rgba(15,23,42,0.96)_100%)] dark:text-slate-100">
    <main class="mx-auto flex max-w-7xl flex-col gap-6">

      <section
        class="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-[10px] font-medium uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
              Pilihan Mapel
            </p>
            <h3 class="mt-1 text-base font-semibold text-slate-900 dark:text-white">
              Pilih mata pelajaran
            </h3>
          </div>
          <span
            class="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:inline-flex">
            {{ subjects.length }} mapel
          </span>
        </div>

        <div class="mt-4 md:hidden">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
              Geser untuk memilih mapel
            </p>
            <span class="text-[11px] font-medium text-slate-400">
              {{ subjects.length }} mapel
            </span>
          </div>

          <div
            class="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            <button
              v-for="item in subjects"
              :key="item.id"
              @click="selectSubject(item)"
              type="button"
              class="group relative flex min-w-[220px] max-w-[78vw] flex-none snap-start flex-col items-start overflow-hidden rounded-2xl border p-4 text-left transition-all"
              :class="selectedSubject?.id === item.id
                ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:hover:bg-slate-900'">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="line-clamp-2 text-sm font-medium tracking-tight sm:text-base sm:font-semibold">
                    {{ item.name }}
                  </p>
                  <p
                    class="mt-2 text-[11px] font-normal sm:text-xs sm:font-medium"
                    :class="selectedSubject?.id === item.id ? 'text-emerald-50/80' : 'text-slate-500 dark:text-slate-400'">
                    {{ item.class_name }}
                  </p>
                </div>
                <span
                  class="rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em]"
                  :class="selectedSubject?.id === item.id ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'">
                  {{ selectedSubject?.id === item.id ? "Aktif" : "Pilih" }}
                </span>
              </div>
              <p
                class="mt-4 line-clamp-2 text-[11px] font-normal leading-5 sm:text-xs"
                :class="selectedSubject?.id === item.id ? 'text-emerald-50/80' : 'text-slate-500 dark:text-slate-400'">
                {{ item.teacher_name || "Guru belum tercantum." }}
              </p>
            </button>

            <div v-if="subjects.length === 0"
              class="flex min-w-[220px] flex-none items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-4 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
              <span class="text-sm font-normal text-slate-500 dark:text-slate-400">Belum ada kelas terdaftar.</span>
            </div>
          </div>
        </div>

        <div class="mt-4 hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-3">
          <button v-for="item in subjects" :key="item.id" @click="selectSubject(item)" type="button"
            class="group relative overflow-hidden rounded-2xl border p-4 text-left transition-all"
            :class="selectedSubject?.id === item.id
              ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:hover:bg-slate-900'">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="line-clamp-2 text-sm font-semibold tracking-tight sm:text-base sm:font-bold">
                  {{ item.name }}
                </p>
                <p class="mt-2 text-[11px] font-normal sm:text-xs sm:font-medium"
                  :class="selectedSubject?.id === item.id ? 'text-emerald-50/80' : 'text-slate-500 dark:text-slate-400'">
                  {{ item.class_name }}
                </p>
              </div>
              <span class="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                :class="selectedSubject?.id === item.id ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'">
                {{ selectedSubject?.id === item.id ? "Aktif" : "Pilih" }}
              </span>
            </div>
            <p class="mt-4 line-clamp-2 text-[11px] font-normal leading-5 sm:text-xs"
              :class="selectedSubject?.id === item.id ? 'text-emerald-50/80' : 'text-slate-500 dark:text-slate-400'">
              {{ item.teacher_name || "Guru belum tercantum." }}
            </p>
          </button>
        </div>

        <div v-if="subjects.length === 0"
          class="mt-4 rounded-2xl border-2 border-dashed border-slate-200 py-10 text-center dark:border-slate-800">
          <span class="text-sm font-normal text-slate-500 dark:text-slate-400">Belum ada kelas terdaftar.</span>
        </div>
      </section>

      <section v-if="subjectError"
        class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
        {{ subjectError }}
      </section>

      <section v-if="message" class="rounded-2xl border p-4 text-sm font-medium"
        :class="isError ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'">
        {{ message }}
      </section>

      <section v-if="selectedSubject" class="space-y-4">
        <div class="flex items-end justify-between gap-3">
          <div>
            <p class="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Workspace
            </p>
            <h3 class="mt-1 text-base font-medium tracking-tight text-slate-900 dark:text-white sm:text-xl sm:font-black">
              {{ isAssignmentsMode ? "Daftar Tugas File" : "Daftar Materi" }}
            </h3>
          </div>
          <span v-if="isAssignmentsMode"
            class="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
            <span class="h-2 w-2 rounded-full bg-rose-500"></span>
            {{ pendingAssignments }} pending
          </span>
        </div>

        <div v-if="isMaterialsMode" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="item in materials" :key="item.id"
            class="flex h-full flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/30">
            <div>
              <div class="flex items-start justify-between gap-4">
                <h4 class="line-clamp-2 text-sm font-medium tracking-tight text-slate-900 dark:text-white sm:text-base sm:font-black">
                  {{ item.title }}
                </h4>
                <span
                  class="inline-flex shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Materi
                </span>
              </div>
              <p class="mt-2 text-[11px] font-normal text-slate-500 dark:text-slate-400 sm:text-xs">
                Dipublikasikan: {{ formatDateTime(item.created_at) }}
              </p>
              <p class="mt-4 line-clamp-4 text-[13px] font-normal leading-6 text-slate-600 dark:text-slate-400 sm:text-sm">
                {{ item.content || "Tidak ada deskripsi materi." }}
              </p>
            </div>

            <div class="mt-5 border-t border-slate-200/80 pt-4 dark:border-slate-800">
              <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                rel="noreferrer"
                class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Buka Lampiran
              </a>
              <span v-else class="block text-center text-xs font-normal text-slate-400">Tanpa lampiran</span>
            </div>
          </article>

          <div v-if="materials.length === 0"
            class="col-span-full rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
            <span class="text-sm font-normal text-slate-500 dark:text-slate-400">
              Belum ada materi pembelajaran dipublikasikan.
            </span>
          </div>
        </div>

        <div v-else class="grid gap-5 xl:grid-cols-2">
          <article v-for="item in assignments" :key="item.id"
            class="rounded-[1.5rem] border bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-slate-900"
            :class="submissionTarget?.id === item.id ? 'border-emerald-500 ring-1 ring-emerald-500 dark:border-emerald-500' : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'">
            <div class="flex flex-col gap-5">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                <h4 class="line-clamp-2 text-sm font-medium tracking-tight text-slate-900 dark:text-white sm:text-base sm:font-black">
                  {{ item.title }}
                </h4>
                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tenggat: {{ formatDateTime(item.due_date) }}
                    </span>
                    <span v-if="item.score !== null"
                      class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
                      Nilai: {{ item.score }} / 100
                    </span>
                    <span v-else-if="item.submission_id"
                      class="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20">
                      Terkumpul
                    </span>
                    <span v-else
                      class="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                      Belum Dikerjakan
                    </span>
                  </div>
                </div>
                <span
                  class="inline-flex shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  File
                </span>
              </div>

              <p class="text-[13px] font-normal leading-6 text-slate-600 dark:text-slate-400 sm:text-sm">
                {{ item.description || "Tidak ada instruksi tambahan." }}
              </p>

              <div v-if="item.feedback"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-normal text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                <span class="font-medium text-slate-900 dark:text-white">Catatan guru:</span> {{ item.feedback }}
              </div>

              <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Unduh Lampiran Soal
              </a>

              <div class="pt-1">
                <button @click="startSubmission(item)"
                  class="inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium shadow-sm transition focus:outline-none"
                  :class="submissionTarget?.id === item.id
                    ? 'bg-emerald-600 text-white ring-1 ring-emerald-600 hover:bg-emerald-500'
                    : item.submission_id
                      ? 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700'
                      : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'">
                  {{ submissionTarget?.id === item.id ? "Form Terbuka" : item.submission_id ? "Lihat Jawaban" :
                    "Kerjakan Tugas" }}
                </button>
              </div>
            </div>
          </article>

          <div v-if="assignments.length === 0"
            class="col-span-full rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-white py-16 text-center text-sm font-normal text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Belum ada tugas file.
          </div>
        </div>
      </section>

      <section v-else
        class="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/60">
        <div class="rounded-full bg-emerald-50 p-5 dark:bg-emerald-500/10">
          <svg class="h-10 w-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0A50.57 50.57 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15h.008v.008H6.75V15zm0-2.25h.008v.008H6.75v-.008zm0-2.25h.008v.008H6.75V10.5zm0-2.25h.008v.008H6.75V8.25zm10.5 6.75h.008v.008h-.008V15zm0-2.25h.008v.008h-.008v-.008zm0-2.25h.008v.008h-.008V10.5zm0-2.25h.008v.008h-.008V8.25z" />
          </svg>
        </div>
        <h3 class="mt-5 text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl sm:font-black">
          Workspace Kosong
        </h3>
        <p class="mt-2 max-w-md text-sm font-normal leading-6 text-slate-500 dark:text-slate-400">
          Silakan pilih salah satu mata pelajaran di atas untuk mulai melihat isi pembelajaran.
        </p>
      </section>
    </main>

    <transition name="fade">
      <div v-if="isAssignmentsMode && submissionTarget"
        class="fixed inset-0 z-[70] bg-slate-950/70 p-4 backdrop-blur-sm" @click.self="closeSubmissionModal">
        <div class="mx-auto mt-8 w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900">
          <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div>
              <h3 class="text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:font-black">Meja Pengumpulan</h3>
              <p class="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {{ submissionTarget?.title }}
              </p>
            </div>
            <button type="button"
              class="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              :disabled="isSubmitting" @click="closeSubmissionModal">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <form class="flex flex-col gap-5 p-5" @submit.prevent="submitAssignment">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Teks Jawaban / Catatan
              </label>
              <textarea v-model="submissionForm.submission_text" rows="8"
                placeholder="Ketik jawaban Anda di sini atau tambahkan catatan untuk guru..."
                class="block w-full rounded-2xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:bg-slate-900" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Unggah File (Jika diminta)
              </label>
              <input type="file" :disabled="isSubmitting" @change="handleSubmissionFile"
                class="block w-full text-sm text-slate-500 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-emerald-700 hover:file:bg-emerald-100 dark:text-slate-400 dark:file:bg-emerald-500/10 dark:file:text-emerald-400 dark:hover:file:bg-emerald-500/20" />
              <div v-if="submissionTarget?.submission_attachment_url"
                class="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                <span class="font-medium">File saat ini:</span>
                <a :href="normalizePublicUrl(submissionTarget.submission_attachment_url)" target="_blank"
                  rel="noreferrer" class="ml-1 font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                  Lihat file jawaban
                </a>
              </div>
            </div>

            <div class="mt-1 flex items-center justify-end gap-3">
              <button type="button" :disabled="isSubmitting"
                class="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-normal text-slate-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200"
                @click="closeSubmissionModal">
                Batal
              </button>
              <button :disabled="isSubmitting"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60">
                <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                {{ isSubmitting ? "Mengirim Data..." : "Kirim / Perbarui Jawaban" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDateTime } from "@/utils/date";
import { normalizePublicUrl } from "@/utils/url";
import { useMasterDataStore } from "@/store/masterData";

const props = defineProps({
  mode: {
    type: String,
    default: "materials",
  },
});

const route = useRoute();
const subjects = ref([]);
const masterDataStore = useMasterDataStore();
const selectedSubject = ref(null);
const materials = ref([]);
const assignments = ref([]);
const submissionTarget = ref(null);
const submissionFile = ref(null);
const isSubmitting = ref(false);
const subjectError = ref("");
const message = ref("");
const isError = ref(false);

const submissionForm = reactive({
  submission_text: "",
});

const isMaterialsMode = computed(() => props.mode !== "assignments");
const isAssignmentsMode = computed(() => props.mode === "assignments");
const pageTitle = computed(() => (isAssignmentsMode.value ? "Tugas File" : "Materi Pembelajaran"));
const pageSubtitle = computed(() => (
  isAssignmentsMode.value
    ? "Pilih mata pelajaran untuk melihat tugas file, status pengumpulan, dan kirim jawaban dalam satu halaman."
    : "Pilih mata pelajaran untuk membuka materi, membaca isi pembelajaran, dan mengunduh lampiran jika tersedia."
));
const pageEyebrow = computed(() => (isAssignmentsMode.value ? "Modul Siswa • Tugas File" : "Modul Siswa • Materi"));

const gradedAssignments = computed(() => assignments.value.filter((item) => item.score !== null && item.score !== undefined).length);
const pendingAssignments = computed(() => assignments.value.filter((item) => !item.submission_id).length);
const submittedAssignments = computed(() => assignments.value.filter((item) => item.submission_id).length);
const pageStats = computed(() => {
  if (isAssignmentsMode.value) {
    return [
      { label: "Tugas", value: assignments.value.length, caption: "Daftar tugas aktif", icon: "ph:file-text" },
      { label: "Pending", value: pendingAssignments.value, caption: "Belum dikerjakan", icon: "ph:clock-counter-clockwise" },
      { label: "Terkumpul", value: submittedAssignments.value, caption: "Sudah dikirim", icon: "ph:check-circle" },
    ];
  }

  return [
    { label: "Materi", value: materials.value.length, caption: "Dokumen tersedia", icon: "ph:books" },
    { label: "Lampiran", value: materials.value.filter((item) => Boolean(item.attachment_url)).length, caption: "Siap diunduh", icon: "ph:paperclip" },
    { label: "Mapel", value: subjects.value.length, caption: "Pilihan kelas", icon: "ph:student" },
  ];
});

const routeSubjectId = () => Number(route.query?.subject || route.query?.subject_id || 0);
const routeAssignmentId = () => Number(route.query?.assignment || route.query?.assignment_id || 0);

const loadSubjects = async () => {
  subjectError.value = "";

  try {
    subjects.value = await masterDataStore.getStudentSubjects();
    const requestedSubject = subjects.value.find((item) => Number(item.id) === routeSubjectId());
    if (requestedSubject) {
      await selectSubject(requestedSubject);
    } else if (!selectedSubject.value && subjects.value.length > 0) {
      await selectSubject(subjects.value[0]);
    }
  } catch (error) {
    subjectError.value = error.message;
  }
};

const loadSubjectData = async () => {
  if (!selectedSubject.value) return;

  const requests = [];

  if (isMaterialsMode.value) {
    requests.push(api.get(`/learning/subjects/${selectedSubject.value.id}/materials`));
  } else {
    materials.value = [];
  }

  if (isAssignmentsMode.value) {
    requests.push(api.get(`/learning/subjects/${selectedSubject.value.id}/assignments`));
  } else {
    assignments.value = [];
  }

  const responses = await Promise.all(requests);
  let responseIndex = 0;

  if (isMaterialsMode.value) {
    const materialResponse = responses[responseIndex];
    materials.value = materialResponse?.data || [];
    responseIndex += 1;
  }

  if (isAssignmentsMode.value) {
    const assignmentResponse = responses[responseIndex];
    assignments.value = (assignmentResponse?.data || []).filter((item) => item.assignment_type === "FILE");

    const requestedAssignmentId = routeAssignmentId();
    if (requestedAssignmentId) {
      const requestedAssignment = assignments.value.find((item) => Number(item.id) === requestedAssignmentId);
      if (requestedAssignment) {
        startSubmission(requestedAssignment);
      }
    }
  }
};

const selectSubject = async (subject) => {
  selectedSubject.value = subject;
  submissionTarget.value = null;
  submissionForm.submission_text = "";
  submissionFile.value = null;
  message.value = "";
  await loadSubjectData();
};

const handleSubjectChange = async (event) => {
  const nextSubjectId = Number(event?.target?.value || 0);
  const nextSubject = subjects.value.find((item) => Number(item.id) === nextSubjectId);
  if (!nextSubject) {
    return;
  }

  await selectSubject(nextSubject);
};

const startSubmission = (assignment) => {
  submissionTarget.value = assignment;
  submissionForm.submission_text = assignment.submission_text || "";
  submissionFile.value = null;
  message.value = "";
};

const closeSubmissionModal = () => {
  if (isSubmitting.value) return;
  submissionTarget.value = null;
  submissionForm.submission_text = "";
  submissionFile.value = null;
};

const handleSubmissionFile = (event) => {
  submissionFile.value = event.target.files?.[0] || null;
};

const submitAssignment = async () => {
  if (!submissionTarget.value) return;

  isSubmitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const payload = new FormData();
    payload.append("submission_text", submissionForm.submission_text || "");

    if (submissionFile.value) {
      payload.append("attachment", submissionFile.value);
    }

    const response = await api.post(`/learning/assignments/${submissionTarget.value.id}/submit`, payload);
    message.value = response?.message || "Tugas berhasil dikirim";
    await loadSubjectData();
    submissionTarget.value = null;
    submissionForm.submission_text = "";
    submissionFile.value = null;
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadSubjects);

watch(
  () => [route.query?.subject, route.query?.subject_id, route.query?.assignment, route.query?.assignment_id],
  () => {
    loadSubjects();
  },
);

watch(subjectError, (value) => {
  if (!value) return;
  pushToast({ title: "Gagal Memuat Pembelajaran", message: value, type: "error" });
});

watch(message, (value) => {
  if (!value) return;
  pushToast({
    title: isError.value ? "Pengumpulan Tugas Gagal" : "Pengumpulan Tugas Berhasil",
    message: value,
    type: isError.value ? "error" : "success",
  });
});
</script>
