<template>
  <div class="h-full">
    <nav class="sidebar flex h-full flex-col bg-white dark:bg-gray-800" data-tour="sidebar">
      <div class="sidebar-head shrink-0 border-b border-slate-200 p-4 dark:border-gray-700">
        <div class="flex items-start gap-3">
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
          <router-link to="/dashboard" class="min-w-0 flex-1 pr-2">
            <h2 class="truncate text-xl font-semibold text-gray-800 dark:text-gray-200">{{ schoolNameLabel }}</h2>
            <p class="text-xs text-gray-400">{{ role || "Guest" }}</p>
            <div class="mt-1 flex flex-wrap gap-1.5">
              <p
                v-if="isSarprasRole"
                class="inline-flex rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300"
              >
                CMS Sarpras
              </p>
              <p
                v-if="isKoperasiRole"
                class="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300"
              >
                CMS Koperasi
              </p>
            </div>
          </router-link>
          <button
            class="lg:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-slate-700"
            @click="$emit('sidebarToggle')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" fill="currentColor">
              <path
                d="M7.219 5.781L5.78 7.22L14.563 16L5.78 24.781l1.44 1.439L16 17.437l8.781 8.782l1.438-1.438L17.437 16l8.782-8.781L24.78 5.78L16 14.563z" />
            </svg>
          </button>
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

      </div>

      <div class="sidebar-menu-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-4">
        <p class="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Menu</p>
        <div class="mt-4 space-y-2 pb-8">
          <template v-for="item in visibleMenu" :key="item.key">
            <router-link v-if="!item.children" :to="item.to" :data-tour="item.dataTour"
              class="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left text-gray-700 transition hover:border-slate-200 hover:bg-slate-100 dark:text-gray-200 dark:hover:border-slate-700 dark:hover:bg-gray-700/80"
              :class="{ 'border-sky-100 bg-sky-50 font-medium text-sky-700 shadow-sm dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100': isRouteActive(item.to) }">
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
                class="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left text-gray-700 transition hover:border-slate-200 hover:bg-slate-100 dark:text-gray-200 dark:hover:border-slate-700 dark:hover:bg-gray-700/80"
                :class="{ 'border-sky-100 bg-sky-50 font-medium text-sky-700 shadow-sm dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100': isGroupOpen(item) || hasActiveChild(item) }"
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
                class="ml-4 space-y-2 border-l border-slate-200 pl-3 dark:border-gray-700">
                <router-link v-for="child in item.children" :key="child.to" :to="child.to" :data-tour="child.dataTour"
                  class="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left text-gray-700 transition hover:border-slate-200 hover:bg-slate-100 dark:text-gray-200 dark:hover:border-slate-700 dark:hover:bg-gray-700/80"
                  :class="{ 'border-sky-100 bg-sky-50 font-medium text-sky-700 shadow-sm dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100': isRouteActive(child.to) }">
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
        <div class="w-full max-w-4xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
          <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">Admin Sekolah</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Data Sekolah</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Perbarui nama sekolah dan logo yang tampil untuk seluruh admin sekolah ini.</p>
          </div>

          <form class="max-h-[90vh] space-y-5 overflow-y-auto px-6 py-5" @submit.prevent="submitSchoolEdit">
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

            <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lokasi Absensi</p>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Admin sekolah juga bisa menentukan lokasi absensi dan radius sekolah.
              </p>
              <button
                type="button"
                class="mt-3 inline-flex h-10 items-center justify-center rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500"
                @click="schoolLocationPickerOpen = !schoolLocationPickerOpen"
              >
                {{ schoolLocationPickerOpen ? "Tutup Peta" : "Buka Peta Lokasi" }}
              </button>
              <div v-if="schoolLocationPickerOpen" class="mt-4">
                <MapLocationPicker
                  :title="'Pilih Lokasi Sekolah'"
                  :latitude="schoolEditForm.attendance_latitude"
                  :longitude="schoolEditForm.attendance_longitude"
                  :radius-meters="schoolEditForm.attendance_radius_meters || 150"
                  @update:latitude="(v) => (schoolEditForm.attendance_latitude = String(v ?? ''))"
                  @update:longitude="(v) => (schoolEditForm.attendance_longitude = String(v ?? ''))"
                  @update:radiusMeters="(v) => (schoolEditForm.attendance_radius_meters = String(v ?? ''))"
                />
              </div>
              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Batas Terlambat</label>
                  <input
                    v-model="schoolEditForm.attendance_late_after_time"
                    type="time"
                    class="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                  />
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Check-in setelah jam ini otomatis berstatus terlambat.</p>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jam Pulang Minimal</label>
                  <input
                    v-model="schoolEditForm.attendance_checkout_deadline"
                    type="time"
                    class="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                  />
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Check-out sebelum jam ini tetap dicatat dengan catatan kepulangan tidak sesuai.</p>
                </div>
              </div>
              <div class="mt-4">
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah Kolom Bangku Denah</label>
                <input
                  v-model.number="schoolEditForm.attendance_seat_map_columns"
                  type="number"
                  min="1"
                  max="24"
                  class="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                />
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Mengatur jumlah bangku per baris pada denah nomor bangku.</p>
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
import { playNotificationSound } from "@/utils/notificationSound";
import { useProfileStore } from "@/store/profile";
import { useSidebar } from "@/store/sidebar";
import { useRealtimeStore } from "@/store/realtime";
import { normalizePublicUrl } from "@/utils/url";
import MapLocationPicker from "@/components/MapLocationPicker.vue";

