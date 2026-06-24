<template>
  <div
    class="landing-page min-h-screen bg-[#0f2438] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900">
    <!-- NAVBAR -->
    <header
      class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md transition-all">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <a href="#beranda" class="flex items-center gap-3" @click="closeMobileMenu">
          <img class="h-12 w-12 rounded-xl object-contain md:h-14 md:w-14" src="/logob.png"
            alt="Bitwize Digital Platform" />
          <span>
            <span class="block text-lg font-black tracking-tight text-slate-900 md:text-xl">Bitwize</span>
            <span class="block text-xs font-bold tracking-wide text-slate-500 uppercase md:text-[13px]">Digital
              Platform</span>
          </span>
        </a>

        <nav class="hidden items-center gap-2 lg:flex">
          <a v-for="item in navItems" :key="item.href" :href="item.href"
            class="rounded-lg px-3.5 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700">
            {{ item.label }}
          </a>
        </nav>

        <div class="hidden items-center gap-3 lg:flex">
          <router-link to="/auth/login"
            class="rounded-xl px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
            Login
          </router-link>
          <a href="#harga"
            class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-sm font-bold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            Lihat Paket
          </a>
        </div>

        <button type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'" aria-controls="landing-mobile-menu"
          aria-label="Buka menu navigasi" @click="toggleMobileMenu">
          <Icon :icon="isMobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'" />
        </button>
      </div>

      <!-- MOBILE MENU -->
      <div v-if="isMobileMenuOpen" id="landing-mobile-menu"
        class="border-t border-slate-200 bg-white px-5 py-5 shadow-2xl lg:hidden">
        <nav class="mx-auto grid max-w-7xl gap-2">
          <a v-for="item in navItems" :key="`mobile-${item.href}`" :href="item.href"
            class="rounded-xl px-4 py-3 text-base font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            @click="closeMobileMenu">
            {{ item.label }}
          </a>
          <div class="mt-2 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <router-link to="/auth/login"
              class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
              @click="closeMobileMenu">
              Login
            </router-link>
            <a href="#harga"
              class="inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-900"
              @click="closeMobileMenu">
              Lihat Paket
            </a>
          </div>
        </nav>
      </div>
    </header>

    <main id="beranda">
      <!-- HERO SECTION -->
      <section class="border-b border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div class="mx-auto max-w-4xl text-center">
            <div v-if="hero.eyebrow"
              class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-6">
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {{ hero.eyebrow }}
            </div>

            <h1
              class="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:leading-[1.1]">
              {{ hero.title }}
            </h1>

            <p class="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
              {{ hero.subtitle }}
            </p>

            <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a :href="hero.primaryHref"
                class="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-blue-600/30">
                {{ hero.primaryLabel }}
                <Icon icon="ph:arrow-right-bold" class="transition-transform group-hover:translate-x-1" />
              </a>
              <a :href="hero.secondaryHref"
                class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300">
                <Icon icon="ph:magnifying-glass-bold" class="text-slate-400" />
                {{ hero.secondaryLabel }}
              </a>
            </div>

            <div class="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
              <div v-for="metric in heroMetrics" :key="metric.label"
                class="flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 p-6">
                <p class="text-3xl font-black text-slate-900">{{ metric.value }}</p>
                <p class="mt-2 text-sm font-semibold text-slate-500">{{ metric.label }}</p>
              </div>
            </div>
          </div>

          <!-- Dashboard Mockup -->
          <div class="mt-16 mx-auto rounded-[2rem] border border-slate-200 bg-slate-50 p-2 shadow-xl lg:p-4">
            <div class="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center gap-2 bg-slate-100 border-b border-slate-200 px-4 py-3">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-rose-400"></div>
                  <div class="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div class="h-3 w-3 rounded-full bg-emerald-400"></div>
                </div>
                <div
                  class="mx-auto flex items-center justify-center rounded-md bg-white px-10 sm:px-24 py-1 text-xs font-semibold text-slate-400 shadow-sm border border-slate-200">
                  <Icon icon="ph:lock-key-fill" class="mr-1" /> bitwize.id
                </div>
              </div>

              <div class="p-4 lg:p-6 bg-white">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 class="text-xl font-bold tracking-tight text-slate-900">{{ dashboardPreview.schoolName }}</h2>
                    <p class="text-sm text-slate-500">Ringkasan operasional hari ini</p>
                  </div>
                  <span
                    class="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Live Sistem
                  </span>
                </div>

                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                  <div v-for="item in dashboardPreview.summaryCards" :key="item.label"
                    class="rounded-2xl p-5 text-white shadow-sm transition-transform hover:-translate-y-1"
                    :class="item.cardClass">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <p class="text-xs font-medium text-white/90">{{ item.label }}</p>
                        <p class="mt-1 text-3xl font-black tracking-tight">{{ item.value }}</p>
                        <p class="mt-2 text-xs font-medium text-white/80">{{ item.caption }}</p>
                      </div>
                      <div class="rounded-xl bg-white/20 p-2">
                        <Icon :icon="item.icon" class="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <!-- Chart -->
                  <div class="rounded-2xl border border-slate-200 bg-white p-5">
                    <div class="mb-6">
                      <h3 class="text-base font-bold text-slate-900">Tren Aktivitas LMS</h3>
                      <p class="text-xs text-slate-500">Statistik 6 bulan terakhir</p>
                    </div>
                    <svg class="h-64 w-full" viewBox="0 0 640 260" fill="none">
                      <line v-for="y in lineChartGridY" :key="`grid-${y}`" x1="44" x2="616" :y1="y" :y2="y"
                        stroke="#f1f5f9" stroke-width="2" stroke-dasharray="4 4" />
                      <line x1="44" x2="616" y1="220" y2="220" stroke="#cbd5e1" stroke-width="2" />

                      <text v-for="label in lineChartYAxis" :key="`axis-${label.value}`" x="30" :y="label.y + 4"
                        text-anchor="end" class="fill-slate-400 text-xs font-bold">{{ label.value }}</text>
                      <text v-for="point in lineChartMonths" :key="point.label" :x="point.x" y="244"
                        text-anchor="middle" class="fill-slate-500 text-xs font-bold">{{ point.label }}</text>

                      <g v-for="series in lineChartSeries" :key="series.label">
                        <polyline :points="series.points" fill="none" :stroke="series.color" stroke-width="4"
                          stroke-linecap="round" stroke-linejoin="round" />
                        <circle v-for="point in series.dots" :key="`${series.label}-${point.x}-${point.y}`"
                          :cx="point.x" :cy="point.y" r="5" fill="white" :stroke="series.color" stroke-width="3" />
                      </g>
                    </svg>
                    <div class="mt-4 flex flex-wrap gap-4">
                      <div v-for="series in lineChartSeries" :key="`legend-${series.label}`"
                        class="flex items-center gap-2">
                        <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: series.color }"></span>
                        <span class="text-xs font-bold text-slate-600">{{ series.label }} <span
                            class="text-slate-900 ml-1">{{ series.latest }}</span></span>
                      </div>
                    </div>
                  </div>

                  <!-- Attendance -->
                  <div class="rounded-2xl bg-slate-900 p-5 text-white">
                    <div class="flex items-center justify-between mb-5">
                      <div>
                        <h3 class="text-base font-bold text-white">Live Absensi</h3>
                        <p class="text-xs text-slate-400">Hari ini</p>
                      </div>
                      <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">92% Hadir</span>
                    </div>

                    <div class="grid grid-cols-2 gap-3 mb-6">
                      <div class="rounded-xl bg-white/10 p-3">
                        <p class="text-xs font-medium text-slate-400">Total Hadir</p>
                        <p class="mt-1 text-2xl font-black text-white">1.148</p>
                      </div>
                      <div class="rounded-xl bg-white/10 p-3">
                        <p class="text-xs font-medium text-slate-400">Izin/Sakit</p>
                        <p class="mt-1 text-2xl font-black text-white">100</p>
                      </div>
                    </div>

                    <div class="space-y-3">
                      <div v-for="item in recentAttendance" :key="item.name"
                        class="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3">
                        <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="item.dotClass"></span>
                        <div class="min-w-0 flex-1">
                          <p class="truncate text-sm font-bold text-white">{{ item.name }}</p>
                          <p class="text-xs text-slate-400">{{ item.note }}</p>
                        </div>
                        <span class="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                          :class="item.badgeClass">
                          {{ item.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PAIN SECTION -->
      <section id="masalah" class="bg-slate-50 py-16 lg:py-24 border-b border-slate-200">
        <div class="mx-auto max-w-7xl px-5 lg:px-8">
          <div class="max-w-3xl">
            <h2 class="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              {{ painSection.title }}
            </h2>
            <p class="mt-3 text-lg text-slate-600 font-medium">Beralihlah ke sistem digital terpadu. {{
              painSection.eyebrow }}:</p>
          </div>
          <div class="mt-10 grid gap-6 md:grid-cols-3">
            <article v-for="pain in painSection.items" :key="pain.title"
              class="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-3xl text-rose-500">
                <Icon :icon="pain.icon" />
              </span>
              <h3 class="mt-5 text-lg font-bold text-slate-900">{{ pain.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ pain.desc }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- FEATURES SECTION -->
      <section id="fitur" class="bg-slate-900 py-16 lg:py-24">
        <div class="mx-auto max-w-7xl px-5 lg:px-8">
          <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-10">
            <div class="max-w-2xl">
              <p class="text-sm font-bold uppercase tracking-widest text-amber-400">{{ featuresSection.eyebrow }}</p>
              <h2 class="mt-3 text-3xl font-black text-white md:text-4xl">
                {{ featuresSection.title }}
              </h2>
            </div>
            <a :href="featuresSection.ctaHref"
              class="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20">
              {{ featuresSection.ctaLabel }}
              <Icon icon="ph:arrow-right-bold" />
            </a>
          </div>

          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article v-for="feature in featuresSection.items" :key="feature.title"
              class="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/10">
              <div class="flex flex-col gap-4">
                <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-2xl text-white">
                  <Icon :icon="feature.icon" />
                </span>
                <div>
                  <h3 class="text-base font-bold text-white">{{ feature.title }}</h3>
                  <p class="mt-2 text-sm leading-relaxed text-slate-300">{{ feature.desc }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- WORKFLOW SECTION -->
      <section id="alur" class="bg-white py-16 lg:py-24 border-b border-slate-200">
        <div class="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p class="text-sm font-bold uppercase tracking-widest text-blue-600">{{ workflowSection.eyebrow }}</p>
            <h2 class="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
              {{ workflowSection.title }}
            </h2>
            <p class="mt-4 text-base leading-relaxed text-slate-600">
              {{ workflowSection.description }}
            </p>
          </div>
          <div class="space-y-4">
            <div v-for="(step, index) in workflowSection.items" :key="step.title"
              class="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900">{{ step.title }}</h3>
                <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ROLES SECTION -->
      <section id="peran" class="bg-slate-50 py-16 lg:py-24 border-b border-slate-200">
        <div class="mx-auto max-w-7xl px-5 lg:px-8">
          <div class="mx-auto max-w-3xl text-center mb-10">
            <p class="text-sm font-bold uppercase tracking-widest text-blue-600">{{ rolesSection.eyebrow }}</p>
            <h2 class="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
              {{ rolesSection.title }}
            </h2>
          </div>
          <div class="grid gap-6 md:grid-cols-3">
            <article v-for="role in rolesSection.items" :key="role.title"
              class="flex flex-col items-center text-center rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md">
              <div
                class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-600 mb-4">
                <Icon :icon="role.icon" />
              </div>
              <h3 class="text-lg font-bold text-slate-900">{{ role.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ role.desc }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- PRICING SECTION (DIPERKECIL) -->
      <section id="harga" class="bg-slate-50 py-16 lg:py-24 border-b border-slate-200">
        <div class="mx-auto max-w-7xl px-5 lg:px-8">
          <div class="mx-auto max-w-3xl text-center mb-12">
            <p class="text-sm font-bold uppercase tracking-widest text-amber-500">{{ pricingSection.eyebrow }}</p>
            <h2 class="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
              {{ pricingSection.title }}
            </h2>
            <p class="mt-3 text-base leading-relaxed text-slate-600">
              {{ pricingSection.description }}
            </p>
          </div>

          <div v-if="isLoading" class="grid gap-5 lg:grid-cols-3 max-w-5xl mx-auto">
            <div v-for="n in 3" :key="`sk-${n}`"
              class="rounded-[1.5rem] border border-slate-200 bg-white p-6 animate-pulse">
              <div class="h-5 w-2/3 bg-slate-200 rounded"></div>
              <div class="mt-5 h-10 w-3/4 bg-slate-200 rounded"></div>
              <div class="mt-6 space-y-3">
                <div v-for="m in 6" :key="`sk-${n}-${m}`" class="h-3 w-full bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>

          <!-- Cards Layout Sesuai Gambar (Lebih Kecil) -->
          <div v-else class="grid gap-5 lg:grid-cols-3 lg:items-center max-w-5xl mx-auto">
            <article v-for="(pkg, idx) in packages" :key="pkg.id"
              class="relative flex flex-col rounded-[1.5rem] p-6 transition-all hover:shadow-2xl h-full"
              :class="pkg.is_popular ? 'bg-[#021136] text-white lg:scale-105 z-10 py-8 shadow-2xl' : 'bg-white border border-slate-100 shadow-xl'">

              <!-- POPULAR BADGE -->
              <div v-if="pkg.badge_text" class="mb-6 text-center">
                <span
                  class="inline-flex w-[85%] items-center justify-center gap-1.5 rounded-full bg-[#fbbc04] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                  <Icon icon="ph:star-fill" class="text-base" />
                  {{ pkg.badge_text }}
                </span>
              </div>

              <!-- TITLE & SUBTITLE -->
              <div class="mb-5">
                <h3 class="text-2xl font-black" :class="pkg.is_popular ? 'text-white' : 'text-[#021136]'">
                  {{ pkg.name }}
                </h3>
                <p class="mt-2 text-[13px] leading-relaxed pr-2"
                  :class="pkg.is_popular ? 'text-slate-300' : 'text-slate-500 min-h-[40px]'">
                  {{ pkg.tagline }}
                </p>
              </div>

              <!-- PRICE -->
              <div class="mb-6">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-4xl font-black tracking-tight leading-none"
                    :class="pkg.is_popular ? 'text-white' : 'text-[#021136]'">
                    {{ formatPrice(pkg.price) }}
                  </span>
                </div>
                <p class="mt-2 text-[13px] font-medium" :class="pkg.is_popular ? 'text-slate-300' : 'text-slate-500'">
                  Sekali Bayar (Tahun Pertama)
                </p>
              </div>

              <!-- FEATURES -->
              <div class="relative mb-8 flex-1">
                <ul class="space-y-3.5 overflow-hidden transition-[max-height] duration-300"
                  :class="isPackageModulesExpanded(pkg) || !hasHiddenPackageModules(pkg) ? 'max-h-[900px]' : 'max-h-[252px]'">
                  <li v-for="mod in standardLmsModules" :key="mod.label"
                    class="flex items-start gap-2.5 text-sm font-bold"
                    :class="pkg.is_popular ? 'text-white' : 'text-slate-700'">
                    <Icon icon="ph:check-bold" class="mt-0.5 shrink-0 text-base"
                      :class="pkg.is_popular ? 'text-blue-500' : 'text-emerald-500'" />
                    <span>{{ mod.label }}</span>
                  </li>
                  <li v-for="(mod, i) in sortedPackageModules(pkg)" :key="`${mod.label}-${i}`"
                    class="flex items-start gap-2.5 text-sm font-medium"
                    :class="mod.included ? (pkg.is_popular ? 'text-white' : 'text-slate-700') : (pkg.is_popular ? 'text-slate-400' : 'text-slate-400')">
                    <Icon :icon="mod.included ? 'ph:check-bold' : 'ph:x-bold'" class="mt-0.5 shrink-0 text-base" :class="mod.included
                      ? (pkg.is_popular ? 'text-blue-500' : 'text-emerald-500')
                      : 'text-rose-500'" />
                    <span :class="{ 'opacity-50 line-through': !mod.included }">{{ mod.label }}</span>
                  </li>
                </ul>

                <div v-if="hasHiddenPackageModules(pkg) && !isPackageModulesExpanded(pkg)"
                  class="pointer-events-none absolute inset-x-0 bottom-12 h-16"
                  :class="pkg.is_popular ? 'bg-gradient-to-b from-[#021136]/0 via-[#021136]/80 to-[#021136]' : 'bg-gradient-to-b from-white/0 via-white/85 to-white'">
                </div>

                <button v-if="hasHiddenPackageModules(pkg)" type="button"
                  class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition"
                  :class="pkg.is_popular ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-[#021136] hover:bg-slate-200'"
                  @click="togglePackageModules(pkg)">
                  {{ isPackageModulesExpanded(pkg) ? "Tutup daftar modul" : "Lihat semua modul" }}
                  <Icon icon="ph:caret-down-bold" class="transition-transform"
                    :class="{ 'rotate-180': isPackageModulesExpanded(pkg) }" />
                </button>
              </div>

              <!-- BUTTON -->
              <button type="button" @click="openCheckout(pkg)"
                class="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all mt-auto shadow-sm"
                :class="pkg.is_popular
                  ? 'bg-white text-[#021136] hover:bg-slate-100'
                  : (idx === 2 ? 'bg-[#5b9dc7] text-white hover:bg-[#4a8eb8]' : 'bg-[#021136] text-white hover:bg-[#010920]')">
                {{ pkg.cta_label || 'Pilih Paket Ini' }}
              </button>
            </article>
          </div>
        </div>
      </section>

      <!-- FAQ SECTION -->
      <section id="faq" class="bg-slate-50 py-16 lg:py-24 border-b border-slate-200">
        <div class="mx-auto max-w-4xl px-5 lg:px-8">
          <div class="text-center mb-10">
            <p class="text-sm font-bold uppercase tracking-widest text-blue-600">{{ faqSection.eyebrow }}</p>
            <h2 class="mt-3 text-3xl font-black text-slate-900 md:text-4xl">{{ faqSection.title }}</h2>
          </div>
          <div class="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <details v-for="faq in faqSection.items" :key="faq.q"
              class="group [&_summary::-webkit-details-marker]:hidden">
              <summary
                class="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-bold text-slate-900 hover:bg-slate-50">
                {{ faq.q }}
                <span
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-open:rotate-45">
                  <Icon icon="ph:plus-bold" />
                </span>
              </summary>
              <div class="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                {{ faq.a }}
              </div>
            </details>
          </div>
        </div>
      </section>

      <!-- CONTACT SECTION -->
      <!-- <section id="kontak" class="bg-white py-16 lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <p class="text-sm font-bold uppercase tracking-widest text-blue-600">Kontak Kami</p>
            <h2 class="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
              Siap melihat sistemnya berjalan?
            </h2>
            <p class="mt-4 text-base leading-relaxed text-slate-600">
              Hubungi Bitwize Digital Platform untuk konsultasi paket, demo aplikasi secara langsung, atau sekadar
              bertanya seputar penyesuaian untuk sekolah Anda.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <a :href="contact.whatsappUrl" target="_blank" rel="noopener"
              class="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:shadow-sm">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl text-emerald-600 mb-3">
                <Icon icon="ph:whatsapp-logo-fill" />
              </div>
              <h3 class="text-base font-bold text-slate-900">WhatsApp</h3>
              <p class="mt-1 text-sm font-medium text-slate-600">{{ contact.phone }}</p>
            </a>

            <a :href="`mailto:${contact.email}`"
              class="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:shadow-sm">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-600 mb-3">
                <Icon icon="ph:envelope-simple-fill" />
              </div>
              <h3 class="text-base font-bold text-slate-900">Email</h3>
              <p class="mt-1 text-sm font-medium text-slate-600 truncate">{{ contact.email }}</p>
            </a>

            <a :href="contact.mapUrl" target="_blank" rel="noopener"
              class="sm:col-span-2 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-amber-300 hover:shadow-sm">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-2xl text-amber-600">
                <Icon icon="ph:map-pin-fill" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Lokasi Kantor</h3>
                <p class="mt-1 text-sm font-medium text-slate-600">{{ contact.address }}</p>
              </div>
            </a>
          </div>
        </div>
      </section> -->

      <!-- CTA BANNER -->
      <section class="bg-blue-900">
        <div
          class="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 text-white md:flex-row md:items-center md:justify-between lg:px-8">
          <div class="max-w-2xl">
            <p class="text-sm font-bold uppercase tracking-widest text-amber-400">Siap dipakai sekolah Anda</p>
            <h2 class="mt-3 text-3xl font-black md:text-4xl">
              Mulai dari modul mendesak. Kembangkan saat sekolah siap.
            </h2>
            <p class="mt-3 text-base leading-relaxed text-blue-100">
              Kami bantu sekolah masuk ke ekosistem digital secara bertahap, tanpa mengganggu operasional harian.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href="#harga"
              class="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-amber-500">
              Pilih Paket
            </a>
            <router-link to="/auth/login"
              class="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              Login Sistem
            </router-link>
          </div>
        </div>
      </section>
    </main>

    <!-- CHECKOUT MODAL -->
    <Teleport to="body">
      <div v-if="selectedPackage"
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm transition-opacity"
        role="dialog" aria-modal="true" aria-labelledby="checkout-title">

        <div class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div class="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-5 py-4">
            <div class="flex min-w-0 items-center gap-3">
              <div v-if="selectedPackage.logo_url"
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 p-2">
                <img :src="packageLogoUrl(selectedPackage.logo_url)" :alt="`Logo ${selectedPackage.name}`"
                  class="h-full w-full object-contain" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-bold uppercase tracking-widest text-blue-600">Checkout Paket</p>
                <h2 id="checkout-title" class="text-lg font-black text-slate-900">
                  {{ selectedPackage.name }}
                </h2>
                <p class="text-sm font-semibold text-slate-500">
                  {{ formatPrice(selectedPackage.price) }} / {{ selectedPackage.billing_period }}
                </p>
              </div>
            </div>
            <button type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              @click="closeCheckout">
              <Icon icon="ph:x-bold" />
            </button>
          </div>

          <form class="p-5" @submit.prevent="submitCheckout">
            <div class="space-y-4">
              <label class="block">
                <span class="mb-1.5 block text-sm font-bold text-slate-700">Nama Sekolah</span>
                <input v-model.trim="checkoutForm.school_name" type="text" required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Contoh: SMA Nusantara" />
              </label>

              <label class="block">
                <span class="mb-1.5 block text-sm font-bold text-slate-700">Email Aktif</span>
                <input v-model.trim="checkoutForm.email" type="email" required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  placeholder="name@gmail.com" />
              </label>

              <div class="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-sm font-bold text-slate-700">Total Pembayaran</span>
                  <span class="text-lg font-black text-blue-700">{{ formatPrice(selectedPackage.price) }}</span>
                </div>
                <p class="mt-2 text-xs font-medium text-slate-500">
                  Invoice dan detail akses admin akan dikirim secara otomatis ke email Anda.
                </p>
              </div>

              <p v-if="checkoutError"
                class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                {{ checkoutError }}
              </p>

              <div v-if="isSubmittingCheckout"
                class="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
                <Icon icon="ph:spinner-gap-bold" class="text-lg animate-spin" />
                <span>Menyiapkan gateway iPaymu...</span>
              </div>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-[1fr_1.5fr]">
              <button type="button"
                class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                :disabled="isSubmittingCheckout" @click="closeCheckout">
                Batal
              </button>
              <button type="submit"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-70"
                :disabled="isSubmittingCheckout">
                <Icon :icon="isSubmittingCheckout ? 'ph:spinner-gap-bold' : 'ph:credit-card-fill'"
                  :class="{ 'animate-spin': isSubmittingCheckout }" />
                {{ isSubmittingCheckout ? "Memproses..." : "Lanjut Pembayaran" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- FOOTER -->
    <footer id="footer-kontak" class="border-t border-white/10 bg-[#0f2438] text-slate-300">
      <div
        class="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr] lg:px-8">
        <div>
          <a href="#beranda" class="inline-flex items-center gap-3">
            <img class="h-16 w-16 rounded-2xl object-contain md:h-20 md:w-20" src="/logob.png"
              alt="Bitwize Digital Platform" />
            <span>
              <span class="block text-xl font-black text-white">Bitwize</span>
              <span class="block text-xs font-semibold tracking-wider uppercase text-slate-400">Digital Platform</span>
            </span>
          </a>
          <p class="mt-5 text-sm font-medium leading-relaxed">
            {{ footerSection.description }}
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <span v-for="badge in footerSection.badges" :key="badge"
              class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
              {{ badge }}
            </span>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-white mb-5">Produk</h3>
          <ul class="space-y-3">
            <li v-for="item in footerProductLinks" :key="item.href">
              <a :href="item.href" class="text-sm font-medium transition hover:text-amber-300">
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-white mb-5">Perusahaan</h3>
          <ul class="space-y-3">
            <li v-for="item in footerCompanyLinks" :key="item.href">
              <a :href="item.href" class="text-sm font-medium transition hover:text-amber-300">
                {{ item.label }}
              </a>
            </li>
            <li>
              <router-link to="/auth/login" class="text-sm font-medium transition hover:text-amber-300">
                Login
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-white mb-5">Hubungi Kami</h3>
          <div class="space-y-3">
            <a :href="contact.whatsappUrl" target="_blank" rel="noopener"
              class="flex items-start gap-3 text-sm font-medium transition hover:text-amber-300">
              <Icon icon="ph:whatsapp-logo-fill" class="mt-0.5 text-lg text-emerald-400" />
              <span>{{ contact.phone }}</span>
            </a>
            <a :href="`mailto:${contact.email}`"
              class="flex items-start gap-3 text-sm font-medium transition hover:text-amber-300">
              <Icon icon="ph:envelope-simple-fill" class="mt-0.5 text-lg text-blue-400" />
              <span class="break-all">{{ contact.email }}</span>
            </a>
            <a :href="contact.mapUrl" target="_blank" rel="noopener"
              class="flex items-start gap-3 text-sm font-medium leading-relaxed transition hover:text-amber-300">
              <Icon icon="ph:map-pin-fill" class="mt-0.5 shrink-0 text-lg text-amber-400" />
              <span>{{ contact.address }}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-white/10 bg-[#0b1b2b] px-5 py-5 lg:px-8">
        <div
          class="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs font-medium md:flex-row md:items-center">
          <p>© {{ currentYear }} <span class="font-bold text-white">{{ brandName }}</span>. Seluruh hak cipta
            dilindungi.</p>
          <div class="flex flex-wrap gap-4">
            <a href="/refund-policy" class="transition hover:text-amber-300">Refund Policy</a>
            <a href="/terms-and-conditions" class="transition hover:text-amber-300">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { normalizePublicUrl } from "@/utils/url";

const brandName = ref("Bitwize Digital Platform");
const currentYear = new Date().getFullYear();
const standardLmsModules = [
  { label: "Manajemen Jurusan" },
  { label: "Manajemen Siswa" },
  { label: "Manajemen Kelas" },
  { label: "Manajemen Mapel" },
];
const isMobileMenuOpen = ref(false);
const selectedPackage = ref(null);
const isSubmittingCheckout = ref(false);
const checkoutError = ref("");
const expandedPackageModules = ref(new Set());
const checkoutForm = reactive({
  school_name: "",
  email: "",
});

const hero = reactive({
  eyebrow: "Sistem Terintegrasi",
  title: "Rapikan operasional sekolah dalam satu platform pintar.",
  subtitle: "Bitwize membantu sekolah mengelola pembelajaran, absensi, ujian, tagihan, SPMB, koperasi, payroll, dan komunikasi tanpa rekap manual yang berulang.",
  primaryLabel: "Mulai Berlangganan",
  primaryHref: "#harga",
  secondaryLabel: "Jelajahi Fitur",
  secondaryHref: "#fitur",
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const openCheckout = (pkg) => {
  selectedPackage.value = pkg;
  checkoutError.value = "";
  checkoutForm.school_name = "";
  checkoutForm.email = "";
  closeMobileMenu();
};

const closeCheckout = () => {
  if (isSubmittingCheckout.value) return;
  selectedPackage.value = null;
  checkoutError.value = "";
};

const navItems = [
  { label: "Masalah", href: "#masalah" },
  { label: "Fitur", href: "#fitur" },
  { label: "Alur", href: "#alur" },
  { label: "Harga", href: "#harga" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#footer-kontak" },
];

const contact = reactive({
  phone: "085719578195",
  email: "bitwizedigitalplatform@gmail.com",
  address: "Gang Harun 2 Kota Jakrta Barat Privinsi DKI Jakarta Kode Pos 11480",
  whatsappUrl: "https://wa.me/6285719578195",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Jalan%20Harun%20II%20No.126%20A%2C%20Palmerah%2C%20Jakarta%20Barat",
});

const footerSection = reactive({
  description: "Platform LMS dan administrasi untuk membantu sekolah mengelola pembelajaran, absensi, tagihan, SPMB, payroll, dan komunikasi dalam satu sistem.",
  badges: ["LMS", "Absensi", "SPMB", "Billing", "Payroll"],
});

const footerProductLinks = [
  { label: "Modul LMS", href: "#fitur" },
  { label: "Alur Sekolah", href: "#alur" },
  { label: "Paket Harga", href: "#harga" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "#faq" },
];

const footerCompanyLinks = [
  { label: "Masalah Sekolah", href: "#masalah" },
  { label: "Untuk Semua Peran", href: "#peran" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Kontak", href: "#footer-kontak" },
];

const heroMetrics = ref([
  { value: "10+", label: "Modul operasional" },
  { value: "4", label: "Role pengguna utama" },
  { value: "1", label: "Pusat data sekolah" },
  { value: "24/7", label: "Akses online" },
]);

const dashboardPreview = reactive({
  schoolName: "SMA Nusantara",
  summaryCards: [
    { icon: "ph:buildings-fill", label: "Total Kelas", value: "36", caption: "Rombel aktif", cardClass: "bg-blue-600" },
    { icon: "ph:student-fill", label: "Total Siswa", value: "1.248", caption: "Siswa terdaftar", cardClass: "bg-amber-500" },
    { icon: "ph:chalkboard-teacher-fill", label: "Total Guru", value: "84", caption: "Pengajar aktif", cardClass: "bg-emerald-500" },
    { icon: "ph:clipboard-text-fill", label: "Tugas Aktif", value: "36", caption: "Berjalan minggu ini", cardClass: "bg-indigo-600" },
  ],
});

const lineChartGridY = [28, 76, 124, 172, 220];
const lineChartYAxis = [
  { value: "100", y: 28 },
  { value: "75", y: 76 },
  { value: "50", y: 124 },
  { value: "25", y: 172 },
  { value: "0", y: 220 },
];

const lineChartMonths = [
  { label: "Jan", x: 52 },
  { label: "Feb", x: 160 },
  { label: "Mar", x: 268 },
  { label: "Apr", x: 376 },
  { label: "Mei", x: 484 },
  { label: "Jun", x: 592 },
];

const createLineSeries = (label, color, values) => {
  const maxValue = 100;
  const chartTop = 28;
  const chartHeight = 192;
  const dots = values.map((value, index) => ({
    x: lineChartMonths[index].x,
    y: chartTop + chartHeight - (Number(value) / maxValue) * chartHeight,
  }));

  return {
    label,
    color,
    dots,
    points: dots.map((point) => `${point.x},${point.y}`).join(" "),
    latest: `${values[values.length - 1]}%`,
  };
};

const lineChartSeries = [
  createLineSeries("Absensi", "#3b82f6", [72, 76, 81, 79, 86, 92]),
  createLineSeries("Tugas", "#10b981", [48, 55, 61, 68, 74, 82]),
  createLineSeries("Pembayaran", "#f59e0b", [40, 52, 58, 63, 71, 84]),
];

const recentAttendance = [
  {
    name: "Alya Prameswari",
    note: "XII IPA 1 · 07:03",
    status: "Hadir",
    dotClass: "bg-emerald-400",
    badgeClass: "bg-emerald-500/20 text-emerald-300",
  },
  {
    name: "Raka Mahendra",
    note: "XI IPS 2 · 07:18",
    status: "Terlambat",
    dotClass: "bg-amber-400",
    badgeClass: "bg-amber-500/20 text-amber-300",
  },
  {
    name: "Nabila Putri",
    note: "X IPA 3 · Izin sakit",
    status: "Izin",
    dotClass: "bg-blue-400",
    badgeClass: "bg-blue-500/20 text-blue-300",
  },
];

const painSection = reactive({
  eyebrow: "Masalah yang diselesaikan",
  title: "Tinggalkan rekap manual yang menyita waktu",
  items: [
    { icon: "ph:files-fill", title: "Rekap manual menghabiskan jam kerja", desc: "Absensi, nilai, tagihan, dan laporan tidak perlu dipindahkan berkali-kali ke file berbeda." },
    { icon: "ph:chat-circle-dots-fill", title: "Informasi sekolah harus mudah dicari", desc: "Pengumuman, tugas, dan status pembayaran punya tempat yang jelas, bukan tercecer di chat." },
    { icon: "ph:chart-line-down-fill", title: "Manajemen butuh data hari ini", desc: "Pimpinan bisa membaca kondisi sekolah tanpa menunggu laporan manual selesai dibuat." },
  ],
});

const featuresSection = reactive({
  eyebrow: "Modul Ekosistem",
  title: "Satu aplikasi untuk seluruh kebutuhan esensial sekolah",
  ctaLabel: "Lihat Detail Paket",
  ctaHref: "#harga",
  items: [
    { icon: "ph:warehouse-fill", title: "Sarana & Prasarana", desc: "Catat aset sekolah, kondisi barang, dan kebutuhan fasilitas tanpa spreadsheet terpisah." },
    { icon: "ph:calendar-check-fill", title: "Absensi Presisi", desc: "Kehadiran harian, keterlambatan, dan rekap kelas otomatis masuk ke dalam sistem laporan." },
    { icon: "ph:exam-fill", title: "CBT Ujian Resmi", desc: "Bank soal, jadwal ujian, pengerjaan online, dan hasil evaluasi dalam satu alur terpadu." },
    { icon: "ph:magic-wand-fill", title: "Modul Ajar AI", desc: "Bantu guru menyiapkan rancangan modul ajar lebih cepat dengan kecerdasan buatan." },
    { icon: "ph:storefront-fill", title: "Manajemen Koperasi", desc: "Transaksi koperasi sekolah tercatat rapi untuk dipantau admin secara transparan." },
    { icon: "ph:wallet-fill", title: "Payroll Cerdas", desc: "Komponen gaji, slip payroll, dan pembayaran pegawai dikelola lebih tertib dan efisien." },
    { icon: "ph:user-plus-fill", title: "SPMB Terintegrasi", desc: "Pendaftaran siswa baru, seleksi, dan status calon siswa dikelola dalam satu pipeline." },
    { icon: "ph:chat-teardrop-text-fill", title: "Chat Internal", desc: "Komunikasi internal sekolah tetap berada dalam aplikasi, menjaga privasi civitas." },
    { icon: "ph:receipt-fill", title: "Billing & Pembayaran", desc: "Tagihan, kuitansi otomatis, dan riwayat pembayaran bisa dilacak oleh orang tua kapan saja." },
  ],
});

const workflowSection = reactive({
  eyebrow: "Alur Sistem Digital",
  title: "Input satu kali, terhubung ke seluruh bagian.",
  description: "Setiap data yang dimasukkan akan langsung diolah dan didistribusikan ke dasbor manajemen secara real-time.",
  items: [
    { title: "Admin menyiapkan data master", desc: "Kelas, siswa, guru, jurusan, tahun ajaran, dan modul aktif dikonfigurasi sebagai fondasi." },
    { title: "Guru menjalankan kelas", desc: "Materi, tugas, ujian, penilaian, dan absensi dikelola dari panel khusus guru dengan mudah." },
    { title: "Siswa & Orang Tua berinteraksi", desc: "Menerima notifikasi tugas, melihat hasil belajar, dan membayar tagihan langsung di aplikasi." },
    { title: "Pimpinan memantau analitik", desc: "Seluruh metrik operasional terkumpul untuk evaluasi kinerja harian hingga laporan tahunan." },
  ],
});

const rolesSection = reactive({
  eyebrow: "Akses Sesuai Peran",
  title: "Tampilan yang dirancang khusus untuk masing-masing peran.",
  items: [
    { icon: "ph:briefcase-fill", title: "Admin / Tata Usaha", desc: "Mengendalikan data akademik, tagihan pembayaran, sarpras, dan laporan operasional menyeluruh." },
    { icon: "ph:chalkboard-teacher-fill", title: "Tenaga Pendidik", desc: "Fokus pada mengajar, memberi tugas, menyusun ujian, input nilai, dan memantau progres kelas." },
    { icon: "ph:student-fill", title: "Siswa & Orang Tua", desc: "Portal mandiri untuk melihat materi, riwayat nilai, presensi, serta notifikasi tagihan aktif." },
  ],
});

const pricingSection = reactive({
  eyebrow: "Investasi Terjangkau",
  title: "Pilih paket langganan yang sesuai skala sekolah Anda.",
  description: "Aktifkan modul yang paling Anda butuhkan hari ini. Upgrade kapan saja saat sekolah Anda siap untuk berekspansi.",
});

const faqSection = reactive({
  eyebrow: "FAQ",
  title: "Pertanyaan yang Sering Diajukan",
  items: [
    { q: "Apakah modul bisa dipilih sesuai kebutuhan sekolah?", a: "Tentu. Sekolah dapat memulai dari modul utama (seperti absen dan akademik) lalu menambah fitur eksklusif saat operasional berkembang." },
    { q: "Apakah sistem ini hanya untuk pembelajaran online?", a: "Tidak. Bitwize adalah sistem ERP sekolah lengkap yang mencakup LMS, absensi, CBT, rekrutmen SPMB, koperasi, payroll, dan komunikasi." },
    { q: "Apakah tersedia panduan dan demo sebelum berlangganan?", a: "Ya. Sekolah dapat menghubungi tim representatif kami melalui WhatsApp untuk menjadwalkan sesi live demo dan presentasi." },
    { q: "Bagaimana sistem keamanan data sekolah?", a: "Data sekolah Anda tersimpan di server cloud terenkripsi. Bitwize hanya bertindak sebagai penyedia infrastruktur, data sepenuhnya tetap menjadi milik instansi Anda." },
    { q: "Bagaimana kebijakan refund berlangganan?", a: "Refund dapat diajukan dalam waktu 7 hari kerja paska pembayaran, selama sistem belum di-setup dengan data asli (production) atau integrasi khusus." },
  ],
});

const FALLBACK_PACKAGES = [
  {
    id: "f1", name: "Basic Landing Page", tagline: "Untuk perkenalan brand, produk tunggal, atau kampanye.",
    price: 750000, original_price: 0, billing_period: "Tahun Pertama", badge_text: "", is_popular: false,
    cta_label: "Pilih Paket Ini", cta_url: "/auth/login",
    modules: [
      { label: "1 Halaman Utama (Desain Modern)", included: true },
      { label: "Desain Responsive (Mobile-Friendly)", included: true },
      { label: "Gratis Domain & Hosting (1 Tahun)", included: true },
      { label: "Gratis SSL/HTTPS (Keamanan)", included: true },
      { label: "Form Kontak & Integrasi WhatsApp", included: true },
      { label: "Optimasi SEO Dasar", included: true },
      { label: "Admin Area (CMS)", included: false },
      { label: "Email Bisnis Profesional", included: false },
    ],
  },
  {
    id: "f2", name: "Company Profile Pro", tagline: "Solusi lengkap untuk perusahaan, UMKM, atau instansi.",
    price: 1500000, original_price: 0, billing_period: "Tahun Pertama", badge_text: "Populer", is_popular: true,
    cta_label: "Pilih Paket Ini", cta_url: "/auth/login",
    modules: [
      { label: "3-7 Halaman Custom Design", included: true },
      { label: "Galeri Foto & Video Premium", included: true },
      { label: "Gratis Domain & Hosting (1 Tahun)", included: true },
      { label: "Gratis SSL/HTTPS", included: true },
      { label: "Admin Area (CMS) User-Friendly", included: true },
      { label: "Integrasi Google Maps & Analytics", included: true },
      { label: "Support & Maintenance Prioritas", included: true },
    ],
  },
  {
    id: "f3", name: "E-Commerce / Custom", tagline: "Untuk toko online berskala besar atau kebutuhan fitur khusus.",
    price: 3500000, original_price: 0, billing_period: "Penawaran Spesial", badge_text: "", is_popular: false,
    cta_label: "Konsultasi Harga Custom", cta_url: "/auth/login",
    modules: [
      { label: "Jumlah Halaman Tidak Terbatas", included: true },
      { label: "Sistem Manajemen Produk & Stok Lengkap", included: true },
      { label: "Integrasi API Kurir Otomatis (JNE, SiCepat, dll.)", included: true },
      { label: "Dashboard Admin untuk Laporan Penjualan", included: true },
      { label: "Fitur Diskon, Kupon, Rating & Review", included: true },
      { label: "Support & Maintenance Premium 24/7", included: true },
      { label: "Konsultasi & Brainstorming Fitur", included: true },
    ],
  },
];

const packages = ref([]);
const isLoading = ref(true);

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const formatPrice = (value) => {
  if (value === 750000) return "Rp 750K";
  if (value === 1500000) return "Rp 1.5 - 2.5M";
  if (value === 3500000) return "Rp 3.5M+";

  return currencyFormatter.format(Number(value) || 0);
};

const packageLogoUrl = (value) => normalizePublicUrl(value) || value || "";
const packageKey = (pkg) => String(pkg?.id || pkg?.name || "");
const packageModuleCount = (pkg) => standardLmsModules.length + (Array.isArray(pkg?.modules) ? pkg.modules.length : 0);
const sortedPackageModules = (pkg) => {
  const modules = Array.isArray(pkg?.modules) ? pkg.modules : [];
  return [
    ...modules.filter((mod) => mod?.included),
    ...modules.filter((mod) => !mod?.included),
  ];
};
const hasHiddenPackageModules = (pkg) => packageModuleCount(pkg) > 5;
const isPackageModulesExpanded = (pkg) => expandedPackageModules.value.has(packageKey(pkg));
const togglePackageModules = (pkg) => {
  const key = packageKey(pkg);
  const next = new Set(expandedPackageModules.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  expandedPackageModules.value = next;
};
const hasDiscount = (pkg) =>
  Number(pkg.original_price) > 0 && Number(pkg.original_price) > Number(pkg.price);

const discountPercent = (pkg) => {
  const original = Number(pkg.original_price);
  const price = Number(pkg.price);
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
};

const loadPackages = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/packages/public", { silentLoading: true, suppressAuthRedirect: true });
    const list = response?.data?.packages;
    packages.value = Array.isArray(list) && list.length ? list : FALLBACK_PACKAGES;
  } catch (error) {
    packages.value = FALLBACK_PACKAGES;
  } finally {
    isLoading.value = false;
  }
};

const applySection = (target, value, arrayKeys = ["items"]) => {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, next]) => {
    if (arrayKeys.includes(key) && Array.isArray(next)) {
      target[key] = next;
      return;
    }
    if (!arrayKeys.includes(key) && next !== undefined && next !== null) {
      target[key] = next;
    }
  });
};

const loadLandingContent = async () => {
  try {
    const response = await api.get("/landing/public", { silentLoading: true, suppressAuthRedirect: true });
    const sections = response?.data?.sections || {};
    if (sections.brand?.name) brandName.value = sections.brand.name;
    applySection(hero, sections.hero);
    if (Array.isArray(sections.metrics?.items)) heroMetrics.value = sections.metrics.items;
    applySection(dashboardPreview, sections.dashboard, ["summaryCards"]);
    applySection(painSection, sections.pain);
    applySection(featuresSection, sections.features);
    applySection(workflowSection, sections.workflow);
    applySection(rolesSection, sections.roles);
    applySection(pricingSection, sections.pricing, []);
    applySection(faqSection, sections.faq);
    applySection(contact, sections.contact, []);
    applySection(footerSection, sections.footer, ["badges"]);
  } catch (error) { }
};

const submitCheckout = async () => {
  if (!selectedPackage.value || isSubmittingCheckout.value) return;
  checkoutError.value = "";
  isSubmittingCheckout.value = true;
  try {
    const response = await api.post("/packages/checkout", {
      package_id: selectedPackage.value.id,
      school_name: checkoutForm.school_name,
      email: checkoutForm.email,
    }, { suppressAuthRedirect: true, silentLoading: true });
    const redirectURL = response?.data?.redirect_url || response?.redirect_url;
    if (!redirectURL) {
      throw new Error("Link pembayaran tidak tersedia.");
    }
    window.location.assign(redirectURL);
  } catch (error) {
    checkoutError.value = error?.message || "Checkout tidak berhasil dibuat.";
  } finally {
    isSubmittingCheckout.value = false;
  }
};

onMounted(() => {
  loadLandingContent();
  loadPackages();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap");

.landing-page {
  font-family: "Nunito Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  scroll-behavior: smooth;
}
</style>
