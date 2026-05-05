<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">


    <main class="mx-auto mt-8 max-w-[1400px]">

      <section class="mb-8">


        <div
          class="flex flex-nowrap gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            <div v-if="selectedSubject?.id === item.id"
              class="absolute right-4 top-4 h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
          </button>
        </div>
      </section>

      <div>
        <div v-if="selectedSubject"
          class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">

          <div class="border-b border-slate-100 bg-slate-50/50 px-6 pt-6 dark:border-slate-800 dark:bg-slate-800/20">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ selectedSubject.name }}</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {{ selectedSubject.class_name }} &bull; {{ selectedSubject.description || "Tidak ada deskripsi." }}
            </p>

          </div>

          <div class="space-y-6 p-6">
            <!-- <section class="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/20">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pusat Bank Soal</h3>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Buat soal baru, impor dari Word, review, dan rapikan bank soal mapel ini dari satu halaman khusus.
                  </p>
                </div>
                <div class="flex flex-wrap gap-3">
                  <router-link to="/learning-quiz-teacher"
                    class="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">
                    Kembali ke Quiz
                  </router-link>
                  <button @click="openAiGeneratorModal"
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9.813 15.904L9 18l-.813-2.096a2.25 2.25 0 00-1.341-1.341L4.75 13.75l2.096-.813a2.25 2.25 0 001.341-1.341L9 9.5l.813 2.096a2.25 2.25 0 001.341 1.341l2.096.813-2.096.813a2.25 2.25 0 00-1.341 1.341zM18.25 8.75L18 10l-.25-1.25a1.5 1.5 0 00-.938-.938L15.5 7.5l1.312-.312a1.5 1.5 0 00.938-.938L18 5l.25 1.25a1.5 1.5 0 00.938.938L20.5 7.5l-1.312.312a1.5 1.5 0 00-.938.938z" />
                    </svg>
                    Generate dengan AI
                  </button>
                  <button @click="questionBankModalOpen = true"
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Buat Soal Baru
                  </button>
                </div>
              </div>
            </section> -->

            <div
              class="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-900/5 dark:bg-slate-800/50 dark:ring-white/5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-white">Bank Soal</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">Total {{ questionBankTotal }} soal tersimpan untuk
                  mapel ini. Pemilihan soal di tabel bawah langsung masuk ke konfigurasi quiz.</p>
              </div>
              <div class="flex flex-wrap gap-3">
                <button @click="openAiGeneratorModal"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9.813 15.904L9 18l-.813-2.096a2.25 2.25 0 00-1.341-1.341L4.75 13.75l2.096-.813a2.25 2.25 0 001.341-1.341L9 9.5l.813 2.096a2.25 2.25 0 001.341 1.341l2.096.813-2.096.813a2.25 2.25 0 00-1.341 1.341zM18.25 8.75L18 10l-.25-1.25a1.5 1.5 0 00-.938-.938L15.5 7.5l1.312-.312a1.5 1.5 0 00.938-.938L18 5l.25 1.25a1.5 1.5 0 00.938.938L20.5 7.5l-1.312.312a1.5 1.5 0 00-.938.938z" />
                  </svg>
                  Generate AI
                </button>
                <button @click="questionBankModalOpen = true"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Buat Soal Baru
                </button>
              </div>
            </div>

            <section
              class="grid gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.15fr,0.85fr]">
              <div class="space-y-3">
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-white">Impor soal dari template MS Word</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Unduh template `.doc`, isi sesuai blok `[SOAL]` yang sudah disediakan, lalu unggah kembali.
                    Satu blok = satu soal.
                  </p>
                </div>
                <div class="flex flex-wrap gap-3">
                  <button type="button" @click="downloadQuestionBankTemplate('MCQ')" :disabled="isDownloadingTemplate"
                    class="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
                    {{ isDownloadingTemplate ? "Menyiapkan..." : "Download Template Pilihan Ganda" }}
                  </button>
                  <button type="button" @click="downloadQuestionBankTemplate('ESSAY')" :disabled="isDownloadingTemplate"
                    class="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700">
                    Download Template Uraian
                  </button>
                </div>
              </div>

              <div
                class="space-y-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-900/5 dark:bg-slate-800/50 dark:ring-white/5">
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">Upload Dokumen Template
                  Soal</label>
                <input ref="questionBankDocumentInput" type="file" accept=".doc,.txt,.csv"
                  @change="handleQuestionBankDocumentChange"
                  class="block w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-sky-700 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:file:bg-sky-500/10 dark:file:text-sky-300" />
                <p class="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Format didukung: `.doc` (template Word), `.txt`, dan kompatibel `.csv`.
                </p>
                <div v-if="questionBankImportFileName"
                  class="rounded-xl bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
                  File dipilih: {{ questionBankImportFileName }}
                </div>
                <button type="button" @click="importQuestionBankDocument"
                  :disabled="isImportingQuestionBank || !questionBankImportFile"
                  class="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
                  {{ isImportingQuestionBank ? "Mengimpor soal..." : "Upload dan Import Soal" }}
                </button>
              </div>
            </section>

            <section class="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
              <div class="border-b border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div class="grid gap-4 md:grid-cols-4">
                  <div class="relative md:col-span-2">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <input v-model="bankSearch" type="text" placeholder="Cari pertanyaan..."
                      class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-9 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                  </div>
                  <select v-model="bankTypeFilter"
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

              <div
                class="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/20 md:flex-row md:items-center md:justify-between">
                <div class="text-sm font-medium text-slate-500">
                  Halaman <span class="text-slate-900 dark:text-white">{{ bankCurrentPage }}</span> dari {{
                    bankTotalPages }}
                </div>
                <div class="flex gap-2">
                  <button @click="deleteSelectedQuestionBankItems" v-if="assignmentForm.selected_question_bank_ids.length > 0"
                    :disabled="isSavingQuestionPreview"
                    class="rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition disabled:opacity-50"
                    :class="pendingDeleteQuestionId === 'bulk-delete'
                      ? 'bg-rose-600 text-white hover:bg-rose-500'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20 dark:hover:bg-rose-500/20'">
                    {{ pendingDeleteQuestionId === 'bulk-delete'
                      ? `Klik Lagi Hapus ${assignmentForm.selected_question_bank_ids.length} Soal`
                      : `Hapus Soal Terpilih (${assignmentForm.selected_question_bank_ids.length})` }}
                  </button>
                  <button @click="selectAllCurrentBankPage"
                    class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-sky-50 dark:bg-slate-800 dark:text-sky-400 dark:ring-slate-700 dark:hover:bg-slate-700">
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
                      <th class="px-5 py-4 font-semibold">Status Penggunaan</th>
                      <th class="px-5 py-4 font-semibold text-right">Review</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                    <tr v-for="item in paginatedQuestionBank" :key="item.id"
                      class="group transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td class="px-5 py-4 align-top">
                        <input v-model="assignmentForm.selected_question_bank_ids" type="checkbox" :value="item.id"
                          class="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-600 dark:border-slate-600 dark:bg-slate-800" />
                      </td>
                      <td class="px-5 py-4">
                        <p class="max-w-3xl font-medium leading-relaxed text-slate-900 dark:text-white">{{
                          item.question_text }}</p>
                        <p class="mt-1 text-xs text-slate-400">Dibuat: {{ formatDateTime(item.created_at) }}</p>
                      </td>
                      <td class="px-5 py-4 align-top">
                        <span
                          class="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset"
                          :class="item.question_type === 'MCQ' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300' : 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300'">
                          {{ assignmentTypeLabel(item.question_type) }}
                        </span>
                      </td>
                      <td class="px-5 py-4 align-top">
                        <div v-if="Number(item.usage_count) > 0"
                          class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <svg class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                          <span class="font-medium">Terpakai ({{ item.usage_count }}x)</span>
                        </div>
                        <span v-else class="text-slate-400">Belum terpakai</span>
                      </td>
                      <td class="px-5 py-4 align-top text-right">
                        <button type="button" @click="openQuestionPreview(item, 'bank')"
                          class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                          Review
                        </button>
                      </td>
                    </tr>
                    <tr v-if="paginatedQuestionBank.length === 0">
                      <td colspan="5" class="px-5 py-12 text-center">
                        <div class="text-sm text-slate-500">Tidak ada soal yang cocok dengan pencarian.</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                class="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
                <p class="text-sm text-slate-500">Menampilkan {{ bankStartRow }} - {{ bankEndRow }} dari {{
                  filteredQuestionBank.length }}</p>
                <div class="flex gap-2">
                  <button @click="bankCurrentPage = Math.max(1, bankCurrentPage - 1)" :disabled="bankCurrentPage === 1"
                    class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
                    Sebelumnya
                  </button>
                  <button @click="bankCurrentPage = Math.min(bankTotalPages, bankCurrentPage + 1)"
                    :disabled="bankCurrentPage === bankTotalPages"
                    class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
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
            <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pilih Mata Pelajaran</h3>
          <p class="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">Silakan pilih mata pelajaran dari menu di
            atas untuk mulai mengelola bank soal dan menerbitkan quiz.</p>
        </div>
      </div>
    </main>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="aiGeneratorModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">

        <div
          class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div
            class="flex flex-none items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Generate Soal dengan AI</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Soal akan dibuat oleh Gemini dan langsung disimpan ke bank soal mapel ini.
              </p>
            </div>
            <button @click="aiGeneratorModalOpen = false"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="generateQuestionBankWithAi" class="flex min-h-0 flex-1 flex-col">
            <div class="flex-1 space-y-6 overflow-y-auto p-6">
              <section v-if="isGeneratingAiQuestions"
                class="rounded-2xl border border-sky-200 bg-sky-50/80 p-5 dark:border-sky-500/20 dark:bg-sky-500/10">
                <div class="flex items-start gap-4">
                  <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-600 ring-1 ring-sky-200 dark:bg-slate-900 dark:text-sky-300 dark:ring-sky-500/20">
                    <svg class="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="font-semibold text-sky-900 dark:text-sky-100">Gemini sedang menyusun soal</h3>
                    <p class="mt-1 text-sm text-sky-800 dark:text-sky-200">
                      {{ activeAiGenerationStage }}
                    </p>
                    <div class="mt-4 h-2 overflow-hidden rounded-full bg-white/80 dark:bg-slate-900/70">
                      <div class="h-full w-1/2 animate-pulse rounded-full bg-sky-500"></div>
                    </div>
                  </div>
                </div>
              </section>

              <div class="grid gap-5 md:grid-cols-2">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe Soal</label>
                  <select v-model="aiGeneratorForm.question_type"
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                    <option value="MCQ">Pilihan Ganda</option>
                    <option value="ESSAY">Essay</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Jumlah Soal</label>
                  <input v-model="aiGeneratorForm.question_count" type="number" min="1" max="20"
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </div>
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Tingkat Kesulitan</label>
                  <select v-model="aiGeneratorForm.difficulty"
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                    <option value="MUDAH">Mudah</option>
                    <option value="MENENGAH">Menengah</option>
                    <option value="SULIT">Sulit</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Mapel Aktif</label>
                  <div
                    class="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/50 dark:text-slate-200 dark:ring-slate-700/50">
                    {{ selectedSubject?.name }} • {{ selectedSubject?.class_name }}
                  </div>
                </div>
              </div>

              <div class="grid gap-5 md:grid-cols-3">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Jenjang / Kelas</label>
                  <input v-model="aiGeneratorForm.grade_label" type="text" placeholder="Contoh: Kelas 8 SMP"
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Fase</label>
                  <input v-model="aiGeneratorForm.phase_name" type="text" placeholder="Contoh: Fase D"
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Kurikulum</label>
                  <input v-model="aiGeneratorForm.curriculum_name" type="text" placeholder="Contoh: Kurikulum Merdeka"
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Topik / Materi</label>
                <textarea v-model="aiGeneratorForm.topic" rows="3"
                  placeholder="Contoh: Persamaan linear satu variabel, ekosistem, teks eksplanasi..."
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Instruksi Tambahan</label>
                <textarea v-model="aiGeneratorForm.additional_instructions" rows="4"
                  placeholder="Contoh: fokus ke HOTS, hindari angka pecahan, gunakan konteks kehidupan sehari-hari..."
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
              </div>

              <section v-if="generatedAiQuestions.length" ref="aiPreviewSectionRef"
                class="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/30">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 class="font-semibold text-slate-900 dark:text-white">Preview Soal AI</h3>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Pilih soal yang ingin disimpan ke bank soal. Saat ini terpilih {{
                      selectedGeneratedAiQuestions.length }} dari {{ generatedAiQuestions.length }} soal.
                    </p>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button type="button" @click="selectAllGeneratedAiQuestions"
                      class="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">
                      Pilih Semua
                    </button>
                    <button type="button" @click="clearGeneratedAiSelection"
                      class="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">
                      Kosongkan Pilihan
                    </button>
                  </div>
                </div>

                <div class="mt-4 space-y-4">
                  <article v-for="(item, index) in generatedAiQuestions" :key="item.temp_id"
                    class="rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900"
                    :class="selectedGeneratedAiQuestionIds.includes(item.temp_id) ? 'border-sky-300 dark:border-sky-500/40' : 'border-slate-200 dark:border-slate-700'">
                    <div class="flex items-start gap-4">
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
                            {{ item.question_type === "MCQ" ? "Pilihan Ganda" : "Essay" }}
                          </span>
                        </div>
                        <p class="mt-3 text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                          {{ item.question_text }}
                        </p>

                        <div v-if="item.question_type === 'MCQ'" class="mt-4 grid gap-2">
                          <div v-for="(option, optionIndex) in item.options || []"
                            :key="`${item.temp_id}-option-${optionIndex}`" class="rounded-xl border px-3 py-2 text-sm"
                            :class="optionIndex === item.correct_option
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                              : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'">
                            {{ String.fromCharCode(65 + optionIndex) }}. {{ option }}
                          </div>
                        </div>

                        <div v-else
                          class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                          <span class="font-semibold">Rubrik:</span> {{ item.rubric }}
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            </div>

            <div
              class="flex flex-none items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
              <button @click="aiGeneratorModalOpen = false" type="button"
                class="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </button>
              <button v-if="generatedAiQuestions.length" type="button" @click="saveGeneratedAiQuestions"
                :disabled="isSavingGeneratedAiQuestions || selectedGeneratedAiQuestions.length === 0"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                {{ isSavingGeneratedAiQuestions ? "Menyimpan..." : `Simpan ${selectedGeneratedAiQuestions.length} Soal
                Terpilih` }}
              </button>
              <button type="submit" :disabled="isGeneratingAiQuestions"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                {{ isGeneratingAiQuestions ? "Generating..." : generatedAiQuestions.length ? "Generate Ulang Preview" :
                "Generate Preview" }}
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">

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

              <div v-if="questionBankForm.question_type === 'MCQ'" class="grid gap-4 md:grid-cols-2">
                <div v-for="(option, index) in questionBankForm.options" :key="`option-${index}`"
                  class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div class="mb-3 flex items-center justify-between">
                    <span
                      class="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {{ String.fromCharCode(65 + index) }}
                    </span>
                    <label
                      class="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-sky-600 dark:text-slate-400">
                      <input v-model="questionBankForm.correct_option" type="radio" name="correct-bank" :value="index"
                        class="h-4 w-4 text-sky-600 focus:ring-sky-600" />
                      Jawaban Benar
                    </label>
                  </div>
                  <input v-model="questionBankForm.options[index]" type="text"
                    :placeholder="`Opsi ${String.fromCharCode(65 + index)}`"
                    class="block w-full rounded-lg border-0 bg-slate-50 py-2 px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </div>
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

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="quizOverviewModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">

        <div
          class="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>

          <div
            class="flex flex-none items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Detail Quiz Berjalan</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{ quizOverviewModal.assignment?.title || "-" }} • {{
                  assignmentTypeLabel(quizOverviewModal.assignment?.assignment_type) }}
              </p>
            </div>
            <button @click="closeQuizOverview"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="quizOverviewModal.loading" class="p-12 text-center">
            <div class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
            <p class="mt-4 text-sm text-slate-500">Memuat detail quiz...</p>
          </div>

          <div v-else class="flex-1 overflow-y-auto p-6">
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <div class="text-xs text-slate-500 dark:text-slate-400">Total Siswa</div>
                <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{{
                  quizOverviewModal.analytics.total_students || 0 }}</div>
              </div>
              <div
                class="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                <div class="text-xs text-emerald-700 dark:text-emerald-300">Sudah Submit</div>
                <div class="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-200">{{
                  quizOverviewModal.analytics.submitted_count || 0 }}</div>
              </div>
              <div class="rounded-xl bg-red-50 p-4 ring-1 ring-red-200 dark:bg-red-500/10 dark:ring-red-500/20">
                <div class="text-xs text-red-700 dark:text-red-300">Belum Submit</div>
                <div class="mt-1 text-2xl font-bold text-red-900 dark:text-red-200">{{
                  quizOverviewModal.analytics.pending_count || 0 }}</div>
              </div>
              <div class="rounded-xl bg-sky-50 p-4 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:ring-sky-500/20">
                <div class="text-xs text-sky-700 dark:text-sky-300">Rata-rata Nilai</div>
                <div class="mt-1 text-2xl font-bold text-sky-900 dark:text-sky-200">{{
                  quizOverviewModal.analytics.average_score ?? "-" }}</div>
              </div>
              <div class="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/20">
                <div class="text-xs text-amber-700 dark:text-amber-300">Total Pelanggaran</div>
                <div class="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-200">{{
                  quizOverviewModal.analytics.total_violations || 0 }}</div>
              </div>
              <div
                class="rounded-xl bg-violet-50 p-4 ring-1 ring-violet-200 dark:bg-violet-500/10 dark:ring-violet-500/20">
                <div class="text-xs text-violet-700 dark:text-violet-300">Siswa Terflag</div>
                <div class="mt-1 text-2xl font-bold text-violet-900 dark:text-violet-200">{{
                  quizOverviewModal.analytics.flagged_students_count || 0 }}</div>
              </div>
            </div>

            <div class="mt-6 grid gap-6 xl:grid-cols-2">
              <section
                class="overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div class="border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <h3 class="font-semibold text-slate-900 dark:text-white">Sudah Submit</h3>
                </div>
                <div class="max-h-72 overflow-y-auto">
                  <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm text-left">
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
                        <td class="px-5 py-3 font-medium text-slate-900 dark:text-white">{{ item.username }}</td>
                        <td class="px-5 py-3 text-slate-500 dark:text-slate-400">{{ formatDateTime(item.submitted_at) }}
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
                              {{ formatViolationLabel(log.violation_type) }} • {{ formatDateTime(log.created_at) }}
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
                <div class="border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <h3 class="font-semibold text-slate-900 dark:text-white">Belum Submit</h3>
                </div>
                <div class="max-h-72 overflow-y-auto">
                  <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm text-left">
                    <thead class="bg-white dark:bg-slate-900">
                      <tr>
                        <th class="px-5 py-3 font-semibold text-slate-500">Siswa</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Email Ortu</th>
                        <th class="px-5 py-3 font-semibold text-slate-500">Pelanggaran</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="item in quizOverviewModal.pendingStudents" :key="`pending-${item.id}`">
                        <td class="px-5 py-3 font-medium text-slate-900 dark:text-white">{{ item.username }}</td>
                        <td class="px-5 py-3 text-slate-500 dark:text-slate-400">{{ item.parent_email || "-" }}</td>
                        <td class="px-5 py-3">
                          <div class="font-semibold"
                            :class="item.violation_count > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'">
                            {{ item.violation_count || 0 }}x
                          </div>
                          <div v-if="item.violation_logs?.length"
                            class="mt-1 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <p v-for="log in item.violation_logs.slice(0, 3)" :key="`pending-log-${item.id}-${log.id}`">
                              {{ formatViolationLabel(log.violation_type) }} • {{ formatDateTime(log.created_at) }}
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
              class="mt-6 overflow-hidden rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div class="border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 class="font-semibold text-slate-900 dark:text-white">Analitik Soal</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm text-left">
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">

        <div
          class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
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
                  {{ questionPreviewModal.question.question_text }}
                </p>
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

                  <div v-if="questionPreviewModal.question.question_type === 'MCQ'" class="grid gap-4 md:grid-cols-2">
                    <div v-for="(option, optionIndex) in questionPreviewForm.options"
                      :key="`edit-option-${optionIndex}`"
                      class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                      <div class="mb-3 flex items-center justify-between">
                        <span
                          class="flex h-6 w-6 items-center justify-center rounded-md bg-white text-xs font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                          {{ String.fromCharCode(65 + optionIndex) }}
                        </span>
                        <label class="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <input v-model="questionPreviewForm.correct_option" type="radio" name="preview-correct-option"
                            :value="optionIndex" class="h-4 w-4 text-sky-600 focus:ring-sky-600" />
                          Jawaban Benar
                        </label>
                      </div>
                      <input v-model="questionPreviewForm.options[optionIndex]" type="text"
                        :placeholder="`Opsi ${String.fromCharCode(65 + optionIndex)}`"
                        class="block w-full rounded-lg border-0 bg-white py-2 px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                    </div>
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
            <button v-if="questionPreviewModal.source === 'bank'" type="button" @click="deleteQuestionFromPreview"
              :disabled="isSavingQuestionPreview"
              class="mr-auto rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50"
              :class="pendingDeleteQuestionId === questionPreviewModal.question?.id
                ? 'bg-rose-600 text-white hover:bg-rose-500'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20'">
              {{ pendingDeleteQuestionId === questionPreviewModal.question?.id ? "Klik Lagi untuk Hapus" : "Hapus Soal" }}
            </button>
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
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDateTime } from "@/utils/date";
import { useMasterDataStore } from "@/store/masterData";

