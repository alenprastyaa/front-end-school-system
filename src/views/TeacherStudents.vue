<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-[1400px] space-y-4">

      <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="summaryError || listError"
          class="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-300">
          <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {{ summaryError || listError }}
        </div>
      </Transition>

      <section
        class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">

        <div
          class="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Daftar Siswa Kelas</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Data absensi dan administrasi untuk kelas {{
              homeroomClass?.class_name || "-" }}.</p>
          </div>
          <div class="relative w-full sm:w-72">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input v-model="search" type="text" placeholder="Cari nama, email, atau HP..."
              class="block w-full rounded-xl border-0 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-[1000px] w-full text-left text-sm">
            <thead
              class="bg-white text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <th class="px-5 py-4 font-semibold">
                  <button @click="handleStudentSort('full_name')"
                    class="group flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                    Nama Siswa <span class="text-slate-300 transition group-hover:text-slate-500">{{
                      sortIndicator(studentTableSort, 'full_name') }}</span>
                  </button>
                </th>
                <th class="px-5 py-4 font-semibold">Kontak Wali/Ortu</th>
                <th class="px-5 py-4 font-semibold">
                  <button @click="handleStudentSort('checked_in_today')"
                    class="group flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                    Status Hari Ini <span class="text-slate-300 transition group-hover:text-slate-500">{{
                      sortIndicator(studentTableSort, 'checked_in_today') }}</span>
                  </button>
                </th>
                <th class="px-5 py-4 font-semibold text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in sortedStudents" :key="item.id"
                class="group transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                      {{ (item.full_name || item.username || "?").charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-bold text-slate-900 dark:text-white">{{ item.full_name || item.username }}</div>
                      <div class="text-xs text-slate-500">{{ item.class_name || "-" }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-4">
                  <div class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ item.parent_email || "-" }}
                  </div>
                  <div class="text-xs text-slate-500">{{ item.phone_number || "Tidak ada No. HP" }}</div>
                </td>

                <td class="px-5 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset"
                    :class="item.checked_in_today ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20' : 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20'">
                    <span class="h-1.5 w-1.5 rounded-full"
                      :class="item.checked_in_today ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    {{ item.checked_in_today ? "Sudah Absen" : "Belum Absen" }}
                  </span>
                </td>

                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openAttendance(item)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                      <svg class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Kehadiran
                    </button>
                    <button @click="openReceipt(item)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20">
                      <svg class="h-4 w-4 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24"
                        stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      Receipt
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredStudents.length === 0">
                <td colspan="4" class="px-5 py-16 text-center">
                  <div class="mx-auto flex max-w-sm flex-col items-center">
                    <div
                      class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">Tidak ada data ditemukan</p>
                    <p class="mt-1 text-sm text-slate-500">Coba gunakan kata kunci pencarian yang berbeda.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showCheckedInModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Detail Sudah Absen</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Siswa yang sudah melakukan check-in hari ini.</p>
            </div>
            <button @click="showCheckedInModal = false"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex-1 overflow-x-auto overflow-y-auto p-6">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th class="px-4 py-3 font-semibold"><button @click="handleCheckedInSort('full_name')"
                      class="flex items-center gap-1">Nama Siswa {{ sortIndicator(checkedInTableSort, 'full_name')
                      }}</button></th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleCheckedInSort('class_name')"
                      class="flex items-center gap-1">Kelas {{ sortIndicator(checkedInTableSort, 'class_name')
                      }}</button></th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleCheckedInSort('clock_in')"
                      class="flex items-center gap-1">Masuk {{ sortIndicator(checkedInTableSort, 'clock_in') }}</button>
                  </th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleCheckedInSort('clock_out')"
                      class="flex items-center gap-1">Pulang {{ sortIndicator(checkedInTableSort, 'clock_out')
                      }}</button></th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleCheckedInSort('attendance_status')"
                      class="flex items-center gap-1">Status {{ sortIndicator(checkedInTableSort, 'attendance_status')
                      }}</button></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in sortedCheckedInStudents" :key="`checked-${item.id}`"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">{{ item.full_name || item.username }}
                  </td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ item.class_name || "-" }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ formatTime(item.clock_in) }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ formatTime(item.clock_out) }}</td>
                  <td class="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">{{ item.attendance_status ||
                    "-" }}</td>
                </tr>
                <tr v-if="filteredCheckedInStudents.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-slate-500">Tidak ada data.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showAbsentModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Detail Belum Absen</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Siswa yang belum melakukan check-in hari ini.</p>
            </div>
            <button @click="showAbsentModal = false"
              class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex-1 overflow-x-auto overflow-y-auto p-6">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th class="px-4 py-3 font-semibold"><button @click="handleAbsentSort('full_name')"
                      class="flex items-center gap-1">Nama Siswa {{ sortIndicator(absentTableSort, 'full_name')
                      }}</button>
                  </th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleAbsentSort('class_name')"
                      class="flex items-center gap-1">Kelas {{ sortIndicator(absentTableSort, 'class_name') }}</button>
                  </th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleAbsentSort('parent_email')"
                      class="flex items-center gap-1">Email Ortu {{ sortIndicator(absentTableSort, 'parent_email')
                      }}</button></th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleAbsentSort('phone_number')"
                      class="flex items-center gap-1">No. HP {{ sortIndicator(absentTableSort, 'phone_number')
                      }}</button></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in sortedAbsentStudents" :key="`modal-absent-${item.id}`"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">{{ item.full_name || item.username }}
                  </td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ item.class_name || "-" }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ item.parent_email || "-" }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ item.phone_number || "-" }}</td>
                </tr>
                <tr v-if="filteredAbsentStudents.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-slate-500">Tidak ada data.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showAttendanceModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Riwayat Kehadiran: {{
                selectedStudent?.full_name || selectedStudent?.username || "" }}</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Catatan kehadiran siswa yang Anda walikan.</p>
            </div>
            <div class="flex items-center gap-2">
              <button v-if="selectedStudent" @click="openAttendance(selectedStudent)"
                class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                Refresh
              </button>
              <button @click="closeAttendanceModal"
                class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-x-auto overflow-y-auto p-6">
            <div v-if="attendanceError"
              class="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-300">
              {{ attendanceError }}
            </div>
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th class="px-4 py-3 font-semibold"><button @click="handleAttendanceSort('attendance_date')"
                      class="flex items-center gap-1">Tanggal {{ sortIndicator(attendanceTableSort, 'attendance_date')
                      }}</button></th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleAttendanceSort('clock_in')"
                      class="flex items-center gap-1">Masuk {{ sortIndicator(attendanceTableSort, 'clock_in')
                      }}</button></th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleAttendanceSort('clock_out')"
                      class="flex items-center gap-1">Pulang {{ sortIndicator(attendanceTableSort, 'clock_out')
                      }}</button></th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleAttendanceSort('status')"
                      class="flex items-center gap-1">Status {{ sortIndicator(attendanceTableSort, 'status') }}</button>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in sortedAttendances" :key="`${item.attendance_date}-${item.clock_in}`"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td class="px-4 py-3 text-slate-900 dark:text-white">{{ formatDate(item.attendance_date) }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ formatTime(item.clock_in) }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ formatTime(item.clock_out) }}</td>
                  <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">{{ item.status }}</td>
                </tr>
                <tr v-if="attendances.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-slate-500">Belum ada riwayat kehadiran.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showReceiptModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div
          class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          @click.stop>
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Receipt: {{ selectedStudent?.full_name ||
                selectedStudent?.username || ""
                }}</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Riwayat bukti pembayaran/administrasi.</p>
            </div>
            <div class="flex items-center gap-2">
              <button v-if="selectedStudent" @click="openReceipt(selectedStudent)"
                class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                Refresh
              </button>
              <button @click="closeReceiptModal"
                class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-x-auto overflow-y-auto p-6">
            <div v-if="receiptError"
              class="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-300">
              {{ receiptError }}
            </div>
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th class="px-4 py-3 font-semibold"><button @click="handleReceiptSort('payment_date')"
                      class="flex items-center gap-1">Tanggal Bayar {{ sortIndicator(receiptTableSort, 'payment_date')
                      }}</button>
                  </th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleReceiptSort('description')"
                      class="flex items-center gap-1">Deskripsi {{ sortIndicator(receiptTableSort, 'description')
                      }}</button></th>
                  <th class="px-4 py-3 font-semibold"><button @click="handleReceiptSort('created_at')"
                      class="flex items-center gap-1">Dibuat {{ sortIndicator(receiptTableSort, 'created_at')
                      }}</button></th>
                  <th class="px-4 py-3 font-semibold">Bukti File</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in sortedReceipts" :key="item.id"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ formatDate(item.payment_date) }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ item.description || "-" }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ formatDateTime(item.created_at) }}</td>
                  <td class="px-4 py-3">
                    <a v-if="item.image_path" :href="item.image_path" target="_blank" rel="noreferrer"
                      class="inline-flex items-center gap-1 font-bold text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Lihat Bukti
                    </a>
                    <span v-else class="text-xs italic text-slate-400">Tidak ada file</span>
                  </td>
                </tr>
                <tr v-if="receipts.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-slate-500">Belum ada data bukti pembayaran.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "@/api";
