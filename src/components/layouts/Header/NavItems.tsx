"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { logout } from "@/app/actions";
import CartModal from "@/components/features/cart/CartModal";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

export function NavItems({ session }: { session: Session | null }) {
  const pathname = usePathname() ?? "";

  return (
    <nav className="hidden md:flex items-center gap-8 font-inter text-sm">
      {siteConfig.navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`hover:text-secondary transition-colors ${pathname === href ? "text-secondary" : "text-white"}`}
          aria-label={`Navigate to ${label} page`}
        >
          {label}
        </Link>
      ))}

      {session ? (
        <>
          <form action={logout}>
            <button
              className="hover:text-secondary transition-colors"
              aria-label="Sign out of your account"
            >
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
          {session.user.role !== "admin" && <CartModal />}
        </>
      ) : (
        <Link
          href="/login"
          className="hover:text-secondary transition-colors"
          aria-label="Sign in to your account"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
