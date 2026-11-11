# Validación: Rediseño 2026 · Las Cosicas de Inma

> **Informe de Verificación Independiente de QA y Caos (Wrecking Ball)**  
> **Perfil auditor:** `caos` (independiente de implementadores `scribe` y `frontend`).  
> **Fecha de ejecución:** 2026-11-11 05:05 CET.  
> **Contrato:** `local-only` (sin merge, sin push a remoto, sin deploy a producción).  
> **Veredicto global:** **APROBADO CON HALLAZGOS (INFO)** — Gate humano listo para revisión visual de Michel.

---

## 1. Estado global

| Dimensión | Cumplimiento | Decisión | Resumen |
|---|:---:|:---:|---|
| **Producto & Catálogo** | 100% | **PASS** | `catalog.json` 100% inmutable (SHA-256 idéntico). 17 productos, 5 categorías, anchors e identidad intactos. |
| **UX & Responsive** | 100% | **PASS** | Layouts verificados a 360px (1 col), 768px (2 col), 1440px (3 col). 0px overflow, sin cortes ni solapes. |
| **Accesibilidad (a11y)** | 100% | **PASS** | Axe sin violaciones (360/1440 y modal). Contraste AA texto min 5.64:1 (exige 4.5:1), foco min 7.69:1 (exige 3:1). Teclado, skip-link, Escape y foco modal verificados. |
| **Arquitectura & Build** | 100% | **PASS** | React 19 + Vite 7 + CSS nativo. `npm ci` (0 err), `npm run lint` (0 err, 0 warn), `npm run build` (0 err, 776ms), 19/19 tests E2E dev y preview. |
| **GitHub Pages** | Local OK / Remoto pendiente | **INFO** | Build con `base: '/Amirigumi-Mas_Las_Cosicas_de_Inma/'` 100% compatible. SHA nuevo **NO** desplegado (contrato local-only respetado). |

---
## 2. Identificación de ramas, commits y worktrees

- **Repo canónico:** `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma`
- **Baseline `main`:** `1b7086701f5c261c77e844990d43cc38d3239ca6`
- **Commit Scribe (docs/fuentes):** `684671d2c676755ec53e20e6f3df6315eeef39ea`
- **Source Commit Final revisado (Frontend):** `a3976509618eed3bc5609e0a8e1af290cf92252d`
- **Worktree QA de auditoría:** `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa`
- **Rama activa QA:** `wt/t_5428d09c`
- **Commit de evidencias QA:** (generado al registrar este informe sobre la rama QA)

---

## 3. Matriz de Verificación Independiente (Criterio → Evidencia → Resultado)

