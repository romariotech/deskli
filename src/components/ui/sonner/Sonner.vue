<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useTheme } from '@/composables/useTheme'

const { mode } = useTheme()
</script>

<template>
  <Toaster
    :theme="mode"
    class="deskli-toaster"
    position="bottom-right"
    :duration="5000"
    :visible-toasts="3"
    rich-colors
    close-button
    container-aria-label="Notificações"
    :toast-options="{ closeButtonAriaLabel: 'Fechar notificação' }"
  />
</template>
