let registrationPromise = null;
const PWA_CACHE_PREFIXES = ["school-system-pwa-", "school-system-runtime-"];

export const getServiceWorkerBaseUrl = () => {
  const baseUrl = String(process.env.BASE_URL || "/").trim();
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
};

const clearPwaCaches = async () => {
  if (typeof caches === "undefined") {
    return;
  }

  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => {
      if (!PWA_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        return undefined;
      }
      return caches.delete(key);
    }),
  );
};

export const unregisterPwaServiceWorkers = async () => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  await clearPwaCaches();
  registrationPromise = null;
};

export const registerPwaServiceWorker = async () => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  if (process.env.NODE_ENV !== "production") {
    await unregisterPwaServiceWorkers();
    return null;
  }

  if (registrationPromise) {
    return registrationPromise;
  }

  const baseUrl = getServiceWorkerBaseUrl();
  registrationPromise = navigator.serviceWorker
    .register(`${baseUrl}sw.js`, { scope: baseUrl })
    .catch((error) => {
      registrationPromise = null;
      throw error;
    });

  return registrationPromise;
};
