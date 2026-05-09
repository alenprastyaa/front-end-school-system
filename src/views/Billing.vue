<template>
  <div class="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-6">
      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
              {{ isSuperAdmin ? "Super Admin" : "Admin Sekolah" }}
            </p>
            <h1 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Billing Sekolah</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {{ isSuperAdmin ? "Atur nominal, tanggal jatuh tempo, dan status billing untuk setiap sekolah." : "Lihat tagihan aktif sekolah Anda dan selesaikan pembayaran melalui QRIS Xendit." }}
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button
              @click="loadData"
              :disabled="isLoading"
              class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {{ isLoading ? "Memuat..." : "Refresh" }}
            </button>
          </div>
        </div>
      </section>

      <section v-if="message" class="rounded-2xl px-5 py-4 text-sm font-medium ring-1 ring-inset"
        :class="isError ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20'">
        {{ message }}
      </section>

      <section
        v-if="paymentNotice"
        class="rounded-2xl px-5 py-4 text-sm font-medium ring-1 ring-inset"
        :class="paymentNoticeType === 'success'
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20'
          : 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20'"
      >
        {{ paymentNotice }}
      </section>

      <section v-if="isSuperAdmin" class="grid gap-6 xl:grid-cols-[360px,1fr]">
        <form @submit.prevent="saveBilling" class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ editingSchoolId ? "Edit Billing" : "Set Billing" }}</p>
          <h2 class="mt-2 text-xl font-bold text-slate-900 dark:text-white">Setup Billing Sekolah</h2>
          <div class="mt-5 space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Sekolah</label>
              <select v-model="billingForm.school_id" required class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                <option value="">Pilih sekolah</option>
                <option v-for="school in schools" :key="school.id" :value="String(school.id)">{{ school.name }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Billing</label>
              <input v-model="billingForm.billing_name" type="text" required class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nominal</label>
                <input v-model="billingForm.amount" type="number" min="1" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mata Uang</label>
                <input v-model="billingForm.currency" type="text" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jatuh Tempo Hari</label>
                <input v-model="billingForm.due_day_of_month" type="number" min="1" max="28" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
              </div>
              <label class="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                <input v-model="billingForm.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                Billing aktif
              </label>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Catatan</label>
              <textarea v-model="billingForm.notes" rows="4" class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"></textarea>
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button type="submit" :disabled="isSaving" class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50">
              {{ isSaving ? "Menyimpan..." : "Simpan Billing" }}
            </button>
            <button type="button" @click="resetBillingForm" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
              Reset
            </button>
          </div>
        </form>

        <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Billing Per Sekolah</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Klik edit untuk ubah billing sekolah tertentu.</p>
              </div>
              <input v-model="search" type="text" placeholder="Cari sekolah..." class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 lg:max-w-sm dark:bg-slate-800 dark:text-white dark:ring-slate-700" />
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-medium sm:px-6">Sekolah</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Nama Billing</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Nominal</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Jatuh Tempo</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Status</th>
                  <th class="px-4 py-3 font-medium text-right sm:px-6">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in filteredBillings" :key="item.school_id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td class="px-4 py-4 sm:px-6">{{ item.school_name || "-" }}</td>
                  <td class="px-4 py-4 sm:px-6">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.billing_name || "-" }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.notes || "-" }}</div>
                  </td>
                  <td class="px-4 py-4 sm:px-6 font-semibold">{{ formatCurrency(item.amount) }}</td>
                  <td class="px-4 py-4 sm:px-6">Tanggal {{ item.due_day_of_month || "-" }}</td>
                  <td class="px-4 py-4 sm:px-6">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="item.is_active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'">
                      {{ item.is_active ? "Aktif" : "Nonaktif" }}
                    </span>
                  </td>
                  <td class="px-4 py-4 sm:px-6">
                    <div class="flex justify-end gap-2">
                      <button @click="editBilling(item)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Edit</button>
                      <button @click="createInvoice(item.school_id)" class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500">Buat Invoice</button>
                      <button @click="openInvoiceModal(item)" class="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500">Lihat Invoice</button>
                      <button @click="deleteBilling(item)" class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500">Hapus</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredBillings.length === 0">
                  <td colspan="6" class="px-4 py-10 text-center text-slate-500 dark:text-slate-400">Belum ada billing yang cocok.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section v-else class="grid gap-6 xl:grid-cols-[360px,1fr]">
        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Billing Aktif</p>
          <h2 class="mt-2 text-xl font-bold text-slate-900 dark:text-white">{{ activeBilling?.billing_name || "Belum ada billing" }}</h2>
          <div class="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div class="flex justify-between gap-3"><span>Nominal</span><strong class="text-slate-900 dark:text-white">{{ formatCurrency(activeBilling?.amount) }}</strong></div>
            <div class="flex justify-between gap-3"><span>Jatuh Tempo</span><strong class="text-slate-900 dark:text-white">Tanggal {{ activeBilling?.due_day_of_month || "-" }}</strong></div>
            <div class="flex justify-between gap-3"><span>Status</span><strong :class="activeBilling?.is_active ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'">{{ activeBilling?.is_active ? "Aktif" : "Nonaktif" }}</strong></div>
          </div>
        </section>

        <section class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Invoice Sekolah</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Klik bayar untuk membuka QRIS Xendit.</p>
              </div>
              <button @click="loadInvoices" :disabled="isLoadingInvoices" class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                {{ isLoadingInvoices ? "Memuat..." : "Refresh Invoice" }}
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-medium sm:px-6">Invoice</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Nominal</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Jatuh Tempo</th>
                  <th class="px-4 py-3 font-medium sm:px-6">Status</th>
                  <th class="px-4 py-3 font-medium text-right sm:px-6">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="item in invoices" :key="item.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td class="px-4 py-4 sm:px-6">
                    <div class="font-semibold text-slate-900 dark:text-white">{{ item.invoice_number }}</div>
                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.payment_method || "QRIS Xendit" }}</div>
                  </td>
                  <td class="px-4 py-4 sm:px-6 font-semibold">{{ formatCurrency(item.amount) }}</td>
                  <td class="px-4 py-4 sm:px-6">{{ formatDate(item.due_date) }}</td>
                  <td class="px-4 py-4 sm:px-6">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusClass(item.status)">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-4 py-4 sm:px-6">
                    <div class="flex justify-end gap-2">
                      <button v-if="item.status === 'PENDING'" @click="payInvoice(item)" class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500">Bayar QRIS</button>
                      <a v-if="item.snap_redirect_url" :href="item.snap_redirect_url" target="_blank" rel="noreferrer" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Buka</a>
                    </div>
                  </td>
                </tr>
                <tr v-if="invoices.length === 0">
                  <td colspan="5" class="px-4 py-10 text-center text-slate-500 dark:text-slate-400">Belum ada invoice.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="invoiceModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" @click.self="closeInvoiceModal">
        <div class="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Invoice Sekolah</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ selectedInvoiceSchoolName || "-" }}</p>
            </div>
            <button @click="closeInvoiceModal" class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">✕</button>
          </div>
          <div class="max-h-[70vh] overflow-auto p-6">
            <div class="mb-4 flex items-center justify-between gap-3">
              <p class="text-sm text-slate-500 dark:text-slate-400">Daftar invoice untuk sekolah yang dipilih.</p>
              <button @click="refreshSelectedInvoices" :disabled="isLoadingInvoices" class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                {{ isLoadingInvoices ? "Memuat..." : "Refresh" }}
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                  <tr>
                    <th class="px-4 py-3 font-medium sm:px-6">Invoice</th>
                    <th class="px-4 py-3 font-medium sm:px-6">Nominal</th>
                    <th class="px-4 py-3 font-medium sm:px-6">Jatuh Tempo</th>
                    <th class="px-4 py-3 font-medium sm:px-6">Status</th>
                    <th class="px-4 py-3 font-medium text-right sm:px-6">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="item in invoices" :key="item.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td class="px-4 py-4 sm:px-6">
                      <div class="font-semibold text-slate-900 dark:text-white">{{ item.invoice_number }}</div>
                      <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.payment_method || "QRIS Xendit" }}</div>
                    </td>
                    <td class="px-4 py-4 sm:px-6 font-semibold">{{ formatCurrency(item.amount) }}</td>
                    <td class="px-4 py-4 sm:px-6">{{ formatDate(item.due_date) }}</td>
                    <td class="px-4 py-4 sm:px-6">
                      <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusClass(item.status)">
                        {{ item.status }}
                      </span>
                    </td>
                    <td class="px-4 py-4 sm:px-6">
                      <div class="flex justify-end">
                        <button @click="deleteInvoice(item)" class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500">Hapus</button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="invoices.length === 0">
                    <td colspan="5" class="px-4 py-10 text-center text-slate-500 dark:text-slate-400">Belum ada invoice.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="paymentQrModalOpen" class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" @click.self="closePaymentQrModal">
        <div class="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">QRIS Pembayaran</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ paymentQrReference || "-" }}</p>
          </div>
          <div class="space-y-4 px-6 py-5">
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Salin string QR ini atau pindai dengan aplikasi yang mendukung QRIS.
            </p>
            <div class="flex justify-center rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
              <img v-if="paymentQrDataUrl" :src="paymentQrDataUrl" alt="QRIS Pembayaran" class="h-64 w-64 rounded-2xl bg-white p-2 shadow-sm" />
              <pre v-else class="max-h-60 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-slate-800 dark:text-slate-200">{{ paymentQrString }}</pre>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button @click="copyPaymentQrString" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Salin QR
            </button>
            <button @click="closePaymentQrModal" class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="deleteInvoiceModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" @click.self="closeDeleteInvoiceModal">
        <div class="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Hapus Invoice</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Konfirmasi penghapusan invoice yang sudah terbit.
            </p>
          </div>
          <div class="px-6 py-5">
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Invoice <span class="font-semibold text-slate-900 dark:text-white">{{ pendingDeleteInvoice?.invoice_number || "-" }}</span>
              akan dihapus permanen. Aksi ini tidak bisa dibatalkan.
            </p>
          </div>
          <div class="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button @click="closeDeleteInvoiceModal" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Batal
            </button>
            <button @click="confirmDeleteInvoice" :disabled="isDeletingInvoice" class="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50">
              {{ isDeletingInvoice ? "Menghapus..." : "Hapus Invoice" }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import QRCode from "qrcode";
import { api } from "@/api";
import { getStoredRole } from "@/utils/auth";
import { pushToast } from "@/composables/useToast";

const route = useRoute();
const role = getStoredRole();
const isSuperAdmin = computed(() => role === "SUPER_ADMIN");
const isLoading = ref(false);
const isSaving = ref(false);
const isLoadingInvoices = ref(false);
const message = ref("");
const isError = ref(false);
const paymentNotice = ref("");
const paymentNoticeType = ref("success");
const schools = ref([]);
const billings = ref([]);
const invoices = ref([]);
const search = ref("");
const activeBilling = ref(null);
const editingSchoolId = ref("");
const invoiceModalOpen = ref(false);
const selectedInvoiceSchoolId = ref("");
const selectedInvoiceSchoolName = ref("");
const paymentQrModalOpen = ref(false);
const paymentQrString = ref("");
const paymentQrReference = ref("");
const paymentQrDataUrl = ref("");
const deleteInvoiceModalOpen = ref(false);
const pendingDeleteInvoice = ref(null);
const isDeletingInvoice = ref(false);

const billingForm = reactive({
  school_id: "",
  billing_name: "",
  amount: 0,
  currency: "IDR",
  due_day_of_month: 10,
  is_active: true,
  notes: "",
});

const filteredBillings = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return billings.value;
  return billings.value.filter((item) => `${item.school_name || ""} ${item.billing_name || ""}`.toLowerCase().includes(term));
});

