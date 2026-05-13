<script setup>
import { useId } from 'vue'

defineProps({
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  autocomplete: { type: String, default: '' },
  hint: { type: String, default: '' },
})

defineEmits(['update:modelValue'])

const fieldId = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      :for="fieldId"
      class="flex items-center justify-between text-xs font-medium text-[color:var(--color-text-2)]"
    >
      <span class="flex items-center gap-1">
        {{ label }}
        <span
          v-if="required"
          class="text-[color:var(--color-danger)]"
          aria-hidden="true"
          >*</span
        >
      </span>
      <span
        v-if="hint"
        class="font-mono text-xs text-[color:var(--color-text-3)]"
        >{{ hint }}</span
      >
    </label>
    <input
      :id="fieldId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${fieldId}-err` : undefined"
      class="h-10 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-sm text-[color:var(--color-text)] transition-colors placeholder:text-[color:var(--color-text-3)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-accent)] focus:ring-2 focus:ring-[color:var(--color-accent)]/30 focus:outline-none"
      :class="
        error
          ? 'border-[color:var(--color-danger)] focus:border-[color:var(--color-danger)] focus:ring-[color:var(--color-danger)]/30'
          : ''
      "
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p
      v-if="error"
      :id="`${fieldId}-err`"
      class="flex items-center gap-1.5 text-xs text-[color:var(--color-danger)]"
      role="alert"
      aria-live="polite"
    >
      <span aria-hidden="true">⚠</span>
      {{ error }}
    </p>
  </div>
</template>
