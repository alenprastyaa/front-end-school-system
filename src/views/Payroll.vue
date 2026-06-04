<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0f1117] text-slate-700 dark:text-slate-300 font-sans">

    <!-- ─── Header ─── -->
    <div class="bg-white dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-800 px-6 py-4">
      <div class="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p class="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Bendahara</p>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">Penggajian Guru</h1>
        </div>
        <div class="flex items-center gap-2">
          <input v-model="selectedPeriod" type="month"
            class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400" />
          <button @click="reloadOverview" :disabled="isLoading"
            class="rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-700 dark:hover:bg-white disabled:opacity-40 transition">
            {{ isLoading ? "Memuat…" : "Tampilkan" }}
          </button>
        </div>
      </div>
    </div>

    <div class="mx-auto px-6 py-8 space-y-10">

      <!-- ─── 1. Ringkasan Periode ─── -->
      <div>
        <p class="text-[11px] uppercase tracking-widest font-semibold text-slate-400 mb-4">Ringkasan — {{ periodLabel }}
        </p>
        <div
          class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#161b22]">
          <div class="px-5 py-4">
            <p class="text-xs text-slate-400 font-medium">Total Guru</p>
            <p class="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">{{ totalTeachers }}</p>
          </div>
          <div class="px-5 py-4">
            <p class="text-xs text-slate-400 font-medium">Sudah Dibayar</p>
            <p class="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">{{ paidCount }}</p>
            <p class="text-[11px] text-slate-400 mt-0.5">{{ formatCurrency(paidAmount) }}</p>
          </div>
          <div class="px-5 py-4">
            <p class="text-xs text-slate-400 font-medium">Belum Dibayar</p>
            <p class="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">{{ unpaidCount }}</p>
            <p class="text-[11px] text-slate-400 mt-0.5">{{ formatCurrency(unpaidAmount) }}</p>
          </div>
          <div class="px-5 py-4">
            <p class="text-xs text-slate-400 font-medium">Total Pengeluaran</p>
            <p class="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">{{ formatCurrency(totalPayrollAmount)
            }}</p>
          </div>
        </div>
      </div>

      <!-- ─── 2. Daftar Slip Guru ─── -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Daftar Slip Guru</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Jam mengajar dihitung dari beban mingguan × {{
              settingsForm.teaching_hours_multiplier }}×</p>
          </div>
          <button @click="generateAllSlips" :disabled="isGeneratingSlips || teachers.length === 0"
            class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b22] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition">
            {{ isGeneratingSlips ? "Generate…" : "Generate Semua Slip" }}
          </button>
        </div>

        <form class="mb-4 grid gap-2 lg:grid-cols-[1fr,auto,auto]" @submit.prevent="applyPayrollSearch">
          <input v-model="payrollSearchInput" type="search" placeholder="Cari nama guru, username, atau status..."
            class="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b22] px-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400" />
          <select v-model.number="payrollLimit" @change="changePayrollLimit"
            class="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b22] px-3 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400">
            <option :value="5">5 data</option>
            <option :value="10">10 data</option>
            <option :value="20">20 data</option>
            <option :value="50">50 data</option>
            <option :value="100">100 data</option>
          </select>
          <button type="submit"
            class="h-10 rounded-lg bg-slate-800 dark:bg-slate-200 px-4 text-sm font-semibold text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-white transition">
            Cari
          </button>
        </form>

        <button v-if="payrollSearch" type="button" @click="clearPayrollSearch"
          class="mb-4 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          Hapus filter "{{ payrollSearch }}"
        </button>

        <!-- Progress bar -->
        <div v-if="totalTeachers > 0" class="mb-4 flex items-center gap-3">
          <div class="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1">
            <div class="bg-slate-600 dark:bg-slate-400 h-1 rounded-full transition-all duration-500"
              :style="{ width: `${(paidCount / totalTeachers) * 100}%` }"></div>
          </div>
          <span class="text-[11px] text-slate-400 shrink-0 font-medium">{{ paidCount }}/{{ totalTeachers }}
            lunas</span>
        </div>

        <!-- Teacher list -->
        <div
          class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#161b22] divide-y divide-slate-100 dark:divide-slate-800">
          <div v-for="teacher in teachers" :key="teacher.teacher_id"
            class="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-[#1c2230] transition-colors">

            <!-- Inisial -->
            <div
              class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0 select-none">
              {{ getInitials(teacher.teacher_name) }}
            </div>

            <!-- Info guru -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ teacher.teacher_name }}</p>
                <span class="text-[10px] font-semibold rounded px-1.5 py-0.5" :class="teacher.status === 'PAID'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  : teacher.status === 'DRAFT'
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'">
                  {{ statusLabel(teacher.status) }}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">
                {{ numberLabel(teacher.teaching_hours) }} JP &middot; {{ formatCurrency(teacher.hourly_rate) }}/JP
                &middot; Basis {{ formatCurrency(calculatedBaseAmount(teacher)) }}
              </p>
            </div>

            <!-- Total -->
            <div class="text-right shrink-0">
              <p class="text-base font-bold text-slate-800 dark:text-slate-100">{{
                formatCurrency(calculatedRowTotal(teacher)) }}</p>
            </div>

            <!-- Aksi -->
            <div class="flex gap-2 shrink-0">
              <button @click="openSlipModal(teacher)"
                class="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                Kelola Slip
              </button>
              <button v-if="teacher.payroll_id && teacher.status !== 'PAID'" @click="markPaid(teacher)"
                class="rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700 dark:hover:bg-white transition">
                Tandai Lunas
              </button>
            </div>
          </div>

          <div v-if="teachers.length === 0" class="px-6 py-12 text-center">
            <p class="text-sm text-slate-400">
              {{ payrollSearch ? "Data guru tidak ditemukan untuk filter ini." : "Belum ada data guru untuk periode ini." }}
            </p>
          </div>
        </div>

        <div v-if="payrollTotal > 0"
          class="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
            {{ payrollRangeLabel }} · Halaman {{ payrollPage }} / {{ payrollTotalPages }}
          </p>
          <div class="flex items-center gap-2">
            <button type="button" @click="goPayrollPage(payrollPage - 1)"
              :disabled="payrollPage <= 1 || isLoading"
              class="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition">
              Prev
            </button>
            <button type="button" @click="goPayrollPage(payrollPage + 1)"
              :disabled="payrollPage >= payrollTotalPages || isLoading"
              class="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- ─── 3. Komponen Gaji ─── -->
      <div>
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Komponen Gaji</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Tunjangan, transport, uang makan, dan potongan.
            </p>
          </div>
          <button @click="startNewComponent"
            class="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            + Tambah
          </button>
        </div>

        <!-- Form tambah/edit komponen -->
        <form v-if="componentFormOpen" @submit.prevent="saveComponent"
          class="mb-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b22] p-5 space-y-4">
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {{ componentForm.id ? "Edit Komponen" : "Tambah Komponen Baru" }}
          </p>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="sm:col-span-2 block">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Nama Komponen</span>
              <input v-model="componentForm.name" type="text" placeholder="cth. Tunjangan Transport"
                class="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400" />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Jenis</span>
              <select v-model="componentForm.component_type"
                class="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400">
                <option value="ALLOWANCE">Tambahan / Tunjangan</option>
                <option value="DEDUCTION">Potongan</option>
              </select>
            </label>

            <label class="block">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Cara Hitung</span>
              <select v-model="componentForm.calculation_type"
                class="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400">
                <option value="FIXED">Tetap</option>
                <option value="DAILY">Harian (nominal × hari)</option>
              </select>
            </label>

            <label class="block">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                {{ componentForm.calculation_type === "DAILY" ? "Nominal per Hari" : "Nominal" }}
              </span>
              <input :value="formatRupiahInput(componentForm.default_amount)" type="text" inputmode="numeric"
                @input="componentForm.default_amount = parseRupiahInput($event.target.value)"
                class="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400" />
            </label>

            <label class="block">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                {{ componentForm.calculation_type === "DAILY" ? "Jumlah Hari Default" : "Kuantitas" }}
              </span>
              <input v-model.number="componentForm.default_quantity" type="number" min="0" step="0.25"
                class="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400" />
            </label>
          </div>

          <!-- Total preview -->
          <div
            class="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm">
            <span class="text-slate-500 dark:text-slate-400">Total komponen</span>
            <span class="font-semibold text-slate-800 dark:text-slate-100">
              {{ componentForm.component_type === "DEDUCTION" ? "−" : "+" }}{{
                formatCurrency(componentTotal(componentForm)) }}
            </span>
          </div>

          <div class="flex flex-wrap gap-4 text-sm">
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input v-model="componentForm.applies_to_all" type="checkbox"
                class="h-3.5 w-3.5 rounded border-slate-300" />
              <span class="text-slate-600 dark:text-slate-400 text-xs">Berlaku untuk semua guru</span>
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input v-model="componentForm.is_active" type="checkbox" class="h-3.5 w-3.5 rounded border-slate-300" />
              <span class="text-slate-600 dark:text-slate-400 text-xs">Aktif</span>
            </label>
          </div>

          <div class="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button type="submit" :disabled="isSavingComponent"
              class="rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-4 py-2 text-xs font-semibold hover:bg-slate-700 disabled:opacity-40 transition">
              {{ isSavingComponent ? "Menyimpan…" : "Simpan" }}
            </button>
            <button type="button" @click="componentFormOpen = false"
              class="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Batal
            </button>
          </div>
        </form>

        <!-- Daftar komponen -->
        <div
          class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#161b22] divide-y divide-slate-100 dark:divide-slate-800">
          <div v-for="item in components" :key="item.id"
            class="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-[#1c2230] transition-colors">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ item.name }}</p>
                <span class="text-[10px] font-semibold rounded px-1.5 py-0.5" :class="item.component_type === 'DEDUCTION'
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'">
                  {{ item.component_type === "DEDUCTION" ? "Potongan" : "Tambahan" }}
                </span>
                <span v-if="item.applies_to_all"
                  class="text-[10px] font-semibold rounded px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400">
                  Semua guru
                </span>
                <span v-if="!item.is_active"
                  class="text-[10px] font-semibold rounded px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 line-through">
                  Nonaktif
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">
                {{ item.component_type === "DEDUCTION" ? "−" : "+" }}{{ formatCurrency(componentTotal(item)) }}
                <span v-if="item.calculation_type === 'DAILY'">({{ formatCurrency(item.default_amount) }} × {{
                  numberLabel(item.default_quantity) }} hari)</span>
              </p>
            </div>
            <div class="flex gap-1 shrink-0">
              <button @click="editComponent(item)"
                class="rounded px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                Edit
              </button>
              <button @click="deleteComponent(item)"
                class="rounded px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                Hapus
              </button>
            </div>
          </div>

          <div v-if="components.length === 0" class="px-6 py-10 text-center">
            <p class="text-sm text-slate-400">Belum ada komponen gaji. Klik <strong>+ Tambah</strong> untuk mulai.</p>
          </div>
        </div>
      </div>

      <!-- ─── 4. Setting Tarif ─── -->
      <div>
        <div class="mb-4">
          <p class="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Setting Tarif</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Berlaku sebagai tarif default seluruh guru.</p>
        </div>

        <div
          class="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#161b22] overflow-hidden">
          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            <div class="px-5 py-4 grid sm:grid-cols-[200px,1fr] gap-3 items-center">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Tarif per jam pelajaran</p>
              <input :value="formatRupiahInput(settingsForm.hourly_rate)" type="text" inputmode="numeric"
                @input="settingsForm.hourly_rate = parseRupiahInput($event.target.value)"
                class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 max-w-xs focus:outline-none focus:ring-1 focus:ring-slate-400" />
            </div>

            <div class="px-5 py-4 grid sm:grid-cols-[200px,1fr] gap-3 items-center">
              <div>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Menit per jam pelajaran</p>
                <p class="text-[11px] text-slate-400 mt-0.5">Umumnya 45 menit</p>
              </div>
              <input v-model.number="settingsForm.lesson_minutes" type="number" min="1"
                class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 max-w-[100px] focus:outline-none focus:ring-1 focus:ring-slate-400" />
            </div>

            <div class="px-5 py-4 grid sm:grid-cols-[200px,1fr] gap-3 items-center">
              <div>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Pengali jam mengajar</p>
                <p class="text-[11px] text-slate-400 mt-0.5">Mingguan atau bulanan</p>
              </div>
              <select v-model.number="settingsForm.teaching_hours_multiplier"
                class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 max-w-xs focus:outline-none focus:ring-1 focus:ring-slate-400">
                <option :value="1">1× — 1 minggu</option>
                <option :value="4">4× — 1 bulan (4 minggu)</option>
              </select>
            </div>

            <div class="px-5 py-4 grid sm:grid-cols-[200px,1fr] gap-3 items-start">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">Catatan</p>
              <textarea v-model="settingsForm.notes" rows="2"
                class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 max-w-md w-full focus:outline-none focus:ring-1 focus:ring-slate-400"></textarea>
            </div>
          </div>

          <div
            class="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0f1117] flex items-center justify-between">
            <p class="text-[11px] text-slate-400">
              Contoh: 20 JP/minggu × {{ settingsForm.teaching_hours_multiplier }}× = {{
                formatCurrency(settingsForm.hourly_rate * 20 * settingsForm.teaching_hours_multiplier) }}
            </p>
            <button @click="saveSettings" :disabled="isSavingSettings"
              class="rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-4 py-2 text-xs font-semibold hover:bg-slate-700 disabled:opacity-40 transition">
              {{ isSavingSettings ? "Menyimpan…" : "Simpan Setting" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Modal: Kelola Slip ─── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="slipModalOpen"
          class="fixed inset-0 z-[300] flex items-end justify-center overflow-y-auto bg-black/40 p-0 sm:items-center sm:p-4"
          @click.self="slipModalOpen = false">
          <Transition name="slide">
            <form v-if="slipModalOpen" @submit.prevent="saveSlip"
              class="flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:max-h-[calc(100dvh-2rem)] sm:max-w-xl sm:rounded-2xl dark:border-slate-700 dark:bg-[#161b22]">

              <!-- Header modal -->
              <div
                class="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div>
                  <p class="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Slip Gaji</p>
                  <p class="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">{{ slipForm.teacher_name }}
                  </p>
                  <p class="text-xs text-slate-400">{{ periodLabel }}</p>
                </div>
                <button type="button" @click="slipModalOpen = false"
                  class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none mt-1 w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  ×
                </button>
              </div>

              <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 space-y-6">

                <!-- Gaji Pokok -->
                <div>
                  <p class="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-3">Gaji Pokok</p>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <label class="block">
                      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Jam Mengajar (JP)</span>
                      <input v-model.number="slipForm.teaching_hours" type="number" min="0" step="0.25"
                        class="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </label>
                    <label class="block">
                      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Tarif per JP</span>
                      <input :value="formatRupiahInput(slipForm.hourly_rate)" type="text" inputmode="numeric"
                        @input="slipForm.hourly_rate = parseRupiahInput($event.target.value)"
                        class="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </label>
                  </div>
                  <div
                    class="mt-2 flex items-center justify-between text-sm border-t border-slate-100 dark:border-slate-800 pt-2">
                    <span class="text-slate-400 text-xs">Gaji pokok dihitung</span>
                    <span class="font-semibold text-slate-700 dark:text-slate-200">{{ formatCurrency(slipBaseAmount)
                    }}</span>
                  </div>
                </div>

                <!-- Komponen Tunjangan & Potongan -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Tunjangan & Potongan
                    </p>
                    <select @change="addComponentToSlip($event)"
                      class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1117] px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400">
                      <option value="">+ Tambah</option>
                      <option v-for="component in activeComponents" :key="component.id" :value="component.id">
                        {{ component.name }}
                      </option>
                      <option value="__custom">Input manual</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <div v-for="(item, index) in slipForm.items" :key="`${item.component_id || 'c'}-${index}`"
                      class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f1117] overflow-hidden">
                      <div
                        class="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                        <span class="text-[10px] font-semibold uppercase tracking-wide"
                          :class="item.component_type === 'DEDUCTION' ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'">
                          {{ item.component_type === "DEDUCTION" ? "− Potongan" : "+ Tunjangan" }}
                        </span>
                        <div class="flex items-center gap-3">
                          <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {{ item.component_type === "DEDUCTION" ? "−" : "+" }}{{ formatCurrency(itemTotal(item)) }}
                          </span>
                          <button type="button" @click="slipForm.items.splice(index, 1)"
                            class="text-slate-300 hover:text-red-400 transition text-base leading-none">×</button>
                        </div>
                      </div>
                      <div class="grid gap-2 p-3 sm:grid-cols-[minmax(180px,1fr),145px,90px,140px]">
                        <label class="block">
                          <span class="mb-1 block h-4 text-[9px] font-semibold text-transparent">Nama</span>
                          <input v-model="item.name" type="text" placeholder="Nama"
                            class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-[#161b22] dark:text-slate-200" />
                        </label>
                        <label class="block">
                          <span class="mb-1 block h-4 text-[9px] font-semibold text-transparent">Jenis</span>
                          <select v-model="item.component_type"
                            class="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-[#161b22] dark:text-slate-300">
                            <option value="ALLOWANCE">Tambahan</option>
                            <option value="DEDUCTION">Potongan</option>
                          </select>
                        </label>
                        <label class="block">
                          <span class="mb-1 block h-4 text-[9px] font-semibold text-slate-400">{{ item.calculation_type === "DAILY" ? "Hari" : "Qty" }}</span>
                          <input v-model.number="item.quantity" type="number" min="0" step="0.25"
                            class="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-[#161b22] dark:text-slate-200" />
                        </label>
                        <label class="block">
                          <span class="mb-1 block h-4 text-[9px] font-semibold text-slate-400">{{ item.calculation_type === "DAILY" ? "Per hari" : "Nominal" }}</span>
                          <input :value="formatRupiahInput(item.unit_amount)" type="text" inputmode="numeric"
                            @input="item.unit_amount = parseRupiahInput($event.target.value)"
                            class="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-[#161b22] dark:text-slate-200" />
                        </label>
                      </div>
                    </div>

                    <div v-if="slipForm.items.length === 0"
                      class="rounded-lg border border-dashed border-slate-200 dark:border-slate-700 py-6 text-center">
                      <p class="text-xs text-slate-400">Belum ada komponen. Pilih dari dropdown di atas.</p>
                    </div>
                  </div>
                </div>

                <!-- Catatan -->
                <div>
                  <p class="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-2">Catatan</p>
                  <textarea v-model="slipForm.note" rows="2" placeholder="Keterangan tambahan (opsional)…"
                    class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f1117] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"></textarea>
                </div>

                <!-- Ringkasan Total -->
                <div class="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div
                    class="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
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

              <!-- Footer modal -->
              <div
                class="flex-shrink-0 flex justify-end gap-2 px-5 py-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" @click="slipModalOpen = false"
                  class="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Batal
                </button>
                <button type="submit" :disabled="isSavingSlip"
                  class="rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-5 py-2 text-sm font-semibold hover:bg-slate-700 disabled:opacity-40 transition">
                  {{ isSavingSlip ? "Menyimpan…" : "Simpan Slip" }}
                </button>
              </div>
            </form>
          </Transition>
        </div>
      </Transition>
    </Teleport>
    <SuccessModal ref="successModal" />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "@/api";
