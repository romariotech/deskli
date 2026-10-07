<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeMenu from '@/components/ThemeMenu.vue'
import { ArrowRight, CornerDownRight, Eye, EyeOff } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const router = useRouter()
const touched = reactive({ email: false, password: false })
const emailError = computed(() => {
  if (!touched.email) return ''
  if (!email.value.trim()) return 'Informe seu e-mail.'
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Informe um e-mail válido.'
})
const passwordError = computed(() => touched.password && !password.value ? 'Informe sua senha.' : '')

async function onSubmit() {
  if (loading.value) return
  touched.email = true
  touched.password = true
  if (emailError.value || passwordError.value) {
    document.getElementById(emailError.value ? 'email' : 'password')?.focus()
    return
  }
  loading.value = true
  try {
    // Acesso demonstrativo: não envia nem armazena credenciais.
    await router.push({ name: 'home' })
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <main class="auth-page">
    <header class="auth-header">
      <span class="text-2xl font-semibold tracking-tight">deskli<span class="text-brand-text">.</span></span>
      <ThemeMenu compact />
    </header>

    <div class="auth-layout">
      <section class="auth-form" aria-labelledby="login-title">
        <p class="mb-4 text-xs font-medium tracking-[0.12em] text-brand-text uppercase">Seu espaço de atendimento</p>
        <h1 id="login-title" class="text-2xl font-semibold leading-8 tracking-tight">Bom ter você por aqui.</h1>
        <p class="mt-3 text-sm leading-6 text-muted-foreground">Entre para acompanhar os chamados<br class="hidden sm:block"> e dar continuidade às conversas.</p>

        <form class="mt-4 space-y-4" :aria-busy="loading" novalidate @submit.prevent="onSubmit">
          <Field :data-invalid="!!emailError">
            <FieldLabel for="email">E-mail de trabalho</FieldLabel>
            <Input id="email" v-model="email" type="email" name="email" required :disabled="loading"
              autocomplete="username" placeholder="voce@empresa.com" :aria-invalid="!!emailError"
              :aria-describedby="emailError ? 'email-error' : undefined" @blur="touched.email = true" />
            <FieldError v-if="emailError" id="email-error">{{ emailError }}</FieldError>
          </Field>
          <Field :data-invalid="!!passwordError">
            <FieldLabel for="password">Senha</FieldLabel>
            <div class="relative">
              <Input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" name="password"
                required :disabled="loading" :aria-invalid="!!passwordError"
                :aria-describedby="passwordError ? 'password-error' : undefined" @blur="touched.password = true"
                autocomplete="current-password" placeholder="Sua senha" class="auth-password" />
              <button type="button" class="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                :disabled="loading" :aria-pressed="showPassword" aria-controls="password"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" class="size-4" /><Eye v-else class="size-4" />
              </button>
            </div>
            <FieldError v-if="passwordError" id="password-error">{{ passwordError }}</FieldError>
          </Field>
          <Button type="submit" :disabled="loading" :aria-busy="loading" class="w-full justify-between px-4">
            {{ loading ? 'Entrando…' : 'Entrar no deskli' }}<ArrowRight class="size-4" aria-hidden="true" />
          </Button>
        </form>
        <div class="auth-demo mt-7 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
          <p class="font-medium text-foreground">Conheça o ambiente de demonstração</p>
          <p class="mt-1">Use um e-mail válido e qualquer senha. Nenhum dado é enviado ou salvo.</p>
        </div>
      </section>

      <aside class="auth-story" aria-labelledby="story-title">
        <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground"><span class="size-2 rounded-full bg-brand-text" />Atendimento com clareza</div>
        <h2 id="story-title" class="mt-8 max-w-96 text-3xl font-medium leading-[1.13] tracking-[-0.045em]">Menos ruído.<br>Mais conversa.</h2>
        <div class="auth-example mt-10" aria-label="Exemplo ilustrativo de um chamado">
          <div class="flex items-center justify-between gap-3 border-b border-border pb-4 text-xs">
            <span class="tabular-nums text-muted-foreground">DSK-1042</span><span class="rounded-md bg-accent px-2 py-1 text-accent-foreground">Em atendimento</span>
          </div>
          <p class="mt-4 font-medium">Preciso de ajuda com meu acesso</p>
          <p class="mt-1 text-xs text-muted-foreground">Estúdio Aurora · Portal do cliente</p>
          <div class="mt-6 flex gap-3">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium" aria-hidden="true">AM</span>
            <div><p class="text-xs font-medium">Ana Martins <span class="ml-1 font-normal text-muted-foreground">· Equipe</span></p><p class="mt-1 text-sm leading-6 text-muted-foreground">Olá! Vou acompanhar seu caso.<br>Vamos resolver isso juntos.</p></div>
          </div>
          <div class="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><CornerDownRight class="size-4 text-brand-text" aria-hidden="true" />Conversa e histórico no mesmo lugar</div>
        </div>
      </aside>
    </div>
    <footer class="auth-footer"><span>deskli · Ambiente de demonstração</span></footer>
  </main>
</template>

<style scoped>
.auth-page { min-height: 100dvh; display: flex; flex-direction: column; background: var(--background); }
.auth-header, .auth-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: min(100%, 1440px); margin-inline: auto; padding: 12px 32px; }
.auth-footer { font-size: 12px; color: var(--muted-foreground); }
.auth-layout { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: clamp(40px, 7vw, 112px); width: min(100%, 1200px); margin: auto; padding: 16px 32px; }
.auth-form { width: 100%; max-width: 368px; margin-inline: auto; }
.auth-form :deep(.auth-password) { padding-right: 48px; }
.auth-story { padding: 24px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; }
.auth-example { background: var(--background); border: 1px solid var(--border); border-radius: 8px; padding: 20px; }
/* Reserve room for the header, footer and validation without clipping content. */
@media (max-height: 950px) {
  .auth-header, .auth-footer { padding-block: 12px; }
  .auth-layout { padding-block: 16px; }
  .auth-form form { margin-top: 24px; }
  .auth-demo { margin-top: 20px; padding-top: 16px; }
  .auth-story { padding: 24px; }
  .auth-story h2 { margin-top: 16px; font-size: 2rem; }
  .auth-story > p { margin-top: 16px; }
  .auth-example { margin-top: 24px; padding: 16px; }
}
@media (max-width: 1023px) {
  .auth-header, .auth-footer { padding: 20px 24px; }
  .auth-layout { grid-template-columns: 1fr; padding: 16px 24px; }
  .auth-story { display: none; }
}
@media (max-height: 740px) {
  .auth-header, .auth-footer { padding-block: 8px; }
  .auth-layout { padding-block: 8px; }
  .auth-form > p:first-child { margin-bottom: 8px; }
  .auth-form h1 { font-size: 1.5rem; line-height: 2rem; }
  .auth-form form { margin-top: 16px; }
  .auth-form form > div { margin-bottom: 16px; }
  .auth-demo { margin-top: 12px; padding-top: 12px; }
  .auth-story { padding: 16px; }
  .auth-story h2 { margin-top: 12px; font-size: 2rem; }
  .auth-story > p { margin-top: 12px; }
  .auth-example { margin-top: 16px; padding: 12px; }
  .auth-example > .mt-6 { margin-top: 16px; }
  .auth-example > .mt-5 { margin-top: 12px; padding-top: 12px; }
}
</style>
