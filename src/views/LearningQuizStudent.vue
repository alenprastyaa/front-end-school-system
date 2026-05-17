<template>
  <div>
    <div v-if="examCodeModalOpen"
      class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div
        class="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Masukkan Kode Ujian</h3>
            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {{ pendingExamAssignmentForCode?.title || "Ujian Resmi" }} membutuhkan kode ujian sebelum sesi dimulai.
            </p>
          </div>
          <button type="button" @click="cancelExamCodeModal"
            class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="mt-6 space-y-5" @submit.prevent="confirmExamCodeModal">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Kode Ujian</label>
            <input v-model="examCodeForm.code" type="text" autocomplete="off" placeholder="Contoh: MTK-002"
              class="block w-full rounded-2xl border-0 bg-slate-50 px-4 py-3 text-sm font-semibold uppercase text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-rose-500 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
          </div>

          <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" @click="cancelExamCodeModal"
              class="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              Batal
            </button>
            <button type="submit"
              class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-600 dark:bg-white dark:text-slate-900 dark:hover:bg-rose-200">
              Mulai Ujian
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="confirmSubmitModalOpen"
      class="fixed inset-0 z-[125] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        class="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Konfirmasi Pengiriman</h3>
            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {{ submissionTarget?.is_exam ? "Ujian" : "Quiz" }} akan dikirim dan jawaban tidak bisa diubah lagi.
            </p>
          </div>
          <button type="button" @click="closeConfirmSubmitModal"
            class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          class="mt-5 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
          <p class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ answeredQuestionCount }} dari {{ totalQuestions }} soal sudah terjawab.
          </p>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pastikan Anda sudah memeriksa semua jawaban sebelum mengirim.
          </p>
        </div>

        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" @click="closeConfirmSubmitModal"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            Batal
          </button>
          <button type="button" @click="confirmSubmitAssignment" :disabled="isSubmitting"
            class="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60">
            {{ isSubmitting ? "Memproses..." : "Ya, Kirim Sekarang" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="reviewTarget"
      class="fixed inset-0 z-[126] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Review Jawaban</h3>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>{{ reviewTarget.title }}</span>
              <span class="h-1 w-1 rounded-full bg-slate-300"></span>
              <span>{{ assignmentTypeLabel(reviewTarget.assignment_type) }}</span>
              <span v-if="reviewTarget.submitted_at" class="h-1 w-1 rounded-full bg-slate-300"></span>
              <span v-if="reviewTarget.submitted_at">{{ formatDateTime(reviewTarget.submitted_at) }}</span>
            </div>
          </div>
          <button type="button" @click="closeAssignmentReview"
            class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-5">
          <div v-if="reviewTarget.score !== null || reviewTarget.feedback"
            class="mb-5 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
            <p v-if="reviewTarget.score !== null" class="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              Nilai: {{ reviewTarget.score }} / 100
            </p>
            <p v-if="reviewTarget.feedback" class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              <span class="font-bold text-slate-900 dark:text-white">Catatan Guru:</span> {{ reviewTarget.feedback }}
            </p>
          </div>

          <div class="space-y-4">
            <article v-for="(item, index) in reviewItems" :key="`review-answer-${index}`"
              class="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/30">
              <p class="font-medium leading-relaxed text-slate-900 dark:text-white">
                <span class="text-slate-400">{{ index + 1 }}.</span> {{ item.question }}
              </p>
              <img v-if="item.questionImageUrl" :src="item.questionImageUrl" alt="Gambar pertanyaan"
                class="mt-3 max-h-56 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />

              <div v-if="item.type === 'MCQ'" class="mt-4 space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span v-if="item.selectedIndex === null"
                    class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                    Belum Dijawab
                  </span>
                  <span v-else-if="item.isCorrect"
                    class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
                    Benar
                  </span>
                  <span v-else
                    class="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                    Salah
                  </span>
                </div>
                <div v-for="(option, optionIndex) in item.options" :key="`review-option-${index}-${optionIndex}`"
                  class="rounded-xl border px-4 py-3 text-sm"
                  :class="item.correctIndex === optionIndex
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100'
                    : item.selectedIndex === optionIndex
                      ? 'border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-100'
                      : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'">
                  <div class="flex items-start gap-3">
                    <span class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      :class="item.correctIndex === optionIndex
                        ? 'bg-emerald-600 text-white'
                        : item.selectedIndex === optionIndex
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'">
                      {{ String.fromCharCode(65 + optionIndex) }}
                    </span>
                    <div class="space-y-2 flex-1">
                      <span class="block font-medium leading-relaxed">{{ option.text }}</span>
                      <img v-if="option.imageUrl" :src="option.imageUrl" :alt="`Opsi ${String.fromCharCode(65 + optionIndex)}`"
                        class="max-h-40 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
                    </div>
                    <span v-if="item.correctIndex === optionIndex"
                      class="inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Jawaban Benar
                    </span>
                  </div>
                </div>
                <p v-if="item.selectedIndex === null" class="text-sm italic text-slate-500 dark:text-slate-400">
                  Belum ada jawaban yang tersimpan untuk soal ini.
                </p>
              </div>

              <div v-else class="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {{ item.answerText || "Belum ada jawaban essay yang tersimpan." }}
              </div>
            </article>
          </div>
        </div>

        <div class="border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
          <button type="button" @click="closeAssignmentReview"
            class="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-500">
            Tutup Review
          </button>
        </div>
      </div>
    </div>

    <div v-if="!submissionTarget"
      class="min-h-screen bg-white p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">


      <main class="mx-auto mt-8">

        <section class="mb-8">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">{{ listTitle }}</h2>

          </div>

          <div
            class="flex flex-nowrap gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button v-for="item in subjects" :key="item.id" @click="selectSubject(item)"
              class="group relative flex min-w-[220px] flex-none snap-start flex-col items-start overflow-hidden rounded-2xl p-4 text-left transition-all"
              :class="selectedSubject?.id === item.id
                ? 'bg-rose-600 shadow-md ring-1 ring-rose-600 dark:bg-rose-700'
                : 'bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80'">
              <span :class="selectedSubject?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'"
                class="font-bold tracking-tight text-base">{{ item.name }}</span>
              <span :class="selectedSubject?.id === item.id ? 'text-rose-100' : 'text-slate-500 dark:text-slate-400'"
                class="mt-2 text-xs font-medium">
                Guru: {{ item.teacher_name }}
              </span>
              <div v-if="selectedSubject?.id === item.id"
                class="absolute right-5 top-5 h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              </div>
            </button>

            <div v-if="subjects.length === 0"
              class="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-8 dark:border-slate-800">
              <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada mapel terdaftar.</span>
            </div>
          </div>
        </section>

        <div>
          <div v-if="selectedSubject" class="space-y-6">
            <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
              <div class="border-b border-slate-100 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
                <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 class="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                      {{ isExamPage ? "Jadwal dan Sesi Ujian" : "Daftar Tugas Quiz" }}
                    </h3>
                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {{ isExamPage
                        ? "Periksa jadwal buka, tenggat, dan status sebelum masuk."
                        : "Pilih quiz aktif. Status dan aksi dibuat ringkas agar mudah dibaca." }}
                    </p>
                  </div>
                  <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ assignments.length }} item</p>
                </div>
              </div>

              <div class="bg-white p-4 dark:bg-slate-900">
                <div class="hidden md:block overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <thead class="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
                      <tr>
                        <th class="px-3 py-2">Quiz</th>
                        <th class="px-3 py-2">Info</th>
                        <th class="px-3 py-2">Status</th>
                        <th class="px-3 py-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="item in assignments" :key="item.id" class="align-top">
                        <td class="px-3 py-3">
                          <div class="flex flex-wrap gap-1.5">
                            <span v-if="item.is_exam" class="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20">
                              {{ examCategoryLabel(item.exam_category) }}
                            </span>
                            <span class="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                              {{ assignmentTypeLabel(item.assignment_type) }}
                            </span>
                          </div>
                          <div class="mt-2 font-semibold text-slate-900 dark:text-white">{{ item.title }}</div>
                          <div class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {{ item.description || "Tidak ada instruksi tambahan." }}
                          </div>
                        </td>
                        <td class="px-3 py-3 text-xs text-slate-500 dark:text-slate-400">
                          <div>{{ item.is_exam ? `Mulai ${formatDateTime(item.start_at)}` : assignmentDurationSummary(item) }}</div>
                          <div class="mt-1">{{ formatDateTime(item.due_date) }}</div>
                          <div v-if="item.score !== null" class="mt-2 font-semibold text-emerald-600 dark:text-emerald-300">
                            Nilai {{ item.score }} / 100
                          </div>
                        </td>
                        <td class="px-3 py-3">
                          <span class="inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] ring-1 ring-inset"
                            :class="item.score !== null
                            ? 'bg-white text-emerald-700 ring-emerald-200 dark:bg-slate-900 dark:text-emerald-300 dark:ring-emerald-500/20'
                              : item.access_blocked
                                ? 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20'
                                : item.is_submitted
                                  ? 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20'
                                  : isExamUnavailable(item)
                                    ? 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
                                    : 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20'">
                            {{ item.score !== null ? "Dinilai" : item.access_blocked ? "Kode Baru" : item.is_submitted ? "Selesai" : isExamUnavailable(item) ? "Belum Tersedia" : "Siap" }}
                          </span>
                        </td>
                        <td class="px-3 py-3 text-right">
                          <button @click="item.is_submitted ? openAssignmentReview(item) : startSubmission(item)"
                            :disabled="!item.is_submitted && isExamUnavailable(item)"
                            class="inline-flex items-center justify-center rounded-md px-2 py-1 text-[10px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                            :class="item.is_submitted
                              ? 'bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700'
                              : 'bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100'">
                            {{ item.is_submitted ? "Review" : startButtonLabel(item) }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="space-y-2 md:hidden">
                  <article v-for="item in assignments" :key="`m-${item.id}`"
                    class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all dark:bg-slate-900"
                    :class="item.is_submitted
                      ? 'border-emerald-100 bg-white dark:border-emerald-500/20 dark:bg-slate-900'
                      : item.access_blocked
                        ? 'border-amber-200 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-500/10'
                        : isExamUnavailable(item)
                          ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
                          : 'border-rose-100 bg-white dark:border-rose-500/20 dark:bg-slate-950'">
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0">
                        <div class="flex flex-wrap gap-1.5">
                          <span v-if="item.is_exam" class="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20">
                            {{ examCategoryLabel(item.exam_category) }}
                          </span>
                          <span class="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                            {{ assignmentTypeLabel(item.assignment_type) }}
                          </span>
                        </div>
                        <h4 class="mt-1 text-sm font-bold text-slate-900 dark:text-white">{{ item.title }}</h4>
                        <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {{ item.description || "Tidak ada instruksi tambahan." }}
                        </p>
                      </div>
                      <span class="inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] ring-1 ring-inset"
                        :class="item.score !== null
                          ? 'bg-white text-emerald-700 ring-emerald-200 dark:bg-slate-900 dark:text-emerald-300 dark:ring-emerald-500/20'
                          : item.access_blocked
                            ? 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20'
                            : item.is_submitted
                              ? 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20'
                              : isExamUnavailable(item)
                                ? 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
                                : 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20'">
                        {{ item.score !== null ? "Dinilai" : item.access_blocked ? "Kode Baru" : item.is_submitted ? "Selesai" : isExamUnavailable(item) ? "Belum Tersedia" : "Siap" }}
                      </span>
                    </div>
                    <div class="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{{ item.is_exam ? `Mulai ${formatDateTime(item.start_at)}` : assignmentDurationSummary(item) }}</span>
                      <span>•</span>
                      <span>{{ formatDateTime(item.due_date) }}</span>
                    </div>
                    <div class="mt-3 flex items-center justify-between gap-2">
                      <span v-if="item.score !== null" class="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                        Nilai {{ item.score }} / 100
                      </span>
                      <span v-else class="text-xs text-slate-400"></span>
                      <button @click="item.is_submitted ? openAssignmentReview(item) : startSubmission(item)"
                        :disabled="!item.is_submitted && isExamUnavailable(item)"
                        class="inline-flex items-center justify-center rounded-md px-2 py-1 text-[10px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                        :class="item.is_submitted
                          ? 'bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700'
                          : 'bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100'">
                        {{ item.is_submitted ? "Review" : startButtonLabel(item) }}
                      </button>
                    </div>
                  </article>

                  <div v-if="assignments.length === 0"
                    class="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 py-8 text-center text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
                    {{ emptyAssignmentsLabel }}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div v-else
            class="rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ workspaceTitle }}</h3>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ workspaceDescription }}</p>
          </div>
        </div>
      </main>
    </div>

    <div v-else class="bg-white p-4 pb-32 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      :class="activeSessionContainerClass" :style="activeSessionContainerStyle">

      <main class="mx-auto " :class="pseudoFullscreenActive ? 'mt-0' : 'mt-8'">
        <section
          class="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div v-if="fullscreenRecoveryRequired"
            class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-6 backdrop-blur-sm">
            <div
              class="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-900">
              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9.75 9V5.25m0 0H6m3.75 0L5.25 9m9-3.75h3.75m0 0V9m0-3.75L14.25 9M9.75 15l-4.5 4.5m0 0H9m-3.75 0v-3.75M14.25 15l4.5 4.5m0 0V15.75m0 3.75h-3.75" />
                </svg>
              </div>
              <h3 class="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Fullscreen Wajib Aktif
              </h3>
              <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {{ submissionTarget?.is_exam ? "Ujian" : "Quiz" }} dikunci sementara karena fullscreen terdeteksi
                keluar. Masuk kembali ke fullscreen untuk melanjutkan pengerjaan.
              </p>
              <div class="mt-6">
                <button type="button" @click="resumeFullscreenSession"
                  class="inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-500">
                  Kembali ke Fullscreen
                </button>
              </div>
            </div>
          </div>

          <div class="border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/20">
            <div class="flex items-center justify-between gap-3">
              <div
                class="inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
                Pelanggaran: {{ violationCount }} / {{ maxViolations }}
              </div>
              <div
                class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-slate-900 dark:text-rose-300 dark:ring-rose-500/20">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6v6l4 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formattedQuestionTimeLeft }}
              </div>
            </div>
          </div>

          <div class="p-6">

            <form @submit.prevent="requestSubmitAssignment" class="space-y-8">
              <div v-if="isExamStyleSession" class="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
                <section class="space-y-6">
                  <div class="grid gap-4 md:grid-cols-3">
                    <div
                      class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                      <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{{ sessionTypeTitle }}</p>
                      <p class="mt-2 text-lg font-black text-slate-900 dark:text-white">
                        {{ sessionTypeValue }}
                      </p>
                    </div>
                    <div
                      class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                      <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Soal Terjawab</p>
                      <p class="mt-2 text-lg font-black text-emerald-700 dark:text-emerald-300">
                        {{ answeredQuestionCount }} / {{ totalQuestions }}
                      </p>
                    </div>
                    <div
                      class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                      <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Posisi Saat Ini</p>
                      <p class="mt-2 text-lg font-black text-slate-900 dark:text-white">
                        Soal {{ activeQuestionIndex + 1 }}
                      </p>
                    </div>
                  </div>

                  <div v-if="submissionTarget.assignment_type === 'MCQ' && currentQuestion" class="space-y-6">
                    <article
                      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900">
                      <div class="flex items-start justify-between gap-4">
                        <h3 class="text-base font-bold leading-relaxed text-slate-900 dark:text-white">
                          <span
                            class="mr-3 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sm font-black text-sky-700 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20">{{
                              activeQuestionIndex + 1 }}</span>
                          {{ currentQuestionText }}
                        </h3>
                        <span
                          class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                          {{ questionAnswerStateLabel(activeQuestionIndex) }}
                        </span>
                      </div>
                      <img v-if="currentQuestionImageUrl" :src="currentQuestionImageUrl" alt="Gambar pertanyaan"
                        class="mt-4 max-h-64 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />

                      <div class="mt-6 space-y-3 pl-0 sm:pl-11">
                        <label v-for="(option, optionIndex) in currentQuestion.options || []"
                          :key="`option-${activeQuestionIndex}-${optionIndex}`"
                          class="flex cursor-pointer items-start gap-4 rounded-2xl border-2 px-5 py-4 text-sm transition-all hover:border-sky-300 hover:bg-slate-50 dark:hover:border-sky-500/40 dark:hover:bg-slate-800/50"
                          :class="currentAnswer.selected_option === optionIndex
                            ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-sm dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-100'
                            : 'border-slate-100 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                            ">
                          <div class="flex h-5 items-center">
                            <input v-model="currentAnswer.selected_option" type="radio"
                              :name="`answer-${activeQuestionIndex}`" :value="optionIndex"
                              class="h-5 w-5 cursor-pointer border-slate-300 text-sky-600 focus:ring-sky-600 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-sky-500" />
                          </div>
                          <div class="space-y-2">
                            <span class="font-medium leading-relaxed">{{ optionText(option) }}</span>
                            <img v-if="optionImageUrl(option)" :src="optionImageUrl(option)"
                              :alt="`Opsi ${String.fromCharCode(65 + optionIndex)}`"
                              class="max-h-40 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
                          </div>
                        </label>
                      </div>
                    </article>
                  </div>

                  <div v-if="submissionTarget.assignment_type === 'ESSAY' && currentQuestion" class="space-y-6">
                    <article
                      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900">
                      <div class="flex items-start justify-between gap-4">
                        <h3 class="text-base font-bold leading-relaxed text-slate-900 dark:text-white">
                          <span
                            class="mr-3 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sm font-black text-sky-700 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20">{{
                              activeQuestionIndex + 1 }}</span>
                          {{ currentQuestionText }}
                        </h3>
                        <span
                          class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                          {{ questionAnswerStateLabel(activeQuestionIndex) }}
                        </span>
                      </div>
                      <img v-if="currentQuestionImageUrl" :src="currentQuestionImageUrl" alt="Gambar pertanyaan"
                        class="mt-4 max-h-64 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />

                      <div class="mt-6 pl-0 sm:pl-11">
                        <textarea v-model="currentAnswer.answer_text" rows="7"
                          placeholder="Ketik jawaban Anda di sini..."
                          class="block w-full rounded-2xl border-0 bg-slate-50 px-5 py-4 text-base text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:bg-slate-900" />
                      </div>
                    </article>
                  </div>

                  <div class="flex flex-col gap-3 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex flex-wrap gap-3">
                      <button type="button" @click="goToPreviousQuestion" :disabled="!hasPreviousQuestion"
                        class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                        Sebelumnya
                      </button>
                      <button type="button" @click="goToNextQuestion" :disabled="isLastQuestion"
                        class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500">
                        Berikutnya
                      </button>
                    </div>
                    <button type="submit" :disabled="isSubmitting"
                      class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-60">
                      <svg v-if="isSubmitting" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"
                        stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      <span>{{ isSubmitting ? "Memproses..." : primarySubmitLabel }}</span>
                    </button>
                  </div>
                </section>

                <aside class="space-y-4">
                  <div
                    class="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/40 xl:sticky xl:top-6">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <h4 class="text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                          Navigator Soal</h4>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Hijau = sudah diisi, biru = soal aktif.
                        </p>
                      </div>
                      <div
                        class="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
                        {{ answeredQuestionCount }}/{{ totalQuestions }}
                      </div>
                    </div>

                    <div class="mt-5 grid grid-cols-5 gap-2">
                      <button v-for="(_, index) in submissionTarget.quiz_payload || []" :key="`exam-nav-${index}`"
                        type="button" @click="jumpToQuestion(index)"
                        class="flex h-11 w-full items-center justify-center rounded-xl text-sm font-black transition"
                        :class="questionPaletteClass(index)">
                        {{ index + 1 }}
                      </button>
                    </div>

                    <div class="mt-5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                      <div class="flex items-center gap-2">
                        <span class="h-3 w-3 rounded bg-sky-500"></span>
                        <span>Soal aktif</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="h-3 w-3 rounded bg-emerald-500"></span>
                        <span>Sudah diisi</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="h-3 w-3 rounded bg-slate-300 dark:bg-slate-600"></span>
                        <span>Belum diisi</span>
                      </div>
                    </div>

                    <button v-if="isError && !isSubmitting" type="button" @click="leaveFailedSession"
                      class="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                      Keluar Sementara
                    </button>
                  </div>
                </aside>
              </div>

              <template v-else>
                <div v-if="submissionTarget.assignment_type === 'MCQ' && currentQuestion" class="space-y-6">
                  <article
                    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900">
                    <h3 class="text-base font-bold leading-relaxed text-slate-900 dark:text-white">
                      <span
                        class="mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 dark:bg-slate-800">{{
                          activeQuestionIndex + 1 }}</span>
                      {{ currentQuestionText }}
                    </h3>
                    <img v-if="currentQuestionImageUrl" :src="currentQuestionImageUrl" alt="Gambar pertanyaan"
                      class="mt-4 max-h-64 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />

                    <div class="mt-6 space-y-3 pl-0 sm:pl-11">
                      <label v-for="(option, optionIndex) in currentQuestion.options || []"
                        :key="`option-${activeQuestionIndex}-${optionIndex}`"
                        class="flex cursor-pointer items-start gap-4 rounded-xl border-2 px-5 py-4 text-sm transition-all hover:border-rose-300 hover:bg-slate-50 dark:hover:border-rose-500/40 dark:hover:bg-slate-800/50"
                        :class="currentAnswer.selected_option === optionIndex
                          ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm dark:border-rose-500 dark:bg-rose-500/10 dark:text-rose-100'
                          : 'border-slate-100 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                          ">
                        <div class="flex h-5 items-center">
                          <input v-model="currentAnswer.selected_option" type="radio"
                            :name="`answer-${activeQuestionIndex}`" :value="optionIndex"
                            class="h-5 w-5 cursor-pointer border-slate-300 text-rose-600 focus:ring-rose-600 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-rose-500" />
                        </div>
                        <div class="space-y-2">
                          <span class="font-medium leading-relaxed">{{ optionText(option) }}</span>
                          <img v-if="optionImageUrl(option)" :src="optionImageUrl(option)"
                            :alt="`Opsi ${String.fromCharCode(65 + optionIndex)}`"
                            class="max-h-40 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
                        </div>
                      </label>
                    </div>
                  </article>
                </div>

                <div v-if="submissionTarget.assignment_type === 'ESSAY' && currentQuestion" class="space-y-6">
                  <article
                    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900">
                    <h3 class="text-base font-bold leading-relaxed text-slate-900 dark:text-white">
                      <span
                        class="mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 dark:bg-slate-800">{{
                          activeQuestionIndex + 1 }}</span>
                      {{ currentQuestionText }}
                    </h3>
                    <img v-if="currentQuestionImageUrl" :src="currentQuestionImageUrl" alt="Gambar pertanyaan"
                      class="mt-4 max-h-64 rounded-lg border border-slate-200 object-contain dark:border-slate-700" />

                    <div class="mt-6 pl-0 sm:pl-11">
                      <textarea v-model="currentAnswer.answer_text" rows="6" placeholder="Ketik jawaban Anda di sini..."
                        class="block w-full rounded-xl border-0 bg-slate-50 px-5 py-4 text-base text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:bg-slate-900" />
                    </div>
                  </article>
                </div>

                <div v-if="isLastQuestion" class="pb-24">
                  <button type="submit" :disabled="isSubmitting"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-500 hover:shadow-rose-600/50 disabled:opacity-60 disabled:shadow-none sm:w-auto sm:min-w-[220px]">
                    <svg v-if="isSubmitting" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"
                      stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    {{ isSubmitting ? "Memproses..." : primarySubmitLabel }}
                  </button>
                </div>

                <div
                  class="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
                  <div
                    class="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                      <button v-if="isError && !isSubmitting" type="button" @click="leaveFailedSession"
                        class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto">
                        Keluar Sementara
                      </button>
                      <button type="button" @click="goToNextQuestion"
                        class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto">
                        {{ quickAdvanceLabel }}
                      </button>
                    </div>
                  </div>
                </div>
              </template>

            </form>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { api } from "@/api";
import { formatDateTime, parseDateValue } from "@/utils/date";
import { pushToast } from "@/composables/useToast";
import { setLayoutChromeHidden } from "@/composables/useLayoutChrome";
import { useMasterDataStore } from "@/store/masterData";

const props = defineProps({
  mode: {
    type: String,
    default: "quiz",
  },
});

const subjects = ref([]);
const masterDataStore = useMasterDataStore();
const selectedSubject = ref(null);
const assignments = ref([]);
const submissionTarget = ref(null);
const isSubmitting = ref(false);
const subjectError = ref("");
const message = ref("");
const isError = ref(false);
const activeQuestionIndex = ref(0);
const questionTimeLeftMs = ref(0);
const violationCount = ref(0);
const antiCheatMessage = ref("");
const fullscreenRecoveryRequired = ref(false);
const pseudoFullscreenActive = ref(false);
const pseudoViewportHeight = ref(null);
const examCodeModalOpen = ref(false);
const confirmSubmitModalOpen = ref(false);
const pendingExamAssignmentForCode = ref(null);
const reviewTarget = ref(null);
const maxViolations = 3;
let questionTimerInterval = null;
let antiCheatListenersBound = false;
let lastViolationAt = 0;
let navigationLockBound = false;
let pseudoFullscreenViewportBound = false;
let lastViolationSignature = "";
let hiddenTransitionAt = 0;
let blurTransitionAt = 0;
let submitLockAssignmentId = null;
let examCodeModalResolver = null;

const resolveViolationType = (reason) => {
  const normalizedReason = String(reason || "").toLowerCase();
  if (normalizedReason.includes("fullscreen")) return "FULLSCREEN_EXIT";
  if (normalizedReason.includes("tab") || normalizedReason.includes("meminimalkan")) return "TAB_SWITCH";
  if (normalizedReason.includes("fokus")) return "WINDOW_BLUR";
  return "OTHER";
};

const submissionForm = reactive({
  answers: [],
});

const examCodeForm = reactive({
  code: "",
});

const isExamPage = computed(() => props.mode === "exam");
const listTitle = computed(() => (isExamPage.value ? "Pilih Mata Pelajaran Ujian" : "Pilih Mata Pelajaran"));
const pendingTitle = computed(() => (isExamPage.value ? "Ujian Resmi Belum Dikerjakan" : "Quiz Belum Dikerjakan"));
const pendingItemLabel = computed(() => (isExamPage.value ? "ujian resmi" : "quiz"));
const emptyAssignmentsLabel = computed(() => (isExamPage.value
  ? "Belum ada ujian resmi yang diterbitkan untuk mapel ini."
  : "Belum ada quiz yang ditugaskan untuk mapel ini."));
const workspaceTitle = computed(() => (isExamPage.value ? "Pusat Ujian Resmi" : "Workspace Kosong"));
const workspaceDescription = computed(() => (isExamPage.value
  ? "Silakan pilih salah satu mata pelajaran dari panel geser di atas untuk melihat daftar ujian resmi yang tersedia."
  : "Silakan pilih salah satu mata pelajaran dari panel geser di atas untuk melihat dan mengerjakan quiz."));
const sessionLabel = computed(() =>
  submissionTarget.value?.is_exam
    ? "Sesi Ujian Aktif"
    : isSessionTimedQuiz.value
      ? "Sesi Quiz Global Aktif"
      : "Sesi Quiz Aktif",
);
const progressLabel = computed(() =>
  submissionTarget.value?.is_exam
    ? "Progres Ujian"
    : isSessionTimedQuiz.value
      ? "Progres Quiz Global"
      : "Progres Quiz",
);
const primarySubmitLabel = computed(() =>
  submissionTarget.value?.is_exam
    ? "Selesai & Kirim Ujian"
    : isSessionTimedQuiz.value
      ? "Selesai & Kirim Quiz"
      : "Selesai & Kirim Quiz",
);
const quickAdvanceLabel = computed(() => (isLastQuestion.value ? "Tetap di Soal Terakhir" : "Kunci & Lanjut"));
const hasPreviousQuestion = computed(() => activeQuestionIndex.value > 0);

const gradedAssignments = computed(() => assignments.value.filter((item) => item.score !== null && item.score !== undefined).length);
const completedAssignments = computed(() => assignments.value.filter((item) => Boolean(item.submission_id)).length);
const pendingAssignments = computed(() => assignments.value.filter((item) => !item.submission_id).length);
const totalQuestions = computed(() => (submissionTarget.value?.quiz_payload || []).length);
const currentQuestion = computed(() => submissionTarget.value?.quiz_payload?.[activeQuestionIndex.value] || null);
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
  return {
    question_text: text.slice(0, markerIndex).trim(),
    question_image_url: text.slice(markerIndex + QUESTION_IMAGE_MARKER.length).trim(),
  };
};
const currentQuestionText = computed(() =>
  parseQuestionContent(currentQuestion.value?.question || currentQuestion.value?.question_text || "").question_text,
);
const currentQuestionImageUrl = computed(() =>
  parseQuestionContent(currentQuestion.value?.question || currentQuestion.value?.question_text || "").question_image_url,
);
const currentAnswer = computed(() => submissionForm.answers[activeQuestionIndex.value] || {});
const questionDurationSeconds = computed(() => Number(submissionTarget.value?.question_duration_seconds || 0));
const isSessionTimedExam = computed(() => Boolean(submissionTarget.value?.is_exam));
const isSessionTimedQuiz = computed(() => Boolean(submissionTarget.value && isGlobalTimedQuiz(submissionTarget.value)));
const isExamStyleSession = computed(() => Boolean(submissionTarget.value && isSessionTimedAssignment(submissionTarget.value)));
const sessionTypeTitle = computed(() => (submissionTarget.value?.is_exam ? "Jenis Ujian" : "Mode Quiz"));
const sessionTypeValue = computed(() =>
  submissionTarget.value?.is_exam ? examCategoryLabel(submissionTarget.value.exam_category) : "Quiz Global",
);
const questionDurationMs = computed(() => questionDurationSeconds.value * 1000);
const isLastQuestion = computed(() => activeQuestionIndex.value >= Math.max(totalQuestions.value - 1, 0));
const questionProgressPercent = computed(() => {
  const duration = questionDurationMs.value;
  if (duration <= 0) return 0;
  const percent = (questionTimeLeftMs.value / duration) * 100;
  return Math.max(0, Math.min(100, percent));
});
const formattedQuestionTimeLeft = computed(() => formatDuration(Math.ceil(questionTimeLeftMs.value / 1000)));

