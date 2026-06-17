<template>
  <div class="min-h-screen bg-[#f6f9fc] font-sans text-[#1d2b3a]">
    <header class="sticky top-0 z-40 border-b border-[#dce8f3] bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <router-link to="/blog" class="flex items-center gap-3 text-sm font-extrabold text-[#123a62]">
          <Icon icon="ph:arrow-left" />
          Semua Artikel
        </router-link>
        <div class="flex items-center gap-3">
          <router-link to="/" class="text-sm font-extrabold text-[#29465f] hover:text-[#1267a8]">Produk</router-link>
          <router-link to="/auth/login" class="rounded-xl bg-[#f8bd24] px-4 py-2 text-sm font-extrabold text-[#15324b]">
            Login
          </router-link>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <article v-if="post" class="overflow-hidden rounded-2xl border border-[#dce8f3] bg-white shadow-sm">
        <img v-if="post.cover_image_url" :src="normalizePublicUrl(post.cover_image_url)" :alt="post.title"
          class="h-72 w-full object-cover md:h-96" />
        <div class="p-6 md:p-10">
          <p class="text-xs font-extrabold uppercase tracking-wide text-[#1267a8]">{{ post.category || "Artikel" }}</p>
          <h1 class="mt-3 text-3xl font-extrabold leading-tight text-[#123a62] md:text-5xl">{{ post.title }}</h1>
          <p class="mt-4 text-base leading-8 text-[#526577]">{{ post.excerpt }}</p>
          <div class="mt-5 flex flex-wrap gap-3 text-xs font-bold text-[#6d7f90]">
            <span>{{ post.author_name || "Bitwize Team" }}</span>
            <span>•</span>
            <span>{{ formatDate(post.published_at || post.created_at) }}</span>
          </div>
          <div class="prose-content mt-8 text-base leading-8 text-[#29465f]" v-html="safeContent"></div>
        </div>
      </article>
      <div v-else-if="!isLoading" class="rounded-2xl border border-[#dce8f3] bg-white p-10 text-center">
        <h1 class="text-2xl font-extrabold text-[#123a62]">Artikel tidak ditemukan</h1>
        <router-link to="/blog" class="mt-4 inline-flex rounded-xl bg-[#f8bd24] px-4 py-2 text-sm font-extrabold text-[#15324b]">
          Lihat Blog
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { normalizePublicUrl } from "@/utils/url";
import { sanitizeBlogHtml } from "@/utils/html";

const route = useRoute();
const post = ref(null);
const isLoading = ref(true);
const safeContent = computed(() => sanitizeBlogHtml(post.value?.content || ""));

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const loadPost = async () => {
  isLoading.value = true;
  try {
    const response = await api.get(`/blog/posts/${route.params.slug}`, { silentLoading: true, suppressAuthRedirect: true });
    post.value = response?.data?.post || null;
  } catch (error) {
    post.value = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadPost);
</script>

<style scoped>
.prose-content :deep(h2) {
  margin: 2rem 0 0.75rem;
  font-size: 1.85rem;
  font-weight: 900;
  line-height: 1.25;
  color: #123a62;
}
.prose-content :deep(h3) {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.35rem;
  font-weight: 900;
  color: #123a62;
}
.prose-content :deep(p) {
  margin: 1rem 0;
}
.prose-content :deep(ul),
.prose-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}
.prose-content :deep(ul) {
  list-style: disc;
}
.prose-content :deep(ol) {
  list-style: decimal;
}
.prose-content :deep(blockquote) {
  margin: 1.5rem 0;
  border-left: 4px solid #1267a8;
  background: #eef6ff;
  padding: 1rem 1.25rem;
  font-weight: 700;
  color: #123a62;
}
.prose-content :deep(img) {
  margin: 1.5rem 0;
  max-width: 100%;
  border-radius: 1rem;
}
.prose-content :deep(a) {
  color: #1267a8;
  font-weight: 800;
  text-decoration: underline;
}
</style>
