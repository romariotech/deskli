import { test } from '@playwright/test'
import assert from 'node:assert/strict'
test('Tokens semânticos e contraste', async ({ page, baseURL }, testInfo) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const base = baseURL

  await page.goto(`${base}/design-system`)
  await page.getByRole('heading', { name: 'Design system', exact: true }).waitFor()
  for (const [label, theme] of [['Claro', 'light'], ['Escuro', 'dark']]) {
    await page.getByRole('button', { name: 'Perfil e aparência' }).click()
    await page.getByRole('menuitemradio', { name: label }).click()
    const contrasts = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      const luminance = token => {
        const hex = style.getPropertyValue(`--${token}`).trim().slice(1)
        const rgb = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
          .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
        return rgb.reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0)
      }
      return [
        ['foreground', 'background', 4.5], ['muted-foreground', 'background', 4.5],
        ['brand-text', 'background', 4.5], ['primary-foreground', 'primary', 4.5],
        ['primary-foreground', 'primary-hover', 4.5], ['primary-foreground', 'primary-active', 4.5],
        ['accent-foreground', 'accent', 4.5], ['ring', 'background', 3],
        ['input', 'background', 3], ['danger-fg', 'danger-bg', 4.5],
        ['info-fg', 'info-bg', 4.5], ['warning-fg', 'warning-bg', 4.5],
        ['success-fg', 'success-bg', 4.5],
      ].map(([fg, bg, min]) => {
        const [lo, hi] = [luminance(fg), luminance(bg)].sort((a, b) => a - b)
        return { fg, bg, min, ratio: (hi + .05) / (lo + .05) }
      })
    })
    for (const pair of contrasts) assert.ok(pair.ratio >= pair.min, `${theme}: ${JSON.stringify(pair)}`)
    console.log(theme, JSON.stringify(contrasts))
    await page.screenshot({ path: testInfo.outputPath(`catalog-refined-${theme}.png`), fullPage: true })
    await page.getByRole('button', { name: 'Exemplo de exclusão' }).click()
    await page.getByRole('dialog').waitFor()
    await page.screenshot({ path: testInfo.outputPath(`dialog-refined-${theme}.png`) })
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    await page.getByRole('button', { name: 'Abrir detalhes' }).click()
    await page.getByRole('dialog').getByRole('combobox').click()
    await page.getByRole('option', { name: 'Pedro Lima' }).click()
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 900 })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      await page.screenshot({ path: testInfo.outputPath(`catalog-refined-${theme}-${width}.png`), fullPage: true })
    }
    await page.setViewportSize({ width: 1440, height: 1000 })
  }
  assert.deepEqual(errors, [])
  console.log('Visual tokens: contrast, themes, responsive catalog, dialog and select passed.')
})
