<template>
  <div
    class="min-h-screen bg-slate-50/50 px-3 pb-10 pt-3 font-sans text-slate-900 sm:px-4 sm:pt-4 md:px-8 md:pb-12 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto space-y-5 sm:space-y-6">
      <section v-if="currentSection === 'generate'"
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <button @click="generateSchedule" :disabled="generating"
          class="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
          {{ generating ? "Sedang Generate..." : "Generate Jadwal" }}
        </button>
      </section>

      <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <article v-for="card in summaryCards" :key="card.label"
          class="relative overflow-hidden rounded-2xl p-4 text-white" :class="card.cardClass">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">{{ card.label }}</p>
              <p class="mt-2 text-2xl font-bold tracking-tight text-white">{{ card.value }}</p>
              <p class="mt-1 truncate text-[11px] text-white/70">{{ card.caption }}</p>
            </div>
            <Icon :icon="card.icon" class="h-8 w-8 shrink-0 text-white opacity-75" />
          </div>
        </article>
      </section>

      <section
        class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        Alur: `Mapel -> Beban Guru -> Distribusi Kelas -> Slot Jadwal -> Generate`
      </section>

      <article v-if="currentSection === 'subjects'"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-800">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Sub Menu 1</p>
              <h2 class="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">Mata Pelajaran</h2>
            </div>
            <button @click="openSubjectModal()"
              class="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
              Tambah Mapel
            </button>
          </div>
        </div>
        <div class="space-y-4 p-4 sm:p-6">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <input v-model="searchTerms.subjects" type="text" placeholder="Cari nama atau kode mapel..."
              class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 lg:max-w-xl dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ filteredSubjects.length }} mapel</p>
          </div>

          <div v-if="filteredSubjects.length > 0"
            class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Kode</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Mata Pelajaran</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">JP / Minggu</th>
                  <th class="border-b border-slate-200 px-4 py-3 text-right font-medium dark:border-slate-800">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in filteredSubjects" :key="item.id"
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td class="whitespace-nowrap px-4 py-4">
                    <span
                      class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {{ item.code || "-" }}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex min-w-0 items-center gap-3">
                      <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-xs font-bold text-white">
                        {{ getInitials(item.name) }}
                      </div>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-slate-900 dark:text-white">{{ item.name }}</p>
                        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Mata pelajaran kurikulum</p>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    {{ formatHours(item.weekly_hours) }}
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex justify-end gap-2">
                      <button @click="openDetailModal('subject', item.name, item)"
                        class="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500">Detail</button>
                      <button @click="openSubjectModal(item)"
                        class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">Edit</button>
                      <button @click="removeSubject(item)"
                        class="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">Hapus</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else
            class="rounded-2xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Belum ada mapel kurikulum yang sesuai.
          </div>
        </div>
      </article>

      <article v-if="currentSection === 'teacher-loads'"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-800">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Sub Menu 2</p>
              <h2 class="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">Beban Guru</h2>
            </div>
            <button @click="openTeacherLoadModal()"
              class="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
              Tambah Beban Guru
            </button>
          </div>
        </div>
        <div class="space-y-4 p-4 sm:p-6">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <input v-model="searchTerms.teacher_loads" type="text" placeholder="Cari guru atau mapel..."
              class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 lg:max-w-xl dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ teacherLoadCards.length }} guru · {{
              filteredTeacherLoads.length }} beban</p>
          </div>

          <div v-if="teacherLoadCards.length > 0"
            class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Guru</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Beban</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Mapel</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Kapasitas</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Terpakai</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Sisa</th>
                  <th class="border-b border-slate-200 px-4 py-3 text-right font-medium dark:border-slate-800">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="group in teacherLoadCards" :key="group.key"
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td class="px-4 py-4">
                    <div class="flex min-w-0 items-center gap-3">
                      <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-xs font-bold text-white">
                        {{ getInitials(group.teacher_name) }}
                      </div>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-slate-900 dark:text-white">{{ group.teacher_name }}</p>
                        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Guru pengampu</p>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4">
                    <span
                      class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {{ group.item_count }} beban
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    {{ group.subject_count }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                    {{ formatHours(group.max_weekly_hours) }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                    {{ formatHours(group.distributed_hours) }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 font-semibold"
                    :class="remainingHoursClass(group.remaining_hours)">
                    {{ formatHours(group.remaining_hours) }}
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex justify-end">
                      <button @click="openDetailModal('teacher-load', group.teacher_name, group)"
                        class="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500">Detail
                        Beban</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else
            class="rounded-2xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Belum ada data beban guru yang sesuai.
          </div>
        </div>
      </article>

      <article v-if="currentSection === 'class-distributions'"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <article v-if="currentSection === 'learning'"
          class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-800">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Sub Menu</p>
                <h2 class="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">Data Pembelajaran</h2>
              </div>
              <button @click="openLearningModal()"
                class="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
                Tambah Pembelajaran
              </button>
            </div>
          </div>
          <div class="space-y-4 p-4 sm:p-6">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <input v-model="searchTerms.learning" type="text" placeholder="Cari guru, mapel, atau kelas..."
                class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 lg:max-w-xl dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{ filteredLearning.length } data</p>
            </div>

            <div v-if="filteredLearning.length > 0"
              class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                  <tr>
                    <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Guru</th>
                    <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Mata Pelajaran
                    </th>
                    <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Kelas</th>
                    <th class="border-b border-slate-200 px-4 py-3 text-right font-medium dark:border-slate-800">Aksi
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="item in filteredLearning" :key="item.id"
                    class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                    <td class="px-4 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          { getInitials(item.teacher_name) }
                        </div>
                        <span class="font-medium text-slate-900 dark:text-white">{ item.teacher_name }</span>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-slate-600 dark:text-slate-300">{ item.subject_name }</td>
                    <td class="px-4 py-4">
                      <span
                        class="inline-flex rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                        { item.class_name }
                      </span>
                    </td>
                    <td class="px-4 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        <button @click="editLearning(item)" class="text-slate-400 hover:text-sky-600 transition">
                          <Icon name="ph:pencil-simple" class="h-4 w-4" />
                        </button>
                        <button @click="removeLearning(item)" class="text-slate-400 hover:text-red-600 transition">
                          <Icon name="ph:trash" class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <div class="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-800">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Sub Menu 3</p>
              <h2 class="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">Distribusi Guru ke Kelas</h2>
            </div>
            <button @click="openDistributionModal()"
              class="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
              Tambah Distribusi
            </button>
          </div>
        </div>
        <div class="space-y-5 p-4 sm:p-6">
          <div
            class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            Total distribusi per beban guru tidak boleh melebihi kapasitas JP yang sudah ditentukan pada submenu
            <strong>Beban Guru</strong>.
          </div>

          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <input v-model="searchTerms.class_distributions" type="text" placeholder="Cari guru, mapel, atau kelas..."
              class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 lg:max-w-xl dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ distributionCards.length }} guru · {{
              filteredClassDistributions.length }} distribusi</p>
          </div>

          <div v-if="distributionCards.length > 0"
            class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Guru</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Distribusi</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Mapel</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Kelas</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Total JP</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Kapasitas</th>
                  <th class="border-b border-slate-200 px-4 py-3 text-right font-medium dark:border-slate-800">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="group in distributionCards" :key="group.key"
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td class="px-4 py-4">
                    <div class="flex min-w-0 items-center gap-3">
                      <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                        {{ getInitials(group.teacher_name) }}
                      </div>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-slate-900 dark:text-white">{{ group.teacher_name }}</p>
                        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Guru pengampu</p>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4">
                    <span
                      class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {{ group.item_count }} list
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    {{ group.subject_count }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    {{ group.class_count }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                    {{ formatHours(group.total_weekly_hours) }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                    {{ formatHours(group.load_capacity) }}
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex justify-end">
                      <button @click="openDetailModal('distribution', group.teacher_name, group)"
                        class="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500">Detail
                        Distribusi</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else
            class="rounded-2xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Belum ada distribusi guru ke kelas yang sesuai.
          </div>
        </div>
      </article>

      <article v-if="currentSection === 'schedule'"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-800">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Sub Menu 4</p>
              <h2 class="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">Jadwal Pembelajaran</h2>
            </div>
            <div class="flex flex-wrap items-center justify-end gap-2">
              <button @click="openBulkSlotModal()"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">
                Buat Slot Cepat
              </button>
              <button @click="openSlotModal()"
                class="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Tambah Slot
              </button>
            </div>
          </div>
        </div>
        <div class="space-y-4 p-4 sm:p-6">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <input v-model="searchTerms.schedule" type="text" placeholder="Cari hari..."
              class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 lg:max-w-xl dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ filteredScheduleDayRows.length }}
              hari</p>
          </div>

          <div v-if="filteredScheduleDayRows.length > 0"
            class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Hari</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Jumlah Sesi</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Rentang Jam</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Urutan</th>
                  <th class="border-b border-slate-200 px-4 py-3 text-right font-medium dark:border-slate-800">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in filteredScheduleDayRows" :key="item.day_name"
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td class="px-4 py-4">
                    <div class="flex min-w-0 items-center gap-3">
                      <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                        {{ getInitials(item.day_name) }}
                      </div>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-slate-900 dark:text-white">{{ item.day_name }}</p>
                        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Slot pembelajaran</p>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4">
                    <span
                      class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {{ item.session_count }} sesi
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    {{ item.start_time }} - {{ item.end_time }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                    {{ item.day_order }}
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex justify-end gap-2">
                      <button @click="openScheduleDayDetail(item.day_name)"
                        class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500">Detail</button>
                      <button @click="openSlotModal()"
                        class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800">Tambah</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else
            class="rounded-2xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Belum ada slot jadwal yang sesuai.
          </div>
        </div>
      </article>

      <article v-if="currentSection === 'generate'"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-800">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Sub Menu 5</p>
          <h2 class="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">Generate Pembagian</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Generator menyusun jadwal dari distribusi rombel
            yang sudah ditetapkan admin.</p>
        </div>
        <div class="space-y-5 p-4 sm:p-6">
          <div v-if="generationIssues.length > 0"
            class="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <p class="text-sm font-semibold text-amber-800 dark:text-amber-200">Catatan generator</p>
            <ul class="mt-3 space-y-2 text-sm text-amber-700 dark:text-amber-100">
              <li v-for="issue in generationIssues" :key="issue" class="flex gap-2">
                <span class="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
                <span>{{ issue }}</span>
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <input v-model="searchTerms.generate" type="text" placeholder="Cari kelas, guru, atau mapel..."
              class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 lg:max-w-xl dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ generatedScheduleCards.length }} guru
              · {{ filteredGeneratedEntries.length }} jadwal</p>
          </div>

          <div v-if="generatedScheduleCards.length > 0"
            class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Guru</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Jadwal</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Kelas</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Mapel</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">Hari</th>
                  <th class="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-800">LMS</th>
                  <th class="border-b border-slate-200 px-4 py-3 text-right font-medium dark:border-slate-800">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="group in generatedScheduleCards" :key="group.key"
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td class="px-4 py-4">
                    <div class="flex min-w-0 items-center gap-3">
                      <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-xs font-bold text-white">
                        {{ getInitials(group.teacher_name) }}
                      </div>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-slate-900 dark:text-white">{{ group.teacher_name }}</p>
                        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Guru pengampu</p>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4">
                    <span
                      class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {{ group.item_count }} jadwal
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    {{ group.class_count }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    {{ group.subject_count }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                    {{ group.day_count }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                    {{ group.lms_count }}
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex justify-end">
                      <button @click="openDetailModal('generated', group.teacher_name, group)"
                        class="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500">Detail
                        Jadwal</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else
            class="rounded-2xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Belum ada hasil generate jadwal yang sesuai.
          </div>

          <div
            class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
            Subject LMS otomatis dibuat per kombinasi <strong class="text-slate-900 dark:text-white">kelas +
              mapel</strong>. Guru pengampu mengikuti hasil distribusi rombel yang sudah ditetapkan admin sebelumnya.
          </div>
        </div>
      </article>

      <teleport to="body">
        <div v-if="formModal.open" class="fixed inset-0 z-[130] flex items-center justify-center p-4"
          style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(14px);">
          <div
            class="w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900">
            <div class="relative border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div class="flex items-start justify-between gap-4 pr-12">
                <div class="min-w-0">
                  <div
                    class="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                    <span class="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                    Input Data
                  </div>
                  <h3 class="mt-3 truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {{ formModal.title }}
                  </h3>
                </div>
                <button @click="closeFormModal"
                  class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:border-rose-900/50 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20 dark:focus:ring-offset-slate-900">
                  <span class="text-xl font-black leading-none">×</span>
                </button>
              </div>
            </div>

            <div class="max-h-[calc(88vh-140px)] overflow-y-auto px-6 py-6">
              <div v-if="formModal.type === 'subject'"
                class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                <div class="mb-4 flex items-center gap-2">
                  <div class="h-2 w-2 rounded-full bg-sky-600"></div>
                  <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Data mata pelajaran</p>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kode
                      Mapel</label>
                    <input v-model="subjectForm.code" type="text" placeholder="Contoh: MTK"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">JP / Minggu per
                      Rombel</label>
                    <input v-model="subjectForm.weekly_hours" type="number" min="1" max="20"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama
                      Mapel</label>
                    <input v-model="subjectForm.name" type="text" placeholder="Contoh: Matematika"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                </div>
              </div>

              <div v-else-if="formModal.type === 'teacher-load'"
                class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                <div class="mb-4 flex items-center gap-2">
                  <div class="h-2 w-2 rounded-full bg-rose-600"></div>
                  <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Beban guru</p>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Guru</label>
                    <select v-model="teacherLoadForm.teacher_id"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                      <option value="">-- Pilih Guru --</option>
                      <option v-for="item in teachers" :key="item.id" :value="String(item.id)">
                        {{ item.full_name || item.username }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mapel</label>
                    <select v-model="teacherLoadForm.curriculum_subject_id"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                      <option value="">-- Pilih Mapel --</option>
                      <option v-for="item in overview.subjects" :key="item.id" :value="String(item.id)">
                        {{ item.name }}{{ item.code ? ` (${item.code})` : "" }}
                      </option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Total Kapasitas
                      JP
                      / Minggu</label>
                    <input v-model="teacherLoadForm.max_weekly_hours" type="number" min="1" max="60"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                </div>
              </div>

              <div v-else-if="formModal.type === 'distribution'"
                class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                <div class="mb-4 flex items-center gap-2">
                  <div class="h-2 w-2 rounded-full bg-indigo-600"></div>
                  <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Distribusi kelas</p>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Beban
                      Guru</label>
                    <select v-model="distributionForm.curriculum_teacher_load_id"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                      <option value="">-- Pilih Beban Guru --</option>
                      <option v-for="item in overview.teacher_loads" :key="item.id" :value="String(item.id)">
                        {{ item.teacher_name }} • {{ item.subject_name }} • kapasitas {{ item.max_weekly_hours }} JP
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kelas /
                      Rombel</label>
                    <select v-model="distributionForm.class_id"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                      <option value="">-- Pilih Kelas --</option>
                      <option v-for="item in classes" :key="item.id" :value="String(item.id)">
                        {{ item.class_name }}
                      </option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">JP untuk Kelas
                      Ini</label>
                    <input v-model="distributionForm.weekly_hours" type="number" min="1" max="20"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                </div>
              </div>

              <div v-else-if="formModal.type === 'slot'"
                class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                <div class="mb-4 flex items-center gap-2">
                  <div class="h-2 w-2 rounded-full bg-emerald-600"></div>
                  <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Slot jadwal</p>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Hari</label>
                    <select v-model="slotForm.day_name"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                      <option v-for="day in dayOptions" :key="day.name" :value="day.name">{{ day.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Urutan
                      Hari</label>
                    <input v-model="slotForm.day_order" type="number" min="1" max="7"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Sesi Ke</label>
                    <input v-model="slotForm.session_order" type="number" min="1" max="20"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Label
                      Slot</label>
                    <input v-model="slotForm.label" type="text" placeholder="Contoh: Jam 1"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mulai</label>
                    <input v-model="slotForm.start_time" type="time"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Selesai</label>
                    <input v-model="slotForm.end_time" type="time"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                </div>
              </div>

              <div v-else-if="formModal.type === 'slot-bulk'" class="space-y-4">
                <div
                  class="rounded-2xl border border-slate-200 bg-sky-50/60 p-4 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-sky-500/10 dark:text-slate-200">
                  Pilih hari, jumlah sesi, dan jam mulai. Sistem akan membuat slot otomatis per hari berdasarkan durasi
                  dan jeda.
                </div>

                <div>
                  <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Hari</p>
                  <div class="mt-3 grid grid-cols-2 gap-2">
                    <label v-for="day in dayOptions" :key="day.name"
                      class="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70">
                      <input v-model="bulkSlotForm.days" type="checkbox"
                        class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        :value="day.name" />
                      <span>{{ day.name }}</span>
                    </label>
                  </div>
                </div>

                <div class="grid gap-4 md:grid-cols-3">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Sesi per
                      Hari</label>
                    <input v-model="bulkSlotForm.sessions_per_day" type="number" min="1" max="20"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mulai</label>
                    <input v-model="bulkSlotForm.start_time" type="time"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Durasi
                      (menit)</label>
                    <input v-model="bulkSlotForm.duration_minutes" type="number" min="10" max="180"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                </div>

                <div class="grid gap-4 md:grid-cols-3">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jeda antar sesi
                      (menit)</label>
                    <input v-model="bulkSlotForm.gap_minutes" type="number" min="0" max="60"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah
                      Istirahat</label>
                    <select v-model="bulkSlotForm.break_count"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                      <option :value="0">Tanpa istirahat</option>
                      <option :value="1">1 kali istirahat</option>
                      <option :value="2">2 kali istirahat</option>
                    </select>
                  </div>
                  <div>
                    <div
                      class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      Istirahat dihitung setelah sesi yang dipilih selesai.
                    </div>
                  </div>
                </div>

                <div v-if="bulkSlotForm.break_count >= 1" class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Istirahat 1
                      setelah
                      sesi ke</label>
                    <input v-model="bulkSlotForm.break1_after_session" type="number" min="1"
                      :max="Math.max(1, Number(bulkSlotForm.sessions_per_day || 1) - 1)"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Durasi istirahat
                      1
                      (menit)</label>
                    <input v-model="bulkSlotForm.break1_minutes" type="number" min="0" max="120"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                </div>

                <div v-if="bulkSlotForm.break_count >= 2" class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Istirahat 2
                      setelah
                      sesi ke</label>
                    <input v-model="bulkSlotForm.break2_after_session" type="number" min="1"
                      :max="Math.max(1, Number(bulkSlotForm.sessions_per_day || 1) - 1)"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Durasi istirahat
                      2
                      (menit)</label>
                    <input v-model="bulkSlotForm.break2_minutes" type="number" min="0" max="120"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  </div>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Label</label>
                    <select v-model="bulkSlotForm.label_mode"
                      class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                      <option value="jam">Jam 1, Jam 2, ...</option>
                      <option value="sesi">Sesi 1, Sesi 2, ...</option>
                      <option value="none">Tanpa label</option>
                    </select>
                  </div>
                  <div class="flex items-end">
                    <label
                      class="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70">
                      <input v-model="bulkSlotForm.overwrite_existing" type="checkbox"
                        class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                      <span>Timpa slot yang sudah ada</span>
                    </label>
                  </div>
                </div>

                <div
                  class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  Perkiraan slot dibuat: <strong class="text-slate-900 dark:text-white">{{ bulkSlotPreviewCount
                    }}</strong>
                </div>
              </div>

              <div v-else-if="formModal.type === 'slot-day-detail'" class="space-y-4">
                <div
                  class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      Menampilkan slot untuk <strong class="text-slate-900 dark:text-white">{{ selectedScheduleDayName
                        }}</strong>.
                    </div>
                    <button @click="removeScheduleDaySlots([selectedScheduleDayName])"
                      :disabled="selectedScheduleDaySlots.length === 0"
                      class="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                      Hapus Semua Hari Ini
                    </button>
                  </div>
                </div>

                <div class="max-h-[55vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                    <thead
                      class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                      <tr>
                        <th class="px-4 py-3 font-semibold">Sesi</th>
                        <th class="px-4 py-3 font-semibold">Jam</th>
                        <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="slot in selectedScheduleDaySlots" :key="slot.id">
                        <td class="px-4 py-3 text-slate-700 dark:text-slate-200">
                          <div class="font-semibold">{{ slot.label || `Sesi ${slot.session_order}` }}</div>
                          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Urutan hari {{ slot.day_order }}
                            ·
                            sesi {{ slot.session_order }}</div>
                        </td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ slot.start_time }} - {{
                          slot.end_time
                          }}</td>
                        <td class="px-4 py-3">
                          <div class="flex justify-end gap-2">
                            <button @click="openSlotModal(slot)"
                              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                            <button @click="removeSlot(slot)"
                              class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">Hapus</button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="selectedScheduleDaySlots.length === 0">
                        <td colspan="3" class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Belum
                          ada
                          slot pada hari ini.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/40">
              <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button @click="closeFormModal"
                  class="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  Batal
                </button>
                <button v-if="formModal.type === 'subject'" @click="saveSubject"
                  class="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500">
                  {{ subjectEditingId ? "Perbarui" : "Simpan" }}
                </button>
                <button v-else-if="formModal.type === 'teacher-load'" @click="saveTeacherLoad"
                  class="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700">
                  {{ teacherLoadEditingId ? "Perbarui" : "Simpan" }}
                </button>
                <button v-else-if="formModal.type === 'distribution'" @click="saveDistribution"
                  class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                  {{ distributionEditingId ? "Perbarui" : "Simpan" }}
                </button>
                <button v-else-if="formModal.type === 'slot'" @click="saveSlot"
                  class="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                  {{ slotEditingId ? "Perbarui" : "Simpan" }}
                </button>
                <button v-else-if="formModal.type === 'slot-bulk'" @click="saveBulkSlots" :disabled="bulkSlotSaving"
                  class="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {{ bulkSlotSaving ? "Memproses..." : "Buat Slot" }}
                </button>
                <button v-else-if="formModal.type === 'slot-day-detail'" @click="closeFormModal"
                  class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="detailModal.open" class="fixed inset-0 z-[140] flex items-center justify-center p-4"
          style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(14px);">
          <div
            class="w-full max-h-[88vh] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900">
            <div class="relative border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div class="flex items-start justify-between gap-4 pr-12">
                <div class="min-w-0">
                  <div
                    class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Detail Data
                  </div>
                  <h3 class="mt-3 truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {{ detailModal.title }}
                  </h3>
                  <p v-if="detailModal.subtitle" class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{
                    detailModal.subtitle }}</p>
                </div>
                <button @click="closeDetailModal"
                  class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:border-rose-900/50 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20 dark:focus:ring-offset-slate-900">
                  <span class="text-xl font-black leading-none">×</span>
                </button>
              </div>
            </div>

            <div class="max-h-[calc(88vh-96px)] overflow-y-auto px-6 py-6">
              <div v-if="detailModal.type === 'subject'" class="space-y-4">
                <div class="grid gap-3 sm:grid-cols-3">
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Nama Mapel</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.name || "-" }}
                    </p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Kode</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.code || "-" }}
                    </p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">JP / Minggu</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{
                      formatHours(detailModal.data?.weekly_hours) }}</p>
                  </div>
                </div>
                <div class="flex flex-wrap justify-end gap-2">
                  <button @click="openSubjectModal(detailModal.data); closeDetailModal()"
                    class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                  <button @click="removeSubject(detailModal.data)"
                    class="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700">Hapus</button>
                </div>
              </div>

              <div v-else-if="detailModal.type === 'teacher-load'" class="space-y-4">
                <div class="grid gap-3 sm:grid-cols-4">
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Beban</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.item_count ||
                      0
                      }}</p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Kapasitas</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{
                      formatHours(detailModal.data?.max_weekly_hours) }}</p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Terdistribusi</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{
                      formatHours(detailModal.data?.distributed_hours) }}</p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Sisa</p>
                    <p class="mt-2 text-sm font-bold" :class="remainingHoursClass(detailModal.data?.remaining_hours)">{{
                      formatHours(detailModal.data?.remaining_hours) }}</p>
                  </div>
                </div>

                <div class="max-h-[55vh] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                    <thead
                      class="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <tr>
                        <th class="px-4 py-3 font-semibold">Mapel</th>
                        <th class="px-4 py-3 font-semibold">Kapasitas</th>
                        <th class="px-4 py-3 font-semibold">Terdistribusi</th>
                        <th class="px-4 py-3 font-semibold">Sisa</th>
                        <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="item in detailItems" :key="item.id">
                        <td class="px-4 py-3">
                          <div class="font-semibold text-slate-900 dark:text-white">{{ item.subject_name }}</div>
                          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.subject_code || "-" }}
                          </div>
                        </td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ formatHours(item.max_weekly_hours)
                          }}
                        </td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ formatHours(item.distributed_hours)
                          }}
                        </td>
                        <td class="px-4 py-3 font-semibold" :class="remainingHoursClass(item.remaining_hours)">{{
                          formatHours(item.remaining_hours) }}</td>
                        <td class="px-4 py-3">
                          <div class="flex justify-end gap-2">
                            <button @click="openTeacherLoadModal(item); closeDetailModal()"
                              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                            <button @click="removeTeacherLoad(item)"
                              class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-else-if="detailModal.type === 'distribution'" class="space-y-4">
                <div class="grid gap-3 sm:grid-cols-4">
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Distribusi</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.item_count ||
                      0
                      }}</p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Mapel</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.subject_count
                      ||
                      0 }}</p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Kelas</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.class_count ||
                      0
                      }}</p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Total JP</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{
                      formatHours(detailModal.data?.total_weekly_hours) }}</p>
                  </div>
                </div>

                <div class="max-h-[55vh] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                    <thead
                      class="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <tr>
                        <th class="px-4 py-3 font-semibold">Mapel</th>
                        <th class="px-4 py-3 font-semibold">Kelas</th>
                        <th class="px-4 py-3 font-semibold">JP</th>
                        <th class="px-4 py-3 font-semibold">Kapasitas Beban</th>
                        <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="item in detailItems" :key="item.id">
                        <td class="px-4 py-3">
                          <div class="font-semibold text-slate-900 dark:text-white">{{ item.subject_name }}</div>
                          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.subject_code || "-" }}
                          </div>
                        </td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.class_name }}</td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ formatHours(item.weekly_hours) }}
                        </td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ formatHours(item.load_capacity) }}
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex justify-end gap-2">
                            <button @click="openDistributionModal(item); closeDetailModal()"
                              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                            <button @click="removeDistribution(item)"
                              class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-else-if="detailModal.type === 'schedule-day'" class="space-y-4">
                <div
                  class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      Menampilkan slot untuk <strong class="text-slate-900 dark:text-white">{{
                        detailModal.data?.day_name
                        }}</strong>.
                    </div>
                    <button @click="removeScheduleDaySlots([detailModal.data?.day_name])"
                      :disabled="detailItems.length === 0"
                      class="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                      Hapus Semua Hari Ini
                    </button>
                  </div>
                </div>

                <div class="max-h-[55vh] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                    <thead
                      class="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <tr>
                        <th class="px-4 py-3 font-semibold">Sesi</th>
                        <th class="px-4 py-3 font-semibold">Jam</th>
                        <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="slot in detailItems" :key="slot.id">
                        <td class="px-4 py-3 text-slate-700 dark:text-slate-200">
                          <div class="font-semibold">{{ slot.label || `Sesi ${slot.session_order}` }}</div>
                          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Urutan hari {{ slot.day_order }}
                            ·
                            sesi {{ slot.session_order }}</div>
                        </td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ slot.start_time }} - {{
                          slot.end_time
                          }}</td>
                        <td class="px-4 py-3">
                          <div class="flex justify-end gap-2">
                            <button @click="openSlotModal(slot); closeDetailModal()"
                              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                            <button @click="removeSlot(slot)"
                              class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">Hapus</button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="detailItems.length === 0">
                        <td colspan="3" class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Belum
                          ada
                          slot pada hari ini.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-else-if="detailModal.type === 'generated'" class="space-y-4">
                <div class="grid gap-3 sm:grid-cols-4">
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Jadwal</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.item_count ||
                      0
                      }}</p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Kelas</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.class_count ||
                      0
                      }}</p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Mapel</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.subject_count
                      ||
                      0 }}</p>
                  </div>
                  <div
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p class="text-xs font-semibold uppercase text-slate-400">Hari</p>
                    <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ detailModal.data?.day_count || 0
                      }}</p>
                  </div>
                </div>

                <div class="max-h-[55vh] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                    <thead
                      class="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <tr>
                        <th class="px-4 py-3 font-semibold">Kelas</th>
                        <th class="px-4 py-3 font-semibold">Hari / Jam</th>
                        <th class="px-4 py-3 font-semibold">Mapel</th>
                        <th class="px-4 py-3 font-semibold">LMS</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-for="item in detailItems" :key="item.id">
                        <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white">{{ item.class_name }}</td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                          <div>{{ item.day_name }} · {{ item.slot_label || `Sesi ${item.session_order}` }}</div>
                          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.start_time }} - {{
                            item.end_time }}</div>
                        </td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                          <div>{{ item.subject_name }}</div>
                          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.subject_code || "-" }}
                          </div>
                        </td>
                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">Subject ID: {{ item.learning_subject_id
                          || "-" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="confirmModal.open" class="fixed inset-0 z-[150] flex items-center justify-center p-4"
          style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(14px);">
          <div
            class="w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900">
            <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ confirmModal.title }}</h3>
            </div>
            <div class="px-6 py-5">
              <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">{{ confirmModal.message }}</p>
              <div class="mt-6 flex justify-end gap-3">
                <button @click="closeConfirmModal"
                  class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20">
                  Batal
                </button>
                <button @click="runConfirmAction"
                  class="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700">
                  {{ confirmModal.actionLabel }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </teleport>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { useMasterDataStore } from "@/store/masterData";

const props = defineProps({
  section: {
    type: String,
    default: "subjects",
  },
});

const masterDataStore = useMasterDataStore();

const overview = reactive({
  subjects: [],
  teacher_loads: [],
  class_distributions: [],
  schedule_slots: [],
  generated_entries: [],
  summary: {
    subjects: 0,
    teacher_loads: 0,
    class_distributions: 0,
    schedule_slots: 0,
    generated_entries: 0,
  },
});

const searchTerms = reactive({
  subjects: "",
  teacher_loads: "",
  class_distributions: "",
  schedule: "",
  generate: "",
});

const teachers = ref([]);
const classes = ref([]);
const generating = ref(false);
const generationIssues = ref([]);
const formModal = reactive({
  open: false,
  type: "",
  title: "",
});
const detailModal = reactive({
  open: false,
  type: "",
  title: "",
  subtitle: "",
  data: null,
});
const confirmModal = reactive({
  open: false,
  title: "",
  message: "",
  actionLabel: "Proses",
});
const confirmAction = ref(null);

const subjectEditingId = ref(null);
const teacherLoadEditingId = ref(null);
const distributionEditingId = ref(null);
const slotEditingId = ref(null);

const subjectForm = reactive({
  code: "",
  name: "",
  weekly_hours: 2,
});

const teacherLoadForm = reactive({
  teacher_id: "",
  curriculum_subject_id: "",
  max_weekly_hours: 12,
});

const distributionForm = reactive({
  curriculum_teacher_load_id: "",
  class_id: "",
  weekly_hours: 2,
});

const slotForm = reactive({
  day_name: "Senin",
  day_order: 1,
  session_order: 1,
  start_time: "07:00",
  end_time: "07:45",
  label: "",
});

const bulkSlotForm = reactive({
  days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
  sessions_per_day: 10,
  start_time: "07:00",
  duration_minutes: 45,
  gap_minutes: 0,
  break_count: 2,
  break1_after_session: 3,
  break1_minutes: 15,
  break2_after_session: 6,
  break2_minutes: 15,
  label_mode: "jam",
  overwrite_existing: true,
});
const bulkSlotSaving = ref(false);
const selectedScheduleDayName = ref("");

const dayOptions = [
  { name: "Senin", order: 1 },
  { name: "Selasa", order: 2 },
  { name: "Rabu", order: 3 },
  { name: "Kamis", order: 4 },
  { name: "Jumat", order: 5 },
  { name: "Sabtu", order: 6 },
];

const currentSection = computed(() => (["subjects", "teacher-loads", "class-distributions", "learning", "schedule", "generate"].includes(props.section) ? props.section : "subjects"));

const normalizeSearch = (value) => String(value || "").trim().toLowerCase();
const toNumber = (value) => Number(value || 0) || 0;
const formatHours = (value) => `${toNumber(value).toLocaleString("id-ID")} JP`;
const groupKeyPart = (value) => normalizeSearch(value).replace(/\s+/g, "-") || "tanpa-data";
const groupTeacherKey = (item) => `teacher-${groupKeyPart(item?.teacher_id || item?.teacher_name)}`;
const getInitials = (value) => {
  const initials = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  return initials || "-";
};
const calculatePercent = (value, total) => {
  const current = toNumber(value);
  const target = toNumber(total);
  if (target <= 0) return current > 0 ? 100 : 0;
  return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
};

const sortByText = (a, b, field) => normalizeSearch(a?.[field]).localeCompare(normalizeSearch(b?.[field]));

const remainingHoursClass = (value) => {
  const remaining = toNumber(value);
  if (remaining < 0) return "text-rose-600 dark:text-rose-300";
  if (remaining === 0) return "text-amber-600 dark:text-amber-300";
  return "text-emerald-600 dark:text-emerald-300";
};

const getDayOrder = (dayName) => {
  const day = dayOptions.find((item) => item.name === dayName);
  return day?.order || 99;
};

const sortScheduleItems = (items) => {
  return items.slice().sort((a, b) => {
    const dayOrder = toNumber(a?.day_order || getDayOrder(a?.day_name)) - toNumber(b?.day_order || getDayOrder(b?.day_name));
    if (dayOrder !== 0) return dayOrder;
    const sessionOrder = toNumber(a?.session_order) - toNumber(b?.session_order);
    if (sessionOrder !== 0) return sessionOrder;
    return normalizeSearch(a?.class_name).localeCompare(normalizeSearch(b?.class_name));
  });
};

const summaryCards = computed(() => [
  { label: "Mapel", value: overview.summary.subjects || 0, caption: "Mata pelajaran aktif", icon: "ph:books", cardClass: "bg-sky-600" },
  { label: "Beban Guru", value: overview.summary.teacher_loads || 0, caption: "Kapasitas mengajar", icon: "ph:chalkboard-teacher", cardClass: "bg-indigo-600" },
  { label: "Distribusi Rombel", value: overview.summary.class_distributions || 0, caption: "Mapping guru kelas", icon: "mdi:google-classroom", cardClass: "bg-emerald-600" },
  { label: "Slot Jadwal", value: overview.summary.schedule_slots || 0, caption: "Hari dan jam aktif", icon: "mdi:calendar-clock", cardClass: "bg-rose-600" },
  { label: "Hasil Generate", value: overview.summary.generated_entries || 0, caption: "Jadwal terbentuk", icon: "ph:calendar-check", cardClass: "bg-cyan-600" },
]);

const filteredSubjects = computed(() => {
  const query = normalizeSearch(searchTerms.subjects);
  return overview.subjects
    .filter((item) => normalizeSearch(item?.name).includes(query) || normalizeSearch(item?.code).includes(query))
    .slice()
    .sort((a, b) => sortByText(a, b, "name"));
});

const filteredTeacherLoads = computed(() => {
  const query = normalizeSearch(searchTerms.teacher_loads);
  return overview.teacher_loads.filter((item) =>
    normalizeSearch(item?.teacher_name).includes(query) ||
    normalizeSearch(item?.subject_name).includes(query) ||
    normalizeSearch(item?.subject_code).includes(query)
  );
});

const filteredClassDistributions = computed(() => {
  const query = normalizeSearch(searchTerms.class_distributions);
  return overview.class_distributions.filter((item) =>
    normalizeSearch(item?.teacher_name).includes(query) ||
    normalizeSearch(item?.subject_name).includes(query) ||
    normalizeSearch(item?.subject_code).includes(query) ||
    normalizeSearch(item?.class_name).includes(query)
  );
});

const filteredGeneratedEntries = computed(() => {
  const query = normalizeSearch(searchTerms.generate);
  return overview.generated_entries.filter((item) =>
    normalizeSearch(item?.class_name).includes(query) ||
    normalizeSearch(item?.teacher_name).includes(query) ||
    normalizeSearch(item?.subject_name).includes(query) ||
    normalizeSearch(item?.subject_code).includes(query)
  );
});

const teacherLoadCards = computed(() => {
  const groupMap = new Map();

  for (const item of filteredTeacherLoads.value) {
    const key = groupTeacherKey(item);
    const current = groupMap.get(key) || {
      key,
      teacher_name: item?.teacher_name || "Tanpa nama guru",
      items: [],
      subjectKeys: new Set(),
      max_weekly_hours: 0,
      distributed_hours: 0,
      remaining_hours: 0,
    };

    current.items.push(item);
    current.subjectKeys.add(String(item?.curriculum_subject_id || item?.subject_name || ""));
    current.max_weekly_hours += toNumber(item?.max_weekly_hours);
    current.distributed_hours += toNumber(item?.distributed_hours);
    current.remaining_hours += toNumber(item?.remaining_hours);
    groupMap.set(key, current);
  }

  return Array.from(groupMap.values())
    .map((group) => ({
      key: group.key,
      teacher_name: group.teacher_name,
      items: group.items.slice().sort((a, b) => sortByText(a, b, "subject_name")),
      item_count: group.items.length,
      subject_count: group.subjectKeys.size,
      max_weekly_hours: group.max_weekly_hours,
      distributed_hours: group.distributed_hours,
      remaining_hours: group.remaining_hours,
    }))
    .sort((a, b) => normalizeSearch(a.teacher_name).localeCompare(normalizeSearch(b.teacher_name)));
});

const distributionCards = computed(() => {
  const groupMap = new Map();

  for (const item of filteredClassDistributions.value) {
    const key = groupTeacherKey(item);
    const current = groupMap.get(key) || {
      key,
      teacher_name: item?.teacher_name || "Tanpa nama guru",
      items: [],
      subjectKeys: new Set(),
      classKeys: new Set(),
      loadCapacityByKey: new Map(),
      total_weekly_hours: 0,
    };
    const subjectKey = item?.curriculum_subject_id || `${item?.subject_name || ""}-${item?.subject_code || ""}`;
    const classKey = item?.class_id || item?.class_name || "";
    const loadKey = item?.curriculum_teacher_load_id || `${subjectKey}-${item?.load_capacity || 0}`;

    current.items.push(item);
    current.subjectKeys.add(String(subjectKey));
    current.classKeys.add(String(classKey));
    current.total_weekly_hours += toNumber(item?.weekly_hours);
    if (!current.loadCapacityByKey.has(loadKey)) {
      current.loadCapacityByKey.set(loadKey, toNumber(item?.load_capacity));
    }
    groupMap.set(key, current);
  }

  return Array.from(groupMap.values())
    .map((group) => ({
      key: group.key,
      teacher_name: group.teacher_name,
      items: group.items.slice().sort((a, b) => {
        const subjectOrder = normalizeSearch(a?.subject_name).localeCompare(normalizeSearch(b?.subject_name));
        if (subjectOrder !== 0) return subjectOrder;
        return normalizeSearch(a?.class_name).localeCompare(normalizeSearch(b?.class_name));
      }),
      item_count: group.items.length,
      subject_count: group.subjectKeys.size,
      class_count: group.classKeys.size,
      total_weekly_hours: group.total_weekly_hours,
      load_capacity: Array.from(group.loadCapacityByKey.values()).reduce((sum, value) => sum + value, 0),
    }))
    .sort((a, b) => normalizeSearch(a.teacher_name).localeCompare(normalizeSearch(b.teacher_name)));
});

const generatedScheduleCards = computed(() => {
  const groupMap = new Map();

  for (const item of filteredGeneratedEntries.value) {
    const key = groupTeacherKey(item);
    const current = groupMap.get(key) || {
      key,
      teacher_name: item?.teacher_name || "Tanpa nama guru",
      items: [],
      subjectKeys: new Set(),
      classKeys: new Set(),
      dayKeys: new Set(),
      lmsKeys: new Set(),
    };

    current.items.push(item);
    current.subjectKeys.add(String(item?.curriculum_subject_id || item?.subject_name || ""));
    current.classKeys.add(String(item?.class_id || item?.class_name || ""));
    current.dayKeys.add(String(item?.day_name || ""));
    if (item?.learning_subject_id) current.lmsKeys.add(String(item.learning_subject_id));
    groupMap.set(key, current);
  }

  return Array.from(groupMap.values())
    .map((group) => ({
      key: group.key,
      teacher_name: group.teacher_name,
      items: sortScheduleItems(group.items),
      item_count: group.items.length,
      subject_count: group.subjectKeys.size,
      class_count: group.classKeys.size,
      day_count: group.dayKeys.size,
      lms_count: group.lmsKeys.size,
    }))
    .sort((a, b) => normalizeSearch(a.teacher_name).localeCompare(normalizeSearch(b.teacher_name)));
});

const bulkSlotPreviewCount = computed(() => {
  const dayCount = Array.isArray(bulkSlotForm.days) ? bulkSlotForm.days.length : 0;
  const sessions = Number(bulkSlotForm.sessions_per_day || 0);
  if (dayCount <= 0 || sessions <= 0) return 0;
  return dayCount * sessions;
});

const scheduleDayRows = computed(() => {
  const slots = Array.isArray(overview.schedule_slots) ? overview.schedule_slots : [];
  const dayMap = new Map();

  for (const slot of slots) {
    const dayName = String(slot?.day_name || "").trim() || "-";
    const current = dayMap.get(dayName) || {
      day_name: dayName,
      day_order: Number(slot?.day_order || 0) || 0,
      session_count: 0,
      start_time: slot?.start_time || "-",
      end_time: slot?.end_time || "-",
    };

    current.session_count += 1;
    const order = Number(slot?.day_order || 0) || 0;
    if (current.day_order === 0 || (order > 0 && order < current.day_order)) {
      current.day_order = order;
    }

    const start = String(slot?.start_time || "");
    const end = String(slot?.end_time || "");
    if (start && (current.start_time === "-" || start < current.start_time)) current.start_time = start;
    if (end && (current.end_time === "-" || end > current.end_time)) current.end_time = end;

    dayMap.set(dayName, current);
  }

  return Array.from(dayMap.values()).sort((a, b) => {
    const ao = Number(a.day_order || 0);
    const bo = Number(b.day_order || 0);
    if (ao && bo && ao !== bo) return ao - bo;
    return String(a.day_name).localeCompare(String(b.day_name));
  });
});

const filteredScheduleDayRows = computed(() => {
  const query = normalizeSearch(searchTerms.schedule);
  return scheduleDayRows.value.filter((item) => normalizeSearch(item?.day_name).includes(query));
});

const selectedScheduleDaySlots = computed(() => {
  const target = String(selectedScheduleDayName.value || "").trim();
  if (!target) return [];
  const slots = Array.isArray(overview.schedule_slots) ? overview.schedule_slots : [];
  return slots
    .filter((slot) => String(slot?.day_name || "").trim() === target)
    .slice()
    .sort((a, b) => {
      const ao = Number(a?.session_order || 0);
      const bo = Number(b?.session_order || 0);
      if (ao !== bo) return ao - bo;
      return Number(a?.id || 0) - Number(b?.id || 0);
    });
});

const detailItems = computed(() => {
  return Array.isArray(detailModal.data?.items) ? detailModal.data.items : [];
});

const openConfirmModal = (title, message, actionLabel, action) => {
  confirmModal.open = true;
  confirmModal.title = title;
  confirmModal.message = message;
  confirmModal.actionLabel = actionLabel;
  confirmAction.value = action;
};

const closeConfirmModal = () => {
  confirmModal.open = false;
  confirmAction.value = null;
};

const runConfirmAction = async () => {
  const action = confirmAction.value;
  closeConfirmModal();
  if (typeof action === "function") {
    await action();
  }
};

const closeFormModal = () => {
  formModal.open = false;
};

const openDetailModal = (type, title, data = null, subtitle = "") => {
  detailModal.open = true;
  detailModal.type = type;
  detailModal.title = title || "Detail Data";
  detailModal.subtitle = subtitle;
  detailModal.data = data;
};

const closeDetailModal = () => {
  detailModal.open = false;
  detailModal.type = "";
  detailModal.title = "";
  detailModal.subtitle = "";
  detailModal.data = null;
};

const openSubjectModal = (item = null) => {
  if (item) {
    editSubject(item);
  } else {
    resetSubjectForm();
  }
  formModal.open = true;
  formModal.type = "subject";
  formModal.title = item ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran";
};

const openTeacherLoadModal = (item = null) => {
  if (item) {
    editTeacherLoad(item);
  } else {
    resetTeacherLoadForm();
  }
  formModal.open = true;
  formModal.type = "teacher-load";
  formModal.title = item ? "Edit Beban Guru" : "Tambah Beban Guru";
};

const openDistributionModal = (item = null) => {
  if (item) {
    editDistribution(item);
  } else {
    resetDistributionForm();
  }
  formModal.open = true;
  formModal.type = "distribution";
  formModal.title = item ? "Edit Distribusi Guru ke Kelas" : "Tambah Distribusi Guru ke Kelas";
};

const openSlotModal = (item = null) => {
  if (item) {
    editSlot(item);
  } else {
    resetSlotForm();
  }
  formModal.open = true;
  formModal.type = "slot";
  formModal.title = item ? "Edit Slot Jadwal" : "Tambah Slot Jadwal";
};

const openBulkSlotModal = () => {
  formModal.open = true;
  formModal.type = "slot-bulk";
  formModal.title = "Buat Slot Jadwal Cepat";
};

const openScheduleDayDetail = (dayName) => {
  const target = String(dayName || "").trim();
  selectedScheduleDayName.value = target;
  const dayRow = scheduleDayRows.value.find((item) => item.day_name === target) || {
    day_name: target || "-",
    day_order: 0,
    session_count: 0,
    start_time: "-",
    end_time: "-",
  };
  const items = sortScheduleItems(
    overview.schedule_slots.filter((slot) => String(slot?.day_name || "").trim() === target)
  );
  openDetailModal("schedule-day", `Detail Slot - ${target || "-"}`, { ...dayRow, items });
};

const resetSubjectForm = () => {
  subjectEditingId.value = null;
  subjectForm.code = "";
  subjectForm.name = "";
  subjectForm.weekly_hours = 2;
};

const resetTeacherLoadForm = () => {
  teacherLoadEditingId.value = null;
  teacherLoadForm.teacher_id = "";
  teacherLoadForm.curriculum_subject_id = "";
  teacherLoadForm.max_weekly_hours = 12;
};

const resetDistributionForm = () => {
  distributionEditingId.value = null;
  distributionForm.curriculum_teacher_load_id = "";
  distributionForm.class_id = "";
  distributionForm.weekly_hours = 2;
};

const resetSlotForm = () => {
  slotEditingId.value = null;
  slotForm.day_name = "Senin";
  slotForm.day_order = 1;
  slotForm.session_order = 1;
  slotForm.start_time = "07:00";
  slotForm.end_time = "07:45";
  slotForm.label = "";
};

const applyOverview = (payload) => {
  overview.subjects = Array.isArray(payload?.subjects) ? payload.subjects : [];
  overview.teacher_loads = Array.isArray(payload?.teacher_loads) ? payload.teacher_loads : [];
  overview.class_distributions = Array.isArray(payload?.class_distributions) ? payload.class_distributions : [];
  overview.schedule_slots = Array.isArray(payload?.schedule_slots) ? payload.schedule_slots : [];
  overview.generated_entries = Array.isArray(payload?.generated_entries) ? payload.generated_entries : [];
  overview.summary = payload?.summary || {
    subjects: 0,
    teacher_loads: 0,
    class_distributions: 0,
    schedule_slots: 0,
    generated_entries: 0,
  };
};

const loadData = async () => {
  try {
    const [overviewResponse, teacherItems, classItems] = await Promise.all([
      api.get("/learning/curriculum/overview"),
      masterDataStore.getTeacherUsers({ force: true }),
      masterDataStore.getClasses({ force: true }),
    ]);
    applyOverview(overviewResponse?.data || {});
    teachers.value = Array.isArray(teacherItems) ? teacherItems : [];
    classes.value = Array.isArray(classItems) ? classItems : [];
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Data",
      message: error.message || "Gagal memuat modul kurikulum.",
      type: "error",
    });
  }
};

