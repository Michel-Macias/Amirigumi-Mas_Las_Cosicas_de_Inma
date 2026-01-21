import { useState, useEffect } from 'react'
import './index.css'
import catalog from './data/catalog.json'

// ========================================
// UTILITY FUNCTIONS
// ========================================
const generateWhatsAppLink = (product) => {
  const phone = catalog.contact.whatsapp
  const message = encodeURIComponent(
    `¡Hola Inma! 👋\n\nMe interesa el producto:\n*${product.name}*\n\n¿Podrías darme más información sobre disponibilidad y precio?\n\n¡Gracias! 💕`
  )
  return `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
}

const generateGeneralWhatsAppLink = () => {
  const phone = catalog.contact.whatsapp
  const message = encodeURIComponent(
    `¡Hola Inma! 👋\n\nHe visto tu web de amigurumis y me encanta tu trabajo.\n¿Podrías darme más información?\n\n¡Gracias! 💕`
  )
  return `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
}

// ========================================
// NAVBAR COMPONENT
// ========================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMenuOpen(false)
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        <a href="#" className="navbar-logo" onClick={() => scrollToSection('hero')}>
          <span className="navbar-logo-icon">🧶</span>
          Las Cosicas de Inma
        </a>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <a className="navbar-link" onClick={() => scrollToSection('catalogo')}>Catálogo</a>
          <a className="navbar-link" onClick={() => scrollToSection('historia')}>El Arte</a>
          <a className="navbar-link" onClick={() => scrollToSection('sobre-mi')}>Sobre Mí</a>
          <a className="navbar-link" onClick={() => scrollToSection('contacto')}>Contacto</a>
        </div>

        <div className="navbar-cta">
          <a href={generateGeneralWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            💬 WhatsApp
          </a>
        </div>

        <button
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}

