// components/ReviewsSystem.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, MessageSquare, User, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Review {
  id: number
  producto_id: number
  nombre_usuario: string
  rating: number
  comentario: string
  fecha: string
  helpful: number
  verificado?: boolean
}

interface ReviewsSystemProps {
  productoId: number
}

export default function ReviewsSystem({ productoId }: ReviewsSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    rating: 5,
    comentario: ''
  })

  useEffect(() => {
    loadReviews()
  }, [productoId])

  async function loadReviews() {
    setLoading(true)
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('producto_id', productoId)
      .order('fecha', { ascending: false })

    if (!error && data) {
      setReviews(data)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (formData.comentario.length < 10) {
      toast.error('La reseña debe tener al menos 10 caracteres')
      return
    }

    setSubmitting(true)
    
    const { error } = await supabase.from('reviews').insert([{
      producto_id: productoId,
      nombre_usuario: formData.nombre,
      rating: formData.rating,
      comentario: formData.comentario,
      fecha: new Date().toISOString(),
      helpful: 0,
      verificado: false
    }])

    if (error) {
      toast.error('Error al enviar la reseña')
      console.error(error)
    } else {
      toast.success('¡Gracias por tu reseña! Se publicará pronto.')
      setFormData({ nombre: '', rating: 5, comentario: '' })
      setShowForm(false)
      loadReviews()
    }
    
    setSubmitting(false)
  }

  async function markHelpful(reviewId: number) {
    // Evitar múltiples clics
    const alreadyMarked = localStorage.getItem(`review_helpful_${reviewId}`)
    if (alreadyMarked) {
      toast.error('Ya marcaste esta reseña como útil')
      return
    }

    const review = reviews.find(r => r.id === reviewId)
    if (!review) return

    const { error } = await supabase
      .from('reviews')
      .update({ helpful: review.helpful + 1 })
      .eq('id', reviewId)

    if (!error) {
      localStorage.setItem(`review_helpful_${reviewId}`, 'true')
      loadReviews()
      toast.success('Gracias por tu feedback', { icon: '👍' })
    }
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 
      : 0
  }))

  if (loading) {
    return (
      <div className="reviews-section">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando reseñas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reviews-section">
      {/* Header con promedio */}
      <div className="reviews-header">
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={24}
                  fill={star <= averageRating ? '#fbbf24' : 'none'}
                  color={star <= averageRating ? '#fbbf24' : '#d1d5db'}
                />
              ))}
            </div>
            <p className="total-reviews">
              {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
            </p>
          </div>

          {/* Distribución de estrellas */}
          <div className="rating-bars">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="rating-bar-row">
                <span className="stars-label">{stars}★</span>
                <div className="bar-container">
                  <motion.div
                    className="bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="count-label">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare size={18} />
          {showForm ? 'Cancelar' : 'Escribir Reseña'}
        </motion.button>
      </div>

      {/* Formulario de nueva reseña */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            className="review-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="form-group">
              <label>Tu nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                placeholder="Nombre completo"
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label>Calificación *</label>
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      size={32}
                      fill={star <= formData.rating ? '#fbbf24' : 'none'}
                      color={star <= formData.rating ? '#fbbf24' : '#d1d5db'}
                    />
                  </motion.button>
                ))}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '8px' }}>
                {formData.rating === 5 && '¡Excelente! 🌟'}
                {formData.rating === 4 && 'Muy bueno 👍'}
                {formData.rating === 3 && 'Bueno 👌'}
                {formData.rating === 2 && 'Regular 😐'}
                {formData.rating === 1 && 'Malo 👎'}
              </p>
            </div>

            <div className="form-group">
              <label>Tu opinión * (mínimo 10 caracteres)</label>
              <textarea
                value={formData.comentario}
                onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                required
                placeholder="Cuéntanos tu experiencia con este producto..."
                rows={4}
                minLength={10}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>
                {formData.comentario.length}/500 caracteres
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button 
                type="submit" 
                className="btn-primary"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                {submitting ? 'Enviando...' : 'Publicar Reseña'}
              </motion.button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Lista de reseñas */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <MessageSquare size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-light)' }}>
              Sé el primero en dejar una reseña sobre este producto
            </p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="review-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="avatar">
                    <User size={24} />
                  </div>
                  <div>
                    <h4>{review.nombre_usuario}</h4>
                    <p className="review-date">
                      {new Date(review.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {review.verificado && (
                    <span className="badge-verified">✓ Compra verificada</span>
                  )}
                </div>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={16}
                      fill={star <= review.rating ? '#fbbf24' : 'none'}
                      color={star <= review.rating ? '#fbbf24' : '#d1d5db'}
                    />
                  ))}
                </div>
              </div>

              <p className="review-text">{review.comentario}</p>

              <div className="review-footer">
                <motion.button
                  className="helpful-btn"
                  onClick={() => markHelpful(review.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={localStorage.getItem(`review_helpful_${review.id}`) !== null}
                >
                  <ThumbsUp size={16} />
                  Útil ({review.helpful})
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}