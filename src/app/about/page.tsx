'use client'

import { motion } from 'framer-motion'
import { Award, Users, Truck, HeadphonesIcon, Shield, Target } from 'lucide-react'
import Footer from '@/src/app/components/footer'

export default function AboutPage() {
  const features = [
    {
      icon: <Award size={40} />,
      title: 'Distribuidores Autorizados',
      description: 'Somos distribuidores oficiales de las marcas líderes en conectividad: MikroTik, Ubiquiti, TP-Link y más.'
    },
    {
      icon: <Users size={40} />,
      title: '10+ Años de Experiencia',
      description: 'Más de una década asesorando a empresas e ISPs en sus proyectos de conectividad.'
    },
    {
      icon: <Truck size={40} />,
      title: 'Envíos a Nivel Nacional',
      description: 'Entregamos en todo el país con los mejores tiempos de respuesta.'
    },
    {
      icon: <HeadphonesIcon size={40} />,
      title: 'Soporte Técnico',
      description: 'Equipo de ingenieros disponible para asesorarte en tu proyecto.'
    },
    {
      icon: <Shield size={40} />,
      title: 'Garantía Oficial',
      description: 'Todos nuestros productos cuentan con garantía del fabricante.'
    },
    {
      icon: <Target size={40} />,
      title: 'Soluciones a Medida',
      description: 'Diseñamos soluciones personalizadas para cada necesidad de conectividad.'
    }
  ]

  const values = [
    { title: 'Calidad', description: 'Solo trabajamos con productos de primera línea' },
    { title: 'Confianza', description: 'Transparencia en cada transacción' },
    { title: 'Innovación', description: 'Siempre a la vanguardia de la tecnología' },
    { title: 'Servicio', description: 'Tu satisfacción es nuestra prioridad' }
  ]

  const timeline = [
    { year: '2013', event: 'Fundación de TechHardware' },
    { year: '2015', event: 'Distribuidor autorizado MikroTik' },
    { year: '2017', event: 'Expansión a Ubiquiti y TP-Link' },
    { year: '2020', event: 'Más de 500 clientes corporativos' },
    { year: '2023', event: 'Lanzamiento de tienda online' }
  ]

  return (
    <>
      {/* Hero Section */}
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
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 800 }}>
            Sobre TechHardware
          </h1>
          <p style={{ fontSize: '20px', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
            Tu socio tecnológico en soluciones de conectividad empresarial. 
            Conectamos negocios con el futuro.
          </p>
        </motion.div>
      </section>

      {/* Nuestra Historia */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 style={{ 
              fontSize: '36px', 
              textAlign: 'center', 
              marginBottom: '40px',
              color: 'var(--text-dark)'
            }}>
              Nuestra Historia
            </h2>
            <p style={{ 
              fontSize: '18px', 
              lineHeight: '1.8', 
              color: 'var(--text-light)',
              marginBottom: '30px'
            }}>
              Fundada en 2013, TechHardware nació con la visión de democratizar el acceso 
              a tecnología de conectividad de clase mundial en Venezuela. Lo que comenzó 
              como un pequeño distribuidor local ha crecido hasta convertirse en uno de 
              los proveedores más confiables de equipos de red en el país.
            </p>
            <p style={{ 
              fontSize: '18px', 
              lineHeight: '1.8', 
              color: 'var(--text-light)'
            }}>
              Hoy, servimos a cientos de ISPs, empresas y profesionales IT, ofreciendo 
              no solo productos de primera calidad, sino también el conocimiento y soporte 
              necesario para implementar soluciones exitosas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '36px', 
            textAlign: 'center', 
            marginBottom: '60px',
            color: 'var(--text-dark)'
          }}>
            Nuestro Recorrido
          </h2>
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            position: 'relative'
          }}>
            {/* Línea vertical */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'var(--primary-color)',
              transform: 'translateX(-50%)'
            }} />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                style={{
                  display: 'flex',
                  justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
                  marginBottom: '40px',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '45%',
                  padding: '20px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow)',
                  textAlign: index % 2 === 0 ? 'right' : 'left'
                }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'var(--accent-color)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    {item.year}
                  </span>
                  <p style={{ color: 'var(--text-dark)', fontSize: '16px' }}>
                    {item.event}
                  </p>
                </div>

                {/* Punto en la línea */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '16px',
                  height: '16px',
                  background: 'var(--accent-color)',
                  borderRadius: '50%',
                  border: '4px solid white',
                  boxShadow: '0 0 0 4px var(--primary-color)'
                }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '36px', 
            textAlign: 'center', 
            marginBottom: '60px',
            color: 'var(--text-dark)'
          }}>
            ¿Por Qué Elegirnos?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                style={{
                  padding: '30px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow)',
                  textAlign: 'center',
                  border: '1px solid #eee',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ 
                  color: 'var(--primary-color)', 
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '20px', 
                  marginBottom: '12px',
                  color: 'var(--text-dark)'
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '36px', 
            textAlign: 'center', 
            marginBottom: '60px',
            color: 'var(--text-dark)'
          }}>
            Nuestros Valores
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  padding: '30px',
                  background: 'white',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '2px solid var(--primary-color)'
                }}
              >
                <h3 style={{ 
                  fontSize: '24px', 
                  marginBottom: '10px',
                  color: 'var(--primary-color)',
                  fontWeight: 'bold'
                }}>
                  {value.title}
                </h3>
                <p style={{ color: 'var(--text-light)' }}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>
              ¿Listo para llevar tu conectividad al siguiente nivel?
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: 'var(--text-light)', 
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px'
            }}>
              Contáctanos hoy y descubre cómo podemos ayudarte a alcanzar tus objetivos.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <motion.a
                href="https://wa.me/584245966903"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ textDecoration: 'none' }}
              >
                Contactar por WhatsApp
              </motion.a>
              <motion.a
                href="/"
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ textDecoration: 'none' }}
              >
                Ver Productos
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}