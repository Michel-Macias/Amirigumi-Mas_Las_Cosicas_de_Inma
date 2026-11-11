// Uso: node artifacts/rediseno-2026/shot.mjs <url> <prefijo>
import { chromium } from '@playwright/test'
const [, , url, prefix] = process.argv
const sizes = [[360, 800], [768, 1024], [1440, 1000]]
const b = await chromium.launch()
for (const [w, h] of sizes) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  const errs = []
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
  p.on('requestfailed', (r) => errs.push('FAIL ' + r.url()))
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 80))
    }
    window.scrollTo(0, 0)
  })
  await p.waitForTimeout(500)
  await p.screenshot({ path: `artifacts/rediseno-2026/${prefix}-${w}.png`, fullPage: true })
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  console.log(w, 'overflow', ov, JSON.stringify(errs))
  await p.close()
}
await b.close()
