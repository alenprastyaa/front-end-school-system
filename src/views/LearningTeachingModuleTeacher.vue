<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <main class="min-h-screen">
      <section class="border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900 md:px-7">
        <div class="flex flex-col gap-1">
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Modul Ajar AI</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Draft modul ajar guru berbasis Kurikulum Merdeka dengan struktur yang konsisten.
          </p>
        </div>

        <div
          v-if="subjectError"
          class="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20"
        >
          {{ subjectError }}
        </div>

        <nav
          class="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            v-for="item in subjects"
            :key="item.id"
            type="button"
            class="group relative flex min-w-[240px] flex-none flex-col items-start overflow-hidden rounded-2xl p-4 text-left transition-all"
            :class="selectedSubject?.id === item.id ? subjectCardClass(true) : subjectCardClass(false)"
            @click="selectSubject(item)"
          >
            <span :class="selectedSubject?.id === item.id ? 'text-white' : 'text-slate-900 dark:text-white'" class="font-bold tracking-tight">
              {{ item.name }}
            </span>
            <span :class="selectedSubject?.id === item.id ? 'text-sky-200' : 'text-slate-500 dark:text-slate-400'" class="mt-1 text-xs font-medium">
              {{ item.class_name }}
            </span>
            <div
              v-if="selectedSubject?.id === item.id"
              class="absolute right-4 top-4 h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            ></div>
          </button>
        </nav>
      </section>

      <div v-if="selectedSubject" class="grid gap-6 p-5 md:p-7 xl:grid-cols-[420px,minmax(0,1fr)]">
        <section class="space-y-4">
          <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Mapel Aktif</p>
                <h2 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white">{{ selectedSubject.name }}</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {{ selectedSubject.class_name }} · {{ selectedSubject.description || "Draft disusun berdasarkan konteks mata pelajaran aktif." }}
                </p>
              </div>
              <div class="rounded-xl bg-sky-50 px-3 py-2 text-right dark:bg-sky-500/10">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Kurikulum</p>
                <p class="mt-1 text-xs font-bold leading-5 text-sky-800 dark:text-sky-200">{{ autoCurriculumName }}</p>
              </div>
            </div>

            <div class="mt-3 grid gap-2 sm:grid-cols-3">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                <p class="text-[11px] font-semibold text-slate-500">Jenjang / Kelas</p>
                <p class="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">{{ autoGradeLabel }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                <p class="text-[11px] font-semibold text-slate-500">Fase</p>
                <p class="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">{{ autoPhaseName }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                <p class="text-[11px] font-semibold text-slate-500">Jenis Mapel</p>
                <p class="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">{{ subjectCategoryLabel }}</p>
              </div>
            </div>
          </div>

          <form class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" @submit.prevent="generateTeachingModule">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Generator</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">Isi Konteks Modul Ajar</h3>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                :disabled="isLoadingSuggestionCatalog"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="loadSuggestionCatalog"
              >
                {{ isLoadingSuggestionCatalog ? "Memuat katalog..." : "Muat Katalog Dropdown" }}
              </button>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Isi dropdown disesuaikan dengan mapel aktif{{ resolvedTopic ? ` dan topik ${resolvedTopic}` : "" }}.
              </p>
            </div>
            <p v-if="suggestionCatalogError" class="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">{{ suggestionCatalogError }}</p>

            <div class="mt-5 space-y-4">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-3">
                  <label class="text-xs font-semibold text-slate-500">Judul Modul</label>
                  <span class="text-[11px] text-slate-400">Cari dari katalog mapel</span>
                </div>
                <select v-model="form.title" class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="" disabled>Pilih judul modul...</option>
                  <option v-for="item in suggestionItems('titles')" :key="`title-${item}`" :value="item">{{ item }}</option>
                  <option value="__custom__">Tulis manual...</option>
                </select>
                <input
                  v-if="form.title === '__custom__'"
                  v-model.trim="customForm.title"
                  type="text"
                  placeholder="Tulis judul modul"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-3">
                  <label class="text-xs font-semibold text-slate-500">Topik / Materi</label>
                  <button
                    type="button"
                    :disabled="isLoadingTopicSuggestions"
                    class="text-xs font-semibold text-sky-700 transition hover:text-sky-800 disabled:opacity-50 dark:text-sky-300"
                    @click="loadTopicSuggestions"
                  >
                    {{ isLoadingTopicSuggestions ? "Memuat..." : "Muat Saran" }}
                  </button>
                </div>
                <select v-model="form.topic" class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="" disabled>Pilih topik mapel...</option>
                  <option v-for="topic in topicSuggestions" :key="topic" :value="topic">{{ topic }}</option>
                  <option value="__custom__">Tulis manual...</option>
                </select>
                <input
                  v-if="form.topic === '__custom__'"
                  v-model.trim="customTopic"
                  type="text"
                  placeholder="Tulis materi sendiri"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
                <p v-if="topicSuggestionError" class="text-xs font-medium text-amber-700 dark:text-amber-300">{{ topicSuggestionError }}</p>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-slate-500">Alokasi Waktu</label>
                  <input
                    v-model.trim="form.time_allocation"
                    type="text"
                    placeholder="Contoh: 2 x 45 menit"
                    class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-slate-500">Jumlah Pertemuan</label>
                  <input
                    v-model.number="form.meetings"
                    type="number"
                    min="1"
                    max="12"
                    class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-3">
                  <label class="text-xs font-semibold text-slate-500">Capaian Pembelajaran / Acuan ATP</label>
                  <span class="text-[11px] text-slate-400">Cari dari katalog mapel</span>
                </div>
                <select v-model="form.cp_reference" class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="" disabled>Pilih acuan CP / ATP...</option>
                  <option v-for="item in suggestionItems('cp_references')" :key="`cp-${item}`" :value="item">{{ item }}</option>
                  <option value="__custom__">Tulis manual...</option>
                </select>
                <textarea
                  v-if="form.cp_reference === '__custom__'"
                  v-model.trim="customForm.cp_reference"
                  rows="3"
                  placeholder="Tulis CP / ATP manual"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-3">
                  <label class="text-xs font-semibold text-slate-500">Tujuan Pembelajaran</label>
                  <span class="text-[11px] text-slate-400">Cari dari katalog mapel</span>
                </div>
                <select v-model="form.learning_objectives" class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="" disabled>Pilih tujuan pembelajaran...</option>
                  <option v-for="item in suggestionItems('learning_objectives')" :key="`objective-${item}`" :value="item">{{ item }}</option>
                  <option value="__custom__">Tulis manual...</option>
                </select>
                <textarea
                  v-if="form.learning_objectives === '__custom__'"
                  v-model.trim="customForm.learning_objectives"
                  rows="3"
                  placeholder="Tulis tujuan pembelajaran manual"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-3">
                  <label class="text-xs font-semibold text-slate-500">Cakupan Materi</label>
                  <span class="text-[11px] text-slate-400">Cari dari katalog mapel</span>
                </div>
                <select v-model="form.material_scope" class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="" disabled>Pilih cakupan materi...</option>
                  <option v-for="item in suggestionItems('material_scopes')" :key="`scope-${item}`" :value="item">{{ item }}</option>
                  <option value="__custom__">Tulis manual...</option>
                </select>
                <textarea
                  v-if="form.material_scope === '__custom__'"
                  v-model.trim="customForm.material_scope"
                  rows="3"
                  placeholder="Tulis cakupan materi manual"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-500">Model Pembelajaran</label>
                <select
                  v-model="form.learning_model"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
                  <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
                  <option value="Discovery Learning">Discovery Learning</option>
                  <option value="Inquiry Learning">Inquiry Learning</option>
                  <option value="Cooperative Learning">Cooperative Learning</option>
                  <option value="Direct Instruction">Direct Instruction</option>
                  <option value="Blended Learning">Blended Learning</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-500">Profil Pelajar Pancasila</label>
                <select
                  v-model="form.pancasila_profile"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Bernalar kritis">Bernalar kritis</option>
                  <option value="Mandiri">Mandiri</option>
                  <option value="Gotong royong">Gotong royong</option>
                  <option value="Kreatif">Kreatif</option>
                  <option value="Beriman, bertakwa kepada Tuhan YME, dan berakhlak mulia">Beriman dan berakhlak mulia</option>
                  <option value="Berkebinekaan global">Berkebinekaan global</option>
                  <option value="Bernalar kritis, Mandiri">Bernalar kritis + Mandiri</option>
                  <option value="Gotong royong, Kreatif">Gotong royong + Kreatif</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-3">
                  <label class="text-xs font-semibold text-slate-500">Karakteristik Peserta Didik</label>
                  <span class="text-[11px] text-slate-400">Cari dari katalog mapel</span>
                </div>
                <select v-model="form.student_characteristics" class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="" disabled>Pilih karakteristik kelas...</option>
                  <option v-for="item in suggestionItems('student_characteristics')" :key="`student-${item}`" :value="item">{{ item }}</option>
                  <option value="__custom__">Tulis manual...</option>
                </select>
                <textarea
                  v-if="form.student_characteristics === '__custom__'"
                  v-model.trim="customForm.student_characteristics"
                  rows="3"
                  placeholder="Tulis karakteristik kelas manual"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-3">
                  <label class="text-xs font-semibold text-slate-500">Sarana dan Prasarana</label>
                  <span class="text-[11px] text-slate-400">Cari dari katalog mapel</span>
                </div>
                <select v-model="form.facilities" class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="" disabled>Pilih sarana dan prasarana...</option>
                  <option v-for="item in suggestionItems('facilities')" :key="`facility-${item}`" :value="item">{{ item }}</option>
                  <option value="__custom__">Tulis manual...</option>
                </select>
                <textarea
                  v-if="form.facilities === '__custom__'"
                  v-model.trim="customForm.facilities"
                  rows="3"
                  placeholder="Tulis sarana dan prasarana manual"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center justify-between gap-3">
                  <label class="text-xs font-semibold text-slate-500">Instruksi Tambahan</label>
                  <span class="text-[11px] text-slate-400">Cari dari katalog mapel</span>
                </div>
                <select v-model="form.additional_instructions" class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                  <option value="">Tanpa instruksi tambahan</option>
                  <option v-for="item in suggestionItems('additional_instruction_tips')" :key="`instruction-${item}`" :value="item">{{ item }}</option>
                  <option value="__custom__">Tulis manual...</option>
                </select>
                <textarea
                  v-if="form.additional_instructions === '__custom__'"
                  v-model.trim="customForm.additional_instructions"
                  rows="3"
                  placeholder="Tulis instruksi tambahan manual"
                  class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                ></textarea>
              </div>
            </div>

            <div class="mt-5 flex justify-end">
              <button
                type="submit"
                :disabled="isGenerating"
                class="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ isGenerating ? "Membuat..." : draft ? "Buat Ulang" : "Generate" }}
              </button>
            </div>
          </form>
        </section>

        <section class="space-y-4">
          <div v-if="draft" class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Draft Hasil AI</p>
                <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{{ draft.title }}</h2>
                <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  {{ draft.identity.subject_name }} · {{ draft.identity.class_name }} · {{ draft.identity.phase_name }}
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  :disabled="isSavingDraft"
                  class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                  @click="saveTeachingModule"
                >
                  {{ isSavingDraft ? "Menyimpan..." : editingModuleId ? "Update Modul" : "Simpan Modul" }}
                </button>
                <button
                  type="button"
                  class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="copyDraftToClipboard"
                >
                  Salin Draft
                </button>
                <button
                  type="button"
                  class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="downloadDraftAsWord"
                >
                  Download Word
                </button>
                <button
                  type="button"
                  class="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                  @click="generateTeachingModule"
                >
                  Regenerate
                </button>
              </div>
            </div>

            <div class="mt-5 grid gap-4 lg:grid-cols-2">
              <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Identitas Modul</h3>
                <dl class="mt-3 grid gap-3 text-sm">
                  <div class="grid gap-1">
                    <dt class="text-slate-500 dark:text-slate-400">Topik</dt>
                    <dd class="font-semibold text-slate-800 dark:text-slate-100">{{ draft.identity.topic }}</dd>
                  </div>
                  <div class="grid gap-1">
                    <dt class="text-slate-500 dark:text-slate-400">Kurikulum</dt>
                    <dd class="font-semibold text-slate-800 dark:text-slate-100">{{ draft.identity.curriculum_name }}</dd>
                  </div>
                  <div class="grid gap-1 sm:grid-cols-2 sm:items-start sm:gap-4">
                    <div>
                      <dt class="text-slate-500 dark:text-slate-400">Alokasi Waktu</dt>
                      <dd class="mt-1 font-semibold text-slate-800 dark:text-slate-100">{{ draft.identity.time_allocation }}</dd>
                    </div>
                    <div>
                      <dt class="text-slate-500 dark:text-slate-400">Pertemuan</dt>
                      <dd class="mt-1 font-semibold text-slate-800 dark:text-slate-100">{{ draft.identity.meetings }}</dd>
                    </div>
                  </div>
                </dl>
              </article>

              <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Informasi Umum</h3>
                <div class="mt-3 space-y-4 text-sm">
                  <div>
                    <p class="text-slate-500 dark:text-slate-400">Target Peserta Didik</p>
                    <p class="mt-1 font-semibold text-slate-800 dark:text-slate-100">{{ draft.general_information.target_learners }}</p>
                  </div>
                  <div>
                    <p class="text-slate-500 dark:text-slate-400">Model dan Pendekatan</p>
                    <p class="mt-1 font-semibold text-slate-800 dark:text-slate-100">{{ draft.general_information.learning_model }}</p>
                    <p class="mt-1 text-slate-600 dark:text-slate-300">{{ draft.general_information.learning_approach }}</p>
                  </div>
                </div>
              </article>
            </div>

            <div class="mt-4 grid gap-4 xl:grid-cols-2">
              <article class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Komponen Dasar</h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Kompetensi Awal</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.general_information.competency_prerequisites" :key="`prerequisite-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Profil Pelajar Pancasila</p>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span
                        v-for="(item, index) in draft.general_information.pancasila_profile"
                        :key="`pancasila-${index}`"
                        class="inline-flex rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sarana dan Prasarana</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.general_information.facilities" :key="`facility-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </article>

              <article class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Tujuan dan Pemahaman</h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">CP / ATP Acuan</p>
                    <p class="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                      {{ draft.core_components.cp_reference }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Tujuan Pembelajaran</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.learning_objectives" :key="`objective-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Indikator Ketercapaian</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.achievement_indicators || []" :key="`indicator-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Output Proyek</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.project_outputs || []" :key="`project-output-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pemahaman Bermakna</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.meaningful_understanding" :key="`meaningful-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pertanyaan Pemantik</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.trigger_questions" :key="`trigger-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            <article class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Kegiatan Pembelajaran</h3>
              <div class="mt-4 grid gap-4 xl:grid-cols-3">
                <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pendahuluan</p>
                  <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li v-for="(item, index) in draft.core_components.learning_activities.introduction" :key="`intro-${index}`">{{ index + 1 }}. {{ item }}</li>
                  </ul>
                </div>
                <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Inti</p>
                  <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li v-for="(item, index) in draft.core_components.learning_activities.core" :key="`core-${index}`">{{ index + 1 }}. {{ item }}</li>
                  </ul>
                </div>
                <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Penutup</p>
                  <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li v-for="(item, index) in draft.core_components.learning_activities.closing" :key="`closing-${index}`">{{ index + 1 }}. {{ item }}</li>
                  </ul>
                </div>
              </div>
            </article>

            <div class="mt-4 grid gap-4 xl:grid-cols-2">
              <article class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Asesmen</h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Diagnostik</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.assessments.diagnostic" :key="`diagnostic-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Formatif</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.assessments.formative" :key="`formative-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sumatif</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.assessments.summative" :key="`summative-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rubrik Penilaian</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.assessments.rubric || []" :key="`rubric-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </article>

              <article class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Pembelajaran Berdiferensiasi</h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Konten</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.differentiation.content" :key="`diff-content-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Proses</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.differentiation.process" :key="`diff-process-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Produk</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.differentiation.product" :key="`diff-product-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            <div class="mt-4 grid gap-4 xl:grid-cols-2">
              <article class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Tindak Lanjut</h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Remedial</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.remedial" :key="`remedial-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pengayaan</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.enrichment" :key="`enrichment-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </article>

              <article class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Refleksi</h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Refleksi Peserta Didik</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.student_reflection" :key="`student-reflection-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Refleksi Guru</p>
                    <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <li v-for="(item, index) in draft.core_components.teacher_reflection" :key="`teacher-reflection-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            <article class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Lampiran</h3>
              <div class="mt-4 grid gap-4 xl:grid-cols-2">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">LKPD / Tugas</p>
                  <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li v-for="(item, index) in draft.attachments.student_worksheet" :key="`worksheet-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Bahan Bacaan</p>
                  <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li v-for="(item, index) in draft.attachments.reading_materials" :key="`reading-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Glosarium</p>
                  <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li v-for="(item, index) in draft.attachments.glossary" :key="`glossary-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Daftar Pustaka</p>
                  <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li v-for="(item, index) in draft.attachments.bibliography" :key="`bibliography-${index}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            <div class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              {{ draft.notes }}
            </div>
          </div>

          <div v-else-if="isGenerating" class="space-y-4">
            <div class="flex min-h-[560px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/60">
              <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H8.25m.75 12h6m-6 3h3m-6.375 3h12.75A2.625 2.625 0 0021 17.625V6.75A2.25 2.25 0 0018.75 4.5h-7.5L6 9.75v7.875A2.625 2.625 0 008.625 20.25z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Belum Ada Draft Modul</h3>
              <p class="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Isi konteks pembelajaran di panel kiri, lalu generate untuk membuat draft modul ajar yang lebih terarah dan tetap sesuai struktur Kurikulum Merdeka.
              </p>
            </div>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Arsip Modul</p>
                <h3 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">Modul Yang Sudah Disimpan</h3>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Daftar draft modul ajar yang sudah pernah Anda simpan untuk mapel aktif.
                </p>
              </div>
              <button
                type="button"
                :disabled="isLoadingSavedModules"
                class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="loadSavedModules"
              >
                {{ isLoadingSavedModules ? "Memuat..." : "Refresh Tabel" }}
              </button>
            </div>

            <p v-if="savedModuleError" class="mt-3 text-sm font-medium text-rose-700 dark:text-rose-300">{{ savedModuleError }}</p>

            <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                  <thead class="bg-slate-50 dark:bg-slate-800/70">
                    <tr>
                      <th class="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Judul</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Topik</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Fase</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Waktu</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Update</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-300">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                    <tr v-if="isLoadingSavedModules">
                      <td colspan="6" class="px-4 py-6 text-center text-slate-500 dark:text-slate-400">Memuat modul tersimpan...</td>
                    </tr>
                    <tr v-else-if="savedModules.length === 0">
                      <td colspan="6" class="px-4 py-6 text-center text-slate-500 dark:text-slate-400">Belum ada modul tersimpan untuk mapel ini.</td>
                    </tr>
                    <tr v-for="item in savedModules" v-else :key="item.id">
                      <td class="px-4 py-3 align-top">
                        <p class="font-semibold text-slate-800 dark:text-slate-100">{{ item.title }}</p>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.curriculum_name || autoCurriculumName }}</p>
                      </td>
                      <td class="px-4 py-3 align-top text-slate-600 dark:text-slate-300">{{ item.topic }}</td>
                      <td class="px-4 py-3 align-top text-slate-600 dark:text-slate-300">{{ item.phase_name || "-" }}</td>
                      <td class="px-4 py-3 align-top text-slate-600 dark:text-slate-300">
                        {{ item.time_allocation }} · {{ item.meetings }} pertemuan
                      </td>
                      <td class="px-4 py-3 align-top text-slate-600 dark:text-slate-300">{{ formatDateTime(item.updated_at) }}</td>
                      <td class="px-4 py-3 align-top">
                        <div class="flex flex-wrap gap-2">
                          <button
                            type="button"
                            class="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
                            @click="openSavedModuleActions(item)"
                          >
                            Aksi
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        v-else
        class="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50"
      >
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pilih Mata Pelajaran</h3>
        <p class="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Silakan pilih mata pelajaran dari papan atas untuk mulai menyusun modul ajar.
        </p>
      </div>
    </main>

    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isGenerating" class="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20">
              <svg class="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Sedang menyusun modul ajar</h3>
              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Qwen sedang menyusun draft dengan struktur Kurikulum Merdeka. Mohon tunggu sampai proses selesai.
              </p>
              <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div class="h-full w-1/2 animate-pulse rounded-full bg-sky-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showSavedModuleActions && activeSavedModule" class="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">Aksi Modul</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">{{ activeSavedModule.title }}</h3>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ activeSavedModule.topic }}</p>
            </div>
            <button
              type="button"
              class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="closeSavedModuleActions"
            >
              Tutup
            </button>
          </div>

          <div class="mt-5 grid gap-2">
            <template v-if="!showDeleteConfirmation">
              <button
                type="button"
                class="rounded-xl bg-sky-600 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-sky-500"
                @click="handleEditSavedModule"
              >
                Edit Modul
              </button>
              <button
                type="button"
                class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="handleOpenSavedModule"
              >
                Buka Preview
              </button>
              <button
                type="button"
                class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="handleDownloadSavedModule"
              >
                Download Word
              </button>
              <button
                type="button"
                class="rounded-xl bg-rose-600 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-rose-500"
                @click="showDeleteConfirmation = true"
              >
                Hapus Modul
              </button>
            </template>

            <div v-else class="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
              <p class="text-sm font-semibold text-rose-700 dark:text-rose-300">Hapus modul ini?</p>
              <p class="mt-1 text-sm text-rose-600 dark:text-rose-200">
                Tindakan ini akan menghapus modul tersimpan dari arsip dan tidak bisa dibatalkan.
              </p>
              <div class="mt-4 flex gap-2">
                <button
                  type="button"
                  class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="showDeleteConfirmation = false"
                >
                  Batal
                </button>
                <button
                  type="button"
                  :disabled="isDeletingSavedModule"
                  class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                  @click="deleteSavedModule"
                >
                  {{ isDeletingSavedModule ? "Menghapus..." : "Ya, Hapus" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { useMasterDataStore } from "@/store/masterData";

const masterDataStore = useMasterDataStore();

const subjects = ref([]);
const selectedSubject = ref(null);
const subjectError = ref("");
const topicSuggestions = ref([]);
const topicSuggestionError = ref("");
const customTopic = ref("");
const isLoadingTopicSuggestions = ref(false);
const isLoadingSuggestionCatalog = ref(false);
const suggestionCatalogError = ref("");
const isGenerating = ref(false);
const isSavingDraft = ref(false);
const isLoadingSavedModules = ref(false);
const isDeletingSavedModule = ref(false);
const draft = ref(null);
const savedModules = ref([]);
const savedModuleError = ref("");
const editingModuleId = ref(null);
const showSavedModuleActions = ref(false);
const showDeleteConfirmation = ref(false);
const activeSavedModule = ref(null);
const suggestionCatalog = reactive({
  subject_category: "",
  titles: [],
  cp_references: [],
  learning_objectives: [],
  material_scopes: [],
  student_characteristics: [],
  facilities: [],
  additional_instruction_tips: [],
});

const form = reactive({
  title: "",
  topic: "",
  time_allocation: "2 x 45 menit",
  meetings: 1,
  cp_reference: "",
  learning_objectives: "",
  material_scope: "",
  learning_model: "Problem Based Learning (PBL)",
  pancasila_profile: "Bernalar kritis\nMandiri",
  student_characteristics: "",
  facilities: "",
  additional_instructions: "",
});
const customForm = reactive({
  title: "",
  cp_reference: "",
  learning_objectives: "",
  material_scope: "",
  student_characteristics: "",
  facilities: "",
  additional_instructions: "",
});

const firstSubjectValue = (subject, keys) => {
  for (const key of keys) {
    const value = String(subject?.[key] || "").trim();
    if (value) return value;
  }
  return "";
};

const subjectCardClass = (active = false) =>
  active
    ? "bg-sky-600 shadow-md ring-1 ring-sky-600 dark:bg-sky-500"
    : "bg-white shadow-sm ring-1 ring-slate-900/5 hover:bg-slate-50 dark:bg-slate-900 dark:ring-white/10 dark:hover:bg-slate-800/80";

const extractGradeNumber = (label) => {
  const text = String(label || "");
  const match = text.match(/\b(1[0-2]|[1-9])\b/);
  if (match) return Number(match[1]);

  const romanMatch = text.match(/\b(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\b/i);
  const romanGradeMap = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
    IX: 9,
    X: 10,
    XI: 11,
    XII: 12,
  };
  return romanMatch ? romanGradeMap[romanMatch[1].toUpperCase()] || 0 : 0;
};

const inferPhaseFromGrade = (grade) => {
  if (grade >= 1 && grade <= 2) return "Fase A";
  if (grade >= 3 && grade <= 4) return "Fase B";
  if (grade >= 5 && grade <= 6) return "Fase C";
  if (grade >= 7 && grade <= 9) return "Fase D";
  if (grade === 10) return "Fase E";
  if (grade >= 11 && grade <= 12) return "Fase F";
  return "Fase belum terbaca";
};

const autoGradeLabel = computed(() =>
  firstSubjectValue(selectedSubject.value, ["grade_label", "grade_name", "level_name", "class_name"]) || "-",
);

const autoPhaseName = computed(() => {
  const explicitPhase = firstSubjectValue(selectedSubject.value, ["phase_name", "fase_name", "phase", "fase"]);
  if (explicitPhase) {
    return /^fase/i.test(explicitPhase) ? explicitPhase : `Fase ${explicitPhase}`;
  }
  return inferPhaseFromGrade(extractGradeNumber(autoGradeLabel.value));
});

const autoCurriculumName = computed(() => "Kurikulum Merdeka");
const resolvedTopic = computed(() =>
  form.topic === "__custom__" ? String(customTopic.value || "").trim() : String(form.topic || "").trim(),
);
const resolvedTitle = computed(() =>
  form.title === "__custom__" ? String(customForm.title || "").trim() : String(form.title || "").trim(),
);
const resolvedCpReference = computed(() =>
  form.cp_reference === "__custom__" ? String(customForm.cp_reference || "").trim() : String(form.cp_reference || "").trim(),
);
const resolvedLearningObjectives = computed(() =>
  form.learning_objectives === "__custom__" ? String(customForm.learning_objectives || "").trim() : String(form.learning_objectives || "").trim(),
);
const resolvedMaterialScope = computed(() =>
  form.material_scope === "__custom__" ? String(customForm.material_scope || "").trim() : String(form.material_scope || "").trim(),
);
const resolvedStudentCharacteristics = computed(() =>
  form.student_characteristics === "__custom__" ? String(customForm.student_characteristics || "").trim() : String(form.student_characteristics || "").trim(),
);
const resolvedFacilities = computed(() =>
  form.facilities === "__custom__" ? String(customForm.facilities || "").trim() : String(form.facilities || "").trim(),
);
const resolvedAdditionalInstructions = computed(() =>
  form.additional_instructions === "__custom__" ? String(customForm.additional_instructions || "").trim() : String(form.additional_instructions || "").trim(),
);
const subjectCategoryLabel = computed(() => suggestionCatalog.subject_category || "Umum");

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const suggestionItems = (key) => {
  const items = suggestionCatalog[key];
  return Array.isArray(items) ? items : [];
};

const buildTeachingModulePayload = () => ({
  title: resolvedTitle.value,
  topic: resolvedTopic.value,
  grade_label: autoGradeLabel.value === "-" ? "" : autoGradeLabel.value,
  phase_name: autoPhaseName.value === "Fase belum terbaca" ? "" : autoPhaseName.value,
  curriculum_name: autoCurriculumName.value,
  cp_reference: resolvedCpReference.value,
  learning_objectives: resolvedLearningObjectives.value,
  material_scope: resolvedMaterialScope.value,
  time_allocation: form.time_allocation,
  meetings: Number(form.meetings || 1),
  student_characteristics: resolvedStudentCharacteristics.value,
  facilities: resolvedFacilities.value,
  pancasila_profile: form.pancasila_profile,
  learning_model: form.learning_model,
  additional_instructions: resolvedAdditionalInstructions.value,
});

const resetForm = () => {
  editingModuleId.value = null;
  form.title = "";
  form.topic = "";
  form.time_allocation = "2 x 45 menit";
  form.meetings = 1;
  form.cp_reference = "";
  form.learning_objectives = "";
  form.material_scope = "";
  form.learning_model = "Problem Based Learning (PBL)";
  form.pancasila_profile = "Bernalar kritis\nMandiri";
  form.student_characteristics = "";
  form.facilities = "";
  form.additional_instructions = "";
  customForm.title = "";
  customForm.cp_reference = "";
  customForm.learning_objectives = "";
  customForm.material_scope = "";
  customForm.student_characteristics = "";
  customForm.facilities = "";
  customForm.additional_instructions = "";
  customTopic.value = "";
  topicSuggestionError.value = "";
  suggestionCatalogError.value = "";
  draft.value = null;
};

const resetSuggestionCatalog = () => {
  suggestionCatalog.subject_category = "";
  suggestionCatalog.titles = [];
  suggestionCatalog.cp_references = [];
  suggestionCatalog.learning_objectives = [];
  suggestionCatalog.material_scopes = [];
  suggestionCatalog.student_characteristics = [];
  suggestionCatalog.facilities = [];
  suggestionCatalog.additional_instruction_tips = [];
};

const loadSubjects = async () => {
  subjectError.value = "";
  try {
    subjects.value = await masterDataStore.getTeacherSubjects();
    if (!selectedSubject.value && subjects.value.length > 0) {
      await selectSubject(subjects.value[0]);
    }
  } catch (error) {
    subjectError.value = error.message;
  }
};

const loadTopicSuggestions = async () => {
  if (!selectedSubject.value || isLoadingTopicSuggestions.value) return;

  isLoadingTopicSuggestions.value = true;
  topicSuggestionError.value = "";

  try {
    const response = await api.get(`/learning/subjects/${selectedSubject.value.id}/question-bank/topic-suggestions`, {
      params: {
        grade_label: autoGradeLabel.value === "-" ? "" : autoGradeLabel.value,
        phase_name: autoPhaseName.value === "Fase belum terbaca" ? "" : autoPhaseName.value,
        curriculum_name: autoCurriculumName.value,
      },
    });
    const topics = Array.isArray(response?.data?.topics) ? response.data.topics : [];
    topicSuggestions.value = topics;
    if (topics.length > 0 && (!form.topic || form.topic === "__custom__")) {
      form.topic = topics[0];
      customTopic.value = "";
    }
    if (topics.length === 0) {
      form.topic = "__custom__";
      topicSuggestionError.value = "Saran materi belum tersedia. Silakan tulis materi sendiri.";
    }
  } catch (error) {
    topicSuggestions.value = [];
    form.topic = "__custom__";
    topicSuggestionError.value = error.message || "Gagal memuat saran materi.";
  } finally {
    isLoadingTopicSuggestions.value = false;
  }
};

const loadSuggestionCatalog = async () => {
  if (!selectedSubject.value || isLoadingSuggestionCatalog.value) return;

  isLoadingSuggestionCatalog.value = true;
  suggestionCatalogError.value = "";

  try {
    const response = await api.get(`/learning/subjects/${selectedSubject.value.id}/teaching-module/suggestions`, {
      params: {
        grade_label: autoGradeLabel.value === "-" ? "" : autoGradeLabel.value,
        phase_name: autoPhaseName.value === "Fase belum terbaca" ? "" : autoPhaseName.value,
        curriculum_name: autoCurriculumName.value,
        topic: resolvedTopic.value,
      },
    });
    const data = response?.data || {};
    suggestionCatalog.subject_category = data.subject_category || "";
    suggestionCatalog.titles = Array.isArray(data.titles) ? data.titles : [];
    suggestionCatalog.cp_references = Array.isArray(data.cp_references) ? data.cp_references : [];
    suggestionCatalog.learning_objectives = Array.isArray(data.learning_objectives) ? data.learning_objectives : [];
    suggestionCatalog.material_scopes = Array.isArray(data.material_scopes) ? data.material_scopes : [];
    suggestionCatalog.student_characteristics = Array.isArray(data.student_characteristics) ? data.student_characteristics : [];
    suggestionCatalog.facilities = Array.isArray(data.facilities) ? data.facilities : [];
    suggestionCatalog.additional_instruction_tips = Array.isArray(data.additional_instruction_tips) ? data.additional_instruction_tips : [];

    if ((!form.title || form.title === "__custom__") && suggestionCatalog.titles.length > 0) {
      form.title = suggestionCatalog.titles[0];
    }
    if ((!form.cp_reference || form.cp_reference === "__custom__") && suggestionCatalog.cp_references.length > 0) {
      form.cp_reference = suggestionCatalog.cp_references[0];
    }
    if ((!form.learning_objectives || form.learning_objectives === "__custom__") && suggestionCatalog.learning_objectives.length > 0) {
      form.learning_objectives = suggestionCatalog.learning_objectives[0];
    }
    if ((!form.material_scope || form.material_scope === "__custom__") && suggestionCatalog.material_scopes.length > 0) {
      form.material_scope = suggestionCatalog.material_scopes[0];
    }
    if ((!form.student_characteristics || form.student_characteristics === "__custom__") && suggestionCatalog.student_characteristics.length > 0) {
      form.student_characteristics = suggestionCatalog.student_characteristics[0];
    }
    if ((!form.facilities || form.facilities === "__custom__") && suggestionCatalog.facilities.length > 0) {
      form.facilities = suggestionCatalog.facilities[0];
    }
    if ((!form.additional_instructions || form.additional_instructions === "__custom__") && suggestionCatalog.additional_instruction_tips.length > 0) {
      form.additional_instructions = suggestionCatalog.additional_instruction_tips[0];
    }
  } catch (error) {
    resetSuggestionCatalog();
    suggestionCatalogError.value = error.message || "Gagal memuat katalog saran modul ajar.";
  } finally {
    isLoadingSuggestionCatalog.value = false;
  }
};

const loadSavedModules = async () => {
  if (!selectedSubject.value || isLoadingSavedModules.value) return;

  isLoadingSavedModules.value = true;
  savedModuleError.value = "";
  try {
    const response = await api.get(`/learning/subjects/${selectedSubject.value.id}/teaching-modules`);
    savedModules.value = Array.isArray(response?.data?.items) ? response.data.items : [];
  } catch (error) {
    savedModules.value = [];
    savedModuleError.value = error.message || "Gagal memuat daftar modul tersimpan.";
  } finally {
    isLoadingSavedModules.value = false;
  }
};

const fillFormFromSavedModule = (item) => {
  const input = item?.input || {};
  editingModuleId.value = item?.id || null;
  form.title = input.title || item?.title || "";
  form.topic = input.topic || item?.topic || "";
  form.time_allocation = input.time_allocation || item?.time_allocation || "2 x 45 menit";
  form.meetings = Number(input.meetings || item?.meetings || 1);
  form.cp_reference = input.cp_reference || "";
  form.learning_objectives = input.learning_objectives || "";
  form.material_scope = input.material_scope || "";
  form.learning_model = input.learning_model || item?.learning_model || "Problem Based Learning (PBL)";
  form.pancasila_profile = input.pancasila_profile || "Bernalar kritis\nMandiri";
  form.student_characteristics = input.student_characteristics || "";
  form.facilities = input.facilities || "";
  form.additional_instructions = input.additional_instructions || "";
  customForm.title = "";
  customForm.cp_reference = "";
  customForm.learning_objectives = "";
  customForm.material_scope = "";
  customForm.student_characteristics = "";
  customForm.facilities = "";
  customForm.additional_instructions = "";
  customTopic.value = "";
};

const selectSubject = async (subject) => {
  selectedSubject.value = subject;
  topicSuggestions.value = [];
  savedModules.value = [];
  savedModuleError.value = "";
  resetSuggestionCatalog();
  resetForm();
  await Promise.allSettled([loadTopicSuggestions(), loadSuggestionCatalog(), loadSavedModules()]);
};

const validateForm = () => {
  if (!resolvedTitle.value) return "Judul modul wajib diisi.";
  if (!resolvedTopic.value) return "Topik atau materi wajib diisi.";
  if (!form.time_allocation) return "Alokasi waktu wajib diisi.";
  if (!resolvedCpReference.value) return "Capaian pembelajaran / acuan ATP wajib diisi.";
  if (!resolvedLearningObjectives.value) return "Tujuan pembelajaran wajib diisi.";
  if (!resolvedMaterialScope.value) return "Cakupan materi wajib diisi.";
  if (!Number.isFinite(Number(form.meetings)) || Number(form.meetings) < 1 || Number(form.meetings) > 12) {
    return "Jumlah pertemuan harus antara 1 sampai 12.";
  }
  return "";
};

const generateTeachingModule = async () => {
  if (!selectedSubject.value) return;

  const validationMessage = validateForm();
  if (validationMessage) {
    pushToast({
      title: "Form Belum Lengkap",
      message: validationMessage,
      type: "error",
    });
    return;
  }

  isGenerating.value = true;

  try {
    const response = await api.post(`/learning/subjects/${selectedSubject.value.id}/teaching-module/generate-ai`, buildTeachingModulePayload());
    draft.value = response?.data || null;
    pushToast({
      title: "Draft Modul Ajar Siap",
      message: "Silakan review hasil AI sebelum digunakan.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Membuat Modul Ajar",
      message: error.message,
      type: "error",
    });
  } finally {
    isGenerating.value = false;
  }
};

const saveTeachingModule = async () => {
  if (!selectedSubject.value || !draft.value || isSavingDraft.value) return;

  const validationMessage = validateForm();
  if (validationMessage) {
    pushToast({
      title: "Form Belum Lengkap",
      message: validationMessage,
      type: "error",
    });
    return;
  }

  isSavingDraft.value = true;
  try {
    const payload = {
      ...buildTeachingModulePayload(),
      draft: draft.value,
    };
    const wasEditing = Boolean(editingModuleId.value);
    if (editingModuleId.value) {
      await api.put(`/learning/subjects/${selectedSubject.value.id}/teaching-modules/${editingModuleId.value}`, payload);
    } else {
      await api.post(`/learning/subjects/${selectedSubject.value.id}/teaching-modules`, payload);
    }
    await loadSavedModules();
    pushToast({
      title: wasEditing ? "Modul Diperbarui" : "Modul Tersimpan",
      message: wasEditing ? "Perubahan modul ajar sudah disimpan." : "Draft modul ajar sudah masuk ke daftar arsip.",
      type: "success",
    });
    editingModuleId.value = null;
    draft.value = null;
  } catch (error) {
    pushToast({
      title: "Gagal Menyimpan Modul",
      message: error.message || "Draft belum bisa disimpan.",
      type: "error",
    });
  } finally {
    isSavingDraft.value = false;
  }
};

const buildDraftText = (items = []) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");

const copyDraftToClipboard = async () => {
  if (!draft.value || typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return;
  }

  const payload = draft.value;
  const content = [
    payload.title,
    "",
    "IDENTITAS MODUL",
    `Mata Pelajaran: ${payload.identity.subject_name}`,
    `Kelas: ${payload.identity.class_name}`,
    `Fase: ${payload.identity.phase_name}`,
    `Kurikulum: ${payload.identity.curriculum_name}`,
    `Topik: ${payload.identity.topic}`,
    `Alokasi Waktu: ${payload.identity.time_allocation}`,
    `Jumlah Pertemuan: ${payload.identity.meetings}`,
    "",
    "INFORMASI UMUM",
    `Kompetensi Awal:\n${buildDraftText(payload.general_information.competency_prerequisites)}`,
    `Profil Pelajar Pancasila:\n${buildDraftText(payload.general_information.pancasila_profile)}`,
    `Sarana dan Prasarana:\n${buildDraftText(payload.general_information.facilities)}`,
    `Target Peserta Didik: ${payload.general_information.target_learners}`,
    `Model Pembelajaran: ${payload.general_information.learning_model}`,
    `Pendekatan: ${payload.general_information.learning_approach}`,
    "",
    "KOMPONEN INTI",
    `CP / ATP Acuan:\n${payload.core_components.cp_reference}`,
    `Tujuan Pembelajaran:\n${buildDraftText(payload.core_components.learning_objectives)}`,
    `Indikator Ketercapaian:\n${buildDraftText(payload.core_components.achievement_indicators)}`,
    `Output Proyek:\n${buildDraftText(payload.core_components.project_outputs)}`,
    `Pemahaman Bermakna:\n${buildDraftText(payload.core_components.meaningful_understanding)}`,
    `Pertanyaan Pemantik:\n${buildDraftText(payload.core_components.trigger_questions)}`,
    `Kegiatan Pendahuluan:\n${buildDraftText(payload.core_components.learning_activities.introduction)}`,
    `Kegiatan Inti:\n${buildDraftText(payload.core_components.learning_activities.core)}`,
    `Kegiatan Penutup:\n${buildDraftText(payload.core_components.learning_activities.closing)}`,
    `Asesmen Diagnostik:\n${buildDraftText(payload.core_components.assessments.diagnostic)}`,
    `Asesmen Formatif:\n${buildDraftText(payload.core_components.assessments.formative)}`,
    `Asesmen Sumatif:\n${buildDraftText(payload.core_components.assessments.summative)}`,
    `Rubrik Penilaian:\n${buildDraftText(payload.core_components.assessments.rubric)}`,
    `Diferensiasi Konten:\n${buildDraftText(payload.core_components.differentiation.content)}`,
    `Diferensiasi Proses:\n${buildDraftText(payload.core_components.differentiation.process)}`,
    `Diferensiasi Produk:\n${buildDraftText(payload.core_components.differentiation.product)}`,
    `Remedial:\n${buildDraftText(payload.core_components.remedial)}`,
    `Pengayaan:\n${buildDraftText(payload.core_components.enrichment)}`,
    `Refleksi Peserta Didik:\n${buildDraftText(payload.core_components.student_reflection)}`,
    `Refleksi Guru:\n${buildDraftText(payload.core_components.teacher_reflection)}`,
    "",
    "LAMPIRAN",
    `LKPD / Tugas:\n${buildDraftText(payload.attachments.student_worksheet)}`,
    `Bahan Bacaan:\n${buildDraftText(payload.attachments.reading_materials)}`,
    `Glosarium:\n${buildDraftText(payload.attachments.glossary)}`,
    `Daftar Pustaka:\n${buildDraftText(payload.attachments.bibliography)}`,
    "",
    `Catatan: ${payload.notes}`,
  ].join("\n");

  try {
    await navigator.clipboard.writeText(content);
    pushToast({
      title: "Draft Disalin",
      message: "Isi modul ajar sudah disalin ke clipboard.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Menyalin Draft",
      message: error.message || "Clipboard tidak dapat diakses.",
      type: "error",
    });
  }
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");

const normalizeWordItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean);

const wordText = (value, fallback = "-") => {
  const text = String(value ?? "").trim();
  return text || fallback;
};

const renderWordList = (items = []) => {
  const rows = normalizeWordItems(items);
  if (rows.length === 0) {
    return `<p class="empty-text">-</p>`;
  }
  return `<ol class="word-list">${rows.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
};

const renderWordMetaRow = (label, value) => `
  <tr>
    <td class="meta-label">${escapeHtml(label)}</td>
    <td class="meta-value">${escapeHtml(wordText(value))}</td>
  </tr>
`;

const renderWordSection = (title, content) => `
  <section class="section">
    <h2>${escapeHtml(title)}</h2>
    <div class="section-body">
      ${content}
    </div>
  </section>
`;

const renderWordSubsection = (title, content) => `
  <div class="subsection">
    <h3>${escapeHtml(title)}</h3>
    ${content}
  </div>
`;

const renderWordNumberedRows = (items = []) => {
  const rows = normalizeWordItems(items);
  if (rows.length === 0) {
    return `<tr><td class="num-cell">1</td><td>-</td></tr>`;
  }
  return rows.map((item, index) => `
    <tr>
      <td class="num-cell">${index + 1}</td>
      <td>${escapeHtml(item)}</td>
    </tr>
  `).join("");
};

const renderWordDataTable = (headers = [], rows = [], className = "data-table") => `
  <table class="${className}">
    <thead>
      <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
`;

const renderWordListTable = (title, items = []) => `
  <div class="subsection">
    <h3>${escapeHtml(title)}</h3>
    ${renderWordDataTable(["No", "Uraian"], renderWordNumberedRows(items))}
  </div>
`;

const renderWordActivityTable = (activities = {}) => {
  const rows = [
    ["Pendahuluan", activities?.introduction],
    ["Kegiatan Inti", activities?.core],
    ["Penutup", activities?.closing],
  ].map(([phase, items]) => `
    <tr>
      <td class="label-cell">${escapeHtml(phase)}</td>
      <td>${renderWordList(items)}</td>
    </tr>
  `).join("");

  return renderWordDataTable(["Tahap", "Aktivitas Guru dan Peserta Didik"], rows, "data-table activity-table");
};

const renderWordAssessmentTable = (assessments = {}) => `
  ${renderWordDataTable(["Jenis Asesmen", "Teknik / Instrumen"], `
    <tr>
      <td class="label-cell">Diagnostik</td>
      <td>${renderWordList(assessments?.diagnostic)}</td>
    </tr>
    <tr>
      <td class="label-cell">Formatif</td>
      <td>${renderWordList(assessments?.formative)}</td>
    </tr>
    <tr>
      <td class="label-cell">Sumatif</td>
      <td>${renderWordList(assessments?.summative)}</td>
    </tr>
  `)}
`;

const renderWordRubricTable = (items = []) => {
  const rows = normalizeWordItems(items);
  return renderWordDataTable(["No", "Kriteria / Deskripsi Skor"], renderWordNumberedRows(rows));
};

const renderWordSignatureBlock = () => `
  <table class="signature-table">
    <tr>
      <td>
        <p>Mengetahui,</p>
        <p>Kepala Sekolah</p>
        <div class="signature-space"></div>
        <p class="signature-name">( ........................................ )</p>
        <p>NIP. ........................................</p>
      </td>
      <td>
        <p>........................., ............................</p>
        <p>Guru Mata Pelajaran</p>
        <div class="signature-space"></div>
        <p class="signature-name">( ........................................ )</p>
        <p>NIP. ........................................</p>
      </td>
    </tr>
  </table>
`;

const renderWordHumanNote = (payload) => `
  <div class="teacher-note">
    <p>
      Modul ini disusun sebagai pegangan praktis guru. Gunakan alur kegiatan sebagai rencana utama,
      lalu sesuaikan contoh, tempo, dan pertanyaan dengan kondisi kelas saat pembelajaran berlangsung.
    </p>
    <p>
      Fokus pembelajaran: ${escapeHtml(wordText(payload?.identity?.topic))}. Model yang disarankan:
      ${escapeHtml(wordText(payload?.general_information?.learning_model))}.
    </p>
  </div>
`;

const downloadDraftAsWord = () => {
  if (!draft.value || typeof window === "undefined") {
    return;
  }
  downloadWordPayload(draft.value);
};

const downloadWordPayload = (payload) => {
  if (!payload || typeof window === "undefined") {
    return;
  }

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(payload.title)}</title>
        <style>
          @page { size: A4; margin: 1.9cm 1.65cm 1.85cm 1.85cm; }
          body {
            font-family: "Aptos", Calibri, Arial, sans-serif;
            font-size: 10.5pt;
            color: #172033;
            line-height: 1.38;
            margin: 0;
          }
          p { margin: 0 0 5pt; }
          table {
            border-collapse: collapse;
            width: 100%;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          .cover {
            padding: 46pt 18pt 0;
            text-align: center;
          }
          .school-name {
            font-size: 11.5pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.7pt;
            margin-bottom: 3pt;
          }
          .school-meta {
            color: #475569;
            font-size: 9.5pt;
            margin: 0;
          }
          .cover-line {
            border-top: 1.4pt solid #1e293b;
            margin: 18pt auto 34pt;
            width: 82%;
          }
          .cover-kicker {
            color: #334155;
            font-size: 12pt;
            font-weight: 700;
            letter-spacing: 1.8pt;
            margin-bottom: 10pt;
            text-transform: uppercase;
          }
          .cover h1 {
            color: #0f172a;
            font-size: 21pt;
            line-height: 1.16;
            margin: 0 0 12pt;
            text-transform: uppercase;
          }
          .subject-line {
            color: #334155;
            font-size: 11pt;
            font-weight: 700;
            margin-bottom: 16pt;
          }
          .summary {
            color: #334155;
            font-size: 10.5pt;
            margin: 0 auto 24pt;
            text-align: center;
            width: 78%;
          }
          .cover-table {
            border: 1pt solid #1e293b;
            margin: 0 auto;
            width: 74%;
          }
          .cover-table td {
            border: 0.75pt solid #475569;
            padding: 6pt 8pt;
            text-align: left;
            vertical-align: middle;
          }
          .cover-label,
          .meta-label,
          .label-cell {
            background: #eef2f7;
            color: #0f172a;
            font-weight: 700;
          }
          .cover-label { width: 34%; }
          .cover-footer {
            color: #475569;
            font-size: 9.5pt;
            margin-top: 24pt;
          }
          .page-break {
            page-break-after: always;
            mso-page-break-after: always;
            font-size: 1pt;
            height: 1pt;
            line-height: 1pt;
            margin: 0;
          }
          .first-content {
            page-break-before: always;
            mso-page-break-before: always;
          }
          .meta-card {
            margin-bottom: 13pt;
          }
          .meta-title {
            background: #1e293b;
            color: #ffffff;
            font-size: 11pt;
            font-weight: 700;
            padding: 6pt 8pt;
            text-transform: uppercase;
          }
          .meta-table,
          .data-table {
            border: 1pt solid #475569;
            margin-bottom: 9pt;
          }
          .meta-table td,
          .data-table td,
          .data-table th {
            border: 0.7pt solid #64748b;
            padding: 5pt 6pt;
            vertical-align: top;
          }
          .data-table th {
            background: #e2e8f0;
            color: #0f172a;
            font-weight: 700;
            text-align: center;
          }
          .meta-label {
            width: 29%;
          }
          .meta-value {
            color: #172033;
          }
          .num-cell {
            background: #f8fafc;
            font-weight: 700;
            text-align: center;
            width: 28pt;
          }
          .section {
            margin: 0 0 13pt;
          }
          .section h2 {
            border-bottom: 1.1pt solid #1e293b;
            color: #0f172a;
            font-size: 12pt;
            letter-spacing: 0.2pt;
            margin: 0 0 7pt;
            padding: 0 0 4pt;
            text-transform: uppercase;
          }
          .section-body {
            padding: 0;
          }
          .subsection {
            margin: 0 0 9pt;
          }
          .subsection h3 {
            color: #1e293b;
            font-size: 10.8pt;
            font-weight: 700;
            margin: 0 0 4pt;
          }
          .word-list {
            margin: 0;
            padding-left: 18pt;
          }
          .word-list li {
            margin: 0 0 3pt;
          }
          .info-box,
          .teacher-note,
          .footer-note {
            background: #f8fafc;
            border: 0.85pt solid #94a3b8;
            padding: 7pt 8pt;
          }
          .teacher-note {
            background: #f1f5f9;
            margin-bottom: 11pt;
          }
          .empty-text {
            color: #64748b;
            margin: 0;
          }
          .activity-table .label-cell {
            width: 25%;
          }
          .signature-table {
            margin-top: 22pt;
            page-break-inside: avoid;
          }
          .signature-table td {
            padding: 0 18pt;
            text-align: center;
            vertical-align: top;
            width: 50%;
          }
          .signature-space {
            height: 45pt;
          }
          .signature-name {
            font-weight: 700;
            margin-bottom: 2pt;
          }
          tr {
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="cover">
          <div>
            <p class="school-name">Perangkat Ajar Guru</p>
            <p class="school-meta">Satuan Pendidikan: ............................................................</p>
            <p class="school-meta">Alamat: ....................................................................................</p>
          </div>
          <div class="cover-line"></div>
          <div class="cover-kicker">Modul Ajar</div>
          <div class="subject-line">${escapeHtml(payload.identity.subject_name)} • ${escapeHtml(payload.identity.class_name)}</div>
          <h1>${escapeHtml(payload.title)}</h1>
          <p class="summary">
            Dokumen ini disusun sebagai panduan mengajar yang praktis, runtut, dan mudah disesuaikan
            dengan kebutuhan kelas. Struktur mengikuti kebutuhan Modul Ajar ${escapeHtml(payload.identity.curriculum_name)}.
          </p>
          <table class="cover-table">
            <tr>
              <td class="cover-label">Mata Pelajaran</td>
              <td>${escapeHtml(payload.identity.subject_name)}</td>
            </tr>
            <tr>
              <td class="cover-label">Kelas / Fase</td>
              <td>${escapeHtml(payload.identity.class_name)} / ${escapeHtml(payload.identity.phase_name)}</td>
            </tr>
            <tr>
              <td class="cover-label">Topik</td>
              <td>${escapeHtml(payload.identity.topic)}</td>
            </tr>
            <tr>
              <td class="cover-label">Alokasi Waktu</td>
              <td>${escapeHtml(payload.identity.time_allocation)} (${escapeHtml(payload.identity.meetings)} pertemuan)</td>
            </tr>
            <tr>
              <td class="cover-label">Penyusun</td>
              <td>............................................................</td>
            </tr>
            <tr>
              <td class="cover-label">Tahun Pelajaran</td>
              <td>........../..........</td>
            </tr>
          </table>
          <div class="cover-footer">
            <p>Disiapkan untuk membantu guru menjalankan pembelajaran yang terarah, manusiawi, dan terukur.</p>
          </div>
        </div>
        <div class="page-break">&nbsp;</div>

        <div class="meta-card first-content">
          <div class="meta-title">A. Identitas Modul</div>
          <table class="meta-table">
            ${renderWordMetaRow("Satuan Pendidikan", "............................................................")}
            ${renderWordMetaRow("Mata Pelajaran", payload.identity.subject_name)}
            ${renderWordMetaRow("Kelas / Rombel", payload.identity.class_name)}
            ${renderWordMetaRow("Jenjang / Kelas Target", payload.identity.grade_label)}
            ${renderWordMetaRow("Fase", payload.identity.phase_name)}
            ${renderWordMetaRow("Kurikulum", payload.identity.curriculum_name)}
            ${renderWordMetaRow("Topik", payload.identity.topic)}
            ${renderWordMetaRow("Alokasi Waktu", payload.identity.time_allocation)}
            ${renderWordMetaRow("Jumlah Pertemuan", payload.identity.meetings)}
            ${renderWordMetaRow("Penyusun", "............................................................")}
          </table>
        </div>

        ${renderWordSection("B. Gambaran Pembelajaran", `
          ${renderWordHumanNote(payload)}
          ${renderWordDataTable(["Aspek", "Uraian"], `
            <tr>
              <td class="label-cell">Arah Pembelajaran</td>
              <td>Peserta didik diarahkan untuk mempelajari ${escapeHtml(wordText(payload.identity.topic))} melalui aktivitas bertahap, diskusi, latihan, dan refleksi.</td>
            </tr>
            <tr>
              <td class="label-cell">Model Pembelajaran</td>
              <td>${escapeHtml(wordText(payload.general_information.learning_model))}</td>
            </tr>
            <tr>
              <td class="label-cell">Pendekatan</td>
              <td>${escapeHtml(wordText(payload.general_information.learning_approach))}</td>
            </tr>
            <tr>
              <td class="label-cell">Target Peserta Didik</td>
              <td>${escapeHtml(wordText(payload.general_information.target_learners))}</td>
            </tr>
          `)}
        `)}

        ${renderWordSection("C. Informasi Umum", `
          ${renderWordListTable("Kompetensi Awal", payload.general_information.competency_prerequisites)}
          ${renderWordListTable("Profil Pelajar Pancasila", payload.general_information.pancasila_profile)}
          ${renderWordListTable("Sarana dan Prasarana", payload.general_information.facilities)}
        `)}

        ${renderWordSection("D. Capaian, Tujuan, dan Pemahaman", `
          ${renderWordSubsection("CP / ATP Acuan", `<div class="info-box"><p>${escapeHtml(payload.core_components.cp_reference)}</p></div>`)}
          ${renderWordListTable("Tujuan Pembelajaran", payload.core_components.learning_objectives)}
          ${renderWordListTable("Indikator Ketercapaian Tujuan", payload.core_components.achievement_indicators)}
          ${renderWordListTable("Pemahaman Bermakna", payload.core_components.meaningful_understanding)}
          ${renderWordListTable("Pertanyaan Pemantik", payload.core_components.trigger_questions)}
          ${renderWordListTable("Output Proyek / Produk Pembelajaran", payload.core_components.project_outputs)}
        `)}

        ${renderWordSection("E. Langkah-Langkah Pembelajaran", `
          ${renderWordActivityTable(payload.core_components.learning_activities)}
        `)}

        ${renderWordSection("F. Asesmen Pembelajaran", `
          ${renderWordAssessmentTable(payload.core_components.assessments)}
          ${renderWordSubsection("Rubrik Penilaian", renderWordRubricTable(payload.core_components.assessments.rubric))}
        `)}

        ${renderWordSection("G. Pembelajaran Berdiferensiasi", `
          ${renderWordListTable("Diferensiasi Konten", payload.core_components.differentiation.content)}
          ${renderWordListTable("Diferensiasi Proses", payload.core_components.differentiation.process)}
          ${renderWordListTable("Diferensiasi Produk", payload.core_components.differentiation.product)}
        `)}

        ${renderWordSection("H. Tindak Lanjut dan Refleksi", `
          ${renderWordListTable("Remedial", payload.core_components.remedial)}
          ${renderWordListTable("Pengayaan", payload.core_components.enrichment)}
          ${renderWordListTable("Refleksi Peserta Didik", payload.core_components.student_reflection)}
          ${renderWordListTable("Refleksi Guru", payload.core_components.teacher_reflection)}
        `)}

        ${renderWordSection("I. Lampiran Pembelajaran", `
          ${renderWordListTable("LKPD / Tugas", payload.attachments.student_worksheet)}
          ${renderWordListTable("Bahan Bacaan", payload.attachments.reading_materials)}
          ${renderWordListTable("Glosarium", payload.attachments.glossary)}
          ${renderWordListTable("Daftar Pustaka", payload.attachments.bibliography)}
        `)}

        ${renderWordSection("J. Catatan Akhir dan Pengesahan", `
          <div class="footer-note">
            <p><strong>Catatan Guru:</strong></p>
            <p>${escapeHtml(payload.notes)}</p>
          </div>
        `)}

        ${renderWordSignatureBlock()}
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileName = String(payload.title || "modul-ajar").trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
  link.href = url;
  link.download = `${fileName || "modul-ajar"}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const openSavedModule = (item) => {
  if (!item?.draft) {
    pushToast({
      title: "Draft Tidak Tersedia",
      message: "Konten modul tersimpan tidak ditemukan.",
      type: "error",
    });
    return;
  }
  draft.value = item.draft;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const downloadSavedModule = (item) => {
  if (!item?.draft) {
    pushToast({
      title: "Draft Tidak Tersedia",
      message: "Konten modul tersimpan tidak ditemukan.",
      type: "error",
    });
    return;
  }
  downloadWordPayload(item.draft);
};

const openSavedModuleActions = (item) => {
  activeSavedModule.value = item;
  showSavedModuleActions.value = true;
};

const closeSavedModuleActions = () => {
  showSavedModuleActions.value = false;
  showDeleteConfirmation.value = false;
  activeSavedModule.value = null;
};

const handleOpenSavedModule = () => {
  if (!activeSavedModule.value) return;
  openSavedModule(activeSavedModule.value);
  closeSavedModuleActions();
};

const handleDownloadSavedModule = () => {
  if (!activeSavedModule.value) return;
  downloadSavedModule(activeSavedModule.value);
  closeSavedModuleActions();
};

const handleEditSavedModule = () => {
  if (!activeSavedModule.value) return;
  fillFormFromSavedModule(activeSavedModule.value);
  openSavedModule(activeSavedModule.value);
  closeSavedModuleActions();
};

const deleteSavedModule = async () => {
  if (!selectedSubject.value || !activeSavedModule.value || isDeletingSavedModule.value) return;
  isDeletingSavedModule.value = true;
  try {
    await api.delete(`/learning/subjects/${selectedSubject.value.id}/teaching-modules/${activeSavedModule.value.id}`);
    if (editingModuleId.value === activeSavedModule.value.id) {
      editingModuleId.value = null;
    }
    if (draft.value?.title === activeSavedModule.value.draft?.title) {
      draft.value = null;
    }
    await loadSavedModules();
    pushToast({
      title: "Modul Dihapus",
      message: "Modul ajar tersimpan sudah dihapus dari arsip.",
      type: "success",
    });
    closeSavedModuleActions();
  } catch (error) {
    pushToast({
      title: "Gagal Menghapus Modul",
      message: error.message || "Modul belum bisa dihapus.",
      type: "error",
    });
  } finally {
    isDeletingSavedModule.value = false;
  }
};

onMounted(loadSubjects);

watch(
  () => form.topic,
  async (value) => {
    if (!selectedSubject.value) return;
    if (!value || value === "__custom__") return;
    if (!topicSuggestions.value.includes(value)) return;
    await loadSuggestionCatalog();
  },
);
</script>
