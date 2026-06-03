<template>
  <!-- Layout Utama: Sidebar di Kiri, Konten di Kanan (Desktop) -->
  <div
    class="learning-teacher-page min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">

    <main class="min-h-screen">
      <section class="border-b border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-4 md:px-6">
        <div class="flex flex-col gap-1">
          <h1 class="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Papan Kelas</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Pilih kelas yang ingin dikelola</p>
        </div>

        <nav class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          <button v-for="item in subjects" :key="item.id" @click="selectSubject(item)"
            class="group relative flex min-w-0 flex-col items-start overflow-hidden rounded-xl p-2.5 text-left transition-all sm:rounded-2xl sm:p-3.5"
            :class="selectedSubject?.id === item.id
              ? 'bg-sky-600 shadow-md ring-1 ring-sky-600 dark:bg-sky-500'
              : 'bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80'">
            <span :class="selectedSubject?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'"
              class="line-clamp-2 text-xs font-semibold tracking-tight sm:text-sm">{{ item.name }}</span>
            <span :class="selectedSubject?.id === item.id ? 'text-sky-200' : 'text-slate-500 dark:text-slate-400'"
              class="mt-1 text-[11px] font-medium sm:text-xs">
              {{ item.class_name }}
            </span>
            <div v-if="selectedSubject?.id === item.id"
              class="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] sm:right-4 sm:top-4 sm:h-2 sm:w-2"></div>
          </button>
        </nav>
      </section>

      <div v-if="selectedSubject">
        <!-- HEADER KELAS -->
        <header class="border-b border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4 md:p-6">
          <h2 class="line-clamp-2 text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">{{ selectedSubject.name }}</h2>
          <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300 sm:mt-2 sm:text-sm">
            {{ selectedSubject.class_name }} &bull; {{ selectedSubject.description || "Tidak ada deksripsi khusus." }}
          </p>

          <!-- TAB SIMPEL -->
          <div class="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-row sm:gap-3">
            <button @click="switchTab('materials')" type="button"
              class="inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all sm:flex-1 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
              :class="activeTab === 'materials'
                ? 'border-sky-600 bg-sky-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'">
              <Icon icon="ph:book-open-text" class="h-4 w-4" />
              Materi
            </button>

            <button @click="switchTab('assignments')" type="button"
              class="inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all sm:flex-1 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
              :class="activeTab === 'assignments'
                ? 'border-sky-600 bg-sky-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'">
              <Icon icon="ph:clipboard-text" class="h-4 w-4" />
              Tugas
            </button>
          </div>
        </header>

        <!-- KONTEN: MATERI -->
        <div v-if="activeTab === 'materials'" class="p-3 sm:p-4 md:p-6">
          <div class="mb-3 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Daftar Materi</h3>
            <div class="flex flex-col gap-3 sm:flex-row">
              <button @click="openMaterialModal('manual')"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm">
                <Icon icon="ph:plus" class="h-4 w-4" />
                Tambah Materi
              </button>
            </div>
          </div>

          <div class="space-y-2 md:hidden">
            <article v-for="item in materials" :key="item.id"
              class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h4 class="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{{ item.title }}</h4>
                  <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {{ formatDateTime(item.created_at) }}
                  </p>
                </div>
                <span
                  class="shrink-0 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                  Materi
                </span>
              </div>

              <p class="mt-2 line-clamp-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
                {{ item.content || "Tidak ada deksripsi khusus." }}
              </p>

              <div class="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                  rel="noreferrer"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-700 bg-blue-50 text-blue-800 transition hover:bg-blue-100 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                  title="Buka lampiran" aria-label="Buka lampiran">
                  <Icon icon="ph:paperclip" class="h-4 w-4" />
                </a>
                <span v-else class="text-[11px] text-slate-400 dark:text-slate-500">Tanpa lampiran</span>

                <div class="flex shrink-0 justify-end gap-1.5">
                  <button @click="openMaterialEditModal(item)"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    title="Edit materi" aria-label="Edit materi">
                    <Icon icon="ph:pencil-simple" class="h-4 w-4" />
                  </button>
                  <button @click="openDeleteModal('material', item)"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-700 bg-rose-600 text-white transition hover:bg-rose-700"
                    title="Hapus materi" aria-label="Hapus materi">
                    <Icon icon="ph:trash" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>

            <div v-if="materials.length === 0"
              class="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum Ada Materi</p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-500">Klik tombol "Tambah Materi" di atas.</p>
            </div>
          </div>

          <div
            class="hidden overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 sm:rounded-2xl md:block">
              <table class="w-full divide-y divide-slate-200 text-left text-xs dark:divide-slate-700 sm:text-sm">
                <thead class="bg-slate-50 dark:bg-slate-900/40">
                  <tr class="text-[10px] uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 sm:text-xs">
                    <th class="px-3 py-3 font-semibold sm:px-5 sm:py-4">Judul</th>
                    <th class="px-3 py-3 font-semibold sm:px-5 sm:py-4">Dipublikasi</th>
                    <th class="px-3 py-3 font-semibold sm:px-5 sm:py-4">Isi / Ringkasan</th>
                    <th class="px-3 py-3 font-semibold sm:px-5 sm:py-4">Lampiran</th>
                    <th class="px-3 py-3 font-semibold text-right sm:px-5 sm:py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr v-for="item in materials" :key="item.id"
                    class="align-top hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td class="px-3 py-3 sm:px-5 sm:py-4">
                      <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ item.title }}</div>
                    </td>
                    <td class="px-3 py-3 sm:px-5 sm:py-4">
                      <div class="text-xs text-slate-600 dark:text-slate-300 sm:text-sm">{{ formatDateTime(item.created_at) }}
                      </div>
                    </td>
                    <td class="px-3 py-3 sm:px-5 sm:py-4">
                      <p class="max-w-xl text-xs leading-5 text-slate-700 dark:text-slate-300 sm:text-sm sm:leading-6">
                        {{ item.content || "Tidak ada deksripsi khusus." }}
                      </p>
                    </td>
                    <td class="px-3 py-3 sm:px-5 sm:py-4">
                      <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                        rel="noreferrer"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-700 bg-blue-50 text-blue-800 transition hover:bg-blue-100 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                        title="Buka lampiran" aria-label="Buka lampiran">
                        <Icon icon="ph:paperclip" class="h-4 w-4" />
                      </a>
                      <span v-else class="text-xs text-slate-400 dark:text-slate-500">-</span>
                    </td>
                    <td class="px-3 py-3 sm:px-5 sm:py-4">
                      <div class="flex justify-end gap-1.5">
                        <button @click="openMaterialEditModal(item)"
                          class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          title="Edit materi" aria-label="Edit materi">
                          <Icon icon="ph:pencil-simple" class="h-4 w-4" />
                        </button>
                        <button @click="openDeleteModal('material', item)"
                          class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-700 bg-rose-600 text-white transition hover:bg-rose-700"
                          title="Hapus materi" aria-label="Hapus materi">
                          <Icon icon="ph:trash" class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="materials.length === 0">
                    <td colspan="5" class="px-5 py-10 text-center sm:py-14">
                      <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum Ada Materi</p>
                      <p class="mt-2 text-xs text-slate-500 dark:text-slate-500 sm:text-sm">Silakan klik tombol "Tambah Materi" di
                        atas.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>

        <!-- KONTEN: TUGAS & PENILAIAN -->
        <div v-if="activeTab === 'assignments'" class="p-3 sm:p-4 md:p-6">

          <!-- State 1: Daftar Tugas -->
          <div v-if="!gradingAssignment">
            <div class="mb-3 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
              <h3 class="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Daftar Tugas & Ujian</h3>
              <button @click="assignmentModalOpen = true"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm">
                <Icon icon="ph:plus" class="h-4 w-4" />
                Buat Tugas
              </button>
            </div>

            <!-- Filter -->
            <div
              class="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 sm:mb-5 sm:rounded-2xl sm:p-4 md:p-6">
              <div class="grid gap-2 sm:gap-3 md:grid-cols-3">
                <input v-model="assignmentSearch" type="text" placeholder="Cari nama tugas..."
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm" />
                <select v-model="assignmentTypeFilter"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm">
                  <option value="ALL">Tampilkan Semua</option>
                  <option value="FILE">Tugas Kumpul Online</option>
                  <option value="MANUAL">Tugas Penilaian Langsung</option>
                </select>
                <select v-model="assignmentSort"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm">
                  <option value="NEWEST">Paling Baru Dibuat</option>
                  <option value="DUE_ASC">Batas Waktu Terdekat</option>
                  <option value="DUE_DESC">Batas Waktu Terjauh</option>
                </select>
              </div>
            </div>

            <!-- List Tugas -->
            <div class="space-y-2 md:hidden">
              <article v-for="item in filteredAssignments" :key="item.id"
                class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <h4 class="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{{ item.title }}</h4>
                    <div class="mt-2 flex flex-wrap gap-1.5">
                      <span
                        class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <Icon icon="ph:clock" class="h-3.5 w-3.5" />
                        {{ formatDateTime(item.due_date) }}
                      </span>
                      <span
                        class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                        <Icon icon="ph:users-three" class="h-3.5 w-3.5" />
                        {{ item.submission_count ?? item.submissions?.length ?? 0 }} siswa
                      </span>
                    </div>
                  </div>
                  <span
                    class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    :class="assignmentTypeBadgeClass(item.assignment_type)">
                    {{ assignmentTypeLabel(item.assignment_type) }}
                  </span>
                </div>

                <p class="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                  {{ item.description || "Tidak ada instruksi tambahan." }}
                </p>

                <div class="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                    rel="noreferrer"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-700 bg-blue-50 text-blue-800 transition hover:bg-blue-100 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                    title="Buka lampiran" aria-label="Buka lampiran">
                    <Icon icon="ph:paperclip" class="h-4 w-4" />
                  </a>
                  <span v-else class="text-[11px] text-slate-400">Tanpa lampiran</span>

                  <div class="flex shrink-0 justify-end gap-1.5">
                    <button @click="loadSubmissions(item)" type="button"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-700 bg-blue-600 text-white transition hover:bg-blue-700"
                      title="Beri nilai" aria-label="Beri nilai">
                      <Icon icon="ph:exam" class="h-4 w-4" />
                    </button>
                    <button @click="openAssignmentEditModal(item)" type="button"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      title="Edit tugas" aria-label="Edit tugas">
                      <Icon icon="ph:pencil-simple" class="h-4 w-4" />
                    </button>
                    <button @click="openDeleteModal('assignment', item)" type="button"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-700 bg-rose-600 text-white transition hover:bg-rose-700"
                      title="Hapus tugas" aria-label="Hapus tugas">
                      <Icon icon="ph:trash" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>

              <div v-if="filteredAssignments.length === 0"
                class="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900">
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum Ada Tugas</p>
                <p class="mt-1 text-xs text-slate-500">Tugas yang Anda buat akan muncul di sini.</p>
              </div>
            </div>

            <div
              class="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl md:block">
              <table class="w-full text-left text-xs sm:text-sm">
                <thead
                  class="bg-slate-50 text-[10px] uppercase tracking-[0.1em] text-slate-500 dark:bg-slate-800/60 dark:text-slate-300 sm:text-xs">
                  <tr>
                    <th class="px-3 py-3 font-semibold sm:px-5 sm:py-4">Tugas / Ujian</th>
                    <th class="px-3 py-3 font-semibold sm:px-5 sm:py-4">Tenggat</th>
                    <th class="px-3 py-3 font-semibold sm:px-5 sm:py-4">Terkumpul</th>
                    <th class="px-3 py-3 font-semibold sm:px-5 sm:py-4">Lampiran</th>
                    <th class="px-3 py-3 font-semibold text-right sm:px-5 sm:py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="item in filteredAssignments" :key="item.id"
                    class="align-top hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td class="px-3 py-3 sm:px-5 sm:py-4">
                      <div class="font-semibold text-slate-900 dark:text-white">{{ item.title }}</div>
                    </td>
                    <td class="px-3 py-3 text-xs text-slate-700 dark:text-slate-300 sm:px-5 sm:py-4 sm:text-sm">
                      {{ formatDateTime(item.due_date) }}
                    </td>
                    <td class="px-3 py-3 text-xs font-semibold text-blue-700 dark:text-blue-400 sm:px-5 sm:py-4 sm:text-sm">
                      {{ item.submission_count ?? item.submissions?.length ?? 0 }} Siswa
                    </td>
                    <td class="px-3 py-3 text-xs sm:px-5 sm:py-4 sm:text-sm">
                      <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                        rel="noreferrer"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-700 bg-blue-50 text-blue-800 transition hover:bg-blue-100 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                        title="Buka lampiran" aria-label="Buka lampiran">
                        <Icon icon="ph:paperclip" class="h-4 w-4" />
                      </a>
                      <span v-else class="text-slate-400">-</span>
                    </td>
                    <td class="px-3 py-3 text-right sm:px-5 sm:py-4">
                      <div class="relative inline-block">
                        <button @click="toggleAssignmentActions(item.id, $event)" type="button"
                          class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          title="Aksi tugas" aria-label="Aksi tugas">
                          <Icon icon="ph:dots-three-vertical-bold" class="h-4 w-4" />
                        </button>

                        <div v-if="openAssignmentActionId === item.id"
                          class="fixed z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                          :style="assignmentActionMenuStyle">
                          <button @click="handleAssignmentAction('grade', item)" type="button"
                            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-blue-700 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10">
                            <Icon icon="ph:exam" class="h-4 w-4" />
                            Beri Nilai
                          </button>
                          <button @click="handleAssignmentAction('edit', item)" type="button"
                            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                            <Icon icon="ph:pencil-simple" class="h-4 w-4" />
                            Edit
                          </button>
                          <button @click="handleAssignmentAction('delete', item)" type="button"
                            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">
                            <Icon icon="ph:trash" class="h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                        <button v-if="openAssignmentActionId === item.id" type="button"
                          class="fixed inset-0 z-40 cursor-default" @click="closeAssignmentActions"></button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="filteredAssignments.length === 0">
                    <td colspan="5" class="px-5 py-10 text-center sm:py-14">
                      <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum Ada Tugas</p>
                      <p class="mt-2 text-xs text-slate-500 sm:text-sm">Tugas yang Anda buat akan muncul di sini.</p>
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
              class="mb-3 inline-flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 sm:mb-5 sm:rounded-xl sm:px-4 sm:text-sm">
              <Icon icon="ph:arrow-left" class="h-4 w-4" />
              Kembali
            </button>

            <div
              class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl">
              <div
                class="border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50 sm:p-4 md:p-6">
                <h3 class="line-clamp-2 text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Menilai: {{ gradingAssignment.title }}
                </h3>

                <div class="mt-3 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:gap-3">
                  <input v-model="submissionSearch" type="text" placeholder="Cari nama siswa..."
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:max-w-xs sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm" />
                  <select v-model="submissionFilter"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:max-w-xs sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm">
                    <option value="ALL">Semua Siswa</option>
                    <option value="UNGRADED">Belum Dinilai</option>
                    <option value="GRADED">Sudah Dinilai</option>
                  </select>
                </div>
              </div>

              <div class="space-y-2 p-3 md:hidden">
                <article v-for="item in filteredSubmissions" :key="item.id"
                  class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <h4 class="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{{ item.student_name }}</h4>
                      <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Waktu: {{ formatDateTime(item.submitted_at) }}
                      </p>
                    </div>
                    <span v-if="item.scoreDraft !== '' && item.scoreDraft !== null"
                      class="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {{ item.scoreDraft }}/100
                    </span>
                  </div>

                  <div class="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/70">
                    <p v-if="item.submission_text" class="line-clamp-4 text-xs leading-5 text-slate-700 dark:text-slate-300">
                      {{ item.submission_text }}
                    </p>
                    <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                      rel="noreferrer"
                      class="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300">
                      <Icon icon="ph:file" class="h-4 w-4" />
                      File Jawaban
                    </a>
                    <span v-else-if="item.assignment_type === 'MANUAL'"
                      class="inline-flex rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
                      Penilaian Langsung
                    </span>
                    <span v-else class="text-xs italic text-slate-500">Belum mengumpulkan file</span>
                  </div>

                  <div class="mt-3 grid gap-2">
                    <input v-model="item.scoreDraft" type="number" min="0" max="100" step="0.01"
                      placeholder="Nilai"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                    <textarea v-model="item.feedbackDraft" rows="2" placeholder="Catatan (opsional)"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"></textarea>
                    <button @click="submitGrade(item)"
                      class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
                      <Icon icon="ph:floppy-disk" class="h-4 w-4" />
                      Simpan
                    </button>
                  </div>
                </article>

                <div v-if="filteredSubmissions.length === 0"
                  class="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900">
                  Tidak ada siswa yang sesuai dengan pencarian Anda.
                </div>
              </div>

              <!-- Tabel Nilai Desktop -->
              <div class="hidden md:block">
                <table class="w-full text-left text-xs sm:text-sm">
                  <thead class="bg-slate-100 dark:bg-slate-800">
                    <tr class="text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
                      <th class="border-b border-slate-200 px-3 py-3 font-semibold dark:border-slate-700 sm:px-5 sm:py-4">Nama Siswa</th>
                      <th class="border-b border-slate-200 px-3 py-3 font-semibold dark:border-slate-700 sm:px-5 sm:py-4">Jawaban / File
                      </th>
                      <th class="w-40 border-b border-slate-200 px-3 py-3 font-semibold dark:border-slate-700 sm:w-48 sm:px-5 sm:py-4">Nilai
                        (0-100)</th>
                      <th class="border-b border-slate-200 px-3 py-3 font-semibold dark:border-slate-700 sm:px-5 sm:py-4">Pesan / Koreksi
                      </th>
                      <th
                        class="w-24 border-b border-slate-200 px-3 py-3 text-center font-semibold dark:border-slate-700 sm:w-32 sm:px-5 sm:py-4">
                        Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y-2 divide-slate-100 dark:divide-slate-800">
                    <tr v-for="item in filteredSubmissions" :key="item.id"
                      class="hover:bg-blue-50/50 dark:hover:bg-slate-800/50">

                      <td class="px-3 py-3 align-top sm:px-5 sm:py-4">
                        <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ item.student_name }}</div>
                        <div class="mt-1 text-xs text-slate-500">Waktu: {{ formatDateTime(item.submitted_at) }}</div>
                      </td>

                      <td class="px-3 py-3 align-top sm:px-5 sm:py-4">
                        <p v-if="item.submission_text"
                          class="mb-2 max-w-sm text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
                          {{ item.submission_text }}
                        </p>
                        <a v-if="item.attachment_url" :href="normalizePublicUrl(item.attachment_url)" target="_blank"
                          rel="noreferrer"
                          class="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300">
                          <Icon icon="ph:file" class="h-4 w-4" />
                          File Jawaban
                        </a>
                        <span v-else-if="item.assignment_type === 'MANUAL'"
                          class="inline-flex rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
                          Penilaian Langsung
                        </span>
                        <span v-else class="text-xs italic text-slate-500">Belum mengumpulkan file</span>
                      </td>

                      <td class="px-3 py-3 align-top sm:px-5 sm:py-4">
                        <input v-model="item.scoreDraft" type="number" min="0" max="100" step="0.01"
                          placeholder="Kosong"
                          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                      </td>

                      <td class="px-3 py-3 align-top sm:px-5 sm:py-4">
                        <textarea v-model="item.feedbackDraft" rows="2" placeholder="Tulis catatan (Opsional)..."
                          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:text-sm"></textarea>
                      </td>

                      <td class="px-3 py-3 align-top text-center sm:px-5 sm:py-4">
                        <button @click="submitGrade(item)"
                          class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
                          title="Simpan nilai" aria-label="Simpan nilai">
                          <Icon icon="ph:floppy-disk" class="h-4 w-4" />
                        </button>
                      </td>
                    </tr>

                    <tr v-if="filteredSubmissions.length === 0">
                      <td colspan="5" class="py-12 text-center text-sm font-semibold text-slate-500 sm:py-20">
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
      <div v-else class="flex h-full flex-col items-center justify-center p-6 text-center sm:p-10">
        <div class="rounded-full bg-blue-100 p-5 dark:bg-blue-900/30 sm:p-7">
          <Icon icon="ph:book-open-text" class="h-10 w-10 text-blue-600 dark:text-blue-400 sm:h-14 sm:w-14" />
        </div>
        <h2 class="mt-5 text-lg font-semibold text-slate-900 dark:text-white sm:mt-7 sm:text-xl">Selamat Datang!</h2>
        <p class="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">Silakan klik salah satu kelas di papan atas
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

              <div
                class="space-y-2 rounded-lg border-2 border-slate-300 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/80">
                <label
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Upload
                  file
                  (jika ada)</label>
                <input type="file" @change="handleMaterialFile"
                  class="block w-full text-sm text-slate-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800 dark:text-slate-300" />
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button :disabled="isSavingMaterial" type="submit"
                  class="rounded-md border border-blue-800 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                  {{ isSavingMaterial ? "Menyimpan..." : "Simpan Materi" }}
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
          class="modal-shell flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border-2 border-slate-500 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-600 dark:bg-slate-900"
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
          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">
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
import { Icon } from "@iconify/vue";
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
