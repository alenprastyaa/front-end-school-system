<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <!-- TOP NAVIGATION BARR -->
    <header class="sticky top-0 z-10 bg-gradient-to-r from-orange-500 to-orange-600 shadow-md">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 p-4 md:px-8">
        <!-- Brand -->
        <div class="hidden items-center gap-2 md:flex">
          <Icon icon="ph:storefront-duotone" class="h-8 w-8 text-white" />
          <h1 class="text-xl font-bold tracking-tight text-white">KoperasiKu</h1>
        </div>

        <!-- Search Bar -->
        <div class="relative flex-1 max-w-3xl">
          <input v-model.trim="searchQuery" type="text" placeholder="Cari produk, kode, atau kategori..."
            class="w-full rounded-sm border-0 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 shadow-inner focus:ring-2 focus:ring-orange-300" />
          <button class="absolute right-0 top-0 h-full rounded-r-sm bg-orange-600 px-4 transition hover:bg-orange-700">
            <Icon icon="ph:magnifying-glass-bold" class="h-5 w-5 text-white" />
          </button>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-4">

          <div class="relative cursor-pointer" @click="activeTab = 'shop'">
            <Icon icon="ph:shopping-cart-simple-bold" class="h-7 w-7 text-white" />
            <span v-if="cartTotalItems > 0"
              class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-orange-500 bg-white text-[10px] font-bold text-orange-600">
              {{ cartTotalItems }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl p-4 pb-28 md:p-8">
      <!-- NOTIFICATIONS -->
      <section v-if="message" class="mb-6 rounded-sm px-4 py-3 text-sm font-medium shadow-sm"
        :class="isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'">
        {{ message }}
      </section>

      <!-- NAVIGATION TABS -->
      <nav
        class="mb-6 flex overflow-x-auto rounded-sm bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
        <button @click="activeTab = 'shop'"
          class="flex-1 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-semibold transition-colors"
          :class="activeTab === 'shop' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-orange-500'">
          Belanja
        </button>
        <button @click="activeTab = 'orders'"
          class="flex-1 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-semibold transition-colors"
          :class="activeTab === 'orders' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-orange-500'">
          Riwayat Pesanan
        </button>
        <button v-if="canManage" @click="activeTab = 'manage'"
          class="flex-1 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-semibold transition-colors"
          :class="activeTab === 'manage' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-orange-500'">
          Kelola Produk
        </button>
      </nav>

      <!-- TAB CONTENT: SHOP -->
      <div v-show="activeTab === 'shop'" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div class="space-y-4">
          <!-- Categories Banner/Pills -->
          <div
            class="flex items-center gap-2 overflow-x-auto bg-white p-4 rounded-sm shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
            <span class="text-sm font-medium text-gray-500 mr-2">Kategori:</span>
            <button @click="selectedCategory = ''"
              class="whitespace-nowrap rounded-sm px-4 py-1.5 text-sm transition-colors border"
              :class="selectedCategory === '' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 bg-white text-gray-600 hover:border-orange-500'">
              Semua
            </button>
            <button v-for="category in categories" :key="category" @click="selectedCategory = category"
              class="whitespace-nowrap rounded-sm px-4 py-1.5 text-sm transition-colors border"
              :class="selectedCategory === category ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 bg-white text-gray-600 hover:border-orange-500'">
              {{ category }}
            </button>
          </div>

          <!-- Product Grid -->
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            <article v-for="product in filteredProducts" :key="product.id"
              class="relative flex flex-col overflow-hidden rounded-sm border-2 border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-gray-900">
              <!-- Image 1:1 Ratio -->
              <div class="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                <img v-if="product.image_url" :src="normalizePublicUrl(product.image_url)" :alt="product.name"
                  class="h-full w-full object-cover" />
                <div v-else class="flex h-full items-center justify-center">
                  <Icon icon="ph:image" class="h-10 w-10 text-gray-300" />
                </div>
                <!-- Out of stock overlay -->
                <div v-if="Number(product.stock || 0) <= 0"
                  class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span
                    class="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">Habis</span>
                </div>
              </div>

              <!-- Content -->
              <div class="flex flex-1 flex-col p-3">
                <h3 class="line-clamp-2 min-h-[40px] text-sm text-gray-800 dark:text-gray-200" :title="product.name">
                  {{ product.name }}
                </h3>
                <div class="mt-auto pt-2 flex items-end justify-between">
                  <div>
                    <p class="text-base font-bold text-orange-600">{{ formatCurrency(product.price) }}</p>
                    <p class="text-[11px] text-gray-500 mt-0.5">Sisa {{ product.stock || 0 }}</p>
                  </div>
                  <button :disabled="!product.is_active || Number(product.stock || 0) <= 0"
                    class="flex h-8 w-8 items-center justify-center rounded-sm bg-orange-500 text-white transition hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    @click="addToCart(product)">
                    <Icon icon="ph:shopping-cart-bold" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>

            <div v-if="filteredProducts.length === 0"
              class="col-span-full rounded-sm bg-white p-12 text-center shadow-sm dark:bg-gray-900">
              <Icon icon="ph:magnifying-glass-duotone" class="mx-auto h-12 w-12 text-gray-300" />
              <p class="mt-4 text-sm font-medium text-gray-900 dark:text-white">Produk tidak ditemukan</p>
            </div>
          </div>
        </div>

        <!-- Sticky Cart Sidebar -->
        <aside class="hidden xl:block">
          <div
            class="sticky top-24 rounded-sm bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
            <div class="mb-4 flex items-center justify-between border-b pb-3">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Keranjang</h2>
              <button class="text-xs font-medium text-red-500 hover:text-red-600" :disabled="cart.length === 0"
                @click="clearCart">
                Hapus Semua
              </button>
            </div>

            <div class="max-h-[400px] overflow-y-auto pr-2 space-y-4">
              <div v-for="item in cartDetails" :key="item.product.id" class="flex gap-3">
                <img v-if="item.product.image_url" :src="normalizePublicUrl(item.product.image_url)"
                  class="h-12 w-12 rounded-sm object-cover bg-gray-100" />
                <div v-else class="h-12 w-12 rounded-sm bg-gray-100 flex items-center justify-center">
                  <Icon icon="ph:image" class="text-gray-400" />
                </div>

                <div class="flex-1 text-sm">
                  <p class="line-clamp-1 font-medium text-gray-800 dark:text-gray-200">{{ item.product.name }}</p>
                  <p class="text-orange-600 font-semibold">{{ formatCurrency(item.product.price) }}</p>

                  <div class="mt-2 flex items-center gap-2">
                    <button
                      class="flex h-6 w-6 items-center justify-center rounded-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
                      @click="decreaseQuantity(item.product.id)">-</button>
                    <span class="min-w-[1.5rem] text-center text-xs font-medium">{{ item.quantity }}</span>
                    <button
                      class="flex h-6 w-6 items-center justify-center rounded-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
                      @click="increaseQuantity(item.product)">+</button>
                  </div>
                </div>
              </div>
              <div v-if="cartDetails.length === 0" class="py-8 text-center text-sm text-gray-400">
                Belum ada produk di keranjang.
              </div>
            </div>

            <div class="mt-4 border-t pt-4">
              <div class="mb-3 space-y-3">
                <div>
                  <label class="text-[11px] font-semibold uppercase text-gray-500">Metode Pembayaran</label>
                  <select v-model="checkoutForm.payment_method"
                    class="mt-1 block w-full rounded-sm border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500">
                    <option value="TUNAI">Tunai</option>
                    <option value="NON_TUNAI">Non Tunai (QRIS)</option>
                  </select>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {{
                      checkoutForm.payment_method === 'TUNAI'
                        ? 'Pembayaran dilakukan langsung saat barang diantar atau diambil di koperasi.'
                        : 'QRIS Xendit akan ditampilkan setelah pesanan dibuat.'
                    }}
                  </p>
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase text-gray-500">Catatan</label>
                  <input v-model="checkoutForm.note" type="text" placeholder="Pesan untuk penjual..."
                    class="mt-1 block w-full rounded-sm border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
              </div>

              <div class="mb-4 flex items-center justify-between">
                <span class="text-sm text-gray-600">Total Harga</span>
                <span class="text-lg font-bold text-orange-600">{{ formatCurrency(cartTotal) }}</span>
              </div>
              <button
                class="w-full rounded-sm bg-orange-600 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                :disabled="isSubmittingOrder || cartDetails.length === 0" @click="submitOrder">
                {{ isSubmittingOrder ? "Memproses..." : "Checkout" }}
              </button>
            </div>
          </div>
        </aside>
      </div>

      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <button
          v-if="activeTab === 'shop'"
          type="button"
          class="fixed bottom-4 right-4 z-[120] inline-flex items-center gap-3 rounded-full bg-orange-600 px-4 py-3 text-white shadow-2xl ring-1 ring-orange-400/30 md:hidden"
          @click="mobileCartOpen = true"
        >
          <span class="relative flex items-center justify-center">
            <Icon icon="ph:shopping-cart-simple-bold" class="h-5 w-5" />
            <span
              v-if="cartTotalItems > 0"
              class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-white text-[10px] font-bold text-orange-600"
            >
              {{ cartTotalItems }}
            </span>
          </span>
          <span class="text-left">
            <span class="block text-[11px] font-medium uppercase tracking-[0.18em] text-orange-100">Keranjang</span>
            <span class="block text-sm font-semibold">
              {{ cartTotalItems > 0 ? formatCurrency(cartTotal) : "Kosong" }}
            </span>
          </span>
        </button>
      </transition>

      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileCartOpen"
          class="fixed inset-0 z-[135] bg-slate-950/60 backdrop-blur-sm md:hidden"
          @click.self="mobileCartOpen = false"
        >
          <div
            class="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-[2rem] bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10"
          >
            <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 dark:text-orange-300">Keranjang</p>
                <h3 class="mt-1 text-lg font-black text-slate-900 dark:text-white">Pesanan Anda</h3>
              </div>
              <button
                type="button"
                class="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                @click="mobileCartOpen = false"
              >
                Tutup
              </button>
            </div>

            <div class="max-h-[42vh] overflow-y-auto px-5 py-4 space-y-4">
              <div v-for="item in cartDetails" :key="`mobile-${item.product.id}`" class="flex gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <img v-if="item.product.image_url" :src="normalizePublicUrl(item.product.image_url)"
                  class="h-14 w-14 rounded-xl object-cover bg-gray-100" />
                <div v-else class="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800">
                  <Icon icon="ph:image" class="text-gray-400" />
                </div>

                <div class="min-w-0 flex-1 text-sm">
                  <p class="line-clamp-2 font-semibold text-slate-900 dark:text-white">{{ item.product.name }}</p>
                  <p class="mt-1 text-orange-600 font-bold">{{ formatCurrency(item.product.price) }}</p>

                  <div class="mt-3 flex items-center gap-2">
                    <button
                      class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      @click="decreaseQuantity(item.product.id)"
                    >
                      -
                    </button>
                    <span class="min-w-[2rem] text-center text-sm font-semibold text-slate-900 dark:text-white">{{ item.quantity }}</span>
                    <button
                      class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      @click="increaseQuantity(item.product)"
                    >
                      +
                    </button>
                    <span class="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400">{{ formatCurrency(item.subtotal) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="cartDetails.length === 0" class="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Belum ada produk di keranjang.
              </div>
            </div>

            <div class="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
              <div class="mb-3 space-y-3">
                <div>
                  <label class="text-[11px] font-semibold uppercase text-gray-500">Metode Pembayaran</label>
                  <select v-model="checkoutForm.payment_method"
                    class="mt-1 block w-full rounded-xl border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500">
                    <option value="TUNAI">Tunai</option>
                    <option value="NON_TUNAI">Non Tunai (QRIS)</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase text-gray-500">Catatan</label>
                  <input v-model="checkoutForm.note" type="text" placeholder="Pesan untuk penjual..."
                    class="mt-1 block w-full rounded-xl border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
              </div>

              <div class="mb-4 flex items-center justify-between">
                <span class="text-sm text-gray-600">Total Harga</span>
                <span class="text-lg font-bold text-orange-600">{{ formatCurrency(cartTotal) }}</span>
              </div>
              <button
                class="w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                :disabled="isSubmittingOrder || cartDetails.length === 0" @click="submitOrder">
                {{ isSubmittingOrder ? "Memproses..." : "Checkout" }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- TAB CONTENT: ORDERS -->
      <div v-show="activeTab === 'orders'" class="space-y-6">
        <!-- Summary Cards for Orders Tab -->
        <section class="grid gap-4 md:grid-cols-4">
          <article v-for="card in summaryCards" :key="card.label"
            class="rounded-sm bg-white p-5 shadow-sm ring-1 ring-gray-100 border-l-4 border-orange-500 dark:bg-gray-900">
            <p class="text-xs font-semibold text-gray-500">{{ card.label }}</p>
            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ card.value }}</p>
          </article>
        </section>

        <section v-if="canManage" class="rounded-sm bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Ringkasan Laporan</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Periode {{ report?.range?.from || "-" }} sampai {{ report?.range?.to || "-" }}
              </p>
            </div>
          </div>
          <div class="grid gap-4 p-6 md:grid-cols-4">
            <article v-for="card in reportCards" :key="card.label"
              class="rounded-xl border border-orange-100 bg-orange-50/60 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
              <p class="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-200">{{ card.label }}</p>
              <p class="mt-2 text-2xl font-black text-orange-700 dark:text-orange-100">{{ card.value }}</p>
            </article>
          </div>
          <div class="grid gap-4 border-t p-6 lg:grid-cols-2">
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Status Pembayaran</h3>
              <div class="mt-3 space-y-2">
                <div v-for="row in report.payment_status_breakdown || []" :key="row.payment_status" class="flex items-center justify-between text-sm">
                  <span class="text-slate-600 dark:text-slate-300">{{ row.payment_status || "-" }}</span>
                  <span class="font-semibold text-slate-900 dark:text-white">{{ row.total }}</span>
                </div>
                <div v-if="(report.payment_status_breakdown || []).length === 0" class="text-sm text-slate-500">
                  Belum ada data.
                </div>
              </div>
            </div>
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Metode Pembayaran</h3>
              <div class="mt-3 space-y-2">
                <div v-for="row in report.payment_method_breakdown || []" :key="row.payment_method" class="flex items-center justify-between text-sm">
                  <span class="text-slate-600 dark:text-slate-300">{{ row.payment_method || "-" }}</span>
                  <span class="font-semibold text-slate-900 dark:text-white">{{ row.total }}</span>
                </div>
                <div v-if="(report.payment_method_breakdown || []).length === 0" class="text-sm text-slate-500">
                  Belum ada data.
                </div>
              </div>
            </div>
          </div>
          <div class="grid gap-4 border-t p-6 lg:grid-cols-2">
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Produk Terlaris</h3>
              <div class="mt-3 space-y-2">
                <div v-for="row in report.top_products || []" :key="`${row.product_name}-${row.product_code}`" class="flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p class="font-medium text-slate-900 dark:text-white">{{ row.product_name || "-" }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ row.product_category || "-" }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-slate-900 dark:text-white">{{ row.total_quantity }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatCurrency(row.revenue) }}</p>
                  </div>
                </div>
                <div v-if="(report.top_products || []).length === 0" class="text-sm text-slate-500">
                  Belum ada data.
                </div>
              </div>
            </div>
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Stok Menipis</h3>
              <div class="mt-3 space-y-2">
                <div v-for="row in report.low_stock_items || []" :key="row.id" class="flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p class="font-medium text-slate-900 dark:text-white">{{ row.name || "-" }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ row.category || "-" }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-rose-600">{{ Number(row.stock || 0) }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatCurrency(row.price) }}</p>
                  </div>
                </div>
                <div v-if="(report.low_stock_items || []).length === 0" class="text-sm text-slate-500">
                  Tidak ada stok yang menipis.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-sm bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900">
          <div class="border-b px-6 py-4">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Riwayat Pesanan</h2>
              <span
                class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                :class="isRealtimeConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ isRealtimeConnected ? "Live" : "Offline" }}
              </span>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 font-medium">No. Pesanan</th>
                  <th class="px-6 py-3 font-medium">Pembeli</th>
                  <th class="px-6 py-3 font-medium">Total Harga</th>
                  <th class="px-6 py-3 font-medium">Status</th>
                  <th class="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="order in orders" :key="order.id"
                  class="hover:bg-orange-50/50 dark:hover:bg-gray-800/40 transition-colors">
                  <td class="px-6 py-4">
                    <div class="font-semibold text-gray-900 dark:text-white">{{ order.order_number }}</div>
                    <div class="mt-1 text-xs text-gray-500">{{ formatDateTime(order.created_at) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-medium text-gray-900 dark:text-white">{{ order.buyer_name || "-" }}</div>
                    <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {{ order.buyer_class_name && order.buyer_class_name !== "-" ? `Kelas ${order.buyer_class_name}` : "Kelas -" }}
                    </div>
                    <div class="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                      {{ order.buyer_role || "User" }}
                    </div>
                    <div class="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                      <span class="rounded-full bg-orange-100 px-2 py-0.5 text-orange-700 dark:bg-orange-500/10 dark:text-orange-200">
                        {{ paymentMethodLabel(order.payment_method) }}
                      </span>
                      <span
                        class="rounded-full px-2 py-0.5"
                        :class="paymentStatusClassForOrder(order)"
                      >
                        {{ order.payment_status_label || paymentStatusLabelForOrder(order) }}
                      </span>
                    </div>
                    <div class="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                      Status pembayaran: {{ order.payment_status_label || paymentStatusLabelForOrder(order) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold text-orange-600">
                    {{ formatCurrency(order.total_amount) }}
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex rounded-sm px-2 py-1 text-[11px] font-bold uppercase tracking-wider"
                      :class="statusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <details class="relative inline-block text-left">
                      <summary
                        class="cursor-pointer list-none rounded-sm border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Aksi
                      </summary>
                      <div class="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                        <button
                          class="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                          @click="openOrderDetail(order.id)"
                        >
                          Detail pesanan
                        </button>
                        <button
                          v-if="order.payment_qr_string && String(order.payment_method || '').toUpperCase() === 'NON_TUNAI'"
                          class="block w-full rounded-lg px-3 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                          @click="openPaymentQrModal(order.order_number, order.payment_qr_string, {
                            orderId: order.id,
                            sandboxEnabled: Boolean(order.payment_sandbox),
                            paymentStatus: effectivePaymentStatus(order),
                            paymentExpiresAt: order.payment_expires_at,
                          })"
                        >
                          Buka QRIS
                        </button>
                        <button
                          v-if="String(order.payment_method || '').toUpperCase() === 'NON_TUNAI' && String(effectivePaymentStatus(order)).toUpperCase() === 'EXPIRED'"
                          class="block w-full rounded-lg px-3 py-2 text-left text-sm text-orange-700 hover:bg-orange-50 dark:text-orange-300 dark:hover:bg-orange-500/10"
                          @click="reissuePayment(order)"
                        >
                          Bayar ulang QRIS
                        </button>
                        <button
                          v-if="order.payment_sandbox && String(order.payment_method || '').toUpperCase() === 'NON_TUNAI' && String(order.payment_status || '').toUpperCase() !== 'PAID'"
                          class="block w-full rounded-lg px-3 py-2 text-left text-sm text-sky-700 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
                          @click="simulateSandboxPayment(order)"
                        >
                          Simulasi bayar
                        </button>
                        <button
                          v-if="!canManage && order.status === 'PENDING'"
                          class="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
                          @click="updateOrderStatus(order, 'CANCELED')"
                        >
                          Batalkan pesanan
                        </button>
                        <template v-if="canManage">
                          <button
                            v-for="nextStatus in nextStatuses(order.status)"
                            :key="`${order.id}-${nextStatus}`"
                            class="block w-full rounded-lg px-3 py-2 text-left text-sm text-orange-700 hover:bg-orange-50 dark:text-orange-300 dark:hover:bg-orange-500/10"
                            @click="updateOrderStatus(order, nextStatus)"
                          >
                            Ubah ke {{ nextStatus }}
                          </button>
                        </template>
                      </div>
                    </details>
                  </td>
                </tr>
                <tr v-if="orders.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    Belum ada riwayat pesanan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- TAB CONTENT: MANAGE (ADMIN ONLY) -->
      <div v-show="activeTab === 'manage' && canManage" class="space-y-6">
        <section class="rounded-sm bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900">
          <div class="flex items-center justify-between border-b px-6 py-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Inventaris Koperasi</h2>
            <button @click="openProductModal"
              class="rounded-sm bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
              + Tambah Produk Baru
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 font-medium">Info Produk</th>
                  <th class="px-6 py-3 font-medium">Harga</th>
                  <th class="px-6 py-3 font-medium">Stok</th>
                  <th class="px-6 py-3 font-medium">Status</th>
                  <th class="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td class="px-6 py-4 flex items-center gap-3">
                    <img v-if="product.image_url" :src="normalizePublicUrl(product.image_url)"
                      class="h-10 w-10 rounded-sm object-cover border" />
                    <div v-else class="h-10 w-10 rounded-sm bg-gray-100 flex items-center justify-center border">
                      <Icon icon="ph:image" class="text-gray-400" />
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</div>
                      <div class="text-xs text-gray-500">{{ product.code || "N/A" }} · {{ product.category }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-medium">{{ formatCurrency(product.price) }}</td>
                  <td class="px-6 py-4">{{ Number(product.stock || 0) }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex rounded-sm px-2 py-1 text-[11px] font-bold"
                      :class="product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                      {{ product.is_active ? "AKTIF" : "NONAKTIF" }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        class="rounded-sm border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        @click="editProduct(product)">
                        Ubah
                      </button>
                      <button
                        class="rounded-sm border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        @click="deactivateProduct(product)">
                        Arsip
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

    </main>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="paymentQrModalOpen"
        class="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
        @click.self="closePaymentQrModal"
      >
        <div class="w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Pembayaran Non Tunai</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">QRIS Xendit</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Pesanan {{ paymentQrOrderNumber || "-" }} siap dibayar dengan QRIS.
            </p>
            <p v-if="paymentQrSandboxEnabled" class="mt-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
              Sandbox
            </p>
          </div>

          <div class="space-y-4 px-6 py-5">
            <div class="flex items-center justify-center rounded-3xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <img
                v-if="paymentQrDataUrl"
                :src="paymentQrDataUrl"
                alt="QRIS Pembayaran"
                class="h-72 w-72 rounded-2xl bg-white p-2 shadow-sm"
              />
              <div v-else class="flex h-72 w-72 items-center justify-center rounded-2xl bg-white text-center text-sm text-slate-500 shadow-sm">
                QRIS tidak tersedia
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
              <p class="font-semibold text-slate-900 dark:text-white">Cara bayar</p>
              <p class="mt-2 leading-6">
                Buka aplikasi mobile banking atau e-wallet, pilih scan QR, lalu arahkan kamera ke QRIS ini.
              </p>
              <p class="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                Status: {{ paymentQrPaymentStatus || "PENDING" }}
              </p>
              <p v-if="paymentQrExpiresAt" class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                Berlaku sampai {{ formatDateTime(paymentQrExpiresAt) }}
              </p>
              <p v-if="paymentQrExpiresAt" class="mt-1 text-sm font-semibold" :class="paymentQrRemainingSeconds > 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'">
                {{ paymentQrCountdownText }}
              </p>
            </div>

            <div class="flex items-center justify-end gap-3">
              <button
                type="button"
                class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="closePaymentQrModal"
              >
                Tutup
              </button>
              <button
                type="button"
                class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
                @click="copyPaymentQrString"
              >
                Salin QR
              </button>
              <button
                v-if="paymentQrSandboxEnabled && paymentQrOrderId"
                type="button"
                class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500"
                @click="simulateSandboxPaymentById"
              >
                Simulasi Bayar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="orderDetailModalOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
        @click.self="closeOrderDetail"
      >
        <div class="w-full max-w-3xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 dark:text-orange-300">Detail Pesanan</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {{ selectedOrderDetail?.order_number || "-" }}
            </h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Status pembayaran: {{ selectedOrderDetail?.payment_status_label || paymentStatusLabelForOrder(selectedOrderDetail) }}
            </p>
          </div>

          <div class="grid gap-4 px-6 py-5 lg:grid-cols-[1.2fr,0.8fr]">
            <div class="space-y-4">
              <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div class="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p class="text-xs font-semibold uppercase text-slate-400">Pembeli</p>
                    <p class="mt-1 font-semibold text-slate-900 dark:text-white">{{ selectedOrderDetail?.buyer_name || "-" }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ selectedOrderDetail?.buyer_class_name && selectedOrderDetail?.buyer_class_name !== "-" ? `Kelas ${selectedOrderDetail.buyer_class_name}` : "Kelas -" }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase text-slate-400">Metode Bayar</p>
                    <p class="mt-1 font-semibold text-slate-900 dark:text-white">{{ paymentMethodLabel(selectedOrderDetail?.payment_method) }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ selectedOrderDetail?.payment_status_label || paymentStatusLabelForOrder(selectedOrderDetail) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase text-slate-400">Tanggal Pesan</p>
                    <p class="mt-1 font-semibold text-slate-900 dark:text-white">{{ formatDateTime(selectedOrderDetail?.created_at) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase text-slate-400">Total</p>
                    <p class="mt-1 font-semibold text-orange-600">{{ formatCurrency(selectedOrderDetail?.total_amount) }}</p>
                  </div>
                  <div v-if="selectedOrderDetail?.payment_method && String(selectedOrderDetail.payment_method).toUpperCase() === 'NON_TUNAI'">
                    <p class="text-xs font-semibold uppercase text-slate-400">Berlaku Sampai</p>
                    <p class="mt-1 font-semibold text-slate-900 dark:text-white">{{ formatPaymentExpiry(selectedOrderDetail?.payment_expires_at) }}</p>
                    <p v-if="isPaymentExpired(selectedOrderDetail)" class="text-sm text-rose-500">
                      QRIS sudah kedaluwarsa.
                    </p>
                    <p v-else class="text-sm text-emerald-600">
                      Bayar ulang aktif setelah QRIS kedaluwarsa.
                    </p>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-slate-200 dark:border-slate-800">
                <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">Item Pesanan</p>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                  <div v-for="item in selectedOrderDetail?.items || []" :key="item.id" class="flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                      <p class="font-medium text-slate-900 dark:text-white">{{ item.product_name_snapshot || "-" }}</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        {{ item.quantity }} x {{ formatCurrency(item.price) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-slate-900 dark:text-white">{{ formatCurrency(item.subtotal) }}</p>
                    </div>
                  </div>
                  <div v-if="!selectedOrderDetail?.items || selectedOrderDetail.items.length === 0" class="px-4 py-8 text-center text-sm text-slate-500">
                    Tidak ada item pesanan.
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <p class="text-xs font-semibold uppercase text-slate-400">Status Pembayaran</p>
                <p class="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  {{ selectedOrderDetail?.payment_status_label || paymentStatusLabelForOrder(selectedOrderDetail) }}
                </p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {{ selectedOrderDetail?.payment_sandbox ? "Mode sandbox aktif." : "Mode live Xendit." }}
                </p>
              </div>

              <div v-if="selectedOrderDetail?.payment_method && String(selectedOrderDetail.payment_method).toUpperCase() === 'NON_TUNAI'" class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p class="text-sm font-semibold text-slate-900 dark:text-white">QRIS</p>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  QRIS bisa dibuka ulang dari detail pesanan ini.
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <button
                    v-if="selectedOrderDetail?.payment_qr_string"
                    class="rounded-xl border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                    @click="openPaymentQrModal(selectedOrderDetail.order_number, selectedOrderDetail.payment_qr_string, {
                      orderId: selectedOrderDetail.id,
                      sandboxEnabled: Boolean(selectedOrderDetail.payment_sandbox),
                      paymentStatus: effectivePaymentStatus(selectedOrderDetail),
                      paymentExpiresAt: selectedOrderDetail.payment_expires_at,
                    })"
                  >
                    Buka QRIS
                  </button>
                  <button
                    v-if="selectedOrderDetail?.payment_sandbox && String(selectedOrderDetail.payment_status || '').toUpperCase() !== 'PAID'"
                    class="rounded-xl border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-50"
                    @click="simulateSandboxPayment(selectedOrderDetail)"
                  >
                    Simulasi Bayar
                  </button>
                  <button
                    v-if="selectedOrderDetail?.payment_method && String(selectedOrderDetail.payment_method).toUpperCase() === 'NON_TUNAI' && String(effectivePaymentStatus(selectedOrderDetail)).toUpperCase() === 'EXPIRED'"
                    class="rounded-xl border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                    @click="reissuePayment(selectedOrderDetail)"
                  >
                    Bayar Ulang
                  </button>
                </div>
              </div>

              <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p class="text-xs font-semibold uppercase text-slate-400">Catatan</p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {{ selectedOrderDetail?.note || "-" }}
                </p>
              </div>

              <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p class="text-xs font-semibold uppercase text-slate-400">Riwayat Pembayaran</p>
                <div class="mt-3 space-y-3">
                  <div v-for="log in selectedOrderDetail?.payment_history || []" :key="log.id" class="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/70">
                    <div class="flex items-center justify-between gap-3">
                      <span class="font-semibold text-slate-900 dark:text-white">{{ log.event_type || "-" }}</span>
                      <span class="rounded-full px-2 py-0.5 text-[11px] font-bold" :class="paymentStatusClass(log.status)">
                        {{ log.status_label || paymentStatusLabel(log.status, selectedOrderDetail?.payment_method) }}
                      </span>
                    </div>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(log.created_at) }}</p>
                    <p v-if="log.note" class="mt-2 text-slate-600 dark:text-slate-300">{{ log.note }}</p>
                  </div>
                  <div v-if="!selectedOrderDetail?.payment_history || selectedOrderDetail.payment_history.length === 0" class="text-sm text-slate-500">
                    Belum ada riwayat pembayaran.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="printOrderReceipt(selectedOrderDetail)"
            >
              Cetak Nota
            </button>
            <button
              type="button"
              class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="closeOrderDetail"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- PRODUCT MODAL -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showProductModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        @click.self="closeProductModal">
          <div class="w-full max-w-2xl rounded-sm bg-white shadow-2xl dark:bg-gray-900">
          <div class="border-b px-6 py-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ editingProductId ? "Ubah Detail Produk" : "Tambah Produk Baru" }}
            </h2>
          </div>
          <form class="grid gap-5 px-6 py-6 md:grid-cols-2" @submit.prevent="saveProduct">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">Nama Produk</label>
              <input
                v-model="productForm.name"
                type="text"
                required
                class="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">SKU / Kode</label>
              <input
                v-model="productForm.code"
                type="text"
                class="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">Kategori</label>
              <select
                v-model="productForm.category"
                class="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                @change="handleCategoryChange"
              >
                <option value="" disabled>Pilih kategori</option>
                <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <input
                v-if="productForm.category === 'LAINNYA'"
                v-model.trim="productForm.custom_category"
                type="text"
                placeholder="Tulis kategori lain"
                class="mt-3 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">Harga (Rp)</label>
              <input
                :value="productPriceDisplay"
                type="text"
                inputmode="numeric"
                placeholder="0"
                @input="handlePriceInput"
                class="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">Stok</label>
              <input
                v-model.number="productForm.stock"
                type="number"
                min="0"
                class="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div class="md:col-span-2 mt-1">
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Foto Produk</label>
              <div class="flex items-start gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                  <img v-if="productImagePreview" :src="productImagePreview" class="h-full w-full object-cover" />
                  <Icon v-else icon="ph:image" class="h-full w-full p-4 text-slate-300" />
                </div>
                <div class="flex-1">
                  <input
                    ref="productImageInput"
                    type="file"
                    accept="image/*"
                    class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:file:bg-orange-500/10 dark:file:text-orange-300"
                    @change="handleProductImageChange"
                  />
                  <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Format disarankan: JPG, PNG rasio 1:1.</p>
                </div>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">Deskripsi Lengkap</label>
              <textarea
                v-model="productForm.description"
                rows="4"
                class="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              ></textarea>
            </div>
            <label class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 md:col-span-2">
              <input
                v-model="productForm.is_active"
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              Tampilkan produk ini di etalase
            </label>
            <div class="flex items-center justify-end gap-3 border-t pt-4 md:col-span-2">
              <button type="button"
                class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="closeProductModal">
                Batal
              </button>
              <button type="submit" :disabled="isSavingProduct"
                class="rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">
                {{ isSavingProduct ? "Menyimpan..." : "Simpan Produk" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import QRCode from "qrcode";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDateTime } from "@/utils/date";
import { getStoredRole } from "@/utils/auth";
import { useRealtimeStore } from "@/store/realtime";
import { normalizePublicUrl } from "@/utils/url";

const role = String(getStoredRole() || "");
const canManage = computed(() => ["ADMIN", "KOPERASI"].includes(role));
const realtimeStore = useRealtimeStore();

// New State for Tabs
const activeTab = ref('shop');
const categoryOptions = [
  { value: "ATK", label: "ATK / Alat Tulis" },
  { value: "Buku", label: "Buku & Modul" },
  { value: "Seragam", label: "Seragam Sekolah" },
  { value: "Makanan Ringan", label: "Makanan Ringan" },
  { value: "Minuman", label: "Minuman" },
  { value: "Makanan Berat", label: "Makanan Berat" },
  { value: "Snack", label: "Snack" },
  { value: "Perlengkapan Ibadah", label: "Perlengkapan Ibadah" },
  { value: "Kebersihan", label: "Perlengkapan Kebersihan" },
  { value: "Kesehatan", label: "Perlengkapan Kesehatan" },
  { value: "Elektronik", label: "Elektronik & Aksesori" },
  { value: "Aksesoris", label: "Aksesoris Sekolah" },
  { value: "Olahraga", label: "Olahraga" },
  { value: "Hadiah", label: "Souvenir & Hadiah" },
  { value: "LAINNYA", label: "Lainnya" },
];
const categoryValues = new Set(categoryOptions.map((option) => option.value));

const isLoading = ref(false);
const isSavingProduct = ref(false);
const isSubmittingOrder = ref(false);
const dashboard = ref({ overview: {} });
const report = ref({ overview: {}, range: {}, payment_status_breakdown: [], payment_method_breakdown: [], top_products: [], low_stock_items: [] });
const products = ref([]);
const orders = ref([]);
const message = ref("");
const isError = ref(false);
const searchQuery = ref("");
const selectedCategory = ref("");
const cart = ref([]);
const showProductModal = ref(false);
const editingProductId = ref(null);
const orderDetailModalOpen = ref(false);
const selectedOrderDetail = ref(null);
const paymentQrModalOpen = ref(false);
const paymentQrOrderNumber = ref("");
const paymentQrOrderId = ref(null);
const paymentQrString = ref("");
const paymentQrDataUrl = ref("");
const paymentQrSandboxEnabled = ref(false);
const paymentQrPaymentStatus = ref("");
const paymentQrExpiresAt = ref("");
const nowTick = ref(Date.now());
let nowTimer = null;
let realtimeUnsubscribers = [];
const mobileCartOpen = ref(false);
const productImageInput = ref(null);
const productImageFile = ref(null);
const productImagePreview = ref("");
const productPriceDisplay = ref("");
const checkoutForm = reactive({
  payment_method: "TUNAI",
  note: "",
});
const productForm = reactive({
  name: "",
  code: "",
  category: "",
  custom_category: "",
  description: "",
  image_url: "",
  price: 0,
  stock: 0,
  is_active: true,
});

const formatCurrency = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
const numberValue = (value) => Number(value || 0);
const paymentMethodLabel = (value) => {
  const normalized = String(value || "").toUpperCase();
  if (normalized === "NON_TUNAI" || normalized === "TRANSFER") {
    return "Non Tunai";
  }
  return "Tunai";
};
const paymentStatusClass = (value) => {
  const normalized = String(value || "").toUpperCase();
  if (normalized === "PAID") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200";
  if (normalized === "FAILED" || normalized === "EXPIRED" || normalized === "CANCELED") return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200";
  if (normalized === "CASH_DUE" || normalized === "PENDING") return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
};

const paymentStatusLabel = (status, method) => {
  const normalizedStatus = String(status || "").toUpperCase();
  const normalizedMethod = String(method || "").toUpperCase();
  if (normalizedStatus === "PAID") return "Lunas";
  if (normalizedStatus === "CASH_DUE") return "Tunai saat terima";
  if (normalizedStatus === "FAILED") return "Gagal";
  if (normalizedStatus === "EXPIRED") return "Kedaluwarsa";
  if (normalizedStatus === "CANCELED") return "Dibatalkan";
  if (normalizedStatus === "PENDING" && normalizedMethod === "NON_TUNAI") return "Menunggu QRIS";
  if (normalizedStatus === "PENDING") return "Menunggu pembayaran";
  return normalizedStatus || "-";
};

const parseKoperasiDateMillis = (value) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  const hasExplicitTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed);
  if (hasExplicitTimezone) {
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  }

  const match = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/,
  );
  if (!match) {
    const fallback = new Date(trimmed);
    return Number.isNaN(fallback.getTime()) ? null : fallback.getTime();
  }
  const [, yearRaw, monthRaw, dayRaw, hourRaw = "00", minuteRaw = "00", secondRaw = "00", milliRaw = "000"] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const second = Number(secondRaw);
  const millisecond = Number(String(milliRaw).padEnd(3, "0"));
  if ([year, month, day, hour, minute, second, millisecond].some((item) => Number.isNaN(item))) {
    return null;
  }
  return Date.UTC(year, month - 1, day, hour - 7, minute, second, millisecond);
};

const isPaymentExpired = (order) => {
  const status = String(order?.payment_status || "").toUpperCase();
  if (status === "PAID") return false;
  const expiresAt = parseKoperasiDateMillis(order?.payment_expires_at);
  return Boolean(expiresAt && expiresAt <= Date.now());
};

const formatCountdown = (totalSeconds) => {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds || 0)));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }
  return `${minutes}:${String(rest).padStart(2, "0")}`;
};

const paymentQrRemainingSeconds = computed(() => {
  const expiresAt = parseKoperasiDateMillis(paymentQrExpiresAt.value);
  if (!expiresAt) return null;
  return Math.max(0, Math.ceil((expiresAt - nowTick.value) / 1000));
});

const paymentQrCountdownText = computed(() => {
  if (!paymentQrExpiresAt.value) return "-";
  if (!paymentQrRemainingSeconds.value && paymentQrRemainingSeconds.value !== 0) return "-";
  if (paymentQrRemainingSeconds.value <= 0) return "Kedaluwarsa";
  return `Sisa ${formatCountdown(paymentQrRemainingSeconds.value)}`;
});

const effectivePaymentStatus = (order) => {
  const status = String(order?.payment_status || "").toUpperCase();
  if ((status === "PENDING" || status === "CASH_DUE") && isPaymentExpired(order)) {
    return "EXPIRED";
  }
  return status;
};

const paymentStatusLabelForOrder = (order) => paymentStatusLabel(effectivePaymentStatus(order), order?.payment_method);

const paymentStatusClassForOrder = (order) => paymentStatusClass(effectivePaymentStatus(order));

const formatPaymentExpiry = (value) => {
  if (!value) return "-";
  return formatDateTime(value);
};

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]));