import { formatDate, formatDateTime, formatTime } from "@/utils/date";
import { createSortState, sortItems, toggleSort } from "@/utils/tableSort";

const homeroomClass = ref(null);
const students = ref([]);
const search = ref("");
const selectedStudent = ref(null);
const attendances = ref([]);
const receipts = ref([]);
const showAttendanceModal = ref(false);
const showReceiptModal = ref(false);
const showCheckedInModal = ref(false);
const showAbsentModal = ref(false);
const summaryError = ref("");
const listError = ref("");
const attendanceError = ref("");
const receiptError = ref("");

// Table Sort States
const studentTableSort = createSortState("full_name");
const checkedInTableSort = createSortState("clock_in", "desc");
const absentTableSort = createSortState("full_name");
const attendanceTableSort = createSortState("attendance_date", "desc");
const receiptTableSort = createSortState("created_at", "desc");

const normalizedSearch = computed(() => search.value.trim().toLowerCase());

const studentAccessors = {
  full_name: (item) => item.full_name || item.username || "",
  class_name: (item) => item.class_name || "",
  parent_email: (item) => item.parent_email || "",
  phone_number: (item) => item.phone_number || "",
  checked_in_today: (item) => (item.checked_in_today ? 1 : 0),
};

const receiptAccessors = {
  description: (item) => item.description || "",
};

