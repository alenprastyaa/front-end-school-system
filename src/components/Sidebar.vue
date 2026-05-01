<template>
  <div>
    <nav class="sidebar bg-white dark:bg-gray-800 h-full">
      <div class="sidebar-head p-4 border-b dark:border-gray-700">
        <router-link to="/dashboard" class="flex items-center gap-3">
          <img class="w-8" src="@/assets/logo/logo.svg" alt="School System" />
          <div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">School System</h2>
            <p class="text-xs text-gray-400">{{ role || "Guest" }}</p>
          </div>
        </router-link>

        <button class="lg:hidden block dark:text-gray-400 float-right -mt-10" @click="$emit('sidebarToggle')">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" fill="currentColor">
            <path
              d="M7.219 5.781L5.78 7.22L14.563 16L5.78 24.781l1.44 1.439L16 17.437l8.781 8.782l1.438-1.438L17.437 16l8.782-8.781L24.78 5.78L16 14.563z" />
          </svg>
        </button>
      </div>

      <div class="p-4">
        <p class="font-medium text-gray-400">Menu</p>
        <div class="mt-4 space-y-2">
          <template v-for="item in visibleMenu" :key="item.key">
            <router-link v-if="!item.children" :to="item.to"
              class="w-full flex items-center gap-3 text-left rounded-md box-border p-3 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              :class="{ 'bg-gray-200 dark:bg-gray-700 font-medium': isRouteActive(item.to) }">
              <span class="text-xl">
                <Icon :icon="item.icon" />
              </span>
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="getGroupBadge(item) > 0"
                class="inline-flex min-w-[22px] items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                {{ getGroupBadge(item) > 99 ? "99+" : getGroupBadge(item) }}
              </span>
            </router-link>

            <div v-else class="space-y-2">
              <button type="button"
                class="w-full flex items-center gap-3 text-left rounded-md box-border p-3 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                :class="{ 'bg-gray-200 dark:bg-gray-700 font-medium': isGroupOpen(item) || hasActiveChild(item) }"
                @click="toggleGroup(item.key)">
                <span class="text-xl">
                  <Icon :icon="item.icon" />
                </span>
                <span class="flex-1">{{ item.label }}</span>
                <span v-if="getGroupBadge(item) > 0"
                  class="inline-flex min-w-[22px] items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                  {{ getGroupBadge(item) > 99 ? "99+" : getGroupBadge(item) }}
                </span>
                <Icon icon="fa6-solid:angle-down" class="transition-transform"
                  :class="{ 'rotate-180': isGroupOpen(item) || hasActiveChild(item) }" />
              </button>

              <div v-if="isGroupOpen(item) || hasActiveChild(item)"
                class="ml-4 space-y-2 border-l border-gray-200 pl-3 dark:border-gray-700">
                <router-link v-for="child in item.children" :key="child.to" :to="child.to"
                  class="w-full flex items-center gap-3 text-left rounded-md box-border p-3 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  :class="{ 'bg-gray-200 dark:bg-gray-700 font-medium': isRouteActive(child.to) }">
                  <span class="text-xl">
                    <Icon :icon="child.icon" />
                  </span>
                  <span class="flex-1">{{ child.label }}</span>
                  <span v-if="getChildBadge(child) > 0"
                    class="inline-flex min-w-[22px] items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                    {{ getChildBadge(child) > 99 ? "99+" : getChildBadge(child) }}
                  </span>
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <teleport to="body">
      <div
        class="pointer-events-none fixed right-4 top-28 z-[120] flex w-full max-w-sm flex-col gap-3 md:top-24 lg:top-24">
        <button v-for="toast in learningToasts" :key="toast.id" type="button"
          class="pointer-events-auto rounded-2xl border border-slate-200 bg-white/95 p-4 text-left shadow-lg backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/95"
          @click="openLearningFromToast(toast)">
          <div class="flex items-start gap-3">
            <div class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white"
              :class="toast.type === 'NEW_ASSIGNMENT' ? 'bg-emerald-600' : 'bg-sky-600 dark:bg-cyan-600'">
              <Icon :icon="toast.type === 'NEW_ASSIGNMENT' ? 'ph:notebook-duotone' : 'ph:paper-plane-tilt-duotone'"
                class="h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white">{{ toast.title }}</p>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ toast.subjectName }}</p>
              <p class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{{ toast.body }}</p>
            </div>
            <button type="button"
              class="pointer-events-auto rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              @click.stop="dismissLearningToast(toast.id)">
              <Icon icon="mdi:close" class="h-4 w-4" />
            </button>
          </div>
        </button>
        <button v-for="toast in chatToasts" :key="toast.id" type="button"
          class="pointer-events-auto rounded-2xl border border-slate-200 bg-white/95 p-4 text-left shadow-lg backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/95"
          @click="openChatFromToast(toast)">
          <div class="flex items-start gap-3">
            <div
              class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white"
              :class="role === 'GURU' ? 'bg-sky-600 dark:bg-cyan-600' : 'bg-emerald-600'">
              <Icon icon="ph:chats-circle-duotone" class="h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white">{{ toast.subjectName }}</p>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ toast.senderName }}</p>
              <p class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{{ toast.preview }}</p>
            </div>
            <button type="button"
              class="pointer-events-auto rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              @click.stop="dismissToast(toast.id)">
              <Icon icon="mdi:close" class="h-4 w-4" />
            </button>
          </div>
        </button>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { getStoredRole } from "@/utils/auth";
