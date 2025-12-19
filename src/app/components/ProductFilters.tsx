'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'

export type FilterState = {
  categoria: string
  precioMin: number
  precioMax: number
  soloEnStock: boolean
  conDescuento: boolean
  ordenar: string
}

type Props = {
  categorias: string[]
  activeCategory: string
  minPrice: number
  maxPrice: number
  onFilterChange: (filters: FilterState) => void
}

export default function ProductFilters({
  categorias,
  activeCategory,
  minPrice,
  maxPrice,
  onFilterChange
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categoria: activeCategory,
    precioMin: minPrice,
    precioMax: maxPrice,
    soloEnStock: false,
    conDescuento: false,
    ordenar: 'nombre'
  })

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      categoria: 'Todos',
      precioMin: minPrice,
      precioMax: maxPrice,
      soloEnStock: false,
      conDescuento: false,
      ordenar: 'nombre'
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const activeFiltersCount = 
    (filters.soloEnStock ? 1 : 0) + 
    (filters.conDescuento ? 1 : 0) +
    (filters.precioMin !== minPrice || filters.precioMax !== maxPrice ? 1 : 0)

  return (
    <div className="filter-container">
      {/* Botón de filtros móvil */}
      <motion.button
        className="filter-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SlidersHorizontal size={20} />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="filter-badge">{activeFiltersCount}</span>
        )}
      </motion.button>

      {/* Panel de filtros */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="filter-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel lateral */}
            <motion.div
              className="filter-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="filter-header">
                <h3>Filtros</h3>
                <button onClick={() => setIsOpen(false)} className="close-btn">
                  <X size={24} />
                </button>
              </div>

              {/* Contenido */}
              <div className="filter-content">
                {/* Ordenar por */}
                <div className="filter-section">
                  <label className="filter-label">Ordenar por</label>
                  <select
                    className="filter-select"
                    value={filters.ordenar}
                    onChange={(e) => handleFilterChange('ordenar', e.target.value)}
                  >
                    <option value="nombre">Nombre A-Z</option>
                    <option value="precio-asc">Precio: Menor a Mayor</option>
                    <option value="precio-desc">Precio: Mayor a Menor</option>
                    <option value="descuento">Mayor Descuento</option>
                  </select>
                </div>

                {/* Rango de precio */}
                <div className="filter-section">
                  <label className="filter-label">
                    Rango de Precio: ${filters.precioMin} - ${filters.precioMax}
                  </label>
                  <div className="price-range">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={filters.precioMin}
                      onChange={(e) => handleFilterChange('precioMin', Number(e.target.value))}
                      className="price-input"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Máx"
                      value={filters.precioMax}
                      onChange={(e) => handleFilterChange('precioMax', Number(e.target.value))}
                      className="price-input"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="filter-section">
                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.soloEnStock}
                      onChange={(e) => handleFilterChange('soloEnStock', e.target.checked)}
                    />
                    <span>Solo productos en stock</span>
                  </label>

                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.conDescuento}
                      onChange={(e) => handleFilterChange('conDescuento', e.target.checked)}
                    />
                    <span>Solo productos con descuento</span>
                  </label>
                </div>

                {/* Categorías */}
                <div className="filter-section">
                  <label className="filter-label">Categoría</label>
                  <div className="category-chips">
                    {categorias.map(cat => (
                      <motion.button
                        key={cat}
                        className={`category-chip ${filters.categoria === cat ? 'active' : ''}`}
                        onClick={() => handleFilterChange('categoria', cat)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="filter-footer">
                <button onClick={resetFilters} className="btn-reset">
                  Limpiar Filtros
                </button>
                <button onClick={() => setIsOpen(false)} className="btn-apply">
                  Aplicar Filtros
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}