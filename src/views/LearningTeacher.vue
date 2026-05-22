<template>
  <!-- Layout Utama: Sidebar di Kiri, Konten di Kanan (Desktop) -->
  <div
    class="learning-teacher-page min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">

    <main class="min-h-screen">
      <section class="border-b-2 border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-6">
        <div class="flex flex-col gap-1">
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Papan Kelas</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Pilih kelas yang ingin dikelola</p>
        </div>

        <nav
          class="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button v-for="item in subjects" :key="item.id" @click="selectSubject(item)"
            class="group relative flex min-w-[220px] flex-none flex-col items-start overflow-hidden rounded-2xl p-3.5 text-left transition-all"
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
        </nav>
      </section>

      <div v-if="selectedSubject">
        <!-- HEADER KELAS -->
        <header class="border-b-2 border-slate-200 bg-white p-4 md:p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white">{{ selectedSubject.name }}</h2>
          <p class="mt-2 text-lg text-slate-600 dark:text-slate-300">
            {{ selectedSubject.class_name }} &bull; {{ selectedSubject.description || "Tidak ada deksripsi khusus." }}
          </p>

          <!-- TAB SIMPEL -->
          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <button @click="switchTab('materials')" type="button"
              class="flex-1 rounded-2xl border-2 px-5 py-3 text-lg font-semibold transition-all"
              :class="activeTab === 'materials'
                ? 'border-sky-600 bg-sky-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'">
              Materi Pelajaran
            </button>

            <button @click="switchTab('assignments')" type="button"
              class="flex-1 rounded-2xl border-2 px-5 py-3 text-lg font-semibold transition-all"
              :class="activeTab === 'assignments'
                ? 'border-sky-600 bg-sky-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'">
              Tugas & Nilai
            </button>
          </div>
        </header>

        <!-- KONTEN: MATERI -->
        <div v-if="activeTab === 'materials'" class="p-4 md:p-6">
          <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Daftar Materi</h3>
            <div class="flex flex-col gap-3 sm:flex-row">
              <!-- <button @click="openMaterialModal('ai-pptx')"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-emerald-700">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4.5 7.5h15m-15 4.5h15m-15 4.5h9M6 4.5v15m12-15v15" />
                </svg>
                Buat Presentasi (AI)
              </button> -->
              <button @click="openMaterialModal('manual')"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-base font-bold text-white transition hover:bg-sky-700">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Tambah Materi Manual
              </button>
            </div>
          </div>

          <div
            class="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 text-left dark:divide-slate-700">
                <thead class="bg-slate-50 dark:bg-slate-900/40">
                  <tr class="text-sm uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    <th class="px-5 py-4 font-semibold">Judul</th>
                    <th class="px-5 py-4 font-semibold">Dipublikasi</th>
                    <th class="px-5 py-4 font-semibold">Isi / Ringkasan</th>
                    <th class="px-5 py-4 font-semibold">Lampiran</th>
                    <th class="px-5 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr v-for="item in materials" :key="item.id"
                    class="align-top hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td class="px-5 py-4">
                      <div class="text-base font-semibold text-slate-900 dark:text-white">{{ item.title }}</div>
                    </td>
                    <td class="px-5 py-4">
                      <div class="text-sm text-slate-600 dark:text-slate-300">{{ formatDateTime(item.created_at) }}
                      </div>
                    </td>
                    <td class="px-5 py-4">
                      <p class="max-w-xl text-base leading-6 text-slate-700 dark:text-slate-300">
                        {{ item.content || "Tidak ada deksripsi khusus." }}
                      </p>
                    </td>
                    <td class="px-5 py-4">
                      <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                        rel="noreferrer"
                        class="inline-flex items-center rounded-md border border-blue-700 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300">
                        Buka Lampiran
                      </a>
                      <span v-else class="text-sm text-slate-400 dark:text-slate-500">-</span>
                    </td>
                    <td class="px-5 py-4">
                      <div class="flex justify-end gap-2">
                        <button @click="openMaterialEditModal(item)"
                          class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                          Edit
                        </button>
                        <button @click="openDeleteModal('material', item)"
                          class="rounded-md border border-rose-700 bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="materials.length === 0">
                    <td colspan="5" class="px-5 py-14 text-center">
                      <p class="text-base font-semibold text-slate-500 dark:text-slate-400">Belum Ada Materi</p>
                      <p class="mt-2 text-sm text-slate-500 dark:text-slate-500">Silakan klik tombol "Tambah Materi" di
                        atas.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- KONTEN: TUGAS & PENILAIAN -->
        <div v-if="activeTab === 'assignments'" class="p-4 md:p-6">

          <!-- State 1: Daftar Tugas -->
          <div v-if="!gradingAssignment">
            <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Daftar Tugas & Ujian</h3>
              <button @click="assignmentModalOpen = true"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-base font-bold text-white transition hover:bg-sky-700">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Buat Tugas Baru
              </button>
            </div>

            <!-- Filter -->
            <div
              class="mb-6 rounded-2xl border-2 border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
              <div class="grid gap-4 md:grid-cols-3">
                <input v-model="assignmentSearch" type="text" placeholder="Cari nama tugas..."
                  class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                <select v-model="assignmentTypeFilter"
                  class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="ALL">Tampilkan Semua</option>
                  <option value="FILE">Tugas Kumpul Online</option>
                  <option value="MANUAL">Tugas Penilaian Langsung</option>
                </select>
                <select v-model="assignmentSort"
                  class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="NEWEST">Paling Baru Dibuat</option>
                  <option value="DUE_ASC">Batas Waktu Terdekat</option>
                  <option value="DUE_DESC">Batas Waktu Terjauh</option>
                </select>
              </div>
            </div>

            <!-- List Tugas -->
            <div
              class="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <table class="min-w-full text-left text-sm">
                <thead
                  class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-300">
                  <tr>
                    <th class="px-5 py-4 font-semibold">Tugas / Ujian</th>
                    <th class="px-5 py-4 font-semibold">Tenggat</th>
                    <th class="px-5 py-4 font-semibold">Terkumpul</th>
                    <th class="px-5 py-4 font-semibold">Lampiran</th>
                    <th class="px-5 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="item in filteredAssignments" :key="item.id"
                    class="align-top hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td class="px-5 py-4">
                      <div class="font-semibold text-slate-900 dark:text-white">{{ item.title }}</div>
                    </td>
                    <td class="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {{ formatDateTime(item.due_date) }}
                    </td>
                    <td class="px-5 py-4 text-sm font-semibold text-blue-700 dark:text-blue-400">
                      {{ item.submission_count ?? item.submissions?.length ?? 0 }} Siswa
                    </td>
                    <td class="px-5 py-4 text-sm">
                      <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                        rel="noreferrer"
                        class="inline-flex items-center rounded-md border border-blue-700 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300">
                        Buka Lampiran
                      </a>
                      <span v-else class="text-slate-400">-</span>
                    </td>
                    <td class="px-5 py-4 text-right">
                      <div class="relative inline-block">
                        <button @click="toggleAssignmentActions(item.id, $event)" type="button"
                          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                          Aksi
                        </button>

                        <div v-if="openAssignmentActionId === item.id"
                          class="fixed z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                          :style="assignmentActionMenuStyle">
                          <button @click="handleAssignmentAction('grade', item)" type="button"
                            class="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-semibold text-blue-700 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10">
                            Beri Nilai
                          </button>
                          <button @click="handleAssignmentAction('edit', item)" type="button"
                            class="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                            Edit
                          </button>
                          <button @click="handleAssignmentAction('delete', item)" type="button"
                            class="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">
                            Hapus
                          </button>
                        </div>
                        <button v-if="openAssignmentActionId === item.id" type="button"
                          class="fixed inset-0 z-40 cursor-default" @click="closeAssignmentActions"></button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="filteredAssignments.length === 0">
                    <td colspan="5" class="px-5 py-14 text-center">
                      <p class="text-base font-semibold text-slate-500 dark:text-slate-400">Belum Ada Tugas</p>
                      <p class="mt-2 text-sm text-slate-500">Tugas yang Anda buat akan muncul di sini.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- State 2: Meja Penilaian (Fokus Penuh) -->
          <div v-else>
            <!-- Tombol Kembali yang sangat jelas -->
            <button @click="gradingAssignment = null"
              class="mb-6 flex items-center gap-2 rounded-xl bg-slate-200 px-6 py-3 text-lg font-bold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
              Kembali ke Daftar Tugas
            </button>

            <div
              class="rounded-2xl border-2 border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div
                class="border-b-2 border-slate-200 bg-slate-50 p-6 md:p-8 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Menilai: {{ gradingAssignment.title }}
                </h3>

                <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <input v-model="submissionSearch" type="text" placeholder="Cari nama siswa..."
                    class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:max-w-xs" />
                  <select v-model="submissionFilter"
                    class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:max-w-xs">
                    <option value="ALL">Semua Siswa</option>
                    <option value="UNGRADED">Belum Dinilai</option>
                    <option value="GRADED">Sudah Dinilai</option>
                  </select>
                </div>
              </div>

              <!-- Tabel Nilai Lebar dan Lega -->
              <div class="overflow-x-auto">
                <table class="min-w-full text-left text-base">
                  <thead class="bg-slate-100 dark:bg-slate-800">
                    <tr class="text-base text-slate-700 dark:text-slate-300">
                      <th class="border-b-2 border-slate-200 px-6 py-5 font-bold dark:border-slate-700">Nama Siswa</th>
                      <th class="border-b-2 border-slate-200 px-6 py-5 font-bold dark:border-slate-700">Jawaban / File
                      </th>
                      <th class="border-b-2 border-slate-200 px-6 py-5 font-bold dark:border-slate-700 w-48">Nilai
                        (0-100)</th>
                      <th class="border-b-2 border-slate-200 px-6 py-5 font-bold dark:border-slate-700">Pesan / Koreksi
                      </th>
                      <th
                        class="border-b-2 border-slate-200 px-6 py-5 font-bold dark:border-slate-700 w-32 text-center">
                        Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y-2 divide-slate-100 dark:divide-slate-800">
                    <tr v-for="item in filteredSubmissions" :key="item.id"
                      class="hover:bg-blue-50/50 dark:hover:bg-slate-800/50">

                      <td class="px-6 py-6 align-top">
                        <div class="text-lg font-bold text-slate-900 dark:text-white">{{ item.student_name }}</div>
                        <div class="mt-2 text-sm text-slate-500">Waktu: {{ formatDateTime(item.submitted_at) }}</div>
                      </td>

                      <td class="px-6 py-6 align-top">
                        <p v-if="item.submission_text"
                          class="mb-3 max-w-sm text-base text-slate-700 dark:text-slate-300">
                          {{ item.submission_text }}
                        </p>
                        <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                          rel="noreferrer"
                          class="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 text-base font-bold text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300">
                          📄 Buka File Jawaban
                        </a>
                        <span v-else-if="item.assignment_type === 'MANUAL'"
                          class="inline-flex rounded-xl bg-amber-100 px-4 py-2 text-base font-bold text-amber-800">
                          Penilaian Langsung
                        </span>
                        <span v-else class="text-slate-500 italic">Belum mengumpulkan file</span>
                      </td>

                      <td class="px-6 py-6 align-top">
                        <input v-model="item.scoreDraft" type="number" min="0" max="100" step="0.01"
                          placeholder="Kosong"
                          class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-lg font-bold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                      </td>

                      <td class="px-6 py-6 align-top">
                        <textarea v-model="item.feedbackDraft" rows="2" placeholder="Tulis catatan (Opsional)..."
                          class="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"></textarea>
                      </td>

                      <td class="px-6 py-6 align-top text-center">
                        <button @click="submitGrade(item)"
                          class="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-bold text-white transition hover:bg-blue-700">
                          Simpan
                        </button>
                      </td>
                    </tr>

                    <tr v-if="filteredSubmissions.length === 0">
                      <td colspan="5" class="py-20 text-center text-lg font-bold text-slate-500">
                        Tidak ada siswa yang sesuai dengan pencarian Anda.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- TAMPILAN AWAL JIKA BELUM PILIH KELAS -->
      <div v-else class="flex h-full flex-col items-center justify-center p-10 text-center">
        <div class="rounded-full bg-blue-100 p-8 dark:bg-blue-900/30">
          <svg class="h-16 w-16 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 class="mt-8 text-3xl font-bold text-slate-900 dark:text-white">Selamat Datang!</h2>
        <p class="mt-3 text-xl text-slate-600 dark:text-slate-400">Silakan klik salah satu kelas di papan atas
          untuk mulai mengajar.</p>
      </div>
    </main>

    <!-- MODAL MATERI (Diperbesar & Disederhanakan) -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="materialModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-sm">
        <div
          class="modal-shell flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border-2 border-slate-500 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-600 dark:bg-slate-900"
          @click.stop>
          <div
            class="flex items-start justify-between border-b-2 border-slate-300 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Materi
                Pembelajaran</p>
              <h2 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {{ editingMaterialId ? "Ubah Data Materi" :
                  "Buat Materi Baru" }}</h2>
            </div>
            <button @click="closeMaterialModal"
              class="rounded-md border border-slate-300 bg-white p-2 text-slate-500 transition hover:border-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-900">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto px-5 py-5 md:px-6">
            <form @submit.prevent="submitMaterial" class="space-y-5">

              <!-- Pilihan Mode -->
              <div class="space-y-2">
                <label
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Pilih
                  cara membuat</label>
                <div class="grid gap-3 md:grid-cols-2">
                  <button type="button" @click="materialCreationMode = 'manual'"
                    class="rounded-lg border-2 p-4 text-left transition"
                    :class="materialCreationMode === 'manual' ? 'border-blue-700 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/15' : 'border-slate-300 bg-white hover:border-blue-500 dark:border-slate-600 dark:bg-slate-800'">
                    <h3 class="text-base font-bold text-blue-800 dark:text-blue-300">Tulis & Upload Sendiri</h3>
                    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Ketik deskripsi manual dan
                      lampirkan file (PDF/Word/Excel).</p>
                  </button>
                  <button type="button" @click="materialCreationMode = 'ai-pptx'"
                    class="rounded-lg border-2 p-4 text-left transition"
                    :class="materialCreationMode === 'ai-pptx' ? 'border-emerald-700 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/15' : 'border-slate-300 bg-white hover:border-emerald-500 dark:border-slate-600 dark:bg-slate-800'">
                    <h3 class="text-base font-bold text-emerald-800 dark:text-emerald-300">Dibantu Sistem AI (Otomatis)
                    </h3>
                    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Cukup beritahu topik, sistem
                      akan
                      otomatis membuatkan file presentasi (PPT).</p>
                  </button>
                </div>
              </div>

              <!-- Input Judul -->
              <div class="space-y-2">
                <label
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Judul
                  materi pembelajaran</label>
                <input v-model="materialForm.title" required placeholder="Contoh: Bab 1 - Pengenalan Sel..."
                  class="block w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              </div>
              <div class="space-y-2">
                <label
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Deskripsi
                  singkat untuk
                  Siswa</label>
                <textarea v-model="materialForm.content" rows="4"
                  placeholder="Tuliskan petunjuk atau ringkasan untuk dibaca siswa..."
                  class="block w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              </div>

              <!-- Mode Manual -->
              <div v-if="materialCreationMode === 'manual'"
                class="space-y-2 rounded-lg border-2 border-slate-300 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/80">
                <label
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Upload
                  file
                  (jika ada)</label>
                <input type="file" @change="handleMaterialFile"
                  class="block w-full text-sm text-slate-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800 dark:text-slate-300" />
              </div>

              <!-- Mode AI -->
              <div v-else
                class="space-y-4 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-900/10">
                <h3 class="text-base font-bold text-emerald-900 dark:text-emerald-300">Pengaturan Presentasi Otomatis
                </h3>
                <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div class="space-y-1.5">
                    <label
                      class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Topik
                      pembahasan</label>
                    <input v-model="materialAiForm.topic" required placeholder="Contoh: Sejarah Kemerdekaan RI"
                      class="block w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                  </div>
                  <div class="space-y-1.5">
                    <label
                      class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Jumlah
                      halaman (slide)</label>
                    <input v-model.number="materialAiForm.slide_count" type="number" min="3" max="15"
                      class="block w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Tujuan
                    belajar / pesan khusus (opsional)</label>
                  <textarea v-model="materialAiForm.learning_goals" rows="3"
                    placeholder="Contoh: Fokuskan pada nama-nama tokoh penting..."
                    class="block w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                </div>

                <div v-if="materialAiPreview"
                  class="mt-3 rounded-lg border-2 border-emerald-600 bg-emerald-600 p-4 text-white">
                  <p class="text-base font-bold">Rancangan siap</p>
                  <p class="mt-1 text-sm leading-6 text-emerald-50">Silakan klik tombol simpan jika sudah sesuai.</p>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button v-if="materialCreationMode === 'ai-pptx' && materialAiPreview" type="button"
                  @click="generateAiMaterialPreview" :disabled="isGeneratingAiMaterial || isPublishingAiMaterial"
                  class="rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                  {{ isGeneratingAiMaterial ? "Merancang Ulang..." : "Rancang Ulang PPT" }}
                </button>
                <button :disabled="isSavingMaterial || isGeneratingAiMaterial || isPublishingAiMaterial" type="submit"
                  class="rounded-md border border-blue-800 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
                  :class="materialCreationMode === 'ai-pptx' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'">
                  {{ materialCreationMode === 'ai-pptx'
                    ? materialAiPreview
                      ? (isPublishingAiMaterial ? "Menyimpan..." : "Simpan & Publikasikan")
                      : (isGeneratingAiMaterial ? "Sedang Diproses..." : "Minta AI Buatkan Rancangan")
                    : (isSavingMaterial ? "Menyimpan..." : "Simpan Materi") }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL TUGAS (Diperbesar & Disederhanakan) -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="assignmentModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-sm">
        <div
          class="modal-shell w-full max-w-3xl overflow-hidden border-2 border-slate-500 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-600 dark:bg-slate-900"
          @click.stop>
          <div
            class="flex items-start justify-between border-b-2 border-slate-300 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Tugas &
                penilaian</p>
              <h2 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{{
                editingAssignmentId ? "Ubah Tugas" : "Buat Tugas / Ujian Baru" }}</h2>
            </div>
            <button @click="assignmentModalOpen = false"
              class="rounded-md border border-slate-300 bg-white p-2 text-slate-500 transition hover:border-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-900">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="overflow-y-auto px-5 py-5 md:px-6">
            <form @submit.prevent="submitAssignment" class="space-y-5">

              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Nama
                  tugas / ujian</label>
                <input v-model="assignmentForm.title" required placeholder="Contoh: Ujian Tengah Semester..."
                  class="block w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              </div>

              <div class="space-y-2">
                <label
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Metode
                  pengerjaan</label>
                <div class="grid gap-3 md:grid-cols-2">
                  <button type="button" @click="assignmentForm.assignment_type = 'FILE'"
                    class="rounded-lg border-2 p-4 text-left transition"
                    :class="assignmentForm.assignment_type === 'FILE' ? 'border-blue-700 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/15' : 'border-slate-300 bg-white hover:border-blue-500 dark:border-slate-600 dark:bg-slate-800'">
                    <h3 class="text-base font-bold text-blue-800 dark:text-blue-300">Kumpul Online</h3>
                    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Siswa harus mengunggah file
                      jawaban ke
                      dalam sistem ini.</p>
                  </button>
                  <button type="button" @click="assignmentForm.assignment_type = 'MANUAL'"
                    class="rounded-lg border-2 p-4 text-left transition"
                    :class="assignmentForm.assignment_type === 'MANUAL' ? 'border-amber-700 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/15' : 'border-slate-300 bg-white hover:border-amber-500 dark:border-slate-600 dark:bg-slate-800'">
                    <h3 class="text-base font-bold text-amber-800 dark:text-amber-300">Penilaian Langsung</h3>
                    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Ujian praktik lisan /
                      presentasi. Guru
                      tinggal memasukkan angka nilainya.</p>
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Perintah
                  pengerjaan (soal)</label>
                <textarea v-model="assignmentForm.description" rows="4"
                  placeholder="Tulis instruksi lengkap atau soal ujian..."
                  class="block w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              </div>

              <div
                class="grid grid-cols-1 gap-3 rounded-lg border-2 border-slate-300 bg-slate-50 p-4 md:grid-cols-2 dark:border-slate-600 dark:bg-slate-800/80">
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Batas
                    waktu (paling lambat)</label>
                  <input v-model="assignmentForm.due_date" type="datetime-local"
                    class="block w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Upload
                    file pendukung (misal: PDF soal)</label>
                  <input type="file" @change="handleAssignmentFile"
                    :disabled="assignmentForm.assignment_type === 'MANUAL'"
                    class="block w-full text-sm text-slate-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800 disabled:opacity-50 dark:text-slate-300" />
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" @click="assignmentModalOpen = false"
                  class="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                  Batalkan
                </button>
                <button :disabled="isSavingAssignment" type="submit"
                  class="rounded-md border border-blue-800 bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60">
                  {{ isSavingAssignment ? "Menyimpan..." : "Simpan Tugas" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL KONFIRMASI HAPUS -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-sm">
        <div
          class="modal-shell w-full max-w-md overflow-hidden border-2 border-slate-500 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-600 dark:bg-slate-900"
          @click.stop>
          <div class="px-5 py-6 text-center md:px-6">
            <div
              class="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border-2 border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-900/30">
              <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 class="mt-4 text-xl font-bold text-slate-900 dark:text-white">Hapus permanen?</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Data <strong>{{ deleteTargetItem?.title || "Ini" }}</strong> akan dihapus dan tidak bisa dikembalikan
              lagi.
            </p>
          </div>
          <div
            class="flex items-center gap-3 border-t-2 border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <button type="button" @click="closeDeleteModal"
              class="w-full rounded-md border-2 border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
              Kembali
            </button>
            <button type="button" @click="confirmDelete" :disabled="isDeletingItem"
              class="w-full rounded-md border-2 border-rose-700 bg-rose-600 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60">
              {{ isDeletingItem ? "Menghapus..." : "Ya, Hapus" }}
            </button>
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
import { formatDateTime, formatDateTimeLocalInput as formatJakartaDateTimeLocalInput, parseDateValue } from "@/utils/date";
import { normalizePublicUrl } from "@/utils/url";
import { useMasterDataStore } from "@/store/masterData";

// STATE UTAMA
const masterDataStore = useMasterDataStore();
const subjects = ref([]);
const selectedSubject = ref(null);
const activeTab = ref("materials");

// STATE DATA
const materials = ref([]);
const assignments = ref([]);
const submissions = ref([]);
const gradingAssignment = ref(null); // Jika null berarti menampilkan list tugas. Jika ada isinya, tampilkan layar Penilaian.

// STATE FEEDBACK
const subjectError = ref("");
const message = ref("");
const isError = ref(false);

// STATE MODAL
const materialModalOpen = ref(false);
const assignmentModalOpen = ref(false);
const isSavingMaterial = ref(false);
const isSavingAssignment = ref(false);
const isGeneratingAiMaterial = ref(false);
const isPublishingAiMaterial = ref(false);

const materialFile = ref(null);
const assignmentFile = ref(null);
const materialCreationMode = ref("manual");
const materialAiPreview = ref(null);
const editingMaterialId = ref(null);
const editingAssignmentId = ref(null);
const currentAssignmentAttachmentUrl = ref("");

const isDeleteModalOpen = ref(false);
const isDeletingItem = ref(false);
const deleteTargetType = ref("");
const deleteTargetItem = ref(null);

// STATE PENCARIAN & FILTER
const submissionSearch = ref("");
const submissionFilter = ref("ALL");
const assignmentSearch = ref("");
const assignmentTypeFilter = ref("ALL");
const assignmentSort = ref("NEWEST");
const openAssignmentActionId = ref(null);
const assignmentActionMenuStyle = ref({ top: "0px", right: "0px" });

// FORM DATA
const materialForm = reactive({ title: "", content: "" });
const materialAiForm = reactive({ topic: "", slide_count: 8, learning_goals: "", additional_instructions: "" });
const assignmentForm = reactive({ title: "", description: "", due_date: "", assignment_type: "FILE" });

// =======================
// FUNGSI KOMPUTASI
// =======================
const filteredSubmissions = computed(() => {
  return submissions.value.filter(item => {
    const matchSearch = item.student_name.toLowerCase().includes(submissionSearch.value.toLowerCase());
    let matchFilter = true;
    if (submissionFilter.value === "UNGRADED") {
      matchFilter = item.score === null || item.score === undefined || item.score === "";
    } else if (submissionFilter.value === "GRADED") {
      matchFilter = item.score !== null && item.score !== undefined && item.score !== "";
    }
    return matchSearch && matchFilter;
  });
});

const filteredAssignments = computed(() => {
  const keyword = assignmentSearch.value.trim().toLowerCase();
  const next = assignments.value.filter((item) => {
    const matchKeyword = !keyword
      || String(item.title || "").toLowerCase().includes(keyword)
      || String(item.description || "").toLowerCase().includes(keyword);
    const matchType = assignmentTypeFilter.value === "ALL" || item.assignment_type === assignmentTypeFilter.value;
    return matchKeyword && matchType;
  });

  next.sort((a, b) => {
    if (assignmentSort.value === "DUE_ASC") {
      return (parseDateValue(a?.due_date)?.getTime() || 0) - (parseDateValue(b?.due_date)?.getTime() || 0);
    }
    if (assignmentSort.value === "DUE_DESC") {
      return (parseDateValue(b?.due_date)?.getTime() || 0) - (parseDateValue(a?.due_date)?.getTime() || 0);
    }
    return Number(b?.id || 0) - Number(a?.id || 0);
  });
  return next;
});

// =======================
// NAVIGASI UX
// =======================
const selectSubject = async (subject) => {
  selectedSubject.value = subject;
  activeTab.value = "materials";
  gradingAssignment.value = null; // Reset tampilan ke daftar tugas
  openAssignmentActionId.value = null;
  await loadSubjectData();
};

const switchTab = (tab) => {
  activeTab.value = tab;
  gradingAssignment.value = null; // Reset jika berpindah tab
  openAssignmentActionId.value = null;
};

const assignmentTypeLabel = (type) => (type === "MANUAL" ? "Penilaian Langsung" : "Kumpul Online");
const assignmentTypeBadgeClass = (type) => (type === "MANUAL" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800");

// =======================
// RESET FORM
// =======================
const resetMaterialForm = () => {
  editingMaterialId.value = null;
  materialForm.title = "";
  materialForm.content = "";
  materialFile.value = null;
  materialCreationMode.value = "manual";
  materialAiPreview.value = null;
  materialAiForm.topic = "";
  materialAiForm.slide_count = 8;
  materialAiForm.learning_goals = "";
  materialAiForm.additional_instructions = "";
};

const resetAssignmentForm = () => {
  editingAssignmentId.value = null;
  currentAssignmentAttachmentUrl.value = "";
  assignmentForm.title = "";
  assignmentForm.description = "";
  assignmentForm.due_date = "";
  assignmentForm.assignment_type = "FILE";
  assignmentFile.value = null;
};

const handleMaterialFile = (e) => { materialFile.value = e.target.files?.[0] || null; };
const handleAssignmentFile = (e) => { assignmentFile.value = e.target.files?.[0] || null; };

// =======================
// MANAJEMEN MODAL
// =======================
const openMaterialModal = (mode = "manual") => {
  resetMaterialForm();
  materialCreationMode.value = mode;
  materialModalOpen.value = true;
};
const openMaterialEditModal = (item) => {
  resetMaterialForm();
  editingMaterialId.value = item.id;
  materialCreationMode.value = "manual";
  materialForm.title = item.title || "";
  materialForm.content = item.content || "";
  materialModalOpen.value = true;
};
const closeMaterialModal = () => { materialModalOpen.value = false; resetMaterialForm(); };

const openAssignmentEditModal = (item) => {
  resetAssignmentForm();
  editingAssignmentId.value = item.id;
  assignmentForm.title = item.title || "";
  assignmentForm.description = item.description || "";
  assignmentForm.due_date = item.due_date ? formatJakartaDateTimeLocalInput(item.due_date) : "";
  assignmentForm.assignment_type = item.assignment_type || "FILE";
  currentAssignmentAttachmentUrl.value = item.attachment_url || "";
  assignmentModalOpen.value = true;
};

const openDeleteModal = (type, item) => {
  deleteTargetType.value = type;
  deleteTargetItem.value = item;
  isDeleteModalOpen.value = true;
};

const closeAssignmentActions = () => {
  openAssignmentActionId.value = null;
};

const toggleAssignmentActions = (id, event) => {
  if (openAssignmentActionId.value === id) {
    closeAssignmentActions();
    return;
  }

  const target = event?.currentTarget;
  const rect = target?.getBoundingClientRect?.();
  if (rect) {
    assignmentActionMenuStyle.value = {
      top: `${Math.round(rect.bottom + 8)}px`,
      right: `${Math.max(8, Math.round(window.innerWidth - rect.right))}px`,
    };
  }

  openAssignmentActionId.value = id;
};

const handleAssignmentAction = (action, item) => {
  closeAssignmentActions();

  if (action === "grade") {
    loadSubmissions(item);
    return;
  }

  if (action === "edit") {
    openAssignmentEditModal(item);
    return;
  }

  if (action === "delete") {
    openDeleteModal("assignment", item);
  }
};
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  isDeletingItem.value = false;
  deleteTargetType.value = "";
  deleteTargetItem.value = null;
};

// =======================
// FUNGSI API
// =======================
const loadSubjects = async () => {
  subjectError.value = "";
  try {
    subjects.value = await masterDataStore.getTeacherSubjects({ force: true });
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
          submission_count: Array.isArray(submissionResponse?.data) ? submissionResponse.data.length : 0,
        };
      } catch (error) {
        return { ...assignment, submissions: [], submission_count: 0 };
      }
    }),
  );
};

