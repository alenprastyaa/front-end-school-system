<template>
  <div class="landing-shell min-h-screen text-slate-100 isolate overflow-hidden" :style="shellParallaxStyle">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="landing-orb orb-one" :style="orbOneStyle"></div>
      <div class="landing-orb orb-two" :style="orbTwoStyle"></div>
      <div class="landing-grid" :style="gridParallaxStyle"></div>
    </div>

    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07111f]/85 backdrop-blur-md">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-10">
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-900/10 shadow-sm">
            <img class="w-7" src="@/assets/logo/logo.svg" alt="School System" />
          </div>
          <div>
            <!-- <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">Presentasi CMS + LMS</p> -->
            <h1 class="text-lg font-semibold tracking-tight text-white">School System</h1>
          </div>
        </div>

        <nav class="hidden items-center gap-3 md:flex">
          <a v-for="item in navItems" :key="item.href" :href="item.href"
            class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10">
            {{ item.label }}
          </a>
          <router-link to="/auth/login"
            class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Login CMS
          </router-link>
        </nav>
      </div>
    </header>

    <main class="relative z-10">
      <section id="ringkasan" class="mx-auto max-w-7xl px-6 pb-16 pt-32 lg:px-10 lg:pb-24 lg:pt-36">
        <div class="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div class="animate-rise-in" :style="heroCopyStyle">
            <p
              class="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Materi Presentasi Siap Pakai
            </p>
            <h2
              class="mt-6 max-w-5xl text-4xl font-black leading-[0.95] tracking-tight text-white md:text-5xl lg:text-7xl">
              Dokumentasi LEARNING MANGEMENT SYSTEM.
            </h2>
            <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              Halaman ini merangkum cara kerja sistem untuk <strong class="text-white">Admin</strong>, <strong
                class="text-white">Guru</strong>, dan <strong class="text-white">User/Siswa</strong>, lengkap dengan
              contoh dashboard, alur operasional, tabel data dummy, serta skenario penggunaan harian.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
              <router-link to="/auth/login"
                class="inline-flex items-center justify-center rounded-2xl bg-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_30px_rgba(244,63,94,0.18)] transition hover:-translate-y-0.5 hover:bg-rose-400">
                Masuk ke Sistem
              </router-link>
              <router-link to="/student-registration"
                class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-slate-100 transition hover:bg-white/10">
                Registrasi Publik
              </router-link>
            </div>

            <div class="mt-10 grid gap-4 sm:grid-cols-3">
              <article v-for="metric in heroMetrics" :key="metric.label"
                class="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_32px_rgba(0,0,0,0.2)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                <p class="text-3xl font-black tracking-tight text-white">{{ metric.value }}</p>
                <p class="mt-2 text-sm font-semibold text-slate-100">{{ metric.label }}</p>
                <p class="mt-1 text-xs leading-6 text-slate-400">{{ metric.caption }}</p>
              </article>
            </div>

            <div class="mt-10 grid gap-3 md:grid-cols-2">
              <div v-for="item in presentationChecklist" :key="item"
                class="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
                {{ item }}
              </div>
            </div>
          </div>

          <div class="grid gap-4 animate-float-panel" :style="heroPanelStyle">
            <article
              class="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_40px_rgba(0,0,0,0.22)] backdrop-blur">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">Ringkasan Presentasi</p>
                  <h3 class="mt-2 text-2xl font-black tracking-tight text-white">Apa yang akan user lihat</h3>
                </div>
                <div
                  class="rounded-2xl bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200 ring-1 ring-emerald-400/20">
                  Live Demo
                </div>
              </div>

              <div class="mt-6 space-y-3">
                <div v-for="highlight in featureHighlights" :key="highlight.title"
                  class="rounded-2xl border border-slate-900/10 bg-slate-800/90 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-slate-700">
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
                class="rounded-[28px] border border-white/10 bg-[#0f172a]/80 p-5 shadow-[0_18px_30px_rgba(0,0,0,0.18)]">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">Agenda Admin</p>
                <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                  <li v-for="item in quickFlow" :key="item" class="flex gap-3">
                    <span class="mt-1 h-2 w-2 rounded-full bg-rose-400"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <div
                class="rounded-[28px] border border-white/10 bg-[#10231f]/80 p-5 shadow-[0_18px_30px_rgba(0,0,0,0.18)]">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">Nilai Jual Sistem</p>
                <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                  <li v-for="item in quickAdvantages" :key="item" class="flex gap-3">
                    <span class="mt-1 h-2 w-2 rounded-full bg-emerald-300"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="fitur" class="border-y border-white/10 py-16 lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:px-10 xl:grid-cols-[0.72fr_1.28fr]">
          <div class="max-w-3xl xl:sticky xl:top-28 xl:self-start">
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">Modul Sistem</p>
            <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Modul inti yang bisa dijelaskan saat presentasi produk
            </h3>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Bagian ini menjelaskan ruang lingkup sistem, supaya user langsung paham bahwa aplikasi bukan hanya LMS,
              tetapi juga panel operasional sekolah.
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

      <section id="dashboard" class="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div class="grid gap-10 xl:grid-cols-[0.8fr_1.2fr]">
          <div class="xl:sticky xl:top-28 xl:self-start">
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-amber-200">Contoh Dashboard</p>
            <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Ilustrasi ringkas tampilan yang relevan untuk tiap role
            </h3>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Angka di bawah adalah data dummy presentasi. Tujuannya agar user langsung memahami apa yang dipantau oleh
              admin, guru, dan siswa setiap hari.
            </p>
          </div>

          <div class="space-y-6">
            <article v-for="(panel, panelIndex) in dashboardPanels" :key="panel.role"
              class="reveal-on-scroll rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_22px_36px_rgba(0,0,0,0.22)]"
              :style="{ transitionDelay: `${Math.min(panelIndex * 70, 180)}ms` }">
              <div
                class="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.22em]" :class="panel.tone">{{ panel.caption }}
                  </p>
                  <h4 class="mt-2 text-2xl font-black tracking-tight text-white">{{ panel.role }}</h4>
                  <p class="mt-2 max-w-2xl text-sm leading-7 text-slate-300">{{ panel.description }}</p>
                </div>
                <div
                  class="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-200">
                  {{ panel.summary }}
                </div>
              </div>

              <div class="mt-6 grid gap-4 md:grid-cols-4">
                <div v-for="metric in panel.metrics" :key="metric.label"
                  class="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-400">{{ metric.label }}</p>
                  <p class="mt-3 text-3xl font-black text-white">{{ metric.value }}</p>
                  <p class="mt-2 text-xs leading-6 text-slate-400">{{ metric.note }}</p>
                </div>
              </div>

              <div class="mt-6 grid gap-4 lg:grid-cols-2">
                <div class="rounded-2xl border border-white/10 bg-[#0b1322]/80 p-4">
                  <p class="text-sm font-bold text-white">Menu utama yang dibuka</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <span v-for="menu in panel.menuPreview" :key="menu"
                      class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">
                      {{ menu }}
                    </span>
                  </div>
                </div>
                <div class="rounded-2xl border border-white/10 bg-[#1b1423]/80 p-4">
                  <p class="text-sm font-bold text-white">Aktivitas yang biasanya dipantau</p>
                  <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                    <li v-for="item in panel.highlights" :key="item" class="flex gap-3">
                      <span class="mt-1 h-2 w-2 rounded-full bg-amber-300"></span>
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="penggunaan" class="border-y border-white/10 py-16 lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 lg:px-10 xl:grid-cols-[0.78fr_1.22fr]">
          <div class="xl:sticky xl:top-28 xl:self-start">
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-rose-200">Cara Penggunaan</p>
            <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Dokumentasi penggunaan lengkap per role
            </h3>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Struktur ini bisa langsung dipakai saat demo user. Mulai dari login, menu yang dipakai, sampai hasil yang
              diharapkan dari setiap role.
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

              <div class="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div class="rounded-2xl border border-white/10 bg-[#111827]/80 p-4">
                  <p class="text-sm font-bold text-white">Menu yang diperkenalkan saat demo</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <span v-for="menu in role.menus" :key="menu"
                      class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">
                      {{ menu }}
                    </span>
                  </div>
                </div>

                <div class="rounded-2xl border border-white/10 bg-[#0f1d2d]/80 p-4">
                  <p class="text-sm font-bold text-white">Output yang diharapkan</p>
                  <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                    <li v-for="item in role.outcomes" :key="item" class="flex gap-3">
                      <span class="mt-1 h-2 w-2 rounded-full bg-cyan-300"></span>
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="alur" class="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div class="grid gap-10 xl:grid-cols-[0.72fr_1.28fr]">
          <div class="xl:sticky xl:top-28 xl:self-start">
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200">Alur Bisnis</p>
            <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Contoh alur operasional dari awal sampai hasil belajar
            </h3>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Bagian ini cocok dipakai untuk menjelaskan hubungan antar role, supaya user paham siapa menyiapkan apa dan
              siapa menerima hasilnya.
            </p>
          </div>

          <div class="grid gap-5">
            <article v-for="(flow, index) in crossRoleFlow" :key="flow.title"
              class="reveal-on-scroll rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_34px_rgba(0,0,0,0.2)]"
              :style="{ transitionDelay: `${Math.min(index * 70, 210)}ms` }">
              <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div class="max-w-3xl">
                  <div
                    class="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
                    Tahap {{ index + 1 }}
                  </div>
                  <h4 class="mt-3 text-2xl font-black tracking-tight text-white">{{ flow.title }}</h4>
                  <p class="mt-3 text-sm leading-7 text-slate-300">{{ flow.description }}</p>
                </div>
                <div
                  class="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-200">
                  {{ flow.owner }}
                </div>
              </div>

              <div class="mt-5 grid gap-4 md:grid-cols-3">
                <div class="rounded-2xl border border-white/10 bg-[#0c1627]/80 p-4">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Input</p>
                  <p class="mt-3 text-sm leading-7 text-slate-200">{{ flow.input }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-[#1c1121]/80 p-4">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Proses</p>
                  <p class="mt-3 text-sm leading-7 text-slate-200">{{ flow.process }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-[#102019]/80 p-4">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Output</p>
                  <p class="mt-3 text-sm leading-7 text-slate-200">{{ flow.output }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="dummy" class="border-y border-white/10 py-16 lg:py-24">
        <div class="mx-auto max-w-7xl px-6 lg:px-10">
          <div class="max-w-4xl">
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-fuchsia-200">Data Dummy Presentasi</p>
            <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Tabel contoh agar user langsung memahami isi data di dalam aplikasi
            </h3>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Semua tabel di bawah adalah contoh dummy yang aman dipakai saat presentasi. Isinya mewakili data yang
              biasanya muncul di dashboard admin, panel guru, dan halaman siswa.
            </p>
          </div>

          <div class="mt-10 grid gap-6">
            <article v-for="(table, index) in dummyTables" :key="table.title"
              class="reveal-on-scroll rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_36px_rgba(0,0,0,0.2)]"
              :style="{ transitionDelay: `${Math.min(index * 60, 180)}ms` }">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.22em]" :class="table.tone">{{ table.caption }}
                  </p>
                  <h4 class="mt-2 text-2xl font-black tracking-tight text-white">{{ table.title }}</h4>
                  <p class="mt-2 text-sm leading-7 text-slate-300">{{ table.description }}</p>
                </div>
                <div
                  class="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-200">
                  {{ table.summary }}
                </div>
              </div>

              <div class="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table class="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead class="bg-white/5 text-xs uppercase tracking-[0.22em] text-slate-300">
                    <tr>
                      <th v-for="header in table.headers" :key="header" class="px-4 py-3 font-semibold">
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10 bg-slate-950/40">
                    <tr v-for="(row, rowIndex) in table.rows" :key="`${table.title}-${rowIndex}`" class="align-top">
                      <td v-for="(cell, cellIndex) in row" :key="`${table.title}-${rowIndex}-${cellIndex}`"
                        class="px-4 py-3 text-slate-200">
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div
          class="reveal-on-scroll rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-[0_22px_44px_rgba(0,0,0,0.24)] backdrop-blur lg:p-10">
          <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">Penutup Presentasi</p>
              <h3 class="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                Halaman ini sekarang bisa dipakai sebagai dokumen demo produk
              </h3>
              <p class="mt-4 text-base leading-8 text-slate-300">
                Saat presentasi, Anda cukup scroll dari atas ke bawah: mulai dari ringkasan sistem, peran user, contoh
                dashboard, alur proses, lalu tutup dengan data dummy agar calon user memahami isi aplikasi secara
                konkret.
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <router-link to="/auth/login"
                class="flex min-h-[150px] flex-col justify-between rounded-[28px] border border-slate-900/10 bg-slate-950 p-5 transition hover:bg-slate-800">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Akses Internal</p>
                <div>
                  <p class="text-xl font-black tracking-tight text-white">Login CMS & LMS</p>
                  <p class="mt-2 text-sm leading-6 text-slate-200">Masuk sebagai admin, guru, atau siswa untuk demo
                    langsung.</p>
                </div>
              </router-link>
              <router-link to="/student-registration"
                class="flex min-h-[150px] flex-col justify-between rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-5 transition hover:bg-rose-500/15">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">Akses Publik</p>
                <div>
                  <p class="text-xl font-black tracking-tight text-white">Registrasi Siswa</p>
                  <p class="mt-2 text-sm leading-6 text-slate-200">Tunjukkan juga proses onboarding siswa dari halaman
                    publik.</p>
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

const navItems = [
  { href: "#ringkasan", label: "Ringkasan" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#penggunaan", label: "Penggunaan" },
  { href: "#dummy", label: "Data Dummy" },
];

const heroMetrics = [
  { value: "3 role", label: "Role utama", caption: "Admin, Guru, dan Siswa mendapat alur kerja yang berbeda." },
  { value: "10+", label: "Modul aktif", caption: "Mencakup struktur sekolah, pembelajaran, evaluasi, dan layanan siswa." },
  { value: "1 page", label: "Materi presentasi", caption: "Seluruh ringkasan penggunaan sudah dirangkum di landing page ini." },
];

const presentationChecklist = [
  "Ringkasan sistem dan ruang lingkup modul untuk admin, guru, dan siswa.",
  "Contoh dashboard role-based agar user paham apa yang mereka lihat setelah login.",
  "Panduan penggunaan langkah demi langkah untuk onboarding dan training.",
  "Tabel dummy presentasi untuk menggambarkan data nyata tanpa memakai data produksi.",
];

const featureHighlights = [
  {
    index: "01",
    title: "Panel admin sekolah",
    description: "Admin mengelola user, kelas, periode akademik, dan pengaturan inti sebelum aktivitas belajar dimulai.",
    tone: "bg-cyan-600",
  },
  {
    index: "02",
    title: "Workspace guru",
    description: "Guru menyiapkan materi, bank soal, quiz, ujian, penilaian, serta komunikasi mapel dari satu area kerja.",
    tone: "bg-rose-500",
  },
  {
    index: "03",
    title: "Pengalaman siswa",
    description: "Siswa menerima materi, mengerjakan evaluasi, memantau nilai, absensi, dan layanan lain dalam akun yang sama.",
    tone: "bg-emerald-600",
  },
];

const quickFlow = [
  "Siapkan tahun ajaran, semester, kelas, mapel, dan akun user.",
  "Pastikan guru mengisi materi, tugas, bank soal, dan jadwal evaluasi.",
  "Pantau progres siswa melalui quiz, ujian resmi, nilai, dan kehadiran.",
];

const quickAdvantages = [
  "Presentasi produk lebih mudah karena user langsung melihat contoh role dan datanya.",
  "CMS dan LMS tidak dipisah, jadi alur operasional sekolah terasa lebih realistis.",
  "Data dummy membantu user non-teknis membayangkan isi dashboard tanpa harus login dulu.",
];

const cmsModules = [
  {
    tag: "Core CMS",
    tagTone: "text-cyan-200",
    title: "Dashboard Eksekutif",
    badge: "Ringkasan",
    badgeTone: "bg-cyan-500/10 text-cyan-200 ring-cyan-400/20",
    description: "Menampilkan ringkasan aktivitas utama sesuai role, termasuk status user, kelas, pembelajaran, dan evaluasi.",
  },
  {
    tag: "Core CMS",
    tagTone: "text-cyan-200",
    title: "Manajemen User Sekolah",
    badge: "Admin",
    badgeTone: "bg-cyan-500/10 text-cyan-200 ring-cyan-400/20",
    description: "Mengelola akun admin, guru, dan siswa, termasuk relasi kelas, mapel, dan status akses akun.",
  },
  {
    tag: "Akademik",
    tagTone: "text-emerald-200",
    title: "Kelas & Tahun Ajaran",
    badge: "Terstruktur",
    badgeTone: "bg-emerald-500/10 text-emerald-200 ring-emerald-400/20",
    description: "Menentukan kelas aktif, wali kelas, tahun ajaran, dan semester agar semua modul mengikuti struktur yang sama.",
  },
  {
    tag: "LMS Guru",
    tagTone: "text-rose-200",
    title: "Materi Pembelajaran",
    badge: "Konten",
    badgeTone: "bg-rose-500/10 text-rose-200 ring-rose-400/20",
    description: "Guru dapat menyiapkan konten belajar, file, dan materi yang bisa diakses siswa berdasarkan mapel dan kelas.",
  },
  {
    tag: "Interaksi",
    tagTone: "text-violet-200",
    title: "Live Chat Kelas",
    badge: "Realtime",
    badgeTone: "bg-violet-500/10 text-violet-200 ring-violet-400/20",
    description: "Memfasilitasi diskusi antara guru dan siswa per mapel agar pembelajaran tidak berhenti di materi statis.",
  },
  {
    tag: "Evaluasi",
    tagTone: "text-amber-200",
    title: "Bank Soal",
    badge: "Reusable",
    badgeTone: "bg-amber-500/10 text-amber-200 ring-amber-400/20",
    description: "Guru menyimpan soal pilihan ganda atau essay untuk digunakan kembali pada quiz dan ujian resmi.",
  },
  {
    tag: "Evaluasi",
    tagTone: "text-amber-200",
    title: "Quiz Harian",
    badge: "Cepat",
    badgeTone: "bg-amber-500/10 text-amber-200 ring-amber-400/20",
    description: "Dipakai untuk evaluasi rutin dengan durasi tertentu, status pengerjaan, dan penilaian yang mudah dipantau.",
  },
  {
    tag: "Evaluasi",
    tagTone: "text-amber-200",
    title: "Ujian Resmi",
    badge: "Terkontrol",
    badgeTone: "bg-amber-500/10 text-amber-200 ring-amber-400/20",
    description: "Admin membuat task ujian, guru menyerahkan paket soal, lalu admin menerbitkan sesi ke siswa secara resmi.",
  },
  {
    tag: "Monitoring",
    tagTone: "text-sky-200",
    title: "Nilai & Rapor Mapel",
    badge: "Analitik",
    badgeTone: "bg-sky-500/10 text-sky-200 ring-sky-400/20",
    description: "Guru membaca hasil belajar, memeriksa submission, dan menyusun rekap performa siswa per mata pelajaran.",
  },
  {
    tag: "Siswa",
    tagTone: "text-fuchsia-200",
    title: "Absensi & Pembayaran",
    badge: "Layanan",
    badgeTone: "bg-fuchsia-500/10 text-fuchsia-200 ring-fuchsia-400/20",
    description: "Selain belajar, siswa juga dapat mengakses kehadiran dan bukti pembayaran dari akun yang sama.",
  },
  {
    tag: "Operasional",
    tagTone: "text-indigo-200",
    title: "Pengaturan Admin",
    badge: "Konfigurasi",
    badgeTone: "bg-indigo-500/10 text-indigo-200 ring-indigo-400/20",
    description: "Digunakan untuk mengendalikan parameter penting yang memengaruhi operasional aplikasi sekolah sehari-hari.",
  },
  {
    tag: "Publik",
    tagTone: "text-teal-200",
    title: "Registrasi Siswa Publik",
    badge: "Onboarding",
    badgeTone: "bg-teal-500/10 text-teal-200 ring-teal-400/20",
    description: "Formulir publik mempermudah proses pendaftaran siswa baru sebelum mereka masuk ke area internal.",
  },
];

const dashboardPanels = [
  {
    role: "Dashboard Admin",
    caption: "Role pengendali operasional",
    tone: "text-cyan-200",
    summary: "Fokus pada kontrol sekolah, user, kelas, dan ujian resmi.",
    description: "Admin memakai dashboard untuk memastikan struktur sekolah siap dipakai, akun user aktif, dan agenda pembelajaran berjalan sesuai kalender akademik.",
    metrics: [
      { label: "Total Guru", value: "28", note: "Guru aktif di seluruh mapel semester ini." },
      { label: "Total Siswa", value: "486", note: "Siswa aktif terdaftar di kelas reguler." },
      { label: "Kelas Aktif", value: "18", note: "Kelas yang sedang berjalan pada semester genap." },
      { label: "Ujian Resmi", value: "6", note: "Task ujian yang sudah dijadwalkan admin." },
    ],
    menuPreview: ["Dashboard", "User Sekolah", "Kelas", "Tahun Ajaran", "Pembelajaran Admin", "Ujian Resmi", "Setting Admin"],
    highlights: [
      "Akun guru dan siswa yang belum lengkap atau belum aktif.",
      "Kelas yang belum memiliki wali kelas atau mapel lengkap.",
      "Task ujian resmi yang menunggu paket soal dari guru.",
    ],
  },
  {
    role: "Dashboard Guru",
    caption: "Role pengajar",
    tone: "text-rose-200",
    summary: "Fokus pada mapel, materi, quiz, ujian, dan penilaian.",
    description: "Guru memakai dashboard untuk melihat beban mengajar, tugas evaluasi yang masih berjalan, chat kelas, dan submission yang menunggu penilaian.",
    metrics: [
      { label: "Mapel Diampu", value: "4", note: "Mapel aktif yang terhubung ke kelas guru." },
      { label: "Materi Aktif", value: "17", note: "Materi yang sudah dipublikasikan ke siswa." },
      { label: "Quiz Minggu Ini", value: "3", note: "Quiz yang sedang dibuka atau baru selesai." },
      { label: "Belum Dinilai", value: "24", note: "Submission siswa yang masih menunggu review." },
    ],
    menuPreview: ["Pembelajaran", "Bank Soal", "Quiz Guru", "Ujian Guru", "Nilai", "Rapor Mapel", "Live Chat"],
    highlights: [
      "Materi baru yang perlu dipublikasikan untuk minggu berjalan.",
      "Quiz aktif dan daftar siswa yang belum submit.",
      "Submission essay yang perlu koreksi manual.",
    ],
  },
  {
    role: "Dashboard Siswa",
    caption: "Role user / peserta belajar",
    tone: "text-emerald-200",
    summary: "Fokus pada materi, tugas, ujian, nilai, dan layanan siswa.",
    description: "Siswa memakai dashboard untuk melihat daftar materi terbaru, jadwal quiz atau ujian, nilai terakhir, absensi, dan pengumuman penting dari sekolah.",
    metrics: [
      { label: "Mapel Aktif", value: "8", note: "Mapel yang tampil sesuai kelas siswa." },
      { label: "Tugas Aktif", value: "5", note: "Materi atau evaluasi yang masih perlu dikerjakan." },
      { label: "Nilai Rata-rata", value: "88", note: "Rata-rata nilai quiz dan tugas terbaru." },
      { label: "Kehadiran", value: "96%", note: "Persentase absensi semester berjalan." },
    ],
    menuPreview: ["Dashboard", "Pembelajaran", "Quiz", "Ujian", "Nilai", "Absensi", "Bukti Pembayaran"],
    highlights: [
      "Materi baru dari guru yang harus dibaca minggu ini.",
      "Quiz atau ujian yang jadwalnya segera dimulai.",
      "Nilai terbaru dan feedback guru setelah submission dinilai.",
    ],
  },
];

const usageFlows = [
  {
    role: "Untuk Admin Sekolah",
    caption: "Role pengendali sistem",
    summary: "Mengatur struktur sekolah, user, akademik, dan ujian resmi.",
    roleTone: "text-cyan-200",
    stepTone: "bg-cyan-600",
    menus: ["Dashboard", "User Sekolah", "Kelas", "Tahun Ajaran", "Pembelajaran Admin", "Ujian Resmi", "Setting Admin"],
    outcomes: [
      "Semua akun guru dan siswa terdaftar dengan peran yang benar.",
      "Kalender akademik aktif sehingga modul lain tersusun rapi.",
      "Ujian resmi terjadwal, dipublikasikan, dan dapat dimonitor.",
    ],
    steps: [
      { title: "Login sebagai admin", description: "Masuk ke dashboard lalu cek ringkasan user, kelas, dan status modul yang sedang aktif." },
      { title: "Kelola user sekolah", description: "Tambahkan akun guru, siswa, dan admin sekolah bila diperlukan, lalu pastikan role masing-masing benar." },
      { title: "Siapkan kelas dan periode", description: "Buat kelas, wali kelas, tahun ajaran, serta semester aktif agar data pembelajaran terstruktur." },
      { title: "Monitoring pembelajaran", description: "Periksa panel pembelajaran admin untuk memastikan mapel, guru, dan kegiatan evaluasi sudah siap." },
      { title: "Jalankan ujian resmi", description: "Buat task ujian, tunggu guru mengirim paket soal, lalu terbitkan ke siswa sesuai jadwal." },
      { title: "Tinjau setting admin", description: "Lakukan penyesuaian konfigurasi umum bila ada kebutuhan operasional tambahan." },
    ],
  },
  {
    role: "Untuk Guru",
    caption: "Role pengajar",
    summary: "Mengelola materi, bank soal, evaluasi, nilai, dan laporan mapel.",
    roleTone: "text-rose-200",
    stepTone: "bg-rose-500",
    menus: ["Pembelajaran", "Live Chat", "Bank Soal", "Quiz Guru", "Ujian Guru", "Nilai", "Rapor Mapel"],
    outcomes: [
      "Materi belajar terbit sesuai mapel dan kelas.",
      "Soal tersimpan rapi dan bisa dipakai ulang untuk evaluasi berikutnya.",
      "Nilai dan feedback siswa tercatat serta mudah dibaca kembali.",
    ],
    steps: [
      { title: "Masuk ke modul pembelajaran", description: "Buka mapel yang diampu, lalu cek materi yang sudah tayang dan daftar kelas yang terhubung." },
      { title: "Unggah atau perbarui materi", description: "Tambahkan konten pembelajaran agar siswa bisa membaca materi sebelum quiz atau ujian." },
      { title: "Siapkan bank soal", description: "Masukkan soal MCQ atau essay untuk membangun aset evaluasi yang reusable." },
      { title: "Buat quiz harian", description: "Tentukan judul, durasi, kelas target, dan soal yang akan dipakai untuk evaluasi cepat." },
      { title: "Penuhi task ujian resmi", description: "Jika ada task dari admin, guru menyusun paket soal lalu menyerahkannya untuk diverifikasi." },
      { title: "Nilai hasil siswa", description: "Periksa submission, beri skor, tambahkan feedback, lalu pantau rapor mapel." },
    ],
  },
  {
    role: "Untuk User / Siswa",
    caption: "Role peserta belajar",
    summary: "Belajar, berdiskusi, mengerjakan evaluasi, dan memantau progres pribadi.",
    roleTone: "text-emerald-200",
    stepTone: "bg-emerald-600",
    menus: ["Dashboard", "Pembelajaran", "Live Chat", "Quiz", "Ujian", "Nilai", "Absensi", "Bukti Pembayaran"],
    outcomes: [
      "Siswa tahu materi apa yang harus dipelajari dan kapan evaluasi dibuka.",
      "Siswa bisa mengirim jawaban dan melihat nilai tanpa berpindah sistem.",
      "Layanan pendukung seperti absensi dan pembayaran tetap tersedia dalam akun yang sama.",
    ],
    steps: [
      { title: "Login ke dashboard siswa", description: "Buka dashboard untuk melihat ringkasan mapel aktif, tugas berjalan, dan pengumuman sekolah." },
      { title: "Pelajari materi", description: "Masuk ke panel pembelajaran untuk membaca materi dari guru sesuai kelas." },
      { title: "Gunakan live chat", description: "Kirim pertanyaan ke guru bila ada materi yang belum dipahami." },
      { title: "Kerjakan quiz", description: "Masuk ke modul quiz saat jadwal aktif, lalu kirim jawaban sebelum waktu habis." },
      { title: "Ikuti ujian resmi", description: "Buka sesi ujian yang dijadwalkan admin dan kerjakan dengan aturan yang berlaku." },
      { title: "Pantau hasil", description: "Cek nilai, feedback guru, kehadiran, dan data pembayaran dari dashboard atau menu terkait." },
    ],
  },
];

const crossRoleFlow = [
  {
    title: "Persiapan semester baru",
    owner: "Owner: Admin",
    description: "Admin memulai periode baru dengan menyiapkan struktur sekolah agar semua modul pembelajaran dapat dipakai tanpa konflik data.",
    input: "Data kelas, guru, siswa, tahun ajaran, semester, dan mata pelajaran.",
    process: "Admin membuat atau memvalidasi seluruh master data, lalu menetapkan periode yang aktif.",
    output: "Seluruh role siap bekerja di semester baru dengan struktur data yang jelas.",
  },
  {
    title: "Pelaksanaan pembelajaran harian",
    owner: "Owner: Guru",
    description: "Guru mengelola materi, komunikasi mapel, dan evaluasi kecil seperti quiz untuk memastikan ritme belajar berjalan teratur.",
    input: "Materi ajar, bank soal, daftar kelas, dan target pembelajaran mingguan.",
    process: "Guru mempublikasikan materi, membuka chat, lalu memberi quiz sesuai kebutuhan kelas.",
    output: "Siswa menerima materi, berinteraksi, dan mengerjakan evaluasi rutin.",
  },
  {
    title: "Ujian resmi terkontrol",
    owner: "Owner: Admin + Guru",
    description: "Untuk ujian resmi, admin dan guru bekerja dalam alur yang lebih ketat agar paket soal dan jadwal pelaksanaan terdokumentasi dengan baik.",
    input: "Task ujian dari admin, paket soal dari guru, jadwal sesi, dan kelas target.",
    process: "Guru menyerahkan paket soal, admin meninjau lalu menerbitkannya ke siswa pada waktu yang ditentukan.",
    output: "Siswa mengerjakan ujian resmi melalui sesi yang terjadwal dan lebih aman.",
  },
  {
    title: "Penilaian dan tindak lanjut",
    owner: "Owner: Guru + Siswa",
    description: "Setelah evaluasi selesai, guru menilai hasil siswa dan siswa dapat membaca skor maupun umpan balik untuk perbaikan.",
    input: "Submission quiz atau ujian, kunci jawaban, rubric, dan catatan guru.",
    process: "Guru menilai, memberi feedback, lalu hasil tampil kembali di panel siswa.",
    output: "Nilai tersimpan, performa kelas dapat dipantau, dan siswa tahu area yang perlu diperbaiki.",
  },
];

const dummyTables = [
  {
    caption: "Dummy Admin",
    tone: "text-cyan-200",
    title: "Contoh data master user dan kelas",
    description: "Tabel ini menggambarkan data yang biasanya diperiksa admin saat onboarding awal semester.",
    summary: "Dipakai untuk demo manajemen user sekolah.",
    headers: ["Nama", "Role", "Kelas / Tanggung Jawab", "Status", "Catatan"],
    rows: [
      ["Nadia Putri", "Admin", "Operasional Sekolah", "Aktif", "Mengelola user, kelas, dan ujian resmi"],
      ["Budi Santoso", "Guru", "Matematika - Kelas 10A, 10B", "Aktif", "Guru mapel sekaligus pembuat quiz"],
      ["Rina Lestari", "Guru", "Bahasa Indonesia - Kelas 10A", "Aktif", "Aktif di live chat dan penilaian essay"],
      ["Alya Ramadhani", "Siswa", "Kelas 10A", "Aktif", "Mengikuti 8 mapel semester genap"],
      ["Farhan Akbar", "Siswa", "Kelas 10B", "Menunggu", "Akun dibuat, belum login pertama kali"],
    ],
  },
  {
    caption: "Dummy Guru",
    tone: "text-rose-200",
    title: "Contoh data quiz dan evaluasi mapel",
    description: "Tabel ini membantu menjelaskan apa yang dilihat guru saat mengelola evaluasi harian.",
    summary: "Dipakai untuk demo workflow bank soal dan quiz.",
    headers: ["Quiz", "Mapel", "Kelas", "Jadwal", "Status", "Partisipasi"],
    rows: [
      ["Quiz Aljabar Linear", "Matematika", "10A", "08 Mei 2026 09:00", "Terjadwal", "32 siswa"],
      ["Latihan Pecahan", "Matematika", "10B", "06 Mei 2026 10:00", "Aktif", "29 dari 31 siswa submit"],
      ["Essay Cerpen", "Bahasa Indonesia", "10A", "04 Mei 2026 11:00", "Selesai", "30 submission, 8 belum dinilai"],
      ["Kuis Kosakata", "Bahasa Inggris", "10A", "02 Mei 2026 08:30", "Selesai", "Nilai otomatis sudah terbit"],
    ],
  },
  {
    caption: "Dummy Siswa",
    tone: "text-emerald-200",
    title: "Contoh data tugas dan progres siswa",
    description: "Tabel ini menggambarkan apa yang dilihat siswa setelah login ke dashboard atau modul pembelajaran.",
    summary: "Dipakai untuk demo pengalaman user akhir.",
    headers: ["Mapel", "Materi / Tugas", "Deadline", "Status", "Nilai / Feedback"],
    rows: [
      ["Matematika", "Quiz Aljabar Linear", "08 Mei 2026 10:00", "Belum Dikerjakan", "-"],
      ["Bahasa Indonesia", "Essay Cerpen", "04 Mei 2026 13:00", "Sudah Submit", "Menunggu penilaian guru"],
      ["Biologi", "Materi Sistem Organ", "Tidak ada", "Sudah Dibaca", "Materi selesai dipelajari"],
      ["Sejarah", "Rangkuman Bab 5", "07 Mei 2026 15:00", "Dalam Proses", "Draft tersimpan"],
      ["PPKn", "Quiz Kewarganegaraan", "03 Mei 2026 09:30", "Selesai", "92/100 - bagus, pertahankan"],
    ],
  },
  {
    caption: "Dummy Ujian Resmi",
    tone: "text-amber-200",
    title: "Contoh data monitoring ujian resmi",
    description: "Tabel ini relevan saat presentasi fitur ujian resmi admin dan guru.",
    summary: "Dipakai untuk demo alur task ujian resmi.",
    headers: ["Nama Ujian", "Mapel", "Kelas", "Guru", "Status", "Keterangan"],
    rows: [
      ["UTS Matematika Genap", "Matematika", "10A", "Budi Santoso", "PUBLISHED", "Sudah dibuka ke siswa"],
      ["UTS Bahasa Indonesia", "Bahasa Indonesia", "10A", "Rina Lestari", "READY_REVIEW", "Paket soal menunggu verifikasi admin"],
      ["Ujian Sekolah Biologi", "Biologi", "12IPA", "Dewi Sartika", "DRAFT", "Admin sudah buat task, guru belum submit soal"],
      ["UAS Sejarah", "Sejarah", "11IPS", "Arif Nugroho", "COMPLETED", "Pelaksanaan selesai, hasil siap direkap"],
    ],
  },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");

.landing-shell {
  font-family: "Roboto", sans-serif;
  position: relative;
  background:
    radial-gradient(circle at top left, rgba(6, 182, 212, 0.12), transparent 28%),
    radial-gradient(circle at 85% 15%, rgba(244, 63, 94, 0.14), transparent 24%),
    linear-gradient(180deg, #06101d 0%, #091524 42%, #050914 100%);
  color: #cbd5e1;
}

.landing-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(120deg, rgba(255, 255, 255, 0.02), transparent 24%, transparent 76%, rgba(255, 255, 255, 0.02)),
    linear-gradient(180deg, rgba(255, 255, 255, 0.01), transparent 30%);
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
  opacity: 0.55;
}

.orb-one {
  top: 24px;
  left: -120px;
  height: 360px;
  width: 360px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent 68%);
}

.orb-two {
  right: -80px;
  top: 420px;
  height: 420px;
  width: 420px;
  background: radial-gradient(circle, rgba(244, 63, 94, 0.28), transparent 70%);
}

.landing-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 84px 84px;
  opacity: 0.3;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent 92%);
}

.animate-rise-in {
  animation: rise-in 0.9s ease-out both;
}

.animate-float-panel {
  animation: float-panel 8s ease-in-out infinite alternate;
}

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(26px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float-panel {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-8px);
  }
}

@media (max-width: 768px) {
  .animate-float-panel {
    animation: none;
  }
}
</style>
