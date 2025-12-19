'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import Footer from '@/src/app/components/footer'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    // Simular envío (aquí puedes integrar un servicio real como Resend, SendGrid, etc.)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // En producción, integra con tu backend o servicio de email
    toast.success('Mensaje enviado correctamente. Te contactaremos pronto!')
    
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    })
    setSending(false)
  }

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Teléfono',
      info: '+58 (424) 596-6903',
      link: 'tel:+584245966903'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      info: 'ventas@techhardware.com',
      link: 'mailto:ventas@techhardware.com'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Ubicación',
      info: 'Caracas, Venezuela',
      link: null
    },
    {
      icon: <Clock size={24} />,
      title: 'Horario',
      info: 'Lun - Vie: 8:00am - 5:00pm',
      link: null
    }
  ]

  const faqs = [
    {
      q: '¿Hacen envíos a nivel nacional?',
      a: 'Sí, realizamos envíos a todo el país. Los costos y tiempos varían según la ubicación.'
    },
    {
      q: '¿Ofrecen soporte técnico?',
      a: 'Sí, contamos con un equipo de ingenieros que pueden asesorarte en tu proyecto.'
    },
    {
      q: '¿Tienen tienda física?',
      a: 'Trabajamos principalmente online, pero puedes coordinar retiro en oficina.'
    },
    {
      q: '¿Cuál es el tiempo de entrega?',
      a: 'En Caracas: 24-48 horas. Interior: 3-5 días hábiles.'
    }
  ]

  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <motion.div
          className="container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 800 }}>
            Contáctanos
          </h1>
          <p style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            ¿Tienes preguntas? Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
          </p>
        </motion.div>
      </section>

      {/* Info Cards */}
      <section style={{ padding: '80px 20px', marginTop: '-40px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--text-dark)' }}>
                  {item.title}
                </h3>
                {item.link ? (
                  <a
                    href={item.link}
                    style={{
                      color: 'var(--primary-color)',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    {item.info}
                  </a>
                ) : (
                  <p style={{ color: 'var(--text-light)' }}>{item.info}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: '32px', marginBottom: '20px', color: 'var(--text-dark)' }}>
                Envíanos un Mensaje
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
                Completa el formulario y nos pondremos en contacto contigo lo antes posible.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Asunto *
                  </label>
                  <input
                    type="text"
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Mensaje *
                  </label>
                  <textarea
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    opacity: sending ? 0.7 : 1
                  }}
                >
                  {sending ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Mensaje
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: '32px', marginBottom: '20px', color: 'var(--text-dark)' }}>
                Preguntas Frecuentes
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
                Encuentra respuestas rápidas a las preguntas más comunes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      background: 'white',
                      padding: '25px',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow)'
                    }}
                  >
                    <h3 style={{
                      fontSize: '18px',
                      color: 'var(--primary-color)',
                      marginBottom: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <CheckCircle size={20} />
                      {faq.q}
                    </h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                      {faq.a}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* CTA WhatsApp */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                style={{
                  marginTop: '30px',
                  background: '#25d366',
                  color: 'white',
                  padding: '30px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>
                  ¿Prefieres hablar directamente?
                </h3>
                <p style={{ marginBottom: '20px', opacity: 0.9 }}>
                  Contáctanos por WhatsApp para atención inmediata
                </p>
                <motion.a
                  href="https://wa.me/584245966903"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-block',
                    background: 'white',
                    color: '#25d366',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}
                >
                  Abrir WhatsApp
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mapa (opcional) */}
      <section style={{ padding: '0' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125780.31424255144!2d-66.95!3d10.48!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a58adcd824807%3A0x93dd2eae0a998483!2sCaracas%2C%20Venezuela!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <Footer />
    </>
  )
}