import SuccessModal from "@/components/SuccessModal.vue";
import { pushToast } from "@/composables/useToast";

const selectedPeriod = ref(new Date().toISOString().slice(0, 7));
const isLoading = ref(false);
const isSavingSettings = ref(false);
const isSavingComponent = ref(false);
const isSavingSlip = ref(false);
const isGeneratingSlips = ref(false);
const successModal = ref(null);
const teachers = ref([]);
const components = ref([]);
const payrollSearchInput = ref("");
const payrollSearch = ref("");
const payrollPage = ref(1);
const payrollLimit = ref(10);
const payrollTotal = ref(0);
const payrollTotalPages = ref(1);
const payrollSummary = reactive({
  total_teachers: 0,
  paid_count: 0,
  unpaid_count: 0,
  paid_amount: 0,
  unpaid_amount: 0,
  total_payroll_amount: 0,
});

const periodLabel = computed(() => {
  if (!selectedPeriod.value) return "";
  const [year, month] = selectedPeriod.value.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
});

const totalTeachers = computed(() => Number(payrollSummary.total_teachers || payrollTotal.value || teachers.value.length || 0));
const paidCount = computed(() => Number(payrollSummary.paid_count || 0));
const unpaidCount = computed(() => Number(payrollSummary.unpaid_count || 0));
const paidAmount = computed(() => Number(payrollSummary.paid_amount || 0));
const unpaidAmount = computed(() => Number(payrollSummary.unpaid_amount || 0));
const totalPayrollAmount = computed(() => Number(payrollSummary.total_payroll_amount || 0));
const payrollRangeLabel = computed(() => {
  const total = Number(payrollTotal.value || 0);
  if (total <= 0) return "0 data";
  const start = ((Number(payrollPage.value || 1) - 1) * Number(payrollLimit.value || 10)) + 1;
  const end = Math.min(start + Number(payrollLimit.value || 10) - 1, total);
  return `Menampilkan ${start}-${end} dari ${total} guru`;
});

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
};