const isAnswerFilled = (answer, assignmentType) => {
  if (!answer) {
    return false;
  }
  if (assignmentType === "MCQ") {
    return Number.isInteger(answer.selected_option);
  }
  if (assignmentType === "ESSAY") {
    return Boolean(String(answer.answer_text || "").trim());
  }
  return false;
};

const answeredQuestionCount = computed(() =>
  submissionForm.answers.filter((answer) => isAnswerFilled(answer, submissionTarget.value?.assignment_type)).length,
);

const closeConfirmSubmitModal = () => {
  if (isSubmitting.value) {
    return;
  }
  confirmSubmitModalOpen.value = false;
};

const requestSubmitAssignment = () => {
  if (!submissionTarget.value || isSubmitting.value) {
    return;
  }
  confirmSubmitModalOpen.value = true;
};

const confirmSubmitAssignment = async () => {
  if (!submissionTarget.value || isSubmitting.value) {
    return;
  }
  confirmSubmitModalOpen.value = false;
  await submitAssignment(false);
};

const questionAnswerStateLabel = (index) =>
  isAnswerFilled(submissionForm.answers[index], submissionTarget.value?.assignment_type)
    ? "Terisi"
    : "Belum Terisi";

const questionPaletteClass = (index) => {
  if (index === activeQuestionIndex.value) {
    return "bg-sky-600 text-white shadow-sm shadow-sky-600/30";
  }
  if (isAnswerFilled(submissionForm.answers[index], submissionTarget.value?.assignment_type)) {
    return "bg-emerald-500 text-white shadow-sm shadow-emerald-600/20";
  }
  return "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800";
};

