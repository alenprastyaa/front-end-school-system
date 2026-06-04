<template>
  <div class="learning-grades-teacher-page min-h-screen bg-slate-50 p-2 font-sans text-slate-900 sm:p-4 md:p-6 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-3 sm:space-y-4">
      <!-- Header -->
      <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Penilaian Siswa</h1>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:mt-1 sm:text-sm">Tinjau jawaban dan beri nilai tugas siswa.</p>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button @click="refreshCurrent"
            class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:h-10 sm:rounded-xl sm:px-3.5 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span class="hidden sm:inline">Refresh</span>
          </button>
          <button @click="downloadExcel" :disabled="sortedRows.length === 0"
            class="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:rounded-xl sm:px-4 sm:text-sm">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>
        </div>
      </header>

      <!-- Filters -->
      <section class="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 sm:rounded-2xl sm:p-4 dark:bg-slate-900 dark:ring-white/10 md:p-5">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Mata Pelajaran</label>
            <select v-model="filters.subjectId" @change="handleSubjectChange" :class="fieldClass">
              <option value="">Pilih mata pelajaran</option>
              <option v-for="item in subjects" :key="item.id" :value="String(item.id)">
                {{ item.name }} - {{ item.class_name }}
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Cari Siswa</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input v-model="filters.keyword" placeholder="Ketik nama siswa..."
                class="block h-10 w-full rounded-lg border-0 bg-slate-50 pl-10 pr-3 text-xs text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:h-11 sm:rounded-xl sm:pr-4 sm:text-sm dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-3">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Tugas</label>
            <select v-model="filters.assignmentId" :class="fieldClass">
              <option value="">Semua tugas</option>
              <option v-for="item in assignments" :key="item.id" :value="String(item.id)">{{ item.title }}</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Status Penilaian</label>
            <select v-model="filters.gradeStatus" :class="fieldClass">
              <option value="">Semua status</option>
              <option value="graded">Sudah dinilai</option>
              <option value="ungraded">Belum dinilai</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Tipe Tugas</label>
            <select v-model="filters.assignmentType" :class="fieldClass">
              <option value="">Semua tipe</option>
              <option value="FILE">Dokumen/File</option>
              <option value="MCQ">Pilihan Ganda</option>
              <option value="ESSAY">Esai</option>
              <option value="MANUAL">Ujian di Luar LMS</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Charts Dashboard -->
      <section v-if="gradedData.length > 0" class="hidden grid-cols-1 gap-3 md:grid lg:grid-cols-2">
        <!-- Rata-rata per Tugas (Line) -->
        <div class="col-span-1 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10 lg:col-span-2">
          <VueApexCharts type="line" height="220" :options="averageChartOptions" :series="averagePerAssignmentSeries" />
        </div>
        <!-- Distribusi Nilai (Bar) -->
        <div class="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <VueApexCharts type="bar" height="240" :options="distributionChartOptions" :series="distributionChartSeries" />
        </div>
        <!-- Siswa (Horizontal Bar) -->
        <div class="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <VueApexCharts type="bar" height="240" :options="studentChartOptions" :series="studentScoreSeries" />
        </div>
      </section>

      <!-- Data -->
      <section class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-2xl dark:bg-slate-900 dark:ring-white/10">
        <!-- Desktop table -->
        <div class="hidden overflow-x-auto lg:block">
          <table class="w-full table-fixed text-left text-sm">
            <thead class="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th class="w-[22%] px-5 py-3.5 font-semibold">
                  <button @click="handleSort('student_name')" class="group inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                    Siswa <span class="text-slate-300 group-hover:text-slate-500">{{ sortIndicator('student_name') }}</span>
                  </button>
                </th>
                <th class="w-[34%] px-5 py-3.5 font-semibold">
                  <button @click="handleSort('assignment_title')" class="group inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                    Tugas <span class="text-slate-300 group-hover:text-slate-500">{{ sortIndicator('assignment_title') }}</span>
                  </button>
                </th>
                <th class="w-[18%] px-5 py-3.5 font-semibold">
                  <button @click="handleSort('submitted_at')" class="group inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                    Pengumpulan <span class="text-slate-300 group-hover:text-slate-500">{{ sortIndicator('submitted_at') }}</span>
                  </button>
                </th>
                <th class="w-[12%] px-5 py-3.5 font-semibold">
                  <button @click="handleSort('score')" class="group inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                    Nilai <span class="text-slate-300 group-hover:text-slate-500">{{ sortIndicator('score') }}</span>
                  </button>
                </th>
                <th class="w-[14%] px-5 py-3.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="(row, index) in sortedRows" :key="`${row.assignment_id}-${row.id}-${index}`"
                class="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                <td class="px-5 py-4">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ row.student_name }}</div>
                  <div class="text-xs text-slate-500">{{ row.class_name }}</div>
                </td>

                <td class="px-5 py-4">
                  <div class="line-clamp-1 font-medium text-slate-900 dark:text-white">{{ row.assignment_title }}</div>
                  <div class="mt-1.5 flex flex-wrap items-center gap-2">
                    <span :class="assignmentTypeBadgeClass(row)" class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      {{ assignmentTypeLabel(row) }}
                    </span>
                    <span class="truncate text-xs text-slate-400">{{ row.subject_name }}</span>
                  </div>
                </td>

                <td class="px-5 py-4">
                  <div class="text-sm text-slate-600 dark:text-slate-300">
                    {{ row.assignment_type === 'MANUAL' ? '—' : formatDateTimeCompact(row.submitted_at) }}
                  </div>
                  <div v-if="isSubmissionLate(row) || Number(row.violation_count || 0) > 0" class="mt-1.5 flex flex-wrap gap-1.5">
                    <span v-if="isSubmissionLate(row)" class="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">
                      Terlambat
                    </span>
                    <span v-if="Number(row.violation_count || 0) > 0" class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      {{ Number(row.violation_count || 0) }} pelanggaran
                    </span>
                  </div>
                </td>

                <td class="px-5 py-4">
                  <div class="flex items-baseline gap-0.5">
                    <span class="text-lg font-bold" :class="isGraded(row) ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-600'">
                      {{ isGraded(row) ? row.score : "—" }}
                    </span>
                    <span v-if="isGraded(row)" class="text-xs font-medium text-slate-400">/100</span>
                  </div>
                  <div class="mt-0.5 text-[11px] font-semibold" :class="isGraded(row) ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                    {{ isGraded(row) ? "Sudah dinilai" : "Belum dinilai" }}
                  </div>
                </td>

                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button v-if="canOpenQuizReview(row)" @click="openReview(row)"
                      class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Review
                    </button>
                    <a v-else-if="row.attachment_url" :href="normalizePublicUrl(row.attachment_url)" target="_blank" rel="noreferrer"
                      class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                      File
                    </a>
                    <button @click="openGradeModal(row)"
                      class="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500">
                      Edit Nilai
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredRows.length === 0">
                <td colspan="5" class="px-6 py-16">
                  <div class="mx-auto max-w-sm text-center">
                    <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <svg class="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ filters.subjectId ? "Belum ada data" : "Mulai dari sini" }}
                    </h3>
                    <p class="mt-1 text-sm text-slate-500">
                      {{ filters.subjectId ? "Sesuaikan filter atau pastikan siswa sudah mengumpulkan tugas." : "Pilih mata pelajaran untuk menampilkan data penilaian." }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="divide-y divide-slate-100 lg:hidden dark:divide-slate-800">
          <article v-for="(row, index) in sortedRows" :key="`m-${row.assignment_id}-${row.id}-${index}`" class="p-3 sm:p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">{{ row.student_name }}</p>
                <p class="text-[11px] text-slate-500 sm:text-xs">{{ row.class_name }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-base font-bold leading-none sm:text-lg" :class="isGraded(row) ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-600'">
                  {{ isGraded(row) ? row.score : "—" }}
                </p>
                <p class="mt-1 text-[11px] font-semibold" :class="isGraded(row) ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                  {{ isGraded(row) ? "Dinilai" : "Belum dinilai" }}
                </p>
              </div>
            </div>

            <div class="mt-3 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/40 sm:rounded-xl sm:p-3">
              <p class="line-clamp-2 text-xs font-medium leading-5 text-slate-800 dark:text-slate-100 sm:text-sm">{{ row.assignment_title }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <span :class="assignmentTypeBadgeClass(row)" class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  {{ assignmentTypeLabel(row) }}
                </span>
                <span class="text-xs text-slate-400">{{ row.subject_name }}</span>
              </div>
              <div class="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 sm:text-xs">
                <span>{{ row.assignment_type === 'MANUAL' ? '—' : formatDateTimeCompact(row.submitted_at) }}</span>
                <span v-if="isSubmissionLate(row)" class="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">Terlambat</span>
                <span v-if="Number(row.violation_count || 0) > 0" class="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">{{ Number(row.violation_count || 0) }} pelanggaran</span>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-1.5">
              <button v-if="canOpenQuizReview(row)" @click="openReview(row)"
                class="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-slate-200 px-2 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Review Jawaban
              </button>
              <a v-else-if="row.attachment_url" :href="normalizePublicUrl(row.attachment_url)" target="_blank" rel="noreferrer"
                class="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-slate-200 px-2 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Buka File
              </a>
              <span v-else class="hidden sm:block"></span>
              <button @click="openGradeModal(row)"
                class="inline-flex h-8 items-center justify-center rounded-md bg-sky-600 px-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-sky-500"
                :class="!canOpenQuizReview(row) && !row.attachment_url ? 'col-span-2' : ''">
                Edit Nilai
              </button>
            </div>
          </article>

          <div v-if="filteredRows.length === 0" class="px-6 py-14 text-center">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
              {{ filters.subjectId ? "Belum ada data" : "Mulai dari sini" }}
            </h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ filters.subjectId ? "Sesuaikan filter atau pastikan siswa sudah mengumpulkan tugas." : "Pilih mata pelajaran untuk menampilkan data." }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-3 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400 sm:px-5 sm:text-sm md:flex-row md:items-center md:justify-between">
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <span>{{ paginationStartRow }}-{{ paginationEndRow }} dari {{ totalRows }} data</span>
            <select v-model="pageSize"
              class="rounded-lg border-0 bg-white py-1 pl-2 pr-7 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
              <option :value="10">10 / hal</option>
              <option :value="20">20 / hal</option>
              <option :value="50">50 / hal</option>
              <option :value="100">100 / hal</option>
            </select>
          </div>
          <div class="flex items-center justify-between gap-2 sm:justify-end">
            <button @click="goToPreviousPage" :disabled="currentPage <= 1"
              class="rounded-lg bg-white px-2.5 py-1.5 font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">
              Sebelumnya
            </button>
            <span class="min-w-[88px] text-center font-medium text-slate-600 dark:text-slate-300">
              Hal {{ currentPage }} / {{ totalPages }}
            </span>
            <button @click="goToNextPage" :disabled="currentPage >= totalPages"
              class="rounded-lg bg-white px-2.5 py-1.5 font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">
              Berikutnya
            </button>
          </div>
        </div>
      </section>
    </main>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="reviewRow"
        class="learning-grades-modal-overlay fixed inset-y-0 left-0 right-0 z-[260] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
        <div
          class="learning-grades-review-panel flex h-[100dvh] max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-none bg-white shadow-2xl ring-1 ring-slate-900/5 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div class="flex flex-none items-start justify-between gap-3 border-b border-slate-100 px-3 py-3 dark:border-slate-800 sm:items-center sm:px-6 sm:py-4">
            <div class="min-w-0">
              <h2 class="line-clamp-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">Review Hasil: {{ reviewRow.student_name }}
              </h2>
              <div class="mt-1 flex min-w-0 items-center gap-2 text-xs text-slate-500 sm:text-sm">
                <span class="truncate">{{ reviewRow.assignment_title }}</span>
                <span class="h-1 w-1 rounded-full bg-slate-300"></span>
                <span class="shrink-0">{{ assignmentTypeLabel(reviewRow) }}</span>
              </div>
            </div>
            <button @click="reviewRow = null"
              class="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
            <div class="space-y-3 sm:space-y-4">
              <article v-for="(item, index) in reviewItems" :key="`review-${index}`"
                class="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/20 sm:p-5">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div class="space-y-3">
                    <p class="text-sm font-medium leading-6 text-slate-900 dark:text-white sm:text-base sm:leading-relaxed">
                      <span class="text-slate-400">{{ index + 1 }}.</span> {{ item.question }}
                    </p>
                    <div
                      class="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/5">
                      <p class="text-xs font-medium leading-5 text-slate-700 dark:text-slate-200 sm:text-sm">{{ item.answer }}</p>
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

          <div class="flex-none border-t border-slate-100 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/50 sm:px-6 sm:py-4">
            <button @click="reviewRow = null"
              class="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 sm:rounded-xl sm:text-sm dark:bg-emerald-600 dark:hover:bg-emerald-500">
              Tutup Review
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="gradeModal.open"
        class="learning-grades-modal-overlay fixed inset-y-0 left-0 right-0 z-[260] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
        <div
          class="flex w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 sm:rounded-2xl dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div class="border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/30 sm:px-6 sm:py-4">
            <h2 class="text-base font-bold text-slate-900 dark:text-white sm:text-lg">Edit Nilai</h2>
            <p class="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {{ gradeModal.row?.student_name }} • {{ gradeModal.row?.assignment_title }}
            </p>
          </div>

          <div class="space-y-3 px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Nilai (0-100)</label>
              <input v-model="gradeModal.scoreDraft" type="number" min="0" max="100" step="0.01" placeholder="0-100"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-500 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Feedback Guru</label>
              <textarea v-model="gradeModal.feedbackDraft" rows="4" placeholder="Tulis catatan untuk siswa..."
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-500 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50"></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
            <button @click="closeGradeModal"
              class="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm dark:text-slate-300 dark:hover:bg-slate-800">
              Batal
            </button>
            <button @click="submitGradeFromModal" :disabled="gradeModal.saving"
              class="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm">
              {{ gradeModal.saving ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDateKey, formatDateTime, parseDateValue } from "@/utils/date";
import { normalizePublicUrl } from "@/utils/url";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";
import { downloadExcelWorksheet } from "@/utils/excelExport";
import { useTeacherStore } from "@/store/teacher";
import { useTeacherGradesStore } from "@/store/teacherGrades";
import { storeToRefs } from "pinia";

const fieldClass = "block h-10 w-full rounded-lg border-0 bg-slate-50 pl-3 pr-9 text-xs text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:h-11 sm:rounded-xl sm:pl-4 sm:pr-10 sm:text-sm dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50";

const teacherStore = useTeacherStore();
const gradesStore = useTeacherGradesStore();
const { subjects } = storeToRefs(teacherStore);
const { assignments, rows, totalRows, loadError, message, isError, reviewRow, currentPage, pageSize } = storeToRefs(gradesStore);
const gradeModal = gradesStore.gradeModal;
const tableSort = createSortState("submitted_at", "desc");
let keywordSearchTimer = null;

const filters = gradesStore.filters;

const messageClass = computed(() =>
  isError.value
    ? "bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20"
    : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
);

const filteredRows = computed(() => rows.value);

const sortedRows = computed(() =>
  sortItems(filteredRows.value, tableSort, {
    assignment_type: (row) => row.assignment_type || "",
    feedback: (row) => row.feedback || "",
    score: (row) => row.score ?? -1,
    violation_count: (row) => Number(row.violation_count || 0),
  }),
);

// ======== GRAFIK LOGIC ========
const gradedData = computed(() => sortedRows.value.filter(r => isGraded(r)));

// 1. Distribusi Nilai (Bar)
const distributionChartSeries = computed(() => {
  let a = 0, b = 0, c = 0, d = 0; // A: 85-100, B: 70-84, C: 50-69, D: <50
  gradedData.value.forEach(r => {
    const s = Number(r.score);
    if (s >= 85) a++;
    else if (s >= 70) b++;
    else if (s >= 50) c++;
    else d++;
  });
  return [{ name: 'Siswa', data: [d, c, b, a] }];
});
const distributionChartOptions = computed(() => {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  return {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    colors: ['#3b82f6'],
    plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '45%' } },
    xaxis: { categories: ['<50', '50-69', '70-84', '85-100'], labels: { style: { colors: textColor } } },
    yaxis: { labels: { style: { colors: textColor }, formatter: val => Math.floor(val) } },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    dataLabels: { enabled: true },
    title: { text: 'Distribusi Nilai', style: { color: textColor, fontWeight: 600 } },
    tooltip: { theme: isDark ? 'dark' : 'light' }
  };
});

// 2. Rata-rata per Tugas (Line)
const averagePerAssignmentSeries = computed(() => {
  const map = {};
  gradedData.value.forEach(r => {
    if (!map[r.assignment_title]) map[r.assignment_title] = { sum: 0, count: 0 };
    map[r.assignment_title].sum += Number(r.score);
    map[r.assignment_title].count += 1;
  });
  const categories = Object.keys(map);
  const data = categories.map(k => Number((map[k].sum / map[k].count).toFixed(2)));
  return [{ name: 'Rata-rata', data }];
});
const averageChartOptions = computed(() => {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const map = {};
  gradedData.value.forEach(r => { map[r.assignment_title] = true; });
  const categories = Object.keys(map);
  return {
    chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
    colors: ['#10b981'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { 
      categories: categories.map(c => c.length > 15 ? c.substring(0,15)+'...' : c),
      labels: { style: { colors: textColor } }
    },
    yaxis: { min: 0, max: 100, labels: { style: { colors: textColor } } },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    dataLabels: { enabled: true, background: { borderRadius: 4, foreColor: '#fff' } },
    title: { text: 'Rata-rata Nilai per Tugas', style: { color: textColor, fontWeight: 600 } },
    tooltip: { theme: isDark ? 'dark' : 'light' }
  };
});

// 3. Bar Chart Siswa (Horizontal Bar)
const studentScoreSeries = computed(() => {
  const data = gradedData.value.slice(0, 15);
  const seriesData = data.map(r => Number(r.score));
  return [{ name: 'Nilai', data: seriesData }];
});
const studentChartOptions = computed(() => {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const data = gradedData.value.slice(0, 15);
  const categories = data.map(r => r.student_name.length > 12 ? r.student_name.substring(0, 12)+'...' : r.student_name);
  return {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    colors: ['#8b5cf6'],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '50%' } },
    xaxis: { min: 0, max: 100, labels: { style: { colors: textColor } } },
    yaxis: { 
      categories: categories,
      labels: { style: { colors: textColor } }
    },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    dataLabels: { enabled: true, textAnchor: 'start', style: { colors: ['#fff'] }, offsetX: 0 },
    title: { text: 'Perbandingan Siswa (Top 15 Hal. Ini)', style: { color: textColor, fontWeight: 600 } },
    tooltip: { theme: isDark ? 'dark' : 'light' }
  };
});
// ================================

