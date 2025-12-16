// components/TiendaClient.tsx
'use client' // 👈 MUY importante para usar useState, useEffect y onClick

import { useState, useEffect } from 'react'
import { supabase, type Producto, type CartItem } from '@/lib/supabase'
import ProductCard from './ProductCard' // Asegúrate de importar ProductCard

// Define los props que recibe del Server Component (page.tsx)
interface TiendaClientProps {
    initialProducts: Producto[]
}

export default function TiendaClient({ initialProducts }: TiendaClientProps) {
  // 💡 USAMOS initialProducts para el estado inicial
  const [productos, setProductos] = useState<Producto[]>(initialProducts)
  
  // Replicamos el resto de tus estados de page.tsx
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false) // Ya cargamos, así que empezamos en false
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  // ... (el resto de tus estados, modales, etc.)
const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)

const openProductDetail = (product: Producto) => {
  setSelectedProduct(product)
}


  // Funciones del carrito
  const cargarCarritoLocalStorage = () => {
    // Lógica que tenías en page.tsx para cargar desde localStorage
    // ...
  }

  const agregarAlCarrito = (producto: Producto) => {
    // Lógica que tenías en page.tsx
    // ...
  }

  // Ahora, el useEffect solo se encarga del carrito y del slider, no de cargar productos
  useEffect(() => {
    cargarCarritoLocalStorage()
    // Lógica del auto-slider de page.tsx
    // ...
  }, [])

  // ... (Tu código de filtrado, renderizado, modales, etc.)

  // Renderizado de la lista de productos
  const productosFiltrados = productos.filter(p => categoriaActiva === 'Todos' || p.categoria === categoriaActiva)

  return (
    <>
      {/* Tu Header / Banner / Filtros */}
      {/* ... */}

      {/* Grid de Productos */}
      <section className="product-grid">
        {productosFiltrados.map(product => (
          <ProductCard
  key={product.id}
  product={product}
  onAddToCart={agregarAlCarrito}
  onViewDetail={openProductDetail}
/>


        ))}
      </section>

      {/* Modales del Carrito y Detalle */}
      {/* ... */}
    </>
  )
}