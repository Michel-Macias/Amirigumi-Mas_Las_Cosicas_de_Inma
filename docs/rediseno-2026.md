# Rediseño 2026 · Dirección artesanal de Las Cosicas de Inma

> Documento de investigación y dirección. Tarea `t_471bdd68` (Scribe).
> Fecha de consulta de todas las fuentes: **2026-11-11**.
> Este documento no implementa UI ni ejecuta build, dev ni tests. Esa fase corresponde a Frontend (`t_929255f9`).

## 1. Contexto y baseline

| Campo | Valor |
|---|---|
| Repo canónico (solo lectura) | `Amirigumi-Mas_Las_Cosicas_de_Inma`, rama `main` |
| SHA baseline | `1b7086701f5c261c77e844990d43cc38d3239ca6` |
| Worktree de escritura | `.worktrees/rediseno-2026-scribe` |
| Rama | `wt/t_471bdd68` (partiendo del SHA baseline) |
| Stack verificado en `package.json` | React `^19.2.0`, Vite `^7.2.4`, ESLint `^9.39.1`, CSS nativo |
| Base de Vite (`vite.config.js`) | `/Amirigumi-Mas_Las_Cosicas_de_Inma/` (invariable) |
| Instrucciones de agente en el repo | No hay `AGENTS.md` ni `CLAUDE.md` en el worktree (verificado con búsqueda de ficheros) |
| Documentación previa | Solo `README.md`; no hay carpeta `docs/` previa |

**Estado del código revisado (lectura, sin cambios):**

- `src/index.css` (1513 líneas): design tokens en `:root`, reset, tipografía, botones, tarjetas, navegación, hero, historia, catálogo, contacto, footer, modal y animaciones.
- `src/App.jsx` (583 líneas): componentes `Navbar`, `Hero`, `Gallery` (con filtros), `ProductCard`, `History`, `About`, `Contact`, `Footer`, `Modal`.
- `src/data/catalog.json`: 172 líneas, categorías y productos. **Inmutable byte a byte**; no se ha modificado.
- `src/App.css`: no revisado en esta fase. Frontend debe revisarlo antes de decidir si se elimina o se conserva.

## 2. Hallazgos del código actual

Estos hallazgos vienen de leer el código. No son opiniones de tendencia.

| # | Hallazgo | Fichero | Implicación |
|---|---|---|---|
| H1 | Los enlaces de navegación son `<a>` **sin `href`** con `onClick`. No son enfocables con teclado. | `App.jsx` l. 56–59 | Incumple la operabilidad por teclado (WCAG 2.1.1). Hay que corregirlo. |
| H2 | El botón de menú móvil no expone `aria-expanded` ni `aria-controls`. | `App.jsx` l. 68–76 | Estado no comunicado a lectores de pantalla. |
| H3 | El modal no tiene `role="dialog"`, `aria-modal` ni manejo de `Escape`. No hay trampa de foco ni restauración de foco al cerrar. | `App.jsx` l. 505–553 | Requisito central del brief sin cubrir. |
| H4 | El modal fija `body.style.overflow = 'hidden'` y al desmontar lo restaura a `'auto'` sin guardar el valor previo. | `App.jsx` l. 506–511 | Frágil si hay más de un bloqueo de scroll. |
| H5 | `.hero-image-float-1` y `-2` usan `animation: floatSoft 8s ease-in-out infinite`. Es movimiento perpetuo. | `index.css` l. 748–774 | Contradice la decisión `MOTION_INTENSITY=3` y "sin movimiento perpetuo". |
| H6 | `.card:hover` aplica `translateY(-10px)` y `.card:hover .card-image img` aplica `scale(1.1)`. | `index.css` l. 358–380 | Movimiento amplio para una intensidad 3. Hay que reducirlo a feedback sutil. |
| H7 | No existe ninguna regla `@media (prefers-reduced-motion)` en `index.css`. | búsqueda completa del fichero | Requisito AA/AAA sin cubrir. |
| H8 | `.card-image` usa `aspect-ratio: 1` y `object-fit: cover`. Recorta las fotos. | `index.css` l. 364–376 | Contradice "fotos completas sin recortes destructivos". |
| H9 | `.history::before` aplica un patrón SVG de fondo como pseudo-elemento absoluto sobre los 200 px superiores de la sección, sin `z-index`. Al estar posicionado, se pinta por encima del contenido estático de la sección (con opacidad 0.03). `.stitch-pattern` está definido pero no se encontró su uso en `App.jsx`. | `index.css` l. 927–936, 241–243 | La textura no debe solaparse con el texto. Hay que retirarla o moverla fuera del contenido. |
| H10 | La fuente se carga con `@import` de Google Fonts. | `index.css` l. 8 | El brief pide autoalojar Cormorant Garamond y Nunito con licencias. |
| H11 | El botón de WhatsApp usa `--color-whatsapp` (`#25D366`) como color de CTA. | `index.css` l. 309–318 | Es un segundo acento de color frente a "un acento rosa". Decisión pendiente (ver §10). |
| H12 | El navbar tiene `position: fixed` y `scroll-padding` no está definido. | `index.css` l. 448–458 | Un elemento enfocado puede quedar tapado por el navbar (ver §8, 2.4.11). |
| H13 | `catalog.contact` contiene datos de contacto y `App.jsx` tiene un teléfono escrito a mano. No se reproducen en este documento. | `App.jsx` l. 423 | Dato privado. Solo se referencia. |

