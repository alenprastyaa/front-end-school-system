<template>
  <div class="landing-shell min-h-screen text-slate-100 isolate overflow-hidden" :style="shellParallaxStyle">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="landing-orb orb-one" :style="orbOneStyle"></div>
      <div class="landing-orb orb-two" :style="orbTwoStyle"></div>
      <div class="landing-grid" :style="gridParallaxStyle"></div>
    </div>

    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-md">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-900/10 shadow-sm">
            <img class="w-7" src="@/assets/logo/logo.svg" alt="School System" />
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-300">CMS + LMS</p>
            <h1 class="text-lg font-semibold tracking-tight text-white">School System</h1>
          </div>
        </div>

        <div class="hidden items-center gap-3 md:flex">
          <a href="#fitur"
            class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/40 hover:bg-white/10">
            Fitur
          </a>
          <a href="#penggunaan"
            class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/40 hover:bg-white/10">
            Cara Pakai
          </a>
          <router-link to="/student-registration"
            class="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20">
            Registrasi Siswa
          </router-link>
          <router-link to="/auth/login"
            class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Login CMS
          </router-link>
        </div>
      </div>
    </header>

    <main class="relative z-10">
      <section class="mx-auto max-w-7xl px-6 pb-16 pt-32 lg:px-10 lg:pb-24 lg:pt-36">
        <div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div class="animate-rise-in" :style="heroCopyStyle">

            <h2
              class="mt-6 max-w-4xl text-2xl font-black leading-[0.95] tracking-tight text-white md:text-2xl lg:text-6xl animate-fade-in-delayed-2">
              Landing page profesional untuk menampilkan isi CMS, alur penggunaan, dan kelebihan LMS sekolah.
            </h2>
            <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg animate-fade-in-delayed-3">
              School System menggabungkan CMS akademik dan LMS pembelajaran dalam satu panel yang rapi. Admin mengelola
              struktur sekolah, guru menyiapkan materi dan evaluasi, sementara siswa belajar, mengerjakan quiz, ikut
              ujian, dan memantau aktivitas dari satu akun.
            </p>

            <div class="mt-8 flex flex-wrap gap-4 animate-fade-in-delayed-4">
              <router-link to="/auth/login"
                class="inline-flex items-center justify-center rounded-2xl bg-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_30px_rgba(244,63,94,0.18)] transition hover:-translate-y-0.5 hover:bg-rose-400">
                Masuk ke Sistem
              </router-link>
              <router-link to="/student-registration"
                class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-slate-100 transition hover:bg-white/10">
                Buka Registrasi Publik
              </router-link>
            </div>

            <div class="mt-10 grid gap-4 sm:grid-cols-3 animate-fade-in-delayed-5">
              <article v-for="metric in heroMetrics" :key="metric.label"
                class="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_32px_rgba(0,0,0,0.2)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                <p class="text-3xl font-black tracking-tight text-white">{{ metric.value }}</p>
                <p class="mt-2 text-sm font-semibold text-slate-100">{{ metric.label }}</p>
                <p class="mt-1 text-xs leading-6 text-slate-400">{{ metric.caption }}</p>
              </article>
            </div>
          </div>

          <div class="grid gap-4 animate-float-panel" :style="heroPanelStyle">
            <article
              class="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_40px_rgba(0,0,0,0.22)] backdrop-blur animate-fade-in-delayed-2">
              <div class="flex items-center justify-between">
                <div>

                  <h3 class="mt-2 text-2xl font-black tracking-tight text-white">Isi CMS yang langsung siap dipakai
                  </h3>
                </div>
                <div
                  class="rounded-2xl bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200 ring-1 ring-emerald-400/20">
                  Aktif
                </div>
              </div>

              <div class="mt-6 space-y-3">
                <div v-for="highlight in featureHighlights" :key="highlight.title"
                  class="rounded-2xl border border-slate-900/10 bg-slate-800 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-slate-700">
                  <div class="flex items-start gap-3">
                    <div class="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                      :class="highlight.tone">
                      <span class="text-base font-black text-white">{{ highlight.index }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-white">{{ highlight.title }}</p>
                      <p class="mt-1 text-sm leading-6 text-slate-200">{{ highlight.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article class="grid gap-4 sm:grid-cols-2">
              <div
                class="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_30px_rgba(0,0,0,0.18)] animate-fade-in-delayed-3">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">Alur Cepat</p>
                <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                  <li v-for="item in quickFlow" :key="item" class="flex gap-3">
                    <span class="mt-1 h-2 w-2 rounded-full bg-rose-400"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <div
                class="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_30px_rgba(0,0,0,0.18)] animate-fade-in-delayed-4">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Kelebihan Utama</p>
                <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                  <li v-for="item in quickAdvantages" :key="item" class="flex gap-3">
                    <span class="mt-1 h-2 w-2 rounded-full bg-amber-300"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="fitur" class="relative border-y border-white/10 bg-transparent py-16 lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:px-10 xl:grid-cols-[0.72fr_1.28fr]">
          <div class="max-w-3xl xl:sticky xl:top-28 xl:self-start">
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">List Isi CMS</p>
            <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Modul lengkap untuk operasional sekolah dan pembelajaran digital
            </h3>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Halaman ini merangkum komponen utama yang tersedia di sistem, mulai dari pengelolaan akademik sampai
              pelaksanaan quiz dan ujian resmi.
            </p>
          </div>

          <div class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="(item, index) in cmsModules" :key="item.title"
              class="reveal-on-scroll rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_34px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
              :style="{ transitionDelay: `${Math.min(index * 45, 220)}ms` }">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.22em]" :class="item.tagTone">{{ item.tag }}</p>
                  <h4 class="mt-2 text-xl font-black tracking-tight text-white">{{ item.title }}</h4>
                </div>
                <div class="rounded-2xl px-3 py-2 text-xs font-bold ring-1 ring-inset" :class="item.badgeTone">
                  {{ item.badge }}
                </div>
              </div>
              <p class="mt-4 text-sm leading-7 text-slate-300">{{ item.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="penggunaan" class="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div class="grid gap-10 xl:grid-cols-[0.78fr_1.22fr]">
          <div class="xl:sticky xl:top-28 xl:self-start">
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-rose-200">Cara Penggunaan</p>
            <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Alur penggunaan yang jelas untuk admin, guru, dan siswa
            </h3>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Setiap peran memiliki fokus kerja yang berbeda. Struktur berikut bisa dipakai sebagai panduan onboarding
              maupun materi presentasi produk.
            </p>
          </div>

          <div class="space-y-5">
            <article v-for="(role, roleIndex) in usageFlows" :key="role.role"
              class="reveal-on-scroll rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_36px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
              :style="{ transitionDelay: `${Math.min(roleIndex * 80, 180)}ms` }">
              <div
                class="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.22em]" :class="role.roleTone">{{ role.caption }}
                  </p>
                  <h4 class="mt-2 text-2xl font-black tracking-tight text-white">{{ role.role }}</h4>
                </div>
                <div
                  class="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-200">
                  {{ role.summary }}
                </div>
              </div>

              <div class="mt-6 grid gap-4 md:grid-cols-2">
                <div v-for="(step, index) in role.steps" :key="`${role.role}-${index}`"
                  class="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div class="flex items-start gap-3">
                    <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white"
                      :class="role.stepTone">
                      {{ index + 1 }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-white">{{ step.title }}</p>
                      <p class="mt-1 text-sm leading-6 text-slate-300">{{ step.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="border-y border-white/10 bg-transparent py-16 lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:px-10 xl:grid-cols-[0.72fr_1.28fr]">
          <div class="max-w-3xl xl:sticky xl:top-28 xl:self-start">
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200">Kelebihan LMS</p>
            <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Nilai lebih yang membedakan LMS ini dari panel sekolah biasa
            </h3>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Sistem tidak berhenti di administrasi. Ia juga mendukung siklus pembelajaran penuh, evaluasi, kontrol
              akses, dan interaksi harian.
            </p>
          </div>

          <div class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <article v-for="(item, index) in advantages" :key="item.title"
              class="reveal-on-scroll rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_34px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
              :style="{ transitionDelay: `${Math.min(index * 60, 180)}ms` }">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl" :class="item.tone">
                <span class="text-lg font-black text-white">{{ item.index }}</span>
              </div>
              <h4 class="mt-5 text-xl font-black tracking-tight text-white">{{ item.title }}</h4>
              <p class="mt-3 text-sm leading-7 text-slate-300">{{ item.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div
          class="reveal-on-scroll rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-[0_22px_44px_rgba(0,0,0,0.24)] backdrop-blur lg:p-10">
          <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">Siap dipresentasikan</p>
              <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                Gunakan halaman ini sebagai beranda resmi produk CMS sekolah Anda
              </h3>
              <p class="mt-4 text-base leading-8 text-slate-300">
                Cocok untuk profil sistem, presentasi calon sekolah, onboarding user baru, atau halaman awal sebelum
                login ke dashboard internal.
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <router-link to="/auth/login"
                class="flex min-h-[140px] flex-col justify-between rounded-[28px] border border-slate-900/10 bg-slate-950 p-5 transition hover:bg-slate-800">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Akses Internal</p>
                <div>
                  <p class="text-xl font-black tracking-tight text-white">Login CMS & LMS</p>
                  <p class="mt-2 text-sm leading-6 text-slate-200">Masuk sebagai admin, guru, atau siswa.</p>
                </div>
              </router-link>
              <router-link to="/student-registration"
                class="flex min-h-[140px] flex-col justify-between rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-5 transition hover:bg-rose-500/15">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">Akses Publik</p>
                <div>
                  <p class="text-xl font-black tracking-tight text-white">Registrasi Siswa</p>
                  <p class="mt-2 text-sm leading-6 text-slate-200">Buka formulir pendaftaran siswa secara langsung.</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const parallaxScrollY = ref(0);
let parallaxFrame = null;
let revealObserver = null;

const updateParallax = () => {
  parallaxFrame = null;
  if (typeof window === "undefined") {
    return;
  }

  parallaxScrollY.value = Math.max(0, window.scrollY || 0);
};

const handleParallaxScroll = () => {
  if (parallaxFrame) {
    return;
  }

  parallaxFrame = window.requestAnimationFrame(updateParallax);
};

onMounted(() => {
  updateParallax();
  window.addEventListener("scroll", handleParallaxScroll, { passive: true });

  if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver?.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    });

    window.requestAnimationFrame(() => {
      document.querySelectorAll(".reveal-on-scroll").forEach((element) => {
        revealObserver?.observe(element);
      });
    });
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleParallaxScroll);
  if (parallaxFrame) {
    window.cancelAnimationFrame(parallaxFrame);
    parallaxFrame = null;
  }
  revealObserver?.disconnect();
  revealObserver = null;
});

const gridParallaxStyle = computed(() => ({
  transform: `translate3d(0, ${Math.min(parallaxScrollY.value * 0.18, 120)}px, 0)`,
}));

const orbOneStyle = computed(() => ({
  transform: `translate3d(0, ${Math.min(parallaxScrollY.value * 0.12, 90)}px, 0)`,
}));

const orbTwoStyle = computed(() => ({
  transform: `translate3d(0, ${Math.max(parallaxScrollY.value * -0.08, -80)}px, 0)`,
}));

const heroCopyStyle = computed(() => ({
  transform: `translate3d(0, ${Math.min(parallaxScrollY.value * 0.05, 36)}px, 0)`,
}));

const heroPanelStyle = computed(() => ({
  transform: `translate3d(0, ${Math.min(parallaxScrollY.value * -0.04, 0)}px, 0)`,
}));

const shellParallaxStyle = computed(() => ({
  backgroundPosition: `center ${Math.min(parallaxScrollY.value * 0.06, 40)}px`,
}));

const heroMetrics = [
  { value: "12+", label: "Modul utama", caption: "Mencakup panel sekolah, akademik, dan pembelajaran." },
  { value: "3 peran", label: "Alur pengguna", caption: "Admin, guru, dan siswa punya workflow masing-masing." },
  { value: "1 sistem", label: "Data terpusat", caption: "Operasional sekolah dan LMS berjalan di platform yang sama." },
];

const featureHighlights = [
  {
    index: "01",
    title: "Struktur sekolah tertata",
    description: "Kelola sekolah, user, kelas, dan tahun ajaran tanpa berpindah sistem.",
    tone: "bg-sky-600",
  },
  {
    index: "02",
    title: "Pembelajaran aktif",
    description: "Guru dapat menyusun materi, bank soal, quiz, chat, dan penilaian dari satu workspace.",
    tone: "bg-rose-500",
  },
  {
    index: "03",
    title: "Kontrol pelaksanaan ujian",
    description: "Ada alur resmi admin-guru-siswa untuk penyusunan, publikasi, dan pengawasan ujian.",
    tone: "bg-emerald-600",
  },
];

const quickFlow = [
  "Admin menyiapkan sekolah, kelas, user, periode, dan pengaturan inti.",
  "Guru mengelola materi, bank soal, quiz, nilai, serta komunikasi kelas.",
  "Siswa belajar, mengerjakan quiz, mengikuti ujian, dan memantau aktivitas dari dashboard.",
];

const quickAdvantages = [
  "CMS dan LMS menyatu dalam satu pengalaman pengguna.",
  "Mendukung quiz dan ujian resmi dengan alur yang berbeda.",
  "Lebih mudah dipakai untuk monitoring pembelajaran harian.",
];

const cmsModules = [
  {
    tag: "Core CMS",
    tagTone: "text-sky-200",
    title: "Dashboard Eksekutif",
    badge: "Ringkasan",
    badgeTone: "bg-sky-500/10 text-sky-200 ring-sky-400/20",
    description: "Menampilkan ringkasan aktivitas utama sesuai role, termasuk konteks sekolah, status modul, dan pintasan ke panel penting.",
  },
  {
    tag: "Core CMS",
    tagTone: "text-sky-200",
    title: "Manajemen Sekolah & User",
    badge: "Admin",
    badgeTone: "bg-sky-500/10 text-sky-200 ring-sky-400/20",
    description: "Mengelola data sekolah, akun user sekolah, peran admin, guru, dan siswa dalam satu struktur akses yang jelas.",
  },
  {
    tag: "Akademik",
    tagTone: "text-emerald-200",
    title: "Kelas & Periode Akademik",
    badge: "Terstruktur",
    badgeTone: "bg-emerald-500/10 text-emerald-200 ring-emerald-400/20",
    description: "Menyusun kelas, wali kelas, tahun ajaran, dan semester aktif agar seluruh modul pembelajaran mengikuti kalender akademik yang sama.",
  },
  {
    tag: "LMS Guru",
    tagTone: "text-rose-200",
    title: "Materi Pembelajaran",
    badge: "Konten",
    badgeTone: "bg-rose-500/10 text-rose-200 ring-rose-400/20",
    description: "Guru dapat mengunggah materi, membagikan file, dan menyiapkan bahan pembelajaran yang mudah diakses siswa.",
  },
  {
    tag: "LMS Guru",
    tagTone: "text-rose-200",
    title: "Live Chat Kelas",
    badge: "Interaktif",
    badgeTone: "bg-rose-500/10 text-rose-200 ring-rose-400/20",
    description: "Komunikasi real-time antara guru dan siswa per mata pelajaran, termasuk ringkasan unread untuk memudahkan tindak lanjut.",
  },
  {
    tag: "Evaluasi",
    tagTone: "text-amber-200",
    title: "Bank Soal",
    badge: "Reusable",
    badgeTone: "bg-amber-500/10 text-amber-200 ring-amber-400/20",
    description: "Soal dapat disimpan, dipakai ulang, dipilih per tipe, lalu dirakit menjadi quiz atau paket ujian secara efisien.",
  },
  {
    tag: "Evaluasi",
    tagTone: "text-amber-200",
    title: "Quiz Harian",
    badge: "Cepat",
    badgeTone: "bg-amber-500/10 text-amber-200 ring-amber-400/20",
    description: "Cocok untuk evaluasi ringan dan rutin dengan dukungan pilihan ganda atau essay, durasi, dan status pengerjaan siswa.",
  },
  {
    tag: "Evaluasi",
    tagTone: "text-amber-200",
    title: "Ujian Resmi",
    badge: "Terkontrol",
    badgeTone: "bg-amber-500/10 text-amber-200 ring-amber-400/20",
    description: "Admin membuat task ujian, guru menyerahkan paket soal, lalu admin menerbitkannya ke siswa lewat jalur resmi yang lebih aman.",
  },
  {
    tag: "Monitoring",
    tagTone: "text-cyan-200",
    title: "Penilaian & Rapor Mapel",
    badge: "Analitik",
    badgeTone: "bg-cyan-500/10 text-cyan-200 ring-cyan-400/20",
    description: "Guru bisa memeriksa submission, memberi nilai, melihat rekap performa, dan membaca hasil akhir pembelajaran per mapel.",
  },
  {
    tag: "Siswa",
    tagTone: "text-fuchsia-200",
    title: "Absensi & Bukti Pembayaran",
    badge: "Layanan",
    badgeTone: "bg-fuchsia-500/10 text-fuchsia-200 ring-fuchsia-400/20",
    description: "Siswa memiliki akses ke modul absensi dan bukti pembayaran sehingga pengalaman pengguna tidak hanya berhenti di kelas online.",
  },
  {
    tag: "Operasional",
    tagTone: "text-indigo-200",
    title: "Pengaturan Admin",
    badge: "Konfigurasi",
    badgeTone: "bg-indigo-500/10 text-indigo-200 ring-indigo-400/20",
    description: "Panel pengaturan membantu admin mengendalikan konfigurasi penting yang mempengaruhi operasional harian sekolah.",
  },
  {
    tag: "Publik",
    tagTone: "text-teal-200",
    title: "Registrasi Siswa Publik",
    badge: "Eksternal",
    badgeTone: "bg-teal-500/10 text-teal-200 ring-teal-400/20",
    description: "Form registrasi publik memudahkan onboarding siswa baru sebelum mereka masuk ke area login dan dashboard internal.",
  },
];

const usageFlows = [
  {
    role: "Untuk Admin Sekolah",
    caption: "Role pengendali sistem",
    summary: "Fokus pada struktur, user, kalender akademik, dan kebijakan ujian.",
    roleTone: "text-sky-200",
    stepTone: "bg-sky-600",
    steps: [
      { title: "Siapkan struktur data sekolah", description: "Buat akun user sekolah, kelas, dan hubungan antar peran sejak awal." },
      { title: "Atur tahun ajaran dan semester", description: "Tetapkan periode aktif agar modul pembelajaran dan penilaian tersusun rapi." },
      { title: "Pantau panel pembelajaran admin", description: "Periksa modul belajar, daftar mapel, dan kesiapan operasional dari dashboard." },
      { title: "Kelola ujian resmi", description: "Buat request ujian, verifikasi paket soal dari guru, lalu publikasikan ke siswa." },
    ],
  },
  {
    role: "Untuk Guru",
    caption: "Role pengajar",
    summary: "Fokus pada materi, interaksi kelas, bank soal, quiz, nilai, dan laporan mapel.",
    roleTone: "text-rose-200",
    stepTone: "bg-rose-500",
    steps: [
      { title: "Masuk ke modul pembelajaran", description: "Pilih mata pelajaran yang diampu lalu kelola materi dan aktivitas kelas dari sana." },
      { title: "Bangun bank soal", description: "Simpan soal MCQ atau essay agar dapat dipakai ulang untuk quiz maupun ujian resmi." },
      { title: "Publikasikan quiz atau siapkan ujian", description: "Guru dapat menerbitkan quiz harian atau menyerahkan paket ujian sesuai task admin." },
      { title: "Nilai dan evaluasi hasil", description: "Buka submission siswa, beri penilaian, lalu gunakan rapor mapel untuk membaca performa kelas." },
    ],
  },
  {
    role: "Untuk Siswa",
    caption: "Role peserta belajar",
    summary: "Fokus pada konsumsi materi, diskusi, tugas evaluasi, absensi, dan layanan pribadi.",
    roleTone: "text-emerald-200",
    stepTone: "bg-emerald-600",
    steps: [
      { title: "Buka materi mata pelajaran", description: "Siswa mempelajari konten dari mapel yang terhubung dengan kelasnya." },
      { title: "Gunakan live chat bila perlu", description: "Ajukan pertanyaan atau lanjutkan diskusi langsung pada kanal mapel yang tersedia." },
      { title: "Kerjakan quiz dan ujian", description: "Siswa masuk ke sesi evaluasi, mengikuti aturan waktu, lalu mengirim jawaban dari panel khusus." },
      { title: "Pantau layanan lain", description: "Akses absensi dan bukti pembayaran tetap tersedia dalam ekosistem yang sama." },
    ],
  },
];

const advantages = [
  {
    index: "A1",
    title: "Satu platform, dua kebutuhan",
    description: "CMS mengurus operasional sekolah, sedangkan LMS menangani proses belajar. Keduanya berjalan dalam satu basis data dan satu pengalaman login.",
    tone: "bg-sky-600",
  },
  {
    index: "A2",
    title: "Workflow per role lebih jelas",
    description: "Admin, guru, dan siswa tidak melihat panel yang sama. Setiap role mendapat menu dan tanggung jawab yang lebih fokus.",
    tone: "bg-rose-500",
  },
  {
    index: "A3",
    title: "Evaluasi pembelajaran lengkap",
    description: "Mulai dari bank soal, quiz, ujian resmi, penilaian, sampai rekap rapor mapel, semuanya saling terhubung.",
    tone: "bg-emerald-600",
  },
  {
    index: "A4",
    title: "Siap untuk penggunaan harian",
    description: "Karena mencakup komunikasi kelas, absensi, dan pembayaran, sistem ini lebih realistis dipakai sebagai panel sekolah sehari-hari.",
    tone: "bg-amber-500",
  },
];
</script>
<!-- comment -->

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");

.landing-shell {
  font-family: "Roboto", sans-serif;
  position: relative;
  background: #2d2c2c;
  color: #b3b4b7;
}

.landing-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: none;
  z-index: 0;
}

.landing-shell h1,
.landing-shell h2,
.landing-shell h3,
.landing-shell h4 {
  font-family: "Roboto", sans-serif;
  letter-spacing: -0.02em;
}

.landing-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
  opacity: 0.5;
}

.orb-one {
  top: 32px;
  left: -120px;
  height: 360px;
  width: 360px;
  background: transparent;
}

.orb-two {
  right: -80px;
  top: 420px;
  height: 420px;
  width: 420px;
  background: transparent;
}

.landing-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 84px 84px;
  opacity: 0.38;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.86), transparent 90%);
}

.animate-rise-in {
  animation: riseIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.animate-fade-in-delayed-2 {
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
}

.animate-fade-in-delayed-3 {
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both;
}

.animate-fade-in-delayed-4 {
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.32s both;
}

.animate-fade-in-delayed-5 {
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.42s both;
}

.animate-float-panel {
  animation: riseIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both, floatPanel 6s ease-in-out 1s infinite;
}

.reveal-on-scroll {
  opacity: 0;
  transform: translate3d(0, 36px, 0) scale(0.985);
  transition:
    opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.3s ease;
  will-change: transform, opacity;
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
}

@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatPanel {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {

  .animate-rise-in,
  .animate-fade-in-delayed-2,
  .animate-fade-in-delayed-3,
  .animate-fade-in-delayed-4,
  .animate-fade-in-delayed-5,
  .animate-float-panel,
  .reveal-on-scroll,
  .reveal-on-scroll.is-visible {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
