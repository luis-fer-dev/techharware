'use client'

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
  return (
    <div className="filters">
      <select
        value={activeCategory}
        onChange={(e) =>
          onFilterChange({
            categoria: e.target.value,
            precioMin: minPrice,
            precioMax: maxPrice,
            soloEnStock: false,
            conDescuento: false,
            ordenar: 'nombre'
          })
        }
      >
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  )
}
