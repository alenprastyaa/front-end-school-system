<template>
  <div class="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8 dark:bg-slate-950 dark:text-white">
    <main class="mx-auto max-w-7xl space-y-6">
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Super Admin CMS</p>
            <h1 class="mt-2 text-2xl font-black tracking-tight">Landing Page & Blog</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Kelola copywriting landing page, metadata, CTA, kontak, FAQ, dan artikel blog yang tampil untuk calon client.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <a href="/" target="_blank"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <Icon icon="ph:eye" /> Preview Landing
            </a>
            <button @click="loadAll" :disabled="isLoading"
              class="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-60">
              <Icon :icon="isLoading ? 'ph:circle-notch' : 'ph:arrows-clockwise'" :class="{ 'animate-spin': isLoading }" />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="grid gap-2 sm:grid-cols-3">
          <button v-for="tab in tabs" :key="tab.key" type="button" @click="activeTab = tab.key"
            class="rounded-xl px-4 py-3 text-sm font-bold transition"
            :class="activeTab === tab.key ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'">
            <Icon :icon="tab.icon" class="mr-1 inline-block" /> {{ tab.label }}
          </button>
        </div>
      </section>

      <section v-if="activeTab === 'sections'" class="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Section</p>
          <div class="mt-3 space-y-2">
            <button v-for="section in sections" :key="section.key" type="button" @click="selectSection(section)"
              class="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition"
              :class="selectedSection?.key === section.key ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'">
              <span class="truncate">{{ section.label || section.key }}</span>
              <span class="rounded-full px-2 py-0.5 text-[10px]" :class="section.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                {{ section.is_active ? "ON" : "OFF" }}
              </span>
            </button>
          </div>
        </aside>

        <form v-if="sectionForm" class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10" @submit.prevent="saveSection">
          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="text-sm font-semibold">Label Section</span>
              <input v-model="sectionForm.label" type="text" class="cms-input" />
            </label>
            <label class="block">
              <span class="text-sm font-semibold">Urutan</span>
              <input v-model.number="sectionForm.sort_order" type="number" class="cms-input" />
            </label>
          </div>
          <label class="mt-4 flex items-center gap-2 text-sm font-semibold">
            <input v-model="sectionForm.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-sky-600" />
            Aktif di landing page
          </label>

          <div class="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div>
              <div class="mb-2 flex items-center justify-between">
                <span class="text-sm font-semibold">Content JSON</span>
                <button type="button" @click="formatSectionJson"
                  class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">
                  Format JSON
                </button>
              </div>
              <textarea v-model="sectionJson" rows="22" spellcheck="false"
                class="block w-full rounded-xl border-0 bg-slate-950 px-4 py-3 font-mono text-xs leading-6 text-slate-100 ring-1 ring-slate-700 focus:ring-2 focus:ring-sky-500"></textarea>
              <p v-if="sectionError" class="mt-2 text-sm font-semibold text-rose-600">{{ sectionError }}</p>
            </div>

            <div class="space-y-4">
              <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p class="text-sm font-bold">Upload Asset R2</p>
                <p class="mt-1 text-xs leading-5 text-slate-500">Upload gambar hero, cover, logo, atau aset lain. URL bisa ditempel ke JSON.</p>
                <input type="file" accept="image/*" class="mt-3 block w-full text-sm" @change="uploadAsset" />
                <div v-if="lastUploadedUrl" class="mt-3 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800">
                  <p class="font-bold text-emerald-600">URL berhasil dibuat:</p>
                  <button type="button" class="mt-1 break-all text-left text-sky-600" @click="copyText(lastUploadedUrl)">
                    {{ lastUploadedUrl }}
                  </button>
                </div>
              </div>
              <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                Gunakan struktur JSON sesuai contoh default. Field umum: <b>eyebrow</b>, <b>title</b>, <b>description</b>,
                <b>items</b>, <b>ctaLabel</b>, <b>ctaHref</b>, <b>phone</b>, <b>email</b>.
              </div>
            </div>
          </div>

          <div class="mt-5 flex justify-end">
            <button type="submit" :disabled="isSavingSection"
              class="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-60">
              <Icon :icon="isSavingSection ? 'ph:circle-notch' : 'ph:floppy-disk'" :class="{ 'animate-spin': isSavingSection }" />
              Simpan Section
            </button>
          </div>
        </form>
      </section>

      <section v-if="activeTab === 'blog'" class="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-black">Artikel Blog</h2>
            <button @click="newBlog" class="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white">Tambah Artikel</button>
          </div>
          <div class="mt-4 space-y-3">
            <article v-for="post in blogPosts" :key="post.id"
              class="rounded-xl border border-slate-200 p-3 transition hover:border-sky-300 dark:border-slate-700">
              <button type="button" class="block w-full text-left" @click="editBlog(post)">
                <p class="line-clamp-2 text-sm font-black text-slate-900 dark:text-white">{{ post.title }}</p>
                <p class="mt-1 truncate text-xs text-slate-500">/{{ post.slug }}</p>
                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <span class="rounded-full px-2 py-1 text-[11px] font-bold" :class="post.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                    {{ post.is_published ? "Published" : "Draft" }}
                  </span>
                  <span v-if="post.is_featured" class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700">Featured</span>
                  <span class="text-[11px] font-bold text-slate-400">{{ formatDate(post.published_at || post.created_at) }}</span>
                </div>
              </button>
              <div class="mt-3 flex gap-2">
                <button type="button" @click="editBlog(post)" class="flex-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Edit</button>
                <button type="button" @click="deleteBlog(post)" class="flex-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600">Hapus</button>
              </div>
            </article>
            <p v-if="!blogPosts.length" class="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm font-bold text-slate-400">
              Belum ada artikel.
            </p>
          </div>
        </div>

        <form class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 md:p-7 dark:bg-slate-900 dark:ring-white/10" @submit.prevent="saveBlog">
          <div class="flex flex-col gap-2 border-b border-slate-100 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-300">Editor Artikel</p>
              <h2 class="mt-1 text-2xl font-black">{{ blogForm.id ? "Edit Artikel" : "Artikel Baru" }}</h2>
            </div>
            <div class="flex gap-2">
              <button type="button" @click="newBlog" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold dark:border-slate-700">Reset</button>
              <button type="submit" :disabled="isSavingBlog" class="rounded-xl bg-sky-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-60">
                {{ isSavingBlog ? "Menyimpan..." : "Simpan Artikel" }}
              </button>
            </div>
          </div>
          <div class="mt-5 grid gap-4 lg:grid-cols-2">
            <label>
              <span class="text-sm font-semibold">Judul Artikel</span>
              <input v-model="blogForm.title" class="cms-input" placeholder="Judul artikel" required />
            </label>
            <label>
              <span class="text-sm font-semibold">Slug URL</span>
              <input v-model="blogForm.slug" class="cms-input" placeholder="slug-artikel-otomatis-jika-kosong" />
            </label>
          </div>
          <label class="mt-4 block">
            <span class="text-sm font-semibold">Ringkasan Artikel</span>
            <textarea v-model="blogForm.excerpt" rows="3" class="cms-input" placeholder="Ringkasan singkat yang tampil di kartu blog"></textarea>
          </label>
          <div class="mt-4 space-y-4">
            <div>
              <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span class="text-sm font-semibold">Isi Artikel</span>
                <button type="button" @click="toggleHtmlPreview"
                  class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">
                  {{ showHtmlPreview ? "Tutup HTML" : "Lihat HTML" }}
                </button>
              </div>
              <div class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div class="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
                  <button v-for="tool in editorTools" :key="tool.key" type="button" :title="tool.title"
                    class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-black text-slate-700 transition hover:bg-white hover:text-sky-700 dark:text-slate-200 dark:hover:bg-slate-700"
                    @click="runEditorTool(tool)">
                    <Icon v-if="tool.icon" :icon="tool.icon" />
                    <span v-else>{{ tool.label }}</span>
                  </button>
                </div>
                <div ref="blogEditor" contenteditable="true"
                  class="blog-editor min-h-[560px] px-5 py-5 text-base leading-8 text-slate-800 outline-none dark:text-slate-100"
                  data-placeholder="Tulis artikel di sini. Gunakan toolbar untuk heading, list, quote, link, dan gambar."
                  @input="syncBlogEditor"></div>
              </div>
              <textarea v-if="showHtmlPreview" v-model="blogForm.content" rows="12" class="cms-input font-mono text-xs"
                spellcheck="false" @input="renderBlogEditor"></textarea>
            </div>

            <div class="grid gap-4 lg:grid-cols-2">
              <label>
                <span class="text-sm font-semibold">Cover Image URL</span>
                <input v-model="blogForm.cover_image_url" class="cms-input" placeholder="https://..." />
              </label>
              <label>
                <span class="text-sm font-semibold">Upload Cover</span>
                <input type="file" accept="image/*" class="mt-3 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800" @change="uploadBlogCover" />
              </label>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label>
                <span class="text-sm font-semibold">Author</span>
                <input v-model="blogForm.author_name" class="cms-input" placeholder="Author" />
              </label>
              <label>
                <span class="text-sm font-semibold">Kategori</span>
                <input v-model="blogForm.category" class="cms-input" placeholder="Kategori" />
              </label>
              <label>
                <span class="text-sm font-semibold">Urutan</span>
                <input v-model.number="blogForm.sort_order" type="number" class="cms-input" placeholder="0" />
              </label>
              <label>
                <span class="text-sm font-semibold">Tanggal Publish</span>
                <input v-model="blogForm.published_at" type="date" class="cms-input" />
              </label>
            </div>

            <div class="grid gap-4 lg:grid-cols-2">
              <label>
                <span class="text-sm font-semibold">Tags</span>
                <input v-model="blogForm.tags" class="cms-input" placeholder="Tags, pisahkan koma" />
              </label>
              <label>
                <span class="text-sm font-semibold">SEO Meta Title</span>
                <input v-model="blogForm.meta_title" class="cms-input" placeholder="SEO meta title" />
              </label>
            </div>
            <label class="block">
              <span class="text-sm font-semibold">SEO Meta Description</span>
              <textarea v-model="blogForm.meta_description" rows="2" class="cms-input" placeholder="SEO meta description"></textarea>
            </label>

            <div class="flex flex-wrap gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <label class="flex items-center gap-2 text-sm font-semibold"><input v-model="blogForm.is_published" type="checkbox" /> Publish</label>
              <label class="flex items-center gap-2 text-sm font-semibold"><input v-model="blogForm.is_featured" type="checkbox" /> Featured di landing</label>
            </div>
          </div>
          <div class="mt-5 flex justify-between">
            <button type="button" @click="newBlog" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold">Reset</button>
            <button type="submit" :disabled="isSavingBlog" class="rounded-xl bg-sky-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-60">
              {{ isSavingBlog ? "Menyimpan..." : "Simpan Artikel" }}
            </button>
          </div>
        </form>
      </section>

      <section v-if="activeTab === 'assets'" class="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-2xl text-sky-600 dark:bg-sky-500/10 dark:text-sky-200">
              <Icon icon="ph:cloud-arrow-up" />
            </div>
            <div>
              <h2 class="text-lg font-black">Upload Asset Landing</h2>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Upload logo, gambar hero, icon benefit, cover blog, atau aset campaign ke R2. URL hasil upload bisa ditempel ke section JSON maupun artikel blog.
              </p>
            </div>
          </div>

          <label class="mt-6 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-sky-300 hover:bg-sky-50/60 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-sky-500">
            <Icon icon="ph:image-square" class="text-4xl text-sky-600 dark:text-sky-300" />
            <span class="mt-3 text-sm font-bold">Pilih file gambar</span>
            <span class="mt-1 text-xs text-slate-500">PNG, JPG, WEBP, SVG sesuai konfigurasi upload server</span>
            <input type="file" accept="image/*" class="sr-only" @change="uploadAsset" />
          </label>

          <div v-if="lastUploadedUrl" class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
            <p class="font-black">URL asset terakhir</p>
            <button type="button" class="mt-2 block break-all text-left font-semibold text-sky-700 dark:text-sky-200" @click="copyText(lastUploadedUrl)">
              {{ lastUploadedUrl }}
            </button>
          </div>
        </div>

        <aside class="rounded-2xl bg-white p-5 text-sm shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <h3 class="font-black">Rekomendasi Pemakaian</h3>
          <div class="mt-4 space-y-3 text-slate-500 dark:text-slate-400">
            <p><b class="text-slate-800 dark:text-slate-100">Logo paket:</b> tempel URL ke JSON pricing pada field <code>logoUrl</code> atau <code>imageUrl</code> jika section sudah memakai field tersebut.</p>
            <p><b class="text-slate-800 dark:text-slate-100">Hero:</b> gunakan gambar WEBP rasio lebar supaya landing tetap cepat.</p>
            <p><b class="text-slate-800 dark:text-slate-100">Blog:</b> upload cover dari form artikel agar langsung tersimpan di field cover.</p>
          </div>
        </aside>
      </section>
    </main>

    <div v-if="editorDialog.isOpen"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      @keydown.esc="closeEditorDialog">
      <form class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900" @submit.prevent="submitEditorDialog">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-300">Editor Blog</p>
            <h2 class="mt-1 text-xl font-black">{{ editorDialog.title }}</h2>
          </div>
          <button type="button" class="rounded-xl p-2 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            @click="closeEditorDialog">
            <Icon icon="ph:x" />
          </button>
        </div>

        <div v-if="editorDialog.type === 'image'" class="mt-5">
          <label
            class="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center transition hover:border-sky-300 hover:bg-sky-50/60 dark:border-slate-700 dark:bg-slate-800/60">
            <Icon :icon="editorDialog.isUploading ? 'ph:circle-notch' : 'ph:cloud-arrow-up'"
              class="text-3xl text-sky-600 dark:text-sky-300" :class="{ 'animate-spin': editorDialog.isUploading }" />
            <span class="mt-3 text-sm font-bold">
              {{ editorDialog.isUploading ? "Mengupload ke R2..." : "Upload gambar ke R2" }}
            </span>
            <span class="mt-1 text-xs text-slate-500">Pilih gambar, lalu sistem akan otomatis menyisipkan ke artikel.</span>
            <input type="file" accept="image/*" class="sr-only" :disabled="editorDialog.isUploading"
              @change="uploadEditorImage" />
          </label>
          <div class="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            <span class="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
            atau URL manual
            <span class="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
          </div>
        </div>

        <label class="block" :class="{ 'mt-5': editorDialog.type !== 'image' }">
          <span class="text-sm font-semibold">{{ editorDialog.label }}</span>
          <input ref="editorDialogInput" v-model="editorDialog.value" type="url" class="cms-input"
            :placeholder="editorDialog.placeholder" :required="editorDialog.type !== 'image'" />
        </label>

        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="closeEditorDialog">
            Batal
          </button>
          <button type="submit" :disabled="editorDialog.isUploading || !editorDialog.value.trim()"
            class="rounded-xl bg-sky-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
            Sisipkan
          </button>
        </div>
      </form>
    </div>

    <div v-if="deleteDialog.isOpen"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      @keydown.esc="closeDeleteDialog">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl text-rose-600 dark:bg-rose-500/10">
          <Icon icon="ph:trash" />
        </div>
        <h2 class="mt-4 text-xl font-black">Hapus artikel?</h2>
        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Artikel <b class="text-slate-900 dark:text-white">{{ deleteDialog.post?.title }}</b> akan dihapus dari CMS blog.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="closeDeleteDialog">
            Batal
          </button>
          <button type="button" class="rounded-xl bg-rose-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-rose-500"
            @click="confirmDeleteBlog">
            Hapus Artikel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";

