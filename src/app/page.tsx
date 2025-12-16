'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, type Producto } from '@/lib/supabase'
import { useCart } from '@/src/app/hooks/useCart'
import { useWishlist } from '@/src/app/hooks/useWishlist'
import { useDarkMode } from '@/src/app/hooks/useDarkMode'
import ProductCard from '@/components/ProductCard'
import ProductFilters, { type FilterState } from '@/src/app/components/ProductFilters'
import { ProductGridSkeleton } from '@/src/app/components/SkeletonLoader'
import Footer from '@/src/app/components/footer'
import toast from 'react-hot-toast'
import { 
  ShoppingCart, 
  Search, 
  X, 
  Heart,
  Moon,
  Sun,
  MessageCircle,
  ArrowUp
} from 'lucide-react'

export default function TiendaPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false)
  const [productDetailModalOpen, setProductDetailModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Hooks personalizados
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    totalCarrito, 
    totalItems 
  } = useCart()

  const { 
    wishlist, 
    toggleWishlist, 
    isInWishlist, 
    wishlistCount 
  } = useWishlist()

  const { isDark, toggleDarkMode } = useDarkMode()

  // Estado de filtros
  const [filters, setFilters] = useState<FilterState>({
    categoria: 'Todos',
    precioMin: 0,
    precioMax: 10000,
    soloEnStock: false,
    conDescuento: false,
    ordenar: 'nombre'
  })

  const categorias = ['Todos', 'MikroTik', 'Ubiquiti', 'TP-Link', 'Mimosa', 'Cables', 'Fibra Óptica']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    cargarProductos()
    
    // PWA: Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registrado'))
        .catch((err) => console.error('Error al registrar SW:', err))
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function cargarProductos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error:', error)
      toast.error('Error al cargar productos')
    } else {
      setProductos(data || [])
    }
    setLoading(false)
  }

  // Aplicar filtros
  let productosFiltrados = productos

  // Filtro de categoría
  if (filters.categoria !== 'Todos') {
    productosFiltrados = productosFiltrados.filter(p => p.categoria === filters.categoria)
  }

  // Filtro de búsqueda
  if (searchTerm.length >= 2) {
    productosFiltrados = productosFiltrados.filter(p =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Filtro de precio
  productosFiltrados = productosFiltrados.filter(p => {
    const precioFinal = p.precio * (1 - p.descuento / 100)
    return precioFinal >= filters.precioMin && precioFinal <= filters.precioMax
  })

  // Filtro de stock
  if (filters.soloEnStock) {
    productosFiltrados = productosFiltrados.filter(p => p.stock > 0)
  }

  // Filtro de descuento
  if (filters.conDescuento) {
    productosFiltrados = productosFiltrados.filter(p => p.descuento > 0)
  }

  // Ordenamiento
  productosFiltrados = [...productosFiltrados].sort((a, b) => {
    switch (filters.ordenar) {
      case 'precio-asc':
        return (a.precio * (1 - a.descuento / 100)) - (b.precio * (1 - b.descuento / 100))
      case 'precio-desc':
        return (b.precio * (1 - b.descuento / 100)) - (a.precio * (1 - a.descuento / 100))
      case 'descuento':
        return b.descuento - a.descuento
      default:
        return a.nombre.localeCompare(b.nombre)
    }
  })

  async function checkout() {
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    const stockValidation = await Promise.all(
      cart.map(async (item) => {
        const { data } = await supabase
          .from('productos')
          .select('stock, nombre')
          .eq('id', item.id)
          .single()
        
        return {
          ...item,
          stockActual: data?.stock || 0,
          nombre: data?.nombre || item.nombre
        }
      })
    )

    const sinStock = stockValidation.filter(item => item.stockActual < item.cantidad)
    
    if (sinStock.length > 0) {
      toast.error(
        `Stock insuficiente: ${sinStock.map(i => i.nombre).join(', ')}`,
        { duration: 5000 }
      )
      return
    }

    let mensaje = "Hola TechHardware, me gustaría ordenar:%0A%0A"
    
    cart.forEach(item => {
      const precio = item.descuento > 0 
        ? item.precio * (1 - item.descuento / 100)
        : item.precio
      const subtotal = precio * item.cantidad
      mensaje += `▪️ ${item.cantidad}x ${item.nombre} - $${subtotal.toFixed(2)}%0A`
    })

    mensaje += `%0A*TOTAL: $${totalCarrito.toFixed(2)}*`
    
    const phone = "584245966903"
    window.open(`https://wa.me/${phone}?text=${mensaje}`, '_blank')
    
    toast.success('Pedido enviado a WhatsApp', {
      icon: '✅',
      duration: 3000
    })

    setTimeout(() => {
      clearCart()
      setCartModalOpen(false)
    }, 1000)
  }

  function openProductDetail(producto: Producto) {
    setSelectedProduct(producto)
    setProductDetailModalOpen(true)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const minPrice = Math.min(...productos.map(p => p.precio * (1 - p.descuento / 100)))
  const maxPrice = Math.max(...productos.map(p => p.precio * (1 - p.descuento / 100)))

  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="top-bar-content">
          <a href="https://wa.me/584245966903" target="_blank" rel="noopener noreferrer">
            📞 +58 424 5966903 (Ventas)
          </a>
          <span>🕒 Lunes a Viernes: 8:00am - 5:00pm</span>
        </div>
      </div>

      {/* HEADER */}
      <header>
        <div className="container">
          <div className="main-header">
            <div className="header-content">
              <a href="/" className="logo">
                <h1>TechHardware</h1>
                <span>Soluciones en Conectividad</span>
              </a>

              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">
                  <Search size={20} />
                </button>
              </div>

              <div className="header-actions">
                {/* Dark Mode Toggle */}
                <motion.button
                  onClick={toggleDarkMode}
                  className="icon-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Cambiar tema"
                >
                  {isDark ? <Sun size={24} /> : <Moon size={24} />}
                </motion.button>

                {/* Wishlist */}
                <motion.button 
                  className="icon-btn" 
                  onClick={() => setWishlistModalOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Favoritos (${wishlistCount})`}
                >
                  <Heart size={24} fill={wishlistCount > 0 ? '#ff6600' : 'none'} />
                  {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
                </motion.button>

                {/* Carrito */}
                <motion.button 
                  className="icon-btn" 
                  onClick={() => setCartModalOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Carrito (${totalItems})`}
                >
                  <ShoppingCart size={24} />
                  {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                </motion.button>
              </div>
            </div>
          </div>

          {/* NAVEGACIÓN */}
          <nav>
            <div className="container">
              <ul className="nav-links">
                <li><a href="#productos">Catálogo</a></li>
                {categorias.filter(c => c !== 'Todos').slice(0, 5).map(cat => (
                  <li key={cat}>
                    <a href="#productos" onClick={() => setFilters({...filters, categoria: cat})}>
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </header>

      {/* BANNER SLIDER */}
      <section className="banner-slider">
        <div className="slides-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          <div className="slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600')" }}>
            <div className="container"><div className="slide-content">
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Conectividad Empresarial
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Distribuidor autorizado
              </motion.p>
            </div></div>
          </div>
          <div className="slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=1600')" }}>
            <div className="container"><div className="slide-content">
              <h2>Fibra Óptica</h2>
            </div></div>
          </div>
          <div className="slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562408590-e32931084e23?w=1600')" }}>
            <div className="container"><div className="slide-content">
              <h2>Soporte Técnico</h2>
            </div></div>
          </div>
        </div>
        <div className="slider-nav">
          {[0,1,2].map(i => (
            <motion.button 
              key={i} 
              className={currentSlide === i ? 'slider-dot active' : 'slider-dot'} 
              onClick={() => setCurrentSlide(i)}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="productos"><div className="container">
        <div className="section-header">
          <h3 className="section-title">Nuestros Productos</h3>
          <ProductFilters 
            categorias={categorias}
            onFilterChange={setFilters}
            activeCategory={filters.categoria}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>

        {/* Contador de resultados */}
        <motion.div 
          className="results-count"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: '20px', color: 'var(--text-light)' }}
        >
          Mostrando {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
        </motion.div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : productosFiltrados.length === 0 ? (
          <motion.div 
            style={{ textAlign: 'center', padding: '60px 20px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ fontSize: '18px', color: 'var(--text-light)' }}>
              No se encontraron productos
            </p>
          </motion.div>
        ) : (
          <div className="productos-grid">
            <AnimatePresence mode="popLayout">
              {productosFiltrados.map((producto, index) => (
                <ProductCard
                  key={producto.id}
                  product={producto}
                  onAddToCart={addToCart}
                  onViewDetail={openProductDetail}
                  onToggleWishlist={toggleWishlist}
                  isInWishlist={isInWishlist(producto.id)}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div></section>

      {/* MODAL CARRITO */}
      <AnimatePresence>
        {cartModalOpen && (
          <motion.div 
            className="modal" 
            style={{display:'flex'}} 
            onClick={() => setCartModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>🛒 Tu Carrito ({totalItems} items)</h3>
                <button className="close-btn" onClick={() => setCartModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="cart-items">
                {cart.length === 0 ? (
                  <div style={{textAlign:'center',padding:'40px'}}>
                    <ShoppingCart size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                    <p style={{ fontSize: '16px', color: 'var(--text-light)' }}>
                      Tu carrito está vacío
                    </p>
                  </div>
                ) : (
                  <>
                    <AnimatePresence>
                      {cart.map(item => {
                        const precioFinal = item.precio * (1 - item.descuento / 100)
                        return (
                          <motion.div 
                            key={item.id} 
                            className="cart-item"
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                          >
                            <img src={item.imagen} alt={item.nombre} style={{width:'60px', borderRadius: '4px'}} />
                            <div style={{flex:1, marginLeft: '15px'}}>
                              <h4 style={{ marginBottom: '5px' }}>{item.nombre}</h4>
                              <p style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                ${precioFinal.toFixed(2)} x {item.cantidad} = ${(precioFinal * item.cantidad).toFixed(2)}
                              </p>
                            </div>
                            <div style={{display:'flex', gap:'8px', alignItems: 'center'}}>
                              <button 
                                className="quantity-btn" 
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                -
                              </button>
                              <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                                {item.cantidad}
                              </span>
                              <button 
                                className="quantity-btn" 
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                +
                              </button>
                              <motion.button 
                                onClick={() => removeFromCart(item.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{ 
                                  background: 'none', 
                                  border: 'none', 
                                  cursor: 'pointer',
                                  color: '#dc2626',
                                  marginLeft: '10px'
                                }}
                              >
                                <X size={20} />
                              </motion.button>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                    <div style={{
                      textAlign:'right',
                      margin:'20px 0',
                      padding: '15px',
                      background: 'var(--bg-light)',
                      borderRadius: '8px'
                    }}>
                      <strong style={{ fontSize: '20px' }}>Total: ${totalCarrito.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <motion.button 
                        className="btn-primary" 
                        style={{flex: 1}} 
                        onClick={checkout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle size={18} />
                        Confirmar vía WhatsApp
                      </motion.button>
                      <motion.button 
                        onClick={clearCart}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          padding: '12px 20px',
                          background: 'white',
                          border: '2px solid #dc2626',
                          borderRadius: '6px',
                          color: '#dc2626',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Vaciar
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL WISHLIST */}
      <AnimatePresence>
        {wishlistModalOpen && (
          <motion.div 
            className="modal" 
            style={{display:'flex'}} 
            onClick={() => setWishlistModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>❤️ Mis Favoritos ({wishlistCount})</h3>
                <button className="close-btn" onClick={() => setWishlistModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="cart-items">
                {wishlist.length === 0 ? (
                  <div style={{textAlign:'center',padding:'40px'}}>
                    <Heart size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                    <p style={{ fontSize: '16px', color: 'var(--text-light)' }}>
                      No tienes favoritos guardados
                    </p>
                  </div>
                ) : (
                  <div className="productos-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                    {wishlist.map(producto => (
                      <ProductCard
                        key={producto.id}
                        product={producto}
                        onAddToCart={addToCart}
                        onViewDetail={openProductDetail}
                        onToggleWishlist={toggleWishlist}
                        isInWishlist={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-top-btn"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Float */}
      <motion.a 
        href="https://wa.me/584245966903" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
        </svg>
      </motion.a>
      
      <Footer />
    </>
  )
}