const settingsForm = reactive({
  hourly_rate: 40000,
  lesson_minutes: 45,
  teaching_hours_multiplier: 4,
  notes: "",
});

const componentFormOpen = ref(false);
const componentForm = reactive({
  id: null,
  name: "",
  component_type: "ALLOWANCE",
  calculation_type: "FIXED",
  default_amount: 0,
  default_quantity: 1,
  applies_to_all: false,
  is_active: true,
});

const slipModalOpen = ref(false);
const slipForm = reactive({
  teacher_id: null,
  teacher_name: "",
  hourly_rate: 40000,
  teaching_hours: 0,
  note: "",
  status: "DRAFT",
  items: [],
});

const activeComponents = computed(() => components.value.filter((item) => item.is_active !== false));
const slipBaseAmount = computed(() => Math.round(Number(slipForm.hourly_rate || 0) * Number(slipForm.teaching_hours || 0)));
const slipAllowances = computed(() =>
  slipForm.items.filter((i) => i.component_type !== "DEDUCTION").reduce((t, i) => t + itemTotal(i), 0),
);
const slipDeductions = computed(() =>
  slipForm.items.filter((i) => i.component_type === "DEDUCTION").reduce((t, i) => t + itemTotal(i), 0),
);
const slipTotal = computed(() => slipBaseAmount.value + slipAllowances.value - slipDeductions.value);

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
  if (teacher.payroll_id) return Number(teacher.total_amount || 0);
  return calculatedBaseAmount(teacher);
};

