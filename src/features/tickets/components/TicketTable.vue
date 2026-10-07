<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import type { TicketSummary } from '@/types/ticket'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime } from '@/lib/format'

const props = withDefaults(
  defineProps<{
    tickets: TicketSummary[]
    pageSize?: number
    pageSizeOptions?: number[]
    label: string
  }>(),
  { pageSize: 5, pageSizeOptions: () => [5, 10, 20] },
)
const page = ref(1)
const perPage = ref(props.pageSize)
const pageCount = computed(() =>
  Math.max(1, Math.ceil(props.tickets.length / perPage.value)),
)
const start = computed(() => (page.value - 1) * perPage.value)
const rows = computed(() =>
  props.tickets.slice(start.value, start.value + perPage.value),
)
function changePerPage(value: unknown) {
  perPage.value = Number(value)
  page.value = 1
}
const from = computed(() => (props.tickets.length ? start.value + 1 : 0))
const to = computed(() => start.value + rows.value.length)
watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})
</script>
<template>
  <div class="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
    <div class="min-w-0 rounded-md border">
      <Table class="text-sm">
        <TableCaption class="sr-only">{{ label }}</TableCaption>
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead class="px-3">Chamado</TableHead>
            <TableHead class="px-3">Assunto</TableHead>
            <TableHead class="px-3">Organização</TableHead>
            <TableHead class="px-3">Status</TableHead>
            <TableHead class="px-3">Prioridade</TableHead>
            <TableHead class="px-3">Atualizado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="ticket in rows" :key="ticket.id" class="hover:bg-secondary">
            <TableCell class="px-3 tabular-nums text-muted-foreground">
              {{ ticket.code }}
            </TableCell>
            <TableCell
              class="min-w-56 px-3 font-medium whitespace-normal [overflow-wrap:anywhere]"
            >
              {{ ticket.subject }}
              <span v-if="ticket.unread" class="sr-only">· Não lido</span>
            </TableCell>
            <TableCell class="px-3">{{ ticket.organizationName }}</TableCell>
            <TableCell class="px-3"><StatusBadge :status="ticket.status" /></TableCell>
            <TableCell class="px-3"><PriorityBadge :priority="ticket.priority" /></TableCell>
            <TableCell class="px-3 tabular-nums">
              <time :datetime="ticket.updatedAt">
                {{ formatDateTime(ticket.updatedAt) }}
              </time>
            </TableCell>
          </TableRow>
          <TableRow v-if="!rows.length" class="hover:bg-transparent">
            <TableCell colspan="6" class="px-3 py-6 text-center text-muted-foreground">
              Nenhum chamado encontrado.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p class="text-xs text-muted-foreground" aria-live="polite">
          Mostrando {{ from }}–{{ to }} de {{ tickets.length }} chamados
        </p>
        <div class="flex items-center gap-2">
          <span id="per-page-label" class="text-xs text-muted-foreground">
            Itens por página
          </span>
          <Select :model-value="String(perPage)" @update:model-value="changePerPage">
            <SelectTrigger aria-labelledby="per-page-label" class="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in pageSizeOptions" :key="size" :value="String(size)">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Pagination
        v-slot="{ page: current }"
        v-model:page="page"
        :total="tickets.length"
        :items-per-page="perPage"
        :sibling-count="1"
        show-edges
        class="mx-0 w-auto"
      >
        <nav aria-label="Paginação">
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious aria-label="Página anterior" size="default">
              <ChevronLeft aria-hidden="true" />
              <span class="hidden sm:block">Anterior</span>
            </PaginationPrevious>
            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === current"
                :aria-label="`Página ${item.value}`"
                :aria-current="item.value === current ? 'page' : undefined"
              >
                {{ item.value }}
              </PaginationItem>
              <PaginationEllipsis v-else :index="index">
                <span aria-hidden="true">…</span>
                <span class="sr-only">Mais páginas</span>
              </PaginationEllipsis>
            </template>
            <PaginationNext aria-label="Próxima página" size="default">
              <span class="hidden sm:block">Próxima</span>
              <ChevronRight aria-hidden="true" />
            </PaginationNext>
          </PaginationContent>
        </nav>
      </Pagination>
    </div>
  </div>
</template>
