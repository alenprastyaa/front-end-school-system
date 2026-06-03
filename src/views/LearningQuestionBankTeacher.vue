<template>
  <div
    class="learning-question-bank-page min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">

    <main class="min-h-screen">
      <section class="border-b border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-4 md:px-6">
        <div class="flex flex-col gap-1">
          <h1 class="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Bank Soal</h1>
        </div>

        <div v-if="subjectError"
          class="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
          {{ subjectError }}
        </div>

        <div ref="subjectDropdownRef" class="relative mt-3 max-w-xl">
          <label
            class="mb-1.5 block text-[11px] font-semibold text-slate-500 dark:text-slate-400 sm:text-xs">
            Mata pelajaran
          </label>
          <button type="button" @click="subjectDropdownOpen = !subjectDropdownOpen"
            class="group flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition sm:px-5 sm:py-4"
            :class="selectedSubject
              ? 'bg-sky-600 shadow-md ring-1 ring-sky-600 dark:bg-sky-500'
              : 'bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80'">
            <div class="min-w-0 flex-1">
              <p class="line-clamp-1 text-sm font-semibold tracking-tight sm:text-lg"
                :class="selectedSubject ? 'text-white' : 'text-slate-900 dark:text-white'">
                {{ selectedSubject?.name || "Pilih mata pelajaran" }}
              </p>
              <p class="mt-1 line-clamp-2 text-[11px] leading-4 sm:text-sm"
                :class="selectedSubject ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'">
                {{ selectedSubject ? `${selectedSubject.class_name}${selectedSubject.description ? ` • ${selectedSubject.description}` : ""}` : "Ketuk untuk memilih dari daftar" }}
              </p>
            </div>
            <svg class="mt-0.5 h-5 w-5 shrink-0 transition-transform duration-200"
              :class="[selectedSubject ? 'text-sky-100' : 'text-slate-400', subjectDropdownOpen ? 'rotate-180' : '']"
              fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1 scale-[0.99]"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-120 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-1 scale-[0.99]">
            <div v-if="subjectDropdownOpen"
              class="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
              <button v-for="item in subjects" :key="item.id" type="button" @click="selectSubject(item)"
                class="mb-2 flex w-full items-start gap-3 rounded-xl border p-3 text-left transition last:mb-0"
                :class="selectedSubject?.id === item.id
                  ? 'bg-sky-600 shadow-md ring-1 ring-sky-600 dark:bg-sky-500'
                  : 'bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80'">
                <div class="min-w-0 flex-1">
                  <p class="line-clamp-1 text-sm font-semibold tracking-tight"
                    :class="selectedSubject?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'">
                    {{ item.name }}
                  </p>
                  <p class="mt-1 line-clamp-2 text-[11px] leading-4"
                    :class="selectedSubject?.id === item.id ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'">
                    {{ item.class_name }}{{ item.description ? ` • ${item.description}` : "" }}
                  </p>
                </div>
                <svg v-if="selectedSubject?.id === item.id" class="mt-0.5 h-4 w-4 shrink-0 text-white"
                  fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </transition>
        </div>
      </section>

      <div v-if="selectedSubject">
        <header class="border-b border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4 md:p-6">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 class="line-clamp-2 text-base font-semibold text-slate-900 dark:text-white sm:text-lg">{{ selectedSubject.name }}</h2>
              <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm">
                {{ selectedSubject.class_name }} &bull; {{ selectedSubject.description || "Tidak ada deskripsi." }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2 sm:justify-end">
              <button @click="openAiGeneratorModal" aria-label="Buat soal dengan AI" title="Buat soal dengan AI"
                class="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold whitespace-nowrap text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:px-4 sm:text-sm">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span class="hidden sm:inline">Buat Soal dengan AI</span>
              </button>
              <button @click="bulkImportModalOpen = true" aria-label="Import dari Word" title="Import dari Word"
                class="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-white px-3 text-xs font-semibold whitespace-nowrap text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-slate-700 sm:px-4 sm:text-sm">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span class="hidden sm:inline">Import dari Word</span>
              </button>
              <button @click="questionBankModalOpen = true" aria-label="Tambah soal" title="Tambah soal"
                class="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-semibold whitespace-nowrap text-white transition hover:bg-blue-700 sm:px-4 sm:text-sm">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span class="hidden sm:inline">Tambah Soal</span>
              </button>
            </div>
          </div>
        </header>

        <div class="space-y-3 p-3 sm:p-4 md:p-6">
          <section
            class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl">
            <div class="border-b border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900 sm:p-3">
              <div class="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-row xl:items-center">
                  <input v-model="bankSearch" type="text" placeholder="Cari soal..."
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:text-sm xl:w-64" />
                  <select v-model="bankTypeFilter"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:text-sm xl:w-44">
                    <option value="ALL">Semua Jenis</option>
                    <option value="MCQ">Pilihan Ganda</option>
                    <option value="ESSAY">Uraian</option>
                  </select>
                  <select v-model="bankPageSize"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:text-sm xl:w-32">
                    <option :value="10">10 soal</option>
                    <option :value="20">20 soal</option>
                    <option :value="50">50 soal</option>
                  </select>
                </div>
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
                  <span class="text-[11px] leading-4 text-slate-500 dark:text-slate-400 sm:text-xs">
                    {{ questionBankTotal }} soal &bull; {{ assignmentForm.selected_question_bank_ids.length }} dicentang
                  </span>
                  <button @click="selectAllCurrentBankPage" type="button"
                    class="inline-flex h-9 items-center justify-center rounded-xl border border-blue-600 bg-white px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 dark:bg-slate-900 dark:text-blue-300 sm:px-4 sm:text-sm">
                    Centang Halaman Ini
                  </button>
                </div>
              </div>
            </div>

            <div v-if="assignmentForm.selected_question_bank_ids.length > 0"
              class="flex flex-col gap-2 border-b border-slate-200 bg-blue-50 px-3 py-2.5 dark:border-slate-700 dark:bg-blue-500/10 sm:px-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-xs font-semibold leading-4 text-blue-900 dark:text-blue-200 sm:text-sm">
                  {{ assignmentForm.selected_question_bank_ids.length }} soal sedang dicentang
                </p>
                <p class="mt-1 text-[11px] leading-4 text-blue-700 dark:text-blue-300 sm:text-xs">
                  Kosongkan centang tidak menghapus soal. Hapus permanen akan meminta konfirmasi merah.
                </p>
              </div>
              <div class="flex flex-col gap-2 sm:flex-row">
                <button @click="clearSelectedQuestions" type="button"
                  class="inline-flex h-9 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 sm:px-4 sm:text-sm">
                  Kosongkan Centang
                </button>
                <button @click="deleteSelectedQuestionBankItems" type="button" :disabled="isSavingQuestionPreview"
                  class="inline-flex h-9 items-center justify-center rounded-xl bg-rose-500 px-3 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50 sm:px-4 sm:text-sm">
                  Hapus Soal
                </button>
              </div>
            </div>

            <div class="space-y-2 p-2.5 md:hidden">
              <article v-for="item in paginatedQuestionBank" :key="item.id"
                class="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div class="flex items-start gap-2.5">
                  <input v-model="assignmentForm.selected_question_bank_ids" type="checkbox" :value="item.id"
                    class="mt-1 h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-600 dark:bg-slate-800" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <span class="inline-flex shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold"
                        :class="item.question_type === 'MCQ'
                          ? 'border-blue-700 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'border-amber-700 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-900/30 dark:text-amber-300'">
                        {{ assignmentTypeLabel(item.question_type) }}
                      </span>
                      <button type="button" @click="openQuestionPreview(item, 'bank')"
                        class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        title="Edit soal" aria-label="Edit soal">
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2.2"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19.5 7.125 16.862 4.487M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                    </div>

                    <p class="mt-2 line-clamp-4 text-xs font-semibold leading-5 text-slate-900 dark:text-white">
                      {{ parseQuestionContent(item.question_text).question_text }}
                    </p>
                    <img v-if="parseQuestionContent(item.question_text).question_image_url"
                      :src="parseQuestionContent(item.question_text).question_image_url" alt="Gambar pertanyaan"
                      class="mt-2 max-h-36 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
                    <p class="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                      Dibuat: {{ formatDateTime(item.created_at) }}
                    </p>
                  </div>
                </div>
              </article>

              <div v-if="paginatedQuestionBank.length === 0"
                class="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900">
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum Ada Soal</p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  Soal yang cocok dengan pencarian akan muncul di sini.
                </p>
              </div>
            </div>

            <div class="hidden md:block">
              <table class="w-full text-left text-sm">
                <thead class="bg-white text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900">
                  <tr>
                    <th class="w-12 px-4 py-3 font-semibold">Pilih</th>
                    <th class="px-4 py-3 font-semibold">Soal</th>
                    <th class="px-4 py-3 font-semibold">Jenis</th>
                    <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                  <tr v-for="item in paginatedQuestionBank" :key="item.id"
                    class="align-top hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="px-4 py-3">
                      <input v-model="assignmentForm.selected_question_bank_ids" type="checkbox" :value="item.id"
                        class="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-600 dark:bg-slate-800" />
                    </td>
                    <td class="px-4 py-3">
                      <p class="max-w-3xl text-sm font-semibold leading-5 text-slate-900 dark:text-white">
                        {{ parseQuestionContent(item.question_text).question_text }}
                      </p>
                      <img v-if="parseQuestionContent(item.question_text).question_image_url"
                        :src="parseQuestionContent(item.question_text).question_image_url" alt="Gambar pertanyaan"
                        class="mt-3 max-h-40 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
                      <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        Dibuat: {{ formatDateTime(item.created_at) }}
                      </p>
                    </td>
                    <td class="px-4 py-3">
                      <span class="inline-flex rounded-md border px-2.5 py-1 text-xs font-bold"
                        :class="item.question_type === 'MCQ'
                          ? 'border-blue-700 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'border-amber-700 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-900/30 dark:text-amber-300'">
                        {{ assignmentTypeLabel(item.question_type) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <button type="button" @click="openQuestionPreview(item, 'bank')"
                        class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                        Lihat / Edit
                      </button>
                    </td>
                  </tr>
                  <tr v-if="paginatedQuestionBank.length === 0">
                    <td colspan="4" class="px-4 py-12 text-center">
                      <p class="text-base font-semibold text-slate-500 dark:text-slate-400">Belum Ada Soal</p>
                      <p class="mt-2 text-sm text-slate-500 dark:text-slate-500">Soal yang cocok dengan pencarian akan
                        muncul di sini.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              class="flex flex-col gap-3 border-t border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:px-4">
              <p class="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Menampilkan {{ bankStartRow }} - {{ bankEndRow }} dari {{ questionBankTotal }} soal
              </p>
              <div class="flex gap-2">
                <button @click="bankCurrentPage = Math.max(1, bankCurrentPage - 1)" :disabled="bankCurrentPage === 1"
                  class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 sm:flex-none sm:px-4 sm:text-sm">
                  Sebelumnya
                </button>
                <button @click="bankCurrentPage = Math.min(bankTotalPages, bankCurrentPage + 1)"
                  :disabled="bankCurrentPage === bankTotalPages"
                  class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 sm:flex-none sm:px-4 sm:text-sm">
                  Berikutnya
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div v-else
        class="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pilih Mata Pelajaran</h3>
        <p class="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">Silakan pilih mata pelajaran dari menu di
          atas untuk mulai mengelola bank soal dan menerbitkan quiz.</p>
      </div>
    </main>

    <!-- ═══════════════════════════════════════════════════════════
         MODAL: IMPORT SOAL DARI WORD
         ═══════════════════════════════════════════════════════════ -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="bulkImportModalOpen"
        class="learning-bank-modal-overlay fixed inset-0 z-[230] flex items-end justify-center overflow-hidden bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
        <div
          class="flex h-[100dvh] w-full max-w-none flex-col overflow-hidden rounded-none bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10 sm:h-auto sm:max-h-[92vh] sm:max-w-xl sm:rounded-2xl"
          @click.stop>

          <!-- Header -->
          <div
            class="flex flex-none items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/95 px-3 py-2.5 backdrop-blur dark:border-slate-800 dark:bg-slate-800/80 sm:items-center sm:px-6 sm:py-4">
            <div class="min-w-0">
              <h2 class="text-base font-bold text-slate-900 dark:text-white sm:text-lg">Import Soal dari Word</h2>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Ikuti 2 langkah mudah di bawah.
              </p>
            </div>
            <button @click="closeBulkImportModal"
              class="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable Content -->
          <div
            class="min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-3 py-3 [-webkit-overflow-scrolling:touch] sm:space-y-4 sm:px-6 sm:py-5">

            <!-- ── LANGKAH 1: Download Template ── -->
            <section class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <div class="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5 dark:border-slate-800 sm:gap-3 sm:px-4 sm:py-3">
                <span
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white sm:h-7 sm:w-7 sm:text-xs">1</span>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Download Template</h3>
                  <p class="text-xs leading-4 text-slate-500 dark:text-slate-400">Pilih jenis soal yang ingin dibuat, lalu
                    download.</p>
                </div>
              </div>
              <div class="p-3 sm:p-4">
                <p class="mb-2 text-xs leading-4 text-slate-500 dark:text-slate-400 sm:mb-3 sm:leading-5">
                  Template berisi contoh dan panduan pengisian yang sudah siap pakai.
                </p>
                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button @click="downloadQuestionBankTemplate('MCQ')" :disabled="isDownloadingTemplate"
                    class="flex min-h-[3.5rem] items-center justify-start gap-2 rounded-lg border-2 border-blue-200 bg-blue-50 px-3 py-2 text-left transition hover:border-blue-400 hover:bg-blue-100 disabled:opacity-50 dark:border-blue-500/30 dark:bg-blue-500/10 dark:hover:border-blue-400 sm:min-h-20 sm:flex-col sm:justify-center sm:gap-1 sm:rounded-xl sm:py-2.5 sm:text-center">
                    <span class="shrink-0 text-base sm:text-xl">📄</span>
                    <span class="min-w-0">
                      <span class="block text-sm font-bold leading-4 text-blue-800 dark:text-blue-200">Pilihan Ganda</span>
                      <span class="block text-[10px] leading-4 text-blue-600 dark:text-blue-400">Soal MCQ saja</span>
                    </span>
                  </button>
                  <button @click="downloadQuestionBankTemplate('ESSAY')" :disabled="isDownloadingTemplate"
                    class="flex min-h-[3.5rem] items-center justify-start gap-2 rounded-lg border-2 border-amber-200 bg-amber-50 px-3 py-2 text-left transition hover:border-amber-400 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-500/30 dark:bg-amber-500/10 dark:hover:border-amber-400 sm:min-h-20 sm:flex-col sm:justify-center sm:gap-1 sm:rounded-xl sm:py-2.5 sm:text-center">
                    <span class="shrink-0 text-base sm:text-xl">📝</span>
                    <span class="min-w-0">
                      <span class="block text-sm font-bold leading-4 text-amber-800 dark:text-amber-200">Uraian</span>
                      <span class="block text-[10px] leading-4 text-amber-600 dark:text-amber-400">Soal Essay saja</span>
                    </span>
                  </button>
                  <!-- <button @click="downloadQuestionBankTemplate('MIXED')" :disabled="isDownloadingTemplate"
                    class="flex flex-col items-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-4 text-center transition hover:border-emerald-400 hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:hover:border-emerald-400">
                    <span class="text-2xl">📋</span>
                    <span class="text-sm font-bold text-emerald-800 dark:text-emerald-200">Campuran</span>
                    <span class="text-xs text-emerald-600 dark:text-emerald-400">MCQ + Essay</span>
                  </button> -->
                </div>
                <p v-if="isDownloadingTemplate"
                  class="mt-3 text-center text-xs font-medium text-blue-600 dark:text-blue-400">
                  Sedang mengunduh template...
                </p>
              </div>
            </section>

            <!-- ── LANGKAH 2: Cara Mengisi ── -->


            <!-- ── LANGKAH 3: Upload ── -->
            <section class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <div class="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5 dark:border-slate-800 sm:gap-3 sm:px-4 sm:py-3">
                <span
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white sm:h-7 sm:w-7 sm:text-xs">2</span>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Upload File yang Sudah Diisi</h3>
                  <p class="text-xs leading-4 text-slate-500 dark:text-slate-400">Hanya file <strong>.docx</strong> yang diterima.
                  </p>
                </div>
              </div>
              <div class="p-3 sm:p-4">

                <!-- Drop area -->
                <label
                  class="flex min-h-[8rem] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 py-4 text-center transition sm:min-h-[11rem] sm:gap-3 sm:p-8"
                  :class="questionBankImportFile
                    ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                    : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-blue-500'">
                  <input type="file" accept=".docx" class="hidden" ref="questionBankDocumentInput"
                    @change="handleQuestionBankDocumentChange" />

                  <div v-if="!questionBankImportFile">
                    <div
                      class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 sm:h-12 sm:w-12">
                      <svg class="h-5 w-5 text-slate-400 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p class="mt-2 text-sm font-semibold leading-4 text-slate-700 dark:text-slate-200">
                      Klik untuk pilih file
                    </p>
                    <p class="hidden text-xs text-slate-400 dark:text-slate-500 sm:block">atau seret file .docx ke sini</p>
                  </div>

                  <div v-else class="w-full">
                    <div
                      class="flex items-center gap-3 rounded-lg border border-emerald-300 bg-white px-3 py-3 dark:border-emerald-500/40 dark:bg-slate-900 sm:px-4">
                      <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                        <svg class="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24"
                          stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div class="min-w-0 flex-1 text-left">
                        <p class="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                          {{ questionBankImportFileName }}
                        </p>
                        <p class="text-xs text-emerald-600 dark:text-emerald-400">Siap diupload • Klik untuk ganti</p>
                      </div>
                      <button type="button" @click.prevent="resetQuestionBankImport"
                        class="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </label>

                <!-- Import button -->
                <button v-if="questionBankImportFile" type="button" @click="importQuestionBankDocument"
                  :disabled="isImportingQuestionBank"
                  class="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-4 sm:text-sm">
                  <svg v-if="isImportingQuestionBank" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                    stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {{ isImportingQuestionBank ? 'Sedang mengimpor soal...' : 'Import Soal Sekarang' }}
                </button>

              </div>
            </section>

          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════════════════ -->

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="aiGeneratorModalOpen"
        class="learning-bank-modal-overlay fixed inset-0 z-[230] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">

        <div
          class="flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div
            class="flex flex-none items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Buat Soal dengan AI</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Ikuti langkah dari atas ke bawah.</p>
            </div>
            <button @click="aiGeneratorModalOpen = false"
              class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              Tutup
            </button>
          </div>

          <form @submit.prevent="generateQuestionBankWithAi" class="relative flex min-h-0 flex-1 flex-col">
            <fieldset :disabled="isGeneratingAiQuestions" class="flex min-h-0 flex-1 flex-col">
              <div ref="aiGeneratorScrollRef"
                class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-32 pt-4 [-webkit-overflow-scrolling:touch] sm:p-6">
                <div class="space-y-4">
                  <section
                    class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div class="mb-4 flex items-center gap-3">
                      <span
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
                      <h3 class="text-sm font-bold text-slate-900 dark:text-white">Pilih Bentuk Soal</h3>
                    </div>
                    <div class="grid gap-4 md:grid-cols-3">
                      <div class="space-y-1.5">
                        <label class="text-xs font-semibold text-slate-500">Jenis Soal</label>
                        <select v-model="aiGeneratorForm.question_type"
                          class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                          <option value="MCQ">Pilihan Ganda</option>
                          <option value="ESSAY">Uraian</option>
                        </select>
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-xs font-semibold text-slate-500">Jumlah Soal</label>
                        <input v-model="aiGeneratorForm.question_count" type="number" min="1" max="20"
                          class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-xs font-semibold text-slate-500">Tingkat Kesulitan</label>
                        <select v-model="aiGeneratorForm.difficulty"
                          class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                          <option value="MUDAH">Mudah</option>
                          <option value="MENENGAH">Menengah</option>
                          <option value="SULIT">Sulit</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section
                    class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div class="mb-4 flex items-center gap-3">
                      <span
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
                      <h3 class="text-sm font-bold text-slate-900 dark:text-white">Isi Materi</h3>
                    </div>
                    <div class="space-y-4">
                      <div class="space-y-1.5">
                        <label class="text-xs font-semibold text-slate-500">Mapel Aktif</label>
                        <div
                          class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {{ selectedSubject?.name }} • {{ selectedSubject?.class_name }}
                        </div>
                      </div>
                      <div class="grid gap-3 md:grid-cols-3">
                        <div
                          class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                          <p class="text-xs font-semibold text-slate-500">Jenjang / Kelas</p>
                          <p class="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{{ autoAiGradeLabel }}
                          </p>
                        </div>
                        <div
                          class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                          <p class="text-xs font-semibold text-slate-500">Fase</p>
                          <p class="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{{ autoAiPhaseName }}</p>
                        </div>
                        <div
                          class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                          <p class="text-xs font-semibold text-slate-500">Kurikulum</p>
                          <p class="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{{ autoAiCurriculumName
                            }}</p>
                        </div>
                      </div>
                      <div class="space-y-1.5">
                        <div class="flex items-center justify-between gap-3">
                          <label class="text-xs font-semibold text-slate-500">Pilih Materi</label>
                          <button type="button" @click="loadAiTopicSuggestions" :disabled="isLoadingAiTopicSuggestions"
                            class="text-xs font-semibold text-blue-700 hover:text-blue-800 disabled:opacity-50 dark:text-blue-300">
                            {{ isLoadingAiTopicSuggestions ? "Memuat..." : "Muat Ulang" }}
                          </button>
                        </div>
                        <select v-model="aiGeneratorForm.topic"
                          class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                          <option value="" disabled>
                            {{ isLoadingAiTopicSuggestions ? "Memuat daftar materi..." : "Pilih materi..." }}
                          </option>
                          <option v-for="topic in aiTopicSuggestions" :key="topic" :value="topic">{{ topic }}</option>
                          <option value="__custom__">Materi lainnya...</option>
                        </select>
                        <input v-if="aiGeneratorForm.topic === '__custom__'" v-model="aiCustomTopic" type="text"
                          placeholder="Tulis materi sendiri"
                          class="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                        <p v-if="aiTopicSuggestionError" class="text-xs font-medium text-amber-700 dark:text-amber-300">
                          {{ aiTopicSuggestionError }}
                        </p>
                      </div>
                    </div>
                  </section>

                  <!-- <section
                    class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div class="mb-4 flex items-center gap-3">
                      <span
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">3</span>
                      <h3 class="text-sm font-bold text-slate-900 dark:text-white">Tambahan Opsional</h3>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-slate-500">Instruksi Tambahan</label>
                      <textarea v-model="aiGeneratorForm.additional_instructions" rows="3"
                        placeholder="Contoh: gunakan konteks kehidupan sehari-hari"
                        class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                    </div>
                    <label
                      class="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <input v-model="aiGeneratorForm.include_illustration" type="checkbox"
                        class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-600 dark:bg-slate-800" />
                      Sertakan gambar jika diperlukan
                    </label>
                  </section> -->

                  <section v-if="generatedAiQuestions.length" ref="aiPreviewSectionRef"
                    class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div class="flex items-center gap-3">
                        <span
                          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">4</span>
                        <div>
                          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Cek Hasil</h3>
                          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {{ selectedGeneratedAiQuestions.length }} dari {{ generatedAiQuestions.length }} soal
                            dipilih.
                          </p>
                        </div>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <button type="button" @click="selectAllGeneratedAiQuestions"
                          class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                          Pilih Semua
                        </button>
                        <button type="button" @click="clearGeneratedAiSelection"
                          class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                          Kosongkan Pilihan
                        </button>
                      </div>
                    </div>

                    <div class="mt-4 space-y-4">
                      <article v-for="(item, index) in generatedAiQuestions" :key="item.temp_id"
                        class="rounded-xl border bg-white p-4 dark:bg-slate-900"
                        :class="selectedGeneratedAiQuestionIds.includes(item.temp_id) ? 'border-sky-300 dark:border-sky-500/40' : 'border-slate-200 dark:border-slate-700'">
                        <div class="flex items-start gap-3">
                          <input v-model="selectedGeneratedAiQuestionIds" :value="item.temp_id" type="checkbox"
                            class="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-600 dark:border-slate-600 dark:bg-slate-800" />
                          <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                              <span
                                class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Soal {{ index + 1 }}
                              </span>
                              <span
                                class="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                                {{ item.question_type === "MCQ" ? "Pilihan Ganda" : "Uraian" }}
                              </span>
                              <span v-if="getGeneratedQuestionImageUrl(item)"
                                class="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                Gambar
                              </span>
                            </div>
                            <p
                              class="mt-3 whitespace-pre-wrap break-words text-xs font-medium leading-5 text-slate-900 dark:text-white sm:text-sm sm:font-semibold sm:leading-6">
                              {{ normalizeGeneratedQuestionText(parseQuestionContent(item.question_text).question_text)
                              }}
                            </p>
                            <img v-if="getGeneratedQuestionImageUrl(item)" :src="getGeneratedQuestionImageUrl(item)"
                              alt="Gambar pertanyaan"
                              class="mt-3 max-h-48 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />

                            <div v-if="item.question_type === 'MCQ'" class="mt-4 grid gap-2">
                              <div v-for="(option, optionIndex) in item.options || []"
                                :key="`${item.temp_id}-option-${optionIndex}`"
                                class="rounded-xl border px-3 py-2 text-xs leading-5 sm:text-sm"
                                :class="optionIndex === Number(item.correct_option)
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                                  : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'">
                                <div>{{ String.fromCharCode(65 + optionIndex) }}. {{
                                  normalizePreviewText(parseOptionItem(option).text) }}</div>
                              </div>
                            </div>

                            <div v-else
                              class="mt-4 whitespace-pre-wrap break-words rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 sm:text-sm">
                              <span class="font-semibold">Rubrik:</span> {{ item.rubric }}
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  </section>
                </div>
              </div>

              <div
                class="flex flex-none flex-col gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
                <button @click="aiGeneratorModalOpen = false" type="button"
                  class="w-full rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto sm:text-sm">
                  Batal
                </button>
                <button v-if="generatedAiQuestions.length" type="button" @click="saveGeneratedAiQuestions"
                  :disabled="isSavingGeneratedAiQuestions || selectedGeneratedAiQuestions.length === 0"
                  class="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm">
                  {{ isSavingGeneratedAiQuestions ? "Menyimpan..." : `Simpan ${selectedGeneratedAiQuestions.length}
                  Soal` }}
                </button>
                <button type="submit" :disabled="isGeneratingAiQuestions"
                  class="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm">
                  {{ isGeneratingAiQuestions ? "Membuat..." : generatedAiQuestions.length ? `Buat Ulang` : `Buat Soal
                  dengan AI` }}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isGeneratingAiQuestions"
        class="learning-bank-modal-overlay fixed inset-0 z-[240] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex items-start gap-4">
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20">
              <svg class="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Sedang membuat soal</h3>
              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Mohon tunggu sampai proses selesai. Form sedang dikunci agar input tidak berubah.
              </p>
              <div class="mt-4 space-y-2">
                <p class="text-sm font-medium text-sky-700 dark:text-sky-300">{{ activeAiGenerationStage }}</p>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div class="h-full w-1/2 animate-pulse rounded-full bg-sky-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="questionBankModalOpen"
        class="learning-bank-modal-overlay fixed inset-0 z-[230] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">

        <div
          class="flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div
            class="flex flex-none items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Tambah Soal</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Isi pertanyaan dulu, lalu isi jawaban jika bentuknya pilihan ganda.
              </p>
            </div>
            <button @click="questionBankModalOpen = false"
              class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              Tutup
            </button>
          </div>

          <form @submit.prevent="submitQuestionBank" class="flex min-h-0 flex-1 flex-col">

            <div class="flex-1 overflow-y-auto px-5 py-4">
              <div class="space-y-4">
                <section
                  class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div class="mb-4 flex items-center gap-3">
                    <span
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">1</span>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Jenis dan Isi Soal</h3>
                  </div>

                  <div class="space-y-4">
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-slate-500">Jenis Soal</label>
                      <select v-model="questionBankForm.question_type"
                        class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                        <option value="MCQ">Pilihan Ganda</option>
                        <option value="ESSAY">Uraian</option>
                      </select>
                    </div>

                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-slate-500">Teks Soal</label>
                      <textarea v-model="questionBankForm.question_text" rows="4" placeholder="Tulis soal di sini..."
                        class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                      <div class="mt-2 flex flex-wrap items-center gap-2">
                        <label
                          class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                          <input type="file" accept="image/*" class="hidden" @change="uploadQuestionImageForCreate" />
                          {{ isUploadingQuestionImage ? "Memuat gambar..." : "Tambah Gambar Soal" }}
                        </label>
                        <button v-if="questionBankForm.question_image_url" type="button"
                          @click="questionBankForm.question_image_url = ''"
                          class="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300">
                          Hapus Gambar
                        </button>
                      </div>
                      <img v-if="questionBankForm.question_image_url" :src="questionBankForm.question_image_url"
                        alt="Preview gambar pertanyaan"
                        class="mt-2 max-h-48 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
                    </div>
                  </div>
                </section>

                <section v-if="questionBankForm.question_type === 'MCQ'"
                  class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div class="mb-4 flex items-center gap-3">
                    <span
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">2</span>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Opsi Jawaban</h3>
                  </div>
                  <div class="space-y-3">
                    <label v-for="(option, index) in questionBankForm.options" :key="`option-${index}`"
                      class="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition dark:bg-slate-900"
                      :class="Number(questionBankForm.correct_option) === index
                        ? 'border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'">
                      <span
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {{ String.fromCharCode(65 + index) }}
                      </span>
                      <input v-model="questionBankForm.options[index]" type="text"
                        :placeholder="`Tulis pilihan ${String.fromCharCode(65 + index)}`"
                        class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-800/70 dark:text-white" />
                      <input v-model="questionBankForm.correct_option" type="radio" name="correct-bank"
                        :value="index" class="h-4 w-4 shrink-0 text-sky-600 focus:ring-sky-600" />
                      <span class="hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline-flex"
                        :class="Number(questionBankForm.correct_option) === index
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">
                        Benar
                      </span>
                    </label>
                  </div>
                </section>

                <section v-else
                  class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div class="mb-4 flex items-center gap-3">
                    <span
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">2</span>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Rubrik Penilaian</h3>
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-500">Rubrik Penilaian</label>
                    <textarea v-model="questionBankForm.rubric" rows="3"
                      placeholder="Tulis panduan penilaian jika diperlukan..."
                      class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                  </div>
                </section>
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

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="quizOverviewModal.open"
        class="learning-bank-modal-overlay fixed inset-0 z-[230] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">

        <div
          class="quiz-overview-detail flex h-[100dvh] max-h-[100dvh] w-full max-w-6xl flex-col overflow-hidden rounded-none bg-white shadow-2xl ring-1 ring-slate-900/5 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div
            class="flex flex-none items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/30 sm:items-center sm:px-6 sm:py-4">
            <div class="min-w-0">
              <h2 class="text-base font-bold text-slate-900 dark:text-white sm:text-lg">Detail Quiz Berjalan</h2>
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

          <div v-else class="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
            <div class="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
              <div class="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200 sm:rounded-xl sm:p-4 dark:bg-slate-800 dark:ring-slate-700">
                <div class="text-xs text-slate-500 dark:text-slate-400">Total Siswa</div>
                <div class="mt-1 text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">{{
                  quizOverviewModal.analytics.total_students || 0 }}</div>
              </div>
              <div
                class="rounded-lg bg-emerald-50 p-3 ring-1 ring-emerald-200 sm:rounded-xl sm:p-4 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                <div class="text-xs text-emerald-700 dark:text-emerald-300">Sudah Submit</div>
                <div class="mt-1 text-lg font-bold text-emerald-900 dark:text-emerald-200 sm:text-2xl">{{
                  quizOverviewModal.analytics.submitted_count || 0 }}</div>
              </div>
              <div class="rounded-lg bg-red-50 p-3 ring-1 ring-red-200 sm:rounded-xl sm:p-4 dark:bg-red-500/10 dark:ring-red-500/20">
                <div class="text-xs text-red-700 dark:text-red-300">Belum Submit</div>
                <div class="mt-1 text-lg font-bold text-red-900 dark:text-red-200 sm:text-2xl">{{
                  quizOverviewModal.analytics.pending_count || 0 }}</div>
              </div>
              <div class="rounded-lg bg-sky-50 p-3 ring-1 ring-sky-200 sm:rounded-xl sm:p-4 dark:bg-sky-500/10 dark:ring-sky-500/20">
                <div class="text-xs text-sky-700 dark:text-sky-300">Rata-rata Nilai</div>
                <div class="mt-1 text-lg font-bold text-sky-900 dark:text-sky-200 sm:text-2xl">{{
                  quizOverviewModal.analytics.average_score ?? "-" }}</div>
              </div>
              <div class="rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200 sm:rounded-xl sm:p-4 dark:bg-amber-500/10 dark:ring-amber-500/20">
                <div class="text-xs text-amber-700 dark:text-amber-300">Total Pelanggaran</div>
                <div class="mt-1 text-lg font-bold text-amber-900 dark:text-amber-200 sm:text-2xl">{{
                  quizOverviewModal.analytics.total_violations || 0 }}</div>
              </div>
              <div
                class="rounded-lg bg-violet-50 p-3 ring-1 ring-violet-200 sm:rounded-xl sm:p-4 dark:bg-violet-500/10 dark:ring-violet-500/20">
                <div class="text-xs text-violet-700 dark:text-violet-300">Siswa Terflag</div>
                <div class="mt-1 text-lg font-bold text-violet-900 dark:text-violet-200 sm:text-2xl">{{
                  quizOverviewModal.analytics.flagged_students_count || 0 }}</div>
              </div>
            </div>

            <div class="mt-3 grid gap-3 sm:mt-6 sm:gap-6 xl:grid-cols-2">
              <section
                class="overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div class="border-b border-slate-100 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/50 sm:px-5 sm:py-4">
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
                        <td class="px-5 py-3 font-medium text-slate-900 dark:text-white">{{ item.full_name ||
                          item.username }}</td>
                        <td class="px-5 py-3 text-slate-500 dark:text-slate-400">{{ formatStoredDateTime(item.submitted_at) }}
                        </td>
                        <td class="px-5 py-3 font-bold text-slate-700 dark:text-slate-300">{{ item.score ?? "-" }}</td>
                        <td class="px-5 py-3">
                          <div class="font-semibold"
                            :class="item.violation_count > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'">
                            {{ item.violation_count || 0 }}x
                          </div>
                          <div v-if="item.violation_logs?.length"
                            class="mt-1 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <p v-for="log in item.violation_logs.slice(0, 3)"
                              :key="`submitted-log-${item.id}-${log.id}`">
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
                class="overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div class="border-b border-slate-100 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/50 sm:px-5 sm:py-4">
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
                        <td class="px-5 py-3 font-medium text-slate-900 dark:text-white">{{ item.full_name ||
                          item.username }}</td>
                        <td class="px-5 py-3 text-slate-500 dark:text-slate-400">{{ item.parent_email || "-" }}</td>
                        <td class="px-5 py-3">
                          <div class="font-semibold"
                            :class="item.violation_count > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'">
                            {{ item.violation_count || 0 }}x
                          </div>
                          <div v-if="item.violation_logs?.length"
                            class="mt-1 space-y-1 text-xs text-slate-500 dark:text-slate-400">
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
              class="mt-3 overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 sm:mt-6">
              <div class="border-b border-slate-100 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/50 sm:px-5 sm:py-4">
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

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="questionPreviewModal.open"
        class="learning-bank-modal-overlay fixed inset-0 z-[260] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm sm:p-4">

        <div
          class="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div
            class="flex flex-none items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Lihat / Edit Soal</h2>
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
                  alt="Gambar pertanyaan"
                  class="mt-3 max-h-56 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
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
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                      <label
                        class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                        <input type="file" accept="image/*" class="hidden" @change="uploadQuestionImageForPreview" />
                        {{ isUploadingPreviewQuestionImage ? "Uploading..." : "Upload Gambar Pertanyaan" }}
                      </label>
                      <button v-if="questionPreviewForm.question_image_url" type="button"
                        @click="questionPreviewForm.question_image_url = ''"
                        class="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300">
                        Hapus Gambar
                      </button>
                    </div>
                    <img v-if="questionPreviewForm.question_image_url" :src="questionPreviewForm.question_image_url"
                      alt="Preview gambar pertanyaan"
                      class="mt-2 max-h-56 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
                  </div>

                  <div v-if="questionPreviewModal.question.question_type === 'MCQ'" class="space-y-3">
                    <label v-for="(option, optionIndex) in questionPreviewForm.options"
                      :key="`edit-option-${optionIndex}`"
                      class="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition dark:bg-slate-900"
                      :class="Number(questionPreviewForm.correct_option) === optionIndex
                        ? 'border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'">
                      <span
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {{ String.fromCharCode(65 + optionIndex) }}
                      </span>
                      <input v-model="questionPreviewForm.options[optionIndex]" type="text"
                        :placeholder="`Tulis pilihan ${String.fromCharCode(65 + optionIndex)}`"
                        class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-800/70 dark:text-white" />
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
                  <span class="text-xs text-slate-500 dark:text-slate-400">Pilihan jawaban</span>
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
                        <div>
                          <p class="text-sm font-medium leading-6 text-slate-800 dark:text-slate-200">{{ option }}</p>
                        </div>
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
            class="grid flex-none grid-cols-3 items-center gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50 sm:flex sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
            <button v-if="questionPreviewModal.source === 'bank'" type="button" @click="deleteQuestionFromPreview"
              :disabled="isSavingQuestionPreview"
              class="inline-flex min-h-10 items-center justify-center rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold leading-none text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20 sm:mr-auto sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm">
              Hapus Soal
            </button>
            <button @click="closeQuestionPreview" type="button"
              class="inline-flex min-h-10 items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold leading-none text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm">
              Tutup
            </button>
            <button type="button" @click="saveQuestionPreviewChanges" :disabled="isSavingQuestionPreview"
              class="inline-flex min-h-10 items-center justify-center rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold leading-none text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-50 sm:rounded-xl sm:px-6 sm:py-2.5 sm:text-sm sm:font-bold">
              <span class="sm:hidden">{{ isSavingQuestionPreview ? "..." : "Simpan" }}</span>
              <span class="hidden sm:inline">{{ isSavingQuestionPreview ? "Menyimpan..." : "Simpan Perubahan" }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="deleteQuestionConfirmModal.open"
        class="learning-bank-modal-overlay fixed inset-0 z-[270] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl border-2 border-rose-200 bg-white shadow-2xl dark:border-rose-500/30 dark:bg-slate-900">
          <div class="border-b border-rose-100 bg-rose-50 px-6 py-5 dark:border-rose-500/20 dark:bg-rose-500/10">
            <h3 class="text-lg font-bold text-rose-800 dark:text-rose-200">
              {{ deleteQuestionConfirmModal.mode === 'bulk' ? 'Hapus Soal Terpilih?' : 'Hapus Soal Ini?' }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-rose-700 dark:text-rose-200">
              {{ deleteQuestionConfirmMessage }}
            </p>
          </div>

          <div class="px-6 py-5">
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Soal yang sudah dihapus tidak akan muncul lagi di bank soal. Pastikan pilihan sudah benar sebelum
              melanjutkan.
            </p>
          </div>

          <div
            class="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60 sm:flex-row sm:justify-end">
            <button type="button" @click="closeDeleteQuestionConfirm" :disabled="isSavingQuestionPreview"
              class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              Batal
            </button>
            <button type="button" @click="confirmDeleteQuestion" :disabled="isSavingQuestionPreview"
              class="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-50">
              {{ isSavingQuestionPreview ? "Menghapus..." : "Ya, Hapus" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDateTime, formatStoredDateTime, parseDateValue } from "@/utils/date";
import { useMasterDataStore } from "@/store/masterData";
import { uploadFileDirect } from "@/api/upload";

const subjects = ref([]);
const masterDataStore = useMasterDataStore();
const selectedSubject = ref(null);
const subjectDropdownOpen = ref(false);
const subjectDropdownRef = ref(null);
const assignments = ref([]);
const questionBank = ref([]);
const questionBankForAssignment = ref([]);
const questionBankTotal = ref(0);
const subjectError = ref("");
const message = ref("");
const isError = ref(false);
const isSavingAssignment = ref(false);
const isSavingQuestionBank = ref(false);
const isSavingQuestionPreview = ref(false);
const isUploadingQuestionImage = ref(false);
const isUploadingPreviewQuestionImage = ref(false);
const isDownloadingTemplate = ref(false);
const isImportingQuestionBank = ref(false);
const isGeneratingAiQuestions = ref(false);
const isSavingGeneratedAiQuestions = ref(false);
const aiGeneratorModalOpen = ref(false);
const aiPreviewSectionRef = ref(null);
const aiGeneratorScrollRef = ref(null);
const aiTopicSuggestions = ref([]);
const aiCustomTopic = ref("");
const aiTopicSuggestionError = ref("");
const isLoadingAiTopicSuggestions = ref(false);
const questionBankModalOpen = ref(false);
const bulkImportModalOpen = ref(false);
const questionBankDocumentInput = ref(null);
const questionBankImportFile = ref(null);
const bankSearch = ref("");
const bankTypeFilter = ref("ALL");
const bankPageSize = ref(20);
const bankCurrentPage = ref(1);
const randomQuestionCount = ref(5);
const quizOverviewModal = reactive({
  open: false,
  loading: false,
  assignment: null,
  analytics: {},
  submittedStudents: [],
  pendingStudents: [],
});
const questionPreviewModal = reactive({
  open: false,
  question: null,
  source: "bank",
  sourceLabel: "",
  questionNumber: null,
});
const deleteQuestionConfirmModal = reactive({
  open: false,
  mode: "single",
  question: null,
  count: 0,
});
const questionPreviewForm = reactive({
  question_text: "",
  question_image_url: "",
  options: ["", "", "", "", ""],
  correct_option: 0,
  rubric: "",
});

const questionBankImportFileName = computed(() => questionBankImportFile.value?.name || "");

const slugifyFilename = (value, fallback = "file") => {
  const normalized = String(value || fallback).trim().toLowerCase().replace(/\s+/g, "-");
  return normalized.replace(/[^a-z0-9_-]/g, "") || fallback;
};

// Fitur: Body Scroll Lock saat modal aktif
const isAnyModalOpen = computed(() =>
  aiGeneratorModalOpen.value
  || questionBankModalOpen.value
  || bulkImportModalOpen.value
  || quizOverviewModal.open
  || questionPreviewModal.open
  || deleteQuestionConfirmModal.open,
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
  if (typeof document !== "undefined") {
    document.removeEventListener("click", handleSubjectDropdownOutsideClick);
    document.removeEventListener("keydown", handleSubjectDropdownKeydown);
  }
  if (aiGenerationStageInterval) {
    clearInterval(aiGenerationStageInterval);
    aiGenerationStageInterval = null;
  }
});

const assignmentForm = reactive({
  title: "",
  description: "",
  due_date: "",
  assignment_type: "MCQ",
  shuffle_questions: false,
  question_duration_seconds: 10,
  selected_question_bank_ids: [],
});

const questionBankForm = reactive({
  question_type: "MCQ",
  question_text: "",
  question_image_url: "",
  options: ["", "", "", "", ""],
  correct_option: 0,
  rubric: "",
});

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

const normalizePreviewText = (value) => {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  return text
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/(-?)\s*\\?rac\{([^}]*)\}\{([^}]*)\}/g, (_, sign, numerator, denominator) => `${sign === "-" ? "-" : ""}${numerator}/${denominator}`)
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1/$2)")
    .replace(/\\theta/g, "theta")
    .replace(/\\sin/g, "sin")
    .replace(/\\cos/g, "cos")
    .replace(/\\tan/g, "tan")
    .replace(/\\pi/g, "pi")
    .replace(/\\sqrt\{([^}]*)\}/g, "sqrt($1)");
};

