<template>
  <div class="min-h-screen bg-slate-50 p-3 font-sans text-slate-900 sm:p-4 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-4 md:space-y-6">
      <section class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 md:rounded-3xl md:p-6 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600 sm:text-xs sm:tracking-[0.2em] dark:text-sky-300">Super Admin</p>
            <h1 class="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">List Sekolah</h1>
            <p class="mt-2 max-w-3xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6 dark:text-slate-400">
              Daftar sekolah yang akan dikunjungi. Mulai dari nama sekolah dulu, lalu lengkapi alamat setelah ditemukan di Google Maps.
            </p>
          </div>
          <button
            type="button"
            @click="loadTargets"
            :disabled="isLoading"
            class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 sm:w-auto dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Icon icon="mdi:refresh" class="h-4 w-4" />
            {{ isLoading ? "Memuat..." : "Refresh" }}
          </button>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-4">
        <article class="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 md:rounded-3xl md:p-5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-slate-400 sm:text-xs sm:tracking-[0.18em]">Total List</p>
          <p class="mt-2 text-2xl font-black text-slate-900 md:mt-3 md:text-3xl dark:text-white">{{ pagination.total }}</p>
          <p class="mt-2 hidden text-sm text-slate-500 sm:block dark:text-slate-400">Sekolah sesuai filter.</p>
        </article>
        <article class="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 md:rounded-3xl md:p-5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-slate-400 sm:text-xs sm:tracking-[0.18em]">Rencana</p>
          <p class="mt-2 text-2xl font-black text-slate-900 md:mt-3 md:text-3xl dark:text-white">{{ plannedPageCount }}</p>
          <p class="mt-2 hidden text-sm text-slate-500 sm:block dark:text-slate-400">Pada halaman ini.</p>
        </article>
        <article class="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 md:rounded-3xl md:p-5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-slate-400 sm:text-xs sm:tracking-[0.18em]">Complete</p>
          <p class="mt-2 text-2xl font-black text-slate-900 md:mt-3 md:text-3xl dark:text-white">{{ visitedPageCount }}</p>
          <p class="mt-2 hidden text-sm text-slate-500 sm:block dark:text-slate-400">Sudah dikunjungi.</p>
        </article>
        <article class="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 md:rounded-3xl md:p-5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-slate-400 sm:text-xs sm:tracking-[0.18em]">Alamat</p>
          <p class="mt-2 text-2xl font-black text-slate-900 md:mt-3 md:text-3xl dark:text-white">{{ completedAddressCount }}</p>
          <p class="mt-2 hidden text-sm text-slate-500 sm:block dark:text-slate-400">Pada halaman ini.</p>
        </article>
      </section>

      <section>
        <div
          v-if="isFormModalOpen"
          class="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          @click.self="closeFormModal"
        >
          <form
            @submit.prevent="submitTarget"
            class="mx-auto my-4 max-w-2xl rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-900/10 md:rounded-3xl md:p-6 dark:bg-slate-900 dark:ring-white/10"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ editingId ? "Edit List" : "Tambah List" }}</p>
              <h2 class="mt-2 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">{{ editingId ? "Perbarui Sekolah" : "Input Nama Sekolah" }}</h2>
            </div>
            <button
              type="button"
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              :disabled="isSubmitting"
              @click="closeFormModal"
              title="Tutup"
            >
              <Icon icon="mdi:close" class="h-5 w-5" />
            </button>
          </div>

          <div class="mt-5 space-y-4">
            <div class="relative">
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Sekolah</label>
              <input
                v-model.trim="form.name"
                type="text"
                required
                placeholder="Contoh: SMK Negeri 1 Jakarta"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                @input="onNameInput"
                @focus="showAddressSuggestions = addressSuggestions.length > 0"
                @blur="hideAddressSuggestions"
              />
              <div
                v-if="showAddressSuggestions && (addressSuggestions.length > 0 || isSearchingAddress || addressSearchError)"
                class="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
              >
                <div v-if="isSearchingAddress" class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                  Mencari rekomendasi alamat...
                </div>
                <button
                  v-for="item in addressSuggestions"
                  :key="String(item.place_id || item.display_name)"
                  type="button"
                  class="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
                  @mousedown.prevent="selectAddressSuggestion(item)"
                >
                  <div class="font-semibold">{{ item.name || (item.display_name || "").split(",")[0] || "Lokasi sekolah" }}</div>
                  <div class="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{{ item.display_name }}</div>
                </button>
                <div v-if="addressSearchError" class="px-4 py-3 text-xs font-medium text-rose-600 dark:text-rose-300">
                  {{ addressSearchError }}
                </div>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <label class="block">
                <span class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Wakur</span>
                <input
                  v-model.trim="form.wakur"
                  type="text"
                  placeholder="Nama wakur"
                  class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                />
              </label>
              <label class="block">
                <span class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kepsek</span>
                <input
                  v-model.trim="form.kepsek"
                  type="text"
                  placeholder="Nama kepsek"
                  class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                />
              </label>
            </div>

            <label class="flex items-center gap-3 rounded-2xl bg-sky-50 p-4 text-sm font-semibold text-sky-800 ring-1 ring-sky-100 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/20">
              <input
                v-model="form.is_planned"
                type="checkbox"
                class="h-5 w-5 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
              />
              <span>Masuk rencana kunjungan</span>
            </label>

            <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">Alamat Maps</p>
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Opsional, bisa dilengkapi setelah sekolah ditemukan.</p>
                </div>
                <div class="flex gap-2">
                  <button
                    v-if="editingId"
                    type="button"
                    @click="resolveTargetAddress({ id: editingId, name: form.name }, true)"
                    :disabled="resolvingId === editingId || !form.name"
                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-50"
                    title="Isi alamat otomatis"
                  >
                    <Icon icon="mdi:map-marker-check-outline" class="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    @click="openGoogleMaps(form.name, form.google_maps_url)"
                    :disabled="!form.name"
                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white transition hover:bg-sky-500 disabled:opacity-50"
                    title="Cari di Google Maps"
                  >
                    <Icon icon="mdi:map-search-outline" class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div class="mt-4 space-y-3">
                <label class="block">
                  <span class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Alamat Lengkap</span>
                  <textarea
                    v-model.trim="form.full_address"
                    rows="3"
                    placeholder="Alamat lengkap dari Maps"
                    class="block w-full resize-y rounded-xl border-0 bg-white px-4 py-3 text-sm leading-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                  ></textarea>
                </label>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input v-model.trim="form.province" type="text" placeholder="Provinsi" class="rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700" />
                  <input v-model.trim="form.city" type="text" placeholder="Kab/Kota" class="rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700" />
                </div>
                <input v-model.trim="form.district" type="text" placeholder="Kecamatan" class="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700" />
              </div>
            </div>
          </div>

          <div class="mt-6 grid gap-3 sm:flex sm:flex-wrap">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
            >
              <Icon icon="mdi:content-save-outline" class="h-4 w-4" />
              {{ isSubmitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Sekolah" }}
            </button>
            <button
              type="button"
              @click="closeFormModal"
              class="h-11 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Batal
            </button>
          </div>
          </form>
        </div>

        <section class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 md:rounded-3xl md:p-6 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">Daftar Sekolah</h2>
              <p class="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">Cari, edit, atau buka pencarian Maps untuk setiap sekolah.</p>
            </div>
            <div class="flex flex-col gap-3 md:items-end">
              <button
                type="button"
                class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500 sm:w-auto"
                @click="openCreateModal"
              >
                <Icon icon="mdi:plus" class="h-5 w-5" />
                Tambah Sekolah
              </button>
              <div class="grid gap-3 sm:grid-cols-[1fr,160px,140px] md:w-[640px]">
                <div class="relative">
                  <Icon icon="mdi:magnify" class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    v-model.trim="filters.search"
                    type="search"
                    placeholder="Cari nama/alamat..."
                    class="block w-full rounded-xl border-0 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                    @input="scheduleSearch"
                  />
                </div>
                <select
                  v-model="filters.status"
                  class="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                  @change="applyFilters"
                >
                  <option value="">Semua Status</option>
                  <option value="planned">Rencana Kunjungan</option>
                  <option value="complete">Complete</option>
                  <option value="unplanned">Belum Direncanakan</option>
                </select>
                <select
                  v-model.number="pagination.limit"
                  class="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                  @change="changeLimit"
                >
                  <option :value="10">10 / halaman</option>
                  <option :value="25">25 / halaman</option>
                  <option :value="50">50 / halaman</option>
                  <option :value="100">100 / halaman</option>
                </select>
              </div>
            </div>
          </div>

          <div class="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <SkeletonLoader v-if="isLoading" variant="list" :count="5" class="p-4" />
            <div v-else-if="targets.length === 0" class="flex flex-col items-center justify-center gap-3 p-12 text-center">
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <Icon icon="mdi:school-outline" class="h-7 w-7" />
              </div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada list sekolah.</p>
              <button
                type="button"
                class="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                @click="openCreateModal"
              >
                <Icon icon="mdi:plus" class="h-4 w-4" />
                Tambah Sekolah
              </button>
            </div>
            <div v-else>
              <div class="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
                <article v-for="item in targets" :key="item.id" class="bg-white p-4 dark:bg-slate-900">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-bold leading-5 text-slate-900 dark:text-white">{{ item.name }}</p>
                      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.province || "Provinsi belum diisi" }}</p>
                      <p v-if="schoolContactLabel(item)" class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{{ schoolContactLabel(item) }}</p>
                    </div>
                    <span
                      class="inline-flex shrink-0 rounded-xl px-2.5 py-2 text-xs font-semibold ring-1"
                      :class="visitStatusClass(item)"
                    >
                      {{ visitStatusLabel(item) }}
                    </span>
                  </div>

                  <div class="mt-3 grid grid-cols-2 gap-2">
                    <label
                      class="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ring-1"
                      :class="item.is_planned ? 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/20' : 'bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'"
                    >
                      <input
                        type="checkbox"
                        :checked="item.is_planned === true"
                        :disabled="planningId === item.id || visitingId === item.id"
                        class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:opacity-50"
                        @change="togglePlanned(item, $event.target.checked)"
                      />
                      <span>Rencana</span>
                    </label>
                    <label
                      class="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ring-1"
                      :class="item.is_visited ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20' : 'bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'"
                    >
                      <input
                        type="checkbox"
                        :checked="item.is_visited === true"
                        :disabled="visitingId === item.id || planningId === item.id"
                        class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                        @change="toggleVisited(item, $event.target.checked)"
                      />
                      <span>Complete</span>
                    </label>
                  </div>

                <div class="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  <p class="line-clamp-3">{{ item.full_address || "Alamat belum diisi" }}</p>
                  <p class="mt-1 font-semibold text-slate-500 dark:text-slate-400">{{ compactArea(item) || "Kab/Kota dan kecamatan belum diisi" }}</p>
                </div>

                <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                  <span>Dibuat: {{ formatDate(item.created_at) }}</span>
                  <span v-if="item.planned_at && !item.visited_at">Rencana: {{ formatDate(item.planned_at) }}</span>
                  <span v-if="item.visited_at">Dikunjungi: {{ formatDate(item.visited_at) }}</span>
                </div>

                <div class="mt-4 grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    @click="openGoogleMaps(item.name, item.google_maps_url)"
                    class="inline-flex h-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-200"
                    title="Cari di Google Maps"
                  >
                    <Icon icon="mdi:map-search-outline" class="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    @click="resolveTargetAddress(item)"
                    :disabled="resolvingId === item.id"
                    class="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 dark:bg-emerald-500/10 dark:text-emerald-200"
                    title="Isi alamat otomatis"
                  >
                    <Icon icon="mdi:map-marker-check-outline" class="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    @click="editTarget(item)"
                    class="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    title="Edit"
                  >
                    <Icon icon="mdi:pencil-outline" class="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    @click="deleteTarget(item)"
                    :disabled="deletingId === item.id"
                    class="inline-flex h-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-500/10 dark:text-rose-200"
                    title="Hapus"
                  >
                    <Icon icon="mdi:trash-can-outline" class="h-5 w-5" />
                  </button>
                </div>
                </article>
              </div>
              <div class="hidden overflow-x-auto md:block">
                <table class="min-w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr class="bg-slate-50/80 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
                    <th class="border-b border-slate-200/80 px-6 py-4 font-semibold dark:border-slate-700/60">Sekolah</th>
                    <th class="border-b border-slate-200/80 px-6 py-4 font-semibold dark:border-slate-700/60">Alamat</th>
                    <th class="border-b border-slate-200/80 px-6 py-4 font-semibold dark:border-slate-700/60">Status</th>
                    <th class="border-b border-slate-200/80 px-6 py-4 font-semibold dark:border-slate-700/60">Tindak Lanjut</th>
                    <th class="border-b border-slate-200/80 px-6 py-4 font-semibold dark:border-slate-700/60">Dibuat</th>
                    <th class="border-b border-slate-200/80 px-6 py-4 text-right font-semibold dark:border-slate-700/60">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in targets"
                    :key="item.id"
                    class="group bg-white transition-colors hover:bg-slate-50/70 dark:bg-slate-900 dark:hover:bg-slate-800/40"
                  >
                    <td class="border-b border-slate-100 px-6 py-5 align-top dark:border-slate-800/80">
                      <div class="flex items-start gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-bold text-white shadow-sm">
                          {{ schoolInitials(item.name) }}
                        </div>
                        <div class="min-w-0">
                          <p class="font-semibold leading-snug text-slate-900 dark:text-white">{{ item.name }}</p>
                          <p class="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Icon icon="mdi:map-marker-outline" class="h-3.5 w-3.5 shrink-0" />
                            {{ item.province || "Provinsi belum diisi" }}
                          </p>
                          <div v-if="item.wakur || item.kepsek" class="mt-2 flex flex-wrap gap-1.5">
                            <span v-if="item.wakur" class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              <Icon icon="mdi:account-tie-outline" class="h-3 w-3" /> {{ item.wakur }}
                            </span>
                            <span v-if="item.kepsek" class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              <Icon icon="mdi:account-star-outline" class="h-3 w-3" /> {{ item.kepsek }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="max-w-xs border-b border-slate-100 px-6 py-5 align-top dark:border-slate-800/80">
                      <p class="line-clamp-2 leading-snug text-slate-700 dark:text-slate-200">{{ item.full_address || "Alamat belum diisi" }}</p>
                      <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">{{ compactArea(item) || "Kab/Kota & kecamatan belum diisi" }}</p>
                    </td>
                    <td class="border-b border-slate-100 px-6 py-5 align-top dark:border-slate-800/80">
                      <span
                        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1"
                        :class="visitStatusClass(item)"
                      >
                        <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {{ visitStatusLabel(item) }}
                      </span>
                      <p v-if="item.visited_at" class="mt-2 text-[11px] text-slate-400 dark:text-slate-500">Dikunjungi {{ formatDate(item.visited_at) }}</p>
                      <p v-else-if="item.planned_at" class="mt-2 text-[11px] text-slate-400 dark:text-slate-500">Direncanakan {{ formatDate(item.planned_at) }}</p>
                    </td>
                    <td class="border-b border-slate-100 px-6 py-5 align-top dark:border-slate-800/80">
                      <div class="flex flex-col gap-2.5">
                        <label class="inline-flex cursor-pointer items-center gap-2">
                          <span class="relative inline-flex h-5 w-9 shrink-0 items-center">
                            <input
                              type="checkbox"
                              class="peer sr-only"
                              :checked="item.is_planned === true"
                              :disabled="planningId === item.id || visitingId === item.id"
                              @change="togglePlanned(item, $event.target.checked)"
                            />
                            <span class="absolute inset-0 rounded-full bg-slate-200 transition-colors peer-checked:bg-sky-500 peer-disabled:opacity-50 dark:bg-slate-700"></span>
                            <span class="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                          </span>
                          <span class="text-xs font-medium text-slate-600 dark:text-slate-300">Rencana</span>
                        </label>
                        <label class="inline-flex cursor-pointer items-center gap-2">
                          <span class="relative inline-flex h-5 w-9 shrink-0 items-center">
                            <input
                              type="checkbox"
                              class="peer sr-only"
                              :checked="item.is_visited === true"
                              :disabled="visitingId === item.id || planningId === item.id"
                              @change="toggleVisited(item, $event.target.checked)"
                            />
                            <span class="absolute inset-0 rounded-full bg-slate-200 transition-colors peer-checked:bg-emerald-500 peer-disabled:opacity-50 dark:bg-slate-700"></span>
                            <span class="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                          </span>
                          <span class="text-xs font-medium text-slate-600 dark:text-slate-300">Complete</span>
                        </label>
                      </div>
                    </td>
                    <td class="border-b border-slate-100 px-6 py-5 align-top text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">{{ formatDate(item.created_at) }}</td>
                    <td class="border-b border-slate-100 px-6 py-5 align-top dark:border-slate-800/80">
                      <div class="flex justify-end gap-1.5 opacity-70 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          @click="openGoogleMaps(item.name, item.google_maps_url)"
                          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
                          title="Cari di Google Maps"
                        >
                          <Icon icon="mdi:map-search-outline" class="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          @click="resolveTargetAddress(item)"
                          :disabled="resolvingId === item.id"
                          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                          title="Isi alamat otomatis"
                        >
                          <Icon :icon="resolvingId === item.id ? 'mdi:loading' : 'mdi:map-marker-check-outline'" class="h-5 w-5" :class="{ 'animate-spin': resolvingId === item.id }" />
                        </button>
                        <button
                          type="button"
                          @click="editTarget(item)"
                          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                          title="Edit"
                        >
                          <Icon icon="mdi:pencil-outline" class="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          @click="deleteTarget(item)"
                          :disabled="deletingId === item.id"
                          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                          title="Hapus"
                        >
                          <Icon icon="mdi:trash-can-outline" class="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p class="text-slate-500 dark:text-slate-400">{{ paginationLabel }}</p>
            <div class="grid grid-cols-[1fr,auto,1fr] items-center gap-2 sm:flex sm:justify-end">
              <button
                type="button"
                class="h-10 rounded-lg border border-slate-200 px-3 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                :disabled="pagination.page <= 1 || isLoading"
                @click="goToPage(pagination.page - 1)"
              >
                Sebelumnya
              </button>
              <span class="min-w-[74px] text-center font-semibold text-slate-600 sm:min-w-[90px] dark:text-slate-300">
                {{ pagination.page }} / {{ pagination.totalPages || 1 }}
              </span>
              <button
                type="button"
                class="h-10 rounded-lg border border-slate-200 px-3 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                :disabled="pagination.page >= pagination.totalPages || isLoading"
                @click="goToPage(pagination.page + 1)"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>

    <teleport to="body">
      <transition name="school-alert-fade">
        <div
          v-if="confirmModal.open"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          @click.self="closeConfirmModal"
        >
          <div class="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
            <div class="p-6">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
                <Icon icon="mdi:trash-can-outline" class="h-7 w-7" />
              </div>
              <h2 class="mt-4 text-xl font-bold text-slate-900 dark:text-white">{{ confirmModal.title }}</h2>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ confirmModal.message }}</p>
            </div>
            <div class="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <button
                type="button"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                :disabled="confirmModal.processing"
                @click="closeConfirmModal"
              >
                Batal
              </button>
              <button
                type="button"
                class="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
                :disabled="confirmModal.processing"
                @click="confirmDeleteTarget"
              >
                {{ confirmModal.processing ? "Menghapus..." : "Hapus" }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <transition name="school-alert-fade">
        <div
          v-if="alertModal.open"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          @click.self="closeAlertModal"
        >
          <div class="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
            <div class="p-6">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-2xl"
                :class="alertModal.type === 'error' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200'"
              >
                <Icon :icon="alertModal.type === 'error' ? 'mdi:alert-circle-outline' : 'mdi:check-circle-outline'" class="h-7 w-7" />
              </div>
              <h2 class="mt-4 text-xl font-bold text-slate-900 dark:text-white">{{ alertModal.title }}</h2>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ alertModal.message }}</p>
            </div>
            <div class="flex justify-end border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <button
                type="button"
                class="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
                :class="alertModal.type === 'error' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-sky-600 hover:bg-sky-500'"
                @click="closeAlertModal"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";