const itemTotal = (item) =>
  Math.round(Math.abs(Number(item.unit_amount ?? item.amount ?? 0)) * Math.max(Number(item.quantity ?? 1), 0));

const componentTotal = (item) =>
  Math.round(Math.abs(Number(item.default_amount || 0)) * Math.max(Number(item.default_quantity || 1), 0));

const normalizePayrollSummary = (summary = {}) => ({
  total_teachers: Number(summary.total_teachers || 0),
  paid_count: Number(summary.paid_count || 0),
  unpaid_count: Number(summary.unpaid_count || 0),
  paid_amount: Number(summary.paid_amount || 0),
  unpaid_amount: Number(summary.unpaid_amount || 0),
  total_payroll_amount: Number(summary.total_payroll_amount || 0),
});

const fallbackPayrollSummary = (rows = []) => ({
  total_teachers: rows.length,
  paid_count: rows.filter((t) => t.status === "PAID").length,
  unpaid_count: rows.filter((t) => t.status !== "PAID").length,
  paid_amount: rows.filter((t) => t.status === "PAID").reduce((sum, t) => sum + calculatedRowTotal(t), 0),
  unpaid_amount: rows.filter((t) => t.status !== "PAID").reduce((sum, t) => sum + calculatedRowTotal(t), 0),
  total_payroll_amount: rows.reduce((sum, t) => sum + calculatedRowTotal(t), 0),
});

