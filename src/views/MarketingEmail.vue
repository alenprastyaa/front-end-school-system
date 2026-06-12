<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <!-- HERO -->
      <section
        class="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl ring-1 ring-white/10 md:p-8">
        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl">
        </div>
        <div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-2xl">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-200 ring-1 ring-white/15">
              <Icon icon="mdi:bullhorn-variant-outline" class="h-3.5 w-3.5" />
              Super Admin · Marketing
            </span>
            <h1 class="mt-4 text-2xl font-black tracking-tight md:text-3xl">Kirim Email Penawaran</h1>
            <p class="mt-2 text-sm leading-6 text-slate-300 md:text-base">
              Kirim penawaran ke banyak sekolah lewat Brevo dalam tiga langkah: susun template, pilih penerima, lalu
              kirim. Nama sekolah otomatis terisi sebagai placeholder dinamis.
            </p>
          </div>
          <div class="flex shrink-0 gap-2">
            <button type="button" @click="loadSchoolContacts" :disabled="isLoadingSchoolContacts"
              class="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20 disabled:opacity-50">
              <Icon :icon="isLoadingSchoolContacts ? 'mdi:loading' : 'mdi:refresh'" class="h-4 w-4"
                :class="{ 'animate-spin': isLoadingSchoolContacts }" />
              Refresh
            </button>
            <button type="button" @click="resetForm" :disabled="isSending"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50">
              <Icon icon="mdi:restore" class="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <!-- KPI STRIP -->
        <div class="relative mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
            <div class="flex items-center gap-2 text-slate-300">
              <Icon icon="mdi:school-outline" class="h-4 w-4" />
              <span class="text-[11px] font-bold uppercase tracking-[0.14em]">Total Sekolah</span>
            </div>
            <p class="mt-2 text-2xl font-black">{{ schoolStats.total }}</p>
            <p class="mt-0.5 text-[11px] text-slate-400">{{ schoolStats.noEmail }} belum ada email</p>
          </div>
          <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
            <div class="flex items-center gap-2 text-amber-200">
              <Icon icon="mdi:email-outline" class="h-4 w-4" />
              <span class="text-[11px] font-bold uppercase tracking-[0.14em]">Belum Dikirim</span>
            </div>
            <p class="mt-2 text-2xl font-black text-amber-200">{{ schoolStats.unsent }}</p>
            <p class="mt-0.5 text-[11px] text-slate-400">siap menerima penawaran</p>
          </div>
          <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
            <div class="flex items-center gap-2 text-emerald-200">
              <Icon icon="mdi:email-check-outline" class="h-4 w-4" />
              <span class="text-[11px] font-bold uppercase tracking-[0.14em]">Sudah Dikirim</span>
            </div>
            <p class="mt-2 text-2xl font-black text-emerald-200">{{ schoolStats.sent }}</p>
            <p class="mt-0.5 text-[11px] text-slate-400">penawaran terkirim</p>
          </div>
          <div class="rounded-2xl bg-sky-500/20 p-4 ring-1 ring-sky-300/30 backdrop-blur">
            <div class="flex items-center gap-2 text-sky-100">
              <Icon icon="mdi:checkbox-marked-circle-outline" class="h-4 w-4" />
              <span class="text-[11px] font-bold uppercase tracking-[0.14em]">Dipilih</span>
            </div>
            <p class="mt-2 text-2xl font-black text-white">{{ validRecipientCount }}</p>
            <p class="mt-0.5 text-[11px] text-sky-200/80">penerima siap dikirim</p>
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <!-- MAIN COLUMN -->
        <div class="space-y-6">
          <!-- STEP 1: TEMPLATE -->
          <section
            class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div class="flex min-w-0 gap-4">
                <span
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">1</span>
                <div class="min-w-0">
                  <h2 class="text-lg font-bold text-slate-900 dark:text-white">Template Email</h2>
                  <p class="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Icon icon="mdi:format-title" class="h-4 w-4 shrink-0 text-slate-400" />
                    <span class="truncate font-semibold text-slate-700 dark:text-slate-200">{{ form.subject || `Subject
                      belum diisi` }}</span>
                  </p>
                  <div class="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <Icon :icon="form.send_as_html ? 'mdi:language-html5' : 'mdi:text'" class="h-3.5 w-3.5" />
                      {{ form.send_as_html ? "HTML Modern" : "Teks Biasa" }}
                    </span>
                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <Icon icon="mdi:email-lock-outline" class="h-3.5 w-3.5" />
                      Dikirim sebagai no-reply
                    </span>
                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                      <Icon icon="mdi:file-pdf-box" class="h-3.5 w-3.5" />
                      + Lampiran PDF Penawaran
                    </span>
                  </div>

                  <div
                    class="mt-3 flex items-start gap-3 rounded-2xl bg-sky-50 p-3.5 ring-1 ring-sky-100 dark:bg-sky-500/10 dark:ring-sky-500/20">
                    <Icon icon="mdi:file-pdf-box" class="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-slate-800 dark:text-slate-100">Setiap email otomatis melampirkan
                        PDF Surat Penawaran</p>
                      <p class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        PDF dipersonalisasi sesuai nama sekolah tujuan. Harga <b
                          class="text-slate-700 dark:text-slate-200">Rp 1.700</b>/siswa/bulan — langganan tahunan <b
                          class="text-emerald-600 dark:text-emerald-300">gratis 1 bulan</b> (cukup bayar 11 bulan).
                      </p>
                      <button type="button" @click="previewProposalPdf" :disabled="isPreviewingProposal"
                        class="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-50 disabled:opacity-50 dark:bg-slate-900 dark:text-sky-200 dark:ring-sky-500/30 dark:hover:bg-slate-800">
                        <Icon :icon="isPreviewingProposal ? 'mdi:loading' : 'mdi:file-eye-outline'" class="h-4 w-4"
                          :class="{ 'animate-spin': isPreviewingProposal }" />
                        {{ isPreviewingProposal ? "Membuka..." : "Preview PDF Penawaran" }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" @click="openTemplateModal" :disabled="isSending"
                class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-500 disabled:opacity-50">
                <Icon icon="mdi:file-document-edit-outline" class="h-4 w-4" />
                Edit & Preview
              </button>
            </div>
          </section>

          <!-- STEP 2: PENERIMA -->
          <section
            class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
            <div class="flex flex-col gap-4 p-6 pb-0">
              <div class="flex gap-4">
                <span
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">2</span>
                <div>
                  <h2 class="text-lg font-bold text-slate-900 dark:text-white">Pilih Penerima</h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Pilih dari list sekolah, atau tambahkan email secara manual.
                  </p>
                </div>
              </div>

              <!-- TABS -->
              <div class="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
                <button type="button" @click="recipientTab = 'schools'"
                  class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition"
                  :class="recipientTab === 'schools' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'">
                  <Icon icon="mdi:format-list-checks" class="h-4 w-4" />
                  List Sekolah
                  <span
                    class="rounded-full bg-sky-100 px-1.5 text-[11px] font-black text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">{{
                      selectedSchoolContactCount }}</span>
                </button>
                <button type="button" @click="recipientTab = 'manual'"
                  class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition"
                  :class="recipientTab === 'manual' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'">
                  <Icon icon="mdi:account-plus-outline" class="h-4 w-4" />
                  Tambah Manual
                </button>
              </div>
            </div>

            <!-- TAB: LIST SEKOLAH -->
            <div v-show="recipientTab === 'schools'" class="p-6 pt-4">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div class="relative flex-1">
                  <Icon icon="mdi:magnify"
                    class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input v-model.trim="schoolContactSearch" type="search" placeholder="Cari sekolah atau email..."
                    class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </div>
                <div class="flex flex-wrap gap-2">
                  <button type="button" @click="downloadRecipientTemplate"
                    :disabled="isSending || isDownloadingTemplate"
                    class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    title="Unduh template Excel">
                    <Icon :icon="isDownloadingTemplate ? 'mdi:loading' : 'mdi:tray-arrow-down'" class="h-4 w-4"
                      :class="{ 'animate-spin': isDownloadingTemplate }" />
                    Template
                  </button>
                  <label
                    class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    :class="{ 'pointer-events-none opacity-50': isSending || isImportingRecipients }"
                    title="Upload Excel ke list sekolah">
                    <Icon :icon="isImportingRecipients ? 'mdi:loading' : 'mdi:tray-arrow-up'" class="h-4 w-4"
                      :class="{ 'animate-spin': isImportingRecipients }" />
                    Upload
                    <input type="file"
                      accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      class="hidden" @change="importRecipientExcel" />
                  </label>
                </div>
              </div>

              <!-- TOOLBAR -->
              <div
                class="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
                <label
                  class="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <input type="checkbox" class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    :checked="areAllVisibleSchoolContactsSelected"
                    :indeterminate.prop="isSomeVisibleSchoolContactsSelected"
                    :disabled="selectableVisibleSchoolContacts.length === 0 || isSending"
                    @change="toggleAllVisibleSchoolContacts" />
                  Pilih semua
                  <span class="text-xs font-medium text-slate-400">({{ selectableVisibleSchoolContacts.length }}
                    tersedia)</span>
                </label>
                <button type="button" @click="clearSelectedSchoolContacts"
                  :disabled="selectedSchoolContactCount === 0 || isSending"
                  class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-40 dark:text-rose-300 dark:hover:bg-rose-500/10">
                  <Icon icon="mdi:close-circle-outline" class="h-4 w-4" />
                  Bersihkan pilihan
                </button>
              </div>

              <!-- LIST -->
              <div class="mt-3 space-y-2">
                <SkeletonLoader v-if="isLoadingSchoolContacts" variant="list" :count="5" />

                <template v-else>
                  <div v-for="item in paginatedSchoolContacts" :key="item.id"
                    class="flex items-start gap-3 rounded-2xl border p-3 transition"
                    :class="isSchoolContactSelected(item.id)
                      ? 'border-sky-300 bg-sky-50/70 dark:border-sky-500/40 dark:bg-sky-500/5'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'">
                    <input type="checkbox"
                      class="mt-2.5 h-4 w-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:cursor-not-allowed"
                      :checked="isSchoolContactSelected(item.id)"
                      :disabled="!isSchoolContactSelectable(item) || isSending"
                      @change="toggleSchoolContactSelection(item, $event.target.checked)" />
                    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
                      :class="avatarClass(item.name)">
                      {{ schoolInitials(item.name) }}
                    </span>
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <p class="min-w-0 break-words font-bold text-slate-900 dark:text-white">{{ item.name }}</p>
                        <div class="shrink-0 text-right">
                          <span
                            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1"
                            :class="marketingStatusClass(item)">
                            <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                            {{ marketingStatusLabel(item) }}
                          </span>
                          <p v-if="getEmailOfferStatus(item.email).last_sent_at"
                            class="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{{
                              formatDateTime(getEmailOfferStatus(item.email).last_sent_at) }}</p>
                          <p v-else-if="isLoadingOfferStatuses"
                            class="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Mengecek Brevo...</p>
                        </div>
                      </div>

                      <!-- EMAIL / EDIT -->
                      <div v-if="editingSchoolEmail.id === item.id" class="mt-2 flex max-w-xl items-center gap-2">
                        <input v-model.trim="editingSchoolEmail.email" type="email" placeholder="email@sekolah.sch.id"
                          class="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-950 dark:text-white dark:ring-slate-700"
                          @keydown.enter.prevent="saveSchoolEmail(item)" @keydown.esc.prevent="cancelEditSchoolEmail" />
                        <button type="button" @click="saveSchoolEmail(item)" :disabled="savingSchoolEmailId === item.id"
                          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-50"
                          title="Simpan email">
                          <Icon :icon="savingSchoolEmailId === item.id ? 'mdi:loading' : 'mdi:check'" class="h-4 w-4"
                            :class="{ 'animate-spin': savingSchoolEmailId === item.id }" />
                        </button>
                        <button type="button" @click="cancelEditSchoolEmail" :disabled="savingSchoolEmailId === item.id"
                          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          title="Batal">
                          <Icon icon="mdi:close" class="h-4 w-4" />
                        </button>
                      </div>
                      <div v-else class="mt-1 flex items-center gap-1.5 text-sm"
                        :class="item.email ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'">
                        <Icon icon="mdi:email-outline" class="h-4 w-4 shrink-0 text-slate-400" />
                        <span class="min-w-0 break-all">{{ item.email || "Email belum diisi" }}</span>
                        <button type="button" @click="startEditSchoolEmail(item)"
                          :disabled="isSending || savingSchoolEmailId === item.id"
                          class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sky-600 transition hover:bg-sky-50 disabled:opacity-40 dark:text-sky-300 dark:hover:bg-sky-500/10"
                          title="Edit email sekolah">
                          <Icon icon="mdi:pencil-outline" class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="filteredSchoolContacts.length === 0"
                    class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
                    <Icon icon="mdi:school-outline" class="h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <p class="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">{{ schoolContactSearch ?
                      "Tidak ada sekolah yang cocok." : "Belum ada sekolah." }}</p>
                    <p class="mt-1 text-xs text-slate-400">Tambahkan lewat tombol Upload atau menu School Visit Targets.
                    </p>
                  </div>
                </template>
              </div>

              <!-- PAGINATION -->
              <div v-if="!isLoadingSchoolContacts && filteredSchoolContacts.length > 0"
                class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ schoolContactRangeLabel }}</p>
                <div class="flex items-center gap-1.5">
                  <button type="button" @click="goToSchoolContactPage(schoolContactPage - 1)"
                    :disabled="schoolContactPage <= 1"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    aria-label="Halaman sebelumnya">
                    <Icon icon="mdi:chevron-left" class="h-5 w-5" />
                  </button>
                  <template v-for="(page, index) in schoolContactPageItems" :key="`school-page-${index}`">
                    <span v-if="page === '...'" class="px-1 text-sm text-slate-400">…</span>
                    <button v-else type="button" @click="goToSchoolContactPage(page)"
                      class="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 text-sm font-bold transition"
                      :class="page === schoolContactPage
                        ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'">
                      {{ page }}
                    </button>
                  </template>
                  <button type="button" @click="goToSchoolContactPage(schoolContactPage + 1)"
                    :disabled="schoolContactPage >= schoolContactTotalPages"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    aria-label="Halaman berikutnya">
                    <Icon icon="mdi:chevron-right" class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- TAB: MANUAL -->
            <div v-show="recipientTab === 'manual'" class="p-6 pt-4">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ recipients.length }} baris penerima · {{
                  validRecipientCount }} siap kirim</p>
                <button type="button" @click="addRecipient" :disabled="isSending"
                  class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white">
                  <Icon icon="mdi:plus" class="h-4 w-4" />
                  Tambah Baris
                </button>
              </div>

              <div class="mt-3 space-y-2">
                <div v-for="(recipient, index) in recipients" :key="recipient.id"
                  class="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 md:grid-cols-[1fr,1.2fr,auto] dark:border-slate-800 dark:bg-slate-900">
                  <input v-model.trim="recipient.school_name" type="text" placeholder="Nama sekolah"
                    class="rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  <input v-model.trim="recipient.email" type="email" placeholder="email@sekolah.sch.id"
                    class="rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                  <button type="button" @click="removeRecipient(index)" :disabled="isSending || recipients.length === 1"
                    class="inline-flex h-9 w-full items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-40 md:w-9 dark:bg-rose-500/10 dark:text-rose-200"
                    title="Hapus penerima" aria-label="Hapus penerima">
                    <Icon icon="mdi:trash-can-outline" class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div
                class="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
                <label class="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <Icon icon="mdi:format-list-bulleted" class="h-4 w-4 text-slate-400" />
                  Tempel banyak penerima sekaligus
                </label>
                <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">Satu baris satu penerima — format: <code
                    class="rounded bg-slate-200 px-1 py-0.5 text-[11px] dark:bg-slate-700">Nama Sekolah, email@domain.com</code>
                </p>
                <textarea v-model="bulkInput" rows="4"
                  placeholder="SMA Negeri 1, info@sman1.sch.id&#10;SMK Mandiri, admin@smkmandiri.sch.id"
                  class="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm leading-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700"></textarea>
                <button type="button" @click="applyBulkInput" :disabled="isSending || !bulkInput.trim()"
                  class="mt-3 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 disabled:opacity-50">
                  <Icon icon="mdi:playlist-plus" class="h-4 w-4" />
                  Masukkan ke Daftar
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- SIDE: STEP 3 - KIRIM (sticky) -->
        <aside class="space-y-6">
          <section
            class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 xl:sticky xl:top-6 dark:bg-slate-900 dark:ring-white/10">
            <div class="flex gap-4">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">3</span>
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Tinjau & Kirim</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Periksa ringkasan sebelum mengirim.</p>
              </div>
            </div>

            <div class="mt-5 space-y-3">
              <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
                <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Subject</p>
                <p class="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">{{ previewSubject || `Subject belum
                  diisi` }}
                </p>
              </div>

              <div
                class="flex items-center justify-between rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                <div>
                  <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
                    Penerima
                    Siap</p>
                  <p class="mt-1 text-3xl font-black text-emerald-700 dark:text-emerald-200">{{ validRecipientCount }}
                  </p>
                </div>
                <Icon icon="mdi:email-fast-outline" class="h-12 w-12 text-emerald-300 dark:text-emerald-500/40" />
              </div>

              <div v-if="validRecipientCount > 0"
                class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
                <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Penerima Pertama</p>
                <p class="mt-1.5 font-bold text-slate-900 dark:text-white">{{ previewRecipient.school_name || `Nama
                  Sekolah` }}
                </p>
                <p class="mt-0.5 break-all text-xs text-slate-500 dark:text-slate-400">{{ previewRecipient.email }}</p>
              </div>
            </div>

            <button type="button" @click="sendEmails" :disabled="isSending || validRecipientCount === 0"
              class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none">
              <Icon :icon="isSending ? 'mdi:loading' : 'mdi:send'" class="h-5 w-5"
                :class="{ 'animate-spin': isSending }" />
              {{ isSending ? "Mengirim..." : `Kirim ke ${validRecipientCount} Email` }}
            </button>
            <p class="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
              <Icon icon="mdi:shield-check-outline" class="h-3.5 w-3.5" />
              Email yang sudah pernah dikirim otomatis dilewati.
            </p>
          </section>
        </aside>
      </section>

      <!-- HASIL PENGIRIMAN -->
      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:chart-box-outline" class="h-5 w-5 text-slate-400" />
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Hasil Pengiriman</h2>
        </div>

        <div v-if="sendSummary" class="mt-4 grid gap-3 sm:grid-cols-3">
          <article class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
            <p class="mt-2 text-2xl font-black">{{ sendSummary.total_recipients || 0 }}</p>
          </article>
          <article
            class="rounded-2xl bg-emerald-50 p-4 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em]">Sukses</p>
            <p class="mt-2 text-2xl font-black">{{ sendSummary.success_count || 0 }}</p>
          </article>
          <article
            class="rounded-2xl bg-rose-50 p-4 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20">
            <p class="text-xs font-semibold uppercase tracking-[0.18em]">Gagal</p>
            <p class="mt-2 text-2xl font-black">{{ sendSummary.failed_count || 0 }}</p>
          </article>
        </div>

        <div v-if="sendResults.length > 0"
          class="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700">
          <table class="min-w-full text-left text-sm">
            <thead
              class="bg-slate-50 text-[11px] uppercase tracking-[0.1em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th class="px-4 py-3 font-semibold">Penerima</th>
                <th class="px-4 py-3 font-semibold">Status</th>
                <th class="px-4 py-3 font-semibold">Catatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in sendResults" :key="`${item.email}-${item.error || 'ok'}`"
                class="bg-white dark:bg-slate-900">
                <td class="px-4 py-3">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ item.school_name || item.email }}</div>
                  <div class="text-xs text-slate-500">{{ item.email }}</div>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                    :class="item.success ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200'">
                    <Icon :icon="item.success ? 'mdi:check-circle-outline' : 'mdi:alert-circle-outline'"
                      class="h-3.5 w-3.5" />
                    {{ item.success ? "Terkirim" : "Gagal" }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-500 dark:text-slate-300">{{ item.error || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else
          class="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
          <Icon icon="mdi:email-off-outline" class="h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p class="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Belum ada pengiriman</p>
          <p class="mt-1 text-xs text-slate-400">Hasil pengiriman email akan muncul di sini.</p>
        </div>
      </section>
    </main>

    <!-- MODAL: TEMPLATE -->
    <Teleport to="body">
      <transition name="fade-scale">
        <div v-if="showTemplateModal"
          class="fixed inset-0 z-[135] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          @click.self="closeTemplateModal">
          <section
            class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
            <div
              class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">Template Email
                </p>
                <h2 class="mt-1 text-lg font-black text-slate-900 dark:text-white">Atur email penawaran</h2>
              </div>
              <button type="button" @click="closeTemplateModal"
                class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Tutup template">
                <Icon icon="mdi:close" class="h-5 w-5" />
              </button>
            </div>

            <div class="grid min-h-0 flex-1 gap-0 overflow-y-auto lg:grid-cols-[0.92fr_1.08fr]">
              <div class="space-y-4 border-b border-slate-100 p-6 lg:border-b-0 lg:border-r dark:border-slate-800">
                <div
                  class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700">
                  <div class="flex items-start gap-3">
                    <Icon icon="mdi:email-lock-outline" class="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    <div>
                      <p class="font-bold text-slate-800 dark:text-slate-100">Email dikirim sebagai no-reply</p>
                      <p class="mt-1 leading-6">Balasan penerima diarahkan ke alamat no-reply dari konfigurasi Brevo,
                        sehingga email penawaran tidak memakai kotak balasan aktif.</p>
                    </div>
                  </div>
                </div>
                <label class="block">
                  <span class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</span>
                  <input v-model.trim="form.subject" type="text" required
                    placeholder="Penawaran Demo Learning Management System untuk {{school_name}}"
                    class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                </label>
                <label class="block">
                  <span class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Isi Email</span>
                  <textarea v-model="form.body" rows="14" required placeholder="Yth. Bapak/Ibu Pimpinan..."
                    class="block w-full resize-y rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"></textarea>
                </label>
                <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <input v-model="form.send_as_html" type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                  Kirim sebagai template HTML modern
                </label>
                <div class="rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100 dark:bg-sky-500/10 dark:ring-sky-500/20">
                  <label class="block">
                    <span class="mb-1.5 block text-sm font-bold text-sky-900 dark:text-sky-100">Kirim Test
                      Template</span>
                    <div class="flex flex-col gap-2 sm:flex-row">
                      <input v-model.trim="testEmail" type="email" placeholder="email test@domain.com"
                        class="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-sky-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-950 dark:text-white dark:ring-sky-900" />
                      <button type="button" @click="sendTestEmail" :disabled="isSendingTestEmail || !testEmail.trim()"
                        class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-500 disabled:opacity-50">
                        <Icon :icon="isSendingTestEmail ? 'mdi:loading' : 'mdi:send-check-outline'" class="h-4 w-4"
                          :class="{ 'animate-spin': isSendingTestEmail }" />
                        {{ isSendingTestEmail ? "Mengirim..." : "Tes" }}
                      </button>
                    </div>
                  </label>
                </div>
              </div>

              <div class="p-6">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Preview</h3>
                  <button type="button" @click="useDefaultTemplate"
                    class="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-200">
                    <Icon icon="mdi:file-restore-outline" class="h-4 w-4" />
                    Default
                  </button>
                </div>
                <div
                  class="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Subject</p>
                  <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ previewSubject || "-" }}</p>
                  <p class="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Body</p>
                  <div v-if="form.send_as_html"
                    class="mt-2 max-h-[560px] overflow-auto rounded-xl bg-white ring-1 ring-slate-200 dark:bg-white dark:ring-slate-700">
                    <iframe title="Preview body email" :srcdoc="previewBody" class="h-[540px] w-full border-0"
                      sandbox=""></iframe>
                  </div>
                  <pre v-else
                    class="mt-2 max-h-[560px] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-200">
                {{ previewBody || "-" }}</pre>
                </div>
              </div>
            </div>

            <div class="flex justify-end border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <button type="button" @click="closeTemplateModal"
                class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white">
                Simpan Template
              </button>
            </div>
          </section>
        </div>
      </transition>
    </Teleport>

    <!-- MODAL: KONFIRMASI -->
    <Teleport to="body">
      <transition name="fade-scale">
        <div v-if="showSendConfirmModal"
          class="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          @click.self="closeSendConfirmModal">
          <section
            class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
            <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
              <div class="flex items-start gap-3">
                <div
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <Icon icon="mdi:email-fast-outline" class="h-6 w-6" />
                </div>
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                    Konfirmasi
                    Pengiriman</p>
                  <h2 class="mt-1 text-lg font-black text-slate-900 dark:text-white">Kirim email penawaran?</h2>
                  <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Sistem akan mengirim template ini ke {{ validRecipientCount }} email penerima.
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-3 px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
              <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/70 dark:ring-slate-700">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Preview Penerima Pertama</p>
                <p class="mt-2 font-bold text-slate-900 dark:text-white">{{ previewRecipient.school_name || `Nama
                  Sekolah`
                  }}</p>
                <p class="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">{{ previewRecipient.email ||
                  "email@sekolah.sch.id" }}</p>
              </div>
              <div
                class="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                <Icon icon="mdi:paperclip" class="h-4 w-4 shrink-0" />
                Termasuk lampiran PDF Surat Penawaran yang dipersonalisasi per sekolah.
              </div>
              <p>
                Pastikan nama sekolah dan alamat email sudah benar sebelum melanjutkan.
              </p>
            </div>

            <div
              class="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end dark:border-slate-800">
              <button type="button" @click="closeSendConfirmModal" :disabled="isSending"
                class="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                Batal
              </button>
              <button type="button" @click="confirmSendEmails" :disabled="isSending"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50">
                <Icon :icon="isSending ? 'mdi:loading' : 'mdi:send'" class="h-4 w-4"
                  :class="{ 'animate-spin': isSending }" />
                {{ isSending ? "Mengirim..." : "Ya, Kirim" }}
              </button>
            </div>
          </section>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import * as XLSX from "xlsx";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { downloadExcelWorksheet } from "@/utils/excelExport";