## 3. Fuentes consultadas

Todas consultadas el **2026-11-11**. Cumple el mínimo del brief: 2 editoriales fechadas 2025/2026, 2 webs artesanales inspeccionadas y 1 fuente oficial de accesibilidad.

| ID | Tipo | URL | Título | Fecha de publicación | Uso en este documento |
|---|---|---|---|---|---|
| S1 | Oficial (W3C) | https://www.w3.org/TR/WCAG22/ | Web Content Accessibility Guidelines (WCAG) 2.2 | Recomendación 5 oct. 2023; versión vigente con fecha **12 dic. 2024** (según la página) | Base normativa AA y AAA |
| S2 | Oficial (W3C/WAI) | https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html | Understanding SC 2.4.11 Focus Not Obscured (Minimum) | Sin fecha visible en el extracto | Criterio para navbar fijo y modal |
| S3 | Oficial (W3C/WAI) | https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html | Understanding SC 2.3.3 Animation from Interactions (**AAA**) | Sin fecha visible en el extracto | Criterio de movimiento inducido por interacción |
| S4 | Editorial | https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-495/ | Smashing Newsletter #495 (editorial sobre fuentes accesibles y patrones inclusivos) | **18 feb. 2025** | Tipografía legible, accesibilidad no es "aburrido" |
| S5 | Editorial (comercial) | https://line25.com/articles/web-design-trends-2026/ | Web Design Trends 2026: The Definitive Guide | No visible en el extracto (no verificada) | Matriz de tendencias 2026. Es un artículo de un blog con enlaces de afiliado |
| S6 | Editorial (comercial, 2026) | https://www.shopify.com/hk-en/blog/craftsmanship | Craftsmanship Examples: How Successful Brands Do It | **28 ago. 2026** | Artesanía como valor; caso de amigurumi con aviso de variación entre piezas |
| S7 | Web artesanal real | https://www.crochetbygenna.com/ | CrochetByGenna (tienda de patrones de amigurumi) | Contenido vigente en la consulta (lanzamiento de libro reciente en portada) | Inspección de la portada: navegación, cuadrícula de producto, prueba social (reseñas) |
| S8 | Web artesanal real | https://lovelymaker.com/ | Lovelymaker Marketplace | Sin fecha visible | Inspección de la portada: marketplace de patrones y productos hechos a mano |

**Fuentes descartadas o secundarias:**

