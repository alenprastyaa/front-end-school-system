<template>
  <div v-if="isAllowed">
    <button
      v-if="!open"
      type="button"
      class="fixed bottom-5 right-5 z-[115] inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-sky-500"
      @click="open = true"
    >
      <Icon icon="ph:robot" class="h-5 w-5" />
      {{ assistantConfig.buttonLabel }}
    </button>

    <div
      v-else
      class="fixed bottom-5 right-5 z-[115] flex h-[72vh] w-[calc(100vw-24px)] max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.12em] text-sky-600 dark:text-sky-300">Chat AI Qwen</p>
          <p class="text-sm font-bold text-slate-900 dark:text-white">{{ assistantConfig.title }}</p>
        </div>
        <button
          type="button"
          class="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          @click="open = false"
        >
          <Icon icon="mdi:close" class="h-5 w-5" />
        </button>
      </div>

      <div class="flex-1 space-y-2 overflow-y-auto bg-slate-50 px-3 py-3 dark:bg-slate-950">
        <article
          v-for="msg in messages"
          :key="msg.id"
          class="max-w-[90%] rounded-2xl px-3 py-2 text-sm"
          :class="msg.role === 'user' ? 'ml-auto bg-sky-600 text-white' : 'bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100'"
        >
          <p class="whitespace-pre-wrap">{{ msg.text }}</p>
        </article>
      </div>

      <div class="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
        <div class="mb-2 flex flex-wrap gap-1.5">
          <button
            v-for="item in quickQuestions"
            :key="item"
            type="button"
            class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            @click="useQuickQuestion(item)"
          >
            {{ item }}
          </button>
        </div>
        <form class="flex items-center gap-2" @submit.prevent="sendQuestion">
          <input
            v-model="question"
            type="text"
            :placeholder="assistantConfig.placeholder"
            class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none ring-sky-500 focus:ring dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          />
          <button
            type="submit"
            :disabled="isLoading"
            class="rounded-xl bg-sky-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60"
          >
            {{ isLoading ? "..." : "Kirim" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import { api } from "@/api";
import { isAuthenticated, getStoredRole } from "@/utils/auth";

const route = useRoute();
const assistantConfig = {
  buttonLabel: "Asisten AI",
  title: "Qwen",
  placeholder: "Tulis pertanyaan apa saja...",
  intro: "Halo, saya Qwen. Tanyakan apa saja dan saya akan menjawab langsung dengan bahasa yang jelas.",
  quickQuestions: [
    "Jelaskan topik ini dengan sederhana",
    "Buatkan ide tulisan",
    "Beri contoh praktis",
  ],
};
const allowedRoles = new Set(["SUPER_ADMIN", "ADMIN", "GURU", "SISWA", "SARPRAS", "KOPERASI"]);
const open = ref(false);
const viewportWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1280);
const question = ref("");
const isLoading = ref(false);
const messages = ref([
  {
    id: 1,
    role: "bot",
    text: assistantConfig.intro,
  },
]);
const quickQuestions = ref(assistantConfig.quickQuestions);
let messageCounter = 2;

const hiddenRouteNames = new Set(["Login", "Register", "PublicLanding", "PublicStudentRegistration"]);
const chatRouteNames = new Set(["PrivateChat", "LearningChatTeacher", "LearningChatStudent"]);
const isMobileViewport = computed(() => viewportWidth.value < 1024);
const shouldHideOnMobileChat = computed(() =>
  isMobileViewport.value && chatRouteNames.has(String(route.name || "")),
);
const isAllowed = computed(() => {
  const role = getStoredRole();
  return isAuthenticated()
    && allowedRoles.has(role)
    && !hiddenRouteNames.has(route.name)
    && !shouldHideOnMobileChat.value;
});

const addMessage = (role, text) => {
  const cleaned = String(text || "").trim();
  if (!cleaned) return;
  messages.value.push({ id: messageCounter++, role, text: cleaned });
};

const useQuickQuestion = (text) => {
  question.value = text;
  sendQuestion();
};

const buildHistoryPayload = () => messages.value
  .slice(-12)
  .map((msg) => ({
    role: msg.role === "bot" ? "assistant" : "user",
    content: msg.text,
  }));

const sendQuestion = async () => {
  const cleanedQuestion = String(question.value || "").trim();
  if (!cleanedQuestion || isLoading.value) return;

  const history = buildHistoryPayload();
  addMessage("user", cleanedQuestion);
  question.value = "";
  isLoading.value = true;
  try {
    const response = await api.post("/ai/chat", { question: cleanedQuestion, history });
    const answer = response?.data?.answer || "AI Qwen belum mengembalikan jawaban. Coba kirim ulang pertanyaan.";
    addMessage("bot", answer);
  } catch (error) {
    addMessage("bot", error.message || "AI Qwen sedang tidak tersambung. Coba lagi beberapa saat.");
  } finally {
    isLoading.value = false;
  }
};

const syncViewportWidth = () => {
  if (typeof window === "undefined") return;
  viewportWidth.value = window.innerWidth;
};

watch(shouldHideOnMobileChat, (hidden) => {
  if (hidden) {
    open.value = false;
  }
});

onMounted(() => {
  if (typeof window === "undefined") return;
  window.addEventListener("resize", syncViewportWidth, { passive: true });
});

onUnmounted(() => {
  if (typeof window === "undefined") return;
  window.removeEventListener("resize", syncViewportWidth);
});
</script>
