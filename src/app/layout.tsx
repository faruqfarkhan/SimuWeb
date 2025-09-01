import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GoogleTagManager } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: 'SimuWeb',
  description: 'A simulated e-commerce and marketing platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <GoogleTagManager gtmId="GTM-WGFPF26Z" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        {/* Google Tag Manager - Noscript Fallback */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${"GTM-WGFPF26Z"}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <UserProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </WishlistProvider>
        </UserProvider>
      </body>
    </html>
  );
}
