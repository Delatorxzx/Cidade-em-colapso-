import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow, Oswald } from 'next/font/google'
import './globals.css'

const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', weight: ['400', '500', '600', '700'] })
const barlow = Barlow({ subsets: ['latin'], variable: '--font-barlow', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Cidade em Colapso — Jogo de Tabuleiro',
  description:
    'Compre bairros, construa, cobre aluguel e sobreviva ao Nível de Colapso em um jogo de tabuleiro digital para 1 a 5 jogadores.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#101C2C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${oswald.variable} ${barlow.variable} bg-navy`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
