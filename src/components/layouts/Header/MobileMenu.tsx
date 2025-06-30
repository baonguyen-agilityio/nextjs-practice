import Link from "next/link";
import { siteConfig } from "@/config/site";
import { logout } from "@/app/actions";
import { auth } from "@/lib/auth/auth";
import { MobileMenuToggle } from "./MobileMenuToggle";
import CartModal from "@/components/features/cart/CartModal";

export async function MobileMenu() {
  const session = await auth();

  return (
    <MobileMenuToggle>
      <nav className="flex flex-col items-center gap-6" aria-label="Mobile navigation menu">
        {siteConfig.navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-xl hover:text-accent transition-colors font-inter focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded-sm px-2 py-1"
          >
            {label}
          </Link>
        ))}

        {session ? (
          <>
            {session.user.role !== "admin" && (
              <div className="flex items-center">
                <CartModal />
              </div>
            )}
            <form action={logout}>
              <button
                className="text-xl hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded-sm px-2 py-1"
                aria-label="Sign out of your account"
              >
                Sign Out
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="text-xl hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded-sm px-2 py-1"
          >
            Login
          </Link>
        )}
      </nav>
    </MobileMenuToggle>
  );
}
