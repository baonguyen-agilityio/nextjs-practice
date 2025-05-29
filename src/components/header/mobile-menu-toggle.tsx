"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export function MobileMenuToggle({ children }: { children: ReactNode }) {
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

            {children}
          </div>
        </div>
      )}
    </div>
  );
}
