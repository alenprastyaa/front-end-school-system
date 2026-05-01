<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto mt-8 max-w-[1400px]">

      <section class="mb-8">

        <div
          class="flex flex-nowrap gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button v-for="item in subjects" :key="item.id" @click="selectSubject(item)"
            class="group relative flex min-w-[240px] flex-none snap-start flex-col items-start overflow-hidden rounded-2xl p-4 text-left transition-all"
            :class="selectedSubject?.id === item.id
              ? 'bg-sky-600 shadow-md ring-1 ring-sky-600 dark:bg-cyan-600'
              : 'bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80'">
            <span :class="selectedSubject?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'"
              class="font-bold tracking-tight">{{ item.name }}</span>
            <span
              :class="selectedSubject?.id === item.id ? 'text-sky-200 dark:text-cyan-100' : 'text-slate-500 dark:text-slate-400'"
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

            <nav class="-mb-px mt-6 flex gap-6 overflow-x-auto">
              <button @click="activeTab = 'materials'"
                class="border-b-2 py-3 text-sm font-semibold transition-colors focus:outline-none"
                :class="activeTab === 'materials' ? 'border-sky-600 text-sky-700 dark:border-cyan-400 dark:text-cyan-300' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'">
                Manajemen Materi
              </button>
              <button @click="activeTab = 'assignments'"
                class="border-b-2 py-3 text-sm font-semibold transition-colors focus:outline-none"
                :class="activeTab === 'assignments' ? 'border-sky-600 text-sky-700 dark:border-cyan-400 dark:text-cyan-300' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'">
                Tugas & Penilaian
              </button>
            </nav>
          </div>

          <div v-show="activeTab === 'materials'" class="p-6">
            <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 class="font-bold text-slate-900 dark:text-white">Library Materi</h3>
                <p class="text-sm text-slate-500">Bahan bacaan dan modul untuk dipelajari siswa.</p>
              </div>
              <button @click="materialModalOpen = true"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Publikasi Materi Baru
              </button>
            </div>

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <article v-for="item in materials" :key="item.id"
                class="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                <div>
                  <h4 class="font-bold text-slate-900 line-clamp-2 dark:text-white">{{ item.title }}</h4>
                  <span class="mt-1 block text-xs font-medium text-slate-400">{{ formatDateTime(item.created_at)
                  }}</span>
                  <p class="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">{{
                    item.content || "Tidak ada deskripsi." }}</p>
                </div>
                <div class="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                  <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank" rel="noreferrer"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:bg-cyan-500/20">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Buka Lampiran
                  </a>
                  <span v-else class="block text-center text-xs italic text-slate-400">Tanpa lampiran</span>
                </div>
              </article>

              <div v-if="materials.length === 0"
                class="col-span-full rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
                <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada materi
                  dipublikasikan.</span>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'assignments'" class="p-6">

            <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <button @click="assignmentModalOpen = true"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 dark:bg-cyan-600 dark:hover:bg-cyan-500">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Buat Tugas / Penilaian
              </button>
            </div>

            <div class="grid items-start gap-6 lg:grid-cols-12">

              <section class="lg:col-span-4 xl:col-span-3">
                <h3 class="mb-4 font-bold text-slate-900 dark:text-white">Daftar Tugas & Penilaian</h3>
                <div class="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 dark:border-cyan-500/20 dark:bg-cyan-500/10">
                    <p class="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-cyan-300">Dalam LMS</p>
                    <p class="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                      Siswa mengumpulkan file atau jawaban langsung lewat sistem.
                    </p>
                  </div>
                  <div class="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                    <p class="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">Di Luar LMS</p>
                    <p class="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                      Ujian, praktik, presentasi, atau observasi dilakukan offline, lalu nilainya dicatat di sini.
                    </p>
                  </div>
                </div>
                <div class="flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-2">
                  <article v-for="item in assignments" :key="item.id"
                    class="group relative rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-sky-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-700"
                    :class="selectedAssignment?.id === item.id ? 'ring-2 ring-sky-600 dark:ring-cyan-500' : ''">
                    <h4 class="font-bold text-slate-900 dark:text-white">{{ item.title }}</h4>
                    <div class="mt-2.5 mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span :class="assignmentTypeBadgeClass(item.assignment_type)"
                        class="inline-flex items-center rounded-md px-2 py-1">
                        {{ assignmentTypeLabel(item.assignment_type) }}
                      </span>
                      <span :class="assignmentDeliveryBadgeClass(item.assignment_type)"
                        class="inline-flex items-center rounded-md px-2 py-1">
                        {{ assignmentDeliveryLabel(item.assignment_type) }}
                      </span>
                      <span
                        class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        ⏳ {{ formatDateTime(item.due_date) }}
                      </span>
                      <span
                        class="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-sky-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                        📦 {{ item.submission_count || 0 }} Terkumpul
                      </span>
                    </div>
                    <button @click="loadSubmissions(item)"
                      class="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-cyan-900/30 dark:hover:text-cyan-300">
                      {{ selectedAssignment?.id === item.id ? 'Sedang Dinilai' : 'Buka Penilaian' }}
                    </button>
                  </article>

                  <div v-if="assignments.length === 0"
                    class="rounded-2xl border-2 border-dashed border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
                    Belum ada tugas atau penilaian.
                  </div>
                </div>
              </section>

              <section
                class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 lg:col-span-8 xl:col-span-9">

                <div
                  class="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 class="font-bold text-slate-900 dark:text-white">Meja Penilaian Massal</h3>
                    <p class="mt-1 text-sm font-medium text-sky-600 dark:text-cyan-400">
                      {{ selectedAssignment?.title || "Belum ada tugas yang dipilih." }}
                    </p>
                  </div>

                  <div v-if="selectedAssignment" class="flex flex-wrap items-center gap-3">
                    <div class="relative">
                      <input v-model="submissionSearch" type="text" placeholder="Cari nama siswa..."
                        class="block w-48 rounded-xl border-0 bg-white py-2 pl-3 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                    </div>
                    <select v-model="submissionFilter"
                      class="block rounded-xl border-0 bg-white py-2 pl-3 pr-8 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                      <option value="ALL">Semua Status</option>
                      <option value="UNGRADED">Belum Dinilai</option>
                      <option value="GRADED">Sudah Dinilai</option>
                    </select>
                  </div>
                </div>

                <div class="h-[600px] overflow-y-auto">
                  <table v-if="selectedAssignment" class="min-w-[800px] w-full text-left text-sm">
                    <thead
                      class="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <tr class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <th class="px-5 py-4 font-semibold">Siswa</th>
                        <th class="px-5 py-4 font-semibold">Jawaban / Lampiran</th>
                        <th class="w-32 px-5 py-4 font-semibold">Nilai</th>
                        <th class="px-5 py-4 font-semibold">Feedback</th>
                        <th class="w-24 px-5 py-4 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="item in filteredSubmissions" :key="item.id"
                        class="group transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">

                        <td class="px-5 py-4 align-top">
                          <div class="font-bold text-slate-900 dark:text-white">{{ item.student_name }}</div>
                          <div class="mt-1 text-xs text-slate-500">{{ formatDateTime(item.submitted_at) }}</div>
                        </td>

                        <td class="px-5 py-4 align-top">
                          <p
                            class="max-h-16 max-w-xs overflow-y-auto text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                            {{ item.submission_text || "Tanpa teks catatan." }}
                          </p>
                          <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank" rel="noreferrer"
                            class="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:bg-cyan-900/30 dark:text-cyan-400 dark:hover:bg-cyan-900/50">
                            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2"
                              stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            {{ item.assignment_type === "MANUAL" ? "Tanpa Pengumpulan LMS" : "File Tugas" }}
                          </a>
                          <span v-else-if="item.assignment_type === 'MANUAL'"
                            class="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                            Nilai dicatat manual oleh guru
                          </span>
                        </td>

                        <td class="px-5 py-4 align-top">
                          <input v-model="item.scoreDraft" type="number" min="0" max="100" step="0.01"
                            placeholder="0-100"
                            class="w-full rounded-xl border-0 bg-slate-50 py-2 pl-3 pr-2 text-sm font-bold text-slate-900 ring-1 ring-inset ring-slate-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                        </td>

                        <td class="px-5 py-4 align-top">
                          <input v-model="item.feedbackDraft" placeholder="Tulis masukan..."
                            class="w-full min-w-[150px] rounded-xl border-0 bg-slate-50 py-2 px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                        </td>

                        <td class="px-5 py-4 align-top text-right">
                          <button @click="submitGrade(item)"
                            class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-700 dark:bg-cyan-600 dark:hover:bg-cyan-500">
                            Simpan
                          </button>
                        </td>
                      </tr>

                      <tr v-if="filteredSubmissions.length === 0">
                        <td colspan="5" class="py-16 text-center">
                          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Tidak ada data siswa yang
                            sesuai filter/pencarian.</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div v-else class="flex h-full flex-col items-center justify-center text-center text-slate-400">
                    <svg class="mb-4 h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="font-medium text-slate-500">Pilih tugas di panel sebelah kiri untuk mulai menilai.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div v-else
          class="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div class="rounded-full bg-sky-50 p-4 dark:bg-cyan-500/10">
            <svg class="h-8 w-8 text-sky-600 dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0A50.57 50.57 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">Workspace Kosong</h3>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Silakan pilih salah satu mata pelajaran dari panel
            di atas untuk memulai.</p>
        </div>
      </div>
    </main>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="materialModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Publikasi Materi Baru</h2>
            <button @click="materialModalOpen = false"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <form @submit.prevent="submitMaterial" class="space-y-5">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Judul Materi</label>
                <input v-model="materialForm.title" required placeholder="Contoh: Pengantar Aljabar"
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Konten / Ringkasan</label>
                <textarea v-model="materialForm.content" rows="4" placeholder="Tulis ringkasan atau instruksi materi..."
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Lampiran File
                  (Opsional)</label>
                <input type="file" @change="handleMaterialFile"
                  class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-sky-700 hover:file:bg-sky-100 dark:text-slate-300 dark:file:bg-cyan-500/10 dark:file:text-cyan-300" />
              </div>
              <div class="flex items-center justify-end gap-3 pt-4">
                <button type="button" @click="materialModalOpen = false"
                  class="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Batal</button>
                <button :disabled="isSavingMaterial" type="submit"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                  {{ isSavingMaterial ? "Menyimpan..." : "Publikasikan" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="assignmentModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Buat Tugas atau Penilaian</h2>
            <button @click="assignmentModalOpen = false"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <form @submit.prevent="submitAssignment" class="space-y-5">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Judul</label>
                <input v-model="assignmentForm.title" required placeholder="Contoh: Latihan Bab 1"
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Lokasi Proses Penilaian</label>
                <div class="grid gap-3 md:grid-cols-2">
                  <button type="button" @click="assignmentForm.assignment_type = 'FILE'"
                    class="rounded-2xl border p-4 text-left transition"
                    :class="assignmentForm.assignment_type === 'FILE'
                      ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200 dark:border-cyan-400 dark:bg-cyan-500/10 dark:ring-cyan-500/20'
                      : 'border-slate-200 bg-white hover:border-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-700'">
                    <p class="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-cyan-300">Dalam LMS</p>
                    <h3 class="mt-2 font-bold text-slate-900 dark:text-white">Tugas File di LMS</h3>
                    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Siswa melihat instruksi, mengunggah file, lalu guru menilai hasil pengumpulan di sistem.
                    </p>
                  </button>
                  <button type="button" @click="assignmentForm.assignment_type = 'MANUAL'"
                    class="rounded-2xl border p-4 text-left transition"
                    :class="assignmentForm.assignment_type === 'MANUAL'
                      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200 dark:border-amber-400 dark:bg-amber-500/10 dark:ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-amber-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-amber-700'">
                    <p class="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">Di Luar LMS</p>
                    <h3 class="mt-2 font-bold text-slate-900 dark:text-white">Penilaian / Ujian Offline</h3>
                    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Ujian, praktik, presentasi, observasi, atau performa dilakukan di luar LMS, lalu nilainya dicatat per siswa di sistem.
                    </p>
                  </button>
                </div>
              </div>
              <div
                class="rounded-2xl border px-4 py-3 text-sm"
                :class="assignmentForm.assignment_type === 'MANUAL'
                  ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200'
                  : 'border-sky-200 bg-sky-50 text-sky-800 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200'">
                {{ assignmentForm.assignment_type === 'MANUAL'
                  ? 'Mode luar LMS aktif: siswa tidak mengumpulkan apa pun di sistem. Guru langsung memberi nilai dari meja penilaian massal.'
                  : 'Mode dalam LMS aktif: siswa akan mengumpulkan file lewat sistem sesuai tenggat yang ditentukan.' }}
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Instruksi /
                  Deskripsi</label>
                <textarea v-model="assignmentForm.description" rows="3"
                  :placeholder="assignmentForm.assignment_type === 'MANUAL'
                    ? 'Contoh: Ujian praktik membaca, presentasi, observasi sikap, atau penilaian performa lainnya...'
                    : 'Jelaskan detail tugas dan instruksi format file...'"
                  class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
              </div>
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Batas Waktu
                    (Tenggat)</label>
                  <input v-model="assignmentForm.due_date" type="datetime-local"
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Lampiran Soal
                    (Opsional)</label>
                  <input type="file" @change="handleAssignmentFile" :disabled="assignmentForm.assignment_type === 'MANUAL'"
                    class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-sky-700 hover:file:bg-sky-100 dark:text-slate-300 dark:file:bg-cyan-500/10 dark:file:text-cyan-300" />
                  <p v-if="assignmentForm.assignment_type === 'MANUAL'" class="text-xs text-slate-500">
                    Lampiran dimatikan karena siswa tidak mengumpulkan tugas pada tipe ini.
                  </p>
                </div>
              </div>
              <div class="flex items-center justify-end gap-3 pt-4">
                <button type="button" @click="assignmentModalOpen = false"
                  class="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Batal</button>
                <button :disabled="isSavingAssignment" type="submit"
                  class="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-50">
                  {{ isSavingAssignment ? "Menyimpan..." : "Simpan" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { uploadFileDirect } from "@/api/upload";
import { formatDateTime } from "@/utils/date";
import { normalizePublicUrl } from "@/utils/url";

const activeTab = ref("materials");
const subjects = ref([]);
const selectedSubject = ref(null);
const selectedAssignment = ref(null);
const materials = ref([]);
const assignments = ref([]);
const submissions = ref([]);
const subjectError = ref("");
const message = ref("");
const isError = ref(false);

// State Modal Form
const materialModalOpen = ref(false);
const assignmentModalOpen = ref(false);
const isSavingMaterial = ref(false);
const isSavingAssignment = ref(false);
const materialFile = ref(null);
const assignmentFile = ref(null);

// State untuk Filter Meja Penilaian
const submissionSearch = ref("");
const submissionFilter = ref("ALL");

const materialForm = reactive({
  title: "",
  content: "",
});

const assignmentForm = reactive({
  title: "",
  description: "",
  due_date: "",
  assignment_type: "FILE",
});

// Computed Property untuk Filter Data Siswa
const filteredSubmissions = computed(() => {
  return submissions.value.filter(item => {
    // Pencarian Text (Case Insensitive)
    const matchSearch = item.student_name.toLowerCase().includes(submissionSearch.value.toLowerCase());

    // Filter Dropdown
    let matchFilter = true;
    if (submissionFilter.value === "UNGRADED") {
      matchFilter = item.score === null || item.score === undefined || item.score === "";
    } else if (submissionFilter.value === "GRADED") {
      matchFilter = item.score !== null && item.score !== undefined && item.score !== "";
    }

    return matchSearch && matchFilter;
  });
});

const resetMaterialForm = () => {
  materialForm.title = "";
  materialForm.content = "";
  materialFile.value = null;
};

const resetAssignmentForm = () => {
  assignmentForm.title = "";
  assignmentForm.description = "";
  assignmentForm.due_date = "";
  assignmentForm.assignment_type = "FILE";
  assignmentFile.value = null;
};

const assignmentTypeLabel = (type) => {
  if (type === "MANUAL") return "Ujian di Luar LMS";
  return "Tugas File";
};

const assignmentTypeBadgeClass = (type) => {
  if (type === "MANUAL") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }

  return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
};

const assignmentDeliveryLabel = (type) => (type === "MANUAL" ? "Di Luar LMS" : "Dalam LMS");

const assignmentDeliveryBadgeClass = (type) => {
  if (type === "MANUAL") {
    return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
  }

  return "bg-sky-50 text-sky-700 dark:bg-cyan-500/10 dark:text-cyan-300";
};

const handleMaterialFile = (event) => {
  materialFile.value = event.target.files?.[0] || null;
};

const handleAssignmentFile = (event) => {
  assignmentFile.value = event.target.files?.[0] || null;
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
  }
};

const loadSubjectData = async () => {
  if (!selectedSubject.value) return;

  const [materialResponse, assignmentResponse] = await Promise.all([
    api.get(`/learning/subjects/${selectedSubject.value.id}/materials`),
    api.get(`/learning/subjects/${selectedSubject.value.id}/assignments`),
  ]);

  materials.value = materialResponse?.data || [];
  const assignmentItems = (assignmentResponse?.data || []).filter((item) => ["FILE", "MANUAL"].includes(item.assignment_type));

  assignments.value = await Promise.all(
    assignmentItems.map(async (assignment) => {
      try {
        const submissionResponse = await api.get(`/learning/assignments/${assignment.id}/submissions`);
        return {
          ...assignment,
          submissions: submissionResponse?.data || [],
        };
      } catch (error) {
        return {
          ...assignment,
          submissions: [],
        };
      }
    }),
  );
};

const selectSubject = async (subject) => {
  selectedSubject.value = subject;
  selectedAssignment.value = null;
  submissions.value = [];
  submissionSearch.value = ""; // Reset search saat ganti mapel
  submissionFilter.value = "ALL";
  message.value = "";
  activeTab.value = "materials";
  await loadSubjectData();
};

const submitMaterial = async () => {
  if (!selectedSubject.value) return;

  isSavingMaterial.value = true;
  message.value = "";
  isError.value = false;

  try {
    const payload = {
      subject_id: selectedSubject.value.id,
      title: materialForm.title,
      content: materialForm.content || "",
    };

    if (materialFile.value) {
      const uploadedFile = await uploadFileDirect(materialFile.value);
      payload.attachment_url = uploadedFile.url;
      payload.attachment_name = uploadedFile.name;
      payload.attachment_mime_type = uploadedFile.mimeType;
      payload.attachment_size = uploadedFile.size;
    }

    const response = await api.post("/learning/materials", payload);
    message.value = response?.message || "Materi berhasil ditambahkan";
    resetMaterialForm();
    materialModalOpen.value = false;
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSavingMaterial.value = false;
  }
};

const submitAssignment = async () => {
  if (!selectedSubject.value) return;

  isSavingAssignment.value = true;
  message.value = "";
  isError.value = false;

  try {
    const payload = {
      subject_id: selectedSubject.value.id,
      title: assignmentForm.title,
      description: assignmentForm.description || "",
      due_date: assignmentForm.due_date || "",
      assignment_type: assignmentForm.assignment_type,
    };

    if (assignmentForm.assignment_type === "FILE" && assignmentFile.value) {
      const uploadedFile = await uploadFileDirect(assignmentFile.value);
      payload.attachment_url = uploadedFile.url;
      payload.attachment_name = uploadedFile.name;
      payload.attachment_mime_type = uploadedFile.mimeType;
      payload.attachment_size = uploadedFile.size;
    }

    const response = await api.post("/learning/assignments", payload);
    message.value = response?.message || "Data penilaian berhasil ditambahkan";
    resetAssignmentForm();
    assignmentModalOpen.value = false;
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSavingAssignment.value = false;
  }
};

const loadSubmissions = async (assignment) => {
  selectedAssignment.value = assignment;
  submissionSearch.value = ""; // Reset pencarian saat buka tugas baru
  submissionFilter.value = "ALL";

  try {
    const response = await api.get(`/learning/assignments/${assignment.id}/submissions`);
    submissions.value = (response?.data || []).map((item) => ({
      ...item,
      scoreDraft: item.score ?? "",
      feedbackDraft: item.feedback ?? "",
    }));
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    submissions.value = [];
  }
};

const submitGrade = async (submission) => {
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post(`/learning/submissions/${submission.id}/grade`, {
      score: submission.scoreDraft === "" ? null : Number(submission.scoreDraft),
      feedback: submission.feedbackDraft || null,
    });

    // Sinkronisasi data di sisi klien agar UI langsung update tanpa loading ulang semua
    submission.score = submission.scoreDraft === "" ? null : Number(submission.scoreDraft);
    submission.feedback = submission.feedbackDraft || null;

    message.value = response?.message || "Nilai berhasil disimpan";

    // Perbarui jumlah submission terhitung pada assignments (opsional)
    await loadSubjectData();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  }
};

onMounted(loadSubjects);

watch(subjectError, (value) => {
  if (!value) return;
  pushToast({ title: "Gagal Memuat Pembelajaran", message: value, type: "error" });
});

watch(message, (value) => {
  if (!value) return;
  pushToast({
    title: isError.value ? "Aksi Pembelajaran Gagal" : "Aksi Pembelajaran Berhasil",
    message: value,
    type: isError.value ? "error" : "success",
  });
});
</script>
