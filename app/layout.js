import { Analytics } from '@vercel/analytics/next'
import { AppointmentModalProvider } from '@/components/AppointmentModal'
import FloatingSocial from '@/components/FloatingSocial'
import { site } from '@/data/site'
import './globals.css'

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | TEDx Speaker & Vedic Astrologer`,
    template: `%s | ${site.name}`,
  },
  description:
    'Bhawna Upadhyay — TEDx Speaker, Vedic astrologer and spiritual guide. Personalised consultations, kundli readings, Vastu, puja and anushthan, and authentic remedies.',
  generator: 'Next.js',
  keywords: [
    'Bhawna Upadhyay',
    'vedic astrologer',
    'TEDx speaker astrologer',
    'kundli reading',
    'astrology consultation',
    'vastu consultation',
    'puja and anushthan',
    'kundali matching',
    'numerology',
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: site.url,
    title: `${site.name} | TEDx Speaker & Vedic Astrologer`,
    description:
      'Personalised Vedic astrology consultations, kundli readings, Vastu guidance and authentic remedies from Bhawna Upadhyay.',
    siteName: site.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | TEDx Speaker & Vedic Astrologer`,
    description:
      'Personalised Vedic astrology consultations, kundli readings, Vastu guidance and authentic remedies.',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AppointmentModalProvider>{children}</AppointmentModalProvider>
        <FloatingSocial />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
