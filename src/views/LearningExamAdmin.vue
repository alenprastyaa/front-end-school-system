<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-[1440px] space-y-6">
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Ujian Resmi</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Admin membuat permintaan ujian ke guru mapel. Guru memilih soal dan menyerahkan paket ujian kembali. Setelah itu admin menerbitkan ke siswa.
        </p>
      </section>

      <div class="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                {{ editingAssignmentId ? "Edit Task Ujian" : "Buat Task Ujian ke Guru Mapel" }}
              </h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{ editingAssignmentId
                  ? "Perbarui detail task ujian sebelum diterbitkan ke siswa."
                  : "Admin hanya menentukan mapel, jadwal, kode, dan jenis ujian." }}
              </p>
            </div>
            <button v-if="editingAssignmentId" @click="cancelEditing"
              class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Batal Edit
            </button>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Mapel Target</label>
              <select v-model="form.subject_id"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                <option value="">-- Pilih mapel --</option>
                <option v-for="item in subjects" :key="item.id" :value="String(item.id)">
                  {{ item.name }} - {{ item.class_name }} - {{ item.teacher_name }}
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori Ujian</label>
              <select v-model="form.exam_category"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                <option value="UTS">UTS</option>
                <option value="UAS">UAS</option>
                <option value="UJIAN_SEKOLAH">Ujian Sekolah</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe Soal</label>
              <select v-model="form.assignment_type"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50">
                <option value="MCQ">Pilihan Ganda</option>
                <option value="ESSAY">Essay</option>
              </select>
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Ujian</label>
              <input v-model="form.title" placeholder="Contoh: UAS Matematika Semester Genap"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Kode Ujian</label>
              <input v-model="form.exam_code" placeholder="Contoh: MTK-UAS-01"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 uppercase text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Mulai Ujian</label>
              <input v-model="form.start_at" type="datetime-local"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Selesai / Tenggat</label>
              <input v-model="form.due_date" type="datetime-local"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Durasi Sesi Ujian (menit)</label>
              <input v-model="form.question_duration_minutes" type="number" min="1" max="180"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Jumlah Soal</label>
              <input v-model="form.exam_target_question_count" type="number" min="1" max="200"
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Catatan untuk Guru</label>
              <textarea v-model="form.description" rows="3" placeholder="Instruksi tambahan untuk guru penyusun soal..."
                class="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-800/50 dark:text-white dark:ring-slate-700/50" />
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="submitExamRequestForm" :disabled="isSubmitting"
              class="rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-50">
              {{ isSubmitting ? "Menyimpan..." : editingAssignmentId ? "Simpan Perubahan" : "Kirim Task ke Guru" }}
            </button>
          </div>
        </section>

        <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Pipeline Ujian</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Pantau task yang belum dikerjakan guru, paket yang sudah masuk, dan ujian yang sudah terbit.</p>
            </div>
            <button @click="loadExamAssignments"
              class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Refresh
            </button>
          </div>

          <div class="mt-4 space-y-4">
            <article v-for="item in examAssignments" :key="item.id"
              class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/20">
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
                  :class="statusBadgeClass(item.exam_status)">
                  {{ examStatusLabel(item.exam_status) }}
                </span>
                <span class="inline-flex rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20">
                  {{ examCategoryLabel(item.exam_category) }}
                </span>
                <span class="inline-flex rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">
                  Kode: {{ item.exam_code }}
                </span>
              </div>

              <h3 class="mt-3 text-base font-bold text-slate-900 dark:text-white">{{ item.title }}</h3>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{ item.subject_name || "-" }} • {{ item.class_name || "-" }} • Guru: {{ item.teacher_name || "-" }}
              </p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ item.description || "Tanpa catatan tambahan." }}</p>

              <div class="mt-3 grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                <p>Mulai: {{ formatDateTime(item.start_at) }}</p>
                <p>Selesai: {{ formatDateTime(item.due_date) }}</p>
                <p>Durasi sesi: {{ formatDurationMinutes(item.question_duration_seconds) }}</p>
                <p>Target soal guru: {{ item.exam_target_question_count || 0 }} soal</p>
                <p v-if="item.exam_submitted_at">Paket guru masuk: {{ formatDateTime(item.exam_submitted_at) }}</p>
                <p v-if="item.exam_published_at">Diterbitkan: {{ formatDateTime(item.exam_published_at) }}</p>
              </div>

              <div class="mt-4 flex flex-wrap justify-end gap-3">
                <button v-if="item.exam_status !== 'PUBLISHED'" @click="startEditing(item)"
                  class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                  Edit
                </button>
                <button v-if="item.exam_status !== 'PUBLISHED'" @click="handleDeleteExam(item)"
                  class="rounded-xl px-4 py-2 text-sm font-semibold transition"
                  :class="pendingDeleteId === item.id
                    ? 'bg-rose-600 text-white hover:bg-rose-500'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20'">
                  {{ pendingDeleteId === item.id ? "Klik Lagi untuk Hapus" : "Hapus" }}
                </button>
                <button v-if="item.exam_status === 'SUBMITTED'" @click="publishExam(item)"
                  class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">
                  Terbitkan ke Siswa
                </button>
              </div>
            </article>

            <div v-if="examAssignments.length === 0"
              class="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center text-sm text-slate-500 dark:border-slate-700">
              Belum ada task ujian resmi.
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { formatDateTime } from "@/utils/date";
import { useMasterDataStore } from "@/store/masterData";

