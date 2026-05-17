<template>
  <div
    class="h-full min-h-0 overflow-hidden bg-[#d9dbd5] font-sans text-[#111b21] dark:bg-[#0b141a] dark:text-[#e9edef]">
    <main class="mx-auto flex h-full min-h-0 w-full flex-col p-0 lg:p-5">
      <div
        class="flex-1 min-h-0 overflow-hidden bg-white shadow-sm dark:bg-[#111b21] lg:rounded-md">
        <div class="grid h-full min-h-0 lg:grid-cols-[390px_minmax(0,1fr)]">
          <aside
            class="flex min-h-0 flex-col border-r border-[#e9edef] bg-white dark:border-[#222e35] dark:bg-[#111b21]"
            :class="{ hidden: mobileChatOpen, 'lg:flex': true }">
            <header class="flex h-[59px] shrink-0 items-center justify-between bg-[#f0f2f5] px-4 dark:bg-[#202c33]">
              <div class="flex min-w-0 items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a884] text-white shadow-sm">
                  <Icon icon="ph:chats-circle-duotone" class="h-5 w-5 opacity-90" />
                </div>
                <div class="min-w-0">
                  <h2 class="truncate text-base font-semibold text-[#111b21] dark:text-[#e9edef]">Grup Mapel</h2>
                  <p class="truncate text-xs text-[#667781] dark:text-[#8696a0]">{{ isConnected ? "Tersambung" : "Menghubungkan..." }}</p>
                </div>
              </div>
              <button type="button"
                class="flex h-10 w-10 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                @click="isMobileViewport ? goBack() : loadSubjects()">
                <Icon :icon="isMobileViewport ? 'mdi:arrow-left' : 'mdi:refresh'" class="h-5 w-5" />
              </button>
            </header>

            <div class="min-h-0 flex-1 overflow-y-auto bg-white dark:bg-[#111b21]">
              <button v-for="subject in orderedSubjects" :key="subject.id" @click="selectSubject(subject)"
                class="group flex min-h-[72px] w-full items-center gap-3 px-3 text-left transition"
                :class="selectedSubject?.id === subject.id
                  ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
                  : subjectUnreadCount(subject.id) > 0
                    ? 'bg-[#f5fbf8] dark:bg-[#15251f]'
                    : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'">
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-white shadow-sm"
                  :class="subject.chat_icon_url ? 'bg-slate-100 dark:bg-slate-800' : getSubjectIconClass(subject)">
                  <img v-if="subject.chat_icon_url" :src="subject.chat_icon_url" alt="Ikon grup mapel"
                    class="h-full w-full object-cover" />
                  <Icon v-else :icon="getSubjectIcon(subject)" class="h-6 w-6 opacity-95" />
                </div>
                <div class="min-w-0 flex-1 border-b border-[#e9edef] py-3 dark:border-[#222e35]">
                  <div class="flex min-w-0 items-center gap-3">
                    <h3 class="min-w-0 flex-1 truncate text-[15px] font-medium text-[#111b21] dark:text-[#e9edef]">
                      {{ subject.name }}
                    </h3>
                    <time class="shrink-0 text-xs"
                      :class="subjectUnreadCount(subject.id) > 0 ? 'font-semibold text-[#00a884]' : 'text-[#667781] dark:text-[#8696a0]'">
                      {{ formatSubjectTime(subject.id) }}
                    </time>
                  </div>
                  <p class="mt-1 truncate text-xs text-[#667781] dark:text-[#8696a0]">
                    {{ subject.class_name || `Guru: ${subject.teacher_name || '-'}` }}
                  </p>
                  <div class="mt-1 flex min-w-0 items-center gap-2">
                    <p class="min-w-0 flex-1 truncate text-sm"
                      :class="subjectUnreadCount(subject.id) > 0 ? 'font-semibold text-[#111b21] dark:text-[#e9edef]' : 'text-[#667781] dark:text-[#8696a0]'">
                      {{ latestMessagePreview(subject.id) }}
                    </p>
                    <span v-if="subjectUnreadCount(subject.id) > 0"
                      class="inline-flex min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#25d366] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[#111b21]">
                      {{ formatUnreadCount(subjectUnreadCount(subject.id)) }}
                    </span>
                  </div>
                </div>
              </button>

              <div v-if="subjects.length === 0"
                class="px-7 py-10 text-center text-sm text-[#667781] dark:text-[#8696a0]">
                Belum ada grup mata pelajaran yang tersedia.
              </div>
            </div>
          </aside>

          <section class="flex min-h-0 h-full flex-col overflow-hidden bg-[#efeae2] learning-chat-wallpaper dark:bg-[#0b141a]"
            :class="{ hidden: !mobileChatOpen, 'lg:flex': true }">
            <template v-if="selectedSubject">
              <header
                class="z-10 flex h-[59px] shrink-0 items-center gap-3 bg-[#f0f2f5] px-3 dark:bg-[#202c33]">
                <div class="flex items-center gap-3">
                  <button type="button"
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10 lg:hidden"
                    @click="backToGroupList">
                    <Icon icon="mdi:arrow-left" class="h-6 w-6" />
                  </button>
                  <button type="button"
                    class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-white shadow-sm"
                    :class="[
                      selectedSubject.chat_icon_url ? 'bg-slate-100 dark:bg-slate-800' : getSubjectIconClass(selectedSubject),
                      role === 'GURU' ? 'ring-2 ring-transparent transition hover:ring-[#00a884]/40' : '',
                    ]" :disabled="role !== 'GURU' || isUploadingChatIcon" @click="openChatIconModal">
                    <img v-if="selectedSubject.chat_icon_url" :src="selectedSubject.chat_icon_url" alt="Ikon grup mapel"
                      class="h-full w-full object-cover" />
                    <Icon v-else :icon="getSubjectIcon(selectedSubject)" class="h-6 w-6 opacity-95" />
                  </button>
                  <div class="min-w-0 flex-1">
                    <h2 class="truncate text-[15px] font-medium text-[#111b21] dark:text-[#e9edef]">{{
                      selectedSubject.name }}
                    </h2>
                    <p class="truncate text-xs text-[#667781] dark:text-[#8696a0]">
                      <span v-if="typingIndicatorText" class="text-[#00a884]">{{ typingIndicatorText }}</span>
                      <span v-else>{{ selectedSubject.class_name }}<span v-if="selectedSubject.teacher_name"> • {{
                        selectedSubject.teacher_name }}</span> • {{ onlineIndicatorText }}</span>
                    </p>
                  </div>
                </div>
              <button type="button"
                class="flex h-10 w-10 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                @click="loadSubjects">
                <Icon icon="mdi:refresh" class="h-5 w-5" />
              </button>
            </header>

              <div ref="messageListRef" :style="messageListStyle"
                class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 md:px-14">
                <div v-if="isLoadingMessages"
                  class="flex h-full min-h-[420px] items-center justify-center">
                  <div
                    class="rounded-lg bg-white/80 px-4 py-2 text-sm text-[#667781] shadow-sm dark:bg-[#202c33]/90 dark:text-[#8696a0]">
                    Memuat percakapan...
                  </div>
                </div>

                <div v-else-if="currentMessages.length === 0"
                  class="flex h-full min-h-[420px] items-center justify-center">
                  <div
                    class="max-w-sm rounded-lg bg-[#fffef7]/95 px-5 py-4 text-center text-sm text-[#667781] shadow-sm dark:bg-[#202c33]/95 dark:text-[#d1d7db]">
                    Belum ada pesan di grup {{ selectedSubject.name }}.
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

                    <div v-else class="flex"
                      :class="entry.message.sender_id === currentUserId ? 'justify-end' : 'justify-start'">
                      <article
                        class="learning-message-bubble relative px-2.5 py-1.5 text-sm leading-5 shadow-sm"
                        :class="[
                          entry.message.sender_id === currentUserId ? 'own bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef]' : 'other bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef]',
                          replyHighlightMessageId === Number(entry.message.id) ? 'ring-2 ring-amber-400 dark:ring-amber-300' : '',
                        ]" :data-message-id="entry.message.id" @touchstart.passive="handleMessagePressStart(entry.message)"
                        @touchend="handleMessagePressEnd(entry.message)" @touchcancel="handleMessagePressEnd">
                        <div v-if="entry.message.sender_id !== currentUserId"
                          class="mb-1 flex items-center gap-2 text-xs font-semibold text-[#00a884]">
                          <span>{{ entry.message.sender_name || "Pengguna" }}</span>
                          <span class="rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-[#667781] dark:bg-white/10 dark:text-[#aebac1]">
                            {{ roleLabel(entry.message.sender_role) }}
                          </span>
                        </div>
                        <button v-if="parseReplyPayload(entry.message.message).replyName" type="button"
                          @click="jumpToReplyTarget(entry.message)"
                          class="mb-1 w-full rounded-md border-l-4 px-2 py-1.5 text-left text-[11px]"
                          :class="entry.message.sender_id === currentUserId ? 'border-[#00a884] bg-black/5 text-[#3b4a54] dark:text-[#d1d7db]' : 'border-[#00a884] bg-[#f0f2f5] text-[#3b4a54] dark:bg-[#111b21] dark:text-[#d1d7db]'">
                          <p class="line-clamp-2">{{ parseReplyPayload(entry.message.message).replyPreview }}</p>
                        </button>
                        <p v-if="parseReplyPayload(entry.message.message).body"
                          class="whitespace-pre-wrap break-words pr-12">
                          {{ parseReplyPayload(entry.message.message).body }}
                        </p>
                        <div v-if="entry.message.attachment_url" class="mt-2">
                          <audio v-if="isVoiceMessage(entry.message)" :src="normalizePublicUrl(entry.message.attachment_url)" controls
                            class="w-full max-w-sm" />
                          <button v-else-if="isRenderableImageMessage(entry.message)" type="button"
                            @click="openImagePreview(normalizePublicUrl(entry.message.attachment_url), entry.message.attachment_name)"
                            class="block w-full overflow-hidden rounded-md text-left">
                            <img :src="normalizePublicUrl(entry.message.attachment_url)"
                              :alt="entry.message.attachment_name || 'Lampiran gambar'" class="max-h-72 w-full object-cover" />
                          </button>
                          <button v-else-if="isPdfPreviewMessage(entry.message)" type="button"
                            class="block w-full overflow-hidden rounded-md border border-black/10 bg-white text-left shadow-sm dark:border-white/10 dark:bg-[#202c33]"
                            @click="openPdfPreview(entry.message)">
                            <img :src="normalizePublicUrl(entry.message.attachment_preview_url)"
                              :alt="entry.message.attachment_name || 'Pratinjau PDF'"
                              class="max-h-60 w-full object-contain bg-white" />
                            <div class="flex items-center gap-3 border-t border-black/5 px-3 py-2 text-sm font-semibold text-[#111b21] dark:border-white/10 dark:text-[#e9edef]">
                              <Icon icon="ph:file-pdf" class="h-5 w-5 shrink-0 text-[#ef4444]" />
                              <span class="truncate">{{ entry.message.attachment_name || "Buka PDF" }}</span>
                            </div>
                          </button>
                          <a v-else :href="normalizePublicUrl(entry.message.attachment_url)" target="_blank" rel="noreferrer"
                            class="flex items-center gap-3 rounded-md bg-black/5 px-3 py-2 text-sm font-semibold hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15">
                            <Icon icon="ph:paperclip" class="h-5 w-5 shrink-0" />
                            <span class="truncate">{{ entry.message.attachment_name || "Buka file" }}</span>
                          </a>
                        </div>
                        <div class="-mb-0.5 mt-0.5 flex items-center justify-end gap-1 pl-8 text-[11px] leading-none text-[#667781] dark:text-[#8696a0]">
                          <time>{{ formatChatTime(entry.message.created_at) }}</time>
                          <span v-if="entry.message.edited_at" class="text-[10px] font-medium uppercase tracking-wide opacity-80">Diedit</span>
                          <Icon v-if="entry.message.sender_id === currentUserId" :icon="ownMessageReadIcon(entry.message)"
                            class="h-4 w-4" :class="ownMessageReadIconClass(entry.message)" />
                        </div>
                      </article>
                    </div>
                  </template>
                </div>
              </div>

              <form ref="composerBarRef" @submit.prevent="sendMessage"
                class="fixed inset-x-0 z-20 shrink-0 bg-[#f0f2f5] px-3 py-2 dark:bg-[#202c33] md:sticky md:inset-auto md:px-4"
                :style="composerBarStyle">
                <div v-if="editTarget"
                  class="mb-2 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-[11px] shadow-sm dark:bg-amber-500/10">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-semibold text-amber-700 dark:text-amber-300">Mengedit pesan</p>
                      <p class="truncate text-[#54656f] dark:text-[#aebac1]">{{ getMessagePreview(editTarget) }}</p>
                    </div>
                    <button type="button" @click="clearEditTarget"
                      class="rounded-full p-1 text-[#667781] hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10">
                      <Icon icon="mdi:close" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div v-if="replyTarget"
                  class="mb-2 rounded-lg border-l-4 border-[#00a884] bg-white px-3 py-2 text-[11px] shadow-sm dark:bg-[#2a3942]">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-[#667781] dark:text-[#aebac1]">
                        {{ getMessagePreview(replyTarget) }}
                      </p>
                    </div>
                    <button type="button" @click="clearReplyTarget"
                      class="rounded-full p-1 text-[#667781] hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10">
                      <Icon icon="mdi:close" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div v-if="attachmentPreviewName || isRecordingVoice || recordedVoiceUrl"
                  class="mb-2 rounded-lg bg-white px-4 py-3 text-sm shadow-sm dark:bg-[#2a3942]">
                  <div v-if="attachmentPreviewName" class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-semibold text-[#111b21] dark:text-[#e9edef]">Lampiran siap dikirim</p>
                      <p class="truncate text-[#667781] dark:text-[#8696a0]">{{ attachmentPreviewName }}</p>
                    </div>
                    <button type="button" class="text-[#667781] hover:text-[#111b21] dark:text-[#aebac1]"
                      @click="clearAttachment">
                      <Icon icon="mdi:close" class="h-5 w-5" />
                    </button>
                  </div>
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
                    <div class="flex-1">
                      <p class="font-semibold text-[#111b21] dark:text-[#e9edef]">Sedang merekam voice note...</p>
                      <svg class="mt-2 h-10 w-full max-w-sm rounded-md bg-rose-50/70 dark:bg-rose-500/10"
                        viewBox="0 0 300 40" preserveAspectRatio="none">
                        <polyline :points="recordingWavePoints" fill="none" stroke="#ef4444" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <p class="text-[#667781] dark:text-[#8696a0]">{{ recordingDurationLabel }}</p>
                    </div>
                    <button type="button" class="rounded-full bg-rose-500 p-2 text-white hover:bg-rose-400"
                      @click="stopVoiceRecording">
                      <Icon icon="ph:stop-fill" class="h-4 w-4" />
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
                  <div class="mb-1 flex shrink-0 items-center gap-1">
                    <button type="button"
                      class="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                      :disabled="isSendingMessage || isRecordingVoice || Boolean(editTarget)" @click="openAttachmentPicker">
                      <Icon icon="mdi:paperclip" class="h-6 w-6" />
                    </button>
                  </div>
                  <div class="mb-1 flex min-h-10 flex-1 items-center rounded-lg bg-white px-3 dark:bg-[#2a3942]">
                    <textarea v-model="composer" rows="1" placeholder="Ketik pesan" @input="handleComposerInput"
                      @keydown="handleComposerKeydown" @focus="ensureComposerVisible"
                      class="block max-h-28 min-h-[24px] w-full resize-none overflow-y-auto border-0 bg-transparent py-2 text-[15px] leading-6 text-[#111b21] outline-none placeholder:text-[#667781] focus:outline-none focus:ring-0 dark:text-[#e9edef] dark:placeholder:text-[#8696a0]" />
                  </div>
                  <button type="button" v-if="!composer.trim() && !attachmentFile && !editTarget" :disabled="isSendingMessage"
                    class="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 disabled:opacity-50 dark:text-[#aebac1] dark:hover:bg-white/10"
                    :class="isRecordingVoice ? 'bg-rose-500 text-white hover:bg-rose-400 dark:text-white' : ''"
                    @click="toggleVoiceRecording">
                    <Icon :icon="isRecordingVoice ? 'ph:stop-fill' : 'mdi:microphone'" class="h-5 w-5" />
                  </button>
                  <button v-else :disabled="isSendingMessage"
                    class="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white transition hover:bg-[#008f72] disabled:opacity-50">
                    <Icon :icon="editTarget ? 'mdi:check' : 'mdi:send'" class="h-5 w-5" />
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
                  <Icon icon="ph:chats-circle-duotone" class="h-12 w-12 text-[#667781] dark:text-[#8696a0]" />
                </div>
                <h2 class="mt-6 text-2xl font-light text-[#41525d] dark:text-[#d1d7db]">Live Chat Mapel</h2>
                <p class="mt-3 text-sm leading-6 text-[#667781] dark:text-[#8696a0]">
                  Pilih grup mata pelajaran di sebelah kiri untuk membuka percakapan.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
    <div v-if="showChatIconModal && role === 'GURU'" class="fixed inset-0 z-[75] bg-black/45"
      @click="closeChatIconModal">
      <div
        class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 shadow-2xl dark:bg-slate-900 sm:mx-auto sm:my-16 sm:inset-auto sm:w-full sm:max-w-md sm:rounded-2xl"
        @click.stop>
        <h3 class="text-base font-semibold text-slate-900 dark:text-white">Ubah Ikon Grup</h3>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Pilih gambar baru untuk ikon mapel ini.</p>

        <div class="mt-4 flex items-center gap-3">
          <div
            class="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            <img v-if="chatIconPreviewUrl || selectedSubject?.chat_icon_url"
              :src="chatIconPreviewUrl || selectedSubject?.chat_icon_url" alt="Preview ikon grup"
              class="h-full w-full object-cover" />
            <div v-else class="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-300">
              <Icon icon="ph:chats-circle-duotone" class="h-7 w-7" />
            </div>
          </div>
          <input type="file" accept="image/*" @change="handleChatIconFileChange"
            class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-200 dark:hover:file:bg-slate-700" />
        </div>

        <div class="mt-5 flex items-center justify-end gap-2">
          <button type="button" @click="closeChatIconModal"
            class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300">
            Batal
          </button>
          <button type="button" :disabled="isUploadingChatIcon || !chatIconDraftFile" @click="submitChatIconUpload"
            class="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {{ isUploadingChatIcon ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showImagePreview" class="fixed inset-0 z-[80] bg-black/90" @click="closeImagePreview">
      <div class="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-3">
        <p class="truncate text-xs font-semibold text-white/80">{{ previewImageName || "Preview Gambar" }}</p>
        <div class="flex items-center gap-2">
          <button type="button" @click.stop="zoomOutPreview"
            class="rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <Icon icon="mdi:magnify-minus-outline" class="h-5 w-5" />
          </button>
          <button type="button" @click.stop="resetPreviewZoom"
            class="rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <Icon icon="mdi:fit-to-page-outline" class="h-5 w-5" />
          </button>
          <button type="button" @click.stop="zoomInPreview"
            class="rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <Icon icon="mdi:magnify-plus-outline" class="h-5 w-5" />
          </button>
          <button type="button" @click.stop="closeImagePreview"
            class="rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <Icon icon="mdi:close" class="h-5 w-5" />
          </button>
        </div>
      </div>
      <div class="flex h-full w-full items-center justify-center overflow-auto p-4 pt-16">
        <img :src="previewImageUrl" :alt="previewImageName || 'Preview gambar'"
          class="max-h-full max-w-full origin-center object-contain transition-transform duration-150"
          :style="{ transform: `scale(${previewImageZoom})` }" @click.stop />
      </div>
    </div>

    <div v-if="showPdfPreview" class="fixed inset-0 z-[81] bg-black/90" @click="closePdfPreview">
      <div class="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-3">
        <p class="truncate text-xs font-semibold text-white/80">{{ previewPdfName || "Preview PDF" }}</p>
        <div class="flex items-center gap-2">
          <a
            v-if="previewPdfUrl"
            :href="previewPdfUrl"
            :download="previewPdfName || 'preview.pdf'"
            class="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/25"
            @click.stop
          >
            Unduh
          </a>
          <button type="button" @click.stop="closePdfPreview"
            class="rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <Icon icon="mdi:close" class="h-5 w-5" />
          </button>
        </div>
      </div>
      <div class="flex h-full w-full items-center justify-center overflow-auto p-4 pt-16">
        <iframe
          v-if="previewPdfUrl"
          :src="previewPdfUrl"
          class="h-[85vh] w-full max-w-5xl rounded-2xl bg-white shadow-2xl"
          title="Preview PDF"
        />
      </div>
    </div>

    <div v-if="showMessageActionSheet" class="fixed inset-0 z-[75] bg-black/45" @click="closeMessageActionSheet">
      <div class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 shadow-2xl dark:bg-slate-900" @click.stop>
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Aksi Pesan</p>
        <button type="button" @click="replyFromActionSheet"
          class="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
          Balas Chat
          <Icon icon="mdi:reply-outline" class="h-5 w-5" />
        </button>
        <button v-if="actionSheetMessage && Number(actionSheetMessage.sender_id || 0) === Number(currentUserId)" type="button" @click="editFromActionSheet"
          class="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
          Edit Pesan
          <Icon icon="mdi:pencil-outline" class="h-5 w-5" />
        </button>
        <button type="button" @click="closeMessageActionSheet"
          class="mt-2 flex w-full items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { convertHeicToJpegIfPossible } from "@/utils/fileImage";
import { formatChatDateKey, formatChatDateSeparator, formatChatShortDate, formatChatTime as formatJakartaChatTime, parseDateValue } from "@/utils/date";
import { getStoredRole } from "@/utils/auth";
import { normalizePublicUrl } from "@/utils/url";
import { useSidebar } from "@/store/sidebar";
import { useRealtimeStore } from "@/store/realtime";

const role = getStoredRole();
const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebar();
const realtimeStore = useRealtimeStore();
const { connected: realtimeConnected } = storeToRefs(realtimeStore);
const subjects = ref([]);
const selectedSubject = ref(null);
const subjectError = ref("");
const chatError = ref("");
const isLoadingMessages = ref(false);
const isSendingMessage = ref(false);
const isUploadingChatIcon = ref(false);
const isRecordingVoice = ref(false);
const composer = ref("");
const mobileChatOpen = ref(false);
const showChatIconModal = ref(false);
const chatIconDraftFile = ref(null);
const chatIconPreviewUrl = ref("");
const attachmentFile = ref(null);
const attachmentPreviewName = ref("");
const recordedVoiceUrl = ref("");
const recordingSeconds = ref(0);
const recordingTimer = ref(null);
const mediaRecorder = ref(null);
const mediaStream = ref(null);
const recordedChunks = ref([]);
const audioContext = ref(null);
const analyserNode = ref(null);
const sourceNode = ref(null);
const waveformTimer = ref(null);
const recordingWavePoints = ref("0,20 300,20");
const attachmentInputRef = ref(null);
const messageListRef = ref(null);
const composerBarRef = ref(null);
const replyTarget = ref(null);
const replyHighlightMessageId = ref(null);
const showImagePreview = ref(false);
const previewImageUrl = ref("");
const previewImageName = ref("");
const previewImageZoom = ref(1);
const showPdfPreview = ref(false);
const previewPdfUrl = ref("");
const previewPdfName = ref("");
const showMessageActionSheet = ref(false);
const actionSheetMessage = ref(null);
const editTarget = ref(null);
const longPressTimer = ref(null);
const emojiPanelOpen = ref(false);
const messagesBySubject = ref({});
const chatSummaryBySubject = ref({});
const realtimeUnsubscribers = ref([]);
const typingStateBySubject = ref({});
const typingStopTimer = ref(null);
const typingDebounceTimer = ref(null);
const onlineUsersBySubject = ref({});
const onlineRefreshTimer = ref(null);
const viewportBottomInset = ref(0);
const isMobileViewport = ref(false);
const composerBarHeight = ref(0);
const composerResizeObserver = ref(null);
const isConnected = computed(() => realtimeConnected.value);
const localClientId = ref(`chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
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

const goBack = () => router.back();

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
const groupIconSet = [
  "ph:calculator",
  "ph:flask",
  "ph:book-open-text",
  "ph:globe-hemisphere-west",
  "ph:atom",
  "ph:music-notes",
  "ph:pencil-ruler",
  "ph:code",
  "ph:leaf",
  "ph:briefcase",
];
const groupColorSet = [
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-violet-500 to-fuchsia-500",
  "from-indigo-500 to-blue-500",
  "from-lime-500 to-green-500",
  "from-red-500 to-orange-500",
];

const roleAccentClass = computed(() =>
  role === "GURU"
    ? "bg-sky-600 hover:bg-sky-500 dark:bg-cyan-600 dark:hover:bg-cyan-500"
    : "bg-emerald-600 hover:bg-emerald-500",
);

const selectedGroupClass = computed(() =>
  role === "GURU"
    ? "bg-sky-600 shadow-sm"
    : "bg-emerald-600 shadow-sm",
);

const unreadGroupClass = computed(() =>
  role === "GURU"
    ? "bg-sky-50 ring-sky-200 hover:bg-sky-100 dark:bg-cyan-500/10 dark:ring-cyan-500/30 dark:hover:bg-cyan-500/15"
    : "bg-emerald-50 ring-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/30 dark:hover:bg-emerald-500/15",
);

const groupIconClass = computed(() =>
  role === "GURU"
    ? "bg-sky-500 dark:bg-cyan-500"
    : "bg-emerald-500",
);

const ownMessageClass = computed(() =>
  role === "GURU"
    ? "rounded-tr-md bg-sky-600 text-white"
    : "rounded-tr-md bg-emerald-600 text-white",
);

const unreadBadgeClass = computed(() =>
  role === "GURU"
    ? "bg-sky-100 text-sky-700 dark:bg-cyan-500/10 dark:text-cyan-300"
    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
);

const connectionBadgeClass = computed(() =>
  isConnected.value
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20"
    : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
);

const recordingDurationLabel = computed(() => {
  const minutes = Math.floor(recordingSeconds.value / 60);
  const seconds = recordingSeconds.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const composerBarStyle = computed(() => ({
  bottom: `${viewportBottomInset.value}px`,
  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
}));

const messageListStyle = computed(() => ({
  paddingBottom: isMobileViewport.value
    ? `calc(${viewportBottomInset.value}px + env(safe-area-inset-bottom, 0px) + ${Math.max(composerBarHeight.value, 104) + 20}px)`
    : "",
}));

const currentMessages = computed(() =>
  selectedSubject.value ? messagesBySubject.value[selectedSubject.value.id] || [] : [],
);

const formatChatTime = (value) => formatJakartaChatTime(value);
const truncatePreview = (value, limit = 46) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
};

const formatSubjectTime = (subjectId) => {
  const messages = messagesBySubject.value[subjectId] || [];
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage?.created_at) return "";

  const dateKey = formatChatDateKey(lastMessage.created_at);
  if (!dateKey) return "";

  const todayKey = formatChatDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatChatDateKey(yesterday);

  if (dateKey === todayKey) return formatJakartaChatTime(lastMessage.created_at);
  if (dateKey === yesterdayKey) return "Kemarin";
  return formatChatShortDate(lastMessage.created_at);
};

const formatDateSeparator = (value) => {
  return formatChatDateSeparator(value);
};

const renderedMessages = computed(() => {
  const entries = [];
  let lastDateKey = "";

  currentMessages.value.forEach((message) => {
    const dateKey = formatChatDateKey(message?.created_at || Date.now()) || "unknown";
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

const orderedSubjects = computed(() => {
  const subjectItems = Array.isArray(subjects.value) ? [...subjects.value] : [];

  return subjectItems.sort((left, right) => {
    const leftLastMessage = messagesBySubject.value[left.id]?.slice(-1)[0];
    const rightLastMessage = messagesBySubject.value[right.id]?.slice(-1)[0];
    const leftTime = parseDateValue(leftLastMessage?.created_at)?.getTime() || 0;
    const rightTime = parseDateValue(rightLastMessage?.created_at)?.getTime() || 0;

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return String(left.name || "").localeCompare(String(right.name || ""), "id");
  });
});

const typingIndicatorText = computed(() => {
  const subjectId = Number(selectedSubject.value?.id || 0);
  if (!subjectId) {
    return "";
  }

  const subjectTyping = typingStateBySubject.value[subjectId] || {};
  const names = Object.values(subjectTyping)
    .map((item) => String(item?.sender_name || "").trim())
    .filter(Boolean);

  if (names.length === 0) {
    return "";
  }
  if (names.length === 1) {
    return `${names[0]} sedang mengetik...`;
  }
  return `${names.length} orang sedang mengetik...`;
});

const onlineIndicatorText = computed(() => {
  const subjectId = Number(selectedSubject.value?.id || 0);
  if (!subjectId) {
    return "Online: -";
  }

  const users = onlineUsersBySubject.value[subjectId] || [];
  if (!users.length) {
    return "Online: 0";
  }

  if (users.length <= 2) {
    const names = users
      .filter((item) => item && typeof item === "object")
      .map((item) => item.full_name || item.username || "User")
      .join(", ");
    return `Online: ${users.length} `;
  }
  return `Online: ${users.length} pengguna`;
});

const getSubjectVisualIndex = (subject) => {
  const source = `${subject?.id || ""}-${subject?.name || ""}`;
  return Array.from(source).reduce((total, char) => total + char.charCodeAt(0), 0);
};

const getSubjectIcon = (subject) => groupIconSet[getSubjectVisualIndex(subject) % groupIconSet.length];

const getSubjectIconClass = (subject) =>
  `bg-gradient-to-br ${groupColorSet[getSubjectVisualIndex(subject) % groupColorSet.length]}`;

const subjectMessageCount = (subjectId) => {
  const messages = messagesBySubject.value[subjectId] || [];
  return messages.length > 99 ? 99 : messages.length;
};

const subjectUnreadCount = (subjectId) => {
  const normalizedSubjectId = Number(subjectId || 0);
  if (!normalizedSubjectId) {
    return 0;
  }

  const localCount = Number(chatSummaryBySubject.value[normalizedSubjectId]?.unread_count || 0);
  const baseCount = Number(sidebarStore.liveChatUnreadBySubject?.[normalizedSubjectId] || 0);
  const pendingCount = Number(sidebarStore.liveChatPendingUnreadBySubject?.[normalizedSubjectId] || 0);
  return Math.max(localCount, baseCount, pendingCount);
};

const formatUnreadCount = (value) => (value > 99 ? "99+" : String(value));

const latestMessagePreview = (subjectId) => {
  const messages = messagesBySubject.value[subjectId] || [];
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    return subjectUnreadCount(subjectId) > 0 ? "Ada pesan baru" : "Belum ada pesan";
  }

  if (lastMessage.message_type === "VOICE") {
    return `${lastMessage.sender_name}: Voice note`;
  }

  if (lastMessage.message_type === "IMAGE") {
    return `${lastMessage.sender_name}: Gambar`;
  }

  if (lastMessage.message_type === "PDF") {
    return `${lastMessage.sender_name}: PDF`;
  }

  if (lastMessage.message_type === "FILE") {
    return `${lastMessage.sender_name}: File`;
  }

  return truncatePreview(`${lastMessage.sender_name}: ${lastMessage.message}`);
};

const roleLabel = (userRole) => {
  if (userRole === "GURU") {
    return "Guru";
  }

  if (userRole === "SISWA") {
    return "Siswa";
  }

  return userRole || "User";
};

const roleBadgeClass = (userRole) => {
  if (userRole === "GURU") {
    return "bg-sky-100 text-sky-700 dark:bg-cyan-500/10 dark:text-cyan-300";
  }

  if (userRole === "SISWA") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
};

const ownMessageReadLabel = (message) => {
  const recipientCount = Number(message?.recipient_count || 0);
  const readCount = Number(message?.read_count || 0);

  if (recipientCount <= 0) {
    return "Terkirim";
  }

  if (recipientCount > 0 && readCount >= recipientCount) {
    return "Sudah dilihat semua";
  }

  if (readCount > 0) {
    return `${readCount}/${recipientCount} sudah melihat`;
  }

  return "Belum dilihat";
};

const ownMessageReadIcon = (message) => {
  const label = ownMessageReadLabel(message);
  if (label === "Terkirim") return "mdi:check";
  return "mdi:check-all";
};

const ownMessageReadIconClass = (message) =>
  ownMessageReadLabel(message) === "Sudah dilihat semua" ? "text-[#53bdeb]" : "";

const getMessagePreview = (message) => {
  if (!message) return "-";
  if (message.message) return String(message.message).replace(/\s+/g, " ").slice(0, 120);
  if (message.message_type === "VOICE") return "Voice note";
  if (message.message_type === "IMAGE") return "Gambar";
  if (message.message_type === "PDF") return "PDF";
  if (message.attachment_name) return message.attachment_name;
  return "Pesan";
};

const parseReplyPayload = (rawMessage) => {
  const text = String(rawMessage || "");
  const matched = text.match(/^(\[Balas(?:#(\d+))?\s+(.+?): (.+?)\])\n([\s\S]*)$/);
  if (!matched) {
    return {
      replyId: null,
      replyName: "",
      replyPreview: "",
      replyPrefix: "",
      body: text,
    };
  }

  return {
    replyPrefix: matched[1] || "",
    replyId: matched[2] ? Number(matched[2]) : null,
    replyName: matched[3] || "",
    replyPreview: matched[4] || "",
    body: matched[5] || "",
  };
};

const jumpToReplyTarget = async (messageItem) => {
  const parsed = parseReplyPayload(messageItem?.message);
  const replyId = Number(parsed?.replyId || 0);
  if (!replyId) {
    pushToast({
      title: "Pesan Asal Tidak Ditemukan",
      message: "Balasan ini belum menyimpan referensi pesan asal.",
      type: "info",
    });
    return;
  }

  await nextTick();
  const target = messageListRef.value?.querySelector?.(`[data-message-id="${replyId}"]`);
  if (!target) {
    pushToast({
      title: "Pesan Asal Tidak Tersedia",
      message: "Pesan asal kemungkinan di luar riwayat yang sedang dimuat.",
      type: "info",
    });
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "center" });
  replyHighlightMessageId.value = replyId;
  window.setTimeout(() => {
    if (replyHighlightMessageId.value === replyId) {
      replyHighlightMessageId.value = null;
    }
  }, 1600);
};

const isVoiceMessage = (message) => {
  const explicitType = String(message?.message_type || "").toUpperCase();
  if (explicitType === "VOICE") {
    return true;
  }

  const mimeType = String(message?.attachment_mime_type || "").toLowerCase();
  if (mimeType.startsWith("audio/")) {
    return true;
  }

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

const isPdfPreviewMessage = (message) => {
  return Boolean(message?.attachment_preview_url);
};

const openPdfPreview = (message) => {
  const url = normalizePublicUrl(message?.attachment_url);
  if (!url) return;
  previewPdfUrl.value = url;
  previewPdfName.value = message?.attachment_name || "Preview PDF";
  showPdfPreview.value = true;
};

const closePdfPreview = () => {
  showPdfPreview.value = false;
  previewPdfUrl.value = "";
  previewPdfName.value = "";
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

const updateViewportInset = () => {
  if (typeof window !== "undefined") {
    isMobileViewport.value = window.innerWidth < 768;
  }
  if (typeof window === "undefined" || !window.visualViewport) {
    viewportBottomInset.value = 0;
    return;
  }
  const vv = window.visualViewport;
  viewportBottomInset.value = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
};

const updateComposerBarMetrics = () => {
  if (!composerBarRef.value) {
    composerBarHeight.value = 0;
    return;
  }

  composerBarHeight.value = Math.ceil(composerBarRef.value.getBoundingClientRect().height);
};

const ensureComposerVisible = async () => {
  await nextTick();
  updateViewportInset();
  updateComposerBarMetrics();
  window.setTimeout(() => {
    scrollToBottom();
  }, 80);
};

const sortMessages = (messages = []) =>
  [...messages].sort((left, right) => {
    if (left.created_at === right.created_at) {
      return Number(left.id) - Number(right.id);
    }

    return (parseDateValue(left.created_at)?.getTime() || 0) - (parseDateValue(right.created_at)?.getTime() || 0);
  });

const upsertMessage = async (chatMessage) => {
  const subjectId = Number(chatMessage?.subject_id);
  if (!subjectId) {
    return;
  }

  const currentMessagesForSubject = messagesBySubject.value[subjectId] || [];
  const existingIndex = currentMessagesForSubject.findIndex((item) => Number(item.id) === Number(chatMessage.id));
  const nextMessages = [...currentMessagesForSubject];

  if (existingIndex >= 0) {
    nextMessages.splice(existingIndex, 1, chatMessage);
  } else {
    nextMessages.push(chatMessage);
  }

  messagesBySubject.value = {
    ...messagesBySubject.value,
    [subjectId]: sortMessages(nextMessages),
  };

  if (Number(selectedSubject.value?.id) === subjectId) {
    await scrollToBottom();
  }
};

const refreshChatSummary = async () => {
  try {
    const summaryItems = await sidebarStore.refreshLiveChatSummary({ force: true });
    const nextSummary = {};

    summaryItems.forEach((item) => {
      nextSummary[Number(item.subject_id)] = {
        unread_count: Number(item.unread_count || 0),
        last_read_message_id: Number(item.last_read_message_id || 0),
      };
    });

    chatSummaryBySubject.value = nextSummary;
  } catch (error) {
    // Keep the existing summary if this refresh fails.
  }
};

const markCurrentSubjectAsRead = async () => {
  const subjectId = Number(selectedSubject.value?.id || 0);
  if (!subjectId) {
    return;
  }

  const currentSubjectMessages = messagesBySubject.value[subjectId] || [];
  const lastMessage = currentSubjectMessages[currentSubjectMessages.length - 1];
  const lastMessageId = Number(lastMessage?.id || 0);
  const currentSummary = chatSummaryBySubject.value[subjectId] || {};
  const currentLastReadMessageId = Number(currentSummary.last_read_message_id || 0);

  if (!lastMessageId) {
    chatSummaryBySubject.value = {
      ...chatSummaryBySubject.value,
      [subjectId]: {
        ...(chatSummaryBySubject.value[subjectId] || {}),
        unread_count: 0,
      },
    };
    sidebarStore.clearPendingLiveChatUnreadBySubject(subjectId);
    return;
  }

  if (currentLastReadMessageId >= lastMessageId) {
    chatSummaryBySubject.value = {
      ...chatSummaryBySubject.value,
      [subjectId]: {
        ...currentSummary,
        unread_count: 0,
        last_read_message_id: currentLastReadMessageId,
      },
    };
    sidebarStore.clearPendingLiveChatUnreadBySubject(subjectId);
    return;
  }

  try {
    const response = await api.post(`/learning/subjects/${subjectId}/chat/read`, {
      last_message_id: lastMessageId,
    });

    const readState = response?.data;
    chatSummaryBySubject.value = {
      ...chatSummaryBySubject.value,
      [subjectId]: {
        unread_count: 0,
        last_read_message_id: Number(readState?.last_read_message_id || lastMessageId),
      },
    };
    sidebarStore.clearPendingLiveChatUnreadBySubject(subjectId);
  } catch (error) {
    // Ignore read marking failures silently to avoid noisy UX.
  }
};

const clearTypingForSubject = (subjectId) => {
  const normalizedSubjectId = Number(subjectId || 0);
  if (!normalizedSubjectId) return;
  if (!typingStateBySubject.value[normalizedSubjectId]) return;
  const next = { ...typingStateBySubject.value };
  delete next[normalizedSubjectId];
  typingStateBySubject.value = next;
};

const sendTypingEvent = async (isTyping) => {
  const subjectId = Number(selectedSubject.value?.id || 0);
  if (!subjectId) return;
  try {
    await api.post(`/learning/subjects/${subjectId}/chat/typing`, {
      is_typing: Boolean(isTyping),
      client_id: localClientId.value,
    });
  } catch (error) {
    // Ignore typing broadcast failures.
  }
};

const scheduleTypingStop = () => {
  if (typingStopTimer.value) {
    window.clearTimeout(typingStopTimer.value);
  }
  typingStopTimer.value = window.setTimeout(() => {
    sendTypingEvent(false);
    typingStopTimer.value = null;
  }, 1800);
};

const handleComposerInput = () => {
  updateComposerBarMetrics();
  if (!selectedSubject.value) return;
  if (!composer.value.trim()) {
    if (typingDebounceTimer.value) {
      window.clearTimeout(typingDebounceTimer.value);
      typingDebounceTimer.value = null;
    }
    if (typingStopTimer.value) {
      window.clearTimeout(typingStopTimer.value);
      typingStopTimer.value = null;
    }
    sendTypingEvent(false);
    return;
  }

  if (typingDebounceTimer.value) {
    window.clearTimeout(typingDebounceTimer.value);
  }
  typingDebounceTimer.value = window.setTimeout(() => {
    sendTypingEvent(true);
    scheduleTypingStop();
  }, 250);
};

const leaveSubjectRoom = (subjectId) => {
  return subjectId;
};

const joinSubjectRoom = (subjectId) => {
  return subjectId;
};

const loadMessages = async (subjectId) => {
  if (!subjectId) {
    return;
  }

  isLoadingMessages.value = true;
  chatError.value = "";

  try {
    const response = await api.get(`/learning/subjects/${subjectId}/chat`, {
      params: { limit: 120 },
    });
    messagesBySubject.value = {
      ...messagesBySubject.value,
      [subjectId]: sortMessages(response?.data || []),
    };
    await markCurrentSubjectAsRead();
    await scrollToBottom();
  } catch (error) {
    chatError.value = error.message;
    messagesBySubject.value = {
      ...messagesBySubject.value,
      [subjectId]: [],
    };
  } finally {
    isLoadingMessages.value = false;
  }
};

const loadOnlineUsers = async (subjectId) => {
  if (!subjectId) return;
  try {
    const response = await api.get(`/learning/subjects/${subjectId}/chat/online`);
    onlineUsersBySubject.value = {
      ...onlineUsersBySubject.value,
      [subjectId]: response?.data?.users || [],
    };
  } catch (error) {
    // Ignore online user refresh errors silently.
  }
};

const selectSubject = async (subject) => {
  const previousSubjectId = selectedSubject.value?.id || null;
  if (previousSubjectId && Number(previousSubjectId) !== Number(subject.id)) {
    await sendTypingEvent(false);
    clearTypingForSubject(previousSubjectId);
  }
  selectedSubject.value = subject;
  composer.value = "";
  replyTarget.value = null;
  editTarget.value = null;
  chatError.value = "";
  mobileChatOpen.value = true;

  if (previousSubjectId && Number(previousSubjectId) !== Number(subject.id)) {
    leaveSubjectRoom(previousSubjectId);
  }

  await loadMessages(subject.id);
  await loadOnlineUsers(subject.id);
  joinSubjectRoom(subject.id);
};

const setReplyTarget = (message) => {
  replyTarget.value = message || null;
};

const clearReplyTarget = () => {
  replyTarget.value = null;
};

const clearEditTarget = () => {
  editTarget.value = null;
};

const setEditTarget = (message) => {
  if (!message) return;
  const parsed = parseReplyPayload(message?.message);
  editTarget.value = message;
  composer.value = parsed.body || "";
  replyTarget.value = null;
  clearAttachment();
  emojiPanelOpen.value = false;
  nextTick().then(() => {
    handleComposerInput();
  });
};

const toggleEmojiPanel = () => {
  emojiPanelOpen.value = !emojiPanelOpen.value;
};

const insertEmoji = (emoji) => {
  composer.value = `${composer.value || ""}${emoji}`;
  emojiPanelOpen.value = false;
  handleComposerInput();
};

const openImagePreview = (url, name = "") => {
  if (!url) return;
  previewImageUrl.value = url;
  previewImageName.value = name || "";
  previewImageZoom.value = 1;
  showImagePreview.value = true;
};

const closeImagePreview = () => {
  showImagePreview.value = false;
  previewImageUrl.value = "";
  previewImageName.value = "";
  previewImageZoom.value = 1;
};

const zoomInPreview = () => {
  previewImageZoom.value = Math.min(4, Number((previewImageZoom.value + 0.25).toFixed(2)));
};

const zoomOutPreview = () => {
  previewImageZoom.value = Math.max(1, Number((previewImageZoom.value - 0.25).toFixed(2)));
};

const resetPreviewZoom = () => {
  previewImageZoom.value = 1;
};

const clearLongPressTimer = () => {
  if (longPressTimer.value) {
    window.clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
};

const openMessageActionSheet = (message) => {
  actionSheetMessage.value = message || null;
  showMessageActionSheet.value = Boolean(actionSheetMessage.value);
};

const closeMessageActionSheet = () => {
  showMessageActionSheet.value = false;
  actionSheetMessage.value = null;
};

const handleMessagePressStart = (message) => {
  clearLongPressTimer();
  longPressTimer.value = window.setTimeout(() => {
    openMessageActionSheet(message);
  }, 2000);
};

const handleMessagePressEnd = () => {
  clearLongPressTimer();
};

const replyFromActionSheet = () => {
  if (actionSheetMessage.value) {
    setReplyTarget(actionSheetMessage.value);
  }
  closeMessageActionSheet();
};

const editFromActionSheet = () => {
  if (actionSheetMessage.value && Number(actionSheetMessage.value.sender_id || 0) === Number(currentUserId)) {
    setEditTarget(actionSheetMessage.value);
  }
  closeMessageActionSheet();
};

const backToGroupList = () => {
  mobileChatOpen.value = false;
  emojiPanelOpen.value = false;
  clearEditTarget();
};

const handleComposerKeydown = (event) => {
  if (event.key !== "Enter" || event.shiftKey) {
    return;
  }

  event.preventDefault();

  if (isSendingMessage.value || (!composer.value.trim() && !attachmentFile.value)) {
    return;
  }

  sendMessage();
};

const openAttachmentPicker = () => {
  emojiPanelOpen.value = false;
  attachmentInputRef.value?.click();
};

const stopRecordingTimer = () => {
  if (recordingTimer.value) {
    window.clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
};

const stopWaveformTimer = () => {
  if (waveformTimer.value) {
    window.clearInterval(waveformTimer.value);
    waveformTimer.value = null;
  }
};

const resetWaveformBars = () => {
  recordingWavePoints.value = "0,20 300,20";
};

const startWaveformTracking = () => {
  if (!analyserNode.value) {
    return;
  }

  const bins = new Uint8Array(analyserNode.value.fftSize);
  stopWaveformTimer();

  waveformTimer.value = window.setInterval(() => {
    if (!analyserNode.value) return;
    analyserNode.value.getByteTimeDomainData(bins);

    const samples = 64;
    const step = Math.max(1, Math.floor(bins.length / samples));
    const points = [];
    for (let i = 0; i < samples; i += 1) {
      const idx = i * step;
      const value = bins[idx] ?? 128;
      const normalized = (value - 128) / 128; // -1..1
      const x = (i / (samples - 1)) * 300;
      const y = 20 - normalized * 14;
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    recordingWavePoints.value = points.join(" ");
  }, 80);
};

const cleanupMediaStream = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }
};

const revokeRecordedVoiceUrl = () => {
  if (recordedVoiceUrl.value) {
    URL.revokeObjectURL(recordedVoiceUrl.value);
    recordedVoiceUrl.value = "";
  }
};

const clearAttachment = () => {
  emojiPanelOpen.value = false;
  attachmentFile.value = null;
  attachmentPreviewName.value = "";
  revokeRecordedVoiceUrl();
  stopRecordingTimer();
  stopWaveformTimer();
  resetWaveformBars();
  cleanupMediaStream();
  recordedChunks.value = [];
  recordingSeconds.value = 0;
  if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
    mediaRecorder.value.stop();
  }
  mediaRecorder.value = null;
  isRecordingVoice.value = false;
  if (sourceNode.value) {
    sourceNode.value.disconnect();
    sourceNode.value = null;
  }
  if (analyserNode.value) {
    analyserNode.value.disconnect();
    analyserNode.value = null;
  }
  if (audioContext.value) {
    audioContext.value.close();
    audioContext.value = null;
  }
};

const handleAttachmentChange = async (event) => {
  const rawFile = event.target.files?.[0] || null;
  event.target.value = "";

  if (!rawFile) {
    return;
  }

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
  if (!isRecordingVoice.value) {
    return;
  }

  if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
    mediaRecorder.value.stop();
  }
};

const toggleVoiceRecording = async () => {
  if (isRecordingVoice.value) {
    await stopVoiceRecording();
    return;
  }

  chatError.value = "";

  try {
    clearAttachment();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStream.value = stream;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext.value = new AudioContextClass();
      sourceNode.value = audioContext.value.createMediaStreamSource(stream);
      analyserNode.value = audioContext.value.createAnalyser();
      analyserNode.value.fftSize = 512;
      sourceNode.value.connect(analyserNode.value);
      startWaveformTracking();
    }
    const supportedMimeTypes = Object.keys(AUDIO_MIME_EXTENSION_MAP).filter((mimeType) => {
      try {
        return typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mimeType);
      } catch (error) {
        return false;
      }
    });

    const selectedMimeType = supportedMimeTypes[0] || "";
    const recorder = selectedMimeType
      ? new MediaRecorder(stream, { mimeType: selectedMimeType })
      : new MediaRecorder(stream);

    recordedChunks.value = [];
    recordingSeconds.value = 0;
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.value.push(event.data);
      }
    };

    recorder.onstop = () => {
      isRecordingVoice.value = false;
      stopRecordingTimer();
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
    chatError.value = "Izin mikrofon dibutuhkan untuk merekam voice note";
    cleanupMediaStream();
    isRecordingVoice.value = false;
  }
};

const resetChatIconDraft = () => {
  chatIconDraftFile.value = null;
  if (chatIconPreviewUrl.value) {
    URL.revokeObjectURL(chatIconPreviewUrl.value);
  }
  chatIconPreviewUrl.value = "";
};

const openChatIconModal = () => {
  if (role !== "GURU" || isUploadingChatIcon.value) {
    return;
  }
  showChatIconModal.value = true;
};

const closeChatIconModal = () => {
  showChatIconModal.value = false;
  resetChatIconDraft();
};

const applyUpdatedSubject = (updatedSubject) => {
  if (!updatedSubject?.id) {
    return;
  }

  subjects.value = subjects.value.map((item) =>
    Number(item.id) === Number(updatedSubject.id) ? { ...item, ...updatedSubject } : item,
  );

  if (Number(selectedSubject.value?.id) === Number(updatedSubject.id)) {
    selectedSubject.value = {
      ...selectedSubject.value,
      ...updatedSubject,
    };
  }
};

const handleChatIconFileChange = (event) => {
  const file = event.target.files?.[0] || null;
  event.target.value = "";
  if (!file) {
    return;
  }

  resetChatIconDraft();
  chatIconDraftFile.value = file;
  chatIconPreviewUrl.value = URL.createObjectURL(file);
};

const submitChatIconUpload = async () => {
  if (!chatIconDraftFile.value || !selectedSubject.value || role !== "GURU") {
    return;
  }

  isUploadingChatIcon.value = true;
  chatError.value = "";

  try {
    const formData = new FormData();
    formData.append("chat_icon", chatIconDraftFile.value);
    const response = await api.put(`/learning/subjects/${selectedSubject.value.id}/chat-icon`, formData);
    if (response?.data) {
      applyUpdatedSubject(response.data);
    }
    closeChatIconModal();
  } catch (error) {
    chatError.value = error.message;
  } finally {
    isUploadingChatIcon.value = false;
  }
};

const loadSubjects = async () => {
  subjectError.value = "";

  try {
    subjects.value = await sidebarStore.refreshLiveChatSubjects(role, { force: true });
    await refreshChatSummary();

    if (subjects.value.length === 0) {
      selectedSubject.value = null;
      mobileChatOpen.value = false;
      return;
    }

    const currentSelected = subjects.value.find((item) => Number(item.id) === Number(selectedSubject.value?.id));
    if (currentSelected) {
      selectedSubject.value = currentSelected;
      await loadMessages(currentSelected.id);
      await loadOnlineUsers(currentSelected.id);
      return;
    }

    const requestedSubjectId = Number(route.query?.subject || 0);
    if (requestedSubjectId) {
      const requestedSubject = subjects.value.find((item) => Number(item.id) === requestedSubjectId);
      if (requestedSubject) {
        selectedSubject.value = requestedSubject;
        mobileChatOpen.value = true;
        await loadMessages(requestedSubject.id);
        await loadOnlineUsers(requestedSubject.id);
        return;
      }
    }

    selectedSubject.value = null;
    mobileChatOpen.value = false;
  } catch (error) {
    subjectError.value = error.message;
  }
};

const sendMessage = async () => {
  if (!selectedSubject.value || (!composer.value.trim() && !attachmentFile.value)) {
    return;
  }

  isSendingMessage.value = true;
  chatError.value = "";

  try {
    const hasAttachment = Boolean(attachmentFile.value);
    const baseMessage = composer.value.trim();
    const replyPrefix = replyTarget.value
      ? `[Balas#${Number(replyTarget.value.id || 0)} ${replyTarget.value.sender_name || "Pengguna"}: ${getMessagePreview(replyTarget.value)}]`
      : "";
    const editPrefix = editTarget.value ? parseReplyPayload(editTarget.value.message).replyPrefix || "" : "";
    const finalMessage = [editPrefix || replyPrefix, baseMessage].filter(Boolean).join("\n");
    const shouldEdit = Boolean(editTarget.value);
    let payload = { message: finalMessage };

    if (!shouldEdit && hasAttachment) {
      const formData = new FormData();
      formData.append("message", finalMessage);
      formData.append("attachment", attachmentFile.value);
      formData.append("attachment_name", attachmentFile.value.name || "");
      formData.append("attachment_mime_type", attachmentFile.value.type || "");
      formData.append("attachment_size", String(Number(attachmentFile.value.size) || 0));
      if (String(attachmentFile.value.type || "").toLowerCase().startsWith("audio/")) {
        formData.append("message_type", "VOICE");
      }
      payload = formData;
    }

    const response = shouldEdit
      ? await api.put(`/learning/subjects/${selectedSubject.value.id}/chat/${editTarget.value.id}`, payload)
      : await api.post(`/learning/subjects/${selectedSubject.value.id}/chat`, payload);
    await sendTypingEvent(false);
    composer.value = "";
    emojiPanelOpen.value = false;
    clearReplyTarget();
    clearEditTarget();
    clearAttachment();

    if (response?.data) {
      const editedMessage = response.data;
      const existingIndex = (messagesBySubject.value[selectedSubject.value.id] || []).findIndex(
        (item) => Number(item.id) === Number(editedMessage.id),
      );
      if (existingIndex >= 0) {
        const nextMessages = [...(messagesBySubject.value[selectedSubject.value.id] || [])];
        nextMessages.splice(existingIndex, 1, editedMessage);
        messagesBySubject.value = {
          ...messagesBySubject.value,
          [selectedSubject.value.id]: sortMessages(nextMessages),
        };
      } else {
        await upsertMessage(editedMessage);
      }
      await markCurrentSubjectAsRead();
      await refreshChatSummary();
    }
  } catch (error) {
    chatError.value = error.message;
  } finally {
    isSendingMessage.value = false;
  }
};

onMounted(async () => {
  if (typeof window !== "undefined" && window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateViewportInset);
    window.visualViewport.addEventListener("scroll", updateViewportInset);
    updateViewportInset();
  }

  await nextTick();
  updateComposerBarMetrics();
  if (typeof window !== "undefined" && "ResizeObserver" in window && composerBarRef.value) {
    composerResizeObserver.value = new window.ResizeObserver(() => {
      updateComposerBarMetrics();
    });
    composerResizeObserver.value.observe(composerBarRef.value);
  }

  const token = localStorage.getItem("token");
  realtimeStore.connect(token);

  realtimeUnsubscribers.value = [
    realtimeStore.on("learning-chat:new-message", async (chatMessage) => {
      await upsertMessage(chatMessage);
      const incomingSubjectId = Number(chatMessage?.subject_id || 0);
      const isCurrentSubject = Number(selectedSubject.value?.id || 0) === incomingSubjectId;
      const isFromCurrentUser = Number(chatMessage?.sender_id || 0) === Number(currentUserId);

      if (isCurrentSubject && !isFromCurrentUser) {
        await markCurrentSubjectAsRead();
        await refreshChatSummary();
      } else if (!isCurrentSubject && !isFromCurrentUser && incomingSubjectId) {
        const currentState = chatSummaryBySubject.value[incomingSubjectId] || {};
        chatSummaryBySubject.value = {
          ...chatSummaryBySubject.value,
          [incomingSubjectId]: {
            ...currentState,
            unread_count: Number(currentState.unread_count || 0) + 1,
          },
        };
      } else {
        await refreshChatSummary();
      }
    }),
    realtimeStore.on("learning-chat:message-updated", async (chatMessage) => {
      const subjectId = Number(chatMessage?.subject_id || 0);
      const activeSubjectId = Number(selectedSubject.value?.id || 0);
      await refreshChatSummary();
      if (!subjectId || subjectId !== activeSubjectId) {
        return;
      }

      const existingIndex = (messagesBySubject.value[subjectId] || []).findIndex((item) => Number(item.id) === Number(chatMessage?.id || 0));
      if (existingIndex >= 0) {
        const nextMessages = [...(messagesBySubject.value[subjectId] || [])];
        nextMessages.splice(existingIndex, 1, chatMessage);
        messagesBySubject.value = {
          ...messagesBySubject.value,
          [subjectId]: sortMessages(nextMessages),
        };
      }
    }),
    realtimeStore.on("learning-chat:read-updated", async (payload) => {
      const subjectId = Number(payload?.subject_id || 0);
      if (!subjectId) {
        return;
      }

      if (Number(payload?.user_id || 0) === Number(currentUserId)) {
        return;
      }

      if (Number(selectedSubject.value?.id || 0) === subjectId) {
        await loadMessages(subjectId);
      } else {
        await refreshChatSummary();
      }
    }),
    realtimeStore.on("learning-chat:typing", async (payload) => {
      const subjectId = Number(payload?.subject_id || 0);
      const typingUserId = Number(payload?.user_id || 0);
      const isTyping = Boolean(payload?.is_typing);
      if (!subjectId || !typingUserId || typingUserId === Number(currentUserId)) {
        return;
      }
      if (String(payload?.origin_client_id || "") === localClientId.value) {
        return;
      }

      const subjectTyping = { ...(typingStateBySubject.value[subjectId] || {}) };
      if (isTyping) {
        subjectTyping[typingUserId] = {
          sender_name: payload?.sender_name || payload?.username || "Pengguna",
          updated_at_unixms: Number(payload?.updated_at_unixms || Date.now()),
        };
      } else {
        delete subjectTyping[typingUserId];
      }

      typingStateBySubject.value = {
        ...typingStateBySubject.value,
        [subjectId]: subjectTyping,
      };
    }),
    realtimeStore.on("learning-presence:updated", async () => {
      const subjectId = Number(selectedSubject.value?.id || 0);
      if (!subjectId) return;
      if (onlineRefreshTimer.value) {
        window.clearTimeout(onlineRefreshTimer.value);
      }
      onlineRefreshTimer.value = window.setTimeout(() => {
        loadOnlineUsers(subjectId);
      }, 250);
    }),
  ];

  await loadSubjects();
});

onUnmounted(() => {
  sendTypingEvent(false);
  if (typingStopTimer.value) {
    window.clearTimeout(typingStopTimer.value);
  }
  if (typingDebounceTimer.value) {
    window.clearTimeout(typingDebounceTimer.value);
  }
  if (onlineRefreshTimer.value) {
    window.clearTimeout(onlineRefreshTimer.value);
  }
  leaveSubjectRoom(selectedSubject.value?.id);
  closeChatIconModal();
  clearAttachment();
  stopWaveformTimer();
  realtimeUnsubscribers.value.forEach((unsubscribe) => {
    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  });
  realtimeUnsubscribers.value = [];

  if (typeof window !== "undefined" && window.visualViewport) {
    window.visualViewport.removeEventListener("resize", updateViewportInset);
    window.visualViewport.removeEventListener("scroll", updateViewportInset);
  }
  if (composerResizeObserver.value) {
    composerResizeObserver.value.disconnect();
    composerResizeObserver.value = null;
  }
});

watch(subjectError, (value) => {
  if (!value) return;
  pushToast({ title: "Gagal Memuat Grup Chat", message: value, type: "error" });
});

watch(chatError, (value) => {
  if (!value) return;
  pushToast({ title: "Chat Gagal", message: value, type: "error" });
});

watch(
  () => route.query?.subject,
  async (value) => {
    const subjectId = Number(value || 0);
    if (!subjectId || !subjects.value.length) {
      return;
    }
    if (Number(selectedSubject.value?.id || 0) === subjectId) {
      return;
    }
    const subject = subjects.value.find((item) => Number(item.id) === subjectId);
    if (!subject) {
      return;
    }
    await selectSubject(subject);
  },
);
</script>

<style scoped>
.learning-chat-wallpaper {
  background-color: #efeae2;
  background-image:
    linear-gradient(rgba(239, 234, 226, 0.88), rgba(239, 234, 226, 0.88)),
    radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.05) 0 1px, transparent 1.5px),
    radial-gradient(circle at 70% 60%, rgba(0, 0, 0, 0.05) 0 1px, transparent 1.5px);
  background-size: auto, 34px 34px, 42px 42px;
}