const formatCurrency = (value) => {
  const number = Number(value || 0);
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date);
};

const statusClass = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "PAID") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  if (normalized === "PENDING") return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
};

const normalizePaymentStatus = () => {
  const raw = String(route.query.payment_status || route.query.result || route.query.status || "").toLowerCase();
  if (!raw) return "";
  if (["success", "sukses", "paid", "settlement"].includes(raw)) return "success";
  if (["failed", "fail", "gagal", "expire", "expired", "cancel", "denied"].includes(raw)) return "failed";
  return "";
};

const applyPaymentNoticeFromRoute = () => {
  const status = normalizePaymentStatus();
  const refId = String(route.query.reference_id || route.query.order_id || "").trim();

  if (!status) {
    paymentNotice.value = "";
    return;
  }

  paymentNoticeType.value = status;
  paymentNotice.value =
    status === "success"
      ? `Pembayaran ${refId ? `${refId} ` : ""}berhasil diproses.`
      : `Pembayaran ${refId ? `${refId} ` : ""}gagal atau dibatalkan.`;
};

const resetBillingForm = () => {
  editingSchoolId.value = "";
  billingForm.school_id = "";
  billingForm.billing_name = "";
  billingForm.amount = 0;
  billingForm.currency = "IDR";
  billingForm.due_day_of_month = 10;
  billingForm.is_active = true;
  billingForm.notes = "";
};