const subjects = ref([]);
const masterDataStore = useMasterDataStore();
const examAssignments = ref([]);
const message = ref("");
const isError = ref(false);
const isSubmitting = ref(false);
const editingAssignmentId = ref(null);
const pendingDeleteId = ref(null);

const form = reactive({
  subject_id: "",
  exam_category: "UTS",
  assignment_type: "MCQ",
  title: "",
  exam_code: "",
  start_at: "",
  due_date: "",
  question_duration_minutes: 60,
  exam_target_question_count: 20,
  description: "",
});

const formatDurationMinutes = (value) => {
  const totalSeconds = Number(value || 0);
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "-";
  const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${totalMinutes} menit`;
};

const toDateTimeLocalValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (item) => String(item).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const examCategoryLabel = (type) => {
  if (type === "UTS") return "UTS";
  if (type === "UAS") return "UAS";
  if (type === "UJIAN_SEKOLAH") return "Ujian Sekolah";
  if (type === "CUSTOM") return "Custom";
  return "Ujian";
};

const examStatusLabel = (status) => {
  if (status === "REQUESTED") return "Menunggu Guru";
  if (status === "SUBMITTED") return "Siap Tinjau";
  if (status === "PUBLISHED") return "Terbit";
  return status || "-";
};

const statusBadgeClass = (status) => {
  if (status === "REQUESTED") return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20";
  if (status === "SUBMITTED") return "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20";
  if (status === "PUBLISHED") return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20";
  return "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
};

const resetForm = () => {
  form.subject_id = "";
  form.exam_category = "UTS";
  form.assignment_type = "MCQ";
  form.title = "";
  form.exam_code = "";
  form.start_at = "";
  form.due_date = "";
  form.question_duration_minutes = 60;
  form.exam_target_question_count = 20;
  form.description = "";
};

const fillFormFromAssignment = (assignment) => {
  form.subject_id = String(assignment.subject_id || "");
  form.exam_category = assignment.exam_category || "UTS";
  form.assignment_type = assignment.assignment_type || "MCQ";
  form.title = assignment.title || "";
  form.exam_code = assignment.exam_code || "";
  form.start_at = toDateTimeLocalValue(assignment.start_at);
  form.due_date = toDateTimeLocalValue(assignment.due_date);
  form.question_duration_minutes = Math.max(1, Math.round(Number(assignment.question_duration_seconds || 0) / 60) || 60);
  form.exam_target_question_count = Math.max(1, Number(assignment.exam_target_question_count || 20));
  form.description = assignment.description || "";
};

const cancelEditing = () => {
  editingAssignmentId.value = null;
  pendingDeleteId.value = null;
  resetForm();
};

const startEditing = (assignment) => {
  editingAssignmentId.value = assignment.id;
  pendingDeleteId.value = null;
  fillFormFromAssignment(assignment);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const loadSubjects = async () => {
  subjects.value = await masterDataStore.getAdminSubjects();
};

const loadExamAssignments = async () => {
  const subjectResponses = await Promise.all(
    subjects.value.map(async (subject) => {
      const response = await api.get(`/learning/subjects/${subject.id}/assignments`);
      return (response?.data || []).map((assignment) => ({
        ...assignment,
        subject_name: subject.name,
        class_name: subject.class_name,
        teacher_name: subject.teacher_name,
      }));
    }),
  );

  examAssignments.value = subjectResponses
    .flat()
    .filter((item) => item.is_exam)
    .sort((left, right) => new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime());
};

const createExamRequest = async () => {
  isSubmitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const formData = new FormData();
    formData.append("subject_id", form.subject_id);
    formData.append("title", form.title);
    formData.append("description", form.description || "");
    formData.append("due_date", form.due_date);
    formData.append("assignment_type", form.assignment_type);
    formData.append("is_exam", "true");
    formData.append("exam_category", form.exam_category);
    formData.append("exam_code", form.exam_code);
    formData.append("start_at", form.start_at);
    formData.append("question_duration_seconds", String((Number(form.question_duration_minutes) || 0) * 60));
    formData.append("exam_target_question_count", String(Number(form.exam_target_question_count) || 0));

    const response = await api.post("/learning/assignments", formData);
    message.value = response?.message || "Task ujian berhasil dikirim ke guru";
    pushToast({
      title: "Task Ujian Terkirim",
      message: response?.message || "Task ujian berhasil dikirim ke guru.",
      type: "success",
    });
    resetForm();
    await loadExamAssignments();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Gagal Membuat Task Ujian",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const updateExamRequest = async () => {
  if (!editingAssignmentId.value) {
    return;
  }

  isSubmitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const formData = new FormData();
    formData.append("subject_id", form.subject_id);
    formData.append("title", form.title);
    formData.append("description", form.description || "");
    formData.append("due_date", form.due_date);
    formData.append("assignment_type", form.assignment_type);
    formData.append("exam_category", form.exam_category);
    formData.append("exam_code", form.exam_code);
    formData.append("start_at", form.start_at);
    formData.append("question_duration_seconds", String((Number(form.question_duration_minutes) || 0) * 60));
    formData.append("exam_target_question_count", String(Number(form.exam_target_question_count) || 0));

    const response = await api.put(`/learning/assignments/${editingAssignmentId.value}/exam-admin`, formData);
    message.value = response?.message || "Task ujian berhasil diperbarui";
    pushToast({
      title: "Task Ujian Diperbarui",
      message: response?.message || "Perubahan task ujian berhasil disimpan.",
      type: "success",
    });
    cancelEditing();
    await loadExamAssignments();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Gagal Memperbarui Task",
      message: error.message,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const submitExamRequestForm = async () => {
  if (editingAssignmentId.value) {
    await updateExamRequest();
    return;
  }

  await createExamRequest();
};

const publishExam = async (assignment) => {
  try {
    const response = await api.post(`/learning/assignments/${assignment.id}/publish`);
    isError.value = false;
    message.value = response?.message || "Ujian berhasil diterbitkan";
    pushToast({
      title: "Ujian Diterbitkan",
      message: response?.message || "Ujian resmi berhasil diterbitkan ke siswa.",
      type: "success",
    });
    await loadExamAssignments();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Gagal Menerbitkan Ujian",
      message: error.message,
      type: "error",
    });
  }
};

const handleDeleteExam = async (assignment) => {
  if (pendingDeleteId.value !== assignment.id) {
    pendingDeleteId.value = assignment.id;
    pushToast({
      title: "Konfirmasi Hapus",
      message: `Klik sekali lagi pada tombol hapus untuk menghapus task "${assignment.title}".`,
      type: "info",
      duration: 2600,
    });
    window.setTimeout(() => {
      if (pendingDeleteId.value === assignment.id) {
        pendingDeleteId.value = null;
      }
    }, 2600);
    return;
  }

  try {
    const response = await api.delete(`/learning/assignments/${assignment.id}/exam-admin`);
    pendingDeleteId.value = null;
    isError.value = false;
    message.value = response?.message || "Task ujian berhasil dihapus";
    pushToast({
      title: "Task Ujian Dihapus",
      message: response?.message || "Task ujian resmi berhasil dihapus.",
      type: "success",
    });

    if (editingAssignmentId.value === assignment.id) {
      cancelEditing();
    }

    await loadExamAssignments();
  } catch (error) {
    pendingDeleteId.value = null;
    isError.value = true;
    message.value = error.message;
    pushToast({
      title: "Gagal Menghapus Task",
      message: error.message,
      type: "error",
    });
  }
};

onMounted(async () => {
  try {
    await loadSubjects();
    await loadExamAssignments();
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  }
});

watch(message, (value) => {
  if (!value) return;
  pushToast({
    title: isError.value ? "Manajemen Ujian Gagal" : "Manajemen Ujian Berhasil",
    message: value,
    type: isError.value ? "error" : "success",
  });
});
</script>
