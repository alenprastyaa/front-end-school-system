<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden bg-[#d9dbd5] text-[#111b21] dark:bg-[#0b141a] dark:text-[#e9edef]">
    <header class="flex shrink-0 items-center justify-between gap-3 border-b border-[#e9edef] bg-white px-4 py-3 dark:border-[#222e35] dark:bg-[#111b21]">
      <div class="flex min-w-0 items-center gap-3">
        <button
          type="button"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
          aria-label="Kembali ke dashboard"
          title="Kembali"
          @click="backToDashboard"
        >
          <Icon icon="mdi:arrow-left" class="h-5 w-5" />
        </button>
        <div class="min-w-0">
          <h1 class="truncate text-base font-semibold">Pesan</h1>
          <p class="truncate text-xs text-[#667781] dark:text-[#8696a0]">
            {{ canUseSubjectChat ? "Grup Mapel dan Chat Pribadi" : "Chat Pribadi" }}
          </p>
        </div>
      </div>
      <div class="flex items-center rounded-full bg-[#f0f2f5] p-1 dark:bg-[#202c33]">
        <button
          v-if="canUseSubjectChat"
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full transition"
          :class="activeTab === 'subject' ? 'bg-white text-[#111b21] shadow-sm dark:bg-[#111b21] dark:text-[#e9edef]' : 'text-[#667781] hover:text-[#111b21] dark:text-[#8696a0] dark:hover:text-[#e9edef]'"
          :title="'Grup Mapel'"
          aria-label="Grup Mapel"
          @click="showTab('subject')"
        >
          <Icon icon="ph:chat-circle-dots-duotone" class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full transition"
          :class="activeTab === 'peer' ? 'bg-white text-[#111b21] shadow-sm dark:bg-[#111b21] dark:text-[#e9edef]' : 'text-[#667781] hover:text-[#111b21] dark:text-[#8696a0] dark:hover:text-[#e9edef]'"
          :title="'Chat Pribadi'"
          aria-label="Chat Pribadi"
          @click="showTab('peer')"
        >
          <Icon icon="ph:users-three-duotone" class="h-4 w-4" />
        </button>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-hidden">
      <LearningChat v-if="canUseSubjectChat && activeTab === 'subject'" ref="learningChatRef" class="h-full min-h-0" />
      <PrivateChat v-else ref="privateChatRef" class="h-full min-h-0" />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import LearningChat from "./LearningChat.vue";
import PrivateChat from "./PrivateChat.vue";
import { getStoredRole } from "@/utils/auth";

const route = useRoute();
const router = useRouter();
const role = String(getStoredRole() || "").toUpperCase();
const canUseSubjectChat = computed(() => ["GURU", "SISWA"].includes(role));

const learningChatRef = ref(null);
const privateChatRef = ref(null);
const activeTab = ref(canUseSubjectChat.value ? "subject" : "peer");

const requestedSubjectId = computed(() => Number(route.query?.subject || 0));
const requestedPeerId = computed(() => Number(route.query?.user || 0));

const unwrapList = (source) => {
  if (Array.isArray(source)) {
    return source;
  }
  if (Array.isArray(source?.value)) {
    return source.value;
  }
  return [];
};

const clearRouteQuery = async () => {
  if (route.query?.subject || route.query?.user) {
    await router.replace({ path: "/chat", query: {} });
  }
};

const backToDashboard = () => {
  router.push("/dashboard");
};

const showTab = async (tab) => {
  activeTab.value = tab === "subject" && canUseSubjectChat.value ? "subject" : "peer";
  await clearRouteQuery();
};

const applyRouteSelection = async () => {
  if (requestedPeerId.value) {
    activeTab.value = "peer";
    await nextTick();
    const chat = privateChatRef.value;
    const peerList = unwrapList(chat?.peers).length ? unwrapList(chat?.peers) : unwrapList(chat?.visiblePeers);
    const peer = peerList.find((item) => Number(item.user_id) === requestedPeerId.value);
    if (peer && typeof chat?.selectPeer === "function") {
      await chat.selectPeer(peer);
    }
    return;
  }

  if (requestedSubjectId.value) {
    if (!canUseSubjectChat.value) {
      activeTab.value = "peer";
      await clearRouteQuery();
      return;
    }

    activeTab.value = "subject";
    await nextTick();
    const chat = learningChatRef.value;
    const subjectList = unwrapList(chat?.subjects).length ? unwrapList(chat?.subjects) : unwrapList(chat?.orderedSubjects);
    const subject = subjectList.find((item) => Number(item.id) === requestedSubjectId.value);
    if (subject && typeof chat?.selectSubject === "function") {
      await chat.selectSubject(subject);
    }
  }
};

onMounted(async () => {
  await applyRouteSelection();
});

watch(
  () => [route.query?.subject, route.query?.user],
  async () => {
    await applyRouteSelection();
  },
);

watch(
  () => unwrapList(learningChatRef.value?.subjects).length + unwrapList(learningChatRef.value?.orderedSubjects).length,
  async () => {
    if (canUseSubjectChat.value && requestedSubjectId.value) {
      await applyRouteSelection();
    }
  },
);

watch(
  () => unwrapList(privateChatRef.value?.peers).length + unwrapList(privateChatRef.value?.visiblePeers).length,
  async () => {
    if (requestedPeerId.value) {
      await applyRouteSelection();
    }
  },
);
</script>
