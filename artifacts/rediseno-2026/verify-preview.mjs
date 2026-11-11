// Verificacion sobre el BUILD servido con vite preview. Uso: node artifacts/rediseno-2026/verify-preview.mjs <base-url>
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'
const origin = process.argv[2] || 'http://127.0.0.1:5197'
const BASE = '/Amirigumi-Mas_Las_Cosicas_de_Inma/'
const catalog = JSON.parse(readFileSync('src/data/catalog.json', 'utf8'))
const b = await chromium.launch()
const report = { origin, products: catalog.products.length, viewports: {} }
for (const [w, h] of [[360, 800], [768, 1024], [1440, 1000]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } })
  const p = await ctx.newPage()
  const problems = []
  const external = []
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`${m.type()}: ${m.text()}`) })
  p.on('pageerror', (e) => problems.push('pageerror: ' + e.message))
  p.on('requestfailed', (r) => { if (!/^https?:\/\/(?!127)/.test(r.url())) problems.push('requestfailed: ' + r.url()) })
  p.on('response', (r) => { if (r.url().startsWith(origin) && r.status() >= 400) problems.push(`HTTP ${r.status()} ${r.url()}`) })
  await p.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => { external.push(r.request().url().slice(0, 60)); return r.abort() })
  await p.goto(origin + BASE, { waitUntil: 'networkidle' })
  const fontsFromGoogle = await p.evaluate(() => performance.getEntriesByType('resource').filter((e) => /googleapis|gstatic/.test(e.name)).length)
  const fontsLocal = await p.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`))
  // Cada producto visible, con imagen decodificada y URL bajo la base
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } })
  const cards = await p.evaluate(async () => {
    const out = []
    for (const a of document.querySelectorAll('#catalogo article')) {
      const i = a.querySelector('img'); try { await i.decode() } catch { /* */ }
      out.push({ title: a.querySelector('h3').textContent, ok: i.naturalWidth > 0, src: i.currentSrc })
    }
    return out
  })
  const allImgs = await p.evaluate(async () => { const r = []; for (const i of document.images) { try { await i.decode() } catch { /* */ } r.push(i.naturalWidth > 0) } return r })
  // Filtros
  const counts = {}
  for (const c of catalog.categories) {
    await p.getByRole('button', { name: new RegExp(c.name) }).click()
    counts[c.id] = await p.locator('#catalogo article').count()
  }
  await p.getByRole('button', { name: /Todos/ }).click()
  // Modal por producto: abre, Escape, foco devuelto
  let modalOk = 0
  const n = await p.locator('#catalogo article').count()
  for (let k = 0; k < n; k++) {
    const btn = p.locator('#catalogo article').nth(k).getByRole('button', { name: /Ver Detalles/ })
    await btn.scrollIntoViewIfNeeded(); await btn.click()
    const t = await p.getByRole('dialog').getByRole('heading').textContent()
    await p.keyboard.press('Escape')
    const back = await btn.evaluate((e) => e === document.activeElement)
    if (t === catalog.products[k].name && back) modalOk++
  }
  // Enlaces externos: solo se validan, nunca se siguen
  const hrefs = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))
  const wa = hrefs.filter((h) => h.startsWith('https://api.whatsapp.com/send?phone='))
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300)
  await p.screenshot({ path: `artifacts/rediseno-2026/despues-${w}.png`, fullPage: true })
  report.viewports[w] = {
    cards: cards.length, cardsImgOk: cards.filter((c) => c.ok && c.src.includes(origin + BASE + 'images/')).length,
    allImagesOk: `${allImgs.filter(Boolean).length}/${allImgs.length}`, filterCounts: counts,
    filterExpected: Object.fromEntries(catalog.categories.map((c) => [c.id, catalog.products.filter((x) => x.category === c.id).length])),
    modalOk: `${modalOk}/${n}`, whatsappLinks: wa.length, overflow, googleFontRequests: fontsFromGoogle, fontsLoaded: fontsLocal,
    externalRequestsBlocked: external.length, consoleOrNetworkProblems: problems,
  }
  await ctx.close()
}
await b.close()
console.log(JSON.stringify(report, null, 1))