let recipientId = 1;

const DEFAULT_SUBJECT = "Demo LMS Modern untuk {{school_name}}";
const DEFAULT_BODY = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Demo LMS Modern untuk {{school_name}}</title>
  </head>
  <body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;color:#f4f7fb;">
      LMS modern untuk pembelajaran, CBT anti curang, presensi wajah, laporan orang tua, dan AI Assistant.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 18px 44px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:#0f172a;padding:30px 32px;color:#ffffff;">
                <div style="font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#38bdf8;">Bitwize Digital Platform</div>
                <h1 style="margin:14px 0 8px;font-size:28px;line-height:1.22;font-weight:800;">LMS modern untuk {{school_name}}</h1>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#cbd5e1;">Kelola pembelajaran, ujian, presensi, dan laporan sekolah dalam satu platform digital yang mudah digunakan.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 32px;">
                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#334155;">Yth. Bapak/Ibu Pimpinan<br><strong>{{school_name}}</strong></p>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#334155;">Perkenalkan, saya <strong>Alen Prastya</strong>, Founder dari <strong>Bitwize Digital Platform</strong>. Kami mengembangkan Learning Management System (LMS) untuk membantu sekolah mengelola kegiatan pembelajaran secara digital, terintegrasi, dan efisien.</p>
                <div style="margin:24px 0;padding:20px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
                  <div style="font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#0284c7;margin-bottom:14px;">Fitur Unggulan</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Manajemen materi pembelajaran</td>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Tugas dan penilaian online</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ CBT anti curang</td>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Bank soal dengan bantuan AI</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Presensi Face Recognition</td>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Laporan otomatis ke orang tua</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Kalender dan pengumuman sekolah</td>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Dashboard guru, siswa, admin</td>
                    </tr>
                  </table>
                </div>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#334155;">Sistem ini dirancang agar mudah digunakan oleh guru dan siswa, serta membantu {{school_name}} meningkatkan efektivitas proses belajar mengajar dan mempercepat transformasi digital di lingkungan pendidikan.</p>
                <div style="margin:26px 0;text-align:center;">
                  <a href="https://demo.idschoolsystem.com" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:14px 22px;border-radius:12px;margin:4px;">Coba Demo Online</a>
                  <a href="https://wa.me/6285719578195" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:14px 22px;border-radius:12px;margin:4px;">Hubungi Founder via WhatsApp</a>
                </div>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#334155;">Melalui demo tersebut, Bapak/Ibu dapat melihat langsung alur manajemen pembelajaran, CBT anti curang, presensi berbasis Face Recognition, laporan orang tua, dan AI Assistant untuk membantu guru membuat materi serta soal.</p>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:#334155;">Kami juga siap menjadwalkan presentasi singkat sesuai waktu yang tersedia. Bapak/Ibu dapat menghubungi Founder melalui WhatsApp <a href="https://wa.me/6285719578195" style="color:#16a34a;text-decoration:none;font-weight:800;">085719578195</a>.</p>
                <div style="border-top:1px solid #e2e8f0;padding-top:20px;">
                  <p style="margin:0;font-size:15px;line-height:1.65;color:#334155;">Hormat kami,<br><strong>Alen Prastya</strong><br>Founder<br>Bitwize Digital Platform</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;padding:18px 32px;text-align:center;font-size:12px;line-height:1.6;color:#64748b;">
                Demo online: <a href="https://demo.idschoolsystem.com" style="color:#0284c7;text-decoration:none;font-weight:700;">demo.idschoolsystem.com</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const createRecipient = (data = {}) => ({
  id: recipientId++,
  school_name: data.school_name || "",
  email: data.email || "",
  source: data.source || "",
  source_id: data.source_id || null,
});