const tabs = [
  { key: "sections", label: "Landing Sections", icon: "ph:layout" },
  { key: "blog", label: "Blog CMS", icon: "ph:newspaper" },
  { key: "assets", label: "Asset Upload", icon: "ph:image-square" },
];

const activeTab = ref("sections");
const isLoading = ref(false);
const sections = ref([]);
const selectedSection = ref(null);
const sectionForm = ref(null);
const sectionJson = ref("{}");
const sectionError = ref("");
const isSavingSection = ref(false);
const lastUploadedUrl = ref("");
const blogPosts = ref([]);
const isSavingBlog = ref(false);
const blogEditor = ref(null);
const showHtmlPreview = ref(false);
const editorDialogInput = ref(null);
const savedEditorRange = ref(null);
const blogForm = reactive(emptyBlog());
const editorDialog = reactive({
  isOpen: false,
  type: "",
  title: "",
  label: "",
  placeholder: "",
  value: "",
  isUploading: false,
});
const deleteDialog = reactive({
  isOpen: false,
  post: null,
});

const editorTools = [
  { key: "h2", label: "H2", title: "Heading besar" },
  { key: "h3", label: "H3", title: "Subheading" },
  { key: "bold", icon: "ph:text-b-bold", title: "Tebal" },
  { key: "italic", icon: "ph:text-italic", title: "Miring" },
  { key: "underline", icon: "ph:text-underline", title: "Garis bawah" },
  { key: "ul", icon: "ph:list-bullets", title: "Bullet list" },
  { key: "ol", icon: "ph:list-numbers", title: "Numbered list" },
  { key: "quote", icon: "ph:quotes", title: "Quote" },
  { key: "link", icon: "ph:link", title: "Tambah link" },
  { key: "image", icon: "ph:image", title: "Upload dan sisipkan gambar" },
  { key: "clear", icon: "ph:eraser", title: "Hapus format" },
];

