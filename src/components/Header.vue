<template>
  <header
    class="app-header sticky top-0 z-40 shrink-0 border-b-2 bg-white/95 p-4 backdrop-blur dark:border-gray-700 dark:bg-gray-800/95"
  >
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-4">
        <button class="text-gray-500 lg:hidden block" @click="$emit('sidebarToggle', true)">
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
              <h2 class="text-gray-800 dark:text-white">{{ userProfile.username || "User" }}</h2>
              <p class="text-xs text-gray-400 capitalize">{{ userProfile.role || "Guest" }}</p>
            </div>
          </button>

          <transition name="fade">
            <div v-show="menu"
              class="absolute right-0 mt-2 z-50 w-56 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded divide-y dark:divide-gray-700 divide-gray-100 shadow">
              <div class="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">
                <div>{{ userProfile.username || "-" }}</div>
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
    <div v-if="showProfileModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"
      @click.self="closeProfileModal">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Profil Saya</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Username tidak dapat diubah.</p>
          </div>
          <button class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200" @click="closeProfileModal">
            <Icon icon="mdi:close" class="text-2xl" />
          </button>
        </div>

        <div v-if="profileMessage" class="mt-4 rounded-xl px-4 py-3 text-sm font-medium"
          :class="profileError ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'">
          {{ profileMessage }}
        </div>

        <form class="mt-5 space-y-5" @submit.prevent="saveProfile">
          <div class="flex items-center gap-4">
            <img :src="profilePreview || avatarSrc" alt="Foto profil"
              class="h-20 w-20 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700" />
            <div class="flex-1">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Foto profil</label>
              <input type="file" accept="image/*"
                class="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200"
                @change="handleProfileImageChange" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
            <input v-model="profileForm.username" type="text" disabled
              class="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400" />
          </div>

          <div class="grid gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Password saat ini</label>
              <input v-model="profileForm.current_password" type="password" autocomplete="current-password"
                class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Isi hanya jika ingin ganti password" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Password baru</label>
              <input v-model="profileForm.new_password" type="password" autocomplete="new-password"
                class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Minimal 6 karakter" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Konfirmasi password
                baru</label>
              <input v-model="profileForm.confirm_password" type="password" autocomplete="new-password"
                class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Ulangi password baru" />
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button type="button"
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
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { fullscreen as handleFullscreen } from "@/helper/fullscreen";
import { clearSession, getStoredUser, updateStoredUser } from "@/utils/auth";
import { api } from "@/api";
import { normalizePublicUrl } from "@/utils/url";
import defaultAvatar from "@/assets/img/user.jpg";

const router = useRouter();
const route = useRoute();

defineEmits(["sidebarToggle"]);

const menu = ref(false);
const fullscreenMode = ref(false);
const showProfileModal = ref(false);
const isSavingProfile = ref(false);
const profileError = ref(false);
const profileMessage = ref("");
const profilePreview = ref("");
const profileImageFile = ref(null);
const userProfile = ref({
  username: "User",
  role: "Guest",
  school_name: "",
  school_id: "",
  profile_image: "",
});
const profileForm = ref({
  username: "",
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const avatarSrc = computed(() => normalizePublicUrl(userProfile.value.profile_image) || defaultAvatar);

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
  clearSession();
  router.push({ name: "Login" });
};

const syncProfileForm = () => {
  profileForm.value = {
    username: userProfile.value.username || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  };
  profilePreview.value = "";
  profileImageFile.value = null;
  profileMessage.value = "";
  profileError.value = false;
};

const loadProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    const profile = response?.data || {};
    userProfile.value = {
      ...userProfile.value,
      ...profile,
      profile_image: normalizePublicUrl(profile.profile_image) || null,
    };
    updateStoredUser({
      username: profile.username,
      role: profile.role,
      school_id: profile.school_id,
      school_name: profile.school_name,
      profile_image: normalizePublicUrl(profile.profile_image) || null,
    });
    syncProfileForm();
  } catch (error) {
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
  showProfileModal.value = false;
  syncProfileForm();
};

const handleProfileImageChange = (event) => {
  const file = event.target.files?.[0] || null;
  profileImageFile.value = file;
  profilePreview.value = file ? URL.createObjectURL(file) : "";
};

const saveProfile = async () => {
  if (!profileImageFile.value && !profileForm.value.new_password) {
    profileError.value = true;
    profileMessage.value = "Belum ada perubahan yang bisa disimpan.";
    return;
  }

  isSavingProfile.value = true;
  profileError.value = false;
  profileMessage.value = "";

  try {
    const formData = new FormData();
    if (profileImageFile.value) {
      formData.append("profile_image", profileImageFile.value);
    }
    if (profileForm.value.current_password) {
      formData.append("current_password", profileForm.value.current_password);
    }
    if (profileForm.value.new_password) {
      formData.append("new_password", profileForm.value.new_password);
    }
    if (profileForm.value.confirm_password) {
      formData.append("confirm_password", profileForm.value.confirm_password);
    }

    const response = await api.put("/auth/profile", formData);
    const profile = response?.data || {};

    userProfile.value = {
      ...userProfile.value,
      ...profile,
      profile_image: normalizePublicUrl(profile.profile_image) || null,
    };

    updateStoredUser({
      username: profile.username,
      role: profile.role,
      school_id: profile.school_id,
      school_name: profile.school_name,
      profile_image: normalizePublicUrl(profile.profile_image) || null,
    });

    profileMessage.value = response?.message || "Profil berhasil diperbarui.";
    syncProfileForm();
  } catch (error) {
    profileError.value = true;
    profileMessage.value = error.message;
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
});
</script>

<style scoped>
  .app-header {
    padding-top: calc(1rem + env(safe-area-inset-top, 0px));
  }
</style>
