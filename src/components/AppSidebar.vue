<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'
import { House, Palette } from '@lucide/vue'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import ThemeMenu from '@/components/ThemeMenu.vue'
const route = useRoute()
const { state, isMobile } = useSidebar()
const iconOnly = computed(() => state.value === 'collapsed' && !isMobile.value)
</script>
<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="px-4 py-3 group-data-[collapsible=icon]:px-2">
      <RouterLink to="/home" aria-label="deskli — Início" class="flex h-8 items-center text-2xl font-semibold tracking-tight group-data-[collapsible=icon]:justify-center">
        <span v-if="iconOnly">d<span class="text-brand-text">.</span></span>
        <span v-else>deskli<span class="text-brand-text">.</span></span>
      </RouterLink>
      <span v-if="!iconOnly" class="text-xs text-muted-foreground">Atendimento com clareza</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem
            v-for="item in [
              { title: 'Início', to: '/home', icon: House },
              { title: 'Design system', to: '/design-system', icon: Palette },
            ]"
            :key="item.to"
          >
            <SidebarMenuButton as-child :tooltip="item.title" :is-active="route.path === item.to">
              <RouterLink :to="item.to" :aria-label="item.title">
                <component :is="item.icon" class="size-5" />
                <span>{{ item.title }}</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter><ThemeMenu :icon-only="iconOnly" /></SidebarFooter>
    <SidebarRail aria-label="Alternar menu lateral" title="Alternar menu lateral" />
  </Sidebar>
</template>
