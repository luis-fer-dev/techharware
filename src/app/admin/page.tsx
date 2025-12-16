'use client'

import { useState, useEffect } from 'react'
import { supabase, type Producto } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { 
  Loader2, 
  X, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  LogOut,
  BarChart3,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

export default function AdminPanel() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Credenciales de admin (en producción, usa Supabase Auth)
  const ADMIN_USER = 'admin'
  const ADMIN_PASS = 'TechHardware2025'

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoria: 'MikroTik',
    descuento: '0',
    stock: '0',
    stock_minimo: '5'
  })

  useEffect(() => {
    const auth = localStorage.getItem('techHardwareAdminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      loadProductos()
    } else {
      setLoading(false)
    }
  }, [])

  async function loadProductos() {
    setLoading(true)
    const loadingToast = toast.loading('Cargando productos...')
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Error:', error)
      toast.error('Error al cargar productos', { id: loadingToast })
    } else {
      setProductos(data || [])
      toast.success(`${data?.length || 0} productos cargados`, { id: loadingToast })
    }
    setLoading(false)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const loginToast = toast.loading('Verificando credenciales...')
    
    setTimeout(() => {
      if (loginForm.username === ADMIN_USER && loginForm.password === ADMIN_PASS) {
        localStorage.setItem('techHardwareAdminAuth', 'true')
        setIsAuthenticated(true)
        toast.success('¡Bienvenido al panel de administración!', { 
          id: loginToast,
          icon: '👋'
        })
        loadProductos()
      } else {
        toast.error('Credenciales incorrectas', { id: loginToast })
        setLoginForm({ ...loginForm, password: '' })
      }
    }, 800)
  }

  function handleLogout() {
    localStorage.removeItem('techHardwareAdminAuth')
    setIsAuthenticated(false)
    setLoginForm({ username: '', password: '' })
    toast.success('Sesión cerrada correctamente')
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    const addToast = toast.loading('Agregando producto...')
    
    const { data, error } = await supabase
      .from('productos')
      .insert([{
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen: formData.imagen,
        categoria: formData.categoria,
        descuento: parseInt(formData.descuento),
        stock: parseInt(formData.stock),
        stock_minimo: parseInt(formData.stock_minimo)
      }])
      .select()

    if (error) {
      console.error('Error:', error)
      toast.error('Error al agregar producto: ' + error.message, { id: addToast })
    } else {
      toast.success('¡Producto agregado exitosamente!', { 
        id: addToast,
        icon: '✅'
      })
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        categoria: 'MikroTik',
        descuento: '0',
        stock: '0',
        stock_minimo: '5'
      })
      loadProductos()
      setActiveSection('products')
    }
  }

  async function handleDeleteProduct(id: number, nombre: string) {
    const confirmToast = await new Promise<boolean>((resolve) => {
      toast((t) => (
        <div>
          <p style={{ marginBottom: '10px' }}>
            ¿Eliminar <strong>{nombre}</strong>?
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                resolve(true)
              }}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Eliminar
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                resolve(false)
              }}
              style={{
                background: '#e5e7eb',
                color: '#374151',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
      })
    })

    if (!confirmToast) return

    const deleteToast = toast.loading('Eliminando producto...')

    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Error al eliminar: ' + error.message, { id: deleteToast })
    } else {
      toast.success('Producto eliminado', { 
        id: deleteToast,
        icon: '🗑️'
      })
      loadProductos()
    }
  }

  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!editingProduct) return

    const updateToast = toast.loading('Actualizando producto...')

    const { error } = await supabase
      .from('productos')
      .update({
        nombre: editingProduct.nombre,
        descripcion: editingProduct.descripcion,
        precio: editingProduct.precio,
        imagen: editingProduct.imagen,
        categoria: editingProduct.categoria,
        descuento: editingProduct.descuento,
        stock: editingProduct.stock,
        stock_minimo: editingProduct.stock_minimo
      })
      .eq('id', editingProduct.id)

    if (error) {
      toast.error('Error al actualizar: ' + error.message, { id: updateToast })
    } else {
      toast.success('¡Producto actualizado exitosamente!', { 
        id: updateToast,
        icon: '✅'
      })
      setShowEditModal(false)
      setEditingProduct(null)
      loadProductos()
    }
  }

  async function adjustStock(productId: number, change: number, productName: string) {
    const product = productos.find(p => p.id === productId)
    if (!product) return

    const newStock = Math.max(0, product.stock + change)
    const adjustToast = toast.loading('Ajustando stock...')

    const { error } = await supabase
      .from('productos')
      .update({ stock: newStock })
      .eq('id', productId)

    if (error) {
      toast.error('Error al actualizar stock', { id: adjustToast })
    } else {
      toast.success(
        `Stock de ${productName}: ${product.stock} → ${newStock}`, 
        { 
          id: adjustToast,
          icon: change > 0 ? '📈' : '📉'
        }
      )
      loadProductos()
    }
  }

  // Estadísticas del Dashboard
  const stats = {
    total: productos.length,
    inStock: productos.filter(p => p.stock > p.stock_minimo).length,
    lowStock: productos.filter(p => p.stock > 0 && p.stock <= p.stock_minimo).length,
    outOfStock: productos.filter(p => p.stock === 0).length
  }

  const categoryCounts = productos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const filteredProducts = searchTerm
    ? productos.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productos

  // Pantalla de Login
  if (!isAuthenticated) {
    return (
      <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="login-form">
          <h2>🔒 Acceso al Panel de Administración</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuario"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary">Ingresar</button>
            <p style={{ marginTop: '10px', fontSize: '0.8em', color: '#999' }}>
              Usuario: <strong>admin</strong> / Contraseña: <strong>TechHardware2025</strong>
            </p>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <h2>Cargando panel de administración...</h2>
      </div>
    )
  }

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">🔧 TechHardware Admin</div>
        <nav>
          <div 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <BarChart3 size={20} />
            Dashboard
          </div>
          <div 
            className={`nav-item ${activeSection === 'products' ? 'active' : ''}`}
            onClick={() => setActiveSection('products')}
          >
            <Package size={20} />
            Gestionar Productos
          </div>
          <div 
            className={`nav-item ${activeSection === 'add-product' ? 'active' : ''}`}
            onClick={() => setActiveSection('add-product')}
          >
            <Plus size={20} />
            Añadir Producto
          </div>
          <div 
            className={`nav-item ${activeSection === 'stock' ? 'active' : ''}`}
            onClick={() => setActiveSection('stock')}
          >
            <AlertTriangle size={20} />
            Control de Stock
          </div>
        </nav>
        <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="header">
          <div>
            <h1>Panel de Administración</h1>
            <p style={{ color: 'var(--text-light)' }}>Gestiona tu inventario y productos</p>
          </div>
          <button className="btn btn-primary" onClick={() => window.open('/', '_blank')}>
            🌐 Ver Tienda
          </button>
        </div>

        {/* DASHBOARD */}
        {activeSection === 'dashboard' && (
          <section className="section active">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Productos</div>
                <div className="stat-value">{stats.total}</div>
              </div>
              <div className="stat-card success">
                <div className="stat-label">En Stock</div>
                <div className="stat-value">{stats.inStock}</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-label">Stock Bajo</div>
                <div className="stat-value">{stats.lowStock}</div>
              </div>
              <div className="stat-card danger">
                <div className="stat-label">Sin Stock</div>
                <div className="stat-value">{stats.outOfStock}</div>
              </div>
            </div>

            <div className="card">
              <h3>Productos por Categoría</h3>
              <div>
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <div key={cat} style={{ 
                    padding: '10px', 
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <strong>{cat}</strong>
                    <span className="badge badge-success">{count} productos</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
                Alertas de Stock Bajo
              </h3>
              <div>
                {productos.filter(p => p.stock <= p.stock_minimo && p.stock > 0).map(p => (
                  <div key={p.id} className="alert alert-danger">
                    ⚠️ <strong>{p.nombre}</strong> - Stock: {p.stock} (Mínimo: {p.stock_minimo})
                  </div>
                ))}
                {productos.filter(p => p.stock <= p.stock_minimo && p.stock > 0).length === 0 && (
                  <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '20px' }}>
                    ✅ No hay alertas de stock
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* PRODUCTOS */}
        {activeSection === 'products' && (
          <section className="section active">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Lista de Productos</h2>
                <input
                  type="text"
                  className="search-box"
                  placeholder="🔍 Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => {
                      const stockBadge = p.stock === 0 ? 'danger' : (p.stock <= p.stock_minimo ? 'warning' : 'success')
                      const stockText = p.stock === 0 ? 'Sin Stock' : (p.stock <= p.stock_minimo ? 'Stock Bajo' : 'En Stock')

                      return (
                        <tr key={p.id}>
                          <td><img src={p.imagen} className="product-img" alt={p.nombre} /></td>
                          <td><strong>{p.nombre}</strong></td>
                          <td>{p.categoria}</td>
                          <td>${p.precio.toFixed(2)}</td>
                          <td>{p.stock}</td>
                          <td><span className={`badge badge-${stockBadge}`}>{stockText}</span></td>
                          <td>
                            <button 
                              className="btn btn-sm btn-primary" 
                              onClick={() => {
                                setEditingProduct(p)
                                setShowEditModal(true)
                              }}
                              style={{ marginRight: '5px' }}
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => handleDeleteProduct(p.id, p.nombre)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* AÑADIR PRODUCTO */}
        {activeSection === 'add-product' && (
          <section className="section active">
            <div className="card">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={28} />
                Añadir Nuevo Producto
              </h2>
              <form onSubmit={handleAddProduct}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre del Producto *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoría *</label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      required
                    >
                      <option value="MikroTik">MikroTik</option>
                      <option value="Ubiquiti">Ubiquiti</option>
                      <option value="TP-Link">TP-Link</option>
                      <option value="Mimosa">Mimosa</option>
                      <option value="Cables">Cables</option>
                      <option value="Fibra Óptica">Fibra Óptica</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Precio (USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Inicial *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Descuento (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.descuento}
                      onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>URL de Imagen *</label>
                    <input
                      type="url"
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                      placeholder="https://..."
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    required
                  />
                </div>

                <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-success">
                    <Save size={18} />
                    Guardar Producto
                  </button>
                  <button type="reset" className="btn" onClick={() => setFormData({
                    nombre: '',
                    descripcion: '',
                    precio: '',
                    imagen: '',
                    categoria: 'MikroTik',
                    descuento: '0',
                    stock: '0',
                    stock_minimo: '5'
                  })}>
                    Limpiar Formulario
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* CONTROL DE STOCK */}
        {activeSection === 'stock' && (
          <section className="section active">
            <div className="card">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={28} />
                Control de Stock
              </h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock Actual</th>
                      <th>Stock Mínimo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(p => {
                      const stockBadge = p.stock === 0 ? 'danger' : (p.stock <= p.stock_minimo ? 'warning' : 'success')
                      const stockText = p.stock === 0 ? 'Sin Stock' : (p.stock <= p.stock_minimo ? 'Stock Bajo' : 'Disponible')

                      return (
                        <tr key={p.id}>
                          <td><strong>{p.nombre}</strong></td>
                          <td>{p.stock}</td>
                          <td>{p.stock_minimo}</td>
                          <td><span className={`badge badge-${stockBadge}`}>{stockText}</span></td>
                          <td>
                            <button 
                              className="btn btn-sm btn-primary" 
                              onClick={() => adjustStock(p.id, 10, p.nombre)}
                              style={{ marginRight: '5px' }}
                            >
                              <TrendingUp size={14} />
                              +10
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => adjustStock(p.id, -10, p.nombre)}
                            >
                              <TrendingDown size={14} />
                              -10
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MODAL DE EDICIÓN */}
      {showEditModal && editingProduct && (
        <div className="modal" style={{ display: 'block' }} onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowEditModal(false)}>
              <X size={24} />
            </button>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Edit size={24} />
              Editar Producto
            </h2>
            <form onSubmit={handleUpdateProduct}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    value={editingProduct.nombre}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={editingProduct.categoria}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoria: e.target.value })}
                    required
                  >
                    <option value="MikroTik">MikroTik</option>
                    <option value="Ubiquiti">Ubiquiti</option>
                    <option value="TP-Link">TP-Link</option>
                    <option value="Mimosa">Mimosa</option>
                    <option value="Cables">Cables</option>
                    <option value="Fibra Óptica">Fibra Óptica</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Precio (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.precio}
                    onChange={(e) => setEditingProduct({ ...editingProduct, precio: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descuento (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingProduct.descuento}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descuento: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>URL Imagen</label>
                  <input
                    type="url"
                    value={editingProduct.imagen}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imagen: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={editingProduct.descripcion}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-success">
                  <Save size={18} />
                  Guardar Cambios
                </button>
                <button type="button" className="btn" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}