<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { Search, X, LoaderCircle } from '@lucide/vue'
import { Input } from '@/components/ui/input'
import IconButton from './IconButton.vue'
const props = defineProps<{
  modelValue: string
  loading?: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
}>()
const root = ref<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | undefined
let composing: boolean = false
function startComposition() {
  composing = true
  clearTimeout(timer)
}
function endComposition() {
  composing = false
  schedule()
}
function search() {
  clearTimeout(timer)
  if (!composing) emit('search', props.modelValue)
}
function schedule() {
  clearTimeout(timer)
  if (!composing) timer = setTimeout(search, 300)
}
watch(() => props.modelValue, schedule)
onBeforeUnmount(() => clearTimeout(timer))
function clear() {
  clearTimeout(timer)
  emit('update:modelValue', '')
  emit('clear')
  root.value?.querySelector('input')?.focus()
}
</script>
<template>
  <div ref="root" class="relative">
    <Search
      class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
    />
    <Input
      :model-value="modelValue"
      aria-label="Buscar chamados"
      placeholder="Buscar por assunto, ID ou cliente…"
      class="!pr-11 !pl-9"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', String($event))"
      @keydown.enter.prevent="search"
      @compositionstart="startComposition"
      @compositionend="endComposition"
    />
    <LoaderCircle
      v-if="loading"
      class="absolute top-2.5 right-3 size-4 animate-spin"
    />
    <IconButton
      v-else-if="modelValue"
      label="Limpar busca"
      class="absolute top-0 right-0"
      :disabled="disabled"
      @click="clear"
    >
      <X />
    </IconButton>
  </div>
</template>
