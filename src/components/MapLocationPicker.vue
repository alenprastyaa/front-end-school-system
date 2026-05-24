<template>
  <div class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ title }}</p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Cari lokasi atau klik peta untuk menentukan koordinat sekolah.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          @click="useMyLocation"
          :disabled="isLocating || !isLeafletReady"
          class="inline-flex h-10 items-center justify-center rounded-xl bg-slate-100 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {{ isLocating ? "Mencari..." : "Pakai Lokasi Saya" }}
        </button>
        <button
          type="button"
          @click="resetMarker"
          :disabled="!isLeafletReady"
          class="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/60"
        >
          Reset
        </button>
      </div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-[1fr,auto]">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Cari tempat</label>
        <input
          v-model="query"
          type="text"
          inputmode="search"
          placeholder="Contoh: SMK Negeri 1, Jakarta"
          class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
          @input="onQueryInput"
        />

        <div
          v-if="results.length > 0"
          class="mt-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <button
            v-for="item in results"
            :key="item.place_id"
            type="button"
            class="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
            @click="selectResult(item)"
          >
            <div class="font-semibold">{{ item.name || (item.display_name || '').split(',')[0] }}</div>
            <div class="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{{ item.display_name }}</div>
          </button>
        </div>
        <p v-else-if="searchError" class="mt-2 text-xs font-medium text-rose-600 dark:text-rose-300">
          {{ searchError }}
        </p>
        <p v-else-if="query.length >= 3" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Tidak ada hasil.
        </p>
      </div>

      <div class="grid gap-3 sm:w-[220px]">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Radius (meter)</label>
          <input
            v-model.number="radiusLocal"
            type="number"
            min="1"
            step="1"
            class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
            @change="emitChange"
          />
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Contoh: 100–300 meter.</p>
        </div>
      </div>
    </div>

    <div class="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700">
      <div ref="mapEl" class="h-[320px] w-full bg-slate-100 dark:bg-slate-800"></div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Latitude</label>
        <input
          :value="latText"
          readonly
          class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Longitude</label>
        <input
          :value="lngText"
          readonly
          class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
        />
      </div>
      <div class="flex items-end">
        <button
          type="button"
          @click="$emit('close')"
          class="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-sky-600 text-sm font-bold text-white transition hover:bg-sky-500"
        >
          Selesai
        </button>
      </div>
    </div>

    <p v-if="hint" class="mt-3 text-xs text-slate-500 dark:text-slate-400">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { api } from "@/api";

const props = defineProps({
  title: { type: String, default: "Pilih Lokasi Sekolah" },
  latitude: { type: [Number, String, null], default: null },
  longitude: { type: [Number, String, null], default: null },
  radiusMeters: { type: [Number, String, null], default: 150 },
  hint: {
    type: String,
    default:
      "Catatan: pencarian memakai OpenStreetMap Nominatim. Untuk produksi skala besar, sebaiknya dibuat proxy endpoint di backend.",
  },
});

const emit = defineEmits(["update:latitude", "update:longitude", "update:radiusMeters", "close"]);

const mapEl = ref(null);
const query = ref("");
const results = ref([]);
const searchError = ref("");
const isLocating = ref(false);
const isLeafletReady = ref(false);
let map = null;
let marker = null;
let circle = null;
let leaflet = null;
let searchTimer = null;

const radiusLocal = ref(Number(props.radiusMeters || 150));

const latNum = computed(() => {
  const n = Number(props.latitude);
  return Number.isFinite(n) ? n : null;
});
const lngNum = computed(() => {
  const n = Number(props.longitude);
  return Number.isFinite(n) ? n : null;
});

const latText = computed(() => (latNum.value == null ? "" : String(latNum.value.toFixed(6))));
const lngText = computed(() => (lngNum.value == null ? "" : String(lngNum.value.toFixed(6))));

