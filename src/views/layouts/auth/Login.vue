<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="flex items-center justify-center px-6 ">
      <form @submit.prevent="handleLogin"
        class="w-full max-w-md bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-8 space-y-6  mt-40">
        <div>
          <p class="text-sm uppercase tracking-wide text-gray-400">School System</p>
          <h1 class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">Login System</h1>
          <p class="mt-4">Login Untuk mengakses halaman LMS</p>
        </div>

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

        <button type="submit" :disabled="isLoading"
          class="w-full px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60">
          {{ isLoading ? "Masuk..." : "Masuk" }}
        </button>

        <!-- <p class="text-sm text-gray-500 dark:text-gray-400">
          Butuh bootstrap user awal?
          <router-link to="/auth/register" class="text-sky-600 underline">Buka form register</router-link>
        </p> -->
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Form registrasi siswa publik:
          <router-link to="/student-registration" class="text-sky-600 underline">Buka registrasi siswa</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";
import { persistSession } from "@/utils/auth";

const router = useRouter();
const isLoading = ref(false);
const form = reactive({
  username: "",
  password: "",
});

const handleLogin = async () => {
  isLoading.value = true;

  try {
    const response = await api.post("/auth/login", { ...form });
    persistSession(response);
    router.push("/");
  } catch (error) {
    pushToast({
      title: "Login Gagal",
      message: error.message,
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