const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / Number(pageSize.value || 20))));
const paginationStartRow = computed(() => {
  if (totalRows.value === 0) return 0;
  return (currentPage.value - 1) * Number(pageSize.value || 20) + 1;
});
const paginationEndRow = computed(() => {
  if (totalRows.value === 0) return 0;
  return Math.min(currentPage.value * Number(pageSize.value || 20), totalRows.value);
});

const normalizeAssignmentMeta = (value, maybeIsExam = false, maybeExamCategory = "") => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      type: String(value.assignment_type || "").toUpperCase(),
      isExam: Boolean(value.is_exam),
      examCategory: String(value.exam_category || "").toUpperCase(),
    };
  }

  return {
    type: String(value || "").toUpperCase(),
    isExam: Boolean(maybeIsExam),
    examCategory: String(maybeExamCategory || "").toUpperCase(),
  };
};

const assignmentTypeLabel = (value, isExam = false, examCategory = "") => {
  const meta = normalizeAssignmentMeta(value, isExam, examCategory);
  if (meta.isExam) {
    if (meta.examCategory === "UTS") return "UTS";
    if (meta.examCategory === "UAS") return "UAS";
    if (meta.examCategory === "UJIAN_SEKOLAH") return "Ujian Sekolah";
    if (meta.examCategory === "CUSTOM") return "Ujian Resmi";
    return "Ujian Resmi";
  }
  if (meta.type === "MCQ") return "Quiz PG";
  if (meta.type === "ESSAY") return "Quiz Essay";
  if (meta.type === "QUIZ") return "Quiz";
  if (meta.type === "MANUAL") return "Ujian di Luar LMS";
  return "Tugas File";
};

