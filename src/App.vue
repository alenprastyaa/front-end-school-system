<template>
  <!-- App -->
  <div class="flex h-screen overflow-hidden bg-gray-50 font-lexend dark:bg-gray-900">
    <div v-if="!shouldHideChrome" :class="{ hidden: !sidebar, block: sidebar }">
      <button
        v-if="sidebar && !isDesktopViewport"
        type="button"
        class="fixed inset-0 z-50 backdrop-blur-[2px]"
        style="background-color: rgba(0, 0, 0, 0.45);"
        aria-label="Tutup sidebar"
        @click="close"
      ></button>
      <div
        class="mobile-sidebar-offset lg:flex-auto w-sidebar bg-white dark:bg-gray-800 border-r-2 dark:border-gray-700 lg:z-0 z-[60] overflow-auto lg:relative fixed">
        <div class="h-full overflow-y-auto overscroll-contain">
          <Sidebar v-if="!shouldHideChrome" @sidebarToggle="close" />
          <!-- <sidebarlist
            v-if="!shouldHideChrome"
            @sidebarToggle="close"
          /> -->
        </div>
      </div>
    </div>

    <div class="flex h-screen min-h-0 flex-auto w-full flex-col overflow-hidden transition-colors">
      <Header v-if="!shouldHideChrome" @sidebarToggle="toggleSidebar" />

      <div class="flex-1 min-h-0" :class="isChatLayoutRoute ? 'overflow-hidden' : 'overflow-y-auto'">
        <transition name="slide-up" mode="out-in">
          <div :class="isChatLayoutRoute ? 'h-full' : ''">
            <router-view />
            <Footer v-if="!shouldHideChrome && !isChatLayoutRoute" />
          </div>
        </transition>
      </div>
    </div>
  </div>
  <ToastHost />
  <PwaInstallModal
    :open="isPwaInstallModalOpen"
    :is-installable="Boolean(deferredPwaPrompt)"
    :instruction-title="pwaInstructionTitle"
    :instruction-steps="pwaInstructionSteps"
    @close="closePwaInstallModal"
    @install="installPwa"
  />
  <ForcedLogoutModal
    :open="isForcedLogoutModalOpen"
    :notice="forcedLogoutNotice"
    @close="closeForcedLogoutModal"
  />
  <!-- End app -->
</template>

<script>
// Vue components
import { defineAsyncComponent } from "vue";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastHost from "@/components/ToastHost.vue";
import { pushToast } from "@/composables/useToast";
import { useLayoutChrome } from "@/composables/useLayoutChrome";
import { clearForcedLogoutNotice, getForcedLogoutNotice } from "@/utils/auth";

const layoutChromeState = useLayoutChrome();
const SHOW_PWA_INSTALL_AFTER_LOGIN_KEY = "show-pwa-install-after-login";
const PWA_INSTALLED_KEY = "school-system-pwa-installed";
const PWA_PROMPT_SUPPRESSED_UNTIL_KEY = "school-system-pwa-prompt-suppressed-until";
const PWA_PROMPT_SUPPRESS_DAYS = 180;
const PwaInstallModal = defineAsyncComponent(() => import("@/components/PwaInstallModal.vue"));
const ForcedLogoutModal = defineAsyncComponent(() => import("@/components/ForcedLogoutModal.vue"));