function emptyBlog() {
  return {
    id: null,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    author_name: "Bitwize Team",
    category: "",
    tags: "",
    meta_title: "",
    meta_description: "",
    is_published: false,
    is_featured: false,
    sort_order: 0,
    published_at: "",
  };
}

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const loadAll = async () => {
  isLoading.value = true;
  try {
    const [sectionsRes, postsRes] = await Promise.all([
      api.get("/landing-cms/sections", { silentLoading: true }),
      api.get("/landing-cms/blog-posts", { silentLoading: true }),
    ]);
    sections.value = sectionsRes?.data?.sections || [];
    blogPosts.value = postsRes?.data?.posts || [];
    if (!selectedSection.value && sections.value.length) {
      selectSection(sections.value[0]);
    }
  } catch (error) {
    pushToast({ title: "Gagal Memuat CMS", message: error.message || "Data CMS tidak bisa dimuat.", type: "error" });
  } finally {
    isLoading.value = false;
  }
};

const selectSection = (section) => {
  selectedSection.value = section;
  sectionForm.value = {
    key: section.key,
    label: section.label || section.key,
    is_active: section.is_active !== false,
    sort_order: Number(section.sort_order) || 0,
  };
  sectionJson.value = JSON.stringify(section.content || {}, null, 2);
  sectionError.value = "";
};

