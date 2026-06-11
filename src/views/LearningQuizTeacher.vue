<template>
  <div class="learning-quiz-teacher-page min-h-screen bg-slate-50 p-2 font-sans text-slate-900 sm:p-4 md:p-6 dark:bg-slate-950 dark:text-slate-100">


    <main class="mx-auto mt-2 max-w-[1400px] sm:mt-4 md:mt-6">

      <section class="mb-3 sm:mb-5">


        <div v-if="subjectError"
          class="mb-3 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 sm:text-sm">
          {{ subjectError }}
        </div>

        <div
          class="flex flex-nowrap gap-2 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 sm:pb-4 [&::-webkit-scrollbar]:hidden">
          <button v-for="item in subjects" :key="item.id" @click="selectSubject(item)"
            class="group relative flex min-w-[180px] flex-none snap-start flex-col items-start overflow-hidden rounded-xl p-3 text-left transition-all sm:min-w-[240px] sm:rounded-2xl sm:p-4"
            :class="selectedSubject?.id === item.id
              ? 'bg-sky-600 shadow-md ring-1 ring-sky-600 dark:bg-sky-500'
              : 'bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80'">
            <span :class="selectedSubject?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'"
              class="line-clamp-1 text-xs font-bold tracking-tight sm:text-sm">{{ item.name }}</span>
            <span :class="selectedSubject?.id === item.id ? 'text-sky-200' : 'text-slate-500 dark:text-slate-400'"
              class="mt-1 text-[11px] font-medium sm:text-xs">
              {{ item.class_name }}
            </span>
            <span v-if="selectedSubject?.id === item.id"
              class="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/95 text-sky-600 shadow-sm ring-1 ring-white/70 sm:right-3 sm:top-3">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </button>

          <template v-if="subjectsLoading && !subjects.length">
            <div v-for="n in 5" :key="`quizt-subj-sk-${n}`"
              class="skeleton-shimmer h-[68px] min-w-[180px] flex-none rounded-xl sm:h-[88px] sm:min-w-[240px] sm:rounded-2xl"></div>
          </template>
        </div>
      </section>

      <div>
        <div v-if="selectedSubject"
          class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">

          <div class="border-b border-slate-100 bg-slate-50/50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/20 sm:px-6 sm:pt-6 sm:pb-0">
            <h2 class="line-clamp-2 text-base font-bold text-slate-900 dark:text-white sm:text-2xl">{{ selectedSubject.name }}</h2>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {{ selectedSubject.class_name }} &bull; {{ selectedSubject.description || "Tidak ada deskripsi." }}
            </p>

          </div>

          <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="message"
              class="mx-3 mt-3 flex items-center gap-2 rounded-xl p-3 text-xs font-medium ring-1 ring-inset sm:mx-6 sm:mt-6 sm:gap-3 sm:p-4 sm:text-sm"
              :class="isError ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'">
              <svg v-if="isError" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ message }}
            </div>
          </Transition>

          <div class="space-y-3 p-2.5 sm:space-y-4 sm:p-6">
            <div class="mt-1 grid grid-cols-2 gap-2 sm:mt-2 sm:flex sm:gap-3">
                <button
                  type="button"
                  @click="activeQuizMenu = 'bank'"
                  class="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border-2 px-3 py-2 text-left text-xs font-semibold transition-all sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
                  :class="activeQuizMenu === 'bank'
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
                >
                  <span>Bank Soal</span>
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-bold"
                    :class="activeQuizMenu === 'bank'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'"
                  >
                    {{ questionBankTotal }}
                  </span>
                </button>
                <button
                  type="button"
                  @click="activeQuizMenu = 'running'"
                  class="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border-2 px-3 py-2 text-left text-xs font-semibold transition-all sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
                  :class="activeQuizMenu === 'running'
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
                >
                  <span>Quiz Berjalan</span>
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-bold"
                    :class="activeQuizMenu === 'running'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'"
                  >
                    {{ runningAssignments.length }}
                  </span>
                </button>
            </div>

            <section v-if="activeQuizMenu === 'bank'"
              class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div class="border-b border-slate-200 bg-slate-50/70 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/30 sm:px-5 sm:py-4">
                <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white sm:text-lg">Bank Soal Quiz</h3>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                      Pilih soal yang akan diterbitkan untuk {{ selectedSubject.name }}.
                    </p>
                  </div>
                  <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                    <router-link to="/learning-question-bank-teacher"
                      class="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:h-10 sm:px-4 sm:text-sm">
                      Kelola Soal
                    </router-link>
                    <button @click="openAssignmentPublishFlow" type="button"
                      class="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-700 sm:h-10 sm:px-4 sm:text-sm">
                      Buat Quiz
                    </button>
                  </div>
                </div>

                <div class="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-3 sm:gap-3">
                  <div class="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900 sm:px-4 sm:py-3">
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Bank</p>
                    <p class="mt-1 text-base font-bold text-slate-900 dark:text-white sm:text-xl">{{ questionBankTotal }}</p>
                  </div>
                  <div class="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 dark:border-sky-900/40 dark:bg-sky-500/10 sm:px-4 sm:py-3">
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Dipilih</p>
                    <p class="mt-1 text-base font-bold text-sky-800 dark:text-sky-200 sm:text-xl">{{ selectedQuestionCount }}</p>
                  </div>
                  <div class="col-span-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900 sm:col-span-1 sm:px-4 sm:py-3">
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Jenis Terpilih</p>
                    <p class="mt-1 truncate text-xs font-bold text-slate-900 dark:text-white sm:text-sm">{{ selectedQuestionTypeLabel }}</p>
                  </div>
                </div>
              </div>

              <div class="border-b border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
                <div class="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
                  <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_140px]">
                    <input v-model="bankSearch" type="text" placeholder="Cari teks soal..."
                      class="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:h-10 sm:text-sm" />
                    <select v-model="bankTypeFilter"
                      class="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:h-10 sm:text-sm">
                      <option value="ALL">Semua jenis</option>
                      <option value="MCQ">Pilihan ganda</option>
                      <option value="ESSAY">Uraian</option>
                    </select>
                    <select v-model="bankPageSize"
                      class="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:h-10 sm:text-sm">
                      <option :value="10">10 soal</option>
                      <option :value="20">20 soal</option>
                      <option :value="50">50 soal</option>
                    </select>
                  </div>
                  <div class="flex flex-wrap gap-2 xl:justify-end">
                    <button @click="generateRandomSelection" type="button"
                      class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 sm:h-10 sm:text-sm">
                      Acak {{ randomQuestionCount }}
                    </button>
                    <button @click="selectAllCurrentBankPage" type="button"
                      class="h-9 rounded-lg border border-blue-600 bg-white px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-50 dark:bg-slate-900 dark:text-blue-300 sm:h-10 sm:text-sm">
                      Pilih Halaman Ini
                    </button>
                    <button v-if="assignmentForm.selected_question_bank_ids.length > 0" @click="clearSelectedQuestions" type="button"
                      class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 sm:h-10 sm:text-sm">
                      Kosongkan
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-2 bg-slate-50/60 p-2.5 dark:bg-slate-950/20 sm:space-y-3 sm:p-4">
                <SkeletonLoader v-if="contentLoading" variant="list" :count="5" />
                <article v-for="(item, index) in paginatedQuestionBank" v-show="!contentLoading" :key="item.id"
                  class="relative rounded-lg border bg-white p-3 pr-12 shadow-sm transition dark:bg-slate-900 sm:p-4 sm:pr-14"
                  :class="assignmentForm.selected_question_bank_ids.includes(item.id)
                    ? 'border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'">
                  <button type="button" @click="openQuestionPreview(item, 'bank')" title="Lihat/Edit"
                    aria-label="Lihat/Edit soal"
                    class="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border transition sm:right-4 sm:top-4"
                    :class="assignmentForm.selected_question_bank_ids.includes(item.id)
                      ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                      : 'border-slate-300 bg-white text-slate-500 hover:border-sky-400 hover:text-sky-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.2"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19.5 7.125 16.862 4.487M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <div class="flex flex-col gap-3 lg:flex-row lg:items-start">
                    <div class="flex flex-wrap items-start gap-2 lg:w-64 lg:shrink-0 sm:gap-3">
                      <input :checked="assignmentForm.selected_question_bank_ids.includes(item.id)" type="checkbox"
                        @change="toggleQuestionSelection(item)"
                        class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-600 dark:bg-slate-800 sm:h-5 sm:w-5" />
                      <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-slate-100 px-2 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:h-7 sm:min-w-7 sm:text-xs">
                        {{ bankStartRow + index }}
                      </span>
                      <span class="inline-flex rounded-md border px-2.5 py-1 text-xs font-bold"
                        :class="item.question_type === 'MCQ'
                          ? 'border-blue-700 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'border-amber-700 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-900/30 dark:text-amber-300'">
                        {{ assignmentTypeLabel(item.question_type) }}
                      </span>
                    </div>

                    <div class="min-w-0 flex-1 space-y-2 sm:space-y-3">
                      <div class="flex flex-wrap items-center gap-2">
                        <span v-if="assignmentForm.selected_question_bank_ids.includes(item.id)"
                          class="inline-flex rounded-md bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                          Terpilih
                        </span>
                        <span class="text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
                          Dibuat {{ formatDateTime(item.created_at) }}
                        </span>
                      </div>

                      <p class="text-xs font-semibold leading-5 text-slate-900 dark:text-white sm:text-sm sm:leading-6">
                        {{ parseQuestionContent(item.question_text).question_text || "Soal tanpa teks" }}
                      </p>

                      <img v-if="parseQuestionContent(item.question_text).question_image_url"
                        :src="parseQuestionContent(item.question_text).question_image_url" alt="Gambar pertanyaan"
                        class="max-h-48 rounded-lg border border-slate-200 bg-white object-contain dark:border-slate-700 dark:bg-slate-950" />

                      <div v-if="item.question_type === 'MCQ' && Array.isArray(item.options) && item.options.length"
                        class="grid gap-2 md:grid-cols-2">
                        <div v-for="(option, optionIndex) in item.options.slice(0, 4)"
                          :key="`option-preview-${item.id}-${optionIndex}`"
                          class="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                          <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white text-[11px] font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
                            {{ String.fromCharCode(65 + optionIndex) }}
                          </span>
                          <span class="line-clamp-2">{{ parseOptionItem(option).text || "-" }}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </article>

                <div v-if="!contentLoading && paginatedQuestionBank.length === 0" class="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900 sm:py-12">
                  <p class="text-sm font-semibold text-slate-600 dark:text-slate-300 sm:text-base">Belum ada soal</p>
                  <p class="mt-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Soal yang cocok dengan pencarian dan filter akan muncul di sini.</p>
                </div>
              </div>

              <div
                class="flex flex-col gap-2 border-t border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <p class="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Menampilkan {{ bankStartRow }} - {{ bankEndRow }} dari {{ questionBankTotal }} soal
                </p>
                <div class="flex gap-2">
                  <button @click="bankCurrentPage = Math.max(1, bankCurrentPage - 1)" :disabled="bankCurrentPage === 1"
                    class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 sm:flex-none sm:px-4 sm:text-sm">
                    Sebelumnya
                  </button>
                  <button @click="bankCurrentPage = Math.min(bankTotalPages, bankCurrentPage + 1)"
                    :disabled="bankCurrentPage === bankTotalPages"
                    class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 sm:flex-none sm:px-4 sm:text-sm">
                    Berikutnya
                  </button>
                </div>
              </div>
            </section>

            <section v-else class="overflow-hidden rounded-xl border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <div class="border-b border-slate-200 bg-slate-50/70 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/30 sm:px-5 sm:py-4">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white sm:text-lg">Quiz Berjalan</h3>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Daftar quiz yang sudah diterbitkan untuk mapel ini.</p>
                  </div>
                  <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                    <div class="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 sm:px-4">
                      <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Quiz</div>
                      <div class="mt-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">{{ runningAssignments.length }}</div>
                    </div>
                    <div class="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 shadow-sm dark:border-sky-900/40 dark:bg-sky-500/10 sm:px-4">
                      <div class="text-[11px] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Total Submit</div>
                      <div class="mt-1 text-base font-bold text-sky-800 dark:text-sky-200 sm:text-lg">{{ totalRunningSubmissions }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full text-left text-sm">
                  <thead class="bg-white text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900">
                    <tr>
                      <th class="px-4 py-3 font-semibold">Quiz</th>
                      <th class="px-4 py-3 font-semibold">Ringkasan</th>
                      <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                    <tr v-for="item in runningAssignments" :key="item.id"
                      class="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td class="px-4 py-3">
                        <p class="font-semibold text-slate-900 dark:text-white">{{ item.title }}</p>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {{ assignmentTypeLabel(item.assignment_type) }}
                        </p>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {{ formatDateTime(item.due_date) }}
                          </span>
                          <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {{ item.is_exam || String(item.question_duration_mode || '').toUpperCase() === 'GLOBAL' ? `${formatDurationSeconds(item.question_duration_seconds)}/sesi` : `${formatDurationSeconds(item.question_duration_seconds)}/soal` }}
                          </span>
                          <span class="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                            {{ item.submission_count || 0 }} submit
                          </span>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button @click="openQuizOverview(item)" type="button"
                            class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-600 bg-sky-50 text-sky-700 transition hover:bg-sky-100 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
                            title="Detail quiz" aria-label="Detail quiz">
                            <Icon icon="ph:chart-line-up" class="h-4 w-4" />
                          </button>
                          <button @click="openDeleteQuizModal(item)" type="button"
                            class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-600 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-500 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                            :disabled="isDeletingQuiz && deleteQuizModal.assignment?.id === item.id"
                            title="Hapus quiz" aria-label="Hapus quiz">
                            <Icon icon="ph:trash" class="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="runningAssignments.length === 0">
                      <td colspan="3" class="p-6 text-center text-sm text-slate-500">Belum ada quiz yang diterbitkan.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <div v-else
          class="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-4 py-8 text-center dark:border-slate-800 dark:bg-slate-900/50 sm:min-h-[500px] sm:px-6 sm:py-12">
          <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 sm:mb-4 sm:h-16 sm:w-16">
            <svg class="h-6 w-6 text-slate-400 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white sm:text-lg">Pilih Mata Pelajaran</h3>
          <p class="mt-2 max-w-sm text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Silakan pilih mata pelajaran dari menu di
            atas untuk mulai mengelola bank soal dan menerbitkan quiz.</p>
        </div>
      </div>
    </main>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="assignmentGuideModal"
        class="fixed inset-0 z-[230] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <div
          class="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div
            class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Pilih Soal Dulu</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Quiz belum bisa dibuat karena belum ada soal yang dipilih.</p>
            </div>
            <button @click="assignmentGuideModal = false"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4 p-6">
            <div class="rounded-xl bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-500/10 dark:text-blue-200">
              Centang minimal 1 soal pada tabel, lalu klik <span class="font-semibold">Buat Quiz</span> lagi.
            </div>
            <ol class="list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
              <li>Pilih mata pelajaran yang aktif.</li>
              <li>Centang soal yang ingin dipakai dari tabel.</li>
              <li>Gunakan tombol `Pilih Halaman Ini` atau `Acak` jika perlu.</li>
              <li>Setelah ada soal terpilih, buka modal `Buat Quiz`.</li>
            </ol>
            <div class="flex items-center justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
              <button @click="assignmentGuideModal = false" type="button"
                class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                Mengerti
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="assignmentPublishModal"
        class="fixed inset-0 z-[230] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <div
          class="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div
            class="flex items-start justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-5 dark:border-slate-800 dark:bg-slate-800/30">
            <div class="space-y-3">
              <div>
                <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Buat Quiz</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Atur detail inti lalu terbitkan untuk siswa.</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  class="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                  {{ selectedQuestionCount }} soal dipilih
                </span>
                <span
                  class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {{ assignmentForm.question_duration_mode === 'GLOBAL' ? 'Mode global' : 'Mode per soal' }}
                </span>
              </div>
            </div>
            <button @click="assignmentPublishModal = false"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitAssignment" class="space-y-5 p-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Judul Quiz</label>
                <input v-model="assignmentForm.title" required placeholder="Contoh: Ulangan Bab 3"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Deadline</label>
                <VueDatePicker
                  v-model="assignmentDueDateValue"
                  :min-date="new Date()"
                  auto-apply
                  teleport="body"
                  enable-time-picker
                  :is-24="true"
                  minutes-increment="5"
                  :transitions="false"
                  :locale="indonesiaLocale"
                  format="dd MMM yyyy, HH:mm"
                  placeholder="Pilih deadline"
                  input-class-name="quiz-deadline-picker"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Instruksi</label>
              <input v-model="assignmentForm.description" type="text" placeholder="Instruksi singkat untuk siswa"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Jenis Quiz</label>
                <div
                  class="flex h-[44px] items-center rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {{ selectedQuestionTypeLabel }}
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Mode Waktu</label>
                <div class="grid grid-cols-2 gap-2">
                  <button type="button" @click="setQuestionDurationMode('PER_QUESTION')"
                    class="rounded-lg px-3 py-2.5 text-sm font-semibold transition"
                    :class="assignmentForm.question_duration_mode === 'PER_QUESTION'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'">
                    Per Soal
                  </button>
                  <button type="button" @click="setQuestionDurationMode('GLOBAL')"
                    class="rounded-lg px-3 py-2.5 text-sm font-semibold transition"
                    :class="assignmentForm.question_duration_mode === 'GLOBAL'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'">
                    Global
                  </button>
                </div>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-[minmax(0,180px),1fr]">
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {{ assignmentForm.question_duration_mode === 'PER_QUESTION' ? 'Durasi per Soal' : 'Durasi Total' }}
                </label>
                <div class="relative">
                  <input v-model="assignmentForm.question_duration_value" type="number" min="1"
                    :max="assignmentForm.question_duration_mode === 'PER_QUESTION' ? 3600 : 180"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-16 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                  <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400">
                    {{ assignmentForm.question_duration_mode === 'PER_QUESTION' ? 'detik' : 'menit' }}
                  </span>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Opsi Tambahan</label>
                <label
                  class="flex h-[44px] items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  <input v-model="assignmentForm.shuffle_questions" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                  Acak urutan soal saat diterbitkan
                </label>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-[minmax(0,180px),1fr]">
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Toleransi Pelanggaran</label>
                <input v-model="assignmentForm.max_violations" type="number" min="1" max="20"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Catatan Anti-Cheat</label>
                <div
                  class="flex min-h-[44px] items-center rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Sesi akan dikunci bila melebihi toleransi yang ditentukan.
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button @click="assignmentPublishModal = false" type="button"
                class="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </button>
              <button :disabled="isSavingAssignment"
                class="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
                {{ isSavingAssignment ? "Menyimpan..." : "Terbitkan" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="questionBankModalOpen"
        class="fixed inset-0 z-[230] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">

        <div
          class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div
            class="flex flex-none items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Tambah Soal ke Bank</h2>
            <button @click="questionBankModalOpen = false"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitQuestionBank" class="flex min-h-0 flex-1 flex-col">

            <div class="flex-1 overflow-y-auto p-6 space-y-6">
              <div class="grid gap-6 md:grid-cols-[200px,1fr]">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe Soal</label>
                  <select v-model="questionBankForm.question_type"
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                    <option value="MCQ">Pilihan Ganda</option>
                    <option value="ESSAY">Essay</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Pertanyaan</label>
                  <textarea v-model="questionBankForm.question_text" rows="3"
                    placeholder="Tuliskan pertanyaan di sini..."
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </div>
              </div>

              <div v-if="questionBankForm.question_type === 'MCQ'" class="space-y-3">
                <label v-for="(option, index) in questionBankForm.options" :key="`option-${index}`"
                  class="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition dark:bg-slate-900"
                  :class="Number(questionBankForm.correct_option) === index
                    ? 'border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'">
                  <span
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {{ String.fromCharCode(65 + index) }}
                  </span>
                  <input v-model="questionBankForm.options[index]" type="text"
                    :placeholder="`Tulis pilihan ${String.fromCharCode(65 + index)}`"
                    class="min-w-0 flex-1 rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/70 dark:text-white dark:ring-slate-700" />
                  <input v-model="questionBankForm.correct_option" type="radio" name="correct-bank" :value="index"
                    class="h-4 w-4 shrink-0 text-sky-600 focus:ring-sky-600" />
                  <span class="hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline-flex"
                    :class="Number(questionBankForm.correct_option) === index
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">
                    Benar
                  </span>
                </label>
              </div>

              <div v-else class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Rubrik Penilaian
                  (Opsional)</label>
                <textarea v-model="questionBankForm.rubric" rows="2"
                  placeholder="Panduan untuk menilai jawaban essay..."
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
              </div>
            </div>

            <div
              class="flex flex-none items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
              <button @click="questionBankModalOpen = false" type="button"
                class="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </button>
              <button type="submit" :disabled="isSavingQuestionBank"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                {{ isSavingQuestionBank ? "Menyimpan..." : "Simpan Soal" }}
              </button>
            </div>
          </form>

        </div>
      </div>
    </Transition>

    <teleport to="body">
      <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="quizOverviewModal.open"
          class="quiz-overview-modal-overlay fixed inset-y-0 left-0 right-0 z-[230] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">

          <div
            class="quiz-overview-detail flex h-[100dvh] max-h-[100dvh] w-full max-w-6xl flex-col overflow-hidden rounded-none bg-white shadow-2xl ring-1 ring-slate-900/5 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl dark:bg-slate-900 dark:ring-white/10"
            @click.stop>

          <div
            class="flex flex-none items-start justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/40 sm:items-center sm:px-6 sm:py-5">
            <div class="min-w-0">
              <h2 class="text-base font-bold text-slate-900 dark:text-white sm:text-xl">Detail Quiz Berjalan</h2>
              <p class="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                {{ quizOverviewModal.assignment?.title || "-" }} • {{
                  assignmentTypeLabel(quizOverviewModal.assignment?.assignment_type) }}
              </p>
            </div>
            <button @click="closeQuizOverview"
              class="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

            <div v-if="quizOverviewModal.loading" class="min-h-0 flex-1 p-8 text-center sm:p-12">
              <div class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
              <p class="mt-4 text-sm text-slate-500">Memuat detail quiz...</p>
            </div>

            <div v-else class="min-h-0 flex-1 overflow-y-auto bg-slate-50/40 p-3 dark:bg-slate-950/30 sm:p-6">
              <div class="grid gap-3 sm:gap-6 xl:grid-cols-2">
                <section
                  class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl dark:border-slate-800 dark:bg-slate-900">
                <div class="border-b border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/50 sm:px-5 sm:py-4">
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">Sudah Submit</h3>
                </div>
                <div class="max-h-72 overflow-auto">
                  <table class="min-w-[640px] divide-y divide-slate-100 text-left text-xs dark:divide-slate-800 sm:min-w-full sm:text-sm">
                    <thead class="bg-white dark:bg-slate-900">
                      <tr>
                        <th class="px-5 py-3 font-semibold text-slate-500">Siswa</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Waktu</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Nilai</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Pelanggaran</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="item in quizOverviewModal.submittedStudents" :key="`submitted-${item.id}`">
                        <td class="px-5 py-3 font-medium text-slate-900 dark:text-white">{{ item.full_name || item.username }}</td>
                        <td class="px-5 py-3 text-slate-500 dark:text-slate-400">{{ formatStoredDateTime(item.submitted_at) }}
                        </td>
                        <td class="px-5 py-3 font-bold text-slate-700 dark:text-slate-300">{{ item.score ?? "-" }}</td>
                        <td class="px-5 py-3">
                          <div class="font-semibold" :class="item.violation_count > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'">
                            {{ item.violation_count || 0 }}x
                          </div>
                          <div v-if="item.violation_logs?.length" class="mt-1 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <p v-for="log in item.violation_logs.slice(0, 3)" :key="`submitted-log-${item.id}-${log.id}`">
                              {{ formatViolationLabel(log.violation_type) }} • {{ formatStoredDateTime(log.created_at) }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="quizOverviewModal.submittedStudents.length === 0">
                        <td colspan="4" class="px-5 py-8 text-center text-slate-500">Belum ada siswa submit.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </section>

                <section
                  class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl dark:border-slate-800 dark:bg-slate-900">
                <div class="border-b border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/50 sm:px-5 sm:py-4">
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">Belum Submit</h3>
                </div>
                <div class="max-h-72 overflow-auto">
                  <table class="min-w-[560px] divide-y divide-slate-100 text-left text-xs dark:divide-slate-800 sm:min-w-full sm:text-sm">
                    <thead class="bg-white dark:bg-slate-900">
                      <tr>
                        <th class="px-5 py-3 font-semibold text-slate-500">Siswa</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Email Ortu</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Pelanggaran</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="item in quizOverviewModal.pendingStudents" :key="`pending-${item.id}`">
                        <td class="px-5 py-3 font-medium text-slate-900 dark:text-white">{{ item.full_name || item.username }}</td>
                        <td class="px-5 py-3 text-slate-500 dark:text-slate-400">{{ item.parent_email || "-" }}</td>
                        <td class="px-5 py-3">
                          <div class="font-semibold" :class="item.violation_count > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'">
                            {{ item.violation_count || 0 }}x
                          </div>
                          <div v-if="item.violation_logs?.length" class="mt-1 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <p v-for="log in item.violation_logs.slice(0, 3)" :key="`pending-log-${item.id}-${log.id}`">
                              {{ formatViolationLabel(log.violation_type) }} • {{ formatStoredDateTime(log.created_at) }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="quizOverviewModal.pendingStudents.length === 0">
                        <td colspan="3" class="px-5 py-8 text-center text-slate-500">Semua siswa sudah submit.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </section>
              </div>

              <section v-if="quizOverviewModal.analytics.question_breakdown?.length"
                class="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:mt-6 sm:rounded-2xl dark:border-slate-800 dark:bg-slate-900">
                <div class="border-b border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/50 sm:px-5 sm:py-4">
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">Analitik Soal</h3>
                </div>
                <div class="overflow-x-auto">
                  <table class="min-w-[760px] divide-y divide-slate-100 text-left text-xs dark:divide-slate-800 sm:text-sm">
                    <thead class="bg-white dark:bg-slate-900">
                      <tr>
                        <th class="px-5 py-3 font-semibold text-slate-500">No</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Soal</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Terjawab</th>
                        <th class="px-5 py-3 font-semibold text-emerald-600 dark:text-emerald-400">Benar</th>
                        <th class="px-5 py-3 font-semibold text-red-600 dark:text-red-400">Salah</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Akurasi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="item in quizOverviewModal.analytics.question_breakdown"
                        :key="`question-${item.question_number}`">
                        <td class="px-5 py-3 font-medium text-slate-900 dark:text-white">{{ item.question_number }}</td>
                        <td class="px-5 py-3 text-slate-900 dark:text-white">{{ item.question }}</td>
                        <td class="px-5 py-3 text-slate-500 dark:text-slate-400">{{ item.answered_count }}</td>
                        <td class="px-5 py-3 font-medium text-emerald-600 dark:text-emerald-400">{{ item.correct_count }}
                        </td>
                        <td class="px-5 py-3 font-medium text-red-600 dark:text-red-400">{{ item.wrong_count }}</td>
                        <td class="px-5 py-3 font-bold text-slate-700 dark:text-slate-300">{{ item.correct_rate }}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Transition>
    </teleport>

    <teleport to="body">
      <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="deleteQuizModal.open"
          class="quiz-delete-modal-overlay fixed inset-y-0 left-0 right-0 z-[270] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div
            class="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/10"
            @click.stop>
            <div class="px-4 pt-4 sm:px-5 sm:pt-5">
              <div class="flex items-start gap-3">
                <span
                  class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                  <Icon icon="ph:trash" class="h-4 w-4" />
                </span>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white sm:text-base">Hapus Quiz Berjalan?</h3>
                  <p class="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm">
                    Quiz <span class="font-semibold text-slate-900 dark:text-white">{{ deleteQuizModal.assignment?.title || "-" }}</span>
                    akan dihapus beserta data submission dan log pelanggaran siswa.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50 sm:px-5">
              <button type="button" @click="closeDeleteQuizModal" :disabled="isDeletingQuiz"
                class="inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold text-slate-600 transition hover:bg-white disabled:opacity-60 dark:text-slate-300 dark:hover:bg-slate-700 sm:px-4 sm:text-sm">
                Batal
              </button>
              <button type="button" @click="confirmDeleteQuiz" :disabled="isDeletingQuiz"
                class="inline-flex h-9 items-center justify-center rounded-lg bg-rose-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60 sm:px-4 sm:text-sm">
                {{ isDeletingQuiz ? "Menghapus..." : "Hapus Quiz" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </teleport>

    <teleport to="body">
      <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="questionPreviewModal.open"
          class="quiz-review-modal-overlay fixed inset-y-0 left-0 right-0 z-[260] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm sm:p-4">

        <div
          class="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div
            class="flex flex-none items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Review Soal</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{ questionPreviewModalQuestionHeader }}
              </p>
            </div>
            <button @click="closeQuestionPreview"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="questionPreviewModal.question" class="space-y-6">
              <section
                class="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
                <div class="flex flex-wrap items-center gap-3">
                  <span
                    class="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
                    {{ questionPreviewModalNumberLabel }}
                  </span>
                  <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset"
                    :class="questionPreviewModal.question.question_type === 'MCQ' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300' : 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300'">
                    {{ assignmentTypeLabel(questionPreviewModal.question.question_type) }}
                  </span>
                </div>
                <p class="mt-4 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  {{ parseQuestionContent(questionPreviewModal.question.question_text).question_text }}
                </p>
                <img v-if="parseQuestionContent(questionPreviewModal.question.question_text).question_image_url"
                  :src="parseQuestionContent(questionPreviewModal.question.question_text).question_image_url"
                  alt="Gambar soal" class="mt-4 max-h-64 rounded-xl border border-slate-200 object-contain dark:border-slate-700" />
              </section>

              <section class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="font-semibold text-slate-900 dark:text-white">Edit Soal</h3>
                  <span class="text-xs text-slate-500 dark:text-slate-400">Perubahan akan disimpan ke bank soal</span>
                </div>

                <div class="mt-4 space-y-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Pertanyaan</label>
                    <textarea v-model="questionPreviewForm.question_text" rows="4"
                      class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700" />
                  </div>

                  <div v-if="questionPreviewModal.question.question_type === 'MCQ'" class="space-y-3">
                    <label v-for="(option, optionIndex) in questionPreviewForm.options"
                      :key="`edit-option-${optionIndex}`"
                      class="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition dark:bg-slate-900"
                      :class="Number(questionPreviewForm.correct_option) === optionIndex
                        ? 'border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'">
                      <span
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {{ String.fromCharCode(65 + optionIndex) }}
                      </span>
                      <input v-model="questionPreviewForm.options[optionIndex]" type="text"
                        :placeholder="`Tulis pilihan ${String.fromCharCode(65 + optionIndex)}`"
                        class="min-w-0 flex-1 rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/70 dark:text-white dark:ring-slate-700" />
                      <input v-model="questionPreviewForm.correct_option" type="radio" name="preview-correct-option"
                        :value="optionIndex" class="h-4 w-4 shrink-0 text-sky-600 focus:ring-sky-600" />
                      <span class="hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline-flex"
                        :class="Number(questionPreviewForm.correct_option) === optionIndex
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">
                        Benar
                      </span>
                    </label>
                  </div>

                  <div v-else class="space-y-1.5">
                    <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Rubrik
                      Penilaian</label>
                    <textarea v-model="questionPreviewForm.rubric" rows="4"
                      class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700" />
                  </div>
                </div>
              </section>

              <section v-if="questionPreviewModal.question.question_type === 'MCQ'" class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-slate-900 dark:text-white">Pilihan Jawaban</h3>
                  <span class="text-xs text-slate-500 dark:text-slate-400">Review sebelum soal diterbitkan</span>
                </div>
                <div class="grid gap-3">
                  <article v-for="(option, optionIndex) in normalizedPreviewOptions"
                    :key="`preview-option-${optionIndex}`" class="rounded-xl border p-4 transition"
                    :class="optionIndex === normalizedPreviewCorrectOption ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-start gap-3">
                        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                          :class="optionIndex === normalizedPreviewCorrectOption ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'">
                          {{ String.fromCharCode(65 + optionIndex) }}
                        </span>
                        <p class="text-sm font-medium leading-6 text-slate-800 dark:text-slate-200">{{ option }}</p>
                      </div>
                      <span v-if="optionIndex === normalizedPreviewCorrectOption"
                        class="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                        Jawaban Benar
                      </span>
                    </div>
                  </article>
                </div>
              </section>

              <section v-else
                class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <h3 class="font-semibold text-slate-900 dark:text-white">Rubrik Penilaian</h3>
                <p class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {{ questionPreviewModal.question.rubric || "Rubrik belum diisi." }}
                </p>
              </section>
            </div>
          </div>

          <div
            class="flex flex-none items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
            <button @click="closeQuestionPreview" type="button"
              class="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Tutup
            </button>
            <button type="button" @click="saveQuestionPreviewChanges" :disabled="isSavingQuestionPreview"
              class="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-50">
              {{ isSavingQuestionPreview ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
          </div>
        </div>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { id as indonesiaLocale } from "date-fns/locale/id";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDateTime, formatDateTimeLocalInput, formatStoredDateTime, parseDateValue } from "@/utils/date";

const subjects = ref([]);
const selectedSubject = ref(null);
const assignments = ref([]);
const questionBank = ref([]);
const questionBankTotal = ref(0);
const subjectsLoading = ref(true);
const contentLoading = ref(false);
const subjectError = ref("");
const message = ref("");
const isError = ref(false);
const isSavingAssignment = ref(false);
const isSavingQuestionBank = ref(false);
const isSavingQuestionPreview = ref(false);
const isDeletingQuiz = ref(false);
const isDownloadingTemplate = ref(false);
const isImportingQuestionBank = ref(false);
const questionBankModalOpen = ref(false);
const assignmentGuideModal = ref(false);
const assignmentPublishModal = ref(false);
const questionBankDocumentInput = ref(null);
const questionBankImportFile = ref(null);
const bankSearch = ref("");
const bankTypeFilter = ref("ALL");
const bankPageSize = ref(20);
const bankCurrentPage = ref(1);
const randomQuestionCount = ref(5);
const activeQuizMenu = ref("bank");
const quizOverviewModal = reactive({
  open: false,
  loading: false,
  assignment: null,
  analytics: {},
  submittedStudents: [],
  pendingStudents: [],
});
const deleteQuizModal = reactive({
  open: false,
  assignment: null,
});
const questionPreviewModal = reactive({
  open: false,
  question: null,
  source: "bank",
  sourceLabel: "",
  questionNumber: null,
});
const questionPreviewForm = reactive({
  question_text: "",
  options: ["", "", "", "", ""],
  correct_option: 0,
  rubric: "",
});

const questionBankImportFileName = computed(() => questionBankImportFile.value?.name || "");

// Fitur: Body Scroll Lock saat modal aktif
const isAnyModalOpen = computed(() =>
  assignmentGuideModal.value || assignmentPublishModal.value || questionBankModalOpen.value || quizOverviewModal.open || questionPreviewModal.open || deleteQuizModal.open,
);

watch(isAnyModalOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

const assignmentForm = reactive({
  title: "",
  description: "",
  due_date: "",
  assignment_type: "",
  shuffle_questions: false,
  question_duration_mode: "PER_QUESTION",
  question_duration_value: 10,
  max_violations: 3,
  selected_question_bank_ids: [],
});
const assignmentDueDateValue = ref(null);

const questionBankForm = reactive({
  question_type: "MCQ",
  question_text: "",
  options: ["", "", "", "", ""],
  correct_option: 0,
  rubric: "",
});

const QUESTION_IMAGE_MARKER = "[[QUESTION_IMAGE_URL]]";

const parseQuestionContent = (rawText) => {
  const text = String(rawText || "");
  const markerIndex = text.lastIndexOf(QUESTION_IMAGE_MARKER);
  if (markerIndex === -1) {
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

const parseOptionItem = (option) => {
  if (option && typeof option === "object" && !Array.isArray(option)) {
    return {
      text: String(option.text || option.label || "").trim(),
    };
  }
  return {
    text: String(option || "").trim(),
  };
};

const tryParseJSON = (value) => {
  try {
    return {
      parsed: true,
      value: JSON.parse(value),
    };
  } catch {
    return {
      parsed: false,
      value: null,
    };
  }
};

const normalizeOptionText = (value) => String(value || "").trim();

const normalizeOptionArray = (options) => {
  if (!Array.isArray(options)) {
    return [];
  }

  return options.flatMap((option) => {
    if (typeof option === "string") {
      const trimmed = option.trim();
      if (!trimmed) {
        return [];
      }

      const parsedOption = tryParseJSON(trimmed);
      if (parsedOption.parsed) {
        if (Array.isArray(parsedOption.value)) {
          return normalizeOptionArray(parsedOption.value);
        }

        if (parsedOption.value && typeof parsedOption.value === "object") {
          const text = normalizeOptionText(parseOptionItem(parsedOption.value).text);
          return text ? [text] : [];
        }

        if (typeof parsedOption.value === "string") {
          const nestedOptions = parseOptionsField(parsedOption.value);
          if (nestedOptions.length) {
            return nestedOptions;
          }

          const text = normalizeOptionText(parsedOption.value);
          return text ? [text] : [];
        }
      }
    }

    const text = normalizeOptionText(parseOptionItem(option).text);
    return text ? [text] : [];
  });
};

const parseOptionsField = (value) => {
  let currentValue = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(currentValue)) {
      return normalizeOptionArray(currentValue);
    }

    if (typeof currentValue !== "string" || !currentValue.trim()) {
      return [];
    }

    const parsed = tryParseJSON(currentValue.trim());
    if (!parsed.parsed) {
      return [];
    }

    currentValue = parsed.value;
  }

  return Array.isArray(currentValue) ? normalizeOptionArray(currentValue) : [];
};

const normalizeQuestionBankItem = (item) => ({
  ...item,
  options: parseOptionsField(item?.options),
  correct_option: Number.isInteger(Number(item?.correct_option)) ? Number(item.correct_option) : 0,
});

const assignmentTypeLabel = (type) => {
  if (type === "MCQ") return "Quiz Pilihan Ganda";
  if (type === "ESSAY") return "Quiz Uraian";
  return "Quiz";
};

const formatViolationLabel = (type) => {
  if (type === "FULLSCREEN_EXIT") return "Keluar fullscreen";
  if (type === "TAB_SWITCH") return "Pindah tab";
  if (type === "WINDOW_BLUR") return "Pindah fokus";
  return "Pelanggaran";
};

const formatDurationSeconds = (value) => {
  const totalSeconds = Number(value || 0);
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "-";
  }

  if (totalSeconds < 60) {
    return `${totalSeconds} detik`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes}m ${seconds}dtk` : `${minutes} menit`;
};

const filteredQuestionBank = computed(() => questionBank.value);

const bankTotalPages = computed(() => Math.max(1, Math.ceil(questionBankTotal.value / Number(bankPageSize.value || 20))));

const paginatedQuestionBank = computed(() => questionBank.value);

const bankStartRow = computed(() => {
  if (questionBankTotal.value === 0) return 0;
  return (bankCurrentPage.value - 1) * Number(bankPageSize.value || 20) + 1;
});

const bankEndRow = computed(() => {
  if (questionBankTotal.value === 0) return 0;
  return Math.min(bankCurrentPage.value * Number(bankPageSize.value || 20), questionBankTotal.value);
});

const filteredQuestionBankForAssignment = computed(() =>
  !assignmentForm.assignment_type
    ? questionBank.value
    : questionBank.value.filter((item) => item.question_type === assignmentForm.assignment_type),
);

const selectedQuestionsForPublish = computed(() =>
  questionBank.value.filter((item) => assignmentForm.selected_question_bank_ids.includes(item.id)),
);

const selectedQuestionCount = computed(() => assignmentForm.selected_question_bank_ids.length);
const totalRunningSubmissions = computed(() =>
  runningAssignments.value.reduce((total, item) => total + Number(item.submission_count || 0), 0),
);
const selectedQuestionTypeLabel = computed(() => {
  if (!assignmentForm.assignment_type) {
    return "Otomatis dari soal yang dipilih";
  }
  return assignmentTypeLabel(assignmentForm.assignment_type);
});
const normalizedPreviewOptions = computed(() =>
  questionPreviewModal.question?.question_type === "MCQ"
    ? questionPreviewForm.options.map((item) => parseOptionItem(item).text).filter(Boolean)
    : [],
);
const normalizedPreviewCorrectOption = computed(() =>
  Number.isInteger(Number(questionPreviewForm.correct_option))
    ? Number(questionPreviewForm.correct_option)
    : -1,
);
const questionPreviewModalSourcePrefix = computed(() =>
  questionPreviewModal.source === "selected" ? "Soal Terpilih" : "Bank Soal",
);
const questionPreviewModalNumberText = computed(() => {
  if (questionPreviewModal.questionNumber) {
    return `Nomor ${questionPreviewModal.questionNumber}`;
  }
  return questionPreviewModal.question?.id ? `ID ${questionPreviewModal.question.id}` : "Draft";
});
const questionPreviewModalQuestionTypeText = computed(() =>
  assignmentTypeLabel(questionPreviewModal.question?.question_type),
);
const questionPreviewModalQuestionHeader = computed(() =>
  `${questionPreviewModalSourcePrefix.value} • ${questionPreviewModalQuestionTypeText.value}`,
);
const questionPreviewModalNumberLabel = computed(() =>
  `${questionPreviewModalSourcePrefix.value} - ${questionPreviewModalNumberText.value}`,
);
const runningAssignments = computed(() =>
  [...assignments.value].sort((left, right) => {
    const leftTime = parseDateValue(left?.due_date)?.getTime() || 0;
    const rightTime = parseDateValue(right?.due_date)?.getTime() || 0;
    return rightTime - leftTime;
  }),
);


watch([bankSearch, bankTypeFilter, bankPageSize], () => {
  bankCurrentPage.value = 1;
});

watch([bankSearch, bankTypeFilter, bankPageSize, bankCurrentPage], async () => {
  if (!selectedSubject.value) {
    return;
  }
  await loadSubjectData();
});

watch([questionBankTotal, bankPageSize], () => {
  if (bankCurrentPage.value > bankTotalPages.value) {
    bankCurrentPage.value = bankTotalPages.value;
  }
});

watch(assignmentPublishModal, (isOpen) => {
  if (!isOpen) return;
  assignmentDueDateValue.value = parseDateValue(assignmentForm.due_date);
});

watch(assignmentDueDateValue, (value) => {
  const nextValue = value ? formatDateTimeLocalInput(value) : "";
  if (assignmentForm.due_date === nextValue) {
    return;
  }
  assignmentForm.due_date = nextValue;
});

const resetQuestionBankForm = () => {
  questionBankForm.question_type = "MCQ";
  questionBankForm.question_text = "";
  questionBankForm.options = ["", "", "", "", ""];
  questionBankForm.correct_option = 0;
  questionBankForm.rubric = "";
};

const resetQuestionBankImport = () => {
  questionBankImportFile.value = null;
  if (questionBankDocumentInput.value) {
    questionBankDocumentInput.value.value = "";
  }
};

const resetAssignmentForm = () => {
  assignmentForm.title = "";
  assignmentForm.description = "";
  assignmentForm.due_date = "";
  assignmentForm.assignment_type = "";
  assignmentForm.shuffle_questions = false;
  assignmentForm.question_duration_mode = "PER_QUESTION";
  assignmentForm.question_duration_value = 10;
  assignmentForm.max_violations = 3;
  assignmentForm.selected_question_bank_ids = [];
  assignmentDueDateValue.value = null;
};

const setQuestionDurationMode = (mode) => {
  if (assignmentForm.question_duration_mode === mode) {
    return;
  }
  assignmentForm.question_duration_mode = mode;
  assignmentForm.question_duration_value = mode === "GLOBAL" ? 30 : 10;
};

const clearSelectedQuestions = () => {
  assignmentForm.selected_question_bank_ids = [];
  assignmentForm.assignment_type = "";
};

const toggleQuestionSelection = (question) => {
  const isSelected = assignmentForm.selected_question_bank_ids.includes(question.id);

  if (isSelected) {
    assignmentForm.selected_question_bank_ids = assignmentForm.selected_question_bank_ids.filter((id) => id !== question.id);
    if (assignmentForm.selected_question_bank_ids.length === 0) {
      assignmentForm.assignment_type = "";
    }
    return;
  }

  if (assignmentForm.assignment_type && assignmentForm.assignment_type !== question.question_type) {
    isError.value = true;
    message.value = "Satu quiz hanya bisa memakai satu jenis soal. Pilih soal dengan tipe yang sama.";
    return;
  }

  assignmentForm.assignment_type = question.question_type;
  assignmentForm.selected_question_bank_ids = [...assignmentForm.selected_question_bank_ids, question.id];
};

const openAssignmentPublishFlow = () => {
  if (selectedQuestionCount.value <= 0) {
    assignmentGuideModal.value = true;
    assignmentPublishModal.value = false;
    return;
  }

  assignmentGuideModal.value = false;
  assignmentPublishModal.value = true;
};

const selectAllCurrentBankPage = () => {
  const pageType = assignmentForm.assignment_type || paginatedQuestionBank.value[0]?.question_type || "";
  const ids = paginatedQuestionBank.value
    .filter((item) => !pageType || item.question_type === pageType)
    .map((item) => item.id);
  if (pageType) {
    assignmentForm.assignment_type = pageType;
  }
  assignmentForm.selected_question_bank_ids = Array.from(new Set([...assignmentForm.selected_question_bank_ids, ...ids]));
};

const generateRandomSelection = () => {
  const resolvedType = assignmentForm.assignment_type || questionBank.value[0]?.question_type || "";
  const pool = [...questionBank.value.filter((item) => !resolvedType || item.question_type === resolvedType)];
  const count = Math.max(1, Number(randomQuestionCount.value) || 1);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  if (resolvedType) {
    assignmentForm.assignment_type = resolvedType;
  }
  assignmentForm.selected_question_bank_ids = pool.slice(0, count).map((item) => item.id);
};

const closeQuizOverview = () => {
  quizOverviewModal.open = false;
  quizOverviewModal.loading = false;
  quizOverviewModal.assignment = null;
  quizOverviewModal.analytics = {};
  quizOverviewModal.submittedStudents = [];
  quizOverviewModal.pendingStudents = [];
};

const openDeleteQuizModal = (assignment) => {
  deleteQuizModal.open = true;
  deleteQuizModal.assignment = assignment;
};

const closeDeleteQuizModal = () => {
  if (isDeletingQuiz.value) return;
  deleteQuizModal.open = false;
  deleteQuizModal.assignment = null;
};

const confirmDeleteQuiz = async () => {
  if (!deleteQuizModal.assignment?.id) return;

  const assignmentId = deleteQuizModal.assignment.id;
  isDeletingQuiz.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.delete(`/learning/assignments/${assignmentId}`);
    if (quizOverviewModal.assignment?.id === assignmentId) {
      closeQuizOverview();
    }
    deleteQuizModal.open = false;
    deleteQuizModal.assignment = null;
    await loadSubjectData();
    pushToast({
      title: "Quiz Dihapus",
      message: response?.message || "Quiz berjalan berhasil dihapus.",
      type: "success",
    });
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Gagal Hapus Quiz",
      message: error.message || "Quiz gagal dihapus.",
      type: "error",
    });
  } finally {
    isDeletingQuiz.value = false;
  }
};

const openQuestionPreview = (question, source = "bank", questionNumber = null) => {
  const normalizedQuestion = normalizeQuestionBankItem(question || {});
  questionPreviewModal.open = true;
  questionPreviewModal.question = { ...normalizedQuestion };
  questionPreviewModal.source = source;
  questionPreviewModal.sourceLabel = source === "selected" ? "Soal yang akan diterbitkan" : "Review sebelum dipilih";
  questionPreviewModal.questionNumber = questionNumber;
  questionPreviewForm.question_text = normalizedQuestion.question_text || "";
  questionPreviewForm.options = Array.from(
    { length: Math.max(5, Array.isArray(normalizedQuestion.options) ? normalizedQuestion.options.length : 0) },
    (_, index) => parseOptionItem(normalizedQuestion.options?.[index]).text,
  );
  questionPreviewForm.correct_option = Number(normalizedQuestion.correct_option || 0);
  questionPreviewForm.rubric = normalizedQuestion.rubric || "";
};

const closeQuestionPreview = () => {
  questionPreviewModal.open = false;
  questionPreviewModal.question = null;
  questionPreviewModal.source = "bank";
  questionPreviewModal.sourceLabel = "";
  questionPreviewModal.questionNumber = null;
  questionPreviewForm.question_text = "";
  questionPreviewForm.options = ["", "", "", "", ""];
  questionPreviewForm.correct_option = 0;
  questionPreviewForm.rubric = "";
};

const saveQuestionPreviewChanges = async () => {
  if (!questionPreviewModal.question?.id) return;

  isSavingQuestionPreview.value = true;
  message.value = "";
  isError.value = false;

  try {
    const payload = {
      question_text: questionPreviewForm.question_text,
      rubric: questionPreviewModal.question.question_type === "ESSAY" ? questionPreviewForm.rubric || null : null,
    };

    if (questionPreviewModal.question.question_type === "MCQ") {
      payload.options = questionPreviewForm.options;
      payload.correct_option = questionPreviewForm.correct_option;
    }

    const response = await api.put(`/learning/question-bank/${questionPreviewModal.question.id}`, payload);
    const updatedQuestion = normalizeQuestionBankItem(response?.data || {});

    if (updatedQuestion) {
      questionPreviewModal.question = { ...updatedQuestion };
      if (questionPreviewModal.source === "selected" || questionPreviewModal.source === "bank") {
        questionPreviewForm.question_text = updatedQuestion.question_text || "";
        questionPreviewForm.options = Array.from(
          { length: Math.max(5, Array.isArray(updatedQuestion.options) ? updatedQuestion.options.length : 0) },
          (_, index) => parseOptionItem(updatedQuestion.options?.[index]).text,
        );
        questionPreviewForm.correct_option = Number(updatedQuestion.correct_option || 0);
        questionPreviewForm.rubric = updatedQuestion.rubric || "";
      }
    }

    message.value = response?.message || "Soal berhasil diperbarui";
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSavingQuestionPreview.value = false;
  }
};

const openQuizOverview = async (assignment) => {
  quizOverviewModal.open = true;
  quizOverviewModal.loading = true;
  quizOverviewModal.assignment = assignment;

  try {
    const response = await api.get(`/learning/assignments/${assignment.id}/overview`);
    const data = response?.data || {};
    quizOverviewModal.analytics = data.analytics || {};
    quizOverviewModal.submittedStudents = data.submitted_students || [];
    quizOverviewModal.pendingStudents = data.pending_students || [];
  } catch (error) {
    message.value = error.message;
    isError.value = true;
    closeQuizOverview();
  } finally {
    quizOverviewModal.loading = false;
  }
};

const loadSubjects = async () => {
  subjectError.value = "";
  try {
    const response = await api.get("/learning/subjects/teacher");
    subjects.value = response?.data || [];
    if (!selectedSubject.value && subjects.value.length > 0) {
      await selectSubject(subjects.value[0]);
    }
  } catch (error) {
    subjectError.value = error.message;
  } finally {
    subjectsLoading.value = false;
  }
};

const loadSubjectData = async () => {
  if (!selectedSubject.value) return;

  contentLoading.value = true;
  try {
  const [assignmentResponse, questionBankResponse] = await Promise.all([
    api.get(`/learning/subjects/${selectedSubject.value.id}/assignments`),
    api.get(`/learning/subjects/${selectedSubject.value.id}/question-bank`, {
      params: {
        keyword: bankSearch.value || "",
        question_type: bankTypeFilter.value === "ALL" ? "" : bankTypeFilter.value,
        page: bankCurrentPage.value,
        limit: bankPageSize.value,
      },
    }),
  ]);

  const filteredAssignments = (assignmentResponse?.data || []).filter(
    (item) => item.assignment_type !== "FILE" && !item.is_exam,
  );

  const assignmentsWithSubmissionCount = await Promise.all(
    filteredAssignments.map(async (assignment) => {
      try {
        const overviewResponse = await api.get(`/learning/assignments/${assignment.id}/overview`);
        const overviewData = overviewResponse?.data || {};
        const analytics = overviewData.analytics || {};
        const submittedStudents = Array.isArray(overviewData.submitted_students) ? overviewData.submitted_students : [];
        return {
          ...assignment,
          submission_count: Number(analytics.submitted_count ?? submittedStudents.length ?? 0),
        };
      } catch {
        return {
          ...assignment,
          submission_count: Number(assignment.submission_count || 0),
        };
      }
    }),
  );

  assignments.value = assignmentsWithSubmissionCount;
  questionBank.value = (questionBankResponse?.data?.data || []).map(normalizeQuestionBankItem);
  questionBankTotal.value = questionBankResponse?.data?.total || 0;
  } finally {
    contentLoading.value = false;
  }
};

const selectSubject = async (subject) => {
  selectedSubject.value = subject;
  message.value = "";
  bankSearch.value = "";
  bankTypeFilter.value = "ALL";
  bankCurrentPage.value = 1;
  activeQuizMenu.value = "bank";
  resetAssignmentForm();
  assignmentGuideModal.value = false;
  assignmentPublishModal.value = false;
  resetQuestionBankImport();
  closeQuestionPreview();
  closeQuizOverview();
  await loadSubjectData();
};

const handleQuestionBankDocumentChange = (event) => {
  questionBankImportFile.value = event.target.files?.[0] || null;
};

const downloadQuestionBankTemplate = async (questionType) => {
  if (!selectedSubject.value) return;

  isDownloadingTemplate.value = true;
  message.value = "";
  isError.value = false;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${api.baseUrl}/learning/subjects/${selectedSubject.value.id}/question-bank/template?question_type=${encodeURIComponent(questionType)}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );

    if (!response.ok) {
      let payload = null;
      try {
        payload = await response.json();
      } catch (error) {
        payload = null;
      }

      throw new Error(payload?.message || `Request failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `template-bank-soal-${selectedSubject.value.name || "mapel"}-${String(questionType).toLowerCase()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    message.value = `Template ${questionType === "MCQ" ? "pilihan ganda" : "uraian"} berhasil diunduh.`;
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isDownloadingTemplate.value = false;
  }
};

const importQuestionBankDocument = async () => {
  if (!selectedSubject.value || !questionBankImportFile.value) return;

  isImportingQuestionBank.value = true;
  message.value = "";
  isError.value = false;

  try {
    const formData = new FormData();
    formData.append("document", questionBankImportFile.value);

    const response = await api.post(
      `/learning/subjects/${selectedSubject.value.id}/question-bank/import`,
      formData,
    );

    const summary = response?.data || {};
    message.value = response?.message
      ? `${response.message}: ${summary.total || 0} soal, ${summary.mcq || 0} pilihan ganda, ${summary.essay || 0} uraian.`
      : "Import soal berhasil";
    resetQuestionBankImport();
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isImportingQuestionBank.value = false;
  }
};

const submitQuestionBank = async () => {
  if (!selectedSubject.value) return;

  isSavingQuestionBank.value = true;
  message.value = "";
  isError.value = false;

  try {
    const payload = {
      subject_id: selectedSubject.value.id,
      question_type: questionBankForm.question_type,
      question_text: questionBankForm.question_text,
      rubric: questionBankForm.rubric || null,
    };

    if (questionBankForm.question_type === "MCQ") {
      payload.options = questionBankForm.options;
      payload.correct_option = questionBankForm.correct_option;
    }

    const response = await api.post("/learning/question-bank", payload);
    message.value = response?.message || "Soal bank berhasil ditambahkan";
    resetQuestionBankForm();
    questionBankModalOpen.value = false;
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSavingQuestionBank.value = false;
  }
};

const submitAssignment = async () => {
  if (!selectedSubject.value) return;

  isSavingAssignment.value = true;
  message.value = "";
  isError.value = false;

  try {
    const durationValue = Number(assignmentForm.question_duration_value) || 0;
    if (assignmentForm.question_duration_mode === "GLOBAL" && (durationValue < 1 || durationValue > 180)) {
      throw new Error("Durasi quiz global harus 1 sampai 180 menit.");
    }
    if (assignmentForm.question_duration_mode !== "GLOBAL" && durationValue < 1) {
      throw new Error("Durasi per soal minimal 1 detik.");
    }

    const formData = new FormData();
    formData.append("subject_id", selectedSubject.value.id);
    formData.append("title", assignmentForm.title);
    formData.append("description", assignmentForm.description || "");
    formData.append("due_date", assignmentForm.due_date || "");
    formData.append("assignment_type", assignmentForm.assignment_type);
    formData.append("shuffle_questions", String(Boolean(assignmentForm.shuffle_questions)));
    formData.append("question_duration_mode", assignmentForm.question_duration_mode);
    formData.append("max_violations", String(Number(assignmentForm.max_violations) || 3));
    if (assignmentForm.question_duration_mode === "GLOBAL") {
      formData.append("question_duration_minutes", String(durationValue));
    } else {
      formData.append("question_duration_seconds", String(durationValue));
    }
    formData.append("question_bank_ids", JSON.stringify(assignmentForm.selected_question_bank_ids));

    const response = await api.post("/learning/assignments", formData);
    message.value = response?.message || "Quiz berhasil diterbitkan";
    assignmentPublishModal.value = false;
    pushToast({
      title: "Quiz Berhasil Diterbitkan",
      message: response?.message || "Quiz berhasil diterbitkan dan siap dikerjakan siswa.",
      type: "success",
    });
    resetAssignmentForm();
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSavingAssignment.value = false;
  }
};

onMounted(loadSubjects);
</script>

<style scoped>
:deep(.quiz-deadline-picker) {
  width: 100%;
  min-height: 44px;
  border-radius: 0.5rem;
  border: 1px solid rgb(203 213 225);
  background: rgb(255 255 255);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(15 23 42);
}

:deep(.quiz-deadline-picker:focus) {
  border-color: rgb(37 99 235);
  outline: none;
  box-shadow: 0 0 0 1px rgb(37 99 235);
}

:deep(.dark .quiz-deadline-picker) {
  border-color: rgb(71 85 105);
  background: rgb(15 23 42);
  color: rgb(248 250 252);
}

@media (min-width: 1024px) {
  .quiz-overview-modal-overlay {
    left: 320px;
  }

  .quiz-review-modal-overlay {
    left: 320px;
  }

  .quiz-delete-modal-overlay {
    left: 320px;
  }
}

@media (max-width: 768px) {
  .quiz-overview-detail :deep(th),
  .quiz-overview-detail :deep(td) {
    padding: 0.625rem 0.75rem !important;
    vertical-align: top;
  }

  .quiz-overview-detail :deep(th) {
    white-space: nowrap;
  }

  .learning-quiz-teacher-page :deep(.text-2xl),
  .learning-quiz-teacher-page :deep(.text-xl),
  .learning-quiz-teacher-page :deep(.text-lg) {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }

  .learning-quiz-teacher-page :deep(.text-base) {
    font-size: 0.8125rem !important;
    line-height: 1.2rem !important;
  }

  .learning-quiz-teacher-page :deep(.text-sm) {
    font-size: 0.75rem !important;
    line-height: 1.1rem !important;
  }

  .learning-quiz-teacher-page :deep(.text-xs) {
    font-size: 0.6875rem !important;
    line-height: 1rem !important;
  }

  .learning-quiz-teacher-page :deep(.px-6) {
    padding-left: 0.875rem !important;
    padding-right: 0.875rem !important;
  }

  .learning-quiz-teacher-page :deep(.p-6) {
    padding: 0.875rem !important;
  }

  :deep(.quiz-deadline-picker) {
    min-height: 38px;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }
}
</style>