const form = reactive({
  reply_to: "",
  subject: DEFAULT_SUBJECT,
  body: DEFAULT_BODY,
  send_as_html: true,
});

const API_BASE_URL = (process.env.VUE_APP_API_BASE_URL || "https://alentest.my.id/school/api").replace(/\/$/, "");

const recipients = ref([createRecipient()]);
const recipientTab = ref("schools");
const isPreviewingProposal = ref(false);
const bulkInput = ref("");
const isSending = ref(false);
const isSendingTestEmail = ref(false);
const isDownloadingTemplate = ref(false);
const isImportingRecipients = ref(false);
const isLoadingSchoolContacts = ref(false);
const isLoadingOfferStatuses = ref(false);
const showSendConfirmModal = ref(false);
const showTemplateModal = ref(false);
const sendSummary = ref(null);
const sendResults = ref([]);
const schoolContacts = ref([]);
const schoolContactSearch = ref("");
const selectedSchoolContactIds = ref(new Set());
const emailOfferStatuses = ref({});
const testEmail = ref("");
const savingSchoolEmailId = ref(null);
const editingSchoolEmail = reactive({
  id: null,
  email: "",
});

const textValue = (value) => String(value ?? "").trim();
const normalizeEmail = (value) => textValue(value).toLowerCase();