const setMessage = (text, error = false) => {
  message.value = text;
  isError.value = error;
  if (text) {
    setTimeout(() => { message.value = "" }, 4000); // Auto dismiss message
  }
};

const summaryCards = computed(() => {
  const overview = dashboard.value?.overview || {};
  return [
    { label: "Produk Etalase", value: numberValue(overview.products_active) },
    { label: "Total Stok", value: numberValue(overview.stock_total) },
    { label: "Pesanan Masuk", value: numberValue(overview.pending_orders) },
    { label: "Total Pendapatan", value: formatCurrency(overview.revenue_total) },
  ];
});

const reportCards = computed(() => {
  const overview = report.value?.overview || {};
  return [
    { label: "Pesanan", value: numberValue(overview.orders_total) },
    { label: "Lunas", value: numberValue(overview.orders_paid) },
    { label: "Menunggu", value: numberValue(overview.orders_pending) },
    { label: "Pendapatan", value: formatCurrency(overview.revenue_total) },
  ];
});

const categories = computed(() => {
  const unique = new Set();
  for (const product of products.value) {
    const category = String(product.category || "").trim();
    if (category) {
      unique.add(category);
    }
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
});

const filteredProducts = computed(() => {
  const search = searchQuery.value.trim().toLowerCase();
  const category = selectedCategory.value.trim().toLowerCase();

  return products.value.filter((product) => {
    if (category && String(product.category || "").trim().toLowerCase() !== category) {
      return false;
    }
    if (!search) {
      return true;
    }
    return [product.name, product.code, product.category, product.description]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(search));
  });
});

