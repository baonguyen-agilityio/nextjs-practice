import { Metadata } from "next";
import LoginForm from "@/components/login/login-form";
import Logo from "@/components/icons/logo";

export const metadata: Metadata = {
  title: "Login",
};

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
        <LoginForm />
      </div>
    </main>
  );
}