const subjects = ref([]);
const masterDataStore = useMasterDataStore();
const selectedSubject = ref(null);
const assignments = ref([]);
const questionBank = ref([]);
const questionBankTotal = ref(0);
const subjectError = ref("");
const message = ref("");
const isError = ref(false);
const isSavingAssignment = ref(false);
const isSavingQuestionBank = ref(false);
const isSavingQuestionPreview = ref(false);
const pendingDeleteQuestionId = ref(null);
const isDownloadingTemplate = ref(false);
const isImportingQuestionBank = ref(false);
const isGeneratingAiQuestions = ref(false);
const isSavingGeneratedAiQuestions = ref(false);
const aiGeneratorModalOpen = ref(false);
const aiPreviewSectionRef = ref(null);
const questionBankModalOpen = ref(false);
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
const questionPreviewForm = reactive({
  question_text: "",
  options: ["", "", "", "", ""],
  correct_option: 0,
  rubric: "",
});

const questionBankImportFileName = computed(() => questionBankImportFile.value?.name || "");

// Fitur: Body Scroll Lock saat modal aktif
const isAnyModalOpen = computed(() =>
  aiGeneratorModalOpen.value || questionBankModalOpen.value || quizOverviewModal.open || questionPreviewModal.open,
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
  options: ["", "", "", "", ""],
  correct_option: 0,
  rubric: "",
});

