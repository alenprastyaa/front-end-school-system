const CACHE_NAME = "school-system-pwa-v3";
const RUNTIME_CACHE_NAME = "school-system-runtime-v3";

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

const appendQueryParams = (baseUrl, params = {}) => {
  try {
    const url = new URL(baseUrl, self.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      url.searchParams.set(key, String(value));
    });
    return url.toString();
  } catch (error) {
    return normalizeUrl(baseUrl);
  }
};

const buildCallTargetUrl = (payload, action = "") => {
  const peerUserId = payload?.call_peer_user_id || payload?.call_from_user_id || payload?.from_user_id || payload?.peer_user_id;
  const baseUrl = payload?.url || "/chat";
  const params = {
    user: peerUserId || "",
    call_id: payload?.call_id || "",
    call_action: action || payload?.call_action || "view",
  };

  if (payload?.call_offer !== undefined && payload?.call_offer !== null && payload?.call_offer !== "") {
    try {
      params.call_offer = JSON.stringify(payload.call_offer);
    } catch (error) {
      params.call_offer = "";
    }
  }

  if (payload?.call_peer_full_name) {
    params.call_peer_full_name = payload.call_peer_full_name;
  }
  if (payload?.call_peer_username) {
    params.call_peer_username = payload.call_peer_username;
  }
  if (payload?.call_from_user_id) {
    params.call_from_user_id = payload.call_from_user_id;
  }
  if (payload?.call_to_user_id) {
    params.call_to_user_id = payload.call_to_user_id;
  }

  return appendQueryParams(baseUrl, params);
};

const toAppRoutePath = (value) => {
  if (!value) {
    return "/";
  }

  try {
    const url = new URL(value, self.location.origin);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch (error) {
    return String(value);
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

const isVisibleWindowClient = (client) => {
  return client?.focused || client?.visibilityState === "visible";
};

const showPushNotification = (payload, notificationPayload) => {
  const { title, body, icon, badge, kind, isCall, notificationActions } = notificationPayload;
  const tag = payload.tag || payload.group || (isCall ? `private-call:${payload.call_id || "incoming"}` : `${kind}:${payload.id || title}`);
  const options = {
    body,
    icon,
    badge,
    silent: false,
    vibrate: isCall ? [250, 120, 250, 120, 250] : [120, 60, 120],
    requireInteraction: isCall,
    data: {
      url: normalizeUrl(payload.url || payload.click_action || payload.link || "./"),
      id: payload.id || null,
      kind,
      tag,
      call_id: payload.call_id || null,
      call_from_user_id: payload.call_from_user_id || null,
      call_to_user_id: payload.call_to_user_id || null,
      call_peer_user_id: payload.call_peer_user_id || null,
      call_peer_username: payload.call_peer_username || null,
      call_peer_full_name: payload.call_peer_full_name || null,
      call_offer: payload.call_offer || null,
    },
    tag,
    renotify: Boolean(payload.renotify),
    timestamp: Number(payload.timestamp || Date.now()),
  };

  if (notificationActions.length > 0) {
    options.actions = notificationActions;
  }

  return self.registration.showNotification(title, options).catch(() => {
    delete options.actions;
    return self.registration.showNotification(title, options);
  });
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
  const isCall = kind === "call";
  const notificationActions = isCall
    ? [
        { action: "accept", title: "Jawab" },
        { action: "reject", title: "Tolak" },
      ]
    : [];

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const visibleClientExists = windowClients.some(isVisibleWindowClient);
      const notificationPayload = { title, body, icon, badge, kind, isCall, notificationActions };

      const clientMessages = Promise.all(
        windowClients.map((client) => {
          client.postMessage({
            type: "push-notification",
            kind,
            sound: kind,
            soundUrl,
            payload: {
              ...payload,
              title,
              body,
              url,
              kind,
            },
          });
          return undefined;
        }),
      );

      if (!isCall && visibleClientExists) {
        return clientMessages;
      }

      return Promise.all([
        clientMessages,
        showPushNotification(payload, notificationPayload),
      ]);
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const payload = event.notification?.data || {};
  const action = String(event.action || "").toLowerCase();
  const isCall = String(payload.kind || "") === "call";
  const targetUrl = isCall ? buildCallTargetUrl(payload, action || "view") : normalizeUrl(payload.url || "/");
  const routePath = toAppRoutePath(targetUrl);

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const client = windowClients[0] || null;

      if (client && "focus" in client) {
        client.focus();
        client.postMessage({
          type: isCall ? "open-url" : "push-notification-open",
          url: targetUrl,
          routePath,
          action: action || "view",
          kind: payload.kind || "default",
          data: payload,
        });
        return client;
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

      return undefined;
    }),
  );
});