const assignmentTypeLabel = (type) => {
  if (type === "MCQ") return "Pilihan Ganda";
  if (type === "ESSAY") return "Essay";
  return "Quiz";
};

const SESSION_DURATION_MAX_MINUTES = 180;

const examCategoryLabel = (type) => {
  if (type === "UTS") return "UTS";
  if (type === "UAS") return "UAS";
  if (type === "UJIAN_SEKOLAH") return "Ujian Sekolah";
  if (type === "CUSTOM") return "Ujian Custom";
  return "Ujian";
};

const optionText = (option) => {
  if (option && typeof option === "object" && !Array.isArray(option)) {
    return String(option.text || option.label || "").trim();
  }
  return String(option || "").trim();
};

const optionImageUrl = (option) => {
  if (option && typeof option === "object" && !Array.isArray(option)) {
    return String(option.image_url || option.imageUrl || "").trim();
  }
  return "";
};

const normalizeReviewOptions = (options) =>
  safeParseJSONArray(options).map((item) => ({
    text: optionText(item),
    imageUrl: optionImageUrl(item),
  }));

const safeParseJSONArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return [];
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const normalizeAssignment = (item) => ({
  ...item,
  assignment_type: String(item?.assignment_type || "").toUpperCase(),
  question_duration_mode: String(item?.question_duration_mode || "PER_QUESTION").toUpperCase(),
  question_duration_seconds: normalizeTimedDurationSeconds(item),
  access_blocked: Boolean(item?.access_blocked),
  is_submitted: Boolean(item?.is_submitted),
  quiz_payload: safeParseJSONArray(item?.quiz_payload).map((question) => {
    const normalized = { ...(question || {}) };
    normalized.options = safeParseJSONArray(normalized.options);
    return normalized;
  }),
  answer_payload: safeParseJSONArray(item?.answer_payload),
});