const aiGeneratorForm = reactive({
  question_type: "MCQ",
  question_count: 5,
  difficulty: "MENENGAH",
  grade_label: "",
  phase_name: "",
  curriculum_name: "",
  topic: "",
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
  questionBank.value.filter((item) => item.question_type === assignmentForm.assignment_type),
);
const selectedGeneratedAiQuestions = computed(() =>
  generatedAiQuestions.value.filter((item) => selectedGeneratedAiQuestionIds.value.includes(item.temp_id)),
);
const activeAiGenerationStage = computed(() => aiGenerationStages[aiGenerationStageIndex.value] || aiGenerationStages[0]);

const selectedQuestionsForPublish = computed(() =>
  filteredQuestionBankForAssignment.value.filter((item) => assignmentForm.selected_question_bank_ids.includes(item.id)),
);

const selectedQuestionCount = computed(() => selectedQuestionsForPublish.value.length);
const normalizedPreviewOptions = computed(() =>
  questionPreviewModal.question?.question_type === "MCQ"
    ? questionPreviewForm.options.map((item) => String(item || "").trim()).filter(Boolean)
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
    const leftTime = left?.due_date ? new Date(left.due_date).getTime() : 0;
    const rightTime = right?.due_date ? new Date(right.due_date).getTime() : 0;
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
  () => {
    assignmentForm.selected_question_bank_ids = assignmentForm.selected_question_bank_ids.filter((id) =>
      filteredQuestionBankForAssignment.value.some((item) => item.id === id),
    );
  },
);

const resetQuestionBankForm = () => {
  questionBankForm.question_type = "MCQ";
  questionBankForm.question_text = "";
  questionBankForm.options = ["", "", "", "", ""];
  questionBankForm.correct_option = 0;
  questionBankForm.rubric = "";
};

const resetAiGeneratorForm = () => {
  aiGeneratorForm.question_type = "MCQ";
  aiGeneratorForm.question_count = 5;
  aiGeneratorForm.difficulty = "MENENGAH";
  aiGeneratorForm.grade_label = "";
  aiGeneratorForm.phase_name = "";
  aiGeneratorForm.curriculum_name = "";
  aiGeneratorForm.topic = "";
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
  if (pendingDeleteQuestionId.value === "bulk-delete") {
    pendingDeleteQuestionId.value = null;
  }
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
  questionPreviewModal.open = true;
  questionPreviewModal.question = { ...question };
  questionPreviewModal.source = source;
  questionPreviewModal.sourceLabel = source === "selected" ? "Soal yang akan diterbitkan" : "Review sebelum dipilih";
  questionPreviewModal.questionNumber = questionNumber;
  questionPreviewForm.question_text = question.question_text || "";
  questionPreviewForm.options = Array.from(
    { length: Math.max(5, Array.isArray(question.options) ? question.options.length : 0) },
    (_, index) => question.options?.[index] || "",
  );
  questionPreviewForm.correct_option = Number(question.correct_option || 0);
  questionPreviewForm.rubric = question.rubric || "";
};

const closeQuestionPreview = () => {
  questionPreviewModal.open = false;
  questionPreviewModal.question = null;
  questionPreviewModal.source = "bank";
  questionPreviewModal.sourceLabel = "";
  questionPreviewModal.questionNumber = null;
  pendingDeleteQuestionId.value = null;
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
    const updatedQuestion = response?.data;

    if (updatedQuestion) {
      questionPreviewModal.question = { ...updatedQuestion };
      if (questionPreviewModal.source === "selected") {
        questionPreviewForm.question_text = updatedQuestion.question_text || "";
        questionPreviewForm.options = Array.from(
          { length: Math.max(5, Array.isArray(updatedQuestion.options) ? updatedQuestion.options.length : 0) },
          (_, index) => updatedQuestion.options?.[index] || "",
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

  if (pendingDeleteQuestionId.value !== questionPreviewModal.question.id) {
    pendingDeleteQuestionId.value = questionPreviewModal.question.id;
    pushToast({
      title: "Konfirmasi Hapus Soal",
      message: "Klik tombol hapus sekali lagi untuk menghapus soal ini dari bank soal.",
      type: "info",
      duration: 2600,
    });
    window.setTimeout(() => {
      if (pendingDeleteQuestionId.value === questionPreviewModal.question?.id) {
        pendingDeleteQuestionId.value = null;
      }
    }, 2600);
    return;
  }

  isSavingQuestionPreview.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.delete(`/learning/question-bank/${questionPreviewModal.question.id}`);
    pendingDeleteQuestionId.value = null;
    closeQuestionPreview();
    message.value = response?.message || "Soal berhasil dihapus";
    pushToast({
      title: "Soal Dihapus",
      message: response?.message || "Soal bank berhasil dihapus.",
      type: "success",
    });
    await loadSubjectData();
  } catch (error) {
    pendingDeleteQuestionId.value = null;
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

const deleteSelectedQuestionBankItems = async () => {
  if (!selectedSubject.value || assignmentForm.selected_question_bank_ids.length === 0) {
    return;
  }

  if (pendingDeleteQuestionId.value !== "bulk-delete") {
    pendingDeleteQuestionId.value = "bulk-delete";
    pushToast({
      title: "Konfirmasi Hapus Massal",
      message: `Klik sekali lagi untuk menghapus ${assignmentForm.selected_question_bank_ids.length} soal yang dipilih.`,
      type: "info",
      duration: 2800,
    });
    window.setTimeout(() => {
      if (pendingDeleteQuestionId.value === "bulk-delete") {
        pendingDeleteQuestionId.value = null;
      }
    }, 2800);
    return;
  }

  try {
    isSavingQuestionPreview.value = true;
    message.value = "";
    isError.value = false;

    const response = await api.post(
      `/learning/subjects/${selectedSubject.value.id}/question-bank/bulk-delete`,
      { question_ids: assignmentForm.selected_question_bank_ids },
    );

    const total = response?.data?.total || 0;
    pendingDeleteQuestionId.value = null;
    assignmentForm.selected_question_bank_ids = [];
    message.value = response?.message || "Soal terpilih berhasil dihapus";
    pushToast({
      title: "Hapus Massal Berhasil",
      message: `${total} soal berhasil dihapus dari bank soal.`,
      type: "success",
    });
    await loadSubjectData();
  } catch (error) {
    pendingDeleteQuestionId.value = null;
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Hapus Massal Gagal",
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
  questionBank.value = questionBankResponse?.data?.data || [];
  questionBankTotal.value = questionBankResponse?.data?.total || 0;
};

const selectSubject = async (subject) => {
  selectedSubject.value = subject;
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

const openAiGeneratorModal = () => {
  aiGeneratorModalOpen.value = true;
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

const generateQuestionBankWithAi = async () => {
  if (!selectedSubject.value) return;

  isGeneratingAiQuestions.value = true;
  message.value = "";
  isError.value = false;
  startAiGenerationProgress();

  try {
    const payload = {
      topic: aiGeneratorForm.topic,
      question_type: aiGeneratorForm.question_type,
      question_count: Number(aiGeneratorForm.question_count) || 0,
      difficulty: aiGeneratorForm.difficulty,
      grade_label: aiGeneratorForm.grade_label || "",
      phase_name: aiGeneratorForm.phase_name || "",
      curriculum_name: aiGeneratorForm.curriculum_name || "",
      additional_instructions: aiGeneratorForm.additional_instructions || "",
    };

    const response = await api.post(
      `/learning/subjects/${selectedSubject.value.id}/question-bank/generate-ai`,
      payload,
    );

    const summary = response?.data || {};
    generatedAiQuestions.value = (summary.items || []).map((item, index) => ({
      ...item,
      temp_id: `generated-${Date.now()}-${index}`,
    }));
    selectedGeneratedAiQuestionIds.value = generatedAiQuestions.value.map((item) => item.temp_id);
    message.value = response?.message
      ? `${response.message}: ${summary.total || 0} soal preview berhasil dibuat.`
      : "Preview soal AI berhasil dibuat";
    pushToast({
      title: "Preview Soal AI Siap",
      message: `${summary.total || 0} soal berhasil dibuat dan siap dipilih.`,
      type: "success",
    });
    await nextTick();
    aiPreviewSectionRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Generate Soal AI Gagal",
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
        items: selectedGeneratedAiQuestions.value.map(({ temp_id, ...item }) => item),
      },
    );

    const summary = response?.data || {};
    message.value = response?.message
      ? `${response.message}: ${summary.total || 0} soal berhasil disimpan ke bank soal.`
      : "Soal AI berhasil disimpan";
    pushToast({
      title: "Soal AI Disimpan",
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
      title: "Simpan Soal AI Gagal",
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

onMounted(loadSubjects);

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