const normalizeGeneratedQuestionText = (value) => normalizePreviewText(value);

const composeQuestionText = (questionText, questionImageUrl) => {
  const cleanQuestion = String(questionText || "").trim();
  const cleanImage = String(questionImageUrl || "").trim();
  if (!cleanImage) {
    return cleanQuestion;
  }
  return `${cleanQuestion}\n${QUESTION_IMAGE_MARKER}${cleanImage}`;
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
          const text = normalizePreviewText(parseOptionItem(parsedOption.value).text);
          return text ? [text] : [];
        }

        if (typeof parsedOption.value === "string") {
          const nestedOptions = parseOptionsField(parsedOption.value);
          if (nestedOptions.length) {
            return nestedOptions;
          }

          const text = normalizePreviewText(parsedOption.value);
          return text ? [text] : [];
        }
      }
    }

    const text = normalizePreviewText(parseOptionItem(option).text);
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

const firstSubjectValue = (subject, keys) => {
  for (const key of keys) {
    const value = String(subject?.[key] || "").trim();
    if (value) return value;
  }
  return "";
};

const extractGradeNumber = (label) => {
  const text = String(label || "");
  const match = text.match(/\b(1[0-2]|[1-9])\b/);
  if (match) return Number(match[1]);

  const romanMatch = text.match(/\b(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\b/i);
  const romanGradeMap = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
    IX: 9,
    X: 10,
    XI: 11,
    XII: 12,
  };
  return romanMatch ? romanGradeMap[romanMatch[1].toUpperCase()] || 0 : 0;
};