const cartDetails = computed(() =>
  cart.value
    .map((item) => {
      const product = products.value.find((productItem) => Number(productItem.id) === Number(item.product_id));
      if (!product) return null;
      const quantity = Number(item.quantity || 0);
      return {
        product,
        quantity,
        subtotal: Number(product.price || 0) * quantity,
      };
    })
    .filter(Boolean),
);

const cartTotal = computed(() => cartDetails.value.reduce((sum, item) => sum + Number(item.subtotal || 0), 0));
const cartTotalItems = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));
const isRealtimeConnected = computed(() => realtimeStore.connected);
const formatRupiahInput = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  return new Intl.NumberFormat("id-ID").format(Number(digits));
};

const clearProductImageSelection = () => {
  productImageFile.value = null;
  if (productImagePreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(productImagePreview.value);
  }
  productImagePreview.value = editingProductId.value ? normalizePublicUrl(productForm.image_url) : "";
  if (productImageInput.value) {
    productImageInput.value.value = "";
  }
};

const resetProductForm = () => {
  editingProductId.value = null;
  productForm.name = "";
  productForm.code = "";
  productForm.category = "";
  productForm.custom_category = "";
  productForm.description = "";
  productForm.image_url = "";
  productForm.price = 0;
  productPriceDisplay.value = "";
  productForm.stock = 0;
  productForm.is_active = true;
  clearProductImageSelection();
};

