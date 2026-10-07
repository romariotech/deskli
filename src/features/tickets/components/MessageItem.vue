<script setup lang="ts">
import { LockKeyhole } from '@lucide/vue'
import type { TicketMessage } from '@/types/ticket'
import AbAvatar from '@/components/AbAvatar.vue'
import AttachmentItem from './AttachmentItem.vue'
import { formatDateTime, formatTime } from '@/lib/format'
defineProps<{ message: TicketMessage }>()
</script>
<template>
  <article
    class="rounded-md p-[var(--panel-padding)]"
    :class="
      message.visibility === 'internal'
        ? 'border border-brand-text bg-accent text-accent-foreground'
        : ''
    "
  >
    <p
      v-if="message.visibility === 'internal'"
      class="mb-3 flex items-center gap-2 text-xs font-medium"
    >
      <LockKeyhole class="size-4" />
      Nota interna · Visível apenas para a equipe
    </p>
    <div class="flex items-start gap-3">
      <AbAvatar :name="message.author.name" :size="32" />
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span class="font-semibold">{{ message.author.name }}</span>
          <span class="text-xs">{{ message.author.roleLabel }}</span>
          <time
            :datetime="message.createdAt"
            :title="formatDateTime(message.createdAt)"
            class="text-xs tabular-nums"
          >
            {{ formatTime(message.createdAt) }}
          </time>
        </div>
        <p
          class="mt-2 max-w-[65ch] whitespace-pre-wrap leading-[22px] [overflow-wrap:anywhere]"
        >
          {{ message.body }}
        </p>
        <div v-if="message.attachments.length" class="mt-3 grid gap-2">
          <AttachmentItem
            v-for="attachment in message.attachments"
            :key="attachment.localId"
            :attachment="attachment"
          />
        </div>
      </div>
    </div>
  </article>
</template>