export default {
  name: "App",

  data() {
    return {
      sidebarDark: false,
      sidebar: true,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1440,
      deferredPwaPrompt: null,
      isPwaInstallModalOpen: false,
      isPwaInstalled: false,
      isForcedLogoutModalOpen: false,
      forcedLogoutNotice: null,
    };
  },

  computed: {
    shouldHideChrome() {
      return Boolean(this.$route.meta.hideNav || layoutChromeState.hidden);
    },
    isChatLayoutRoute() {
      return ["LearningChatTeacher", "LearningChatStudent"].includes(this.$route.name);
    },
    isDesktopViewport() {
      return this.viewportWidth >= 1024;
    },
    pwaInstructionTitle() {
      if (typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        return "Install manual di Safari";
      }

      return "Install manual dari menu browser";
    },
    pwaInstructionSteps() {
      if (typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        return [
          "Ketuk tombol Share di Safari.",
          "Pilih Add to Home Screen.",
          "Konfirmasi instalasi lalu buka aplikasi dari Home Screen.",
        ];
      }

      return [
        "Buka menu browser.",
        "Pilih Install App atau Add to Home Screen jika tersedia.",
        "Setelah terpasang, login berikutnya tidak akan menampilkan modal ini lagi.",
      ];
    },
  },

  components: {
    Header,
    Footer,
    PwaInstallModal,
    ForcedLogoutModal,
    Sidebar,
    ToastHost,
  },
  methods: {
    open() {
      this.sidebar = true;
    },
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },
    close() {
      this.sidebar = false;
    },
    handleViewportResize() {
      if (typeof window === "undefined") {
        return;
      }

      this.viewportWidth = window.innerWidth;
    },
    isStandaloneDisplay() {
      if (typeof window === "undefined") {
        return false;
      }

      return window.matchMedia("(display-mode: standalone)").matches
        || window.navigator.standalone === true
        || localStorage.getItem(PWA_INSTALLED_KEY) === "1";
    },
    refreshPwaInstalledState() {
      this.isPwaInstalled = this.isStandaloneDisplay();
      if (this.isPwaInstalled) {
        localStorage.setItem(PWA_INSTALLED_KEY, "1");
        sessionStorage.removeItem(SHOW_PWA_INSTALL_AFTER_LOGIN_KEY);
        this.isPwaInstallModalOpen = false;
      }
    },
    maybeOpenPwaInstallModal() {
      this.refreshPwaInstalledState();

      if (this.isPwaInstalled || this.$route.meta.hideNav) {
        return;
      }

      const suppressedUntil = Number(localStorage.getItem(PWA_PROMPT_SUPPRESSED_UNTIL_KEY) || 0);
      if (suppressedUntil && Date.now() < suppressedUntil) {
        return;
      }

      if (sessionStorage.getItem(SHOW_PWA_INSTALL_AFTER_LOGIN_KEY) !== "1") {
        return;
      }

      this.isPwaInstallModalOpen = true;
      sessionStorage.removeItem(SHOW_PWA_INSTALL_AFTER_LOGIN_KEY);
    },
    closePwaInstallModal() {
      this.isPwaInstallModalOpen = false;
      const suppressUntil = Date.now() + (PWA_PROMPT_SUPPRESS_DAYS * 24 * 60 * 60 * 1000);
      localStorage.setItem(PWA_PROMPT_SUPPRESSED_UNTIL_KEY, String(suppressUntil));
      sessionStorage.removeItem(SHOW_PWA_INSTALL_AFTER_LOGIN_KEY);
    },
    checkForcedLogoutNotice() {
      const notice = getForcedLogoutNotice();
      if (!notice) {
        this.isForcedLogoutModalOpen = false;
        this.forcedLogoutNotice = null;
        return;
      }

      this.forcedLogoutNotice = notice;
      this.isForcedLogoutModalOpen = true;
    },
    closeForcedLogoutModal() {
      this.isForcedLogoutModalOpen = false;
      this.forcedLogoutNotice = null;
      clearForcedLogoutNotice();
    },
    handleBeforeInstallPrompt(event) {
      event.preventDefault();
      this.deferredPwaPrompt = event;
      this.maybeOpenPwaInstallModal();
    },
    handleAppInstalled() {
      localStorage.setItem(PWA_INSTALLED_KEY, "1");
      localStorage.removeItem(PWA_PROMPT_SUPPRESSED_UNTIL_KEY);
      this.deferredPwaPrompt = null;
      this.refreshPwaInstalledState();
      pushToast({
        title: "Aplikasi Berhasil Diinstall",
        message: "School System sekarang sudah tersedia sebagai aplikasi di perangkat ini.",
        type: "success",
      });
    },
    async installPwa() {
      if (!this.deferredPwaPrompt) {
        return;
      }

      const promptEvent = this.deferredPwaPrompt;
      this.deferredPwaPrompt = null;

      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult?.outcome === "accepted") {
          this.isPwaInstallModalOpen = false;
          localStorage.removeItem(PWA_PROMPT_SUPPRESSED_UNTIL_KEY);
          return;
        }

        pushToast({
          title: "Install Dibatalkan",
          message: "Aplikasi belum dipasang. Modal akan muncul lagi setelah login berikutnya.",
          type: "info",
        });
      } catch (error) {
        pushToast({
          title: "Install Gagal",
          message: "Browser tidak dapat memulai instalasi aplikasi saat ini.",
          type: "error",
        });
      }
    },
  },
  watch: {
    $route() {
      if (!this.isDesktopViewport) {
        this.sidebar = false;
      }
      this.maybeOpenPwaInstallModal();
    },
  },
  mounted() {
    this.refreshPwaInstalledState();
    this.checkForcedLogoutNotice();
    window.addEventListener("beforeinstallprompt", this.handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", this.handleAppInstalled);
    window.addEventListener("resize", this.handleViewportResize);
    this.maybeOpenPwaInstallModal();
    this.$nextTick(() => {
      this.handleViewportResize();
    });
  },
  beforeUnmount() {
    window.removeEventListener("beforeinstallprompt", this.handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", this.handleAppInstalled);
    window.removeEventListener("resize", this.handleViewportResize);
  },
};
</script>

<style>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-up-enter-active {
  transition: all 0.3s ease-out;
}

.slide-up-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@supports (padding-top: env(safe-area-inset-top)) {
  .mobile-sidebar-offset {
    padding-top: env(safe-area-inset-top);
  }
}
</style>
