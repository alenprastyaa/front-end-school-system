<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8 dark:bg-slate-950 dark:text-slate-100">
    <main class="mx-auto space-y-6">
      <!-- Header -->
      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Super Admin</p>
            <h1 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Kelola Paket</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Atur paket berlangganan yang tampil di landing page: nama, harga, periode, modul, badge, dan tombol CTA.
              Perubahan langsung tampil di halaman penjualan.
            </p>
          </div>
          <div class="flex gap-2">
            <button @click="loadPackages" :disabled="isLoading"
              class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              {{ isLoading ? "Memuat..." : "Refresh" }}
            </button>
            <button @click="openCreate"
              class="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500">
              <Icon icon="ph:plus" /> Tambah Paket
            </button>
          </div>
        </div>
      </section>

      <!-- Package list -->
      <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <template v-if="isLoading && !packages.length">
          <div v-for="n in 3" :key="`pkg-sk-${n}`"
            class="rounded-3xl bg-white p-6 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
            <div class="skeleton-shimmer h-5 w-24 rounded"></div>
            <div class="skeleton-shimmer mt-4 h-8 w-32 rounded"></div>
            <div class="skeleton-shimmer mt-6 h-4 w-full rounded"></div>
            <div class="skeleton-shimmer mt-2 h-4 w-3/4 rounded"></div>
          </div>
        </template>

        <article v-for="pkg in packages" :key="pkg.id"
          class="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition dark:bg-slate-900 dark:ring-white/10"
          :class="{ 'ring-2 ring-cyan-500/60': pkg.is_popular }">
          <div v-if="pkg.logo_url"
            class="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            <img :src="packageLogoUrl(pkg.logo_url)" :alt="`Logo ${pkg.name}`" class="h-full w-full object-contain p-2" />
          </div>
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-black text-slate-900 dark:text-white">{{ pkg.name }}</h3>
                <span v-if="pkg.is_popular"
                  class="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200">Populer</span>
              </div>
              <p v-if="pkg.badge_text" class="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-300">{{
                pkg.badge_text
                }}</p>
            </div>
            <span class="rounded-full px-2.5 py-1 text-[11px] font-bold" :class="pkg.is_active
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
              : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">
              {{ pkg.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>

          <div class="mt-4 flex items-end gap-2">
            <span class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{{ formatPrice(pkg.price)
              }}</span>
            <span class="pb-0.5 text-xs text-slate-400">/ {{ pkg.billing_period }}</span>
          </div>
          <p v-if="Number(pkg.original_price) > 0" class="text-xs text-slate-400 line-through">{{
            formatPrice(pkg.original_price) }}</p>
          <p v-if="pkg.tagline" class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ pkg.tagline }}</p>

          <ul class="mt-4 space-y-1.5 text-sm">
            <li v-for="(mod, idx) in pkg.modules" :key="idx" class="flex items-center gap-2"
              :class="mod.included ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 line-through'">
              <Icon :icon="mod.included ? 'ph:check-circle-fill' : 'ph:x-circle'"
                :class="mod.included ? 'text-cyan-500' : 'text-slate-400'" />
              {{ mod.label }}
            </li>
          </ul>

          <div class="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button @click="openEdit(pkg)"
              class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              <Icon icon="ph:pencil-simple" /> Edit
            </button>
            <button @click="confirmDelete(pkg)"
              class="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20">
              <Icon icon="ph:trash" /> Hapus
            </button>
            <span class="ml-auto text-[11px] text-slate-400">Urutan: {{ pkg.sort_order }}</span>
          </div>
        </article>

        <p v-if="!isLoading && !packages.length"
          class="col-span-full rounded-3xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:text-slate-400 dark:ring-white/10">
          Belum ada paket. Klik "Tambah Paket" untuk membuat paket pertama.
        </p>
      </section>
    </main>

    <!-- Modal form -->
    <div v-if="showModal"
      class="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div class="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 md:p-8">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Paket' : 'Tambah Paket' }}
          </h2>
          <button @click="closeModal"
            class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800">
            <Icon icon="ph:x" class="text-lg" />
          </button>
        </div>

        <form @submit.prevent="savePackage" class="mt-6 space-y-5">
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Nama Paket *</span>
              <input v-model="form.name" type="text" required :class="inputClass" placeholder="mis. Pro" />
            </label>
            <label class="block">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Periode Tagihan</span>
              <input v-model="form.billing_period" type="text" :class="inputClass" placeholder="bulan / tahun" />
            </label>
          </div>

          <label class="block">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Tagline</span>
            <input v-model="form.tagline" type="text" :class="inputClass" placeholder="Deskripsi singkat paket" />
          </label>

          <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <img v-if="logoPreview" :src="logoPreview" alt="Preview logo paket" class="h-full w-full object-contain p-2" />
                <Icon v-else icon="ph:image-square" class="text-2xl text-slate-400" />
              </div>
              <div class="min-w-0 flex-1">
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Logo Paket</span>
                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Logo tampil di kartu paket dan dikirim sebagai metadata checkout iPaymu.
                </p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleLogoChange" />
                  <button type="button" @click="logoInput?.click()"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                    <Icon icon="ph:upload-simple" /> Upload Logo
                  </button>
                  <button v-if="logoPreview" type="button" @click="clearLogo"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20">
                    <Icon icon="ph:trash" /> Hapus Logo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Harga (Rp) *</span>
              <input v-model.number="form.price" type="number" min="0" required :class="inputClass"
                placeholder="349000" />
            </label>
            <label class="block">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Harga Coret (opsional)</span>
              <input v-model.number="form.original_price" type="number" min="0" :class="inputClass"
                placeholder="499000" />
            </label>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Teks Badge</span>
              <input v-model="form.badge_text" type="text" :class="inputClass" placeholder="mis. Paling Populer" />
            </label>
            <label class="block">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Urutan Tampil</span>
              <input v-model.number="form.sort_order" type="number" :class="inputClass" placeholder="0" />
            </label>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Label Tombol CTA</span>
              <input v-model="form.cta_label" type="text" :class="inputClass" placeholder="Pilih Paket" />
            </label>
            <label class="block">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Link CTA (URL / WhatsApp)</span>
              <input v-model="form.cta_url" type="text" :class="inputClass" placeholder="https://wa.me/62..." />
            </label>
          </div>

          <div class="flex flex-wrap gap-6">
            <label class="flex items-center gap-2">
              <input v-model="form.is_popular" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-cyan-600" />
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Tandai sebagai Populer</span>
            </label>
            <label class="flex items-center gap-2">
              <input v-model="form.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-cyan-600" />
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Aktif (tampil di landing)</span>
            </label>
          </div>

          <!-- Modules editor -->
          <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div>
              <span class="text-sm font-bold text-slate-800 dark:text-slate-100">Modul dalam Paket</span>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Pilih dari daftar modul yang sama dengan Setting Modul Super Admin.
              </p>
            </div>

            <div class="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 dark:border-cyan-500/20 dark:bg-cyan-500/10">
              <div class="flex items-start gap-3">
                <Icon icon="ph:check-circle-fill" class="mt-0.5 shrink-0 text-lg text-cyan-600 dark:text-cyan-300" />
                <div>
                  <p class="text-sm font-black text-slate-800 dark:text-slate-100">Modul standar LMS otomatis termasuk</p>
                  <p class="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">
                    Manajemen Jurusan, Manajemen Siswa, Manajemen Kelas, dan Manajemen Mapel selalu tampil sebagai checklist di setiap paket.
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-3 grid gap-2 sm:grid-cols-2">
              <div v-for="mod in form.modules" :key="mod.label"
                class="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <Icon :icon="mod.icon || 'ph:check-circle-fill'" class="shrink-0 text-lg text-cyan-500" />
                <span class="min-w-0 flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {{ mod.label }}
                </span>
                <label
                  class="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-600 dark:text-slate-300">
                  <input v-model="mod.included" type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-cyan-600" />
                  Termasuk
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="closeModal"
              class="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              Batal
            </button>
            <button type="submit" :disabled="isSaving"
              class="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60">
              <Icon v-if="isSaving" icon="ph:spinner" class="animate-spin" />
              {{ isSaving ? 'Menyimpan...' : 'Simpan Paket' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="deleteDialog.isOpen"
      class="fixed inset-0 z-[1001] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      @keydown.esc="closeDeleteDialog">
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
          <Icon icon="ph:trash" />
        </div>
        <h2 class="mt-4 text-xl font-black text-slate-900 dark:text-white">Hapus paket?</h2>
        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Paket <b class="text-slate-900 dark:text-white">{{ deleteDialog.pkg?.name }}</b> akan dihapus dari CMS dan tidak bisa dikembalikan.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" @click="closeDeleteDialog"
            class="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            Batal
          </button>
          <button type="button" @click="deletePackage" :disabled="isDeleting"
            class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60">
            <Icon v-if="isDeleting" icon="ph:spinner" class="animate-spin" />
            {{ isDeleting ? "Menghapus..." : "Hapus Paket" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { normalizePublicUrl } from "@/utils/url";

const inputClass =
  "mt-1.5 block w-full rounded-xl border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 transition focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700";

const moduleOptions = [
  { label: "Sarpras", icon: "ph:warehouse" },
  { label: "Absensi Siswa", icon: "ph:student" },
  { label: "Absensi Guru", icon: "ph:chalkboard-teacher" },
  { label: "Koperasi", icon: "ph:storefront" },
  { label: "Chat Pribadi", icon: "ph:chat-circle-text" },
  { label: "Ujian Resmi", icon: "ph:exam" },
  { label: "Modul Ajar AI", icon: "ph:notebook" },
  { label: "Payroll", icon: "ph:money" },
  { label: "SPMB", icon: "ph:user-plus" },
  { label: "Guru Personal", icon: "ph:user-focus" },
];

const packages = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const logoInput = ref(null);
const logoFile = ref(null);
const logoPreview = ref("");
const shouldClearLogo = ref(false);
const deleteDialog = ref({
  isOpen: false,
  pkg: null,
});

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const formatPrice = (value) => currencyFormatter.format(Number(value) || 0);
const packageLogoUrl = (value) => normalizePublicUrl(value) || value || "";

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const createModuleForm = (savedModules = []) => {
  const savedByLabel = new Map(
    (Array.isArray(savedModules) ? savedModules : [])
      .filter((item) => item?.label)
      .map((item) => [normalizeText(item.label), item])
  );

  return moduleOptions.map((option) => {
    const saved = savedByLabel.get(normalizeText(option.label));
    return {
      label: option.label,
      icon: option.icon,
      included: saved ? saved.included !== false : false,
    };
  });
};

const emptyForm = () => ({
  name: "",
  tagline: "",
  price: 0,
  original_price: null,
  billing_period: "bulan",
  badge_text: "",
  is_popular: false,
  is_active: true,
  sort_order: 0,
  cta_label: "Pilih Paket",
  cta_url: "",
  logo_url: "",
  modules: createModuleForm(),
});

const form = ref(emptyForm());

const loadPackages = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/packages", { silentLoading: true });
    packages.value = response?.data?.packages || [];
  } catch (error) {
    pushToast({ title: "Gagal Memuat", message: error.message || "Tidak bisa memuat paket.", type: "error" });
  } finally {
    isLoading.value = false;
  }
};

const openCreate = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = emptyForm();
  logoFile.value = null;
  logoPreview.value = "";
  shouldClearLogo.value = false;
  showModal.value = true;
};

const openEdit = (pkg) => {
  isEditing.value = true;
  editingId.value = pkg.id;
  form.value = {
    name: pkg.name || "",
    tagline: pkg.tagline || "",
    price: Number(pkg.price) || 0,
    original_price: pkg.original_price === null ? null : Number(pkg.original_price),
    billing_period: pkg.billing_period || "bulan",
    badge_text: pkg.badge_text || "",
    is_popular: Boolean(pkg.is_popular),
    is_active: Boolean(pkg.is_active),
    sort_order: Number(pkg.sort_order) || 0,
    cta_label: pkg.cta_label || "Pilih Paket",
    cta_url: pkg.cta_url || "",
    logo_url: pkg.logo_url || "",
    modules: createModuleForm(pkg.modules),
  };
  logoFile.value = null;
  logoPreview.value = packageLogoUrl(pkg.logo_url);
  shouldClearLogo.value = false;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleLogoChange = (event) => {
  const file = event.target.files?.[0] || null;
  logoFile.value = file;
  shouldClearLogo.value = false;
  if (file) {
    logoPreview.value = URL.createObjectURL(file);
  }
};

const clearLogo = () => {
  logoFile.value = null;
  logoPreview.value = "";
  form.value.logo_url = "";
  shouldClearLogo.value = true;
  if (logoInput.value) {
    logoInput.value.value = "";
  }
};

const uploadPackageLogo = async (packageId) => {
  if (!logoFile.value || !packageId) return;
  const formData = new FormData();
  formData.append("logo", logoFile.value);
  await api.post(`/packages/${packageId}/logo`, formData, {
    silentLoading: true,
  });
};

const savePackage = async () => {
  if (!form.value.name.trim()) {
    pushToast({ title: "Validasi", message: "Nama paket wajib diisi.", type: "error" });
    return;
  }

  isSaving.value = true;
  const payload = {
    ...form.value,
    modules: form.value.modules.map((m) => ({
      label: m.label,
      icon: m.icon,
      included: Boolean(m.included),
    })),
  };

  try {
    if (isEditing.value) {
      await api.put(`/packages/${editingId.value}`, payload);
      if (shouldClearLogo.value && !logoFile.value) {
        await api.delete(`/packages/${editingId.value}/logo`, { silentLoading: true });
      }
      await uploadPackageLogo(editingId.value);
      pushToast({ title: "Tersimpan", message: "Paket berhasil diperbarui.", type: "success" });
    } else {
      const response = await api.post("/packages", payload);
      const savedPackage = response?.data?.package || response?.package;
      await uploadPackageLogo(savedPackage?.id);
      pushToast({ title: "Tersimpan", message: "Paket baru berhasil dibuat.", type: "success" });
    }
    showModal.value = false;
    await loadPackages();
  } catch (error) {
    pushToast({ title: "Gagal Menyimpan", message: error.message || "Paket gagal disimpan.", type: "error" });
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (pkg) => {
  deleteDialog.value = {
    isOpen: true,
    pkg,
  };
};

const closeDeleteDialog = () => {
  if (isDeleting.value) return;
  deleteDialog.value = {
    isOpen: false,
    pkg: null,
  };
};

const deletePackage = async () => {
  const pkg = deleteDialog.value.pkg;
  if (!pkg) return;
  isDeleting.value = true;
  try {
    const response = await api.delete(`/packages/${pkg.id}`);
    const archived = Boolean(response?.data?.archived || response?.archived);
    pushToast({
      title: archived ? "Diarsipkan" : "Dihapus",
      message: archived
        ? "Paket punya riwayat checkout, jadi dinonaktifkan dari landing."
        : "Paket berhasil dihapus.",
      type: "success",
    });
    deleteDialog.value = {
      isOpen: false,
      pkg: null,
    };
    await loadPackages();
  } catch (error) {
    pushToast({ title: "Gagal Menghapus", message: error.message || "Paket gagal dihapus.", type: "error" });
  } finally {
    isDeleting.value = false;
  }
};

onMounted(loadPackages);
</script>
