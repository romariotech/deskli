<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { UserRound } from '@lucide/vue'
const props = withDefaults(
  defineProps<{
    name: string
    src?: string
    size?: 24 | 32 | 36 | 40
    decorative?: boolean
  }>(),
  { size: 32, decorative: true },
)
const initials = computed(() =>
  props.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((x) => x[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)
</script>
<template>
  <Avatar
    :style="{ width: `${size}px`, height: `${size}px` }"
    class="shrink-0 rounded-full"
    :aria-label="decorative ? undefined : name"
    :aria-hidden="decorative || undefined"
  >
    <AvatarImage
      v-if="src"
      :src="src"
      :alt="decorative ? '' : name"
      class="object-cover"
    />
    <AvatarFallback class="rounded-full bg-muted text-xs font-medium">
      {{ initials }}
      <UserRound v-if="!initials" class="size-4" />
    </AvatarFallback>
  </Avatar>
</template>