:global(.dark) .learning-chat-wallpaper {
  background-color: #0b141a;
  background-image:
    linear-gradient(rgba(11, 20, 26, 0.9), rgba(11, 20, 26, 0.9)),
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0 1px, transparent 1.5px),
    radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.05) 0 1px, transparent 1.5px);
}

.learning-message-bubble {
  max-width: min(78%, 680px);
  border-radius: 7.5px;
}

.learning-message-bubble.own {
  border-top-right-radius: 2px;
}

.learning-message-bubble.other {
  border-top-left-radius: 2px;
}

.learning-message-bubble.own::after,
.learning-message-bubble.other::after {
  content: "";
  position: absolute;
  top: 0;
  width: 0;
  height: 0;
  border-top: 8px solid currentColor;
}

.learning-message-bubble.own::after {
  right: -7px;
  color: #d9fdd3;
  border-right: 8px solid transparent;
}

.learning-message-bubble.other::after {
  left: -7px;
  color: #ffffff;
  border-left: 8px solid transparent;
}

:global(.dark) .learning-message-bubble.own::after {
  color: #005c4b;
}

:global(.dark) .learning-message-bubble.other::after {
  color: #202c33;
}

@media (max-width: 767px) {
  .learning-message-bubble {
    max-width: 88%;
  }
}
</style>
