<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-6">
      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Super Admin</p>
            <h1 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Kelola Sekolah & Admin</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Super admin mengelola unit sekolah sekaligus akun admin sekolah. Login akun juga dibatasi satu device aktif per user.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button
              @click="loadSchools"
              :disabled="isLoadingSchools"
              class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {{ isLoadingSchools ? "Memuat Sekolah..." : "Refresh Sekolah" }}
            </button>
            <button
              @click="loadAdminUsers"
              :disabled="isLoadingAdmins"
              class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {{ isLoadingAdmins ? "Memuat Admin..." : "Refresh Admin" }}
            </button>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in summaryCards"
          :key="card.label"
          class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ card.label }}</p>
          <p class="mt-3 text-3xl font-black text-slate-900 dark:text-white">{{ card.value }}</p>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ card.caption }}</p>
        </article>
      </section>

      <section
        v-if="message"
        class="rounded-2xl px-5 py-4 text-sm font-medium ring-1 ring-inset"
        :class="isError ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20'"
      >
        {{ message }}
      </section>

      <section class="grid gap-6 xl:grid-cols-[380px,1fr]">
        <form
          @submit.prevent="submitSchool"
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ editingId ? "Edit Sekolah" : "Buat Sekolah" }}</p>
          <h2 class="mt-2 text-xl font-bold text-slate-900 dark:text-white">{{ editingId ? "Perbarui Data Sekolah" : "Tambah Sekolah Baru" }}</h2>

          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Sekolah</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Contoh: SMK Negeri 1 Jakarta"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              />
            </div>

            <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lokasi Absensi (Geofence)</p>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Jika lokasi belum diisi, absensi akan ditolak (ketat). Isi koordinat sekolah dan radius (meter).
              </p>
              <button
                type="button"
                @click="showLocationPicker = true"
                class="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-sky-600 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                Buka Peta & Cari Lokasi
              </button>
              <div class="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Latitude</label>
                  <input
                    v-model="form.attendance_latitude"
                    type="number"
                    step="0.000001"
                    placeholder="-6.200000"
                    class="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Longitude</label>
                  <input
                    v-model="form.attendance_longitude"
                    type="number"
                    step="0.000001"
                    placeholder="106.816666"
                    class="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Radius (meter)</label>
                  <input
                    v-model="form.attendance_radius_meters"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="150"
                    class="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="showLocationPicker"
              class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
            >
              <div class="w-full max-w-3xl">
                <MapLocationPicker
                  :latitude="form.attendance_latitude"
                  :longitude="form.attendance_longitude"
                  :radius-meters="form.attendance_radius_meters || 150"
                  @update:latitude="(v) => (form.attendance_latitude = String(v ?? ''))"
                  @update:longitude="(v) => (form.attendance_longitude = String(v ?? ''))"
                  @update:radiusMeters="(v) => (form.attendance_radius_meters = String(v ?? ''))"
                  @close="showLocationPicker = false"
                />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Avatar Sekolah</label>
              <div class="flex items-center gap-4">
                <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                  <img v-if="schoolLogoPreview" :src="schoolLogoPreview" alt="Preview logo sekolah" class="h-full w-full object-cover" />
                  <span v-else class="text-xs font-semibold uppercase tracking-wide text-slate-400">No Logo</span>
                </div>
                <div class="flex-1">
                  <input
                    ref="schoolLogoInput"
                    type="file"
                    accept="image/*"
                    class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:file:bg-sky-500"
                    @change="handleSchoolLogoChange"
                  />
                  <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Upload logo/avatar sekolah untuk tampil di sidebar dan identitas sekolah.</p>
                  <div v-if="editingId && schoolLogoPreview" class="mt-3">
                    <label class="inline-flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-300">
                      <input
                        v-model="removeSchoolLogo"
                        type="checkbox"
                        class="rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-900"
                      />
                      Hapus avatar sekolah saat disimpan
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p class="text-sm font-semibold text-slate-900 dark:text-white">Status Modul Sekolah</p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Aktifkan modul sesuai kebutuhan sekolah yang sedang dikelola.</p>
              <div class="mt-3 grid gap-3">
                <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input
                    v-model="form.inventory_module_enabled"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Sarpras
                </label>
                <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input
                    v-model="form.attendance_module_enabled"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Absensi
                </label>
                <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input
                    v-model="form.koperasi_module_enabled"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Koperasi
                </label>
                <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input
                    v-model="form.private_chat_module_enabled"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Chat Pribadi
                </label>
                <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input
                    v-model="form.official_exam_module_enabled"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Ujian Resmi
                </label>
                <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input
                    v-model="form.teaching_module_ai_enabled"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Modul Ajar AI
                </label>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              :disabled="isSubmittingSchool"
              class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
            >
              {{ isSubmittingSchool ? "Menyimpan..." : editingId ? "Perbarui Sekolah" : "Tambah Sekolah" }}
            </button>
            <button
              v-if="editingId"
              type="button"
              @click="resetForm"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Batal Edit
            </button>
          </div>
        </form>

        <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Daftar Sekolah</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Ringkasan sekolah beserta admin, kelas, siswa, dan status modul dasarnya.</p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-medium sm:px-6">Sekolah</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Admin</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Kelas</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Guru</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Siswa</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Kurikulum</th>
                  <th class="px-4 py-3 font-medium sm:px-6">LMS</th>
                  <th class="px-4 py-3 font-medium sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in schools" :key="item.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                  <td class="px-4 py-4 sm:px-6">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.name }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Tahun aktif: {{ item.active_academic_years || 0 }}
                    </div>
                  </td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_admins || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_classes || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_teachers || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_students || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_curriculum_subjects || 0 }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.total_learning_subjects || 0 }}</td>
                  <td class="px-4 py-4 sm:px-6">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="editSchool(item)"
                        class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteSchool(item)"
                        :disabled="deletingId === item.id"
                        class="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-300"
                      >
                        {{ deletingId === item.id ? "Menghapus..." : "Hapus" }}
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="schools.length === 0">
                  <td colspan="8" class="px-4 py-10 text-center text-slate-500 sm:px-6">Belum ada sekolah terdaftar.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section class="grid gap-6 xl:grid-cols-[420px,1fr]">
        <form
          @submit.prevent="submitAdminUser"
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ adminEditingId ? "Edit Admin" : "Buat Admin" }}</p>
          <h2 class="mt-2 text-xl font-bold text-slate-900 dark:text-white">{{ adminEditingId ? "Perbarui Admin Sekolah" : "Tambah Admin Sekolah" }}</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Saat admin login di device baru, token device lama akan otomatis expired.
          </p>

          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Sekolah</label>
              <select
                v-model="adminForm.school_id"
                required
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              >
                <option value="" disabled>Pilih sekolah</option>
                <option v-for="school in schools" :key="school.id" :value="String(school.id)">
                  {{ school.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
              <input
                v-model="adminForm.full_name"
                type="text"
                placeholder="Contoh: Ahmad Fauzi"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
              <input
                v-model="adminForm.username"
                type="text"
                required
                placeholder="Username login admin"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {{ adminEditingId ? "Password Baru" : "Password" }}
              </label>
              <input
                v-model="adminForm.password"
                type="password"
                :required="!adminEditingId"
                placeholder="Minimal 6 karakter"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              />
              <p v-if="adminEditingId" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Jika diisi, sesi login admin sebelumnya akan dipaksa logout.
              </p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                v-model="adminForm.parent_email"
                type="email"
                placeholder="email@sekolah.sch.id"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nomor HP</label>
              <input
                v-model="adminForm.phone_number"
                type="text"
                placeholder="08xxxxxxxxxx"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              />
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              :disabled="isSubmittingAdmin"
              class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
            >
              {{ isSubmittingAdmin ? "Menyimpan..." : adminEditingId ? "Perbarui Admin" : "Tambah Admin" }}
            </button>
            <button
              v-if="adminEditingId"
              type="button"
              @click="resetAdminForm"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Batal Edit
            </button>
          </div>
        </form>

        <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Management Admin Sekolah</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Super admin bisa membuat, mengubah, memindahkan sekolah, dan menghapus akun admin sekolah.</p>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <input
                  v-model="adminFilters.search"
                  type="text"
                  placeholder="Cari nama, username, email, sekolah"
                  class="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                />
                <select
                  v-model="adminFilters.school_id"
                  class="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                >
                  <option value="">Semua sekolah</option>
                  <option v-for="school in schools" :key="school.id" :value="String(school.id)">
                    {{ school.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-3">
              <button
                @click="loadAdminUsers"
                :disabled="isLoadingAdmins"
                class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {{ isLoadingAdmins ? "Memuat..." : "Terapkan Filter" }}
              </button>
              <button
                @click="resetAdminFilters"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Reset Filter
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-medium sm:px-6">Admin</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Sekolah</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Email</th>
                  <th class="px-4 py-3 font-medium sm:px-6">No. HP</th>
                  <th class="px-4 py-3 font-medium sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in adminUsers" :key="item.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                  <td class="px-4 py-4 sm:px-6">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.full_name || item.username }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">@{{ item.username }}</div>
                  </td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.school_name || "-" }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.parent_email || "-" }}</td>
                  <td class="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6">{{ item.phone_number || "-" }}</td>
                  <td class="px-4 py-4 sm:px-6">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="editAdminUser(item)"
                        class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteAdminUser(item)"
                        :disabled="deletingAdminId === item.id"
                        class="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-300"
                      >
                        {{ deletingAdminId === item.id ? "Menghapus..." : "Hapus" }}
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="adminUsers.length === 0">
                  <td colspan="5" class="px-4 py-10 text-center text-slate-500 sm:px-6">Belum ada admin sekolah yang sesuai filter.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { normalizePublicUrl } from "@/utils/url";
import MapLocationPicker from "@/components/MapLocationPicker.vue";

const schools = ref([]);
const adminUsers = ref([]);
const isLoadingSchools = ref(false);
const isLoadingAdmins = ref(false);
const isSubmittingSchool = ref(false);
const isSubmittingAdmin = ref(false);
const deletingId = ref(null);
const deletingAdminId = ref(null);
const editingId = ref(null);
const adminEditingId = ref(null);
const message = ref("");
const isError = ref(false);

const form = reactive({
  name: "",
  inventory_module_enabled: true,
  attendance_module_enabled: true,
  attendance_latitude: "",
  attendance_longitude: "",
  attendance_radius_meters: "",
  official_exam_module_enabled: true,
  koperasi_module_enabled: true,
  private_chat_module_enabled: true,
  teaching_module_ai_enabled: true,
});
const schoolLogoFile = ref(null);
const schoolLogoPreview = ref("");
const schoolLogoInput = ref(null);
const removeSchoolLogo = ref(false);
const showLocationPicker = ref(false);

const adminForm = reactive({
  school_id: "",
  full_name: "",
  username: "",
  password: "",
  parent_email: "",
  phone_number: "",
});

const adminFilters = reactive({
  school_id: "",
  search: "",
});

const summaryCards = computed(() => {
  const totalSchools = schools.value.length;
  const totalAdmins = schools.value.reduce((sum, item) => sum + Number(item.total_admins || 0), 0);
  const totalStudents = schools.value.reduce((sum, item) => sum + Number(item.total_students || 0), 0);
  const totalCurriculum = schools.value.reduce((sum, item) => sum + Number(item.total_curriculum_subjects || 0), 0);

  return [
    { label: "Total Sekolah", value: totalSchools, caption: "Unit sekolah terdaftar." },
    { label: "Total Admin", value: totalAdmins, caption: "Admin sekolah aktif." },
    { label: "Total Siswa", value: totalStudents, caption: "Siswa seluruh sekolah." },
    { label: "Mapel Kurikulum", value: totalCurriculum, caption: "Master kurikulum seluruh sekolah." },
  ];
});

const resetForm = () => {
  editingId.value = null;
  form.name = "";
  form.inventory_module_enabled = true;
  form.attendance_module_enabled = true;
  form.attendance_latitude = "";
  form.attendance_longitude = "";
  form.attendance_radius_meters = "";
  form.official_exam_module_enabled = true;
  form.koperasi_module_enabled = true;
  form.private_chat_module_enabled = true;
  form.teaching_module_ai_enabled = true;
  schoolLogoFile.value = null;
  schoolLogoPreview.value = "";
  removeSchoolLogo.value = false;
  if (schoolLogoInput.value) {
    schoolLogoInput.value.value = "";
  }
};

const resetAdminForm = () => {
  adminEditingId.value = null;
  adminForm.school_id = "";
  adminForm.full_name = "";
  adminForm.username = "";
  adminForm.password = "";
  adminForm.parent_email = "";
  adminForm.phone_number = "";
};

const resetAdminFilters = async () => {
  adminFilters.school_id = "";
  adminFilters.search = "";
  await loadAdminUsers();
};

const loadSchools = async () => {
  isLoadingSchools.value = true;
  try {
    const response = await api.get("/school");
    schools.value = Array.isArray(response?.data?.items)
      ? response.data.items.map((item) => ({
          ...item,
          inventory_module_enabled: item.inventory_module_enabled !== false,
          attendance_module_enabled: item.attendance_module_enabled !== false,
          official_exam_module_enabled: item.official_exam_module_enabled !== false,
          koperasi_module_enabled: item.koperasi_module_enabled !== false,
          private_chat_module_enabled: item.private_chat_module_enabled !== false,
          teaching_module_ai_enabled: item.teaching_module_ai_enabled !== false,
        }))
      : [];
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Gagal memuat data sekolah.";
  } finally {
    isLoadingSchools.value = false;
  }
};

const submitSchool = async () => {
  isSubmittingSchool.value = true;
  isError.value = false;
  message.value = "";

  try {
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("inventory_module_enabled", String(Boolean(form.inventory_module_enabled)));
    payload.append("attendance_module_enabled", String(Boolean(form.attendance_module_enabled)));
    if (String(form.attendance_latitude || "").trim() !== "") {
      payload.append("attendance_latitude", String(form.attendance_latitude).trim());
    } else if (editingId.value) {
      payload.append("clear_attendance_latitude", "true");
    }
    if (String(form.attendance_longitude || "").trim() !== "") {
      payload.append("attendance_longitude", String(form.attendance_longitude).trim());
    } else if (editingId.value) {
      payload.append("clear_attendance_longitude", "true");
    }
    if (String(form.attendance_radius_meters || "").trim() !== "") {
      payload.append("attendance_radius_meters", String(form.attendance_radius_meters).trim());
    } else if (editingId.value) {
      payload.append("clear_attendance_radius_meters", "true");
    }
    payload.append("koperasi_module_enabled", String(Boolean(form.koperasi_module_enabled)));
    payload.append("private_chat_module_enabled", String(Boolean(form.private_chat_module_enabled)));
    payload.append("official_exam_module_enabled", String(Boolean(form.official_exam_module_enabled)));
    payload.append("teaching_module_ai_enabled", String(Boolean(form.teaching_module_ai_enabled)));
    if (schoolLogoFile.value) {
      payload.append("logo", schoolLogoFile.value);
    }
    if (editingId.value && removeSchoolLogo.value && !schoolLogoFile.value) {
      payload.append("remove_logo", "true");
    }
    const response = editingId.value
      ? await api.put(`/school/${editingId.value}`, payload)
      : await api.post("/school", payload);

    message.value = response?.message || "Sekolah berhasil disimpan.";
    resetForm();
    await loadSchools();
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Gagal menyimpan sekolah.";
  } finally {
    isSubmittingSchool.value = false;
  }
};

const editSchool = (item) => {
  editingId.value = item.id;
  form.name = item.name || "";
  form.inventory_module_enabled = item.inventory_module_enabled !== false;
  form.attendance_module_enabled = item.attendance_module_enabled !== false;
  form.attendance_latitude = item.attendance_latitude == null ? "" : String(item.attendance_latitude);
  form.attendance_longitude = item.attendance_longitude == null ? "" : String(item.attendance_longitude);
  form.attendance_radius_meters = item.attendance_radius_meters == null ? "" : String(item.attendance_radius_meters);
  form.koperasi_module_enabled = item.koperasi_module_enabled !== false;
  form.private_chat_module_enabled = item.private_chat_module_enabled !== false;
  form.official_exam_module_enabled = item.official_exam_module_enabled !== false;
  form.teaching_module_ai_enabled = item.teaching_module_ai_enabled !== false;
  schoolLogoFile.value = null;
  schoolLogoPreview.value = normalizePublicUrl(item.logo_url) || "";
  removeSchoolLogo.value = false;
  if (schoolLogoInput.value) {
    schoolLogoInput.value.value = "";
  }
  message.value = "";
  isError.value = false;
};

const handleSchoolLogoChange = (event) => {
  const file = event?.target?.files?.[0] || null;
  schoolLogoFile.value = file;
  removeSchoolLogo.value = false;
  if (!file) {
    schoolLogoPreview.value = editingId.value
      ? normalizePublicUrl(schools.value.find((item) => item.id === editingId.value)?.logo_url) || ""
      : "";
    return;
  }
  schoolLogoPreview.value = URL.createObjectURL(file);
};

const deleteSchool = async (item) => {
  if (!window.confirm(`Hapus sekolah "${item.name}"? Semua data sekolah ini juga akan dihapus.`)) return;

  deletingId.value = item.id;
  isError.value = false;
  message.value = "";
  try {
    const response = await api.delete(`/school/${item.id}`);
    message.value = response?.message || "Sekolah berhasil dihapus.";
    if (editingId.value === item.id) {
      resetForm();
    }
    await Promise.all([loadSchools(), loadAdminUsers()]);
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Gagal menghapus sekolah.";
  } finally {
    deletingId.value = null;
  }
};

const loadAdminUsers = async () => {
  isLoadingAdmins.value = true;
  try {
    const response = await api.get("/auth/super-admin/admin-users", {
      params: {
        school_id: adminFilters.school_id || undefined,
        search: adminFilters.search || undefined,
      },
    });
    adminUsers.value = Array.isArray(response?.data?.items) ? response.data.items : [];
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Admin Sekolah",
      message: error.message || "Data admin sekolah tidak berhasil dimuat.",
      type: "error",
    });
  } finally {
    isLoadingAdmins.value = false;
  }
};

