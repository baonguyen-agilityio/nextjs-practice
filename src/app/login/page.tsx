import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/login/login-form";
import Logo from "@/components/icons/logo";

export const metadata: Metadata = {
  title: "Login",
};

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
    <main className="flex items-center justify-center min-h-screen py-12 bg-gray-50 font-inter">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Logo />
            <span className="font-inter font-bold text-3xl">Pages</span>
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
