<template>
  <div class="p-6 space-y-6">
    <section class="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Jurusan</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Master program keahlian untuk kelas dan SPMB.</p>
        </div>
        <div class="flex gap-2">
          <button @click="loadMajors" class="h-10 rounded-lg border px-4 text-sm font-medium dark:border-gray-600 dark:text-white">Refresh</button>
          <button @click="openModal()" class="h-10 rounded-lg bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-500">Tambah Jurusan</button>
        </div>
      </div>
    </section>

    <section class="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b text-left text-slate-500 dark:border-gray-700 dark:text-slate-400">
              <th class="py-3 pr-4 font-medium">Kode</th>
              <th class="py-3 pr-4 font-medium">Nama Jurusan</th>
              <th class="py-3 pr-4 font-medium">Kuota</th>
              <th class="py-3 pr-4 font-medium">Status</th>
              <th class="py-3 pr-0 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in majors" :key="item.id" class="border-b text-slate-800 dark:border-gray-700 dark:text-slate-200">
              <td class="py-3 pr-4 font-semibold">{{ item.code }}</td>
              <td class="py-3 pr-4">{{ item.name }}</td>
              <td class="py-3 pr-4">{{ item.quota ?? "-" }}</td>
              <td class="py-3 pr-4">
                <span class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="item.is_active !== false ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                  {{ item.is_active !== false ? "Aktif" : "Nonaktif" }}
                </span>
              </td>
              <td class="py-3 pr-0">
                <div class="flex justify-end gap-2">
                  <button @click="openModal(item)" class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">Edit</button>
                  <button @click="deleteMajor(item)" class="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="majors.length === 0">
              <td colspan="5" class="py-10 text-center text-slate-500">Belum ada jurusan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[260] flex items-center justify-center bg-black/50 px-4">
        <div class="w-full max-w-lg rounded-lg border bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ editingId ? "Edit Jurusan" : "Tambah Jurusan" }}</h2>
            <button @click="closeModal" class="text-2xl leading-none text-gray-500">&times;</button>
          </div>
          <form @submit.prevent="saveMajor" class="space-y-4 p-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Jurusan</label>
              <input v-model="form.name" required class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode</label>
                <input v-model="form.code" required class="mt-1 w-full rounded-md border px-3 py-2 uppercase dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kuota SPMB</label>
                <input v-model.number="form.quota" type="number" min="0" class="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
              </div>
            </div>
            <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <input v-model="form.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-sky-600" />
              Aktif
            </label>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeModal" class="rounded-md border px-4 py-2 dark:border-gray-600 dark:text-white">Batal</button>
              <button type="submit" :disabled="isSaving" class="rounded-md bg-sky-600 px-4 py-2 text-white disabled:opacity-60">
                {{ isSaving ? "Menyimpan..." : "Simpan" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { pushToast } from "@/composables/useToast";
import { useMajorStore } from "@/store/majors";

const majorStore = useMajorStore();
const { majors, showModal, editingId, isSaving, form } = storeToRefs(majorStore);

const loadMajors = () => majorStore.loadMajors();
const openModal = (item = null) => majorStore.openModal(item);
const closeModal = () => majorStore.closeModal();
const saveMajor = async () => {
  try {
    const response = await majorStore.saveMajor();
    pushToast({ title: "Jurusan Disimpan", message: response?.message || "Data jurusan berhasil disimpan.", type: "success" });
  } catch {
    // error toast handled in store
  }
};

const deleteMajor = async (item) => {
  if (!window.confirm(`Hapus jurusan ${item.code}?`)) return;
  try {
    const response = await majorStore.deleteMajor(item);
    pushToast({ title: "Jurusan Dihapus", message: response?.message || "Jurusan berhasil dihapus.", type: "success" });
  } catch {
    // error toast handled in store
  }
};

onMounted(loadMajors);
</script>
