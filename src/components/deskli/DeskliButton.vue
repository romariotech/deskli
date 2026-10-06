<script setup lang="ts">
import { Button, type ButtonVariants } from '@/components/ui/button'
import { LoaderCircle } from '@lucide/vue'
withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant']
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)
</script>
<template>
  <Button
    :variant="variant"
    :size="size"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <LoaderCircle
      v-if="loading"
      class="size-4 animate-spin"
      aria-hidden="true"
    />
    <slot v-else name="icon" />
    <slot />
    <span v-if="loading" class="sr-only">Processando</span>
  </Button>
</template>
