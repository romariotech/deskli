import {
  FileText,
  Clock3,
  UserRound,
  CircleCheck,
  ChevronsUp,
  Minus,
  ArrowDown,
} from '@lucide/vue'
export const statusOptions = {
  open: {
    label: 'Aberto',
    icon: FileText,
    class: 'bg-muted text-muted-foreground',
  },
  in_progress: {
    label: 'Em atendimento',
    icon: Clock3,
    class: 'bg-accent text-accent-foreground',
  },
  waiting_customer: {
    label: 'Aguardando cliente',
    icon: UserRound,
    class: 'bg-info-bg text-info-fg',
  },
  resolved: {
    label: 'Resolvido',
    icon: CircleCheck,
    class: 'bg-success-bg text-success-fg',
  },
}
export const priorityOptions = {
  high: {
    label: 'Alta',
    icon: ChevronsUp,
    class: 'bg-danger-bg text-danger-fg',
  },
  medium: {
    label: 'Média',
    icon: Minus,
    class: 'bg-muted text-muted-foreground',
  },
  low: {
    label: 'Baixa',
    icon: ArrowDown,
    class: 'bg-success-bg text-success-fg',
  },
}
