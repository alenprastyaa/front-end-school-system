<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-3xl space-y-6">
      <section class="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">SPMB</p>
        <h1 class="mt-2 text-2xl font-bold">Pendaftaran Siswa Baru</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ school?.name || "Sekolah" }}</p>
      </section>

      <section v-if="message" class="rounded-lg border p-4 text-sm font-semibold"
        :class="isError ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200'">
        {{ message }}
        <div v-if="accessUrl" class="mt-3">
          <a :href="accessUrl" class="font-bold underline">Buka status pendaftaran</a>
        </div>
      </section>

      <section class="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form @submit.prevent="submitRegistration" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium">Nama Lengkap</label>
              <input v-model="form.full_name" required class="mt-1 w-full rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
            </div>
            <div>
              <label class="block text-sm font-medium">Nomor WhatsApp</label>
              <input v-model="form.phone_number" required class="mt-1 w-full rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <div>
              <label class="block text-sm font-medium">Pilihan Jurusan 1</label>
              <select v-model="form.first_major_id" required class="mt-1 w-full rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                <option value="">Pilih</option>
                <option v-for="major in majors" :key="major.id" :value="major.id">{{ major.code }} - {{ major.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">Pilihan Jurusan 2</label>
              <select v-model="form.second_major_id" class="mt-1 w-full rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                <option value="">-</option>
                <option v-for="major in majors" :key="major.id" :value="major.id">{{ major.code }} - {{ major.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">Pilihan Jurusan 3</label>
              <select v-model="form.third_major_id" class="mt-1 w-full rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                <option value="">-</option>
                <option v-for="major in majors" :key="major.id" :value="major.id">{{ major.code }} - {{ major.name }}</option>
              </select>
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <input v-model="form.birth_place" placeholder="Tempat lahir" class="rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
            <input v-model="form.birth_date" type="date" class="rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
            <input v-model="form.nisn" placeholder="NISN" class="rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
            <input v-model="form.origin_school" placeholder="Asal sekolah" class="rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
            <input v-model="form.parent_name" placeholder="Nama orang tua/wali" class="rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
            <input v-model="form.email" type="email" placeholder="Email" class="rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
          </div>
          <textarea v-model="form.address" rows="3" placeholder="Alamat" class="w-full rounded-md border px-3 py-2 dark:border-slate-700 dark:bg-slate-950"></textarea>
          <button :disabled="isSubmitting || majors.length === 0" class="h-11 rounded-lg bg-sky-600 px-5 text-sm font-semibold text-white disabled:opacity-60">
            {{ isSubmitting ? "Mengirim..." : "Kirim Pendaftaran" }}
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/api";

const route = useRoute();
const school = ref(null);
const majors = ref([]);
const message = ref("");
const isError = ref(false);
const isSubmitting = ref(false);
const accessUrl = ref("");
const form = reactive({
  full_name: "",
  phone_number: "",
  birth_place: "",
  birth_date: "",
  nisn: "",
  origin_school: "",
  parent_name: "",
  email: "",
  address: "",
  first_major_id: "",
  second_major_id: "",
  third_major_id: "",
});

const normalizeId = (value) => (value === "" || value == null ? null : Number(value));

const loadOptions = async () => {
  try {
    const response = await api.get("/public/spmb/options", { params: { school_id: route.query.school_id } });
    school.value = response?.data?.school || null;
    majors.value = Array.isArray(response?.data?.majors) ? response.data.majors : [];
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Pendaftaran SPMB belum tersedia.";
  }
};

const submitRegistration = async () => {
  isSubmitting.value = true;
  isError.value = false;
  message.value = "";
  try {
    const response = await api.post("/public/spmb/register", {
      ...form,
      school_id: Number(route.query.school_id || 0),
      first_major_id: normalizeId(form.first_major_id),
      second_major_id: normalizeId(form.second_major_id),
      third_major_id: normalizeId(form.third_major_id),
    });
    accessUrl.value = response?.data?.access_url || "";
    message.value = response?.message || "Pendaftaran berhasil dikirim.";
  } catch (error) {
    isError.value = true;
    message.value = error.message || "Pendaftaran gagal dikirim.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadOptions);
</script>
