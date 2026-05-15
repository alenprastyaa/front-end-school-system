<template>
  <transition name="global-loading-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[140] flex items-center justify-center bg-white px-5 dark:bg-slate-950"
      role="status"
      aria-live="polite"
    >
      <div class="relative flex h-80 w-80 items-center justify-center sm:h-96 sm:w-96">
        <div class="global-dot-spinner absolute inset-0">
          <span
            v-for="index in dotCount"
            :key="index"
            class="global-dot"
            :style="dotStyle(index - 1)"
          ></span>
        </div>
        <p class="relative text-4xl font-black tracking-normal text-slate-950 sm:text-5xl dark:text-white">loading...</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const dotCount = 24;

const dotStyle = (index) => ({
  "--dot-angle": `${index * (360 / dotCount)}deg`,
  opacity: String(1 - (index / dotCount) * 0.82),
  animationDelay: `${index * -0.045}s`,
});
</script>

<style scoped>
.global-loading-fade-enter-active,
.global-loading-fade-leave-active {
  transition: opacity 0.18s ease;
}

.global-loading-fade-enter-from,
.global-loading-fade-leave-to {
  opacity: 0;
}

.global-dot-spinner {
  animation: global-loading-spin 1.05s linear infinite;
}

.global-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 2rem;
  width: 2rem;
  margin-left: -1rem;
  margin-top: -1rem;
  border-radius: 9999px;
  background: #111111;
  transform: rotate(var(--dot-angle)) translateY(-9.25rem);
  transform-origin: center;
}

@media (max-width: 640px) {
  .global-dot {
    height: 1.5rem;
    width: 1.5rem;
    margin-left: -0.75rem;
    margin-top: -0.75rem;
    transform: rotate(var(--dot-angle)) translateY(-7.35rem);
  }
}

@keyframes global-loading-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