const AVATAR_PALETTE = [
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200",
];

const schoolInitials = (name) => {
  const parts = textValue(name).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
};

const avatarClass = (name) => {
  const key = textValue(name);
  let sum = 0;
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i);
  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
};

const filteredSchoolContacts = computed(() => {
  const keyword = schoolContactSearch.value.toLowerCase();
  const rows = schoolContacts.value;
  if (!keyword) return rows;
  return rows.filter((item) =>
    `${item.name || ""} ${item.email || ""} ${item.full_address || ""} ${item.province || ""} ${item.city || ""} ${item.district || ""}`
      .toLowerCase()
      .includes(keyword)
  );
});

const SCHOOL_CONTACTS_PER_PAGE = 8;
const schoolContactPage = ref(1);

const schoolContactTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredSchoolContacts.value.length / SCHOOL_CONTACTS_PER_PAGE))
);

const paginatedSchoolContacts = computed(() => {
  const start = (schoolContactPage.value - 1) * SCHOOL_CONTACTS_PER_PAGE;
  return filteredSchoolContacts.value.slice(start, start + SCHOOL_CONTACTS_PER_PAGE);
});

const schoolContactRangeLabel = computed(() => {
  const total = filteredSchoolContacts.value.length;
  if (total === 0) return "0 sekolah";
  const start = (schoolContactPage.value - 1) * SCHOOL_CONTACTS_PER_PAGE + 1;
  const end = Math.min(start + SCHOOL_CONTACTS_PER_PAGE - 1, total);
  return `${start}–${end} dari ${total} sekolah`;
});

