<template>
  <div
    class="min-h-screen bg-slate-50/50 px-3 pb-12 pt-4 font-sans text-slate-900 md:px-8 md:pt-8 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto space-y-5">


      <section
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Foto Referensi</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Gunakan wajah yang jelas, lurus, dan pencahayaan
              terang.</p>
          </div>
          <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            :class="hasReferenceImage ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'">
            {{ hasReferenceImage ? "Tersimpan" : "Belum Ada" }}
          </span>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[220px,1fr]">
          <div
            class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40">
            <div class="aspect-square">
              <img v-if="currentReferenceImage" :src="currentReferenceImage" alt="Foto referensi wajah"
                class="h-full w-full object-cover" />
              <div v-else
                class="flex h-full w-full items-center justify-center px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                Belum ada foto referensi
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div
              class="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              Pastikan hanya satu wajah, tidak blur, dan tidak memakai masker.
            </div>

            <div class="flex flex-wrap gap-2">
              <button type="button" @click="startCamera" :disabled="isSaving || isCameraLoading || cameraActive"
                class="inline-flex h-10 items-center justify-center rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                {{ isCameraLoading ? "Membuka..." : cameraActive ? "Kamera Aktif" : "Aktifkan Kamera" }}
              </button>
              <button v-if="cameraActive" type="button" @click="stopCamera" :disabled="isSaving"
                class="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                Tutup Kamera
              </button>
              <button type="button" @click="captureReferencePhoto"
                :disabled="isSaving || !cameraActive || isCameraLoading"
                class="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
                Ambil Foto
              </button>
              <button v-if="faceReferencePreview" type="button" @click="retakeReferencePhoto" :disabled="isSaving"
                class="inline-flex h-10 items-center justify-center rounded-lg border border-amber-300 bg-amber-50 px-4 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                Ambil Ulang
              </button>
            </div>

            <div
              class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
              <video v-show="cameraActive && !faceReferencePreview" ref="cameraVideoRef"
                class="aspect-square w-full object-cover" autoplay playsinline muted></video>
              <div v-if="!cameraActive && !faceReferencePreview"
                class="flex aspect-square w-full items-center justify-center px-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Aktifkan kamera untuk mengambil foto referensi.
              </div>
              <img v-if="faceReferencePreview" :src="faceReferencePreview" alt="Preview foto referensi baru"
                class="aspect-square w-full object-cover" />
            </div>

            <canvas ref="captureCanvasRef" class="hidden"></canvas>

            <button type="button" @click="saveFaceReference" :disabled="isSaving || !faceReferenceFile"
              class="inline-flex h-11 w-full items-center justify-center rounded-lg bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
              {{ isSaving ? "Menyimpan..." : hasReferenceImage ? "Ganti Foto Referensi" : "Simpan Foto Referensi" }}
            </button>

            <button v-if="hasReferenceImage" type="button" @click="removeFaceReference" :disabled="isSaving"
              class="inline-flex h-11 w-full items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              Hapus Foto Referensi
            </button>
          </div>
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

const loadStoredReferencePreview = async () => {
  resetStoredReferencePreview();
  if (!hasReferenceImage.value) {
    return;
  }

  try {
    storedReferencePreview.value = await buildAuthorizedObjectUrl("/auth/profile/face-reference-image");
  } catch (error) {
    pushToast({
      title: "Gagal Memuat Foto Referensi",
      message: error.message || "Foto referensi tersimpan tidak bisa dimuat.",
      type: "error",
    });
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