const submitMaterial = async () => {
  if (!selectedSubject.value) return;

  if (materialCreationMode.value === "ai-pptx") {
    if (!materialAiPreview.value) { await generateAiMaterialPreview(); return; }
    isPublishingAiMaterial.value = true; message.value = ""; isError.value = false;
    try {
      const response = await api.post(`/learning/subjects/${selectedSubject.value.id}/materials/publish-ai-pptx`, {
        title: materialForm.title, content: materialForm.content || "",
        presentation_title: materialAiPreview.value.presentation_title,
        slides: materialAiPreview.value.slides,
      });
      message.value = response?.message || "Materi AI berhasil dipublikasikan";
      closeMaterialModal();
      await loadSubjectData();
    } catch (error) {
      isError.value = true; message.value = error.message;
    } finally {
      isPublishingAiMaterial.value = false;
    }
    return;
  }

  isSavingMaterial.value = true; message.value = ""; isError.value = false;
  try {
    const payload = new FormData();
    payload.append("subject_id", String(selectedSubject.value.id));
    payload.append("title", materialForm.title || "");
    payload.append("content", materialForm.content || "");
    if (materialFile.value) payload.append("attachment", materialFile.value);

    const response = editingMaterialId.value
      ? await api.put(`/learning/materials/${editingMaterialId.value}`, payload)
      : await api.post("/learning/materials", payload);
    message.value = response?.message || "Data berhasil disimpan";
    closeMaterialModal();
    await loadSubjectData();
  } catch (error) {
    isError.value = true; message.value = error.message;
  } finally {
    isSavingMaterial.value = false;
  }
};

