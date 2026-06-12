<template>
  <div class="reg-root">
    <div class="reg-card">
      <div class="reg-header">
        <div>
          <p class="reg-eyebrow">Pendaftaran Siswa</p>
          <h1 class="reg-title">Gabung Ke Kelas Sekarang</h1>
          <p class="reg-subtitle">Cukup isi nama lengkap. Username dan password akan dibuat otomatis oleh sistem.</p>
        </div>
        <router-link to="/auth/login" class="reg-login-btn">Ke Login</router-link>
      </div>
      <div class="reg-body">
        <SkeletonLoader v-if="isLoadingOptions" variant="form" :count="3" />
        <form v-show="!isLoadingOptions" @submit.prevent="handleSubmit">

          <!-- Data Siswa -->
          <div class="reg-section-divider">
            <span class="reg-section-label">Data Siswa</span>
            <span class="reg-section-line"></span>
          </div>

          <div class="reg-grid">
            <div class="reg-field full">
              <label class="reg-label">Nama Lengkap <span class="required">*</span></label>
              <input
                v-model.trim="form.full_name"
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                class="reg-input"
              />
              <span class="reg-hint">Username dan password akan dibuat otomatis setelah daftar.</span>
            </div>
          </div>

          <!-- Sekolah -->
          <div class="reg-section-divider">
            <span class="reg-section-label">Sekolah</span>
            <span class="reg-section-line"></span>
          </div>

          <div class="reg-grid">
            <div class="reg-field">
              <label class="reg-label">Sekolah</label>
              <input :value="schoolName || (isLoadingOptions ? 'Memuat sekolah...' : '-')" type="text" readonly class="reg-input" />
            </div>

            <div class="reg-field">
              <label class="reg-label">Kelas <span class="required">*</span></label>
              <input
                v-if="availableClasses.length === 1"
                :value="selectedClassLabel || '-'"
                type="text"
                readonly
                class="reg-input"
              />
              <select
                v-else
                v-model="form.class_id"
                required
                :disabled="availableClasses.length === 0"
                class="reg-input reg-select"
              >
                <option value="">
                  {{ schoolName ? "Pilih kelas" : "Link pendaftaran tidak valid" }}
                </option>
                <option v-for="item in availableClasses" :key="item.id" :value="String(item.id)">
                  {{ item.class_name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Message -->
          <div v-if="message" :class="['reg-msg', isError ? 'error' : 'success']">
            {{ message }}
          </div>

          <!-- Submit -->
          <button type="submit" class="reg-submit" :disabled="isSubmitting || isLoadingOptions || !registrationToken">
            {{ isSubmitting ? "Menyimpan registrasi..." : "Kirim Registrasi" }}
          </button>

          <p class="reg-footer-note">
            Dengan mendaftar, kamu menyetujui ketentuan penggunaan platform ini.
          </p>
        </form>
      </div>
    </div>

    <teleport to="body">
      <div v-if="isSuccessModalOpen" class="reg-modal-overlay" @click.self="closeSuccessModal">
        <div class="reg-modal" role="dialog" aria-modal="true" aria-labelledby="reg-success-title">
          <div class="reg-modal-head">
            <div class="reg-modal-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3l-8.47-14.14a2 2 0 0 0-3.42 0Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div>
              <p class="reg-modal-kicker">Registrasi berhasil</p>
              <h2 id="reg-success-title" class="reg-modal-title">Screenshot sekarang sebelum ditutup</h2>
            </div>
          </div>
          <p class="reg-modal-desc">
            Username dan password di bawah dipakai siswa untuk login. Simpan dengan screenshot atau salin ke tempat aman.
          </p>

          <div class="reg-modal-credentials">
            <div class="reg-modal-row">
              <span class="reg-modal-label">Username</span>
              <div class="reg-modal-value-group">
                <code class="reg-modal-value">{{ registrationResult?.username }}</code>
                <button type="button" class="reg-modal-copy" @click="copyToClipboard(registrationResult?.username)">
                  <svg viewBox="0 0 24 24" aria-hidden="true" class="reg-modal-copy-icon">
                    <path
                      d="M9 12h6m-6 4h6M15 3H9a2 2 0 0 0-2 2v1H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1h2a2 2 0 0 0 2-2V8l-6-5Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Salin
                </button>
              </div>
            </div>

            <div class="reg-modal-row">
              <span class="reg-modal-label">Password</span>
              <div class="reg-modal-value-group">
                <code class="reg-modal-value">{{ registrationResult?.password }}</code>
                <button type="button" class="reg-modal-copy" @click="copyToClipboard(registrationResult?.password)">
                  <svg viewBox="0 0 24 24" aria-hidden="true" class="reg-modal-copy-icon">
                    <path
                      d="M9 12h6m-6 4h6M15 3H9a2 2 0 0 0-2 2v1H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1h2a2 2 0 0 0 2-2V8l-6-5Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Salin
                </button>
              </div>
            </div>
          </div>

          <div class="reg-modal-actions">
            <router-link to="/auth/login" class="reg-modal-login">Ke Halaman Login</router-link>
            <button type="button" class="reg-modal-close" @click="closeSuccessModal">Tutup</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/api";

const route = useRoute();
const registrationToken = String(route.query.token || "").trim();
const schoolName = ref("");
const isSubmitting = ref(false);
const isLoadingOptions = ref(false);
const message = ref("");
const isError = ref(false);
const registrationResult = ref(null);
const isSuccessModalOpen = ref(false);
const availableClasses = ref([]);

const baseForm = () => ({
  full_name: "",
  class_id: "",
});

const form = reactive(baseForm());
const selectedClassLabel = computed(() => {
  const match = availableClasses.value.find((item) => String(item.id) === String(form.class_id));
  return match?.class_name || "";
});

const loadOptions = async () => {
  isLoadingOptions.value = true;
  try {
    const response = await api.get("/public/registration-options", {
      params: { token: registrationToken },
    });
    schoolName.value = response?.data?.school?.name || "";
    availableClasses.value = response?.data?.classes || [];
    if (availableClasses.value.length === 1) {
      form.class_id = String(availableClasses.value[0].id);
    }
  } finally {
    isLoadingOptions.value = false;
  }
};

const handleSubmit = async () => {
  if (!form.full_name.trim()) {
    isError.value = true;
    message.value = "Nama lengkap wajib diisi.";
    return;
  }

  isSubmitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post("/public/student-registration", {
      full_name: form.full_name,
      token: registrationToken,
      class_id: Number(form.class_id),
    });

    isError.value = false;
    const username = response?.data?.username || "-";
    const password = response?.data?.password || "-";
    message.value = "Registrasi siswa berhasil.";
    registrationResult.value = {
      username,
      password,
    };
    isSuccessModalOpen.value = true;

    const selectedClass = form.class_id;
    Object.assign(form, baseForm());
    form.class_id = selectedClass;
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  Object.assign(form, baseForm());
  message.value = "";
  isError.value = false;

  if (!registrationToken) {
    isError.value = true;
    message.value = "Link pendaftaran tidak valid. Gunakan link dari admin sekolah.";
    return;
  }
  try {
    await loadOptions();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  }
});

const closeSuccessModal = () => {
  isSuccessModalOpen.value = false;
};

const copyToClipboard = async (text) => {
  const value = String(text || "").trim();
  if (!value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    return;
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "readonly");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');

.reg-root {
  --ink: #0b1220;
  --muted: #49566f;
  --bg: #f1f3f4;
  --card: #ffffff;
  --line: #dadce0;
  --brand: #1a73e8;
  --brand-strong: #1a73e8;
  font-family: 'Space Grotesk', sans-serif;
  min-height: 100vh;
  background: var(--bg);
  padding: 2rem 1rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reg-card {
  width: 100%;
  max-width: 700px;
  background: var(--card);
  border-radius: 16px;
  border: 1px solid var(--line);
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.15), 0 1px 3px 1px rgba(60, 64, 67, 0.1);
}

.reg-header {
  padding: 1.8rem 2rem;
  border-bottom: 1px solid var(--line);
  background: #fff;
  color: #202124;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
}

.reg-eyebrow {
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
  color: #5f6368;
}

.reg-title {
  font-family: 'Sora', sans-serif;
  font-size: 29px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 8px;
  color: #202124;
}

.reg-subtitle {
  font-size: 13px;
  color: #5f6368;
  line-height: 1.55;
  margin: 0;
}

.reg-login-btn {
  flex-shrink: 0;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #dadce0;
  background: #fff;
  color: #1a73e8;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.reg-login-btn:hover {
  background: #f8f9fa;
  color: #174ea6;
}

.reg-body {
  padding: 1.6rem 2rem 2rem;
}

.reg-section-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 16px;
}

.reg-section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5f6368;
  white-space: nowrap;
}

