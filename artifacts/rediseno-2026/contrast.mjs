// Contraste WCAG 2.x de los pares de tokens usados. Uso: node artifacts/rediseno-2026/contrast.mjs
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const T = { bg1: '#FFFBF8', bg2: '#FFF5EE', bg3: '#FDF0E8', card: '#FFFFFF', pri: '#9D405F', priD: '#80304C', txt: '#433A3B', sec: '#695D60', inv: '#FFFBF8', border: '#DCC9C7', focus: '#80304C' }
// [descripcion, primer plano, fondo, minimo]
const pairs = [
  ['texto principal / fondo', T.txt, T.bg1, 4.5], ['texto principal / bg2', T.txt, T.bg2, 4.5], ['texto principal / bg3', T.txt, T.bg3, 4.5], ['texto principal / tarjeta', T.txt, T.card, 4.5],
  ['texto secundario / fondo', T.sec, T.bg1, 4.5], ['texto secundario / bg2 (historia)', T.sec, T.bg2, 4.5], ['texto secundario / bg3 (contacto, hero)', T.sec, T.bg3, 4.5], ['texto secundario / tarjeta', T.sec, T.card, 4.5],
  ['boton primario: inverso / primary', T.inv, T.pri, 4.5], ['boton primario hover/active: inverso / primary-dark', T.inv, T.priD, 4.5],
  ['boton outline: primary-dark / fondo', T.priD, T.bg1, 4.5], ['boton outline: primary-dark / bg3 (contacto)', T.priD, T.bg3, 4.5], ['boton outline: primary-dark / bg2', T.priD, T.bg2, 4.5],
  ['boton outline hover: inverso / primary-dark', T.inv, T.priD, 4.5],
  ['filtro activo: inverso / primary-dark', T.inv, T.priD, 4.5], ['filtro inactivo: texto / tarjeta', T.txt, T.card, 4.5], ['filtro hover: texto / bg3', T.txt, T.bg3, 4.5],
  ['kicker primary-dark / fondo', T.priD, T.bg1, 4.5], ['kicker primary-dark / bg2', T.priD, T.bg2, 4.5], ['kicker primary-dark / bg3', T.priD, T.bg3, 4.5],
  ['logo primary-dark / fondo (grande)', T.priD, T.bg1, 3], ['hero "crochet" primary / bg3 (grande)', T.pri, T.bg3, 3], ['hero "crochet" primary / bg1 (grande)', T.pri, T.bg1, 3],
  ['badge destacado: inverso / primary-dark', T.inv, T.priD, 4.5], ['hero badge primary-dark / tarjeta', T.priD, T.card, 4.5],
  ['pie: inverso / primary-dark', T.inv, T.priD, 4.5], ['enlaces contacto primary-dark / bg3', T.priD, T.bg3, 4.5], ['stats primary-dark / fondo (grande)', T.priD, T.bg1, 3],
  // No texto (3:1)
  ['foco (focus) / fondo', T.focus, T.bg1, 3], ['foco / bg3', T.focus, T.bg3, 3], ['foco / bg2', T.focus, T.bg2, 3], ['foco / tarjeta', T.focus, T.card, 3],
  ['foco sobre pie: inverso / primary-dark', T.inv, T.priD, 3],
  ['borde de control (primary-dark) / fondo', T.priD, T.bg1, 3], ['borde de filtro primary-dark / tarjeta', T.priD, T.card, 3],
  ['DECORATIVO borde #DCC9C7 / fondo (no exigible)', T.border, T.bg1, 0], ['DECORATIVO primary-light / fondo (no exigible)', '#F5C6D4', T.bg1, 0],
]
let fail = 0
for (const [d, f, b, min] of pairs) {
  const r = ratio(f, b)
  const ok = r >= min
  if (!ok) fail++
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${r.toFixed(2).padStart(5)}:1 (min ${min || 'n/a'}) ${d}`)
}
console.log(fail ? `FALLOS: ${fail}` : 'Todos los pares exigibles cumplen')
process.exitCode = fail ? 1 : 0