const openProductModal = () => {
  resetProductForm();
  showProductModal.value = true;
};

const closeProductModal = () => {
  if (isSavingProduct.value) return;
  showProductModal.value = false;
};

const loadData = async () => {
  isLoading.value = true;
  try {
    const requests = [
      api.get("/koperasi/dashboard"),
      api.get("/koperasi/products", {
        params: { page: 1, limit: 100, include_inactive: canManage.value ? 1 : undefined },
      }),
      api.get("/koperasi/orders", {
        params: { page: 1, limit: 20 },
      }),
    ];
    if (canManage.value) {
      requests.push(api.get("/koperasi/reports/summary"));
    }
    const responses = await Promise.allSettled(requests);
    const [dashboardResponse, productsResponse, ordersResponse, reportResponse] = responses;
    const criticalFailure = [dashboardResponse, productsResponse, ordersResponse].find((result) => result.status === "rejected");
    if (criticalFailure) {
      throw criticalFailure.reason || new Error("Gagal memuat data koperasi.");
    }

    dashboard.value = dashboardResponse.value?.data || { overview: {} };
    products.value = Array.isArray(productsResponse.value?.data?.items) ? productsResponse.value.data.items : [];
    orders.value = Array.isArray(ordersResponse.value?.data?.items) ? ordersResponse.value.data.items : [];
    report.value = canManage.value && reportResponse?.status === "fulfilled" && reportResponse.value?.data
      ? reportResponse.value.data
      : { overview: {}, range: {}, payment_status_breakdown: [], payment_method_breakdown: [], top_products: [], low_stock_items: [] };
  } catch (error) {
    setMessage(error.message || "Gagal memuat data koperasi.", true);
    pushToast({ title: "Gagal Memuat Koperasi", message: error.message || "Data koperasi gagal dimuat.", type: "error" });
  } finally {
    isLoading.value = false;
  }
};

