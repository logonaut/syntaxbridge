<script setup>
defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-dark'])

const linkClass =
  'text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors [&.router-link-active]:text-slate-900 dark:[&.router-link-active]:text-white [&.router-link-active]:font-medium'
</script>

<template>
  <header
    class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-700 dark:bg-slate-900"
  >
    <RouterLink
      to="/"
      class="font-mono text-base font-semibold tracking-tight text-slate-900 dark:text-white"
    >
      Syntax<span class="text-[#1D9E75]">Bridge</span>
    </RouterLink>

    <div class="flex items-center gap-5">
      <nav class="flex gap-1">
        <RouterLink
          to="/"
          :class="linkClass"
          class="rounded-md px-3 py-1.5"
          >Compare</RouterLink
        >
        <RouterLink
          to="/saved"
          :class="linkClass"
          class="rounded-md px-3 py-1.5"
          >Saved</RouterLink
        >
      </nav>

      <button
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        class="flex items-center gap-2 font-mono text-xs text-slate-400"
        @click="$emit('toggle-dark')"
      >
        <span>light</span>
        <span
          class="relative inline-flex h-5 w-8 items-center rounded-full border border-slate-300 bg-slate-100 transition-colors dark:border-slate-600 dark:bg-slate-700"
        >
          <span
            class="absolute left-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 transition-transform duration-200 dark:translate-x-[13px] dark:bg-[#1D9E75]"
          ></span>
        </span>
        <span>dark</span>
      </button>
    </div>
  </header>
</template>