const targets = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const isFormModalOpen = ref(false);
const deletingId = ref(null);
const editingId = ref(null);
const resolvingId = ref(null);
const planningId = ref(null);
const visitingId = ref(null);
const addressSuggestions = ref([]);
const showAddressSuggestions = ref(false);
const isSearchingAddress = ref(false);
const addressSearchError = ref("");
let searchTimer = null;
let addressSearchTimer = null;
let addressSearchToken = 0;

const filters = reactive({
  search: "",
  status: "",
});

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

const alertModal = reactive({
  open: false,
  title: "",
  message: "",
  type: "success",
});

const confirmModal = reactive({
  open: false,
  title: "",
  message: "",
  item: null,
  processing: false,
});

const form = reactive({
  name: "",
  wakur: "",
  kepsek: "",
  full_address: "",
  province: "",
  city: "",
  district: "",
  latitude: null,
  longitude: null,
  google_maps_url: "",
  place_id: "",
  is_planned: true,
});

const completedAddressCount = computed(() =>
  targets.value.filter((item) => item.full_address && item.province && item.city && item.district).length
);
const plannedPageCount = computed(() => targets.value.filter((item) => item.is_planned === true && item.is_visited !== true).length);
const visitedPageCount = computed(() => targets.value.filter((item) => item.is_visited === true).length);
const paginationLabel = computed(() => {
  if (pagination.total === 0) return "Tidak ada data.";
  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(start + targets.value.length - 1, pagination.total);
  return `Menampilkan ${start}-${end} dari ${pagination.total} sekolah.`;
});

