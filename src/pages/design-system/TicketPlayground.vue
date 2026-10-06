<script setup lang="ts">
import { computed, reactive, ref, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { ArrowLeft } from '@lucide/vue'
import type {
  TicketSummary,
  TicketMessage,
  ComposerDraft,
  MessageVisibility,
  UploadPolicy,
} from '@/types/ticket'
import SearchInput from '@/components/deskli/SearchInput.vue'
import DeskliButton from '@/components/deskli/DeskliButton.vue'
import TicketListItem from '@/features/tickets/components/TicketListItem.vue'
import MessageItem from '@/features/tickets/components/MessageItem.vue'
import ReplyComposer from '@/features/tickets/components/ReplyComposer.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
const route = useRoute()
const query = ref('')
const filter = ref('')
const state = ref('ready')
const mobileConversation = ref(false)
const failSend = ref(false)
const failUpload = ref(false)
const submitting = ref(false)
const error = ref('')
const policy: UploadPolicy = {
  acceptedTypes: ['application/pdf', 'image/png', 'image/jpeg'],
  maxFiles: 3,
  maxBytesPerFile: 5 * 1024 * 1024,
}
const tickets: TicketSummary[] = [
  {
    id: '1',
    code: 'DSK-1042',
    subject: 'Não consigo acessar o painel',
    organizationName: 'Estúdio Aurora',
    status: 'in_progress',
    priority: 'high',
    assignee: null,
    updatedAt: '2026-10-02T09:42:00-03:00',
    unread: true,
  },
  {
    id: '2',
    code: 'DSK-1041',
    subject: 'Dúvida sobre o relatório mensal',
    organizationName: 'Horizonte Digital',
    status: 'waiting_customer',
    priority: 'medium',
    assignee: null,
    updatedAt: '2026-10-02T09:30:00-03:00',
    unread: false,
  },
  {
    id: '3',
    code: 'DSK-1040',
    subject: 'Atualização dos dados de contato',
    organizationName: 'Clínica São José',
    status: 'resolved',
    priority: 'low',
    assignee: null,
    updatedAt: '2026-10-02T08:15:00-03:00',
    unread: false,
  },
]
const selectedId = ref('1')
watch(
  () => route.query.ticket,
  (value) => {
    if (tickets.some((t) => t.id === value)) {
      selectedId.value = String(value)
      mobileConversation.value = true
    }
  },
  { immediate: true },
)
const ticket = computed(() => tickets.find((t) => t.id === selectedId.value)!)
const visibleTickets = computed(() =>
  tickets.filter((t) =>
    `${t.subject} ${t.code} ${t.organizationName}`
      .toLocaleLowerCase('pt-BR')
      .includes(filter.value.toLocaleLowerCase('pt-BR')),
  ),
)
const drafts = reactive<
  Record<string, Record<MessageVisibility, ComposerDraft>>
>({})
const visibility = reactive<Record<string, MessageVisibility>>({})
for (const t of tickets) {
  drafts[t.id] = {
    public: { visibility: 'public', body: '', attachments: [] },
    internal: { visibility: 'internal', body: '', attachments: [] },
  }
  visibility[t.id] = 'public'
}
const draft = computed({
  get: () => drafts[selectedId.value]![visibility[selectedId.value]!]!,
  set: (value) => {
    drafts[selectedId.value]![value.visibility] = value
  },
})
const messages = ref<TicketMessage[]>(
  tickets.map((t) => ({
    id: `initial-${t.id}`,
    ticketId: t.id,
    author: { id: 'customer', name: 'Mariana Costa', roleLabel: 'Cliente' },
    visibility: 'public',
    body:
      t.id === '1'
        ? 'Olá! Ao tentar entrar no painel, aparece uma mensagem de acesso indisponível. Podem me ajudar?'
        : 'Olá, gostaria de ajuda com esta solicitação. Obrigada!',
    createdAt: t.updatedAt,
    attachments: [],
  })),
)
const timers: ReturnType<typeof setTimeout>[] = []
onBeforeUnmount(() => timers.forEach(clearTimeout))
function clearFilters() {
  query.value = ''
  filter.value = ''
  state.value = 'ready'
}
function changeVisibility(value: MessageVisibility) {
  visibility[selectedId.value] = value
  error.value = ''
}
function select(id: string) {
  if (submitting.value) return
  selectedId.value = id
  mobileConversation.value = true
  error.value = ''
}
function simulateUpload(localId: string) {
  const attachment = draft.value.attachments.find((a) => a.localId === localId)
  if (!attachment || submitting.value) return
  attachment.state = 'uploading'
  attachment.progress = 25
  attachment.error = undefined
  const shouldFail = failUpload.value
  timers.push(
    setTimeout(() => {
      attachment.state = shouldFail ? 'failed' : 'ready'
      attachment.progress = 100
      attachment.id = shouldFail ? undefined : localId
      attachment.error = shouldFail
        ? 'Falha simulada. Desative a falha e tente novamente.'
        : undefined
    }, 700),
  )
}
function attach(files: File[]) {
  error.value = ''
  for (const file of files) {
    if (
      !policy.acceptedTypes.includes(file.type) ||
      file.size > policy.maxBytesPerFile ||
      draft.value.attachments.length >= policy.maxFiles
    ) {
      error.value =
        'Arquivo não adicionado. Confira formato, tamanho e quantidade permitidos nesta demonstração.'
      continue
    }
    const localId = crypto.randomUUID()
    draft.value.attachments.push({
      localId,
      name: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      state: 'queued',
    })
    simulateUpload(localId)
  }
}
function send() {
  if (submitting.value) return
  const sentDraft = draft.value
  if (
    (!sentDraft.body.trim() && !sentDraft.attachments.length) ||
    sentDraft.attachments.some((a) => a.state !== 'ready')
  )
    return
  const ticketId = selectedId.value
  const shouldFail = failSend.value
  submitting.value = true
  error.value = ''
  const payload = {
    body: sentDraft.body,
    attachments: sentDraft.attachments.map((a) => ({ ...a })),
    visibility: sentDraft.visibility,
  }
  timers.push(
    setTimeout(() => {
      submitting.value = false
      if (shouldFail) {
        error.value =
          'Falha simulada no envio. Seu rascunho foi preservado. Desative a falha para tentar novamente.'
        return
      }
      messages.value.push({
        ...payload,
        id: crypto.randomUUID(),
        ticketId,
        author: { id: 'agent', name: 'Ana Martins', roleLabel: 'Atendente' },
        createdAt: new Date().toISOString(),
      })
      sentDraft.body = ''
      sentDraft.attachments = []
      toast.success('Mensagem adicionada à demonstração.')
    }, 800),
  )
}
</script>
<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-[var(--panel-padding)]">
      <label class="flex deskli-choice items-center gap-2 text-xs">
        Estado da fila
        <select
          v-model="state"
          class="min-h-[var(--control-height)] rounded-md border border-input bg-background px-2 py-1"
        >
          <option value="ready">Com dados</option>
          <option value="loading">Carregando</option>
          <option value="empty">Vazio</option>
          <option value="error">Erro</option>
          <option value="forbidden">Sem permissão</option>
        </select>
      </label>
      <label class="flex deskli-choice items-center gap-2 text-xs">
        <Checkbox v-model="failSend" />
        Simular falha de envio
      </label>
      <label class="flex deskli-choice items-center gap-2 text-xs">
        <Checkbox v-model="failUpload" />
        Simular falha de anexo
      </label>
    </div>
    <div
      class="grid overflow-hidden rounded-md border lg:grid-cols-[260px_minmax(0,1fr)]"
    >
      <aside
        class="border-r"
        :class="mobileConversation ? 'hidden lg:block' : ''"
      >
        <div class="border-b p-[var(--panel-padding)]">
          <h3 class="mb-2 font-semibold">Chamados</h3>
          <SearchInput
            v-model="query"
            @search="filter = $event"
            @clear="filter = ''"
          />
        </div>
        <div
          v-if="state === 'loading'"
          class="space-y-4 p-[var(--panel-padding)]"
          role="status"
          aria-label="Carregando chamados"
        >
          <Skeleton v-for="n in 3" :key="n" class="h-24 w-full" />
        </div>
        <div v-else-if="state === 'error'" role="alert" class="space-y-3 p-[var(--panel-padding)]">
          <p>Não foi possível carregar a fila.</p>
          <DeskliButton variant="outline" @click="state = 'ready'">
            Tentar novamente
          </DeskliButton>
        </div>
        <p v-else-if="state === 'forbidden'" class="p-[var(--panel-padding)] text-muted-foreground">
          Você não tem permissão para acessar esta fila.
        </p>
        <div
          v-else-if="state === 'empty' || !visibleTickets.length"
          class="space-y-3 p-[var(--panel-padding)]"
        >
          <p>Nenhum chamado encontrado</p>
          <DeskliButton
            variant="outline"
            @click="clearFilters"
          >
            Limpar filtros
          </DeskliButton>
        </div>
        <template v-else>
          <p class="sr-only" role="status">
            {{ visibleTickets.length }} chamados encontrados
          </p>
          <TicketListItem
            v-for="item in visibleTickets"
            :key="item.id"
            :ticket="item"
            :selected="item.id === selectedId"
            :unread="item.unread"
            @select="select"
          />
        </template>
      </aside>
      <div class="min-w-0" :class="mobileConversation ? '' : 'hidden lg:block'">
        <header class="space-y-1 border-b p-[var(--panel-padding)]">
          <DeskliButton
            variant="ghost"
            size="sm"
            class="lg:hidden"
            @click="mobileConversation = false"
          >
            <ArrowLeft class="size-4" />
            Voltar à fila
          </DeskliButton>
          <p class="text-xs text-muted-foreground">
            {{ ticket.code }} · {{ ticket.organizationName }}
          </p>
          <h3 class="text-base font-semibold">{{ ticket.subject }}</h3>
        </header>
        <div class="max-h-96 space-y-4 overflow-y-auto p-2">
          <MessageItem
            v-for="message in messages.filter((m) => m.ticketId === selectedId)"
            :key="message.id"
            :message="message"
          />
        </div>
        <div class="p-[var(--panel-padding)]">
          <ReplyComposer
            v-model="draft"
            :ticket-id="selectedId"
            :can-write-internal="true"
            :upload-policy="policy"
            :submitting="submitting"
            :error="error"
            @change-visibility="changeVisibility"
            @attach="attach"
            @remove-attachment="
              draft.attachments = draft.attachments.filter(
                (a) => a.localId !== $event,
              )
            "
            @retry-attachment="simulateUpload"
            @submit="send"
          />
        </div>
      </div>
    </div>
  </div>
</template>
