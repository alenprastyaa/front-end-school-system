<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">

    <main class="mx-auto mt-8 max-w-[1400px] space-y-6">
      <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div class="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Mata Pelajaran</label>
              <select v-model="filters.subjectId" @change="handleSubjectChange"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                <option value="">Semua Mapel</option>
                <option v-for="item in subjects" :key="item.id" :value="String(item.id)">
                  {{ item.name }} - {{ item.class_name }}
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Tugas</label>
              <select v-model="filters.assignmentId"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                <option value="">Semua Tugas</option>
                <option v-for="item in assignments" :key="item.id" :value="String(item.id)">
                  {{ item.title }}
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Status Penilaian</label>
              <select v-model="filters.gradeStatus"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                <option value="">Semua Status</option>
                <option value="graded">Sudah Dinilai</option>
                <option value="ungraded">Belum Dinilai</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe Tugas</label>
              <select v-model="filters.assignmentType"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                <option value="">Semua Tipe</option>
                <option value="FILE">Dokumen/File</option>
                <option value="MCQ">Pilihan Ganda</option>
                <option value="ESSAY">Esai</option>
                <option value="MANUAL">Ujian di Luar LMS</option>
              </select>
            </div>

            <div class="space-y-1.5 xl:col-span-1 sm:col-span-2 lg:col-span-4">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Cari Siswa</label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input v-model="filters.keyword" placeholder="Ketik nama siswa..."
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
              </div>
            </div>
          </div>

          <div class="flex flex-none gap-3 sm:w-auto">
            <button @click="refreshCurrent"
              class="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
            <button @click="downloadExcel" :disabled="sortedRows.length === 0"
              class="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </section>

      <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
        <div v-if="message || loadError"
          :class="isError || loadError ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'"
          class="flex items-center gap-3 rounded-xl p-4 text-sm font-medium ring-1 ring-inset">
          <svg v-if="isError || loadError" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ message || loadError }}
        </div>
      </Transition>

      <section
        class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div
          class="border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
          Tabel dibuat lebih ringkas. Gunakan <span class="font-semibold text-slate-700 dark:text-slate-200">Review
            Jawaban</span> untuk melihat detail isi jawaban dan catatan pelanggaran.
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-[1360px] w-full table-fixed text-left text-sm">
            <thead
              class="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th class="w-[220px] px-6 py-4 font-semibold"><button @click="handleSort('student_name')"
                    class="group flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">Siswa <span
                      class="text-slate-300 transition group-hover:text-slate-500">{{ sortIndicator('student_name')
                      }}</span></button></th>
                <th class="w-[250px] px-6 py-4 font-semibold"><button @click="handleSort('assignment_title')"
                    class="group flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">Tugas <span
                      class="text-slate-300 transition group-hover:text-slate-500">{{ sortIndicator('assignment_title')
                      }}</span></button></th>
                <th class="w-[180px] px-6 py-4 font-semibold">Hasil</th>
                <th class="w-[150px] px-6 py-4 font-semibold"><button @click="handleSort('submitted_at')"
                    class="group flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">Waktu Kumpul
                    <span class="text-slate-300 transition group-hover:text-slate-500">{{ sortIndicator('submitted_at')
                    }}</span></button></th>
                <th class="w-[140px] px-6 py-4 font-semibold"><button @click="handleSort('violation_count')"
                    class="group flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">Pelanggaran
                    <span class="text-slate-300 transition group-hover:text-slate-500">{{
                      sortIndicator('violation_count')
                    }}</span></button></th>
                <th class="w-[110px] px-6 py-4 font-semibold"><button @click="handleSort('score')"
                    class="group flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">Nilai <span
                      class="text-slate-300 transition group-hover:text-slate-500">{{ sortIndicator('score')
                      }}</span></button></th>
                <th class="w-[230px] px-6 py-4 font-semibold">Feedback Guru</th>
                <th class="w-[100px] px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="(row, index) in sortedRows" :key="`${row.assignment_id}-${row.id}-${index}`"
                class="group transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">

                <td class="px-6 py-4 align-top">
                  <div class="flex items-center gap-3">
                    <!-- <div
                      class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {{ row.student_name.charAt(0).toUpperCase() }}
                    </div> -->
                    <div class="min-w-0">
                      <div class="truncate font-medium text-slate-900 dark:text-white">{{ row.student_name }}</div>
                      <div class="truncate text-xs text-slate-500">{{ row.class_name }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 align-top">
                  <div class="line-clamp-2 font-medium leading-5 text-slate-900 dark:text-white">{{ row.assignment_title
                  }}</div>
                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <span :class="assignmentTypeBadgeClass(row.assignment_type)"
                      class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset">
                      {{ assignmentTypeLabel(row.assignment_type) }}
                    </span>
                    <span class="truncate text-xs text-slate-400">{{ row.subject_name }}</span>
                  </div>
                </td>

                <td class="px-6 py-4 align-top">
                  <button v-if="['MCQ', 'ESSAY'].includes(row.assignment_type)" @click="openReview(row)"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Review Jawaban
                  </button>
                  <a v-else-if="row.attachment_url" :href="normalizePublicUrl(row.attachment_url)" target="_blank" rel="noreferrer"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Buka File
                  </a>
                  <span v-else-if="row.assignment_type === 'MANUAL'"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                    Nilai Manual
                  </span>
                  <span v-else class="text-xs italic text-slate-400">Tidak ada lampiran</span>
                </td>

                <td class="px-6 py-4 align-top text-slate-500 dark:text-slate-400">
                  <div class="text-sm leading-5">{{ row.assignment_type === 'MANUAL' ? '-' :
                    formatDateTime(row.submitted_at) }}</div>
                  <div
                    v-if="row.assignment_type !== 'MANUAL' && row.due_date && row.submitted_at && new Date(row.submitted_at) > new Date(row.due_date)"
                    class="mt-1 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">
                    Terlambat</div>
                </td>

                <td class="px-6 py-4 align-top">
                  <div
                    :class="Number(row.violation_count || 0) > 0 ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'"
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
                    {{ Number(row.violation_count || 0) }} pelanggaran
                  </div>
                  <div v-if="row.violation_logs?.length" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {{ formatViolationLabel(row.violation_logs[0].violation_type) }}
                    <span v-if="row.violation_logs.length > 1">+{{ row.violation_logs.length - 1 }} lagi</span>
                  </div>
                </td>

                <td class="px-6 py-4 align-top">
                  <input v-model="row.scoreDraft" type="number" min="0" max="100" step="0.01" placeholder="0-100"
                    class="w-20 rounded-lg border-0 bg-slate-100/50 py-1.5 pl-3 pr-2 text-sm font-medium text-slate-900 ring-1 ring-inset ring-slate-200/50 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-500 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </td>

                <td class="px-6 py-4 align-top">
                  <input v-model="row.feedbackDraft" placeholder="Tulis catatan..."
                    class="w-full rounded-lg border-0 bg-slate-100/50 py-1.5 px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200/50 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-500 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </td>

                <td class="px-6 py-4 align-top text-right">
                  <button @click="submitGrade(row)"
                    class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                    Simpan
                  </button>
                </td>
              </tr>

              <tr v-if="filteredRows.length === 0">
                <td colspan="8" class="px-6 py-16 text-center">
                  <div class="mx-auto max-w-sm">
                    <div
                      class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Tidak ada data ditemukan</h3>
                    <p class="mt-1 text-sm text-slate-500">Ubah filter pencarian atau pastikan siswa telah mengumpulkan
                      tugas.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="reviewRow"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <div
          class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Review Hasil: {{ reviewRow.student_name }}
              </h2>
              <div class="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <span>{{ reviewRow.assignment_title }}</span>
                <span class="h-1 w-1 rounded-full bg-slate-300"></span>
                <span>{{ assignmentTypeLabel(reviewRow.assignment_type) }}</span>
                <span v-if="Number(reviewRow.violation_count || 0) > 0"
                  class="h-1 w-1 rounded-full bg-slate-300"></span>
                <span v-if="Number(reviewRow.violation_count || 0) > 0" class="text-amber-600 dark:text-amber-300">
                  {{ Number(reviewRow.violation_count || 0) }} pelanggaran
                </span>
              </div>
            </div>
            <button @click="reviewRow = null"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="reviewRow.violation_logs?.length"
              class="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
              <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-300">Catatan Pelanggaran</h3>
              <div class="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-200">
                <p v-for="log in reviewRow.violation_logs" :key="`review-violation-${log.id}`">
                  {{ formatViolationLabel(log.violation_type) }} • {{ formatDateTime(log.created_at) }}
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <article v-for="(item, index) in reviewItems" :key="`review-${index}`"
                class="rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/20">
                <div class="flex items-start justify-between gap-6">
                  <div class="space-y-3">
                    <p class="font-medium leading-relaxed text-slate-900 dark:text-white">
                      <span class="text-slate-400">{{ index + 1 }}.</span> {{ item.question }}
                    </p>
                    <div
                      class="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/5">
                      <p class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ item.answer }}</p>
                      <p v-if="item.extra" class="mt-2 text-xs text-slate-500">{{ item.extra }}</p>
                    </div>
                  </div>
                  <div v-if="reviewRow.assignment_type === 'MCQ'" class="flex-shrink-0">
                    <span
                      :class="item.isCorrect ? 'bg-emerald-100 text-emerald-700 ring-emerald-600/20' : 'bg-red-100 text-red-700 ring-red-600/20'"
                      class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset">
                      {{ item.isCorrect ? "Benar" : "Salah" }}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div class="border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
            <button @click="reviewRow = null"
              class="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500">
              Tutup Review
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import { formatDateTime } from "@/utils/date";
import { normalizePublicUrl } from "@/utils/url";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";
import { downloadExcelWorksheet } from "@/utils/excelExport";

