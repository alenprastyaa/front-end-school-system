<template>
  <div class="min-h-screen bg-slate-100 px-4 pb-12 pt-5 font-sans text-slate-900 dark:bg-[#0b141a] dark:text-slate-100">
    <div class="mx-auto w-full max-w-md space-y-4">
      <!-- Header -->
      <header class="flex items-end justify-between">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-500 dark:text-indigo-300">Enrol Wajah</p>
          <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Foto referensi untuk verifikasi absensi</p>
        </div>
        <span class="inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
          :class="hasReferenceImage ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'">
          {{ hasReferenceImage ? "Tersimpan" : "Belum ada" }}
        </span>
      </header>

      <!-- Enrollment card -->
      <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111b21]">
        <!-- Viewfinder -->
        <div class="px-4 pt-4">
          <div class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-950">
            <video v-show="cameraActive && !faceReferencePreview" ref="cameraVideoRef"
              class="absolute inset-0 h-full w-full object-cover" autoplay playsinline muted></video>
            <img v-if="faceReferencePreview" :src="faceReferencePreview" alt="Preview foto referensi baru"
              class="absolute inset-0 h-full w-full object-cover" />
            <img v-else-if="!cameraActive && hasReferenceImage" :src="currentReferenceImage" alt="Foto referensi tersimpan"
              class="absolute inset-0 h-full w-full object-cover" />

            <div v-if="!cameraActive && !faceReferencePreview && !hasReferenceImage"
              class="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
              </div>
              <p class="mt-3 text-sm font-semibold text-slate-300">Aktifkan kamera untuk mulai</p>
            </div>

            <div class="pointer-events-none absolute inset-5 rounded-full border-2 border-dashed border-white/25"></div>
            <span class="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white">
              {{ cameraActive ? "Kamera aktif" : faceReferencePreview ? "Foto baru" : hasReferenceImage ? "Tersimpan" : "Standby" }}
            </span>
          </div>
        </div>

        <canvas ref="captureCanvasRef" class="hidden"></canvas>

        <div class="space-y-2.5 p-4">
          <!-- Tips -->
          <div class="flex items-start gap-2.5 rounded-2xl bg-slate-50 px-3.5 py-3 dark:bg-[#0b141a]">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <p class="text-xs leading-5 text-slate-600 dark:text-slate-300">
              Pakai satu wajah yang jelas, lurus menghadap kamera, pencahayaan terang, dan tanpa masker.
            </p>
          </div>

          <!-- Capture controls -->
          <div v-if="!faceReferencePreview" class="grid gap-2.5" :class="cameraActive ? 'grid-cols-2' : 'grid-cols-1'">
            <button v-if="!cameraActive" type="button" @click="startCamera"
              :disabled="isSaving || isCameraLoading || cameraActive"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
              </svg>
              {{ isCameraLoading ? "Membuka..." : "Aktifkan Kamera" }}
            </button>

            <template v-else>
              <button type="button" @click="captureReferencePhoto" :disabled="isSaving || !cameraActive || isCameraLoading"
                class="inline-flex h-12 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                Ambil Foto
              </button>
              <button type="button" @click="stopCamera" :disabled="isSaving"
                class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
                Tutup
              </button>
            </template>
          </div>

          <button v-else type="button" @click="retakeReferencePhoto" :disabled="isSaving"
            class="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
            Ambil Ulang
          </button>

          <!-- Save -->
          <button v-if="faceReferenceFile" type="button" @click="saveFaceReference" :disabled="isSaving || !faceReferenceFile"
            class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
            <svg v-if="isSaving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {{ isSaving ? "Menyimpan..." : hasReferenceImage ? "Ganti Foto Referensi" : "Simpan Foto Referensi" }}
          </button>

          <!-- Remove -->
          <button v-if="hasReferenceImage && !faceReferencePreview" type="button" @click="removeFaceReference" :disabled="isSaving"
            class="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            Hapus Foto Referensi
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useProfileStore } from "@/store/profile";
import { pushToast } from "@/composables/useToast";

const profileStore = useProfileStore();
const faceReferenceFile = ref(null);
const faceReferencePreview = ref("");
const isSaving = ref(false);
const isCameraLoading = ref(false);
const cameraActive = ref(false);
const cameraVideoRef = ref(null);
const captureCanvasRef = ref(null);
let faceApiLoadPromise = null;
let cameraStream = null;

const hasReferenceImage = computed(() => Boolean(String(profileStore.profile?.face_reference_image || "").trim()));
const currentReferenceImage = computed(() => faceReferencePreview.value || profileStore.profile?.face_reference_image || "");

