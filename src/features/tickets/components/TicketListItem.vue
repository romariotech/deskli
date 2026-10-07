<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { TicketSummary } from '@/types/ticket'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import { formatDateTime, formatListTimestamp } from '@/lib/format'
defineProps<{ ticket: TicketSummary; selected?: boolean; unread?: boolean }>()
defineEmits<{ select: [id: string] }>()
</script>
<template>
  <RouterLink
    :to="{
      path: '/design-system',
      query: { ticket: ticket.id },
      hash: '#playground',
    }"
    :aria-current="selected ? 'page' : undefined"
    class="block space-y-1.5 border-b p-[var(--panel-padding)] hover:bg-secondary"
    :class="
      selected
        ? 'border-l-2 border-l-brand-text bg-accent'
        : 'border-l-2 border-l-transparent'
    "
    @click="$emit('select', ticket.id)"
  >
    <div class="flex justify-between gap-2 text-xs text-muted-foreground">
      <span>{{ ticket.code }}</span>
      <time
        :datetime="ticket.updatedAt"
        :title="formatDateTime(ticket.updatedAt)"
        class="tabular-nums"
      >
        {{ formatListTimestamp(ticket.updatedAt) }}
      </time>
    </div>
    <p
      class="line-clamp-2 font-semibold [overflow-wrap:anywhere]"
      :title="ticket.subject"
    >
      {{ ticket.subject }}
      <span v-if="unread" class="sr-only">· Não lido</span>
    </p>
    <p class="text-xs text-muted-foreground">{{ ticket.organizationName }}</p>
    <div class="flex flex-wrap gap-2">
      <StatusBadge :status="ticket.status" />
      <PriorityBadge :priority="ticket.priority" />
    </div>
  </RouterLink>
</template>
