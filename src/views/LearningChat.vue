<template>
  <div
    class="h-full min-h-0 overflow-hidden bg-slate-100 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto flex h-full min-h-0 w-full  flex-col p-0 md:p-8">
      <div
        class="flex-1 min-h-0 overflow-hidden rounded-none bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10 md:rounded-[28px]">
        <div class="grid h-full min-h-0 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside
            class="flex min-h-0 flex-col border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/40 lg:border-b-0 lg:border-r"
            :class="{ hidden: mobileChatOpen, 'lg:block': true }">
            <div class="shrink-0 border-b border-slate-200 px-5 py-5 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm"
                  :class="roleAccentClass">
                  <Icon icon="ph:chats-circle-duotone" class="h-7 w-7 opacity-90" />
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-900 dark:text-white">Grup Mata Pelajaran</h2>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Pilih mapel untuk mulai berdiskusi.</p>
                </div>
              </div>

            </div>

            <div class="min-h-0 flex-1 overflow-y-auto p-3">
              <button v-for="subject in orderedSubjects" :key="subject.id" @click="selectSubject(subject)"
                class="mb-2 flex w-full items-start gap-3 rounded-2xl px-4 py-4 text-left transition ring-1 ring-transparent"
                :class="selectedSubject?.id === subject.id
                  ? selectedGroupClass
                  : subjectUnreadCount(subject.id) > 0
                    ? unreadGroupClass
                    : 'bg-transparent hover:bg-white dark:hover:bg-slate-900/80'">
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-white shadow-sm"
                  :class="subject.chat_icon_url ? 'bg-slate-100 dark:bg-slate-800' : getSubjectIconClass(subject)">
                  <img v-if="subject.chat_icon_url" :src="subject.chat_icon_url" alt="Ikon grup mapel"
                    class="h-full w-full object-cover" />
                  <Icon v-else :icon="getSubjectIcon(subject)" class="h-6 w-6 opacity-95" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <h3 class="truncate font-bold"
                      :class="selectedSubject?.id === subject.id ? 'text-white' : 'text-slate-900 dark:text-white'">
                      {{ subject.name }}
                    </h3>
                    <div class="flex shrink-0 items-center gap-2">
                      <span v-if="subjectUnreadCount(subject.id) > 0"
                        class="inline-flex min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold"
                        :class="selectedSubject?.id === subject.id ? 'bg-white text-slate-900' : unreadBadgeClass">
                        {{ formatUnreadCount(subjectUnreadCount(subject.id)) }}
                      </span>
                      <span v-if="subjectMessageCount(subject.id) > 0" class="text-[11px] font-semibold"
                        :class="selectedSubject?.id === subject.id ? 'text-white/80' : 'text-slate-400'">
                        {{ subjectMessageCount(subject.id) }}
                      </span>
                    </div>
                  </div>
                  <p class="mt-1 truncate text-sm"
                    :class="selectedSubject?.id === subject.id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'">
                    {{ subject.class_name || `Guru: ${subject.teacher_name || '-'}` }}
                  </p>
                  <div class="mt-1 flex items-center gap-2">
                    <span v-if="subjectUnreadCount(subject.id) > 0"
                      class="inline-flex shrink-0 items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600 dark:bg-rose-500/20 dark:text-rose-300"
                      :class="selectedSubject?.id === subject.id ? 'bg-white/20 text-white' : ''">
                      Pesan baru
                    </span>
                    <p class="truncate text-xs"
                      :class="selectedSubject?.id === subject.id ? 'text-white/70' : subjectUnreadCount(subject.id) > 0 ? 'font-semibold text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'">
                      {{ latestMessagePreview(subject.id) }}
                    </p>
                  </div>
                </div>
              </button>

              <div v-if="subjects.length === 0"
                class="p-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                Belum ada grup mata pelajaran yang tersedia.
              </div>
            </div>
          </aside>

          <section class="flex min-h-0 h-full flex-col overflow-hidden bg-[#efeae2] dark:bg-slate-950/20"
            :class="{ hidden: !mobileChatOpen, 'lg:flex': true }">
            <template v-if="selectedSubject">
              <div
                class="sticky top-0 z-10 shrink-0 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:px-5 md:py-4">
                <div class="flex items-center gap-3">
                  <button type="button"
                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
                    @click="backToGroupList">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button type="button"
                    class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-white shadow-sm md:h-12 md:w-12 md:rounded-2xl"
                    :class="[
                      selectedSubject.chat_icon_url ? 'bg-slate-100 dark:bg-slate-800' : getSubjectIconClass(selectedSubject),
                      role === 'GURU' ? 'ring-2 ring-transparent transition hover:ring-sky-400/50' : '',
                    ]" :disabled="role !== 'GURU' || isUploadingChatIcon" @click="openChatIconModal">
                    <img v-if="selectedSubject.chat_icon_url" :src="selectedSubject.chat_icon_url" alt="Ikon grup mapel"
                      class="h-full w-full object-cover" />
                    <Icon v-else :icon="getSubjectIcon(selectedSubject)" class="h-6 w-6 opacity-95" />
                  </button>
                  <div class="min-w-0">
                    <h2 class="truncate text-base font-bold text-slate-900 dark:text-white md:text-lg">{{
                      selectedSubject.name }}
                    </h2>
                    <p class="truncate text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                      {{ selectedSubject.class_name }}
                      <span v-if="selectedSubject.teacher_name">• {{ selectedSubject.teacher_name }}</span>
                    </p>
                    <p class="truncate text-xs text-emerald-600 dark:text-emerald-400">
                      {{ onlineIndicatorText }}
                    </p>
                    <p v-if="typingIndicatorText" class="truncate text-xs font-medium text-sky-600 dark:text-sky-400">
                      {{ typingIndicatorText }}
                    </p>
                  </div>
                </div>
              </div>

              <div ref="messageListRef" :style="messageListStyle"
                class="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),_rgba(239,234,226,0.8)_40%,_rgba(239,234,226,1)_100%)] px-2 py-3 dark:bg-[radial-gradient(circle_at_top_left,_rgba(30,41,59,0.7),_rgba(15,23,42,0.98)_45%,_rgba(2,6,23,1)_100%)] md:space-y-4 md:px-8 md:py-5">
                <div v-if="isLoadingMessages"
                  class="flex h-full min-h-[420px] items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  Memuat percakapan...
                </div>

                <div v-else-if="currentMessages.length === 0"
                  class="flex h-full min-h-[420px] items-center justify-center">
                  <div
                    class="max-w-md rounded-3xl bg-white/90 px-8 py-8 text-center shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900/85 dark:ring-white/10">
                    <div
                      class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <svg class="h-8 w-8 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.6" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M2.25 12.76l.904-.903a2.25 2.25 0 013.182 0l.904.903m0 0l2.69 2.69a2.25 2.25 0 003.182 0l5.44-5.439a2.25 2.25 0 013.182 0l.904.903M7.5 15.75h9" />
                      </svg>
                    </div>
                    <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">Belum ada pesan</h3>
                    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Mulai percakapan di grup {{
                      selectedSubject.name }}.</p>
                  </div>
                </div>

                <div v-for="item in currentMessages" :key="item.id" class="flex"
                  :class="item.sender_id === currentUserId ? 'justify-end' : 'justify-start'">
                  <article
                    class="max-w-[90%] rounded-2xl px-3 py-2.5 shadow-sm md:max-w-[70%] md:rounded-3xl md:px-4 md:py-3"
                    :class="[
                      item.sender_id === currentUserId ? ownMessageClass : 'rounded-tl-md bg-white text-slate-800 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800',
                      replyHighlightMessageId === Number(item.id) ? 'ring-2 ring-amber-400 dark:ring-amber-300' : '',
                    ]" :data-message-id="item.id" @touchstart.passive="handleMessagePressStart(item)"
                    @touchend="handleMessagePressEnd" @touchcancel="handleMessagePressEnd">
                    <div class="flex items-center justify-between gap-3 text-xs font-semibold">
                      <div class="flex items-center gap-2">
                        <span>{{ item.sender_name || "Pengguna" }}</span>
                        <span class="rounded-full px-2 py-0.5" :class="roleBadgeClass(item.sender_role)">
                          {{ roleLabel(item.sender_role) }}
                        </span>
                      </div>
                    </div>
                    <button v-if="parseReplyPayload(item.message).replyName" type="button"
                      @click="jumpToReplyTarget(item)"
                      class="mt-2 w-full rounded-xl border-l-4 px-2 py-1.5 text-left text-[11px]"
                      :class="item.sender_id === currentUserId ? 'border-white/70 bg-white/15 text-white/90' : 'border-sky-500 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'">
                      <p class="line-clamp-2">{{ parseReplyPayload(item.message).replyPreview }}</p>
                    </button>
                    <p v-if="parseReplyPayload(item.message).body"
                      class="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {{ parseReplyPayload(item.message).body }}
                    </p>
                    <div v-if="item.attachment_url" class="mt-3">
                      <audio v-if="isVoiceMessage(item)" :src="normalizePublicUrl(item.attachment_url)" controls
                        class="w-full max-w-sm" />
                      <button v-else-if="item.message_type === 'IMAGE'" type="button"
                        @click="openImagePreview(normalizePublicUrl(item.attachment_url), item.attachment_name)"
                        class="block w-full overflow-hidden rounded-2xl text-left">
                        <img :src="normalizePublicUrl(item.attachment_url)"
                          :alt="item.attachment_name || 'Lampiran gambar'" class="max-h-72 w-full object-cover" />
                      </button>
                      <a v-else-if="item.message_type === 'PDF'" :href="normalizePublicUrl(item.attachment_url)"
                        target="_blank" rel="noreferrer"
                        class="flex items-center gap-3 rounded-2xl bg-black/5 px-4 py-3 text-sm font-semibold hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15">
                        <Icon icon="ph:file-pdf" class="h-6 w-6 shrink-0" />
                        <span class="truncate">{{ item.attachment_name || "Buka PDF" }}</span>
                      </a>
                      <a v-else :href="normalizePublicUrl(item.attachment_url)" target="_blank" rel="noreferrer"
                        class="flex items-center gap-3 rounded-2xl bg-black/5 px-4 py-3 text-sm font-semibold hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15">
                        <Icon icon="ph:paperclip" class="h-5 w-5 shrink-0" />
                        <span class="truncate">{{ item.attachment_name || "Buka file" }}</span>
                      </a>
                    </div>
                    <div class="mt-2 flex items-center justify-between gap-4 text-[11px] opacity-70">
                      <p>{{ formatDateTime(item.created_at) }}</p>
                      <p v-if="item.sender_id === currentUserId" class="font-semibold">
                        {{ ownMessageReadLabel(item) }}
                      </p>
                    </div>
                  </article>
                </div>
              </div>

              <form @submit.prevent="sendMessage"
                class="fixed inset-x-0 z-20 shrink-0 border-t border-slate-200 bg-white px-2 pt-2 dark:border-slate-800 dark:bg-slate-900 md:sticky md:inset-auto md:px-6 md:py-4"
                :style="composerBarStyle">
                <div v-if="replyTarget"
                  class="mb-2 rounded-xl border-l-4 border-sky-500 bg-slate-100 px-3 py-1.5 text-[11px] dark:bg-slate-800">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-slate-500 dark:text-slate-400">
                        {{ getMessagePreview(replyTarget) }}
                      </p>
                    </div>
                    <button type="button" @click="clearReplyTarget"
                      class="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200">
                      <Icon icon="mdi:close" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div v-if="attachmentPreviewName || isRecordingVoice || recordedVoiceUrl"
                  class="mb-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800">
                  <div v-if="attachmentPreviewName" class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-semibold text-slate-900 dark:text-white">Lampiran siap dikirim</p>
                      <p class="truncate text-slate-500 dark:text-slate-400">{{ attachmentPreviewName }}</p>
                    </div>
                    <button type="button" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                      @click="clearAttachment">
                      <Icon icon="mdi:close" class="h-5 w-5" />
                    </button>
                  </div>
                  <div v-if="recordedVoiceUrl" class="flex items-center justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="font-semibold text-slate-900 dark:text-white">Voice note siap dikirim</p>
                      <audio :src="recordedVoiceUrl" controls class="mt-2 w-full" />
                    </div>
                    <button type="button" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                      @click="clearAttachment">
                      <Icon icon="mdi:close" class="h-5 w-5" />
                    </button>
                  </div>
                  <div v-else-if="isRecordingVoice" class="flex items-center justify-between gap-3">
                    <div class="flex-1">
                      <p class="font-semibold text-slate-900 dark:text-white">Sedang merekam voice note...</p>
                      <svg class="mt-2 h-10 w-full max-w-sm rounded-md bg-rose-50/70 dark:bg-rose-500/10"
                        viewBox="0 0 300 40" preserveAspectRatio="none">
                        <polyline :points="recordingWavePoints" fill="none" stroke="#ef4444" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <p class="text-slate-500 dark:text-slate-400">{{ recordingDurationLabel }}</p>
                    </div>
                    <button type="button" class="rounded-full bg-rose-500 p-2 text-white hover:bg-rose-400"
                      @click="stopVoiceRecording">
                      <Icon icon="ph:stop-fill" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div class="flex items-end gap-2 md:gap-3">
                  <div class="flex shrink-0 items-center gap-2">
                    <input ref="attachmentInputRef" type="file"
                      accept="image/*,application/pdf,audio/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" class="hidden"
                      @change="handleAttachmentChange" />
                    <button type="button"
                      class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 md:h-12 md:w-12"
                      :disabled="isSendingMessage || isRecordingVoice" @click="openAttachmentPicker">
                      <Icon icon="ph:paperclip" class="h-5 w-5" />
                    </button>
                    <button type="button"
                      class="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition disabled:cursor-not-allowed disabled:opacity-60 md:h-12 md:w-12"
                      :class="isRecordingVoice ? 'bg-rose-500 hover:bg-rose-400' : roleAccentClass"
                      :disabled="isSendingMessage || Boolean(attachmentFile)" @click="toggleVoiceRecording">
                      <Icon :icon="isRecordingVoice ? 'ph:stop-fill' : 'ph:microphone-fill'" class="h-5 w-5" />
                    </button>
                  </div>
                  <div
                    class="flex-1 rounded-[20px] bg-slate-100 px-3 py-1 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 md:rounded-[24px] md:px-4 md:py-1.5">
                    <textarea v-model="composer" rows="1" placeholder="Tulis pesan..." @input="handleComposerInput"
                      @keydown="handleComposerKeydown" @focus="ensureComposerVisible"
                      class="block w-full resize-none border-0 bg-transparent p-0 text-sm text-slate-900 focus:outline-none focus:ring-0 dark:text-white leading-6 min-h-[40px] max-h-[110px]" />
                  </div>
                  <button :disabled="isSendingMessage || !composer.trim()"
                    class="inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 md:h-14 md:w-14"
                    :class="roleAccentClass">
                    <svg v-if="isSendingMessage" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"
                      stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </form>
            </template>

            <div v-else class="hidden h-full min-h-[720px] items-center justify-center px-6 lg:flex">
              <div
                class="max-w-lg rounded-[32px] bg-white/90 px-8 py-10 text-center shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900/85 dark:ring-white/10">
                <div
                  class="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <svg class="h-10 w-10 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.6" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M8.625 9.75a3.375 3.375 0 116.75 0m-6.75 0a3.375 3.375 0 106.75 0m-6.75 0v1.5m6.75-1.5v1.5m-8.25 8.25h9a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.186-1.016-.523-1.408L15.53 12.45A2.25 2.25 0 0013.851 11.7h-3.702a2.25 2.25 0 00-1.679.75l-2.297 2.57a2.25 2.25 0 00-.523 1.408v1.372A2.25 2.25 0 007.9 20.25z" />
                  </svg>
                </div>
                <h2 class="mt-5 text-xl font-bold text-slate-900 dark:text-white">Pilih Grup Mapel</h2>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Daftar mata pelajaran di panel kiri berfungsi sebagai grup chat. Pilih salah satu untuk mulai
                  berdiskusi.
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

    <div v-if="showMessageActionSheet" class="fixed inset-0 z-[75] bg-black/45" @click="closeMessageActionSheet">
      <div class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 shadow-2xl dark:bg-slate-900" @click.stop>
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Aksi Pesan</p>
        <button type="button" @click="replyFromActionSheet"
          class="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
          Balas Chat
          <Icon icon="mdi:reply-outline" class="h-5 w-5" />
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
import { useRoute } from "vue-router";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { uploadFileDirect } from "@/api/upload";
import { formatDateTime } from "@/utils/date";
import { getStoredRole } from "@/utils/auth";
import { normalizePublicUrl } from "@/utils/url";
import { useSidebar } from "@/store/sidebar";
import { useRealtimeStore } from "@/store/realtime";

