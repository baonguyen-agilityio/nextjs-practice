import Link from "next/link";
import { siteConfig } from "@/config/site";
import { logout } from "@/lib/actions";
import { auth } from "@/lib/auth/auth";
import CartModal from "@/components/features/cart/CartModal";

export async function NavItems() {
  const session = await auth();

  return (
    <nav className="hidden md:flex items-center gap-8 font-inter text-sm">
      {siteConfig.navItems.map(({ href, label }) => (
        <Link key={href} href={href} className="hover:text-secondary transition-colors">
          {label}
        </Link>
      ))}

      {session ? (
        <>
          <form action={logout}>
            <button className="hover:text-secondary transition-colors">
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
          <CartModal />
        </>
      ) : (
        <Link href="/login" className="hover:text-secondary transition-colors">
          Login
        </Link>
      )}
    </nav>
  );
}
