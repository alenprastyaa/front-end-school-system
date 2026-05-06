<template>
  <header
    class="app-header sticky top-0 z-40 shrink-0 border-b-2 bg-white/95 p-4 backdrop-blur dark:border-gray-700 dark:bg-gray-800/95"
  >
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-4">
        <button class="text-gray-500 block" @click="$emit('sidebarToggle')">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16" fill="none">
            <path d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5" stroke="currentColor" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="1.5" />
          </svg>
        </button>
        <div>
          <p class="text-sm text-gray-400">Sekolah</p>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ userProfile.school_name || userProfile.school_id || "Belum terhubung ke sekolah" }}
          </h1>
          <div class="mt-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Pengguna LMS online</span>
            <span class="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white dark:bg-emerald-400 dark:text-emerald-950">
              {{ onlineLmsCount }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button @click="fullscreenToggle" class="text-2xl text-gray-500">
          <Icon :icon="fullscreenMode ? 'ic:outline-fullscreen-exit' : 'ic:outline-fullscreen'" />
        </button>

        <div class="relative">
          <button @click="menu = !menu" class="flex items-center gap-3 rounded-md p-1">
            <img :src="avatarSrc" class="rounded-full w-10 h-10 p-1 ring-1 ring-gray-300 dark:ring-gray-500"
              alt="avatar" />
            <div class="text-left hidden md:block">
              <h2 class="text-gray-800 dark:text-white">{{ userProfile.full_name || userProfile.username || "User" }}</h2>
              <p class="text-xs text-gray-400 capitalize">{{ userProfile.role || "Guest" }}</p>
            </div>
          </button>

          <transition name="fade">
            <div v-show="menu"
              class="absolute right-0 mt-2 z-50 w-56 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded divide-y dark:divide-gray-700 divide-gray-100 shadow">
              <div class="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">
                <div>{{ userProfile.full_name || userProfile.username || "-" }}</div>
                <div class="font-medium truncate">{{ userProfile.role || "-" }}</div>
              </div>
              <div class="py-1">
                <button @click="openProfileModal"
                  class="block w-full text-left py-2 px-4 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white">
                  Profil Saya
                </button>
                <button @click="logout"
                  class="block w-full text-left py-2 px-4 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white">
                  Sign out
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>

  <transition name="fade">
    <div v-if="showProfileModal" class="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm"
      @click.self="closeProfileModal">
      <div class="mx-auto my-6 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Profil Saya</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Username tidak dapat diubah.</p>
          </div>
          <button class="text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-slate-200" :disabled="isSavingProfile" @click="closeProfileModal">
            <Icon icon="mdi:close" class="text-2xl" />
          </button>
        </div>

        <div v-if="profileMessage" class="mt-4 rounded-xl px-4 py-3 text-sm font-medium"
          :class="profileError ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'">
          {{ profileMessage }}
        </div>

        <form class="mt-5 space-y-5" :class="{ 'pointer-events-none opacity-80': isSavingProfile }" @submit.prevent="saveProfile">
          <div class="flex items-center gap-4">
            <img :src="profilePreview || avatarSrc" alt="Foto profil"
              class="h-20 w-20 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700" />
            <div class="flex-1">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Foto profil</label>
              <input type="file" accept="image/*"
                :disabled="isSavingProfile"
                class="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200"
                @change="handleProfileImageChange" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
            <input v-model="profileForm.username" type="text" disabled
              class="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400" />
            <p class="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">Username digunakan untuk login.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Nama Lengkap</label>
            <input v-model="profileForm.full_name" type="text"
              :disabled="isSavingProfile"
              class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="Nama lengkap pengguna" />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
              <input v-model="profileForm.parent_email" type="email"
                :disabled="isSavingProfile"
                class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="email@contoh.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">No. HP</label>
              <input v-model="profileForm.phone_number" type="text"
                :disabled="isSavingProfile"
                class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <div>
            <button type="button"
              :disabled="isSavingProfile"
              class="inline-flex items-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              @click="showPasswordFields = !showPasswordFields">
              {{ showPasswordFields ? "Tutup Ubah Password" : "Ubah Password" }}
            </button>
            <div v-if="showPasswordFields" class="mt-3 grid gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Password saat ini</label>
                <input v-model="profileForm.current_password" type="password" autocomplete="current-password"
                  :disabled="isSavingProfile"
                  class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Password saat ini" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Password baru</label>
                <input v-model="profileForm.new_password" type="password" autocomplete="new-password"
                  :disabled="isSavingProfile"
                  class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Minimal 6 karakter" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Konfirmasi password
                  baru</label>
                <input v-model="profileForm.confirm_password" type="password" autocomplete="new-password"
                  :disabled="isSavingProfile"
                  class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Ulangi password baru" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button type="button"
              :disabled="isSavingProfile"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
              @click="closeProfileModal">
              Batal
            </button>
            <button type="submit" :disabled="isSavingProfile"
              class="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
              {{ isSavingProfile ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { cancelPendingApiRequests } from "@/api";
import { fullscreen as handleFullscreen } from "@/helper/fullscreen";
import { clearSession, getStoredUser } from "@/utils/auth";
import { normalizePublicUrl } from "@/utils/url";
import defaultAvatar from "@/assets/img/user.jpg";
import { useProfileStore } from "@/store/profile";
import { useRealtimeStore } from "@/store/realtime";
import { pushToast } from "@/composables/useToast";

const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();
const realtimeStore = useRealtimeStore();
const { profile: storedProfile } = storeToRefs(profileStore);

defineEmits(["sidebarToggle"]);

const menu = ref(false);
const fullscreenMode = ref(false);
const showProfileModal = ref(false);
const isSavingProfile = ref(false);
const showPasswordFields = ref(false);
const onlineLmsCount = ref(0);
const realtimeUnsubscribers = ref([]);
const profileError = ref(false);
const profileMessage = ref("");
const profilePreview = ref("");
const profileImageFile = ref(null);
const userProfile = ref({
  full_name: "",
  username: "User",
  role: "Guest",
  school_name: "",
  school_id: "",
  parent_email: "",
  phone_number: "",
  profile_image: "",
});
const profileForm = ref({
  full_name: "",
  username: "",
  parent_email: "",
  phone_number: "",
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const avatarSrc = computed(() => normalizePublicUrl(userProfile.value.profile_image) || defaultAvatar);

const normalizeProfileImageOrientation = async (file) => {
  if (!file || !file.type?.startsWith("image/")) {
    return file;
  }
  if (typeof createImageBitmap !== "function") {
    return file;
  }

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const normalizedBlob = await new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), file.type || "image/jpeg", 0.95);
  });

  if (!normalizedBlob) {
    return file;
  }

  return new File([normalizedBlob], file.name, {
    type: normalizedBlob.type || file.type || "image/jpeg",
    lastModified: Date.now(),
  });
};

watch(
  () => route.path,
  () => {
    menu.value = false;
  },
);

const fullscreenToggle = () => {
  fullscreenMode.value = !fullscreenMode.value;
  handleFullscreen(fullscreenMode.value);
};

const logout = () => {
  cancelPendingApiRequests();
  realtimeStore.disconnect();
  clearSession();
  profileStore.resetProfileState();
  router.push({ name: "Login" });
};

const syncProfileForm = () => {
  profileForm.value = {
    full_name: userProfile.value.full_name || "",
    username: userProfile.value.username || "",
    parent_email: userProfile.value.parent_email || "",
    phone_number: userProfile.value.phone_number || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  };
  profilePreview.value = "";
  profileImageFile.value = null;
  showPasswordFields.value = false;
  profileMessage.value = "";
  profileError.value = false;
};

const loadProfile = async () => {
  try {
    const profile = await profileStore.loadProfile();
    userProfile.value = {
      ...userProfile.value,
      ...profile,
      profile_image: normalizePublicUrl(profile.profile_image) || null,
    };
    syncProfileForm();
  } catch (error) {
    if (error?.isAborted) {
      return;
    }
    userProfile.value = {
      ...userProfile.value,
      ...(getStoredUser() || {}),
    };
    syncProfileForm();
  }
};

const openProfileModal = async () => {
  menu.value = false;
  showProfileModal.value = true;
  syncProfileForm();
  await loadProfile();
};

const closeProfileModal = () => {
  if (isSavingProfile.value) {
    return;
  }
  showProfileModal.value = false;
  syncProfileForm();
};

const handleProfileImageChange = async (event) => {
  const file = event.target.files?.[0] || null;
  if (!file) {
    profileImageFile.value = null;
    profilePreview.value = "";
    return;
  }

  try {
    const normalized = await normalizeProfileImageOrientation(file);
    profileImageFile.value = normalized;
    profilePreview.value = URL.createObjectURL(normalized);
  } catch (error) {
    profileImageFile.value = file;
    profilePreview.value = URL.createObjectURL(file);
  }
};

const saveProfile = async () => {
  if (
    !profileImageFile.value &&
    !profileForm.value.new_password &&
    (profileForm.value.full_name || "") === (userProfile.value.full_name || "") &&
    (profileForm.value.parent_email || "") === (userProfile.value.parent_email || "") &&
    (profileForm.value.phone_number || "") === (userProfile.value.phone_number || "")
  ) {
    profileError.value = true;
    profileMessage.value = "Belum ada perubahan yang bisa disimpan.";
    pushToast({
      title: "Tidak Ada Perubahan",
      message: "Belum ada data profil yang diubah.",
      type: "error",
    });
    return;
  }

  isSavingProfile.value = true;
  profileError.value = false;
  profileMessage.value = "";
  pushToast({
    title: "Menyimpan Profil",
    message: "Perubahan profil sedang diproses.",
    type: "info",
  });

  try {
    const formData = new FormData();
    if (profileImageFile.value) {
      formData.append("profile_image", profileImageFile.value);
    }
    formData.append("full_name", profileForm.value.full_name || "");
    formData.append("parent_email", profileForm.value.parent_email || "");
    formData.append("phone_number", profileForm.value.phone_number || "");
    if (profileForm.value.current_password) {
      formData.append("current_password", profileForm.value.current_password);
    }
    if (profileForm.value.new_password) {
      formData.append("new_password", profileForm.value.new_password);
    }
    if (profileForm.value.confirm_password) {
      formData.append("confirm_password", profileForm.value.confirm_password);
    }

    const response = await profileStore.saveProfile(formData);
    const profile = response?.data || {};

    userProfile.value = {
      ...userProfile.value,
      ...profile,
      profile_image: normalizePublicUrl(profile.profile_image) || null,
    };
    userProfile.value = {
      ...userProfile.value,
      ...(storedProfile.value || {}),
    };

    profileMessage.value = response?.message || "Profil berhasil diperbarui.";
    pushToast({
      title: "Profil Diperbarui",
      message: profileMessage.value,
      type: "success",
    });
    showProfileModal.value = false;
    syncProfileForm();
  } catch (error) {
    profileError.value = true;
    profileMessage.value = error.message;
    pushToast({
      title: "Gagal Memperbarui Profil",
      message: error.message,
      type: "error",
    });
  } finally {
    isSavingProfile.value = false;
  }
};

onMounted(() => {
  document.onfullscreenchange = () => {
    fullscreenMode.value = !!document.fullscreenElement;
  };

  userProfile.value = {
    ...userProfile.value,
    ...(getStoredUser() || {}),
  };
  syncProfileForm();
  loadProfile();
  const token = localStorage.getItem("token");
  if (token) {
    realtimeStore.connect(token);
    const unsubConnected = realtimeStore.on("realtime:connected", (payload) => {
      const count = Number(payload?.online_count || 0);
      onlineLmsCount.value = Number.isFinite(count) && count >= 0 ? count : 0;
    });
    const unsubPresence = realtimeStore.on("learning-presence:updated", (payload) => {
      const count = Number(payload?.online_count || 0);
      onlineLmsCount.value = Number.isFinite(count) && count >= 0 ? count : 0;
    });
    realtimeUnsubscribers.value = [unsubConnected, unsubPresence];
  }
});

onUnmounted(() => {
  realtimeUnsubscribers.value.forEach((unsubscribe) => {
    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  });
  realtimeUnsubscribers.value = [];
  realtimeStore.disconnect();
});
</script>

<style scoped>
  .app-header {
    padding-top: calc(1rem + env(safe-area-inset-top, 0px));
  }
</style>
