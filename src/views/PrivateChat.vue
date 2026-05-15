<template>
  <div class="h-full min-h-0 overflow-hidden bg-[#d9dbd5] text-[#111b21] dark:bg-[#0b141a] dark:text-[#e9edef]">
    <main class="mx-auto flex h-full min-h-0 w-full flex-col p-0 lg:p-5">
      <div class="min-h-0 flex-1 overflow-hidden bg-white shadow-sm dark:bg-[#111b21] lg:rounded-md">
        <div class="grid h-full min-h-0 lg:grid-cols-[390px_minmax(0,1fr)]">
          <aside
            class="flex min-h-0 flex-col border-r border-[#e9edef] bg-white dark:border-[#222e35] dark:bg-[#111b21]"
            :class="{ hidden: mobileChatOpen, 'lg:flex': true }">
            <header class="flex h-[59px] shrink-0 items-center justify-between bg-[#f0f2f5] px-4 dark:bg-[#202c33]">
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#00a884] text-sm font-bold text-white">
                  <Icon icon="ph:chat-circle-dots-fill" class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                  <h1 class="truncate text-base font-semibold text-[#111b21] dark:text-[#e9edef]">Chat Pribadi</h1>
                  <p class="truncate text-xs text-[#667781] dark:text-[#8696a0]">Warga sekolah</p>
                </div>
              </div>
              <button type="button"
                class="flex h-10 w-10 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                @click="refreshSummary(true)">
                <Icon icon="mdi:refresh" class="h-5 w-5" />
              </button>
            </header>

            <div class="shrink-0 border-b border-[#e9edef] bg-white px-3 py-2 dark:border-[#222e35] dark:bg-[#111b21]">
              <div class="flex h-9 items-center gap-2 rounded-lg bg-[#f0f2f5] px-3 dark:bg-[#202c33]">
                <Icon icon="mdi:magnify" class="h-5 w-5 shrink-0 text-[#667781] dark:text-[#8696a0]" />
                <input v-model="search" type="text" placeholder="Cari atau mulai chat baru"
                  class="h-full min-w-0 flex-1 bg-transparent text-sm text-[#111b21] outline-none placeholder:text-[#667781] dark:text-[#e9edef] dark:placeholder:text-[#8696a0]" />
                <button v-if="search.trim()" type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-full text-[#667781] hover:bg-black/5 dark:text-[#8696a0] dark:hover:bg-white/10"
                  @click="clearSearch">
                  <Icon icon="mdi:close" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto bg-white dark:bg-[#111b21]">
              <div v-if="isSearchingContacts" class="px-5 py-6 text-center text-sm text-[#667781] dark:text-[#8696a0]">
                Mencari kontak...
              </div>

              <button v-for="peer in visiblePeers" :key="peer.user_id" type="button" @click="selectPeer(peer)"
                class="group flex min-h-[72px] w-full items-center gap-3 px-3 text-left transition"
                :class="selectedPeer?.user_id === peer.user_id
                  ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
                  : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'">
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dfe5e7] text-base font-semibold text-[#54656f] dark:bg-[#2a3942] dark:text-[#d1d7db]">
                  <img v-if="peer.profile_image" :src="normalizePublicUrl(peer.profile_image)" :alt="displayPeerName(peer)"
                    class="h-full w-full object-cover" />
                  <span v-else>{{ peerInitial(peer) }}</span>
                </div>
                <div class="min-w-0 flex-1 border-b border-[#e9edef] py-3 dark:border-[#222e35]">
                  <div class="flex min-w-0 items-center gap-3">
                    <h2 class="min-w-0 flex-1 truncate text-[15px] font-medium text-[#111b21] dark:text-[#e9edef]">
                      {{ displayPeerName(peer) }}
                    </h2>
                    <time class="shrink-0 text-xs"
                      :class="peer.unread_count > 0 ? 'font-semibold text-[#00a884]' : 'text-[#667781] dark:text-[#8696a0]'">
                      {{ formatPeerTime(peer.last_message_at) }}
                    </time>
                  </div>
                  <div class="mt-1 flex min-w-0 items-center gap-2">
                    <Icon v-if="Number(peer.last_sender_id || 0) === Number(currentUserId) && peer.last_message"
                      icon="mdi:check-all" class="h-4 w-4 shrink-0 text-[#53bdeb]" />
                    <p class="min-w-0 flex-1 truncate text-sm"
                      :class="peer.unread_count > 0 ? 'font-semibold text-[#111b21] dark:text-[#e9edef]' : 'text-[#667781] dark:text-[#8696a0]'">
                      {{ latestPeerPreview(peer) }}
                    </p>
                    <span v-if="peer.unread_count > 0"
                      class="inline-flex min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#25d366] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[#111b21]">
                      {{ peer.unread_count > 99 ? "99+" : peer.unread_count }}
                    </span>
                  </div>
                </div>
              </button>

              <div v-if="!isSearchingContacts && visiblePeers.length === 0"
                class="px-7 py-10 text-center text-sm text-[#667781] dark:text-[#8696a0]">
                {{ search.trim() ? "Kontak tidak ditemukan." : "Belum ada riwayat chat. Cari nama untuk mulai percakapan." }}
              </div>
            </div>
          </aside>

          <section class="flex min-h-0 h-full flex-col overflow-hidden bg-[#efeae2] private-chat-wallpaper dark:bg-[#0b141a]"
            :class="{ hidden: !mobileChatOpen, 'lg:flex': true }">
            <template v-if="selectedPeer">
              <header class="z-10 flex h-[59px] shrink-0 items-center gap-3 bg-[#f0f2f5] px-3 dark:bg-[#202c33]">
                <button type="button"
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10 lg:hidden"
                  @click="backToPeerList">
                  <Icon icon="mdi:arrow-left" class="h-6 w-6" />
                </button>
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dfe5e7] text-sm font-semibold text-[#54656f] dark:bg-[#2a3942] dark:text-[#d1d7db]">
                  <img v-if="selectedPeer.profile_image" :src="normalizePublicUrl(selectedPeer.profile_image)"
                    :alt="displayPeerName(selectedPeer)" class="h-full w-full object-cover" />
                  <span v-else>{{ peerInitial(selectedPeer) }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <h2 class="truncate text-[15px] font-medium text-[#111b21] dark:text-[#e9edef]">
                    {{ displayPeerName(selectedPeer) }}
                  </h2>
                  <p class="truncate text-xs text-[#667781] dark:text-[#8696a0]">
                    {{ peerMeta(selectedPeer) }}
                  </p>
                </div>
                <button type="button"
                  class="flex h-10 w-10 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10">
                  <Icon icon="mdi:dots-vertical" class="h-5 w-5" />
                </button>
              </header>

              <div ref="messageListRef" class="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-14">
                <div v-if="isLoadingMessages" class="flex min-h-full items-center justify-center">
                  <div
                    class="rounded-lg bg-white/80 px-4 py-2 text-sm text-[#667781] shadow-sm dark:bg-[#202c33]/90 dark:text-[#8696a0]">
                    Memuat pesan...
                  </div>
                </div>

                <div v-else-if="renderedMessages.length === 0" class="flex min-h-full items-center justify-center">
                  <div
                    class="max-w-sm rounded-lg bg-[#fffef7]/95 px-5 py-4 text-center text-sm text-[#667781] shadow-sm dark:bg-[#202c33]/95 dark:text-[#d1d7db]">
                    Belum ada pesan. Mulai percakapan dengan {{ displayPeerName(selectedPeer) }}.
                  </div>
                </div>

                <div v-else class="space-y-1">
                  <template v-for="entry in renderedMessages" :key="entry.key">
                    <div v-if="entry.type === 'date'" class="sticky top-2 z-[1] flex justify-center py-2">
                      <span
                        class="rounded-lg bg-[#e1f3fb] px-3 py-1 text-xs text-[#54656f] shadow-sm dark:bg-[#182229] dark:text-[#8696a0]">
                        {{ entry.label }}
                      </span>
                    </div>

                    <div v-else class="flex" :class="isOwnMessage(entry.message) ? 'justify-end' : 'justify-start'">
                      <article class="message-bubble relative px-2.5 py-1.5 text-sm leading-5 shadow-sm"
                        :class="isOwnMessage(entry.message)
                          ? 'own bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef]'
                          : 'other bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef]'">
                        <p v-if="entry.message.message" class="whitespace-pre-wrap break-words pr-12">{{ entry.message.message }}</p>
                        <div v-if="entry.message.attachment_url" class="mt-2">
                          <audio v-if="isVoiceMessage(entry.message)" :src="normalizePublicUrl(entry.message.attachment_url)" controls
                            class="w-full max-w-sm" />
                          <button v-else-if="isRenderableImageMessage(entry.message)" type="button"
                            class="block w-full overflow-hidden rounded-md text-left" @click="openImagePreview(entry.message)">
                            <img :src="normalizePublicUrl(entry.message.attachment_url)"
                              :alt="entry.message.attachment_name || 'Lampiran gambar'" class="max-h-72 w-full object-cover" />
                          </button>
                          <a v-else :href="normalizePublicUrl(entry.message.attachment_url)" target="_blank" rel="noreferrer"
                            class="flex items-center gap-3 rounded-md bg-black/5 px-3 py-2 text-sm font-semibold hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15">
                            <Icon :icon="entry.message.message_type === 'PDF' ? 'ph:file-pdf' : 'ph:paperclip'" class="h-5 w-5 shrink-0" />
                            <span class="truncate">{{ entry.message.attachment_name || "Buka file" }}</span>
                          </a>
                        </div>
                        <div class="-mb-0.5 mt-0.5 flex justify-end gap-1 pl-8 text-[11px] leading-none"
                          :class="isOwnMessage(entry.message) ? 'text-[#667781] dark:text-[#aebac1]' : 'text-[#667781] dark:text-[#8696a0]'">
                          <time>{{ formatMessageTime(entry.message.created_at) }}</time>
                          <Icon v-if="isOwnMessage(entry.message)" :icon="ownReadIcon(entry.message)"
                            class="h-4 w-4" :class="ownReadIconClass(entry.message)" />
                        </div>
                      </article>
                    </div>
                  </template>
                </div>
              </div>

              <form @submit.prevent="sendMessage"
                class="shrink-0 bg-[#f0f2f5] px-3 py-2 dark:bg-[#202c33] md:px-4">
                <div v-if="attachmentPreviewName || recordedVoiceUrl || isRecordingVoice"
                  class="mb-2 rounded-lg bg-white px-4 py-3 text-sm shadow-sm dark:bg-[#2a3942]">
                  <div v-if="recordedVoiceUrl" class="flex items-center justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="font-semibold text-[#111b21] dark:text-[#e9edef]">Voice note siap dikirim</p>
                      <audio :src="recordedVoiceUrl" controls class="mt-2 w-full" />
                    </div>
                    <button type="button" class="text-[#667781] hover:text-[#111b21] dark:text-[#aebac1]"
                      @click="clearAttachment">
                      <Icon icon="mdi:close" class="h-5 w-5" />
                    </button>
                  </div>
                  <div v-else-if="isRecordingVoice" class="flex items-center justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="font-semibold text-[#111b21] dark:text-[#e9edef]">Sedang merekam voice note...</p>
                      <p class="mt-1 text-[#667781] dark:text-[#8696a0]">{{ recordingDurationLabel }}</p>
                    </div>
                    <button type="button" class="rounded-full bg-rose-500 p-2 text-white hover:bg-rose-400"
                      @click="stopVoiceRecording">
                      <Icon icon="ph:stop-fill" class="h-4 w-4" />
                    </button>
                  </div>
                  <div v-else class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-semibold text-[#111b21] dark:text-[#e9edef]">Lampiran siap dikirim</p>
                      <p class="truncate text-[#667781] dark:text-[#8696a0]">{{ attachmentPreviewName }}</p>
                    </div>
                    <button type="button" class="text-[#667781] hover:text-[#111b21] dark:text-[#aebac1]"
                      @click="clearAttachment">
                      <Icon icon="mdi:close" class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div class="flex min-h-[44px] items-end gap-2">
                  <div class="relative mb-1">
                    <button type="button"
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                      @click="toggleEmojiPanel">
                      <Icon icon="mdi:emoticon-outline" class="h-6 w-6" />
                    </button>
                    <div v-if="emojiPanelOpen"
                      class="absolute bottom-12 left-0 z-30 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Emoji</p>
                      <div class="grid grid-cols-8 gap-1">
                        <button v-for="emoji in chatEmojis" :key="emoji" type="button"
                          class="rounded-lg p-1 text-xl transition hover:bg-slate-100 dark:hover:bg-slate-800"
                          @click="insertEmoji(emoji)">
                          {{ emoji }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="button"
                    class="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                    :disabled="isSendingMessage || isRecordingVoice" @click="openAttachmentPicker">
                    <Icon icon="mdi:paperclip" class="h-6 w-6" />
                  </button>
                  <div class="mb-1 flex min-h-10 flex-1 items-center rounded-lg bg-white px-3 dark:bg-[#2a3942]">
                    <textarea v-model="composer" rows="1" placeholder="Ketik pesan" @input="resizeComposer"
                      @keydown="handleComposerKeydown"
                      class="block max-h-28 min-h-[24px] w-full resize-none overflow-y-auto border-0 bg-transparent py-2 text-[15px] leading-6 text-[#111b21] outline-none placeholder:text-[#667781] dark:text-[#e9edef] dark:placeholder:text-[#8696a0]" />
                  </div>
                  <button v-if="!composer.trim() && !attachmentFile" type="button" :disabled="isSendingMessage"
                    class="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition text-[#54656f] hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                    :class="isRecordingVoice ? 'bg-rose-500 text-white hover:bg-rose-400 dark:text-white' : ''"
                    @click="toggleVoiceRecording">
                    <Icon :icon="isRecordingVoice ? 'ph:stop-fill' : 'mdi:microphone'" class="h-5 w-5" />
                  </button>
                  <button v-else type="submit" :disabled="isSendingMessage"
                    class="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white transition hover:bg-[#008f72] disabled:opacity-50">
                    <Icon icon="mdi:send" class="h-5 w-5" />
                  </button>
                </div>
              </form>
              <input ref="attachmentInputRef" type="file" class="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,audio/*"
                @change="handleAttachmentChange" />
            </template>

            <div v-else class="hidden h-full min-h-[560px] items-center justify-center bg-[#f0f2f5] px-8 dark:bg-[#222e35] lg:flex">
              <div class="max-w-md text-center">
                <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#d9dbd5] dark:bg-[#111b21]">
                  <Icon icon="ph:chat-circle-dots-duotone" class="h-12 w-12 text-[#667781] dark:text-[#8696a0]" />
                </div>
                <h2 class="mt-6 text-2xl font-light text-[#41525d] dark:text-[#d1d7db]">Chat Pribadi</h2>
                <p class="mt-3 text-sm leading-6 text-[#667781] dark:text-[#8696a0]">
                  Pilih percakapan di sebelah kiri atau cari kontak sekolah untuk mulai mengirim pesan.
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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { convertHeicToJpegIfPossible } from "@/utils/fileImage";
import { normalizePublicUrl } from "@/utils/url";
import { useRealtimeStore } from "@/store/realtime";
import { useSidebar } from "@/store/sidebar";

const route = useRoute();
const realtimeStore = useRealtimeStore();
const sidebarStore = useSidebar();
const { privateChatSummaryItems } = storeToRefs(sidebarStore);

const search = ref("");
const peers = ref([]);
const searchedPeers = ref([]);
const selectedPeer = ref(null);
const messages = ref([]);
const composer = ref("");
const isLoadingMessages = ref(false);
const isSendingMessage = ref(false);
const isSearchingContacts = ref(false);
const mobileChatOpen = ref(false);
const messageListRef = ref(null);
const attachmentInputRef = ref(null);
const attachmentFile = ref(null);
const attachmentPreviewName = ref("");
const recordedVoiceUrl = ref("");
const isRecordingVoice = ref(false);
const recordingSeconds = ref(0);
const recordingTimer = ref(null);
const mediaRecorder = ref(null);
const mediaStream = ref(null);
const recordedChunks = ref([]);
const emojiPanelOpen = ref(false);
const realtimeUnsubscribers = ref([]);
const localClientId = ref(`private-chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
const searchDebounceTimer = ref(null);
const chatEmojis = ["😀", "😂", "😍", "🙏", "👍", "🔥", "🎉", "😊", "😢", "😎", "🤔", "👏", "💯", "📚", "✅", "❤️"];
const AUDIO_MIME_EXTENSION_MAP = {
  "audio/webm": ".webm",
  "audio/mp4": ".m4a",
  "audio/x-m4a": ".m4a",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/x-wav": ".wav",
  "audio/wave": ".wav",
  "audio/ogg": ".ogg",
  "audio/ogg; codecs=opus": ".ogg",
  "audio/aac": ".aac",
  "audio/flac": ".flac",
  "audio/amr": ".amr",
  "audio/3gpp": ".3gp",
  "audio/3gpp2": ".3g2",
  "audio/mp4a-latm": ".m4a",
};

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
const visiblePeers = computed(() => (search.value.trim() ? searchedPeers.value : peers.value));

const isSameDay = (left, right) =>
  left.getFullYear() === right.getFullYear()
  && left.getMonth() === right.getMonth()
  && left.getDate() === right.getDate();

const displayPeerName = (peer) => String(peer?.full_name || peer?.username || "Pengguna");
const peerInitial = (peer) => displayPeerName(peer).trim().charAt(0).toUpperCase() || "?";
const peerMeta = (peer) => [peer?.role, peer?.class_name].filter(Boolean).join(" • ") || "Warga sekolah";

const formatMessageTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const formatPeerTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) {
    return formatMessageTime(date);
  }
  if (isSameDay(date, yesterday)) {
    return "Kemarin";
  }
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "2-digit" });
};

const formatDateSeparator = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Hari ini";
  if (isSameDay(date, yesterday)) return "Kemarin";
  return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

const latestPeerPreview = (peer) => {
  const preview = String(peer?.last_message || "").trim();
  if (preview) {
    if (Number(peer?.last_sender_id || 0) === Number(currentUserId)) {
      return `Anda: ${preview}`;
    }
    return preview;
  }
  return search.value.trim() ? "Mulai chat pribadi" : "Belum ada pesan";
};

const isOwnMessage = (message) => Number(message?.sender_id || 0) === Number(currentUserId);

const ownReadLabel = (message) => {
  const currentPeer = peers.value.find((item) => Number(item.user_id) === Number(selectedPeer.value?.user_id || 0));
  const lastReadMessageId = Number(currentPeer?.last_read_message_id || 0);
  return Number(message?.id || 0) <= lastReadMessageId ? "Sudah dibaca" : "Terkirim";
};

const ownReadIcon = (message) => (ownReadLabel(message) === "Sudah dibaca" ? "mdi:check-all" : "mdi:check");
const ownReadIconClass = (message) => (ownReadLabel(message) === "Sudah dibaca" ? "text-[#53bdeb]" : "");
const recordingDurationLabel = computed(() => {
  const minutes = Math.floor(recordingSeconds.value / 60);
  const seconds = recordingSeconds.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const renderedMessages = computed(() => {
  const entries = [];
  let lastDateKey = "";

  messages.value.forEach((message) => {
    const date = new Date(message?.created_at || Date.now());
    const dateKey = Number.isNaN(date.getTime()) ? "unknown" : date.toISOString().slice(0, 10);
    if (dateKey !== lastDateKey) {
      entries.push({
        key: `date-${dateKey}`,
        type: "date",
        label: formatDateSeparator(message?.created_at || Date.now()),
      });
      lastDateKey = dateKey;
    }
    entries.push({
      key: `message-${message.id}`,
      type: "message",
      message,
    });
  });

  return entries;
});

const sortPeers = (items = []) =>
  [...items].sort((left, right) => {
    const leftTime = left?.last_message_at ? new Date(left.last_message_at).getTime() : 0;
    const rightTime = right?.last_message_at ? new Date(right.last_message_at).getTime() : 0;
    if (leftTime !== rightTime) return rightTime - leftTime;
    return displayPeerName(left).localeCompare(displayPeerName(right), "id");
  });

const syncPeersFromStore = () => {
  peers.value = sortPeers(privateChatSummaryItems.value || []);
  if (!selectedPeer.value) return;
  const nextSelected = peers.value.find((item) => Number(item.user_id) === Number(selectedPeer.value.user_id));
  if (nextSelected) {
    selectedPeer.value = nextSelected;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

const isVoiceMessage = (message) => {
  const explicitType = String(message?.message_type || "").toUpperCase();
  if (explicitType === "VOICE") return true;
  const mimeType = String(message?.attachment_mime_type || "").toLowerCase();
  if (mimeType.startsWith("audio/")) return true;
  const attachmentName = String(message?.attachment_name || "").toLowerCase();
  return /\.(mp3|wav|m4a|ogg|aac|webm|flac|amr|3gp|3g2)$/i.test(attachmentName);
};

const isRenderableImageMessage = (message) => {
  if (String(message?.message_type || "").toUpperCase() !== "IMAGE") {
    return false;
  }

  const mimeType = String(message?.attachment_mime_type || "").toLowerCase();
  const attachmentName = String(message?.attachment_name || "").toLowerCase();

  if (mimeType.includes("heic") || mimeType.includes("heif")) {
    return false;
  }

  if (/\.(heic|heif)$/i.test(attachmentName)) {
    return false;
  }

  return true;
};

const openImagePreview = (message) => {
  const url = normalizePublicUrl(message?.attachment_url);
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

const refreshSummary = async (force = false) => {
  await sidebarStore.refreshPrivateChatSummary({ force });
  syncPeersFromStore();
};

const clearSearch = () => {
  search.value = "";
  searchedPeers.value = [];
  isSearchingContacts.value = false;
};

const toggleEmojiPanel = () => {
  emojiPanelOpen.value = !emojiPanelOpen.value;
};

const insertEmoji = (emoji) => {
  composer.value = `${composer.value || ""}${emoji}`;
  emojiPanelOpen.value = false;
};

const searchContacts = async (keyword) => {
  const cleanedKeyword = String(keyword || "").trim();
  if (!cleanedKeyword) {
    clearSearch();
    return;
  }

  isSearchingContacts.value = true;
  try {
    const response = await api.get("/private-chat/contacts", {
      params: {
        keyword: cleanedKeyword,
        limit: 20,
      },
    });
    searchedPeers.value = sortPeers(Array.isArray(response?.data) ? response.data : []);
  } catch (error) {
    searchedPeers.value = [];
    pushToast({
      title: "Pencarian Gagal",
      message: error.message || "Kontak tidak berhasil dicari.",
      type: "error",
    });
  } finally {
    isSearchingContacts.value = false;
  }
};

const loadMessages = async (peerUserId) => {
  if (!peerUserId) {
    messages.value = [];
    return;
  }

  isLoadingMessages.value = true;
  try {
    const response = await api.get(`/private-chat/${peerUserId}/messages`);
    messages.value = Array.isArray(response?.data) ? response.data : [];
    await scrollToBottom();
    await markAsRead(peerUserId);
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Chat",
      message: error.message || "Percakapan pribadi tidak berhasil dimuat.",
      type: "error",
    });
  } finally {
    isLoadingMessages.value = false;
  }
};

const selectPeer = async (peer) => {
  selectedPeer.value = peer;
  mobileChatOpen.value = true;
  await loadMessages(peer.user_id);
};

const markAsRead = async (peerUserId) => {
  const normalizedPeerUserId = Number(peerUserId || 0);
  if (!normalizedPeerUserId) return;

  try {
    await api.post(`/private-chat/${normalizedPeerUserId}/read`, {
      client_id: localClientId.value,
    });
    sidebarStore.clearPendingPrivateChatUnreadByUser(normalizedPeerUserId);
    await refreshSummary(true);
  } catch (error) {
    // Keep reading smooth even if the read receipt update fails.
  }
};

const sendMessage = async () => {
  if (!selectedPeer.value || (!composer.value.trim() && !attachmentFile.value) || isSendingMessage.value) return;

  isSendingMessage.value = true;
  const messageText = composer.value.trim();
  try {
    let payload = {
      message: messageText,
      client_id: localClientId.value,
    };
    if (attachmentFile.value) {
      const formData = new FormData();
      formData.append("message", messageText);
      formData.append("client_id", localClientId.value);
      formData.append("attachment", attachmentFile.value);
      formData.append("attachment_name", attachmentFile.value.name || "");
      formData.append("attachment_mime_type", attachmentFile.value.type || "");
      formData.append("attachment_size", String(Number(attachmentFile.value.size) || 0));
      if (String(attachmentFile.value.type || "").toLowerCase().startsWith("audio/")) {
        formData.append("message_type", "VOICE");
      }
      payload = formData;
    }
    const response = await api.post(`/private-chat/${selectedPeer.value.user_id}/messages`, payload);
    composer.value = "";
    emojiPanelOpen.value = false;
    clearAttachment();
    if (response?.data) {
      messages.value = [...messages.value, response.data];
      await scrollToBottom();
    }
    await refreshSummary(true);
  } catch (error) {
    pushToast({
      title: "Pesan Gagal Dikirim",
      message: error.message || "Pesan pribadi tidak berhasil dikirim.",
      type: "error",
    });
  } finally {
    isSendingMessage.value = false;
  }
};

const resizeComposer = (event) => {
  const target = event?.target;
  if (!target) return;
  target.style.height = "auto";
  target.style.height = `${Math.min(target.scrollHeight, 112)}px`;
};

const revokeRecordedVoiceUrl = () => {
  if (recordedVoiceUrl.value) {
    URL.revokeObjectURL(recordedVoiceUrl.value);
    recordedVoiceUrl.value = "";
  }
};

const cleanupMediaStream = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }
};

const clearAttachment = () => {
  attachmentFile.value = null;
  attachmentPreviewName.value = "";
  revokeRecordedVoiceUrl();
  cleanupMediaStream();
  recordedChunks.value = [];
  recordingSeconds.value = 0;
  if (recordingTimer.value) {
    window.clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
    mediaRecorder.value.stop();
  }
  mediaRecorder.value = null;
  isRecordingVoice.value = false;
};

const openAttachmentPicker = () => {
  emojiPanelOpen.value = false;
  attachmentInputRef.value?.click();
};

const handleAttachmentChange = async (event) => {
  const rawFile = event.target.files?.[0] || null;
  event.target.value = "";
  if (!rawFile) return;
  clearAttachment();
  try {
    const file = await convertHeicToJpegIfPossible(rawFile);
    attachmentFile.value = file;
    attachmentPreviewName.value = file.name;
  } catch (error) {
    attachmentFile.value = rawFile;
    attachmentPreviewName.value = rawFile.name;
  }
};

const stopVoiceRecording = async () => {
  if (!isRecordingVoice.value) return;
  if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
    mediaRecorder.value.stop();
  }
};

const toggleVoiceRecording = async () => {
  if (isRecordingVoice.value) {
    await stopVoiceRecording();
    return;
  }

  try {
    clearAttachment();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStream.value = stream;
    const supportedMimeTypes = Object.keys(AUDIO_MIME_EXTENSION_MAP).filter((mimeType) => {
      try {
        return typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mimeType);
      } catch (error) {
        return false;
      }
    });
    const selectedMimeType = supportedMimeTypes[0] || "";
    const recorder = selectedMimeType ? new MediaRecorder(stream, { mimeType: selectedMimeType }) : new MediaRecorder(stream);
    recordedChunks.value = [];
    recordingSeconds.value = 0;
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.value.push(event.data);
      }
    };
    recorder.onstop = () => {
      isRecordingVoice.value = false;
      if (recordingTimer.value) {
        window.clearInterval(recordingTimer.value);
        recordingTimer.value = null;
      }
      cleanupMediaStream();
      if (recordedChunks.value.length === 0) {
        mediaRecorder.value = null;
        return;
      }
      const mimeType = recorder.mimeType || selectedMimeType || "audio/webm";
      const extension = AUDIO_MIME_EXTENSION_MAP[mimeType] || ".webm";
      const blob = new Blob(recordedChunks.value, { type: mimeType });
      revokeRecordedVoiceUrl();
      recordedVoiceUrl.value = URL.createObjectURL(blob);
      attachmentFile.value = new File([blob], `voice-note-${Date.now()}${extension}`, { type: mimeType });
      attachmentPreviewName.value = attachmentFile.value.name;
      recordedChunks.value = [];
      mediaRecorder.value = null;
    };
    mediaRecorder.value = recorder;
    recorder.start();
    isRecordingVoice.value = true;
    recordingTimer.value = window.setInterval(() => {
      recordingSeconds.value += 1;
    }, 1000);
  } catch (error) {
    pushToast({
      title: "Mikrofon Tidak Aktif",
      message: "Izin mikrofon dibutuhkan untuk merekam voice note.",
      type: "error",
    });
    cleanupMediaStream();
    isRecordingVoice.value = false;
  }
};

const handleComposerKeydown = (event) => {
  if (event.key !== "Enter" || event.shiftKey) return;
  event.preventDefault();
  sendMessage();
};

const backToPeerList = () => {
  mobileChatOpen.value = false;
  emojiPanelOpen.value = false;
};

const bindRealtime = () => {
  const token = localStorage.getItem("token");
  realtimeStore.connect(token);

  realtimeUnsubscribers.value = [
    realtimeStore.on("private-chat:new-message", async (payload) => {
      const senderId = Number(payload?.sender_id || 0);
      const recipientId = Number(payload?.recipient_id || 0);
      const activePeerId = Number(selectedPeer.value?.user_id || 0);
      const peerId = senderId === Number(currentUserId) ? recipientId : senderId;

      if (senderId === Number(currentUserId)) return;

      await refreshSummary(true);

      if (activePeerId && peerId === activePeerId) {
        messages.value = [...messages.value, payload];
        await scrollToBottom();
        await markAsRead(activePeerId);
      }
    }),
    realtimeStore.on("private-chat:read-updated", async (payload) => {
      if (String(payload?.origin_client_id || "") === localClientId.value) {
        await refreshSummary(true);
        return;
      }

      const activePeerId = Number(selectedPeer.value?.user_id || 0);
      if (Number(payload?.user_id || 0) === activePeerId) {
        await refreshSummary(true);
      }
    }),
  ];
};

onMounted(async () => {
  await refreshSummary(true);

  const requestedPeerId = Number(route.query?.user || 0);
  if (requestedPeerId) {
    const peer = peers.value.find((item) => Number(item.user_id) === requestedPeerId);
    if (peer) {
      await selectPeer(peer);
    }
  }

  bindRealtime();
});

onUnmounted(() => {
  clearAttachment();
  if (searchDebounceTimer.value) {
    window.clearTimeout(searchDebounceTimer.value);
  }
  realtimeUnsubscribers.value.forEach((unsubscribe) => {
    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  });
  realtimeUnsubscribers.value = [];
});

watch(privateChatSummaryItems, () => {
  syncPeersFromStore();
});

watch(search, (value) => {
  if (searchDebounceTimer.value) {
    window.clearTimeout(searchDebounceTimer.value);
  }

  const cleanedValue = String(value || "").trim();
  if (!cleanedValue) {
    searchedPeers.value = [];
    isSearchingContacts.value = false;
    return;
  }

  searchDebounceTimer.value = window.setTimeout(() => {
    searchContacts(cleanedValue);
  }, 280);
});

watch(
  () => route.query?.user,
  async (value) => {
    const requestedPeerId = Number(value || 0);
    if (!requestedPeerId || !peers.value.length) return;
    if (Number(selectedPeer.value?.user_id || 0) === requestedPeerId) return;
    const peer = peers.value.find((item) => Number(item.user_id) === requestedPeerId);
    if (peer) {
      await selectPeer(peer);
    }
  },
);
</script>

<style scoped>
.private-chat-wallpaper {
  background-color: #efeae2;
  background-image:
    linear-gradient(rgba(239, 234, 226, 0.88), rgba(239, 234, 226, 0.88)),
    radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.05) 0 1px, transparent 1.5px),
    radial-gradient(circle at 70% 60%, rgba(0, 0, 0, 0.05) 0 1px, transparent 1.5px);
  background-size: auto, 34px 34px, 42px 42px;
}

:global(.dark) .private-chat-wallpaper {
  background-color: #0b141a;
  background-image:
    linear-gradient(rgba(11, 20, 26, 0.9), rgba(11, 20, 26, 0.9)),
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0 1px, transparent 1.5px),
    radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.05) 0 1px, transparent 1.5px);
}

.message-bubble {
  max-width: min(76%, 640px);
  border-radius: 7.5px;
}

.message-bubble.own {
  border-top-right-radius: 2px;
}

.message-bubble.other {
  border-top-left-radius: 2px;
}

.message-bubble.own::after,
.message-bubble.other::after {
  content: "";
  position: absolute;
  top: 0;
  width: 0;
  height: 0;
  border-top: 8px solid currentColor;
}

.message-bubble.own::after {
  right: -7px;
  color: #d9fdd3;
  border-right: 8px solid transparent;
}

.message-bubble.other::after {
  left: -7px;
  color: #ffffff;
  border-left: 8px solid transparent;
}

:global(.dark) .message-bubble.own::after {
  color: #005c4b;
}

:global(.dark) .message-bubble.other::after {
  color: #202c33;
}

@media (max-width: 767px) {
  .message-bubble {
    max-width: 86%;
  }
}
</style>
