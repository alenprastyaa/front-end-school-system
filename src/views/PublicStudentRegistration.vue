<template>
  <div class="reg-root">
    <div class="reg-card">

      <div class="reg-body">
        <router-link to="/auth/login" class="reg-login-btn ml-auto">Ke Login →</router-link>
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
              <label class="reg-label">Sekolah <span class="required">*</span></label>
              <select v-model="form.school_id" required :disabled="isLoadingOptions" class="reg-input reg-select">
                <option value="">
                  {{ isLoadingOptions ? "Memuat sekolah..." : "Pilih sekolah" }}
                </option>
                <option v-for="item in schools" :key="item.id" :value="String(item.id)">
                  {{ item.name }}
                </option>
              </select>
            </div>

            <div class="reg-field">
              <label class="reg-label">Kelas <span class="required">*</span></label>
              <select v-model="form.class_id" required :disabled="availableClasses.length === 0"
                class="reg-input reg-select">
                <option value="">
                  {{ form.school_id ? "Pilih kelas" : "Pilih sekolah dulu" }}
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
          <button type="submit" class="reg-submit" :disabled="isSubmitting || isLoadingOptions">
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
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";

const schools = ref([]);
const isSubmitting = ref(false);
const isLoadingOptions = ref(false);
const message = ref("");
const isError = ref(false);

const baseForm = () => ({
  username: "",
  password: "",
  confirm_password: "",
  school_id: "",
  class_id: "",
  parent_email: "",
  phone_number: "",
});

const form = reactive(baseForm());

const availableClasses = computed(() => {
  const currentSchool = schools.value.find((item) => String(item.id) === form.school_id);
  return currentSchool?.classes || [];
});

watch(
  () => form.school_id,
  () => {
    form.class_id = "";
  },
);

const loadOptions = async () => {
  isLoadingOptions.value = true;
  try {
    const response = await api.get("/public/registration-options");
    schools.value = response?.data || [];
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
      class_id: Number(form.class_id),
      parent_email: form.parent_email || null,
      phone_number: form.phone_number || null,
    });

    message.value = response?.message || "Registrasi siswa berhasil";
    Object.assign(form, baseForm());
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    await loadOptions();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

/* ── Palet Biru Solid ── */
/* --blue-50:  #EBF3FB  (background ringan) */
/* --blue-100: #C5DCF5  (border/divider)    */
/* --blue-500: #2563EB  (aksen utama)       */
/* --blue-600: #1D4ED8  (hover)             */
/* --blue-900: #1E3A5F  (teks judul)        */

.reg-root {
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  background: #EBF3FB;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reg-card {
  width: 100%;
  max-width: 620px;
  background: #ffffff;
  border-radius: 24px;
  border: 1.5px solid #C5DCF5;
  overflow: hidden;
}

/* ── Header ── */
.reg-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1.5px solid #C5DCF5;
  background: #EBF3FB;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.reg-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2563EB;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.reg-badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #93C5FD;
  display: inline-block;
  flex-shrink: 0;
}

.reg-title {
  font-family: 'DM Serif Display', serif;
  font-size: 26px;
  font-weight: 400;
  color: #1E3A5F;
  line-height: 1.2;
  margin: 0 0 6px;
}

.reg-subtitle {
  font-size: 13px;
  color: #4A6FA5;
  line-height: 1.6;
  margin: 0;
  font-weight: 300;
}

.reg-login-btn {
  flex-shrink: 0;
  padding: 7px 16px;
  border-radius: 20px;
  border: 1.5px solid #2563EB;
  background: #ffffff;
  color: #2563EB;
  font-size: 12.5px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
  text-decoration: none;
  display: inline-block;
  margin-top: 4px;
}

.reg-login-btn:hover {
  background: #2563EB;
  color: #ffffff;
}

/* ── Body ── */
.reg-body {
  padding: 1.75rem 2rem 2rem;
}

.reg-section-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 14px;
}

.reg-section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4A6FA5;
  white-space: nowrap;
}

.reg-section-line {
  flex: 1;
  height: 1.5px;
  background: #C5DCF5;
}

/* ── Grid & Fields ── */
.reg-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.reg-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.reg-field.full {
  grid-column: 1 / -1;
}

.reg-label {
  font-size: 12px;
  font-weight: 600;
  color: #1E3A5F;
  letter-spacing: 0.02em;
}

.required {
  color: #DC2626;
  margin-left: 2px;
}

.reg-input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #C5DCF5;
  background: #F7FAFD;
  font-size: 13.5px;
  font-family: 'DM Sans', sans-serif;
  color: #1E3A5F;
  outline: none;
  transition: all 0.18s;
  width: 100%;
  box-sizing: border-box;
}

.reg-input:focus {
  border-color: #2563EB;
  background: #ffffff;
  box-shadow: 0 0 0 3px #DBEAFE;
}

.reg-input::placeholder {
  color: #93B4D4;
}

.reg-input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background: #EBF3FB;
}

.reg-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232563EB' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-color: #F7FAFD;
  padding-right: 36px;
  cursor: pointer;
}

.reg-hint {
  font-size: 11px;
  color: #4A6FA5;
  font-weight: 300;
}

/* ── Message ── */
.reg-msg {
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 14px;
  line-height: 1.5;
}

.reg-msg.error {
  background: #FEF2F2;
  border: 1.5px solid #FECACA;
  color: #991B1B;
}

.reg-msg.success {
  background: #EFF6FF;
  border: 1.5px solid #BFDBFE;
  color: #1D4ED8;
}

/* ── Submit ── */
.reg-submit {
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: #2563EB;
  color: #ffffff;
  font-size: 14.5px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  letter-spacing: 0.01em;
  margin-top: 4px;
}

.reg-submit:hover:not(:disabled) {
  background: #1D4ED8;
  transform: translateY(-1px);
}

.reg-submit:active:not(:disabled) {
  background: #1E40AF;
  transform: translateY(0);
}

.reg-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.reg-footer-note {
  text-align: center;
  font-size: 11.5px;
  color: #4A6FA5;
  margin-top: 14px;
  font-weight: 300;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .reg-header {
    flex-direction: column;
    gap: 12px;
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