const saveSubject = async () => {
  try {
    const payload = {
      code: subjectForm.code,
      name: subjectForm.name,
      weekly_hours: Number(subjectForm.weekly_hours || 0),
    };
    if (subjectEditingId.value) {
      await api.put(`/learning/curriculum/subjects/${subjectEditingId.value}`, payload);
    } else {
      await api.post("/learning/curriculum/subjects", payload);
    }
    resetSubjectForm();
    closeFormModal();
    await loadData();
    pushToast({
      title: "Berhasil",
      message: "Mapel kurikulum berhasil disimpan.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Menyimpan",
      message: error.message || "Gagal menyimpan mapel kurikulum.",
      type: "error",
    });
  }
};

const saveTeacherLoad = async () => {
  try {
    const payload = {
      teacher_id: Number(teacherLoadForm.teacher_id || 0),
      curriculum_subject_id: Number(teacherLoadForm.curriculum_subject_id || 0),
      max_weekly_hours: Number(teacherLoadForm.max_weekly_hours || 0),
    };
    if (teacherLoadEditingId.value) {
      await api.put(`/learning/curriculum/teacher-loads/${teacherLoadEditingId.value}`, payload);
    } else {
      await api.post("/learning/curriculum/teacher-loads", payload);
    }
    resetTeacherLoadForm();
    closeFormModal();
    await loadData();
    pushToast({
      title: "Berhasil",
      message: "Beban guru berhasil disimpan.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Menyimpan",
      message: error.message || "Gagal menyimpan beban guru.",
      type: "error",
    });
  }
};

