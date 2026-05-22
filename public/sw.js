const CACHE_NAME = "school-system-pwa-v2";
const RUNTIME_CACHE_NAME = "school-system-runtime-v2";

const getAssetUrl = (path) => {
  try {
    return new URL(path, self.registration.scope).toString();
  } catch (error) {
    return path;
  }
};

const normalizeUrl = (value) => {
  if (!value) {
    return "/";
  }

  try {
    return new URL(value, self.location.origin).toString();
  } catch (error) {
    return "/";
  }
};

const getNotificationPayload = (event) => {
  if (!event?.data) {
    return {};
  }

  try {
    return event.data.json();
  } catch (error) {
    const text = event.data.text();
    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      return { title: "School System", body: text };
    }
  }
};

self.addEventListener("install", (event) => {
  const appShell = [
    getAssetUrl("./"),
    getAssetUrl("manifest.webmanifest"),
    getAssetUrl("logo.png"),
    getAssetUrl("pwa-icon-192.png"),
    getAssetUrl("pwa-icon-512.png"),
    getAssetUrl("pwa-icon.svg"),
  ];

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(appShell)).catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key === CACHE_NAME || key === RUNTIME_CACHE_NAME) {
            return undefined;
          }

          return caches.delete(key);
        }),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseCopy = response.clone();
          caches.open(RUNTIME_CACHE_NAME)
            .then((cache) => cache.put(request, responseCopy))
            .catch(() => undefined);
          return response;
        })
        .catch(() =>
          caches.match(request)
            .then((cachedResponse) => cachedResponse || caches.match(getAssetUrl("./"))),
        ),
    );
    return;
  }

  const networkFirstDestinations = ["script", "style", "document", "manifest"];
  if (networkFirstDestinations.includes(request.destination)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const responseCopy = response.clone();
            caches.open(RUNTIME_CACHE_NAME)
              .then((cache) => cache.put(request, responseCopy))
              .catch(() => undefined);
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  const cacheableDestinations = ["image", "font"];
  if (!cacheableDestinations.includes(request.destination)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (response && response.ok) {
          const responseCopy = response.clone();
          caches.open(RUNTIME_CACHE_NAME)
            .then((cache) => cache.put(request, responseCopy))
            .catch(() => undefined);
        }
        return response;
      });
    }),
  );
});

self.addEventListener("push", (event) => {
  const payload = getNotificationPayload(event);
  const title = payload.title || payload.heading || "Notifikasi Sekolah";
  const body = payload.body || payload.message || "Ada pembaruan baru di School System.";
  const url = normalizeUrl(payload.url || payload.click_action || payload.link || "./");
  const icon = payload.icon || getAssetUrl("pwa-icon.svg");
  const badge = payload.badge || getAssetUrl("logo.png");
  const kind = payload.kind || "default";
  const soundUrl = payload.sound_url || payload.soundUrl || null;

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, {
        body,
        icon,
        badge,
        silent: false,
        vibrate: [120, 60, 120],
        data: {
          url,
          id: payload.id || null,
        },
        tag: payload.tag || payload.group || title,
        renotify: Boolean(payload.renotify),
      }),
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        windowClients.forEach((client) => {
          client.postMessage({
            type: "push-notification",
            kind,
            sound: kind,
            soundUrl,
            payload: {
              title,
              body,
              url,
              kind,
            },
          });
        });
      }),
    ]),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = normalizeUrl(event.notification?.data?.url || "/");
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client && client.url === targetUrl) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

      return undefined;
    }),
  );
});
