<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/deskli/StatusBadge.vue'
import type { TicketStatus } from '@/types/ticket'

const examples: { id: string; code: string; subject: string; organization: string; status: TicketStatus }[] = [
  { id: '1', code: 'DSK-1042', subject: 'Não consigo acessar o painel', organization: 'Estúdio Aurora', status: 'in_progress' },
  { id: '2', code: 'DSK-1041', subject: 'Dúvida sobre o relatório mensal', organization: 'Horizonte Digital', status: 'waiting_customer' },
  { id: '3', code: 'DSK-1040', subject: 'Atualização dos dados de contato', organization: 'Clínica São José', status: 'resolved' },
]
</script>
<template>
  <AppLayout title="Início">
    <main class="home-content mx-auto w-full max-w-6xl py-2">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="mb-2 text-xs font-medium tracking-[0.12em] text-brand-text uppercase">Seu espaço de trabalho</p>
          <h1 class="text-2xl font-semibold leading-8 tracking-tight">Tudo começa com uma conversa.</h1>
          <p class="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Acompanhe cada pedido, reúna o contexto e ajude sua equipe a seguir com o atendimento.</p>
        </div>
        <Button as-child>
          <RouterLink to="/design-system#playground">Explorar atendimento <span aria-hidden="true">↗</span></RouterLink>
        </Button>
      </header>

      <section class="mt-5 grid gap-3 border-y border-border py-3 sm:grid-cols-[1fr_2fr]" aria-label="Sobre este ambiente">
        <p class="flex items-center gap-2 self-start text-sm font-medium"><span class="size-2 rounded-full bg-brand-text" />Ambiente de demonstração</p>
        <p class="max-w-xl text-sm leading-6 text-muted-foreground">Explore chamados de exemplo, respostas públicas e notas internas. As interações são simuladas e os dados são reiniciados ao recarregar a página.</p>
      </section>

      <section class="mt-5" aria-labelledby="tickets-title">
        <div class="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="tickets-title" class="text-lg font-semibold tracking-tight">Uma prévia do atendimento</h2>
          <span class="text-xs text-muted-foreground">3 chamados de exemplo</span>
        </div>
        <div class="overflow-hidden rounded-lg border border-border">
          <RouterLink v-for="ticket in examples" :key="ticket.id" :to="{ path: '/design-system', query: { ticket: ticket.id }, hash: '#playground' }"
            class="ticket-preview group grid items-center gap-3 border-b border-border bg-background px-3 py-3 transition-colors last:border-0 hover:bg-card sm:grid-cols-[1fr_auto]">
            <div class="min-w-0">
              <p class="mb-1 text-xs text-muted-foreground"><span class="tabular-nums">{{ ticket.code }}</span><span class="mx-2" aria-hidden="true">·</span>{{ ticket.organization }}</p>
              <p class="font-medium group-hover:text-brand-text">{{ ticket.subject }}</p>
            </div>
            <div class="flex items-center gap-3"><StatusBadge :status="ticket.status" /><span class="text-muted-foreground" aria-hidden="true">↗</span></div>
          </RouterLink>
        </div>
      </section>

      <section class="mt-5 grid gap-4 md:grid-cols-[1.4fr_1fr]" aria-label="Conheça o deskli">
        <div class="rounded-lg bg-card p-4">
          <p class="text-xs font-medium text-brand-text">CONTEXTO COMPARTILHADO</p>
          <h2 class="mt-2 text-lg font-medium tracking-tight">A conversa continua. O contexto fica.</h2>
          <p class="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Respostas, anexos e histórico reunidos no chamado. Notas internas ajudam a equipe a colaborar com a visibilidade indicada em cada mensagem.</p>
        </div>
        <div class="flex flex-col justify-center py-2 md:px-4">
          <h2 class="text-base font-medium">Uma interface, em cada detalhe.</h2>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">Conheça os componentes e os estados que fazem parte do Deskli.</p>
          <RouterLink to="/design-system" class="mt-2 self-start rounded-sm py-2 text-sm font-medium text-brand-text underline-offset-4 hover:underline">Ver design system <span class="ml-2" aria-hidden="true">→</span></RouterLink>
        </div>
      </section>
    </main>
  </AppLayout>
</template>