const saveDistribution = async () => {
  try {
    const payload = {
      curriculum_teacher_load_id: Number(distributionForm.curriculum_teacher_load_id || 0),
      class_id: Number(distributionForm.class_id || 0),
      weekly_hours: Number(distributionForm.weekly_hours || 0),
    };
    if (distributionEditingId.value) {
      await api.put(`/learning/curriculum/class-distributions/${distributionEditingId.value}`, payload);
    } else {
      await api.post("/learning/curriculum/class-distributions", payload);
    }
    resetDistributionForm();
    closeFormModal();
    await loadData();
    pushToast({
      title: "Berhasil",
      message: "Distribusi kelas berhasil disimpan.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Menyimpan",
      message: error.message || "Gagal menyimpan distribusi kelas.",
      type: "error",
    });
  }
};

const saveSlot = async () => {
  try {
    const payload = {
      day_name: slotForm.day_name,
      day_order: Number(slotForm.day_order || 0),
      session_order: Number(slotForm.session_order || 0),
      start_time: slotForm.start_time,
      end_time: slotForm.end_time,
      label: slotForm.label,
    };
    if (slotEditingId.value) {
      await api.put(`/learning/curriculum/schedule-slots/${slotEditingId.value}`, payload);
    } else {
      await api.post("/learning/curriculum/schedule-slots", payload);
    }
    resetSlotForm();
    closeFormModal();
    await loadData();
    pushToast({
      title: "Berhasil",
      message: "Slot jadwal berhasil disimpan.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Menyimpan",
      message: error.message || "Gagal menyimpan slot jadwal.",
      type: "error",
    });
  }
};

