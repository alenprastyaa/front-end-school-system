<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p class="text-xs font-semibold uppercase tracking-[0.15em] text-sky-600 dark:text-sky-300">Asisten Sistem</p>
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
import { getStoredRole } from "@/utils/auth";

const currentRole = getStoredRole();
const assistantConfigByRole = {
  ADMIN: {
    pageTitle: "Chatbot Admin Sekolah",
    description: "Tanyakan alur kerja admin sekolah. Jawaban akan difokuskan ke fitur yang memang tersedia untuk admin.",
    placeholder: "Contoh: Cara tambah siswa baru?",
    intro: "Halo, saya asisten admin sekolah. Saya akan fokus menjelaskan menu dan proses yang memang dapat diakses admin.",
    quickQuestions: [
      "Cara tambah siswa baru bagaimana?",
      "Bagaimana mengatur kelas dan wali kelas?",
      "Bagaimana melihat ringkasan kondisi sekolah?",
      "Cara cek billing sekolah bagaimana?",
    ],
  },
  GURU: {
    pageTitle: "Chatbot Guru",
    description: "Tanyakan alur kerja guru. Jawaban akan difokuskan ke fitur pembelajaran dan penilaian yang memang tersedia untuk guru.",
    placeholder: "Contoh: Cara membuat quiz dari bank soal?",
    intro: "Halo, saya asisten guru. Saya akan fokus menjelaskan menu dan proses yang memang dapat diakses guru.",
    quickQuestions: [
      "Langkah buat jadwal pembelajaran apa saja?",
      "Cara kerja Bank Soal dan Quiz bagaimana?",
      "Bagaimana menilai tugas atau ujian siswa?",
      "Bagaimana memakai Live Chat mapel?",
    ],
  },
};
const assistantConfig = assistantConfigByRole[currentRole] || assistantConfigByRole.GURU;
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

const sendQuestion = async () => {
  const cleanedQuestion = String(question.value || "").trim();
  if (!cleanedQuestion || isLoading.value) {
    return;
  }

  addMessage("user", cleanedQuestion);
  question.value = "";
  isLoading.value = true;

  try {
    const response = await api.post("/learning/system-chatbot", { question: cleanedQuestion });
    const roleHint = response?.data?.role_hint || "";
    const answer = response?.data?.answer || "Maaf, saya belum bisa menjawab pertanyaan itu.";
    const suggestions = Array.isArray(response?.data?.suggestions) ? response.data.suggestions : [];

    const suggestionText =
      suggestions.length > 0
        ? `\n\nAnda juga bisa tanya:\n- ${suggestions.slice(0, 3).join("\n- ")}`
        : "";

    addMessage("bot", `${roleHint}\n\n${answer}${suggestionText}`.trim());
  } catch (error) {
    addMessage("bot", "Maaf, saya belum bisa menjawab sekarang. Silakan coba lagi.");
    pushToast({
      title: "Chatbot Gagal",
      message: error.message || "Terjadi kendala saat mengambil jawaban.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