const assignPayrollSummary = (summary) => {
  payrollSummary.total_teachers = summary.total_teachers;
  payrollSummary.paid_count = summary.paid_count;
  payrollSummary.unpaid_count = summary.unpaid_count;
  payrollSummary.paid_amount = summary.paid_amount;
  payrollSummary.unpaid_amount = summary.unpaid_amount;
  payrollSummary.total_payroll_amount = summary.total_payroll_amount;
};

const loadOverview = async ({ page = payrollPage.value } = {}) => {
  isLoading.value = true;
  try {
    const response = await api.get("/payroll/overview", {
      params: {
        period: selectedPeriod.value,
        page,
        limit: payrollLimit.value,
        search: payrollSearch.value || undefined,
      },
    });
    const data = response?.data || {};
    settingsForm.hourly_rate = Number(data.settings?.hourly_rate || 40000);
    settingsForm.lesson_minutes = Number(data.settings?.lesson_minutes || 45);
    settingsForm.teaching_hours_multiplier = Number(data.settings?.teaching_hours_multiplier || 4);
    settingsForm.notes = data.settings?.notes || "";
    components.value = Array.isArray(data.components) ? data.components : [];
    teachers.value = Array.isArray(data.teachers) ? data.teachers : [];
    payrollPage.value = Number(data.page || page || 1);
    payrollLimit.value = Number(data.limit || payrollLimit.value || 10);
    payrollTotal.value = Number(data.total || teachers.value.length || 0);
    payrollTotalPages.value = Math.max(1, Number(data.total_pages || 1));
    assignPayrollSummary(data.summary ? normalizePayrollSummary(data.summary) : fallbackPayrollSummary(teachers.value));
  } catch (error) {
    pushToast({ title: "Gagal Memuat Payroll", message: error.message, type: "error" });
  } finally {
    isLoading.value = false;
  }
};

