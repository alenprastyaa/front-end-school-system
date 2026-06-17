<template>
  <div class="min-h-screen bg-[#f6f9fc] font-sans text-[#1d2b3a]">
    <header class="sticky top-0 z-40 border-b border-[#dce8f3] bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <router-link to="/" class="flex items-center gap-3">
          <img src="/logob.png" alt="Bitwize" class="h-12 w-12 rounded-2xl object-contain" />
          <span>
            <span class="block text-base font-extrabold text-[#123a62]">Bitwize</span>
            <span class="block text-xs font-bold text-[#526577]">Blog</span>
          </span>
        </router-link>
        <nav class="hidden items-center gap-1 md:flex">
          <a href="#artikel" class="rounded-lg px-3 py-2 text-sm font-bold text-[#29465f] transition hover:bg-[#eef6ff] hover:text-[#1267a8]">Artikel</a>
          <a href="#kategori" class="rounded-lg px-3 py-2 text-sm font-bold text-[#29465f] transition hover:bg-[#eef6ff] hover:text-[#1267a8]">Kategori</a>
          <router-link to="/" class="rounded-lg px-3 py-2 text-sm font-bold text-[#29465f] transition hover:bg-[#eef6ff] hover:text-[#1267a8]">Produk</router-link>
        </nav>
        <div class="flex items-center gap-2">
          <router-link to="/" class="hidden rounded-lg px-3 py-2 text-sm font-extrabold text-[#123a62] transition hover:bg-[#eef6ff] sm:inline-flex">
            Landing
          </router-link>
          <router-link to="/auth/login" class="rounded-xl bg-[#f8bd24] px-4 py-2 text-sm font-extrabold text-[#15324b]">
            Login
          </router-link>
        </div>
      </div>
    </header>

    <main>
      <section class="bg-white">
        <div class="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <p class="text-sm font-extrabold uppercase tracking-wide text-[#1267a8]">Blog</p>
          <h1 class="mt-3 max-w-3xl text-4xl font-extrabold text-[#123a62] md:text-5xl">
            Insight untuk sekolah digital yang lebih rapi.
          </h1>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-[#526577]">
            Artikel praktis seputar LMS, absensi, pembayaran, penerimaan siswa baru, dan operasional sekolah.
          </p>
        </div>
      </section>

      <section id="kategori" class="border-y border-[#dce8f3] bg-[#f8fbff]">
        <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-4 lg:px-8">
          <button v-for="category in categories" :key="category" type="button" @click="selectedCategory = category"
            class="whitespace-nowrap rounded-full border px-4 py-2 text-sm font-extrabold transition"
            :class="selectedCategory === category ? 'border-[#1267a8] bg-[#1267a8] text-white' : 'border-[#dce8f3] bg-white text-[#29465f] hover:border-[#b7d8f4]'">
            {{ category }}
          </button>
        </div>
      </section>

      <section id="artikel" class="border-b border-[#dce8f3]">
        <div class="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div v-if="isLoading" class="grid gap-5 md:grid-cols-3">
            <div v-for="n in 6" :key="n" class="h-80 rounded-xl border border-[#e0e9f2] bg-white"></div>
          </div>
          <div v-else class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article v-for="post in filteredPosts" :key="post.id"
              class="overflow-hidden rounded-xl border border-[#e0e9f2] bg-white shadow-sm transition hover:border-[#b7d8f4] hover:shadow-md">
              <router-link :to="`/blog/${post.slug}`">
                <img v-if="post.cover_image_url" :src="normalizePublicUrl(post.cover_image_url)" :alt="post.title"
                  class="h-52 w-full object-cover" />
                <div v-else class="flex h-52 items-center justify-center bg-[#eef6ff] text-4xl text-[#1267a8]">
                  <Icon icon="ph:newspaper" />
                </div>
              </router-link>
              <div class="p-5">
                <p class="text-xs font-extrabold uppercase tracking-wide text-[#1267a8]">{{ post.category || "Artikel" }}</p>
                <router-link :to="`/blog/${post.slug}`">
                  <h2 class="mt-2 line-clamp-2 text-xl font-extrabold text-[#123a62]">{{ post.title }}</h2>
                </router-link>
                <p class="mt-2 line-clamp-3 text-sm leading-6 text-[#526577]">{{ post.excerpt }}</p>
                <div class="mt-4 flex items-center justify-between text-xs font-bold text-[#6d7f90]">
                  <span>{{ post.author_name || "Bitwize Team" }}</span>
                  <span>{{ formatDate(post.published_at || post.created_at) }}</span>
                </div>
              </div>
            </article>
          </div>
          <p v-if="!isLoading && !posts.length" class="rounded-xl border border-[#e0e9f2] bg-white p-10 text-center text-sm font-bold text-[#6d7f90]">
            Belum ada artikel yang dipublish.
          </p>
          <p v-else-if="!isLoading && !filteredPosts.length" class="rounded-xl border border-[#e0e9f2] bg-white p-10 text-center text-sm font-bold text-[#6d7f90]">
            Belum ada artikel pada kategori ini.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { normalizePublicUrl } from "@/utils/url";

const posts = ref([]);
const isLoading = ref(true);
const selectedCategory = ref("Semua");

const categories = computed(() => {
  const set = new Set(posts.value.map((post) => post.category).filter(Boolean));
  return ["Semua", ...Array.from(set)];
});

const filteredPosts = computed(() => {
  if (selectedCategory.value === "Semua") return posts.value;
  return posts.value.filter((post) => post.category === selectedCategory.value);
});

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const loadPosts = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/blog/posts", { silentLoading: true, suppressAuthRedirect: true });
    posts.value = response?.data?.posts || [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadPosts);
</script>