const loadLeaflet = async () => {
  if (window.L) return window.L;

  const cssHref = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css";
  const jsSrc = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js";

  if (!document.querySelector(`link[data-leaflet=\"true\"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssHref;
    link.dataset.leaflet = "true";
    document.head.appendChild(link);
  }

  await new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-leaflet=\"true\"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      if (window.L) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = jsSrc;
    script.async = true;
    script.dataset.leaflet = "true";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Gagal memuat peta."));
    document.head.appendChild(script);
  });

  return window.L;
};

const emitChange = () => {
  emit("update:radiusMeters", radiusLocal.value || 150);
  if (circle && marker) {
    circle.setRadius(Number(radiusLocal.value || 150));
  }
};

const setMarker = (lat, lng, shouldFly = true) => {
  if (!map || !leaflet) return;
  const latLng = leaflet.latLng(lat, lng);
  if (!marker) {
    marker = leaflet.marker(latLng, { draggable: false }).addTo(map);
  } else {
    marker.setLatLng(latLng);
  }
  if (!circle) {
    circle = leaflet.circle(latLng, {
      radius: Number(radiusLocal.value || 150),
      color: "#22d3ee",
      weight: 2,
      fillColor: "#22d3ee",
      fillOpacity: 0.12,
    }).addTo(map);
  } else {
    circle.setLatLng(latLng);
    circle.setRadius(Number(radiusLocal.value || 150));
  }
  if (shouldFly) map.flyTo(latLng, Math.max(map.getZoom(), 16), { duration: 0.8 });

  emit("update:latitude", Number(lat));
  emit("update:longitude", Number(lng));
};

const resetMarker = () => {
  results.value = [];
  searchError.value = "";
  query.value = "";
  emit("update:latitude", "");
  emit("update:longitude", "");
  if (marker) {
    marker.remove();
    marker = null;
  }
  if (circle) {
    circle.remove();
    circle = null;
  }
  if (map) {
    map.setView([ -6.2, 106.816666 ], 12);
  }
};

const selectResult = (item) => {
  results.value = [];
  query.value = item.display_name || "";
  const lat = Number(item.lat);
  const lng = Number(item.lon);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    setMarker(lat, lng, true);
  }
};

const searchNominatim = async (q) => {
  const trimmed = String(q || "").trim();
  if (trimmed.length < 3) {
    results.value = [];
    searchError.value = "";
    return;
  }
  searchError.value = "";
  const response = await api.get("/public/geocode", {
    params: { q: trimmed },
    suppressAuthRedirect: true,
  });
  const items = response?.data?.items || [];
  results.value = Array.isArray(items)
    ? items.map((item) => ({
        ...item,
        name: item?.name || item?.display_name?.split(",")?.[0] || "Lokasi",
      }))
    : [];
};

const onQueryInput = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchNominatim(query.value).catch(() => {
      results.value = [];
      searchError.value = "Pencarian lokasi gagal.";
    });
  }, 350);
};

const useMyLocation = async () => {
  if (!navigator.geolocation) return;
  isLocating.value = true;
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
    });
    const lat = pos?.coords?.latitude;
    const lng = pos?.coords?.longitude;
    if (typeof lat === "number" && typeof lng === "number") {
      setMarker(lat, lng, true);
    }
  } finally {
    isLocating.value = false;
  }
};

const initMap = async () => {
  leaflet = await loadLeaflet();
  await nextTick();
  if (!mapEl.value) return;

  map = leaflet.map(mapEl.value, { zoomControl: true, attributionControl: true });
  leaflet
    .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    })
    .addTo(map);

  const initialLat = latNum.value ?? -6.2;
  const initialLng = lngNum.value ?? 106.816666;
  const initialZoom = latNum.value != null && lngNum.value != null ? 16 : 12;
  map.setView([initialLat, initialLng], initialZoom);

  map.on("click", (e) => {
    setMarker(e.latlng.lat, e.latlng.lng, false);
  });

  if (latNum.value != null && lngNum.value != null) {
    setMarker(latNum.value, lngNum.value, false);
  }

  isLeafletReady.value = true;
};

watch(
  () => props.radiusMeters,
  (v) => {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) radiusLocal.value = n;
    emitChange();
  }
);

onMounted(() => {
  initMap().catch(() => {
    isLeafletReady.value = false;
  });
});

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer);
  if (map) {
    map.remove();
    map = null;
  }
});
</script>
