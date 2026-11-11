import { chromium } from '@playwright/test'
const BASE = 'http://127.0.0.1:5301/Amirigumi-Mas_Las_Cosicas_de_Inma/'
const b = await chromium.launch()
for (const [w, h] of [[360, 800], [768, 1024], [1440, 1000]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage()
  await p.goto(BASE, { waitUntil: 'networkidle' })
  for (const [name, sel] of [['hero', '#hero'], ['catalogo', '#catalogo'], ['historia', '#historia'], ['sobre-mi', '#sobre-mi'], ['contacto', '#contacto'], ['footer', 'footer']]) {
    await p.locator(sel).scrollIntoViewIfNeeded(); await p.evaluate((s) => document.querySelector(s).scrollIntoView({ behavior: 'instant' }), sel)
    await p.waitForTimeout(500)
    await p.screenshot({ path: `artifacts/rediseno-2026/qa/sec-${w}-${name}.png` })
  }
  // texto cortado / solape: elementos con scrollWidth > clientWidth
  const clipped = await p.evaluate(() => [...document.querySelectorAll('h1,h2,h3,p,a,button,li')].filter(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible').map(e => e.tagName + ':' + e.textContent.slice(0, 30)))
  // tamaño tactil
  console.log(w, 'clipped', JSON.stringify(clipped))
}
await b.close()
function r(e){return e.getBoundingClientRect()}