import { api, realtimeConfig } from "@/api";
import { io } from "socket.io-client";

defineEmits(["sidebarToggle"]);

const route = useRoute();
const router = useRouter();
const role = getStoredRole();
const openGroups = ref([]);
const liveChatUnreadCount = ref(0);
const liveChatUnreadBySubject = ref({});
const liveChatPendingUnreadBySubject = ref({});
const chatSocket = ref(null);
const joinedSubjectIds = ref([]);
const chatToasts = ref([]);
const learningToasts = ref([]);
const liveChatSubjects = ref([]);
let toastIdCounter = 0;

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

const menuByRole = {
  SUPER_ADMIN: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "schools", to: "/schools", label: "Sekolah", icon: "ph:buildings" },
    { key: "school-users", to: "/school-users", label: "User Sekolah", icon: "clarity:users-line" },
  ],
  ADMIN: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "school-users", to: "/school-users", label: "User Sekolah", icon: "clarity:users-line" },
    { key: "classes", to: "/classes", label: "Kelas", icon: "mdi:google-classroom" },
    { key: "students", to: "/students", label: "Siswa", icon: "mdi:account-school-outline" },
    { key: "academic-periods", to: "/academic-periods", label: "Tahun Ajaran", icon: "ph:calendar-blank" },
    { key: "learning-admin", to: "/learning-admin", label: "Pembelajaran", icon: "ph:books" },
    { key: "learning-exams-admin", to: "/learning-exams-admin", label: "Ujian Resmi", icon: "ph:exam" },
    { key: "admin-settings", to: "/admin-settings", label: "Setting", icon: "ph:gear-six" },
  ],
  GURU: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "homeroom-students", to: "/homeroom-students", label: "Siswa Wali Kelas", icon: "mdi:account-school-outline" },
    {
      key: "learning-module",
      label: "Modul Pembelajaran",
      icon: "ph:books",
      children: [
        { to: "/learning-teacher", label: "Pembelajaran", icon: "ph:book-open-text" },
        { to: "/learning-chat-teacher", label: "Live Chat", icon: "ph:chats-circle" },
        { to: "/learning-question-bank-teacher", label: "Bank Soal", icon: "ph:stack" },
        { to: "/learning-quiz-teacher", label: "Quiz", icon: "ph:brain" },
        { to: "/learning-exams-teacher", label: "Ujian Resmi", icon: "ph:exam" },
        { to: "/learning-grades-teacher", label: "Penilaian", icon: "ph:exam" },
        { to: "/learning-report-teacher", label: "Rapor Mapel", icon: "ph:table" },
      ],
    },
  ],
  SISWA: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    {
      key: "learning-module",
      label: "Modul Pembelajaran",
      icon: "ph:books",
      children: [
        { to: "/learning-student", label: "Pembelajaran", icon: "ph:book-open-text" },
        { to: "/learning-chat-student", label: "Live Chat", icon: "ph:chats-circle" },
        { to: "/learning-quiz-student", label: "Quiz", icon: "ph:brain" },
        { to: "/learning-exams-student", label: "Ujian Resmi", icon: "ph:exam" },
      ],
    },
    { key: "attendance", to: "/attendance", label: "Absensi", icon: "mdi:calendar-check-outline" },
    { key: "receipts", to: "/receipts", label: "Bukti Pembayaran", icon: "ph:receipt" },
  ],
};

const visibleMenu = computed(() => menuByRole[role] || []);
const shouldTrackLiveChat = ["GURU", "SISWA"].includes(role);

const isRouteActive = (path) => route.path === path;

const hasActiveChild = (item) => item.children?.some((child) => route.path === child.to);

const isGroupOpen = (item) => openGroups.value.includes(item.key);

