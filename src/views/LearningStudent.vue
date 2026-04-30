<template>
  <div class="min-h-screen bg-slate-50/50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">

    <main class="mx-auto mt-8 max-w-[1440px]">

      <section class="mb-8">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Pilih Mata Pelajaran
          </h2>
          <button @click="loadSubjects"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh Data
          </button>
        </div>

        <div v-if="subjectError"
          class="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-300">
          {{ subjectError }}
        </div>

        <div
          class="flex flex-nowrap gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button v-for="item in subjects" :key="item.id" @click="selectSubject(item)"
            class="group relative flex min-w-[260px] flex-none snap-start flex-col items-start overflow-hidden rounded-2xl p-5 text-left transition-all"
            :class="selectedSubject?.id === item.id
              ? 'bg-emerald-600 shadow-md ring-1 ring-emerald-600 dark:bg-emerald-700'
              : 'bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80'">
            <span :class="selectedSubject?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'"
              class="font-bold tracking-tight text-lg">{{ item.name }}</span>
            <span :class="selectedSubject?.id === item.id ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'"
              class="mt-2 text-xs font-medium">
              Guru: {{ item.teacher_name }}
            </span>
            <div v-if="selectedSubject?.id === item.id"
              class="absolute right-5 top-5 h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
          </button>

          <div v-if="subjects.length === 0"
            class="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-8 dark:border-slate-800">
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada kelas terdaftar.</span>
          </div>
        </div>
      </section>

      <div>
        <div v-if="selectedSubject"
          class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">

          <div class="border-b border-slate-100 bg-slate-50/50 px-6 pt-6 dark:border-slate-800 dark:bg-slate-800/20">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ selectedSubject.name }}</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {{ selectedSubject.class_name }} &bull; {{ selectedSubject.description || "Tidak ada deskripsi mapel." }}
            </p>


            <nav class="-mb-px mt-6 flex gap-6 overflow-x-auto">
              <button @click="activeTab = 'materials'"
                class="border-b-2 py-3 text-sm font-bold transition-colors focus:outline-none" :class="activeTab === 'materials'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  ">
                Materi Pembelajaran
              </button>
              <button @click="activeTab = 'assignments'"
                class="border-b-2 py-3 text-sm font-bold transition-colors focus:outline-none flex items-center gap-2"
                :class="activeTab === 'assignments'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  ">
                Tugas File
                <span v-if="pendingAssignments > 0"
                  class="inline-flex items-center justify-center rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
                  {{ pendingAssignments }} Pending
                </span>
              </button>
            </nav>
          </div>

          <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="message"
              class="mx-6 mt-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium ring-1 ring-inset"
              :class="messageClass">
              <svg v-if="isError" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg v-else class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ message }}
            </div>
          </Transition>

          <div v-show="activeTab === 'materials'" class="p-6">
            <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <article v-for="item in materials" :key="item.id"
                class="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700">
                <div>
                  <div class="flex items-start justify-between gap-4">
                    <h3 class="font-bold text-slate-900 dark:text-white line-clamp-2">{{ item.title }}</h3>
                  </div>
                  <span class="mt-1 block text-xs font-medium text-slate-400">
                    Dipublikasikan: {{ formatDateTime(item.created_at) }}
                  </span>
                  <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                    {{ item.content || "Tidak ada deskripsi materi." }}
                  </p>
                </div>

                <div class="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                  <a v-if="item.attachment_url" :href="item.attachment_url" target="_blank" rel="noreferrer"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-emerald-700 shadow-sm ring-1 ring-inset ring-slate-200 transition hover:bg-emerald-50 hover:ring-emerald-200 dark:bg-slate-900 dark:text-emerald-400 dark:ring-slate-700 dark:hover:bg-emerald-500/10 dark:hover:ring-emerald-500/30">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Buka File Materi
                  </a>
                  <span v-else class="block text-center text-xs italic text-slate-400">Tanpa lampiran</span>
                </div>
              </article>

              <div v-if="materials.length === 0"
                class="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
                <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada materi pembelajaran
                  dipublikasikan.</span>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'assignments'" class="p-6">
            <div class="grid items-start gap-8 lg:grid-cols-12">

              <div class="flex flex-col gap-5 lg:col-span-7 xl:col-span-8">
                <article v-for="item in assignments" :key="item.id"
                  class="rounded-2xl border bg-white p-5 shadow-sm transition-all dark:bg-slate-900"
                  :class="submissionTarget?.id === item.id ? 'border-emerald-500 ring-1 ring-emerald-500 dark:border-emerald-500' : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'">
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex-1">
                      <h4 class="text-lg font-bold text-slate-900 dark:text-white">{{ item.title }}</h4>

                      <div class="mt-2.5 flex flex-wrap items-center gap-2">
                        <span
                          class="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Tenggat: {{ formatDateTime(item.due_date) }}
                        </span>

                        <span v-if="item.score !== null"
                          class="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                          Nilai: {{ item.score }} / 100
                        </span>
                        <span v-else-if="item.submission_id"
                          class="inline-flex items-center rounded-md bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 ring-1 ring-inset ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20">
                          Terkumpul (Menunggu Dinilai)
                        </span>
                        <span v-else
                          class="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
                          Belum Dikerjakan
                        </span>
                      </div>

                      <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {{ item.description || "Tidak ada instruksi tambahan." }}
                      </p>

                      <div v-if="item.feedback"
                        class="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                        <span class="font-bold text-slate-900 dark:text-white">📝 Catatan Guru:</span> {{ item.feedback
                        }}
                      </div>

                      <a v-if="item.attachment_url" :href="item.attachment_url" target="_blank" rel="noreferrer"
                        class="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Unduh Lampiran Soal
                      </a>
                    </div>

                    <div class="mt-4 sm:mt-0">
                      <button @click="startSubmission(item)"
                        class="w-full sm:w-auto rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition focus:outline-none"
                        :class="submissionTarget?.id === item.id
                          ? 'bg-emerald-600 text-white ring-1 ring-emerald-600 hover:bg-emerald-500'
                          : item.submission_id
                            ? 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700'
                            : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
                          ">
                        {{ submissionTarget?.id === item.id ? "Form Terbuka" : item.submission_id ? "Lihat Jawaban" :
                          "Kerjakan Tugas" }}
                      </button>
                    </div>
                  </div>
                </article>

                <div v-if="assignments.length === 0"
                  class="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-sm font-medium text-slate-500 dark:border-slate-800">
                  Belum ada tugas file.
                </div>
              </div>

              <aside
                class="sticky top-6 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-5 xl:col-span-4">
                <div
                  class="border-b border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <h3 class="font-extrabold text-slate-900 dark:text-white">Meja Pengumpulan</h3>
                  <p class="mt-1 truncate text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {{ submissionTarget?.title || "Pilih tugas untuk memulai." }}
                  </p>
                </div>

                <div class="p-5">
                  <form v-if="submissionTarget" @submit.prevent="submitAssignment" class="flex flex-col gap-5">
                    <div>
                      <label class="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">Teks Jawaban /
                        Catatan</label>
                      <textarea v-model="submissionForm.submission_text" rows="8"
                        placeholder="Ketik jawaban Anda di sini atau tambahkan catatan untuk guru..."
                        class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:bg-slate-900" />
                    </div>

                    <div>
                      <label class="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">Unggah File (Jika
                        diminta)</label>
                      <input type="file" @change="handleSubmissionFile"
                        class="block w-full text-sm text-slate-500 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-emerald-700 hover:file:bg-emerald-100 dark:text-slate-400 dark:file:bg-emerald-500/10 dark:file:text-emerald-400 dark:hover:file:bg-emerald-500/20" />
                    </div>

                    <button :disabled="isSubmitting"
                      class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60">
                      <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                        stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                      {{ isSubmitting ? "Mengirim Data..." : "Kirim / Perbarui Jawaban" }}
                    </button>
                  </form>

                  <div v-else class="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                    <svg class="mb-4 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Pilih tombol <strong
                        class="text-slate-700 dark:text-slate-300">Kerjakan Tugas</strong> pada daftar di sebelah kiri
                      untuk menampilkan form pengumpulan.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <div v-else
          class="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div class="rounded-full bg-emerald-50 p-5 dark:bg-emerald-500/10">
            <svg class="h-10 w-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0A50.57 50.57 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15h.008v.008H6.75V15zm0-2.25h.008v.008H6.75v-.008zm0-2.25h.008v.008H6.75V10.5zm0-2.25h.008v.008H6.75V8.25zm10.5 6.75h.008v.008h-.008V15zm0-2.25h.008v.008h-.008v-.008zm0-2.25h.008v.008h-.008V10.5zm0-2.25h.008v.008h-.008V8.25z" />
            </svg>
          </div>
          <h3 class="mt-5 text-xl font-bold text-slate-900 dark:text-white">Workspace Kosong</h3>
          <p class="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">Silakan pilih salah satu mata pelajaran
            dari panel geser di atas untuk mulai melihat materi dan mengerjakan tugas.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import { formatDateTime } from "@/utils/date";

