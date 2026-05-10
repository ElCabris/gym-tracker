import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GymTracker — Seguimiento de salud y fitness',
  description:
    'Aplicación profesional de seguimiento de salud, entrenamiento, nutrición y sueño',
  keywords: ['gym', 'fitness', 'salud', 'nutrición', 'entrenamiento', 'sueño'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4F46E5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