// ========================================
// HERO SECTION
// ========================================
function Hero() {
  const featuredProducts = catalog.products.filter(p => p.featured).slice(0, 3)

  return (
    <section id="hero" className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <span className="hero-badge animate-fade-in-up">
            ✨ Hecho a mano con amor
          </span>

          <h1 className="hero-title animate-fade-in-up animate-delay-1">
            Muñecos únicos de{' '}
            <span className="hero-title-accent">crochet</span>
          </h1>

          <p className="hero-description animate-fade-in-up animate-delay-2">
            Cada amigurumi es una pieza única, tejida con dedicación y cariño.
            Muñecas, animales y accesorios perfectos para regalar o decorar
            los espacios más especiales de tu hogar.
          </p>

          <div className="hero-buttons animate-fade-in-up animate-delay-3">
            <a href="#catalogo" className="btn btn-primary btn-lg">
              🎀 Ver Catálogo
            </a>
            <a
              href={generateGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              💬 Contactar
            </a>
          </div>

          <div className="hero-features animate-fade-in-up animate-delay-4">
            <div className="hero-feature">
              <div className="hero-feature-icon">🧶</div>
              <div className="hero-feature-text">
                <strong>100% Artesanal</strong>
                Hecho a mano
              </div>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">📦</div>
              <div className="hero-feature-text">
                <strong>Envío seguro</strong>
                Contra reembolso
              </div>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">💝</div>
              <div className="hero-feature-text">
                <strong>Personalizable</strong>
                A tu gusto
              </div>
            </div>
          </div>
        </div>

        <div className="hero-images">
          <img
            src={featuredProducts[0]?.image || '/images/IMG_20190701_232419.jpg'}
            alt="Muñeca amigurumi destacada"
            className="hero-image-main"
          />
          <img
            src={featuredProducts[1]?.image || '/images/IMG_20200224_214525.jpg'}
            alt="Amigurumi"
            className="hero-image-float hero-image-float-1"
          />
          <img
            src={featuredProducts[2]?.image || '/images/IMG_20191216_190200.jpg'}
            alt="Amigurumi"
            className="hero-image-float hero-image-float-2"
          />
        </div>
      </div>
    </section>
  )
}

// ========================================
// HISTORY SECTION
// ========================================
function History() {
  return (
    <section id="historia" className="history section-lg">
      <div className="container">
        <div className="history-header">
          <span className="history-subtitle">El Arte del Ganchillo</span>
          <h2 className="history-title">La Magia del Amigurumi</h2>
          <p className="history-intro">
            Descubre la tradición y el encanto detrás de cada puntada que da vida a estas adorables creaciones.
          </p>
        </div>

        <div className="history-cards">
          <article className="history-card">
            <div className="history-card-icon">🧵</div>
            <h3 className="history-card-title">¿Qué es el Crochet?</h3>
            <p className="history-card-text">
              El <strong>crochet</strong> (o ganchillo) es una técnica de tejido que utiliza una
              única aguja con gancho para entrelazar hilos y crear tela desde cero.
              A diferencia del bordado, aquí <strong>creamos el tejido punto a punto</strong>.
              <br /><br />
              Sus orígenes se remontan al siglo XVI en Europa, donde se usaba para
              crear encajes para la nobleza. En el siglo XIX se popularizó entre
              las mujeres de la época victoriana.
            </p>
          </article>

          <article className="history-card">
            <div className="history-card-icon">🎎</div>
            <h3 className="history-card-title">El Amigurumi</h3>
            <p className="history-card-text">
              El <strong>amigurumi</strong> es una técnica japonesa que combina las palabras
              <em> "ami"</em> (tejido) y <em>"nuigurumi"</em> (muñeco de peluche).
              <br /><br />
              Consiste en tejer pequeñas figuras en forma de animales, muñecas o
              personajes fantásticos usando crochet, que luego se rellenan para
              darles volumen. Cada pieza es <strong>tejida en espiral</strong>,
              lo que les da esa forma redondeada tan característica.
            </p>
          </article>

          <article className="history-card">
            <div className="history-card-icon">💕</div>
            <h3 className="history-card-title">Hecho con Amor</h3>
            <p className="history-card-text">
              Cada amigurumi de esta colección está tejido a mano con
              <strong> materiales de calidad</strong> y mucha dedicación.
              <br /><br />
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
// PRODUCT CARD
// ========================================
function ProductCard({ product, onViewDetails }) {
  const categoryName = catalog.categories.find(c => c.id === product.category)?.name || product.category

  return (
    <article className="card">
      <div className="card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.featured && <span className="card-badge">⭐ Destacado</span>}
        <div className="card-overlay">
          <button
            className="btn btn-primary"
            onClick={() => onViewDetails(product)}
          >
            Ver Detalles
          </button>
        </div>
      </div>
      <div className="card-body">
        <span className="card-category">{categoryName}</span>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-description">{product.description}</p>
        <div className="card-footer">
          <a
            href={generateWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            💬 Consultar
          </a>
        </div>
      </div>
    </article>
  )
}

// ========================================
// GALLERY / CATALOG
// ========================================
function Gallery({ onViewDetails }) {
  const [activeFilter, setActiveFilter] = useState('todos')

  const filteredProducts = activeFilter === 'todos'
    ? catalog.products
    : catalog.products.filter(p => p.category === activeFilter)

  return (
    <section id="catalogo" className="gallery section-lg">
      <div className="container">
        <div className="gallery-header">
          <span className="gallery-subtitle">Colección</span>
          <h2 className="gallery-title">Nuestro Catálogo</h2>
          <p className="gallery-description">
            Explora nuestra selección de amigurumis hechos a mano.
            Cada pieza es única y está lista para encontrar un hogar especial.
          </p>
        </div>

        <div className="gallery-filters">
          <button
            className={`filter-btn ${activeFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveFilter('todos')}
          >
            ✨ Todos
          </button>
          {catalog.categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ========================================
// ABOUT SECTION
// ========================================
function About() {
  return (
    <section id="sobre-mi" className="about section-lg">
      <div className="container about-grid">
        <div className="about-image">
          <img
            src="/images/IMG_20190701_232419.jpg"
            alt="Creaciones de Inma"
          />
          <div className="about-image-decoration"></div>
        </div>

        <div className="about-content">
          <span className="about-subtitle">Sobre Mí</span>
          <h2 className="about-title">Hola, soy Inma 👋</h2>

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

          <div className="about-highlights">
            <div className="about-highlight">
              <div className="about-highlight-icon">🧶</div>
              <div className="about-highlight-title">+5 años</div>
              <div className="about-highlight-text">Tejiendo sueños</div>
            </div>
            <div className="about-highlight">
              <div className="about-highlight-icon">💝</div>
              <div className="about-highlight-title">+200</div>
              <div className="about-highlight-text">Piezas creadas</div>
            </div>
            <div className="about-highlight">
              <div className="about-highlight-icon">⭐</div>
              <div className="about-highlight-title">100%</div>
              <div className="about-highlight-text">Hecho a mano</div>
            </div>
            <div className="about-highlight">
              <div className="about-highlight-icon">🎁</div>
              <div className="about-highlight-title">Único</div>
              <div className="about-highlight-text">Cada pieza</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========================================
// CONTACT SECTION
// ========================================
function Contact() {
  return (
    <section id="contacto" className="contact section-lg">
      <div className="container contact-content">
        <div className="contact-icon">💌</div>

        <span className="contact-subtitle">¿Te gusta lo que ves?</span>
        <h2 className="contact-title">¡Hablemos!</h2>

        <p className="contact-description">
          ¿Tienes alguna pregunta o quieres encargar algo especial?
          No dudes en contactarme. Estaré encantada de ayudarte a
          encontrar el amigurumi perfecto o crear uno personalizado para ti.
        </p>

        <div className="contact-buttons">
          <a
            href={generateGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
          >
            💬 Escríbeme por WhatsApp
          </a>
          <a
            href={`mailto:${catalog.contact.email}`}
            className="btn btn-outline btn-lg"
          >
            ✉️ Enviar Email
          </a>
        </div>

        <div className="contact-methods">
          <div className="contact-method">
            <div className="contact-method-icon">📱</div>
            <div className="contact-method-label">WhatsApp</div>
            <div className="contact-method-value">+34 608 25 40 21</div>
          </div>
          <div className="contact-method">
            <div className="contact-method-icon">✉️</div>
            <div className="contact-method-label">Email</div>
            <div className="contact-method-value">{catalog.contact.email}</div>
          </div>
          <div className="contact-method">
            <a
              href={catalog.contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="contact-method-icon">📘</div>
              <div className="contact-method-label">Facebook</div>
              <div className="contact-method-value">Las Cosicas de Inma</div>
            </a>
          </div>
        </div>

        <p className="contact-description" style={{ marginTop: '2rem', fontSize: '0.95rem' }}>
          <strong>💳 Formas de pago:</strong> Contra reembolso o transferencia bancaria.<br />
          <strong>📦 Envíos:</strong> A toda España con seguimiento.
        </p>
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
        <div className="footer-logo">🧶 Las Cosicas de Inma</div>
        <p className="footer-tagline">"Tejiendo sueños, creando sonrisas"</p>

        <div className="footer-social">
          <a
            href={catalog.contact.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            📘
          </a>
          <a
            href={generateGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            💬
          </a>
          <a
            href={`mailto:${catalog.contact.email}`}
            aria-label="Email"
          >
            ✉️
          </a>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-text">
            © {currentYear} Las Cosicas de Inma. Hecho con <span className="footer-heart">♥</span> en España.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ========================================
// MODAL
// ========================================
function Modal({ product, onClose }) {
  if (!product) return null

  const categoryName = catalog.categories.find(c => c.id === product.category)?.name || product.category

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="modal-content">
          <span className="modal-category">{categoryName}</span>
          <h3 className="modal-title">{product.name}</h3>
          <p className="modal-description">{product.description}</p>

          <p className="modal-description" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <strong>✨ Características:</strong><br />
            • Tejido 100% a mano<br />
            • Materiales de calidad<br />
            • Relleno hipoalergénico<br />
            • Pieza única
          </p>

          <div className="modal-actions">
            <a
              href={generateWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              💬 Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========================================
// MAIN APP
// ========================================
function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Gallery onViewDetails={setSelectedProduct} />
        <History />
        <About />
        <Contact />
      </main>
      <Footer />

      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}

export default App
