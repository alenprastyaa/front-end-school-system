import { computed, ref } from "vue";
import { apiRequest } from "@/api";
import { pushToast } from "@/composables/useToast";
import { registerPwaServiceWorker } from "@/utils/serviceWorker";

const supported = typeof window !== "undefined"
  && "Notification" in window
  && "serviceWorker" in navigator
  && "PushManager" in window;

const permission = ref(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
const registration = ref(null);
const subscription = ref(null);
const vapidPublicKey = ref("");
const lastError = ref("");
const busy = ref(false);

const isAuthenticated = () => {
  if (typeof localStorage === "undefined") {
    return false;
  }

  return Boolean(String(localStorage.getItem("token") || "").trim());
};

const resolveVapidPublicKey = async () => {
  if (vapidPublicKey.value) {
    return vapidPublicKey.value;
  }

  const configuredKey = String(process.env.VUE_APP_VAPID_PUBLIC_KEY || "").trim();
  if (configuredKey) {
    vapidPublicKey.value = configuredKey;
    return vapidPublicKey.value;
  }

  const response = await apiRequest("/notifications/vapid-public-key", {
    silentLoading: true,
    suppressAuthRedirect: true,
  });
  const fetchedKey = String(response?.data?.public_key || "").trim();
  vapidPublicKey.value = fetchedKey;
  return vapidPublicKey.value;
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const syncBrowserSubscription = async () => {
  if (!supported || !registration.value) {
    return null;
  }

  const currentSubscription = await registration.value.pushManager.getSubscription();
  subscription.value = currentSubscription;

  if (!currentSubscription || !isAuthenticated()) {
    return currentSubscription;
  }

  await apiRequest("/notifications/push-subscriptions", {
    method: "POST",
    body: currentSubscription.toJSON(),
    silentLoading: true,
    suppressAuthRedirect: true,
  });

  return currentSubscription;
};

const ensureRegistration = async () => {
  if (!supported) {
    lastError.value = "Browser tidak mendukung service worker atau push notification";
    return null;
  }

  if (registration.value) {
    return registration.value;
  }

  try {
    registration.value = await registerPwaServiceWorker();
    lastError.value = "";
    return registration.value;
  } catch (error) {
    lastError.value = error?.message || "Gagal mendaftarkan service worker";
    return null;
  }
};

export const useWebPush = () => {
  const isEnabled = computed(() => permission.value === "granted" && Boolean(subscription.value));
  const isSupported = computed(() => supported);
  const canPrompt = computed(() => supported && permission.value === "default");

  const refreshState = async () => {
    if (!supported) {
      return false;
    }

    permission.value = Notification.permission;
    const swRegistration = await ensureRegistration();
    if (!swRegistration) {
      return false;
    }

    await syncBrowserSubscription();
    return true;
  };

  const enableNotifications = async () => {
    if (!supported) {
      pushToast({
        title: "Notifikasi Tidak Didukung",
        message: "Browser ini belum mendukung web push notification.",
        type: "error",
      });
      return false;
    }

    busy.value = true;
    try {
      const swRegistration = await ensureRegistration();
      if (!swRegistration) {
        throw new Error(lastError.value || "Service worker gagal diaktifkan");
      }

      if (permission.value === "default") {
        permission.value = await Notification.requestPermission();
      }

      if (permission.value !== "granted") {
        pushToast({
          title: "Izin Notifikasi Ditolak",
          message: "Aktifkan izin notifikasi di browser agar push bisa diterima.",
          type: "warning",
        });
        return false;
      }

      const currentSubscription = await swRegistration.pushManager.getSubscription();
      if (currentSubscription) {
        subscription.value = currentSubscription;
        await syncBrowserSubscription();
        pushToast({
          title: "Notifikasi Aktif",
          message: "Browser ini sudah siap menerima push notification.",
          type: "success",
        });
        return true;
      }

      const publicKey = await resolveVapidPublicKey();
      if (!publicKey) {
        throw new Error("VAPID public key belum diset");
      }

      const newSubscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      subscription.value = newSubscription;
      await syncBrowserSubscription();
      pushToast({
        title: "Notifikasi Aktif",
        message: "Subscription push berhasil tersimpan.",
        type: "success",
      });
      return true;
    } catch (error) {
      lastError.value = error?.message || "Gagal mengaktifkan notifikasi";
      pushToast({
        title: "Notifikasi Gagal",
        message: lastError.value,
        type: "error",
      });
      return false;
    } finally {
      busy.value = false;
    }
  };

  const disableNotifications = async () => {
    if (!supported) {
      return false;
    }

    busy.value = true;
    try {
      const swRegistration = await ensureRegistration();
      const currentSubscription = await swRegistration?.pushManager?.getSubscription?.();

      if (currentSubscription) {
        try {
          await apiRequest("/notifications/push-subscriptions", {
            method: "DELETE",
            body: { endpoint: currentSubscription.endpoint },
            silentLoading: true,
            suppressAuthRedirect: true,
          });
        } catch (error) {
          // Keep going; browser cleanup is still valuable.
        }

        await currentSubscription.unsubscribe();
      }

      subscription.value = null;
      pushToast({
        title: "Notifikasi Dinonaktifkan",
        message: "Browser ini tidak lagi terdaftar untuk push notification.",
        type: "info",
      });
      return true;
    } catch (error) {
      lastError.value = error?.message || "Gagal menonaktifkan notifikasi";
      pushToast({
        title: "Notifikasi Gagal",
        message: lastError.value,
        type: "error",
      });
      return false;
    } finally {
      busy.value = false;
    }
  };

  const toggleNotifications = async () => {
    if (isEnabled.value) {
      return disableNotifications();
    }

    return enableNotifications();
  };

  return {
    isSupported,
    isEnabled,
    canPrompt,
    permission,
    subscription,
    busy,
    lastError,
    refreshState,
    enableNotifications,
    disableNotifications,
    toggleNotifications,
  };
};
