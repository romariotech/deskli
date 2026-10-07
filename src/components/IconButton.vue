<script setup lang="ts">
import { Button } from '@/components/ui/button'
defineProps<{ label: string; disabled?: boolean }>()
</script>
<template>
  <Button
    type="button"
    variant="ghost"
    size="icon"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
  >
    <slot />
  </Button>
</template>