const subjects = ref([]);
const assignments = ref([]);
const rows = ref([]);
const loadError = ref("");
const message = ref("");
const isError = ref(false);
const reviewRow = ref(null);
const tableSort = createSortState("submitted_at", "desc");

const filters = reactive({
  subjectId: "",
  assignmentId: "",
  gradeStatus: "",
  assignmentType: "",
  keyword: "",
});

const messageClass = computed(() =>
  isError.value
    ? "bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20"
    : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
);

const filteredRows = computed(() =>
  rows.value.filter((row) => {
    if (filters.assignmentId && String(row.assignment_id) !== filters.assignmentId) {
      return false;
    }

    if (filters.gradeStatus === "graded" && (row.score === null || row.score === undefined)) {
      return false;
    }

    if (filters.gradeStatus === "ungraded" && row.score !== null && row.score !== undefined) {
      return false;
    }

    if (filters.assignmentType && row.assignment_type !== filters.assignmentType) {
      return false;
    }

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      if (!row.student_name?.toLowerCase().includes(keyword)) {
        return false;
      }
    }

    return true;
  }),
);

const sortedRows = computed(() =>
  sortItems(filteredRows.value, tableSort, {
    assignment_type: (row) => row.assignment_type || "",
    feedback: (row) => row.feedback || "",
    score: (row) => row.score ?? -1,
    violation_count: (row) => Number(row.violation_count || 0),
  }),
);