defineEmits(["sidebarToggle"]);

const route = useRoute();
const router = useRouter();
const role = getStoredRole();
const profileStore = useProfileStore();
const sidebarStore = useSidebar();
const realtimeStore = useRealtimeStore();
const { liveChatUnreadCount, liveChatSubjects, privateChatUnreadCount } = storeToRefs(sidebarStore);
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
const schoolLocationPickerOpen = ref(false);
const schoolEditForm = reactive({
  name: "",
  attendance_latitude: "",
  attendance_longitude: "",
  attendance_radius_meters: "",
  attendance_late_after_time: "",
  attendance_checkout_deadline: "",
  attendance_seat_map_columns: 4,
});
let toastIdCounter = 0;

const isAdminRole = role === "ADMIN";
const isSarprasRole = role === "SARPRAS";
const isKoperasiRole = role === "KOPERASI";
const schoolNameLabel = computed(() => storedProfile.value?.school_name || "School System");
const schoolLogoSrc = computed(() => normalizePublicUrl(storedProfile.value?.school_logo) || "");
const isInventoryEnabled = computed(() => storedProfile.value?.inventory_module_enabled !== false);
const isAttendanceEnabled = computed(() => storedProfile.value?.attendance_module_enabled !== false);
const isTeacherAttendanceEnabled = computed(() => storedProfile.value?.attendance_teacher_module_enabled !== false);
const isOfficialExamEnabled = computed(() => storedProfile.value?.official_exam_module_enabled !== false);
const isKoperasiEnabled = computed(() => storedProfile.value?.koperasi_module_enabled !== false);
const isPrivateChatEnabled = computed(() => storedProfile.value?.private_chat_module_enabled !== false);
const isTeachingModuleAIEnabled = computed(() => storedProfile.value?.teaching_module_ai_enabled !== false);
const isPayrollEnabled = computed(() => storedProfile.value?.payroll_module_enabled !== false);
const isSPMBEnabled = computed(() => storedProfile.value?.spmb_module_enabled === true);
const isPersonalTeacherModeEnabled = computed(() => storedProfile.value?.personal_teacher_mode_enabled === true);
const shouldTrackKoperasi = computed(() => isKoperasiEnabled.value && (isAdminRole || isKoperasiRole));
const shouldTrackPrivateChat = computed(() => isPrivateChatEnabled.value && ["ADMIN", "ADMIN_SPMB", "KOPERASI", "BENDAHARA", "GURU", "SISWA"].includes(role));

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
  schoolEditForm.attendance_latitude = storedProfile.value?.attendance_latitude == null ? "" : String(storedProfile.value.attendance_latitude);
  schoolEditForm.attendance_longitude = storedProfile.value?.attendance_longitude == null ? "" : String(storedProfile.value.attendance_longitude);
  schoolEditForm.attendance_radius_meters = storedProfile.value?.attendance_radius_meters == null ? "" : String(storedProfile.value.attendance_radius_meters);
  schoolEditForm.attendance_late_after_time = storedProfile.value?.attendance_late_after_time || "";
  schoolEditForm.attendance_checkout_deadline = storedProfile.value?.attendance_checkout_deadline || "";
  schoolEditForm.attendance_seat_map_columns = Number(storedProfile.value?.attendance_seat_map_columns) || 4;
  schoolEditLogoFile.value = null;
  schoolEditLogoPreview.value = normalizePublicUrl(storedProfile.value?.school_logo) || "";
  removeSchoolEditLogo.value = false;
  if (schoolEditLogoInputRef.value) {
    schoolEditLogoInputRef.value.value = "";
  }
  isSchoolEditModalOpen.value = true;
  schoolLocationPickerOpen.value = Boolean(schoolEditForm.attendance_latitude && schoolEditForm.attendance_longitude);
};

