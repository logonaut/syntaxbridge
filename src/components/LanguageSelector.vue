<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Language' },
  variant: { type: String, default: 'a' }, // 'a' = teal, 'b' = blue
})

const emit = defineEmits(['update:modelValue'])

const LANGUAGES = ['Python', 'JavaScript', 'Java', 'C#', 'C++', 'SQL']
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="font-mono text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pr-8 pl-3 font-mono text-sm text-slate-800 transition-colors focus:ring-2 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        :class="
          variant === 'a'
            ? 'focus:border-[#1D9E75] focus:ring-[#1D9E75]/40'
            : 'focus:border-[#185FA5] focus:ring-[#185FA5]/40'
        "
        :aria-label="label"
        @change="emit('update:modelValue', $event.target.value)"
      >
        <option
          value=""
          disabled
        >
          Select language
        </option>
        <option
          v-for="lang in LANGUAGES"
          :key="lang"
          :value="lang"
        >
          {{ lang }}
        </option>
      </select>
      <span
        class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400"
        >▾</span
      >
    </div>
  </div>
</template>
