<script setup lang="ts">
import { FileText, RotateCcw, X, Download } from '@lucide/vue'
import type { Attachment } from '@/types/ticket'
import IconButton from '@/components/deskli/IconButton.vue'
defineProps<{
  attachment: Attachment
  removable?: boolean
  downloadable?: boolean
}>()
defineEmits<{
  remove: [id: string]
  retry: [id: string]
  download: [id: string]
}>()
</script>
<template>
  <div class="flex min-w-0 items-center gap-3 rounded-md border p-3">
    <FileText class="size-8 shrink-0 text-muted-foreground" />
    <div class="min-w-0 flex-1">
      <p class="break-all text-sm font-medium">{{ attachment.name }}</p>
      <p class="text-xs text-muted-foreground">
        {{ (attachment.sizeBytes / 1024).toFixed(1) }} KB ·
        {{
          attachment.state === 'ready'
            ? 'Pronto'
            : attachment.state === 'failed'
              ? 'Falha no envio'
              : `${attachment.progress ?? 0}%`
        }}
      </p>
      <progress
        v-if="attachment.state === 'uploading'"
        class="w-full accent-primary"
        :value="attachment.progress"
        max="100"
        :aria-label="`Progresso de ${attachment.name}`"
      />
      <p v-if="attachment.error" class="text-xs text-danger-fg">
        {{ attachment.error }}
      </p>
    </div>
    <IconButton
      v-if="attachment.state === 'failed'"
      :label="`Tentar novamente: ${attachment.name}`"
      @click="$emit('retry', attachment.localId)"
    >
      <RotateCcw />
    </IconButton>
    <IconButton
      v-if="downloadable && attachment.state === 'ready'"
      :label="`Baixar ${attachment.name}`"
      @click="$emit('download', attachment.id ?? attachment.localId)"
    >
      <Download />
    </IconButton>
    <IconButton
      v-if="removable"
      :label="`Remover ${attachment.name}`"
      @click="$emit('remove', attachment.localId)"
    >
      <X />
    </IconButton>
  </div>
</template>