const filteredStudents = computed(() =>
  students.value.filter((item) => {
    if (!normalizedSearch.value) {
      return true;
    }

    return [
      item.full_name,
      item.username,
      item.class_name,
      item.parent_email,
      item.phone_number,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedSearch.value));
  }),
);

const sortedStudents = computed(() =>
  sortItems(filteredStudents.value, studentTableSort, studentAccessors),
);

const checkedInCount = computed(() =>
  students.value.filter((item) => item.checked_in_today).length,
);

const absentStudents = computed(() =>
  students.value.filter((item) => !item.checked_in_today),
);

const checkedInStudents = computed(() =>
  students.value.filter((item) => item.checked_in_today),
);

const absentCount = computed(() => absentStudents.value.length);

const filteredAbsentStudents = computed(() =>
  filteredStudents.value.filter((item) => !item.checked_in_today),
);

const filteredCheckedInStudents = computed(() =>
  filteredStudents.value.filter((item) => item.checked_in_today),
);

const sortedAbsentStudents = computed(() =>
  sortItems(filteredAbsentStudents.value, absentTableSort, studentAccessors),
);

const sortedCheckedInStudents = computed(() =>
  sortItems(filteredCheckedInStudents.value, checkedInTableSort, {
    ...studentAccessors,
    attendance_status: (item) => item.attendance_status || "",
  }),
);

const sortedAttendances = computed(() => sortItems(attendances.value, attendanceTableSort));

const sortedReceipts = computed(() =>
  sortItems(receipts.value, receiptTableSort, receiptAccessors),
);

const handleStudentSort = (key) => {
  toggleSort(studentTableSort, key);
};

const handleCheckedInSort = (key) => {
  toggleSort(checkedInTableSort, key);
};

const handleAbsentSort = (key) => {
  toggleSort(absentTableSort, key);
};

const handleAttendanceSort = (key) => {
  toggleSort(attendanceTableSort, key);
};

const handleReceiptSort = (key) => {
  toggleSort(receiptTableSort, key);
};

const sortIndicator = (sortState, key) => {
  if (sortState.key !== key) {
    return "↕";
  }

  return sortState.direction === "asc" ? "▲" : "▼";
};

const openCheckedInModal = () => {
  showCheckedInModal.value = true;
};

const openAbsentModal = () => {
  showAbsentModal.value = true;
};

const closeAttendanceModal = () => {
  showAttendanceModal.value = false;
  attendances.value = [];
  attendanceError.value = "";
};

const closeReceiptModal = () => {
  showReceiptModal.value = false;
  receipts.value = [];
  receiptError.value = "";
};

const loadTeacherData = async () => {
  summaryError.value = "";
  listError.value = "";

  try {
    const [classResponse, studentResponse] = await Promise.all([
      api.get("/class/my/homeroom"),
      api.get("/student/my-class"),
    ]);

    homeroomClass.value = classResponse?.data || null;
    students.value = studentResponse?.data?.data || [];
  } catch (error) {
    summaryError.value = error.message;
    listError.value = error.message;
  }
};

const openAttendance = async (student) => {
  selectedStudent.value = student;
  attendanceError.value = "";
  showAttendanceModal.value = true;

  try {
    const response = await api.get(`/student/${student.id}/attendance`);
    attendances.value = response?.data?.data || [];
  } catch (error) {
    attendanceError.value = error.message;
    attendances.value = [];
  }
};

const openReceipt = async (student) => {
  selectedStudent.value = student;
  receiptError.value = "";
  showReceiptModal.value = true;

  try {
    const response = await api.get(`/student/${student.id}/receipt`);
    receipts.value = response?.data || [];
  } catch (error) {
    receiptError.value = error.message;
    receipts.value = [];
  }
};

onMounted(loadTeacherData);
</script>
