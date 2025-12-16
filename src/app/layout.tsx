import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'TechHardware - Soluciones en Conectividad',
  description: 'Distribuidor autorizado de equipos de red',
  manifest: '/manifest.json',
  themeColor: '#0056b3',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        {/* 💡 AÑADE ESTE COMPONENTE: Es el contenedor de las notificaciones */}
        <Toaster 
          position="bottom-center" // Ubicación de las notificaciones
          reverseOrder={false}
          toastOptions={{
            style: {
              background: 'var(--white)',
              color: 'var(--text-dark)',
            },
            success: {
              iconTheme: {
                primary: 'var(--primary-color)', // Usa tu azul corporativo
                secondary: 'var(--white)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // Rojo para errores
                secondary: 'var(--white)',
              },
            }
          }}
        />
      </body>
    </html>
  )
}