.reg-section-line {
  flex: 1;
  height: 1px;
  background: #eceff1;
}

.reg-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
  margin-bottom: 16px;
}

.reg-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reg-field.full {
  grid-column: 1 / -1;
}

.reg-label {
  font-size: 12px;
  font-weight: 700;
  color: #202124;
  letter-spacing: 0.03em;
}

.required {
  color: #d11a3f;
  margin-left: 2px;
}

.reg-input {
  padding: 11px 13px;
  border-radius: 8px;
  border: 1px solid #dadce0;
  background: #fff;
  font-size: 14px;
  color: #15233d;
  outline: none;
  transition: all 0.18s ease;
  width: 100%;
  box-sizing: border-box;
}

.reg-input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.14);
}

.reg-input::placeholder {
  color: #7f94b8;
}

.reg-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #f8f9fa;
}

.reg-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23003eb3' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 13px center;
  background-color: #fff;
  padding-right: 36px;
  cursor: pointer;
}

.reg-hint {
  font-size: 11px;
  color: #546a90;
}

.username-input-wrapper {
  position: relative;
}

.username-status {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.username-status.checking {
  color: #5f6368;
}

.username-status.available {
  color: #0f9d58;
}

.username-status.taken {
  color: #d93025;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.reg-input.input-checking {
  border-color: #5f6368;
  padding-right: 40px;
}

.reg-input.input-available {
  border-color: #0f9d58;
  padding-right: 40px;
}

.reg-input.input-taken {
  border-color: #d93025;
  padding-right: 40px;
}

.username-message {
  display: block;
  font-size: 11px;
  margin-top: 4px;
  font-weight: 500;
}

.username-message.available {
  color: #0f9d58;
}

.username-message.taken {
  color: #d93025;
}

.username-suggestions {
  margin-top: 8px;
  padding: 10px 12px;
  background: #f8f9fa;
  border: 1px solid #e8eaed;
  border-radius: 8px;
}

.suggestions-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #5f6368;
  margin-bottom: 6px;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #dadce0;
  background: #fff;
  color: #1a73e8;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  background: #e8f0fe;
  border-color: #1a73e8;
}

