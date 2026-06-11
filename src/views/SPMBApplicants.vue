<template>
  <div class="p-6 space-y-6">
    <section class="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">SPMB</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola pendaftar, pilihan jurusan, link status, dan konversi siswa baru.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button @click="copyPublicLink" class="h-10 rounded-lg border px-4 text-sm font-medium dark:border-gray-600 dark:text-white">Salin Link Form</button>
          <button @click="loadData" class="h-10 rounded-lg border px-4 text-sm font-medium dark:border-gray-600 dark:text-white">Refresh</button>
          <button @click="openApplicantModal()" class="h-10 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-500">Tambah Pendaftar</button>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-4">
      <div v-for="card in cards" :key="card.label" class="rounded-lg p-5 text-white" :class="card.class">
        <p class="text-xs font-medium text-white/80">{{ card.label }}</p>
        <p class="mt-2 text-3xl font-bold">{{ card.value }}</p>
        <p class="mt-1 text-xs text-white/75">{{ card.caption }}</p>
      </div>
    </section>

    <section class="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div class="grid gap-3 md:grid-cols-[1fr_220px_220px_auto]">
        <input v-model="filters.q" placeholder="Cari nama, nomor, NISN" class="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        <select v-model="filters.status" class="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white">
          <option value="">Semua Status</option>
          <option v-for="item in statusOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
        <select v-model="filters.major_id" class="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white">
          <option value="">Semua Jurusan</option>
          <option v-for="major in majors" :key="major.id" :value="major.id">{{ major.code }} - {{ major.name }}</option>
        </select>
        <button @click="loadApplicants" class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-700">Terapkan</button>
      </div>

      <div class="mt-5 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b text-left text-slate-500 dark:border-gray-700 dark:text-slate-400">
              <th class="py-3 pr-4 font-medium">No. Daftar</th>
              <th class="py-3 pr-4 font-medium">Nama</th>
              <th class="py-3 pr-4 font-medium">Pilihan</th>
              <th class="py-3 pr-4 font-medium">Diterima</th>
              <th class="py-3 pr-4 font-medium">Status</th>
              <th class="py-3 pr-4 font-medium">Kontak</th>
              <th class="py-3 pr-0 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in applicants" :key="item.id" class="border-b text-slate-800 dark:border-gray-700 dark:text-slate-200">
              <td class="py-3 pr-4 font-semibold">{{ item.registration_number }}</td>
              <td class="py-3 pr-4">
                <div class="font-semibold">{{ item.full_name }}</div>
                <div class="text-xs text-slate-500">{{ item.origin_school || "-" }}</div>
              </td>
              <td class="py-3 pr-4">
                <div>{{ majorText(item, "first") }}</div>
                <div class="text-xs text-slate-500">{{ [majorText(item, "second"), majorText(item, "third")].filter(Boolean).join(" / ") || "-" }}</div>
              </td>
              <td class="py-3 pr-4">{{ item.accepted_major_code || "-" }}</td>
              <td class="py-3 pr-4">
                <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusClass(item.status)">
                  {{ statusLabel(item.status) }}
                </span>
              </td>
              <td class="py-3 pr-4">
                <div>{{ item.phone_number }}</div>
                <div class="text-xs text-slate-500">{{ item.email || "-" }}</div>
              </td>
              <td class="py-3 pr-0">
                <div class="flex justify-end gap-2">
                  <button @click="openApplicantModal(item)" class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">Edit</button>
                  <button @click="sendLink(item)" class="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300">Kirim Link</button>
                  <button @click="openConvertModal(item)" class="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300">Jadikan Siswa</button>
                </div>
              </td>
            </tr>
            <tr v-if="applicants.length === 0">
              <td colspan="7" class="py-10 text-center text-slate-500">Belum ada pendaftar SPMB.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <teleport to="body">
      <div v-if="showApplicantModal" class="fixed inset-0 z-[260] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
        <div class="w-full max-w-3xl rounded-lg border bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ editingApplicantId ? "Edit Pendaftar" : "Tambah Pendaftar" }}</h2>
            <button @click="closeApplicantModal" class="text-2xl leading-none text-gray-500">&times;</button>
          </div>
          <form @submit.prevent="saveApplicant" class="space-y-4 p-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                <input v-model="form.full_name" required class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor WhatsApp</label>
                <input v-model="form.phone_number" required class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilihan 1</label>
                <select v-model="form.first_major_id" required class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                  <option value="">Pilih Jurusan</option>
                  <option v-for="major in majors" :key="major.id" :value="major.id">{{ major.code }} - {{ major.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilihan 2</label>
                <select v-model="form.second_major_id" class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                  <option value="">-</option>
                  <option v-for="major in majors" :key="major.id" :value="major.id">{{ major.code }} - {{ major.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilihan 3</label>
                <select v-model="form.third_major_id" class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                  <option value="">-</option>
                  <option v-for="major in majors" :key="major.id" :value="major.id">{{ major.code }} - {{ major.name }}</option>
                </select>
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select v-model="form.status" class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                  <option v-for="item in statusOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jurusan Diterima</label>
                <select v-model="form.accepted_major_id" class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                  <option value="">-</option>
                  <option v-for="major in majors" :key="major.id" :value="major.id">{{ major.code }} - {{ major.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
                <input v-model="form.birth_date" type="date" class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <input v-model="form.birth_place" placeholder="Tempat lahir" class="rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              <input v-model="form.origin_school" placeholder="Asal sekolah" class="rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              <input v-model="form.nisn" placeholder="NISN" class="rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              <input v-model="form.parent_name" placeholder="Nama orang tua/wali" class="rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              <input v-model="form.email" type="email" placeholder="Email" class="rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              <select v-model="form.gender" class="rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                <option value="">Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <textarea v-model="form.address" rows="2" placeholder="Alamat" class="w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"></textarea>
            <textarea v-model="form.notes" rows="2" placeholder="Catatan admin" class="w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"></textarea>
            <textarea v-model="form.revision_note" rows="2" placeholder="Catatan revisi untuk pendaftar" class="w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"></textarea>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeApplicantModal" class="rounded-md border px-4 py-2 dark:border-gray-600 dark:text-white">Batal</button>
              <button type="submit" :disabled="isSaving" class="rounded-md bg-sky-600 px-4 py-2 text-white disabled:opacity-60">{{ isSaving ? "Menyimpan..." : "Simpan" }}</button>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="convertTarget" class="fixed inset-0 z-[260] flex items-center justify-center bg-black/50 px-4">
        <div class="w-full max-w-md rounded-lg border bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div class="border-b px-6 py-4 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Jadikan Siswa</h2>
            <p class="text-sm text-slate-500">{{ convertTarget.full_name }}</p>
          </div>
          <div class="space-y-4 p-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kelas Awal</label>
              <select v-model="convertClassId" class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                <option value="" disabled>Pilih kelas awal</option>
                <option v-for="item in availableConvertClasses" :key="item.id" :value="item.id">{{ item.class_name }}</option>
              </select>
              <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Kelas yang tampil hanya kelas dari jurusan diterima atau jurusan pilihan pendaftar, dan hanya dari level kelas terendah.
              </p>
            </div>
            <div class="flex justify-end gap-3">
              <button @click="convertTarget = null" class="rounded-md border px-4 py-2 dark:border-gray-600 dark:text-white">Batal</button>
              <button @click="convertApplicant" :disabled="isConverting" class="rounded-md bg-indigo-600 px-4 py-2 text-white disabled:opacity-60">{{ isConverting ? "Memproses..." : "Buat Akun Siswa" }}</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { getStoredUser } from "@/utils/auth";

const statusOptions = [
  { value: "SUBMITTED", label: "Terkirim" },
  { value: "VERIFIED", label: "Terverifikasi" },
  { value: "NEED_REVISION", label: "Perlu Revisi" },
  { value: "TEST_SCHEDULED", label: "Jadwal Tes" },
  { value: "INTERVIEW", label: "Wawancara" },
  { value: "ACCEPTED", label: "Diterima" },
  { value: "ACCEPTED_OTHER_MAJOR", label: "Diterima Jurusan Lain" },
  { value: "REJECTED", label: "Ditolak" },
  { value: "RE_REGISTERED", label: "Daftar Ulang" },
  { value: "CONVERTED_TO_STUDENT", label: "Menjadi Siswa" },
];

const applicants = ref([]);
const majors = ref([]);
const classes = ref([]);
const overview = ref({});
const showApplicantModal = ref(false);
const editingApplicantId = ref(null);
const isSaving = ref(false);
const isConverting = ref(false);
const convertTarget = ref(null);
const convertClassId = ref("");
const filters = reactive({ q: "", status: "", major_id: "" });
const form = reactive(baseForm());

function baseForm() {
  return {
    full_name: "",
    phone_number: "",
    birth_place: "",
    birth_date: "",
    gender: "",
    nisn: "",
    origin_school: "",
    parent_name: "",
    email: "",
    address: "",
    first_major_id: "",
    second_major_id: "",
    third_major_id: "",
    accepted_major_id: "",
    status: "SUBMITTED",
    notes: "",
    revision_note: "",
  };
}

const cards = computed(() => {
  const totals = overview.value?.totals || {};
  return [
    { label: "Pendaftar", value: Number(totals.applicants || applicants.value.length), caption: "Total masuk", class: "bg-sky-600" },
    { label: "Jurusan", value: Number(totals.majors || majors.value.length), caption: "Aktif", class: "bg-cyan-700" },
    { label: "Diterima", value: Number(totals.accepted || 0), caption: "Menunggu konversi", class: "bg-emerald-600" },
    { label: "Menjadi Siswa", value: Number(totals.converted || 0), caption: "Akun dibuat", class: "bg-indigo-600" },
  ];
});

const convertTargetMajorIds = computed(() => {
  const target = convertTarget.value;
  if (!target) return [];

  const acceptedMajorID = Number(target.accepted_major_id || 0);
  if (acceptedMajorID > 0) {
    return [acceptedMajorID];
  }

  return [target.first_major_id, target.second_major_id, target.third_major_id]
    .map((value) => Number(value || 0))
    .filter((value, index, list) => value > 0 && list.indexOf(value) === index);
});

const availableConvertClasses = computed(() => {
  const majorIDs = new Set(convertTargetMajorIds.value.map(String));
  const items = Array.isArray(classes.value) ? classes.value : [];

  const classesByMajor = majorIDs.size > 0
    ? items.filter((item) => majorIDs.has(String(item?.major_id || "")))
    : items;

  if (classesByMajor.length === 0) {
    return [];
  }

  const lowestOrder = classesByMajor.reduce((current, item) => {
    const order = Number(item?.class_level_order || 0);
    if (order <= 0) return current;
    if (current === null || order < current) return order;
    return current;
  }, null);

  return classesByMajor
    .filter((item) => {
      if (lowestOrder == null) return true;
      return Number(item?.class_level_order || 0) === lowestOrder;
    })
    .slice()
    .sort((a, b) => String(a?.class_name || "").localeCompare(String(b?.class_name || "")));
});

const loadOverview = async () => {
  const response = await api.get("/spmb/overview");
  overview.value = response?.data || {};
};

const loadApplicants = async () => {
  const response = await api.get("/spmb/applicants", { params: filters });
  applicants.value = Array.isArray(response?.data) ? response.data : [];
};

const loadMajors = async () => {
  const response = await api.get("/majors");
  majors.value = Array.isArray(response?.data) ? response.data : [];
};

const loadClasses = async () => {
  const response = await api.get("/class");
  classes.value = Array.isArray(response?.data) ? response.data : [];
};

const loadData = async () => {
  await Promise.all([loadOverview(), loadApplicants(), loadMajors(), loadClasses()]);
};

const normalizeId = (value) => (value === "" || value == null ? null : Number(value));
const dateValue = (value) => (value ? String(value).slice(0, 10) : "");

const openApplicantModal = (item = null) => {
  editingApplicantId.value = item?.id || null;
  Object.assign(form, baseForm(), item ? {
    ...item,
    birth_date: dateValue(item.birth_date),
    first_major_id: item.first_major_id || "",
    second_major_id: item.second_major_id || "",
    third_major_id: item.third_major_id || "",
    accepted_major_id: item.accepted_major_id || "",
  } : {});
  showApplicantModal.value = true;
};

const closeApplicantModal = () => {
  if (isSaving.value) return;
  showApplicantModal.value = false;
};

const saveApplicant = async () => {
  isSaving.value = true;
  try {
    const payload = {
      ...form,
      first_major_id: normalizeId(form.first_major_id),
      second_major_id: normalizeId(form.second_major_id),
      third_major_id: normalizeId(form.third_major_id),
      accepted_major_id: normalizeId(form.accepted_major_id),
    };
    const response = editingApplicantId.value
      ? await api.put(`/spmb/applicants/${editingApplicantId.value}`, payload)
      : await api.post("/spmb/applicants", payload);
    pushToast({ title: "Pendaftar Disimpan", message: response?.message || "Data SPMB berhasil disimpan.", type: "success" });
    showApplicantModal.value = false;
    await loadData();
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan Pendaftar", message: error.message, type: "error" });
  } finally {
    isSaving.value = false;
  }
};

const sendLink = async (item) => {
  try {
    const response = await api.post(`/spmb/applicants/${item.id}/send-link`, {});
    pushToast({ title: "Link Dikirim", message: response?.message || "Link status berhasil dikirim.", type: "success" });
    await loadApplicants();
  } catch (error) {
    pushToast({ title: "Gagal Kirim Link", message: error.message, type: "error" });
  }
};

const openConvertModal = (item) => {
  convertTarget.value = item;
  convertClassId.value = "";
};

watch(
  availableConvertClasses,
  (items) => {
    const allowedIDs = new Set(items.map((item) => String(item.id)));
    if (!allowedIDs.has(String(convertClassId.value || ""))) {
      convertClassId.value = items[0]?.id || "";
    }
  },
  { immediate: true },
);

const convertApplicant = async () => {
  if (!convertTarget.value?.id) return;
  if (!convertClassId.value) {
    pushToast({ title: "Kelas Awal Wajib Diisi", message: "Pilih kelas level terendah yang sesuai jurusan pendaftar.", type: "error" });
    return;
  }
  isConverting.value = true;
  try {
    const response = await api.post(`/spmb/applicants/${convertTarget.value.id}/convert`, {
      class_id: normalizeId(convertClassId.value),
    });
    pushToast({
      title: "Akun Siswa Dibuat",
      message: `Username: ${response?.data?.username || "-"} Password: ${response?.data?.password || "-"}`,
      type: "success",
    });
    convertTarget.value = null;
    await loadData();
  } catch (error) {
    pushToast({ title: "Gagal Membuat Siswa", message: error.message, type: "error" });
  } finally {
    isConverting.value = false;
  }
};

const statusLabel = (status) => statusOptions.find((item) => item.value === status)?.label || status || "-";
const statusClass = (status) => {
  if (["ACCEPTED", "ACCEPTED_OTHER_MAJOR", "RE_REGISTERED", "CONVERTED_TO_STUDENT"].includes(status)) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  if (["REJECTED", "NEED_REVISION"].includes(status)) return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
  if (["TEST_SCHEDULED", "INTERVIEW"].includes(status)) return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
};

const majorText = (item, prefix) => {
  const code = item?.[`${prefix}_major_code`];
  const name = item?.[`${prefix}_major_name`];
  if (!code && !name) return "";
  return [code, name].filter(Boolean).join(" - ");
};

const copyPublicLink = async () => {
  const schoolId = getStoredUser()?.school_id;
  const link = `${window.location.origin}/spmb/register?school_id=${schoolId || ""}`;
  await navigator.clipboard?.writeText(link);
  pushToast({ title: "Link Form Disalin", message: link, type: "success" });
};

onMounted(loadData);
</script>
