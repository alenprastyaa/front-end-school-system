<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto mt-8 max-w-[1400px]">
      <section class="mb-8">
        <div class="flex flex-nowrap gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button v-for="item in subjects" :key="item.id" @click="selectSubject(item)"
            class="group relative flex min-w-[240px] flex-none snap-start flex-col items-start overflow-hidden rounded-2xl p-4 text-left transition-all"
            :class="selectedSubject?.id === item.id
              ? 'bg-sky-600 shadow-md ring-1 ring-sky-600 dark:bg-sky-500'
              : 'bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80'">
            <span :class="selectedSubject?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'"
              class="font-bold tracking-tight">{{ item.name }}</span>
            <span :class="selectedSubject?.id === item.id ? 'text-sky-200' : 'text-slate-500 dark:text-slate-400'"
              class="mt-1 text-xs font-medium">
              {{ item.class_name }}
            </span>
          </button>
        </div>
      </section>

      <div v-if="selectedSubject"
        class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="border-b border-slate-100 bg-slate-50/50 px-6 py-6 dark:border-slate-800 dark:bg-slate-800/20">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ selectedSubject.name }}</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{ selectedSubject.class_name }} &bull; {{ selectedSubject.description || "Tidak ada deskripsi." }}
          </p>
        </div>

        <div class="p-6">
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/40">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Task Ujian dari Admin</h3>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Pilih satu task, susun paket soalnya, lalu kirim kembali ke admin.
              </p>
            </div>

            <div class="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                  <tr>
                    <th class="px-4 py-3 font-semibold">Task</th>
                    <th class="px-4 py-3 font-semibold">Kategori</th>
                    <th class="px-4 py-3 font-semibold">Tipe</th>
                    <th class="px-4 py-3 font-semibold">Target</th>
                    <th class="px-4 py-3 font-semibold">Jadwal</th>
                    <th class="px-4 py-3 font-semibold">Status</th>
                    <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                  <tr v-for="item in examRequestAssignments" :key="item.id"
                    class="align-top transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    :class="Number(activeExamRequestId) === Number(item.id) ? 'bg-sky-50/70 dark:bg-sky-500/10' : ''">
                    <td class="px-4 py-3">
                      <p class="font-semibold text-slate-900 dark:text-white">{{ item.title }}</p>
                      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.exam_code }}</p>
                      <p class="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{{ item.description || "Tanpa catatan admin." }}</p>
                    </td>
                    <td class="px-4 py-3">
                      <span class="inline-flex rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">
                        {{ examCategoryLabel(item.exam_category) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {{ assignmentTypeLabel(item.assignment_type) }}
                    </td>
                    <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {{ item.exam_target_question_count || 0 }} soal
                    </td>
                    <td class="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                      <div>{{ formatDateTime(item.start_at) }}</div>
                      <div class="mt-1">{{ formatDateTime(item.due_date) }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <span class="inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
                        :class="examStatusBadgeClass(getEffectiveExamStatus(item))">
                        {{ examStatusLabel(getEffectiveExamStatus(item)) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <button v-if="getEffectiveExamStatus(item) === 'REQUESTED'" @click="selectExamRequest(item)"
                        class="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500">
                        {{ Number(activeExamRequestId) === Number(item.id) ? "Aktif" : "Pilih" }}
                      </button>
                      <span v-else class="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                        Sudah dikirim
                      </span>
                    </td>
                  </tr>
                  <tr v-if="examRequestAssignments.length === 0">
                    <td colspan="7" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                      Belum ada task ujian resmi dari admin untuk mapel ini.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section v-if="activeExamRequest" ref="composerSectionRef"
            class="mt-6 rounded-2xl border bg-white p-6 shadow-sm transition-all duration-500 dark:bg-slate-900"
            :class="isComposerHighlighted
              ? 'border-sky-300 ring-2 ring-sky-200 dark:border-sky-500 dark:ring-sky-500/20'
              : 'border-slate-200 dark:border-slate-800'">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Penyusunan Paket Ujian</h3>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Task aktif: {{ activeExamRequest.title }}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                  {{ assignmentTypeLabel(activeExamRequest.assignment_type) }}
                </span>
                <span class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Target {{ activeExamTargetQuestionCount }} soal
                </span>
                <span class="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Dipilih {{ selectedQuestionCount }} soal
                </span>
              </div>
            </div>

            <form @submit.prevent="submitExamPackageForAdmin" class="mt-6 space-y-5">
              <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Kode Task</div>
                    <div class="mt-1 text-sm font-bold text-slate-900 dark:text-white">{{ activeExamRequest.exam_code }}</div>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Jadwal</div>
                    <div class="mt-1 text-sm font-bold text-slate-900 dark:text-white">{{ formatDateTime(activeExamRequest.start_at) }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">s.d. {{ formatDateTime(activeExamRequest.due_date) }}</div>
                  </div>
                  <div class="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 shadow-sm dark:border-sky-500/20 dark:bg-sky-500/10">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Target Admin</div>
                    <div class="mt-1 text-sm font-bold text-sky-900 dark:text-sky-100">{{ activeExamTargetQuestionCount }} soal</div>
                  </div>
                  <div class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    <div class="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Dipilih</div>
                    <div class="mt-1 text-sm font-bold text-emerald-900 dark:text-emerald-100">{{ selectedQuestionCount }} soal</div>
                  </div>
                </div>
              </div>

              <div class="grid gap-5 xl:grid-cols-[320px,minmax(0,1fr)]">
                <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <h4 class="font-semibold text-slate-900 dark:text-white">Pengaturan Paket</h4>
                  <div class="mt-4 space-y-4">
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Durasi Sesi</label>
                      <input v-model="assignmentForm.question_duration_minutes" type="number" min="1" max="180"
                        class="block w-full rounded-xl border-0 bg-white py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700/50" />
                      <p class="text-xs text-slate-500 dark:text-slate-400">Isi dalam menit untuk satu sesi ujian.</p>
                    </div>

                    <label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                      <input v-model="assignmentForm.shuffle_questions" type="checkbox" class="mt-1" />
                      <div>
                        <p class="text-sm font-semibold text-slate-900 dark:text-white">Acak urutan soal</p>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Aktifkan jika paket yang dikirim ke admin perlu urutan soal acak.
                        </p>
                      </div>
                    </label>

                    <div class="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
                      Jumlah soal harus tepat <span class="font-bold">{{ activeExamTargetQuestionCount }}</span> sebelum paket dikirim.
                    </div>
                  </div>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <h4 class="font-semibold text-slate-900 dark:text-white">Soal Terpilih</h4>
                      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Preview soal yang akan ikut dalam paket ujian.</p>
                    </div>
                    <span class="inline-flex items-center justify-center rounded-full bg-sky-600 px-2.5 py-0.5 text-xs font-bold text-white">
                      {{ selectedQuestionCount }}
                    </span>
                  </div>
                  <div class="mt-3 flex max-h-[260px] flex-col gap-2 overflow-y-auto pr-1">
                    <article v-for="(item, idx) in selectedQuestionsForPublish" :key="item.id"
                      class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
                      <p class="text-slate-900 dark:text-white">
                        <span class="mr-2 text-slate-400">{{ idx + 1 }}.</span>{{ parseQuestionContent(item.question_text).question_text }}
                      </p>
                      <img v-if="parseQuestionContent(item.question_text).question_image_url"
                        :src="normalizePublicUrl(parseQuestionContent(item.question_text).question_image_url)"
                        alt="Gambar soal"
                        class="mt-3 max-h-40 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
                    </article>
                    <div v-if="selectedQuestionsForPublish.length === 0"
                      class="rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-700">
                      Belum ada soal yang dipilih dari bank soal.
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-sm text-slate-500 dark:text-slate-400">Periksa pengaturan dan jumlah soal sebelum mengirim paket.</p>
                <button :disabled="isSavingAssignment"
                  class="rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-50">
                  {{ isSavingAssignment ? "Mengirim..." : "Kirim Paket Soal ke Admin" }}
                </button>
              </div>
            </form>
          </section>

          <section v-if="activeExamRequest" ref="questionBankSectionRef" class="mt-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
            <div class="border-b border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div class="grid gap-4 md:grid-cols-4">
                <div class="relative md:col-span-2">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <input v-model="bankSearch" type="text" placeholder="Cari pertanyaan..."
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-9 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </div>
                <select v-model="bankTypeFilter"
                  :disabled="Boolean(activeExamRequest)"
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-3 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                  <option value="ALL">Semua Tipe Soal</option>
                  <option value="MCQ">Pilihan Ganda</option>
                  <option value="ESSAY">Essay</option>
                </select>
                <select v-model="bankPageSize"
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-3 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                  <option :value="10">Tampilkan 10 baris</option>
                  <option :value="20">Tampilkan 20 baris</option>
                  <option :value="50">Tampilkan 50 baris</option>
                </select>
              </div>
            </div>

            <div class="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/20 md:flex-row md:items-center md:justify-between">
              <div class="text-sm font-medium text-slate-500">
                Halaman <span class="text-slate-900 dark:text-white">{{ bankCurrentPage }}</span> dari {{ bankTotalPages }}
              </div>
              <div v-if="activeExamRequest" class="text-sm font-medium text-sky-700 dark:text-sky-300">
                Menampilkan soal tipe {{ assignmentTypeLabel(activeExamRequest.assignment_type) }} sesuai task aktif.
              </div>
              <div class="flex gap-2">
                <button @click="selectAllCurrentBankPage" class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-sky-50 dark:bg-slate-800 dark:text-sky-400 dark:ring-slate-700 dark:hover:bg-slate-700">
                  Pilih Semua Halaman Ini
                </button>
                <button @click="clearSelectedQuestions" v-if="assignmentForm.selected_question_bank_ids.length > 0"
                  class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                  Hapus Pilihan ({{ assignmentForm.selected_question_bank_ids.length }})
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-white text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900">
                  <tr>
                    <th class="w-12 px-5 py-4 font-semibold">Pilih</th>
                    <th class="px-5 py-4 font-semibold">Pertanyaan</th>
                    <th class="px-5 py-4 font-semibold">Tipe</th>
                    <th class="px-5 py-4 font-semibold">Penyusun</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                  <tr v-for="item in paginatedQuestionBank" :key="item.id" class="group transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td class="px-5 py-4 align-top">
                      <input v-model="assignmentForm.selected_question_bank_ids" type="checkbox" :value="item.id"
                        class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-600 dark:border-slate-600 dark:bg-slate-800" />
                    </td>
                    <td class="px-5 py-4">
                      <p class="max-w-3xl font-medium leading-relaxed text-slate-900 dark:text-white">
                        {{ parseQuestionContent(item.question_text).question_text }}
                      </p>
                      <img v-if="parseQuestionContent(item.question_text).question_image_url"
                        :src="normalizePublicUrl(parseQuestionContent(item.question_text).question_image_url)"
                        alt="Gambar soal"
                        class="mt-3 max-h-40 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
                      <p class="mt-1 text-xs text-slate-400">Dibuat: {{ formatDateTime(item.created_at) }}</p>
                    </td>
                    <td class="px-5 py-4 align-top">
                      <span class="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset"
                        :class="item.question_type === 'MCQ' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300' : 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300'">
                        {{ assignmentTypeLabel(item.question_type) }}
                      </span>
                    </td>
                    <td class="px-5 py-4 align-top text-slate-500 dark:text-slate-400">{{ item.created_by_name || "-" }}</td>
                  </tr>
                  <tr v-if="paginatedQuestionBank.length === 0">
                    <td colspan="4" class="px-5 py-12 text-center">
                      <div class="text-sm text-slate-500">
                        {{ activeExamRequest
                          ? `Belum ada soal ${assignmentTypeLabel(activeExamRequest.assignment_type)} yang cocok dengan pencarian.`
                          : "Tidak ada soal yang cocok dengan pencarian." }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch, reactive } from "vue";
import { api } from "@/api";
import { formatDateTime } from "@/utils/date";
import { pushToast } from "@/composables/useToast";
import { useTeacherStore } from "@/store/teacher";
import { useTeacherExamStore } from "@/store/teacherExam";
import { storeToRefs } from "pinia";
import { normalizePublicUrl } from "@/utils/url";

const teacherStore = useTeacherStore();
const examStore = useTeacherExamStore();
const { subjects } = storeToRefs(teacherStore);
const {
  selectedSubject,
  assignments,
  questionBank,
  questionBankTotal,
  subjectError,
  message,
  isError,
  isSavingAssignment,
  bankSearch,
  bankTypeFilter,
  bankPageSize,
  bankCurrentPage,
  activeExamRequestId,
} = storeToRefs(examStore);
const composerSectionRef = ref(null);
const questionBankSectionRef = ref(null);
const { isComposerHighlighted } = storeToRefs(examStore);
let composerHighlightTimeout = null;

const assignmentForm = examStore.assignmentForm;
assignmentForm.shuffle_questions = assignmentForm.shuffle_questions ?? false;
assignmentForm.question_duration_minutes = assignmentForm.question_duration_minutes ?? 10;
assignmentForm.selected_question_bank_ids = assignmentForm.selected_question_bank_ids || [];

const QUESTION_IMAGE_MARKER = "[[QUESTION_IMAGE_URL]]";

const parseQuestionContent = (rawText) => {
  const text = String(rawText || "");
  const markerIndex = text.lastIndexOf(QUESTION_IMAGE_MARKER);
  if (markerIndex < 0) {
    return {
      question_text: text.trim(),
      question_image_url: "",
    };
  }

  const questionPart = text.slice(0, markerIndex).trim();
  const imagePart = text.slice(markerIndex + QUESTION_IMAGE_MARKER.length).trim();
  return {
    question_text: questionPart,
    question_image_url: imagePart,
  };
};

const assignmentTypeLabel = (type) => {
  if (type === "MCQ") return "Pilihan Ganda";
  if (type === "ESSAY") return "Essay";
  return "Quiz";
};

const examCategoryLabel = (type) => {
  if (type === "UTS") return "UTS";
  if (type === "UAS") return "UAS";
  if (type === "UJIAN_SEKOLAH") return "Ujian Sekolah";
  if (type === "CUSTOM") return "Custom";
  return "Ujian";
};

const examStatusLabel = (status) => {
  if (status === "REQUESTED") return "Perlu Disusun Guru";
  if (status === "SUBMITTED") return "Menunggu Persetujuan Admin";
  if (status === "PUBLISHED") return "Sudah Diterbitkan";
  return status || "-";
};

const examStatusBadgeClass = (status) => {
  if (status === "REQUESTED") return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20";
  if (status === "SUBMITTED") return "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20";
  if (status === "PUBLISHED") return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20";
  return "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
};

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getEffectiveExamStatus = (item) => {
  const currentStatus = String(item?.effective_exam_status || item?.exam_status || "").toUpperCase();
  if (currentStatus === "PUBLISHED" || currentStatus === "SUBMITTED") {
    return currentStatus;
  }
  if (
    item?.exam_submitted_at
    || parseArrayField(item?.quiz_payload).length > 0
    || parseArrayField(item?.question_bank_ids).length > 0
  ) {
    return "SUBMITTED";
  }
  return currentStatus || "REQUESTED";
};

const formatDurationSeconds = (value) => {
  const totalSeconds = Number(value || 0);
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "-";
  const minutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${minutes} menit`;
};

const filteredQuestionBankForAssignment = computed(() =>
  questionBank.value.filter((item) => item.question_type === (activeExamRequest.value?.assignment_type || "MCQ")),
);

const selectedQuestionsForPublish = computed(() =>
  filteredQuestionBankForAssignment.value.filter((item) => assignmentForm.selected_question_bank_ids.includes(item.id)),
);

const selectedQuestionCount = computed(() => selectedQuestionsForPublish.value.length);
const paginatedQuestionBank = computed(() =>
  questionBank.value.filter((item) => !activeExamRequest.value || item.question_type === activeExamRequest.value.assignment_type),
);
const bankTotalPages = computed(() => Math.max(1, Math.ceil(questionBankTotal.value / Number(bankPageSize.value || 20))));

const examRequestAssignments = computed(() =>
  assignments.value.filter((item) => item.is_exam),
);

const activeExamRequest = computed(() =>
  examRequestAssignments.value.find((item) => Number(item.id) === Number(activeExamRequestId.value)) || null,
);
const activeExamTargetQuestionCount = computed(() => Math.max(0, Number(activeExamRequest.value?.exam_target_question_count || 0)));

watch([bankSearch, bankTypeFilter, bankPageSize], () => {
  bankCurrentPage.value = 1;
});

watch([bankSearch, bankTypeFilter, bankPageSize, bankCurrentPage], async () => {
  if (!selectedSubject.value) return;
  await loadSubjectData();
});

const clearSelectedQuestions = () => {
  assignmentForm.selected_question_bank_ids = [];
};

const selectAllCurrentBankPage = () => {
  const ids = paginatedQuestionBank.value.map((item) => item.id);
  assignmentForm.selected_question_bank_ids = Array.from(new Set([...assignmentForm.selected_question_bank_ids, ...ids]));
};

const resetAssignmentForm = () => {
  assignmentForm.shuffle_questions = false;
  assignmentForm.question_duration_minutes = 10;
  assignmentForm.selected_question_bank_ids = [];
};

const highlightComposerArea = () => {
  isComposerHighlighted.value = true;
  if (composerHighlightTimeout) {
    clearTimeout(composerHighlightTimeout);
  }

  composerHighlightTimeout = window.setTimeout(() => {
    isComposerHighlighted.value = false;
  }, 2200);
};

const scrollToComposerArea = async () => {
  await nextTick();

  const targetElement = composerSectionRef.value || questionBankSectionRef.value;
  if (targetElement?.scrollIntoView) {
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  highlightComposerArea();
};

const selectExamRequest = async (assignment) => {
  activeExamRequestId.value = assignment.id;
  bankTypeFilter.value = assignment.assignment_type || "ALL";
  bankCurrentPage.value = 1;
  assignmentForm.question_duration_minutes = Math.max(1, Math.round(Number(assignment.question_duration_seconds || 600) / 60));
  assignmentForm.shuffle_questions = false;
  assignmentForm.selected_question_bank_ids = [];
  await scrollToComposerArea();
};

const loadSubjects = async () => {
  subjectError.value = "";
  try {
    subjects.value = await teacherStore.loadTeacherSubjects();
    if (!selectedSubject.value && subjects.value.length > 0) {
      await selectSubject(subjects.value[0]);
    }
  } catch (error) {
    subjectError.value = error.message;
  }
};

const loadSubjectData = async () => {
  if (!selectedSubject.value) return;

  const [assignmentResponse, questionBankResponse] = await Promise.all([
    api.get(`/learning/subjects/${selectedSubject.value.id}/assignments`),
    api.get(`/learning/subjects/${selectedSubject.value.id}/question-bank`, {
      params: {
        keyword: bankSearch.value || "",
        question_type: activeExamRequest.value?.assignment_type || (bankTypeFilter.value === "ALL" ? "" : bankTypeFilter.value),
        page: bankCurrentPage.value,
        limit: bankPageSize.value,
      },
    }),
  ]);

  assignments.value = (assignmentResponse?.data || []).filter((item) => item.is_exam);
  questionBank.value = questionBankResponse?.data?.data || [];
  questionBankTotal.value = questionBankResponse?.data?.total || 0;
};

const selectSubject = async (subject) => {
  selectedSubject.value = subject;
  activeExamRequestId.value = null;
  message.value = "";
  bankSearch.value = "";
  bankTypeFilter.value = "ALL";
  bankCurrentPage.value = 1;
  resetAssignmentForm();
  await loadSubjectData();
};

const submitExamPackageForAdmin = async () => {
  if (!selectedSubject.value || !activeExamRequest.value) return;

  if (
    activeExamTargetQuestionCount.value > 0
    && assignmentForm.selected_question_bank_ids.length !== activeExamTargetQuestionCount.value
  ) {
    pushToast({
      title: "Jumlah Soal Belum Sesuai",
      message: `Admin meminta ${activeExamTargetQuestionCount.value} soal, tetapi Anda baru memilih ${assignmentForm.selected_question_bank_ids.length} soal.`,
      type: "error",
      duration: 4200,
    });
    return;
  }

  isSavingAssignment.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post(`/learning/assignments/${activeExamRequest.value.id}/exam-package`, {
      question_bank_ids: assignmentForm.selected_question_bank_ids,
      shuffle_questions: Boolean(assignmentForm.shuffle_questions),
      question_duration_seconds: (Number(assignmentForm.question_duration_minutes) || 0) * 60,
    });
    message.value = response?.message || "Paket ujian berhasil dikirim ke admin";
    pushToast({
      title: "Paket Ujian Terkirim",
      message: response?.message || "Paket ujian berhasil dikirim ke admin.",
      type: "success",
      duration: 4200,
    });
    assignments.value = assignments.value.map((item) =>
      Number(item.id) === Number(activeExamRequest.value?.id)
        ? {
          ...item,
          exam_status: "SUBMITTED",
          effective_exam_status: "SUBMITTED",
          exam_submitted_at: new Date().toISOString(),
          question_bank_ids: JSON.stringify([...assignmentForm.selected_question_bank_ids]),
        }
        : item,
    );
    activeExamRequestId.value = null;
    resetAssignmentForm();
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Gagal Mengirim Paket Ujian",
      message: error.message,
      type: "error",
      duration: 4200,
    });
  } finally {
    isSavingAssignment.value = false;
  }
};

onMounted(loadSubjects);

watch(subjectError, (value) => {
  if (!value) return;
  pushToast({ title: "Gagal Memuat Ujian", message: value, type: "error" });
});

watch(message, (value) => {
  if (!value) return;
  pushToast({
    title: isError.value ? "Paket Ujian Gagal" : "Paket Ujian Berhasil",
    message: value,
    type: isError.value ? "error" : "success",
  });
});
</script>