const schoolContactPageItems = computed(() => {
  const total = schoolContactTotalPages.value;
  const current = schoolContactPage.value;
  const wanted = [1, 2, current - 1, current, current + 1, total - 1, total]
    .filter((page) => page >= 1 && page <= total);
  const unique = [...new Set(wanted)].sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  unique.forEach((page) => {
    if (prev && page - prev > 1) result.push("...");
    result.push(page);
    prev = page;
  });
  return result;
});

const goToSchoolContactPage = (page) => {
  schoolContactPage.value = Math.max(1, Math.min(Number(page || 1), schoolContactTotalPages.value));
};

watch(schoolContactSearch, () => {
  schoolContactPage.value = 1;
});

watch(schoolContactTotalPages, (totalPages) => {
  if (schoolContactPage.value > totalPages) schoolContactPage.value = totalPages;
});

const visibleSchoolContactsWithEmail = computed(() =>
  filteredSchoolContacts.value.filter((item) => textValue(item.email))
);

const selectableVisibleSchoolContacts = computed(() =>
  visibleSchoolContactsWithEmail.value.filter((item) => isSchoolContactSelectable(item))
);

const selectedSchoolContactCount = computed(() => selectedSchoolContactIds.value.size);

const schoolStats = computed(() => {
  let withEmail = 0;
  let sent = 0;
  schoolContacts.value.forEach((item) => {
    if (textValue(item.email)) {
      withEmail += 1;
      if (getEmailOfferStatus(item.email).sent) sent += 1;
    }
  });
  const total = schoolContacts.value.length;
  return {
    total,
    withEmail,
    noEmail: total - withEmail,
    sent,
    unsent: withEmail - sent,
  };
});