const reloadOverview = async () => {
  payrollPage.value = 1;
  await loadOverview({ page: 1 });
};

const applyPayrollSearch = async () => {
  payrollSearch.value = String(payrollSearchInput.value || "").trim();
  payrollPage.value = 1;
  await loadOverview({ page: 1 });
};

const clearPayrollSearch = async () => {
  payrollSearchInput.value = "";
  payrollSearch.value = "";
  payrollPage.value = 1;
  await loadOverview({ page: 1 });
};

const changePayrollLimit = async () => {
  payrollPage.value = 1;
  await loadOverview({ page: 1 });
};

const goPayrollPage = async (page) => {
  const nextPage = Math.max(1, Math.min(Number(page || 1), payrollTotalPages.value || 1));
  if (nextPage === payrollPage.value || isLoading.value) return;
  await loadOverview({ page: nextPage });
};

const saveSettings = async () => {
  isSavingSettings.value = true;
  try {
    await api.put("/payroll/settings", {
      hourly_rate: Number(settingsForm.hourly_rate || 0),
      lesson_minutes: Number(settingsForm.lesson_minutes || 45),
      teaching_hours_multiplier: Number(settingsForm.teaching_hours_multiplier || 4),
      notes: settingsForm.notes || "",
    });
    successModal.value?.show("Tarif berhasil diperbarui.", "Setting Disimpan");
    await loadOverview();
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan", message: error.message, type: "error" });
  } finally {
    isSavingSettings.value = false;
  }
};