const generateAiMaterialPreview = async () => {
  if (!selectedSubject.value) return;
  isGeneratingAiMaterial.value = true; message.value = ""; isError.value = false;
  try {
    const response = await api.post(`/learning/subjects/${selectedSubject.value.id}/materials/generate-ai-pptx`, {
      title: materialForm.title, content: materialForm.content || "",
      topic: materialAiForm.topic, slide_count: materialAiForm.slide_count,
      learning_goals: materialAiForm.learning_goals || "", additional_instructions: materialAiForm.additional_instructions || "",
    });
    materialAiPreview.value = {
      presentation_title: response?.data?.presentation_title || materialForm.title,
      summary: response?.data?.summary || materialForm.content || "",
      slides: Array.isArray(response?.data?.slides) ? response.data.slides : [],
    };
    message.value = "Berhasil membuat rancangan.";
  } catch (error) {
    isError.value = true; message.value = error.message;
  } finally {
    isGeneratingAiMaterial.value = false;
  }
};

const submitAssignment = async () => {
  if (!selectedSubject.value) return;
  isSavingAssignment.value = true; message.value = ""; isError.value = false;
  try {
    const payload = new FormData();
    payload.append("subject_id", String(selectedSubject.value.id));
    payload.append("title", assignmentForm.title || "");
    payload.append("description", assignmentForm.description || "");
    payload.append("due_date", assignmentForm.due_date || "");
    payload.append("assignment_type", assignmentForm.assignment_type || "FILE");

    if (assignmentForm.assignment_type === "FILE" && assignmentFile.value) {
      payload.append("attachment", assignmentFile.value);
    }
    if (assignmentForm.assignment_type === "MANUAL") {
      payload.append("remove_attachment", "true");
    }

    const response = editingAssignmentId.value
      ? await api.put(`/learning/assignments/${editingAssignmentId.value}`, payload)
      : await api.post("/learning/assignments", payload);
    message.value = response?.message || "Tugas berhasil disimpan";
    resetAssignmentForm();
    assignmentModalOpen.value = false;
    await loadSubjectData();
  } catch (error) {
    isError.value = true; message.value = error.message;
  } finally {
    isSavingAssignment.value = false;
  }
};

