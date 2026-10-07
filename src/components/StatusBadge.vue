<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { statusOptions } from '@/constants/ticket-labels'
const props = withDefaults(
  defineProps<{ status: string; showIcon?: boolean }>(),
  { showIcon: true },
)
const entry = computed(
  () => statusOptions[props.status as keyof typeof statusOptions],
)
</script>
<template>
  <Badge
    :class="entry?.class || 'bg-muted text-muted-foreground'"
    class="border-transparent whitespace-normal"
  >
    <component :is="entry.icon" v-if="entry && showIcon" aria-hidden="true" />
    {{ entry?.label || 'Status desconhecido' }}
  </Badge>
</template>