const closeSchoolEditModal = () => {
  if (isSavingSchoolEdit.value) {
    return;
  }

  isSchoolEditModalOpen.value = false;
  schoolLocationPickerOpen.value = false;
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
    if (String(schoolEditForm.attendance_latitude || "").trim() !== "") {
      formData.append("attendance_latitude", String(schoolEditForm.attendance_latitude).trim());
    } else {
      formData.append("clear_attendance_latitude", "true");
    }
    if (String(schoolEditForm.attendance_longitude || "").trim() !== "") {
      formData.append("attendance_longitude", String(schoolEditForm.attendance_longitude).trim());
    } else {
      formData.append("clear_attendance_longitude", "true");
    }
    if (String(schoolEditForm.attendance_radius_meters || "").trim() !== "") {
      formData.append("attendance_radius_meters", String(schoolEditForm.attendance_radius_meters).trim());
    } else {
      formData.append("clear_attendance_radius_meters", "true");
    }
    if (String(schoolEditForm.attendance_late_after_time || "").trim() !== "") {
      formData.append("attendance_late_after_time", String(schoolEditForm.attendance_late_after_time).trim());
    } else {
      formData.append("clear_attendance_late_after_time", "true");
    }
    if (String(schoolEditForm.attendance_checkout_deadline || "").trim() !== "") {
      formData.append("attendance_checkout_deadline", String(schoolEditForm.attendance_checkout_deadline).trim());
    } else {
      formData.append("clear_attendance_checkout_deadline", "true");
    }
    formData.append("attendance_seat_map_columns", String(Number(schoolEditForm.attendance_seat_map_columns) || 4));
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
      attendance_latitude: updatedSchool.attendance_latitude ?? storedProfile.value?.attendance_latitude ?? null,
      attendance_longitude: updatedSchool.attendance_longitude ?? storedProfile.value?.attendance_longitude ?? null,
      attendance_radius_meters: updatedSchool.attendance_radius_meters ?? storedProfile.value?.attendance_radius_meters ?? null,
      attendance_late_after_time: updatedSchool.attendance_late_after_time || "",
      attendance_checkout_deadline: updatedSchool.attendance_checkout_deadline || "",
      attendance_seat_map_columns: Number(updatedSchool.attendance_seat_map_columns) || Number(schoolEditForm.attendance_seat_map_columns) || 4,
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
    { key: "dashboard", to: "/dashboard", dataTour: "dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "school-visit-targets", to: "/school-visit-targets", label: "List Sekolah", icon: "ph:map-trifold" },
    { key: "schools", to: "/schools", label: "Sekolah", icon: "ph:buildings" },
    { key: "module-settings", to: "/module-settings", label: "Setting Modul", icon: "ph:squares-four" },
    { key: "marketing-email", to: "/marketing-email", label: "Email Penawaran", icon: "ph:envelope-simple" },
    { key: "billing", to: "/billing", label: "Billing", icon: "ph:credit-card" },
    { key: "admin-settings", to: "/admin-settings", dataTour: "settings", label: "Setting Admin", icon: "ph:gear-six" },
  ],
  ADMIN: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "school-users", to: "/school-users", dataTour: "teachers", label: "User Sekolah", icon: "clarity:users-line" },
    { key: "chat", to: "/chat", label: "Pesan", icon: "ph:chats-circle" },
    { key: "classes", to: "/classes", dataTour: "classes", label: "Kelas", icon: "mdi:google-classroom" },
    { key: "majors", to: "/majors", label: "Jurusan", icon: "ph:git-branch" },
    { key: "spmb", to: "/spmb", label: "SPMB", icon: "ph:identification-card" },
    { key: "students", to: "/students", dataTour: "students-admin", label: "Siswa", icon: "mdi:account-school-outline" },
    { key: "academic-periods", to: "/academic-periods", label: "Tahun Ajaran", icon: "ph:calendar-blank" },
    { key: "inventory", to: "/inventory", label: "Sarpras", icon: "ph:archive-box" },
    { key: "koperasi", to: "/koperasi", label: "Koperasi", icon: "ph:shopping-cart" },
    {
      key: "curriculum-module",
      label: "Kurikulum",
      icon: "ph:books",
      children: [
        { to: "/learning-admin", dataTour: "curriculum", label: "Mata Pelajaran", icon: "ph:book-open-text" },
        { to: "/learning-subjects", label: "Guru Mapel", icon: "ph:user-focus" },
        { to: "/learning-admin/teacher-loads", label: "Beban Guru", icon: "ph:chalkboard-teacher" },
        { to: "/learning-admin/class-distributions", label: "Distribusi Guru ke Kelas", icon: "ph:git-branch" },
        { to: "/learning-admin/schedule", label: "Jadwal Pembelajaran", icon: "ph:calendar-blank" },
        { to: "/learning-admin/generate", label: "Generate Pembagian", icon: "ph:magic-wand" },
      ],
    },
    { key: "learning-exams-admin", to: "/learning-exams-admin", label: "Ujian Resmi", icon: "ph:exam" },
    { key: "announcements", to: "/announcements", label: "Pengumuman", icon: "ph:megaphone-simple" },
    { key: "billing", to: "/billing", label: "Billing", icon: "ph:credit-card" },
    { key: "admin-settings", to: "/admin-settings", dataTour: "settings", label: "Setting", icon: "ph:gear-six" },
  ],
  ADMIN_SPMB: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "spmb", to: "/spmb", label: "SPMB", icon: "ph:identification-card" },
    { key: "majors", to: "/majors", label: "Jurusan", icon: "ph:git-branch" },
    { key: "chat", to: "/chat", label: "Pesan", icon: "ph:chats-circle" },
  ],
  GURU: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "homeroom-students", to: "/homeroom-students", dataTour: "students", label: "Siswa Wali Kelas", icon: "mdi:account-school-outline" },
    { key: "chat", to: "/chat", label: "Pesan", icon: "ph:chats-circle" },
    { key: "attendance", to: "/attendance", dataTour: "attendance", label: "Absensi", icon: "mdi:calendar-check-outline" },
    { key: "face-enrollment", to: "/face-enrollment", label: "Enrol Wajah", icon: "mdi:face-recognition" },
    {
      key: "learning-module",
      label: "Modul Pembelajaran",
      icon: "ph:books",
      children: [
        { to: "/learning-teacher", dataTour: "learning-teacher", label: "Pembelajaran", icon: "ph:book-open-text" },
        { to: "/learning-teaching-module-teacher", label: "Modul Ajar AI", icon: "ph:notebook" },
        { to: "/learning-question-bank-teacher", dataTour: "question-bank", label: "Bank Soal", icon: "ph:stack" },
        { to: "/learning-quiz-teacher", label: "Quiz", icon: "ph:brain" },
        { to: "/learning-exams-teacher", label: "Ujian Resmi", icon: "ph:exam" },
        { to: "/learning-grades-teacher", dataTour: "grades-teacher", label: "Penilaian", icon: "ph:exam" },
        { to: "/learning-report-teacher", label: "Rapor Mapel", icon: "ph:table" },
      ],
    },
  ],
  SARPRAS: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "inventory", to: "/inventory", label: "Daftar Barang", icon: "ph:archive-box" },
  ],
  SISWA: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "chat", to: "/chat", label: "Pesan", icon: "ph:chats-circle" },
    {
      key: "learning-module",
      label: "Modul Pembelajaran",
      icon: "ph:books",
      children: [
        { to: "/learning-student/materials", dataTour: "learning-materials", label: "Materi", icon: "ph:book-open-text" },
        { to: "/learning-student/assignments", dataTour: "learning-assignments", label: "Tugas File", icon: "ph:file-text" },
        { to: "/learning-quiz-student", label: "Quiz", icon: "ph:brain" },
        { to: "/learning-exams-student", label: "Ujian Resmi", icon: "ph:exam" },
        { to: "/learning-grades-student", dataTour: "grades", label: "Nilai Saya", icon: "ph:chart-line-up" },
      ],
    },
    { key: "attendance", to: "/attendance", dataTour: "attendance", label: "Absensi", icon: "mdi:calendar-check-outline" },
    { key: "face-enrollment", to: "/face-enrollment", label: "Enrol Wajah", icon: "mdi:face-recognition" },
    { key: "receipts", to: "/receipts", label: "Bukti Pembayaran", icon: "ph:receipt" },
    { key: "inventory", to: "/inventory", label: "Peminjaman Barang", icon: "ph:archive-box" },
    { key: "koperasi", to: "/koperasi", label: "Koperasi", icon: "ph:shopping-cart" },
  ],
  KOPERASI: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    { key: "koperasi", to: "/koperasi", label: "Koperasi", icon: "ph:shopping-cart" },
    { key: "chat", to: "/chat", label: "Pesan", icon: "ph:chats-circle" },
  ],
  BENDAHARA: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: "bxs:dashboard" },
    {
      key: "payroll",
      label: "Penggajian Guru",
      icon: "ph:money",
      children: [
        { to: "/payroll/slips", label: "Daftar Slip", icon: "ph:receipt" },
        { to: "/payroll/components", label: "Komponen Gaji", icon: "ph:list-plus" },
        { to: "/payroll/settings", label: "Setting Tarif", icon: "ph:sliders" },
      ],
    },
    { key: "chat", to: "/chat", label: "Pesan", icon: "ph:chats-circle" },
  ],
  ORANG_TUA: [
    { key: "dashboard", to: "/dashboard", label: "Pantauan Anak", icon: "bxs:dashboard" },
  ],
};