const addToCart = (product) => {
  const current = cart.value.find((item) => Number(item.product_id) === Number(product.id));
  if (current) {
    if (current.quantity < product.stock) current.quantity += 1;
    else pushToast({ title: "Stok Terbatas", message: "Maksimal stok tercapai", type: "warning" });
  } else {
    cart.value = [...cart.value, { product_id: product.id, quantity: 1 }];
  }
  pushToast({ title: "Berhasil", message: `${product.name} masuk keranjang`, type: "success" });
};

const increaseQuantity = (product) => {
  const current = cart.value.find((item) => Number(item.product_id) === Number(product.id));
  if (!current) {
    addToCart(product);
    return;
  }
  if (current.quantity >= Number(product.stock || 0)) return;
  current.quantity += 1;
};

const decreaseQuantity = (productId) => {
  const next = cart.value
    .map((item) => Number(item.product_id) === Number(productId) ? { ...item, quantity: Number(item.quantity || 0) - 1 } : item)
    .filter((item) => item.quantity > 0);
  cart.value = next;
};

const clearCart = () => { cart.value = []; };

const closePaymentQrModal = () => {
  paymentQrModalOpen.value = false;
  paymentQrOrderNumber.value = "";
  paymentQrOrderId.value = null;
  paymentQrString.value = "";
  paymentQrDataUrl.value = "";
  paymentQrSandboxEnabled.value = false;
  paymentQrPaymentStatus.value = "";
  paymentQrExpiresAt.value = "";
};

