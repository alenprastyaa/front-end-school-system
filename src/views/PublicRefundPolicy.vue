<template>
  <div class="policy-page min-h-screen bg-[#eef4fa] text-[#1d2b3a]">
    <header class="border-b border-[#dce8f3] bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <router-link to="/" class="flex items-center gap-3">
          <img class="h-14 w-14 rounded-2xl object-contain" src="/logob.png" alt="Bitwize Digital Platform" />
          <span>
            <span class="block text-base font-extrabold leading-tight text-[#123a62]">Bitwize</span>
            <span class="block text-xs font-bold text-[#6d7f90]">Digital Platform</span>
          </span>
        </router-link>
        <router-link to="/"
          class="rounded-xl border border-[#c9d8e6] bg-white px-4 py-2 text-sm font-extrabold text-[#123a62] transition hover:bg-[#f7fbff]">
          Kembali
        </router-link>
      </div>
    </header>

    <main>
      <section class="bg-[#123a62] text-white">
        <div class="mx-auto max-w-6xl px-5 py-14 lg:px-8">
          <p class="text-sm font-extrabold uppercase tracking-wide text-[#ffd979]">Refund Policy</p>
          <h1 class="mt-3 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            Kebijakan pengembalian dana Bitwize Digital Platform.
          </h1>
          <p class="mt-5 max-w-3xl text-sm font-semibold leading-7 text-white/80 md:text-base">
            Kebijakan ini berlaku untuk layanan berlangganan Bitwize Digital Platform dan dapat disesuaikan
            berdasarkan perjanjian tertulis dengan sekolah.
          </p>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div class="grid gap-4 md:grid-cols-2">
          <article v-for="item in refundPolicyItems" :key="item.title"
            class="rounded-2xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <Icon :icon="item.icon" class="text-3xl text-[#1267a8]" />
            <h2 class="mt-4 text-lg font-extrabold text-[#123a62]">{{ item.title }}</h2>
            <p class="mt-2 text-sm font-semibold leading-7 text-[#526577]">{{ item.desc }}</p>
          </article>
        </div>

        <div class="mt-8 rounded-2xl border border-[#dce8f3] bg-white p-6 shadow-sm">
          <h2 class="text-lg font-extrabold text-[#123a62]">Kontak pengajuan</h2>
          <p class="mt-2 text-sm font-semibold leading-7 text-[#526577]">
            Pengajuan refund dapat dikirim melalui WhatsApp
            <a class="font-extrabold text-[#1267a8]" href="https://wa.me/6285719578195" target="_blank" rel="noopener">
              085719578195
            </a>
            atau email
            <a class="font-extrabold text-[#1267a8]" href="mailto:bitwizedigitalplatform@gmail.com">
              bitwizedigitalplatform@gmail.com
            </a>.
          </p>
          <p class="mt-2 text-sm font-semibold leading-7 text-[#526577]">
            Alamat: Jalan Harun II No.126 A, Palmerah, Jakarta Barat.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const refundPolicyItems = [
  {
    icon: "ph:receipt",
    title: "Masa evaluasi awal",
    desc: "Permintaan refund dapat diajukan maksimal 7 hari kalender setelah pembayaran pertama, selama layanan belum digunakan secara intensif atau belum dilakukan konfigurasi khusus.",
  },
  {
    icon: "ph:gear-six",
    title: "Biaya setup dan kustomisasi",
    desc: "Biaya setup, migrasi data, pelatihan, integrasi, atau kustomisasi yang sudah dikerjakan tidak dapat dikembalikan.",
  },
  {
    icon: "ph:calendar-check",
    title: "Langganan berjalan",
    desc: "Pembayaran langganan bulanan yang sudah melewati masa aktif tidak dapat direfund, tetapi sekolah dapat menghentikan perpanjangan untuk periode berikutnya.",
  },
  {
    icon: "ph:chat-circle-text",
    title: "Proses pengajuan",
    desc: "Pengajuan refund dilakukan melalui WhatsApp atau email resmi dengan menyertakan nama sekolah, paket, tanggal pembayaran, dan alasan pengajuan.",
  },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap");

.policy-page {
  font-family: "Nunito Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
</style>