const areAllVisibleSchoolContactsSelected = computed(() => {
  const visible = selectableVisibleSchoolContacts.value;
  return visible.length > 0 && visible.every((item) => selectedSchoolContactIds.value.has(item.id));
});

const isSomeVisibleSchoolContactsSelected = computed(() => {
  const visible = selectableVisibleSchoolContacts.value;
  return visible.some((item) => selectedSchoolContactIds.value.has(item.id)) && !areAllVisibleSchoolContactsSelected.value;
});

const validRecipients = computed(() =>
  recipients.value
    .map((item) => ({
      school_name: String(item.school_name || "").trim(),
      email: String(item.email || "").trim(),
    }))
    .filter((item) => item.email && !getEmailOfferStatus(item.email).sent)
);

const validRecipientCount = computed(() => validRecipients.value.length);

const previewRecipient = computed(() => validRecipients.value[0] || {
  school_name: "Nama Sekolah",
  email: "email@sekolah.sch.id",
});

const renderTemplate = (template, recipient) => {
  const values = {
    school_name: recipient.school_name || "Nama Sekolah",
  };
  return Object.entries(values).reduce((result, [key, value]) => {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    return result.replace(pattern, value);
  }, template || "");
};

const previewSubject = computed(() => renderTemplate(form.subject, previewRecipient.value));
const previewBody = computed(() => renderTemplate(form.body, previewRecipient.value));

const useDefaultTemplate = () => {
  form.subject = DEFAULT_SUBJECT;
  form.body = DEFAULT_BODY;
  form.send_as_html = true;
};

const openTemplateModal = () => {
  showTemplateModal.value = true;
};

const closeTemplateModal = () => {
  showTemplateModal.value = false;
};

const addRecipient = () => {
  recipients.value.push(createRecipient());
};

const removeRecipient = (index) => {
  if (recipients.value.length <= 1) return;
  const recipient = recipients.value[index];
  recipients.value.splice(index, 1);
  if (recipient?.source === "school_visit_target" && recipient.source_id) {
    const next = new Set(selectedSchoolContactIds.value);
    next.delete(recipient.source_id);
    selectedSchoolContactIds.value = next;
  }
};

const parseBulkLine = (line) => {
  const trimmed = String(line || "").trim();
  if (!trimmed) return null;

  const angleMatch = trimmed.match(/^(.*?)<([^>]+)>$/);
  if (angleMatch) {
    return createRecipient({
      school_name: angleMatch[1].trim().replace(/,$/, ""),
      email: angleMatch[2].trim(),
    });
  }

  const parts = trimmed.split(/[;,]/).map((item) => item.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return createRecipient({ school_name: parts[0], email: parts[2] });
  }
  if (parts.length === 2) {
    return createRecipient({ school_name: parts[0], email: parts[1] });
  }
  return createRecipient({ email: trimmed });
};

const appendRecipients = (items) => {
  const existingEmails = new Set(recipients.value.map((item) => normalizeEmail(item.email)).filter(Boolean));
  const parsed = [];

  items.forEach((item) => {
    const email = textValue(item?.email);
    if (!email) return;
    const key = email.toLowerCase();
    if (existingEmails.has(key)) return;
    existingEmails.add(key);
    parsed.push(createRecipient({
      school_name: textValue(item?.school_name || item?.name),
      email,
      source: item?.source || "",
      source_id: item?.source_id || null,
    }));
  });

  if (parsed.length === 0) return 0;

  const currentEmptyOnly = recipients.value.length === 1 && !recipients.value[0].email && !recipients.value[0].school_name;
  recipients.value = currentEmptyOnly ? parsed : [...recipients.value, ...parsed];
  return parsed.length;
};

const applyBulkInput = () => {
  const parsed = bulkInput.value
    .split(/\n+/)
    .map(parseBulkLine)
    .filter(Boolean);

  if (parsed.length === 0) {
    return;
  }

  appendRecipients(parsed);
  bulkInput.value = "";
};

const loadSchoolContacts = async () => {
  isLoadingSchoolContacts.value = true;
  try {
    const rows = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await api.get("/school-visit-targets", {
        params: {
          page,
          limit: 100,
        },
      });
      const payload = response?.data || {};
      const items = Array.isArray(payload.items) ? payload.items : [];
      rows.push(...items);
      totalPages = Number(payload.totalPages || 1);
      page += 1;
    } while (page <= totalPages);

    schoolContacts.value = rows.map((item) => ({
      id: item.id,
      name: textValue(item.name),
      email: textValue(item.email),
      wakur: textValue(item.wakur),
      kepsek: textValue(item.kepsek),
      full_address: textValue(item.full_address),
      province: textValue(item.province),
      city: textValue(item.city),
      district: textValue(item.district),
      is_planned: item.is_planned === true,
      planned_at: item.planned_at || null,
      is_visited: item.is_visited === true,
      visited_at: item.visited_at || null,
      created_at: item.created_at || null,
    }));
    const availableIds = new Set(schoolContacts.value.map((item) => item.id));
    selectedSchoolContactIds.value = new Set([...selectedSchoolContactIds.value].filter((id) => availableIds.has(id)));
    await loadEmailOfferStatuses();
    syncSelectedSchoolRecipients();
  } catch (error) {
    pushToast({
      title: "Gagal Memuat List Sekolah",
      message: error.message || "Data sekolah tidak berhasil dimuat.",
      type: "error",
    });
  } finally {
    isLoadingSchoolContacts.value = false;
  }
};

const isSchoolContactSelected = (id) => selectedSchoolContactIds.value.has(id);

const startEditSchoolEmail = (item) => {
  editingSchoolEmail.id = item.id;
  editingSchoolEmail.email = item.email || "";
};

const cancelEditSchoolEmail = () => {
  editingSchoolEmail.id = null;
  editingSchoolEmail.email = "";
};

const saveSchoolEmail = async (item) => {
  if (!item?.id || savingSchoolEmailId.value) return;
  const nextEmail = textValue(editingSchoolEmail.email);
  savingSchoolEmailId.value = item.id;
  try {
    const response = await api.put(`/school-visit-targets/${item.id}`, {
      email: nextEmail || "",
    }, { silentLoading: true });
    const updated = response?.data || {};
    const normalizedEmail = textValue(updated.email ?? nextEmail);
    const row = schoolContacts.value.find((school) => school.id === item.id);
    if (row) {
      row.email = normalizedEmail;
    }
    if (!normalizedEmail) {
      const next = new Set(selectedSchoolContactIds.value);
      next.delete(item.id);
      selectedSchoolContactIds.value = next;
    }
    cancelEditSchoolEmail();
    await loadEmailOfferStatuses();
    syncSelectedSchoolRecipients();
    pushToast({
      title: "Email Sekolah Disimpan",
      message: `${item.name || "Sekolah"} berhasil diperbarui.`,
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Menyimpan Email",
      message: error.message || "Email sekolah tidak berhasil diperbarui.",
      type: "error",
    });
  } finally {
    savingSchoolEmailId.value = null;
  }
};