const filterMenuItems = (items = []) =>
  items
    .map((item) => {
      if (isPersonalTeacherModeEnabled.value) {
        const hiddenPersonalKeys = new Set([
          "school-users",
          "homeroom-students",
          "inventory",
          "koperasi",
          "spmb",
          "learning-exams-admin",
          "announcements",
          "billing",
        ]);
        if (hiddenPersonalKeys.has(item.key)) {
          return null;
        }
      }
      if (item.key === "inventory" && !isInventoryEnabled.value) {
        return null;
      }
      const attendanceEnabledForRole = role === "GURU" ? isTeacherAttendanceEnabled.value : isAttendanceEnabled.value;
      if ((item.key === "attendance" || item.key === "face-enrollment") && !attendanceEnabledForRole) {
        return null;
      }
      if (item.key === "koperasi" && !isKoperasiEnabled.value) {
        return null;
      }
      if (item.key === "payroll" && !isPayrollEnabled.value) {
        return null;
      }
      if (item.key === "spmb" && !isSPMBEnabled.value) {
        return null;
      }
      if (item.key === "chat" && !isPrivateChatEnabled.value && !shouldTrackLiveChat) {
        return null;
      }
      if (item.key === "learning-exams-admin" && !isOfficialExamEnabled.value) {
        return null;
      }
      if (item.children) {
        const children = item.children.filter((child) => {
          if (isPersonalTeacherModeEnabled.value) {
            const hiddenPersonalChildPaths = new Set([
              "/learning-admin/teacher-loads",
              "/learning-admin/class-distributions",
              "/learning-admin/schedule",
              "/learning-admin/generate",
              "/learning-exams-teacher",
              "/learning-exams-student",
              "/learning-report-teacher",
            ]);
            if (hiddenPersonalChildPaths.has(child.to)) {
              return false;
            }
          }
          if ((child.to === "/learning-exams-teacher" || child.to === "/learning-exams-student") && !isOfficialExamEnabled.value) {
            return false;
          }
          if (child.to === "/learning-teaching-module-teacher" && !isTeachingModuleAIEnabled.value) {
            return false;
          }
          return true;
        });
        if (children.length === 0) {
          return null;
        }
        return { ...item, children };
      }
      return item;
    })
    .filter(Boolean);

