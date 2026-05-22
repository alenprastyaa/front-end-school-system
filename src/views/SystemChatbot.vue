<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p class="text-xs font-semibold uppercase tracking-[0.15em] text-sky-600 dark:text-sky-300">Chat AI Qwen</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{{ assistantConfig.pageTitle }}</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {{ assistantConfig.description }}
      </p>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="item in quickQuestions"
          :key="item"
          type="button"
          class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          @click="useQuickQuestion(item)"
        >
          {{ item }}
        </button>
      </div>

      <div class="space-y-3">
        <article
          v-for="msg in messages"
          :key="msg.id"
          class="max-w-3xl rounded-2xl px-4 py-3 text-sm leading-relaxed"
          :class="
            msg.role === 'user'
              ? 'ml-auto bg-sky-600 text-white'
              : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
          "
        >
          <p class="whitespace-pre-wrap">{{ msg.text }}</p>
        </article>
      </div>

      <form class="mt-4 flex flex-col gap-3 md:flex-row" @submit.prevent="sendQuestion">
        <input
          v-model="question"
          type="text"
          :placeholder="assistantConfig.placeholder"
          class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500 transition focus:ring dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="submit"
          :disabled="isLoading"
          class="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-60"
        >
          {{ isLoading ? "Menjawab..." : "Tanya" }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";

const assistantConfig = {
  pageTitle: "Chat AI Qwen",
  description: "Tanyakan apa saja. AI ini menjawab pertanyaan global secara langsung dengan model Qwen.",
  placeholder: "Tulis pertanyaan apa saja...",
  intro: "Halo, saya Qwen. Tanyakan apa saja dan saya akan menjawab langsung dengan bahasa yang jelas.",
  quickQuestions: [
    "Jelaskan topik ini dengan sederhana",
    "Buatkan ide tulisan",
    "Ringkas menjadi 3 poin",
    "Beri contoh praktis",
  ],
};
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

const addMessage = (role, text) => {
  messages.value.push({
    id: messageCounter++,
    role,
    text: String(text || "").trim(),
  });
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
  if (!cleanedQuestion || isLoading.value) {
    return;
  }

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
    pushToast({
      title: "Chat AI Gagal",
      message: error.message || "Terjadi kendala saat mengambil jawaban.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