const inferPhaseFromGrade = (grade) => {
  if (grade >= 1 && grade <= 2) return "Fase A";
  if (grade >= 3 && grade <= 4) return "Fase B";
  if (grade >= 5 && grade <= 6) return "Fase C";
  if (grade >= 7 && grade <= 9) return "Fase D";
  if (grade === 10) return "Fase E";
  if (grade >= 11 && grade <= 12) return "Fase F";
  return "Fase belum terbaca";
};

const aiGeneratorForm = reactive({
  question_type: "MCQ",
  question_count: 5,
  difficulty: "MENENGAH",
  topic: "",
  include_illustration: false,
  additional_instructions: "",
});
const generatedAiQuestions = ref([]);
const selectedGeneratedAiQuestionIds = ref([]);
const aiGenerationStageIndex = ref(0);
let aiGenerationStageInterval = null;
const aiGenerationStages = [
  "Menganalisis topik dan konteks soal...",
  "Menyusun struktur pertanyaan dan opsi jawaban...",
  "Memeriksa kualitas hasil generasi...",
  "Menyiapkan preview untuk guru...",
];

const assignmentTypeLabel = (type) => {
  if (type === "MCQ") return "Pilihan Ganda";
  if (type === "ESSAY") return "Uraian";
  return "Soal";
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

const filteredQuestionBankForAssignment = computed(() => questionBankForAssignment.value);
const selectedGeneratedAiQuestions = computed(() =>
  generatedAiQuestions.value.filter((item) => selectedGeneratedAiQuestionIds.value.includes(item.temp_id)),
);
const activeAiGenerationStage = computed(() => aiGenerationStages[aiGenerationStageIndex.value] || aiGenerationStages[0]);
const autoAiGradeLabel = computed(() =>
  firstSubjectValue(selectedSubject.value, ["grade_label", "grade_name", "level_name", "class_name"]) || "-",
);
const autoAiPhaseName = computed(() => {
  const subject = selectedSubject.value || {};
  const explicitPhase = firstSubjectValue(subject, ["phase_name", "fase_name", "phase", "fase"]);
  if (explicitPhase) {
    return /^fase/i.test(explicitPhase) ? explicitPhase : `Fase ${explicitPhase}`;
  }

  return inferPhaseFromGrade(extractGradeNumber(autoAiGradeLabel.value));
});
const autoAiCurriculumName = computed(() => "Kurikulum Merdeka");
const resolvedAiTopic = computed(() =>
  aiGeneratorForm.topic === "__custom__"
    ? String(aiCustomTopic.value || "").trim()
    : String(aiGeneratorForm.topic || "").trim(),
);

const selectedQuestionsForPublish = computed(() =>
  filteredQuestionBankForAssignment.value.filter((item) => assignmentForm.selected_question_bank_ids.includes(item.id)),
);

const selectedQuestionCount = computed(() => selectedQuestionsForPublish.value.length);
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
const deleteQuestionConfirmMessage = computed(() => {
  if (deleteQuestionConfirmModal.mode === "bulk") {
    return `Anda akan menghapus ${deleteQuestionConfirmModal.count} soal dari bank soal.`;
  }
  return "Anda akan menghapus 1 soal dari bank soal.";
});
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

watch(
  () => assignmentForm.assignment_type,
  async () => {
    await loadAssignmentQuestionBank();
    assignmentForm.selected_question_bank_ids = assignmentForm.selected_question_bank_ids.filter((id) =>
      filteredQuestionBankForAssignment.value.some((item) => item.id === id),
    );
  },
);

const resetQuestionBankForm = () => {
  questionBankForm.question_type = "MCQ";
  questionBankForm.question_text = "";
  questionBankForm.question_image_url = "";
  questionBankForm.options = ["", "", "", "", ""];
  questionBankForm.correct_option = 0;
  questionBankForm.rubric = "";
};

const resetAiGeneratorForm = () => {
  aiGeneratorForm.question_type = "MCQ";
  aiGeneratorForm.question_count = 5;
  aiGeneratorForm.difficulty = "MENENGAH";
  aiGeneratorForm.topic = "";
  aiCustomTopic.value = "";
  aiTopicSuggestions.value = [];
  aiTopicSuggestionError.value = "";
  aiGeneratorForm.include_illustration = false;
  aiGeneratorForm.additional_instructions = "";
  generatedAiQuestions.value = [];
  selectedGeneratedAiQuestionIds.value = [];
};

const startAiGenerationProgress = () => {
  aiGenerationStageIndex.value = 0;
  if (aiGenerationStageInterval) {
    clearInterval(aiGenerationStageInterval);
  }

  aiGenerationStageInterval = window.setInterval(() => {
    aiGenerationStageIndex.value = (aiGenerationStageIndex.value + 1) % aiGenerationStages.length;
  }, 1300);
};

const stopAiGenerationProgress = () => {
  if (aiGenerationStageInterval) {
    clearInterval(aiGenerationStageInterval);
    aiGenerationStageInterval = null;
  }
  aiGenerationStageIndex.value = 0;
};

const resetQuestionBankImport = () => {
  questionBankImportFile.value = null;
  if (questionBankDocumentInput.value) {
    questionBankDocumentInput.value.value = "";
  }
};

const closeBulkImportModal = () => {
  bulkImportModalOpen.value = false;
  resetQuestionBankImport();
};

const resetAssignmentForm = () => {
  assignmentForm.title = "";
  assignmentForm.description = "";
  assignmentForm.due_date = "";
  assignmentForm.assignment_type = "MCQ";
  assignmentForm.shuffle_questions = false;
  assignmentForm.question_duration_seconds = 10;
  assignmentForm.selected_question_bank_ids = [];
};

const clearSelectedQuestions = () => {
  assignmentForm.selected_question_bank_ids = [];
};

const selectAllCurrentBankPage = () => {
  const ids = paginatedQuestionBank.value.map((item) => item.id);
  assignmentForm.selected_question_bank_ids = Array.from(new Set([...assignmentForm.selected_question_bank_ids, ...ids]));
};

const generateRandomSelection = () => {
  const pool = [...filteredQuestionBankForAssignment.value];
  const count = Math.max(1, Number(randomQuestionCount.value) || 1);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
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

const openQuestionPreview = (question, source = "bank", questionNumber = null) => {
  const normalizedQuestion = normalizeQuestionBankItem(question || {});
  questionPreviewModal.open = true;
  questionPreviewModal.question = { ...normalizedQuestion };
  questionPreviewModal.source = source;
  questionPreviewModal.sourceLabel = source === "selected" ? "Soal terpilih" : "Bank soal";
  questionPreviewModal.questionNumber = questionNumber;
  const parsedQuestion = parseQuestionContent(normalizedQuestion.question_text || "");
  questionPreviewForm.question_text = parsedQuestion.question_text;
  questionPreviewForm.question_image_url = parsedQuestion.question_image_url;
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
  closeDeleteQuestionConfirm();
  questionPreviewForm.question_text = "";
  questionPreviewForm.question_image_url = "";
  questionPreviewForm.options = ["", "", "", "", ""];
  questionPreviewForm.correct_option = 0;
  questionPreviewForm.rubric = "";
};

const openDeleteQuestionConfirm = ({ mode = "single", question = null, count = 0 } = {}) => {
  deleteQuestionConfirmModal.open = true;
  deleteQuestionConfirmModal.mode = mode;
  deleteQuestionConfirmModal.question = question;
  deleteQuestionConfirmModal.count = count;
};

const closeDeleteQuestionConfirm = (force = false) => {
  if (isSavingQuestionPreview.value && !force) return;
  deleteQuestionConfirmModal.open = false;
  deleteQuestionConfirmModal.mode = "single";
  deleteQuestionConfirmModal.question = null;
  deleteQuestionConfirmModal.count = 0;
};

const saveQuestionPreviewChanges = async () => {
  if (!questionPreviewModal.question?.id) return;

  isSavingQuestionPreview.value = true;
  message.value = "";
  isError.value = false;

  try {
    const questionTextPayload = composeQuestionText(
      questionPreviewForm.question_text,
      questionPreviewForm.question_image_url,
    );
    const payload = {
      question_text: questionTextPayload,
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
        const parsedUpdatedQuestion = parseQuestionContent(updatedQuestion.question_text || "");
        questionPreviewForm.question_text = parsedUpdatedQuestion.question_text;
        questionPreviewForm.question_image_url = parsedUpdatedQuestion.question_image_url;
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

const deleteQuestionFromPreview = async () => {
  if (!questionPreviewModal.question?.id) return;

  openDeleteQuestionConfirm({
    mode: "single",
    question: { ...questionPreviewModal.question },
    count: 1,
  });
};

const deleteSelectedQuestionBankItems = async () => {
  if (!selectedSubject.value || assignmentForm.selected_question_bank_ids.length === 0) {
    return;
  }

  openDeleteQuestionConfirm({
    mode: "bulk",
    question: null,
    count: assignmentForm.selected_question_bank_ids.length,
  });
};

const confirmDeleteQuestion = async () => {
  if (!selectedSubject.value) return;

  try {
    isSavingQuestionPreview.value = true;
    message.value = "";
    isError.value = false;

    if (deleteQuestionConfirmModal.mode === "bulk") {
      const response = await api.post(
        `/learning/subjects/${selectedSubject.value.id}/question-bank/bulk-delete`,
        { question_ids: assignmentForm.selected_question_bank_ids },
      );

      const total = response?.data?.total || 0;
      assignmentForm.selected_question_bank_ids = [];
      message.value = response?.message || "Soal terpilih berhasil dihapus";
      pushToast({
        title: "Soal Terpilih Dihapus",
        message: `${total} soal berhasil dihapus dari bank soal.`,
        type: "success",
      });
    } else {
      const questionId = deleteQuestionConfirmModal.question?.id || questionPreviewModal.question?.id;
      if (!questionId) {
        throw new Error("Soal tidak ditemukan.");
      }

      const response = await api.delete(`/learning/question-bank/${questionId}`);
      closeQuestionPreview();
      message.value = response?.message || "Soal berhasil dihapus";
      pushToast({
        title: "Soal Dihapus",
        message: response?.message || "Soal bank berhasil dihapus.",
        type: "success",
      });
    }

    closeDeleteQuestionConfirm(true);
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Gagal Menghapus Soal",
      message: error.message,
      type: "error",
    });
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
    subjects.value = await masterDataStore.getTeacherSubjects();
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
        question_type: bankTypeFilter.value === "ALL" ? "" : bankTypeFilter.value,
        page: bankCurrentPage.value,
        limit: bankPageSize.value,
      },
    }),
  ]);

  assignments.value = (assignmentResponse?.data || []).filter((item) => item.assignment_type !== "FILE" && !item.is_exam);
  questionBank.value = (questionBankResponse?.data?.data || []).map(normalizeQuestionBankItem);
  questionBankTotal.value = questionBankResponse?.data?.total || 0;
  await loadAssignmentQuestionBank();
};

