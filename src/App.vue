<template>
  <!-- App -->
  <div class="flex min-h-screen bg-gray-50 font-lexend dark:bg-gray-900">
    <div
      v-if="!shouldHideChrome"
      class="lg:block"
      :class="{ 'lg:block hidden': !sidebar, block: sidebar }"
    >
      <div
        class="mobile-sidebar-offset lg:flex-auto w-sidebar bg-white dark:bg-gray-800 border-r-2 dark:border-gray-700 lg:z-0 z-20 overflow-auto lg:relative fixed"
      >
        <perfect-scrollbar class="h-screen">
          <Sidebar
            v-if="!shouldHideChrome"
            @sidebarToggle="close"
          />
          <!-- <sidebarlist
            v-if="!shouldHideChrome"
            @sidebarToggle="close"
          /> -->
        </perfect-scrollbar>
      </div>
    </div>

    <div
      class="flex-auto flex min-h-screen w-full flex-col transition-colors"
    >
      <Header
        v-if="!shouldHideChrome"
        @sidebarToggle="open"
      />

      <div class="flex-1">
        <transition
          name="slide-up"
          mode="out-in"
        >
          <router-view />
        </transition>
      </div>

      <Footer v-if="!shouldHideChrome" />
    </div>
  </div>
  <ToastHost />
  <!-- End app -->
</template>

<script>
  // Vue components
  import Sidebar from "@/components/Sidebar";
  import Header from "@/components/Header";
  import Footer from "@/components/Footer";
  import ToastHost from "@/components/ToastHost.vue";
  import { useLayoutChrome } from "@/composables/useLayoutChrome";

  const layoutChromeState = useLayoutChrome();

  export default {
    name: "App",

    data() {
      return {
        sidebarDark: false,
        sidebar: false,
      };
    },

    computed: {
      shouldHideChrome() {
        return Boolean(this.$route.meta.hideNav || layoutChromeState.hidden);
      },
    },

    components: {
      Header,
      Footer,
      Sidebar,
      ToastHost,
    },
    methods: {
      open() {
        this.sidebar = true;
      },
      close() {
        this.sidebar = false;
      },
    },
    watch: {
      $route() {
        this.sidebar = false;
      },
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