const activeTab = ref("materials");
const subjects = ref([]);
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

const messageClass = computed(() =>
  isError.value ? "bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20" : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
);

const gradedAssignments = computed(() => assignments.value.filter((item) => item.score !== null && item.score !== undefined).length);
const pendingAssignments = computed(() => assignments.value.filter((item) => !item.submission_id).length);

const loadSubjects = async () => {
  subjectError.value = "";

  try {
    const response = await api.get("/learning/subjects/student");
    subjects.value = response?.data || [];
    if (!selectedSubject.value && subjects.value.length > 0) {
      await selectSubject(subjects.value[0]);
    }
  } catch (error) {
    subjectError.value = error.message;
  }
};

const loadSubjectData = async () => {
  if (!selectedSubject.value) return;

  const [materialResponse, assignmentResponse] = await Promise.all([
    api.get(`/learning/subjects/${selectedSubject.value.id}/materials`),
    api.get(`/learning/subjects/${selectedSubject.value.id}/assignments`),
  ]);

  materials.value = materialResponse?.data || [];
  assignments.value = (assignmentResponse?.data || []).filter((item) => item.assignment_type === "FILE");
};

const selectSubject = async (subject) => {
  selectedSubject.value = subject;
  submissionTarget.value = null;
  submissionForm.submission_text = "";
  submissionFile.value = null;
  message.value = "";
  activeTab.value = "materials";
  await loadSubjectData();
};

const startSubmission = (assignment) => {
  submissionTarget.value = assignment;
  submissionForm.submission_text = assignment.submission_text || "";
  submissionFile.value = null;
  message.value = "";
  // Scroll form pengumpulan agar terlihat penuh di layar HP atau Tablet
  if (window.innerWidth < 1024) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
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
    const formData = new FormData();
    formData.append("submission_text", submissionForm.submission_text || "");
    if (submissionFile.value) {
      formData.append("attachment", submissionFile.value);
    }

    const response = await api.post(`/learning/assignments/${submissionTarget.value.id}/submit`, formData);
    message.value = response?.message || "Tugas berhasil dikirim";
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadSubjects);
</script>
