import { chromium } from '@playwright/test'
const BASE = 'http://127.0.0.1:5301/Amirigumi-Mas_Las_Cosicas_de_Inma/'
const b = await chromium.launch()
const lum = (c) => { const [r,g,bb] = c.map(v => { v/=255; return v<=0.03928? v/12.92 : ((v+0.055)/1.055)**2.4 }); return 0.2126*r+0.7152*g+0.0722*bb }
const out = {}
for (const w of [360, 1440]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 800 } })).newPage()
  await p.goto(BASE, { waitUntil: 'networkidle' })
  // email wrap
  out['emailWrap' + w] = await p.evaluate(() => { const a = document.querySelector('#contacto a[href^="mailto"]:not(.btn)'); if(!a) return 'n/a'; const r = document.createRange(); r.selectNodeContents(a); const rects=[...r.getClientRects()]; return { lines: new Set(rects.map(x=>Math.round(x.top))).size, text: a.textContent, fs: getComputedStyle(a).fontSize } })
  // contraste computado de todos los nodos de texto
  const res = await p.evaluate(() => {
    const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number)
    const bgOf = (el) => { let e = el; let layers=[]; while (e) { const c = parse(getComputedStyle(e).backgroundColor); if (c.length >= 3 && (c[3] === undefined || c[3] > 0)) { return c.slice(0,3) } e = e.parentElement } return [255,251,248] }
    const L = (c) => { const [r,g,b] = c.map(v => { v/=255; return v<=0.03928? v/12.92 : ((v+0.055)/1.055)**2.4 }); return 0.2126*r+0.7152*g+0.0722*b }
    const bad = []; let n = 0
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const seen = new Set()
    while (w.nextNode()) {
      const t = w.currentNode; if (!t.textContent.trim()) continue
      const el = t.parentElement; if (seen.has(el)) continue; seen.add(el)
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); if (!r.width || cs.visibility==='hidden' || el.closest('.sr-only')) continue
      const fg = parse(cs.color); const bg = bgOf(el)
      if (el.closest('.card-image,.hero-visual') ) { continue }
      const a = fg[3] ?? 1
      const f = fg.slice(0,3).map((v,i)=> v*a + bg[i]*(1-a))
      const [x,y] = [L(f), L(bg)].sort((p,q)=>q-p); const ratio = (x+0.05)/(y+0.05)
      const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700
      const large = size >= 24 || (size >= 18.66 && bold)
      n++
      if (ratio < (large ? 3 : 4.5)) bad.push({ txt: el.textContent.trim().slice(0,30), ratio: +ratio.toFixed(2), size, fg: cs.color, bg: bg.join(',') })
    }
    return { n, bad }
  })
  out['contrast' + w] = res
  // foco visible: outline en tab sobre varios controles
  const foc = []
  for (let i = 0; i < 14; i++) { await p.keyboard.press('Tab'); foc.push(await p.evaluate(() => { const e=document.activeElement; const cs=getComputedStyle(e); const r=e.getBoundingClientRect(); return { t:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,18), ow: cs.outlineWidth, os: cs.outlineStyle, oc: cs.outlineColor, vis: r.width>0 } })) }
  out['focus' + w] = foc.filter(f => f.vis && (f.os === 'none' || parseFloat(f.ow) < 2))
  out['focusN' + w] = foc.length
  // reduced motion
  const rm = await (await b.newContext({ viewport: { width: w, height: 800 }, reducedMotion: 'reduce' })).newPage()
  await rm.goto(BASE, { waitUntil: 'networkidle' })
  out['rm' + w] = await rm.evaluate(() => ({ scroll: getComputedStyle(document.documentElement).scrollBehavior, anims: document.getAnimations().length, longTr: [...document.querySelectorAll('*')].filter(e => { const d = getComputedStyle(e).transitionDuration; return d.split(',').some(x => parseFloat(x) > 0.01) }).length }))
  const nm = await p.evaluate(() => ({ scroll: getComputedStyle(document.documentElement).scrollBehavior, anims: document.getAnimations().filter(a=>a.playState==='running').map(a=>a.effect.getTiming().iterations) }))
  out['normalMotion' + w] = nm
  // hover boton primario
  const btn = p.locator('#hero .btn-primary').first()
  const before = await btn.evaluate(e => getComputedStyle(e).backgroundColor)
  await btn.hover(); await p.waitForTimeout(400)
  out['hover' + w] = { before, after: await btn.evaluate(e => getComputedStyle(e).backgroundColor) }
  // zoom/reflow 200%: viewport 640 simula 1280@200%
}
console.log(JSON.stringify(out, null, 1))
await b.close()
