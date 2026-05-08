import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import CartProvider from '@/components/CartProvider'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Célébration Jeunesse — T-shirt Officiel',
  description: 'Précommandez le t-shirt officiel de la Célébration Jeunesse. Disponible en noir et blanc, livraison le 24 mai à l\'église La Compassion Bruxelles.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0F] text-white antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
