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
              <input v-model.trim="form.username" type="text" required minlength="3" placeholder="Contoh: siswa7a01"
                class="reg-input" />
              <span class="reg-hint">Minimal 3 karakter. Gunakan username yang unik.</span>
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

const handleSubmit = async () => {
  if (form.password !== form.confirm_password) {
    isError.value = true;
    message.value = "Konfirmasi password tidak sama.";
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

    message.value = response?.message || "Registrasi siswa berhasil";
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