const buildPaymentQrDataUrl = async (qrString) => {
  const value = String(qrString || "").trim();
  if (!value) {
    return "";
  }

  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
};

const syncPaymentQrStateFromOrder = async (order) => {
  if (!order?.id || Number(paymentQrOrderId.value || 0) !== Number(order.id || 0)) {
    return;
  }

  paymentQrPaymentStatus.value = paymentStatusLabel(order?.payment_status || "PENDING", order?.payment_method);
  paymentQrExpiresAt.value = order?.payment_expires_at || paymentQrExpiresAt.value;
  paymentQrSandboxEnabled.value = Boolean(order?.payment_sandbox ?? paymentQrSandboxEnabled.value);

  const nextQrString = String(order?.payment_qr_string || "").trim();
  if (nextQrString && nextQrString !== paymentQrString.value) {
    paymentQrString.value = nextQrString;
    try {
      paymentQrDataUrl.value = await buildPaymentQrDataUrl(nextQrString);
    } catch (error) {
      paymentQrDataUrl.value = "";
    }
  }
};

const refreshOpenOrderDetail = async (orderId) => {
  if (!orderDetailModalOpen.value || Number(selectedOrderDetail.value?.id || 0) !== Number(orderId || 0)) {
    return;
  }

  try {
    const response = await api.get(`/koperasi/orders/${orderId}`);
    selectedOrderDetail.value = response?.data || selectedOrderDetail.value;
  } catch (error) {
    // Keep the current detail view if refresh fails.
  }
};

