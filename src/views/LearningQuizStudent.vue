<template>
  <div>
    <div v-if="!submissionTarget"
      class="min-h-screen bg-slate-50/50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">


      <main class="mx-auto mt-8 max-w-[1440px]">

        <section class="mb-8">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">{{ listTitle }}</h2>

          </div>

          <div
            class="flex flex-nowrap gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button v-for="item in subjects" :key="item.id" @click="selectSubject(item)"
              class="group relative flex min-w-[260px] flex-none snap-start flex-col items-start overflow-hidden rounded-2xl p-5 text-left transition-all"
              :class="selectedSubject?.id === item.id
                ? 'bg-rose-600 shadow-md ring-1 ring-rose-600 dark:bg-rose-700'
                : 'bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80'">
              <span :class="selectedSubject?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'"
                class="font-bold tracking-tight text-lg">{{ item.name }}</span>
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




            <section
              class="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
              <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800 md:px-8">
                <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                      {{ isExamPage ? "Jadwal dan Sesi Ujian" : "Daftar Tugas Quiz" }}
                    </h3>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {{ isExamPage
                        ? "Periksa jadwal buka, tenggat, dan status pengerjaan sebelum masuk ke sesi ujian."
                        : `Pilih quiz yang masih aktif. Setiap kartu menampilkan status, tenggat, dan hasil jika sudah
                      dinilai.` }}
                    </p>
                  </div>
                  <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {{ assignments.length }} item
                  </p>
                </div>
              </div>

              <div class="p-6 md:p-8">
                <div class="grid gap-5 xl:grid-cols-2">
                  <article v-for="item in assignments" :key="item.id"
                    class="group relative overflow-hidden rounded-[28px] border p-5 shadow-sm transition-all dark:bg-slate-900"
                    :class="item.submission_id
                      ? 'border-emerald-100 bg-emerald-50/50 hover:border-emerald-200 dark:border-emerald-500/20 dark:bg-emerald-500/5'
                      : isExamUnavailable(item)
                        ? 'border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/50'
                        : 'border-rose-100 bg-white hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md dark:border-rose-500/20 dark:bg-slate-950 dark:hover:border-rose-500/40'">
                    <div
                      class="absolute right-0 top-0 h-24 w-24 rounded-full bg-rose-100/70 blur-2xl transition dark:bg-rose-500/10"
                      :class="item.submission_id ? 'bg-emerald-100/70 dark:bg-emerald-500/10' : ''"></div>

                    <div class="relative flex h-full flex-col gap-5">
                      <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="flex flex-wrap items-center gap-2">
                          <span v-if="item.is_exam"
                            class="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20">
                            {{ examCategoryLabel(item.exam_category) }}
                          </span>
                          <span
                            class="inline-flex rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                            {{ assignmentTypeLabel(item.assignment_type) }}
                          </span>
                        </div>

                        <span
                          class="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ring-1 ring-inset"
                          :class="item.score !== null
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
                            : item.submission_id
                              ? 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20'
                              : isExamUnavailable(item)
                                ? 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
                                : 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20'">
                          {{ item.score !== null ? "Sudah Dinilai" : item.submission_id ? "Selesai" :
                            isExamUnavailable(item) ? "Belum Tersedia" : "Siap Dikerjakan" }}
                        </span>
                      </div>

                      <div>
                        <h4 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">{{ item.title }}
                        </h4>
                        <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          {{ item.description || "Tidak ada instruksi tambahan." }}
                        </p>
                      </div>

                      <div class="grid gap-3 sm:grid-cols-2">
                        <div class="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Tenggat</p>
                          <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{{
                            formatDateTime(item.due_date) }}</p>
                        </div>
                        <div class="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            {{ item.is_exam ? "Jadwal Mulai" : "Durasi" }}
                          </p>
                          <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {{ item.is_exam
                              ? formatDateTime(item.start_at)
                              : assignmentDurationSummary(item) }}
                          </p>
                        </div>
                      </div>

                      <div v-if="item.score !== null || item.feedback"
                        class="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
                        <div class="flex flex-wrap items-center gap-3">
                          <p v-if="item.score !== null"
                            class="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                            Nilai: {{ item.score }} / 100
                          </p>
                          <p v-if="item.feedback" class="text-sm text-slate-600 dark:text-slate-300">
                            <span class="font-bold text-slate-900 dark:text-white">Catatan Guru:</span> {{ item.feedback
                            }}
                          </p>
                        </div>
                      </div>

                      <div class="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div class="text-sm text-slate-500 dark:text-slate-400">
                          {{ item.attempt_started_at && !item.submission_id
                            ? `${item.is_exam ? "Sesi ujian" : "Sesi quiz"} masih aktif di perangkat ini.`
                            : item.submission_id
                              ? `${item.is_exam ? "Ujian" : "Quiz"} sudah dikirim.`
                              : isExamUnavailable(item)
                                ? "Belum bisa dibuka sesuai jadwal."
                                : `${item.is_exam ? "Ujian" : "Quiz"} siap dikerjakan sekarang.` }}
                        </div>

                        <button @click="startSubmission(item)"
                          :disabled="Boolean(item.submission_id) || isExamUnavailable(item)"
                          class="inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                          :class="item.submission_id
                            ? 'bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-700'
                            : 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-rose-600 dark:bg-white dark:text-slate-900 dark:hover:bg-rose-200'">
                          {{ startButtonLabel(item) }}
                        </button>
                      </div>
                    </div>
                  </article>
                </div>

                <div v-if="assignments.length === 0"
                  class="rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50/60 py-20 text-center text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
                  {{ emptyAssignmentsLabel }}
                </div>
              </div>
            </section>
          </div>

          <div v-else
            class="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <div class="rounded-full bg-rose-50 p-5 dark:bg-rose-500/10">
              <svg class="h-10 w-10 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 class="mt-5 text-xl font-bold text-slate-900 dark:text-white">{{ workspaceTitle }}</h3>
            <p class="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{{ workspaceDescription }}</p>
          </div>
        </div>
      </main>
    </div>

    <div v-else
      class="bg-slate-50/50 p-4 pb-32 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      :class="activeSessionContainerClass" :style="activeSessionContainerStyle">

      <main class="mx-auto max-w-[1440px]" :class="pseudoFullscreenActive ? 'mt-0' : 'mt-8'">
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

          <div class="border-b border-slate-100 bg-slate-50/50 px-6 py-6 dark:border-slate-800 dark:bg-slate-800/20">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="flex items-start gap-4">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="inline-flex rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                      {{ assignmentTypeLabel(submissionTarget.assignment_type) }}
                    </span>
                    <span
                      class="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tenggat: {{ formatDateTime(submissionTarget.due_date) }}
                    </span>
                  </div>

                  <h1 class="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{{
                    submissionTarget.title }}</h1>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {{ selectedSubject.name }} &bull; {{ selectedSubject.class_name }}
                  </p>
                  <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {{ submissionTarget.description || (submissionTarget.is_exam
                      ? "Kerjakan ujian dengan tenang. Sesi tetap berjalan sampai seluruh jawaban dikirim."
                      : "Kerjakan quiz dengan tenang. Setiap soal memiliki timer yang berjalan otomatis.") }}
                  </p>
                  <div v-if="pseudoFullscreenActive"
                    class="mt-4 inline-flex max-w-xl rounded-2xl bg-sky-50 px-4 py-3 text-xs font-semibold text-sky-800 ring-1 ring-inset ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/20">
                    Mode fokus iPhone aktif. Safari iOS tidak mendukung fullscreen penuh untuk halaman web biasa, jadi sesi ini dikunci dalam tampilan layar-penuh semu.
                  </div>
                </div>
              </div>

              <div
                class="inline-flex self-start rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
                {{ sessionLabel }}
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.2fr),320px]">
              <div
                class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                <div class="flex items-start gap-3">
                  <svg class="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <strong class="font-bold">Perhatian!</strong> Timer tetap berjalan selama sesi aktif. Saat waktu
                    {{ submissionTarget.is_exam
                      ? 'ujian resmi habis, seluruh jawaban akan langsung dikirim otomatis.'
                      : 'satu soal habis, jawaban soal itu langsung terkunci dan sistem pindah ke soal berikutnya.' }}
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border p-4 text-sm font-medium"
                :class="violationCount > 0
                  ? 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300'
                  : 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300'">
                <div class="flex items-start gap-3">
                  <svg class="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M3 13.5l6.75 6.75L21 9" />
                  </svg>
                  <div>
                    <strong class="font-bold">{{ submissionTarget.is_exam ? "Mode Ujian Aktif." : "Mode Quiz Aktif."
                    }}</strong>
                    {{ pseudoFullscreenActive
                      ? "Tetap di tab ini. iPhone memakai mode fokus karena Safari tidak mendukung fullscreen penuh untuk halaman quiz."
                      : "Tetap di tab ini dan gunakan mode fullscreen selama sesi berlangsung." }}
                    <div class="mt-2">
                      Pelanggaran terdeteksi:
                      <span class="font-bold">{{ violationCount }}</span> / {{ maxViolations }}
                    </div>
                    <div v-if="antiCheatMessage" class="mt-1 text-xs font-semibold">
                      {{ antiCheatMessage }}
                    </div>
                  </div>
                </div>
              </div>

              <aside
                class="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/40">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {{ progressLabel }}</p>
                    <p class="mt-1 text-lg font-bold text-slate-900 dark:text-white">Soal {{ activeQuestionIndex + 1 }}
                      / {{ totalQuestions }}</p>
                  </div>
                  <div
                    class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-slate-900 dark:text-rose-300 dark:ring-rose-500/20">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 6v6l4 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formattedQuestionTimeLeft }}
                  </div>
                </div>

                <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {{ submissionTarget.is_exam
                    ? `Durasi sesi ujian ${formatDuration(questionDurationSeconds)}.`
                    : `Durasi per soal ${formatDuration(questionDurationSeconds)}.` }}
                </p>

                <div
                  class="mt-4 h-3 overflow-hidden rounded-full bg-white ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                  <div class="h-full rounded-full bg-rose-500 transition-[width] duration-1000"
                    :style="{ width: `${questionProgressPercent}%` }"></div>
                </div>
              </aside>
            </div>

            <form @submit.prevent="submitAssignment" class="space-y-8">

              <div v-if="submissionTarget.assignment_type === 'MCQ' && currentQuestion" class="space-y-6">
                <article
                  class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900">
                  <h3 class="text-base font-bold leading-relaxed text-slate-900 dark:text-white">
                    <span
                      class="mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 dark:bg-slate-800">{{
                        activeQuestionIndex + 1 }}</span>
                    {{ currentQuestion.question }}
                  </h3>

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
                      <span class="font-medium leading-relaxed">{{ option }}</span>
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
                    {{ currentQuestion.question }}
                  </h3>

                  <div class="mt-6 pl-0 sm:pl-11">
                    <textarea v-model="currentAnswer.answer_text" rows="6" placeholder="Ketik jawaban Anda di sini..."
                      class="block w-full rounded-xl border-0 bg-slate-50 px-5 py-4 text-base text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-rose-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:bg-slate-900" />
                  </div>
                </article>
              </div>

              <div
                class="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
                <div class="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span class="text-xs font-medium text-slate-500 sm:text-sm">Jawaban pada soal sebelumnya langsung
                    terkunci saat Anda pindah soal atau waktu habis.</span>
                  <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <button type="button" @click="goToNextQuestion"
                      class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto">
                      {{ quickAdvanceLabel }}
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                      class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-500 hover:shadow-rose-600/50 disabled:opacity-60 disabled:shadow-none sm:w-auto sm:min-w-[200px]">
                      <svg v-if="isSubmitting" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"
                        stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                      {{ isSubmitting ? "Memproses..." : primarySubmitLabel }}
                    </button>
                  </div>
                </div>
              </div>

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
import { formatDateTime } from "@/utils/date";
import { pushToast } from "@/composables/useToast";
import { setLayoutChromeHidden } from "@/composables/useLayoutChrome";

