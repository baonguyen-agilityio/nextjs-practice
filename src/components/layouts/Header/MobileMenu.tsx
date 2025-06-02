import Link from "next/link";
import { siteConfig } from "@/config/site";
import { logout } from "@/lib/actions";
import { CartButton } from "./CartButton";
import { auth } from "@/lib/auth/auth";
import { MobileMenuToggle } from "./MobileMenuToggle";

export async function MobileMenu() {
  const session = await auth();

  return (
    <MobileMenuToggle>
      <nav className="flex flex-col items-center gap-6 mt-8">
        {siteConfig.navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-xl hover:text-accent transition-colors font-inter"
          >
            {label}
          </Link>
        ))}

        {session ? (
          <>
            <CartButton />
            <form action={logout}>
              <button className="text-xl hover:text-accent transition-colors">Sign Out</button>
            </form>
          </>
        ) : (
          <Link href="/login" className="text-xl hover:text-accent transition-colors">
            Login
          </Link>
        )}
      </nav>
    </MobileMenuToggle>
  );
}