const role = getStoredRole();
const route = useRoute();
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
const replyTarget = ref(null);
const replyHighlightMessageId = ref(null);
const showImagePreview = ref(false);
const previewImageUrl = ref("");
const previewImageName = ref("");
const previewImageZoom = ref(1);
const showMessageActionSheet = ref(false);
const actionSheetMessage = ref(null);
const longPressTimer = ref(null);
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
const isConnected = computed(() => realtimeConnected.value);
const localClientId = ref(`chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

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
    ? `calc(${viewportBottomInset.value}px + env(safe-area-inset-bottom, 0px) + 104px)`
    : "",
}));

const currentMessages = computed(() =>
  selectedSubject.value ? messagesBySubject.value[selectedSubject.value.id] || [] : [],
);

const orderedSubjects = computed(() => {
  const subjectItems = Array.isArray(subjects.value) ? [...subjects.value] : [];

  return subjectItems.sort((left, right) => {
    const leftLastMessage = messagesBySubject.value[left.id]?.slice(-1)[0];
    const rightLastMessage = messagesBySubject.value[right.id]?.slice(-1)[0];
    const leftTime = leftLastMessage ? new Date(leftLastMessage.created_at).getTime() : 0;
    const rightTime = rightLastMessage ? new Date(rightLastMessage.created_at).getTime() : 0;

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

  return `${lastMessage.sender_name}: ${lastMessage.message}`;
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
  const matched = text.match(/^\[Balas(?:#(\d+))?\s+(.+?): (.+?)\]\n([\s\S]*)$/);
  if (!matched) {
    return {
      replyId: null,
      replyName: "",
      replyPreview: "",
      body: text,
    };
  }

  return {
    replyId: matched[1] ? Number(matched[1]) : null,
    replyName: matched[2] || "",
    replyPreview: matched[3] || "",
    body: matched[4] || "",
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

const ensureComposerVisible = async () => {
  await nextTick();
  updateViewportInset();
  window.setTimeout(() => {
    scrollToBottom();
  }, 80);
};

const sortMessages = (messages = []) =>
  [...messages].sort((left, right) => {
    if (left.created_at === right.created_at) {
      return Number(left.id) - Number(right.id);
    }

    return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
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

const backToGroupList = () => {
  mobileChatOpen.value = false;
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

const handleAttachmentChange = (event) => {
  const file = event.target.files?.[0] || null;
  event.target.value = "";

  if (!file) {
    return;
  }

  clearAttachment();
  attachmentFile.value = file;
  attachmentPreviewName.value = file.name;
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
    const finalMessage = [replyPrefix, baseMessage].filter(Boolean).join("\n");
    let payload = { message: finalMessage };

    if (hasAttachment) {
      const uploadedFile = await uploadFileDirect(attachmentFile.value);
      const isVoiceAttachment = String(uploadedFile.mimeType || "").toLowerCase().startsWith("audio/");
      payload = {
        message: finalMessage,
        message_type: isVoiceAttachment ? "VOICE" : undefined,
        attachment_url: uploadedFile.url,
        attachment_name: uploadedFile.name,
        attachment_mime_type: uploadedFile.mimeType,
        attachment_size: uploadedFile.size,
      };
    }

    const response = await api.post(`/learning/subjects/${selectedSubject.value.id}/chat`, payload);
    await sendTypingEvent(false);
    composer.value = "";
    clearReplyTarget();
    clearAttachment();

    if (response?.data) {
      await upsertMessage(response.data);
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

<style scoped></style>
