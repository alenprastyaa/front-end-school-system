<template>
  <div class="min-h-screen bg-slate-50/60 pb-12 pt-4 font-sans text-slate-900 md:px-8 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto space-y-6">
      <section v-if="currentSection === 'generate'" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <button
          @click="generateSchedule"
          :disabled="generating"
          class="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ generating ? "Sedang Generate..." : "Generate Jadwal" }}
        </button>
      </section>

      <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <article
          v-for="card in summaryCards"
          :key="card.label"
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ card.label }}</p>
            <p class="text-2xl font-black text-slate-900 dark:text-white">{{ card.value }}</p>
          </div>
        </article>
      </section>

      <section class="rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100">
        Alur: `Mapel -> Beban Guru -> Distribusi Kelas -> Slot Jadwal -> Generate`
      </section>

      <article v-if="currentSection === 'subjects'" class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Sub Menu 1</p>
              <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">Mata Pelajaran</h2>
            </div>
            <button @click="openSubjectModal()" class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
              Tambah Mapel
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
              <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-semibold">Mapel</th>
                  <th class="px-4 py-3 font-semibold">Kode</th>
                  <th class="px-4 py-3 font-semibold">JP</th>
                  <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in overview.subjects" :key="item.id">
                  <td class="px-4 py-3">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.name }}</div>
                  </td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.code || "-" }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.weekly_hours }} JP</td>
                  <td class="px-4 py-3">
                    <div class="flex justify-end gap-2">
                      <button @click="openSubjectModal(item)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                      <button @click="removeSubject(item)" class="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:border-rose-500/30 dark:text-rose-300">Hapus</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="overview.subjects.length === 0">
                  <td colspan="4" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada mapel kurikulum.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article v-if="currentSection === 'teacher-loads'" class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Sub Menu 2</p>
              <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">Beban Guru</h2>
            </div>
            <button @click="openTeacherLoadModal()" class="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400">
              Tambah Beban Guru
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
              <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-semibold">Guru</th>
                  <th class="px-4 py-3 font-semibold">Mapel</th>
                  <th class="px-4 py-3 font-semibold">Kapasitas</th>
                  <th class="px-4 py-3 font-semibold">Terdistribusi</th>
                  <th class="px-4 py-3 font-semibold">Sisa</th>
                  <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in overview.teacher_loads" :key="item.id">
                  <td class="px-4 py-3">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.teacher_name }}</div>
                  </td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.subject_name }}{{ item.subject_code ? ` (${item.subject_code})` : "" }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.max_weekly_hours }} JP</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.distributed_hours }} JP</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.remaining_hours }} JP</td>
                  <td class="px-4 py-3">
                    <div class="flex justify-end gap-2">
                      <button @click="openTeacherLoadModal(item)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                      <button @click="removeTeacherLoad(item)" class="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:border-rose-500/30 dark:text-rose-300">Hapus</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="overview.teacher_loads.length === 0">
                  <td colspan="6" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada data beban guru.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article v-if="currentSection === 'class-distributions'" class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Sub Menu 3</p>
              <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">Distribusi Guru ke Kelas</h2>
            </div>
            <button @click="openDistributionModal()" class="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
              Tambah Distribusi
            </button>
          </div>
        </div>
        <div class="space-y-5 p-6">
          <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            Total distribusi per beban guru tidak boleh melebihi kapasitas JP yang sudah ditentukan pada submenu <strong>Beban Guru</strong>.
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
              <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-semibold">Guru</th>
                  <th class="px-4 py-3 font-semibold">Mapel</th>
                  <th class="px-4 py-3 font-semibold">Kelas</th>
                  <th class="px-4 py-3 font-semibold">JP</th>
                  <th class="px-4 py-3 font-semibold">Kapasitas Beban</th>
                  <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in overview.class_distributions" :key="item.id">
                  <td class="px-4 py-3">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.teacher_name }}</div>
                  </td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.subject_name }}{{ item.subject_code ? ` (${item.subject_code})` : "" }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.class_name }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.weekly_hours }} JP</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.load_capacity }} JP</td>
                  <td class="px-4 py-3">
                    <div class="flex justify-end gap-2">
                      <button @click="openDistributionModal(item)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                      <button @click="removeDistribution(item)" class="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:border-rose-500/30 dark:text-rose-300">Hapus</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="overview.class_distributions.length === 0">
                  <td colspan="6" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada distribusi guru ke kelas.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article v-if="currentSection === 'schedule'" class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Sub Menu 4</p>
              <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">Jadwal Pembelajaran</h2>
            </div>
            <div class="flex flex-wrap items-center justify-end gap-2">
              <button @click="openBulkSlotModal()" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20">
                Buat Slot Cepat
              </button>
              <button @click="openSlotModal()" class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Tambah Slot
              </button>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
              <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-semibold">Hari</th>
                  <th class="px-4 py-3 font-semibold">Ringkasan</th>
                  <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in scheduleDayRows" :key="item.day_name">
                  <td class="px-4 py-3">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.day_name }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Urutan {{ item.day_order }}</div>
                  </td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <div class="font-semibold text-slate-700 dark:text-slate-200">{{ item.session_count }} sesi</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.start_time }} - {{ item.end_time }}</div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex justify-end gap-2">
                      <button @click="openScheduleDayDetail(item.day_name)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                        Detail
                      </button>
                      <button @click="openSlotModal()" class="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-200">
                        Tambah
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="scheduleDayRows.length === 0">
                  <td colspan="3" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada slot jadwal.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article v-if="currentSection === 'generate'" class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Sub Menu 5</p>
          <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">Generate Pembagian</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Generator menyusun jadwal dari distribusi rombel yang sudah ditetapkan admin.</p>
        </div>
        <div class="space-y-5 p-6">
          <div v-if="generationIssues.length > 0" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <p class="text-sm font-semibold text-amber-800 dark:text-amber-200">Catatan generator</p>
            <ul class="mt-3 space-y-2 text-sm text-amber-700 dark:text-amber-100">
              <li v-for="issue in generationIssues" :key="issue" class="flex gap-2">
                <span class="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
                <span>{{ issue }}</span>
              </li>
            </ul>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
              <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-semibold">Kelas</th>
                  <th class="px-4 py-3 font-semibold">Hari / Jam</th>
                  <th class="px-4 py-3 font-semibold">Mapel</th>
                  <th class="px-4 py-3 font-semibold">Guru</th>
                  <th class="px-4 py-3 font-semibold">LMS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in overview.generated_entries" :key="item.id">
                  <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white">{{ item.class_name }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <div>{{ item.day_name }} · {{ item.slot_label || `Sesi ${item.session_order}` }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.start_time }} - {{ item.end_time }}</div>
                  </td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <div>{{ item.subject_name }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.subject_code || "-" }}</div>
                  </td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ item.teacher_name }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-300">Subject ID: {{ item.learning_subject_id || "-" }}</td>
                </tr>
                <tr v-if="overview.generated_entries.length === 0">
                  <td colspan="5" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada hasil generate jadwal.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
            Subject LMS otomatis dibuat per kombinasi <strong class="text-slate-900 dark:text-white">kelas + mapel</strong>. Guru pengampu mengikuti hasil distribusi rombel yang sudah ditetapkan admin sebelumnya.
          </div>
        </div>
      </article>

      <teleport to="body">
        <div v-if="formModal.open" class="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/55 p-4">
          <div class="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Input Data</p>
                <h3 class="mt-2 text-xl font-bold text-slate-900 dark:text-white">{{ formModal.title }}</h3>
              </div>
              <button @click="closeFormModal" class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                x
              </button>
            </div>

            <div class="mt-6 space-y-4" v-if="formModal.type === 'subject'">
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kode Mapel</label>
                  <input v-model="subjectForm.code" type="text" placeholder="Contoh: MTK" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">JP / Minggu per Rombel</label>
                  <input v-model="subjectForm.weekly_hours" type="number" min="1" max="20" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div class="md:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Mapel</label>
                  <input v-model="subjectForm.name" type="text" placeholder="Contoh: Matematika" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-4" v-else-if="formModal.type === 'teacher-load'">
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Guru</label>
                  <select v-model="teacherLoadForm.teacher_id" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <option value="">-- Pilih Guru --</option>
                    <option v-for="item in teachers" :key="item.id" :value="String(item.id)">
                      {{ item.full_name || item.username }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mapel</label>
                  <select v-model="teacherLoadForm.curriculum_subject_id" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <option value="">-- Pilih Mapel --</option>
                    <option v-for="item in overview.subjects" :key="item.id" :value="String(item.id)">
                      {{ item.name }}{{ item.code ? ` (${item.code})` : "" }}
                    </option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Total Kapasitas JP / Minggu</label>
                  <input v-model="teacherLoadForm.max_weekly_hours" type="number" min="1" max="60" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-4" v-else-if="formModal.type === 'distribution'">
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Beban Guru</label>
                  <select v-model="distributionForm.curriculum_teacher_load_id" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <option value="">-- Pilih Beban Guru --</option>
                    <option v-for="item in overview.teacher_loads" :key="item.id" :value="String(item.id)">
                      {{ item.teacher_name }} • {{ item.subject_name }} • kapasitas {{ item.max_weekly_hours }} JP
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kelas / Rombel</label>
                  <select v-model="distributionForm.class_id" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <option value="">-- Pilih Kelas --</option>
                    <option v-for="item in classes" :key="item.id" :value="String(item.id)">
                      {{ item.class_name }}
                    </option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">JP untuk Kelas Ini</label>
                  <input v-model="distributionForm.weekly_hours" type="number" min="1" max="20" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-4" v-else-if="formModal.type === 'slot'">
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Hari</label>
                  <select v-model="slotForm.day_name" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <option v-for="day in dayOptions" :key="day.name" :value="day.name">{{ day.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Urutan Hari</label>
                  <input v-model="slotForm.day_order" type="number" min="1" max="7" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Sesi Ke</label>
                  <input v-model="slotForm.session_order" type="number" min="1" max="20" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Label Slot</label>
                  <input v-model="slotForm.label" type="text" placeholder="Contoh: Jam 1" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mulai</label>
                  <input v-model="slotForm.start_time" type="time" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Selesai</label>
                  <input v-model="slotForm.end_time" type="time" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-4" v-else-if="formModal.type === 'slot-bulk'">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                Pilih hari, jumlah sesi, dan jam mulai. Sistem akan membuat slot otomatis per hari berdasarkan durasi dan jeda.
              </div>

              <div>
                <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Hari</p>
                <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <label v-for="day in dayOptions" :key="day.name" class="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70">
                    <input v-model="bulkSlotForm.days" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" :value="day.name" />
                    <span>{{ day.name }}</span>
                  </label>
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Sesi per Hari</label>
                  <input v-model="bulkSlotForm.sessions_per_day" type="number" min="1" max="20" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mulai</label>
                  <input v-model="bulkSlotForm.start_time" type="time" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Durasi (menit)</label>
                  <input v-model="bulkSlotForm.duration_minutes" type="number" min="10" max="180" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jeda antar sesi (menit)</label>
                  <input v-model="bulkSlotForm.gap_minutes" type="number" min="0" max="60" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah Istirahat</label>
                  <select v-model="bulkSlotForm.break_count" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <option :value="0">Tanpa istirahat</option>
                    <option :value="1">1 kali istirahat</option>
                    <option :value="2">2 kali istirahat</option>
                  </select>
                </div>
                <div>
                  <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    Istirahat dihitung setelah sesi yang dipilih selesai.
                  </div>
                </div>
              </div>

              <div v-if="bulkSlotForm.break_count >= 1" class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Istirahat 1 setelah sesi ke</label>
                  <input v-model="bulkSlotForm.break1_after_session" type="number" min="1" :max="Math.max(1, Number(bulkSlotForm.sessions_per_day || 1) - 1)" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Durasi istirahat 1 (menit)</label>
                  <input v-model="bulkSlotForm.break1_minutes" type="number" min="0" max="120" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
              </div>

              <div v-if="bulkSlotForm.break_count >= 2" class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Istirahat 2 setelah sesi ke</label>
                  <input v-model="bulkSlotForm.break2_after_session" type="number" min="1" :max="Math.max(1, Number(bulkSlotForm.sessions_per_day || 1) - 1)" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Durasi istirahat 2 (menit)</label>
                  <input v-model="bulkSlotForm.break2_minutes" type="number" min="0" max="120" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Label</label>
                  <select v-model="bulkSlotForm.label_mode" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    <option value="jam">Jam 1, Jam 2, ...</option>
                    <option value="sesi">Sesi 1, Sesi 2, ...</option>
                    <option value="none">Tanpa label</option>
                  </select>
                </div>
                <div class="flex items-end">
                  <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70">
                    <input v-model="bulkSlotForm.overwrite_existing" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <span>Timpa slot yang sudah ada</span>
                  </label>
                </div>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                Perkiraan slot dibuat: <strong class="text-slate-900 dark:text-white">{{ bulkSlotPreviewCount }}</strong>
              </div>
            </div>

            <div class="mt-6 space-y-4" v-else-if="formModal.type === 'slot-day-detail'">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    Menampilkan slot untuk <strong class="text-slate-900 dark:text-white">{{ selectedScheduleDayName }}</strong>.
                  </div>
                  <button
                    @click="removeScheduleDaySlots([selectedScheduleDayName])"
                    :disabled="selectedScheduleDaySlots.length === 0"
                    class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
                  >
                    Hapus Semua Hari Ini
                  </button>
                </div>
              </div>

              <div class="max-h-[55vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                  <thead class="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
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
                        <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Urutan hari {{ slot.day_order }} · sesi {{ slot.session_order }}</div>
                      </td>
                      <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ slot.start_time }} - {{ slot.end_time }}</td>
                      <td class="px-4 py-3">
                        <div class="flex justify-end gap-2">
                          <button @click="openSlotModal(slot)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                          <button @click="removeSlot(slot)" class="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:border-rose-500/30 dark:text-rose-300">Hapus</button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="selectedScheduleDaySlots.length === 0">
                      <td colspan="3" class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada slot pada hari ini.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button @click="closeFormModal" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                Batal
              </button>
              <button v-if="formModal.type === 'subject'" @click="saveSubject" class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
                {{ subjectEditingId ? "Perbarui" : "Simpan" }}
              </button>
              <button v-else-if="formModal.type === 'teacher-load'" @click="saveTeacherLoad" class="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400">
                {{ teacherLoadEditingId ? "Perbarui" : "Simpan" }}
              </button>
              <button v-else-if="formModal.type === 'distribution'" @click="saveDistribution" class="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
                {{ distributionEditingId ? "Perbarui" : "Simpan" }}
              </button>
              <button v-else-if="formModal.type === 'slot'" @click="saveSlot" class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500">
                {{ slotEditingId ? "Perbarui" : "Simpan" }}
              </button>
              <button v-else-if="formModal.type === 'slot-bulk'" @click="saveBulkSlots" :disabled="bulkSlotSaving" class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
                {{ bulkSlotSaving ? "Memproses..." : "Buat Slot" }}
              </button>
              <button v-else-if="formModal.type === 'slot-day-detail'" @click="closeFormModal" class="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white">
                Tutup
              </button>
            </div>
          </div>
        </div>

        <div v-if="confirmModal.open" class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/55 p-4">
          <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ confirmModal.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ confirmModal.message }}</p>
            <div class="mt-6 flex justify-end gap-3">
              <button @click="closeConfirmModal" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                Batal
              </button>
              <button @click="runConfirmAction" class="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500">
                {{ confirmModal.actionLabel }}
              </button>
            </div>
          </div>
        </div>
      </teleport>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
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

const teachers = ref([]);
const classes = ref([]);
const generating = ref(false);
const generationIssues = ref([]);
const formModal = reactive({
  open: false,
  type: "",
  title: "",
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

const currentSection = computed(() => (["subjects", "teacher-loads", "class-distributions", "schedule", "generate"].includes(props.section) ? props.section : "subjects"));

const summaryCards = computed(() => [
  { label: "Mapel", value: overview.summary.subjects || 0 },
  { label: "Beban Guru", value: overview.summary.teacher_loads || 0 },
  { label: "Distribusi Rombel", value: overview.summary.class_distributions || 0 },
  { label: "Slot Jadwal", value: overview.summary.schedule_slots || 0 },
  { label: "Hasil Generate", value: overview.summary.generated_entries || 0 },
]);

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
  selectedScheduleDayName.value = String(dayName || "").trim();
  formModal.open = true;
  formModal.type = "slot-day-detail";
  formModal.title = `Detail Slot - ${selectedScheduleDayName.value || "-"}`;
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

onMounted(() => {
  loadData();
});
</script>
