import { defineStore } from "pinia";
import { api } from "@/api";

const listeners = new Map();
let realtimeSource = null;
let realtimeUrl = "";
let realtimeToken = "";

const parseEventData = (event) => {
  if (!event) {
    return null;
  }

  const rawData = event.data;
  if (rawData == null || rawData === "") {
    return null;
  }

  try {
    return JSON.parse(rawData);
  } catch (error) {
    return rawData;
  }
};

const dispatchRealtimeEvent = (eventName, payload) => {
  const handlers = listeners.get(eventName);
  if (!handlers || handlers.size === 0) {
    return;
  }

  handlers.forEach((handler) => {
    try {
      handler(payload);
    } catch (error) {
      // Keep other handlers running.
    }
  });
};

const ensureEventSource = (url) => {
  if (typeof window === "undefined" || typeof window.EventSource === "undefined") {
    return null;
  }

  if (realtimeSource && realtimeUrl === url) {
    return realtimeSource;
  }

  if (realtimeSource) {
    realtimeSource.close();
  }

  realtimeSource = new window.EventSource(url);
  realtimeUrl = url;

  const eventNames = [
    "realtime:connected",
    "learning-chat:new-message",
    "learning-chat:read-updated",
    "learning-notification:new",
  ];

  eventNames.forEach((eventName) => {
    realtimeSource.addEventListener(eventName, (event) => {
      dispatchRealtimeEvent(eventName, parseEventData(event));
    });
  });

  return realtimeSource;
};

export const useRealtimeStore = defineStore("realtime", {
  state: () => ({
    connected: false,
    lastError: "",
    currentUrl: "",
  }),

  actions: {
    connect(token = "") {
      const resolvedToken = String(token || localStorage.getItem("token") || "").trim();
      if (!resolvedToken) {
        this.lastError = "Token realtime tidak tersedia";
        this.connected = false;
        return null;
      }

      const url = new URL(`${api.baseUrl}/realtime/events`);
      url.searchParams.set("token", resolvedToken);

      if (realtimeSource && realtimeUrl === url.toString() && realtimeToken === resolvedToken) {
        return realtimeSource;
      }

      this.disconnect();

      const source = ensureEventSource(url.toString());
      if (!source) {
        this.lastError = "Browser tidak mendukung EventSource";
        this.connected = false;
        return null;
      }

      realtimeToken = resolvedToken;
      this.currentUrl = url.toString();

      source.onopen = () => {
        this.connected = true;
        this.lastError = "";
      };

      source.onerror = () => {
        this.connected = false;
        this.lastError = "Koneksi realtime terputus";
      };

      return source;
    },

    disconnect() {
      if (realtimeSource) {
        realtimeSource.close();
      }

      realtimeSource = null;
      realtimeUrl = "";
      realtimeToken = "";
      this.connected = false;
      this.currentUrl = "";
      this.lastError = "";
    },

    on(eventName, handler) {
      if (!listeners.has(eventName)) {
        listeners.set(eventName, new Set());
      }

      const bucket = listeners.get(eventName);
      bucket.add(handler);

      return () => {
        const currentBucket = listeners.get(eventName);
        if (!currentBucket) {
          return;
        }

        currentBucket.delete(handler);
        if (currentBucket.size === 0) {
          listeners.delete(eventName);
        }
      };
    },
  },
});
