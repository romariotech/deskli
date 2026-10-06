import { test, expect } from '@playwright/test'
import assert from 'node:assert/strict'

test('Toasts: cores, duração e fechamento', async ({ page, baseURL }, testInfo) => {
  await page.goto(`${baseURL}/design-system`)
  await page.locator('h1').waitFor()
  // Exercise the global host, semantic colors, persistence and keyboard access.
  assert.equal(await page.locator('[data-sonner-toaster]').count(), 1)
  for (const theme of ['Escuro', 'Claro']) {
    await page.getByRole('button', { name: 'Perfil e aparência' }).click()
    await page.getByRole('menuitemradio', { name: theme }).click()
    for (const [label, type, token] of [
      ['Toast de sucesso', 'success', '--success-bg'],
      ['Toast informativo', 'info', '--info-bg'],
      ['Toast de aviso', 'warning', '--warning-bg'],
      ['Toast de erro persistente', 'error', '--danger-bg'],
    ]) {
      const trigger = page.getByRole('button', { name: label, exact: true })
      await trigger.focus()
      await page.keyboard.press('Enter')
      const toast = page.locator(`[data-sonner-toast][data-type="${type}"]`)
      await toast.waitFor()
      assert.equal(await trigger.evaluate(el => el === document.activeElement), true)
      const matchesToken = await toast.evaluate((el, token) => {
        const probe = document.createElement('span')
        probe.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(token)
        document.body.append(probe)
        const matches = getComputedStyle(el).backgroundColor === getComputedStyle(probe).backgroundColor
        probe.remove()
        return matches
      }, token)
      assert.equal(matchesToken, true, `${theme}: ${type} semantic color`)
      if (type === 'error' && theme === 'Claro') {
        await page.waitForTimeout(5200)
        assert.equal(await toast.isVisible(), true, 'Error must persist beyond default duration')
        await page.setViewportSize({ width: 320, height: 900 })
        await page.screenshot({ path: testInfo.outputPath('sonner-mobile.png') })
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
        await page.setViewportSize({ width: 1440, height: 1000 })
      }
      if (type === 'success') {
        await page.screenshot({ path: testInfo.outputPath(`sonner-${theme === 'Escuro' ? 'dark' : 'light'}.png`) })
      }
      await toast.getByRole('button', { name: 'Fechar notificação' }).focus()
      await page.keyboard.press('Enter')
      await toast.waitFor({ state: 'detached' })
    }
  }
})

test('Toasts: acesso por Alt+T', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/design-system`)
  await page.getByRole('button', { name: 'Toast de sucesso', exact: true }).click()
  await expect(page.locator('[data-sonner-toast]')).toBeVisible()
  await page.keyboard.press('Alt+KeyT')
  await expect.poll(() => page.evaluate(() => Boolean(document.activeElement.closest('[data-sonner-toaster]')))).toBe(true)
})
