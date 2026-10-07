<script setup lang="ts">
import { Sun, Moon, Monitor, ChevronsUpDown } from '@lucide/vue'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/composables/useTheme'
import AbAvatar from './AbAvatar.vue'
defineProps<{ compact?: boolean; iconOnly?: boolean }>()
const { mode, setTheme } = useTheme()
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger
      :class="iconOnly ? 'size-8 justify-center' : [compact ? 'w-auto' : 'w-full', 'min-h-11 gap-2 p-2']"
      class="flex items-center rounded-md text-left hover:bg-secondary"
      :aria-label="compact ? 'Aparência' : 'Perfil e aparência'"
    >
      <AbAvatar v-if="!compact" name="Ana Martins" />
      <span v-if="compact" class="text-xs">Aparência</span>
      <span v-if="!compact && !iconOnly" class="flex-1 text-sm">
        <span class="block font-medium">Ana Martins</span>
        <span class="block text-xs text-muted-foreground">
          Ambiente de demonstração
        </span>
      </span>
      <ChevronsUpDown v-if="!iconOnly" class="size-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent :side="iconOnly ? 'right' : 'bottom'" align="end" class="w-60">
      <DropdownMenuLabel>Aparência</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup
        :model-value="mode"
        @update:model-value="setTheme(String($event))"
      >
        <DropdownMenuRadioItem value="light">
          <Sun class="size-4" />
          Claro
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">
          <Moon class="size-4" />
          Escuro
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system">
          <Monitor class="size-4" />
          Sistema
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