const confirmDelete = async () => {
  if (!deleteTargetItem.value) return;
  isDeletingItem.value = true; message.value = ""; isError.value = false;
  try {
    let response;
    if (deleteTargetType.value === "material") {
      response = await api.delete(`/learning/materials/${deleteTargetItem.value.id}`);
    } else if (deleteTargetType.value === "assignment") {
      response = await api.delete(`/learning/assignments/${deleteTargetItem.value.id}`);
      if (gradingAssignment.value?.id === deleteTargetItem.value.id) gradingAssignment.value = null;
    }
    message.value = response?.message || "Data berhasil dihapus";
    await loadSubjectData();
    closeDeleteModal();
  } catch (error) {
    isError.value = true; message.value = error.message; closeDeleteModal();
  } finally {
    isDeletingItem.value = false;
  }
};

const loadSubmissions = async (assignment) => {
  gradingAssignment.value = assignment; // Ganti layar menjadi mode Penilaian
  submissionSearch.value = "";
  submissionFilter.value = "ALL";
  try {
    const response = await api.get(`/learning/assignments/${assignment.id}/submissions`);
    submissions.value = (response?.data || []).map((item) => ({
      ...item,
      student_name: item.student_name || item.full_name || item.username || "-",
      scoreDraft: item.score ?? "",
      feedbackDraft: item.feedback ?? "",
    }));
  } catch (error) {
    isError.value = true; message.value = error.message; submissions.value = [];
  }
};

