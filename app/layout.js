import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata = {
  title: 'Premium Astrology Consultation Services | Pankaj Sir & Bhawna Ma\'am',
  description: 'Expert astrology, numerology, and Vastu consultation services from trusted astrologers. Book your personalized consultation today.',
  generator: 'Next.js',
  keywords: 'astrology, numerology, vastu, horoscope, kundli, consultation, premium services',
  authors: [{ name: 'Astrology Consultants' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://astrology-consultation.example.com',
    title: 'Premium Astrology Consultation Services',
    description: 'Expert astrology, numerology, and Vastu consultation services',
    siteName: 'Astrology Consultation',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#B8860B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
