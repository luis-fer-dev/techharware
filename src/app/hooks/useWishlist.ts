'use client'

import { useEffect, useState } from 'react'
import type { Producto } from '@/lib/supabase'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Producto[]>([])

  // Cargar desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      try {
        setWishlist(JSON.parse(stored))
      } catch {
        setWishlist([])
      }
    }
  }, [])

  // Guardar cambios
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  function toggleWishlist(product: Producto) {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      if (exists) {
        return prev.filter((p) => p.id !== product.id)
      }
      return [...prev, product]
    })
  }

  function isInWishlist(productId: number) {
    return wishlist.some((p) => p.id === productId)
  }

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount: wishlist.length
  }
}