const saveBulkSlots = async () => {
  if (!Array.isArray(bulkSlotForm.days) || bulkSlotForm.days.length === 0) {
    pushToast({ title: "Hari Kosong", message: "Pilih minimal 1 hari.", type: "error" });
    return;
  }
  bulkSlotSaving.value = true;
  try {
    const days = dayOptions
      .filter((day) => bulkSlotForm.days.includes(day.name))
      .map((day) => ({ day_name: day.name, day_order: day.order }));

    const payload = {
      days,
      sessions_per_day: Number(bulkSlotForm.sessions_per_day || 0),
      start_time: bulkSlotForm.start_time,
      duration_minutes: Number(bulkSlotForm.duration_minutes || 0),
      gap_minutes: Number(bulkSlotForm.gap_minutes || 0),
      breaks: [],
      label_mode: bulkSlotForm.label_mode,
      overwrite_existing: Boolean(bulkSlotForm.overwrite_existing),
    };

    const breakCount = Number(bulkSlotForm.break_count || 0);
    if (breakCount >= 1) {
      payload.breaks.push({
        after_session: Number(bulkSlotForm.break1_after_session || 0),
        minutes: Number(bulkSlotForm.break1_minutes || 0),
      });
    }
    if (breakCount >= 2) {
      payload.breaks.push({
        after_session: Number(bulkSlotForm.break2_after_session || 0),
        minutes: Number(bulkSlotForm.break2_minutes || 0),
      });
    }

    const response = await api.post("/learning/curriculum/schedule-slots/bulk", payload);
    closeFormModal();
    await loadData();
    pushToast({
      title: "Berhasil",
      message: `Slot diproses: ${response?.data?.processed || 0}`,
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Buat Slot",
      message: error.message || "Gagal membuat slot jadwal.",
      type: "error",
    });
  } finally {
    bulkSlotSaving.value = false;
  }
};