const loadSuperAdminData = async () => {
  const [schoolResponse, billingData] = await Promise.all([
    api.get("/school"),
    Promise.all((schools.value || []).map(async (school) => {
      try {
        const response = await api.get(`/school/${school.id}/billing`);
        return { school_id: school.id, school_name: school.name, ...(response?.data?.item || response?.data || {}) };
      } catch {
        return { school_id: school.id, school_name: school.name };
      }
    })),
  ]);
  schools.value = schoolResponse?.data?.items || [];
  billings.value = billingData;
};

const loadAdminData = async () => {
  const [billingResponse, invoiceResponse] = await Promise.all([
    api.get("/billing/current"),
    api.get("/billing/current/invoices"),
  ]);
  activeBilling.value = billingResponse?.data?.item || billingResponse?.data || null;
  invoices.value = invoiceResponse?.data || [];
};

const loadData = async () => {
  isLoading.value = true;
  message.value = "";
  isError.value = false;
  try {
    if (isSuperAdmin.value) {
      const schoolResponse = await api.get("/school");
      schools.value = schoolResponse?.data?.items || [];
      const rows = [];
      for (const school of schools.value) {
        try {
          const response = await api.get(`/school/${school.id}/billing`);
          rows.push({ school_id: school.id, school_name: school.name, ...(response?.data?.item || response?.data || {}) });
        } catch {
          rows.push({ school_id: school.id, school_name: school.name });
        }
      }
      billings.value = rows;
    } else {
      await loadAdminData();
    }
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({ title: "Billing", message: error.message, type: "error" });
  } finally {
    isLoading.value = false;
  }
};

