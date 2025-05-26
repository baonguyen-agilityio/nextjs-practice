import Link from "next/link";
import { siteConfig } from "@/config/site";

export function NavItems() {
  return (
    <nav className="hidden md:flex items-center gap-8 font-inter text-sm">
      {siteConfig.navItems.map(({ href, label }) => (
        <Link key={href} href={href} className="hover:text-accent transition-colors">
          {label}
        </Link>
      ))}
    </nav>
  );
}
