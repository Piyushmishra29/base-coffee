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

export const metadata = {
  title: 'Base Coffee — Jubilee Hills, Hyderabad',
  description: BRAND.tagline,
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
