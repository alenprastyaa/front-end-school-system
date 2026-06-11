<template>
  <div class="skeleton-loader" role="status" aria-live="polite" aria-busy="true">
    <span class="sr-only">Memuat data...</span>

    <!-- STATS: barisan kartu metrik (mis. dashboard) -->
    <div v-if="variant === 'stats'" class="grid gap-3 sm:gap-4" :class="gridColsClass">
      <div v-for="n in count" :key="n"
        class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div class="flex items-center gap-3">
          <div class="skeleton-shimmer h-10 w-10 shrink-0 rounded-xl"></div>
          <div class="skeleton-shimmer h-3 w-20 rounded"></div>
        </div>
        <div class="skeleton-shimmer mt-4 h-7 w-24 rounded"></div>
        <div class="skeleton-shimmer mt-2 h-2.5 w-16 rounded"></div>
      </div>
    </div>

    <!-- CARD: grid kartu konten (gaya YouTube) -->
    <div v-else-if="variant === 'card'" class="grid items-stretch gap-3 sm:gap-4" :class="gridColsClass">
      <div v-for="n in count" :key="n"
        class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div v-if="thumbnail" class="skeleton-shimmer mb-3 h-32 w-full rounded-xl"></div>
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1 space-y-2">
            <div class="skeleton-shimmer h-4 w-3/4 rounded"></div>
            <div class="skeleton-shimmer h-3 w-1/2 rounded"></div>
          </div>
          <div class="skeleton-shimmer h-6 w-12 shrink-0 rounded-full"></div>
        </div>
        <div class="mt-4 space-y-2">
          <div class="skeleton-shimmer h-3 w-full rounded"></div>
          <div class="skeleton-shimmer h-3 w-5/6 rounded"></div>
        </div>
        <div class="mt-auto flex gap-2 pt-4">
          <div class="skeleton-shimmer h-8 flex-1 rounded-lg"></div>
          <div class="skeleton-shimmer h-8 w-10 shrink-0 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- LIST: baris bertumpuk (avatar + teks) -->
    <div v-else-if="variant === 'list'" class="space-y-2.5">
      <div v-for="n in count" :key="n"
        class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
        <div class="skeleton-shimmer h-10 w-10 shrink-0 rounded-full"></div>
        <div class="min-w-0 flex-1 space-y-2">
          <div class="skeleton-shimmer h-3.5 w-1/3 rounded"></div>
          <div class="skeleton-shimmer h-3 w-2/3 rounded"></div>
        </div>
        <div class="skeleton-shimmer h-7 w-16 shrink-0 rounded-lg"></div>
      </div>
    </div>

    <!-- TABLE: baris tabel -->
    <div v-else-if="variant === 'table'"
      class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <div v-for="n in count" :key="n"
        class="flex items-center gap-4 border-b border-slate-100 bg-white px-4 py-3.5 last:border-b-0 dark:border-slate-800 dark:bg-slate-900">
        <div v-for="c in columns" :key="c" class="skeleton-shimmer h-4 rounded"
          :class="c === 1 ? 'w-8 shrink-0' : 'flex-1'"></div>
      </div>
    </div>

    <!-- FORM: deretan field input -->
    <div v-else-if="variant === 'form'" class="space-y-4">
      <div v-for="n in count" :key="n" class="space-y-1.5">
        <div class="skeleton-shimmer h-3 w-24 rounded"></div>
        <div class="skeleton-shimmer h-10 w-full rounded-lg"></div>
      </div>
    </div>

    <!-- TEXT: garis teks sederhana -->
    <div v-else class="space-y-2.5">
      <div v-for="n in count" :key="n" class="skeleton-shimmer h-4 rounded"
        :class="n === count ? 'w-2/3' : 'w-full'"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // 'card' | 'stats' | 'list' | 'table' | 'form' | 'text'
  variant: {
    type: String,
    default: "card",
  },
  // jumlah placeholder yang dirender
  count: {
    type: Number,
    default: 6,
  },
  // jumlah kolom grid untuk variant 'card' / 'stats' (1-4)
  columns: {
    type: Number,
    default: 3,
  },
  // jumlah kolom untuk variant 'table'
  tableColumns: {
    type: Number,
    default: 4,
  },
  // tampilkan placeholder thumbnail di atas kartu (variant 'card')
  thumbnail: {
    type: Boolean,
    default: false,
  },
});

const columns = computed(() => props.tableColumns);

const gridColsClass = computed(() => {
  const map = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  };
  return map[props.columns] || map[3];
});
</script>