const props = defineProps({
  mode: {
    type: String,
    default: "quiz",
  },
});

const subjects = ref([]);
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
const maxViolations = 3;
let questionTimerInterval = null;
let antiCheatListenersBound = false;
let lastViolationAt = 0;
let navigationLockBound = false;
let pseudoFullscreenViewportBound = false;

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
const sessionLabel = computed(() => (submissionTarget.value?.is_exam ? "Sesi Ujian Aktif" : "Sesi Quiz Aktif"));
const progressLabel = computed(() => (submissionTarget.value?.is_exam ? "Progres Ujian" : "Progres Quiz"));
const primarySubmitLabel = computed(() => (submissionTarget.value?.is_exam ? "Selesai & Kirim Ujian" : "Selesai & Kirim Quiz"));
const quickAdvanceLabel = computed(() => (isLastQuestion.value
  ? submissionTarget.value?.is_exam ? "Kirim Ujian Sekarang" : "Kirim Quiz Sekarang"
  : "Kunci & Lanjut"));

const gradedAssignments = computed(() => assignments.value.filter((item) => item.score !== null && item.score !== undefined).length);
const completedAssignments = computed(() => assignments.value.filter((item) => Boolean(item.submission_id)).length);
const pendingAssignments = computed(() => assignments.value.filter((item) => !item.submission_id).length);
const totalQuestions = computed(() => (submissionTarget.value?.quiz_payload || []).length);
const currentQuestion = computed(() => submissionTarget.value?.quiz_payload?.[activeQuestionIndex.value] || null);
const currentAnswer = computed(() => submissionForm.answers[activeQuestionIndex.value] || {});
const questionDurationSeconds = computed(() => Number(submissionTarget.value?.question_duration_seconds || 0));
const isSessionTimedExam = computed(() => Boolean(submissionTarget.value?.is_exam));
const questionDurationMs = computed(() => questionDurationSeconds.value * 1000);
const isLastQuestion = computed(() => activeQuestionIndex.value >= Math.max(totalQuestions.value - 1, 0));
const questionProgressPercent = computed(() => {
  const duration = questionDurationMs.value;
  if (duration <= 0) return 0;
  const percent = (questionTimeLeftMs.value / duration) * 100;
  return Math.max(0, Math.min(100, percent));
});
const formattedQuestionTimeLeft = computed(() => formatDuration(Math.ceil(questionTimeLeftMs.value / 1000)));

