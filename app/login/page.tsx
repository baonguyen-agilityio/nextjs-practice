import { Metadata } from "next";
import LoginForm from "@/components/login/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen py-12 bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Login to your account</h1>
        <LoginForm />
      </div>
    </main>
  );
}