const formatSectionJson = () => {
  try {
    sectionJson.value = JSON.stringify(JSON.parse(sectionJson.value || "{}"), null, 2);
    sectionError.value = "";
  } catch (error) {
    sectionError.value = "JSON tidak valid: " + error.message;
  }
};

const saveSection = async () => {
  let content;
  try {
    content = JSON.parse(sectionJson.value || "{}");
    sectionError.value = "";
  } catch (error) {
    sectionError.value = "JSON tidak valid: " + error.message;
    return;
  }
  isSavingSection.value = true;
  try {
    await api.put(`/landing-cms/sections/${sectionForm.value.key}`, {
      label: sectionForm.value.label,
      content,
      is_active: sectionForm.value.is_active,
      sort_order: sectionForm.value.sort_order,
    });
    pushToast({ title: "Tersimpan", message: "Section landing berhasil diperbarui.", type: "success" });
    await loadAll();
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan", message: error.message || "Section gagal disimpan.", type: "error" });
  } finally {
    isSavingSection.value = false;
  }
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/landing-cms/upload", formData, { silentLoading: true });
  return response?.data?.url || response?.url || "";
};

const uploadAsset = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    lastUploadedUrl.value = await uploadFile(file);
    pushToast({ title: "Upload Berhasil", message: "Asset sudah diupload ke R2.", type: "success" });
  } catch (error) {
    pushToast({ title: "Upload Gagal", message: error.message || "Asset gagal diupload.", type: "error" });
  }
};