const submitGrade = async (submission) => {
  message.value = ""; isError.value = false;
  try {
    const response = await api.post(`/learning/submissions/${submission.id}/grade`, {
      score: submission.scoreDraft === "" ? null : Number(submission.scoreDraft),
      feedback: submission.feedbackDraft || null,
    });
    submission.score = submission.scoreDraft === "" ? null : Number(submission.scoreDraft);
    submission.feedback = submission.feedbackDraft || null;
    message.value = response?.message || "Nilai berhasil disimpan";
    await loadSubjectData();
  } catch (error) {
    isError.value = true; message.value = error.message;
  }
};

onMounted(loadSubjects);

watch(materialCreationMode, () => { materialAiPreview.value = null; });
watch(() => [materialForm.title, materialForm.content, materialAiForm.topic, materialAiForm.slide_count, materialAiForm.learning_goals, materialAiForm.additional_instructions], () => {
  if (materialCreationMode.value === "ai-pptx") materialAiPreview.value = null;
});

watch(subjectError, (value) => {
  if (value) pushToast({ title: "Gagal Memuat", message: value, type: "error" });
});
watch(message, (value) => {
  if (value) pushToast({ title: isError.value ? "Gagal" : "Berhasil", message: value, type: isError.value ? "error" : "success" });
});
</script>

<style scoped>
.learning-teacher-page :deep(.text-3xl) {
  font-size: 1.25rem !important;
  line-height: 1.6rem !important;
}

.learning-teacher-page :deep(.text-2xl) {
  font-size: 1.125rem !important;
  line-height: 1.5rem !important;
}

.learning-teacher-page :deep(.text-xl) {
  font-size: 1rem !important;
  line-height: 1.4rem !important;
}

.learning-teacher-page :deep(.text-lg) {
  font-size: 0.9375rem !important;
  line-height: 1.35rem !important;
}

.learning-teacher-page :deep(.text-base) {
  font-size: 0.875rem !important;
  line-height: 1.3rem !important;
}

.learning-teacher-page :deep(.text-sm) {
  font-size: 0.8125rem !important;
  line-height: 1.2rem !important;
}

.learning-teacher-page :deep(.text-xs) {
  font-size: 0.75rem !important;
  line-height: 1rem !important;
}

.modal-shell {
  transform: scale(0.96);
  transform-origin: center top;
}

@media (max-width: 640px) {
  .modal-shell {
    transform: scale(1);
  }
}
</style>