const removeSubject = async (item) => {
  openConfirmModal("Hapus Mapel", `Hapus mapel kurikulum "${item.name}"?`, "Hapus", async () => {
    try {
      await api.delete(`/learning/curriculum/subjects/${item.id}`);
      await loadData();
      pushToast({
        title: "Berhasil",
        message: "Mapel kurikulum berhasil dihapus.",
        type: "success",
      });
    } catch (error) {
      pushToast({
        title: "Gagal Menghapus",
        message: error.message || "Gagal menghapus mapel kurikulum.",
        type: "error",
      });
    }
  });
};

const removeTeacherLoad = async (item) => {
  openConfirmModal("Hapus Beban Guru", `Hapus beban ${item.teacher_name} untuk ${item.subject_name}?`, "Hapus", async () => {
    try {
      await api.delete(`/learning/curriculum/teacher-loads/${item.id}`);
      await loadData();
      pushToast({
        title: "Berhasil",
        message: "Beban guru berhasil dihapus.",
        type: "success",
      });
    } catch (error) {
      pushToast({
        title: "Gagal Menghapus",
        message: error.message || "Gagal menghapus beban guru.",
        type: "error",
      });
    }
  });
};

const removeDistribution = async (item) => {
  openConfirmModal("Hapus Distribusi", `Hapus distribusi ${item.teacher_name} - ${item.subject_name} - ${item.class_name}?`, "Hapus", async () => {
    try {
      await api.delete(`/learning/curriculum/class-distributions/${item.id}`);
      await loadData();
      pushToast({
        title: "Berhasil",
        message: "Distribusi kelas berhasil dihapus.",
        type: "success",
      });
    } catch (error) {
      pushToast({
        title: "Gagal Menghapus",
        message: error.message || "Gagal menghapus distribusi kelas.",
        type: "error",
      });
    }
  });
};