const assignmentTypeLabel = (type) => {
  if (type === "MCQ") return "Quiz PG";
  if (type === "ESSAY") return "Quiz Essay";
  if (type === "MANUAL") return "Ujian di Luar LMS";
  return "Tugas File";
};

const assignmentTypeBadgeClass = (type) => {
  if (type === "MCQ") {
    return "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
  }

  if (type === "ESSAY") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }

  if (type === "MANUAL") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
};

const formatViolationLabel = (type) => {
  if (type === "FULLSCREEN_EXIT") return "Keluar fullscreen";
  if (type === "TAB_SWITCH") return "Pindah tab";
  if (type === "WINDOW_BLUR") return "Pindah fokus";
  return "Pelanggaran";
};

const reviewItems = computed(() => {
  if (!reviewRow.value || reviewRow.value.assignment_type === "FILE") {
    return [];
  }

  const questions = Array.isArray(reviewRow.value.quiz_payload) ? reviewRow.value.quiz_payload : [];
  const answers = Array.isArray(reviewRow.value.answer_payload) ? reviewRow.value.answer_payload : [];

  return questions.map((question, index) => {
    const answer = answers[index] || {};

    if (reviewRow.value.assignment_type === "MCQ") {
      const options = Array.isArray(question.options) ? question.options : [];
      const selectedIndex = Number(answer.selected_option);
      const correctIndex = Number(question.correct_option);
      const selectedText = Number.isInteger(selectedIndex) && options[selectedIndex] ? options[selectedIndex] : "Belum dijawab";
      const correctText = Number.isInteger(correctIndex) && options[correctIndex] ? options[correctIndex] : "-";

      return {
        question: question.question,
        answer: `Jawaban siswa: ${selectedText}`,
        extra: `Jawaban benar: ${correctText}`,
        isCorrect: selectedIndex === correctIndex,
      };
    }

    return {
      question: question.question,
      answer: answer.answer_text || "Belum ada jawaban essay.",
      extra: question.rubric ? `Rubrik: ${question.rubric}` : null,
      isCorrect: null,
    };
  });
});

const handleSort = (key) => {
  toggleSort(tableSort, key);
};

const sortIndicator = (key) => {
  if (tableSort.key !== key) {
    return "↕";
  }

  return tableSort.direction === "asc" ? "▲" : "▼";
};

const formatExcelDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const pad = (item) => String(item).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}-${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const buildExportFilename = () => {
  const subject = subjects.value.find((item) => String(item.id) === filters.subjectId);
  const date = new Date().toISOString().slice(0, 10);
  const subjectPart = `${subject?.name || "penilaian"}-${subject?.class_name || "kelas"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `penilaian-${subjectPart || "guru"}-${date}.xls`;
};

const downloadExcel = () => {
  const subject = subjects.value.find((item) => String(item.id) === filters.subjectId);
  const assignment = assignments.value.find((item) => String(item.id) === filters.assignmentId);
  const now = new Date();

  downloadExcelWorksheet({
    filename: buildExportFilename(),
    sheetName: "Penilaian Guru",
    title: "Rekap Penilaian Pembelajaran",
    subtitle: `Diunduh pada ${now.toLocaleString("id-ID")} | ${subject?.name || "Semua Mapel"}${subject?.class_name ? ` - ${subject.class_name}` : ""}`,
    summary: [
      { label: "Mapel", value: subject?.name || "Semua Mapel" },
      { label: "Kelas", value: subject?.class_name || "-" },
      { label: "Tugas", value: assignment?.title || "Semua Tugas" },
      {
        label: "Status Nilai",
        value: filters.gradeStatus === "graded"
          ? "Sudah dinilai"
          : filters.gradeStatus === "ungraded"
            ? "Belum dinilai"
            : "Semua",
      },
      { label: "Pencarian Siswa", value: filters.keyword || "-" },
      { label: "Total Baris", value: String(sortedRows.value.length) },
    ],
    columns: [
      { key: "subject_name", label: "Mapel" },
      { key: "class_name", label: "Kelas" },
      { key: "assignment_title", label: "Tugas" },
      { key: "student_name", label: "Siswa" },
      { key: "submitted_at", label: "Dikumpulkan", value: (row) => formatExcelDateTime(row.submitted_at) },
      { key: "violation_count", label: "Pelanggaran", value: (row) => Number(row.violation_count || 0) },
      { key: "score", label: "Nilai", value: (row) => row.scoreDraft === "" ? row.score ?? "-" : row.scoreDraft },
    ],
    rows: sortedRows.value,
  });
};

const openReview = (row) => {
  reviewRow.value = row;
};

const loadSubjects = async () => {
  const response = await api.get("/learning/subjects/teacher");
  subjects.value = response?.data || [];
};

const loadRowsForSubject = async (subjectId) => {
  if (!subjectId) {
    assignments.value = [];
    rows.value = [];
    return;
  }

  const assignmentResponse = await api.get(`/learning/subjects/${subjectId}/assignments`);
  const assignmentItems = assignmentResponse?.data || [];
  assignments.value = assignmentItems;

  const submissionResponses = await Promise.all(
    assignmentItems.map(async (assignment) => {
      const response = await api.get(`/learning/assignments/${assignment.id}/submissions`);
      return {
        assignment,
        submissions: response?.data || [],
      };
    }),
  );

  const subject = subjects.value.find((item) => String(item.id) === String(subjectId));
  rows.value = submissionResponses.flatMap(({ assignment, submissions }) =>
    submissions.map((submission) => ({
      ...submission,
      assignment_id: assignment.id,
      assignment_title: assignment.title,
      due_date: assignment.due_date,
      subject_name: subject?.name || "-",
      class_name: subject?.class_name || "-",
      scoreDraft: submission.score ?? "",
      feedbackDraft: submission.feedback ?? "",
    })),
  );
};

const handleSubjectChange = async () => {
  filters.assignmentId = "";
  reviewRow.value = null;
  loadError.value = "";

  try {
    await loadRowsForSubject(filters.subjectId);
  } catch (error) {
    loadError.value = error.message;
  }
};

const refreshCurrent = async () => {
  loadError.value = "";

  try {
    await loadSubjects();
    await loadRowsForSubject(filters.subjectId);
  } catch (error) {
    loadError.value = error.message;
  }
};

const submitGrade = async (row) => {
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post(`/learning/submissions/${row.id}/grade`, {
      score: row.scoreDraft === "" ? null : Number(row.scoreDraft),
      feedback: row.feedbackDraft || null,
    });

    row.score = row.scoreDraft === "" ? null : Number(row.scoreDraft);
    row.feedback = row.feedbackDraft || null;
    message.value = response?.message || "Nilai berhasil disimpan";
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  }
};

onMounted(async () => {
  try {
    await loadSubjects();
    if (subjects.value.length > 0) {
      filters.subjectId = String(subjects.value[0].id);
      await loadRowsForSubject(filters.subjectId);
    }
  } catch (error) {
    loadError.value = error.message;
  }
});
</script>