const toggleGroup = (key) => {
  if (openGroups.value.includes(key)) {
    openGroups.value = openGroups.value.filter((item) => item !== key);
    return;
  }

  openGroups.value = [...openGroups.value, key];
};

const getChildBadge = (child) => {
  if (child.to === "/learning-chat-teacher" || child.to === "/learning-chat-student") {
    return liveChatUnreadCount.value;
  }

  return 0;
};

const getGroupBadge = (item) => {
  if (item.key === "learning-module") {
    return liveChatUnreadCount.value;
  }

  return 0;
};

const recomputeLiveChatUnreadCount = () => {
  const subjectIds = new Set([
    ...Object.keys(liveChatUnreadBySubject.value || {}),
    ...Object.keys(liveChatPendingUnreadBySubject.value || {}),
  ]);

  liveChatUnreadCount.value = [...subjectIds].reduce((total, subjectId) => {
    const baseCount = Number(liveChatUnreadBySubject.value?.[subjectId] || 0);
    const pendingCount = Number(liveChatPendingUnreadBySubject.value?.[subjectId] || 0);
    return total + baseCount + pendingCount;
  }, 0);
};

const applyLiveChatSummary = (summaryItems = []) => {
  const nextMap = {};

  summaryItems.forEach((item) => {
    const subjectId = Number(item?.subject_id || 0);
    if (!subjectId) {
      return;
    }

    nextMap[subjectId] = Number(item?.unread_count || 0);
  });

  liveChatUnreadBySubject.value = nextMap;
  recomputeLiveChatUnreadCount();
};

const bumpLiveChatUnread = (subjectId) => {
  const normalizedSubjectId = Number(subjectId || 0);
  if (!normalizedSubjectId) {
    return;
  }

  liveChatPendingUnreadBySubject.value = {
    ...liveChatPendingUnreadBySubject.value,
    [normalizedSubjectId]: Number(liveChatPendingUnreadBySubject.value?.[normalizedSubjectId] || 0) + 1,
  };
  recomputeLiveChatUnreadCount();
};

const clearPendingLiveChatUnread = () => {
  if (Object.keys(liveChatPendingUnreadBySubject.value).length === 0) {
    return;
  }

  liveChatPendingUnreadBySubject.value = {};
  recomputeLiveChatUnreadCount();
};

const refreshLiveChatSummary = async () => {
  if (!shouldTrackLiveChat) {
    liveChatUnreadCount.value = 0;
    liveChatUnreadBySubject.value = {};
    liveChatPendingUnreadBySubject.value = {};
    return;
  }

  try {
    const response = await api.get("/learning/chat/summary");
    const summaryItems = response?.data || [];
    applyLiveChatSummary(summaryItems);
  } catch (error) {
    // Keep previous badge value if request fails.
  }
};

const joinLiveChatRooms = async () => {
  if (!shouldTrackLiveChat || !chatSocket.value?.connected) {
    return;
  }

  try {
    const endpoint = role === "GURU" ? "/learning/subjects/teacher" : "/learning/subjects/student";
    const response = await api.get(endpoint);
    const subjects = response?.data || [];
    liveChatSubjects.value = subjects;
    joinedSubjectIds.value = subjects.map((item) => Number(item.id)).filter(Number.isInteger);
    joinedSubjectIds.value.forEach((subjectId) => {
      chatSocket.value.emit("learning-chat:join", subjectId);
    });
  } catch (error) {
    joinedSubjectIds.value = [];
  }
};

const playChatNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();
    if (!audioContext) {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.26);
    oscillator.onended = () => {
      audioContext.close();
    };
  } catch (error) {
    // Ignore notification sound errors.
  }
};

const pushChatToast = (chatMessage) => {
  const subject = liveChatSubjects.value.find((item) => Number(item.id) === Number(chatMessage.subject_id));
  const preview = chatMessage.message
    || (chatMessage.message_type === "VOICE"
      ? "Voice note"
      : chatMessage.message_type === "IMAGE"
        ? "Gambar"
        : chatMessage.message_type === "PDF"
          ? "PDF"
          : chatMessage.attachment_name || "File");

  const nextToast = {
    id: `${Date.now()}-${toastIdCounter += 1}`,
    subjectId: Number(chatMessage.subject_id),
    subjectName: subject?.name || "Live Chat",
    senderName: chatMessage.sender_name || "Pengguna",
    preview,
  };

  chatToasts.value = [nextToast, ...chatToasts.value].slice(0, 3);
  window.setTimeout(() => {
    dismissToast(nextToast.id);
  }, 5000);
};