const assignmentTypeLabel = (type) => {
  if (type === "MCQ") return "Pilihan Ganda";
  if (type === "ESSAY") return "Essay";
  return "Quiz";
};

const examCategoryLabel = (type) => {
  if (type === "UTS") return "UTS";
  if (type === "UAS") return "UAS";
  if (type === "UJIAN_SEKOLAH") return "Ujian Sekolah";
  if (type === "CUSTOM") return "Ujian Custom";
  return "Ujian";
};

const isExamNotStarted = (assignment) =>
  Boolean(assignment?.is_exam && assignment?.start_at && new Date(assignment.start_at).getTime() > Date.now());

const isExamClosed = (assignment) =>
  Boolean(assignment?.due_date && new Date(assignment.due_date).getTime() < Date.now());

const isExamUnavailable = (assignment) =>
  isExamNotStarted(assignment) || (!assignment?.submission_id && isExamClosed(assignment));

const startButtonLabel = (assignment) => {
  if (assignment?.submission_id) return "Selesai Dikerjakan";
  if (isExamNotStarted(assignment)) return "Menunggu Jadwal";
  if (isExamClosed(assignment)) return "Ujian Ditutup";
  if (assignment?.attempt_started_at) return assignment?.is_exam ? "Lanjutkan Ujian" : "Lanjutkan Quiz";
  return assignment?.is_exam ? "Masuk Ujian" : "Mulai Kerjakan Quiz";
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

  if (assignment?.is_exam) {
    return `Sesi ${formatDuration(totalSeconds)}`;
  }

  return `Per soal ${formatDuration(totalSeconds)}`;
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

const recordViolation = async (reason) => {
  if (!submissionTarget.value) {
    return;
  }

  const now = Date.now();
  if (now - lastViolationAt < 1200) {
    return;
  }

  lastViolationAt = now;
  violationCount.value += 1;
  antiCheatMessage.value = reason;

  try {
    await api.post(`/learning/assignments/${submissionTarget.value.id}/violations`, {
      violation_type: resolveViolationType(reason),
      violation_message: reason,
    });
  } catch (error) {
    // Keep the quiz flow running even when the violation log cannot be sent.
  }

  if (violationCount.value >= maxViolations) {
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
  if (!submissionTarget.value || document.visibilityState !== "hidden") {
    return;
  }

  await recordViolation("Terdeteksi berpindah tab atau meminimalkan aplikasi.");
};

const handleQuizWindowBlur = async () => {
  if (!submissionTarget.value) {
    return;
  }

  await recordViolation("Terdeteksi berpindah fokus dari halaman quiz.");
};

const handleQuizFullscreenChange = async () => {
  if (!submissionTarget.value || document.fullscreenElement || pseudoFullscreenActive.value) {
    return;
  }

  fullscreenRecoveryRequired.value = true;
  await recordViolation("Terdeteksi keluar dari mode fullscreen.");
};

const bindAntiCheatListeners = () => {
  if (antiCheatListenersBound || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  document.addEventListener("visibilitychange", handleQuizVisibilityChange);
  window.addEventListener("blur", handleQuizWindowBlur);
  document.addEventListener("fullscreenchange", handleQuizFullscreenChange);
  antiCheatListenersBound = true;
};

const unbindAntiCheatListeners = () => {
  if (!antiCheatListenersBound || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  document.removeEventListener("visibilitychange", handleQuizVisibilityChange);
  window.removeEventListener("blur", handleQuizWindowBlur);
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
  if (!submissionTarget.value || questionDurationMs.value <= 0 || isSessionTimedExam.value) return false;

  let finished = false;
  while (
    submissionTarget.value.current_question_started_at
    && activeQuestionIndex.value < totalQuestions.value
    && new Date(submissionTarget.value.current_question_started_at).getTime() + questionDurationMs.value <= Date.now()
  ) {
    if (activeQuestionIndex.value >= totalQuestions.value - 1) {
      finished = true;
      break;
    }

    activeQuestionIndex.value += 1;
    submissionTarget.value.current_question_started_at = new Date(
      new Date(submissionTarget.value.current_question_started_at).getTime() + questionDurationMs.value,
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

  const referenceTime = isSessionTimedExam.value
    ? submissionTarget.value.attempt_started_at
    : submissionTarget.value.current_question_started_at;

  if (!referenceTime) {
    questionTimeLeftMs.value = 0;
    return;
  }

  const endTime = new Date(referenceTime).getTime() + questionDurationMs.value;
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
      if (isSessionTimedExam.value) {
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
  submissionTarget.value = {
    ...assignment,
    attempt_started_at: startPayload?.started_at || assignment.attempt_started_at || new Date().toISOString(),
    current_question_started_at: new Date().toISOString(),
  };

  const storedSession = getStoredAttemptSession(submissionTarget.value);
  submissionForm.answers = storedSession?.answers?.length
    ? storedSession.answers
    : buildInitialAnswers(submissionTarget.value);

  activeQuestionIndex.value = Number.isInteger(storedSession?.active_question_index)
    ? storedSession.active_question_index
    : 0;

  submissionTarget.value.current_question_started_at = storedSession?.question_started_at || new Date().toISOString();

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
  const response = await api.get(`/learning/subjects/${selectedSubject.value.id}/assignments`);
  assignments.value = (response?.data || []).filter((item) => {
    if (item.assignment_type === "FILE") {
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
  message.value = "";
  await loadSubjectData();
};

const startSubmission = async (assignment) => {
  if (assignment.submission_id) {
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
      const examCode = window.prompt(`Masukkan kode ujian untuk ${assignment.title}`);
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

const submitAssignment = async (triggeredAutomatically = false) => {
  if (!submissionTarget.value) return;

  isSubmitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const formData = new FormData();
    formData.append("submission_text", "");
    formData.append("answers", JSON.stringify(submissionForm.answers));
    const response = await api.post(`/learning/assignments/${submissionTarget.value.id}/submit`, formData);

    stopQuestionTimer();
    unbindLockedNavigation();
    unbindAntiCheatListeners();
    exitQuizFullscreen();
    clearAttemptSession(submissionTarget.value.id);
    pushToast({
      title: triggeredAutomatically
        ? `${submissionTarget.value.is_exam ? "Ujian" : "Quiz"} Terkirim Otomatis`
        : `${submissionTarget.value.is_exam ? "Ujian" : "Quiz"} Berhasil Dikirim`,
      message: triggeredAutomatically
        ? `Waktu ${submissionTarget.value.is_exam ? "ujian" : "quiz"} habis. Jawaban yang sempat tersimpan sudah dikirim otomatis.`
        : "Jawaban sudah dikunci dan tidak dapat diubah.",
      type: triggeredAutomatically ? "info" : "success",
      duration: 4200,
    });

    setLayoutChromeHidden(false);
    submissionTarget.value = null;
    submissionForm.answers = [];
    resetAntiCheatState();
    await loadSubjectData();
    window.scrollTo(0, 0);

  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: `Gagal Mengirim ${submissionTarget.value?.is_exam ? "Ujian" : "Quiz"}`,
      message: error.message,
      type: "error",
      duration: 4200,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    isSubmitting.value = false;
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

onMounted(loadSubjects);
</script>
