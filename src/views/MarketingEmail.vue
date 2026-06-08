<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto max-w-7xl space-y-6">
      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Super Admin</p>
            <h1 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Kirim Email Penawaran</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Kirim penawaran ke banyak sekolah melalui Brevo. Subject dan isi email memakai nama sekolah sebagai placeholder dinamis.
            </p>
          </div>
          <button
            type="button"
            @click="resetForm"
            :disabled="isSending"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Icon icon="mdi:refresh" class="h-4 w-4" />
            Reset
          </button>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
        <form @submit.prevent="sendEmails" class="space-y-6">
          <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
            <div class="flex items-center justify-between gap-4">
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Template Email</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Gunakan placeholder untuk personalisasi otomatis.</p>
              </div>
              <button
                type="button"
                @click="useDefaultTemplate"
                :disabled="isSending"
                class="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:opacity-50 dark:bg-sky-500/10 dark:text-sky-200"
              >
                <Icon icon="mdi:file-document-edit-outline" class="h-4 w-4" />
                Template
              </button>
            </div>

            <div class="mt-5 space-y-4">
              <div class="grid gap-4">
                <label class="block">
                  <span class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Reply-To</span>
                  <input
                    v-model.trim="form.reply_to"
                    type="email"
                    placeholder="opsional@domain.com"
                    class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                  />
                </label>
              </div>

              <label class="block">
                <span class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</span>
                <input
                  v-model.trim="form.subject"
                  type="text"
                  required
                  placeholder="Penawaran Demo Learning Management System untuk {{school_name}}"
                  class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                />
              </label>

              <label class="block">
                <span class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Isi Email</span>
                <textarea
                  v-model="form.body"
                  rows="12"
                  required
                  placeholder="Yth. Bapak/Ibu Pimpinan..."
                  class="block w-full resize-y rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                ></textarea>
              </label>

              <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <input v-model="form.send_as_html" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                Kirim sebagai template HTML modern
              </label>

              <div v-pre class="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700">
                Placeholder dinamis: <code>{{school_name}}</code>.
              </div>
            </div>
          </section>

          <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Penerima</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ validRecipientCount }} email siap dikirim.</p>
              </div>
              <button
                type="button"
                @click="addRecipient"
                :disabled="isSending"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
              >
                <Icon icon="mdi:plus" class="h-4 w-4" />
                Tambah
              </button>
            </div>

            <div class="mt-5 space-y-3">
              <div
                v-for="(recipient, index) in recipients"
                :key="recipient.id"
                class="grid gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 md:grid-cols-[1fr,1.2fr,auto] dark:bg-slate-800/60 dark:ring-slate-700"
              >
                <input v-model.trim="recipient.school_name" type="text" placeholder="Nama sekolah" class="rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700" />
                <input v-model.trim="recipient.email" type="email" placeholder="email@sekolah.sch.id" class="rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-slate-700" />
                <button
                  type="button"
                  @click="removeRecipient(index)"
                  :disabled="isSending || recipients.length === 1"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-40 dark:bg-rose-500/10 dark:text-rose-200"
                  title="Hapus penerima"
                  aria-label="Hapus penerima"
                >
                  <Icon icon="mdi:trash-can-outline" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="mt-5">
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Bulk tambah penerima</label>
              <textarea
                v-model="bulkInput"
                rows="5"
                placeholder="Satu baris satu penerima: Nama Sekolah, email@domain.com"
                class="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-sky-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
              ></textarea>
              <button
                type="button"
                @click="applyBulkInput"
                :disabled="isSending || !bulkInput.trim()"
                class="mt-3 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 disabled:opacity-50"
              >
                <Icon icon="mdi:playlist-plus" class="h-4 w-4" />
                Masukkan ke Daftar
              </button>
            </div>

            <button
              type="submit"
              :disabled="isSending || validRecipientCount === 0"
              class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              <Icon :icon="isSending ? 'mdi:loading' : 'mdi:send'" class="h-5 w-5" :class="{ 'animate-spin': isSending }" />
              {{ isSending ? "Mengirim..." : `Kirim ke ${validRecipientCount} Email` }}
            </button>
          </section>
        </form>

        <aside class="space-y-6">
          <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Preview Penerima Pertama</h2>
            <div class="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Subject</p>
              <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">{{ previewSubject || "-" }}</p>
              <p class="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Body</p>
              <div
                v-if="form.send_as_html"
                class="mt-2 max-h-[680px] overflow-auto rounded-xl bg-white ring-1 ring-slate-200 dark:bg-white dark:ring-slate-700"
              >
                <iframe
                  title="Preview body email"
                  :srcdoc="previewBody"
                  class="h-[640px] w-full border-0"
                  sandbox=""
                ></iframe>
              </div>
              <pre v-else class="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-200">{{ previewBody || "-" }}</pre>
            </div>
          </section>

          <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Hasil Pengiriman</h2>
            <div v-if="sendSummary" class="mt-4 grid gap-3 sm:grid-cols-3">
              <article class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
                <p class="mt-2 text-2xl font-black">{{ sendSummary.total_recipients || 0 }}</p>
              </article>
              <article class="rounded-2xl bg-emerald-50 p-4 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
                <p class="text-xs font-semibold uppercase tracking-[0.18em]">Sukses</p>
                <p class="mt-2 text-2xl font-black">{{ sendSummary.success_count || 0 }}</p>
              </article>
              <article class="rounded-2xl bg-rose-50 p-4 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20">
                <p class="text-xs font-semibold uppercase tracking-[0.18em]">Gagal</p>
                <p class="mt-2 text-2xl font-black">{{ sendSummary.failed_count || 0 }}</p>
              </article>
            </div>

            <div class="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th class="px-4 py-3 font-medium">Penerima</th>
                    <th class="px-4 py-3 font-medium">Status</th>
                    <th class="px-4 py-3 font-medium">Catatan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="item in sendResults" :key="`${item.email}-${item.error || 'ok'}`">
                    <td class="px-4 py-3">
                      <div class="font-semibold text-slate-900 dark:text-white">{{ item.school_name || item.email }}</div>
                      <div class="text-xs text-slate-500">{{ item.email }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <span class="rounded-full px-2.5 py-1 text-xs font-bold" :class="item.success ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200'">
                        {{ item.success ? "Terkirim" : "Gagal" }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-slate-500 dark:text-slate-300">{{ item.error || "-" }}</td>
                  </tr>
                  <tr v-if="sendResults.length === 0">
                    <td colspan="3" class="px-4 py-10 text-center text-slate-500">Belum ada pengiriman.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </aside>
      </section>
    </main>

    <Teleport to="body">
      <transition name="fade-scale">
        <div
          v-if="showSendConfirmModal"
          class="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          @click.self="closeSendConfirmModal"
        >
          <section class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
            <div class="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
              <div class="flex items-start gap-3">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <Icon icon="mdi:email-fast-outline" class="h-6 w-6" />
                </div>
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Konfirmasi Pengiriman</p>
                  <h2 class="mt-1 text-lg font-black text-slate-900 dark:text-white">Kirim email penawaran?</h2>
                  <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Sistem akan mengirim template ini ke {{ validRecipientCount }} email penerima.
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-3 px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
              <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/70 dark:ring-slate-700">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Preview Penerima Pertama</p>
                <p class="mt-2 font-bold text-slate-900 dark:text-white">{{ previewRecipient.school_name || "Nama Sekolah" }}</p>
                <p class="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">{{ previewRecipient.email || "email@sekolah.sch.id" }}</p>
              </div>
              <p>
                Pastikan nama sekolah dan alamat email sudah benar sebelum melanjutkan.
              </p>
            </div>

            <div class="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end dark:border-slate-800">
              <button
                type="button"
                @click="closeSendConfirmModal"
                :disabled="isSending"
                class="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                @click="confirmSendEmails"
                :disabled="isSending"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                <Icon :icon="isSending ? 'mdi:loading' : 'mdi:send'" class="h-4 w-4" :class="{ 'animate-spin': isSending }" />
                {{ isSending ? "Mengirim..." : "Ya, Kirim" }}
              </button>
            </div>
          </section>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";

let recipientId = 1;

const DEFAULT_SUBJECT = "Demo LMS Modern untuk {{school_name}}";
const DEFAULT_BODY = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Demo LMS Modern untuk {{school_name}}</title>
  </head>
  <body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;color:#f4f7fb;">
      LMS modern untuk pembelajaran, CBT anti curang, presensi wajah, laporan orang tua, dan AI Assistant.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 18px 44px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:#0f172a;padding:30px 32px;color:#ffffff;">
                <div style="font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#38bdf8;">Bitwize Digital Platform</div>
                <h1 style="margin:14px 0 8px;font-size:28px;line-height:1.22;font-weight:800;">LMS modern untuk {{school_name}}</h1>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#cbd5e1;">Kelola pembelajaran, ujian, presensi, dan laporan sekolah dalam satu platform digital yang mudah digunakan.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 32px;">
                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#334155;">Yth. Bapak/Ibu Pimpinan<br><strong>{{school_name}}</strong></p>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#334155;">Perkenalkan, saya <strong>Alen Prastya</strong>, Founder dari <strong>Bitwize Digital Platform</strong>. Kami mengembangkan Learning Management System (LMS) untuk membantu sekolah mengelola kegiatan pembelajaran secara digital, terintegrasi, dan efisien.</p>
                <div style="margin:24px 0;padding:20px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
                  <div style="font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#0284c7;margin-bottom:14px;">Fitur Unggulan</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Manajemen materi pembelajaran</td>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Tugas dan penilaian online</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ CBT anti curang</td>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Bank soal dengan bantuan AI</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Presensi Face Recognition</td>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Laporan otomatis ke orang tua</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Kalender dan pengumuman sekolah</td>
                      <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#334155;">✓ Dashboard guru, siswa, admin</td>
                    </tr>
                  </table>
                </div>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#334155;">Sistem ini dirancang agar mudah digunakan oleh guru dan siswa, serta membantu {{school_name}} meningkatkan efektivitas proses belajar mengajar dan mempercepat transformasi digital di lingkungan pendidikan.</p>
                <div style="margin:26px 0;text-align:center;">
                  <a href="https://demo.school-system.my.id" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:14px 22px;border-radius:12px;">Coba Demo Online</a>
                </div>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#334155;">Melalui demo tersebut, Bapak/Ibu dapat melihat langsung alur manajemen pembelajaran, CBT anti curang, presensi berbasis Face Recognition, laporan orang tua, dan AI Assistant untuk membantu guru membuat materi serta soal.</p>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:#334155;">Kami juga siap menjadwalkan presentasi singkat sesuai waktu yang tersedia.</p>
                <div style="border-top:1px solid #e2e8f0;padding-top:20px;">
                  <p style="margin:0;font-size:15px;line-height:1.65;color:#334155;">Hormat kami,<br><strong>Alen Prastya</strong><br>Founder<br>Bitwize Digital Platform</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;padding:18px 32px;text-align:center;font-size:12px;line-height:1.6;color:#64748b;">
                Demo online: <a href="https://demo.school-system.my.id" style="color:#0284c7;text-decoration:none;font-weight:700;">demo.school-system.my.id</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const createRecipient = (data = {}) => ({
  id: recipientId++,
  school_name: data.school_name || "",
  email: data.email || "",
});

const form = reactive({
  reply_to: "",
  subject: DEFAULT_SUBJECT,
  body: DEFAULT_BODY,
  send_as_html: true,
});

const recipients = ref([createRecipient()]);
const bulkInput = ref("");
const isSending = ref(false);
const showSendConfirmModal = ref(false);
const sendSummary = ref(null);
const sendResults = ref([]);

const validRecipients = computed(() =>
  recipients.value
    .map((item) => ({
      school_name: String(item.school_name || "").trim(),
      email: String(item.email || "").trim(),
    }))
    .filter((item) => item.email)
);

const validRecipientCount = computed(() => validRecipients.value.length);

const previewRecipient = computed(() => validRecipients.value[0] || {
  school_name: "Nama Sekolah",
  email: "email@sekolah.sch.id",
});

const renderTemplate = (template, recipient) => {
  const values = {
    school_name: recipient.school_name || "Nama Sekolah",
  };
  return Object.entries(values).reduce((result, [key, value]) => {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    return result.replace(pattern, value);
  }, template || "");
};

const previewSubject = computed(() => renderTemplate(form.subject, previewRecipient.value));
const previewBody = computed(() => renderTemplate(form.body, previewRecipient.value));

const useDefaultTemplate = () => {
  form.subject = DEFAULT_SUBJECT;
  form.body = DEFAULT_BODY;
  form.send_as_html = true;
};

const addRecipient = () => {
  recipients.value.push(createRecipient());
};

const removeRecipient = (index) => {
  if (recipients.value.length <= 1) return;
  recipients.value.splice(index, 1);
};

const parseBulkLine = (line) => {
  const trimmed = String(line || "").trim();
  if (!trimmed) return null;

  const angleMatch = trimmed.match(/^(.*?)<([^>]+)>$/);
  if (angleMatch) {
    return createRecipient({
      school_name: angleMatch[1].trim().replace(/,$/, ""),
      email: angleMatch[2].trim(),
    });
  }

  const parts = trimmed.split(/[;,]/).map((item) => item.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return createRecipient({ school_name: parts[0], email: parts[2] });
  }
  if (parts.length === 2) {
    return createRecipient({ school_name: parts[0], email: parts[1] });
  }
  return createRecipient({ email: trimmed });
};

const applyBulkInput = () => {
  const parsed = bulkInput.value
    .split(/\n+/)
    .map(parseBulkLine)
    .filter(Boolean);

  if (parsed.length === 0) {
    return;
  }

  const currentEmptyOnly = recipients.value.length === 1 && !recipients.value[0].email && !recipients.value[0].school_name;
  recipients.value = currentEmptyOnly ? parsed : [...recipients.value, ...parsed];
  bulkInput.value = "";
};

const resetForm = () => {
  form.reply_to = "";
  form.subject = DEFAULT_SUBJECT;
  form.body = DEFAULT_BODY;
  form.send_as_html = true;
  recipients.value = [createRecipient()];
  bulkInput.value = "";
  showSendConfirmModal.value = false;
  sendSummary.value = null;
  sendResults.value = [];
};

const sendEmails = async () => {
  if (validRecipients.value.length === 0) {
    pushToast({ title: "Penerima Kosong", message: "Isi minimal satu email penerima.", type: "error" });
    return;
  }
  showSendConfirmModal.value = true;
};

const closeSendConfirmModal = () => {
  if (isSending.value) {
    return;
  }
  showSendConfirmModal.value = false;
};

const confirmSendEmails = async () => {
  if (validRecipients.value.length === 0) {
    showSendConfirmModal.value = false;
    pushToast({ title: "Penerima Kosong", message: "Isi minimal satu email penerima.", type: "error" });
    return;
  }
  isSending.value = true;
  sendSummary.value = null;
  sendResults.value = [];
  try {
    const response = await api.post("/super-admin/marketing/email-offers", {
      reply_to: form.reply_to,
      subject: form.subject,
      body: form.body,
      send_as_html: form.send_as_html,
      recipients: validRecipients.value,
    });
    sendSummary.value = response?.data || {};
    sendResults.value = Array.isArray(response?.data?.results) ? response.data.results : [];
    pushToast({
      title: "Pengiriman Diproses",
      message: `${sendSummary.value.success_count || 0} sukses, ${sendSummary.value.failed_count || 0} gagal.`,
      type: (sendSummary.value.failed_count || 0) > 0 ? "warning" : "success",
    });
    showSendConfirmModal.value = false;
  } catch (error) {
    sendResults.value = Array.isArray(error?.payload?.data?.results) ? error.payload.data.results : [];
    pushToast({
      title: "Gagal Mengirim Email",
      message: error.message || "Pengiriman email tidak berhasil.",
      type: "error",
    });
  } finally {
    isSending.value = false;
  }
};

useDefaultTemplate();
</script>