const uploadBlogCover = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    blogForm.cover_image_url = await uploadFile(file);
    pushToast({ title: "Cover Terupload", message: "Cover blog berhasil diupload.", type: "success" });
  } catch (error) {
    pushToast({ title: "Upload Gagal", message: error.message || "Cover gagal diupload.", type: "error" });
  }
};

const insertEditorMedia = (url) => {
  const cleanUrl = String(url || "").trim();
  if (!cleanUrl || !blogEditor.value) return;
  blogEditor.value.focus();
  restoreEditorSelection();
  if (editorDialog.type === "image") {
    document.execCommand("insertImage", false, cleanUrl);
  } else {
    document.execCommand("createLink", false, cleanUrl);
  }
  syncBlogEditor();
  closeEditorDialog();
};

const uploadEditorImage = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  editorDialog.isUploading = true;
  try {
    const url = await uploadFile(file);
    if (!url) throw new Error("URL gambar tidak tersedia dari server.");
    editorDialog.value = url;
    insertEditorMedia(url);
    pushToast({ title: "Gambar Disisipkan", message: "Gambar sudah diupload ke R2 dan masuk ke artikel.", type: "success" });
  } catch (error) {
    pushToast({ title: "Upload Gagal", message: error.message || "Gambar gagal diupload.", type: "error" });
  } finally {
    editorDialog.isUploading = false;
    event.target.value = "";
  }
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    pushToast({ title: "Disalin", message: "URL asset disalin.", type: "success" });
  } catch (error) {
    pushToast({ title: "URL Asset", message: text, type: "info" });
  }
};

