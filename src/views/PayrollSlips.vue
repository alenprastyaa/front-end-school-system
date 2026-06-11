<template>
  <div class="min-h-screen bg-[#f7f9fc] text-slate-700 font-sans">

    <!-- Header -->
    <div class="border-b border-slate-200 bg-white px-5 py-2.5">
      <div class="mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
            <Icon icon="mdi:file-document-outline" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">Bendahara · Penggajian</p>
            <h1 class="mt-0.5 text-[22px] font-extrabold leading-none tracking-tight text-slate-900">Daftar Slip Guru</h1>
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <input v-model="selectedPeriod" type="month"
            class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
          <button @click="reloadOverview" :disabled="isLoading"
            class="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-3.5 text-[13px] font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:opacity-40">
            <Icon icon="mdi:chart-box-outline" class="h-3.5 w-3.5" />
            {{ isLoading ? "Memuat…" : "Tampilkan" }}
          </button>
        </div>
      </div>
    </div>

    <div class="mx-auto space-y-5 px-5 py-6">

      <!-- Ringkasan -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Icon icon="mdi:account-group-outline" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-medium text-slate-500">Total Guru</p>
            <p class="mt-0.5 text-[20px] font-extrabold leading-none text-slate-900">{{ teachers.length }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Icon icon="mdi:check-circle-outline" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-medium text-slate-500">Sudah Dibayar</p>
            <p class="mt-0.5 text-[20px] font-extrabold leading-none text-slate-900">{{ paidCount }}</p>
            <p class="mt-1 text-[10px] font-semibold text-emerald-600">{{ formatCurrency(paidAmount) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-500">
            <Icon icon="mdi:clock-outline" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-medium text-slate-500">Belum Dibayar</p>
            <p class="mt-0.5 text-[20px] font-extrabold leading-none text-slate-900">{{ unpaidCount }}</p>
            <p class="mt-1 text-[10px] font-semibold text-amber-500">{{ formatCurrency(unpaidAmount) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Icon icon="mdi:wallet-outline" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-medium text-slate-500">Total Periode</p>
            <p class="mt-0.5 text-[18px] font-extrabold leading-tight text-slate-900">{{ formatCurrency(totalPayrollAmount) }}</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
          <label class="flex-1">
            <span class="mb-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Search</span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Cari guru, username, atau status..."
              class="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              @keyup.enter="applySearch" />
          </label>
          <div class="sm:w-40">
            <span class="mb-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Limit</span>
            <select
              v-model.number="limit"
              @change="changeLimit"
              class="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300">
              <option :value="10">10 / halaman</option>
              <option :value="25">25 / halaman</option>
              <option :value="50">50 / halaman</option>
            </select>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="resetFilters"
            class="h-9 rounded-xl border border-slate-200 px-3.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50">
            Reset
          </button>
          <button
            type="button"
            @click="applySearch"
            class="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-3.5 text-[13px] font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800">
            <Icon icon="mdi:magnify" class="h-3.5 w-3.5" />
            Cari
          </button>
        </div>
      </div>

      <!-- Aksi & Progress -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <button @click="generateAllSlips" :disabled="isGeneratingSlips || teachers.length === 0"
          class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:opacity-40">
          <Icon icon="mdi:file-document-multiple-outline" class="h-3.5 w-3.5" />
          {{ isGeneratingSlips ? "Generate…" : "Generate Semua Slip" }}
        </button>
        <div v-if="teachers.length > 0" class="flex flex-1 items-center gap-3">
          <div class="flex-1 h-1 rounded-full bg-slate-100">
            <div class="h-1 rounded-full bg-slate-900 transition-all duration-500"
              :style="{ width: `${(paidCount / teachers.length) * 100}%` }"></div>
          </div>
          <span class="shrink-0 text-xs font-medium text-slate-500">{{ paidCount }}/{{ teachers.length }}
            lunas</span>
        </div>
      </div>

      <!-- Tabel Slip Guru -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-[980px] w-full text-left text-[13px]">
            <thead class="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th class="px-5 py-3">Lunas</th>
                <th class="px-5 py-3">Guru</th>
                <th class="px-4 py-3">JP</th>
                <th class="px-4 py-3">Transport</th>
                <th class="px-4 py-3">Tunjangan</th>
                <th class="px-4 py-3">Total Gaji</th>
                <th class="px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <template v-if="isLoading && !teachers.length">
                <tr v-for="n in 6" :key="`slip-sk-${n}`">
                  <td v-for="c in 5" :key="`slip-sk-${n}-${c}`" class="px-4 py-4">
                    <div class="skeleton-shimmer h-4 rounded" :class="c === 1 ? 'w-40' : 'w-16'"></div>
                  </td>
                </tr>
              </template>
              <template v-for="teacher in teachers" :key="teacher.teacher_id">
                <tr
                  class="cursor-pointer align-middle text-slate-700 transition hover:bg-slate-50/70"
                  :class="isSlipDetailOpen(teacher) ? 'bg-slate-50/80' : ''"
                  @click="toggleSlipDetail(teacher)">
                  <td class="px-5 py-4">
                    <label class="inline-flex items-center">
                      <input
                        type="checkbox"
                        class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        :checked="teacher.status === 'PAID'"
                        :aria-label="teacher.status === 'PAID' ? 'Sudah lunas' : 'Belum lunas'"
                        @click.stop.prevent="openStatusConfirm(teacher)" />
                    </label>
                  </td>
                  <td class="px-5 py-4">
                    <div class="min-w-0">
                      <p class="font-semibold text-slate-900">{{ teacher.teacher_name }}</p>
                      <p v-if="teacher.username" class="mt-0.5 text-[11px] text-slate-400">{{ teacher.username }}</p>
                      <p v-if="teacher.items_source === 'previous'" class="mt-1 text-[10px] font-semibold text-sky-600">
                        Komponen dari bulan sebelumnya
                      </p>
                    </div>
                  </td>
                  <td class="px-4 py-4 font-semibold text-slate-800">
                    {{ numberLabel(teacher.teaching_hours) }} JP
                  </td>
                  <td class="px-4 py-4 font-semibold text-slate-800">
                    {{ transportTotal(teacher) > 0 ? formatCurrency(transportTotal(teacher)) : "-" }}
                  </td>
                  <td class="px-4 py-4 text-slate-700">
                    {{ componentCountLabel(teacher) }}
                  </td>
                  <td class="px-4 py-4 font-bold text-slate-900">
                    {{ formatCurrency(calculatedRowTotal(teacher)) }}
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex gap-2">
                      <button type="button" @click.stop="toggleSlipDetail(teacher)"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                        <Icon icon="mdi:eye-outline" class="h-4 w-4" />
                        Detail
                      </button>
                      <button type="button" @click.stop="openSlipModal(teacher)"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                        <Icon icon="mdi:pencil-outline" class="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="!isLoading && teachers.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-sm text-slate-400">
                  Belum ada data guru untuk periode ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-slate-500">
          Menampilkan {{ paginationStart }}-{{ paginationEnd }} dari {{ totalTeachersCount }} guru
        </p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1 || isLoading"
            class="inline-flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
            <Icon icon="mdi:arrow-left" class="h-4 w-4" />
            Prev
          </button>
          <span class="px-2 text-sm font-semibold text-slate-700">
            Page {{ currentPage }} / {{ totalPagesCount }}
          </span>
          <button
            type="button"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPagesCount || isLoading"
            class="inline-flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
            Next
            <Icon icon="mdi:arrow-right" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="openedSlipDetailTeacher"
          class="fixed inset-0 z-[320] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          @click.self="openedSlipDetailTeacherId = null">
          <div
            class="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
            <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div class="min-w-0">
                <p class="truncate text-lg font-semibold text-slate-900 sm:text-xl">{{ openedSlipDetailTeacher.teacher_name }}</p>
                <p class="mt-1 text-xs text-slate-400">{{ periodLabel }}</p>
              </div>
              <button type="button" @click="openedSlipDetailTeacherId = null"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                title="Tutup">
                <Icon icon="mdi:close" class="h-5 w-5" />
              </button>
              <button type="button" @click="printSlipDetail(openedSlipDetailTeacher)"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                title="Print">
                <Icon icon="mdi:printer" class="h-5 w-5" />
              </button>
            </div>
            <div class="max-h-[75vh] overflow-auto p-5 sm:p-6">
              <pre class="slip-detail-pre whitespace-pre-wrap font-mono text-sm leading-7 text-slate-800 sm:text-[15px]">{{ slipDetailText(openedSlipDetailTeacher) }}</pre>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="statusConfirmModalOpen"
          class="fixed inset-0 z-[330] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          @click.self="closeStatusConfirm">
          <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Konfirmasi Status</p>
                <h3 class="mt-1 text-lg font-bold text-slate-900">{{ statusConfirmTitle }}</h3>
              </div>
              <button type="button" @click="closeStatusConfirm"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                :disabled="statusConfirmBusy">
                <Icon icon="mdi:close" class="h-5 w-5" />
              </button>
            </div>

            <p class="mt-4 text-sm leading-6 text-slate-600">{{ statusConfirmDescription }}</p>

            <div class="mt-6 flex justify-end gap-2">
              <button type="button" @click="closeStatusConfirm"
                class="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                :disabled="statusConfirmBusy">
                Batal
              </button>
              <button type="button" @click="confirmStatusChange"
                class="h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
                :disabled="statusConfirmBusy">
                {{ statusConfirmBusy ? "Memproses..." : statusConfirmActionLabel }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Kelola Slip -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="slipModalOpen"
          class="fixed inset-0 z-[300] flex items-end justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          @click.self="slipModalOpen = false">
          <form @submit.prevent="saveSlip"
            class="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl sm:max-h-[calc(100dvh-3rem)] dark:border-slate-700 dark:bg-slate-900">

            <div
              class="flex flex-shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p class="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Slip Gaji</p>
                <p class="mt-1 text-lg font-bold leading-tight text-slate-900 dark:text-slate-100">{{ slipForm.teacher_name }}</p>
                <p class="text-xs text-slate-400">{{ periodLabel }}</p>
              </div>
              <button type="button" @click="slipModalOpen = false"
                class="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                ×
              </button>
            </div>

            <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">

              <!-- Gaji Pokok -->
              <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Gaji Pokok</p>
                <div class="grid gap-3 sm:grid-cols-2">
                  <label class="block">
                    <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Jam Mengajar (JP)</span>
                    <input v-model.number="slipForm.teaching_hours" type="number" min="0" step="0.25"
                      class="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
                  </label>
                  <label class="block">
                    <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Tarif per JP</span>
                    <input :value="formatRupiahInput(slipForm.hourly_rate)" type="text" inputmode="numeric"
                      @input="slipForm.hourly_rate = parseRupiahInput($event.target.value)"
                      class="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
                  </label>
                </div>
                <div
                  class="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
                  <span class="text-slate-400 text-xs">Gaji pokok dihitung</span>
                  <span class="text-base font-bold text-slate-900 dark:text-slate-100">{{ formatCurrency(slipBaseAmount)
                    }}</span>
                </div>
              </section>

              <!-- Komponen -->
              <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p class="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Tunjangan & Potongan</p>
                  <select @change="addComponentToSlip($event)"
                    class="h-10 min-w-40 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <option value="">+ Tambah</option>
                    <option v-for="c in activeComponents" :key="c.id" :value="c.id">{{ c.name }}</option>
                    <option value="__custom">Input manual</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <div v-for="(item, index) in slipForm.items" :key="`${item.component_id || 'c'}-${index}`"
                    class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div
                      class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50">
                      <span class="text-[10px] font-semibold uppercase tracking-wide"
                        :class="item.component_type === 'DEDUCTION' ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'">
                        {{ item.component_type === "DEDUCTION" ? "− Potongan" : "+ Tunjangan" }}
                      </span>
                      <div class="flex items-center gap-3">
                        <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {{ item.component_type === "DEDUCTION" ? "−" : "+" }}{{ formatCurrency(itemTotal(item)) }}
                        </span>
                        <button type="button" @click="slipForm.items.splice(index, 1)"
                          class="flex h-7 w-7 items-center justify-center rounded-md text-lg leading-none text-slate-300 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">×</button>
                      </div>
                    </div>
                    <div class="grid gap-3 p-3 sm:grid-cols-[minmax(180px,1fr),145px,90px,140px]">
                      <label class="block">
                        <span class="mb-1 block h-4 text-[9px] font-semibold text-transparent">Nama</span>
                        <input v-model="item.name" type="text" placeholder="Nama"
                          class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                      </label>
                      <label class="block">
                        <span class="mb-1 block h-4 text-[9px] font-semibold text-transparent">Jenis</span>
                        <select v-model="item.component_type"
                          class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                          <option value="ALLOWANCE">Tambahan</option>
                          <option value="DEDUCTION">Potongan</option>
                        </select>
                      </label>
                      <label class="block">
                        <span class="mb-1 block h-4 text-[9px] font-semibold text-slate-400">{{ item.calculation_type === "DAILY" ? "Hari" : "Qty" }}</span>
                        <input v-model.number="item.quantity" type="number" min="0" step="0.25"
                          class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                      </label>
                      <label class="block">
                        <span class="mb-1 block h-4 text-[9px] font-semibold text-slate-400">{{ item.calculation_type === "DAILY" ? "Per hari" : "Nominal" }}</span>
                        <input :value="formatRupiahInput(item.unit_amount)" type="text" inputmode="numeric"
                          @input="item.unit_amount = parseRupiahInput($event.target.value)"
                          class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                      </label>
                    </div>
                  </div>
                  <div v-if="slipForm.items.length === 0"
                    class="rounded-lg border border-dashed border-slate-200 dark:border-slate-700 py-6 text-center">
                    <p class="text-xs text-slate-400">Belum ada komponen. Pilih dari dropdown di atas.</p>
                  </div>
                </div>
              </section>

              <!-- Catatan -->
              <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p class="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-2">Catatan</p>
                <textarea v-model="slipForm.note" rows="2" placeholder="Keterangan tambahan (opsional)…"
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"></textarea>
              </section>

              <!-- Ringkasan -->
              <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <div class="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <p class="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Ringkasan</p>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  <div class="flex justify-between px-4 py-2.5 text-slate-500 dark:text-slate-400">
                    <span>Gaji pokok ({{ numberLabel(slipForm.teaching_hours) }} JP)</span>
                    <span>{{ formatCurrency(slipBaseAmount) }}</span>
                  </div>
                  <div v-if="slipAllowances > 0"
                    class="flex justify-between px-4 py-2.5 text-slate-500 dark:text-slate-400">
                    <span>Tunjangan</span>
                    <span>+ {{ formatCurrency(slipAllowances) }}</span>
                  </div>
                  <div v-if="slipDeductions > 0"
                    class="flex justify-between px-4 py-2.5 text-red-500 dark:text-red-400">
                    <span>Potongan</span>
                    <span>− {{ formatCurrency(slipDeductions) }}</span>
                  </div>
                  <div
                    class="flex justify-between px-4 py-3 font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/30">
                    <span>Total Dibayarkan</span>
                    <span class="text-base">{{ formatCurrency(slipTotal) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-shrink-0 justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <button type="button" @click="slipModalOpen = false"
                class="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Batal
              </button>
              <button type="submit" :disabled="isSavingSlip"
                class="h-10 rounded-lg bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900">
                {{ isSavingSlip ? "Menyimpan…" : "Simpan Slip" }}
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </Teleport>
    <SuccessModal ref="successModal" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import SuccessModal from "@/components/SuccessModal.vue";
import { pushToast } from "@/composables/useToast";
import { Icon } from "@iconify/vue";
import { usePayrollStore } from "@/store/payroll";

const payrollStore = usePayrollStore();
const {
  selectedPeriod,
  searchQuery,
  appliedSearchQuery,
  currentPage,
  limit,
  totalTeachersCount,
  totalPagesCount,
  isLoading,
  isSavingSlip,
  isGeneratingSlips,
  teachers,
  components,
  teachingHoursMultiplier,
  openedSlipDetailTeacherId,
  statusConfirmModalOpen,
  statusConfirmTeacher,
  statusConfirmTarget,
  statusConfirmBusy,
  slipModalOpen,
  slipForm,
  activeComponents,
  paginationStart,
  paginationEnd,
  paidCount,
  unpaidCount,
  paidAmount,
  unpaidAmount,
  totalPayrollAmount,
  openedSlipDetailTeacher,
  statusConfirmTitle,
  statusConfirmDescription,
  statusConfirmActionLabel,
  slipBaseAmount,
  slipAllowances,
  slipDeductions,
  slipTotal,
  payrollPeriodLabel,
} = storeToRefs(payrollStore);

const successModal = ref(null);
const periodLabel = payrollPeriodLabel;

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));

const parseRupiahInput = (value) => Number(String(value || "").replace(/[^\d]/g, "") || 0);

const formatRupiahInput = (value) => {
  const n = Number(value || 0);
  if (!n) return "";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
};

const numberLabel = (value) => {
  const n = Number(value || 0);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

const statusLabel = (status) => {
  if (status === "PAID") return "Lunas";
  if (status === "DRAFT") return "Draft";
  return "Belum dibuat";
};

const calculatedBaseAmount = (teacher) =>
  Number(teacher.base_amount || Math.round(Number(teacher.hourly_rate || 0) * Number(teacher.teaching_hours || 0)));

const calculatedRowTotal = (teacher) => {
  if (teacher.payroll_id && teacher.status === "PAID") return Number(teacher.total_amount || 0);
  const items = teacherItems(teacher);
  const allowances = items.filter((item) => item.component_type !== "DEDUCTION").reduce((sum, item) => sum + itemTotal(item), 0);
  const deductions = items.filter((item) => item.component_type === "DEDUCTION").reduce((sum, item) => sum + itemTotal(item), 0);
  return calculatedBaseAmount(teacher) + allowances - deductions;
};

const itemTotal = (item) =>
  Math.round(Math.abs(Number(item.unit_amount ?? item.amount ?? 0)) * Math.max(Number(item.quantity ?? 1), 0));

const componentTotal = (item) =>
  Math.round(Math.abs(Number(item.default_amount || 0)) * Math.max(Number(item.default_quantity || 1), 0));

const isTransportItem = (item) => {
  const name = String(item?.name || "").toLowerCase();
  return (item?.calculation_type || "FIXED") === "DAILY" && (name.includes("transport") || name.includes("transpor"));
};

const applyTransportAttendance = (items, validAttendanceDays) => {
  const days = Math.max(Number(validAttendanceDays || 0), 0);
  return items.map((item) => {
    if (!isTransportItem(item)) return item;
    return {
      ...item,
      quantity: days,
      amount: Math.round(Math.abs(Number(item.unit_amount ?? item.amount ?? 0)) * days),
    };
  });
};

const teacherItems = (teacher) =>
  applyTransportAttendance(Array.isArray(teacher.items) ? teacher.items : [], teacher.valid_attendance_days);

const transportItems = (teacher) => teacherItems(teacher).filter(isTransportItem);
const nonTransportItems = (teacher) => teacherItems(teacher).filter((item) => !isTransportItem(item));

const slipRowKey = (teacher) => String(teacher?.teacher_id || teacher?.payroll_id || "");

const isSlipDetailOpen = (teacher) => openedSlipDetailTeacherId.value === slipRowKey(teacher);

const toggleSlipDetail = (teacher) => {
  payrollStore.toggleSlipDetail(teacher);
};

const openStatusConfirm = (teacher) => {
  payrollStore.openStatusConfirm(teacher);
};

const closeStatusConfirm = () => {
  payrollStore.closeStatusConfirm();
};

const applySearch = () => {
  payrollStore.applySearch();
};

const resetFilters = () => {
  payrollStore.resetFilters();
};

const changeLimit = () => {
  payrollStore.changeLimit(limit.value);
};

const reloadOverview = () => {
  payrollStore.loadOverview({ period: selectedPeriod.value, page: 1, search: appliedSearchQuery.value, limit: limit.value });
};

const goToPage = (page) => {
  payrollStore.goToPage(page);
};

const statusDotClass = (status) => {
  if (status === "PAID") return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]";
  if (status === "DRAFT") return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.65)]";
  return "bg-slate-400";
};

const transportTotal = (teacher) =>
  transportItems(teacher).reduce((sum, item) => sum + itemTotal(item), 0);

const detailAllowanceItems = (teacher) =>
  nonTransportItems(teacher).filter((item) => item.component_type !== "DEDUCTION");

const detailDeductionItems = (teacher) =>
  nonTransportItems(teacher).filter((item) => item.component_type === "DEDUCTION");

const componentCountLabel = (teacher) => {
  const count = nonTransportItems(teacher).length;
  return count > 0 ? `${count} Komponen` : "Tidak ada";
};

const padLabel = (label, length = 18) => String(label || "").padEnd(length, " ");

const slipDetailText = (teacher) => {
  const teachingHours = Number(teacher.teaching_hours || 0);
  const hourlyRate = Number(teacher.hourly_rate || 0);
  const baseAmount = calculatedBaseAmount(teacher);
  const transports = transportItems(teacher);
  const allowances = detailAllowanceItems(teacher);
  const deductions = detailDeductionItems(teacher);
  const lines = [
    teacher.teacher_name || "-",
    "________________________",
    "",
    `${padLabel("Gaji Pokok")} ${formatCurrency(baseAmount)}`,
    "",
    "JP Mengajar",
    `${numberLabel(teachingHours)} JP × ${formatCurrency(hourlyRate)}`,
    `= ${formatCurrency(baseAmount)}`,
    "",
    "Transport",
  ];

  if (transports.length) {
    transports.forEach((item) => {
      lines.push(`${numberLabel(item.quantity)} Hari × ${formatCurrency(item.unit_amount)}`);
      lines.push(`= ${formatCurrency(itemTotal(item))}`);
    });
  } else {
    lines.push("Tidak ada");
  }

  lines.push("", "Tunjangan");
  if (allowances.length) {
    allowances.forEach((item) => {
      lines.push(`✓ ${padLabel(item.name, 24)} ${formatCurrency(itemTotal(item))}`);
    });
  } else {
    lines.push("Tidak ada");
  }

  if (deductions.length) {
    lines.push("", "Potongan");
    deductions.forEach((item) => {
      lines.push(`- ${padLabel(item.name, 24)} ${formatCurrency(itemTotal(item))}`);
    });
  }

  lines.push("", "TOTAL", formatCurrency(calculatedRowTotal(teacher)));
  return lines.join("\n");
};

const slugifyFilename = (value) =>
  String(value || "slip-gaji")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "slip-gaji";

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const fallbackCopyText = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const copySlipDetail = async (teacher) => {
  try {
    const text = slipDetailText(teacher);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopyText(text);
    }
    pushToast({ title: "Detail Disalin", message: "Rincian slip berhasil disalin.", type: "success" });
  } catch (error) {
    pushToast({ title: "Gagal Menyalin", message: error.message, type: "error" });
  }
};

const downloadSlipDetail = (teacher) => {
  const blob = new Blob([slipDetailText(teacher)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugifyFilename(teacher.teacher_name)}-${selectedPeriod.value || "periode"}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const buildPrintRows = (items, kind) => {
  if (!items.length) {
    return `<div class="empty-row">Tidak ada ${escapeHtml(kind)}</div>`;
  }
  return items.map((item) => {
    const label = escapeHtml(item.name || kind);
    const meta = escapeHtml(`${numberLabel(item.quantity)} ${item.calculation_type === "DAILY" ? "Hari" : "Qty"} x ${formatCurrency(item.unit_amount)}`);
    const amount = escapeHtml(formatCurrency(itemTotal(item)));
    const badge = escapeHtml(item.component_type === "DEDUCTION" ? "Potongan" : "Tunjangan");
    const badgeClass = item.component_type === "DEDUCTION" ? "badge badge-danger" : "badge badge-success";
    const sign = item.component_type === "DEDUCTION" ? "-" : "+";
    return `
      <div class="item-row">
        <div class="item-main">
          <div class="${badgeClass}">${badge}</div>
          <div class="item-copy">
            <div class="item-title">${label}</div>
            <div class="item-meta">${meta}</div>
          </div>
        </div>
        <div class="item-amount">${sign}${amount}</div>
      </div>
    `;
  }).join("");
};

const printSlipDetail = (teacher) => {
  if (typeof window === "undefined") return;
  const title = `${teacher.teacher_name || "Slip"} - ${periodLabel.value || ""}`;
  const baseAmount = calculatedBaseAmount(teacher);
  const transport = transportItems(teacher);
  const allowances = detailAllowanceItems(teacher);
  const deductions = detailDeductionItems(teacher);
  const totalAmount = calculatedRowTotal(teacher);
  const statusText = statusLabel(teacher.status);
  const statusClass = teacher.status === "PAID" ? "paid" : teacher.status === "DRAFT" ? "draft" : "neutral";
  const slipDate = periodLabel.value || "-";
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  document.body.appendChild(iframe);

  const cleanup = () => {
    setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 1000);
  };

  iframe.onload = () => {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      cleanup();
      return;
    }

    doc.open();
    doc.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { size: A4; margin: 14mm; }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        background: #f3f4f6;
        color: #111827;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page {
        width: 100%;
        max-width: 180mm;
        margin: 0 auto;
        padding: 0;
      }
      .sheet {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      }
      .header {
        padding: 22px 24px 18px;
        background: linear-gradient(135deg, #0f172a 0%, #1f2937 100%);
        color: #ffffff;
      }
      .eyebrow {
        margin: 0 0 8px;
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.68);
      }
      .title {
        margin: 0;
        font-size: 24px;
        line-height: 1.2;
        font-weight: 800;
      }
      .subtitle {
        margin: 8px 0 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.78);
      }
      .status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 14px;
        padding: 8px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        width: fit-content;
      }
      .status::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: currentColor;
      }
      .paid { background: rgba(16, 185, 129, 0.14); color: #34d399; }
      .draft { background: rgba(245, 158, 11, 0.14); color: #fbbf24; }
      .neutral { background: rgba(148, 163, 184, 0.14); color: #cbd5e1; }
      .content {
        padding: 20px 24px 24px;
      }
      .summary {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 18px;
      }
      .card {
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 14px;
        background: #f8fafc;
      }
      .label {
        margin: 0 0 8px;
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #6b7280;
      }
      .value {
        margin: 0;
        font-size: 18px;
        font-weight: 800;
        color: #111827;
      }
      .section {
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        overflow: hidden;
        background: #ffffff;
      }
      .section-head {
        padding: 14px 16px;
        background: #f8fafc;
        border-bottom: 1px solid #e5e7eb;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #374151;
      }
      .section-body {
        padding: 14px 16px 6px;
      }
      .section-title {
        margin: 0 0 10px;
        font-size: 14px;
        font-weight: 700;
        color: #111827;
      }
      .calc-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 16px;
        padding: 10px 0;
        border-bottom: 1px solid #f1f5f9;
      }
      .calc-row:last-child {
        border-bottom: 0;
      }
      .calc-copy {
        min-width: 0;
      }
      .calc-main {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
      }
      .calc-sub {
        margin-top: 4px;
        font-size: 12px;
        color: #6b7280;
      }
      .calc-amount {
        flex-shrink: 0;
        font-size: 14px;
        font-weight: 800;
        color: #111827;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .badge-success { background: rgba(16, 185, 129, 0.12); color: #059669; }
      .badge-danger { background: rgba(239, 68, 68, 0.12); color: #dc2626; }
      .item-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 12px 0;
        border-bottom: 1px solid #f1f5f9;
      }
      .item-row:last-child {
        border-bottom: 0;
      }
      .item-main {
        min-width: 0;
        flex: 1;
      }
      .item-copy {
        min-width: 0;
      }
      .item-title {
        font-size: 13px;
        font-weight: 700;
        color: #111827;
      }
      .item-meta {
        margin-top: 4px;
        font-size: 12px;
        color: #6b7280;
      }
      .item-amount {
        flex-shrink: 0;
        font-size: 14px;
        font-weight: 800;
        color: #111827;
      }
      .empty-row {
        padding: 12px 0;
        font-size: 12px;
        color: #9ca3af;
      }
      .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        padding: 16px 18px;
        border-radius: 16px;
        background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
        border: 1px solid #e5e7eb;
      }
      .total-copy {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #6b7280;
      }
      .total-value {
        font-size: 20px;
        font-weight: 900;
        color: #111827;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-top: 14px;
        font-size: 11px;
        color: #6b7280;
      }
      .foot-note {
        line-height: 1.6;
      }
      @media print {
        body {
          background: #ffffff;
        }
        .sheet {
          box-shadow: none;
          border-color: #e5e7eb;
        }
      }
      @media (max-width: 720px) {
        .summary {
          grid-template-columns: 1fr 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="sheet">
        <div class="header">
          <p class="eyebrow">Slip Gaji Guru</p>
          <h1 class="title">${escapeHtml(teacher.teacher_name || "-")}</h1>
          <p class="subtitle">${escapeHtml(slipDate)}${teacher.username ? ` · ${escapeHtml(teacher.username)}` : ""}</p>
          <div class="status ${statusClass}">${escapeHtml(statusText)}</div>
        </div>
        <div class="content">
          <div class="summary">
            <div class="card">
              <p class="label">Gaji Pokok</p>
              <p class="value">${escapeHtml(formatCurrency(baseAmount))}</p>
            </div>
            <div class="card">
              <p class="label">Transport</p>
              <p class="value">${escapeHtml(formatCurrency(transportTotal(teacher)))}</p>
            </div>
            <div class="card">
              <p class="label">Tunjangan</p>
              <p class="value">${escapeHtml(formatCurrency(allowances.reduce((sum, item) => sum + itemTotal(item), 0)))}</p>
            </div>
            <div class="card">
              <p class="label">Potongan</p>
              <p class="value">${escapeHtml(formatCurrency(deductions.reduce((sum, item) => sum + itemTotal(item), 0)))}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-head">Rincian</div>
            <div class="section-body">
              <div class="section-title">Gaji Pokok</div>
              <div class="calc-row">
                <div class="calc-copy">
                  <div class="calc-main">${escapeHtml(`${numberLabel(Number(teacher.teaching_hours || 0))} JP × ${formatCurrency(Number(teacher.hourly_rate || 0))}`)}</div>
                  <div class="calc-sub">Perhitungan dasar gaji</div>
                </div>
                <div class="calc-amount">${escapeHtml(formatCurrency(baseAmount))}</div>
              </div>

              <div class="section-title" style="margin-top: 8px;">Transport</div>
              ${buildPrintRows(transport, "transport")}

              <div class="section-title" style="margin-top: 8px;">Tunjangan</div>
              ${buildPrintRows(allowances, "tunjangan")}

              <div class="section-title" style="margin-top: 8px;">Potongan</div>
              ${buildPrintRows(deductions, "potongan")}
            </div>
          </div>

          <div class="total">
            <div class="total-copy">Total Dibayarkan</div>
            <div class="total-value">${escapeHtml(formatCurrency(totalAmount))}</div>
          </div>

          <div class="footer">
            <div class="foot-note">Dicetak otomatis dari sistem penggajian.</div>
            <div class="foot-note">${escapeHtml(new Date().toLocaleString("id-ID"))}</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`);
    doc.close();
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (error) {
        pushToast({ title: "Gagal Print", message: error.message, type: "error" });
      } finally {
        cleanup();
      }
    }, 250);
  };

  iframe.src = "about:blank";
};

const confirmStatusChange = async () => {
  try {
    await payrollStore.confirmStatusChange();
    successModal.value?.show(
      statusConfirmTarget.value === "PAID"
        ? "Slip berhasil ditandai lunas."
        : "Slip berhasil ditandai belum lunas.",
      statusConfirmTarget.value === "PAID" ? "Slip Ditandai Lunas" : "Slip Dikembalikan"
    );
  } catch (error) {
    pushToast({ title: "Gagal Mengubah Status", message: error.message, type: "error" });
  }
};

const openSlipModal = (teacher) => {
  payrollStore.openSlipModal(teacher);
};

const addComponentToSlip = (event) => {
  const value = event.target.value;
  event.target.value = "";
  if (!value) return;
  payrollStore.addComponentToSlip(value);
};

const saveSlip = async () => {
  try {
    await payrollStore.saveSlip();
    successModal.value?.show("Slip payroll berhasil disimpan.", "Slip Disimpan");
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan", message: error.message, type: "error" });
  }
};

const generateAllSlips = async () => {
  try {
    const globalCount = activeComponents.value.filter((c) => c.applies_to_all === true).length;
    if (!window.confirm(globalCount > 0
      ? `Generate slip semua guru dengan ${globalCount} komponen global?`
      : "Generate slip semua guru tanpa komponen global?")) return;
    const response = await payrollStore.generateAllSlips();
    const data = response?.data || {};
    successModal.value?.show(`${Number(data.generated || 0)} slip dibuat. ${Number(data.skipped_paid || 0)} dilewati.`, "Slip Digenerate");
  } catch (error) {
    pushToast({ title: "Gagal Generate", message: error.message, type: "error" });
  }
};
onMounted(() => {
  payrollStore.loadOverview({ period: selectedPeriod.value }).catch((error) => {
    pushToast({ title: "Gagal Memuat", message: error.message, type: "error" });
  });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slip-detail-pre {
  margin: 0;
  tab-size: 2;
}
</style>
