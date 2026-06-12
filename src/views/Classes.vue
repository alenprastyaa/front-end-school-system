<template>
  <div
    class="min-h-screen bg-slate-50/50 pb-12 pt-4 font-sans text-slate-900 md:px-8 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto  space-y-6">

      <section class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Kelas</h1>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button @click="openQuickGenerateModal"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-500">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 6.75V15m6-6v8.25m.503-12.462l1.95 1.95m0 0l-1.95 1.95m1.95-1.95H4.5m3.997 11.462l-1.95-1.95m0 0l1.95-1.95m-1.95 1.95H19.5" />
              </svg>
              Generate Cepat
            </button>
            <button @click="openCreateModal"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Tambah Kelas
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="min-w-0">
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Master Tingkat Kelas</h2>
            <div class="mt-3 flex flex-wrap gap-2">
              <span v-for="level in classLevels" :key="level.id"
                class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {{ level.name }}
                <button type="button" @click="deleteClassLevel(level)" :disabled="deletingLevelId === level.id"
                  class="rounded p-0.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-500/10"
                  title="Hapus tingkat">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              <span v-if="classLevels.length === 0" class="text-sm text-slate-500">Belum ada tingkat kelas.</span>
            </div>
          </div>
          <form @submit.prevent="createClassLevel" class="flex w-full gap-2 sm:w-auto">
            <input v-model="newLevelName" type="text" placeholder="Contoh: 10"
              class="min-w-0 flex-1 rounded-lg border-0 px-3 py-2.5 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:w-40 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            <button type="submit" :disabled="isSavingLevel"
              class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900">
              {{ isSavingLevel ? "Menyimpan..." : "Tambah" }}
            </button>
          </form>
        </div>
      </section>

      <main
        class="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          class="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Daftar Kelas</h2>
            <p class="mt-1 text-sm text-slate-500">Data live dari backend.</p>
          </div>
          <button @click="loadClasses"
            class="inline-flex h-9 items-center justify-center rounded-lg bg-slate-50 px-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead
              class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                  <button @click="handleSort('class_name')"
                    class="group flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                    Nama Kelas <span class="text-slate-300 transition group-hover:text-slate-500">{{
                      sortIndicator('class_name') }}</span>
                  </button>
                </th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Tingkat</th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                  <button @click="handleSort('wali_guru_name')"
                    class="group flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                    Wali Kelas <span class="text-slate-300 transition group-hover:text-slate-500">{{
                      sortIndicator('wali_guru_name') }}</span>
                  </button>
                </th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Jurusan</th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">Email Wali</th>
                <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">No. HP Wali</th>
                <th class="border-b border-slate-200 px-6 py-4 text-right font-semibold dark:border-slate-800">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <template v-if="pageLoading">
                <tr v-for="n in 6" :key="`class-sk-${n}`">
                  <td v-for="c in 7" :key="`class-sk-${n}-${c}`" class="px-6 py-4">
                    <div class="skeleton-shimmer h-4 rounded" :class="c === 1 ? 'w-28' : 'w-20'"></div>
                  </td>
                </tr>
              </template>
              <tr v-for="item in paginatedClasses" v-show="!pageLoading" :key="item.id"
                class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">{{ item.class_name }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.class_level_name || "-" }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.wali_guru_name || "-" }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.major_code || "-" }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.wali_guru_email || "-" }}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ item.wali_guru_phone_number || "-" }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="startEdit(item)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700">
                      <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                      Edit
                    </button>
                    <button @click="openDeleteModal(item)"
                      class="inline-flex items-center justify-center rounded-lg bg-white p-1.5 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      title="Hapus Kelas">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!pageLoading && classes.length === 0">
                <td colspan="7" class="px-6 py-16 text-center">
                  <div class="mx-auto flex max-w-sm flex-col items-center">
                    <div
                      class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-900 dark:text-white">Belum Ada Kelas</span>
                    <span class="mt-1 text-sm text-slate-500">Silakan buat kelas baru menggunakan tombol Tambah
                      Kelas.</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Menampilkan {{ paginatedClasses.length }} dari {{ totalClasses }} kelas
          </div>
          <nav aria-label="Pagination" class="flex items-center">
            <ul class="flex list-none overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <li>
                <button @click="goToPrevPage" :disabled="currentPage === 1"
                  class="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-slate-200 dark:hover:bg-slate-800">
                  Prev
                </button>
              </li>
              <li v-if="currentPage > 1">
                <button @click="goToPrevPage"
                  class="border-l border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  {{ currentPage - 1 }}
                </button>
              </li>
              <li>
                <span class="border-l border-slate-200 bg-sky-600 px-4 py-2 text-sm font-semibold text-white dark:border-slate-700">
                  {{ currentPage }}
                </span>
              </li>
              <li v-if="currentPage < totalPages">
                <button @click="goToNextPage"
                  class="border-l border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  {{ currentPage + 1 }}
                </button>
              </li>
              <li>
                <button @click="goToNextPage" :disabled="currentPage >= totalPages"
                  class="border-l border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </main>
    </div>

    <!-- Modal Form Tambah/Edit Kelas -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div
            class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">
              {{ editingClassId ? "Edit Kelas" : "Tambah Kelas Baru" }}
            </h2>
            <button @click="closeModal"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitClass" class="space-y-5 p-6">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tingkat Kelas</label>
              <select v-model="classLevelId"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option value="">Tanpa tingkat</option>
                <option v-for="level in classLevels" :key="level.id" :value="level.id">
                  {{ level.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Rombel <span
                  class="text-rose-500">*</span></label>
              <input v-model="className" type="text" required :placeholder="classLevelId ? 'Contoh: AK 1 / DKV 2' : 'Contoh: 10 AK 1'"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Preview: <span class="font-semibold text-slate-700 dark:text-slate-200">{{ classNamePreview || "-" }}</span>
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Wali Kelas</label>
              <select v-model="waliGuruId"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option value="">Belum ditentukan</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.full_name || teacher.username }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jurusan</label>
              <select v-model="majorId"
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option value="">Tanpa jurusan</option>
                <option v-for="major in majors" :key="major.id" :value="major.id">
                  {{ major.code }} - {{ major.name }}
                </option>
              </select>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button type="button" @click="closeModal"
                class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60">
                <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                {{ isSubmitting ? "Menyimpan..." : editingClassId ? "Simpan Perubahan" : "Tambah Kelas" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal Generate Cepat Kelas -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showQuickGenerateModal"
        class="fixed inset-0 z-[260] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div
            class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Generate Kelas Cepat</h2>
            <button @click="closeQuickGenerateModal" :disabled="isGeneratingClasses"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitQuickGenerate" class="space-y-5 p-6">
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
                  <tr>
                    <th class="px-4 py-3 font-semibold">Tingkat</th>
                    <th class="px-4 py-3 font-semibold">Jurusan</th>
                    <th class="px-4 py-3 font-semibold">Nama Rombel</th>
                    <th class="px-4 py-3 font-semibold">Jumlah</th>
                    <th class="px-4 py-3 font-semibold">Preview</th>
                    <th class="px-4 py-3 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="(row, index) in quickGenerateRows" :key="row.key">
                    <td class="px-4 py-3">
                      <select v-model="row.class_level_id"
                        class="w-28 rounded-lg border-0 py-2 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                        <option value="">Pilih</option>
                        <option v-for="level in classLevels" :key="level.id" :value="level.id">
                          {{ level.name }}
                        </option>
                      </select>
                    </td>
                    <td class="px-4 py-3">
                      <select v-model="row.major_id" @change="syncQuickGenerateMajor(row)"
                        class="w-44 rounded-lg border-0 py-2 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                        <option value="">Tanpa jurusan</option>
                        <option v-for="major in majors" :key="major.id" :value="major.id">
                          {{ major.code }} - {{ major.name }}
                        </option>
                      </select>
                    </td>
                    <td class="px-4 py-3">
                      <input v-model="row.base_name" type="text" placeholder="Contoh: DKV"
                        class="w-44 rounded-lg border-0 px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                    </td>
                    <td class="px-4 py-3">
                      <input v-model.number="row.count" type="number" min="1" max="50"
                        class="w-24 rounded-lg border-0 px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                    </td>
                    <td class="min-w-[220px] px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {{ quickGeneratePreview(row) || "-" }}
                    </td>
                    <td class="px-4 py-3 text-right">
                      <button type="button" @click="removeQuickGenerateRow(index)"
                        :disabled="quickGenerateRows.length === 1 || isGeneratingClasses"
                        class="rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-rose-300 dark:hover:bg-rose-500/10">
                        Hapus
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button type="button" @click="addQuickGenerateRow" :disabled="isGeneratingClasses"
              class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Tambah Pola
            </button>

            <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button type="button" @click="closeQuickGenerateModal" :disabled="isGeneratingClasses"
                class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </button>
              <button type="submit" :disabled="isGeneratingClasses"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60">
                <svg v-if="isGeneratingClasses" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7L21 9.348" />
                </svg>
                {{ isGeneratingClasses ? "Membuat..." : "Generate Kelas" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal Konfirmasi Hapus Kelas -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div class="flex items-start gap-4 px-6 py-5">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Hapus Kelas?</h2>
              <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Kelas
                <span class="font-semibold text-slate-700 dark:text-slate-200">{{ classToDelete?.class_name || "-"
                  }}</span>
                akan dihapus. Siswa di kelas ini akan kehilangan data kelasnya. Tindakan ini tidak bisa dibatalkan.
              </p>
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <button type="button" @click="closeDeleteModal"
              class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Batal
            </button>
            <button type="button" @click="confirmDeleteClass" :disabled="isDeletingClass"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60">
              <svg v-if="isDeletingClass" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {{ isDeletingClass ? "Menghapus..." : "Ya, Hapus" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <SuccessModal ref="successModal" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { pushToast } from "@/composables/useToast";
import SuccessModal from "@/components/SuccessModal.vue";
import { useClassStore } from "@/store/classes";
import { storeToRefs } from "pinia";

const successModal = ref(null);
const pageLoading = ref(true);
const classStore = useClassStore();
const {
  form: classesForm,
  classes,
  classesTeachers: teachers,
  majors,
  classLevels,
  newLevelName,
  isSavingLevel,
  deletingLevelId,
  showQuickGenerateModal,
  isGeneratingClasses,
  quickGenerateRows,
  classesPage: currentPage,
  classesPageSize: pageSize,
  classesTotal: totalClasses,
  editingId: editingClassId,
  showModal,
  isSubmitting,
  deleteModalOpen: isDeleteModalOpen,
  isDeleting: isDeletingClass,
  toDelete: classToDelete,
  paginatedClasses,
  totalPages,
  sortKey,
  sortDirection,
  classNamePreview,
} = storeToRefs(classStore);

const className = computed({
  get: () => classesForm.value.className,
  set: (value) => {
    classesForm.value.className = value;
  },
});

const classLevelId = computed({
  get: () => classesForm.value.classLevelId,
  set: (value) => {
    classesForm.value.classLevelId = value;
  },
});
const quickGeneratePreview = (row) => classStore.quickGeneratePreview(row);
const addQuickGenerateRow = () => classStore.addQuickGenerateRow();
const removeQuickGenerateRow = (index) => classStore.removeQuickGenerateRow(index);
const openQuickGenerateModal = () => classStore.openQuickGenerateModal();
const closeQuickGenerateModal = () => classStore.closeQuickGenerateModal();
const syncQuickGenerateMajor = (row) => classStore.syncQuickGenerateMajor(row);
const submitQuickGenerate = async () => {
  try {
    const response = await classStore.submitQuickGenerate();
    if (!response) return;
    const created = Number(response?.data?.created || 0);
    const skipped = Number(response?.data?.skipped || 0);
    successModal.value?.show(`Generate selesai. ${created} kelas dibuat${skipped ? `, ${skipped} kelas sudah ada` : ""}.`);
  } catch {
    // error toast handled in store
  }
};

const waliGuruId = computed({
  get: () => classesForm.value.waliGuruId,
  set: (value) => {
    classesForm.value.waliGuruId = value;
  },
});

const majorId = computed({
  get: () => classesForm.value.majorId,
  set: (value) => {
    classesForm.value.majorId = value;
  },
});

const handleSort = (key) => {
  classStore.toggleSort(key);
};

const goToPrevPage = () => {
  classStore.goToPage(Number(currentPage.value) - 1);
};

const goToNextPage = () => {
  classStore.goToPage(Number(currentPage.value) + 1);
};

const sortIndicator = (key) => {
  if (sortKey.value !== key) return "↕";
  return sortDirection.value === "asc" ? "▲" : "▼";
};

const loadClasses = () => classStore.loadClasses();
const loadTeachers = () => classStore.loadTeachers();
const loadMajors = () => classStore.loadMajors();
const loadClassLevels = () => classStore.loadClassLevels();
const createClassLevel = async () => {
  try {
    const response = await classStore.createClassLevel();
    if (!response) return;
    successModal.value?.show(response?.message || "Tingkat kelas berhasil dibuat");
  } catch {}
};
const deleteClassLevel = async (level) => {
  try {
    const response = await classStore.deleteClassLevel(level);
    if (!response) return;
    successModal.value?.show(response?.message || "Tingkat kelas berhasil dihapus");
  } catch {}
};
const resetForm = () => classStore.resetForm();
const closeModal = () => classStore.closeModal();
const openCreateModal = () => classStore.openCreateModal();
const startEdit = (item) => classStore.startEdit(item);
const openDeleteModal = (item) => classStore.openDeleteModal(item);
const closeDeleteModal = () => classStore.closeDeleteModal();
const confirmDeleteClass = async () => {
  const response = await classStore.deleteClass();
  if (response) {
    successModal.value.show(response?.message || "Kelas berhasil dihapus");
  }
};
const submitClass = async () => {
  const isEditing = !!editingClassId.value;
  const response = await classStore.saveClass();
  if (response) {
    successModal.value.show(response?.message || (isEditing ? "Kelas berhasil diupdate" : "Kelas berhasil dibuat"));
  }
};

onMounted(async () => {
  try {
    await classStore.initialize();
  } finally {
    pageLoading.value = false;
  }
});
</script>