const reviewItems = computed(() => {
  if (!reviewTarget.value) {
    return [];
  }

  const questions = Array.isArray(reviewTarget.value.quiz_payload) ? reviewTarget.value.quiz_payload : [];
  const answers = Array.isArray(reviewTarget.value.answer_payload) ? reviewTarget.value.answer_payload : [];

  return questions.map((question, index) => {
    const parsedQuestion = parseQuestionContent(question?.question || question?.question_text || "");
    const answer = answers[index] || {};

    if (reviewTarget.value.assignment_type === "MCQ") {
      const rawSelectedOption = answer?.selected_option;
      const selectedIndex = rawSelectedOption === null || rawSelectedOption === undefined || rawSelectedOption === ""
        ? null
        : Number.isInteger(Number(rawSelectedOption))
          ? Number(rawSelectedOption)
          : null;
      const rawCorrectOption = question?.correct_option;
      const correctIndex = rawCorrectOption === null || rawCorrectOption === undefined || rawCorrectOption === ""
        ? null
        : Number.isInteger(Number(rawCorrectOption))
          ? Number(rawCorrectOption)
          : null;

      return {
        type: "MCQ",
        question: parsedQuestion.question_text || "Soal tidak tersedia.",
        questionImageUrl: parsedQuestion.question_image_url,
        options: normalizeReviewOptions(question?.options),
        selectedIndex,
        correctIndex,
        isCorrect: selectedIndex !== null && correctIndex !== null && selectedIndex === correctIndex,
      };
    }

    return {
      type: "ESSAY",
      question: parsedQuestion.question_text || "Soal tidak tersedia.",
      questionImageUrl: parsedQuestion.question_image_url,
      answerText: String(answer?.answer_text || "").trim(),
    };
  });
});