const visibleMenu = computed(() => filterMenuItems(menuByRole[role] || []));
const shouldTrackLiveChat = ["GURU", "SISWA"].includes(role);

const isRouteActive = (path) => route.path === path;

const hasActiveChild = (item) => item.children?.some((child) => route.path === child.to);

const isGroupOpen = (item) => sidebarStore.getOpenGroups(role).includes(item.key);

const toggleGroup = (key) => {
  sidebarStore.toggleGroup(role, key);
};

const getChildBadge = (child) => {
  if (child.to === "/chat") {
    return liveChatUnreadCount.value + privateChatUnreadCount.value;
  }

  return 0;
};

const getGroupBadge = (item) => {
  if (item.to === "/chat" || item.key === "chat") {
    return privateChatUnreadCount.value + liveChatUnreadCount.value;
  }

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
    path: "/chat",
    query: { subject: String(toast.subjectId) },
  });
};

const openPrivateChat = (peerUserId) => {
  const normalizedPeerUserId = Number(peerUserId || 0);
  if (!normalizedPeerUserId) {
    return;
  }

  router.push({
    path: "/chat",
    query: { user: String(normalizedPeerUserId) },
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

const maybeShowPrivateChatBrowserNotification = (payload) => {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const senderName = payload?.sender_full_name || payload?.sender_name || "Pengguna";
  const notification = new Notification("Chat Pribadi", {
    body: `${senderName}: ${payload?.message || "Pesan baru"}`,
  });

  notification.onclick = () => {
    window.focus();
    openPrivateChat(payload?.sender_id);
    notification.close();
  };
};

const pushKoperasiToast = (payload) => {
  const orderNumber = payload?.order_number || payload?.orderNumber || payload?.order_no || "-";
  const paymentStatus = String(payload?.payment_status || "").toUpperCase();
  const action = String(payload?.action || "").toUpperCase();
  const isCreated = payload?.event === "koperasi:order-created" || action === "CREATED";
  const isPaid = paymentStatus === "PAID";
  const isFailed = ["FAILED", "EXPIRED", "CANCELED", "CANCELLED", "REJECTED"].includes(paymentStatus);
  const title = isCreated
    ? "Pesanan Koperasi Baru"
    : `Pesanan ${orderNumber}`;
  const message = isCreated
    ? `Pesanan ${orderNumber} baru masuk.`
    : isPaid
      ? `Pesanan ${orderNumber} berhasil dibayar.`
      : isFailed
        ? `Pesanan ${orderNumber} gagal atau kedaluwarsa.`
        : `Pesanan ${orderNumber} diperbarui.`;
  const type = isPaid ? "success" : isFailed ? "error" : "info";

  pushToast({
    title,
    message,
    type,
    duration: 5000,
  });
};

const bindRealtimeStream = () => {
  if (!shouldTrackLiveChat && !shouldTrackPrivateChat.value && !shouldTrackKoperasi.value) {
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
      playNotificationSound(chatMessage?.soundUrl || chatMessage?.sound_url || "chat");
      pushChatToast(chatMessage);
      maybeShowBrowserNotification(chatMessage);
    }),
    realtimeStore.on("learning-chat:read-updated", async () => {
      await refreshLiveChatSummary(true);
    }),
    realtimeStore.on("learning-notification:new", (payload) => {
      playNotificationSound(payload?.soundUrl || payload?.sound_url || "announcement");
      pushLearningToast(payload);
      maybeShowLearningBrowserNotification(payload);
    }),
    realtimeStore.on("private-chat:new-message", async (payload) => {
      if (!shouldTrackPrivateChat.value) {
        return;
      }
      if (Number(payload?.sender_id || 0) === Number(currentUserId)) {
        return;
      }

      sidebarStore.bumpPrivateChatUnread(payload?.sender_id);
      playNotificationSound(payload?.soundUrl || payload?.sound_url || "chat");
      pushToast({
        title: payload?.sender_full_name || payload?.sender_name || "Chat Pribadi",
        message: payload?.message || "Pesan baru masuk",
        type: "info",
        duration: 4500,
      });
      maybeShowPrivateChatBrowserNotification(payload);
      await sidebarStore.refreshPrivateChatSummary({ force: true });
    }),
    realtimeStore.on("private-chat:read-updated", async () => {
      if (!shouldTrackPrivateChat.value) {
        return;
      }
      await sidebarStore.refreshPrivateChatSummary({ force: true });
    }),
    realtimeStore.on("koperasi:order-created", (payload) => {
      if (!shouldTrackKoperasi.value) {
        return;
      }

      pushKoperasiToast(payload);
    }),
    realtimeStore.on("koperasi:order-updated", async (payload) => {
      if (!shouldTrackKoperasi.value) {
        return;
      }

      pushKoperasiToast(payload);
    }),
  ];
};

watch(
  () => route.path,
  () => {
    refreshLiveChatSummary(false).catch(() => {});
  },
);

onMounted(() => {
  profileStore.loadProfile().catch(() => {});

  const startupTasks = [refreshLiveChatSummary(false)];
  if (shouldTrackLiveChat) {
    startupTasks.push(sidebarStore.refreshLiveChatSubjects(role));
  }
  if (shouldTrackPrivateChat.value) {
    startupTasks.push(sidebarStore.refreshPrivateChatSummary({ force: false }));
  }

  Promise.allSettled(startupTasks).finally(() => {
    bindRealtimeStream();
  });

  if (typeof window !== "undefined" && typeof Notification !== "undefined" && Notification.permission === "default") {
    Notification.requestPermission().catch(() => { });
  }
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

<style scoped>
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .sidebar-menu-scroll {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
}
</style>