const loadAssignmentQuestionBank = async () => {
  if (!selectedSubject.value) return;
  const response = await api.get(`/learning/subjects/${selectedSubject.value.id}/question-bank`, {
    params: {
      question_type: assignmentForm.assignment_type || "MCQ",
      page: 1,
      limit: 500,
    },
  });
  questionBankForAssignment.value = (response?.data?.data || []).map(normalizeQuestionBankItem);
};

const selectSubject = async (subject) => {
  selectedSubject.value = subject;
  subjectDropdownOpen.value = false;
  message.value = "";
  bankSearch.value = "";
  bankTypeFilter.value = "ALL";
  bankCurrentPage.value = 1;
  aiGeneratorModalOpen.value = false;
  resetAiGeneratorForm();
  resetAssignmentForm();
  resetQuestionBankImport();
  closeQuestionPreview();
  closeQuizOverview();
  await loadSubjectData();
};

const handleSubjectDropdownOutsideClick = (event) => {
  const container = subjectDropdownRef.value;
  if (!container) return;
  if (container.contains(event.target)) return;
  subjectDropdownOpen.value = false;
};

const handleSubjectDropdownKeydown = (event) => {
  if (event.key === "Escape") {
    subjectDropdownOpen.value = false;
  }
};

const openAiGeneratorModal = () => {
  aiGeneratorModalOpen.value = true;
  if (aiTopicSuggestions.value.length === 0) {
    loadAiTopicSuggestions();
  }
};