const newBlog = () => {
  Object.assign(blogForm, emptyBlog());
  renderBlogEditor();
};

const editBlog = (post) => {
  Object.assign(blogForm, emptyBlog(), {
    ...post,
    published_at: post.published_at ? String(post.published_at).slice(0, 10) : "",
  });
  renderBlogEditor();
};

const saveBlog = async () => {
  syncBlogEditor();
  isSavingBlog.value = true;
  try {
    const payload = { ...blogForm };
    if (payload.id) {
      await api.put(`/landing-cms/blog-posts/${payload.id}`, payload);
    } else {
      await api.post("/landing-cms/blog-posts", payload);
    }
    pushToast({ title: "Tersimpan", message: "Artikel blog berhasil disimpan.", type: "success" });
    newBlog();
    await loadAll();
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan", message: error.message || "Artikel gagal disimpan.", type: "error" });
  } finally {
    isSavingBlog.value = false;
  }
};

const renderBlogEditor = async () => {
  await nextTick();
  if (blogEditor.value && blogEditor.value.innerHTML !== (blogForm.content || "")) {
    blogEditor.value.innerHTML = blogForm.content || "";
  }
};

const syncBlogEditor = () => {
  if (blogEditor.value) {
    blogForm.content = blogEditor.value.innerHTML;
  }
};

const saveEditorSelection = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !blogEditor.value) return;
  const range = selection.getRangeAt(0);
  const node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
    ? range.commonAncestorContainer.parentNode
    : range.commonAncestorContainer;
  if (blogEditor.value.contains(node)) {
    savedEditorRange.value = range.cloneRange();
  }
};

const restoreEditorSelection = () => {
  if (!savedEditorRange.value) return;
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(savedEditorRange.value);
};

const openEditorDialog = async (type) => {
  saveEditorSelection();
  editorDialog.type = type;
  editorDialog.value = "";
  editorDialog.isUploading = false;
  editorDialog.title = type === "image" ? "Sisipkan gambar" : "Sisipkan link";
  editorDialog.label = type === "image" ? "URL gambar dari R2" : "URL link";
  editorDialog.placeholder = type === "image" ? "https://cdn-domain.com/gambar.webp" : "https://domain.com/halaman";
  editorDialog.isOpen = true;
  await nextTick();
  if (type !== "image") editorDialogInput.value?.focus();
};

