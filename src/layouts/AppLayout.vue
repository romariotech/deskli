<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

withDefaults(defineProps<{
  title?: string
}>(), {
  title: 'deskli',
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="min-w-0">
      <header class="flex h-12 shrink-0 items-center gap-3 border-b px-4">
        <SidebarTrigger aria-label="Alternar menu lateral" />
        <Separator orientation="vertical" class="!h-4" />
        <div class="min-w-0 flex-1">
          <slot name="header">
            <span class="block truncate text-sm font-medium">{{ title }}</span>
          </slot>
        </div>
        <slot name="actions" />
      </header>
      <div class="flex min-w-0 flex-1 flex-col gap-4 p-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