const loadAiTopicSuggestions = async () => {
  if (!selectedSubject.value || isLoadingAiTopicSuggestions.value) return;

  isLoadingAiTopicSuggestions.value = true;
  aiTopicSuggestionError.value = "";

  try {
    const response = await api.get(`/learning/subjects/${selectedSubject.value.id}/question-bank/topic-suggestions`, {
      params: {
        grade_label: autoAiGradeLabel.value === "-" ? "" : autoAiGradeLabel.value,
        phase_name: autoAiPhaseName.value === "Fase belum terbaca" ? "" : autoAiPhaseName.value,
        curriculum_name: autoAiCurriculumName.value,
      },
    });
    const topics = Array.isArray(response?.data?.topics) ? response.data.topics : [];
    aiTopicSuggestions.value = topics;
    if (topics.length > 0 && (!aiGeneratorForm.topic || aiGeneratorForm.topic === "__custom__")) {
      aiGeneratorForm.topic = topics[0];
      aiCustomTopic.value = "";
    }
    if (topics.length === 0) {
      aiGeneratorForm.topic = "__custom__";
      aiTopicSuggestionError.value = "Daftar materi belum tersedia. Silakan tulis materi sendiri.";
    }
  } catch (error) {
    aiTopicSuggestions.value = [];
    aiGeneratorForm.topic = "__custom__";
    aiTopicSuggestionError.value = "Daftar materi belum bisa dimuat. Silakan tulis materi sendiri.";
  } finally {
    isLoadingAiTopicSuggestions.value = false;
  }
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
    const subjectPart = slugifyFilename(selectedSubject.value.name, "mapel");
    const classPart = slugifyFilename(selectedSubject.value.class_name, "kelas");
    link.download = `template-bank-soal-${subjectPart}-${classPart}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    message.value = `Template Word ${questionType === "MCQ" ? "pilihan ganda" : "uraian"} berhasil diunduh.`;
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
    const total = summary.total || 0;
    const mcq = summary.mcq || 0;
    const essay = summary.essay || 0;

    const detailParts = [];
    if (mcq > 0) detailParts.push(`${mcq} pilihan ganda`);
    if (essay > 0) detailParts.push(`${essay} uraian`);
    const detail = detailParts.length > 0 ? detailParts.join(" + ") : `${total} soal`;

    pushToast({
      title: "Import Berhasil! 🎉",
      message: `${total} soal berhasil ditambahkan ke bank soal (${detail}).`,
      type: "success",
    });

    closeBulkImportModal();
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Import Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isImportingQuestionBank.value = false;
  }
};

const generateQuestionBankWithAi = async () => {
  if (!selectedSubject.value) return;
  if (!resolvedAiTopic.value) {
    aiTopicSuggestionError.value = "Pilih materi atau tulis materi sendiri terlebih dahulu.";
    return;
  }

  isGeneratingAiQuestions.value = true;
  message.value = "";
  isError.value = false;
  startAiGenerationProgress();

  try {
    const payload = {
      topic: resolvedAiTopic.value,
      question_type: aiGeneratorForm.question_type,
      question_count: Number(aiGeneratorForm.question_count) || 0,
      difficulty: aiGeneratorForm.difficulty,
      grade_label: autoAiGradeLabel.value === "-" ? "" : autoAiGradeLabel.value,
      phase_name: autoAiPhaseName.value === "Fase belum terbaca" ? "" : autoAiPhaseName.value,
      curriculum_name: autoAiCurriculumName.value,
      include_illustration: Boolean(aiGeneratorForm.include_illustration),
      additional_instructions: aiGeneratorForm.additional_instructions || "",
    };

    const response = await api.post(
      `/learning/subjects/${selectedSubject.value.id}/question-bank/generate-ai`,
      payload,
    );

    const summary = response?.data || {};
    generatedAiQuestions.value = (summary.items || []).map((item, index) => ({
      ...item,
      question_image_url: aiGeneratorForm.include_illustration ? (item.question_image_url || "") : "",
      temp_id: `generated-${Date.now()}-${index}`,
    }));
    selectedGeneratedAiQuestionIds.value = generatedAiQuestions.value.map((item) => item.temp_id);
    message.value = response?.message
      ? `${response.message}: ${summary.total || 0} soal preview berhasil dibuat.`
      : "Soal otomatis siap dicek";
    pushToast({
      title: "Soal Siap Dicek",
      message: `${summary.total || 0} soal berhasil dibuat dan siap dipilih.`,
      type: "success",
    });
    await nextTick();
    if (aiGeneratorScrollRef.value && aiPreviewSectionRef.value) {
      aiGeneratorScrollRef.value.scrollTo({
        top: aiPreviewSectionRef.value.offsetTop - 16,
        behavior: "smooth",
      });
    }
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Buat Soal Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isGeneratingAiQuestions.value = false;
    stopAiGenerationProgress();
  }
};

const selectAllGeneratedAiQuestions = () => {
  selectedGeneratedAiQuestionIds.value = generatedAiQuestions.value.map((item) => item.temp_id);
};

const clearGeneratedAiSelection = () => {
  selectedGeneratedAiQuestionIds.value = [];
};

watch(
  () => aiGeneratorForm.include_illustration,
  (enabled) => {
    if (enabled) return;

    generatedAiQuestions.value = generatedAiQuestions.value.map((item) => {
      const parsed = parseQuestionContent(item.question_text);
      return {
        ...item,
        question_image_url: "",
        question_text: parsed.question_text,
      };
    });
  },
);

const getGeneratedQuestionImageUrl = (item) => {
  if (!item) return "";
  if (item.question_image_url) return item.question_image_url;
  return parseQuestionContent(item.question_text).question_image_url;
};

const handleGeneratedQuestionImageUpload = async (item, event) => {
  const file = event?.target?.files?.[0];
  if (!file || !item) return;

  try {
    const uploaded = await uploadFileDirect(file);
    const parsed = parseQuestionContent(item.question_text);
    item.question_image_url = uploaded?.url || "";
    item.question_text = composeQuestionText(parsed.question_text, item.question_image_url);
    if (event?.target) {
      event.target.value = "";
    }
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Upload Ilustrasi Gagal",
      message: error.message,
      type: "error",
    });
  }
};

const removeGeneratedQuestionImage = (item) => {
  if (!item) return;

  const parsed = parseQuestionContent(item.question_text);
  item.question_image_url = "";
  item.question_text = parsed.question_text;
};

const saveGeneratedAiQuestions = async () => {
  if (!selectedSubject.value || selectedGeneratedAiQuestions.value.length === 0) {
    return;
  }

  isSavingGeneratedAiQuestions.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post(
      `/learning/subjects/${selectedSubject.value.id}/question-bank/save-generated-ai`,
      {
        question_type: aiGeneratorForm.question_type,
        items: selectedGeneratedAiQuestions.value.map((item) => {
          const parsedQuestion = parseQuestionContent(item.question_text);
          return {
            ...item,
            question_text: composeQuestionText(
              normalizeGeneratedQuestionText(parsedQuestion.question_text),
              aiGeneratorForm.include_illustration ? (item.question_image_url || parsedQuestion.question_image_url) : "",
            ),
          };
        }).map(({ temp_id, question_image_url, ...item }) => item),
      },
    );

    const summary = response?.data || {};
    message.value = response?.message
      ? `${response.message}: ${summary.total || 0} soal berhasil disimpan ke bank soal.`
      : "Soal berhasil disimpan";
    pushToast({
      title: "Soal Disimpan",
      message: `${summary.total || 0} soal terpilih berhasil masuk ke bank soal.`,
      type: "success",
    });
    aiGeneratorModalOpen.value = false;
    resetAiGeneratorForm();
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Simpan Soal Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isSavingGeneratedAiQuestions.value = false;
  }
};

const submitQuestionBank = async () => {
  if (!selectedSubject.value) return;

  isSavingQuestionBank.value = true;
  message.value = "";
  isError.value = false;

  try {
    const questionTextPayload = composeQuestionText(
      questionBankForm.question_text,
      questionBankForm.question_image_url,
    );
    const payload = {
      subject_id: selectedSubject.value.id,
      question_type: questionBankForm.question_type,
      question_text: questionTextPayload,
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

const uploadQuestionImageForCreate = async (event) => {
  const file = event?.target?.files?.[0];
  if (!file) return;
  isUploadingQuestionImage.value = true;
  try {
    const uploaded = await uploadFileDirect(file);
    questionBankForm.question_image_url = uploaded?.url || "";
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isUploadingQuestionImage.value = false;
    event.target.value = "";
  }
};

const uploadQuestionImageForPreview = async (event) => {
  const file = event?.target?.files?.[0];
  if (!file) return;
  isUploadingPreviewQuestionImage.value = true;
  try {
    const uploaded = await uploadFileDirect(file);
    questionPreviewForm.question_image_url = uploaded?.url || "";
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isUploadingPreviewQuestionImage.value = false;
    event.target.value = "";
  }
};

const submitAssignment = async () => {
  if (!selectedSubject.value) return;

  isSavingAssignment.value = true;
  message.value = "";
  isError.value = false;

  try {
    const formData = new FormData();
    formData.append("subject_id", selectedSubject.value.id);
    formData.append("title", assignmentForm.title);
    formData.append("description", assignmentForm.description || "");
    formData.append("due_date", assignmentForm.due_date || "");
    formData.append("assignment_type", assignmentForm.assignment_type);
    formData.append("shuffle_questions", String(Boolean(assignmentForm.shuffle_questions)));
    formData.append("question_duration_seconds", String(Number(assignmentForm.question_duration_seconds) || 0));
    formData.append("question_bank_ids", JSON.stringify(assignmentForm.selected_question_bank_ids));

    const response = await api.post("/learning/assignments", formData);
    message.value = response?.message || "Quiz berhasil diterbitkan";
    resetAssignmentForm();
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSavingAssignment.value = false;
  }
};

onMounted(async () => {
  if (typeof document !== "undefined") {
    document.addEventListener("click", handleSubjectDropdownOutsideClick);
    document.addEventListener("keydown", handleSubjectDropdownKeydown);
  }
  await loadSubjects();
});

watch(subjectError, (value) => {
  if (!value) return;
  pushToast({ title: "Gagal Memuat Bank Soal", message: value, type: "error" });
});

watch(message, (value) => {
  if (!value) return;
  pushToast({
    title: isError.value ? "Aksi Bank Soal Gagal" : "Aksi Bank Soal Berhasil",
    message: value,
    type: isError.value ? "error" : "success",
  });
});
</script>

<style scoped>
@media (min-width: 1024px) {
  .learning-bank-modal-overlay {
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

  .learning-question-bank-page :deep(.text-2xl),
  .learning-question-bank-page :deep(.text-xl),
  .learning-question-bank-page :deep(.text-lg) {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }

  .learning-question-bank-page :deep(.text-base) {
    font-size: 0.8125rem !important;
    line-height: 1.2rem !important;
  }

  .learning-question-bank-page :deep(.text-sm) {
    font-size: 0.75rem !important;
    line-height: 1.1rem !important;
  }

  .learning-question-bank-page :deep(.text-xs) {
    font-size: 0.6875rem !important;
    line-height: 1rem !important;
  }
}
</style>
