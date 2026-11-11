// QA independiente (caos). Requiere preview en 127.0.0.1:5301. Ejecutar desde la raiz del worktree.
import { chromium } from '@playwright/test'
import fs from 'node:fs'
const BASE = 'http://127.0.0.1:5301/Amirigumi-Mas_Las_Cosicas_de_Inma/'
const OUT = 'artifacts/rediseno-2026/'
const cat = JSON.parse(fs.readFileSync('src/data/catalog.json', 'utf8'))
const res = {}
const b = await chromium.launch()
for (const [w, h] of [[360, 800], [768, 1024], [1440, 1000]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } })
  const p = await ctx.newPage()
  const errs = [], reqs = []
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()) })
  p.on('pageerror', (e) => errs.push('pageerror ' + e.message))
  p.on('response', (r) => { if (r.status() >= 400) reqs.push(r.status() + ' ' + r.url()) })
  p.on('requestfailed', (r) => reqs.push('FAILED ' + r.url()))
  await p.goto(BASE, { waitUntil: 'networkidle' })
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200)) } window.scrollTo(0, 0) })
  await p.waitForLoadState("networkidle"); await p.waitForTimeout(1500)
  await p.screenshot({ path: `${OUT}qa-${w}.png`, fullPage: true })
  const r = { w }
  r.overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  r.offscreen = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > innerWidth + 1 || b.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('.sr-only,.skip-link') }).slice(0, 8).map(e => e.tagName + '.' + e.className))
  r.fonts = await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight) })
  r.fontStack = await p.evaluate(() => getComputedStyle(document.querySelector('h1')).fontFamily + ' / body ' + getComputedStyle(document.body).fontFamily)
  r.cards = await p.locator('article.card').count()
  r.gridCols = await p.evaluate(() => { const c = document.querySelector('article.card').parentElement; return getComputedStyle(c).gridTemplateColumns.split(' ').length })
  r.imgs = await p.evaluate(() => [...document.querySelectorAll('article.card img')].map(i => ({ src: i.currentSrc, alt: i.alt, ok: i.complete && i.naturalWidth > 0, nw: i.naturalWidth })))
  r.navLinks = await p.evaluate(() => [...document.querySelectorAll('nav a')].map(a => a.getAttribute('href')))
  r.anchors = await p.evaluate(() => Object.fromEntries(['hero', 'catalogo', 'historia', 'sobre-mi', 'contacto'].map(id => [id, !!document.getElementById(id)])))
  r.contactLinks = await p.evaluate(() => [...document.querySelectorAll('#contacto a, footer a')].map(a => a.getAttribute('href').replace(/phone=\d+/, "phone=<num>").split('?')[0]))
  if (w < 900) {
    const t = p.locator('button[aria-expanded]').first()
    await t.click(); r.menuOpen = await t.getAttribute('aria-expanded')
    await p.screenshot({ path: `${OUT}qa/menu-${w}.png` })
    await p.locator('nav a[href="#catalogo"]').first().click()
    r.menuAfterLink = await t.getAttribute('aria-expanded')
  }
  // navegacion por anclas
  r.navScroll = {}
  for (const id of ['catalogo', 'historia', 'sobre-mi', 'contacto']) {
    if (w < 900) { const t = p.locator('button[aria-expanded]').first(); if ((await t.getAttribute('aria-expanded')) !== 'true') await t.click() }
    await p.locator(`nav a[href="#${id}"]`).first().click()
    await p.waitForTimeout(1800)
    r.navScroll[id] = await p.evaluate((id) => { const e = document.getElementById(id).getBoundingClientRect(); return { top: Math.round(e.top), navH: Math.round(document.querySelector('nav').getBoundingClientRect().height) } }, id)
  }
  r.filters = {}
  await p.evaluate(() => window.scrollTo(0, 0))
  const btns = p.locator('.gallery-filters button')
  const nb = await btns.count()
  for (let i = 0; i < nb; i++) {
    const bt = btns.nth(i)
    await bt.click()
    r.filters[(await bt.innerText()).trim()] = { n: await p.locator('article.card').count(), pressed: await bt.getAttribute('aria-pressed') }
  }
  await btns.first().click()
  r.modal = []
  const n = await p.locator('article.card').count()
  for (let i = 0; i < n; i++) {
    const card = p.locator('article.card').nth(i)
    const name = (await card.locator('h3').innerText()).trim()
    const desc = (await card.locator('.card-description').innerText()).trim()
    const opener = card.locator('button').first()
    await opener.scrollIntoViewIfNeeded()
    await opener.focus(); await p.keyboard.press('Enter')
    const dlg = p.locator('[role=dialog]')
    await dlg.waitFor({ timeout: 3000 })
    const title = (await dlg.locator('h3').innerText()).trim()
    const mdesc = (await dlg.locator('.modal-description').innerText()).trim()
    const mimg = await dlg.locator('img').evaluate(i => i.complete && i.naturalWidth > 0)
    const wa = await dlg.locator('a[href*="api.whatsapp.com"]').first().getAttribute('href')
    const geo = await dlg.evaluate(d => { const b = d.getBoundingClientRect(); return { fits: b.top >= -1 && b.bottom <= innerHeight + 1 && b.left >= -1 && b.right <= innerWidth + 1, scrollH: d.scrollHeight, clientH: d.clientHeight, ovY: getComputedStyle(d).overflowY } })
    const overlayOv = await p.evaluate(() => getComputedStyle(document.querySelector('.modal-overlay')).overflowY + '|body:' + getComputedStyle(document.body).overflow)
    let trapped = true
    for (let k = 0; k < 12; k++) { await p.keyboard.press('Tab'); if (!(await dlg.evaluate(d => d.contains(document.activeElement)))) trapped = false }
    for (let k = 0; k < 3; k++) { await p.keyboard.press('Shift+Tab'); if (!(await dlg.evaluate(d => d.contains(document.activeElement)))) trapped = false }
    if (i === 0) await p.screenshot({ path: `${OUT}qa/modal-${w}.png` })
    await p.keyboard.press('Escape')
    await dlg.waitFor({ state: 'detached', timeout: 2000 })
    const restored = await opener.evaluate(e => e === document.activeElement)
    r.modal.push({ name, titleMatch: title === name, descMatch: mdesc === desc, mimg, wa: !!wa, geo, overlayOv, trapped, restored })
  }
  r.errs = errs; r.reqs = reqs
  res['w' + w] = r
  await ctx.close()
}
res.http = []
for (const pr of cat.products) {
  const u = new URL(pr.image, BASE).href
  const rr = await fetch(u)
  res.http.push({ id: pr.id, name: pr.name, u, st: rr.status, ct: rr.headers.get('content-type'), bytes: (await rr.arrayBuffer()).byteLength })
}
res.products = cat.products.length; res.categories = cat.categories.length
res.names = cat.products.map(p => p.name)
fs.writeFileSync(OUT + 'qa/qa-run.json', JSON.stringify(res, null, 1))
await b.close()
console.log('done')
