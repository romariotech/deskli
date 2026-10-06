import { test } from '@playwright/test'
import assert from 'node:assert/strict'

test('Densidade compacta e componentes', async ({ page, baseURL }, testInfo) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const base = baseURL

  for (const theme of ['light', 'dark']) {
    for (const width of [320, 390, 768, 1366]) {
      await page.setViewportSize({ width, height: 768 })
      for (const route of ['login', 'home', 'design-system']) {
        await page.goto(`${base}/${route}`)
        await page.evaluate(theme => localStorage.setItem('deskli.theme', theme), theme)
        await page.reload()
        await page.locator('h1').waitFor()
        await page.evaluate(() => document.fonts.ready)
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} ${theme} ${width}: horizontal overflow`)
        const field = page.locator('[data-slot="input"]').first()
        if (await field.count()) {
          assert.equal((await field.boundingBox()).height, width < 640 ? 44 : 32, `${route}: field height`)
        }
        if (route === 'home' && width === 1366) {
          assert.ok(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), 'Desktop Home fits viewport')
        }
        if (width === 1366 || width === 390) {
          await page.screenshot({ path: testInfo.outputPath(`compact-${route}-${theme}-${width}.png`) })
        }
      }
    }
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto(`${base}/design-system`)
    const density = page.getByLabel('Densidade')
    await density.selectOption('comfortable')
    assert.equal((await page.locator('[data-slot="input"]').first().boundingBox()).height, 44)
    await density.selectOption('compact')
    assert.equal((await page.locator('[data-slot="input"]').first().boundingBox()).height, 32)
    const trigger = page.getByRole('button', { name: 'Exemplo de exclusão' })
    await trigger.click()
    await page.getByRole('dialog').waitFor()
    assert.equal(await page.getByRole('button', { name: 'Cancelar', exact: true }).evaluate(el => el === document.activeElement), true)
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true)
    await page.getByRole('button', { name: 'Abrir detalhes' }).click()
    await page.getByRole('dialog').getByRole('combobox').click()
    await page.getByRole('option', { name: 'Pedro Lima' }).click()
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    const reply = page.locator('#reply-1-public')
    await reply.fill('Rascunho compacto preservado')
    await page.getByRole('tab', { name: 'Nota interna', exact: true }).click()
    await page.locator('#reply-1-internal').fill('Nota da equipe')
    await page.getByRole('tab', { name: 'Resposta pública', exact: true }).click()
    assert.equal(await reply.inputValue(), 'Rascunho compacto preservado')
    await reply.focus()
    assert.notEqual(await reply.evaluate(el => getComputedStyle(el).outlineStyle), 'none')
    await page.locator('#playground').scrollIntoViewIfNeeded()
    await page.screenshot({ path: testInfo.outputPath(`compact-playground-${theme}.png`) })
  }
  assert.deepEqual(errors, [])
  console.log('PASS: compact controls, comfortable density, 3 routes × 4 widths × 2 themes, Home fits desktop, dialogs, select, keyboard focus, drafts, no browser errors')
})