const getEmailOfferStatus = (email) => {
  const key = normalizeEmail(email);
  return emailOfferStatuses.value[key] || { sent: false, status: "Belum dikirim" };
};

const isSchoolContactSelectable = (item) => Boolean(textValue(item.email)) && !getEmailOfferStatus(item.email).sent;

const applyEmailOfferStatus = (email, patch) => {
  const key = normalizeEmail(email);
  if (!key) return;
  emailOfferStatuses.value = {
    ...emailOfferStatuses.value,
    [key]: {
      ...(emailOfferStatuses.value[key] || { email: key, sent: false, status: "Belum dikirim" }),
      ...patch,
    },
  };
};

const loadEmailOfferStatuses = async () => {
  const emails = [...new Set(schoolContacts.value.map((item) => normalizeEmail(item.email)).filter(Boolean))];
  if (emails.length === 0) {
    emailOfferStatuses.value = {};
    return;
  }

  isLoadingOfferStatuses.value = true;
  try {
    const next = {};
    for (let index = 0; index < emails.length; index += 100) {
      const chunk = emails.slice(index, index + 100);
      const response = await api.get("/super-admin/marketing/email-offers/status", {
        params: { emails: chunk.join(",") },
        silentLoading: true,
      });
      const items = Array.isArray(response?.data?.items) ? response.data.items : [];
      items.forEach((item) => {
        const key = normalizeEmail(item.email);
        if (!key) return;
        next[key] = {
          email: key,
          sent: item.sent === true,
          status: item.status || (item.sent ? "Penawaran terkirim" : "Belum dikirim"),
          last_sent_at: item.last_sent_at || "",
          source: item.source || "",
        };
      });
    }
    emailOfferStatuses.value = next;
    selectedSchoolContactIds.value = new Set(
      [...selectedSchoolContactIds.value].filter((id) => {
        const item = schoolContacts.value.find((school) => school.id === id);
        return item && isSchoolContactSelectable(item);
      })
    );
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Status Email",
      message: error.message || "Status penawaran belum berhasil dimuat.",
      type: "warning",
    });
  } finally {
    isLoadingOfferStatuses.value = false;
  }
};

const syncSelectedSchoolRecipients = () => {
  const selectedIds = selectedSchoolContactIds.value;
  const selectedContacts = schoolContacts.value.filter((item) => selectedIds.has(item.id) && isSchoolContactSelectable(item));
  const nonSchoolRecipients = recipients.value.filter((item) => item.source !== "school_visit_target" && (item.email || item.school_name));
  const existingEmails = new Set(nonSchoolRecipients.map((item) => normalizeEmail(item.email)).filter(Boolean));
  const selectedRecipients = selectedContacts
    .filter((item) => {
      const key = normalizeEmail(item.email);
      if (!key || existingEmails.has(key)) return false;
      existingEmails.add(key);
      return true;
    })
    .map((item) =>
      createRecipient({
        school_name: item.name,
        email: item.email,
        source: "school_visit_target",
        source_id: item.id,
      })
    );

  recipients.value = nonSchoolRecipients.length || selectedRecipients.length
    ? [...nonSchoolRecipients, ...selectedRecipients]
    : [createRecipient()];
};

const toggleSchoolContactSelection = (item, checked) => {
  if (checked && !textValue(item.email)) {
    pushToast({ title: "Email Kosong", message: "Sekolah ini belum memiliki email.", type: "warning" });
    return;
  }
  if (checked && getEmailOfferStatus(item.email).sent) {
    pushToast({ title: "Sudah Terkirim", message: "Penawaran sudah pernah terkirim ke email ini.", type: "warning" });
    return;
  }

  const next = new Set(selectedSchoolContactIds.value);
  if (checked) {
    next.add(item.id);
  } else {
    next.delete(item.id);
  }
  selectedSchoolContactIds.value = next;
  syncSelectedSchoolRecipients();
};

const toggleAllVisibleSchoolContacts = (event) => {
  const checked = event?.target?.checked === true;
  const next = new Set(selectedSchoolContactIds.value);
  selectableVisibleSchoolContacts.value.forEach((item) => {
    if (checked) {
      next.add(item.id);
    } else {
      next.delete(item.id);
    }
  });
  selectedSchoolContactIds.value = next;
  syncSelectedSchoolRecipients();
};

const clearSelectedSchoolContacts = () => {
  selectedSchoolContactIds.value = new Set();
  syncSelectedSchoolRecipients();
};

const marketingStatusLabel = (item) => {
  if (!textValue(item.email)) return "Email belum diisi";
  const status = getEmailOfferStatus(item.email);
  return status.sent ? "Penawaran terkirim" : "Belum dikirim";
};

const marketingStatusClass = (item) => {
  if (!textValue(item.email)) {
    return "bg-slate-50 text-slate-500 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
  }
  if (getEmailOfferStatus(item.email).sent) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20";
  }
  return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20";
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const downloadRecipientTemplate = async () => {
  isDownloadingTemplate.value = true;
  try {
    await downloadExcelWorksheet({
      filename: "template-upload-list-sekolah.xlsx",
      sheetName: "List Sekolah",
      title: "Template Upload List Sekolah",
      subtitle: "Isi kolom Nama Sekolah dan Email untuk menambah atau memperbarui list sekolah.",
      columns: [
        { key: "school_name", label: "Nama Sekolah" },
        { key: "email", label: "Email" },
      ],
      rows: [
        { school_name: "SMA Contoh Nusantara", email: "info@sma-contoh.sch.id" },
        { school_name: "SMK Contoh Mandiri", email: "admin@smk-contoh.sch.id" },
      ],
    });
  } catch (error) {
    pushToast({
      title: "Template Gagal Dibuat",
      message: error.message || "File template Excel tidak berhasil dibuat.",
      type: "error",
    });
  } finally {
    isDownloadingTemplate.value = false;
  }
};

const normalizeHeader = (value) =>
  textValue(value)
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

const findHeaderIndex = (rows) =>
  rows.findIndex((row) => {
    const headers = row.map(normalizeHeader);
    const hasName = headers.some((item) => ["nama sekolah", "sekolah", "school name", "school"].includes(item));
    const hasEmail = headers.some((item) => ["email", "alamat email", "email sekolah"].includes(item));
    return hasName && hasEmail;
  });

const upsertSchoolContactsFromExcel = async (items) => {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const existingByName = new Map(
    schoolContacts.value.map((item) => [textValue(item.name).toLowerCase(), item])
  );

  for (const item of items) {
    const name = textValue(item.school_name || item.name);
    const email = textValue(item.email);
    if (!name) {
      skipped += 1;
      continue;
    }

    const existing = existingByName.get(name.toLowerCase());
    if (existing) {
      if (textValue(existing.email).toLowerCase() === email.toLowerCase()) {
        skipped += 1;
        continue;
      }
      await api.put(`/school-visit-targets/${existing.id}`, { email }, { silentLoading: true });
      existing.email = email;
      updated += 1;
      continue;
    }

    const response = await api.post("/school-visit-targets", { name, email }, { silentLoading: true });
    const createdItem = response?.data || {};
    existingByName.set(name.toLowerCase(), {
      id: createdItem.id,
      name,
      email,
    });
    created += 1;
  }

  return { created, updated, skipped };
};

