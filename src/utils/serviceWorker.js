let registrationPromise = null;

export const getServiceWorkerBaseUrl = () => {
  const baseUrl = String(process.env.BASE_URL || "/").trim();
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
};

export const registerPwaServiceWorker = async () => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
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