const closeEditorDialog = () => {
  editorDialog.isOpen = false;
  editorDialog.type = "";
  editorDialog.value = "";
  editorDialog.isUploading = false;
};

const submitEditorDialog = () => {
  insertEditorMedia(editorDialog.value);
};

const runEditorTool = (tool) => {
  if (!blogEditor.value) return;
  blogEditor.value.focus();

  if (tool.key === "h2") {
    document.execCommand("formatBlock", false, "h2");
  } else if (tool.key === "h3") {
    document.execCommand("formatBlock", false, "h3");
  } else if (tool.key === "bold") {
    document.execCommand("bold");
  } else if (tool.key === "italic") {
    document.execCommand("italic");
  } else if (tool.key === "underline") {
    document.execCommand("underline");
  } else if (tool.key === "ul") {
    document.execCommand("insertUnorderedList");
  } else if (tool.key === "ol") {
    document.execCommand("insertOrderedList");
  } else if (tool.key === "quote") {
    document.execCommand("formatBlock", false, "blockquote");
  } else if (tool.key === "link") {
    openEditorDialog("link");
    return;
  } else if (tool.key === "image") {
    openEditorDialog("image");
    return;
  } else if (tool.key === "clear") {
    document.execCommand("removeFormat");
  }

  syncBlogEditor();
};

const toggleHtmlPreview = () => {
  syncBlogEditor();
  showHtmlPreview.value = !showHtmlPreview.value;
};

const deleteBlog = async (post) => {
  deleteDialog.post = post;
  deleteDialog.isOpen = true;
};

const closeDeleteDialog = () => {
  deleteDialog.isOpen = false;
  deleteDialog.post = null;
};

const confirmDeleteBlog = async () => {
  const post = deleteDialog.post;
  if (!post) return;
  try {
    await api.delete(`/landing-cms/blog-posts/${post.id}`);
    pushToast({ title: "Dihapus", message: "Artikel berhasil dihapus.", type: "success" });
    closeDeleteDialog();
    await loadAll();
  } catch (error) {
    pushToast({ title: "Gagal Menghapus", message: error.message || "Artikel gagal dihapus.", type: "error" });
  }
};

onMounted(async () => {
  await loadAll();
  renderBlogEditor();
});
</script>

<style scoped>
.cms-input {
  margin-top: 0.375rem;
  display: block;
  width: 100%;
  border-radius: 0.75rem;
  border: 0;
  background: rgb(248 250 252);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: rgb(15 23 42);
  outline: none;
  box-shadow: inset 0 0 0 1px rgb(226 232 240);
}
.cms-input:focus {
  box-shadow: inset 0 0 0 2px rgb(2 132 199);
}
:global(.dark) .cms-input {
  background: rgb(30 41 59);
  color: white;
  box-shadow: inset 0 0 0 1px rgb(51 65 85);
}
.blog-editor:empty::before {
  content: attr(data-placeholder);
  color: rgb(148 163 184);
  pointer-events: none;
}
.blog-editor :deep(h2) {
  margin: 1.25rem 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.25;
}
.blog-editor :deep(h3) {
  margin: 1rem 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 900;
}
.blog-editor :deep(p) {
  margin: 0.75rem 0;
}
.blog-editor :deep(ul),
.blog-editor :deep(ol) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}
.blog-editor :deep(ul) {
  list-style: disc;
}
.blog-editor :deep(ol) {
  list-style: decimal;
}
.blog-editor :deep(blockquote) {
  margin: 1rem 0;
  border-left: 4px solid rgb(14 165 233);
  background: rgb(240 249 255);
  padding: 0.75rem 1rem;
  color: rgb(51 65 85);
}
.blog-editor :deep(img) {
  margin: 1rem 0;
  max-width: 100%;
  border-radius: 0.75rem;
}
.blog-editor :deep(a) {
  color: rgb(2 132 199);
  font-weight: 700;
  text-decoration: underline;
}
:global(.dark) .blog-editor :deep(blockquote) {
  background: rgba(14, 165, 233, 0.12);
  color: rgb(226 232 240);
}
</style>