const dismissToast = (toastId) => {
  chatToasts.value = chatToasts.value.filter((toast) => toast.id !== toastId);
};

const pushLearningToast = (payload) => {
  const nextToast = {
    id: `${Date.now()}-${toastIdCounter += 1}`,
    type: payload.type,
    title: payload.title || "Notifikasi",
    body: payload.body || "",
    subjectName: payload.subject_name || "Pembelajaran",
    route: payload.route || "/",
    routeQuery: payload.route_query || {},
  };

  learningToasts.value = [nextToast, ...learningToasts.value].slice(0, 3);
  window.setTimeout(() => {
    dismissLearningToast(nextToast.id);
  }, 5000);
};

const dismissLearningToast = (toastId) => {
  learningToasts.value = learningToasts.value.filter((toast) => toast.id !== toastId);
};

const openLearningFromToast = (toast) => {
  dismissLearningToast(toast.id);
  router.push({
    path: toast.route || "/",
    query: toast.routeQuery || {},
  });
};

const openChatFromToast = (toast) => {
  dismissToast(toast.id);
  router.push({
    path: role === "GURU" ? "/learning-chat-teacher" : "/learning-chat-student",
    query: { subject: String(toast.subjectId) },
  });
};

const maybeShowBrowserNotification = (chatMessage) => {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const subject = liveChatSubjects.value.find((item) => Number(item.id) === Number(chatMessage.subject_id));
  const body = chatMessage.message
    || (chatMessage.message_type === "VOICE"
      ? "Voice note baru"
      : chatMessage.message_type === "IMAGE"
        ? "Gambar baru"
        : chatMessage.message_type === "PDF"
          ? "PDF baru"
          : chatMessage.attachment_name || "File baru");

  const notification = new Notification(subject?.name || "Live Chat", {
    body: `${chatMessage.sender_name || "Pengguna"}: ${body}`,
  });

  notification.onclick = () => {
    window.focus();
    openChatFromToast({
      id: `browser-${Date.now()}`,
      subjectId: Number(chatMessage.subject_id),
    });
    notification.close();
  };
};

const maybeShowLearningBrowserNotification = (payload) => {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification(payload.title || "Notifikasi", {
    body: payload.body || payload.subject_name || "Ada aktivitas baru",
  });

  notification.onclick = () => {
    window.focus();
    router.push({
      path: payload.route || "/",
      query: payload.route_query || {},
    });
    notification.close();
  };
};

const bindLiveChatSocket = () => {
  if (!shouldTrackLiveChat) {
    return;
  }

  const token = localStorage.getItem("token");
  chatSocket.value = io(realtimeConfig.url, {
    auth: { token },
    path: realtimeConfig.path,
    transports: ["websocket", "polling"],
  });

  chatSocket.value.on("connect", async () => {
    await joinLiveChatRooms();
    await refreshLiveChatSummary();
  });

  chatSocket.value.on("learning-chat:new-message", async (chatMessage) => {
    if (Number(chatMessage?.sender_id) === Number(currentUserId)) {
      return;
    }

    bumpLiveChatUnread(chatMessage?.subject_id);
    playChatNotificationSound();
    pushChatToast(chatMessage);
    maybeShowBrowserNotification(chatMessage);
  });

  chatSocket.value.on("learning-chat:read-updated", async () => {
    if (route.path === "/learning-chat-teacher" || route.path === "/learning-chat-student") {
      clearPendingLiveChatUnread();
    }
    await refreshLiveChatSummary();
  });

  chatSocket.value.on("learning-notification:new", (payload) => {
    playChatNotificationSound();
    pushLearningToast(payload);
    maybeShowLearningBrowserNotification(payload);
  });
};

watch(
  () => route.path,
  async () => {
    openGroups.value = openGroups.value.filter((key) => {
      const group = visibleMenu.value.find((item) => item.key === key);
      return group && hasActiveChild(group);
    });

    if (route.path === "/learning-chat-teacher" || route.path === "/learning-chat-student") {
      clearPendingLiveChatUnread();
    }

    await refreshLiveChatSummary();
  },
);

onMounted(async () => {
  await refreshLiveChatSummary();
  if (typeof window !== "undefined" && typeof Notification !== "undefined" && Notification.permission === "default") {
    Notification.requestPermission().catch(() => { });
  }
  bindLiveChatSocket();
});

onUnmounted(() => {
  if (chatSocket.value) {
    joinedSubjectIds.value.forEach((subjectId) => {
      chatSocket.value.emit("learning-chat:leave", subjectId);
    });
    chatSocket.value.disconnect();
    chatSocket.value = null;
  }
});
</script>
