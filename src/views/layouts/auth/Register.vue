<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-6 py-12">
    <form @submit.prevent="handleRegister"
      class="w-full max-w-2xl bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-8 space-y-6">
      <div>
        <p class="text-sm uppercase tracking-wide text-gray-400">Bootstrap</p>
        <h1 class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">Register User</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Endpoint yang dipakai: `POST /api/auth/register`
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input v-model="form.username" type="text" required
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input v-model="form.password" type="password" required
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
          <select v-model="form.role"
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white">
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="GURU">GURU</option>
            <option value="SISWA">SISWA</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">School ID</label>
          <input v-model="form.school_id" type="number" min="1"
            class="mt-1 w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
        </div>
      </div>

      <div v-if="message" :class="messageClass" class="p-3 rounded-md text-sm">
        {{ message }}
      </div>

      <div class="flex items-center gap-3">
        <button type="submit" :disabled="isSubmitting"
          class="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60">
          {{ isSubmitting ? "Menyimpan..." : "Register" }}
        </button>
        <router-link to="/auth/login" class="text-sky-600 underline">Kembali ke login</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { api } from "@/api";

const baseForm = () => ({
  username: "",
  password: "",
  role: "SUPER_ADMIN",
  school_id: "",
});

const form = reactive(baseForm());
const isSubmitting = ref(false);
const message = ref("");
const isError = ref(false);

const messageClass = computed(() =>
  isError.value ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600",
);

const handleRegister = async () => {
  isSubmitting.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post("/auth/register", {
      username: form.username,
      password: form.password,
      role: form.role,
      school_id: form.school_id ? Number(form.school_id) : null,
    });
    message.value = response?.message || "User berhasil dibuat";
    Object.assign(form, baseForm());
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
