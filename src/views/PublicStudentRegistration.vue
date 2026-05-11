<template>
  <div class="reg-root">
    <div class="reg-card">
      <div class="reg-header">
        <div>
          <p class="reg-eyebrow">Pendaftaran Siswa</p>
          <h1 class="reg-title">Gabung Ke Kelas Sekarang</h1>
          <p class="reg-subtitle">Akun siswa akan langsung terhubung ke sekolah yang membagikan link ini.</p>
        </div>
        <router-link to="/auth/login" class="reg-login-btn">Ke Login</router-link>
      </div>
      <div class="reg-body">
        <form @submit.prevent="handleSubmit">

          <!-- Akun -->
          <div class="reg-section-divider">
            <span class="reg-section-label">Akun</span>
            <span class="reg-section-line"></span>
          </div>

          <div class="reg-grid">
            <div class="reg-field full">
              <label class="reg-label">Username Siswa <span class="required">*</span></label>
              <div class="username-input-wrapper">
                <input v-model.trim="form.username" type="text" required minlength="3" placeholder="Contoh: siswa7a01"
                  class="reg-input" :class="{
                    'input-checking': isCheckingUsername,
                    'input-available': usernameAvailable === true,
                    'input-taken': usernameAvailable === false
                  }" />
                <span v-if="isCheckingUsername" class="username-status checking">
                  <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </span>
                <span v-else-if="usernameAvailable === true" class="username-status available">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </span>
                <span v-else-if="usernameAvailable === false" class="username-status taken">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </span>
              </div>
              <span v-if="usernameMessage" :class="['username-message', usernameAvailable ? 'available' : 'taken']">
                {{ usernameMessage }}
              </span>
              <div v-if="usernameSuggestions.length > 0" class="username-suggestions">
                <span class="suggestions-label">Saran username:</span>
                <div class="suggestions-list">
                  <button
                    v-for="suggestion in usernameSuggestions"
                    :key="suggestion"
                    type="button"
                    @click="selectSuggestion(suggestion)"
                    class="suggestion-btn"
                  >
                    {{ suggestion }}
                  </button>
                </div>
              </div>
              <span v-else class="reg-hint">Minimal 3 karakter. Gunakan username yang unik.</span>
            </div>

            <div class="reg-field">
              <label class="reg-label">Password <span class="required">*</span></label>
              <input v-model="form.password" type="password" required minlength="6" placeholder="Min. 6 karakter"
                class="reg-input" />
            </div>

            <div class="reg-field">
              <label class="reg-label">Ulangi Password <span class="required">*</span></label>
              <input v-model="form.confirm_password" type="password" required minlength="6"
                placeholder="Ulangi password" class="reg-input" />
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
              <input :value="schoolName || (isLoadingOptions ? 'Memuat sekolah...' : '-')" type="text" readonly
                class="reg-input" />
            </div>

            <div class="reg-field">
              <label class="reg-label">Kelas <span class="required">*</span></label>
              <select v-model="form.class_id" required :disabled="availableClasses.length === 0"
                class="reg-input reg-select">
                <option value="">
                  {{ schoolName ? "Pilih kelas" : "Link pendaftaran tidak valid" }}
                </option>
                <option v-for="item in availableClasses" :key="item.id" :value="String(item.id)">
                  {{ item.class_name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Kontak Opsional -->
          <div class="reg-section-divider">
            <span class="reg-section-label">Kontak Opsional</span>
            <span class="reg-section-line"></span>
          </div>

          <div class="reg-grid">
            <div class="reg-field">
              <label class="reg-label">Email Orang Tua</label>
              <input v-model.trim="form.parent_email" type="email" placeholder="ortu@contoh.com" class="reg-input" />
            </div>

            <div class="reg-field">
              <label class="reg-label">Nomor HP</label>
              <input v-model.trim="form.phone_number" type="text" placeholder="081234567890" class="reg-input" />
            </div>
          </div>

          <!-- Message -->
          <div v-if="message" :class="['reg-msg', isError ? 'error' : 'success']">
            {{ message }}
          </div>

          <!-- Submit -->
          <button type="submit" class="reg-submit" :disabled="isSubmitting || isLoadingOptions || !registrationToken">
            {{ isSubmitting ? "Menyimpan registrasi..." : "Kirim Registrasi Siswa" }}
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
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/api";

const route = useRoute();
const registrationToken = String(route.query.token || "").trim();
const schoolName = ref("");
const isSubmitting = ref(false);
const isLoadingOptions = ref(false);
const message = ref("");
const isError = ref(false);

// Username validation states
const isCheckingUsername = ref(false);
const usernameAvailable = ref(null); // null = not checked, true = available, false = taken
const usernameMessage = ref("");
const usernameSuggestions = ref([]);
let usernameCheckTimeout = null;

const baseForm = () => ({
  username: "",
  password: "",
  confirm_password: "",
  class_id: "",
  parent_email: "",
  phone_number: "",
});

const form = reactive(baseForm());

const availableClasses = ref([]);

const loadOptions = async () => {
  isLoadingOptions.value = true;
  try {
    const response = await api.get("/public/registration-options", {
      params: { token: registrationToken },
    });
    schoolName.value = response?.data?.school?.name || "";
    availableClasses.value = response?.data?.classes || [];
  } finally {
    isLoadingOptions.value = false;
  }
};

const checkUsernameAvailability = async (username) => {
  if (!username || username.length < 3) {
    usernameAvailable.value = null;
    usernameMessage.value = "";
    usernameSuggestions.value = [];
    return;
  }

  isCheckingUsername.value = true;
  try {
    const response = await api.get("/public/check-username", {
      params: { username },
    });

    usernameAvailable.value = response?.available || false;
    usernameMessage.value = response?.message || "";
    usernameSuggestions.value = response?.suggestions || [];
  } catch (error) {
    usernameAvailable.value = null;
    usernameMessage.value = "";
    usernameSuggestions.value = [];
  } finally {
    isCheckingUsername.value = false;
  }
};

// Watch username changes with debounce
watch(
  () => form.username,
  (newUsername) => {
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }

    if (!newUsername || newUsername.length < 3) {
      usernameAvailable.value = null;
      usernameMessage.value = "";
      usernameSuggestions.value = [];
      return;
    }

    usernameCheckTimeout = setTimeout(() => {
      checkUsernameAvailability(newUsername);
    }, 500);
  }
);

const selectSuggestion = (suggestion) => {
  form.username = suggestion;
};

const handleSubmit = async () => {
  if (form.password !== form.confirm_password) {
    isError.value = true;
    message.value = "Konfirmasi password tidak sama.";
    return;
  }

  if (usernameAvailable.value === false) {
    isError.value = true;
    message.value = "Username sudah digunakan, pilih username lain.";
    return;
  }

  isSubmitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post("/public/student-registration", {
      username: form.username,
      password: form.password,
      token: registrationToken,
      class_id: Number(form.class_id),
      parent_email: form.parent_email || null,
      phone_number: form.phone_number || null,
    });

    isError.value = false;
    message.value = response?.message || "Registrasi siswa berhasil";
    
    // Reset form setelah berhasil, tapi pertahankan class_id
    const selectedClass = form.class_id;
    Object.assign(form, baseForm());
    form.class_id = selectedClass;
    
    // Reset username validation states
    usernameAvailable.value = null;
    usernameMessage.value = "";
    usernameSuggestions.value = [];
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  // Reset form saat halaman dibuka
  Object.assign(form, baseForm());
  usernameAvailable.value = null;
  usernameMessage.value = "";
  usernameSuggestions.value = [];
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

onUnmounted(() => {
  // Clear timeout untuk mencegah memory leak
  if (usernameCheckTimeout) {
    clearTimeout(usernameCheckTimeout);
  }
});
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
