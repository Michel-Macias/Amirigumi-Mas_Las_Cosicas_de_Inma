import { useState, useEffect, useRef, useId } from 'react'
import './index.css'
import catalog from './data/catalog.json'

// ========================================
// UTILIDADES
// ========================================
const BASE = import.meta.env.BASE_URL

// Las rutas del catalogo son relativas ("images/x.jpg"). Se resuelven contra la base de Vite.
const assetUrl = (path) => `${BASE}${path.replace(/^\/+/, '')}`

const whatsappLink = (text) =>
  `https://api.whatsapp.com/send?phone=${catalog.contact.whatsapp}&text=${encodeURIComponent(text)}`

const generateWhatsAppLink = (product) =>
  whatsappLink(
    `¡Hola Inma! 👋\n\nMe interesa el producto:\n*${product.name}*\n\n¿Podrías darme más información sobre disponibilidad y precio?\n\n¡Gracias! 💕`,
  )

const generateGeneralWhatsAppLink = () =>
  whatsappLink(
    `¡Hola Inma! 👋\n\nHe visto tu web de amigurumis y me encanta tu trabajo.\n¿Podrías darme más información?\n\n¡Gracias! 💕`,
  )

const categoryNameOf = (product) =>
  catalog.categories.find((c) => c.id === product.category)?.name || product.category

const productByImage = (image) => catalog.products.find((p) => p.image === image)

// Emoji decorativo: oculto a lectores de pantalla para no duplicar el texto.
const Emoji = ({ children }) => <span aria-hidden="true">{children}</span>

