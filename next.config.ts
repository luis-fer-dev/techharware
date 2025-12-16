/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar PWA
  reactStrictMode: true,
  
  // Optimización de imágenes
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      // Agrega aquí los dominios de tus imágenes
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ISR - Incremental Static Regeneration
  experimental: {
    // Habilitar ISR
  }
}

module.exports = nextConfig