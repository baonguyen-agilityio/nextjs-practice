import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/features/login/LoginForm";
import Logo from "@/components/icons/logo";

export const generateMetadata = (): Metadata => ({
  title: "Login",
  description:
    "Sign in to your BookStore account to access your wishlist, order history, and personalized book recommendations.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Login | BookStore",
    description:
      "Sign in to your BookStore account to access your personalized book recommendations and order history.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login | BookStore",
    description: "Sign in to your BookStore account for personalized book recommendations.",
  },
});
function LoginFormFallback() {
  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen py-12 bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Logo />
            <span className="font-inter text-primary font-bold text-3xl">Pages</span>
          </div>
          <h2 className="text-xl text-gray-600">Please log in to continue</h2>
        </div>
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