const removeSlot = async (item) => {
  openConfirmModal("Hapus Slot", `Hapus slot ${item.day_name} ${item.label || `Sesi ${item.session_order}`}?`, "Hapus", async () => {
    try {
      await api.delete(`/learning/curriculum/schedule-slots/${item.id}`);
      await loadData();
      pushToast({
        title: "Berhasil",
        message: "Slot jadwal berhasil dihapus.",
        type: "success",
      });
    } catch (error) {
      pushToast({
        title: "Gagal Menghapus",
        message: error.message || "Gagal menghapus slot jadwal.",
        type: "error",
      });
    }
  });
};

const removeScheduleDaySlots = (dayNames) => {
  const cleanedDayNames = Array.isArray(dayNames)
    ? dayNames.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

  if (cleanedDayNames.length === 0) {
    pushToast({
      title: "Hari Kosong",
      message: "Tidak ada hari yang dipilih.",
      type: "error",
    });
    return;
  }

  openConfirmModal(
    "Hapus Banyak Slot",
    `Hapus semua slot untuk ${cleanedDayNames.join(", ")}?`,
    "Hapus",
    async () => {
      try {
        await api.delete("/learning/curriculum/schedule-slots/bulk", {
          body: { day_names: cleanedDayNames },
        });
        if (cleanedDayNames.includes(selectedScheduleDayName.value)) {
          selectedScheduleDayName.value = "";
        }
        await loadData();
        pushToast({
          title: "Berhasil",
          message: "Slot jadwal berhasil dihapus.",
          type: "success",
        });
      } catch (error) {
        pushToast({
          title: "Gagal Menghapus",
          message: error.message || "Gagal menghapus slot jadwal.",
          type: "error",
        });
      }
    }
  );
};