function normalizeTimedDurationSeconds(item) {
  const rawValue = Number(item?.question_duration_seconds || 0);
  if (rawValue <= 0) {
    return 0;
  }

  const isSessionTimed = Boolean(
    item?.is_exam || String(item?.question_duration_mode || "").toUpperCase() === "GLOBAL",
  );

  if (isSessionTimed && rawValue <= SESSION_DURATION_MAX_MINUTES) {
    return rawValue * 60;
  }

  return rawValue;
}

const isExamNotStarted = (assignment) =>
  Boolean(assignment?.is_exam && assignment?.start_at && (parseDateValue(assignment.start_at)?.getTime() || 0) > Date.now());

const isExamClosed = (assignment) =>
  Boolean(assignment?.due_date && (parseDateValue(assignment.due_date)?.getTime() || 0) < Date.now());

const isExamUnavailable = (assignment) =>
  isExamNotStarted(assignment) || (!assignment?.attempt_started_at && !assignment?.is_submitted && isExamClosed(assignment));

const startButtonLabel = (assignment) => {
  if (assignment?.is_submitted) return "Review";
  if (assignment?.access_blocked) return "Kode Baru";
  if (isExamNotStarted(assignment)) return "Menunggu Jadwal";
  if (assignment?.attempt_started_at) return assignment?.is_exam ? "Lanjut" : "Lanjut";
  if (isExamClosed(assignment)) return "Tutup";
  return "Mulai";
};

const openAssignmentReview = (assignment) => {
  if (!assignment?.is_submitted) {
    return;
  }
  reviewTarget.value = assignment;
};

const closeAssignmentReview = () => {
  reviewTarget.value = null;
};

const getAttemptStorageKey = (assignmentId) => `quiz-attempt-session-${assignmentId}`;

const formatDuration = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const assignmentDurationSummary = (assignment) => {
  const totalSeconds = Number(assignment?.question_duration_seconds || 0);
  if (totalSeconds <= 0) {
    return "-";
  }

  if (assignment?.is_exam || String(assignment?.question_duration_mode || "").toUpperCase() === "GLOBAL") {
    return `Sesi ${formatDuration(totalSeconds)}`;
  }

  return `Per soal ${formatDuration(totalSeconds)}`;
};

const isGlobalTimedQuiz = (assignment) =>
  !assignment?.is_exam && String(assignment?.question_duration_mode || "").toUpperCase() === "GLOBAL";

const isSessionTimedAssignment = (assignment) => Boolean(assignment?.is_exam || isGlobalTimedQuiz(assignment));

const buildSessionExpiresAt = (startedAt, durationSeconds) => {
  const startMs = parseDateValue(startedAt)?.getTime() || 0;
  const seconds = Number(durationSeconds || 0);
  if (!Number.isFinite(startMs) || seconds <= 0) {
    return null;
  }
  return new Date(startMs + seconds * 1000).toISOString();
};

const buildInitialAnswers = (assignment) => {
  const existingAnswers = Array.isArray(assignment.answer_payload) ? assignment.answer_payload : [];

  if (assignment.assignment_type === "MCQ") {
    return (assignment.quiz_payload || []).map((_, index) => ({
      selected_option: existingAnswers[index]?.selected_option ?? null,
    }));
  }

  if (assignment.assignment_type === "ESSAY") {
    return (assignment.quiz_payload || []).map((_, index) => ({
      answer_text: existingAnswers[index]?.answer_text || "",
    }));
  }

  return [];
};

const persistAttemptSession = () => {
  if (!submissionTarget.value) return;
  const payload = {
    attempt_started_at: submissionTarget.value.attempt_started_at,
    session_started_at: submissionTarget.value.session_started_at,
    active_question_index: activeQuestionIndex.value,
    question_started_at: submissionTarget.value.current_question_started_at,
    answers: submissionForm.answers,
  };
  localStorage.setItem(getAttemptStorageKey(submissionTarget.value.id), JSON.stringify(payload));
};

