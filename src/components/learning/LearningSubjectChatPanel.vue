<template>
  <section
    class="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px]"
  >
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div
        class="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/40 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Live Chat Mapel</h3>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Diskusi realtime per mata pelajaran tanpa perlu refresh halaman.
          </p>
        </div>
        <div class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" :class="connectionClass">
          <span class="h-2.5 w-2.5 rounded-full" :class="isConnected ? 'bg-emerald-500' : 'bg-amber-500'"></span>
          {{ isConnected ? "Tersambung realtime" : "Menghubungkan..." }}
        </div>
      </div>

      <div
        ref="messageListRef"
        class="max-h-[560px] min-h-[420px] space-y-4 overflow-y-auto bg-slate-50/40 px-5 py-5 dark:bg-slate-950/30"
      >
        <div v-if="isLoadingMessages" class="flex h-[360px] items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400">
          Memuat percakapan...
        </div>

        <div v-else-if="messages.length === 0" class="flex h-[360px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 px-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <div class="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
            <svg class="h-8 w-8 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76l.904-.903a2.25 2.25 0 013.182 0l.904.903m0 0l2.69 2.69a2.25 2.25 0 003.182 0l5.44-5.439a2.25 2.25 0 013.182 0l.904.903M7.5 15.75h9" />
            </svg>
          </div>
          <p class="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Belum ada percakapan.</p>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Mulai diskusi dengan guru atau siswa pada mapel ini.</p>
        </div>

        <div
          v-for="item in messages"
          :key="item.id"
          class="flex"
          :class="item.sender_id === currentUserId ? 'justify-end' : 'justify-start'"
        >
          <article
            class="max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ring-1 ring-inset"
            :class="item.sender_id === currentUserId ? ownMessageClass : 'bg-white text-slate-800 ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800'"
          >
            <div class="flex items-center gap-2 text-xs font-semibold">
              <span>{{ item.sender_name || "Pengguna" }}</span>
              <span class="rounded-full px-2 py-0.5" :class="roleBadgeClass(item.sender_role)">
                {{ roleLabel(item.sender_role) }}
              </span>
            </div>
            <p class="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
              {{ item.message }}
            </p>
            <p class="mt-2 text-[11px] opacity-75">
              {{ formatDateTime(item.created_at) }}
            </p>
          </article>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="border-t border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-3 md:flex-row md:items-end">
          <div class="flex-1">
            <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tulis pesan</label>
            <textarea
              v-model="composer"
              rows="3"
              placeholder="Ketik pesan untuk diskusi mapel ini..."
              @keydown="handleComposerKeydown"
              class="block w-full rounded-2xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:bg-white focus:ring-2 focus:ring-inset dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              :class="focusClass"
            />
          </div>
          <button
            :disabled="isSendingMessage || !composer.trim()"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            :class="sendButtonClass"
          >
            <svg v-if="isSendingMessage" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            {{ isSendingMessage ? "Mengirim..." : "Kirim Pesan" }}
          </button>
        </div>
      </form>
    </div>

    <aside class="space-y-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Aturan Diskusi</h4>
        <ul class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <li>Gunakan chat khusus untuk pertanyaan terkait materi mapel ini.</li>
          <li>Tulis pertanyaan singkat dan jelas agar mudah ditanggapi.</li>
          <li>Hindari spam atau pengiriman pesan berulang.</li>
        </ul>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Room</h4>
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500 dark:text-slate-400">Mapel aktif</dt>
            <dd class="font-semibold text-slate-900 dark:text-white">{{ subject?.name || "-" }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500 dark:text-slate-400">Total pesan</dt>
            <dd class="font-semibold text-slate-900 dark:text-white">{{ messages.length }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500 dark:text-slate-400">Status</dt>
            <dd class="font-semibold" :class="isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
              {{ isConnected ? "Realtime aktif" : "Menunggu koneksi" }}
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { io } from "socket.io-client";
import { api, realtimeConfig } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDateTime } from "@/utils/date";

const props = defineProps({
  subject: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: "student",
  },
});

const messages = ref([]);
const composer = ref("");
const chatError = ref("");
const isConnected = ref(false);
const isLoadingMessages = ref(false);
const isSendingMessage = ref(false);
const messageListRef = ref(null);
const socket = ref(null);

const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    return Number(payload.id) || null;
  } catch (error) {
    return null;
  }
};

const currentUserId = getCurrentUserId();
const focusClass = computed(() =>
  props.mode === "teacher"
    ? "focus:ring-sky-600 dark:focus:ring-cyan-500"
    : "focus:ring-emerald-600 dark:focus:ring-emerald-500",
);