const editBilling = (item) => {
  editingSchoolId.value = String(item.school_id || "");
  billingForm.school_id = String(item.school_id || "");
  billingForm.billing_name = item.billing_name || "";
  billingForm.amount = item.amount || 0;
  billingForm.currency = item.currency || "IDR";
  billingForm.due_day_of_month = item.due_day_of_month || 10;
  billingForm.is_active = Boolean(item.is_active);
  billingForm.notes = item.notes || "";
};

const saveBilling = async () => {
  isSaving.value = true;
  try {
    const response = await api.put(`/school/${billingForm.school_id}/billing`, {
      billing_name: billingForm.billing_name,
      amount: Number(billingForm.amount) || 0,
      currency: billingForm.currency,
      due_day_of_month: Number(billingForm.due_day_of_month) || 10,
      is_active: Boolean(billingForm.is_active),
      notes: billingForm.notes || null,
    });
    pushToast({ title: "Billing Disimpan", message: response?.message || "Billing sekolah berhasil disimpan.", type: "success" });
    await loadData();
    resetBillingForm();
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan Billing", message: error.message, type: "error" });
  } finally {
    isSaving.value = false;
  }
};

const loadInvoicesForSchool = async (schoolId) => {
  try {
    const response = await api.get(`/school/${schoolId}/billing/invoices`);
    invoices.value = response?.data || [];
  } catch (error) {
    pushToast({ title: "Gagal Memuat Invoice", message: error.message, type: "error" });
  }
};

const openInvoiceModal = async (item) => {
  selectedInvoiceSchoolId.value = String(item.school_id || "");
  selectedInvoiceSchoolName.value = item.school_name || "-";
  invoiceModalOpen.value = true;
  await loadInvoicesForSchool(item.school_id);
};

const openPaymentQrModal = (response, item) => {
  paymentQrReference.value = item?.invoice_number || response?.data?.invoice?.invoice_number || "";
  paymentQrString.value = response?.data?.qr_string || "";
  paymentQrDataUrl.value = "";
  paymentQrModalOpen.value = Boolean(paymentQrString.value);

  if (!paymentQrString.value) {
    return;
  }

  QRCode.toDataURL(paymentQrString.value, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  })
    .then((dataUrl) => {
      paymentQrDataUrl.value = dataUrl;
    })
    .catch((error) => {
      paymentQrDataUrl.value = "";
      pushToast({ title: "QRIS", message: error.message, type: "error" });
    });
};