let alertAutoCloseTimer = null;

const showAlertModal = ({ title, message, type = "success" }) => {
  if (alertAutoCloseTimer) {
    clearTimeout(alertAutoCloseTimer);
    alertAutoCloseTimer = null;
  }
  alertModal.title = title;
  alertModal.message = message;
  alertModal.type = type;
  alertModal.open = true;
  // Alert sukses hilang sendiri tanpa perlu konfirmasi; error tetap menunggu klik.
  if (type === "success") {
    alertAutoCloseTimer = setTimeout(closeAlertModal, 1000);
  }
};

const closeAlertModal = () => {
  if (alertAutoCloseTimer) {
    clearTimeout(alertAutoCloseTimer);
    alertAutoCloseTimer = null;
  }
  alertModal.open = false;
};

const closeConfirmModal = () => {
  if (confirmModal.processing) return;
  confirmModal.open = false;
  confirmModal.item = null;
};

const openCreateModal = () => {
  resetForm();
  isFormModalOpen.value = true;
};

const closeFormModal = () => {
  if (isSubmitting.value) return;
  isFormModalOpen.value = false;
  resetForm();
};

const resetForm = () => {
  editingId.value = null;
  form.name = "";
  form.wakur = "";
  form.kepsek = "";
  form.full_address = "";
  form.province = "";
  form.city = "";
  form.district = "";
  form.latitude = null;
  form.longitude = null;
  form.google_maps_url = "";
  form.place_id = "";
  form.is_planned = true;
  addressSuggestions.value = [];
  showAddressSuggestions.value = false;
  addressSearchError.value = "";
  if (addressSearchTimer) {
    clearTimeout(addressSearchTimer);
    addressSearchTimer = null;
  }
};

