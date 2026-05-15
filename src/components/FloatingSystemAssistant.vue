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
          <p class="text-xs font-semibold uppercase tracking-[0.12em] text-sky-600 dark:text-sky-300">Asisten Sistem</p>
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
const currentRole = getStoredRole();
const assistantConfigByRole = {
  ADMIN: {
    buttonLabel: "Asisten Admin",
    title: "Pembantu Admin Sekolah",
    placeholder: "Tanya pengelolaan data sekolah...",
    intro: "Halo, saya asisten admin sekolah. Saya bantu jelaskan fitur yang memang bisa diakses admin, seperti user sekolah, kelas, siswa, kurikulum, billing, dan pengaturan.",
    quickQuestions: [
      "Cara tambah siswa baru?",
      "Cara atur kelas dan wali kelas?",
      "Bagaimana melihat tagihan sekolah?",
    ],
  },
  GURU: {
    buttonLabel: "Asisten Guru",
    title: "Pembantu Guru",
    placeholder: "Tanya pembelajaran, nilai, atau live chat...",
    intro: "Halo, saya asisten guru. Saya bantu jelaskan fitur yang memang bisa diakses guru, seperti pembelajaran, bank soal, quiz, ujian, penilaian, dan live chat.",
    quickQuestions: [
      "Cara buat jadwal pembelajaran?",
      "Bagaimana alur Bank Soal ke Quiz?",
      "Cara menilai tugas atau ujian siswa?",
    ],
  },
};
const assistantConfig = assistantConfigByRole[currentRole] || assistantConfigByRole.GURU;
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
    && ["ADMIN", "GURU"].includes(role)
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

const sendQuestion = async () => {
  const cleanedQuestion = String(question.value || "").trim();
  if (!cleanedQuestion || isLoading.value) return;

  addMessage("user", cleanedQuestion);
  question.value = "";
  isLoading.value = true;
  try {
    const response = await api.post("/learning/system-chatbot", { question: cleanedQuestion });
    const answer = response?.data?.answer || "Maaf, saya belum bisa menjawab sekarang.";
    addMessage("bot", answer);
  } catch (error) {
    addMessage("bot", "Maaf, ada kendala saat menjawab. Silakan coba lagi.");
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
