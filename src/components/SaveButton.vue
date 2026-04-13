<script setup>
defineProps({
  disabled: { type: Boolean, default: false },
  saved: { type: Boolean, default: false },
})
defineEmits(['save'])
</script>

<template>
  <button
    class="rounded-md border px-3 py-1 font-mono text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
    :class="
      saved
        ? 'border-[#9FE1CB] bg-[#E1F5EE] text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#1D9E75]'
        : 'border-slate-200 bg-white text-[#1D9E75] hover:border-[#9FE1CB] hover:bg-[#E1F5EE] dark:border-slate-700 dark:bg-transparent dark:text-[#1D9E75]'
    "
    :disabled="disabled"
    :aria-label="saved ? 'Comparison saved' : 'Save this comparison'"
    @click="$emit('save')"
  >
    {{ saved ? '✓ Saved' : '+ Save comparison' }}
  </button>
</template>