const resetComponentForm = () => {
  componentForm.id = null;
  componentForm.name = "";
  componentForm.component_type = "ALLOWANCE";
  componentForm.calculation_type = "FIXED";
  componentForm.default_amount = 0;
  componentForm.default_quantity = 1;
  componentForm.applies_to_all = false;
  componentForm.is_active = true;
};

const startNewComponent = () => {
  resetComponentForm();
  componentFormOpen.value = true;
};

const editComponent = (item) => {
  componentForm.id = item.id;
  componentForm.name = item.name;
  componentForm.component_type = item.component_type || "ALLOWANCE";
  componentForm.calculation_type = item.calculation_type || "FIXED";
  componentForm.default_amount = Number(item.default_amount || 0);
  componentForm.default_quantity = Number(item.default_quantity || 1);
  componentForm.applies_to_all = item.applies_to_all === true;
  componentForm.is_active = item.is_active !== false;
  componentFormOpen.value = true;
};

const saveComponent = async () => {
  isSavingComponent.value = true;
  try {
    const payload = {
      name: componentForm.name,
      component_type: componentForm.component_type,
      calculation_type: componentForm.calculation_type,
      default_amount: Number(componentForm.default_amount || 0),
      default_quantity: Number(componentForm.default_quantity || 1),
      applies_to_all: componentForm.applies_to_all,
      is_active: componentForm.is_active,
    };
    if (componentForm.id) {
      await api.put(`/payroll/components/${componentForm.id}`, payload);
    } else {
      await api.post("/payroll/components", payload);
    }
    successModal.value?.show("Komponen payroll berhasil disimpan.", "Komponen Disimpan");
    componentFormOpen.value = false;
    await loadOverview();
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan", message: error.message, type: "error" });
  } finally {
    isSavingComponent.value = false;
  }
};

const deleteComponent = async (item) => {
  if (!window.confirm(`Hapus komponen "${item.name}"?`)) return;
  try {
    await api.delete(`/payroll/components/${item.id}`);
    successModal.value?.show("Komponen payroll berhasil dihapus.", "Komponen Dihapus");
    await loadOverview();
  } catch (error) {
    pushToast({ title: "Gagal Menghapus", message: error.message, type: "error" });
  }
};

