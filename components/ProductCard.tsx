// components/ProductCard.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Package, Heart } from 'lucide-react'
import { Producto } from '@/lib/supabase'

interface ProductCardProps {
  product: Producto
  onAddToCart: (product: Producto) => void
  onViewDetail: (product: Producto) => void
  onToggleWishlist?: (product: Producto) => void
  isInWishlist?: boolean
  index?: number
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onViewDetail,
  onToggleWishlist,
  isInWishlist = false,
  index = 0
}: ProductCardProps) {
  const { nombre, precio, imagen, descuento, stock } = product
  const precioFinal = precio * (1 - descuento / 100)
  const hasStock = stock > 0

  return (
    <motion.article 
      className="producto-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      layout
    >
      {/* Badge de descuento */}
      {descuento > 0 && (
        <motion.span 
          className="descuento-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          -{descuento}%
        </motion.span>
      )}

      {/* Botón Wishlist */}
      {onToggleWishlist && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist(product)
          }}
          className="wishlist-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart 
            size={20} 
            fill={isInWishlist ? '#ff6600' : 'none'}
            color={isInWishlist ? '#ff6600' : '#666'}
          />
        </motion.button>
      )}

      {/* Imagen optimizada */}
      <motion.button 
        onClick={() => onViewDetail(product)}
        className="producto-imagen-container"
        whileHover={{ scale: 1.05 }}
        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, width: '100%' }}
      >
        <Image 
          src={imagen} 
          alt={nombre}
          width={300}
          height={220}
          className="producto-imagen"
          style={{ objectFit: 'contain' }}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        />
      </motion.button>

      <div className="producto-info">
        <span className="categoria-tag">{product.categoria}</span>
        
        <h4 onClick={() => onViewDetail(product)} style={{ cursor: 'pointer' }}>
          {nombre}
        </h4>

        {/* Indicador de stock animado */}
        <motion.div 
          className="stock-info" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            color: hasStock ? '#10b981' : '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            marginBottom: '8px'
          }}
        >
          <Package size={14} />
          {hasStock ? `Stock: ${stock}` : 'AGOTADO'}
        </motion.div>

        {/* Precios */}
        <div className="precios">
          {descuento > 0 && (
            <motion.span 
              className="precio-original"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ${precio.toFixed(2)}
            </motion.span>
          )}
          <motion.span 
            className="precio-final"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            ${precioFinal.toFixed(2)}
          </motion.span>
        </div>

        {/* Botón agregar al carrito */}
        <motion.button 
          className="btn-add-cart"
          onClick={() => onAddToCart(product)}
          disabled={!hasStock}
          whileHover={{ scale: hasStock ? 1.02 : 1 }}
          whileTap={{ scale: hasStock ? 0.98 : 1 }}
        >
          <ShoppingCart size={18} />
          {hasStock ? 'Agregar' : 'Agotado'}
        </motion.button>
      </div>
    </motion.article>
  )
}