const importRecipientExcel = async (event) => {
  const file = event?.target?.files?.[0];
  if (!file) return;

  isImportingRecipients.value = true;
  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    const headerIndex = findHeaderIndex(rows);
    if (headerIndex < 0) {
      throw new Error("Header Nama Sekolah dan Email tidak ditemukan.");
    }

    const headers = rows[headerIndex].map(normalizeHeader);
    const nameIndex = headers.findIndex((item) => ["nama sekolah", "sekolah", "school name", "school"].includes(item));
    const emailIndex = headers.findIndex((item) => ["email", "alamat email", "email sekolah"].includes(item));
    const parsed = rows
      .slice(headerIndex + 1)
      .map((row) => ({
        school_name: textValue(row[nameIndex]),
        email: textValue(row[emailIndex]),
      }))
      .filter((item) => item.school_name || item.email);
    if (parsed.length === 0) {
      throw new Error("Tidak ada data sekolah di file Excel.");
    }
    const result = await upsertSchoolContactsFromExcel(parsed);
    await loadSchoolContacts();
    pushToast({
      title: "Upload Sekolah Berhasil",
      message: `${result.created} sekolah dibuat, ${result.updated} email diperbarui, ${result.skipped} dilewati.`,
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Upload Sekolah Gagal",
      message: error.message || "File Excel tidak berhasil dibaca.",
      type: "error",
    });
  } finally {
    isImportingRecipients.value = false;
    if (event?.target) event.target.value = "";
  }
};

const previewProposalPdf = async () => {
  if (isPreviewingProposal.value) return;
  isPreviewingProposal.value = true;
  try {
    const schoolName = previewRecipient.value.school_name || "Nama Sekolah";
    const token = localStorage.getItem("token");
    const url = `${API_BASE_URL}/super-admin/marketing/email-offers/proposal-pdf?school_name=${encodeURIComponent(schoolName)}`;
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      throw new Error(`Server membalas status ${response.status}.`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const opened = window.open(objectUrl, "_blank");
    if (!opened) {
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `Penawaran-LMS-${schoolName}.pdf`;
      link.click();
    }
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  } catch (error) {
    pushToast({
      title: "Preview PDF Gagal",
      message: error.message || "PDF penawaran tidak dapat dibuka.",
      type: "error",
    });
  } finally {
    isPreviewingProposal.value = false;
  }
};

const sendTestEmail = async () => {
  if (!testEmail.value.trim()) {
    pushToast({ title: "Email Test Kosong", message: "Isi email tujuan test terlebih dahulu.", type: "error" });
    return;
  }
  if (!form.subject.trim() || !form.body.trim()) {
    pushToast({ title: "Template Belum Lengkap", message: "Isi subject dan body email terlebih dahulu.", type: "error" });
    return;
  }

  isSendingTestEmail.value = true;
  try {
    await api.post("/super-admin/marketing/email-offers/test", {
      to: testEmail.value,
      school_name: previewRecipient.value.school_name || "Nama Sekolah",
      subject: form.subject,
      body: form.body,
      send_as_html: form.send_as_html,
    }, { silentLoading: true });
    pushToast({
      title: "Test Email Terkirim",
      message: `Template test dikirim ke ${testEmail.value}.`,
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Test Email Gagal",
      message: error.message || "Template test tidak berhasil dikirim.",
      type: "error",
    });
  } finally {
    isSendingTestEmail.value = false;
  }
};

const resetForm = () => {
  form.reply_to = "";
  form.subject = DEFAULT_SUBJECT;
  form.body = DEFAULT_BODY;
  form.send_as_html = true;
  recipients.value = [createRecipient()];
  bulkInput.value = "";
  testEmail.value = "";
  schoolContactSearch.value = "";
  selectedSchoolContactIds.value = new Set();
  showSendConfirmModal.value = false;
  sendSummary.value = null;
  sendResults.value = [];
};

const sendEmails = async () => {
  if (!form.subject.trim() || !form.body.trim()) {
    pushToast({ title: "Template Belum Lengkap", message: "Isi subject dan body email terlebih dahulu.", type: "error" });
    openTemplateModal();
    return;
  }
  if (validRecipients.value.length === 0) {
    pushToast({ title: "Penerima Kosong", message: "Pilih minimal satu email yang belum pernah dikirimi penawaran.", type: "error" });
    return;
  }
  showSendConfirmModal.value = true;
};

const closeSendConfirmModal = () => {
  if (isSending.value) {
    return;
  }
  showSendConfirmModal.value = false;
};

const confirmSendEmails = async () => {
  if (validRecipients.value.length === 0) {
    showSendConfirmModal.value = false;
    pushToast({ title: "Penerima Kosong", message: "Isi minimal satu email penerima.", type: "error" });
    return;
  }
  isSending.value = true;
  sendSummary.value = null;
  sendResults.value = [];
  try {
    const response = await api.post("/super-admin/marketing/email-offers", {
      reply_to: form.reply_to,
      subject: form.subject,
      body: form.body,
      send_as_html: form.send_as_html,
      recipients: validRecipients.value,
    });
    sendSummary.value = response?.data || {};
    sendResults.value = Array.isArray(response?.data?.results) ? response.data.results : [];
    sendResults.value.forEach((item) => {
      if (item.success || item.skipped) {
        applyEmailOfferStatus(item.email, {
          sent: true,
          status: "Penawaran terkirim",
          last_sent_at: sendSummary.value.generated_at || new Date().toISOString(),
          source: item.skipped ? "history" : "brevo",
        });
      }
    });
    selectedSchoolContactIds.value = new Set(
      [...selectedSchoolContactIds.value].filter((id) => {
        const item = schoolContacts.value.find((school) => school.id === id);
        return item && isSchoolContactSelectable(item);
      })
    );
    syncSelectedSchoolRecipients();
    pushToast({
      title: "Pengiriman Diproses",
      message: `${sendSummary.value.success_count || 0} sukses, ${sendSummary.value.skipped_count || 0} dilewati, ${sendSummary.value.failed_count || 0} gagal.`,
      type: (sendSummary.value.failed_count || 0) > 0 ? "warning" : "success",
    });
    showSendConfirmModal.value = false;
  } catch (error) {
    sendResults.value = Array.isArray(error?.payload?.data?.results) ? error.payload.data.results : [];
    pushToast({
      title: "Gagal Mengirim Email",
      message: error.message || "Pengiriman email tidak berhasil.",
      type: "error",
    });
  } finally {
    isSending.value = false;
  }
};

useDefaultTemplate();
onMounted(loadSchoolContacts);
</script>
