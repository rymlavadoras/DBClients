// =================================
// LAYOUT ROOT
// =================================

import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Base Lavadoras - Sistema de Reparaciones',
  description: 'Sistema de gestión de reparaciones de lavadoras y electrodomésticos',
  keywords: 'lavadoras, reparaciones, gestión, electrodomésticos',
  authors: [{ name: 'Base Lavadoras' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}




