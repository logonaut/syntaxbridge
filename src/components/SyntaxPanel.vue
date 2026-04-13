<script setup>
defineProps({
  language: { type: String, default: '' },
  variant: { type: String, default: 'a' }, // 'a' = teal badge, 'b' = blue badge
  code: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="flex flex-col gap-3 p-5">
    <!-- Badge -->
    <div class="flex items-center gap-2">
      <span
        class="rounded-md px-2.5 py-0.5 font-mono text-[11px] font-semibold"
        :class="
          variant === 'a'
            ? 'bg-[#E1F5EE] text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#1D9E75]'
            : 'bg-[#E6F1FB] text-[#185FA5] dark:bg-[#185FA5]/20 dark:text-[#5B9FD8]'
        "
      >
        {{ language || '—' }}
      </span>
    </div>

    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="space-y-2.5"
      aria-label="Loading result"
      aria-live="polite"
    >
      <div
        v-for="(w, i) in [62, 88, 74, 50, 81, 65, 70, 55]"
        :key="i"
        class="h-3 animate-pulse rounded bg-slate-100 dark:bg-slate-700"
        :style="`width: ${w}%`"
      ></div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="flex flex-col items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/30"
    >
      <div class="flex items-center gap-2">
        <span
          class="flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-100 font-bold text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400"
          aria-hidden="true"
          >!</span
        >
        <span class="text-sm font-semibold text-slate-800 dark:text-slate-200"
          >API unavailable</span
        >
      </div>
      <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{{ error }}</p>
      <button
        class="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        @click="emit('retry')"
      >
        Try again
      </button>
    </div>

    <!-- Code result -->
    <div
      v-else-if="code"
      class="overflow-x-auto rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 dark:border-slate-700 dark:bg-slate-800/60"
    >
      <pre
        class="font-mono text-xs leading-7 break-words whitespace-pre-wrap text-slate-800 dark:text-slate-200"
        >{{ code }}</pre
      >
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700"
    >
      <span class="font-mono text-xs text-slate-400">awaiting comparison...</span>
    </div>
  </div>
</template>
