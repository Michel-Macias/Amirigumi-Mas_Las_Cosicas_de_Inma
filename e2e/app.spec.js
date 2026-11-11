import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const BASE = '/Amirigumi-Mas_Las_Cosicas_de_Inma/'
const catalog = JSON.parse(readFileSync('src/data/catalog.json', 'utf8'))
const CATALOG_SHA256 = '68e4d6549633838af88cc23b40825ea7169eec87b30c23c19c54e6a78d520d1a'

test.beforeEach(async ({ page }) => {
  // Evita mensajes reales: ningun enlace externo se sigue en estas pruebas.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort())
  await page.goto(BASE)
})

test.describe('catalogo (caracterizacion)', () => {
  test('catalog.json inmutable byte a byte', () => {
    const sha = createHash('sha256').update(readFileSync('src/data/catalog.json')).digest('hex')
    expect(sha).toBe(CATALOG_SHA256)
  })

  test('muestra todos los productos y cada filtro muestra solo su categoria', async ({ page }) => {
    const cards = page.locator('#catalogo article')
    await expect(cards).toHaveCount(catalog.products.length)
    for (const cat of catalog.categories) {
      const expected = catalog.products.filter((p) => p.category === cat.id).length
      await page.getByRole('button', { name: new RegExp(cat.name) }).click()
      await expect(cards).toHaveCount(expected)
    }
    await page.getByRole('button', { name: /Todos/ }).click()
    await expect(cards).toHaveCount(catalog.products.length)
  })

  test('el filtro activo expone aria-pressed', async ({ page }) => {
    const todos = page.getByRole('button', { name: /Todos/ })
    await expect(todos).toHaveAttribute('aria-pressed', 'true')
    const bebe = page.getByRole('button', { name: /Para Bebé/ })
    await bebe.click()
    await expect(bebe).toHaveAttribute('aria-pressed', 'true')
    await expect(todos).toHaveAttribute('aria-pressed', 'false')
  })

  test('anchors y enlaces de contacto conservados', async ({ page }) => {
    for (const id of ['hero', 'catalogo', 'historia', 'sobre-mi', 'contacto']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    }
    await expect(page.locator(`a[href^="mailto:${catalog.contact.email}"]`).first()).toBeVisible()
    await expect(page.locator(`a[href="${catalog.contact.facebook}"]`).first()).toBeAttached()
    await expect(page.locator('a[href^="https://api.whatsapp.com/send"]').first()).toBeAttached()
  })

  test('todas las imagenes de producto cargan y decodifican bajo la base', async ({ page }) => {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
    })
    const result = await page.evaluate(async () => {
      const imgs = [...document.querySelectorAll('img')]
      const out = []
      for (const i of imgs) {
        try { await i.decode() } catch { /* se informa abajo */ }
        out.push({ src: i.currentSrc, ok: i.naturalWidth > 0, alt: i.alt })
      }
      return out
    })
    expect(result.filter((r) => !r.ok)).toEqual([])
    expect(result.every((r) => r.src.includes('/Amirigumi-Mas_Las_Cosicas_de_Inma/images/'))).toBe(true)
    const urls = new Set(result.map((r) => r.src.split('/images/')[1]))
    for (const p of catalog.products) expect(urls.has(p.image.replace('images/', ''))).toBe(true)
  })
})

test.describe('navegacion y teclado', () => {
  test('hay skip-link como primer elemento enfocable', async ({ page }) => {
    await page.keyboard.press('Tab')
    const f = page.locator(':focus')
    await expect(f).toHaveAttribute('href', '#contenido')
    await expect(f).toBeVisible()
    await expect(page.locator('#contenido')).toHaveCount(1)
  })

  test('los enlaces de navegacion tienen href y son enfocables', async ({ page }) => {
    for (const [name, id] of [['Catálogo', 'catalogo'], ['El Arte', 'historia'], ['Sobre Mí', 'sobre-mi'], ['Contacto', 'contacto']]) {
      const link = page.getByRole('navigation').getByRole('link', { name, exact: true })
      await expect(link).toHaveAttribute('href', `#${id}`)
    }
  })

  test('menu movil con aria-expanded y aria-controls', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    const toggle = page.getByRole('button', { name: /Menú/ })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    const controls = await toggle.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator(`#${controls}`)).toBeVisible()
    await page.locator(`#${controls}`).getByRole('link', { name: 'Catálogo' }).click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(page).toHaveURL(/#catalogo$/)
  })
})

test.describe('modal de detalle', () => {
  test('abre con teclado, atrapa foco, cierra con Escape y restaura foco', async ({ page }) => {
    const first = page.locator('#catalogo article').first().getByRole('button', { name: /Ver Detalles/ })
    await first.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(dialog).toHaveAccessibleName(catalog.products[0].name)
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
    }
    await page.keyboard.press('Shift+Tab')
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(first).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })

  test('cierra con el boton y con clic en el fondo', async ({ page }) => {
    const open = () => page.locator('#catalogo article').nth(1).getByRole('button', { name: /Ver Detalles/ }).click()
    await open()
    await page.getByRole('dialog').getByRole('button', { name: /Cerrar/ }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await open()
    await page.mouse.click(5, 5)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
})

test.describe('movimiento', () => {
  test('sin animaciones perpetuas', async ({ page }) => {
    const infinite = await page.evaluate(() =>
      document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations === Infinity).length,
    )
    expect(infinite).toBe(0)
  })

  test('reduced-motion: sin transiciones, sin scroll suave', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
    const card = page.locator('#catalogo article').first()
    await card.scrollIntoViewIfNeeded()
    await card.hover()
    expect(await card.evaluate((e) => getComputedStyle(e).transform)).toBe('none')
    const dur = await page.getByRole('button', { name: /Todos/ }).evaluate((e) => getComputedStyle(e).transitionDuration)
    expect(parseFloat(dur)).toBeLessThanOrEqual(0.001)
    // scroll programatico: el enlace de menu debe saltar sin animacion
    await page.getByRole('navigation').getByRole('link', { name: 'Contacto', exact: true }).click()
    await expect.poll(() => page.evaluate(() => document.getElementById('contacto').getBoundingClientRect().top)).toBeLessThan(120)
  })
})

for (const [w, h] of [[360, 800], [768, 1024], [1440, 1000]]) {
  test(`sin overflow horizontal a ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h })
    await page.reload()
    const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(d).toBeLessThanOrEqual(0)
  })
}

test('columnas del catalogo 1/2/3 a 360/768/1440', async ({ page }) => {
  for (const [w, cols] of [[360, 1], [768, 2], [1440, 3]]) {
    await page.setViewportSize({ width: w, height: 900 })
    const n = await page.evaluate(() => {
      const tops = [...document.querySelectorAll('#catalogo article')].map((a) => Math.round(a.getBoundingClientRect().top + window.scrollY))
      return tops.filter((t) => t === tops[0]).length
    })
    expect(n, `ancho ${w}`).toBe(cols)
  }
})

test.describe('accesibilidad (axe)', () => {
  for (const [w, h] of [[360, 800], [1440, 1000]]) {
    test(`pagina sin violaciones a ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h })
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
      expect(res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`)).toEqual([])
    })
  }

  test('modal abierto sin violaciones', async ({ page }) => {
    await page.locator('#catalogo article').first().getByRole('button', { name: /Ver Detalles/ }).click()
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    expect(res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`)).toEqual([])
  })
})
