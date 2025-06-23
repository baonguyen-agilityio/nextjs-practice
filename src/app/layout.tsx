import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { fontCardo, fontInter } from "@/config/fonts";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { CartProvider } from "@/hooks/useCart";
import { getCartByUserId } from "@/services/cart";

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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = getCartByUserId();
  return (
    <html suppressHydrationWarning lang="en" className="myTheme">
      <body className={`${fontCardo.variable} ${fontInter.variable} font-cardo`}>
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
      </body>
    </html>
  );
}