- `https://www.amigurumi.com/`: catálogo de patrones (más de 10.000). Se inspeccionó, pero es un agregador, no una tienda artesanal. Se usa solo como referencia de densidad de catálogo.
- `https://handmade.com/shop/amigurumi`: la página devolvió "0 items" tras cargar. No se usa como evidencia.
- `https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-489/` (7 ene. 2025): solo para verificar la fecha del boletín. No aporta evidencia de diseño.
- Artículos de trends sin fecha verificable (p. ej. Emin Media, Bubble.io, Elias Studio): se citan solo como contraste; no sostienen ninguna decisión.

**Evidencia insuficiente (declarada):**

- No hay una fuente con datos de **paletas hexadecimales concretas** de marcas artesanales de amigurumi. Los valores de color del brief son una decisión del Orchestrator, no un resultado de investigación.
- No hay un estudio de conversión ni de rendimiento que compare variantes de este sitio. Las recomendaciones de este documento se basan en normas y en lectura de fuentes, no en métricas propias.
- Las fuentes 2026 son en su mayoría artículos de blog con enlaces de afiliado (S5). Se usan como indicio de tendencia, no como consenso.

## 4. Matriz tendencia → evidencia → decisión

Leyenda de **evidencia**: **N** = normativa oficial · **E** = editorial fechada · **C** = inspección de sitio real · **B** = blog comercial sin fecha o con afiliación · **—** = sin evidencia.

