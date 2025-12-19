// components/ProductDetailModal.tsx
'use client'

import { motion } from 'framer-motion'
import { X, ShoppingCart, Package, Heart } from 'lucide-react'
import Image from 'next/image'
import { Producto } from '@/lib/supabase'
import { useState } from 'react'
import ReviewsSystem from './ReviewsSystem'

interface ProductDetailModalProps {
  product: Producto | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Producto) => void
  onToggleWishlist?: (product: Producto) => void
  isInWishlist?: boolean
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false
}: ProductDetailModalProps) {
  const [imageError, setImageError] = useState(false)

  if (!product || !isOpen) return null

  const precioFinal = product.precio * (1 - product.descuento / 100)
  const hasStock = product.stock > 0

  return (
    <motion.div
      className="modal"
      style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '40px', overflowY: 'auto' }}
      onClick={onClose}
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
        style={{ 
          maxWidth: '1000px',
          maxHeight: 'none',
          position: 'relative',
          transform: 'none',
          top: 'auto',
          left: 'auto',
          margin: '0 auto 40px'
        }}
      >
        {/* Header con botón de cerrar fijo */}
        <div className="modal-header" style={{ position: 'sticky', top: 0, background: 'var(--white)', zIndex: 10 }}>
          <h2>{product.nombre}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="producto-detalle">
          {/* Columna Izquierda - Imagen */}
          <div style={{ position: 'relative' }}>
            {product.descuento > 0 && (
              <div className="descuento-badge" style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 2 }}>
                -{product.descuento}%
              </div>
            )}
            
            {!imageError ? (
              <Image
                src={product.imagen}
                alt={product.nombre}
                width={400}
                height={400}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'contain'
                }}
                onError={() => setImageError(true)}
                unoptimized={product.imagen.includes('unsplash') || product.imagen.includes('via.placeholder')}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f0f0',
                  borderRadius: '8px'
                }}
              >
                <Package size={64} color="#999" />
              </div>
            )}
          </div>

          {/* Columna Derecha - Info */}
          <div>
            {/* Categoría */}
            <span className="categoria-tag" style={{ fontSize: '13px' }}>
              {product.categoria}
            </span>

            {/* Título */}
            <h2 style={{ margin: '10px 0 20px', fontSize: '28px' }}>
              {product.nombre}
            </h2>

            {/* Descripción */}
            <p style={{ 
              color: 'var(--text-light)', 
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              {product.descripcion}
            </p>

            {/* Stock */}
            <div style={{ marginBottom: '20px' }}>
              <div
                className="stock-info"
                style={{
                  color: hasStock ? '#10b981' : '#dc2626',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Package size={18} />
                {hasStock ? (
                  <>✓ En Stock: {product.stock} unidades</>
                ) : (
                  <>✗ AGOTADO</>
                )}
              </div>
            </div>

            {/* Precios */}
            <div style={{ marginBottom: '30px' }}>
              {product.descuento > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <span
                    className="precio-original"
                    style={{ fontSize: '18px', color: '#999' }}
                  >
                    Antes: ${product.precio.toFixed(2)}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span
                  className="precio-final"
                  style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary-color)' }}
                >
                  ${precioFinal.toFixed(2)}
                </span>
                {product.descuento > 0 && (
                  <span style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}>
                    ¡Ahorra ${(product.precio - precioFinal).toFixed(2)}!
                  </span>
                )}
              </div>
            </div>

            {/* Especificaciones */}
            {product.especificaciones && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>
                  Especificaciones
                </h3>
                <div style={{ 
                  background: 'var(--bg-light)', 
                  padding: '15px', 
                  borderRadius: '8px' 
                }}>
                  {typeof product.especificaciones === 'object' ? (
                    Object.entries(product.especificaciones).map(([key, value]) => (
                      <div key={key} className="especificacion">
                        <span>{key}:</span>
                        <strong>{String(value)}</strong>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-light)' }}>
                      {String(product.especificaciones)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button
                className="btn-primary"
                style={{ flex: 1, padding: '15px' }}
                onClick={() => {
                  onAddToCart(product)
                  onClose()
                }}
                disabled={!hasStock}
                whileHover={{ scale: hasStock ? 1.02 : 1 }}
                whileTap={{ scale: hasStock ? 0.98 : 1 }}
              >
                <ShoppingCart size={20} />
                {hasStock ? 'Agregar al Carrito' : 'Producto Agotado'}
              </motion.button>

              {onToggleWishlist && (
                <motion.button
                  onClick={() => onToggleWishlist(product)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '2px solid var(--primary-color)',
                    background: isInWishlist ? 'var(--primary-color)' : 'white',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label={isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart
                    size={24}
                    fill={isInWishlist ? 'white' : 'none'}
                    color={isInWishlist ? 'white' : 'var(--primary-color)'}
                  />
                </motion.button>
              )}
            </div>

            {/* Información Adicional */}
            <div style={{ 
              marginTop: '30px', 
              padding: '15px', 
              background: '#f0f7ff',
              borderRadius: '8px',
              border: '1px solid var(--primary-color)'
            }}>
              <p style={{ 
                fontSize: '14px', 
                color: 'var(--text-dark)',
                margin: 0,
                lineHeight: '1.6'
              }}>
                💡 <strong>Tip:</strong> ¿Necesitas asesoría técnica? Contáctanos vía WhatsApp
                y te ayudaremos a elegir el mejor equipo para tu proyecto.
              </p>
            </div>
          </div>
        </div>

        {/* Sistema de Reseñas */}
        <ReviewsSystem productoId={product.id} />
      </motion.div>
    </motion.div>
  )
}