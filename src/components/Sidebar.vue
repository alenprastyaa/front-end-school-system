<template>
  <div>
    <nav class="sidebar bg-white dark:bg-gray-800 h-full">
      <div class="sidebar-head p-4 border-b dark:border-gray-700">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="group relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 transition hover:bg-slate-200 dark:bg-slate-700 dark:ring-slate-600 dark:hover:bg-slate-600"
            :class="isAdminRole ? 'cursor-pointer' : 'cursor-default'"
            :disabled="!isAdminRole || isUploadingSchoolLogo"
            @click="triggerSchoolLogoPicker"
          >
            <img v-if="schoolLogoSrc" :src="schoolLogoSrc" :alt="schoolNameLabel" class="h-full w-full object-cover" />
            <img v-else class="w-8" src="@/assets/logo/logo.svg" alt="School System" />
            <span
              v-if="isAdminRole"
              class="absolute inset-0 flex items-center justify-center bg-slate-900/45 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
            >
              {{ isUploadingSchoolLogo ? "Upload..." : "Ubah" }}
            </span>
          </button>
          <input ref="schoolLogoInputRef" type="file" accept="image/*" class="hidden" @change="handleSchoolLogoChange" />
          <router-link to="/dashboard" class="min-w-0 flex-1">
            <h2 class="truncate text-xl font-semibold text-gray-800 dark:text-gray-200">{{ schoolNameLabel }}</h2>
            <p class="text-xs text-gray-400">{{ role || "Guest" }}</p>
          </router-link>
        </div>
        <div v-if="isAdminRole" class="mt-2 flex items-center justify-between gap-3">
          <p class="text-[11px] text-slate-400">Klik logo untuk ganti logo sekolah</p>
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="openSchoolEditModal"
          >
            Edit Sekolah
          </button>
        </div>

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

    <teleport to="body">
      <div
        v-if="isSchoolEditModalOpen"
        class="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
        @click.self="closeSchoolEditModal"
      >
        <div class="w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">Admin Sekolah</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Data Sekolah</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Perbarui nama sekolah dan logo yang tampil untuk seluruh admin sekolah ini.</p>
          </div>

          <form class="space-y-5 px-6 py-5" @submit.prevent="submitSchoolEdit">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Sekolah</label>
              <input
                v-model="schoolEditForm.name"
                type="text"
                required
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Logo Sekolah</label>
              <div class="flex items-center gap-4">
                <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                  <img v-if="schoolEditLogoPreview" :src="schoolEditLogoPreview" :alt="schoolEditForm.name || schoolNameLabel" class="h-full w-full object-cover" />
                  <img v-else class="w-8" src="@/assets/logo/logo.svg" alt="School System" />
                </div>
                <div class="min-w-0 flex-1">
                  <input
                    ref="schoolEditLogoInputRef"
                    type="file"
                    accept="image/*"
                    class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:file:bg-sky-500"
                    @change="handleSchoolEditLogoChange"
                  />
                  <label class="mt-3 inline-flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-300">
                    <input
                      v-model="removeSchoolEditLogo"
                      type="checkbox"
                      class="rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-900"
                    />
                    Hapus logo sekolah saat disimpan
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button
                type="button"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                @click="closeSchoolEditModal"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSavingSchoolEdit"
                class="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
              >
                {{ isSavingSchoolEdit ? "Menyimpan..." : "Simpan Perubahan" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { getStoredRole } from "@/utils/auth";
import { pushToast } from "@/composables/useToast";
import { useProfileStore } from "@/store/profile";
import { useSidebar } from "@/store/sidebar";
import { useRealtimeStore } from "@/store/realtime";
import { normalizePublicUrl } from "@/utils/url";

defineEmits(["sidebarToggle"]);

const route = useRoute();
const router = useRouter();
const role = getStoredRole();
const profileStore = useProfileStore();
const sidebarStore = useSidebar();
const realtimeStore = useRealtimeStore();
const { liveChatUnreadCount, liveChatSubjects } = storeToRefs(sidebarStore);
const { profile: storedProfile } = storeToRefs(profileStore);
const chatToasts = ref([]);
const learningToasts = ref([]);
const realtimeUnsubscribers = ref([]);
const schoolLogoInputRef = ref(null);
const isUploadingSchoolLogo = ref(false);
const isSchoolEditModalOpen = ref(false);
const isSavingSchoolEdit = ref(false);
const schoolEditLogoInputRef = ref(null);
const schoolEditLogoFile = ref(null);
const schoolEditLogoPreview = ref("");
const removeSchoolEditLogo = ref(false);
const schoolEditForm = reactive({
  name: "",
});
let toastIdCounter = 0;

const isAdminRole = role === "ADMIN";
const schoolNameLabel = computed(() => storedProfile.value?.school_name || "School System");
const schoolLogoSrc = computed(() => normalizePublicUrl(storedProfile.value?.school_logo) || "");

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

const triggerSchoolLogoPicker = () => {
  if (!isAdminRole || isUploadingSchoolLogo.value) {
    return;
  }
  schoolLogoInputRef.value?.click();
};

const handleSchoolLogoChange = async (event) => {
  const file = event.target.files?.[0] || null;
  if (!file || !isAdminRole) {
    return;
  }

  isUploadingSchoolLogo.value = true;
  try {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await api.put("/school/current/branding", formData);
    const updatedSchool = response?.data || {};
    profileStore.applyProfile({
      school_id: updatedSchool.id || storedProfile.value?.school_id || null,
      school_name: updatedSchool.name || storedProfile.value?.school_name || "School System",
      school_logo: updatedSchool.logo_url || null,
    });
    pushToast({
      title: "Logo Sekolah Diperbarui",
      message: "Logo sekolah berhasil diubah.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Mengubah Logo",
      message: error.message || "Logo sekolah tidak berhasil diperbarui.",
      type: "error",
    });
  } finally {
    if (schoolLogoInputRef.value) {
      schoolLogoInputRef.value.value = "";
    }
    isUploadingSchoolLogo.value = false;
  }
};

const openSchoolEditModal = () => {
  if (!isAdminRole) {
    return;
  }

  schoolEditForm.name = storedProfile.value?.school_name || "";
  schoolEditLogoFile.value = null;
  schoolEditLogoPreview.value = normalizePublicUrl(storedProfile.value?.school_logo) || "";
  removeSchoolEditLogo.value = false;
  if (schoolEditLogoInputRef.value) {
    schoolEditLogoInputRef.value.value = "";
  }
  isSchoolEditModalOpen.value = true;
};

const closeSchoolEditModal = () => {
  if (isSavingSchoolEdit.value) {
    return;
  }

  isSchoolEditModalOpen.value = false;
};

const handleSchoolEditLogoChange = (event) => {
  const file = event.target.files?.[0] || null;
  schoolEditLogoFile.value = file;
  removeSchoolEditLogo.value = false;

  if (!file) {
    schoolEditLogoPreview.value = normalizePublicUrl(storedProfile.value?.school_logo) || "";
    return;
  }

  schoolEditLogoPreview.value = URL.createObjectURL(file);
};

const submitSchoolEdit = async () => {
  isSavingSchoolEdit.value = true;

  try {
    const formData = new FormData();
    formData.append("name", schoolEditForm.name || schoolNameLabel.value);
    if (schoolEditLogoFile.value) {
      formData.append("logo", schoolEditLogoFile.value);
    }
    if (removeSchoolEditLogo.value && !schoolEditLogoFile.value) {
      formData.append("remove_logo", "true");
    }

    const response = await api.put("/school/current", formData);
    const updatedSchool = response?.data || {};
    profileStore.applyProfile({
      school_id: updatedSchool.id || storedProfile.value?.school_id || null,
      school_name: updatedSchool.name || schoolEditForm.name || "School System",
      school_logo: updatedSchool.logo_url || null,
    });
    isSchoolEditModalOpen.value = false;
    pushToast({
      title: "Data Sekolah Diperbarui",
      message: response?.message || "Perubahan data sekolah berhasil disimpan.",
      type: "success",
    });
  } catch (error) {
    pushToast({
      title: "Gagal Memperbarui Sekolah",
      message: error.message || "Data sekolah tidak berhasil diperbarui.",
      type: "error",
    });
  } finally {
    isSavingSchoolEdit.value = false;
  }
};

const menuByRole = {
  SUPER_ADMIN: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "schools", to: "/schools", label: "Sekolah", icon: "ph:buildings" },
  ],
  ADMIN: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "school-users", to: "/school-users", label: "User Sekolah", icon: "clarity:users-line" },
    { key: "classes", to: "/classes", label: "Kelas", icon: "mdi:google-classroom" },
    { key: "students", to: "/students", label: "Siswa", icon: "mdi:account-school-outline" },
    { key: "academic-periods", to: "/academic-periods", label: "Tahun Ajaran", icon: "ph:calendar-blank" },
    {
      key: "curriculum-module",
      label: "Kurikulum",
      icon: "ph:books",
      children: [
        { to: "/learning-admin", label: "Mata Pelajaran", icon: "ph:book-open-text" },
        { to: "/learning-admin/teacher-loads", label: "Beban Guru", icon: "ph:chalkboard-teacher" },
        { to: "/learning-admin/class-distributions", label: "Distribusi Guru ke Kelas", icon: "ph:git-branch" },
        { to: "/learning-admin/schedule", label: "Jadwal Pembelajaran", icon: "ph:calendar-blank" },
        { to: "/learning-admin/generate", label: "Generate Pembagian", icon: "ph:magic-wand" },
      ],
    },
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
        { to: "/learning-grades-student", label: "Nilai Saya", icon: "ph:chart-line-up" },
      ],
    },
    { key: "attendance", to: "/attendance", label: "Absensi", icon: "mdi:calendar-check-outline" },
    { key: "face-enrollment", to: "/face-enrollment", label: "Enrol Wajah", icon: "mdi:face-recognition" },
    { key: "receipts", to: "/receipts", label: "Bukti Pembayaran", icon: "ph:receipt" },
  ],
};