const sendButtonClass = computed(() =>
  props.mode === "teacher"
    ? "bg-sky-600 hover:bg-sky-500 dark:bg-cyan-600 dark:hover:bg-cyan-500"
    : "bg-emerald-600 hover:bg-emerald-500",
);

const ownMessageClass = computed(() =>
  props.mode === "teacher"
    ? "bg-sky-600 text-white ring-sky-600 dark:bg-cyan-600 dark:ring-cyan-600"
    : "bg-emerald-600 text-white ring-emerald-600 dark:bg-emerald-600 dark:ring-emerald-600",
);

const connectionClass = computed(() =>
  isConnected.value
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20"
    : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
);

const roleLabel = (role) => {
  if (role === "GURU") {
    return "Guru";
  }

  if (role === "SISWA") {
    return "Siswa";
  }

  return role || "User";
};

const roleBadgeClass = (role) => {
  if (role === "GURU") {
    return "bg-sky-100 text-sky-700 dark:bg-cyan-500/10 dark:text-cyan-300";
  }

  if (role === "SISWA") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

const upsertMessage = async (chatMessage) => {
  if (!chatMessage || Number(chatMessage.subject_id) !== Number(props.subject?.id)) {
    return;
  }

  const currentIndex = messages.value.findIndex((item) => Number(item.id) === Number(chatMessage.id));
  if (currentIndex >= 0) {
    messages.value.splice(currentIndex, 1, chatMessage);
  } else {
    messages.value.push(chatMessage);
  }

  messages.value.sort((left, right) => {
    if (left.created_at === right.created_at) {
      return Number(left.id) - Number(right.id);
    }

    return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
  });

  await scrollToBottom();
};

const loadMessages = async () => {
  if (!props.subject?.id) {
    messages.value = [];
    return;
  }

  isLoadingMessages.value = true;
  chatError.value = "";

  try {
    const response = await api.get(`/learning/subjects/${props.subject.id}/chat`, {
      params: { limit: 120 },
    });
    messages.value = response?.data || [];
    await scrollToBottom();
  } catch (error) {
    chatError.value = error.message;
    messages.value = [];
  } finally {
    isLoadingMessages.value = false;
  }
};

const leaveSubjectRoom = (subjectId) => {
  if (socket.value?.connected && subjectId) {
    socket.value.emit("learning-chat:leave", subjectId);
  }
};

const joinCurrentSubjectRoom = () => {
  if (socket.value?.connected && props.subject?.id) {
    socket.value.emit("learning-chat:join", props.subject.id);
  }
};

const handleComposerKeydown = (event) => {
  if (event.key !== "Enter" || event.shiftKey) {
    return;
  }

  event.preventDefault();

  if (isSendingMessage.value || !composer.value.trim()) {
    return;
  }

  sendMessage();
};

const sendMessage = async () => {
  if (!props.subject?.id || !composer.value.trim()) {
    return;
  }

  isSendingMessage.value = true;
  chatError.value = "";

  try {
    const response = await api.post(`/learning/subjects/${props.subject.id}/chat`, {
      message: composer.value.trim(),
    });
    composer.value = "";

    if (response?.data) {
      await upsertMessage(response.data);
    }
  } catch (error) {
    chatError.value = error.message;
  } finally {
    isSendingMessage.value = false;
  }
};

onMounted(() => {
  const token = localStorage.getItem("token");
  socket.value = io(realtimeConfig.url, {
    auth: {
      token,
    },
    path: realtimeConfig.path,
    transports: ["websocket", "polling"],
  });

  socket.value.on("connect", () => {
    isConnected.value = true;
    joinCurrentSubjectRoom();
  });

  socket.value.on("disconnect", () => {
    isConnected.value = false;
  });

  socket.value.on("learning-chat:error", (message) => {
    chatError.value = String(message || "Gagal menghubungkan chat realtime");
  });

  socket.value.on("learning-chat:new-message", async (chatMessage) => {
    await upsertMessage(chatMessage);
  });
});

watch(
  () => props.subject?.id,
  async (nextSubjectId, previousSubjectId) => {
    chatError.value = "";
    composer.value = "";
    leaveSubjectRoom(previousSubjectId);
    await loadMessages();
    joinCurrentSubjectRoom();
  },
  { immediate: true },
);

onUnmounted(() => {
  leaveSubjectRoom(props.subject?.id);
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
  }
});

watch(chatError, (value) => {
  if (!value) return;
  pushToast({ title: "Live Chat Gagal", message: value, type: "error" });
});
</script>
