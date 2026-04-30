<template>
  <div class="p-6 space-y-6">
    <section class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Kelola Sekolah</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Endpoint yang dipakai: `POST /api/school`
      </p>
    </section>

    <section class="grid lg:grid-cols-[420px,1fr] gap-6">
      <form
        @submit.prevent="submitSchool"
        class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 space-y-4"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Sekolah</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div v-if="message" :class="messageClass" class="p-3 rounded-md text-sm">
          {{ message }}
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60"
        >
          {{ isSubmitting ? "Menyimpan..." : "Buat Sekolah" }}
        </button>
      </form>

      <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Hasil terakhir</h2>
        <pre
          class="mt-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-4 text-xs overflow-auto text-gray-700 dark:text-gray-200"
        >{{ createdSchool ? JSON.stringify(createdSchool, null, 2) : "Belum ada sekolah yang dibuat dari FE ini." }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { api } from "@/api";

const form = reactive({ name: "" });
const isSubmitting = ref(false);
const createdSchool = ref(null);
const message = ref("");
const isError = ref(false);

const messageClass = computed(() =>
  isError.value ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600",
);

const submitSchool = async () => {
  isSubmitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post("/school", { name: form.name });
    createdSchool.value = response?.data || null;
    message.value = response?.message || "Sekolah berhasil dibuat";
    form.name = "";
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