const editSubject = (item) => {
  subjectEditingId.value = item.id;
  subjectForm.code = item.code || "";
  subjectForm.name = item.name || "";
  subjectForm.weekly_hours = Number(item.weekly_hours || 2);
};

const editTeacherLoad = (item) => {
  teacherLoadEditingId.value = item.id;
  teacherLoadForm.teacher_id = String(item.teacher_id || "");
  teacherLoadForm.curriculum_subject_id = String(item.curriculum_subject_id || "");
  teacherLoadForm.max_weekly_hours = Number(item.max_weekly_hours || 0);
};

const editDistribution = (item) => {
  distributionEditingId.value = item.id;
  distributionForm.curriculum_teacher_load_id = String(item.curriculum_teacher_load_id || "");
  distributionForm.class_id = String(item.class_id || "");
  distributionForm.weekly_hours = Number(item.weekly_hours || 0);
};

const editSlot = (item) => {
  slotEditingId.value = item.id;
  slotForm.day_name = item.day_name || "Senin";
  slotForm.day_order = Number(item.day_order || 1);
  slotForm.session_order = Number(item.session_order || 1);
  slotForm.start_time = item.start_time || "07:00";
  slotForm.end_time = item.end_time || "07:45";
  slotForm.label = item.label || "";
};

const generateSchedule = async () => {
  openConfirmModal("Generate Jadwal", "Generate jadwal sekarang? Sistem akan memakai distribusi rombel yang sudah Anda tentukan.", "Generate", async () => {
    generating.value = true;
    try {
      const response = await api.post("/learning/curriculum/generate", {});
      generationIssues.value = Array.isArray(response?.data?.issues) ? response.data.issues : [];
      masterDataStore.invalidate(["adminSubjects", "teacherSubjects", "studentSubjects"]);
      await loadData();
      pushToast({
        title: "Berhasil",
        message: "Generate jadwal selesai diproses.",
        type: "success",
      });
    } catch (error) {
      pushToast({
        title: "Gagal Generate",
        message: error.message || "Gagal melakukan generate kurikulum.",
        type: "error",
      });
    } finally {
      generating.value = false;
    }
  });
};