| Tendencia / recomendación | Evidencia | Decisión | Razón |
|---|---|---|---|
| Serif editorial de alto contraste en títulos | E (S5, tabla "Serif fonts: comeback"), B | **Adoptar** (ya existe: Cormorant Garamond) | Encaja con identidad existente. No cambiar de familia. |
| Display sobredimensionado a pantalla completa | E (S5, "Peak → Normalizing") | **Descartar** | Contradice el catálogo legible y la densidad 4. Se usa display fluido dentro de la escala existente. |
| Maximalist serifs / tipografía-marca como protagonista | B (S5, Emin Media) | **Descartar** | Orientado a lujo y packaging. No es el tono cálido de Inma. |
| Hand-crafted type / tipografía manuscrita | B (Emin Media, S5) | **Descartar** | Cambiaría la identidad. Sin cambio de marca. |
| Legibilidad: fuentes de alta distinción (p. ej. Atkinson Hyperlegible Next) | E (S4, 18 feb. 2025) | **Informar, no adoptar** | Nunito ya es legible. Cambiar la fuente de cuerpo modifica la identidad. Se deja anotado para Michel. |
| Paletas tierra saturadas (terracota, óxido) | E (S5, "Saturated earth tones"), B | **Descartar** | Son tonos que no existen en la identidad actual. |
| Neutros cálidos: off-white, grises cálidos, rosa polvo | E (S5, "Muted neutrals: warm grey, off-white, dusty rose") | **Adoptar** | Coincide con la paleta de tokens del brief. |
| Neones digitales, gradientes duotono | E (S5) | **Descartar** | Incompatibles con "un acento rosa" y tono artesanal. |
| Dark mode | E (S5 #4) | **Descartar** | Prohibido por el brief (tema claro editorial exclusivo). |
| Glassmorphism, claymorphism, brutalismo | B (S5 #5–#7) | **Descartar** | No encajan con el tono cálido y la densidad 4. |
| Texturas de papel, grano, imperfección asumida | B (S5 "Wabi Sabi", Elias Studio) | **Adoptar muy sutil, opcional** | Solo como fondo de sección vacía, nunca detrás de texto ni de fotos. Evidencia débil. |
| Patrones de ganchillo como fondo decorativo | — (solo identidad existente, H9) | **Evolucionar** | Mantener solo si es muy sutil y está fuera del texto. |
| Asimetría en layouts | C (S7, portada con composición no simétrica), B (S5, Bubble.io "asymmetric layouts") | **Adoptar** | Hero asimétrico en desktop. Una columna en móvil. |
| Bento grid | E (S5 #1) | **Descartar** | Rompe la lectura lineal de un catálogo. |
| Microinteracciones de feedback | E (S5 #8) | **Adoptar** | Solo feedback CSS corto (≤ 200 ms) con `prefers-reduced-motion`. |
| Scroll-driven animation / scroll hijacking | E (S5 #3) | **Descartar** | Prohibido por el brief. |
| Movimiento perpetuo (flotación infinita) | — | **Descartar** | Contradice H5 y la decisión de intensidad 3. Se elimina la animación `floatSoft`. |
| Tarjetas de producto con imagen completa y texto legible | C (S7, S8: cuadrícula con imagen y título) | **Adoptar** | Fotos completas, sin recorte destructivo (H8). |
| Aviso de variación entre piezas hechas a mano | C/E (S6, caso de Genna) | **Informar, no implementar** | Es un cambio de copy. El brief prohíbe cambiar copy. Se propone a Michel. |
| Imágenes generadas por IA | E (S5 #9) | **Descartar** | Prohibido por el brief. Fotografías originales únicamente. |
| Accesibilidad como criterio de diseño (contraste, foco visible, movimiento) | N (S1, S2, S3) | **Adoptar (obligatorio)** | Requisito normativo. |
| Accesibilidad "aburrida" o "solo para casos extremos" | E (S4) | **Adoptar como principio** | Confirma que la accesibilidad no justifica sacrificar identidad. |

## 5. Dirección y tokens

### 5.1 Dirección (decisiones del Orchestrator, no se reinterpretan)

- **Tipo de sitio:** catálogo artesanal para personas que buscan regalos y encargos personales.
- **Tono:** editorial cálido, basado en la identidad existente. No es un cambio de marca.
- **Stack:** React 19 + Vite 7 + CSS nativo. Sin framework nuevo, sin carrito, sin backend, sin router, sin upgrades mayores.
- **Tema:** claro editorial exclusivamente.
- **Variables de diseño:** `DESIGN_VARIANCE = 6`, `MOTION_INTENSITY = 3`, `VISUAL_DENSITY = 4`.
- **Movimiento:** solo feedback CSS con `prefers-reduced-motion`. Sin scroll hijacking, sin vídeos, sin movimiento perpetuo.
- **Fuentes:** Cormorant Garamond (títulos) y Nunito (cuerpo), ambas ya usadas. Se autoalojan con licencias en la implementación.
- **Fotografías:** solo originales. Sin generación, sin stock, sin borrar assets.

### 5.2 Tokens canónicos previstos

Fichero objetivo: `src/styles/tokens.css`, importado desde `src/index.css`.

**Color**

| Token | Valor | Uso |
|---|---|---|
| `--color-bg-primary` | `#FFFBF8` | Fondo general |
| `--color-bg-secondary` | `#FFF5EE` | Secciones alternas |
| `--color-bg-tertiary` | `#FDF0E8` | Degradado suave de hero |
| `--color-bg-card` | `#FFFFFF` | Tarjetas y modal |
| `--color-primary` | `#9D405F` | Acento único (botones, enlaces) |
| `--color-primary-dark` | `#80304C` | Hover y estados activos |
| `--color-primary-light` | `#F5C6D4` | **Solo decorativo**, nunca texto pequeño |
| `--color-text-primary` | `#433A3B` | Texto principal |
| `--color-text-secondary` | `#695D60` | Texto secundario |
| `--color-text-muted` | `#695D60` | Texto auxiliar |
| `--color-text-inverse` | `#FFFBF8` | Texto sobre acento |
| `--color-border` | `#DCC9C7` | **Solo decorativo** |
| `--color-focus` | `#80304C` | Anillo de foco visible |

**Nota de accesibilidad:** los ratios de contraste de estos pares **no están verificados**. Frontend y QA deben medirlos con una herramienta real. Este documento no afirma que ninguno pase AA.

**Tipografía**

- Títulos: Cormorant Garamond, pesos 500 y 600.
- Cuerpo: Nunito, pesos 400, 600 y 700.
- Base: `1rem`. Interlineado de cuerpo: `1.65`. Títulos: `≥ 1.1`.
- Escala existente de `.75rem` a `4.5rem`, con display fluido para el hero.

**Espaciado**

`--space-1` `.25rem` · `--space-2` `.5rem` · `--space-3` `.75rem` · `--space-4` `1rem` · `--space-5` `1.25rem` · `--space-6` `1.5rem` · `--space-8` `2rem` · `--space-10` `2.5rem` · `--space-12` `3rem` · `--space-16` `4rem` · `--space-20` `5rem` · `--space-24` `6rem`.

**Radios**

- `--radius-sm`: `.375rem` (controles pequeños)
- `--radius-md`: `.75rem` (botones y fotos)
- `--radius-lg`: `1.25rem` (modal)
- `full`: solo chips de filtro

**Sombras (cálidas, discretas)**

- `--shadow-sm`: `0 2px 8px rgb(78 41 51 / .08)`
- `--shadow-md`: `0 12px 32px rgb(78 41 51 / .10)`

**Layout**

- Contenedor máximo: `76rem`.
- Gutter: `clamp(1rem, 4vw, 3rem)`.
- Hero asimétrico en desktop; una columna en móvil.
- Catálogo: 1 columna a 360px, 2 a 768px, 3 a 1440px.

### 5.3 Brechas entre el brief y el código actual

Esta tabla es lo que Frontend debe cambiar. No es un cambio de dirección.

| Token o regla | Brief | Código actual (`index.css`) | Estado |
|---|---|---|---|
| `--color-bg-primary/secondary/tertiary`, `--color-bg-card`, `--color-primary-light` | `#FFFBF8`, `#FFF5EE`, `#FDF0E8`, `#FFFFFF`, `#F5C6D4` | Iguales | ✅ Coinciden |
| `--color-primary` | `#9D405F` | `#E8A4B8` (rosa pastel) | ❌ Cambia |
| `--color-primary-dark` | `#80304C` | `#D4869B` | ❌ Cambia |
| `--color-text-primary` | `#433A3B` | `#4A4A4A` | ❌ Cambia |
| `--color-text-secondary` / `--color-text-muted` | `#695D60` / `#695D60` | `#7A7A7A` / `#A0A0A0` | ❌ Cambia (muted antes era más claro) |
| `--color-text-inverse` | `#FFFBF8` | `#FFFFFF` | ❌ Cambia |
| `--color-border` | `#DCC9C7` | `#F0E8E4` | ❌ Cambia |
| `--color-focus` | `#80304C` | No existe | ❌ Añadir |
| Acentos alternos (`--color-secondary`, `--color-accent`, `--color-sage`...) | No aparecen en el brief ("un acento rosa") | Definidos y usados en gradientes | ❌ Eliminar o dejar sin uso |
| `--radius-sm` | `.375rem` | `.5rem` | ❌ Cambia |
| `--radius-lg` | `1.25rem` | `1rem` | ❌ Cambia |
| Sombras | `rgb(78 41 51 / …)` | `rgba(232,164,184,…)` | ❌ Cambia |
| `--container-max` | `76rem` | `1200px` | ❌ Cambia |
| Gutter | `clamp(1rem,4vw,3rem)` | `--container-padding: var(--space-5)` | ❌ Cambia |
| `--space-*` | Lista completa | Lista completa | ✅ Coinciden |
| Line-height de cuerpo | `1.65` | `1.7` | ❌ Cambia |
| Pesos de títulos | 500 / 600 | 600 fijo (h1–h6) | ❌ Ajustar |
| Carga de fuentes | Autoalojadas | `@import` de Google Fonts | ❌ Cambia (H10) |

## 6. Dirección por áreas

### 6.1 Tipografía editorial

- Títulos en Cormorant Garamond, 500 para subtítulos y 600 para títulos principales.
- Cuerpo en Nunito a 1rem, 1.65, longitud de línea de 60–75 caracteres en textos largos.
- Titulares en mayúsculas solo en etiquetas cortas (`.card-category`, `.about-subtitle`).
- No se añade tipografía de display nueva. El hero usa la escala existente con `clamp()`.

### 6.2 Paletas cálidas

- Un acento rosa (`#9D405F`), sus variantes y neutros cálidos.
- Ningún color de acento secundario en gradientes. Los gradientes de fondo se reducen a degradados entre dos tonos neutros del mismo grupo.
- **Conflicto a resolver (H11):** el botón de WhatsApp es verde (`#25D366`) y es un segundo acento. Se propone que Michel decida si el CTA de WhatsApp mantiene su color de marca o pasa al acento rosa. Este documento no decide.

### 6.3 Texturas

- Textura opcional, muy sutil (opacidad ≤ 0.04), solo en fondos de sección sin texto y sin fotos.
- Se retira `.history::before` si queda detrás de texto (H9).
- No hay textura en el hero ni en tarjetas.

### 6.4 Microinteracciones

- Hover y foco: cambio de color o sombra en ≤ 200 ms. Sin desplazamientos mayores de 2 px.
- Tarjetas: eliminar `translateY(-10px)` y `scale(1.1)` (H6). Sustituir por un cambio de sombra y de borde.
- Hero: eliminar `floatSoft` infinito (H5). Las fotos del hero quedan estáticas.
- Todas las transiciones se desactivan con `prefers-reduced-motion: reduce`.

### 6.5 Asimetría

- Hero desktop: columna de texto a la izquierda y composición de fotos a la derecha con desplazamiento vertical (no rotación perpetua).
- Móvil: una columna, texto primero y luego la foto principal.
- Catálogo: cuadrícula regular. La asimetría no se aplica al catálogo para mantener la legibilidad.

### 6.6 Accesibilidad

- Contraste AA para texto normal (4.5:1) y grande (3:1). Pendiente de medición (§5.2).
- Foco visible con `--color-focus` y al menos 2 px de grosor (criterio 2.4.13 de WCAG 2.2 AAA, y de referencia para AA; S1, S2).
- Ningún elemento enfocado puede quedar completamente oculto por el navbar fijo (2.4.11, S2). Usar `scroll-padding-top` de la altura del navbar.
- Movimiento inducido por interacción: deshabilitable con `prefers-reduced-motion` (2.3.3 AAA, S3). Se aplica aunque sea AAA porque el brief lo exige.

## 7. Inventario: conservar y evolucionar

### 7.1 Conservar (no se toca)

- Marca: nombre "Las Cosicas de Inma", logo emoji 🧶, tagline del footer.
- Textos y copy de todas las secciones. Ninguna regla anti-slop justifica cambiarlos.
- Navegación y anchors: `#hero`, `#catalogo`, `#historia`, `#sobre-mi`, `#contacto`.
- Filtros por categoría (`todos` + categorías de `catalog.json`).
- Modal de detalle, con el contenido que muestra hoy.
- Datos de contacto y enlaces (WhatsApp, email, Facebook). No se reproducen en este documento.
- `src/data/catalog.json`: **inmutable byte a byte**.
- Fotografías en `public/images/` y `fotos/`. No se borran.
- Base de Vite `/Amirigumi-Mas_Las_Cosicas_de_Inma/`.

### 7.2 Evolucionar (Frontend)

| Elemento | Cambio | Referencia |
|---|---|---|
| Tokens de color, radio, sombra, contenedor, gutter | Sustituir por los de §5.2 en `src/styles/tokens.css` | §5.3 |
| Navbar: enlaces sin `href` | Convertir en `<a href="#…">` o `<button>` con foco | H1 |
| Botón de menú | Añadir `aria-expanded` y `aria-controls` | H2 |
| Navbar fijo | `scroll-padding-top` igual a la altura del navbar | H12 |
| Modal | `role="dialog"`, `aria-modal`, `aria-labelledby`, cierre con `Escape`, foco al primer elemento, restauración del foco al cerrar, bloqueo de scroll con valor previo guardado | H3, H4 |
| Filtros | `aria-pressed` en cada botón de filtro | — |
| Tarjetas de producto | `object-fit: contain` o `aspect-ratio` del original, sin recorte destructivo | H8 |
| Hover de tarjetas | Quitar `translateY(-10px)` y `scale(1.1)` | H6 |
| Hero | Quitar `floatSoft` infinito; composición asimétrica sin rotaciones perpetuas | H5 |
| Textura de historia | Retirar `.history::before` o moverla fuera del texto | H9 |
| Fuentes | Autoalojar Cormorant Garamond (500, 600) y Nunito (400, 600, 700) con licencias; retirar `@import` | H10 |
| Imágenes | `loading="lazy"` con `width` y `height` para evitar saltos de maquetación | — |

### 7.3 Decisiones pendientes (no decide Frontend)

- Color del CTA de WhatsApp (H11): conservar verde de marca o pasar al acento rosa.
- Eliminación de `src/App.css` si no lo usa nada (no revisado en esta fase).
- Tratamiento de la textura de fondo de la sección de historia.

## 8. Requisitos (SHALL / MUST)

Cada requisito tiene su criterio de verificación en §9.

- **R1.** El sitio **MUST** conservar el catálogo de `src/data/catalog.json` sin modificar un solo byte.
- **R2.** El sitio **MUST** conservar los textos, la marca y los anchors `#hero`, `#catalogo`, `#historia`, `#sobre-mi`, `#contacto`.
- **R3.** Los filtros **MUST** mostrar solo los productos de la categoría seleccionada y **MUST** volver a mostrar el conjunto completo al elegir `todos`.
- **R4.** El modal de detalle **MUST** ser operable solo con teclado: abrir con Enter o Espacio, navegar con Tab dentro del modal, cerrar con `Escape`.
- **R5.** Al cerrar el modal, el foco **MUST** volver al elemento que lo abrió.
- **R6.** Los enlaces de navegación **MUST** ser enfocables con teclado y **MUST** tener un destino (`href`) o un rol de botón.
- **R7.** El menú móvil **MUST** comunicar su estado con `aria-expanded`.
- **R8.** Las imágenes **MUST** cargar bajo la base `/Amirigumi-Mas_Las_Cosicas_de_Inma/` en el build de producción.
- **R9.** Ningún elemento **MUST** provocar desbordamiento horizontal a 360, 768 y 1440 px de ancho.
- **R10.** El contraste de texto **MUST** cumplir AA (4.5:1 texto normal, 3:1 texto grande). No se da por cumplido hasta medirlo.
- **R11.** Todas las transiciones y animaciones **MUST** respetar `prefers-reduced-motion: reduce`.
- **R12.** El sitio **SHALL NOT** usar scroll hijacking, movimiento perpetuo, vídeos ni dark mode.
- **R13.** El sitio **SHALL NOT** usar imágenes generadas por IA ni de stock.
- **R14.** `npm run build` y `npm run lint` **MUST** terminar sin errores.

## 9. Escenarios y criterios de prueba

### 9.1 Escenarios (Given / When / Then)

**Filtros (R3)**

- **Given** el catálogo cargado con la categoría `todos` activa,
  **When** el usuario pulsa el filtro de una categoría,
  **Then** solo se muestran productos de esa categoría, y el botón de filtro activo queda marcado con `aria-pressed="true"`.

- **Given** una categoría filtrada,
  **When** el usuario pulsa `✨ Todos`,
  **Then** se muestran todos los productos de `catalog.json`, sin pérdida ni duplicado.

**Modal (R4, R5)**

- **Given** la tarjeta de un producto enfocada con el teclado,
  **When** el usuario pulsa Enter,
  **Then** el modal se abre y el foco cae dentro del modal, en su primer elemento interactivo.

- **Given** el modal abierto,
  **When** el usuario pulsa Tab repetidamente,
  **Then** el foco nunca sale del modal.

- **Given** el modal abierto,
  **When** el usuario pulsa `Escape`,
  **Then** el modal se cierra y el foco vuelve a la tarjeta que lo abrió.

**Navegación móvil (R6, R7)**

- **Given** un viewport de 360 px,
  **When** el usuario activa el botón de menú con teclado,
  **Then** el botón anuncia `aria-expanded="true"` y los enlaces son enfocables en orden.

- **Given** el menú abierto,
  **When** el usuario selecciona "Catálogo",
  **Then** la página hace scroll a `#catalogo` y el elemento enfocado no queda tapado por el navbar.

**Imágenes bajo base de Pages (R8)**

- **Given** el build de producción (`npm run build`) servido bajo la base de Pages,
  **When** se carga la página principal,
  **Then** todas las imágenes del hero, catálogo y sobre-mí responden 200 y ninguna da error 404.

**Overflow (R9)**

- **Given** la página en viewport de 360, 768 y 1440 px,
  **When** se mide `document.documentElement.scrollWidth`,
  **Then** el valor es menor o igual que `clientWidth` en los tres casos.

**Accesibilidad y movimiento (R10, R11)**

- **Given** un sistema con `prefers-reduced-motion: reduce`,
  **When** el usuario interactúa con tarjetas y botones,
  **Then** no se aplica ninguna transición de desplazamiento ni escala.

- **Given** el sitio en su estado final,
  **When** se mide el contraste de los pares de §5.2,
  **Then** cada par de texto normal cumple ≥ 4.5:1 y cada par de texto grande cumple ≥ 3:1.

### 9.2 Criterios de prueba

| Criterio | Cómo se verifica | Responsable |
|---|---|---|
| Build | `npm run build` sin errores | Frontend |
| Lint | `npm run lint` sin errores | Frontend |
| Dev baseline | `npm run dev` arranca y la página carga | Frontend |
| Capturas | Capturas a 360, 768 y 1440 px de ancho | Frontend y QA |
| Overflow | Medición de `scrollWidth` vs `clientWidth` en los tres anchos | QA |
| Teclado | Recorrido completo con Tab, Enter, Escape | QA |
| Contraste | Medición con herramienta real de los pares de §5.2 | QA |
| Reduced motion | Emulación de `prefers-reduced-motion: reduce` | QA |
| Revisión visual | Aprobación de Michel | Michel (no se da por concedida) |

Este documento **no** ejecuta ninguna de estas pruebas. Son criterios para Frontend y QA.

## 10. Gaps, riesgos y discrepancias

- **Sin evidencia de paletas de marca artesanal.** Los hexadecimales son decisión del Orchestrator (§3, evidencia insuficiente).
- **Sin verificación de contraste.** Ningún par se da por AA hasta medirlo (R10).
- **Color de WhatsApp (H11).** Segundo acento de color. Decisión de Michel.
- **Discrepancia de origen remoto.** La tarjeta indica que `origin` apunta a la cuenta MaciasIT, mientras la URL pública solicitada es `https://michel-macias.github.io/Amirigumi-Mas_Las_Cosicas_de_Inma/` (la del README). **No verificado en esta fase**, y no se ha tocado la configuración de remotos. Caos debe verificarlo.
- **`src/App.css` no revisado.** Frontend debe comprobar si se usa.
- **Copy con aviso de variación.** La fuente S6 muestra un aviso de piezas no idénticas que podría encajar con la identidad, pero es un cambio de copy. Se propone a Michel, no se implementa.
- **Fuentes 2026 comerciales.** S5 y S6 tienen afiliación o fines comerciales. Se usan como indicio, no como verdad.

## 11. Handoff

**Entrada para Frontend.**

1. Aplicar los tokens de §5.2 en `src/styles/tokens.css` e importarlos desde `src/index.css`.
2. Corregir H1–H4, H6–H9 y H12 según §7.2.
3. Autoalojar fuentes (H10) con licencias.
4. Ejecutar `npm run dev`, `npm run build` y `npm run lint`, y capturar 360, 768 y 1440 px.
5. Verificar R1–R14 con los criterios de §9.

**Pendiente:** implementación, pruebas, medición de contraste y aprobación visual de Michel.

**Decisiones:** las del Orchestrator en §5.1 y §5.2. No se han reinterpretado.

---

*Fuentes consultadas el 2026-11-11. Ninguna fecha se ha inventado: las que no aparecen en la fuente se marcan como "no visible".*
