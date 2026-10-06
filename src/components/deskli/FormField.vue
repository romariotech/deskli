<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { CircleAlert } from '@lucide/vue'
defineProps<{
  id: string
  label: string
  description?: string
  error?: string
  required?: boolean
}>()
</script>
<template>
  <div class="grid gap-1.5">
    <Label :for="id" class="text-xs font-medium">
      {{ label }}
      <span v-if="required">(obrigatório)</span>
    </Label>
    <slot
      :id="id"
      :aria-invalid="Boolean(error)"
      :aria-describedby="
        [description ? `${id}-help` : '', error ? `${id}-error` : '']
          .filter(Boolean)
          .join(' ') || undefined
      "
    />
    <p
      v-if="description"
      :id="`${id}-help`"
      class="text-xs text-muted-foreground"
    >
      {{ description }}
    </p>
    <p
      v-if="error"
      :id="`${id}-error`"
      class="flex items-center gap-1 text-xs text-danger-fg"
    >
      <CircleAlert class="size-3.5" />
      {{ error }}
    </p>
  </div>
</template>
