<template>
  <div class="min-h-0 overflow-hidden text-[#111b21] dark:text-[#e9edef]" :class="unifiedMode ? 'contents' : 'h-full dark:bg-[#0b141a]'">
    <main class="mx-auto flex min-h-0 w-full flex-col" :class="unifiedMode ? 'contents' : 'h-full p-0 lg:p-5'">
      <div class="min-h-0 overflow-hidden shadow-sm" :class="unifiedMode ? 'contents' : 'flex-1 bg-white dark:bg-[#111b21] lg:rounded-md'">
        <div class="min-h-0" :class="unifiedMode ? 'contents' : 'grid h-full lg:grid-cols-[390px_minmax(0,1fr)]'">
          <aside v-if="!unifiedMode"
            class="flex min-h-0 flex-col border-r border-[#e9edef] bg-white dark:border-[#222e35] dark:bg-[#111b21]"
            :class="{ hidden: mobileChatOpen, 'lg:flex': true }">
            <header class="flex h-[59px] shrink-0 items-center justify-between bg-[#f0f2f5] px-4 dark:bg-[#202c33]">
              <div class="flex min-w-0 items-center gap-3">
                <button type="button"
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                  aria-label="Kembali ke dashboard" @click="backToDashboard">
                  <Icon icon="mdi:arrow-left" class="h-5 w-5" />
                </button>
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
                class="group flex min-h-[72px] w-full items-center gap-3 px-3 text-left transition" :class="selectedPeer?.user_id === peer.user_id
                  ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
                  : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'">
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dfe5e7] text-base font-semibold text-[#54656f] dark:bg-[#2a3942] dark:text-[#d1d7db]">
                  <img v-if="peer.profile_image" :src="normalizePublicUrl(peer.profile_image)"
                    :alt="displayPeerName(peer)" class="h-full w-full object-cover" />
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
                {{
                  search.trim() ? "Kontak tidak ditemukan." : "Belum ada riwayat chat. Cari nama untuk mulaipercakapan."
                }}
              </div>
            </div>
          </aside>

          <section
            class="flex min-h-0 flex-col overflow-hidden bg-[#efeae2] private-chat-wallpaper dark:bg-[#0b141a]"
            :class="unifiedMode ? 'flex-1 w-full' : 'h-full ' + (mobileChatOpen ? '' : 'hidden lg:flex')">
            <template v-if="selectedPeer">
              <header class="z-10 flex h-[59px] shrink-0 items-center gap-3 bg-[#f0f2f5] px-3 dark:bg-[#202c33]">
                <button type="button"
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10 lg:hidden"
                  @click="unifiedMode ? emit('back') : backToPeerList">
                  <Icon icon="mdi:arrow-left" class="h-6 w-6" />
                </button>
                <button type="button" @click="openPeerProfile" class="flex min-w-0 flex-1 items-center gap-3 text-left">
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
                </button>
                <button type="button"
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white transition hover:bg-[#20c15a] disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!selectedPeer || callState !== 'idle'"
                  @click="startVoiceCall">
                  <Icon icon="ph:phone-fill" class="h-4 w-4" />
                </button>
              </header>

              <div ref="messageListRef" :style="messageListStyle"
                class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 md:px-14">
                <div v-if="isLoadingMessages" class="flex h-full min-h-[420px] items-center justify-center">
                  <div
                    class="rounded-lg bg-white/80 px-4 py-2 text-sm text-[#667781] shadow-sm dark:bg-[#202c33]/90 dark:text-[#8696a0]">
                    Memuat pesan...
                  </div>
                </div>

                <div v-else-if="renderedMessages.length === 0"
                  class="flex h-full min-h-[420px] items-center justify-center">
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
                      <article
                        class="message-bubble relative px-2.5 py-1.5 text-sm leading-5 shadow-sm transition-transform duration-150"
                        :data-message-id="entry.message.id" :class="[
                          isOwnMessage(entry.message)
                            ? 'own bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef]'
                            : 'other bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef]',
                          replyHighlightMessageId === entry.message.id ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-transparent' : '',
                        ]" @touchstart.passive="handleMessagePressStart(entry.message, $event)"
                        @touchmove.passive="handleMessagePressMove(entry.message, $event)"
                        @touchend="handleMessagePressEnd(entry.message)" @touchcancel="handleMessagePressEnd">
                        <div v-if="entry.parsedReply.replyName"
                          class="mb-2 cursor-pointer rounded-lg border-l-4 border-sky-400/80 bg-black/5 px-3 py-2 text-[12px] leading-5 dark:bg-white/10"
                          @click="jumpToReplyTarget(entry.message)">
                          <p class="font-semibold text-sky-700 dark:text-sky-300">{{ entry.parsedReply.replyName }}</p>
                          <p class="line-clamp-2 text-[#54656f] dark:text-[#aebac1]">
                            {{ entry.parsedReply.replyPreview }}
                          </p>
                        </div>
                        <p v-if="entry.parsedReply.body" class="whitespace-pre-wrap break-words pr-12">{{
                          entry.parsedReply.body }}</p>
                        <div v-if="entry.message.attachment_url" class="mt-2">
                          <audio v-if="isVoiceMessage(entry.message)"
                            :src="normalizePublicUrl(entry.message.attachment_url)" controls class="w-full max-w-sm" />
                          <button v-else-if="isRenderableImageMessage(entry.message)" type="button"
                            class="block w-full overflow-hidden rounded-md text-left"
                            @click="openImagePreview(entry.message)">
                            <img :src="normalizePublicUrl(entry.message.attachment_url)"
                              :alt="entry.message.attachment_name || 'Lampiran gambar'"
                              class="max-h-72 w-full object-cover" />
                          </button>
                          <button v-else-if="isPdfPreviewMessage(entry.message)" type="button"
                            class="block w-full overflow-hidden rounded-md border border-black/10 bg-white text-left shadow-sm dark:border-white/10 dark:bg-[#202c33]"
                            @click="openAttachment(entry.message)">
                            <img :src="normalizePublicUrl(entry.message.attachment_preview_url)"
                              :alt="entry.message.attachment_name || 'Pratinjau PDF'"
                              class="max-h-60 w-full object-contain bg-white" />
                            <div
                              class="flex items-center gap-3 border-t border-black/5 px-3 py-2 text-sm font-semibold text-[#111b21] dark:border-white/10 dark:text-[#e9edef]">
                              <Icon icon="ph:file-pdf" class="h-5 w-5 shrink-0 text-[#ef4444]" />
                              <span class="truncate">{{ entry.message.attachment_name || "Buka PDF" }}</span>
                            </div>
                          </button>
                          <a v-else :href="normalizePublicUrl(entry.message.attachment_url)" target="_blank"
                            rel="noreferrer"
                            class="flex items-center gap-3 rounded-md bg-black/5 px-3 py-2 text-sm font-semibold hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15">
                            <Icon :icon="entry.message.message_type === 'PDF' ? 'ph:file-pdf' : 'ph:paperclip'"
                              class="h-5 w-5 shrink-0" />
                            <span class="truncate">{{ entry.message.attachment_name || "Buka file" }}</span>
                          </a>
                        </div>
                        <div class="-mb-0.5 mt-0.5 flex items-center justify-end gap-1 pl-8 text-[11px] leading-none"
                          :class="isOwnMessage(entry.message) ? 'text-[#667781] dark:text-[#aebac1]' : 'text-[#667781] dark:text-[#8696a0]'">
                          <time>{{ formatMessageTime(entry.message.created_at) }}</time>
                          <span v-if="entry.message.edited_at"
                            class="text-[10px] font-medium uppercase tracking-wide opacity-80">Diedit</span>
                          <Icon v-if="isOwnMessage(entry.message)" :icon="ownReadIcon(entry.message)" class="h-4 w-4"
                            :class="ownReadIconClass(entry.message)" />
                        </div>
                      </article>
                    </div>
                  </template>
                </div>
                <div ref="bottomAnchorRef" class="h-px w-full"></div>
              </div>

              <form ref="composerBarRef" @submit.prevent="sendMessage"
                class="fixed inset-x-0 z-20 shrink-0 bg-[#f0f2f5] px-3 py-2 dark:bg-[#202c33] md:sticky md:inset-auto md:px-4"
                :style="composerBarStyle">
                <div v-if="editTarget"
                  class="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm shadow-sm dark:border-amber-900/50 dark:bg-amber-500/10">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                        Mengedit</p>
                      <p class="mt-1 truncate font-semibold text-[#111b21] dark:text-[#e9edef]">
                        {{ editTarget.sender_name || "Pengguna" }}
                      </p>
                      <p class="mt-1 line-clamp-2 text-[#54656f] dark:text-[#aebac1]">
                        {{ getMessagePreview(editTarget) }}
                      </p>
                    </div>
                    <button type="button"
                      class="rounded-full p-1 text-[#667781] hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                      @click="clearEditTarget">
                      <Icon icon="mdi:close" class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div v-if="replyTarget"
                  class="mb-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm shadow-sm dark:border-sky-900/50 dark:bg-sky-500/10">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Membalas
                      </p>
                      <button type="button" class="mt-1 block w-full text-left"
                        @click="scrollToMessageId(replyTarget.id)">
                        <p class="truncate font-semibold text-[#111b21] dark:text-[#e9edef]">
                          {{ replyTarget.sender_name || "Pengguna" }}
                        </p>
                        <p class="mt-1 line-clamp-2 text-[#54656f] dark:text-[#aebac1]">
                          {{ getMessagePreview(replyTarget) }}
                        </p>
                      </button>
                    </div>
                    <button type="button"
                      class="rounded-full p-1 text-[#667781] hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                      @click="clearReplyTarget">
                      <Icon icon="mdi:close" class="h-5 w-5" />
                    </button>
                  </div>
                </div>
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
                      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Emoji</p>
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
                    :disabled="isSendingMessage || isRecordingVoice || Boolean(editTarget)"
                    @click="openAttachmentPicker">
                    <Icon icon="mdi:paperclip" class="h-6 w-6" />
                  </button>
                  <div class="mb-1 flex min-h-10 flex-1 items-center rounded-lg bg-white px-3 dark:bg-[#2a3942]">
                    <textarea v-model="composer" rows="1" placeholder="Ketik pesan" @input="resizeComposer"
                      @focus="ensureComposerVisible" @keydown="handleComposerKeydown"
                      class="block max-h-28 min-h-[24px] w-full resize-none overflow-y-auto border-0 bg-transparent py-2 text-[15px] leading-6 text-[#111b21] outline-none placeholder:text-[#667781] dark:text-[#e9edef] dark:placeholder:text-[#8696a0]" />
                  </div>
                  <button v-if="!composer.trim() && !attachmentFile && !editTarget" type="button"
                    :disabled="isSendingMessage"
                    class="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition text-[#54656f] hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/10"
                    :class="isRecordingVoice ? 'bg-rose-500 text-white hover:bg-rose-400 dark:text-white' : ''"
                    @click="toggleVoiceRecording">
                    <Icon :icon="isRecordingVoice ? 'ph:stop-fill' : 'mdi:microphone'" class="h-5 w-5" />
                  </button>
                  <button v-else type="submit" :disabled="isSendingMessage"
                    class="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white transition hover:bg-[#008f72] disabled:opacity-50">
                    <Icon :icon="editTarget ? 'mdi:check' : 'mdi:send'" class="h-5 w-5" />
                  </button>
                </div>
              </form>
              <input ref="attachmentInputRef" type="file" class="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,audio/*"
                @change="handleAttachmentChange" />
            </template>

            <div v-else
              class="hidden h-full min-h-[560px] items-center justify-center bg-[#f0f2f5] px-8 dark:bg-[#222e35] lg:flex">
              <div class="max-w-md text-center">
                <div
                  class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#d9dbd5] dark:bg-[#111b21]">
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
    <div v-if="showPdfPreview" class="fixed inset-0 z-[85] bg-black/90" @click="closePdfPreview">
      <div class="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-3">
        <p class="truncate text-xs font-semibold text-white/80">{{ previewPdfName || "Preview PDF" }}</p>
        <div class="flex items-center gap-2">
          <a v-if="previewPdfUrl" :href="previewPdfUrl" :download="previewPdfName || 'preview.pdf'"
            class="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/25" @click.stop>
            Unduh
          </a>
          <button type="button" @click.stop="closePdfPreview"
            class="rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <Icon icon="mdi:close" class="h-5 w-5" />
          </button>
        </div>
      </div>
      <div class="flex h-full w-full items-center justify-center overflow-auto p-4 pt-16">
        <iframe v-if="previewPdfUrl" :src="previewPdfUrl"
          class="h-[85vh] w-full max-w-5xl rounded-2xl bg-white shadow-2xl" title="Preview PDF" />
      </div>
    </div>

    <div v-if="showProfileModal" class="fixed inset-0 z-[86] bg-black/45" @click="closePeerProfile">
      <div
        class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 shadow-2xl dark:bg-slate-900 sm:mx-auto sm:my-16 sm:inset-auto sm:w-full sm:max-w-md sm:rounded-2xl"
        @click.stop>
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-semibold text-slate-900 dark:text-white">Profil Warga</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Informasi akun yang sedang dibuka.</p>
          </div>
          <button type="button" @click="closePeerProfile"
            class="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <Icon icon="mdi:close" class="h-5 w-5" />
          </button>
        </div>

        <div class="mt-4 flex items-center gap-4">
          <div
            class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dfe5e7] text-xl font-semibold text-[#54656f] dark:bg-[#2a3942] dark:text-[#d1d7db]">
            <img v-if="selectedPeer?.profile_image" :src="normalizePublicUrl(selectedPeer.profile_image)"
              :alt="displayPeerName(selectedPeer)" class="h-full w-full object-cover" />
            <span v-else>{{ peerInitial(selectedPeer) }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="truncate text-lg font-semibold text-slate-900 dark:text-white">{{ displayPeerName(selectedPeer)
            }}
            </h4>
            <p class="truncate text-sm text-slate-500 dark:text-slate-400">@{{ selectedPeer?.username || "-" }}</p>
          </div>
        </div>

        <div class="mt-4 space-y-3">
          <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Role</p>
            <p class="mt-1 text-sm font-medium text-slate-900 dark:text-white">{{ selectedPeer?.role || "-" }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Kelas</p>
            <p class="mt-1 text-sm font-medium text-slate-900 dark:text-white">{{ selectedPeer?.class_name || "-" }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Nama Lengkap</p>
            <p class="mt-1 text-sm font-medium text-slate-900 dark:text-white">{{ displayPeerName(selectedPeer) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showMessageActionSheet" class="fixed inset-0 z-[87] bg-black/45" @click="closeMessageActionSheet">
      <div class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 shadow-2xl dark:bg-slate-900" @click.stop>
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Aksi Pesan</p>
        <button type="button" @click="replyFromActionSheet"
          class="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
          Balas Chat
          <Icon icon="mdi:reply-outline" class="h-5 w-5" />
        </button>
        <button v-if="actionSheetMessage && isOwnMessage(actionSheetMessage)" type="button" @click="editFromActionSheet"
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

    <div v-if="callState !== 'idle' || incomingCall" class="fixed inset-0 z-[90] flex items-center justify-center bg-[#111b21]/90 px-4 py-6 backdrop-blur-sm"
      @click.self="callState === 'incoming' ? rejectIncomingCall() : null">
      <div class="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b141a] text-white shadow-2xl">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,211,102,0.28),_transparent_45%),linear-gradient(180deg,rgba(17,27,33,0.98),rgba(11,20,26,0.98))]"></div>
        <div class="relative p-6">
          <div class="flex items-center justify-between">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <span class="h-2 w-2 rounded-full" :class="callState === 'active' ? 'bg-emerald-400' : callState === 'incoming' ? 'bg-amber-400 animate-pulse' : 'bg-sky-400 animate-pulse'"></span>
              {{ callStateLabel }}
            </div>
            <button v-if="callState === 'active'" type="button"
              class="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/15"
              @click="toggleMute">
              <Icon :icon="isCallMuted ? 'ph:microphone-slash-fill' : 'ph:microphone-fill'" class="h-5 w-5" />
            </button>
          </div>

          <div class="mt-10 flex flex-col items-center text-center">
            <div class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 shadow-lg">
              <img v-if="callPeerAvatar" :src="callPeerAvatar" :alt="callPeerName" class="h-full w-full object-cover" />
              <span v-else class="text-3xl font-semibold">{{ callPeerInitial }}</span>
            </div>
            <h3 class="mt-6 text-2xl font-semibold tracking-tight">{{ callPeerName || "Panggilan suara" }}</h3>
            <p class="mt-2 text-sm text-white/65">
              {{ callStatusMessage }}
            </p>
            <p v-if="callState === 'active'" class="mt-3 text-sm font-medium text-emerald-300">
              {{ callDurationLabel }}
            </p>
          </div>

          <div class="mt-8 flex items-center justify-center gap-4">
            <button v-if="callState === 'incoming'" type="button"
              class="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition hover:bg-rose-400"
              @click="rejectIncomingCall">
              <Icon icon="ph:phone-x-fill" class="h-6 w-6" />
            </button>
            <button v-if="callState === 'incoming'" type="button"
              class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:bg-emerald-400"
              @click="acceptIncomingCall">
              <Icon icon="ph:phone-call-fill" class="h-6 w-6" />
            </button>
            <button v-if="callState === 'dialing'" type="button"
              class="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition hover:bg-rose-400"
              @click="endVoiceCall">
              <Icon icon="ph:phone-x-fill" class="h-6 w-6" />
            </button>
            <button v-if="callState === 'connecting' || callState === 'active'" type="button"
              class="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition hover:bg-rose-400"
              @click="endVoiceCall">
              <Icon icon="ph:phone-x-fill" class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <audio ref="remoteAudioRef" autoplay playsinline class="hidden"></audio>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { convertHeicToJpegIfPossible } from "@/utils/fileImage";
import { formatChatDateKey, formatChatDateSeparator, formatChatShortDate, formatChatTime, parseDateValue } from "@/utils/date";
import { normalizePublicUrl } from "@/utils/url";
import { useRealtimeStore } from "@/store/realtime";
import { useSidebar } from "@/store/sidebar";

const props = defineProps({
  unifiedMode: { type: Boolean, default: false },
  activePeerId: { type: Number, default: null }
});

const emit = defineEmits(['back']);

const route = useRoute();
const router = useRouter();
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
const bottomAnchorRef = ref(null);
const composerBarRef = ref(null);
const attachmentInputRef = ref(null);
const attachmentFile = ref(null);
const attachmentPreviewName = ref("");
const recordedVoiceUrl = ref("");
const remoteAudioRef = ref(null);
const callState = ref("idle");
const incomingCall = ref(null);
const callPeerInfo = ref(null);
const callCallId = ref("");
const callPeerConnection = ref(null);
const callLocalStream = ref(null);
const callPendingCandidates = ref([]);
const callMuted = ref(false);
const callTimer = ref(null);
const callSeconds = ref(0);
const callTurnServers = ref([]);
const callTurnServersLoadedAt = ref(0);
const callTeardownInProgress = ref(false);
const callToneAudioContext = ref(null);
const callToneTimer = ref(null);
const showPdfPreview = ref(false);
const previewPdfUrl = ref("");
const previewPdfName = ref("");
const showProfileModal = ref(false);
const replyTarget = ref(null);
const replyHighlightMessageId = ref(null);
const showMessageActionSheet = ref(false);
const actionSheetMessage = ref(null);
const editTarget = ref(null);
const longPressTimer = ref(null);
const touchStartPoint = ref({ x: 0, y: 0 });
const touchCanReply = ref(false);
const touchedMessageId = ref(null);
const touchActionHandled = ref(false);
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
const viewportBottomInset = ref(0);
const isMobileViewport = ref(false);
const composerBarHeight = ref(0);
const composerResizeObserver = ref(null);
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

const backToDashboard = () => router.replace("/dashboard");

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

const displayPeerName = (peer) => String(peer?.full_name || peer?.username || "Pengguna");
const peerInitial = (peer) => displayPeerName(peer).trim().charAt(0).toUpperCase() || "?";
const peerMeta = (peer) => [peer?.role, peer?.class_name].filter(Boolean).join(" • ") || "Warga sekolah";
const truncatePreview = (value, limit = 46) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
};

const formatMessageTime = (value) => {
  return formatChatTime(value);
};

const formatPeerTime = (value) => {
  if (!value) return "";

  const dateKey = formatChatDateKey(value);
  if (!dateKey) return "";

  const todayKey = formatChatDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatChatDateKey(yesterday);

  if (dateKey === todayKey) {
    return formatMessageTime(value);
  }
  if (dateKey === yesterdayKey) {
    return "Kemarin";
  }
  return formatChatShortDate(value);
};

const formatDateSeparator = (value) => {
  return formatChatDateSeparator(value);
};

const latestPeerPreview = (peer) => {
  let preview = String(peer?.last_message || "").trim();
  if (preview) {
    const parsed = parseReplyPayload(preview);
    preview = parsed.body || preview;
    if (Number(peer?.last_sender_id || 0) === Number(currentUserId)) {
      return truncatePreview(`Anda: ${preview}`);
    }
    return truncatePreview(preview);
  }
  return search.value.trim() ? "Mulai chat pribadi" : "Belum ada pesan";
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

const isOwnMessage = (message) => Number(message?.sender_id || 0) === Number(currentUserId);

const getMessagePreview = (message) => {
  if (!message) return "-";
  const parsed = parseReplyPayload(message?.message);
  if (parsed.body) {
    return String(parsed.body).replace(/\s+/g, " ").slice(0, 120);
  }
  if (String(message?.message_type || "").toUpperCase() === "VOICE") return "Voice note";
  if (String(message?.message_type || "").toUpperCase() === "IMAGE") return "Gambar";
  if (message?.attachment_preview_url) return "PDF";
  if (message?.attachment_name) return message.attachment_name;
  return "Pesan";
};

const scrollToMessageId = async (messageId) => {
  const normalizedMessageId = Number(messageId || 0);
  if (!normalizedMessageId) {
    return false;
  }

  await nextTick();
  const target = messageListRef.value?.querySelector?.(`[data-message-id="${normalizedMessageId}"]`);
  if (!target) {
    return false;
  }

  target.scrollIntoView({ behavior: "smooth", block: "center" });
  replyHighlightMessageId.value = normalizedMessageId;
  window.setTimeout(() => {
    if (replyHighlightMessageId.value === normalizedMessageId) {
      replyHighlightMessageId.value = null;
    }
  }, 1600);
  return true;
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

  const found = await scrollToMessageId(replyId);
  if (!found) {
    pushToast({
      title: "Pesan Asal Tidak Tersedia",
      message: "Pesan asal kemungkinan di luar riwayat yang sedang dimuat.",
      type: "info",
    });
    return;
  }
};

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

const callPeer = computed(() => {
  if (callPeerInfo.value) {
    return callPeerInfo.value;
  }
  return selectedPeer.value || null;
});

const callPeerName = computed(() => displayPeerName(callPeer.value || {}));
const callPeerAvatar = computed(() => {
  const image = String(callPeer.value?.profile_image || "").trim();
  return image ? normalizePublicUrl(image) : "";
});
const callPeerInitial = computed(() => peerInitial(callPeer.value || {}));
const callStateLabel = computed(() => {
  switch (callState.value) {
    case "incoming":
      return "Panggilan masuk";
    case "dialing":
      return "Memanggil";
    case "connecting":
      return "Menyambungkan";
    case "active":
      return "Sedang menelepon";
    default:
      return "Panggilan";
  }
});
const callStatusMessage = computed(() => {
  switch (callState.value) {
    case "incoming":
      return "Ada panggilan suara masuk. Terima atau tolak.";
    case "dialing":
      return "Menunggu jawaban dari lawan bicara.";
    case "connecting":
      return "Menghubungkan audio...";
    case "active":
      return "Panggilan suara tersambung.";
    default:
      return "Siap memulai panggilan suara.";
  }
});
const callDurationLabel = computed(() => {
  const totalSeconds = Math.max(0, Number(callSeconds.value || 0));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const composerBarStyle = computed(() => ({
  bottom: `${viewportBottomInset.value}px`,
  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
}));

const messageListStyle = computed(() => ({
  paddingBottom: `calc(${viewportBottomInset.value}px + env(safe-area-inset-bottom, 0px) + ${Math.max(composerBarHeight.value, 104) + 24}px)`,
}));

const renderedMessages = computed(() => {
  const entries = [];
  let lastDateKey = "";

  messages.value.forEach((message) => {
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
      parsedReply: parseReplyPayload(message?.message),
    });
  });

  return entries;
});

const sortPeers = (items = []) =>
  [...items].sort((left, right) => {
    const leftTime = parseDateValue(left?.last_message_at)?.getTime() || 0;
    const rightTime = parseDateValue(right?.last_message_at)?.getTime() || 0;
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
  await new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });

  if (bottomAnchorRef.value) {
    bottomAnchorRef.value.scrollIntoView({ block: "end" });
    return;
  }

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

const isPdfPreviewMessage = (message) => {
  return Boolean(message?.attachment_preview_url);
};

const openImagePreview = (message) => {
  const url = normalizePublicUrl(message?.attachment_url);
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

const openAttachment = (message) => {
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

const openPeerProfile = () => {
  if (!selectedPeer.value) {
    return;
  }
  showProfileModal.value = true;
};

const closePeerProfile = () => {
  showProfileModal.value = false;
};

const findPeerByUserId = (userId) => {
  const normalizedUserId = Number(userId || 0);
  if (!normalizedUserId) {
    return null;
  }

  return peers.value.find((item) => Number(item.user_id) === normalizedUserId) || null;
};

const setCallPeerInfo = (payload = {}) => {
  const peerId = Number(payload?.from_user_id || payload?.peer_user_id || payload?.to_user_id || 0);
  const existingPeer = findPeerByUserId(peerId);
  callPeerInfo.value = existingPeer || {
    user_id: peerId,
    username: payload?.peer_username || payload?.from_username || "",
    full_name: payload?.peer_full_name || payload?.from_full_name || payload?.sender_full_name || payload?.peer_username || "Pengguna",
    profile_image: payload?.peer_profile_image || payload?.from_profile_image || "",
    role: payload?.peer_role || payload?.from_role || "",
    class_name: payload?.peer_class_name || "",
  };
  return callPeerInfo.value;
};

const clearCallTimer = () => {
  if (callTimer.value) {
    window.clearInterval(callTimer.value);
    callTimer.value = null;
  }
  callSeconds.value = 0;
};

const stopCallStream = () => {
  if (callLocalStream.value) {
    callLocalStream.value.getTracks().forEach((track) => track.stop());
    callLocalStream.value = null;
  }
};

const closePeerConnection = () => {
  if (callPeerConnection.value) {
    try {
      callPeerConnection.value.ontrack = null;
      callPeerConnection.value.onicecandidate = null;
      callPeerConnection.value.onconnectionstatechange = null;
      callPeerConnection.value.close();
    } catch (error) {
      // Ignore closing failures.
    }
  }
  callPeerConnection.value = null;
};

const stopCallTone = () => {
  if (callToneTimer.value) {
    window.clearTimeout(callToneTimer.value);
    callToneTimer.value = null;
  }

  if (callToneAudioContext.value) {
    try {
      callToneAudioContext.value.close?.();
    } catch (error) {
      // ignore
    }
    callToneAudioContext.value = null;
  }
};

const scheduleToneBurst = (audioContext, bursts, onComplete) => {
  if (!audioContext || audioContext.state === "closed" || !Array.isArray(bursts) || bursts.length === 0) {
    if (typeof onComplete === "function") {
      onComplete();
    }
    return;
  }

  const now = audioContext.currentTime;
  let offset = 0;

  bursts.forEach((burst) => {
    const frequency = Number(burst?.frequency || 0);
    const durationMs = Math.max(40, Number(burst?.durationMs || 0));
    const gapMs = Math.max(0, Number(burst?.gapMs || 0));
    const volume = Math.min(0.16, Math.max(0.02, Number(burst?.volume || 0.08)));
    if (!frequency) {
      offset += (durationMs + gapMs) / 1000;
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now + offset);
    gainNode.gain.setValueAtTime(0.0001, now + offset);
    gainNode.gain.exponentialRampToValueAtTime(volume, now + offset + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + offset + durationMs / 1000);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(now + offset);
    oscillator.stop(now + offset + durationMs / 1000 + 0.03);
    offset += (durationMs + gapMs) / 1000;
  });

  callToneTimer.value = window.setTimeout(() => {
    if (typeof onComplete === "function") {
      onComplete();
    }
  }, Math.max(0, offset * 1000));
};

const startCallTone = (mode) => {
  stopCallTone();

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();
  callToneAudioContext.value = audioContext;

  const incomingPattern = [
    { frequency: 880, durationMs: 220, gapMs: 120, volume: 0.06 },
    { frequency: 660, durationMs: 220, gapMs: 110, volume: 0.06 },
  ];
  const ringbackPattern = [
    { frequency: 440, durationMs: 400, gapMs: 100, volume: 0.05 },
    { frequency: 480, durationMs: 400, gapMs: 3000, volume: 0.05 },
  ];

  const pattern = mode === "incoming" ? incomingPattern : ringbackPattern;
  const loop = () => {
    if (!callToneAudioContext.value || callToneAudioContext.value.state === "closed") {
      return;
    }
    scheduleToneBurst(callToneAudioContext.value, pattern, loop);
  };

  loop();
};

const resetCallSession = (keepSelectedPeer = false) => {
  callTeardownInProgress.value = true;
  stopCallTone();
  clearCallTimer();
  callPendingCandidates.value = [];
  callCallId.value = "";
  callMuted.value = false;
  closePeerConnection();
  stopCallStream();
  if (remoteAudioRef.value) {
    remoteAudioRef.value.srcObject = null;
  }
  if (!keepSelectedPeer) {
    callPeerInfo.value = null;
  }
  incomingCall.value = null;
  if (callState.value !== "idle") {
    callState.value = "idle";
  }
  callTeardownInProgress.value = false;
};

const loadTurnIceServers = async () => {
  const now = Date.now();
  if (callTurnServers.value.length > 0 && now - Number(callTurnServersLoadedAt.value || 0) < 45 * 60 * 1000) {
    return callTurnServers.value;
  }

  const response = await api.get("/private-chat/turn/ice-servers");
  const iceServers = Array.isArray(response?.data?.ice_servers) ? response.data.ice_servers : [];
  if (iceServers.length === 0) {
    throw new Error("TURN server tidak tersedia");
  }

  callTurnServers.value = iceServers;
  callTurnServersLoadedAt.value = now;
  return iceServers;
};

const normalizeIceCandidate = (candidate) => {
  if (!candidate) {
    return null;
  }

  if (typeof candidate.toJSON === "function") {
    return candidate.toJSON();
  }

  if (typeof candidate === "object") {
    return {
      candidate: candidate.candidate || candidate.candidateLine || "",
      sdpMid: candidate.sdpMid || null,
      sdpMLineIndex: candidate.sdpMLineIndex ?? null,
      usernameFragment: candidate.usernameFragment || candidate.ufrag || null,
    };
  }

  return candidate;
};

const sendCallSignal = async (signalType, extraPayload = {}) => {
  const peerId = Number(callPeer.value?.user_id || selectedPeer.value?.user_id || 0);
  const callId = String(callCallId.value || extraPayload.call_id || "").trim();
  if (!peerId || !callId) {
    return null;
  }

  const response = await api.post(`/private-chat/${peerId}/calls/${callId}/signal`, {
    signal_type: signalType,
    client_id: localClientId.value,
    ...extraPayload,
  });
  return response?.data || null;
};

const createCallPeerConnection = (iceServers) => {
  closePeerConnection();
  const peerConnection = new RTCPeerConnection({ iceServers });

  peerConnection.onicecandidate = (event) => {
    if (!event.candidate) {
      return;
    }
    sendCallSignal("candidate", { candidate: normalizeIceCandidate(event.candidate) }).catch(() => undefined);
  };

  peerConnection.ontrack = (event) => {
    const [stream] = event.streams || [];
    if (remoteAudioRef.value && stream) {
      remoteAudioRef.value.srcObject = stream;
      remoteAudioRef.value.play?.().catch(() => undefined);
    }
  };

  peerConnection.onconnectionstatechange = async () => {
    const state = String(peerConnection.connectionState || "").toLowerCase();
    if (callTeardownInProgress.value) {
      return;
    }
    if (state === "connected" || state === "completed") {
      if (callState.value === "connecting" || callState.value === "dialing") {
        callState.value = "active";
      }
      return;
    }

    if (state === "failed" || state === "disconnected" || state === "closed") {
      if (callState.value !== "idle") {
        await endVoiceCall(true);
      }
    }
  };

  callPeerConnection.value = peerConnection;
  return peerConnection;
};

const attachLocalStreamToPeerConnection = (stream) => {
  if (!callPeerConnection.value || !stream) {
    return;
  }

  const existingSenders = new Set(callPeerConnection.value.getSenders().map((sender) => sender.track?.kind).filter(Boolean));
  stream.getTracks().forEach((track) => {
    if (!existingSenders.has(track.kind)) {
      callPeerConnection.value.addTrack(track, stream);
    }
  });
};

const drainPendingCandidates = async () => {
  if (!callPeerConnection.value || !callPeerConnection.value.remoteDescription) {
    return;
  }

  const pending = [...callPendingCandidates.value];
  callPendingCandidates.value = [];
  for (const candidate of pending) {
    try {
      await callPeerConnection.value.addIceCandidate(candidate);
    } catch (error) {
      // ignore invalid stale candidates
    }
  }
};

const applyRemoteDescription = async (description) => {
  if (!callPeerConnection.value || !description) {
    return;
  }

  const normalizedDescription = typeof description === "string" ? { type: "offer", sdp: description } : description;
  if (!normalizedDescription?.type || !normalizedDescription?.sdp) {
    return;
  }

  await callPeerConnection.value.setRemoteDescription(new RTCSessionDescription(normalizedDescription));
  await drainPendingCandidates();
};

const startCallTimer = () => {
  clearCallTimer();
  callSeconds.value = 0;
  callTimer.value = window.setInterval(() => {
    callSeconds.value += 1;
  }, 1000);
};

const startVoiceCall = async () => {
  if (!selectedPeer.value || callState.value !== "idle") {
    return;
  }

  try {
    setCallPeerInfo({ ...selectedPeer.value });
    callCallId.value = `call-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    callState.value = "dialing";
  if (isRecordingVoice.value) {
    clearAttachment();
  }
  const iceServers = await loadTurnIceServers();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    callLocalStream.value = stream;
    const peerConnection = createCallPeerConnection(iceServers);
    attachLocalStreamToPeerConnection(stream);
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    });
    await peerConnection.setLocalDescription(offer);
    await api.post(`/private-chat/${selectedPeer.value.user_id}/calls`, {
      call_id: callCallId.value,
      client_id: localClientId.value,
      offer: offer,
      offer_type: "offer",
    });
    startCallTone("ringback");
    callState.value = "dialing";
  } catch (error) {
    pushToast({
      title: "Telepon Gagal Dimulai",
      message: error.message || "Tidak berhasil memulai panggilan suara.",
      type: "error",
    });
    await endVoiceCall(true);
  }
};

const acceptIncomingCall = async () => {
  if (!incomingCall.value || callState.value !== "incoming") {
    return;
  }

  try {
    const payload = incomingCall.value;
    setCallPeerInfo(payload);
    callCallId.value = String(payload?.call_id || "");
    callState.value = "connecting";
    stopCallTone();
    const iceServers = await loadTurnIceServers();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    callLocalStream.value = stream;
    const peerConnection = createCallPeerConnection(iceServers);
    attachLocalStreamToPeerConnection(stream);

    const offer = payload?.offer && typeof payload.offer === "object" ? payload.offer : { type: "offer", sdp: payload?.sdp || payload?.offer_sdp || "" };
    await applyRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    await sendCallSignal("answer", { sdp: answer }).catch(() => undefined);
    startCallTimer();
    callState.value = "active";
    incomingCall.value = null;
  } catch (error) {
    pushToast({
      title: "Gagal Menerima Panggilan",
      message: error.message || "Tidak berhasil menerima telepon.",
      type: "error",
    });
    await endVoiceCall(true);
  }
};

const rejectIncomingCall = async () => {
  if (!incomingCall.value) {
    resetCallSession();
    return;
  }

  try {
    await sendCallSignal("rejected", { reason: "declined" });
  } catch (error) {
    // Ignore signalling failures when rejecting.
  }
  resetCallSession();
};

const toggleMute = () => {
  callMuted.value = !callMuted.value;
  if (!callLocalStream.value) {
    return;
  }

  callLocalStream.value.getAudioTracks().forEach((track) => {
    track.enabled = !callMuted.value;
  });
};

const endVoiceCall = async (silent = false) => {
  if (callTeardownInProgress.value) {
    return;
  }
  if (callState.value === "idle" && !incomingCall.value && !callCallId.value) {
    return;
  }

  const currentCallId = String(callCallId.value || incomingCall.value?.call_id || "");
  const shouldNotifyPeer = Boolean(currentCallId && (callState.value !== "idle" || incomingCall.value));

  try {
    if (shouldNotifyPeer) {
      await sendCallSignal("ended", { reason: silent ? "silent" : "hangup" });
    }
  } catch (error) {
    // Ignore signalling errors while hanging up.
  }

  resetCallSession();
};

const handleCallEvent = async (payload) => {
  if (!payload || String(payload?.client_id || "") === localClientId.value) {
    return;
  }

  const signalType = String(payload?.signal_type || "").toLowerCase();
  const callId = String(payload?.call_id || "");
  if (!callId) {
    return;
  }

  if (signalType === "incoming") {
    if (callState.value !== "idle") {
      try {
        const busyPeerId = Number(payload?.from_user_id || payload?.peer_user_id || 0);
        if (busyPeerId) {
          await api.post(`/private-chat/${busyPeerId}/calls/${callId}/signal`, {
            signal_type: "busy",
            client_id: localClientId.value,
            reason: "on_call",
          });
        }
      } catch (error) {
        // Ignore busy responses.
      }
      return;
    }

    incomingCall.value = {
      ...payload,
      call_id: callId,
    };
    callCallId.value = callId;
    setCallPeerInfo(payload);
    callState.value = "incoming";
    startCallTone("incoming");
    if (selectedPeer.value?.user_id !== Number(payload?.from_user_id || 0)) {
      const peer = findPeerByUserId(payload?.from_user_id) || {
        user_id: Number(payload?.from_user_id || 0),
        username: payload?.peer_username || "",
        full_name: payload?.peer_full_name || payload?.peer_username || "Pengguna",
        profile_image: payload?.peer_profile_image || "",
        role: payload?.peer_role || "",
        class_name: payload?.peer_class_name || "",
      };
      selectedPeer.value = peer;
      mobileChatOpen.value = true;
    }
    return;
  }

  if (callId !== callCallId.value) {
    return;
  }

  if (signalType === "answer") {
    try {
      await applyRemoteDescription(payload?.sdp);
      stopCallTone();
      callState.value = "active";
      startCallTimer();
    } catch (error) {
      pushToast({
        title: "Panggilan Gagal Tersambung",
        message: error.message || "Sinyal audio belum tersambung.",
        type: "error",
      });
      await endVoiceCall(true);
    }
    return;
  }

  if (signalType === "candidate") {
    const candidate = payload?.candidate;
    if (!candidate) {
      return;
    }

    const normalizedCandidate = typeof candidate === "string"
      ? { candidate }
      : candidate;

    if (callPeerConnection.value?.remoteDescription) {
      try {
        await callPeerConnection.value.addIceCandidate(normalizedCandidate);
      } catch (error) {
        // ignore malformed candidates
      }
    } else {
      callPendingCandidates.value = [...callPendingCandidates.value, normalizedCandidate];
    }
    return;
  }

  if (signalType === "ended" || signalType === "rejected" || signalType === "busy") {
    if (signalType === "busy") {
      pushToast({
        title: "Lawan Bicara Sedang Sibuk",
        message: "Panggilan tidak dapat dihubungkan saat ini.",
        type: "info",
      });
    }
    resetCallSession();
  }
};

const clearReplyTarget = () => {
  replyTarget.value = null;
};

const setReplyTarget = (message) => {
  replyTarget.value = message || null;
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
    resizeComposer({ target: composerBarRef.value?.querySelector?.("textarea") });
  });
};

const clearLongPressTimer = () => {
  if (longPressTimer.value) {
    window.clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
};

const handleMessagePressStart = (message, event) => {
  clearLongPressTimer();
  touchedMessageId.value = Number(message?.id || 0);
  touchCanReply.value = false;
  touchActionHandled.value = false;

  const touch = event?.touches?.[0];
  touchStartPoint.value = {
    x: Number(touch?.clientX || 0),
    y: Number(touch?.clientY || 0),
  };

  longPressTimer.value = window.setTimeout(() => {
    touchCanReply.value = true;
  }, 180);
};

const handleMessagePressMove = (message, event) => {
  if (!touchCanReply.value || Number(message?.id || 0) !== Number(touchedMessageId.value || 0)) {
    return;
  }

  const touch = event?.touches?.[0];
  if (!touch) return;

  const deltaX = Number(touch.clientX || 0) - Number(touchStartPoint.value.x || 0);
  const deltaY = Number(touch.clientY || 0) - Number(touchStartPoint.value.y || 0);

  if (deltaX > 36 && Math.abs(deltaY) < 48) {
    setReplyTarget(message);
    clearLongPressTimer();
    touchCanReply.value = false;
    touchedMessageId.value = null;
    touchActionHandled.value = true;
  }
};

const handleMessagePressEnd = (message) => {
  if (touchCanReply.value && !touchActionHandled.value && Number(message?.id || 0) === Number(touchedMessageId.value || 0)) {
    openMessageActionSheet(message);
  }
  clearLongPressTimer();
  touchCanReply.value = false;
  touchedMessageId.value = null;
  touchActionHandled.value = false;
};

const openMessageActionSheet = (message) => {
  actionSheetMessage.value = message || null;
  showMessageActionSheet.value = Boolean(actionSheetMessage.value);
};

const closeMessageActionSheet = () => {
  showMessageActionSheet.value = false;
  actionSheetMessage.value = null;
};

const replyFromActionSheet = () => {
  if (actionSheetMessage.value) {
    setReplyTarget(actionSheetMessage.value);
  }
  closeMessageActionSheet();
};

const editFromActionSheet = () => {
  if (actionSheetMessage.value && isOwnMessage(actionSheetMessage.value)) {
    setEditTarget(actionSheetMessage.value);
  }
  closeMessageActionSheet();
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
  if (selectedPeer.value?.user_id === peer.user_id) {
    mobileChatOpen.value = true;
    await scrollToBottom();
    return;
  }
  selectedPeer.value = peer;
  mobileChatOpen.value = true;
  clearReplyTarget();
  clearEditTarget();
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
    const replyPrefix = replyTarget.value
      ? `[Balas#${Number(replyTarget.value.id || 0)} ${replyTarget.value.sender_name || "Pengguna"}: ${getMessagePreview(replyTarget.value)}]`
      : "";
    const editPrefix = editTarget.value ? parseReplyPayload(editTarget.value.message).replyPrefix || "" : "";
    const finalMessage = [editPrefix || replyPrefix, messageText].filter(Boolean).join("\n");

    const shouldEdit = Boolean(editTarget.value);
    const endpoint = shouldEdit
      ? `/private-chat/${selectedPeer.value.user_id}/messages/${editTarget.value.id}`
      : `/private-chat/${selectedPeer.value.user_id}/messages`;

    let payload = {
      message: finalMessage,
      client_id: localClientId.value,
    };
    if (!shouldEdit && attachmentFile.value) {
      const formData = new FormData();
      formData.append("message", finalMessage);
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

    const response = shouldEdit
      ? await api.put(endpoint, payload)
      : await api.post(endpoint, payload);
    composer.value = "";
    emojiPanelOpen.value = false;
    clearReplyTarget();
    clearEditTarget();
    clearAttachment();
    if (response?.data) {
      const nextMessage = response.data;
      const existingIndex = messages.value.findIndex((item) => Number(item.id) === Number(nextMessage.id));
      if (existingIndex >= 0) {
        const nextMessages = [...messages.value];
        nextMessages.splice(existingIndex, 1, nextMessage);
        messages.value = nextMessages;
      } else {
        messages.value = [...messages.value, nextMessage];
      }
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
  updateComposerBarMetrics();
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
  clearReplyTarget();
  clearEditTarget();
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
    realtimeStore.on("private-chat:message-updated", async (payload) => {
      const senderId = Number(payload?.sender_id || 0);
      const recipientId = Number(payload?.recipient_id || 0);
      const activePeerId = Number(selectedPeer.value?.user_id || 0);
      const peerId = senderId === Number(currentUserId) ? recipientId : senderId;

      await refreshSummary(true);

      if (activePeerId && peerId === activePeerId) {
        const updatedId = Number(payload?.id || 0);
        if (!updatedId) return;
        const existingIndex = messages.value.findIndex((item) => Number(item.id) === updatedId);
        if (existingIndex >= 0) {
          const nextMessages = [...messages.value];
          nextMessages.splice(existingIndex, 1, payload);
          messages.value = nextMessages;
        }
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
    realtimeStore.on("private-chat:call-event", async (payload) => {
      await handleCallEvent(payload);
    }),
  ];
};

onMounted(async () => {
  updateViewportInset();
  await refreshSummary(true);

  const requestedPeerId = Number(route.query?.user || 0);
  if (requestedPeerId) {
    const peer = peers.value.find((item) => Number(item.user_id) === requestedPeerId);
    if (peer) {
      await selectPeer(peer);
    }
  }

  bindRealtime();

  if (typeof window !== "undefined") {
    window.addEventListener("resize", updateViewportInset);
    window.visualViewport?.addEventListener("resize", updateViewportInset);
  }

  composerResizeObserver.value = new ResizeObserver(() => {
    updateComposerBarMetrics();
  });
  if (composerBarRef.value) {
    composerResizeObserver.value.observe(composerBarRef.value);
  }
  updateComposerBarMetrics();
});

watch(() => props.activePeerId, (newId) => {
  if (newId) {
    const peer = peers.value.find(p => Number(p.user_id) === Number(newId));
    if (peer) selectPeer(peer);
  } else {
    selectedPeer.value = null;
  }
});

watch(peers, (newPeers) => {
  if (props.unifiedMode && props.activePeerId && selectedPeer.value?.user_id !== props.activePeerId) {
    const peer = newPeers.find(p => Number(p.user_id) === Number(props.activePeerId));
    if (peer) selectPeer(peer);
  }
});

defineExpose({
  visiblePeers,
  peerInitial,
  displayPeerName,
  formatPeerTime,
  latestPeerPreview,
  peers,
  selectPeer
});

onUnmounted(() => {
  void endVoiceCall(true);
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
  composerResizeObserver.value?.disconnect?.();
  composerResizeObserver.value = null;
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateViewportInset);
    window.visualViewport?.removeEventListener("resize", updateViewportInset);
  }
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

watch(
  () => [selectedPeer.value?.user_id, renderedMessages.value.length],
  async () => {
    if (!selectedPeer.value || isLoadingMessages.value) {
      return;
    }
    await scrollToBottom();
  },
  { flush: "post" },
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