const visibleMenu = computed(() => menuByRole[role] || []);
const shouldTrackLiveChat = ["GURU", "SISWA"].includes(role);

const isRouteActive = (path) => route.path === path;

const hasActiveChild = (item) => item.children?.some((child) => route.path === child.to);

const isGroupOpen = (item) => sidebarStore.getOpenGroups(role).includes(item.key);

const toggleGroup = (key) => {
  sidebarStore.toggleGroup(role, key);
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

const refreshLiveChatSummary = async (force = false) => {
  if (!shouldTrackLiveChat) {
    sidebarStore.applyLiveChatSummary([]);
    sidebarStore.clearPendingLiveChatUnread();
    return;
  }

  await sidebarStore.refreshLiveChatSummary({ force });
};

const clearPendingLiveChatUnread = () => {
  sidebarStore.clearPendingLiveChatUnread();
};

const isAllowedSubjectNotification = (subjectId) => {
  const normalized = Number(subjectId || 0);
  if (!normalized) {
    return false;
  }

  return liveChatSubjects.value.some((item) => Number(item.id) === normalized);
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
  if (!isAllowedSubjectNotification(chatMessage?.subject_id)) {
    return;
  }

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
  if (!isAllowedSubjectNotification(chatMessage?.subject_id)) {
    return;
  }

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

const bindRealtimeStream = () => {
  if (!shouldTrackLiveChat) {
    return;
  }

  const token = localStorage.getItem("token");
  realtimeStore.connect(token);

  realtimeUnsubscribers.value = [
    realtimeStore.on("learning-chat:new-message", (chatMessage) => {
      if (Number(chatMessage?.sender_id) === Number(currentUserId)) {
        return;
      }

      if (!isAllowedSubjectNotification(chatMessage?.subject_id)) {
        return;
      }

      sidebarStore.bumpLiveChatUnread(chatMessage?.subject_id);
      playChatNotificationSound();
      pushChatToast(chatMessage);
      maybeShowBrowserNotification(chatMessage);
    }),
    realtimeStore.on("learning-chat:read-updated", async () => {
      await refreshLiveChatSummary(true);
    }),
    realtimeStore.on("learning-notification:new", (payload) => {
      playChatNotificationSound();
      pushLearningToast(payload);
      maybeShowLearningBrowserNotification(payload);
    }),
  ];
};

watch(
  () => route.path,
  async () => {
    await refreshLiveChatSummary(false);
  },
);

onMounted(async () => {
  profileStore.loadProfile().catch(() => {});
  await refreshLiveChatSummary(false);
  await sidebarStore.refreshLiveChatSubjects(role);
  if (typeof window !== "undefined" && typeof Notification !== "undefined" && Notification.permission === "default") {
    Notification.requestPermission().catch(() => { });
  }
  bindRealtimeStream();
});

onUnmounted(() => {
  realtimeUnsubscribers.value.forEach((unsubscribe) => {
    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  });
  realtimeUnsubscribers.value = [];
});
</script>
