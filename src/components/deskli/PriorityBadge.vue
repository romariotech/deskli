<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { priorityOptions } from '@/constants/ticket-labels'
const props = withDefaults(
  defineProps<{ priority: string; showIcon?: boolean }>(),
  { showIcon: true },
)
const entry = computed(
  () => priorityOptions[props.priority as keyof typeof priorityOptions],
)
</script>
<template>
  <Badge
    :class="entry?.class || 'bg-muted text-muted-foreground'"
    class="border-transparent whitespace-normal"
  >
    <component :is="entry.icon" v-if="entry && showIcon" aria-hidden="true" />
    {{ entry?.label || 'Prioridade desconhecida' }}
  </Badge>
</template>