const openOrderDetail = async (orderId) => {
  orderDetailModalOpen.value = true;
  selectedOrderDetail.value = null;
  try {
    const response = await api.get(`/koperasi/orders/${orderId}`);
    selectedOrderDetail.value = response?.data || null;
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Detail",
      message: error.message || "Detail pesanan gagal dimuat.",
      type: "error",
    });
    orderDetailModalOpen.value = false;
  }
};

const closeOrderDetail = () => {
  orderDetailModalOpen.value = false;
  selectedOrderDetail.value = null;
};

const openPaymentQrModal = async (orderNumber, qrString, options = {}) => {
  paymentQrOrderNumber.value = String(orderNumber || "");
  paymentQrString.value = String(qrString || "").trim();
  paymentQrOrderId.value = options?.orderId || null;
  paymentQrSandboxEnabled.value = Boolean(options?.sandboxEnabled);
  paymentQrPaymentStatus.value = paymentStatusLabel(options?.paymentStatus || "PENDING");
  paymentQrExpiresAt.value = options?.paymentExpiresAt || "";
  paymentQrDataUrl.value = "";
  paymentQrModalOpen.value = Boolean(paymentQrString.value);
  if (!paymentQrString.value) {
    return;
  }

  try {
    paymentQrDataUrl.value = await buildPaymentQrDataUrl(paymentQrString.value);
  } catch (error) {
    paymentQrDataUrl.value = "";
    pushToast({
      title: "QRIS",
      message: error.message || "Gagal membuat QRIS.",
      type: "error",
    });
  }
};

const simulateSandboxPaymentById = async () => {
  if (!paymentQrOrderId.value) return;
  await simulateSandboxPayment({ id: paymentQrOrderId.value, order_number: paymentQrOrderNumber.value });
};

const copyPaymentQrString = async () => {
  if (!paymentQrString.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(paymentQrString.value);
    pushToast({
      title: "QRIS Disalin",
      message: "String QR berhasil disalin ke clipboard.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Menyalin QRIS",
      message: error.message || "Clipboard tidak tersedia.",
      type: "error",
    });
  }
};

const editProduct = (product) => {
  editingProductId.value = product.id;
  productForm.name = product.name || "";
  productForm.code = product.code || "";
  const existingCategory = String(product.category || "").trim();
  if (categoryValues.has(existingCategory)) {
    productForm.category = existingCategory;
    productForm.custom_category = "";
  } else if (existingCategory) {
    productForm.category = "LAINNYA";
    productForm.custom_category = existingCategory;
  } else {
    productForm.category = "";
    productForm.custom_category = "";
  }
  productForm.description = product.description || "";
  productForm.image_url = product.image_url || "";
  productForm.price = Number(product.price || 0);
  productPriceDisplay.value = formatRupiahInput(productForm.price);
  productForm.stock = Number(product.stock || 0);
  productForm.is_active = product.is_active !== false;
  clearProductImageSelection();
  productImagePreview.value = normalizePublicUrl(product.image_url) || "";
  showProductModal.value = true;
};

const handleCategoryChange = () => {
  if (productForm.category !== "LAINNYA") {
    productForm.custom_category = "";
  }
};

const handlePriceInput = (event) => {
  const rawValue = event?.target?.value || "";
  const digits = String(rawValue).replace(/\D/g, "");
  productForm.price = digits ? Number(digits) : 0;
  productPriceDisplay.value = formatRupiahInput(digits);
};

const handleProductImageChange = (event) => {
  const file = event?.target?.files?.[0] || null;
  if (productImagePreview.value.startsWith("blob:")) URL.revokeObjectURL(productImagePreview.value);
  productImageFile.value = file;
  if (!file) {
    productImagePreview.value = editingProductId.value ? normalizePublicUrl(productForm.image_url) : "";
    return;
  }
  productImagePreview.value = URL.createObjectURL(file);
};

const saveProduct = async () => {
  isSavingProduct.value = true;
  try {
    const resolvedCategory =
      productForm.category === "LAINNYA"
        ? String(productForm.custom_category || "").trim()
        : String(productForm.category || "").trim();

    if (productForm.category === "LAINNYA" && !resolvedCategory) {
      throw new Error("Kategori lain harus diisi.");
    }

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("code", productForm.code || "");
    formData.append("category", resolvedCategory || "");
    formData.append("description", productForm.description || "");
    formData.append("image_url", productForm.image_url || "");
    formData.append("price", String(Number(productForm.price || 0)));
    formData.append("stock", String(Number(productForm.stock || 0)));
    formData.append("is_active", productForm.is_active ? "true" : "false");
    if (productImageFile.value) {
      formData.append("image", productImageFile.value);
    }

    const response = editingProductId.value
      ? await api.put(`/koperasi/products/${editingProductId.value}`, formData)
      : await api.post("/koperasi/products", formData);

    pushToast({ title: "Sukses", message: response?.message || "Produk diperbarui.", type: "success" });
    showProductModal.value = false;
    resetProductForm();
    await loadData();
  } catch (error) {
    pushToast({ title: "Gagal Simpan", message: error.message || "Terjadi kesalahan.", type: "error" });
  } finally {
    isSavingProduct.value = false;
  }
};

const deactivateProduct = async (product) => {
  if (!window.confirm(`Arsipkan produk "${product.name}"?`)) return;
  try {
    await api.delete(`/koperasi/products/${product.id}`);
    pushToast({ title: "Sukses", message: "Produk diarsipkan.", type: "success" });
    await loadData();
  } catch (error) {
    pushToast({ title: "Gagal", message: error.message || "Gagal mengarsipkan produk.", type: "error" });
  }
};