| # | Criterio de Aceptación | Evidencia Verificada | Estado |
|---|---|---|:---:|
| **C1** | **Integridad byte a byte de `catalog.json`** | `sha256sum src/data/catalog.json` = `68e4d6549633838af88cc23b40825ea7169eec87b30c23c19c54e6a78d520d1a`. Coincide exactamente con el hash del baseline `1b70867`. Test `e2e/app.spec.js:17` pasa. | **PASS** |
| **C2** | **Inventario de assets sin borrados** | `git diff --diff-filter=D 1b70867..HEAD` devuelve 0 archivos. Existen 24 imágenes en `public/images/` y 24 en `fotos/adjuntos/`. Assets históricos (`src/App.css`, `public/vite.svg`, `src/assets/react.svg`) preservados sin uso. | **PASS** |
| **C3** | **Documentación única y referencias reales** | `docs/rediseno-2026.md` verificado (487 líneas). 8 fuentes consultadas fechadas 2026-11-11: 2 editoriales (Smashing Newsletter #495 feb 2025, Shopify Craftsmanship ago 2026), 2 webs artesanales reales (CrochetByGenna, Lovelymaker Marketplace), 3 normativas oficiales W3C WCAG 2.2 / WAI, y 1 blog de tendencias. | **PASS** |
| **C4** | **Evidencia 'ANTES' legítima del baseline** | Capturas `antes-360.png` (360x17283), `antes-768.png` (768x11588), `antes-1440.png` (1440x8309) proceden del servidor dev levantado sobre el commit baseline previo a la aplicación de tokens y maquetación nueva (cuyas alturas son 17809, 12249 y 8015 px). | **PASS** |
| **C5** | **Instalación limpia (`npm ci`)** | `npm ci` ejecutado con éxito (exit code 0). 162 paquetes instalados en 2s. | **PASS** |
| **C6** | **Linting estricto con 0 warnings** | `npm run lint` y `npx eslint . --max-warnings=0` ejecutados con éxito (exit code 0, 0 warnings, 0 errores). Configuración ESLint 9 plana. | **PASS** |
| **C7** | **Compilación de producción (`npm run build`)** | `vite build` ejecutado en 776ms (exit code 0). Genera bundle optimizado: JS 213.54 kB (gzip 66.51 kB), CSS 17.62 kB (gzip 3.77 kB), y 5 fuentes WOFF2 locales cargadas con hash de contenido. | **PASS** |
| **C8** | **Suite automatizada E2E (Dev & Preview)** | `npx playwright test` (dev) pasó 19/19 pruebas en 6.7s. `E2E_MODE=preview npx playwright test` (build) pasó 19/19 pruebas en 6.3s. | **PASS** |
| **C9** | **Responsive y Overflow (360, 768, 1440 px)** | Inspección programática y visual en loopback: horizontal overflow = `0px` en los tres viewports. Offscreen = 0 elementos no deseados. Cuadrícula de catálogo adaptativa: 1 columna (360px), 2 columnas (768px), 3 columnas (1440px). | **PASS** |
| **C10** | **Navegación, anclas y menú móvil** | Anclas `#hero`, `#catalogo`, `#historia`, `#sobre-mi`, `#contacto` presentes. Enlaces accesibles vía teclado con `href`. Menú móvil expone `aria-expanded` y `aria-controls`, abriendo y cerrando adecuadamente. | **PASS** |
| **C11** | **Modal de producto accesible** | Los 17 productos abren modal con Enter/clic, título y descripción coinciden con la tarjeta, imagen decodificada con naturalWidth > 0, trampa de foco activa (12 ciclos Tab), cierre con Escape y clic en backdrop, y restauración estricta del foco al botón detonante (`restored: true`). | **PASS** |
| **C12** | **Carga y decodificación de catálogo e imágenes** | Los 17 productos devuelven HTTP 200 en preview bajo la ruta base `/Amirigumi-Mas_Las_Cosicas_de_Inma/images/*`. 17/17 imágenes cargadas, decodificadas y con atributo `alt` descriptivo. 0 errores en consola del navegador y 0 peticiones de red fallidas. | **PASS** |
| **C13** | **Auditoría de Accesibilidad (WCAG 2.2 AA)** | Axe-core ejecutado en 360px, 1440px y modal sin ninguna violación. Contraste de texto medido en 35 pares: todos cumplen ratio AA (mínimo texto 5.64:1 vs exigido 4.5:1; titulares grandes 5.64:1 - 8.35:1 vs exigido 3:1). Foco y bordes interactivos 7.69:1 - 8.59:1 (vs exigido 3:1). Outline visible de 2px sólido en todos los controles enfocables. | **PASS** |
| **C14** | **Movimiento y Reduced-Motion** | Sin animaciones infinitas ni scroll hijacking (`floatSoft` eliminado). Con `prefers-reduced-motion: reduce`, las transiciones se anulan y el scroll pasa a `auto` inmediato. | **PASS** |
| **C15** | **Compatibilidad con GitHub Pages** | Configuración `base: '/Amirigumi-Mas_Las_Cosicas_de_Inma/'` en `vite.config.js`. Favicon y meta tags usan `%BASE_URL%`. Workflow `.github/workflows/deploy.yml` analizado (sin modificar). Sitio público https://michel-macias.github.io/Amirigumi-Mas_Las_Cosicas_de_Inma/ responde HTTP 200 pero sirve SHA previo baseline. SHA nuevo no desplegado. | **PASS (local) / INFO (deploy)** |

---

## 4. Validación de Producto y UX

### 4.1 Fidelidad al Sistema de Diseño y Tokens
- **Paleta implementada en `src/styles/tokens.css` e importada en `src/index.css`:**
  - Fondos: `--color-bg-primary: #FFFBF8`, `--color-bg-secondary: #FFF5EE`, `--color-bg-tertiary: #FDF0E8`, `--color-bg-card: #FFFFFF`.
  - Primarios: `--color-primary: #9D405F`, `--color-primary-dark: #80304C`, `--color-primary-light: #F5C6D4`.
  - Textos: `--color-text-primary: #433A3B`, `--color-text-secondary: #695D60`, `--color-text-inverse: #FFFBF8`.
  - Foco y bordes: `--color-focus: #80304C`, `--color-border: #DCC9C7`.
- **Tipografía autoalojada:** Cormorant Garamond (500, 600) y Nunito (400, 600, 700) cargadas localmente en WOFF2 con sus ficheros `LICENSE-cormorant-garamond.txt` y `LICENSE-nunito.txt` en `src/assets/fonts/`. 0 llamadas externas a `fonts.googleapis.com` o `fonts.gstatic.com`.
- **Espaciado y escala:** Tokens `--space-1` a `--space-24`, radios `--radius-sm` (.375rem), `--radius-md` (.75rem), `--radius-lg` (1.25rem), y sombras `--shadow-sm`, `--shadow-md`.
- **Sensibilidad de diseño:** `DESIGN_VARIANCE = 6`, `MOTION_INTENSITY = 3`, `VISUAL_DENSITY = 4`. Tema claro editorial consistente en todas las vistas.

### 4.2 Hallazgos de QA

#### [INFO-01] Despliegue público no actualizado (contrato local-only respetado)
- **Severidad:** `INFO`
- **Descripción:** Al consultar la URL pública https://michel-macias.github.io/Amirigumi-Mas_Las_Cosicas_de_Inma/, se recibe HTTP 200 pero el HTML sirve los bundles del baseline anterior (`index-CI1g2nLQ.js` e `index-BKnxkKlr.css`).
- **Causa raíz:** De acuerdo con la directriz de Orchestrator, el contrato de la tarea es estrictamente `local-only`, sin permiso de merge a `main` ni push al remoto origin. El workflow de deploy se activa únicamente con push a `main`.
- **Impacto:** Ninguno para la aprobación local. La verificación de Pages en local es 100% conforme; la publicación efectiva requerirá el push por parte de Michel tras su aprobación visual.

#### [INFO-02] Discrepancia de configuración en origin vs URL pública
- **Severidad:** `INFO`
- **Descripción:** El remoto git `origin` apunta a `MaciasIT/Amirigumi-Mas_Las_Cosicas_de_Inma.git`, mientras que el dominio de Pages configurado en metadatos y tarjetas es `michel-macias.github.io`.
- **Mitigación:** Cumpliendo la instrucción expresa de Orchestrator, no se modificó ningún remoto ni URL de autenticación.

#### [INFO-03] Peso de imágenes en catálogo (26 MB en total)
- **Severidad:** `INFO`
- **Descripción:** Los archivos en `public/images/` alcanzan hasta 3.4 MB por fotografía (ej. `IMG_20200118_214312.jpg`).
- **Causa raíz:** Prohibición estricta del brief de recomprimir, alterar o borrar assets existentes.
- **Mitigación implementada por Frontend:** Atributos `loading="lazy"`, `decoding="async"` y `width`/`height` explícitos en todas las etiquetas `<img>` para evitar Cumulative Layout Shift (CLS).

---

## 5. Validación Arquitectónica y Seguridad

- **Stack respetado:** React 19.2.0, Vite 7.2.4, ESLint 9.39.2, CSS nativo puro. No se introdujeron frameworks externos, enrutadores pesados ni dependencias de backend/carrito.
- **Dependencias de testing:** Añadidos `@playwright/test` y `@axe-core/playwright` exclusivamente en `devDependencies` para asegurar la regresión continua.
- **Seguridad en enlaces externos:** Todos los enlaces externos (WhatsApp, Instagram, Facebook) usan `rel="noopener noreferrer"` y `target="_blank"`.
- **Formularios y mensajería:** No se realizaron envíos reales de mensajes ni activación de formularios durante las pruebas automatizadas (aislamiento de entorno garantizado).

---
## 6. Evidencias Generadas

Todas las evidencias residen en rutas absolutas en el worktree `rediseno-2026-qa`:
- **Informe QA (este documento):** `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/qa.md`
- **Documento de Investigación (Scribe):** `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/docs/rediseno-2026.md`
- **Capturas ANTES (Baseline dev):**
  - 360px: `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/antes-360.png`
  - 768px: `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/antes-768.png`
  - 1440px: `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/antes-1440.png`
- **Capturas DESPUÉS (Frontend):**
  - 360px: `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/despues-360.png`
  - 768px: `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/despues-768.png`
  - 1440px: `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/despues-1440.png`
- **Capturas QA Independientes (Caos):**
  - 360px: `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/qa-360.png`
  - 768px: `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/qa-768.png`
  - 1440px: `/home/m1txel/02_Proyectos/Michel_Macias_Repos/Amirigumi-Mas_Las_Cosicas_de_Inma/.worktrees/rediseno-2026-qa/artifacts/rediseno-2026/qa-1440.png`
  - Modales: `artifacts/rediseno-2026/qa/modal-360.png`, `modal-768.png`, `modal-1440.png`
  - Menús móviles: `artifacts/rediseno-2026/qa/menu-360.png`, `menu-768.png`
  - Secciones desglosadas (hero, catalogo, historia, sobre-mi, contacto, footer): `artifacts/rediseno-2026/qa/sec-*.png`
- **Logs y datos brutos de ejecución:**
  - Resultados completos en JSON: `artifacts/rediseno-2026/qa/qa-run.json`
  - Auditoría de contraste y focus: `artifacts/rediseno-2026/qa/qa-aa.json`
  - Logs de suite de pruebas: `artifacts/rediseno-2026/qa/e2e-dev.log`, `e2e-preview.log`, `build.log`, `lint.log`

---

## 7. Decisiones abiertas para Michel

1. **Color del botón CTA WhatsApp:** En el diseño anterior usaba el verde corporativo de WhatsApp (`#25D366`). Para cumplir con la directriz de paleta editorial artesanal de "un acento rosa", el rediseño utiliza el token `--color-primary` (`#9D405F`). Michel debe confirmar si mantiene el estilo editorial integrado o prefiere el verde comercial de WhatsApp.
2. **Métricas en sección 'Sobre mí':** Se conservan los textos originales ("+5 años", "+100 amigurumis creados", "Contra reembolso") para cumplir la inmutabilidad de contenido. Si Michel desea actualizarlos a datos de 2026, requerirá una actualización de copy aprobada.
3. **Publicación y sincronización de remoto:** Confirmar si el despliegue final en GitHub Pages debe realizarse tras aprobar visualmente este paquete.

---

## 8. Handoff y Veredicto

- **Veredicto:** **APROBADO CON HALLAZGOS (INFO)**.
- **Siguiente paso:** Pasar a la revisión humana visual de Michel mediante `kanban_request_review`. No se requiere ninguna corrección de Frontend antes de la inspección visual.
