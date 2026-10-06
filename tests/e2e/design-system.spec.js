import { test } from '@playwright/test'
import assert from 'node:assert/strict'

test('Catálogo: temas, mensagens, anexos e sobreposições', async ({ page, baseURL }, testInfo) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const base = baseURL

  await page.goto(`${base}/design-system`)
  await page
    .getByRole('heading', { name: 'Design system', exact: true })
    .waitFor()
  await page.getByRole('button', { name: 'Perfil e aparência' }).click()
  await page.getByRole('menuitemradio', { name: 'Escuro' }).click()
  assert.equal(
    await page.locator('html').evaluate((el) => el.classList.contains('dark')),
    true,
  )
  await page.screenshot({
    path: testInfo.outputPath('design-system-dark.png'),
    fullPage: true,
  })
  await page.reload()
  assert.equal(
    await page.locator('html').evaluate((el) => el.classList.contains('dark')),
    true,
  )
  await page.getByRole('button', { name: 'Perfil e aparência' }).click()
  await page.getByRole('menuitemradio', { name: 'Claro' }).click()
  await page.screenshot({
    path: testInfo.outputPath('design-system-light.png'),
    fullPage: true,
  })
  await page.getByRole('button', { name: 'Exemplo de exclusão' }).click()
  await page.getByRole('dialog').waitFor()
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    'Cancelar',
  )
  await page.keyboard.press('Escape')
  await page.getByRole('dialog').waitFor({ state: 'hidden' })
  assert.match(
    await page.evaluate(() => document.activeElement.textContent),
    /Exemplo de exclusão/,
  )
  await page.getByRole('button', { name: 'Abrir detalhes' }).click()
  await page.getByRole('dialog').getByRole('combobox').click()
  await page.getByRole('option', { name: 'Pedro Lima' }).click()
  await page.keyboard.press('Escape')
  await page.locator('#reply-1-public').fill('Resposta pública preservada')
  await page.getByRole('tab', { name: 'Nota interna', exact: true }).click()
  await page.locator('#reply-1-internal').fill('Informação privada')
  await page.getByRole('tab', { name: 'Resposta pública', exact: true }).click()
  assert.equal(
    await page.locator('#reply-1-public').inputValue(),
    'Resposta pública preservada',
  )
  await page.getByRole('tab', { name: 'Resposta pública', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  assert.equal(
    await page
      .getByRole('tab', { name: 'Resposta pública', exact: true })
      .getAttribute('aria-selected'),
    'true',
  )
  await page.keyboard.press('Enter')
  assert.equal(
    await page.locator('#reply-1-internal').inputValue(),
    'Informação privada',
  )
  await page.getByRole('tab', { name: 'Resposta pública', exact: true }).click()
  await page
    .getByRole('checkbox', { name: 'Simular falha de envio', exact: true })
    .check()
  await page
    .getByRole('button', { name: 'Enviar resposta', exact: true })
    .click()
  await page.getByText('Falha simulada no envio.', { exact: false }).waitFor()
  assert.equal(
    await page.locator('#reply-1-public').inputValue(),
    'Resposta pública preservada',
  )
  await page
    .getByRole('checkbox', { name: 'Simular falha de envio', exact: true })
    .uncheck()
  await page
    .getByRole('button', { name: 'Enviar resposta', exact: true })
    .dblclick()
  await page.getByText('Mensagem adicionada à demonstração.').waitFor()
  assert.equal(
    await page
      .locator('article')
      .filter({ hasText: 'Resposta pública preservada' })
      .count(),
    1,
  )
  await page.getByRole('tab', { name: 'Nota interna', exact: true }).click()
  assert.equal(
    await page.locator('#reply-1-internal').inputValue(),
    'Informação privada',
  )
  await page
    .getByRole('checkbox', { name: 'Simular falha de anexo', exact: true })
    .check()
  await page
    .getByLabel('Anexar arquivos')
    .setInputFiles({
      name: 'exemplo.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 demo'),
    })
  await page
    .getByText('Falha simulada. Desative a falha e tente novamente.')
    .waitFor()
  assert.equal(
    await page
      .getByRole('button', { name: 'Adicionar nota interna', exact: true })
      .isDisabled(),
    true,
  )
  await page
    .getByRole('checkbox', { name: 'Simular falha de anexo', exact: true })
    .uncheck()
  await page
    .getByRole('button', { name: 'Tentar novamente: exemplo.pdf' })
    .click()
  await page.getByText('KB · Pronto', { exact: false }).waitFor()
  await page
    .getByRole('button', { name: 'Adicionar nota interna', exact: true })
    .click()
  await page
    .locator('article')
    .filter({ hasText: 'Informação privada' })
    .waitFor()
  assert.match(
    await page
      .locator('article')
      .filter({ hasText: 'Informação privada' })
      .textContent(),
    /Visível apenas para a equipe/,
  )
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(150)
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `Overflow at ${width}`,
    )
  }
  await page.setViewportSize({ width: 320, height: 900 })
  await page
    .locator('a')
    .filter({ hasText: 'Não consigo acessar o painel' })
    .click()
  await page.getByRole('button', { name: 'Voltar à fila' }).waitFor()
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
    'Mobile conversation overflow',
  )
  await page.screenshot({
    path: testInfo.outputPath('design-system-mobile.png'),
    fullPage: true,
  })
  await page.locator('#reply-1-internal').scrollIntoViewIfNeeded()
  await page.screenshot({ path: testInfo.outputPath('design-system-mobile-detail.png') })
  await page.getByRole('button', { name: 'Voltar à fila' }).click()
  assert.deepEqual(errors, [])
  console.log(
    'PASS: themes, persistence, dialogs, nested select, keyboard tabs, drafts, failed send, duplicate prevention, upload retry, private note, five widths, mobile navigation, no browser errors.',
  )
})