const assignmentTypeBadgeClass = (value, isExam = false, examCategory = "") => {
  const meta = normalizeAssignmentMeta(value, isExam, examCategory);
  if (meta.isExam) {
    return "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300";
  }

  if (meta.type === "MCQ") {
    return "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
  }

  if (meta.type === "ESSAY") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }

  if (meta.type === "MANUAL") {
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

const formatDateTimeCompact = (value) => {
  const formatted = formatDateTime(value);
  return formatted.replace(/\s+WIB$/, "");
};

const isSubmissionLate = (row) => {
  if (!row || row.assignment_type === "MANUAL" || !row.due_date || !row.submitted_at) {
    return false;
  }
  const submitted = parseDateValue(row.submitted_at)?.getTime() || 0;
  const due = parseDateValue(row.due_date)?.getTime() || 0;
  return submitted > due;
};

const isGraded = (row) => row?.score !== null && row?.score !== undefined && row?.score !== "";

const normalizeQuestionOptions = (options) => {
  if (Array.isArray(options)) {
    return options;
  }

  if (typeof options !== "string" || !options.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(options);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getQuestionText = (question) =>
  question?.question_text || question?.question || "Soal tidak tersedia";

const toNumericIndex = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const calculateMcqScore = (quizPayload, answerPayload) => {
  if (!Array.isArray(quizPayload) || quizPayload.length === 0 || !Array.isArray(answerPayload)) {
    return null;
  }

  let correctCount = 0;

  quizPayload.forEach((question, index) => {
    const selectedIndex = toNumericIndex(answerPayload[index]?.selected_option);
    const correctIndex = toNumericIndex(question?.correct_option);
    if (selectedIndex !== null && correctIndex !== null && selectedIndex === correctIndex) {
      correctCount += 1;
    }
  });

  const value = (correctCount / quizPayload.length) * 100;
  return Math.round(value * 100) / 100;
};

const reviewItems = computed(() => {
  if (!reviewRow.value || !canOpenQuizReview(reviewRow.value)) {
    return [];
  }

  const questions = Array.isArray(reviewRow.value.quiz_payload) ? reviewRow.value.quiz_payload : [];
  const answers = Array.isArray(reviewRow.value.answer_payload) ? reviewRow.value.answer_payload : [];

  return questions.map((question, index) => {
    const answer = answers[index] || {};

    if (reviewRow.value.assignment_type === "MCQ" || reviewRow.value.assignment_type === "QUIZ") {
      const options = normalizeQuestionOptions(question.options);
      const selectedRaw = answer.selected_option;
      const selectedIndex = selectedRaw === null || selectedRaw === undefined || selectedRaw === ""
        ? null
        : Number(selectedRaw);
      const correctIndex = Number(question.correct_option);
      const selectedText = Number.isInteger(selectedIndex) && options[selectedIndex] ? options[selectedIndex] : "Belum dijawab";
      const correctText = Number.isInteger(correctIndex) && options[correctIndex] ? options[correctIndex] : "-";

      return {
        question: getQuestionText(question),
        answer: `Jawaban siswa: ${selectedText}`,
        extra: `Jawaban benar: ${correctText}`,
        isCorrect: Number.isInteger(selectedIndex) && selectedIndex === correctIndex,
      };
    }

    return {
      question: getQuestionText(question),
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

  const date = parseDateValue(value);
  if (!date) {
    return "-";
  }

  const pad = (item) => String(item).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}-${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const buildExportFilename = () => {
  const subject = subjects.value.find((item) => String(item.id) === filters.subjectId);
  const date = formatDateKey(new Date());
  const subjectPart = `${subject?.name || "penilaian"}-${subject?.class_name || "kelas"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `penilaian-${subjectPart || "guru"}-${date}.xls`;
};

const downloadExcel = async () => {
  const subject = subjects.value.find((item) => String(item.id) === filters.subjectId);
  const assignment = assignments.value.find((item) => String(item.id) === filters.assignmentId);
  const now = new Date();

  await downloadExcelWorksheet({
    filename: buildExportFilename(),
    sheetName: "Penilaian Guru",
    title: "Rekap Penilaian Pembelajaran",
    subtitle: `Diunduh pada ${formatDateTime(now)} | ${subject?.name || "Semua Mapel"}${subject?.class_name ? ` - ${subject.class_name}` : ""}`,
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
  if (!canOpenQuizReview(row) && !canOpenFileReview(row)) {
    pushToast({ title: "Review Jawaban", message: "Belum ada jawaban/lampiran untuk direview.", type: "error" });
    return;
  }
  reviewRow.value = row;
};

const openGradeModal = (row) => {
  gradeModal.open = true;
  gradeModal.row = row;
  gradeModal.scoreDraft = row.scoreDraft ?? row.score ?? "";
  gradeModal.feedbackDraft = row.feedbackDraft ?? row.feedback ?? "";
  gradeModal.saving = false;
};

const closeGradeModal = () => {
  gradeModal.open = false;
  gradeModal.row = null;
  gradeModal.scoreDraft = "";
  gradeModal.feedbackDraft = "";
  gradeModal.saving = false;
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

const canOpenQuizReview = (row) =>
  parseArrayField(row?.quiz_payload).length > 0;

const canOpenFileReview = (row) =>
  row?.assignment_type === "FILE" && !!row?.attachment_url;

const loadSubjects = async () => {
  subjects.value = await teacherStore.loadTeacherSubjects();
};

const loadRowsForSubject = async (subjectId) => {
  if (!subjectId) {
    assignments.value = [];
    rows.value = [];
    totalRows.value = 0;
    return;
  }

  const gradebookResponse = await api.get(`/learning/subjects/${subjectId}/gradebook`, {
    params: {
      assignment_id: filters.assignmentId || "",
      grade_status: filters.gradeStatus || "",
      assignment_type: filters.assignmentType || "",
      keyword: filters.keyword || "",
      page: currentPage.value,
      limit: pageSize.value,
    },
  });
  const assignmentItems = gradebookResponse?.data?.assignments || [];
  const submissionItems = gradebookResponse?.data?.rows || [];
  assignments.value = assignmentItems;
  totalRows.value = Number(gradebookResponse?.data?.total || 0);

  const subject = subjects.value.find((item) => String(item.id) === String(subjectId));
  rows.value = submissionItems.map((submission) => {
    const quizPayload = parseArrayField(submission.quiz_payload);
    const answerPayload = parseArrayField(submission.answer_payload);
    const recalculatedScore = submission.assignment_type === "MCQ" && submission.auto_graded
      ? calculateMcqScore(quizPayload, answerPayload)
      : null;
    const normalizedScore = recalculatedScore ?? submission.score ?? null;

    return {
      ...submission,
      quiz_payload: quizPayload,
      answer_payload: answerPayload,
      score: normalizedScore,
      subject_name: submission.subject_name || subject?.name || "-",
      class_name: submission.class_name || subject?.class_name || "-",
      scoreDraft: normalizedScore ?? "",
      feedbackDraft: submission.feedback ?? "",
    };
  });
};

const handleSubjectChange = async () => {
  filters.assignmentId = "";
  reviewRow.value = null;
  loadError.value = "";
  currentPage.value = 1;

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

const submitGradeFromModal = async () => {
  if (!gradeModal.row) return;

  gradeModal.saving = true;
  gradeModal.row.scoreDraft = gradeModal.scoreDraft;
  gradeModal.row.feedbackDraft = gradeModal.feedbackDraft;

  await submitGrade(gradeModal.row);

  if (!isError.value) {
    closeGradeModal();
  } else {
    gradeModal.saving = false;
  }
};

const goToPreviousPage = async () => {
  if (currentPage.value <= 1 || !filters.subjectId) return;
  currentPage.value -= 1;
  await loadRowsForSubject(filters.subjectId);
};

const goToNextPage = async () => {
  if (currentPage.value >= totalPages.value || !filters.subjectId) return;
  currentPage.value += 1;
  await loadRowsForSubject(filters.subjectId);
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

watch(loadError, (value) => {
  if (!value) return;
  pushToast({ title: "Gagal Memuat Nilai", message: value, type: "error" });
});

watch(message, (value) => {
  if (!value) return;
  pushToast({
    title: isError.value ? "Penyimpanan Nilai Gagal" : "Penyimpanan Nilai Berhasil",
    message: value,
    type: isError.value ? "error" : "success",
  });
});

watch(
  () => [filters.assignmentId, filters.gradeStatus, filters.assignmentType, pageSize.value],
  async () => {
    if (!filters.subjectId) return;
    currentPage.value = 1;
    try {
      await loadRowsForSubject(filters.subjectId);
    } catch (error) {
      loadError.value = error.message;
    }
  },
);

watch(
  () => filters.keyword,
  (value) => {
    if (!filters.subjectId) return;
    if (keywordSearchTimer) {
      clearTimeout(keywordSearchTimer);
    }
    keywordSearchTimer = setTimeout(async () => {
      currentPage.value = 1;
      try {
        await loadRowsForSubject(filters.subjectId);
      } catch (error) {
        loadError.value = error.message;
      }
    }, value ? 350 : 0);
  },
);
</script>

<style scoped>
@media (min-width: 1024px) {
  .learning-grades-modal-overlay {
    left: 320px;
  }
}

@media (max-width: 768px) {
  .learning-grades-teacher-page :deep(.text-xl),
  .learning-grades-teacher-page :deep(.text-lg) {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }

  .learning-grades-teacher-page :deep(.text-base) {
    font-size: 0.8125rem !important;
    line-height: 1.2rem !important;
  }

  .learning-grades-teacher-page :deep(.text-sm) {
    font-size: 0.75rem !important;
    line-height: 1.1rem !important;
  }

  .learning-grades-teacher-page :deep(th),
  .learning-grades-teacher-page :deep(td) {
    padding: 0.625rem 0.75rem !important;
    vertical-align: top;
  }
}
</style>
