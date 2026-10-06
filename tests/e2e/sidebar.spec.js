import { test, expect } from '@playwright/test'
import assert from 'node:assert/strict'

test('Sidebar recolhível, navegação e mobile', async ({ page, baseURL }, testInfo) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const base = baseURL

  for (const theme of ['light', 'dark']) {
    await page.context().clearCookies()
    await page.goto(`${base}/home`)
    await page.evaluate(theme => localStorage.setItem('deskli.theme', theme), theme)
    await page.reload()
    const sidebar = page.locator('[data-slot="sidebar"][data-state]')
    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
    await page.getByRole('button', { name: 'Alternar menu lateral', exact: true }).first().click()
    await expect(sidebar).toHaveAttribute('data-collapsible', 'icon')
    const container = page.locator('[data-slot="sidebar-container"]')
    await expect.poll(async () => Math.round((await container.boundingBox()).width)).toBe(48)
    for (const name of ['Início', 'Design system']) {
      const link = sidebar.getByRole('link', { name, exact: true })
      await expect(link).toBeVisible()
      await expect(link.locator('svg')).toBeVisible()
      await page.keyboard.press('Tab')
      await link.focus()
      assert.notEqual(await link.evaluate(el => getComputedStyle(el).outlineStyle), 'none')
      const box = await link.boundingBox()
      assert.ok(box.x >= 0 && box.x + box.width <= 48)
    }
    await sidebar.getByRole('link', { name: 'Design system', exact: true }).hover()
    await expect(page.locator('[data-slot=tooltip-content]').filter({ hasText: 'Design system' })).toBeVisible()
    await expect(page.locator('[data-slot=tooltip-content]').filter({ hasText: 'Design system' })).toContainText('Design system')
    await page.getByRole('button', { name: 'Perfil e aparência' }).click()
    await expect(page.getByRole('menuitemradio', { name: 'Sistema' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('menu')).toBeHidden()
    await page.mouse.move(600, 100)
    await expect(page.locator('[data-slot=tooltip-content]').filter({ hasText: 'Design system' })).toBeHidden()
    await page.screenshot({ path: testInfo.outputPath(`sidebar-icons-${theme}.png`) })
    await sidebar.getByRole('link', { name: 'Design system', exact: true }).click()
    await page.waitForURL('**/design-system')
    await expect(sidebar).toHaveAttribute('data-collapsible', 'icon')
    await page.reload()
    await expect(sidebar).toHaveAttribute('data-collapsible', 'icon')
    await page.keyboard.press('Control+b')
    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
    for (const width of [768, 1024]) {
      await page.setViewportSize({ width, height: 768 })
      await expect(sidebar).toBeVisible()
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByRole('button', { name: 'Alternar menu lateral', exact: true }).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Início', exact: true })).toBeVisible()
    await expect(dialog.getByText('Atendimento com clareza')).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath(`sidebar-mobile-${theme}.png`) })
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await page.setViewportSize({ width: 1366, height: 768 })
  }
  assert.deepEqual(errors, [])
  console.log('PASS: icon rail, visible icons, tooltips, keyboard, profile menu, navigation and reload persistence, tablet and mobile, both themes')
})
