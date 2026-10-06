import { test, expect } from '@playwright/test'
import assert from 'node:assert/strict'

test('Login: responsividade, validação e navegação', async ({ page, baseURL }, testInfo) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const base = baseURL

  // Include laptop heights: a width-only check at 1000px missed vertical overflow.
  for (const theme of ['light', 'dark']) {
    for (const [width, height] of [[1280, 600], [1366, 650], [1536, 703], [1024, 600], [768, 600], [375, 600], [1280, 720], [1366, 768], [1440, 900], [1920, 1080], [1024, 768], [768, 800], [390, 844]]) {
      await page.setViewportSize({ width, height })
      await page.goto(`${base}/login`)
      await page.evaluate(theme => localStorage.setItem('deskli.theme', theme), theme)
      await page.reload()
      await page.locator('.auth-form').waitFor()
      await page.evaluate(() => document.fonts.ready)
      for (const state of ['initial', 'validation']) {
        if (state === 'validation') await page.getByRole('button', { name: 'Entrar no deskli' }).click()
        const size = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }))
        assert.ok(size.width <= width && size.height <= height, `login overflow: ${theme} ${width}×${height} ${state}: ${JSON.stringify(size)}`)
      }
      if (width === 1366) await page.screenshot({ path: testInfo.outputPath(`login-fit-${theme}.png`), fullPage: true })
      if (width === 1280 && height === 600) await page.screenshot({ path: testInfo.outputPath(`login-short-${theme}.png`), fullPage: true })
    }
  }
  // Small heights (landscape/virtual keyboard/zoom) must still allow reaching all content.
  await page.setViewportSize({ width: 320, height: 480 })
  await page.goto(`${base}/login`)
  await page.getByRole('button', { name: 'Entrar no deskli' }).click()
  await page.locator('#password').focus()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  assert.equal(await page.getByRole('button', { name: 'Entrar no deskli' }).evaluate(el => el === document.activeElement), true)
  await page.locator('.auth-footer').scrollIntoViewIfNeeded()
  const footer = await page.locator('.auth-footer').boundingBox()
  assert.ok(footer.y >= 0 && footer.y + footer.height <= 481, 'Footer remains reachable on short screens')
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  for (const theme of ['light', 'dark']) {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(`${base}/login`)
      await page.evaluate(theme => localStorage.setItem('deskli.theme', theme), theme)
      await page.reload()
      await page.getByRole('heading', { name: 'Bom ter você por aqui.' }).waitFor()
      await page.evaluate(() => document.fonts.ready)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `login ${theme} ${width}`)
      await page.screenshot({ path: testInfo.outputPath(`login-refresh-${theme}-${width}.png`), fullPage: true })
      await page.getByRole('button', { name: 'Entrar no deskli' }).click()
      await page.getByText('Informe seu e-mail.', { exact: true }).waitFor()
      assert.equal(await page.locator('#email').evaluate(el => el === document.activeElement), true)
      await page.locator('#email').fill('ana@estudio.com')
      await page.locator('#password').fill('demonstracao')
      await page.getByRole('button', { name: 'Mostrar senha' }).click()
      assert.equal(await page.locator('#password').getAttribute('type'), 'text')
      await page.getByRole('button', { name: 'Ocultar senha' }).click()
      await page.getByRole('button', { name: 'Entrar no deskli' }).click()
      await page.waitForURL('**/home')
      await page.getByRole('heading', { name: 'Tudo começa com uma conversa.' }).waitFor()
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `home ${theme} ${width}`)
      await page.screenshot({ path: testInfo.outputPath(`home-refresh-${theme}-${width}.png`), fullPage: true })
      await page.getByRole('link', { name: /DSK-1041/ }).click()
      await page.locator('#playground').waitFor()
      await page.locator('#playground').getByRole('heading', { name: 'Dúvida sobre o relatório mensal' }).waitFor({ state: 'visible' })
    }
  }
  await page.goto(`${base}/login`)
  await page.getByRole('button', { name: 'Aparência', exact: true }).focus()
  await page.keyboard.press('Enter')
  await page.getByRole('menuitemradio', { name: 'Sistema' }).click()
  assert.equal(await page.evaluate(() => localStorage.getItem('deskli.theme')), 'system')
  await page.locator('#email').focus()
  await page.keyboard.press('Tab')
  assert.equal(await page.locator('#password').evaluate(el => el === document.activeElement), true)
  assert.notEqual(await page.locator('#password').evaluate(el => getComputedStyle(el).outlineStyle), 'none')
  assert.deepEqual(errors, [])
  console.log('PASS: login fits 13 viewports × 2 themes including validation; short-screen scrolling; login/home, 2 themes × 4 widths, validation, password visibility, navigation, system theme, keyboard focus, no browser errors')
})

test('Login: redirecionamento, e-mail inválido e tema preservam os campos', async ({ page, baseURL }) => {
  await page.goto(baseURL)
  await expect(page).toHaveURL(/\/login$/)
  const email = page.locator('#email')
  const password = page.locator('#password')
  await email.fill('invalido')
  await password.fill('demonstracao')
  await page.getByRole('button', { name: 'Entrar no deskli' }).click()
  await expect(page.getByText('Informe um e-mail válido.', { exact: true })).toBeVisible()
  await expect(email).toBeFocused()
  await email.fill('demo@example.com')
  for (const theme of ['Escuro', 'Claro', 'Sistema']) {
    await page.getByRole('button', { name: 'Aparência', exact: true }).click()
    await page.getByRole('menuitemradio', { name: theme }).click()
    await expect(email).toHaveValue('demo@example.com')
    await expect(password).toHaveValue('demonstracao')
  }
  await password.focus()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Mostrar senha' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(password).toHaveAttribute('type', 'text')
  await page.keyboard.press('Enter')
  await expect(password).toHaveAttribute('type', 'password')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/home$/)
})
