import { computed, ref } from "vue";

const deferredPrompt = ref(null);
const installed = ref(false);

const isBrowser = () => typeof window !== "undefined";

const isAndroidDevice = () =>
  typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent || "");

const isStandaloneDisplay = () => {
  if (!isBrowser()) {
    return false;
  }

  return window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone === true;
};

const refreshInstalledState = () => {
  installed.value = isStandaloneDisplay();
  return installed.value;
};

const setDeferredPrompt = (event) => {
  if (!event) {
    return;
  }

  if (typeof event.preventDefault === "function") {
    event.preventDefault();
  }
  deferredPrompt.value = event;
};

const clearDeferredPrompt = () => {
  deferredPrompt.value = null;
};

const markInstalled = () => {
  installed.value = true;
  clearDeferredPrompt();
};

const installPwa = async () => {
  const promptEvent = deferredPrompt.value;
  if (!promptEvent || typeof promptEvent.prompt !== "function") {
    return { outcome: "unavailable" };
  }

  clearDeferredPrompt();

  await promptEvent.prompt();
  const choiceResult = await promptEvent.userChoice;
  if (choiceResult?.outcome === "accepted") {
    markInstalled();
  }
  return choiceResult || { outcome: "dismissed" };
};

export const usePwaInstall = () => {
  const isInstalled = computed(() => installed.value);
  const canInstall = computed(() => Boolean(deferredPrompt.value));
  const showInstallButton = computed(() => isAndroidDevice() && canInstall.value && !isInstalled.value);

  return {
    canInstall,
    clearDeferredPrompt,
    installPwa,
    isAndroidDevice,
    isInstalled,
    markInstalled,
    refreshInstalledState,
    setDeferredPrompt,
    showInstallButton,
  };
};
