// components/Footer.tsx
import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="main-footer">
      <div className="footer-container">
        
        {/* Sección 1: Logo y Slogan */}
        <div className="footer-section">
          <h3>TechHardware</h3>
          <p>Soluciones en Conectividad de Alto Rendimiento.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="https://wa.me/584245966903" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">📞</a>
          </div>
        </div>

        {/* Sección 2: Enlaces Rápidos */}
        <div className="footer-section">
          <h4>Navegación</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/#productos">Productos</a></li>
            <li><a href="/#servicios">Servicios</a></li>
            <li><a href="/#contacto">Contacto</a></li>
            {/* Si quieres un enlace a admin para ti: */}
            <li><a href="/admin">Panel Admin</a></li> 
          </ul>
        </div>

        {/* Sección 3: Contacto */}
        <div className="footer-section">
          <h4>Contáctanos</h4>
          <p>
            Email: <a href="mailto:ventas@techhardware.com">ventas@techhardware.com</a>
          </p>
          <p>
            Teléfono: <a href="tel:+584245966903">+58 (424) 596-6903</a>
          </p>
        </div>

      </div>

      {/* Derechos de Autor y Créditos */}
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} TechHardware. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}