<template>
  <!-- App -->
  <div class="flex h-screen overflow-hidden bg-slate-100 font-lexend dark:bg-slate-950">
    <div v-if="!shouldHideChrome"
      class="pointer-events-none fixed inset-y-0 left-0 z-[60] w-sidebar max-w-[86vw] transition-transform duration-300 ease-out lg:pointer-events-auto lg:static lg:max-w-none"
      :class="sidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
      <button v-if="sidebar && !isDesktopViewport" type="button" class="fixed inset-0 z-50 backdrop-blur-[2px]"
        style="background-color: rgba(0, 0, 0, 0.45);" aria-label="Tutup sidebar" @click="close"></button>
      <div
        class="mobile-sidebar-offset pointer-events-auto relative z-[60] h-full w-sidebar overflow-hidden border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 lg:shadow-none">
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
      <Header v-if="!shouldHideChrome && !shouldHideHeader && !hideHeaderOnMobileChat" @sidebarToggle="toggleSidebar" />

      <div class="flex-1 min-h-0" :class="isChatLayoutRoute ? 'overflow-hidden' : 'overflow-y-auto'">
        <router-view v-slot="{ Component }">
          <transition name="slide-up">
            <div :key="$route.name || $route.path" :class="isChatLayoutRoute ? 'h-full' : ''">
              <component :is="Component" />
              <Footer v-if="!shouldHideChrome && !isChatLayoutRoute" />
            </div>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
  <ToastHost />
  <ForcedLogoutModal :open="isForcedLogoutModalOpen" :notice="forcedLogoutNotice" @close="closeForcedLogoutModal" />
  <GlobalLoadingOverlay :visible="globalLoading.visible" :message="globalLoading.message" />
  <FloatingSystemAssistant />
  <!-- End app -->
</template>

<script>
// Vue components
import { defineAsyncComponent } from "vue";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay.vue";
import ToastHost from "@/components/ToastHost.vue";
import { pushToast } from "@/composables/useToast";
import { useWebPush } from "@/composables/useWebPush";
import { useGlobalLoading } from "@/composables/useGlobalLoading";
import { useLayoutChrome } from "@/composables/useLayoutChrome";
import { usePwaInstall } from "@/composables/usePwaInstall";
import { clearForcedLogoutNotice, getForcedLogoutNotice } from "@/utils/auth";
import { playNotificationSound } from "@/utils/notificationSound";

const layoutChromeState = useLayoutChrome();
const globalLoadingState = useGlobalLoading();
const webPush = useWebPush();
const ForcedLogoutModal = defineAsyncComponent(() => import("@/components/ForcedLogoutModal.vue"));
const FloatingSystemAssistant = defineAsyncComponent(() => import("@/components/FloatingSystemAssistant.vue"));
const pwaInstall = usePwaInstall();

export default {
  name: "App",

  data() {
    return {
      sidebarDark: false,
      sidebar: true,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1440,
      isForcedLogoutModalOpen: false,
      forcedLogoutNotice: null,
    };
  },

  computed: {
    shouldHideChrome() {
      return Boolean(this.$route.meta.hideNav || layoutChromeState.hidden);
    },
    shouldHideHeader() {
      return Boolean(this.$route.meta.hideHeader || (this.$route.meta.hideHeaderOnMobile && !this.isDesktopViewport));
    },
    isChatLayoutRoute() {
      return ["LearningChatTeacher", "LearningChatStudent", "PrivateChat"].includes(this.$route.name);
    },
    hideHeaderOnMobileChat() {
      return this.isChatLayoutRoute && !this.isDesktopViewport;
    },
    isDesktopViewport() {
      return this.viewportWidth >= 1024;
    },
    globalLoading() {
      return globalLoadingState;
    },
  },

  components: {
    Header,
    Footer,
    GlobalLoadingOverlay,
    ForcedLogoutModal,
    FloatingSystemAssistant,
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
      pwaInstall.setDeferredPrompt(event);
    },
    handleAppInstalled() {
      pwaInstall.markInstalled();
      pushToast({
        title: "Aplikasi Berhasil Diinstall",
        message: "School System sekarang sudah tersedia sebagai aplikasi di perangkat ini.",
        type: "success",
      });
    },
    handleServiceWorkerMessage(event) {
      const payload = event?.data || {};
      if (payload?.type !== "push-notification") {
        return;
      }

      playNotificationSound(payload?.soundUrl || payload?.sound_url || payload?.sound || payload?.kind || "default");
    },
    async installPwa() {
      const result = await pwaInstall.installPwa();
      if (result?.outcome !== "accepted") {
        pushToast({
          title: "Install Dibatalkan",
          message: "Aplikasi belum dipasang. Anda bisa coba lagi dari tombol Install di dashboard.",
          type: "info",
        });
      }
    },
  },
  watch: {
    $route() {
      if (!this.isDesktopViewport) {
        this.sidebar = false;
      }
    },
  },
  mounted() {
    pwaInstall.refreshInstalledState();
    this.checkForcedLogoutNotice();
    window.addEventListener("beforeinstallprompt", this.handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", this.handleAppInstalled);
    window.addEventListener("resize", this.handleViewportResize);
    if (navigator?.serviceWorker?.addEventListener) {
      navigator.serviceWorker.addEventListener("message", this.handleServiceWorkerMessage);
    }
    webPush.refreshState().catch(() => undefined);
    this.$nextTick(() => {
      this.handleViewportResize();
    });
  },
  beforeUnmount() {
    window.removeEventListener("beforeinstallprompt", this.handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", this.handleAppInstalled);
    window.removeEventListener("resize", this.handleViewportResize);
    if (navigator?.serviceWorker?.removeEventListener) {
      navigator.serviceWorker.removeEventListener("message", this.handleServiceWorkerMessage);
    }
  },
};
</script>

<style>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-up-enter-active {
  transition: opacity 0.16s ease-out, transform 0.16s ease-out;
}

.slide-up-leave-active {
  transition: opacity 0.08s ease-in, transform 0.08s ease-in;
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
