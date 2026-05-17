import { computed, ref } from "vue";

const deferredPrompt = ref(null);
const installed = ref(false);

const isBrowser = () => typeof window !== "undefined";

const isAndroidDevice = () =>
  typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent || "");

const isIosDevice = () =>
  typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent || "");

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
  const showInstallButton = computed(() => canInstall.value && !isInstalled.value);
  const showIosInstallHint = computed(() => isIosDevice() && !isInstalled.value && !canInstall.value);

  return {
    canInstall,
    clearDeferredPrompt,
    installPwa,
    isAndroidDevice,
    isIosDevice,
    isInstalled,
    markInstalled,
    refreshInstalledState,
    setDeferredPrompt,
    showIosInstallHint,
    showInstallButton,
  };
};