.suggestion-btn:active {
  transform: scale(0.97);
}

.reg-msg {
  border-radius: 12px;
  padding: 11px 14px;
  font-size: 13px;
  margin-bottom: 16px;
  line-height: 1.5;
  font-weight: 500;
}

.reg-msg.error {
  background: #fff2f5;
  border: 1px solid #ffcad8;
  color: #9c1742;
}

.reg-msg.success {
  background: #eef6ff;
  border: 1px solid #b9d7ff;
  color: #0849b8;
}

.reg-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 18, 32, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

.reg-modal {
  width: min(100%, 520px);
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(26, 115, 232, 0.14);
  box-shadow: 0 24px 80px rgba(11, 18, 32, 0.28);
  padding: 1.5rem;
}

.reg-modal-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.reg-modal-icon {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #fde8eb;
  color: #e11d48;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.reg-modal-icon svg {
  width: 28px;
  height: 28px;
}

.reg-modal-kicker {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #e11d48;
}

.reg-modal-title {
  margin: 0;
  font-family: 'Sora', sans-serif;
  font-size: 22px;
  line-height: 1.25;
  color: #0b1220;
}

.reg-modal-desc {
  margin: 14px 0 16px;
  color: #49566f;
  font-size: 13px;
  line-height: 1.6;
}

.reg-modal-credentials {
  display: grid;
  gap: 12px;
}

.reg-modal-row {
  display: grid;
  gap: 8px;
}

.reg-modal-label {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #5f6368;
}

.reg-modal-value-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.reg-modal-value {
  flex: 1;
  min-width: 0;
  border-radius: 12px;
  background: #0b1220;
  color: #f8fafc;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  word-break: break-word;
}

.reg-modal-copy,
.reg-modal-login,
.reg-modal-close {
  border: 0;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  text-decoration: none;
}

.reg-modal-copy {
  background: #fff1f2;
  color: #e11d48;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.reg-modal-login {
  background: #e11d48;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(225, 29, 72, 0.22);
  text-align: center;
}

.reg-modal-close {
  background: #eef2f7;
  color: #202124;
}

.reg-modal-copy:hover,
.reg-modal-login:hover,
.reg-modal-close:hover {
  transform: translateY(-1px);
}

.reg-modal-copy-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}

.reg-modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

@media (max-width: 640px) {
  .reg-modal {
    padding: 1.25rem;
    border-radius: 18px;
  }

  .reg-modal-head {
    gap: 12px;
  }

  .reg-modal-icon {
    width: 50px;
    height: 50px;
  }

  .reg-modal-value-group {
    align-items: stretch;
  }

  .reg-modal-copy {
    width: 100%;
  }

  .reg-modal-login,
  .reg-modal-close {
    width: 100%;
  }
}

.reg-submit {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: none;
  background: #1a73e8;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.02em;
  margin-top: 6px;
  box-shadow: none;
}

.reg-submit:hover:not(:disabled) {
  background: #1765cc;
  transform: none;
}

.reg-submit:active:not(:disabled) {
  background: #1557b0;
}

.reg-submit:disabled {
  opacity: 0.58;
  cursor: not-allowed;
  box-shadow: none;
}

.reg-footer-note {
  text-align: center;
  font-size: 11px;
  color: var(--muted);
  margin-top: 12px;
}

@media (max-width: 700px) {
  .reg-header {
    padding: 1.35rem 1.25rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .reg-title {
    font-size: 24px;
  }

  .reg-body {
    padding: 1.2rem 1.25rem 1.4rem;
  }
}

@media (max-width: 520px) {
  .reg-header {
    gap: 10px;
  }

  .reg-grid {
    grid-template-columns: 1fr;
  }

  .reg-field.full {
    grid-column: 1;
  }

  .reg-login-btn {
    align-self: flex-start;
  }
}
</style>