// ========================================
// NAVBAR
// ========================================
const NAV_ITEMS = [
  ['catalogo', 'Catálogo'],
  ['historia', 'El Arte'],
  ['sobre-mi', 'Sobre Mí'],
  ['contacto', 'Contacto'],
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="navbar">
      <nav className="container navbar-content" aria-label="Principal">
        <a href="#hero" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <Emoji>🧶</Emoji>
          <span>Las Cosicas de Inma</span>
        </a>

        <button
          type="button"
          className="navbar-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label="Menú"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span aria-hidden="true" className="navbar-toggle-bar" />
        </button>

        <div id={menuId} className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map(([id, label]) => (
            <a key={id} className="navbar-link" href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a
            href={generateGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary navbar-cta"
          >
            <Emoji>💬</Emoji> WhatsApp
          </a>
        </div>
      </nav>
    </header>
  )
}

// ========================================
// HERO
// ========================================
function Hero() {
  const featured = catalog.products.filter((p) => p.featured).slice(0, 3)
  const [main, second, third] = featured

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="container hero-content">
        <div className="hero-text">
          <p className="hero-badge">
            <Emoji>✨</Emoji> Hecho a mano con amor
          </p>

          <h1 id="hero-title" className="hero-title">
            Muñecos únicos de <span className="hero-title-accent">crochet</span>
          </h1>

          <p className="hero-description">
            Cada amigurumi es una pieza única, tejida con dedicación y cariño.
            Muñecas, animales y accesorios perfectos para regalar o decorar
            los espacios más especiales de tu hogar.
          </p>

          <div className="hero-buttons">
            <a href="#catalogo" className="btn btn-primary btn-lg">
              <Emoji>🎀</Emoji> Ver Catálogo
            </a>
            <a
              href={generateGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              <Emoji>💬</Emoji> Contactar
            </a>
          </div>

          <ul className="hero-features">
            <li className="hero-feature">
              <Emoji>🧶</Emoji>
              <span>
                <strong>100% Artesanal</strong>
                Hecho a mano
              </span>
            </li>
            <li className="hero-feature">
              <Emoji>📦</Emoji>
              <span>
                <strong>Envío seguro</strong>
                Contra reembolso
              </span>
            </li>
            <li className="hero-feature">
              <Emoji>💝</Emoji>
              <span>
                <strong>Personalizable</strong>
                A tu gusto
              </span>
            </li>
          </ul>
        </div>

        <div className="hero-images">
          {main && (
            <img
              src={assetUrl(main.image)}
              alt={main.name}
              width="900"
              height="1200"
              className="hero-image hero-image-main"
              fetchPriority="high"
            />
          )}
          {second && (
            <img
              src={assetUrl(second.image)}
              alt={second.name}
              width="900"
              height="1200"
              className="hero-image hero-image-side hero-image-side-1"
              decoding="async"
            />
          )}
          {third && (
            <img
              src={assetUrl(third.image)}
              alt={third.name}
              width="900"
              height="1200"
              className="hero-image hero-image-side hero-image-side-2"
              decoding="async"
            />
          )}
        </div>
      </div>
    </section>
  )
}

// ========================================
// CATALOGO
// ========================================
function ProductCard({ product, onViewDetails }) {
  return (
    <article className="card">
      <div className="card-image">
        <img
          src={assetUrl(product.image)}
          alt={product.name}
          width="900"
          height="1200"
          loading="lazy"
          decoding="async"
        />
        {product.featured && (
          <span className="card-badge">
            <Emoji>⭐</Emoji> Destacado
          </span>
        )}
      </div>
      <div className="card-body">
        <p className="card-category">{categoryNameOf(product)}</p>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-description">{product.description}</p>
        <div className="card-footer">
          <button type="button" className="btn btn-primary" onClick={(e) => onViewDetails(product, e.currentTarget)}>
            Ver Detalles<span className="sr-only"> de {product.name}</span>
          </button>
          <a
            href={generateWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <Emoji>💬</Emoji> Consultar<span className="sr-only"> sobre {product.name}</span>
          </a>
        </div>
      </div>
    </article>
  )
}

function Gallery({ onViewDetails }) {
  const [activeFilter, setActiveFilter] = useState('todos')

  const filteredProducts =
    activeFilter === 'todos'
      ? catalog.products
      : catalog.products.filter((p) => p.category === activeFilter)

  return (
    <section id="catalogo" className="gallery section" aria-labelledby="catalogo-title">
      <div className="container">
        <div className="gallery-header">
          <p className="section-kicker">Colección</p>
          <h2 id="catalogo-title" className="section-title">Nuestro Catálogo</h2>
          <p className="section-lead">
            Explora nuestra selección de amigurumis hechos a mano.
            Cada pieza es única y está lista para encontrar un hogar especial.
          </p>
        </div>

        <div className="gallery-filters" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            className={`filter-btn ${activeFilter === 'todos' ? 'active' : ''}`}
            aria-pressed={activeFilter === 'todos'}
            onClick={() => setActiveFilter('todos')}
          >
            <Emoji>✨</Emoji> Todos
          </button>
          {catalog.categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
              aria-pressed={activeFilter === category.id}
              onClick={() => setActiveFilter(category.id)}
            >
              <Emoji>{category.icon}</Emoji> {category.name}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ========================================
// HISTORIA
// ========================================
function History() {
  return (
    <section id="historia" className="history section" aria-labelledby="historia-title">
      <div className="container history-layout">
        <div className="history-header">
          <p className="section-kicker">El Arte del Ganchillo</p>
          <h2 id="historia-title" className="section-title">La Magia del Amigurumi</h2>
          <p className="section-lead">
            Descubre la tradición y el encanto detrás de cada puntada que da vida a estas adorables creaciones.
          </p>
        </div>

        <div className="history-entries">
          <article className="history-entry">
            <h3 className="history-entry-title">
              <Emoji>🧵</Emoji> ¿Qué es el Crochet?
            </h3>
            <p>
              El <strong>crochet</strong> (o ganchillo) es una técnica de tejido que utiliza una
              única aguja con gancho para entrelazar hilos y crear tela desde cero.
              A diferencia del bordado, aquí <strong>creamos el tejido punto a punto</strong>.
            </p>
            <p>
              Sus orígenes se remontan al siglo XVI en Europa, donde se usaba para
              crear encajes para la nobleza. En el siglo XIX se popularizó entre
              las mujeres de la época victoriana.
            </p>
          </article>

          <article className="history-entry">
            <h3 className="history-entry-title">
              <Emoji>🎎</Emoji> El Amigurumi
            </h3>
            <p>
              El <strong>amigurumi</strong> es una técnica japonesa que combina las palabras
              <em> "ami"</em> (tejido) y <em>"nuigurumi"</em> (muñeco de peluche).
            </p>
            <p>
              Consiste en tejer pequeñas figuras en forma de animales, muñecas o
              personajes fantásticos usando crochet, que luego se rellenan para
              darles volumen. Cada pieza es <strong>tejida en espiral</strong>,
              lo que les da esa forma redondeada tan característica.
            </p>
          </article>

          <article className="history-entry">
            <h3 className="history-entry-title">
              <Emoji>💕</Emoji> Hecho con Amor
            </h3>
            <p>
              Cada amigurumi de esta colección está tejido a mano con
              <strong> materiales de calidad</strong> y mucha dedicación.
            </p>
            <p>
              No encontrarás dos piezas exactamente iguales: cada una tiene
              su propia personalidad. Son perfectas como <strong>regalo especial</strong>,
              decoración infantil o simplemente para alegrar cualquier rincón
              de tu hogar con un toque artesanal y único.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

// ========================================
// SOBRE MI
// ========================================
const ABOUT_IMAGE = 'images/IMG_20190701_232419.jpg'

function About() {
  const aboutProduct = productByImage(ABOUT_IMAGE)

  return (
    <section id="sobre-mi" className="about section" aria-labelledby="sobre-mi-title">
      <div className="container about-grid">
        <figure className="about-image">
          <img
            src={assetUrl(ABOUT_IMAGE)}
            alt={aboutProduct ? `Creaciones de Inma: ${aboutProduct.name}` : 'Creaciones de Inma'}
            width="900"
            height="1200"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="about-content">
          <p className="section-kicker">Sobre Mí</p>
          <h2 id="sobre-mi-title" className="section-title">
            Hola, soy Inma <Emoji>👋</Emoji>
          </h2>

          <p className="about-text">
            Desde pequeña me han fascinado las labores manuales. El ganchillo
            llegó a mi vida como una forma de relajarme y crear, y se convirtió
            en mi pasión.
          </p>

          <p className="about-text">
            Cada amigurumi que tejo lleva parte de mí: horas de dedicación,
            elección cuidadosa de colores y materiales, y sobre todo, mucho
            cariño. Me encanta ver cómo estas pequeñas creaciones llevan
            sonrisas a grandes y pequeños.
          </p>

          <dl className="about-highlights">
            <div className="about-highlight">
              <dt><Emoji>🧶</Emoji> +5 años</dt>
              <dd>Tejiendo sueños</dd>
            </div>
            <div className="about-highlight">
              <dt><Emoji>💝</Emoji> +100</dt>
              <dd>Piezas creadas</dd>
            </div>
            <div className="about-highlight">
              <dt><Emoji>⭐</Emoji> 100%</dt>
              <dd>Hecho a mano</dd>
            </div>
            <div className="about-highlight">
              <dt><Emoji>🎁</Emoji> Único</dt>
              <dd>Cada pieza</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

// ========================================
// CONTACTO / ENCARGOS
// ========================================
function Contact() {
  return (
    <section id="contacto" className="contact section" aria-labelledby="contacto-title">
      <div className="container contact-layout">
        <div className="contact-main">
          <p className="section-kicker">
            <Emoji>💌</Emoji> ¿Te gusta lo que ves?
          </p>
          <h2 id="contacto-title" className="section-title">¡Hablemos!</h2>

          <p className="section-lead">
            ¿Tienes alguna pregunta o quieres encargar algo especial?
            No dudes en contactarme. Estaré encantada de ayudarte a
            encontrar el amigurumi perfecto o crear uno personalizado para ti.
          </p>

          <div className="contact-buttons">
            <a
              href={generateGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              <Emoji>💬</Emoji> Escríbeme por WhatsApp
            </a>
            <a href={`mailto:${catalog.contact.email}`} className="btn btn-outline btn-lg">
              <Emoji>✉️</Emoji> Enviar Email
            </a>
          </div>

          <p className="contact-notes">
            <strong><Emoji>💳</Emoji> Formas de pago:</strong> Contra reembolso o transferencia bancaria.
            <br />
            <strong><Emoji>📦</Emoji> Envíos:</strong> A toda España con seguimiento.
          </p>
        </div>

        <dl className="contact-methods">
          <div className="contact-method">
            <dt><Emoji>📱</Emoji> WhatsApp</dt>
            <dd>+34 608 25 40 21</dd>
          </div>
          <div className="contact-method">
            <dt><Emoji>✉️</Emoji> Email</dt>
            <dd>
              <a href={`mailto:${catalog.contact.email}`}>{catalog.contact.email}</a>
            </dd>
          </div>
          <div className="contact-method">
            <dt><Emoji>📘</Emoji> Facebook</dt>
            <dd>
              <a href={catalog.contact.facebook} target="_blank" rel="noopener noreferrer">
                Las Cosicas de Inma
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

// ========================================
// FOOTER
// ========================================
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <p className="footer-logo"><Emoji>🧶</Emoji> Las Cosicas de Inma</p>
          <p className="footer-tagline">"Tejiendo sueños, creando sonrisas"</p>
        </div>

        <ul className="footer-social">
          <li>
            <a href={catalog.contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Emoji>📘</Emoji>
            </a>
          </li>
          <li>
            <a href={generateGeneralWhatsAppLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <Emoji>💬</Emoji>
            </a>
          </li>
          <li>
            <a href={`mailto:${catalog.contact.email}`} aria-label="Email">
              <Emoji>✉️</Emoji>
            </a>
          </li>
        </ul>

        <p className="footer-text">
          © {currentYear} Las Cosicas de Inma. Hecho con <span className="footer-heart" aria-hidden="true">♥</span> en España.
        </p>
      </div>
    </footer>
  )
}

// ========================================
// MODAL DE DETALLE
// ========================================
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Modal({ product, onClose, returnFocusTo }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      returnFocusTo?.focus()
    }
  }, [returnFocusTo])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (!dialogRef.current.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" aria-label="Cerrar" ref={closeRef} onClick={onClose}>
          <span aria-hidden="true">✕</span>
        </button>

        <div className="modal-image">
          <img src={assetUrl(product.image)} alt={product.name} width="900" height="1200" decoding="async" />
        </div>

        <div className="modal-content">
          <p className="modal-category">{categoryNameOf(product)}</p>
          <h3 id={titleId} className="modal-title">{product.name}</h3>
          <p className="modal-description">{product.description}</p>

          <div className="modal-features">
            <p><strong><Emoji>✨</Emoji> Características:</strong></p>
            <ul>
              <li>Tejido 100% a mano</li>
              <li>Materiales de calidad</li>
              <li>Relleno hipoalergénico</li>
              <li>Pieza única</li>
            </ul>
          </div>

          <div className="modal-actions">
            <a
              href={generateWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              <Emoji>💬</Emoji> Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========================================
// APP
// ========================================
function App() {
  const [selected, setSelected] = useState(null) // { product, opener }

  const openDetails = (product, opener) => setSelected({ product, opener })
  const closeDetails = () => setSelected(null)

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Navbar />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Gallery onViewDetails={openDetails} />
        <History />
        <About />
        <Contact />
      </main>
      <Footer />

      {selected && (
        <Modal product={selected.product} onClose={closeDetails} returnFocusTo={selected.opener} />
      )}
    </>
  )
}

export default App
