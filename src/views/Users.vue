<template>
  <div
    class="min-h-screen bg-slate-50/70 pb-12 pt-4 font-sans text-slate-900 md:px-6 md:pt-8 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto max-w-[1440px] space-y-6">
      <section
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div class="max-w-3xl">
            <h1 class="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Manajemen Siswa
            </h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Kelola data siswa, pencarian akun, perpindahan kelas, dan kontak orang tua dari satu halaman yang lebih
              rapi.
            </p>
          </div>
          <div class="grid gap-3 sm:grid-cols-2 xl:min-w-[440px] xl:max-w-[500px] xl:grid-cols-2">
            <button @click="openCreateModal"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Tambah Siswa
            </button>
            <button @click="openPromotionModal"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
              Naik Kelas
            </button>
            <button @click="openStudentImportPicker" :disabled="isImportingStudents"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-900 bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-700 dark:hover:bg-slate-600">
              {{ isImportingStudents ? "Mengimpor..." : "Upload Excel Siswa" }}
            </button>
            <button @click="openStudentTemplateModal"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-yellow-200 bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              Template Siswa
            </button>
          </div>
        </div>
      </section>

      <div>
        <main
          class="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-col gap-5 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Direktori Siswa</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {{ studentDirectoryDescription }}
                </p>
              </div>
              <div
                class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                <span class="font-semibold text-slate-900 dark:text-white">{{ displayedStudents.length }}</span>
                siswa tampil dari
                <span class="font-semibold text-slate-900 dark:text-white">{{ students.length }}</span>
                siswa pada halaman ini
              </div>
            </div>

            <div class="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.9fr)_180px_120px]">
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="m21 21-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input v-model.trim="searchQuery" type="text"
                  placeholder="Cari nama siswa, username, kelas, email ortu, atau no. HP"
                  class="block w-full rounded-2xl border-0 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 transition placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              </div>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                  </svg>
                </div>
                <select v-model="filters.class_id" @change="handleClassFilterChange"
                  class="block w-full rounded-2xl border-0 bg-white py-3 pl-11 pr-9 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                  <option value="">Semua Kelas</option>
                  <option v-for="item in classOptions" :key="item.id" :value="item.id">
                    {{ item.class_name }}
                  </option>
                </select>
              </div>
              <select v-model.number="filters.limit" @change="handleLimitChange"
                class="rounded-2xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option :value="10">10 / halaman</option>
                <option :value="25">25 / halaman</option>
                <option :value="50">50 / halaman</option>
              </select>
              <button @click="loadStudents"
                class="inline-flex h-[50px] items-center justify-center rounded-2xl bg-white px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800">
                Refresh
              </button>
            </div>
          </div>

          <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Kelas: {{ activeClassLabel }}
              </span>
              <span
                class="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                Pencarian: {{ searchQuery ? `“${searchQuery}”` : "semua data pada halaman ini" }}
              </span>
            </div>
          </div>

          <div class="block space-y-4 p-4 md:hidden">
            <article v-for="item in displayedStudents" :key="`card-${item.id}`"
              class="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div class="flex items-start justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                    {{ studentInitial(item) }}
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">{{ item.full_name || "-" }}
                    </p>
                    <p class="truncate text-xs text-slate-500 dark:text-slate-400">@{{ item.username }}</p>
                  </div>
                </div>
                <span
                  class="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {{ item.class_name || "Belum ada kelas" }}
                </span>
              </div>
              <div class="mt-4 grid gap-3 rounded-2xl bg-slate-50/80 p-3 text-sm dark:bg-slate-800/70">
                <div>
                  <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Email Ortu</p>
                  <p class="mt-1 break-all text-slate-700 dark:text-slate-200">{{ item.parent_email || "-" }}</p>
                </div>
                <div>
                  <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">No. HP</p>
                  <p class="mt-1 text-slate-700 dark:text-slate-200">{{ item.phone_number || "Tanpa nomor telepon" }}
                  </p>
                </div>
              </div>
              <div class="mt-4 flex items-center gap-2">
                <button @click="startEdit(item)"
                  class="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-slate-700">
                  Edit Data
                </button>
                <button @click="openDeleteModal(item)"
                  class="inline-flex items-center justify-center rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:border-rose-500/20 dark:text-rose-300">
                  Hapus
                </button>
              </div>
            </article>

            <div v-if="displayedStudents.length === 0"
              class="rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/80">
              <div
                class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ emptyStateTitle }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ emptyStateMessage }}</p>
            </div>
          </div>

          <div class="hidden overflow-x-auto md:block">
            <table class="min-w-full text-left text-sm">
              <thead
                class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                    <button @click="handleSort('full_name')"
                      class="group flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                      Nama Lengkap <span class="text-slate-300 transition group-hover:text-slate-500">{{
                        sortIndicator('full_name') }}</span>
                    </button>
                  </th>
                  <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                    <button @click="handleSort('username')"
                      class="group flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                      Username <span class="text-slate-300 transition group-hover:text-slate-500">{{
                        sortIndicator('username') }}</span>
                    </button>
                  </th>
                  <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                    <button @click="handleSort('class_name')"
                      class="group flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                      Kelas <span class="text-slate-300 transition group-hover:text-slate-500">{{
                        sortIndicator('class_name') }}</span>
                    </button>
                  </th>
                  <th class="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-800">
                    Kontak Ortu
                  </th>
                  <th class="border-b border-slate-200 px-6 py-4 text-right font-semibold dark:border-slate-800">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in displayedStudents" :key="item.id"
                  class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  :class="editingId === item.id ? 'bg-sky-50/50 dark:bg-sky-900/10' : ''">
                  <td class="px-6 py-4">
                    <div>
                      <span class="font-medium text-slate-900 dark:text-white">{{ item.full_name || "-" }}</span>
                      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">ID siswa #{{ item.id }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {{ item.username.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="font-medium text-slate-900 dark:text-white">{{ item.username }}</div>
                        <div class="text-xs text-sky-600 dark:text-sky-400">Username login</div>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <span
                      class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {{ item.class_name || "Belum ada kelas" }}
                    </span>
                  </td>

                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ item.parent_email || "-" }}
                    </div>
                    <div class="text-xs text-slate-500">{{ item.phone_number || "Tanpa No. HP" }}</div>
                  </td>

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
                        title="Hapus Siswa">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="displayedStudents.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center">
                    <div class="mx-auto flex flex-col items-center">
                      <div
                        class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ emptyStateTitle }}</span>
                      <span class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ emptyStateMessage }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Halaman {{ filters.page }} · Menampilkan {{ displayedStudents.length }} dari {{ students.length }} siswa ·
              Batas {{ filters.limit }} data per halaman
            </p>
            <div class="flex items-center gap-2">
              <button @click="goToPrevPage" :disabled="filters.page <= 1"
                class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Sebelumnya
              </button>
              <button @click="goToNextPage" :disabled="students.length < filters.limit"
                class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Berikutnya
              </button>
            </div>
          </div>
        </main>
      </div>

      <div v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
        <div
          class="w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div
            class="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div class="flex items-center gap-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <svg v-if="editingId" class="h-4 w-4 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                <svg v-else class="h-4 w-4 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.69-1.925 3.375 3.375 0 00-6.742 0A12.022 12.022 0 014 19.234z" />
                </svg>
              </div>
              <div>
                <h2 class="font-semibold text-slate-900 dark:text-white">
                  {{ editingId ? "Edit Data Siswa" : "Tambah Siswa Baru" }}
                </h2>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  {{ editingId ? "Perbarui data siswa dari dialog ini." : "Daftarkan siswa baru melalui dialog ini." }}
                </p>
              </div>
            </div>
            <button @click="closeModal"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="editingId ? updateStudent() : createStudent()" class="space-y-6 p-6">
            <div class="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
              <section
                class="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <div>
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Data Akun</h3>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Identitas utama yang dipakai untuk login
                    dan identifikasi siswa.</p>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap <span
                      class="text-rose-500">*</span></label>
                  <input v-model="form.full_name" type="text" required placeholder="e.g. Budi Santoso"
                    class="block w-full rounded-2xl border-0 py-3 pl-4 pr-4 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Username <span
                      class="text-rose-500">*</span></label>
                  <input v-model="form.username" type="text" required placeholder="e.g. budi_santoso"
                    class="block w-full rounded-2xl border-0 py-3 pl-4 pr-4 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  <p class="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">Gunakan username ini saat login
                    siswa.</p>
                </div>

                <div v-if="!editingId">
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password <span
                      class="text-rose-500">*</span></label>
                  <input v-model="form.password" type="password" required placeholder="••••••••"
                    class="block w-full rounded-2xl border-0 py-3 pl-4 pr-4 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
              </section>

              <section
                class="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Penempatan & Kontak</h3>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Pastikan kelas dan kontak wali terisi agar
                    tindak lanjut lebih mudah.</p>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Penempatan Kelas
                    <span class="text-rose-500">*</span></label>
                  <select v-model="form.class_id" required
                    class="block w-full rounded-2xl border-0 py-3 pl-4 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <option disabled value="">-- Pilih Rombongan Belajar --</option>
                    <option v-for="item in classOptions" :key="item.id" :value="item.id">
                      {{ item.class_name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Orang
                    Tua</label>
                  <input v-model="form.parent_email" type="email" placeholder="ortu@contoh.com"
                    class="block w-full rounded-2xl border-0 py-3 pl-4 pr-4 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nomor
                    Telepon</label>
                  <input v-model="form.phone_number" type="text" placeholder="08123456789"
                    class="block w-full rounded-2xl border-0 py-3 pl-4 pr-4 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
              </section>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeModal"
                class="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60 dark:bg-sky-600 dark:hover:bg-sky-500">
                <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <svg v-else-if="!editingId" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {{ isSubmitting ? "Menyimpan Data..." : editingId ? "Simpan Perubahan" : "Buat Akun Siswa" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Download Template Siswa -->
  <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isStudentTemplateModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
        @click.stop>
        <div
          class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Download Template Siswa</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Pilih kelas agar kolom Kelas otomatis terisi.</p>
          </div>
          <button @click="closeStudentTemplateModal"
            class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="downloadStudentTemplate" class="space-y-5 p-6">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kelas <span
                class="text-rose-500">*</span></label>
            <select v-model="studentTemplateClassId" required
              class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
              <option disabled value="">Pilih kelas</option>
              <option v-for="item in classOptions" :key="`template-${item.id}`" :value="item.id">
                {{ item.class_name }}
              </option>
            </select>
          </div>

          <div
            class="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-800 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
            File template akan khusus untuk kelas yang dipilih, sehingga admin cukup mengisi data siswa.
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button type="button" @click="closeStudentTemplateModal"
              class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Batal
            </button>
            <button type="submit"
              class="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500">
              Download
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>

  <!-- Modal Naik Kelas -->
  <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isPromotionModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
        @click.stop>
        <div
          class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Naik Kelas</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Pilih siswa yang naik kelas, siswa tidak
              dicentang tetap di kelas asal.</p>
          </div>
          <button @click="closePromotionModal"
            class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitPromotion" class="space-y-5 p-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kelas Asal <span
                  class="text-rose-500">*</span></label>
              <select v-model="promotionForm.from_class_id" required
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option disabled value="">Pilih kelas asal</option>
                <option v-for="item in classOptions" :key="`from-${item.id}`" :value="item.id">
                  {{ item.class_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kelas Tujuan <span
                  class="text-rose-500">*</span></label>
              <select v-model="promotionForm.to_class_id" required
                class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option disabled value="">Pilih kelas tujuan</option>
                <option v-for="item in classOptions" :key="`to-${item.id}`" :value="item.id"
                  :disabled="String(item.id) === String(promotionForm.from_class_id)">
                  {{ item.class_name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal Efektif</label>
            <input v-model="promotionForm.effective_date" type="date"
              class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Catatan</label>
            <textarea v-model="promotionForm.note" rows="3" placeholder="Contoh: Kenaikan kelas tahun ajaran baru"
              class="block w-full rounded-lg border-0 py-2.5 pl-3 pr-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"></textarea>
          </div>

          <div>
            <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Siswa yang Ikut Naik Kelas</h3>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {{ promotionSelectedCount }} dipilih · {{ promotionRetainedCount }} tinggal kelas
                </p>
              </div>
              <label v-if="promotionCandidates.length"
                class="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                <input type="checkbox" :checked="promotionAllSelected" @change="toggleAllPromotionCandidates"
                  class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                Pilih Semua
              </label>
            </div>

            <div
              class="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
              <div v-if="isLoadingPromotionCandidates"
                class="flex items-center justify-center gap-2 px-4 py-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Memuat siswa
              </div>
              <div v-else-if="!promotionForm.from_class_id"
                class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Pilih kelas asal terlebih dahulu.
              </div>
              <div v-else-if="promotionCandidates.length === 0"
                class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Tidak ada siswa di kelas asal.
              </div>
              <template v-else>
                <label v-for="student in promotionCandidates" :key="student.id"
                  class="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
                  <input v-model="promotionSelectedStudentIds" type="checkbox" :value="student.id"
                    class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {{ student.full_name || student.username || "-" }}
                    </p>
                    <p class="truncate text-xs text-slate-500 dark:text-slate-400">
                      {{ student.username || "-" }}
                    </p>
                  </div>
                </label>
              </template>
            </div>
          </div>

          <div
            class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
            Hanya siswa yang dicentang akan pindah ke kelas tujuan. Riwayat kelas lama tetap disimpan untuk audit.
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button type="button" @click="closePromotionModal"
              class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Batal
            </button>
            <button type="submit" :disabled="isPromoting"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
              <svg v-if="isPromoting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {{ isPromoting ? "Memproses..." : "Proses Naik Kelas" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>

  <!-- Modal Konfirmasi Hapus Siswa -->
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
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Hapus Siswa?</h2>
            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Siswa
              <span class="font-semibold text-slate-700 dark:text-slate-200">{{ studentToDelete?.username || "-"
                }}</span>
              beserta seluruh data absensi dan pembayarannya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
          <button type="button" @click="closeDeleteModal"
            class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            Batal
          </button>
          <button type="button" @click="confirmDeleteStudent" :disabled="isDeletingStudent"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60">
            <svg v-if="isDeletingStudent" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {{ isDeletingStudent ? "Menghapus..." : "Ya, Hapus" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <SuccessModal ref="successModal" />
  <input ref="studentImportInput" type="file"
    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="hidden"
    @change="handleStudentImportFileChange" />
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";
import SuccessModal from "@/components/SuccessModal.vue";
import { useMasterDataStore } from "@/store/masterData";

const successModal = ref(null);
const masterDataStore = useMasterDataStore();

const baseForm = () => ({
  full_name: "",
  username: "",
  password: "",
  class_id: "",
  parent_email: "",
  phone_number: "",
});

const isDeleteModalOpen = ref(false);
const isDeletingStudent = ref(false);
const studentToDelete = ref(null);
const isPromotionModalOpen = ref(false);
const isPromoting = ref(false);
const isLoadingPromotionCandidates = ref(false);
const isImportingStudents = ref(false);
const isStudentTemplateModalOpen = ref(false);
const studentTemplateClassId = ref("");
const studentImportInput = ref(null);

const form = reactive(baseForm());
const promotionForm = reactive({
  from_class_id: "",
  to_class_id: "",
  effective_date: "",
  note: "",
});
const filters = reactive({ class_id: "", page: 1, limit: 10 });
const searchQuery = ref("");
const students = ref([]);
const classOptions = ref([]);
const promotionCandidates = ref([]);
const promotionSelectedStudentIds = ref([]);
const editingId = ref(null);
const showModal = ref(false);
const isSubmitting = ref(false);
const tableSort = createSortState("username");

const filteredStudents = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();
  if (!keyword) {
    return students.value;
  }

  return students.value.filter((item) => {
    const haystacks = [
      item.full_name,
      item.username,
      item.class_name,
      item.parent_email,
      item.phone_number,
    ];

    return haystacks.some((value) => String(value || "").toLowerCase().includes(keyword));
  });
});

const displayedStudents = computed(() =>
  sortItems(filteredStudents.value, tableSort, {
    full_name: (item) => item.full_name || "",
    username: (item) => item.username || "",
    class_name: (item) => item.class_name || "",
    parent_email: (item) => item.parent_email || "",
    phone_number: (item) => item.phone_number || "",
  }),
);

const studentsWithParentContact = computed(() =>
  students.value.filter((item) => item.parent_email || item.phone_number).length,
);

const studentsWithoutClass = computed(() =>
  students.value.filter((item) => !item.class_name).length,
);

const summaryCards = computed(() => [
  {
    label: "Siswa di Halaman Ini",
    value: students.value.length,
    caption: "Jumlah data yang termuat sesuai filter kelas dan halaman aktif.",
    icon: "students",
    iconWrapClass: "bg-sky-600 shadow-sky-600/25",
  },
  {
    label: "Kontak Wali Tersedia",
    value: studentsWithParentContact.value,
    caption: "Siswa yang sudah punya email ortu atau nomor telepon untuk tindak lanjut.",
    icon: "contact",
    iconWrapClass: "bg-emerald-600 shadow-emerald-600/25",
  },
  {
    label: "Kelas Aktif",
    value: filters.class_id ? 1 : classOptions.value.length,
    caption: filters.class_id ? "Anda sedang fokus ke satu kelas tertentu." : "Jumlah kelas yang bisa dipilih pada filter.",
    icon: "class",
    iconWrapClass: "bg-violet-600 shadow-violet-600/25",
  },
  {
    label: "Belum Ada Kelas",
    value: studentsWithoutClass.value,
    caption: "Siswa yang perlu ditinjau karena belum punya penempatan kelas di halaman ini.",
    icon: "check",
    iconWrapClass: "bg-amber-500 shadow-amber-500/25",
  },
]);

const activeClassLabel = computed(() => {
  if (!filters.class_id) {
    return "Semua kelas";
  }

  const selectedClass = classOptions.value.find((item) => String(item.id) === String(filters.class_id));
  return selectedClass?.class_name || "Kelas terpilih";
});

const studentDirectoryDescription = computed(() => {
  if (searchQuery.value.trim()) {
    return `Menampilkan hasil pencarian “${searchQuery.value.trim()}” pada halaman ${filters.page}.`;
  }

  if (filters.class_id) {
    return `Fokus pada ${activeClassLabel.value} untuk mempermudah peninjauan dan pengelolaan siswa.`;
  }

  return "Gunakan pencarian, filter kelas, dan jumlah data per halaman untuk mempercepat pengelolaan.";
});

const emptyStateTitle = computed(() =>
  searchQuery.value.trim() ? "Tidak ada hasil yang cocok" : "Tidak Ada Data Siswa",
);

const emptyStateMessage = computed(() => {
  if (searchQuery.value.trim()) {
    return "Coba kata kunci lain atau ubah filter kelas agar data yang dicari lebih mudah ditemukan.";
  }

  if (filters.class_id) {
    return "Belum ada siswa pada kelas ini. Anda bisa menambahkan siswa baru atau memilih kelas lain.";
  }

  return "Gunakan tombol tambah siswa untuk mendaftarkan siswa baru.";
});

const promotionSelectedCount = computed(() => promotionSelectedStudentIds.value.length);
const promotionRetainedCount = computed(() =>
  Math.max(0, promotionCandidates.value.length - promotionSelectedStudentIds.value.length),
);
const promotionAllSelected = computed(() =>
  promotionCandidates.value.length > 0 &&
  promotionSelectedStudentIds.value.length === promotionCandidates.value.length,
);

const handleSort = (key) => {
  toggleSort(tableSort, key);
};

const sortIndicator = (key) => {
  if (tableSort.key !== key) {
    return "↕";
  }

  return tableSort.direction === "asc" ? "▲" : "▼";
};

const resetForm = () => {
  Object.assign(form, baseForm());
  editingId.value = null;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const openCreateModal = () => {
  resetForm();
  showModal.value = true;
};

const openStudentTemplateModal = () => {
  studentTemplateClassId.value = filters.class_id || "";
  isStudentTemplateModalOpen.value = true;
};

const closeStudentTemplateModal = () => {
  isStudentTemplateModalOpen.value = false;
  studentTemplateClassId.value = "";
};

const downloadStudentTemplate = () => {
  if (!studentTemplateClassId.value) {
    pushToast({
      title: "Pilih Kelas",
      message: "Pilih kelas terlebih dahulu sebelum download template siswa.",
      type: "info",
    });
    return;
  }

  const token = localStorage.getItem("token");
  const params = new URLSearchParams({ class_id: String(studentTemplateClassId.value) });
  fetch(`${api.baseUrl}/auth/student/template?${params.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Gagal mengunduh template siswa");
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const selectedClass = classOptions.value.find((item) => String(item.id) === String(studentTemplateClassId.value));
      link.download = `template-siswa-${slugifyFilename(selectedClass?.class_name || "kelas")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      closeStudentTemplateModal();
    })
    .catch((error) => {
      pushToast({
        title: "Gagal Download Template",
        message: error.message,
        type: "error",
      });
    });
};

const slugifyFilename = (value) => {
  const normalized = String(value || "kelas").trim().toLowerCase().replace(/\s+/g, "-");
  return normalized.replace(/[^a-z0-9_-]/g, "") || "kelas";
};

const openStudentImportPicker = () => {
  studentImportInput.value?.click();
};

const handleStudentImportFileChange = async (event) => {
  const file = event?.target?.files?.[0];
  if (!file) return;

  isImportingStudents.value = true;
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/auth/register/student/import", formData);
    const imported = Number(response?.data?.imported || 0);
    const failed = Number(response?.data?.failed || 0);

    await loadStudents();
    pushToast({
      title: "Import Siswa Selesai",
      message: `${imported} siswa berhasil diimport${failed > 0 ? `, ${failed} baris gagal` : ""}.`,
      type: failed > 0 ? "warning" : "success",
    });
    if (failed > 0) {
      pushToast({
        title: "Sebagian Baris Gagal",
        message: "Periksa username, password, kelas, atau data yang sudah terdaftar.",
        type: "error",
      });
    }
  } catch (error) {
    pushToast({
      title: "Gagal Import Siswa",
      message: error.message,
      type: "error",
    });
  } finally {
    isImportingStudents.value = false;
    if (studentImportInput.value) {
      studentImportInput.value.value = "";
    }
  }
};

const localDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const resetPromotionForm = () => {
  promotionForm.from_class_id = filters.class_id || "";
  promotionForm.to_class_id = "";
  promotionForm.effective_date = localDateString();
  promotionForm.note = "";
  promotionCandidates.value = [];
  promotionSelectedStudentIds.value = [];
};

const openPromotionModal = () => {
  resetPromotionForm();
  isPromotionModalOpen.value = true;
  if (promotionForm.from_class_id) {
    loadPromotionCandidates(promotionForm.from_class_id);
  }
};

const closePromotionModal = () => {
  if (isPromoting.value) return;
  isPromotionModalOpen.value = false;
  resetPromotionForm();
};

const loadClasses = async () => {
  classOptions.value = await masterDataStore.getClasses();
};

const loadStudents = async () => {
  try {
    const params = new URLSearchParams({
      page: String(filters.page),
      limit: String(filters.limit),
    });

    if (filters.class_id) {
      params.set("class_id", filters.class_id);
    }

    const response = await api.get(`/student?${params.toString()}`);
    students.value = response?.data?.data || [];
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Data Siswa",
      message: error.message,
      type: "error",
    });
  }
};

const loadPromotionCandidates = async (classId) => {
  if (!classId) {
    promotionCandidates.value = [];
    promotionSelectedStudentIds.value = [];
    return;
  }

  isLoadingPromotionCandidates.value = true;
  try {
    const params = new URLSearchParams({
      page: "1",
      limit: "5000",
      class_id: String(classId),
    });
    const response = await api.get(`/student?${params.toString()}`, { silentLoading: true });
    promotionCandidates.value = response?.data?.data || [];
    promotionSelectedStudentIds.value = promotionCandidates.value.map((item) => item.id);
  } catch (error) {
    promotionCandidates.value = [];
    promotionSelectedStudentIds.value = [];
    pushToast({
      title: "Gagal Memuat Siswa Kelas Asal",
      message: error.message,
      type: "error",
    });
  } finally {
    isLoadingPromotionCandidates.value = false;
  }
};

const toggleAllPromotionCandidates = (event) => {
  promotionSelectedStudentIds.value = event.target.checked
    ? promotionCandidates.value.map((item) => item.id)
    : [];
};

const handleClassFilterChange = async () => {
  filters.page = 1;
  await loadStudents();
};

const handleLimitChange = async () => {
  filters.page = 1;
  await loadStudents();
};

const studentInitial = (item) => {
  const source = item?.full_name || item?.username || "S";
  return source.charAt(0).toUpperCase();
};

const goToPrevPage = async () => {
  if (filters.page <= 1) return;
  filters.page -= 1;
  await loadStudents();
};

const goToNextPage = async () => {
  if (students.value.length < filters.limit) return;
  filters.page += 1;
  await loadStudents();
};

const createStudent = async () => {
  isSubmitting.value = true;

  try {
    const response = await api.post("/auth/register/student", {
      full_name: form.full_name,
      username: form.username,
      password: form.password,
      role: "SISWA",
      class_id: Number(form.class_id),
      parent_email: form.parent_email || null,
      phone_number: form.phone_number || null,
    });
    await loadStudents();
    closeModal();
    successModal.value.show(response?.message || "Siswa berhasil didaftarkan.");
  } catch (error) {
    pushToast({
      title: "Gagal Menambahkan Siswa",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const startEdit = (item) => {
  const matchedClass = classOptions.value.find(
    (classItem) => classItem.class_name === item.class_name,
  );
  editingId.value = item.id;
  form.username = item.username;
  form.full_name = item.full_name || "";
  form.password = "";
  form.class_id = matchedClass?.id || "";
  form.parent_email = item.parent_email || "";
  form.phone_number = item.phone_number || "";
  showModal.value = true;
};

const openDeleteModal = (item) => {
  studentToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  if (isDeletingStudent.value) return;
  isDeleteModalOpen.value = false;
  studentToDelete.value = null;
};

const confirmDeleteStudent = async () => {
  if (!studentToDelete.value?.id) return;
  isDeletingStudent.value = true;
  try {
    await api.delete(`/student/${studentToDelete.value.id}`);
    isDeleteModalOpen.value = false;
    studentToDelete.value = null;
    await loadStudents();
    successModal.value.show("Siswa berhasil dihapus");
  } catch (error) {
    isDeleteModalOpen.value = false;
    pushToast({
      title: "Gagal Menghapus Siswa",
      message: error.message,
      type: "error",
    });
  } finally {
    isDeletingStudent.value = false;
  }
};

const updateStudent = async () => {
  isSubmitting.value = true;

  try {
    const response = await api.put(`/student/${editingId.value}`, {
      full_name: form.full_name || null,
      username: form.username,
      role: "SISWA",
      class_id: Number(form.class_id),
      parent_email: form.parent_email || null,
      phone_number: form.phone_number || null,
    });
    await loadStudents();
    closeModal();
    successModal.value.show(response?.message || "Data siswa berhasil diperbarui.");
  } catch (error) {
    pushToast({
      title: "Gagal Memperbarui Siswa",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const submitPromotion = async () => {
  if (!promotionForm.from_class_id || !promotionForm.to_class_id) {
    pushToast({
      title: "Data Belum Lengkap",
      message: "Pilih kelas asal dan kelas tujuan.",
      type: "warning",
    });
    return;
  }
  if (String(promotionForm.from_class_id) === String(promotionForm.to_class_id)) {
    pushToast({
      title: "Kelas Tidak Valid",
      message: "Kelas asal dan kelas tujuan tidak boleh sama.",
      type: "warning",
    });
    return;
  }
  if (promotionCandidates.value.length === 0) {
    pushToast({
      title: "Tidak Ada Siswa",
      message: "Kelas asal tidak memiliki siswa untuk dinaikkan.",
      type: "warning",
    });
    return;
  }
  if (promotionSelectedStudentIds.value.length === 0) {
    pushToast({
      title: "Belum Ada Siswa Dipilih",
      message: "Centang minimal satu siswa yang akan naik kelas.",
      type: "warning",
    });
    return;
  }

  isPromoting.value = true;
  try {
    const response = await api.post("/student/promotions", {
      from_class_id: Number(promotionForm.from_class_id),
      to_class_id: Number(promotionForm.to_class_id),
      student_ids: promotionSelectedStudentIds.value.map((id) => Number(id)),
      effective_date: promotionForm.effective_date || undefined,
      note: promotionForm.note || undefined,
    });
    isPromotionModalOpen.value = false;
    await loadStudents();
    const promotedCount = Number(response?.data?.promoted_count || 0);
    successModal.value.show(response?.message || `${promotedCount} siswa berhasil dinaikkan kelas.`);
    resetPromotionForm();
  } catch (error) {
    pushToast({
      title: "Gagal Memproses Naik Kelas",
      message: error.message,
      type: "error",
    });
  } finally {
    isPromoting.value = false;
  }
};

watch(
  () => promotionForm.from_class_id,
  async (classId) => {
    if (!isPromotionModalOpen.value) {
      return;
    }
    await loadPromotionCandidates(classId);
  },
);

onMounted(async () => {
  try {
    await Promise.all([
      loadClasses(),
      loadStudents(),
    ]);
  } catch (error) {
    if (error?.isAborted) {
      return;
    }

    pushToast({
      title: "Gagal Memuat Halaman Siswa",
      message: error.message,
      type: "error",
    });
  }
});
</script>
