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
        <form @submit.prevent="handleSubmit">

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

          <div v-if="registrationResult" class="reg-success-card">
            <div class="reg-success-badge">Berhasil Dibuat</div>
            <h2 class="reg-success-title">Akun siswa siap dipakai login</h2>
            <p class="reg-success-desc">
              Simpan kredensial ini sekarang. Siswa bisa langsung login setelah ini.
            </p>

            <div class="reg-success-credentials">
              <div class="reg-success-row">
                <span class="reg-success-label">Username</span>
                <div class="reg-success-value-group">
                  <code class="reg-success-value">{{ registrationResult.username }}</code>
                  <button type="button" class="reg-success-copy" @click="copyToClipboard(registrationResult.username)">
                    Salin
                  </button>
                </div>
              </div>

              <div class="reg-success-row">
                <span class="reg-success-label">Password</span>
                <div class="reg-success-value-group">
                  <code class="reg-success-value">{{ registrationResult.password }}</code>
                  <button type="button" class="reg-success-copy" @click="copyToClipboard(registrationResult.password)">
                    Salin
                  </button>
                </div>
              </div>
            </div>

            <div class="reg-success-actions">
              <router-link to="/auth/login" class="reg-success-login">Ke Halaman Login</router-link>
              <button type="button" class="reg-success-reset" @click="registrationResult = null">
                Tutup
              </button>
            </div>
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
    const baseMessage = response?.message && response.message !== "User registered successfully"
      ? response.message
      : "Registrasi siswa berhasil";
    message.value = `${baseMessage}. Username: ${username}. Password: ${password}.`;
    registrationResult.value = {
      username,
      password,
    };

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

.reg-success-card {
  margin-bottom: 18px;
  border: 1px solid #c7e9ff;
  background:
    linear-gradient(180deg, rgba(26, 115, 232, 0.08), rgba(255, 255, 255, 0.96)),
    #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(26, 115, 232, 0.08);
}

.reg-success-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  background: rgba(26, 115, 232, 0.12);
  color: #0b57d0;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.reg-success-title {
  margin: 12px 0 6px;
  font-family: 'Sora', sans-serif;
  font-size: 21px;
  line-height: 1.25;
  color: #0b1220;
}

.reg-success-desc {
  margin: 0 0 16px;
  color: #49566f;
  font-size: 13px;
  line-height: 1.6;
}

.reg-success-credentials {
  display: grid;
  gap: 12px;
}

.reg-success-row {
  display: grid;
  gap: 8px;
}

.reg-success-label {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #5f6368;
}

.reg-success-value-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.reg-success-value {
  flex: 1;
  min-width: 0;
  border-radius: 10px;
  background: #0b1220;
  color: #f8fafc;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  word-break: break-word;
}

.reg-success-copy,
.reg-success-login,
.reg-success-reset {
  border: 0;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  text-decoration: none;
}

.reg-success-copy {
  background: #e8f0fe;
  color: #0b57d0;
}

.reg-success-login {
  background: #1a73e8;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(26, 115, 232, 0.22);
}

.reg-success-reset {
  background: #eef2f7;
  color: #202124;
}

.reg-success-copy:hover,
.reg-success-login:hover,
.reg-success-reset:hover {
  transform: translateY(-1px);
}

.reg-success-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

@media (max-width: 640px) {
  .reg-success-value-group {
    align-items: stretch;
  }

  .reg-success-copy {
    width: 100%;
  }

  .reg-success-login,
  .reg-success-reset {
    width: 100%;
    text-align: center;
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
