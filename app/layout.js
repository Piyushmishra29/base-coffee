import { Archivo, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { BRAND } from '@/lib/data';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const SITE = 'https://basecoffee.in';
const DESCRIPTION =
  'A neighbourhood coffee shop on Road No. 46, Jubilee Hills, Hyderabad. ' +
  'Espresso pulled slow, matcha whisked by hand, cold brew steeped over ice.';

export const metadata = {
  metadataBase: new URL(SITE),
  title: 'Base Coffee — Jubilee Hills, Hyderabad',
  description: DESCRIPTION,
  keywords: ['Base Coffee', 'Jubilee Hills', 'Hyderabad', 'specialty coffee', 'matcha', 'cold brew'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'Base Coffee',
    title: 'Base Coffee — Jubilee Hills, Hyderabad',
    description: DESCRIPTION,
    locale: 'en_IN',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: BRAND.tagline }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Coffee — Jubilee Hills, Hyderabad',
    description: DESCRIPTION,
    images: ['/og.jpg'],
  },
};

export const viewport = {
  themeColor: '#181311',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
