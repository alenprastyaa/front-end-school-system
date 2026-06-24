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
          <p class="text-sm font-extrabold uppercase tracking-wide text-[#ffd979]">Terms & Conditions</p>
          <h1 class="mt-3 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            Syarat dan ketentuan penggunaan layanan.
          </h1>
          <p class="mt-5 max-w-3xl text-sm font-semibold leading-7 text-white/80 md:text-base">
            Dengan menggunakan layanan Bitwize Digital Platform, sekolah menyetujui ketentuan penggunaan berikut.
          </p>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="item in termsItems" :key="item.title"
            class="rounded-2xl border border-[#dce8f3] bg-white p-6 shadow-sm">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef6ff] text-2xl text-[#1267a8]">
              <Icon :icon="item.icon" />
            </div>
            <h2 class="mt-4 text-lg font-extrabold text-[#123a62]">{{ item.title }}</h2>
            <p class="mt-2 text-sm font-semibold leading-7 text-[#526577]">{{ item.desc }}</p>
          </article>
        </div>

        <div class="mt-8 rounded-2xl border border-[#dce8f3] bg-white p-6 shadow-sm">
          <h2 class="text-lg font-extrabold text-[#123a62]">Informasi perusahaan</h2>
          <p class="mt-2 text-sm font-semibold leading-7 text-[#526577]">
            Bitwize Digital Platform dapat dihubungi melalui WhatsApp 085719578195,
            email bitwizedigitalplatform@gmail.com, atau alamat Gang Harun 2 Kota Jakrta Barat Privinsi DKI Jakarta Kode
            Pos 11480.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const termsItems = [
  {
    icon: "ph:user-circle",
    title: "Akun dan akses",
    desc: "Sekolah bertanggung jawab menjaga kerahasiaan akun admin, guru, siswa, dan orang tua yang diberikan dalam sistem.",
  },
  {
    icon: "ph:database",
    title: "Data sekolah",
    desc: "Data yang dimasukkan ke sistem tetap menjadi milik sekolah. Bitwize menggunakan data tersebut hanya untuk menjalankan layanan.",
  },
  {
    icon: "ph:shield-check",
    title: "Keamanan layanan",
    desc: "Kami berupaya menjaga keamanan sistem, namun pengguna tetap wajib memakai password yang kuat dan membatasi akses sesuai peran.",
  },
  {
    icon: "ph:credit-card",
    title: "Pembayaran",
    desc: "Akses layanan mengikuti paket aktif. Keterlambatan pembayaran dapat menyebabkan pembatasan akses sampai tagihan diselesaikan.",
  },
  {
    icon: "ph:wrench",
    title: "Perubahan fitur",
    desc: "Bitwize dapat memperbarui, memperbaiki, atau menyesuaikan fitur untuk meningkatkan kualitas layanan dan keamanan sistem.",
  },
  {
    icon: "ph:warning-circle",
    title: "Penggunaan yang dilarang",
    desc: "Layanan tidak boleh digunakan untuk aktivitas ilegal, penyalahgunaan data, spam, atau tindakan yang merusak sistem.",
  },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap");

.policy-page {
  font-family: "Nunito Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
</style>