const FACE_API_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
const FACE_API_MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

const resetPreview = () => {
  if (faceReferencePreview.value) {
    URL.revokeObjectURL(faceReferencePreview.value);
    faceReferencePreview.value = "";
  }
  faceReferenceFile.value = null;
};

const stopCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraActive.value = false;
  if (cameraVideoRef.value) {
    cameraVideoRef.value.srcObject = null;
  }
};

const startCamera = async () => {
  if (cameraActive.value || isCameraLoading.value) {
    return;
  }

  isCameraLoading.value = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 960 },
        height: { ideal: 960 },
      },
      audio: false,
    });

    cameraStream = stream;
    if (cameraVideoRef.value) {
      cameraVideoRef.value.srcObject = stream;
      await cameraVideoRef.value.play();
    }
    cameraActive.value = true;
  } catch (error) {
    stopCamera();
    pushToast({
      title: "Kamera Tidak Tersedia",
      message: "Browser tidak bisa mengakses kamera. Izinkan kamera lalu coba lagi.",
      type: "error",
    });
  } finally {
    isCameraLoading.value = false;
  }
};

const loadFaceApi = async () => {
  if (window.faceapi) {
    return window.faceapi;
  }

  if (!faceApiLoadPromise) {
    faceApiLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = FACE_API_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve(window.faceapi);
      script.onerror = () => reject(new Error("Gagal memuat library face recognition."));
      document.head.appendChild(script);
    });
  }

  const faceapi = await faceApiLoadPromise;
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(FACE_API_MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(FACE_API_MODEL_URL),
  ]);
  return faceapi;
};

const detectFaceDescriptor = async (file) => {
  const previewUrl = URL.createObjectURL(file);
  try {
    const faceapi = await loadFaceApi();
    const image = await faceapi.fetchImage(previewUrl);
    const result = await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!result?.descriptor) {
      throw new Error("Wajah tidak terdeteksi dengan jelas. Ambil ulang foto dengan pencahayaan yang lebih terang.");
    }

    return JSON.stringify(Array.from(result.descriptor));
  } finally {
    URL.revokeObjectURL(previewUrl);
  }
};

const captureReferencePhoto = async () => {
  const video = cameraVideoRef.value;
  const canvas = captureCanvasRef.value;

  if (!video || !canvas || !cameraActive.value) {
    return;
  }

  resetPreview();

  canvas.width = video.videoWidth || 720;
  canvas.height = video.videoHeight || 720;
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.92);
  });

  if (!blob) {
    pushToast({
      title: "Gagal Mengambil Foto",
      message: "Foto dari kamera tidak berhasil diproses.",
      type: "error",
    });
    return;
  }

  faceReferenceFile.value = new File([blob], `face-reference-${Date.now()}.jpg`, {
    type: "image/jpeg",
  });
  faceReferencePreview.value = URL.createObjectURL(faceReferenceFile.value);
};

const retakeReferencePhoto = async () => {
  resetPreview();
  if (!cameraActive.value) {
    await startCamera();
  }
};

const saveFaceReference = async () => {
  if (!faceReferenceFile.value) return;
  isSaving.value = true;
  try {
    const descriptor = await detectFaceDescriptor(faceReferenceFile.value);
    const formData = new FormData();
    formData.append("face_reference_image", faceReferenceFile.value);
    formData.append("face_reference_descriptor", descriptor);
    await profileStore.saveProfile(formData);
    pushToast({
      title: "Foto Referensi Disimpan",
      message: "Foto referensi wajah berhasil diperbarui.",
      type: "success",
    });
    resetPreview();
    stopCamera();
  } catch (error) {
    pushToast({
      title: "Gagal Menyimpan Foto Referensi",
      message: error.message || "Gagal menyimpan foto referensi wajah.",
      type: "error",
    });
  } finally {
    isSaving.value = false;
  }
};

const removeFaceReference = async () => {
  isSaving.value = true;
  try {
    const formData = new FormData();
    formData.append("remove_face_reference", "true");
    await profileStore.saveProfile(formData);
    pushToast({
      title: "Foto Referensi Dihapus",
      message: "Foto referensi wajah berhasil dihapus.",
      type: "success",
    });
    resetPreview();
  } catch (error) {
    pushToast({
      title: "Gagal Menghapus Foto Referensi",
      message: error.message || "Gagal menghapus foto referensi wajah.",
      type: "error",
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  try {
    await profileStore.loadProfile({ force: true });
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Profil",
      message: error.message || "Gagal memuat profil pengguna.",
      type: "error",
    });
  }
});

onUnmounted(() => {
  stopCamera();
  resetPreview();
});
</script>
