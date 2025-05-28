import Link from "next/link";
import { siteConfig } from "@/config/site";
import { logout } from "@/app/lib/actions";
import { CartButton } from "./cart-button";
import { auth } from "@/app/auth";

export async function NavItems() {
  const session = await auth();

  return (
    <nav className="hidden md:flex items-center gap-8 font-inter text-sm">
      {siteConfig.navItems.map(({ href, label }) => (
        <Link key={href} href={href} className="hover:text-accent transition-colors">
          {label}
        </Link>
      ))}

      {session ? (
        <>
          <CartButton />
          <form action={logout}>
            <button className="hover:text-accent transition-colors">
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
        </>
      ) : (
        <Link href="/login" className="hover:text-accent transition-colors">
          Login
        </Link>
      )}
    </nav>
  );
}
