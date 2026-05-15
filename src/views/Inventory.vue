<template>
  <div class="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-6">
      <section v-if="isStudentRole" class="flex justify-end">
        <button
          class="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500"
          @click="openCatalogModal">
          Pinjam Barang
        </button>
      </section>

      <section v-else
        class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500 dark:text-amber-300">
                Pinjaman Aktif
              </p>
              <h2 class="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                Barang yang Sedang Dipinjam
              </h2>
            </div>
            <span
              class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {{ activeLoansMeta.total }} item
            </span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th class="px-4 py-3 font-medium sm:px-6">Barang</th>
                <th class="px-4 py-3 font-medium sm:px-6">Qty</th>
                <th class="px-4 py-3 font-medium sm:px-6">Jatuh Tempo</th>
                <th class="px-4 py-3 font-medium sm:px-6">Status</th>
                <th class="px-4 py-3 font-medium text-right sm:px-6">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="loan in visibleActiveLoans" :key="loan.id"
                class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td class="px-4 py-4 sm:px-6">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ loan.item_name || "-" }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {{ loan.item_code || "-" }} · {{ resolveTeacherName(loan) }}
                  </div>
                </td>
                <td class="px-4 py-4 sm:px-6 font-semibold text-slate-900 dark:text-white">
                  {{ numberValue(loan.quantity) }}
                </td>
                <td class="px-4 py-4 sm:px-6">{{ formatDate(loan.due_date) }}</td>
                <td class="px-4 py-4 sm:px-6">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="loan.status === 'BORROWED'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
                    : loan.status === 'RETURN_REQUESTED'
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'">
                    {{ loan.status === 'RETURN_REQUESTED' ? 'MENUNGGU ACC SARPRAS' : loan.status || '-' }}
                  </span>
                </td>
                <td class="px-4 py-4 sm:px-6 text-right">
                  <button v-if="loan.status === 'BORROWED'" @click="returnLoan(loan)"
                    class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500">
                    Ajukan Pengembalian
                  </button>
                </td>
              </tr>
              <tr v-if="visibleActiveLoans.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                  Belum ada barang yang sedang dipinjam.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm dark:border-slate-800">
          <span class="text-slate-500 dark:text-slate-400">{{ paginationLabel(activeLoansMeta) }}</span>
          <div class="flex items-center gap-2">
            <button
              class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              :disabled="currentPage(activeLoansMeta) <= 1"
              @click="setActiveLoansPage(currentPage(activeLoansMeta) - 1)">
              Prev
            </button>
            <button
              class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              :disabled="currentPage(activeLoansMeta) >= totalPages(activeLoansMeta)"
              @click="setActiveLoansPage(currentPage(activeLoansMeta) + 1)">
              Next
            </button>
          </div>
        </div>
      </section>

      <section v-if="message" class="rounded-2xl px-5 py-4 text-sm font-medium ring-1 ring-inset"
        :class="isError ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20'">
        {{ message }}
      </section>

      <section v-if="canManageInventory" class="grid gap-6">
        <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Daftar Barang</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Barang yang bisa dipinjam siswa dan dikelola
                  sarpras.</p>
              </div>
              <div class="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
                <input v-model="search" type="text" placeholder="Cari barang..."
                  class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 lg:max-w-sm dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
                <button
                  class="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500"
                  @click="openItemModal">
                  Tambah Barang
                </button>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-medium sm:px-6">Barang</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Kategori</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Stok</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Kondisi</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Status</th>
                  <th class="px-4 py-3 font-medium text-right sm:px-6">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in filteredItems" :key="item.id"
                  class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td class="px-4 py-4 sm:px-6">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.name || "-" }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {{ item.code || "-" }} · {{ item.description || "Tanpa deskripsi" }}
                    </div>
                  </td>
                  <td class="px-4 py-4 sm:px-6">{{ item.category || "-" }}</td>
                  <td class="px-4 py-4 sm:px-6">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ numberValue(item.available_quantity) }}
                      / {{ numberValue(item.total_quantity) }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">Dipinjam: {{
                      numberValue(item.borrowed_quantity) }}</div>
                  </td>
                  <td class="px-4 py-4 sm:px-6">{{ item.condition_status || "-" }}</td>
                  <td class="px-4 py-4 sm:px-6">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="item.is_active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'">
                      {{ item.is_active ? "Aktif" : "Nonaktif" }}
                    </span>
                  </td>
                  <td class="px-4 py-4 sm:px-6">
                    <div class="flex justify-end gap-2">
                      <button @click="startEditItem(item)"
                        class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                        Edit
                      </button>
                      <button @click="deleteItem(item)"
                        class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500">
                        Nonaktifkan
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredItems.length === 0">
                  <td colspan="6" class="px-4 py-10 text-center text-slate-500 dark:text-slate-400">Belum ada barang
                    yang cocok.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm dark:border-slate-800">
            <span class="text-slate-500 dark:text-slate-400">{{ paginationLabel(itemsMeta) }}</span>
            <div class="flex items-center gap-2">
              <button
                class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                :disabled="currentPage(itemsMeta) <= 1" @click="setItemsPage(currentPage(itemsMeta) - 1)">
                Prev
              </button>
              <button
                class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                :disabled="currentPage(itemsMeta) >= totalPages(itemsMeta)"
                @click="setItemsPage(currentPage(itemsMeta) + 1)">
                Next
              </button>
            </div>
          </div>
        </section>
      </section>


      <section v-if="canManageInventory || isStudentRole"
        class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div
          class="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Riwayat Peminjaman</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {{
                canManageInventory ? `Semua pinjaman siswa tercatat di sini dan dapat dikonfirmasi pengembaliannya oleh
              sarpras atau admin.`
                  : "Semua pinjaman Anda tercatat di sini." }}
            </p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th class="px-4 py-3 font-medium sm:px-6">Barang</th>
                <th v-if="canManageInventory" class="px-4 py-3 font-medium sm:px-6">Peminjam</th>
                <th class="px-4 py-3 font-medium sm:px-6">Guru</th>
                <th class="px-4 py-3 font-medium sm:px-6">Qty</th>
                <th class="px-4 py-3 font-medium sm:px-6">Tgl Pinjam</th>
                <th class="px-4 py-3 font-medium sm:px-6">Jatuh Tempo</th>
                <th class="px-4 py-3 font-medium sm:px-6">Status</th>
                <th class="px-4 py-3 font-medium text-right sm:px-6">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="loan in visibleLoans" :key="loan.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td class="px-4 py-4 sm:px-6">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ loan.item_name || "-" }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ loan.item_code || "-" }}</div>
                </td>
                <td v-if="canManageInventory" class="px-4 py-4 sm:px-6">{{ loan.borrower_name || "-" }}</td>
                <td class="px-4 py-4 sm:px-6">{{ resolveTeacherName(loan) }}</td>
                <td class="px-4 py-4 sm:px-6 font-semibold text-slate-900 dark:text-white">{{ numberValue(loan.quantity)
                  }}</td>
                <td class="px-4 py-4 sm:px-6">{{ formatDateTime(loan.borrowed_at) }}</td>
                <td class="px-4 py-4 sm:px-6">{{ formatDate(loan.due_date) }}</td>
                <td class="px-4 py-4 sm:px-6">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="loan.status === 'BORROWED'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
                    : loan.status === 'RETURN_REQUESTED'
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'">
                    {{ loan.status === 'RETURN_REQUESTED' ? 'MENUNGGU ACC SARPRAS' : loan.status }}
                  </span>
                </td>
                <td class="px-4 py-4 sm:px-6 text-right">
                  <button v-if="canManageInventory && loan.status === 'RETURN_REQUESTED'" @click="returnLoan(loan)"
                    class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500">
                    Acc Pengembalian
                  </button>
                  <button v-else-if="isStudentRole && loan.status === 'BORROWED'" @click="returnLoan(loan)"
                    class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500">
                    Ajukan Pengembalian
                  </button>
                </td>
              </tr>
              <tr v-if="visibleLoans.length === 0">
                <td :colspan="canManageInventory ? 8 : 7"
                  class="px-4 py-10 text-center text-slate-500 dark:text-slate-400">Belum ada riwayat
                  peminjaman.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm dark:border-slate-800">
          <span class="text-slate-500 dark:text-slate-400">{{ paginationLabel(loansMeta) }}</span>
          <div class="flex items-center gap-2">
            <button
              class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              :disabled="currentPage(loansMeta) <= 1" @click="setLoansPage(currentPage(loansMeta) - 1)">
              Prev
            </button>
            <button
              class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              :disabled="currentPage(loansMeta) >= totalPages(loansMeta)"
              @click="setLoansPage(currentPage(loansMeta) + 1)">
              Next
            </button>
          </div>
        </div>
      </section>
    </main>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="itemModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="closeItemModal">
        <div
          class="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500 dark:text-amber-300">
              {{ editingItemId ? "Edit Barang" : "Tambah Barang" }}
            </p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {{ editingItemId ? "Perbarui Data Barang" : "Input Barang Baru" }}
            </h2>
          </div>

          <form class="space-y-4 px-6 py-5" @submit.prevent="submitItem">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Barang</label>
              <input v-model="itemForm.name" type="text" required
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kode</label>
                <input v-model="itemForm.code" type="text"
                  class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                <input v-model="itemForm.category" type="text"
                  class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kondisi</label>
                <select v-model="itemForm.condition_status"
                  class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                  <option value="BAIK">BAIK</option>
                  <option value="BARU">BARU</option>
                  <option value="PERBAIKAN">PERBAIKAN</option>
                  <option value="RUSAK">RUSAK</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Stok Awal</label>
                <input v-model="itemForm.total_quantity" type="number" min="1" required
                  class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi</label>
              <textarea v-model="itemForm.description" rows="4"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"></textarea>
            </div>
            <label
              class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
              <input v-model="itemForm.is_active" type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
              Barang aktif dan bisa dipinjam
            </label>
            <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button type="button"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                @click="closeItemModal">
                Batal
              </button>
              <button type="submit" :disabled="isSavingItem"
                class="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50">
                {{ isSavingItem ? "Menyimpan..." : "Simpan Barang" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="confirmModalOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="closeConfirmModal">
        <div
          class="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500 dark:text-amber-300">Konfirmasi
            </p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{{ confirmTitle }}</h2>
          </div>
          <div class="px-6 py-5">
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">{{ confirmMessage }}</p>
          </div>
          <div class="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-5 dark:border-slate-800">
            <button type="button"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              @click="closeConfirmModal">
              Batal
            </button>
            <button type="button" class="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
              :class="confirmToneClass" @click="runConfirmAction">
              {{ confirmActionLabel }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="catalogModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="closeCatalogModal">
        <div
          class="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div
            class="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500 dark:text-amber-300">
                Katalog Barang
              </p>
              <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Barang Tersedia</h2>
            </div>
            <input v-model="search" type="text" placeholder="Cari barang..."
              class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 md:max-w-sm dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-medium sm:px-6">Barang</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Kategori</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Tersedia</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Kondisi</th>
                  <th class="px-4 py-3 font-medium text-right sm:px-6">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in filteredItems" :key="item.id"
                  class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td class="px-4 py-4 sm:px-6">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.name || "-" }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.code || "-" }} · {{
                      item.description || "Tanpa deskripsi" }}</div>
                  </td>
                  <td class="px-4 py-4 sm:px-6">{{ item.category || "-" }}</td>
                  <td class="px-4 py-4 sm:px-6 font-semibold text-slate-900 dark:text-white">
                    {{ numberValue(item.available_quantity) }}
                  </td>
                  <td class="px-4 py-4 sm:px-6">{{ item.condition_status || "-" }}</td>
                  <td class="px-4 py-4 sm:px-6 text-right">
                    <button @click="openBorrowModal(item)" :disabled="numberValue(item.available_quantity) <= 0"
                      class="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50">
                      Pinjam
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredItems.length === 0">
                  <td colspan="5" class="px-4 py-10 text-center text-slate-500 dark:text-slate-400">Belum ada barang
                    yang bisa dipinjam.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm dark:border-slate-800">
            <span class="text-slate-500 dark:text-slate-400">{{ paginationLabel(itemsMeta) }}</span>
            <div class="flex items-center gap-2">
              <button
                class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                :disabled="currentPage(itemsMeta) <= 1" @click="setItemsPage(currentPage(itemsMeta) - 1)">
                Prev
              </button>
              <button
                class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                :disabled="currentPage(itemsMeta) >= totalPages(itemsMeta)"
                @click="setItemsPage(currentPage(itemsMeta) + 1)">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="borrowModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="closeBorrowModal">
        <div
          class="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500 dark:text-amber-300">Pinjam
              Barang</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{{ selectedItem?.name ||
              "-" }}</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{
              selectedItem?.description || "Tidak ada deskripsi" }}</p>
          </div>

          <form class="space-y-4 px-6 py-5" @submit.prevent="submitBorrow">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah</label>
              <input v-model="borrowForm.quantity" type="number" min="1" :max="selectedItem?.available_quantity || 1"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Guru yang
                mengajar</label>
              <select v-model="borrowForm.teacher_id"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option value="">Pilih guru</option>
                <option v-for="teacher in teacherUsers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.full_name || teacher.username || "-" }}{{ teacher.subjects ? ` - ${teacher.subjects}` : ""
                  }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jam
                Pembelajaran</label>
              <select v-model="borrowForm.schedule_slot_id"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option value="">Pilih jam kembali</option>
                <option v-for="slot in scheduleOptions" :key="slot.id" :value="slot.id">
                  {{ slot.day_name }} - {{ slot.label || `Sesi ${slot.session_order}` }} ({{ slot.start_time }} - {{
                    slot.end_time }}){{ slot.subject_name ? ` · ${slot.subject_name}` : "" }}{{ slot.teacher_name ? ` ·
                  ${slot.teacher_name}` : "" }}
                </option>
              </select>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Dipilih dari jadwal kurikulum kelas Anda.
              </p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Catatan</label>
              <textarea v-model="borrowForm.notes" rows="4"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-amber-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"></textarea>
            </div>
            <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button type="button"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                @click="closeBorrowModal">
                Batal
              </button>
              <button type="submit" :disabled="isBorrowing"
                class="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50">
                {{ isBorrowing ? "Memproses..." : "Ajukan Pinjaman" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDate, formatDateTime } from "@/utils/date";
import { getStoredRole } from "@/utils/auth";

const role = String(getStoredRole() || "").toUpperCase();
const canManageInventory = computed(() => ["ADMIN", "SARPRAS"].includes(role));
const isStudentRole = computed(() => role === "SISWA");
const pageTitle = computed(() =>
  canManageInventory.value ? "Inventaris Sekolah dan Peminjaman" : "Daftar Barang yang Bisa Dipinjam",
);
const pageDescription = computed(() =>
  canManageInventory.value
    ? "Kelola daftar barang sekolah, stok, kondisi, dan pantau peminjaman siswa dari CMS sarpras."
    : "Lihat barang yang tersedia di sekolah lalu ajukan pinjaman langsung dari akun Anda.",
);

const isLoading = ref(false);
const isSavingItem = ref(false);
const isBorrowing = ref(false);
const message = ref("");
const isError = ref(false);
const overview = ref({});
const items = ref([]);
const loans = ref([]);
const activeLoansSchool = ref([]);
const teacherUsers = ref([]);
const scheduleOptions = ref([]);
const search = ref("");
const itemsPage = ref(1);
const loansPage = ref(1);
const activeLoansPage = ref(1);
const itemsPageSize = 10;
const loansPageSize = 10;
const activeLoansPageSize = 10;
const itemsMeta = ref({ page: 1, limit: itemsPageSize, total: 0, totalPages: 1 });
const loansMeta = ref({ page: 1, limit: loansPageSize, total: 0, totalPages: 1 });
const activeLoansMeta = ref({ page: 1, limit: activeLoansPageSize, total: 0, totalPages: 1 });
const editingItemId = ref(null);
const itemModalOpen = ref(false);
const catalogModalOpen = ref(false);
const borrowModalOpen = ref(false);
const confirmModalOpen = ref(false);
const confirmTitle = ref("");
const confirmMessage = ref("");
const confirmAction = ref(null);
const confirmActionLabel = ref("Lanjutkan");
const confirmToneClass = ref("bg-rose-600 hover:bg-rose-500");
const selectedItem = ref(null);
const itemForm = reactive({
  name: "",
  code: "",
  category: "",
  description: "",
  condition_status: "BAIK",
  total_quantity: 1,
  is_active: true,
});
const borrowForm = reactive({
  quantity: 1,
  teacher_id: "",
  schedule_slot_id: "",
  notes: "",
});

const numberValue = (value) => Number(value || 0);

const baseItemForm = () => ({
  name: "",
  code: "",
  category: "",
  description: "",
  condition_status: "BAIK",
  total_quantity: 1,
  is_active: true,
});

const resetItemForm = () => {
  Object.assign(itemForm, baseItemForm());
  editingItemId.value = null;
};

const closeItemModal = () => {
  if (isSavingItem.value) {
    return;
  }
  itemModalOpen.value = false;
  resetItemForm();
};

const openConfirmModal = ({ title, message, action, actionLabel = "Lanjutkan", toneClass = "bg-rose-600 hover:bg-rose-500" }) => {
  confirmTitle.value = title;
  confirmMessage.value = message;
  confirmAction.value = action;
  confirmActionLabel.value = actionLabel;
  confirmToneClass.value = toneClass;
  confirmModalOpen.value = true;
};

const closeConfirmModal = () => {
  if (isLoading.value) {
    return;
  }
  confirmModalOpen.value = false;
  confirmAction.value = null;
};

const runConfirmAction = async () => {
  if (!confirmAction.value) {
    return;
  }
  const action = confirmAction.value;
  closeConfirmModal();
  await action();
};

const summaryCards = computed(() => {
  const totalItems = numberValue(overview.value.items_total || items.value.length);
  const availableStock = numberValue(overview.value.stock_available);
  const activeLoans = numberValue(overview.value.active_loans || loans.value.filter((item) => item.status === "BORROWED").length);
  const overdueLoans = numberValue(overview.value.overdue_loans);
  const returnedLoans = numberValue(overview.value.returned_loans || loans.value.filter((item) => item.status === "RETURNED").length);
  const myActiveLoans = loans.value.filter((item) => item.status === "BORROWED").length;

  return canManageInventory.value
    ? [
      { label: "Total Barang", value: totalItems, caption: "Semua item inventaris", cardClass: "bg-amber-600" },
      { label: "Stok Tersedia", value: availableStock, caption: "Siap dipinjam siswa", cardClass: "bg-emerald-600" },
      { label: "Pinjaman Aktif", value: activeLoans, caption: "Belum dikembalikan", cardClass: "bg-sky-600" },
      { label: "Terlambat", value: overdueLoans, caption: "Perlu ditindaklanjuti", cardClass: "bg-rose-600" },
    ]
    : [
      { label: "Barang Tersedia", value: totalItems, caption: "Katalog aktif", cardClass: "bg-amber-600" },
      { label: "Stok Siap", value: availableStock, caption: "Bisa langsung dipinjam", cardClass: "bg-emerald-600" },
      { label: "Pinjaman Saya", value: myActiveLoans, caption: "Sedang berjalan", cardClass: "bg-sky-600" },
      { label: "Riwayat Selesai", value: returnedLoans, caption: "Sudah dikembalikan", cardClass: "bg-rose-600" },
    ];
});

const activeLoans = computed(() => activeLoansSchool.value);

const totalPages = (meta) => Number(meta?.totalPages || 1);
const currentPage = (meta) => Number(meta?.page || 1);

const visibleItems = computed(() => filteredItems.value);

const visibleLoans = computed(() => loans.value);

const visibleActiveLoans = computed(() => activeLoans.value);

const filteredItems = computed(() => items.value);

const teacherNameById = computed(() => {
  const map = new Map();
  for (const teacher of teacherUsers.value) {
    map.set(String(teacher.id), teacher.full_name || teacher.username || "-");
  }
  return map;
});

const paginationLabel = (meta) => {
  const total = Number(meta?.total || 0);
  const page = Number(meta?.page || 1);
  const pages = Number(meta?.totalPages || 1);
  if (!total) {
    return "0 data";
  }
  return `Halaman ${page} dari ${pages} • ${total} data`;
};

const itemQueryParams = computed(() => ({
  page: itemsPage.value,
  limit: itemsPageSize,
  include_inactive: canManageInventory.value ? 1 : undefined,
  search: search.value || undefined,
}));

const resolveTeacherName = (loan) => {
  const directName = String(loan?.teacher_name || "").trim();
  if (directName) {
    return directName;
  }
  const teacherId = loan?.teacher_id;
  if (teacherId !== undefined && teacherId !== null && teacherNameById.value.has(String(teacherId))) {
    return teacherNameById.value.get(String(teacherId));
  }
  return "-";
};

const setMessage = (text, error = false) => {
  message.value = text;
  isError.value = error;
};

const normalizePagedResponse = (response, fallbackMeta) => ({
  items: Array.isArray(response?.data?.items) ? response.data.items : [],
  page: Number(response?.data?.page || fallbackMeta.page || 1),
  limit: Number(response?.data?.limit || fallbackMeta.limit || 10),
  total: Number(response?.data?.total || 0),
  totalPages: Number(response?.data?.totalPages || fallbackMeta.totalPages || 1),
});

const loadData = async () => {
  isLoading.value = true;
  try {
    const requestLimit = canManageInventory.value ? 25 : 20;
    const inventoryRequests = [
      api.get("/inventory/items", {
        params: {
          include_inactive: canManageInventory.value ? 1 : undefined,
          page: itemsPage.value,
          limit: requestLimit,
          search: search.value || undefined,
        },
      }),
      api.get("/inventory/loans", {
        params: {
          page: loansPage.value,
          limit: loansPageSize,
        },
      }),
      canManageInventory.value
        ? api.get("/inventory/overview")
        : Promise.resolve(null),
      api.get("/inventory/active-loans", {
        params: {
          page: activeLoansPage.value,
          limit: activeLoansPageSize,
        },
      }),
      canManageInventory.value || isStudentRole.value
        ? api.get(isStudentRole.value ? "/auth/teachers/student" : "/auth/teachers")
        : Promise.resolve(null),
      isStudentRole.value
        ? api.get("/auth/schedule-options")
        : Promise.resolve(null),
    ];

    const [itemsResponse, loansResponse, inventoryMetaResponse, activeLoansResponse, teacherResponse, scheduleResponse] = await Promise.all(
      inventoryRequests,
    );

    const itemsData = normalizePagedResponse(itemsResponse, itemsMeta.value);
    const loansData = normalizePagedResponse(loansResponse, loansMeta.value);

    items.value = itemsData.items;
    itemsMeta.value = itemsData;
    loans.value = loansData.items;
    loansMeta.value = loansData;

    if (canManageInventory.value) {
      overview.value = inventoryMetaResponse?.data || {};
    } else {
      overview.value = {};
    }

    const activeData = normalizePagedResponse(activeLoansResponse, activeLoansMeta.value);
    activeLoansSchool.value = activeData.items;
    activeLoansMeta.value = activeData;

    if (!canManageInventory.value) {
      activeLoansSchool.value = activeData.items;
    }

    teacherUsers.value = Array.isArray(teacherResponse?.data?.data) ? teacherResponse.data.data : [];
    scheduleOptions.value = Array.isArray(scheduleResponse?.data?.data) ? scheduleResponse.data.data : [];
  } catch (error) {
    setMessage(error.message || "Gagal memuat data inventaris.", true);
    pushToast({
      title: "Gagal Memuat Inventaris",
      message: error.message || "Data inventaris tidak berhasil dimuat.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const openItemModal = () => {
  resetItemForm();
  itemModalOpen.value = true;
};

const openCatalogModal = () => {
  catalogModalOpen.value = true;
};

const closeCatalogModal = () => {
  catalogModalOpen.value = false;
};

const reloadPageData = async () => {
  await loadData();
};

const setItemsPage = (page) => {
  const nextPage = Math.min(Math.max(1, page), totalPages(itemsMeta.value));
  if (nextPage !== itemsPage.value) {
    itemsPage.value = nextPage;
    loadData();
  }
};

const setLoansPage = (page) => {
  const nextPage = Math.min(Math.max(1, page), totalPages(loansMeta.value));
  if (nextPage !== loansPage.value) {
    loansPage.value = nextPage;
    loadData();
  }
};

const setActiveLoansPage = (page) => {
  const nextPage = Math.min(Math.max(1, page), totalPages(activeLoansMeta.value));
  if (nextPage !== activeLoansPage.value) {
    activeLoansPage.value = nextPage;
    loadData();
  }
};

const startEditItem = (item) => {
  editingItemId.value = item.id;
  Object.assign(itemForm, {
    name: item.name || "",
    code: item.code || "",
    category: item.category || "",
    description: item.description || "",
    condition_status: item.condition_status || "BAIK",
    total_quantity: numberValue(item.total_quantity || 1),
    is_active: Boolean(item.is_active),
  });
  itemModalOpen.value = true;
};

const submitItem = async () => {
  isSavingItem.value = true;
  try {
    const payload = {
      name: itemForm.name,
      code: itemForm.code || null,
      category: itemForm.category || null,
      description: itemForm.description || null,
      condition_status: itemForm.condition_status,
      total_quantity: numberValue(itemForm.total_quantity || 1),
      is_active: Boolean(itemForm.is_active),
    };

    const response = editingItemId.value
      ? await api.put(`/inventory/items/${editingItemId.value}`, payload)
      : await api.post("/inventory/items", payload);

    await loadData();
    resetItemForm();
    itemModalOpen.value = false;
    setMessage(response?.message || "Barang berhasil disimpan.");
    pushToast({
      title: "Barang Tersimpan",
      message: response?.message || "Data barang berhasil disimpan.",
      type: "success",
    });
  } catch (error) {
    setMessage(error.message || "Gagal menyimpan barang.", true);
    pushToast({
      title: "Gagal Menyimpan Barang",
      message: error.message || "Data barang gagal disimpan.",
      type: "error",
    });
  } finally {
    isSavingItem.value = false;
  }
};

const deleteItem = async (item) => {
  openConfirmModal({
    title: "Nonaktifkan Barang",
    message: `Nonaktifkan barang "${item.name || item.code || '-'}"?`,
    actionLabel: "Nonaktifkan",
    toneClass: "bg-rose-600 hover:bg-rose-500",
    action: async () => {
      try {
        const response = await api.delete(`/inventory/items/${item.id}`);
        await loadData();
        setMessage(response?.message || "Barang berhasil dihapus.");
        pushToast({
          title: "Barang Dihapus",
          message: response?.message || "Barang berhasil dihapus.",
          type: "success",
        });
      } catch (error) {
        setMessage(error.message || "Gagal menghapus barang.", true);
        pushToast({
          title: "Gagal Menghapus Barang",
          message: error.message || "Barang tidak berhasil dihapus.",
          type: "error",
        });
      }
    },
  });
};

const openBorrowModal = (item) => {
  if (!isStudentRole.value || numberValue(item.available_quantity) <= 0) {
    return;
  }

  closeCatalogModal();
  selectedItem.value = item;
  borrowForm.quantity = 1;
  borrowForm.teacher_id = "";
  borrowForm.schedule_slot_id = "";
  borrowForm.notes = "";
  borrowModalOpen.value = true;
};

const closeBorrowModal = () => {
  if (isBorrowing.value) {
    return;
  }
  borrowModalOpen.value = false;
  selectedItem.value = null;
};

const submitBorrow = async () => {
  if (!selectedItem.value?.id) {
    return;
  }

  isBorrowing.value = true;
  try {
    const response = await api.post("/inventory/loans", {
      item_id: selectedItem.value.id,
      quantity: numberValue(borrowForm.quantity || 1),
      teacher_id: borrowForm.teacher_id ? Number(borrowForm.teacher_id) : null,
      schedule_slot_id: borrowForm.schedule_slot_id ? Number(borrowForm.schedule_slot_id) : null,
      notes: borrowForm.notes || null,
    });
    await loadData();
    borrowModalOpen.value = false;
    selectedItem.value = null;
    pushToast({
      title: "Pinjaman Tercatat",
      message: response?.message || "Barang berhasil dipinjam.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Meminjam Barang",
      message: error.message || "Barang tidak berhasil dipinjam.",
      type: "error",
    });
  } finally {
    isBorrowing.value = false;
  }
};

const returnLoan = async (loan) => {
  openConfirmModal({
    title: isStudentRole.value ? "Ajukan Pengembalian" : "Acc Pengembalian",
    message: isStudentRole.value
      ? `Ajukan pengembalian barang "${loan.item_name || '-'}" yang dipinjam ${loan.borrower_name || '-'}?`
      : `Setujui pengembalian barang "${loan.item_name || '-'}" yang dipinjam ${loan.borrower_name || '-'}?`,
    actionLabel: isStudentRole.value ? "Ajukan" : "Acc",
    toneClass: "bg-emerald-600 hover:bg-emerald-500",
    action: async () => {
      try {
        const response = await api.post(`/inventory/loans/${loan.id}/return`);
        await loadData();
        pushToast({
          title: isStudentRole.value ? "Pengembalian Diajukan" : "Pengembalian Disetujui",
          message: response?.message || (isStudentRole.value ? "Pengembalian berhasil diajukan." : "Peminjaman berhasil ditandai selesai."),
          type: "success",
        });
      } catch (error) {
        pushToast({
          title: isStudentRole.value ? "Gagal Mengajukan Pengembalian" : "Gagal Acc Pengembalian",
          message: error.message || (isStudentRole.value ? "Pengembalian tidak berhasil diajukan." : "Peminjaman tidak berhasil dikembalikan."),
          type: "error",
        });
      }
    },
  });
};

onMounted(loadData);

watch(search, () => {
  itemsPage.value = 1;
  loadData();
});
</script>
