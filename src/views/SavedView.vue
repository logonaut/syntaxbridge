<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function load() {
  try {
    return JSON.parse(localStorage.getItem('sb-comparisons') || '[]')
  } catch {
    return []
  }
}

const comparisons = ref(load())

function deleteEntry(id) {
  comparisons.value = comparisons.value.filter((c) => c.id !== id)
  localStorage.setItem('sb-comparisons', JSON.stringify(comparisons.value))
}

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const isYesterday = d.toDateString() === new Date(now - 86400000).toDateString()
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (isToday) return `saved today · ${time}`
  if (isYesterday) return `saved yesterday · ${time}`
  return `saved ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${time}`
}

function reopenEntry(entry) {
  router.push({
    path: '/',
    query: { langA: entry.langA, langB: entry.langB, q: entry.query },
  })
}
</script>

<template>
  <main class="flex flex-1 justify-center px-6 py-8">
    <div class="w-full max-w-4xl">
      <div
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <h1 class="text-sm font-semibold text-slate-900 dark:text-white">Saved comparisons</h1>
          <span
            class="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            {{ comparisons.length }} saved
          </span>
        </div>

        <!-- Empty state -->
        <div
          v-if="comparisons.length === 0"
          class="flex flex-col items-center justify-center gap-3 py-20 text-center"
        >
          <span class="font-mono text-2xl">📂</span>
          <p class="text-sm text-slate-500 dark:text-slate-400">No saved comparisons yet.</p>
          <RouterLink
            to="/"
            class="text-sm font-medium text-[#1D9E75] underline-offset-4 hover:underline"
          >
            Make your first comparison →
          </RouterLink>
        </div>

        <!-- List -->
        <ul
          v-else
          class="divide-y divide-slate-100 px-4 py-3 dark:divide-slate-800"
        >
          <li
            v-for="entry in comparisons"
            :key="entry.id"
            class="flex items-start justify-between gap-4 rounded-lg px-3 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
          >
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-1.5">
                <span
                  class="rounded bg-[#E1F5EE] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#1D9E75]"
                  >{{ entry.langA }}</span
                >
                <span class="text-xs text-slate-300 dark:text-slate-600">→</span>
                <span
                  class="rounded bg-[#E6F1FB] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#185FA5] dark:bg-[#185FA5]/20 dark:text-[#5B9FD8]"
                  >{{ entry.langB }}</span
                >
              </div>
              <p class="text-sm text-slate-800 dark:text-slate-200">{{ entry.query }}</p>
              <p class="font-mono text-[11px] text-slate-400">{{ formatDate(entry.savedAt) }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-1.5">
              <button
                class="rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800"
                @click="reopenEntry(entry)"
              >
                Open →
              </button>
              <button
                class="rounded-md px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-red-50 hover:text-red-400 dark:text-slate-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                :aria-label="`Delete comparison: ${entry.query}`"
                @click="deleteEntry(entry.id)"
              >
                ✕
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>
