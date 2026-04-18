import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rezify.io — AI Design Tool for Print Shops',
  description: 'Rezify.io is a free AI design widget that lives on your print shop\'s website. Customers generate concepts for free. You approve the one you love. Download a 300 DPI print-ready file in one click.',
  keywords: 'print shop, AI design, print ready files, 300 DPI, sign shop, custom printing, Rezify.io',
  openGraph: {
    title: 'Rezify.io — AI Design Tool for Print Shops',
    description: 'Free AI design widget for print shops. Stop fixing bad client files. Customers design on your site. You approve. One click to a 300 DPI print-ready file.',
    url: 'https://REZIFY.99agnts.agency',
    siteName: 'Rezify.io',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=DM+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