const submitAdminUser = async () => {
  isSubmittingAdmin.value = true;
  try {
    const wasEditing = Boolean(adminEditingId.value);
    const payload = {
      school_id: Number(adminForm.school_id),
      full_name: adminForm.full_name || null,
      username: adminForm.username,
      parent_email: adminForm.parent_email || null,
      phone_number: adminForm.phone_number || null,
    };

    if (adminForm.password) {
      payload.password = adminForm.password;
    }

    const response = adminEditingId.value
      ? await api.put(`/auth/super-admin/admin-users/${adminEditingId.value}`, payload)
      : await api.post("/auth/super-admin/admin-users", { ...payload, password: adminForm.password });

    resetAdminForm();
    await Promise.all([loadSchools(), loadAdminUsers()]);
    pushToast({
      title: wasEditing ? "Admin Sekolah Diperbarui" : "Admin Sekolah Dibuat",
      message: response?.message || "Perubahan admin sekolah berhasil disimpan.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: adminEditingId.value ? "Gagal Mengubah Admin Sekolah" : "Gagal Membuat Admin Sekolah",
      message: error.message || "Perubahan admin sekolah gagal disimpan.",
      type: "error",
    });
  } finally {
    isSubmittingAdmin.value = false;
  }
};

const editAdminUser = (item) => {
  adminEditingId.value = item.id;
  adminForm.school_id = item.school_id ? String(item.school_id) : "";
  adminForm.full_name = item.full_name || "";
  adminForm.username = item.username || "";
  adminForm.password = "";
  adminForm.parent_email = item.parent_email || "";
  adminForm.phone_number = item.phone_number || "";
};

const deleteAdminUser = async (item) => {
  if (!window.confirm(`Hapus admin "${item.full_name || item.username}" dari sekolah "${item.school_name || "-"}"?`)) return;

  deletingAdminId.value = item.id;
  try {
    const response = await api.delete(`/auth/super-admin/admin-users/${item.id}`);
    if (adminEditingId.value === item.id) {
      resetAdminForm();
    }
    await Promise.all([loadSchools(), loadAdminUsers()]);
    pushToast({
      title: "Admin Sekolah Dihapus",
      message: response?.message || "Admin sekolah berhasil dihapus.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Menghapus Admin Sekolah",
      message: error.message || "Admin sekolah gagal dihapus.",
      type: "error",
    });
  } finally {
    deletingAdminId.value = null;
  }
};

onMounted(async () => {
  await Promise.all([loadSchools(), loadAdminUsers()]);
});
</script>