const openSlipModal = (teacher) => {
  slipForm.teacher_id = teacher.teacher_id;
  slipForm.teacher_name = teacher.teacher_name;
  slipForm.hourly_rate = Number(teacher.hourly_rate || settingsForm.hourly_rate || 0);
  slipForm.teaching_hours = Number(teacher.teaching_hours || teacher.suggested_month_hours || 0);
  slipForm.note = teacher.note || "";
  slipForm.status = teacher.status === "PAID" ? "PAID" : "DRAFT";
  slipForm.items = Array.isArray(teacher.items)
    ? teacher.items.map((item) => ({
      component_id: item.component_id || null,
      name: item.name,
      component_type: item.component_type || "ALLOWANCE",
      calculation_type: item.calculation_type || "FIXED",
      quantity: Number(item.quantity ?? 1),
      unit_amount: Number(item.unit_amount || item.amount || 0),
      amount: Number(item.amount || 0),
    }))
    : [];
  if (slipForm.items.length === 0) {
    slipForm.items = activeComponents.value
      .filter((item) => item.applies_to_all === true)
      .map((item) => ({
        component_id: item.id,
        name: item.name,
        component_type: item.component_type,
        calculation_type: item.calculation_type || "FIXED",
        quantity: Number(item.default_quantity || 1),
        unit_amount: Number(item.default_amount || 0),
        amount: componentTotal(item),
      }));
  }
  slipModalOpen.value = true;
};

const addComponentToSlip = (event) => {
  const value = event.target.value;
  event.target.value = "";
  if (!value) return;
  if (value === "__custom") {
    slipForm.items.push({ component_id: null, name: "", component_type: "ALLOWANCE", calculation_type: "FIXED", quantity: 1, unit_amount: 0, amount: 0 });
    return;
  }
  const component = activeComponents.value.find((item) => String(item.id) === String(value));
  if (!component) return;
  slipForm.items.push({
    component_id: component.id,
    name: component.name,
    component_type: component.component_type,
    calculation_type: component.calculation_type || "FIXED",
    quantity: Number(component.default_quantity || 1),
    unit_amount: Number(component.default_amount || 0),
    amount: componentTotal(component),
  });
};

const saveSlip = async () => {
  isSavingSlip.value = true;
  try {
    await api.post("/payroll/slips", {
      teacher_id: slipForm.teacher_id,
      period: selectedPeriod.value,
      hourly_rate: Number(slipForm.hourly_rate || 0),
      teaching_hours: Number(slipForm.teaching_hours || 0),
      note: slipForm.note || "",
      status: slipForm.status === "PAID" ? "PAID" : "DRAFT",
      items: slipForm.items
        .filter((item) => String(item.name || "").trim())
        .map((item) => ({
          component_id: item.component_id || null,
          name: item.name,
          component_type: item.component_type,
          calculation_type: item.calculation_type || "FIXED",
          quantity: Number(item.quantity ?? 1),
          unit_amount: Number(item.unit_amount ?? item.amount ?? 0),
          amount: itemTotal(item),
        })),
    });
    successModal.value?.show("Slip payroll berhasil disimpan.", "Slip Disimpan");
    slipModalOpen.value = false;
    await loadOverview();
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan", message: error.message, type: "error" });
  } finally {
    isSavingSlip.value = false;
  }
};

const generateAllSlips = async () => {
  const globalCount = activeComponents.value.filter((i) => i.applies_to_all === true).length;
  if (!window.confirm(globalCount > 0
    ? `Generate slip semua guru dengan ${globalCount} komponen global?`
    : "Generate slip semua guru tanpa komponen global?")) return;
  isGeneratingSlips.value = true;
  try {
    const response = await api.post("/payroll/slips/generate", { period: selectedPeriod.value });
    const data = response?.data || {};
    successModal.value?.show(`${Number(data.generated || 0)} slip dibuat. ${Number(data.skipped_paid || 0)} dilewati.`, "Slip Digenerate");
    await loadOverview();
  } catch (error) {
    pushToast({ title: "Gagal Generate", message: error.message, type: "error" });
  } finally {
    isGeneratingSlips.value = false;
  }
};

const markPaid = async (teacher) => {
  if (!teacher.payroll_id) return;
  try {
    await api.post(`/payroll/slips/${teacher.payroll_id}/mark-paid`);
    successModal.value?.show("Slip berhasil ditandai lunas.", "Slip Ditandai Lunas");
    await loadOverview();
  } catch (error) {
    pushToast({ title: "Gagal", message: error.message, type: "error" });
  }
};

onMounted(loadOverview);
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

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(16px);
}
</style>