const closePaymentQrModal = () => {
  paymentQrModalOpen.value = false;
  paymentQrString.value = "";
  paymentQrReference.value = "";
  paymentQrDataUrl.value = "";
};

const closeInvoiceModal = () => {
  invoiceModalOpen.value = false;
  selectedInvoiceSchoolId.value = "";
  selectedInvoiceSchoolName.value = "";
  invoices.value = [];
};

const refreshSelectedInvoices = async () => {
  if (!selectedInvoiceSchoolId.value) return;
  await loadInvoicesForSchool(selectedInvoiceSchoolId.value);
};

const createInvoice = async (schoolId) => {
  try {
    const response = await api.post(`/school/${schoolId}/billing/invoices`, {});
    pushToast({ title: "Invoice Dibuat", message: response?.message || "Invoice berhasil dibuat.", type: "success" });
    await loadInvoicesForSchool(schoolId);
  } catch (error) {
    pushToast({ title: "Gagal Membuat Invoice", message: error.message, type: "error" });
  }
};

const loadInvoices = async () => {
  isLoadingInvoices.value = true;
  try {
    const response = await api.get("/billing/current/invoices");
    invoices.value = response?.data || [];
  } catch (error) {
    pushToast({ title: "Gagal Memuat Invoice", message: error.message, type: "error" });
  } finally {
    isLoadingInvoices.value = false;
  }
};

const payInvoice = async (item) => {
  try {
    const response = await api.post(`/billing/current/invoices/${item.id}/pay`);
    const redirectUrl = response?.data?.redirect_url || response?.data?.invoice?.snap_redirect_url;
    const qrString = response?.data?.qr_string || "";
    if (qrString) {
      openPaymentQrModal(response, item);
      return;
    }
    if (redirectUrl) {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
      return;
    }
    pushToast({ title: "Pembayaran", message: "Link pembayaran belum tersedia.", type: "error" });
  } catch (error) {
    pushToast({ title: "Gagal Membuat Pembayaran", message: error.message, type: "error" });
  }
};

const deleteBilling = async (item) => {
  const confirmed = window.confirm(`Hapus billing untuk ${item.school_name || "sekolah ini"}? Tindakan ini akan menghapus setting billing, bukan invoice lama.`);
  if (!confirmed) return;

  try {
    await api.delete(`/school/${item.school_id}/billing`);
    pushToast({ title: "Billing Dihapus", message: "Billing sekolah berhasil dihapus.", type: "success" });
    await loadData();
  } catch (error) {
    pushToast({ title: "Gagal Menghapus Billing", message: error.message, type: "error" });
  }
};

const deleteInvoice = async (item) => {
  pendingDeleteInvoice.value = item;
  deleteInvoiceModalOpen.value = true;
};

const closeDeleteInvoiceModal = () => {
  deleteInvoiceModalOpen.value = false;
  pendingDeleteInvoice.value = null;
};

const confirmDeleteInvoice = async () => {
  if (!pendingDeleteInvoice.value) return;
  isDeletingInvoice.value = true;
  try {
    if (!selectedInvoiceSchoolId.value) {
      throw new Error("Sekolah invoice belum dipilih");
    }
    await api.delete(`/school/${selectedInvoiceSchoolId.value}/billing/invoices/${pendingDeleteInvoice.value.id}`);
    pushToast({ title: "Invoice Dihapus", message: "Invoice berhasil dihapus.", type: "success" });
    closeDeleteInvoiceModal();
    await refreshSelectedInvoices();
    await loadData();
  } catch (error) {
    pushToast({ title: "Gagal Menghapus Invoice", message: error.message, type: "error" });
  } finally {
    isDeletingInvoice.value = false;
  }
};

const copyPaymentQrString = async () => {
  if (!paymentQrString.value) return;
  try {
    await navigator.clipboard.writeText(paymentQrString.value);
    pushToast({ title: "QRIS Disalin", message: "String QR berhasil disalin.", type: "success" });
  } catch (error) {
    pushToast({ title: "Gagal Menyalin QRIS", message: error.message, type: "error" });
  }
};

watch(
  () => route.query,
  () => {
    applyPaymentNoticeFromRoute();
  },
  { immediate: true },
);

onMounted(loadData);
</script>
