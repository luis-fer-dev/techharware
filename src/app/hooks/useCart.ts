// hooks/useCart.ts
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase, type Producto, type CartItem } from '@/lib/supabase'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('techHardwareCart')
      if (saved) {
        try {
          setCart(JSON.parse(saved))
        } catch (e) {
          console.error('Error loading cart:', e)
        }
      }
    }
  }

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    if (typeof window !== 'undefined') {
      localStorage.setItem('techHardwareCart', JSON.stringify(newCart))
    }
  }

  const addToCart = async (producto: Producto) => {
    // ✅ Verificar stock real en Supabase
    const { data: currentProduct } = await supabase
      .from('productos')
      .select('stock')
      .eq('id', producto.id)
      .single()

    if (!currentProduct || currentProduct.stock <= 0) {
      toast.error('Producto agotado')
      return false
    }

    const itemExistente = cart.find(item => item.id === producto.id)
    
    if (itemExistente) {
      if (itemExistente.cantidad >= currentProduct.stock) {
        toast.error(`Solo quedan ${currentProduct.stock} unidades`)
        return false
      }
      const nuevoCart = cart.map(item =>
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
      saveCart(nuevoCart)
    } else {
      saveCart([...cart, { ...producto, cantidad: 1 }])
    }
    
    toast.success('Producto agregado al carrito', {
      icon: '🛒',
    })
    return true
  }

  const removeFromCart = (productoId: number) => {
    saveCart(cart.filter(item => item.id !== productoId))
    toast.success('Producto eliminado')
  }

  const updateQuantity = (productoId: number, cambio: number) => {
    const nuevoCart = cart.map(item => {
      if (item.id === productoId) {
        const nuevaCantidad = item.cantidad + cambio
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null
      }
      return item
    }).filter((item): item is CartItem => item !== null)
    
    saveCart(nuevoCart)
  }

  const clearCart = () => {
    saveCart([])
    toast.success('Carrito vaciado')
  }

  const totalCarrito = cart.reduce((sum, item) => {
    const precioFinal = item.descuento > 0 
      ? item.precio * (1 - item.descuento / 100)
      : item.precio
    return sum + (precioFinal * item.cantidad)
  }, 0)

  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0)

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCarrito,
    totalItems
  }
}