<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  Plus,
  ArrowUpRight,
  Trash2,
  CircleCheck,
  CircleAlert,
  Info,
  LockKeyhole,
  Search,
} from '@lucide/vue'
import AppLayout from '@/layouts/AppLayout.vue'
import DeskliButton from '@/components/deskli/DeskliButton.vue'
import IconButton from '@/components/deskli/IconButton.vue'
import FormField from '@/components/deskli/FormField.vue'
import AbAvatar from '@/components/deskli/AbAvatar.vue'
import AssigneeSelect from '@/components/deskli/AssigneeSelect.vue'
import SearchInput from '@/components/deskli/SearchInput.vue'
import StatusBadge from '@/components/deskli/StatusBadge.vue'
import PriorityBadge from '@/components/deskli/PriorityBadge.vue'
import TicketPlayground from './TicketPlayground.vue'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { statusOptions, priorityOptions } from '@/constants/ticket-labels'
const density = ref('compact')
const subject = ref('')
const touched = ref(false)
const description = ref('')
const search = ref('')
const assignee = ref<string | null>('ana')
const checked = ref(true)
const enabled = ref(true)
const dialog = ref(false)
const cancelButton = ref<InstanceType<typeof Button>>()
const swatches = [
  { name: 'Marca', token: 'primary', hex: '#B9E58C', class: 'bg-primary' },
  {
    name: 'Fundo',
    token: 'background',
    hex: 'background',
    class: 'bg-background',
  },
  { name: 'Superfície', token: 'card', hex: 'card', class: 'bg-card' },
  {
    name: 'Texto',
    token: 'foreground',
    hex: 'foreground',
    class: 'bg-foreground',
  },
  { name: 'Seleção', token: 'accent', hex: 'accent', class: 'bg-accent' },
  { name: 'Borda', token: 'border', hex: 'border', class: 'bg-border' },
]
const variants = [
  'primary',
  'outline',
  'secondary',
  'ghost',
  'link',
  'destructive-soft',
  'destructive',
] as const
function confirmDelete() {
  dialog.value = false
  toast.success('Exclusão simulada concluída.')
}
function focusCancel(event: Event) {
  event.preventDefault()
  ;(cancelButton.value?.$el as HTMLElement)?.focus()
}
</script>
<template>
  <AppLayout title="Design system">
    <template #actions>
      <span class="rounded-md border px-2 py-1 text-xs text-muted-foreground">
        v1.1.0
      </span>
    </template>
    <main
      :data-density="density"
      class="mx-auto w-full max-w-6xl space-y-4 pb-4"
    >
      <div class="flex flex-wrap items-start justify-between gap-4 pt-2">
        <div>
          <p
            class="mb-2 text-xs font-medium uppercase tracking-widest text-brand-text"
          >
            A linguagem do deskli
          </p>
          <h1 class="text-2xl font-semibold leading-8">Design system</h1>
          <p class="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Clareza em cada interação. Uma biblioteca de fundações e componentes
            para um atendimento simples, consistente e acessível.
          </p>
        </div>
        <label class="grid gap-2 text-xs font-medium">
          Densidade
          <select
            v-model="density"
            class="min-h-[var(--control-height)] rounded-md border border-input bg-background px-3"
          >
            <option value="compact">Compacta · 32px</option>
            <option value="comfortable">Confortável · 44px</option>
          </select>
        </label>
      </div>
      <nav
        aria-label="Seções do design system"
        class="flex flex-wrap gap-x-4 gap-y-1 border-y py-2 text-sm"
      >
        <a
          v-for="section in [
            { id: 'foundations', label: 'Fundações' },
            { id: 'buttons', label: 'Botões' },
            { id: 'forms', label: 'Formulários' },
            { id: 'identity', label: 'Identidade e estados' },
            { id: 'feedback', label: 'Feedback' },
            { id: 'playground', label: 'Atendimento' },
          ]"
          :key="section.id"
          :href="`#${section.id}`"
          class="flex min-h-8 items-center text-muted-foreground hover:text-brand-text"
        >
          {{ section.label }}
        </a>
      </nav>
      <section id="foundations" class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">01 / Fundações</h2>
          <p class="mt-2 text-muted-foreground">
            Zinc como base. Verde suave para ação e seleção. Tokens que acompanham o
            tema.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <div v-for="color in swatches" :key="color.token">
            <div class="h-20 rounded-md border" :class="color.class" />
            <p class="mt-3 font-medium">{{ color.name }}</p>
            <code class="text-xs text-muted-foreground">
              --{{ color.token }}
            </code>
          </div>
        </div>
        <p class="text-xs text-muted-foreground">
          Marca #B9E58C · Light #FFFFFF / #18181B · Dark #09090B / #FAFAFA.
          Alterne a aparência no menu do perfil.
        </p>
        <div class="grid gap-4 border-t pt-4 md:grid-cols-2">
          <div>
            <h3
              class="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Tipografia / DM Sans
            </h3>
            <p class="text-2xl font-semibold leading-8">
              Atendimento com clareza
            </p>
            <p class="mt-3 text-lg font-semibold">
              Cada detalhe tem um propósito
            </p>
            <p class="mt-3 text-sm leading-5">
              Uma interface feita para pessoas, conversas e soluções.
            </p>
            <p class="mt-3 text-xs leading-[18px] text-muted-foreground">
              DSK-1042 · Metadados · 12 / 18px
            </p>
            <p class="mt-3 text-[28px] font-semibold leading-9 tabular-nums">
              128
              <span class="text-xs font-normal text-muted-foreground">
                Métrica · 28 / 36px
              </span>
            </p>
          </div>
          <div>
            <h3
              class="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Geometria e espaçamento
            </h3>
            <div class="flex items-end gap-4">
              <div
                v-for="space in [4, 8, 12, 16, 24, 32]"
                :key="space"
                class="text-center"
              >
                <div
                  class="mx-auto bg-primary"
                  :style="{ width: `${space}px`, height: `${space * 2}px` }"
                />
                <p class="mt-2 text-xs text-muted-foreground">{{ space }}</p>
              </div>
            </div>
            <p class="mt-5 text-sm text-muted-foreground">
              Bordas de 1px · Controles de 4px · Modais de 8px
            </p>
            <div class="mt-4 flex gap-4 text-muted-foreground">
              <Plus class="size-5" />
              <Search class="size-5" />
              <CircleCheck class="size-5" />
              <LockKeyhole class="size-5" />
            </div>
          </div>
        </div>
      </section>
      <section id="buttons" class="catalog-section">
        <h2>02 / Botões e ações</h2>
        <p>
          Uma ação principal por contexto. Variações explícitas, foco visível e
          estados de processamento.
        </p>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          <div v-for="variant in variants" :key="variant" class="space-y-3">
            <p class="text-xs text-muted-foreground">{{ variant }}</p>
            <DeskliButton
              :variant="variant"
              @click="toast(`Variante ${variant} acionada.`)"
            >
              {{
                variant.startsWith('destructive')
                  ? 'Excluir chamado'
                  : variant === 'primary'
                    ? 'Novo chamado'
                    : 'Ver chamado'
              }}
            </DeskliButton>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap items-center gap-4 border-t pt-4">
          <DeskliButton size="sm">Pequeno · 32</DeskliButton>
          <DeskliButton size="md">Padrão · 36</DeskliButton>
          <DeskliButton size="lg">Toque · 44</DeskliButton>
          <DeskliButton disabled>Indisponível</DeskliButton>
          <DeskliButton loading>Enviando…</DeskliButton>
          <IconButton
            label="Adicionar chamado à demonstração"
            @click="toast('Ação de adicionar demonstrada.')"
          >
            <Plus />
          </IconButton>
          <Button as-child variant="link">
            <a href="#playground">
              Explorar atendimento
              <ArrowUpRight />
            </a>
          </Button>
        </div>
      </section>
      <section id="forms" class="catalog-section">
        <h2>03 / Campos e seleção</h2>
        <p>
          Labels persistentes, ajuda contextual e erros associados ao controle.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
          <FormField
            id="subject"
            label="Assunto"
            description="Descreva brevemente o que você precisa."
            :error="
              touched && !subject.trim()
                ? 'Informe o assunto do chamado.'
                : undefined
            "
            required
            v-slot="field"
          >
            <Input
              v-bind="field"
              v-model="subject"
              placeholder="Ex.: Não consigo acessar o painel"
              required
              @blur="touched = true"
            />
          </FormField>
          <FormField id="assignee" label="Responsável" v-slot="field">
            <AssigneeSelect
              v-bind="field"
              v-model="assignee"
              :options="[
                { id: 'ana', name: 'Ana Martins', teamName: 'Suporte' },
                { id: 'pedro', name: 'Pedro Lima', teamName: 'Suporte' },
              ]"
            />
          </FormField>
          <FormField
            id="example-error"
            label="Assunto com erro"
            error="Informe o assunto do chamado."
            v-slot="field"
          >
            <Input v-bind="field" model-value="" readonly />
          </FormField>
          <div class="space-y-2">
            <p class="text-xs font-medium">Busca</p>
            <SearchInput v-model="search" />
          </div>
          <FormField id="description" label="Descrição" v-slot="field">
            <Textarea
              v-bind="field"
              v-model="description"
              placeholder="Conte um pouco mais sobre a solicitação…"
            />
          </FormField>
          <div class="grid gap-4">
            <FormField id="readonly" label="Somente leitura" v-slot="field">
              <Input v-bind="field" model-value="DSK-1042" readonly />
            </FormField>
            <FormField id="disabled" label="Indisponível" v-slot="field">
              <Input v-bind="field" model-value="Campo desabilitado" disabled />
            </FormField>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t pt-4">
          <label class="flex deskli-choice items-center gap-2">
            <Checkbox v-model="checked" />
            Receber notificações
          </label>
          <label class="flex deskli-choice items-center gap-2">
            <Checkbox model-value="indeterminate" />
            Seleção parcial
          </label>
          <label class="flex deskli-choice items-center gap-2 text-muted-foreground">
            <Checkbox disabled />
            Indisponível
          </label>
          <label class="flex deskli-choice items-center gap-3">
            <Switch v-model="enabled" />
            Notificações imediatas
            <span class="text-xs text-muted-foreground">
              {{ enabled ? 'Ativo' : 'Inativo' }}
            </span>
          </label>
          <label class="flex deskli-choice items-center gap-3 text-muted-foreground">
            <Switch disabled />
            Indisponível
          </label>
        </div>
      </section>
      <section id="identity" class="catalog-section">
        <h2>04 / Identidade e estados</h2>
        <p>
          Texto e ícone acompanham a cor. Avatares usam iniciais quando não há
          imagem.
        </p>
        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <h3 class="mb-4 text-xs text-muted-foreground">
              Status do chamado
            </h3>
            <div class="flex flex-wrap gap-2">
              <StatusBadge
                v-for="(_, status) in statusOptions"
                :key="status"
                :status="status"
              />
              <StatusBadge status="unknown" />
            </div>
          </div>
          <div>
            <h3 class="mb-4 text-xs text-muted-foreground">Prioridade</h3>
            <div class="flex flex-wrap gap-2">
              <PriorityBadge
                v-for="(_, priority) in priorityOptions"
                :key="priority"
                :priority="priority"
              />
            </div>
          </div>
          <div>
            <h3 class="mb-4 text-xs text-muted-foreground">
              Avatares · 24 / 32 / 36 / 40
            </h3>
            <div class="flex flex-wrap items-center gap-4">
              <AbAvatar
                v-for="size in [24, 32, 36, 40] as const"
                :key="size"
                name="Ana Martins"
                :size="size"
                :decorative="false"
              />
              <AbAvatar
                name=""
                :decorative="false"
                aria-label="Pessoa sem nome"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="feedback" class="catalog-section">
        <h2>05 / Feedback e sobreposições</h2>
        <p>
          Mensagens objetivas e decisões com contexto. Escape fecha os painéis e
          devolve o foco.
        </p>
        <div class="mb-6 flex flex-wrap gap-3" aria-label="Exemplos de toast">
          <DeskliButton variant="outline" @click="toast.success('Operação simulada concluída.')">
            Toast de sucesso
          </DeskliButton>
          <DeskliButton variant="outline" @click="toast.info('Você está no catálogo de demonstração.')">
            Toast informativo
          </DeskliButton>
          <DeskliButton variant="outline" @click="toast.warning('Revise os dados antes de continuar.')">
            Toast de aviso
          </DeskliButton>
          <DeskliButton variant="outline" @click="toast.error('Falha simulada na operação.', { duration: Infinity })">
            Toast de erro persistente
          </DeskliButton>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <Alert
            class="rounded-md border-success-fg bg-success-bg text-success-fg"
          >
            <CircleCheck />
            <AlertTitle>Resposta enviada</AlertTitle>
            <AlertDescription class="text-inherit">
              Exemplo de confirmação de sucesso.
            </AlertDescription>
          </Alert>
          <Alert
            class="rounded-md border-danger-border bg-danger-bg text-danger-fg"
          >
            <CircleAlert />
            <AlertTitle>Não foi possível enviar</AlertTitle>
            <AlertDescription class="text-inherit">
              Seu rascunho está preservado.
            </AlertDescription>
          </Alert>
          <Alert
            class="rounded-md border-warning-fg bg-warning-bg text-warning-fg"
          >
            <Info />
            <AlertTitle>Atenção à visibilidade</AlertTitle>
            <AlertDescription class="text-inherit">
              Notas internas são restritas à equipe.
            </AlertDescription>
          </Alert>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <Dialog v-model:open="dialog">
            <DialogTrigger as-child>
              <DeskliButton variant="destructive-soft">
                <Trash2 class="size-4" />
                Exemplo de exclusão
              </DeskliButton>
            </DialogTrigger>
            <DialogContent @open-auto-focus="focusCancel">
              <DialogHeader>
                <DialogTitle>Excluir chamado DSK-1042?</DialogTitle>
                <DialogDescription>
                  Esta é uma demonstração. Nenhum chamado real será excluído.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose as-child>
                  <Button ref="cancelButton" variant="outline">Cancelar</Button>
                </DialogClose>
                <DeskliButton
                  variant="destructive"
                  @click="confirmDelete"
                >
                  Excluir
                </DeskliButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Sheet>
            <SheetTrigger as-child>
              <DeskliButton variant="outline">Abrir detalhes</DeskliButton>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Detalhes do chamado</SheetTitle>
                <SheetDescription>
                  Exemplo de painel lateral em telas compactas.
                </SheetDescription>
              </SheetHeader>
              <div class="space-y-6 p-4">
                <div>
                  <p class="mb-2 text-xs text-muted-foreground">Status</p>
                  <StatusBadge status="in_progress" />
                </div>
                <div>
                  <p class="mb-2 text-xs text-muted-foreground">Prioridade</p>
                  <PriorityBadge priority="high" />
                </div>
                <FormField
                  id="sheet-assignee"
                  label="Responsável"
                  v-slot="field"
                >
                  <AssigneeSelect
                    v-bind="field"
                    v-model="assignee"
                    :options="[
                      { id: 'ana', name: 'Ana Martins' },
                      { id: 'pedro', name: 'Pedro Lima' },
                    ]"
                  />
                </FormField>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>
      <section id="playground" class="catalog-section">
        <h2>06 / Atendimento em ação</h2>
        <p>
          Explore a fila, alterne entre resposta e nota interna, anexe arquivos
          e simule um envio. Dados e rascunhos existem apenas nesta página.
        </p>
        <TicketPlayground />
      </section>
      <footer
        class="flex flex-wrap justify-between gap-3 border-t pt-4 text-xs text-muted-foreground"
      >
        <span>deskli · Design system 1.1.0</span>
        <span>Vue 3 · shadcn-vue · Reka UI · Tailwind CSS</span>
      </footer>
    </main>
  </AppLayout>
</template>