const buildPayload = () => ({
  name: form.name,
  wakur: form.wakur || undefined,
  kepsek: form.kepsek || undefined,
  full_address: form.full_address,
  province: form.province,
  city: form.city,
  district: form.district,
  latitude: form.latitude,
  longitude: form.longitude,
  google_maps_url: form.google_maps_url || undefined,
  place_id: form.place_id || undefined,
  is_planned: form.is_planned === true,
});

const loadTargets = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/school-visit-targets", {
      params: {
        search: filters.search || undefined,
        visit_status: filters.status || undefined,
        page: pagination.page,
        limit: pagination.limit,
      },
    });
    const data = response?.data || {};
    targets.value = Array.isArray(data.items) ? data.items : [];
    pagination.page = Number(data.page || pagination.page || 1);
    pagination.limit = Number(data.limit || pagination.limit || 10);
    pagination.total = Number(data.total || 0);
    pagination.totalPages = Number(data.totalPages || 0);
    if (pagination.totalPages > 0 && pagination.page > pagination.totalPages) {
      pagination.page = pagination.totalPages;
      await loadTargets();
    }
  } catch (error) {
    showAlertModal({
      title: "Gagal Memuat List Sekolah",
      message: error.message || "Data list sekolah tidak berhasil dimuat.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const scheduleSearch = () => {
  clearTimeout(searchTimer);
  pagination.page = 1;
  searchTimer = setTimeout(loadTargets, 350);
};

const applyFilters = () => {
  pagination.page = 1;
  loadTargets();
};

const changeLimit = () => {
  pagination.page = 1;
  loadTargets();
};

const goToPage = (page) => {
  const nextPage = Math.max(1, Math.min(Number(page || 1), pagination.totalPages || 1));
  if (nextPage === pagination.page) return;
  pagination.page = nextPage;
  loadTargets();
};

const normalizeAddressSuggestion = (item) => ({
  ...item,
  name: item?.name || item?.display_name?.split(",")?.[0] || "Lokasi sekolah",
});

const searchAddressSuggestions = async (value) => {
  const trimmed = String(value || "").trim();
  const currentToken = ++addressSearchToken;

  if (trimmed.length < 3) {
    addressSuggestions.value = [];
    showAddressSuggestions.value = false;
    addressSearchError.value = "";
    isSearchingAddress.value = false;
    return;
  }

  isSearchingAddress.value = true;
  showAddressSuggestions.value = true;
  addressSearchError.value = "";

  try {
    const response = await api.get("/public/geocode", {
      params: { q: trimmed },
      suppressAuthRedirect: true,
      silentLoading: true,
    });
    if (currentToken !== addressSearchToken) return;
    const items = response?.data?.items || [];
    addressSuggestions.value = Array.isArray(items) ? items.map(normalizeAddressSuggestion) : [];
    if (addressSuggestions.value.length === 0) {
      addressSearchError.value = "Alamat belum ditemukan. Coba tambahkan kota atau kabupaten.";
    }
  } catch (error) {
    if (currentToken !== addressSearchToken) return;
    addressSuggestions.value = [];
    addressSearchError.value = error.message || "Gagal mencari rekomendasi alamat.";
  } finally {
    if (currentToken === addressSearchToken) {
      isSearchingAddress.value = false;
    }
  }
};

const onNameInput = () => {
  addressSearchError.value = "";
  if (addressSearchTimer) clearTimeout(addressSearchTimer);
  addressSearchTimer = setTimeout(() => {
    searchAddressSuggestions(form.name);
  }, 400);
};

const hideAddressSuggestions = () => {
  window.setTimeout(() => {
    showAddressSuggestions.value = false;
  }, 120);
};

const mapsURLFromSuggestion = (item) => {
  const lat = Number(item?.lat);
  const lng = Number(item?.lon);
  const query = Number.isFinite(lat) && Number.isFinite(lng)
    ? `${lat.toFixed(6)},${lng.toFixed(6)}`
    : item?.display_name || item?.name || form.name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const selectAddressSuggestion = (item) => {
  const lat = Number(item?.lat);
  const lng = Number(item?.lon);

  if (item?.name) {
    form.name = item.name;
  }
  form.full_address = item?.display_name || "";
  form.province = item?.province || "";
  form.city = item?.city || "";
  form.district = item?.district || "";
  form.latitude = Number.isFinite(lat) ? lat : null;
  form.longitude = Number.isFinite(lng) ? lng : null;
  form.google_maps_url = mapsURLFromSuggestion(item);
  form.place_id = item?.place_id == null ? "" : String(item.place_id);

  addressSuggestions.value = [];
  showAddressSuggestions.value = false;
  addressSearchError.value = "";
};

const submitTarget = async () => {
  isSubmitting.value = true;
  try {
    const response = editingId.value
      ? await api.put(`/school-visit-targets/${editingId.value}`, buildPayload())
      : await api.post("/school-visit-targets", buildPayload());

    showAlertModal({
      title: editingId.value ? "List Sekolah Diperbarui" : "List Sekolah Ditambahkan",
      message: response?.message || "Data list sekolah berhasil disimpan.",
      type: "success",
    });
    resetForm();
    isFormModalOpen.value = false;
    await loadTargets();
  } catch (error) {
    showAlertModal({
      title: "Gagal Menyimpan List Sekolah",
      message: error.message || "Data list sekolah gagal disimpan.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const editTarget = (item) => {
  editingId.value = item.id;
  form.name = item.name || "";
  form.wakur = item.wakur || "";
  form.kepsek = item.kepsek || "";
  form.full_address = item.full_address || "";
  form.province = item.province || "";
  form.city = item.city || "";
  form.district = item.district || "";
  form.latitude = item.latitude == null ? null : Number(item.latitude);
  form.longitude = item.longitude == null ? null : Number(item.longitude);
  form.google_maps_url = item.google_maps_url || "";
  form.place_id = item.place_id || "";
  form.is_planned = item.is_planned === true;
  addressSuggestions.value = [];
  showAddressSuggestions.value = false;
  addressSearchError.value = "";
  isFormModalOpen.value = true;
};

const deleteTarget = async (item) => {
  confirmModal.title = "Hapus List Sekolah";
  confirmModal.message = `Hapus "${item.name}" dari list sekolah?`;
  confirmModal.item = item;
  confirmModal.open = true;
};

const confirmDeleteTarget = async () => {
  const item = confirmModal.item;
  if (!item) return;

  deletingId.value = item.id;
  confirmModal.processing = true;
  try {
    const response = await api.delete(`/school-visit-targets/${item.id}`);
    if (editingId.value === item.id) {
      resetForm();
      isFormModalOpen.value = false;
    }
    confirmModal.open = false;
    confirmModal.item = null;
    await loadTargets();
    showAlertModal({
      title: "List Sekolah Dihapus",
      message: response?.message || "Data list sekolah berhasil dihapus.",
      type: "success",
    });
  } catch (error) {
    showAlertModal({
      title: "Gagal Menghapus List Sekolah",
      message: error.message || "Data list sekolah gagal dihapus.",
      type: "error",
    });
  } finally {
    deletingId.value = null;
    confirmModal.processing = false;
  }
};

const togglePlanned = async (item, checked) => {
  planningId.value = item.id;
  const previousPlanned = item.is_planned === true;
  const previousPlannedAt = item.planned_at || null;
  const previousVisited = item.is_visited === true;
  const previousVisitedAt = item.visited_at || null;
  item.is_planned = checked;
  if (!checked) {
    item.is_visited = false;
    item.visited_at = null;
  }
  try {
    const response = await api.put(
      `/school-visit-targets/${item.id}`,
      { is_planned: checked },
      { silentLoading: true }
    );
    const updated = response?.data || {};
    item.is_planned = updated.is_planned === true;
    item.planned_at = updated.planned_at || null;
    item.is_visited = updated.is_visited === true;
    item.visited_at = updated.visited_at || null;
    if (filters.status !== "") {
      await loadTargets();
    }
  } catch (error) {
    item.is_planned = previousPlanned;
    item.planned_at = previousPlannedAt;
    item.is_visited = previousVisited;
    item.visited_at = previousVisitedAt;
    showAlertModal({
      title: "Gagal Mengubah Rencana Kunjungan",
      message: error.message || "Status rencana kunjungan sekolah gagal disimpan.",
      type: "error",
    });
  } finally {
    planningId.value = null;
  }
};

const toggleVisited = async (item, checked) => {
  visitingId.value = item.id;
  const previousPlanned = item.is_planned === true;
  const previousPlannedAt = item.planned_at || null;
  const previousValue = item.is_visited === true;
  const previousVisitedAt = item.visited_at || null;
  item.is_visited = checked;
  if (checked) {
    item.is_planned = true;
  }
  try {
    const response = await api.put(
      `/school-visit-targets/${item.id}`,
      { is_visited: checked },
      { silentLoading: true }
    );
    const updated = response?.data || {};
    item.is_planned = updated.is_planned === true;
    item.planned_at = updated.planned_at || null;
    item.is_visited = updated.is_visited === true;
    item.visited_at = updated.visited_at || null;
    if (filters.status !== "") {
      await loadTargets();
    }
  } catch (error) {
    item.is_planned = previousPlanned;
    item.planned_at = previousPlannedAt;
    item.is_visited = previousValue;
    item.visited_at = previousVisitedAt;
    showAlertModal({
      title: "Gagal Mengubah Status Kunjungan",
      message: error.message || "Status kunjungan sekolah gagal disimpan.",
      type: "error",
    });
  } finally {
    visitingId.value = null;
  }
};

const visitStatusLabel = (item) => {
  if (item.is_visited === true) return "Complete";
  if (item.is_planned === true) return "Rencana";
  return "Belum Direncanakan";
};

const visitStatusClass = (item) => {
  if (item.is_visited === true) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20";
  }
  if (item.is_planned === true) {
    return "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/20";
  }
  return "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
};

const applyResolvedToForm = (item) => {
  form.full_address = item.full_address || "";
  form.province = item.province || "";
  form.city = item.city || "";
  form.district = item.district || "";
  form.latitude = item.latitude == null ? null : Number(item.latitude);
  form.longitude = item.longitude == null ? null : Number(item.longitude);
  form.google_maps_url = item.google_maps_url || "";
  form.place_id = item.place_id || "";
};

const resolveTargetAddress = async (item, applyToCurrentForm = false) => {
  resolvingId.value = item.id;
  try {
    const response = await api.post(`/school-visit-targets/${item.id}/resolve-address`, {
      query: item.name,
    });
    const updated = response?.data || {};
    if (applyToCurrentForm || editingId.value === item.id) {
      applyResolvedToForm(updated);
    }
    await loadTargets();
    showAlertModal({
      title: "Alamat Otomatis Terisi",
      message: response?.message || "Alamat sekolah berhasil ditemukan.",
      type: "success",
    });
  } catch (error) {
    showAlertModal({
      title: "Gagal Mengisi Alamat",
      message: error.message || "Alamat sekolah belum berhasil ditemukan otomatis.",
      type: "error",
    });
  } finally {
    resolvingId.value = null;
  }
};

const openGoogleMaps = (name, savedUrl) => {
  const query = encodeURIComponent(String(name || "").trim());
  const targetUrl = savedUrl || `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(targetUrl, "_blank", "noopener,noreferrer");
};

const compactArea = (item) => [item.district, item.city].filter(Boolean).join(", ");

const schoolInitials = (name) => {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const schoolContactLabel = (item) => {
  const contacts = [];
  if (item.wakur) contacts.push(`Wakur: ${item.wakur}`);
  if (item.kepsek) contacts.push(`Kepsek: ${item.kepsek}`);
  return contacts.join(" | ");
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

onMounted(loadTargets);

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer);
  if (addressSearchTimer) clearTimeout(addressSearchTimer);
  if (alertAutoCloseTimer) clearTimeout(alertAutoCloseTimer);
  addressSearchToken += 1;
});
</script>

<style scoped>
.school-alert-fade-enter-active,
.school-alert-fade-leave-active {
  transition: opacity 0.18s ease;
}

.school-alert-fade-enter-from,
.school-alert-fade-leave-to {
  opacity: 0;
}
</style>
