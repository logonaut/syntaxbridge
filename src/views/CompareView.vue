<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import LanguageSelector from '@/components/LanguageSelector.vue'
import QueryInput from '@/components/QueryInput.vue'
import SyntaxPanel from '@/components/SyntaxPanel.vue'
import SaveButton from '@/components/SaveButton.vue'

const route = useRoute()

// Pre-fill from route query params when reopening a saved comparison
const langA = ref(route.query.langA || 'Python')
const langB = ref(route.query.langB || 'C#')
const loading = ref(false)
const codeA = ref('')
const codeB = ref('')
const errorA = ref('')
const errorB = ref('')
const lastQuery = ref(route.query.q || '')
const tokenCount = ref(null)
const saved = ref(false)

const sameLanguage = computed(() => langA.value && langB.value && langA.value === langB.value)

async function handleCompare(query) {
  if (sameLanguage.value) return

  loading.value = true
  codeA.value = ''
  codeB.value = ''
  errorA.value = ''
  errorB.value = ''
  saved.value = false
  lastQuery.value = query
  tokenCount.value = null

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  const systemPrompt = `You are a precise, terse programming reference assistant.
When given a programming concept in plain English, respond with ONLY a JSON object in this exact shape — no prose, no markdown fences, nothing else:
{"langA": "<code here>", "langB": "<code here>", "tokens": <estimated_input_tokens_integer>}
Each code value must be a working, concise code snippet with brief inline comments. Use \\n for newlines within the code strings.`

  const userPrompt = `Concept: "${query}"
Language A: ${langA.value}
Language B: ${langB.value}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(`${response.status} ${errData?.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const raw = data.content?.[0]?.text?.trim() ?? ''
    const clean = raw
      .replace(/^```(?:json)?\n?/, '')
      .replace(/\n?```$/, '')
      .trim()
    const parsed = JSON.parse(clean)

    codeA.value = parsed.langA ?? ''
    codeB.value = parsed.langB ?? ''
    tokenCount.value = data.usage?.input_tokens ?? parsed.tokens ?? null
  } catch (err) {
    const msg =
      err.message.includes('Failed to fetch') || err.message.includes('NetworkError')
        ? 'SyntaxBridge could not reach the Claude API. Check your connection and try again. Your query has been preserved.'
        : `Request failed: ${err.message}. Your query has been preserved.`
    errorA.value = msg
    errorB.value = msg
  } finally {
    loading.value = false
  }
}

function handleRetry() {
  if (lastQuery.value) handleCompare(lastQuery.value)
}

function handleSave() {
  if (!codeA.value || !codeB.value) return
  const existing = JSON.parse(localStorage.getItem('sb-comparisons') || '[]')
  const entry = {
    id: crypto.randomUUID(),
    langA: langA.value,
    langB: langB.value,
    query: lastQuery.value,
    codeA: codeA.value,
    codeB: codeB.value,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem('sb-comparisons', JSON.stringify([entry, ...existing]))
  saved.value = true
}
</script>

<template>
  <main class="flex flex-1 justify-center px-6 py-8">
    <div class="w-full max-w-4xl">
      <div
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <!-- Language selectors -->
        <div
          class="grid grid-cols-[1fr_48px_1fr] items-center border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <LanguageSelector
            v-model="langA"
            label="Language A"
            variant="a"
          />
          <div class="flex justify-center">
            <span
              class="font-mono text-xs font-bold tracking-widest text-slate-300 dark:text-slate-600"
              >VS</span
            >
          </div>
          <LanguageSelector
            v-model="langB"
            label="Language B"
            variant="b"
          />
        </div>

        <!-- Same-language warning -->
        <div
          v-if="sameLanguage"
          role="alert"
          class="border-b border-amber-100 bg-amber-50 px-6 py-2 text-xs text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/30 dark:text-amber-400"
        >
          Language A and Language B must be different.
        </div>

        <!-- Query input -->
        <div
          class="border-b border-slate-200 bg-white px-6 py-3.5 dark:border-slate-700 dark:bg-slate-900"
        >
          <QueryInput
            :loading="loading"
            :disabled="sameLanguage"
            :initial-value="lastQuery"
            @submit="handleCompare"
          />
        </div>

        <!-- Side-by-side panels -->
        <div class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
          <SyntaxPanel
            :language="langA"
            variant="a"
            :code="codeA"
            :loading="loading"
            :error="errorA"
            @retry="handleRetry"
          />
          <SyntaxPanel
            :language="langB"
            variant="b"
            :code="codeB"
            :loading="loading"
            :error="errorB"
            @retry="handleRetry"
          />
        </div>

        <!-- Status bar -->
        <div
          class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-2.5 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <div class="flex items-center gap-2">
            <span
              v-if="loading"
              class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1D9E75]"
              aria-hidden="true"
            ></span>
            <span class="font-mono text-[11px] text-slate-400">
              <template v-if="loading">Querying claude-haiku...</template>
              <template v-else-if="tokenCount">claude-haiku · ~{{ tokenCount }} tokens</template>
              <template v-else-if="codeA || errorA">claude-haiku</template>
              <template v-else>Select languages and enter a concept</template>
            </span>
          </div>
          <SaveButton
            :disabled="!codeA || !codeB || loading"
            :saved="saved"
            @save="handleSave"
          />
        </div>
      </div>
    </div>
  </main>
</template>
