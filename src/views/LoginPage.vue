<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/AppButton.vue'
import FormField from '@/components/FormField.vue'
import { useAuthStore } from '@/stores/auth'
import { useAsync } from '@/composables/useAsync'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { loading, error, fieldErrors, run } = useAsync()

const form = reactive({ email: '', password: '' })

async function onSubmit() {
  try {
    await run(() => auth.login(form))
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.replace(redirect)
  } catch {
    // error captured
  }
}
</script>

<template>
  <main class="auth-layout flex flex-1 items-center justify-center px-5 py-16">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <RouterLink
          to="/"
          class="font-mono text-base font-semibold tracking-tight text-slate-900 dark:text-white"
        >
          Syntax<span class="text-[#1D9E75]">Bridge</span>
        </RouterLink>
        <h1 class="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--color-text)]">
          Sign in
        </h1>
        <p class="mt-1.5 text-sm text-[color:var(--color-text-2)]">Compare code. Save your work.</p>
      </div>
      <form
        class="flex flex-col gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6"
        @submit.prevent="onSubmit"
      >
        <FormField
          v-model="form.email"
          label="Email"
          type="email"
          autocomplete="email"
          required
          placeholder="you@example.com"
          :error="fieldErrors.email"
        />
        <FormField
          v-model="form.password"
          label="Password"
          type="password"
          autocomplete="current-password"
          required
          :error="fieldErrors.password"
        />
        <p
          v-if="error && Object.keys(fieldErrors).length === 0"
          class="flex items-center gap-2 rounded-md border border-[color:var(--color-danger)]/30 bg-[color:var(--color-danger-soft)] px-3 py-2 text-xs text-[color:var(--color-danger)]"
          role="alert"
          aria-live="polite"
        >
          <span aria-hidden="true">⚠</span>
          {{ error.message }}
        </p>
        <AppButton
          type="submit"
          :loading="loading"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </AppButton>
      </form>
      <p class="mt-5 text-center text-sm text-[color:var(--color-text-2)]">
        New here?
        <RouterLink
          to="/register"
          class="font-medium text-[#1D9E75] underline-offset-4 hover:underline"
        >
          Create an account
        </RouterLink>
      </p>
    </div>
  </main>
</template>
