# 🧶 Amigurumi-Mas & Las Cosicas de Inma

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)

> Una ventana mágica al mundo del ganchillo artesanal. Creaciones únicas hechas con amor, hilo y mucha dedicación.

---

## ✨ Características Principales

- **🎨 Catálogo Dinámico**: Explora una amplia variedad de amigurumis clasificados por categorías (Muñecas, Animales, Bebé, Hogar y Navidad).
- **📱 Experiencia Mobile-First**: Diseño totalmente responsivo y adaptado para una navegación fluida desde cualquier dispositivo.
- **💬 Integración con WhatsApp**: Realiza pedidos o consultas directamente con la artesana a través de enlaces directos personalizados por producto.
- **🖼️ Galería Visual**: Imágenes de alta calidad para cada creación, destacando los detalles del trabajo artesanal.
- **🛡️ Desarrollado con Excelencia**: Código limpio siguiendo estándares modernos y metodología TDD (Test-Driven Development).

---

## 🛠️ Tecnologías Utilizadas

- **Core**: React 19 + JavaScript (ES6+)
- **Build Tool**: Vite 7
- **Estilos**: Vanilla CSS con variables modernas y efectos de Glassmorphism.
- **Despliegue**: GitHub Actions (CI/CD automático a GitHub Pages).

---

## 🚀 Inicio Rápido

Para poner en marcha el proyecto localmente, sigue estos pasos:

### 1. Clonar el repositorio
```bash
git clone https://github.com/Michel-Macias/Amirigumi-Mas_Las_Cosicas_de_Inma.git
cd Amirigumi-Mas_Las_Cosicas_de_Inma
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🧪 Metodología de Desarrollo

Este proyecto se rige por la metodología **TDD (Test-Driven Development)**. Cada funcionalidad crítica es probada antes de su implementación para garantizar la robustez y escalabilidad del sistema.

- **Fase Roja**: Escribir un test que falle.
- **Fase Verde**: Implementar el código mínimo para que el test pase.
- **Refactorización**: Limpiar y optimizar el código manteniendo los tests en verde.

---

## 📦 Despliegue

El despliegue está automatizado mediante **GitHub Actions**. Cada vez que se realiza un *push* a la rama `main`, el proceso de build se activa automáticamente y los archivos resultantes se publican en GitHub Pages.

📍 **Ver en vivo**: [Amigurumi-Mas & Las Cosicas de Inma](https://michel-macias.github.io/Amirigumi-Mas_Las_Cosicas_de_Inma/)

---

## � Estructura del Proyecto

```text
├── .github/workflows/  # Configuración de GitHub Actions (CI/CD)
├── public/             # Activos estáticos (Imágenes, Favicon)
├── src/
│   ├── assets/         # Recursos multimedia
│   ├── data/           # Catálogo de productos (JSON)
│   ├── App.jsx         # Componente principal y lógica de secciones
│   ├── index.css       # Sistema de diseño y estilos globales
│   └── main.jsx        # Punto de entrada de React
├── package.json        # Dependencias y scripts
└── vite.config.js      # Configuración de Vite
```

---

## 🗺️ Roadmap / Próximas Mejoras

- [ ] **🔍 Buscador de Productos**: Implementar una barra de búsqueda en tiempo real.
- [ ] **💳 Checkout Simulado**: Mejorar la experiencia de carrito de compras.
- [ ] **🌙 Modo Oscuro Manual**: Añadir un selector de tema (actualmente automático por sistema).
- [ ] **📈 SEO Avanzado**: Optimizar meta-tags dinámicos para cada producto.
- [ ] **🧪 Suite de Tests**: Ampliar la cobertura de tests unitarios y de integración.

---

## 👤 Autores

Este proyecto ha sido desarrollado por **Michel Macías** en colaboración con **Antigravity** (AI de Google), para dar visibilidad al increíble trabajo artesanal de **Inmaculada Durán Gómara**.

- **Artesana**: Inmaculada Durán Gómara
- **Contacto**: [WhatsApp](https://wa.me/34608254021) | [Email](mailto:inmaculadadurangomara@gmail.com) | [Facebook](https://www.facebook.com/InmaDuranGomara)

---

<div align="center">
  Hecho con ❤️ por Michel Macías & Antigravity
</div>
