<script setup>
import { ref, watch } from 'vue'
import TopBar from '@/components/TopBar.vue'

const isDark = ref(localStorage.getItem('sb-dark') === 'true')

function toggleDark() {
  isDark.value = !isDark.value
  localStorage.setItem('sb-dark', isDark.value)
}

watch(
  isDark,
  (val) => {
    document.documentElement.classList.toggle('dark', val)
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-[#0F172A]">
    <TopBar
      :is-dark="isDark"
      @toggle-dark="toggleDark"
    />
    <RouterView />
  </div>
</template>
