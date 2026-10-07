<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { LockKeyhole, Paperclip, Send } from '@lucide/vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import DeskliButton from '@/components/DeskliButton.vue'
import AttachmentItem from './AttachmentItem.vue'
import type {
  ComposerDraft,
  UploadPolicy,
  MessageVisibility,
  SubmitReply,
} from '@/types/ticket'
const props = defineProps<{
  ticketId: string
  modelValue: ComposerDraft
  canWriteInternal: boolean
  submitting?: boolean
  error?: string
  uploadPolicy: UploadPolicy
}>()
const emit = defineEmits<{
  'update:modelValue': [value: ComposerDraft]
  'change-visibility': [value: MessageVisibility]
  attach: [files: File[]]
  removeAttachment: [id: string]
  retryAttachment: [id: string]
  submit: [payload: SubmitReply]
}>()
const allowed = computed(
  () =>
    !props.submitting &&
    (props.modelValue.visibility !== 'internal' || props.canWriteInternal) &&
    (props.modelValue.body.trim() ||
      props.modelValue.attachments.some((a) => a.state === 'ready')) &&
    props.modelValue.attachments.every((a) => a.state === 'ready'),
)
let previousFingerprint = ''
let requestId = ''
watch(
  () => [props.modelValue.body, props.modelValue.attachments.length],
  () => {
    if (!props.modelValue.body && !props.modelValue.attachments.length) {
      previousFingerprint = ''
      requestId = ''
    }
  },
)
function submit() {
  if (
    !allowed.value ||
    (props.modelValue.visibility === 'internal' && !props.canWriteInternal)
  )
    return
  const payload = {
    ticketId: props.ticketId,
    visibility: props.modelValue.visibility,
    body: props.modelValue.body,
    attachmentIds: props.modelValue.attachments.flatMap((a) =>
      a.id ? [a.id] : [],
    ),
  }
  const fingerprint = JSON.stringify(payload)
  if (fingerprint !== previousFingerprint) {
    previousFingerprint = fingerprint
    requestId = crypto.randomUUID()
  }
  emit('submit', { ...payload, requestId })
}
const fileInput = ref<HTMLInputElement>()
function attach(event: Event) {
  const input = event.target as HTMLInputElement
  emit('attach', Array.from(input.files ?? []))
  input.value = ''
}
function shortcut(event: KeyboardEvent) {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key === 'Enter' &&
    !event.isComposing
  ) {
    event.preventDefault()
    submit()
  }
}
</script>
<template>
  <div
    class="rounded-md border border-input p-[var(--panel-padding)]"
    :class="
      modelValue.visibility === 'internal' ? 'bg-accent' : 'bg-background'
    "
  >
    <Tabs
      :model-value="modelValue.visibility"
      activation-mode="manual"
      @update:model-value="
        emit('change-visibility', $event as MessageVisibility)
      "
    >
      <TabsList class="w-full justify-start">
        <TabsTrigger value="public" :disabled="submitting">
          Resposta pública
        </TabsTrigger>
        <TabsTrigger
          v-if="canWriteInternal"
          value="internal"
          :disabled="submitting"
        >
          <LockKeyhole class="size-4" />
          Nota interna
        </TabsTrigger>
      </TabsList>
      <TabsContent
        v-for="visibility in canWriteInternal
          ? ['public', 'internal']
          : ['public']"
        :key="visibility"
        :value="visibility"
      >
        <label
          :for="`reply-${ticketId}-${visibility}`"
          class="my-3 block text-xs"
          :class="
            visibility === 'internal'
              ? 'text-accent-foreground'
              : 'text-muted-foreground'
          "
        >
          {{
            visibility === 'internal'
              ? 'Visível apenas para a equipe'
              : 'Visível ao solicitante'
          }}
        </label>
        <Textarea
          :id="`reply-${ticketId}-${visibility}`"
          :model-value="modelValue.body"
          :disabled="submitting"
          class="!min-h-20 max-h-80"
          placeholder="Escreva sua mensagem…"
          @update:model-value="
            emit('update:modelValue', { ...modelValue, body: String($event) })
          "
          @keydown="shortcut"
        />
      </TabsContent>
    </Tabs>
    <div class="my-3 grid gap-2">
      <AttachmentItem
        v-for="attachment in modelValue.attachments"
        :key="attachment.localId"
        :attachment="attachment"
        :removable="!submitting"
        @remove="emit('removeAttachment', $event)"
        @retry="emit('retryAttachment', $event)"
      />
    </div>
    <p class="mb-2 text-xs text-muted-foreground">
      Anexos da demonstração: PDF, PNG e JPEG · até
      {{ uploadPolicy.maxFiles }} arquivos de
      {{ uploadPolicy.maxBytesPerFile / 1024 / 1024 }} MB.
    </p>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <input
        ref="fileInput"
        type="file"
        multiple
        hidden
        tabindex="-1"
        :accept="uploadPolicy.acceptedTypes.join(',')"
        :disabled="submitting"
        aria-label="Anexar arquivos"
        @change="attach"
      />
      <DeskliButton
        variant="outline"
        :disabled="submitting"
        @click="fileInput?.click()"
      >
        <template #icon><Paperclip /></template>
        Anexar arquivos
      </DeskliButton>
      <DeskliButton :loading="submitting" :disabled="!allowed" @click="submit">
        <template #icon><Send /></template>
        {{
          modelValue.visibility === 'internal'
            ? 'Adicionar nota interna'
            : 'Enviar resposta'
        }}
      </DeskliButton>
    </div>
    <p v-if="error" role="alert" class="mt-3 text-sm text-danger-fg">
      {{ error }}
    </p>
    <p class="mt-3 text-xs text-muted-foreground">
      Ctrl / ⌘ + Enter para enviar. Envio simulado, sem persistência.
    </p>
  </div>
</template>
