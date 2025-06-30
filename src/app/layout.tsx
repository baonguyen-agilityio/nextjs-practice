import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { fontCardo, fontInter } from "@/config/fonts";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { CartProvider } from "@/hooks/useCart";
import { getCartByUserId } from "@/services/cart";
import Script from "next/script";
import { getNonce } from "@/utils/csp";

export const metadata: Metadata = {
  title: {
    default: "BookStore - Your Premier Online Book Destination",
    template: "%s | BookStore",
  },
  description:
    "Discover thousands of books at BookStore. Browse fiction, non-fiction, classics, and new releases. Fast shipping, competitive prices, and excellent customer service.",
  keywords: [
    "books",
    "bookstore",
    "online books",
    "buy books",
    "fiction",
    "non-fiction",
    "literature",
    "reading",
  ],
  authors: [{ name: "BookStore Team" }],
  creator: "BookStore",
  publisher: "BookStore",
  metadataBase: new URL("https://nextjs-practice-nine-tan.vercel.app"),
  alternates: {
    canonical: "/",
  },
  other: {
    "color-scheme": "light dark",
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
    "accessibility-features": "ARIA, keyboard-navigation, high-contrast-display",
    "accessibility-hazards": "none",
    "accessibility-summary": "This site is optimized for screen readers and keyboard navigation",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextjs-practice-nine-tan.vercel.app",
    siteName: "BookStore",
    title: "BookStore - Your Premier Online Book Destination",
    description:
      "Discover thousands of books at BookStore. Browse fiction, non-fiction, classics, and new releases. Fast shipping, competitive prices, and excellent customer service.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookStore - Your Premier Online Book Destination",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bookstore",
    creator: "@bookstore",
    title: "BookStore - Your Premier Online Book Destination",
    description:
      "Discover thousands of books at BookStore. Browse fiction, non-fiction, classics, and new releases.",
    images: [
      {
        url: "/twitter-image.jpg",
        alt: "BookStore - Your Premier Online Book Destination",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = getCartByUserId();
  const nonce = await getNonce();

  return (
    <html suppressHydrationWarning lang="en" className="myTheme">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${fontCardo.variable} ${fontInter.variable} font-cardo`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-white px-4 py-2 z-50 focus:z-50"
          tabIndex={0}
        >
          Skip to main content
        </a>

        <CartProvider cartPromise={cart}>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main
                id="main-content"
                className="flex-1 pt-20"
                tabIndex={-1}
                role="main"
                aria-label="Main content"
              >
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </CartProvider>

        {nonce && (
          <Script
            src="https://www.googletagmanager.com/gtag/js"
            strategy="afterInteractive"
            nonce={nonce}
          />
        )}
      </body>
    </html>
  );
}