const clearAttemptSession = (assignmentId) => {
  localStorage.removeItem(getAttemptStorageKey(assignmentId));
};

const resetAntiCheatState = () => {
  violationCount.value = 0;
  antiCheatMessage.value = "";
  fullscreenRecoveryRequired.value = false;
  lastViolationAt = 0;
  lastViolationSignature = "";
  hiddenTransitionAt = 0;
  blurTransitionAt = 0;
};

const syncAntiCheatStateFromSession = (startPayload = {}) => {
  const storedViolationCount = Number(startPayload?.violation_count);
  violationCount.value = Number.isFinite(storedViolationCount) && storedViolationCount >= 0
    ? storedViolationCount
    : 0;

  if (startPayload?.access_blocked) {
    fullscreenRecoveryRequired.value = true;
  }
};

const handleLockedNavigationAttempt = () => {
  if (!submissionTarget.value) {
    return;
  }

  window.history.pushState(null, "", window.location.href);
  pushToast({
    title: submissionTarget.value.is_exam ? "Ujian Sedang Berjalan" : "Quiz Sedang Berjalan",
    message: "Navigasi ke halaman lain dinonaktifkan sampai pengerjaan selesai.",
    type: "error",
    duration: 3200,
  });
};

const bindLockedNavigation = () => {
  if (navigationLockBound || typeof window === "undefined") {
    return;
  }

  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", handleLockedNavigationAttempt);
  navigationLockBound = true;
};

const unbindLockedNavigation = () => {
  if (!navigationLockBound || typeof window === "undefined") {
    return;
  }

  window.removeEventListener("popstate", handleLockedNavigationAttempt);
  navigationLockBound = false;
};

const isIosDevice = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
};

const supportsNativeFullscreen = () => {
  if (typeof document === "undefined") {
    return false;
  }

  return Boolean(document.documentElement?.requestFullscreen);
};

const shouldUsePseudoFullscreen = () => isIosDevice() || !supportsNativeFullscreen();

const syncPseudoViewportHeight = () => {
  if (typeof window === "undefined") {
    return;
  }

  pseudoViewportHeight.value = Math.round(window.visualViewport?.height || window.innerHeight || 0);
};

const bindPseudoFullscreenViewport = () => {
  if (pseudoFullscreenViewportBound || typeof window === "undefined") {
    return;
  }

  syncPseudoViewportHeight();
  window.addEventListener("resize", syncPseudoViewportHeight);
  window.visualViewport?.addEventListener("resize", syncPseudoViewportHeight);
  pseudoFullscreenViewportBound = true;
};

const unbindPseudoFullscreenViewport = () => {
  if (!pseudoFullscreenViewportBound || typeof window === "undefined") {
    return;
  }

  window.removeEventListener("resize", syncPseudoViewportHeight);
  window.visualViewport?.removeEventListener("resize", syncPseudoViewportHeight);
  pseudoFullscreenViewportBound = false;
};

const activatePseudoFullscreen = () => {
  pseudoFullscreenActive.value = true;
  bindPseudoFullscreenViewport();
  antiCheatMessage.value = "";
  fullscreenRecoveryRequired.value = false;
};

const deactivatePseudoFullscreen = () => {
  pseudoFullscreenActive.value = false;
  pseudoViewportHeight.value = null;
  unbindPseudoFullscreenViewport();
};

const activeSessionContainerClass = computed(() => (
  pseudoFullscreenActive.value
    ? "fixed inset-0 z-40 overflow-y-auto overscroll-contain p-3 pb-32 md:p-6"
    : "min-h-screen md:p-8"
));

const activeSessionContainerStyle = computed(() => {
  if (!pseudoFullscreenActive.value) {
    return undefined;
  }

  return pseudoViewportHeight.value
    ? { minHeight: `${pseudoViewportHeight.value}px`, height: `${pseudoViewportHeight.value}px` }
    : { minHeight: "100dvh", height: "100dvh" };
});

const requestQuizFullscreen = async () => {
  if (typeof document === "undefined") {
    return false;
  }

  if (document.fullscreenElement || pseudoFullscreenActive.value) {
    fullscreenRecoveryRequired.value = false;
    return true;
  }

  if (shouldUsePseudoFullscreen()) {
    activatePseudoFullscreen();
    return true;
  }

  const element = document.documentElement;
  if (!element?.requestFullscreen) {
    antiCheatMessage.value = "Browser ini tidak mendukung mode fullscreen untuk sesi pengerjaan.";
    return false;
  }

  try {
    await element.requestFullscreen();
    fullscreenRecoveryRequired.value = false;
    antiCheatMessage.value = "";
    return true;
  } catch (error) {
    antiCheatMessage.value = "Fullscreen wajib diaktifkan sebelum sesi bisa dilanjutkan.";
    return false;
  }
};

const exitQuizFullscreen = async () => {
  deactivatePseudoFullscreen();

  if (typeof document === "undefined" || !document.fullscreenElement || !document.exitFullscreen) {
    return;
  }

  try {
    await document.exitFullscreen();
  } catch (error) {
    // Ignore fullscreen exit errors.
  }
};

const recordViolation = async (reason, signature = reason) => {
  if (!submissionTarget.value) {
    return;
  }

  const now = Date.now();
  if (now - lastViolationAt < 2200 && signature === lastViolationSignature) {
    return;
  }

  if (now - lastViolationAt < 900) {
    return;
  }

  lastViolationAt = now;
  lastViolationSignature = signature;
  violationCount.value += 1;
  antiCheatMessage.value = reason;

  try {
    const response = await api.post(`/learning/assignments/${submissionTarget.value.id}/violations`, {
      violation_type: resolveViolationType(reason),
      violation_message: reason,
      answers: JSON.stringify(submissionForm.answers),
    });

    if (response?.data?.access_blocked && submissionTarget.value?.is_exam) {
      antiCheatMessage.value = "Akses ujian dihentikan sementara. Kode baru dari admin diperlukan untuk melanjutkan.";
      stopQuestionTimer();
      await pauseBlockedExamSession();
      return;
    }
  } catch (error) {
    // Keep the quiz flow running even when the violation log cannot be sent.
  }

  if (violationCount.value >= maxViolations) {
    if (submissionTarget.value?.is_exam) {
      antiCheatMessage.value = "Batas pelanggaran ujian resmi tercapai. Menunggu kode baru dari admin untuk melanjutkan.";
      return;
    }
    antiCheatMessage.value = `Batas pelanggaran tercapai. ${submissionTarget.value?.is_exam ? "Ujian" : "Quiz"} akan dikirim otomatis.`;
    stopQuestionTimer();
    await submitAssignment(true);
    return;
  }

  window.setTimeout(() => {
    if (submissionTarget.value) {
      requestQuizFullscreen();
    }
  }, 250);
};

const handleQuizVisibilityChange = async () => {
  if (!submissionTarget.value) {
    return;
  }

  if (document.visibilityState === "hidden") {
    hiddenTransitionAt = Date.now();
    await recordViolation(
      "Terdeteksi berpindah tab atau meminimalkan aplikasi.",
      "TAB_HIDDEN",
    );
    return;
  }

  hiddenTransitionAt = 0;
};

const handleQuizWindowBlur = async () => {
  if (!submissionTarget.value) {
    return;
  }

  blurTransitionAt = Date.now();

  if (document.visibilityState === "hidden") {
    return;
  }

  await recordViolation(
    "Terdeteksi berpindah fokus dari halaman quiz.",
    "WINDOW_BLUR",
  );
};

const handleQuizWindowFocus = () => {
  blurTransitionAt = 0;
  if (document.visibilityState === "visible") {
    hiddenTransitionAt = 0;
  }
};

