<template>
  <div class="h-full min-h-0 overflow-hidden bg-[#d9dbd5] font-sans text-[#111b21] dark:bg-[#0b141a] dark:text-[#e9edef]">
    <main class="mx-auto flex h-full min-h-0 w-full flex-col p-0 lg:p-5">
      <div class="flex-1 min-h-0 overflow-hidden bg-white shadow-sm dark:bg-[#111b21] lg:rounded-md">
        <div class="flex h-full min-h-0 flex-col lg:flex-row">
          <!-- COMBINED SIDEBAR -->
          <aside class="flex min-h-0 w-full flex-col border-r border-[#e9edef] bg-white dark:border-[#222e35] dark:bg-[#111b21] lg:w-[390px] lg:shrink-0" :class="{ hidden: mobileChatOpen, 'lg:flex': true }">
            <header class="flex h-[59px] shrink-0 items-center justify-between bg-[#f0f2f5] px-4 dark:bg-[#202c33]">
              <div class="flex items-center gap-3">
                <button @click="backToDashboard" type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10">
                  <Icon icon="mdi:arrow-left" class="h-5 w-5" />
                </button>
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white">
                  <Icon icon="ph:chats-circle-duotone" class="h-5 w-5 opacity-90" />
                </div>
                <div class="min-w-0">
                  <h2 class="truncate text-base font-semibold text-[#111b21] dark:text-[#e9edef]">Pesan</h2>
                  <p class="truncate text-xs text-[#667781] dark:text-[#8696a0]">Grup Mapel & Chat Pribadi</p>
                </div>
              </div>
              <button type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10" @click="refreshAll">
                <Icon icon="mdi:refresh" class="h-5 w-5" />
              </button>
            </header>
            
            <div class="shrink-0 border-b border-[#e9edef] bg-white px-3 py-2 dark:border-[#222e35] dark:bg-[#111b21]">
              <div class="flex h-9 items-center gap-2 rounded-lg bg-[#f0f2f5] px-3 dark:bg-[#202c33]">
                <Icon icon="mdi:magnify" class="h-5 w-5 shrink-0 text-[#667781] dark:text-[#8696a0]" />
                <input v-model="searchQuery" type="text" placeholder="Cari percakapan..." class="h-full min-w-0 flex-1 bg-transparent text-sm text-[#111b21] outline-none placeholder:text-[#667781] dark:text-[#e9edef] dark:placeholder:text-[#8696a0]" />
                <button v-if="searchQuery.trim()" type="button" class="flex h-7 w-7 items-center justify-center rounded-full text-[#667781] hover:bg-black/5 dark:text-[#8696a0] dark:hover:bg-white/10" @click="searchQuery = ''">
                  <Icon icon="mdi:close" class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div class="min-h-0 flex-1 overflow-y-auto bg-white dark:bg-[#111b21]">
              
              <!-- Live Chat Subjects -->
              <template v-if="filteredSubjects.length > 0">
                <div class="sticky top-0 z-10 bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#667781] backdrop-blur dark:bg-[#111b21]/95 dark:text-[#8696a0]">
                  Grup Mapel (Live Chat)
                </div>
                <button v-for="subject in filteredSubjects" :key="subject.id" @click="selectTab('subject', subject.id)"
                  class="group flex min-h-[72px] w-full items-center gap-3 px-3 text-left transition"
                  :class="activeTab === 'subject' && selectedSubjectId === subject.id ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : learningChatRef?.subjectUnreadCount(subject.id) > 0 ? 'bg-[#f5fbf8] dark:bg-[#15251f]' : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'">
                  <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-white shadow-sm"
                    :class="subject.chat_icon_url ? 'bg-slate-100 dark:bg-slate-800' : learningChatRef?.getSubjectIconClass(subject)">
                    <img v-if="subject.chat_icon_url" :src="subject.chat_icon_url" alt="Ikon grup mapel" class="h-full w-full object-cover" />
                    <Icon v-else :icon="learningChatRef?.getSubjectIcon(subject)" class="h-6 w-6 opacity-95" />
                  </div>
                  <div class="min-w-0 flex-1 border-b border-[#e9edef] py-3 dark:border-[#222e35]">
                    <div class="flex min-w-0 items-center gap-3">
                      <h3 class="min-w-0 flex-1 truncate text-[15px] font-medium text-[#111b21] dark:text-[#e9edef]">{{ subject.name }}</h3>
                      <time class="shrink-0 text-xs" :class="learningChatRef?.subjectUnreadCount(subject.id) > 0 ? 'font-semibold text-[#00a884]' : 'text-[#667781] dark:text-[#8696a0]'">
                        {{ learningChatRef?.formatSubjectTime(subject.id) }}
                      </time>
                    </div>
                    <div class="mt-1 flex min-w-0 items-center gap-2">
                      <p class="min-w-0 flex-1 truncate text-sm" :class="learningChatRef?.subjectUnreadCount(subject.id) > 0 ? 'font-semibold text-[#111b21] dark:text-[#e9edef]' : 'text-[#667781] dark:text-[#8696a0]'">
                        {{ learningChatRef?.latestMessagePreview(subject.id) }}
                      </p>
                      <span v-if="learningChatRef?.subjectUnreadCount(subject.id) > 0" class="inline-flex min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#25d366] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[#111b21]">
                        {{ formatUnreadCount(learningChatRef?.subjectUnreadCount(subject.id)) }}
                      </span>
                    </div>
                  </div>
                </button>
              </template>

              <!-- Private Chat Peers -->
              <template v-if="filteredPeers.length > 0">
                <div class="sticky top-0 z-10 bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#667781] backdrop-blur dark:bg-[#111b21]/95 dark:text-[#8696a0]">
                  Chat Pribadi
                </div>
                <button v-for="peer in filteredPeers" :key="peer.user_id" @click="selectTab('peer', peer.user_id)"
                  class="group flex min-h-[72px] w-full items-center gap-3 px-3 text-left transition"
                  :class="activeTab === 'peer' && selectedPeerId === peer.user_id ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'">
                  <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dfe5e7] text-base font-semibold text-[#54656f] dark:bg-[#2a3942] dark:text-[#d1d7db]">
                    <img v-if="peer.profile_image" :src="normalizePublicUrl(peer.profile_image)" :alt="privateChatRef?.displayPeerName(peer)" class="h-full w-full object-cover" />
                    <span v-else>{{ privateChatRef?.peerInitial(peer) }}</span>
                  </div>
                  <div class="min-w-0 flex-1 border-b border-[#e9edef] py-3 dark:border-[#222e35]">
                    <div class="flex min-w-0 items-center gap-3">
                      <h2 class="min-w-0 flex-1 truncate text-[15px] font-medium text-[#111b21] dark:text-[#e9edef]">{{ privateChatRef?.displayPeerName(peer) }}</h2>
                      <time class="shrink-0 text-xs" :class="peer.unread_count > 0 ? 'font-semibold text-[#00a884]' : 'text-[#667781] dark:text-[#8696a0]'">
                        {{ privateChatRef?.formatPeerTime(peer.last_message_at) }}
                      </time>
                    </div>
                    <div class="mt-1 flex min-w-0 items-center gap-2">
                      <Icon v-if="Number(peer.last_sender_id || 0) === Number(currentUserId) && peer.last_message" icon="mdi:check-all" class="h-4 w-4 shrink-0 text-[#53bdeb]" />
                      <p class="min-w-0 flex-1 truncate text-sm" :class="peer.unread_count > 0 ? 'font-semibold text-[#111b21] dark:text-[#e9edef]' : 'text-[#667781] dark:text-[#8696a0]'">
                        {{ privateChatRef?.latestPeerPreview(peer) }}
                      </p>
                      <span v-if="peer.unread_count > 0" class="inline-flex min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#25d366] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[#111b21]">
                        {{ peer.unread_count > 99 ? "99+" : peer.unread_count }}
                      </span>
                    </div>
                  </div>
                </button>
              </template>
              
              <div v-if="filteredSubjects.length === 0 && filteredPeers.length === 0" class="px-7 py-10 text-center text-sm text-[#667781] dark:text-[#8696a0]">
                {{ searchQuery.trim() ? "Percakapan tidak ditemukan." : "Belum ada percakapan." }}
              </div>
            </div>
          </aside>

          <!-- CONTENT AREA -->
          <section class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden" :class="mobileChatOpen ? 'flex' : 'hidden lg:flex'">
            <LearningChat ref="learningChatRef" v-show="activeTab === 'subject'" :unified-mode="true" :active-subject-id="selectedSubjectId" @back="mobileChatOpen = false" class="w-full flex-1 min-h-0 overflow-hidden" />
            <PrivateChat ref="privateChatRef" v-show="activeTab === 'peer'" :unified-mode="true" :active-peer-id="selectedPeerId" @back="mobileChatOpen = false" class="w-full flex-1 min-h-0 overflow-hidden" />
            
            <div v-show="!activeTab" class="hidden h-full items-center justify-center bg-[#f0f2f5] px-8 dark:bg-[#222e35] lg:flex">
              <div class="max-w-md text-center">
                <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#d9dbd5] dark:bg-[#111b21]">
                  <Icon icon="ph:chat-circle-dots-duotone" class="h-12 w-12 text-[#667781] dark:text-[#8696a0]" />
                </div>
                <h2 class="mt-6 text-2xl font-light text-[#41525d] dark:text-[#d1d7db]">School System Chat</h2>
                <p class="mt-3 text-sm leading-6 text-[#667781] dark:text-[#8696a0]">
                  Pilih grup mapel atau kontak pribadi di sebelah kiri untuk mulai mengirim pesan.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { normalizePublicUrl } from '@/utils/url';
import { getStoredRole } from '@/utils/auth';
import LearningChat from './LearningChat.vue';
import PrivateChat from './PrivateChat.vue';

const router = useRouter();
const role = getStoredRole();

const learningChatRef = ref(null);
const privateChatRef = ref(null);

const searchQuery = ref('');
const mobileChatOpen = ref(false);

const activeTab = ref(null); // 'subject' or 'peer'
const selectedSubjectId = ref(null);
const selectedPeerId = ref(null);

const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Number(payload.id) || null;
  } catch (error) {
    return null;
  }
};
const currentUserId = getCurrentUserId();