const learningData = ref([]);
const learningEditingId = ref(null);
const learningForm = reactive({
  teacher_id: '',
  subject_id: '',
  class_id: '',
});

const filteredLearning = computed(() => {
  const term = searchTerms.value?.learning?.toLowerCase() || searchTerms.learning?.toLowerCase();
  if (!term) return learningData.value;
  return learningData.value.filter(item =>
    (item.teacher_name || '').toLowerCase().includes(term) ||
    (item.subject_name || '').toLowerCase().includes(term) ||
    (item.class_name || '').toLowerCase().includes(term)
  );
});

const openLearningModal = () => {
  learningEditingId.value = null;
  learningForm.teacher_id = '';
  learningForm.subject_id = '';
  learningForm.class_id = '';
  openModal('learning');
};

const editLearning = (item) => {
  learningEditingId.value = item.id;
  learningForm.teacher_id = String(item.teacher_id);
  learningForm.subject_id = String(item.subject_id);
  learningForm.class_id = String(item.class_id);
  openModal('learning');
};

const removeLearning = async (item) => {
  openConfirmModal("Hapus Pembelajaran", "Hapus", async () => {
    try {
      await api.delete();
      await loadData();
      pushToast({ title: "Berhasil", message: "Data berhasil dihapus.", type: "success" });
    } catch (error) {
      pushToast({ title: "Gagal", message: error.message, type: "error" });
    }
  });
};
onMounted(() => {
  loadData();
});
</script>
