"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CartButton } from "./cart-button";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:opacity-80 transition-opacity"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"></div>
        <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"></div>
        <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-darkblue z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:opacity-80 transition-opacity"
                aria-label="Close menu"
              >
                <div className="w-6 h-0.5 bg-white rotate-45 absolute"></div>
                <div className="w-6 h-0.5 bg-white -rotate-45"></div>
              </button>
            </div>

            <nav className="flex flex-col items-center gap-6 mt-8">
              {siteConfig.navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xl hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-4">
                <CartButton />
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
