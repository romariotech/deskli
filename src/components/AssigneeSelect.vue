<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldError } from '@/components/ui/field'
import AbAvatar from './AbAvatar.vue'
import type { Assignee } from '@/types/ticket'
defineProps<{
  modelValue: string | null
  options: Assignee[]
  disabled?: boolean
  loading?: boolean
  error?: string
  id?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()
</script>
<template>
  <Select
    :model-value="modelValue ?? '__none'"
    :disabled="disabled || loading"
    @update:model-value="
      emit(
        'update:modelValue',
        String($event) === '__none' ? null : String($event),
      )
    "
  >
    <SelectTrigger
      :id="id"
      class="w-full"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
    >
      <SelectValue :placeholder="loading ? 'Carregando…' : 'Sem responsável'" />
    </SelectTrigger>
    <SelectContent class="max-h-70 max-w-80">
      <SelectItem value="__none">Sem responsável</SelectItem>
      <SelectItem v-for="person in options" :key="person.id" :value="person.id">
        <span class="flex items-center gap-2">
          <AbAvatar :name="person.name" :size="24" />
          {{ person.name }}
          <span v-if="person.teamName" class="text-muted-foreground">
            · {{ person.teamName }}
          </span>
        </span>
      </SelectItem>
    </SelectContent>
  </Select>
  <FieldError v-if="error" :id="`${id}-error`">{{ error }}</FieldError>
</template>
