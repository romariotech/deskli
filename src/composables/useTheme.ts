import { ref } from 'vue'
import type { ThemeMode } from '@/types/ticket'
const mode = ref<ThemeMode>('system')
let initialized = false
export function useTheme() {
  function apply() {
    if (typeof window === 'undefined') return
    const dark =
      mode.value === 'dark' ||
      (mode.value === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }
  function setTheme(value: string) {
    if (!['light', 'dark', 'system'].includes(value)) return
    mode.value = value as ThemeMode
    try {
      localStorage.setItem('deskli.theme', value)
    } catch {
      /* Storage can be unavailable. */
    }
    apply()
  }
  if (!initialized && typeof window !== 'undefined') {
    initialized = true
    try {
      const saved = localStorage.getItem('deskli.theme')
      if (saved && ['light', 'dark', 'system'].includes(saved))
        mode.value = saved as ThemeMode
    } catch {
      /* Use system. */
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', apply)
    apply()
  }
  return { mode, setTheme }
}