const handleQuizFullscreenChange = async () => {
  if (!submissionTarget.value || document.fullscreenElement || pseudoFullscreenActive.value) {
    return;
  }

  const now = Date.now();
  if (document.visibilityState === "hidden") {
    return;
  }

  if ((hiddenTransitionAt && now - hiddenTransitionAt < 2200) || (blurTransitionAt && now - blurTransitionAt < 2200)) {
    return;
  }

  fullscreenRecoveryRequired.value = true;
  await recordViolation(
    "Terdeteksi keluar dari mode fullscreen.",
    "FULLSCREEN_EXIT",
  );
};

const bindAntiCheatListeners = () => {
  if (antiCheatListenersBound || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  document.addEventListener("visibilitychange", handleQuizVisibilityChange);
  window.addEventListener("blur", handleQuizWindowBlur);
  window.addEventListener("focus", handleQuizWindowFocus);
  document.addEventListener("fullscreenchange", handleQuizFullscreenChange);
  antiCheatListenersBound = true;
};

const unbindAntiCheatListeners = () => {
  if (!antiCheatListenersBound || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  document.removeEventListener("visibilitychange", handleQuizVisibilityChange);
  window.removeEventListener("blur", handleQuizWindowBlur);
  window.removeEventListener("focus", handleQuizWindowFocus);
  document.removeEventListener("fullscreenchange", handleQuizFullscreenChange);
  antiCheatListenersBound = false;
};

const stopQuestionTimer = () => {
  if (questionTimerInterval) {
    clearInterval(questionTimerInterval);
    questionTimerInterval = null;
  }
};

const getStoredAttemptSession = (assignment) => {
  try {
    const raw = localStorage.getItem(getAttemptStorageKey(assignment.id));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.attempt_started_at !== assignment.attempt_started_at) {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
};

const syncAttemptProgressWithClock = () => {
  if (!submissionTarget.value || questionDurationMs.value <= 0 || isSessionTimedAssignment(submissionTarget.value)) return false;

  let finished = false;
  while (
    submissionTarget.value.current_question_started_at
    && activeQuestionIndex.value < totalQuestions.value
    && (parseDateValue(submissionTarget.value.current_question_started_at)?.getTime() || 0) + questionDurationMs.value <= Date.now()
  ) {
    if (activeQuestionIndex.value >= totalQuestions.value - 1) {
      finished = true;
      break;
    }

    activeQuestionIndex.value += 1;
    submissionTarget.value.current_question_started_at = new Date(
      (parseDateValue(submissionTarget.value.current_question_started_at)?.getTime() || Date.now()) + questionDurationMs.value,
    ).toISOString();
  }

  persistAttemptSession();
  return finished;
};

const refreshQuestionTimer = () => {
  if (!submissionTarget.value || questionDurationMs.value <= 0) {
    questionTimeLeftMs.value = 0;
    return;
  }

  const referenceTime = isSessionTimedAssignment(submissionTarget.value)
    ? submissionTarget.value.session_started_at
    : submissionTarget.value.current_question_started_at;

  if (!referenceTime) {
    questionTimeLeftMs.value = 0;
    return;
  }

  const endTime = (parseDateValue(referenceTime)?.getTime() || 0) + questionDurationMs.value;
  questionTimeLeftMs.value = Math.max(0, endTime - Date.now());
};

const startQuestionTimer = () => {
  stopQuestionTimer();
  refreshQuestionTimer();
  questionTimerInterval = window.setInterval(async () => {
    const isFinished = syncAttemptProgressWithClock();
    refreshQuestionTimer();
    if (isFinished) {
      stopQuestionTimer();
      await submitAssignment(true);
      return;
    }

    if (questionTimeLeftMs.value <= 0) {
      if (isSessionTimedAssignment(submissionTarget.value)) {
        stopQuestionTimer();
        await submitAssignment(true);
        return;
      }

      await goToNextQuestion(true);
    }
  }, 250);
};

const initializeAttemptSession = (assignment, startPayload) => {
  resetAntiCheatState();
  setLayoutChromeHidden(true);
  const attemptStartedAt = startPayload?.started_at || assignment.attempt_started_at || new Date().toISOString();
  const localQuestionStartedAt = new Date().toISOString();
  const questionDurationMode = String(startPayload?.question_duration_mode || assignment.question_duration_mode || "PER_QUESTION").toUpperCase();
  const questionDurationValue = normalizeTimedDurationSeconds({
    is_exam: assignment.is_exam,
    question_duration_mode: questionDurationMode,
    question_duration_seconds: startPayload?.question_duration_seconds ?? assignment.question_duration_seconds ?? 0,
  });
  submissionTarget.value = {
    ...assignment,
    question_duration_mode: questionDurationMode,
    question_duration_seconds: questionDurationValue,
    expires_at: (assignment.is_exam || questionDurationMode === "GLOBAL")
      ? buildSessionExpiresAt(attemptStartedAt, questionDurationValue)
      : null,
    attempt_started_at: attemptStartedAt,
    session_started_at: attemptStartedAt,
    current_question_started_at: localQuestionStartedAt,
  };

  const storedSession = getStoredAttemptSession(submissionTarget.value);
  submissionForm.answers = storedSession?.answers?.length
    ? storedSession.answers
    : buildInitialAnswers(submissionTarget.value);

  activeQuestionIndex.value = Number.isInteger(storedSession?.active_question_index)
    ? storedSession.active_question_index
    : 0;

  submissionTarget.value.session_started_at = isSessionTimedAssignment(submissionTarget.value)
    ? attemptStartedAt
    : storedSession?.session_started_at || localQuestionStartedAt;
  submissionTarget.value.current_question_started_at = storedSession?.question_started_at || localQuestionStartedAt;
  syncAntiCheatStateFromSession(startPayload);

  const isFinished = syncAttemptProgressWithClock();
  refreshQuestionTimer();
  persistAttemptSession();

  if (isFinished) {
    submitAssignment(true);
    return;
  }

  bindLockedNavigation();
  bindAntiCheatListeners();
  startQuestionTimer();
};

const loadSubjects = async () => {
  subjectError.value = "";
  try {
    subjects.value = await masterDataStore.getStudentSubjects();
    if (!selectedSubject.value && subjects.value.length > 0) {
      await selectSubject(subjects.value[0]);
    }
  } catch (error) {
    subjectError.value = error.message;
  }
};

const loadSubjectData = async () => {
  if (!selectedSubject.value) return;
  const response = await api.get(`/learning/subjects/${selectedSubject.value.id}/assignments`);
  assignments.value = (response?.data || []).map(normalizeAssignment).filter((item) => {
    if (item.assignment_type !== "MCQ" && item.assignment_type !== "ESSAY") {
      return false;
    }

    return isExamPage.value ? Boolean(item.is_exam) : !item.is_exam;
  });
};

const selectSubject = async (subject) => {
  selectedSubject.value = subject;
  stopQuestionTimer();
  unbindLockedNavigation();
  unbindAntiCheatListeners();
  deactivatePseudoFullscreen();
  setLayoutChromeHidden(false);
  submissionTarget.value = null;
  submissionForm.answers = [];
  resetAntiCheatState();
  closeAssignmentReview();
  message.value = "";
  await loadSubjectData();
};

const closeExamCodeModal = (value = null) => {
  examCodeModalOpen.value = false;
  pendingExamAssignmentForCode.value = null;
  examCodeForm.code = "";
  if (typeof examCodeModalResolver === "function") {
    examCodeModalResolver(value);
    examCodeModalResolver = null;
  }
};

const requestExamCode = (assignment) =>
  new Promise((resolve) => {
    pendingExamAssignmentForCode.value = assignment;
    examCodeForm.code = "";
    examCodeModalResolver = resolve;
    examCodeModalOpen.value = true;
  });

const confirmExamCodeModal = () => {
  const code = String(examCodeForm.code || "").trim();
  if (!code) {
    pushToast({
      title: "Kode Ujian Wajib Diisi",
      message: "Masukkan kode ujian terlebih dahulu untuk memulai sesi.",
      type: "error",
      duration: 2800,
    });
    return;
  }
  closeExamCodeModal(code);
};

const cancelExamCodeModal = () => {
  closeExamCodeModal(null);
};

const startSubmission = async (assignment) => {
  if (assignment.is_submitted) {
    return;
  }

  try {
    message.value = "";
    isError.value = false;
    const fullscreenReady = await requestQuizFullscreen();
    if (!fullscreenReady) {
      pushToast({
        title: "Fullscreen Wajib Aktif",
        message: `Aktifkan fullscreen terlebih dahulu sebelum memulai ${assignment.is_exam ? "ujian" : "quiz"}. Jika memakai iPhone, gunakan Safari terbaru lalu mulai ulang sesi.`,
        type: "error",
        duration: 3600,
      });
      return;
    }

    let payload = {};
    if (assignment.is_exam) {
      const examCode = await requestExamCode(assignment);
      if (examCode === null) {
        await exitQuizFullscreen();
        return;
      }
      payload = { exam_code: examCode };
    }

    const response = await api.post(`/learning/assignments/${assignment.id}/start`, payload);
    initializeAttemptSession(assignment, response?.data || {});
    window.scrollTo(0, 0);
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    await exitQuizFullscreen();
  }
};

const resumeFullscreenSession = async () => {
  const fullscreenReady = await requestQuizFullscreen();
  if (!fullscreenReady) {
    pushToast({
      title: "Fullscreen Masih Belum Aktif",
      message: "Izinkan mode fullscreen untuk melanjutkan sesi pengerjaan. Di iPhone, sistem akan memakai mode fokus otomatis bila fullscreen native tidak tersedia.",
      type: "error",
      duration: 3200,
    });
    return;
  }

  fullscreenRecoveryRequired.value = false;
};

const goToNextQuestion = async (triggeredByTimer = false) => {
  if (!submissionTarget.value) return;

  if (isLastQuestion.value) {
    await submitAssignment(triggeredByTimer);
    return;
  }

  activeQuestionIndex.value += 1;
  submissionTarget.value.current_question_started_at = new Date().toISOString();
  persistAttemptSession();
  refreshQuestionTimer();
};

const goToPreviousQuestion = () => {
  if (!submissionTarget.value || activeQuestionIndex.value <= 0) {
    return;
  }

  activeQuestionIndex.value -= 1;
  if (!isSessionTimedAssignment(submissionTarget.value)) {
    submissionTarget.value.current_question_started_at = new Date().toISOString();
  }
  persistAttemptSession();
  refreshQuestionTimer();
};

const jumpToQuestion = (index) => {
  if (!submissionTarget.value) {
    return;
  }

  const safeIndex = Number(index);
  if (!Number.isInteger(safeIndex) || safeIndex < 0 || safeIndex >= totalQuestions.value) {
    return;
  }

  activeQuestionIndex.value = safeIndex;
  if (!isSessionTimedAssignment(submissionTarget.value)) {
    submissionTarget.value.current_question_started_at = new Date().toISOString();
  }
  persistAttemptSession();
  refreshQuestionTimer();
};

const teardownActiveSessionGuards = () => {
  stopQuestionTimer();
  unbindLockedNavigation();
  unbindAntiCheatListeners();
};

const leaveFailedSession = async () => {
  if (!submissionTarget.value || isSubmitting.value) {
    return;
  }

  const target = submissionTarget.value;
  teardownActiveSessionGuards();
  await exitQuizFullscreen();
  setLayoutChromeHidden(false);
  submissionTarget.value = null;
  resetAntiCheatState();
  await loadSubjectData();
  pushToast({
    title: `${target.is_exam ? "Ujian" : "Quiz"} Disimpan Sementara`,
    message: "Sesi ditutup sementara. Jawaban lokal tetap tersimpan dan bisa dilanjutkan lagi dari daftar tugas.",
    type: "info",
    duration: 4200,
  });
};

const pauseBlockedExamSession = async () => {
  if (!submissionTarget.value) {
    return;
  }

  const target = submissionTarget.value;
  persistAttemptSession();
  teardownActiveSessionGuards();
  await exitQuizFullscreen();
  setLayoutChromeHidden(false);
  submissionTarget.value = null;
  resetAntiCheatState();
  await loadSubjectData();
  pushToast({
    title: "Kode Baru Diperlukan",
    message: `Batas pelanggaran ${target.is_exam ? "ujian" : "quiz"} resmi tercapai. Minta admin membuat kode baru untuk melanjutkan sesi.`,
    type: "error",
    duration: 5200,
  });
  window.scrollTo(0, 0);
};

const completeSubmittedSession = async (target, triggeredAutomatically, toastType = triggeredAutomatically ? "info" : "success") => {
  teardownActiveSessionGuards();
  await exitQuizFullscreen();
  confirmSubmitModalOpen.value = false;
  clearAttemptSession(target.id);
  pushToast({
    title: triggeredAutomatically
      ? `${target.is_exam ? "Ujian" : "Quiz"} Terkirim Otomatis`
      : `${target.is_exam ? "Ujian" : "Quiz"} Berhasil Dikirim`,
    message: triggeredAutomatically
      ? `Waktu ${target.is_exam ? "ujian" : "quiz"} habis. Jawaban yang sempat tersimpan sudah dikirim otomatis.`
      : "Jawaban sudah dikunci dan tidak dapat diubah.",
    type: toastType,
    duration: 4200,
  });

  setLayoutChromeHidden(false);
  submissionTarget.value = null;
  submissionForm.answers = [];
  closeAssignmentReview();
  resetAntiCheatState();
  await loadSubjectData();
  window.scrollTo(0, 0);
};

const submitAssignment = async (triggeredAutomatically = false) => {
  if (!submissionTarget.value) return;

  const target = submissionTarget.value;
  if (isSubmitting.value || submitLockAssignmentId === target.id) {
    return;
  }

  if (triggeredAutomatically) {
    confirmSubmitModalOpen.value = false;
  }

  submitLockAssignmentId = target.id;
  isSubmitting.value = true;
  message.value = "";
  isError.value = false;
  teardownActiveSessionGuards();

  try {
    const formData = new FormData();
    formData.append("submission_text", "");
    formData.append("answers", JSON.stringify(submissionForm.answers));
    await api.post(`/learning/assignments/${target.id}/submit`, formData);
    await completeSubmittedSession(target, triggeredAutomatically);

  } catch (error) {
    const normalizedMessage = String(error?.message || "");
    if (/already been submitted/i.test(normalizedMessage)) {
      await completeSubmittedSession(target, triggeredAutomatically);
      return;
    }

    isError.value = true;
    message.value = normalizedMessage;
    if (submissionTarget.value?.id === target.id) {
      bindLockedNavigation();
      bindAntiCheatListeners();
      if (!questionTimerInterval) {
        startQuestionTimer();
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    isSubmitting.value = false;
    if (submitLockAssignmentId === target.id) {
      submitLockAssignmentId = null;
    }
  }
};

onUnmounted(() => {
  stopQuestionTimer();
  unbindLockedNavigation();
  unbindAntiCheatListeners();
  setLayoutChromeHidden(false);
});

onBeforeRouteLeave(() => {
  if (!submissionTarget.value) {
    return true;
  }

  pushToast({
    title: submissionTarget.value.is_exam ? "Ujian Sedang Berjalan" : "Quiz Sedang Berjalan",
    message: "Selesaikan sesi ini terlebih dahulu sebelum membuka halaman lain.",
    type: "error",
    duration: 3200,
  });
  return false;
});

watch(subjectError, (value) => {
  if (!value) return;
  pushToast({
    title: "Gagal Memuat Quiz",
    message: value,
    type: "error",
  });
});

watch(message, (value) => {
  if (!value) return;
  pushToast({
    title: isError.value
      ? `Aksi ${submissionTarget.value?.is_exam ? "Ujian" : "Quiz"} Gagal`
      : `Aksi ${submissionTarget.value?.is_exam ? "Ujian" : "Quiz"} Berhasil`,
    message: value,
    type: isError.value ? "error" : "success",
  });
});

watch(
  () => submissionForm.answers,
  () => {
    persistAttemptSession();
  },
  { deep: true },
);

onMounted(loadSubjects);
</script>