const submitOrder = async () => {
  if (cartDetails.value.length === 0) return;
  isSubmittingOrder.value = true;
  try {
    const payload = {
      payment_method: checkoutForm.payment_method || "TUNAI",
      note: checkoutForm.note || "",
      items: cartDetails.value.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
    };
    const response = await api.post("/koperasi/orders", payload);
    const orderNumber = response?.data?.order_number || "";
    const orderId = response?.data?.id || null;
    const qrString = response?.data?.payment_qr_string || "";
    const sandboxEnabled = Boolean(response?.data?.payment_sandbox);
    if (String(checkoutForm.payment_method || "").toUpperCase() === "NON_TUNAI") {
      if (!qrString) {
        throw new Error("QRIS tidak tersedia dari server.");
      }
      await openPaymentQrModal(orderNumber, qrString, {
        orderId,
        sandboxEnabled,
        paymentStatus: response?.data?.payment_status,
        paymentExpiresAt: response?.data?.payment_expires_at,
      });
      pushToast({
        title: "Pesanan Dibuat",
        message: "Silakan scan QRIS untuk menyelesaikan pembayaran.",
        type: "success",
      });
    } else {
      pushToast({
        title: "Pesanan Dibuat",
        message: "Pembayaran tunai dilakukan saat barang diantar atau diambil di koperasi.",
        type: "success",
      });
    }
    clearCart();
    checkoutForm.note = "";
    mobileCartOpen.value = false;
    activeTab.value = "orders";
    await loadData();
  } catch (error) {
    pushToast({ title: "Checkout Gagal", message: error.message || "Pesanan gagal.", type: "error" });
  } finally {
    isSubmittingOrder.value = false;
  }
};

const handleKoperasiRealtimeEvent = async (payload) => {
  const orderId = Number(payload?.id || payload?.order_id || 0);
  if (!orderId) {
    await loadData();
    return;
  }

  await Promise.allSettled([
    loadData(),
    refreshOpenOrderDetail(orderId),
    syncPaymentQrStateFromOrder(payload),
  ]);
};

const simulateSandboxPayment = async (order) => {
  if (!order?.id) return;
  try {
    const response = await api.post(`/koperasi/orders/${order.id}/simulate-payment`);
    pushToast({
      title: "Sandbox",
      message: response?.message || "Pembayaran sandbox berhasil disimulasikan.",
      type: "success",
    });
    if (paymentQrOrderId.value === order.id) {
      closePaymentQrModal();
    }
    await loadData();
  } catch (error) {
    pushToast({
      title: "Sandbox Gagal",
      message: error.message || "Gagal mensimulasikan pembayaran.",
      type: "error",
    });
  }
};

const reissuePayment = async (order) => {
  if (!order?.id) return;
  try {
    const response = await api.post(`/koperasi/orders/${order.id}/reissue-payment`);
    const nextOrder = response?.data || null;
    if (nextOrder) {
      selectedOrderDetail.value = nextOrder;
      await openPaymentQrModal(nextOrder.order_number, nextOrder.payment_qr_string, {
        orderId: nextOrder.id,
        sandboxEnabled: Boolean(nextOrder.payment_sandbox),
        paymentStatus: nextOrder.payment_status,
        paymentExpiresAt: nextOrder.payment_expires_at,
      });
    }
    pushToast({
      title: "QRIS Diperbarui",
      message: response?.message || "QRIS berhasil dibuat ulang.",
      type: "success",
    });
    await loadData();
  } catch (error) {
    pushToast({
      title: "Gagal Bayar Ulang",
      message: error.message || "QRIS gagal dibuat ulang.",
      type: "error",
    });
  }
};

const printOrderReceipt = (order) => {
  if (!order?.order_number) return;
  const items = Array.isArray(order.items) ? order.items : [];
  const statusLabel = paymentStatusLabelForOrder(order);
  const statusClass = effectivePaymentStatus(order) === "PAID" ? "#059669" : "#b45309";
  const paymentExpiry = order.payment_expires_at ? formatDateTime(order.payment_expires_at) : "-";
  const buyerClassLabel = order.buyer_class_name && order.buyer_class_name !== "-" ? `Kelas ${order.buyer_class_name}` : "Kelas -";
  const html = `
    <html>
      <head>
        <title>Nota ${escapeHtml(order.order_number)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
          .wrap { max-width: 720px; margin: 0 auto; }
          h1 { margin: 0 0 8px; font-size: 22px; }
          .muted { color: #6b7280; font-size: 12px; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; color: white; background: ${statusClass}; font-size: 12px; font-weight: 700; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border-bottom: 1px solid #e5e7eb; padding: 10px 6px; text-align: left; }
          th:last-child, td:last-child { text-align: right; }
          .summary { margin-top: 18px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; }
          .total { font-size: 18px; font-weight: 800; color: #ea580c; }
          @media print { body { margin: 0; } .wrap { max-width: none; } }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>KoperasiKu</h1>
          <div class="muted">Nota pesanan ${escapeHtml(order.order_number)}</div>
          <div style="margin-top: 10px;" class="badge">${escapeHtml(statusLabel)}</div>
          <div class="summary">
            <div class="card">
              <div class="muted">Pembeli</div>
              <div><strong>${escapeHtml(order.buyer_name || "-")}</strong></div>
              <div class="muted" style="margin-top: 4px;">${escapeHtml(buyerClassLabel)}</div>
            </div>
            <div class="card">
              <div class="muted">Pembayaran</div>
              <div><strong>${escapeHtml(paymentMethodLabel(order.payment_method))}</strong></div>
              <div class="muted" style="margin-top: 4px;">Berlaku sampai ${escapeHtml(paymentExpiry)}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item) => `
                <tr>
                  <td>${escapeHtml(item.product_name_snapshot || "-")}</td>
                  <td>${escapeHtml(item.quantity)}</td>
                  <td>${escapeHtml(formatCurrency(item.price))}</td>
                  <td>${escapeHtml(formatCurrency(item.subtotal))}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div style="margin-top: 18px; text-align: right;">
            <div class="muted">Total</div>
            <div class="total">${escapeHtml(formatCurrency(order.total_amount))}</div>
          </div>
          <div class="muted" style="margin-top: 18px;">Dicetak pada ${escapeHtml(formatDateTime(new Date().toISOString()))}</div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=840,height=960");
  if (!printWindow) {
    pushToast({ title: "Gagal Cetak", message: "Popup diblokir browser.", type: "error" });
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };
};

const nextStatuses = (status) => {
  const current = String(status || "").toUpperCase();
  if (current === "PENDING") return ["PROCESSING", "CANCELED"];
  if (current === "PROCESSING") return ["READY", "COMPLETED", "CANCELED"];
  if (current === "READY") return ["COMPLETED", "CANCELED"];
  return [];
};

const updateOrderStatus = async (order, status) => {
  try {
    await api.put(`/koperasi/orders/${order.id}/status`, { status });
    pushToast({ title: "Status Diperbarui", message: `Pesanan diubah menjadi ${status}`, type: "success" });
    await loadData();
  } catch (error) {
    pushToast({ title: "Gagal Update", message: error.message || "Gagal ubah status.", type: "error" });
  }
};

const statusClass = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "COMPLETED") return "bg-emerald-100 text-emerald-700";
  if (normalized === "PROCESSING") return "bg-sky-100 text-sky-700";
  if (normalized === "READY") return "bg-indigo-100 text-indigo-700";
  if (normalized === "FAILED" || normalized === "CANCELED" || normalized === "CANCELLED") return "bg-rose-100 text-rose-700";
  if (normalized === "PENDING") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
};

onMounted(() => {
  loadData();
  nowTimer = window.setInterval(() => {
    nowTick.value = Date.now();
  }, 1000);

  const token = localStorage.getItem("token");
  realtimeStore.connect(token);
  realtimeUnsubscribers = [
    realtimeStore.on("koperasi:order-created", handleKoperasiRealtimeEvent),
    realtimeStore.on("koperasi:order-updated", handleKoperasiRealtimeEvent),
  ];
});

onUnmounted(() => {
  if (nowTimer) {
    window.clearInterval(nowTimer);
    nowTimer = null;
  }
  realtimeUnsubscribers.forEach((unsubscribe) => {
    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  });
  realtimeUnsubscribers = [];
});
</script>