const filteredSubjects = computed(() => {
  const allSubjects = learningChatRef.value?.orderedSubjects || [];
  if (!searchQuery.value.trim()) return allSubjects;
  const lowerSearch = searchQuery.value.toLowerCase();
  return allSubjects.filter(s => String(s.name).toLowerCase().includes(lowerSearch));
});

const filteredPeers = computed(() => {
  const allPeers = privateChatRef.value?.visiblePeers || [];
  if (!searchQuery.value.trim()) return allPeers;
  const lowerSearch = searchQuery.value.toLowerCase();
  return allPeers.filter(p => privateChatRef.value?.displayPeerName(p).toLowerCase().includes(lowerSearch));
});

const formatUnreadCount = (val) => val > 99 ? '99+' : String(val);

const backToDashboard = () => {
  router.push('/dashboard');
};

const refreshAll = () => {
  // Trigger re-mount or reload logic if needed
  // Since both components use sidebarStore, refreshing them is complex from here
  // The user can rely on sockets for auto-update
  window.location.reload();
};

const selectTab = (tabType, id) => {
  activeTab.value = tabType;
  if (tabType === 'subject') {
    selectedSubjectId.value = id;
    selectedPeerId.value = null;
  } else {
    selectedPeerId.value = id;
    selectedSubjectId.value = null;
  }
  mobileChatOpen.value = true;
};

onMounted(() => {
  // You can auto select first group if you want, but wait for them to load.
});
</script>
