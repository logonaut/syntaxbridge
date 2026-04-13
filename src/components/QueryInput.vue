<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  initialValue: { type: String, default: '' },
})

const emit = defineEmits(['submit'])

const query = ref(props.initialValue)

function handleSubmit() {
  const trimmed = query.value.trim()
  if (!trimmed || props.loading || props.disabled) return
  emit('submit', trimmed)
}

function handleKeydown(e) {
  if (e.key === 'Enter') handleSubmit()
}
</script>

<template>
  <div class="flex gap-2.5">
    <input
      v-model="query"
      type="text"
      placeholder="e.g. iterate over a dictionary and print key-value pairs"
      class="flex-1 rounded-lg border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/30 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
      :disabled="loading"
      @keydown="handleKeydown"
    />
    <button
      class="flex items-center gap-2 rounded-lg bg-[#0F6E56] px-5 py-2.5 text-sm font-medium whitespace-nowrap text-[#E1F5EE] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="loading || disabled || !query.trim()"
      @click="handleSubmit"
    >
      <span
        v-if="loading"
        class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#E1F5EE]/30 border-t-[#E1F5EE]"
        aria-hidden="true"
      ></span>
      <span>{{ loading ? 'Comparing...' : 'Compare →' }}</span>
    </button>
  </div>
</template>
